/**
 * freenode.com 机场大全抓取器
 * - 列表页：机场名称、协议、特色、价格、免费试用说明
 * - 支持试用机场 (trial) 和免费节点
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl, loadHtml, absoluteUrl } from '../http';
import { cleanText, makeId, nowIso } from '../format';

const BASE = 'https://free-node.com/proxylist/';
const INDEX_URL = BASE;

async function scrapeIndex(): Promise<{ entries: VpnEntry[]; reviewUrls: string[] }> {
  const res = await fetchUrl(INDEX_URL, { timeout: 20000 });
  if (!res.ok) return { entries: [], reviewUrls: [] };
  const $ = loadHtml(res.body);
  const scrapedAt = nowIso();
  const entries: VpnEntry[] = [];
  const reviewUrls = new Set<string>();

  $('table tr, .wp-block-table tr').each((_, tr) => {
    const $tr = $(tr);
    const tds = $tr.find('td, th');
    if (tds.length < 3) return;
    const name = cleanText($(tds[0]).text());
    const protocol = cleanText($(tds[1]).text());
    const features = cleanText($(tds[2]).text());
    const price = cleanText($(tds[3]).text());
    if (!name || name.length < 2) return;

    const signupUrl = absoluteUrl(INDEX_URL, $(tds[0]).find('a').first().attr('href') || '#');
    if (signupUrl.includes('free-node.com')) {
      reviewUrls.add(signupUrl);
    }
    entries.push({
      id: makeId(name, signupUrl),
      name,
      type: 'trial', // 很多有免费试用
      description: `${protocol} · ${features} · ${price}`,
      notice: '免费试用 / 节点',
      signupUrl,
      websiteUrl: signupUrl,
      sources: ['freenode'],
      sourceUrls: [INDEX_URL],
      publishedAt: scrapedAt,
      scrapedAt,
      isActive: true,
    });
  });

  return { entries, reviewUrls: Array.from(reviewUrls) };
}

async function scrapeReview(url: string): Promise<Partial<VpnEntry> | null> {
  // 如果需要深入单个机场页面解析，可以在这里扩展
  return null;
}

export const freenodeScraper: Scraper = {
  id: 'freenode',
  displayName: '免费节点 - 机场大全',
  url: BASE,
  type: 'free',
  cutoffDays: 90,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const { entries, reviewUrls } = await scrapeIndex();
      ctx.log(`freenode: ${entries.length} entries`);

      // 简单合并评论（如果有）
      const enriched: VpnEntry[] = entries.map(e => ({
        ...e,
        sources: [...e.sources, 'freenode'],
        sourceUrls: [INDEX_URL],
      }));

      return { entries: enriched, meta: okMeta(this, ctx, enriched.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
