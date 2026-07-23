/**
 * kerrynotes.com 抓取器
 * - /free-proxy-vpn/ 表格：机场 | 免费政策 | 链接
 * - 评测文章正文含邀请码
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl, loadHtml, absoluteUrl } from '../http';
import { cleanText, makeId, nowIso, extractTgLinks } from '../format';

const BASE = 'https://kerrynotes.com';
const INDEX_URL = BASE + '/free-proxy-vpn/';

async function scrapeIndex(): Promise<{ entries: VpnEntry[]; reviewUrls: string[] }> {
  const res = await fetchUrl(INDEX_URL, { timeout: 20000 });
  if (!res.ok) return { entries: [], reviewUrls: [] };
  const $ = loadHtml(res.body);
  const scrapedAt = nowIso();
  const entries: VpnEntry[] = [];
  const reviewUrls = new Set<string>();

  $('table tr, .wp-block-table tr').each((_, tr) => {
    const $tr = $(tr);
    const tds = $tr.find('td');
    if (tds.length < 2) return;
    const name = cleanText($(tds[0]).text());
    const policy = cleanText($(tds[1]).text());
    const link = $(tds[2] ?? tds[1]).find('a').first().attr('href') ?? $(tds[0]).find('a').first().attr('href');
    if (!name || name.length < 2) return;
    const signupUrl = absoluteUrl(INDEX_URL, link);
    if (!signupUrl) return;
    if (signupUrl.includes('kerrynotes.com')) {
      reviewUrls.add(signupUrl);
    }
    entries.push({
      id: makeId(name, signupUrl),
      name,
      type: 'free',
      description: policy,
      notice: policy,
      signupUrl,
      websiteUrl: signupUrl,
      sources: ['kerrynotes'],
      sourceUrls: [INDEX_URL],
      publishedAt: scrapedAt,
      scrapedAt,
      isActive: true,
    });
  });

  $('.post-card, article').each((_, art) => {
    const $a = $(art).find('a').first();
    const href = $a.attr('href');
    if (!href) return;
    const abs = absoluteUrl(INDEX_URL, href);
    if (abs && abs.includes('kerrynotes.com') && /vpn|proxy|机场|节点|翻墙/i.test(abs + $a.text())) {
      reviewUrls.add(abs);
    }
  });

  return { entries, reviewUrls: Array.from(reviewUrls) };
}

async function scrapeReview(url: string): Promise<Partial<VpnEntry> | null> {
  const res = await fetchUrl(url, { timeout: 15000 });
  if (!res.ok) return null;
  const $ = loadHtml(res.body);
  const article = $('.post-content, .entry-content, article .content, main').first();
  const text = cleanText(article.text());
  if (!text) return null;

  const inviteMatch = text.match(/(?:邀请码|Invite\s*Code|invite)[：:\s]+([A-Z0-9]{4,8}(?:[-_][A-Z0-9]{4,8}){1,5})/i);
  const tg = extractTgLinks(text);
  const ratingMatch = text.match(/(\d(?:\.\d)?)\s*\/\s*5|评分[：:\s]*(\d(?:\.\d)?)/);
  const trafficMatch = text.match(/(?:流量|免费流量)[：:\s]*([\d.]+\s*[GMKT]B?)/i);
  const priceMatch = text.match(/(?:月付|价格|¥|￥|\$)[^\n]{1,40}/);

  return {
    inviteCode: inviteMatch?.[1]?.toUpperCase(),
    telegramGroup: tg.group,
    telegramChannel: tg.channel,
    rating: ratingMatch ? Number(ratingMatch[1] ?? ratingMatch[2]) : undefined,
    traffic: trafficMatch?.[1]?.trim(),
    price: priceMatch?.[0]?.trim(),
    description: text.slice(0, 600),
  };
}

/**
 * 稳健匹配评测 URL：仅用名称中的拉丁字符片段匹配，
 * 避免中文名前 4 字符匹配英文 URL 导致的误配
 */
function matchReviewUrl(name: string, reviewUrls: string[]): string | undefined {
  // 提取名称中的拉丁字符片段（至少 3 个字符）
  const latinParts = name.match(/[a-zA-Z0-9]{3,}/g);
  if (!latinParts || latinParts.length === 0) return undefined;

  return reviewUrls.find((u) => {
    const urlLower = u.toLowerCase();
    return latinParts.some((part) => urlLower.includes(part.toLowerCase()));
  });
}

export const kerrynotesScraper: Scraper = {
  id: 'kerrynotes',
  displayName: 'Kerry 的学习笔记',
  url: BASE,
  type: 'free',
  cutoffDays: 90,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const { entries, reviewUrls } = await scrapeIndex();
      ctx.log(`kerrynotes: ${entries.length} entries, ${reviewUrls.length} reviews`);

      const enriched: VpnEntry[] = [];
      for (const e of entries) {
        const matchedReview = matchReviewUrl(e.name, reviewUrls);
        if (matchedReview) {
          const ext = await scrapeReview(matchedReview);
          if (ext) {
            enriched.push({
              ...e,
              inviteCode: ext.inviteCode ?? e.inviteCode,
              telegramGroup: ext.telegramGroup ?? e.telegramGroup,
              telegramChannel: ext.telegramChannel ?? e.telegramChannel,
              rating: ext.rating ?? e.rating,
              traffic: ext.traffic ?? e.traffic,
              price: ext.price ?? e.price,
              description: ext.description ?? e.description,
              sourceUrls: [INDEX_URL, matchedReview],
              type: 'review',
            });
            continue;
          }
        }
        enriched.push(e);
        await new Promise((r) => setTimeout(r, 200));
      }
      return { entries: enriched, meta: okMeta(this, ctx, enriched.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
