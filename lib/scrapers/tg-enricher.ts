/**
 * tg-enricher 副路抓取器
 * - 访问 signupUrl 主页，提取 t.me/ 链接
 * - 作为补全 TG 字段的兜底
 */
import type { VpnEntry, SourceMeta } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl, loadHtml, absoluteUrl } from '../http';
import { extractTgLinks, nowIso } from '../format';

export const tgEnricherScraper: Scraper = {
  id: 'tg-enricher',
  displayName: 'Telegram 链接补全',
  url: 'https://t.me',
  type: 'node',
  cutoffDays: 0,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const data = await import('../data').then((m) => m.loadData());
      const candidates = data.entries
        .filter((e) => e.signupUrl && !e.telegramGroup && !e.telegramChannel)
        .slice(0, 30);

      const enriched: VpnEntry[] = [];
      for (const c of candidates) {
        const res = await fetchUrl(c.signupUrl!, { timeout: 10000, retries: 1 });
        if (!res.ok) continue;
        const $ = loadHtml(res.body);
        const text =
          $('body').text() +
          ' ' +
          $('a[href*="t.me"], a[href*="telegram.me"]')
            .map((_i, a) => $(a).attr('href') ?? '')
            .get()
            .join(' ');
        const tg = extractTgLinks(text);
        if (tg.group || tg.channel) {
          enriched.push({
            ...c,
            telegramGroup: tg.group,
            telegramChannel: tg.channel,
            sources: Array.from(new Set([...c.sources, 'tg-enricher'])),
            sourceUrls: [...c.sourceUrls, c.signupUrl!],
            scrapedAt: nowIso(),
          });
        }
        await new Promise((r) => setTimeout(r, 300));
      }

      ctx.log(`tg-enricher: ${enriched.length} enriched`);
      const meta = okMeta(this, ctx, enriched.length);
      return { entries: enriched, meta };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
