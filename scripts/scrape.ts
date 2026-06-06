/**
 * 抓取入口：并行运行所有抓取器 → 去重 → 标记 isActive → 写文件
 * 用法：
 *   pnpm scrape            # 跑全部
 *   pnpm scrape:source -- ygjc  # 跑单个
 */
import { allScrapers, scraperById } from '../lib/scrapers';
import { dedupe, applyDeadList } from '../lib/dedupe';
import { buildMeta, saveData, loadData, loadArchive, saveArchive } from '../lib/data';
import { CONFIG } from '../lib/config';
import { nowIso, isRecent } from '../lib/format';
import type { VpnEntry, SourceMeta } from '../lib/types';

const now = nowIso();
const ctx = {
  now,
  log: (msg: string) => console.log(`[${new Date().toLocaleTimeString('zh-CN')}] ${msg}`),
};

async function main() {
  const only = process.argv.find((a, i) => process.argv[i - 1] === '--source');
  const scrapers = only ? [scraperById(only)].filter(Boolean) as typeof allScrapers : allScrapers;
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

  // 15 天滚动
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

  // 合并已有归档
  const oldArchive = await loadArchive();
  const archiveIds = new Set(oldArchive.map((e) => e.id));
  const newArchive = [...oldArchive, ...expired.filter((e) => !archiveIds.has(e.id))].slice(-2000);
  await saveArchive(newArchive);

  const meta = buildMeta(kept, sourceMetas, CONFIG.cutoffDays);
  await saveData(kept, meta);
  ctx.log(`✓ 已写入 data/vpns.json：活跃 ${meta.totalActive} / 归档 ${meta.totalDead} / 跑路 ${kept.filter((e) => e.type === 'dead').length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
