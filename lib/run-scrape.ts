/**
 * 抓取流水线：复用同一套逻辑给本地脚本和线上定时任务。
 * 本文件只负责产出结构化数据，不直接写磁盘或写线上快照。
 */
import { allScrapers, scraperById } from './scrapers';
import { dedupe, applyDeadList } from './dedupe';
import { buildMeta } from './data';
import { CONFIG } from './config';
import { nowIso, isRecent } from './format';
import type { DataFile, SourceMeta, VpnEntry } from './types';

export interface ScrapeLogger {
  log: (msg: string) => void;
}

export interface ScrapeJobOptions {
  sourceId?: string;
  previousArchive?: VpnEntry[];
  logger?: ScrapeLogger;
}

export interface ScrapeJobResult {
  data: DataFile;
  archive: VpnEntry[];
  logs: string[];
}

function createLogger(external?: ScrapeLogger): { logger: ScrapeLogger; logs: string[] } {
  const logs: string[] = [];
  return {
    logs,
    logger: {
      log(msg: string) {
        logs.push(msg);
        external?.log(msg);
      },
    },
  };
}

export async function runScrapeJob(options: ScrapeJobOptions = {}): Promise<ScrapeJobResult> {
  const now = nowIso();
  const { logger, logs } = createLogger(options.logger);
  const ctx = {
    now,
    log: (msg: string) => logger.log(`[${new Date().toLocaleTimeString('zh-CN')}] ${msg}`),
  };

  const scrapers = options.sourceId
    ? ([scraperById(options.sourceId)].filter(Boolean) as typeof allScrapers)
    : allScrapers;

  ctx.log(`开始抓取 ${scrapers.length} 个源...`);

  const results = await Promise.allSettled(
    scrapers.map(async (s) => {
      const r = await s.run(ctx);
      return { id: s.id, ...r };
    })
  );

  const allEntries: VpnEntry[] = [];
  const sourceMetas: SourceMeta[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      allEntries.push(...r.value.entries);
      sourceMetas.push(r.value.meta);
      ctx.log(`✓ ${r.value.meta.displayName}: ${r.value.meta.itemsScraped} 条 (${r.value.meta.lastSuccess ? '成功' : '失败'})`);
    } else {
      const id = (r as PromiseRejectedResult).reason?.id ?? 'unknown';
      ctx.log(`✗ ${id} 抓取器异常: ${(r as PromiseRejectedResult).reason}`);
    }
  }

  ctx.log(`合计原始 ${allEntries.length} 条，开始去重...`);
  const deduped = dedupe(allEntries);
  ctx.log(`去重后 ${deduped.length} 条`);

  const withActive = applyDeadList(deduped);
  const kept: VpnEntry[] = [];
  const expired: VpnEntry[] = [];

  for (const e of withActive) {
    if (e.type === 'node' || e.type === 'dead' || e.type === 'index') {
      kept.push(e);
    } else if (isRecent(e.publishedAt, CONFIG.cutoffDays)) {
      kept.push(e);
    } else {
      expired.push(e);
    }
  }

  ctx.log(`保留 ${kept.length} 条，移入归档 ${expired.length} 条`);

  const oldArchive = options.previousArchive ?? [];
  const archiveIds = new Set(oldArchive.map((e) => e.id));
  const archive = [...oldArchive, ...expired.filter((e) => !archiveIds.has(e.id))].slice(-2000);
  const meta = buildMeta(kept, sourceMetas, CONFIG.cutoffDays);

  ctx.log(`✓ 抓取完成：活跃 ${meta.totalActive} / 归档 ${archive.length} / 跑路 ${kept.filter((e) => e.type === 'dead').length}`);

  return {
    data: { entries: kept, meta },
    archive,
    logs,
  };
}
