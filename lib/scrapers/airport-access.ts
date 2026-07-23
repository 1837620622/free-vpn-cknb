/**
 * chatgpt-helper-tech/airport-access 抓取器
 * - 5 家精选机场评测（含详细对比表、场景指南）
 * - 表格：[机场 | 线路/协议 | AI 工具 | 流媒体 | 设备/使用限制 | 主要注意点]
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl } from '../http';
import { makeId, nowIso } from '../format';

const REPO = 'chatgpt-helper-tech/airport-access';
const README_URL = `https://raw.githubusercontent.com/${REPO}/main/README.md`;

function cleanText(s: string | undefined | null): string {
  if (!s) return '';
  return s.replace(/\s+/g, ' ').replace(/\|/g, ' · ').replace(/<[^>]+>/g, '').trim();
}

function parseMarkdownTables(md: string): { rows: string[][] }[] {
  const out: { rows: string[][] }[] = [];
  const lines = md.split('\n');
  let cur: string[][] | null = null;
  let headerSeen = false;
  for (const line of lines) {
    const t = line.trim();
    if (!t.startsWith('|')) {
      if (cur && cur.length > 0) {
        out.push({ rows: cur });
      }
      cur = null;
      headerSeen = false;
      continue;
    }
    const cells = t.split('|').map((c) => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1 || (i === 0 && c !== '') || (i === arr.length - 1 && c !== ''));
    const cleaned = t.split('|').slice(1, -1).map((c) => c.trim());
    if (!headerSeen && cleaned.length > 0 && /^-+\s*\|/.test(t)) {
      headerSeen = true;
      continue;
    }
    if (cleaned.length === 0) continue;
    if (!cur) cur = [];
    cur.push(cleaned);
    headerSeen = true;
  }
  if (cur && cur.length > 0) out.push({ rows: cur });
  return out;
}

function extractSignupUrls(md: string): { name: string; url: string }[] {
  const re = /\[([^\]]{2,20})\]\((https?:\/\/[^\)]*(?:register|sign|invite|#\/register|\?code=|\?invite_code=|auth\/register)[^\)]*)\)/g;
  const out: { name: string; url: string }[] = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    const name = cleanText(m[1]);
    const url = m[2];
    if (!name || /(github|baidu|google|t\.me|telegram|airport-access)/i.test(url)) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ name, url });
  }
  return out;
}

export const airportAccessScraper: Scraper = {
  id: 'airport-access',
  displayName: 'ChatGPT 机场精选评测',
  url: `https://github.com/${REPO}`,
  type: 'review',
  cutoffDays: 60,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const res = await fetchUrl(README_URL, { timeout: 20000 });
      if (!res.ok) throw new Error('README 抓取失败 ' + res.error);
      const tables = parseMarkdownTables(res.body);
      const signupLinks = extractSignupUrls(res.body);
      const scrapedAt = nowIso();
      const entries: VpnEntry[] = [];
      const seen = new Set<string>();
      const knownNames = new Set(signupLinks.map((l) => l.name));

      for (const t of tables) {
        for (const row of t.rows) {
          if (row.length < 2) continue;
          const name = cleanText(row[0]);
          if (!name || name.length < 2 || name.length > 30) continue;
          // 过滤 Markdown 粗体残留、表头词、纯中文短句（场景文案）
          if (name.includes('**')) continue;
          if (/^[-:.\s]+$/.test(name)) continue;
          if (/机场|线路|协议|工具|流媒体|设备|使用|注意|你是|建议|为什么|优惠|入口|快速|内容|场景|套餐|类型|价格|流量|用户|折腾|主力|发掘|推荐列表/i.test(name)) continue;
          // 纯中文且无数字/英文的短句大概率是文案而非机场名
          if (/^[一-龥，。！？、]+$/.test(name) && name.length > 6) continue;
          const id = makeId(name, README_URL + '#' + name);
          if (seen.has(id)) continue;
          seen.add(id);
          const linked = signupLinks.find((l) => name.includes(l.name) || l.name.includes(name));
          const desc = row.slice(1).map(cleanText).filter(Boolean).join(' · ');
          const protoMatch = desc.match(/(Vless|VLESS|Vmess|VMess|Trojan|AnyTLS|Anytls|Hysteria2?|Shadowsocks|SSR|Clash|SS|IPLC|IEPL|BGP)/g);
          entries.push({
            id,
            name,
            type: 'review',
            description: desc,
            signupUrl: linked?.url,
            websiteUrl: linked?.url,
            protocols: protoMatch ? Array.from(new Set(protoMatch.map((p) => p.toLowerCase()))) : undefined,
            sources: ['airport-access'],
            sourceUrls: [README_URL],
            publishedAt: scrapedAt,
            scrapedAt,
            isActive: true,
          });
        }
      }

      for (const link of signupLinks) {
        const id = makeId(link.name, link.url);
        if (seen.has(id)) continue;
        seen.add(id);
        entries.push({
          id,
          name: link.name,
          type: 'review',
          description: 'airport-access 推荐机场',
          signupUrl: link.url,
          websiteUrl: link.url,
          sources: ['airport-access'],
          sourceUrls: [README_URL],
          publishedAt: scrapedAt,
          scrapedAt,
          isActive: true,
        });
      }

      ctx.log(`airport-access: ${entries.length} entries (${signupLinks.length} signup links, ${tables.length} tables)`);
      return { entries, meta: okMeta(this, ctx, entries.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
