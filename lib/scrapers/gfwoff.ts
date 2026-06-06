/**
 * GFWOFF 评测型抓取器
 * - 5 个评测页面（/、/famous-proxy-providers/、/stable-proxy-nodes-faster-than-vpn/、/one-click-vpn/、/free-vpn/）
 * - 实际结构：h2/h3 标题 + 段落（包含维基百科/wiki 官方链接）
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl, loadHtml, absoluteUrl } from '../http';
import { makeId, nowIso, cleanText } from '../format';

const PAGES = [
  { path: '/', label: 'GFWOFF 推荐 VPN' },
  { path: '/famous-proxy-providers/', label: 'GFWOFF 老牌机场' },
  { path: '/stable-proxy-nodes-faster-than-vpn/', label: 'GFWOFF 稳定机场' },
  { path: '/one-click-vpn/', label: 'GFWOFF 一键翻墙' },
  { path: '/free-vpn/', label: 'GFWOFF 免费 VPN' },
];

function pickWebsiteUrl(href: string, base: string): string {
  if (/^https?:\/\/(zh\.wikipedia|blog\.cloudflare|github\.com|www\.github\.com)/i.test(href)) return '';
  if (new RegExp(`^https?:\\/\\/(www\\.)?${base.replace(/^https?:\/\//, '').replace(/\./g, '\\.')}`).test(href)) return '';
  return href;
}

async function scrapePage(
  base: string,
  path: string,
  sourceId: string,
  sourceLabel: string
): Promise<VpnEntry[]> {
  const url = base + path;
  const res = await fetchUrl(url, { timeout: 20000 });
  if (!res.ok) return [];
  const $ = loadHtml(res.body);
  const entries: VpnEntry[] = [];
  const seen = new Set<string>();

  $('h2, h3').each((_i: number, h: any) => {
    const title = cleanText($(h).text());
    if (!title || title.length > 60) return;
    if (/安全|好用|为什么|什么是|如何|推荐|注意|介绍|问题|什么|付费/i.test(title) && !/[VPN机场加速]/.test(title)) {
      if (!/[机场加速]/.test(title)) return;
    }
    if (/(V\d|免责|关于|联系|订阅|TG|Telegram)/.test(title) && title.length < 10) return;

    let websiteUrl = '';
    let description = '';
    const $h = $(h);
    const $nextP = $h.nextAll('p').first();
    if ($nextP.length) {
      const text = cleanText($nextP.text());
      if (text && text.length > 20) description = text.slice(0, 240);
      const links: string[] = [];
      $nextP.find('a').each((_j: number, a: any) => {
        const href = $(a).attr('href');
        if (!href) return;
        const abs = absoluteUrl(url, href);
        if (abs) links.push(abs);
      });
      const external = links.map((l) => pickWebsiteUrl(l, base)).filter(Boolean);
      if (external[0]) websiteUrl = external[0];
    }
    if (!websiteUrl) {
      $h.nextUntil('h2, h3').find('a').each((_j: number, a: any) => {
        const href = $(a).attr('href');
        if (!href) return;
        const abs = absoluteUrl(url, href);
        if (abs && pickWebsiteUrl(abs, base) && !websiteUrl) websiteUrl = pickWebsiteUrl(abs, base);
      });
    }

    if (!websiteUrl) return;
    const key = title + '|' + websiteUrl;
    if (seen.has(key)) return;
    seen.add(key);

    entries.push({
      id: makeId(title, websiteUrl),
      name: title,
      type: 'review',
      description: description || `${sourceLabel} 推荐 · ${path}`,
      websiteUrl,
      sources: [sourceId],
      sourceUrls: [url],
      publishedAt: nowIso(),
      scrapedAt: nowIso(),
      isActive: true,
    });
  });
  return entries;
}

export const gfwoffScraper: Scraper = {
  id: 'gfwoff',
  displayName: 'GFWOFF 评测',
  url: 'https://gfwoff.org',
  type: 'review',
  cutoffDays: 30,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const all: VpnEntry[] = [];
      for (const p of PAGES) {
        const list = await scrapePage('https://gfwoff.org', p.path, 'gfwoff', p.label);
        ctx.log(`${p.path}: ${list.length}`);
        all.push(...list);
        await new Promise((r) => setTimeout(r, 250));
      }
      return { entries: all, meta: okMeta(this, ctx, all.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
