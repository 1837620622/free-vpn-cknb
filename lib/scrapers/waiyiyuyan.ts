/**
 * waiyiyuyan.github.io 抓取器
 * - Hexo 静态博客，月度合集
 * - /june-vpn/ 类 URL 模式
 * - 抓首页获取最近文章列表
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl, loadHtml, absoluteUrl } from '../http';
import { cleanText, makeId, nowIso } from '../format';

const BASE = 'https://waiyiyuyan.github.io';

async function scrapeHome(): Promise<{ entries: VpnEntry[]; detailUrls: string[] }> {
  const res = await fetchUrl(BASE + '/', { timeout: 20000 });
  if (!res.ok) return { entries: [], detailUrls: [] };
  const $ = loadHtml(res.body);
  const scrapedAt = nowIso();
  const entries: VpnEntry[] = [];
  const detailUrls: string[] = [];

  $('article, .post-card, .post').each((_, art) => {
    const $art = $(art);
    const $a = $art.find('a').first();
    const title = cleanText($art.find('h1, h2, h3, .post-title').first().text()) || cleanText($a.text());
    const href = $a.attr('href');
    if (!title || !href) return;
    if (!/vpn|机场|节点|翻墙|科学|proxy|clash|v2|ss|ssr|trojan/i.test(title + href)) return;

    const url = absoluteUrl(BASE + '/', href);
    if (!url) return;
    const isDetail = url.includes(BASE) && url !== BASE + '/';

    const dateText = cleanText($art.find('time, .date, .post-date').first().attr('datetime') ?? $art.find('time, .date, .post-date').first().text());

    if (isDetail) detailUrls.push(url);

    entries.push({
      id: makeId(title, url),
      name: title,
      type: 'trial',
      description: title,
      sources: ['waiyiyuyan'],
      sourceUrls: [BASE + '/'],
      publishedAt: dateText || scrapedAt,
      scrapedAt,
      isActive: true,
    });
  });

  return { entries, detailUrls };
}

async function scrapeDetail(url: string): Promise<Partial<VpnEntry> | null> {
  const res = await fetchUrl(url, { timeout: 15000 });
  if (!res.ok) return null;
  const $ = loadHtml(res.body);
  const article = $('.post-content, .post-body, article .content, article').first();
  const text = cleanText(article.text());
  if (!text) return null;

  const inviteMatch = text.match(/(?:邀请码|Invite|invite)[：:\s]+([A-Z0-9]{4,8}(?:[-_][A-Z0-9]{4,8}){1,5})/i);
  const couponMatch = text.match(/(?:优惠码|优惠)[：:\s]+([A-Za-z0-9_-]{3,30})/i);
  const signupMatch = text.match(/(?:注册链接|官网|地址)[：:\s]+(https?:\/\/[^\s|]+)/i);
  const trafficMatch = text.match(/(?:免费流量|流量)[：:\s]*([\d.]+\s*[GMKT]B?)/i);
  const periodMatch = text.match(/(?:试用|期限|时长)[：:\s]*([\d]+天|[\d]+个月)/i);

  const protoRe = /(Hysteria2?|VLESS|VMess|Trojan|Shadowsocks|SSR|AnyTLS|Reality|TUIC|Clash|V2Ray|SS)\b/g;
  const protocols = Array.from(new Set(Array.from(text.matchAll(protoRe)).map((m) => m[1].toLowerCase())));

  return {
    inviteCode: inviteMatch?.[1]?.toUpperCase(),
    couponCode: couponMatch?.[1],
    signupUrl: signupMatch?.[1],
    websiteUrl: signupMatch?.[1],
    traffic: trafficMatch?.[1]?.trim(),
    period: periodMatch?.[1],
    protocols,
    description: text.slice(0, 600),
  };
}

export const waiyiyuyanScraper: Scraper = {
  id: 'waiyiyuyan',
  displayName: '我爱白嫖（waiyiyuyan）',
  url: BASE,
  type: 'trial',
  cutoffDays: 60,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const { entries, detailUrls } = await scrapeHome();
      ctx.log(`waiyiyuyan: ${entries.length} entries, ${detailUrls.length} details`);

      const enriched: VpnEntry[] = [];
      for (const e of entries) {
        const detail = detailUrls.find((u) => e.id === makeId(e.name, u));
        if (detail) {
          const ext = await scrapeDetail(detail);
          if (ext) {
            enriched.push({
              ...e,
              inviteCode: ext.inviteCode ?? e.inviteCode,
              couponCode: ext.couponCode ?? e.couponCode,
              signupUrl: ext.signupUrl ?? e.signupUrl,
              websiteUrl: ext.websiteUrl ?? e.websiteUrl,
              traffic: ext.traffic ?? e.traffic,
              period: ext.period ?? e.period,
              protocols: ext.protocols ?? e.protocols,
              description: ext.description ?? e.description,
              sourceUrls: [BASE + '/', detail],
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
