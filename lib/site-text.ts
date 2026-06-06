/**
 * 站点文案：所有可能变化的字段都从这里动态生成，禁止散落硬编码
 */
import { CONFIG } from './config';
import type { Meta } from './types';

export function cronToHuman(cron: string): string {
  const m = cron.match(/^\*\/(\d+) \* \* \*$/);
  if (m) return `${m[1]} 小时`;
  const m2 = cron.match(/^0 \*\/(\d+) \* \* \*$/);
  if (m2) return `${m2[1]} 小时`;
  if (cron === '0 * * * *') return '1 小时';
  return cron;
}

export function getCronText(): string {
  return cronToHuman(CONFIG.cron);
}

export function getSiteName(): string {
  return CONFIG.siteName;
}

export function getSiteShortName(): string {
  return CONFIG.siteShortName;
}

export function getDescription(): string {
  return CONFIG.description;
}

export function getWindowDays(): number {
  return CONFIG.cutoffDays;
}

export function getWindowText(): string {
  return `${CONFIG.cutoffDays} 天`;
}

/**
 * 由 meta 自动计算统计数字，避免硬编码
 */
export interface SiteStats {
  totalActive: number;
  totalSources: number;
  totalDead: number;
  totalByType: Record<string, number>;
  totalBySource: Record<string, number>;
  realtime24h: number;
  realtime3d: number;
  realtime7d: number;
  generatedAt: string;
}

export function getSiteStats(meta: Meta, entries: { publishedAt?: string; isActive: boolean }[]): SiteStats {
  const day = 24 * 3600 * 1000;
  const now = Date.now();
  let realtime24h = 0;
  let realtime3d = 0;
  let realtime7d = 0;
  for (const e of entries) {
    if (!e.isActive || !e.publishedAt) continue;
    const d = now - new Date(e.publishedAt).getTime();
    if (d < day) realtime24h++;
    if (d < 3 * day) realtime3d++;
    if (d < 7 * day) realtime7d++;
  }
  return {
    totalActive: meta.totalActive,
    totalSources: meta.sources?.length ?? 0,
    totalDead: meta.totalDead ?? 0,
    totalByType: meta.totalByType ?? {},
    totalBySource: meta.totalBySource ?? {},
    realtime24h,
    realtime3d,
    realtime7d,
    generatedAt: meta.generatedAt,
  };
}

export function formatUpdatedAt(iso: string | undefined | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('zh-CN', { hour12: false });
}

export function formatDateShort(iso: string | undefined | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
}
