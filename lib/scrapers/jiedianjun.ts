/**
 * jiedianjun.com 抓取器：节点君评测
 * - 5 家试用机场横向评测
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl, loadHtml, absoluteUrl } from '../http';
import { cleanText, makeId, nowIso, extractTgLinks } from '../format';

const BASE = 'https://www.jiedianjun.com';
const HOME = BASE + '/';

async function findReviewUrls(): Promise<string[]> {
  const res = await fetchUrl(HOME, { timeout: 20000 });
  if (!res.ok) return [];
  const $ = loadHtml(res.body);
  const urls = new Set<string>();
  $('a').each((_, a) => {
    const href = $(a).attr('href');
    const text = cleanText($(a).text());
    if (!href) return;
    if (!/vpn|机场|节点|翻墙|评测|试用|免费/i.test(text + href)) return;
    const abs = absoluteUrl(HOME, href);
    if (abs && abs.startsWith(BASE) && abs !== HOME) {
      urls.add(abs);
    }
  });
  return Array.from(urls).slice(0, 20);
}

async function scrapeReview(url: string): Promise<VpnEntry[]> {
  const res = await fetchUrl(url, { timeout: 15000 });
  if (!res.ok) return [];
  const $ = loadHtml(res.body);
  const article = $('.post-content, .entry-content, article .content, .article-content, main').first();
  const text = cleanText(article.text());
  if (!text || text.length < 100) return [];
  const scrapedAt = nowIso();
  const entries: VpnEntry[] = [];
  const sections = text.split(/(?:^|\n)\s*[\d一二三四五六七八九十]+[、.]\s*/).filter(Boolean);
  for (const sec of sections) {
    const nameMatch = sec.match(/^([^\s:：\n]{2,20})/);
    if (!nameMatch) continue;
    const name = cleanText(nameMatch[1]);
    if (name.length < 2) continue;
    const tg = extractTgLinks(sec);
    const inviteMatch = sec.match(/(?:邀请码|invite)[：:\s]+([A-Z0-9]{4,8}(?:[-_][A-Z0-9]{4,8}){1,5})/i);
    const couponMatch = sec.match(/(?:优惠码|优惠)[：:\s]+([A-Za-z0-9_-]{3,30})/i);
    const urlMatch = sec.match(/https?:\/\/[^\s|]+/);
    const trafficMatch = sec.match(/(?:流量)[：:\s]*([\d.]+\s*[GMKT]B?)/i);
    const ratingMatch = sec.match(/(\d(?:\.\d)?)\s*\/\s*5|评分[：:\s]*(\d(?:\.\d)?)/);
    entries.push({
      id: makeId(name, urlMatch?.[0] ?? url),
      name,
      type: 'review',
      description: sec.slice(0, 400),
      signupUrl: urlMatch?.[0],
      websiteUrl: urlMatch?.[0],
      telegramGroup: tg.group,
      telegramChannel: tg.channel,
      inviteCode: inviteMatch?.[1]?.toUpperCase(),
      couponCode: couponMatch?.[1],
      traffic: trafficMatch?.[1]?.trim(),
      rating: ratingMatch ? Number(ratingMatch[1] ?? ratingMatch[2]) : undefined,
      sources: ['jiedianjun'],
      sourceUrls: [url],
      publishedAt: scrapedAt,
      scrapedAt,
      isActive: true,
    });
  }
  if (entries.length === 0 && /vpn|机场/i.test(text)) {
    const nameMatch = text.match(/^([^:：\n]{2,20})/);
    if (nameMatch) {
      entries.push({
        id: makeId(nameMatch[1], url),
        name: cleanText(nameMatch[1]),
        type: 'review',
        description: text.slice(0, 400),
        sources: ['jiedianjun'],
        sourceUrls: [url],
        publishedAt: scrapedAt,
        scrapedAt,
        isActive: true,
      });
    }
  }
  return entries;
}

export const jiedianjunScraper: Scraper = {
  id: 'jiedianjun',
  displayName: '节点君评测',
  url: BASE,
  type: 'review',
  cutoffDays: 90,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const reviewUrls = await findReviewUrls();
      ctx.log(`jiedianjun: ${reviewUrls.length} reviews`);
      const all: VpnEntry[] = [];
      for (const u of reviewUrls) {
        const list = await scrapeReview(u);
        all.push(...list);
        await new Promise((r) => setTimeout(r, 300));
      }
      const seen = new Set<string>();
      const unique = all.filter((e) => {
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });
      return { entries: unique, meta: okMeta(this, ctx, unique.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
