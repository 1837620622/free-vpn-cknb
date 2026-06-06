/**
 * DiningFactory/panda-vpn-pro 抓取器
 * - GitHub README 包含：低价机场推荐表格、跑路事件、协议说明
 * - 30+ 机场注册链接 + 价格/流量/优惠码/开业日期
 * - 包含跑路通知（快连、熊猫 VPN 跑路记录）
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl } from '../http';
import { makeId, nowIso } from '../format';

const REPO = 'DiningFactory/panda-vpn-pro';
const README_URL = `https://raw.githubusercontent.com/${REPO}/main/README.md`;

function cleanText(s: string | undefined | null): string {
  if (!s) return '';
  return s.replace(/\s+/g, ' ').replace(/<br\s*\/?>/gi, ' / ').replace(/\|/g, ' / ').trim();
}

function parseAirports(md: string): VpnEntry[] {
  const out: VpnEntry[] = [];
  const re = /\[([^\]]{2,20})\]\((https?:\/\/[^\)]*(?:register|sign|invite|#\/register|\?code=|\?invite_code=)[^\)]*)\)/g;
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    const name = cleanText(m[1]);
    const url = m[2];
    if (!name || /注册|官网|链接|地址|频道|群|Telegram|TG/.test(name)) continue;
    if (/(github\.com|baidu|google|t\.me|telegram)/i.test(url)) continue;
    const id = makeId(name, url);
    if (seen.has(id)) continue;
    seen.add(id);
    const start = m.index;
    const after = md.slice(m.index, m.index + 800);
    const snippet = cleanText(after.replace(/\[|\]|\(|\)/g, ' ').replace(/<br\s*\/?>/gi, ' / '));
    const typeMatch = snippet.match(/(中转|直连|中继|中转\/直连)/);
    const protocolMatch = snippet.match(/(Vless|VLESS|Vmess|VMess|Trojan|AnyTLS|Anytls|Hysteria2?|Shadowsocks|SSR|Clash|SS)\b/);
    const priceMatch = snippet.match(/(\d+(?:\.\d+)?)\s*[\/／]\s*(\d+\s*[GMKT]B)/i);
    const discountMatch = snippet.match(/(\d+(?:\.\d+)?)\s*折|优惠码[:：]\s*(\S+)/);
    const runStatus = snippet.match(/(跑路|跑路风险|疑似跑路|可能跑路|已停服|停止运营|已关停)/);
    const founded = snippet.match(/(\d{4}\.\d{2}\.\d{2})/);
    const tags: string[] = [];
    if (typeMatch) tags.push(typeMatch[1]);
    if (runStatus) tags.push('跑路风险');

    out.push({
      id,
      name,
      type: 'review',
      description: snippet.slice(0, 400),
      signupUrl: url,
      websiteUrl: url,
      protocols: protocolMatch ? [protocolMatch[1].toLowerCase()] : undefined,
      price: priceMatch ? `${priceMatch[1]} 元/${priceMatch[2]}` : undefined,
      couponCode: discountMatch?.[2],
      tags,
      sources: ['panda-vpn-pro'],
      sourceUrls: [README_URL],
      publishedAt: founded ? new Date(founded[1]).toISOString() : nowIso(),
      scrapedAt: nowIso(),
      isActive: !runStatus,
    });
  }
  return out;
}

function parseRunEvents(md: string): VpnEntry[] {
  const out: VpnEntry[] = [];
  const runKeywords = ['跑路', '停止运营', '停止中国大陆', '已关停', '关停', '不干了'];
  const re = /(?:#{1,4}\s*)?(?:\d+\.\s*)?\*\*?([^*\n]{2,30}?(?:VPN|机场|加速器|加速|梯子|代理)[^*\n]*)\*\*?[\s\S]{0,200}?(跑路|停止运营|停止中国大陆|已关停|关停|不干了|可能跑路)/g;
  let m: RegExpExecArray | null;
  const seen = new Set<string>();
  while ((m = re.exec(md)) !== null) {
    const name = cleanText(m[1]);
    if (!name || name.length > 30) continue;
    const id = makeId(name, 'panda-vpn-pro#run');
    if (seen.has(id)) continue;
    seen.add(id);
    const desc = cleanText(m[2]);
    out.push({
      id,
      name,
      type: 'dead',
      warningLevel: desc,
      warningDate: nowIso(),
      description: `panda-vpn-pro 记录的跑路机场：${desc}`,
      sources: ['panda-vpn-pro'],
      sourceUrls: [README_URL],
      publishedAt: nowIso(),
      scrapedAt: nowIso(),
      isActive: false,
    });
  }
  if (out.length === 0) {
    const fallbacks = ['熊猫 VPN', 'Panda VPN', '快连', 'LetsVPN', 'Lets VPN', 'PandaVPN Pro'];
    for (const f of fallbacks) {
      if (md.includes(f) && runKeywords.some((k) => md.includes(f + k) || md.includes(k + f))) {
        out.push({
          id: makeId(f, 'panda-vpn-pro#run'),
          name: f,
          type: 'dead',
          warningLevel: '已跑路',
          warningDate: nowIso(),
          description: 'panda-vpn-pro 记录的跑路 VPN',
          sources: ['panda-vpn-pro'],
          sourceUrls: [README_URL],
          publishedAt: nowIso(),
          scrapedAt: nowIso(),
          isActive: false,
        });
      }
    }
  }
  return out;
}

export const pandaScraper: Scraper = {
  id: 'panda-vpn-pro',
  displayName: 'Panda 低价机场评测',
  url: `https://github.com/${REPO}`,
  type: 'review',
  cutoffDays: 90,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const res = await fetchUrl(README_URL, { timeout: 20000 });
      if (!res.ok) throw new Error('README 抓取失败 ' + res.error);
      const airports = parseAirports(res.body);
      const runEvents = parseRunEvents(res.body);
      const all = [...airports, ...runEvents];
      ctx.log(`panda: ${airports.length} airports, ${runEvents.length} run events`);
      return { entries: all, meta: okMeta(this, ctx, all.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
