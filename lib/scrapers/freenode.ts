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

async function scrapeIndex(): Promise<VpnEntry[]> {
  const res = await fetchUrl(INDEX_URL, { timeout: 20000 });
  if (!res.ok) return [];
  const $ = loadHtml(res.body);
  const scrapedAt = nowIso();
  const entries: VpnEntry[] = [];

  $('table tr, .wp-block-table tr').each((_, tr) => {
    const $tr = $(tr);
    const tds = $tr.find('td, th');
    if (tds.length < 3) return;
    const name = cleanText($(tds[0]).text());
    const protocol = cleanText($(tds[1]).text());
    const features = cleanText($(tds[2]).text());
    const price = cleanText($(tds[3]).text());
    if (!name || name.length < 2) return;

    // 无真实链接时跳过，不生成指向列表页的假 URL
    const href = $(tds[0]).find('a').first().attr('href');
    const signupUrl = absoluteUrl(INDEX_URL, href);
    if (!signupUrl) return;

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

  return entries;
}

export const freenodeScraper: Scraper = {
  id: 'freenode',
  displayName: '免费节点 - 机场大全',
  url: BASE,
  type: 'free',
  cutoffDays: 90,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const entries = await scrapeIndex();
      ctx.log(`freenode: ${entries.length} entries`);
      return { entries, meta: okMeta(this, ctx, entries.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
