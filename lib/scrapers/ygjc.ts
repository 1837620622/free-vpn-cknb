/**
 * ygjc.cc 抓取器：抓取月度合集 /vpn/YYYYMM 与 /vpn/free
 * 实际结构（2026/06 实测）：
 *   <div class="vpn-card">
 *     <div class="vpn-header">
 *       <h3 class="vpn-name">机场名</h3>
 *       <span class="vpn-type-badge free|paid|trial">类型</span>
 *     </div>
 *     <div class="vpn-updated">更新于: 2026/5/23</div>
 *     <div class="vpn-desc">描述...</div>
 *     <div class="coupon-card">
 *       <code class="coupon-code">优惠码</code>
 *     </div>
 *     <div class="vpn-info-row">
 *       <strong>免费流量:</strong><span>9.54PB</span>
 *     </div>
 *     <div class="vpn-info-row">
 *       <strong>试用期限:</strong><span>1次性</span>
 *     </div>
 *     <div class="vpn-info-row">
 *       <strong>协议:</strong>
 *       <div class="vpn-tags"><span class="tag proto">AnyTLS</span></div>
 *     </div>
 *     <div class="vpn-info-row">
 *       <strong>节点:</strong>
 *       <div class="vpn-tags">
 *         <span class="tag node">美国</span>
 *         <span class="tag node">荷兰</span>
 *       </div>
 *     </div>
 *     <div class="vpn-footer-actions">
 *       <a class="btn btn-primary" href="https://...">前往注册</a>
 *     </div>
 *   </div>
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl, loadHtml, absoluteUrl } from '../http';
import { cleanText, makeId, parseChineseDate, nowIso } from '../format';

const BASE = 'https://ygjc.cc';

function buildMonthPageUrls(): string[] {
  const urls = [BASE + '/vpn/free'];
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    urls.push(`${BASE}/vpn/${yyyy}${mm}`);
  }
  return urls;
}

async function scrapePage(url: string): Promise<VpnEntry[]> {
  const res = await fetchUrl(url, { timeout: 20000, retries: 2 });
  if (!res.ok) return [];
  const $ = loadHtml(res.body);
  const out: VpnEntry[] = [];
  const scrapedAt = nowIso();

  const cards = $('.vpn-card').toArray();
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const $card = $(card);
    const name = cleanText($card.find('.vpn-name').first().text());
    if (!name || name.length < 2) continue;

    const updated = cleanText($card.find('.vpn-updated').first().text());
    const publishedAt = parseChineseDate(updated) ?? scrapedAt;

    const desc = cleanText($card.find('.vpn-desc').first().text());

    const coupon =
      cleanText($card.find('.coupon-code').first().text()) || undefined;
    const realCoupon = coupon && coupon !== '无需优惠券' ? coupon : undefined;

    const type = cleanText($card.find('.vpn-type-badge').first().text());
    const vtype: VpnEntry['type'] = /免费/.test(type) ? 'free' : 'trial';

    const traffic = readRow($, $card, '免费流量|流量|赠送流量');
    const period = readRow($, $card, '试用期限|期限|时长');

    const protocols: string[] = [];
    $card.find('.tag.proto').each((_i: number, el: any) => {
      const t = cleanText($(el).text());
      if (t) protocols.push(t.toLowerCase());
    });

    const regions: string[] = [];
    $card.find('.tag.node').each((_i: number, el: any) => {
      const t = cleanText($(el).text());
      if (t) regions.push(t);
    });

    const signupHref =
      $card.find('a.btn-primary, a.btn, a[target="_blank"]').first().attr('href') ??
      $card.find('a[href*="http"]').first().attr('href');

    const signupUrl = absoluteUrl(url, signupHref);

    const entry: VpnEntry = {
      id: makeId(name, signupUrl ?? name),
      name,
      type: vtype as VpnEntry['type'],
      period: period ?? '未知试用期限',
      couponCode: realCoupon ?? undefined,
      isActive: true,
      traffic: traffic ?? '未知流量',
      protocols: protocols.length > 0 ? protocols : undefined,
      description: desc,
      signupUrl,
      websiteUrl: signupUrl,
      couponCode: realCoupon,
      traffic,
      period,
      protocols: protocols.length > 0 ? protocols : undefined,
      regions: regions.length > 0 ? regions : undefined,
      sources: ['ygjc'],
      sourceUrls: [url],
      publishedAt,
      scrapedAt,
      isActive: true,
    };
    out.push(entry);
  }

  return out;
}

function readRow($: any, $card: any, labelRegex: string): string | undefined {
  let val: string | undefined;
  $card.find('.vpn-info-row').each((_: number, row: any) => {
    if (val) return;
    const $row = $(row);
    const label = cleanText($row.find('strong').first().text());
    if (new RegExp(labelRegex).test(label)) {
      const span = cleanText($row.find('span').first().text());
      if (span) {
        val = span;
      } else {
        const tags = $row.find('.vpn-tags .tag');
        if (tags.length > 0) {
          val = tags
            .map((_i: number, el: any) => cleanText($(el).text()))
            .get()
            .join('/');
        }
      }
    }
  });
  return val;
}

export const ygjcScraper: Scraper = {
  id: 'ygjc',
  displayName: '一个机场（ygjc.cc）',
  url: BASE,
  type: 'trial',
  cutoffDays: 60,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const urls = buildMonthPageUrls();
      const all: VpnEntry[] = [];
      for (const u of urls) {
        ctx.log(`ygjc: ${u}`);
        const list = await scrapePage(u);
        all.push(...list);
        await new Promise((r) => setTimeout(r, 500));
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
