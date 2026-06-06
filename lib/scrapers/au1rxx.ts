/**
 * Au1rxx/free-vpn-subscriptions 抓取器
 * - 主文件：clash.yaml
 * - 状态文件：status.json（含 total/by_country/by_protocol/by_source/median_latency）
 * - 节点命名："01-shadowsocks-🇺🇸 Join Telegram:@Farah_VPN 🇺🇸"
 * - by_country/by_protocol 远端文件 404，仅用主文件
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchJson, fetchUrl } from '../http';
import { makeId, nowIso } from '../format';

const REPO = 'Au1rxx/free-vpn-subscriptions';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/main`;
const STATUS_URL = `${RAW_BASE}/output/status.json`;
const CLASH_URL = `${RAW_BASE}/output/clash.yaml`;

interface Au1rxxStatus {
  generated_at?: string;
  total_fetched?: number;
  total_alive?: number;
  total_verified?: number;
  total_selected?: number;
  by_country?: Record<string, number>;
  by_protocol?: Record<string, number>;
  by_source?: Record<string, number>;
  median_latency_ms?: number;
  min_latency_ms?: number;
}

interface Au1rxxNode {
  name: string;
  server: string;
  port: number;
  type: string;
  cipher?: string;
  password?: string;
  uuid?: string;
  network?: string;
  udp?: boolean;
}

function parseClashYaml(yaml: string): Au1rxxNode[] {
  const nodes: Au1rxxNode[] = [];
  const lines = yaml.split('\n');
  let inProxies = false;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^proxies:\s*$/.test(line)) {
      inProxies = true;
      i++;
      continue;
    }
    if (inProxies) {
      if (/^\S/.test(line) && line.trim() && !line.startsWith(' ') && !line.startsWith('\t')) {
        inProxies = false;
        i++;
        continue;
      }
      const start = line.match(/^(\s*)-\s*(.*)$/);
      if (start) {
        const baseIndent = start[1].length;
        const obj: Record<string, unknown> = {};
        if (start[2] && start[2].includes(':')) {
          const m = start[2].match(/^(\w+):\s*(.*)$/);
          if (m) {
            let v: string | boolean = m[2].trim();
            if (v === 'true') v = true;
            else if (v === 'false') v = false;
            else v = v.replace(/^["']|["']$/g, '');
            obj[m[1]] = v;
          }
        }
        i++;
        const childIndent = baseIndent + 2;
        while (i < lines.length) {
          const cl = lines[i];
          if (!cl.trim()) { i++; continue; }
          if (!cl.startsWith(' '.repeat(childIndent))) break;
          const m = cl.match(/^\s+(\w[\w-]*):\s*(.*)$/);
          if (m) {
            let v: string | boolean = m[2].trim();
            if (v === 'true') v = true;
            else if (v === 'false') v = false;
            else v = v.replace(/^["']|["']$/g, '');
            obj[m[1]] = v;
          }
          i++;
        }
        if (obj.name && obj.server) {
          nodes.push(obj as unknown as Au1rxxNode);
        }
        continue;
      }
    }
    i++;
  }
  return nodes;
}

function extractFromName(name: string): {
  protocol: string;
  region: string;
  tg: string | null;
} {
  const protocolMatch = name.match(/(shadowsocks|vmess|vless|trojan|ssr|hysteria|tuic|anytls|reality)/i);
  const protocol = protocolMatch?.[1]?.toLowerCase() ?? 'unknown';
  const emojiMatch = name.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u);
  let region = '未知';
  if (emojiMatch) {
    const points = emojiMatch[0].codePointAt(0)! - 0x1f1e6 + 65;
    const points2 = emojiMatch[0].codePointAt(2)! - 0x1f1e6 + 65;
    region = String.fromCharCode(points) + String.fromCharCode(points2);
  } else {
    const regionNames = ['US', 'JP', 'SG', 'HK', 'TW', 'KR', 'UK', 'DE', 'FR', 'CA', 'AU', 'IN', 'RU', 'TR', 'BR', 'AR', 'IT', 'ES', 'NL', 'CH', 'SE', 'PL', 'IL', 'AE', 'SA', 'MY', 'TH', 'VN', 'PH', 'ID', 'MX', 'ZA'];
    const found = regionNames.find((r) => new RegExp(`\\b${r}\\b|${r}\\s|${r}$`, 'i').test(name));
    if (found) region = found;
  }
  const tgMatch = name.match(/Telegram[:：]?@?([A-Za-z0-9_]{3,30})/i);
  const tg = tgMatch ? `https://t.me/${tgMatch[1]}` : null;
  return { protocol, region, tg };
}

export const au1rxxScraper: Scraper = {
  id: 'au1rxx',
  displayName: 'Au1rxx 验证节点',
  url: `https://github.com/${REPO}`,
  type: 'node',
  cutoffDays: 0,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const [status, clashRes] = await Promise.all([
        fetchJson<Au1rxxStatus>(STATUS_URL),
        fetchUrl(CLASH_URL, { timeout: 30000 }),
      ]);
      if (!clashRes.ok) {
        throw new Error('clash.yaml 抓取失败 ' + clashRes.error);
      }
      const nodes = parseClashYaml(clashRes.body);
      ctx.log(`au1rxx: ${nodes.length} nodes, status=${status?.total_alive ?? '?'}`);

      const scrapedAt = status?.generated_at ?? nowIso();
      const entries: VpnEntry[] = nodes.map((n) => {
        const { protocol, region, tg } = extractFromName(n.name);
        return {
          id: makeId(n.name, n.server),
          name: n.name,
          type: 'node',
          description: `${protocol.toUpperCase()} · ${region} · ${n.server}:${n.port}`,
          subscriptionUrl: CLASH_URL,
          subscriptionFormats: ['clash'],
          protocols: [protocol],
          regions: [region],
          nodeCount: 1,
          traffic: undefined,
          status: 'live',
          sources: ['au1rxx'],
          sourceUrls: [CLASH_URL],
          publishedAt: scrapedAt,
          scrapedAt: nowIso(),
          isActive: true,
          telegramChannel: tg ?? undefined,
          latencyMs: status?.median_latency_ms,
        };
      });

      if (status) {
        entries.unshift({
          id: 'au1rxx-index',
          name: 'Au1rxx 节点池统计',
          type: 'index',
          description: `实时节点池，共 ${status.total_alive ?? '?'}/${status.total_fetched ?? '?'} 在线，${status.total_verified ?? '?'} 验证通过，中位延迟 ${status.median_latency_ms ?? '?'}ms`,
          nodeCount: status.total_alive,
          protocols: status.by_protocol ? Object.keys(status.by_protocol) : undefined,
          regions: status.by_country ? Object.keys(status.by_country) : undefined,
          sources: ['au1rxx'],
          sourceUrls: [STATUS_URL, CLASH_URL],
          publishedAt: scrapedAt,
          scrapedAt: nowIso(),
          isActive: true,
        });
      }

      return { entries, meta: okMeta(this, ctx, entries.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
