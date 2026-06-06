/**
 * 抓取器接口与基类
 */
import type { VpnEntry, SourceMeta } from '../types';
import { nowIso } from '../format';

export interface ScraperContext {
  now: string;
  log: (msg: string) => void;
}

export interface ScraperResult {
  entries: VpnEntry[];
  meta: SourceMeta;
}

export interface Scraper {
  id: string;
  displayName: string;
  url: string;
  type: 'trial' | 'free' | 'node' | 'index' | 'dead' | 'review';
  cutoffDays: number;
  run(ctx: ScraperContext): Promise<ScraperResult>;
}

export function makeMeta(
  scraper: Scraper,
  ctx: ScraperContext,
  itemsScraped: number,
  success: boolean,
  error?: string
): SourceMeta {
  return {
    id: scraper.id,
    displayName: scraper.displayName,
    url: scraper.url,
    lastRunAt: ctx.now,
    lastSuccess: success,
    itemsScraped,
    cutoffDays: scraper.cutoffDays,
    errorMessage: error,
  };
}

export function okMeta(scraper: Scraper, ctx: ScraperContext, count: number): SourceMeta {
  return makeMeta(scraper, ctx, count, true);
}

export function errMeta(scraper: Scraper, ctx: ScraperContext, e: unknown): SourceMeta {
  return makeMeta(
    scraper,
    ctx,
    0,
    false,
    e instanceof Error ? e.message : String(e)
  );
}

export const now = nowIso;
