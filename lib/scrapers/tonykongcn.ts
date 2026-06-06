/**
 * tonykongcn/free-vpn-subscriptions 抓取器
 * - Au1rxx 的 fork，status.json 格式不同
 * - 节点状态数组：[ {name, region, protocol, public_ip, port, status, latency_ms, last_check_at} ]
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchJson, fetchUrl } from '../http';
import { makeId, nowIso } from '../format';

const REPO = 'tonykongcn/free-vpn-subscriptions';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/main`;
const STATUS_URL = `${RAW_BASE}/output/status.json`;
const CLASH_URL = `${RAW_BASE}/output/clash.yaml`;

interface TonyKongNode {
  name: string;
  region?: string;
  protocol?: string;
  public_ip?: string;
  port?: number;
  status?: 'live' | 'dead' | 'unknown';
  latency_ms?: number;
  last_check_at?: string;
}

function parseClashYaml(yaml: string): { name: string; server: string; port: number; type: string }[] {
  const out: { name: string; server: string; port: number; type: string }[] = [];
  const lines = yaml.split('\n');
  let inProxies = false;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^proxies:\s*$/.test(line)) { inProxies = true; i++; continue; }
    if (inProxies) {
      if (/^\S/.test(line) && line.trim() && !line.startsWith(' ') && !line.startsWith('\t')) {
        inProxies = false; i++; continue;
      }
      const start = line.match(/^(\s*)-\s*(.*)$/);
      if (start) {
        const baseIndent = start[1].length;
        const obj: Record<string, unknown> = {};
        if (start[2] && start[2].includes(':')) {
          const m = start[2].match(/^(\w+):\s*(.*)$/);
          if (m) obj[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
        }
        i++;
        const childIndent = baseIndent + 2;
        while (i < lines.length) {
          const cl = lines[i];
          if (!cl.trim()) { i++; continue; }
          if (!cl.startsWith(' '.repeat(childIndent))) break;
          const m = cl.match(/^\s+(\w[\w-]*):\s*(.*)$/);
          if (m) obj[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
          i++;
        }
        if (obj.name && obj.server) {
          out.push({
            name: String(obj.name),
            server: String(obj.server),
            port: Number(obj.port ?? 0),
            type: String(obj.type ?? 'unknown'),
          });
        }
        continue;
      }
    }
    i++;
  }
  return out;
}

export const tonykongcnScraper: Scraper = {
  id: 'tonykongcn',
  displayName: 'tonykongcn 验证节点',
  url: `https://github.com/${REPO}`,
  type: 'node',
  cutoffDays: 0,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const [status, clashRes] = await Promise.all([
        fetchJson<TonyKongNode[] | { nodes: TonyKongNode[] }>(STATUS_URL),
        fetchUrl(CLASH_URL, { timeout: 30000 }),
      ]);
      if (!clashRes.ok) throw new Error('clash.yaml 抓取失败 ' + clashRes.error);

      const nodes = parseClashYaml(clashRes.body);
      const statusArr: TonyKongNode[] = Array.isArray(status)
        ? status
        : status && 'nodes' in status
          ? status.nodes
          : [];
      const statusMap = new Map(statusArr.map((n) => [n.name, n]));

      ctx.log(`tonykongcn: ${nodes.length} nodes, status=${statusArr.length}`);

      const scrapedAt = nowIso();
      const entries: VpnEntry[] = nodes.map((n) => {
        const meta = statusMap.get(n.name);
        return {
          id: makeId(n.name, n.server),
          name: n.name,
          type: 'node',
          description: `${n.type.toUpperCase()} · ${meta?.region ?? '?'} · ${n.server}:${n.port}${meta?.latency_ms ? ` · ${meta.latency_ms}ms` : ''}`,
          subscriptionUrl: CLASH_URL,
          subscriptionFormats: ['clash'],
          protocols: [n.type],
          regions: meta?.region ? [meta.region] : undefined,
          nodeCount: 1,
          status: meta?.status ?? 'unknown',
          latencyMs: meta?.latency_ms,
          sources: ['tonykongcn'],
          sourceUrls: [STATUS_URL, CLASH_URL],
          publishedAt: meta?.last_check_at ?? scrapedAt,
          scrapedAt,
          isActive: meta?.status === 'live' || meta?.status === undefined,
        };
      });

      const liveCount = statusArr.filter((n) => n.status === 'live').length;
      entries.unshift({
        id: 'tonykongcn-index',
        name: 'tonykongcn 节点池统计',
        type: 'index',
        description: `Au1rxx fork 节点池，${liveCount}/${statusArr.length} 在线`,
        nodeCount: liveCount,
        sources: ['tonykongcn'],
        sourceUrls: [STATUS_URL, CLASH_URL],
        publishedAt: scrapedAt,
        scrapedAt,
        isActive: true,
      });

      return { entries, meta: okMeta(this, ctx, entries.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
