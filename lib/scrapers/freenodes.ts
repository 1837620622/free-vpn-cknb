/**
 * freenodes/freenodes 抓取器
 * - 4 小时更新一次
 * - 主 YAML 节点列表
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl } from '../http';
import { makeId, nowIso } from '../format';

const REPO = 'freenodes/freenodes';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/main`;
const YAML_URLS = [
  `${RAW_BASE}/nodes.yaml`,
  `${RAW_BASE}/nodes.yml`,
  `${RAW_BASE}/README.md`,
];

interface ParsedNode {
  name: string;
  server: string;
  port: number;
  type: string;
}

function parseYamlNodes(yaml: string): ParsedNode[] {
  const out: ParsedNode[] = [];
  const blocks = yaml.split(/^---/m);
  for (const block of blocks) {
    if (!/^proxies:/m.test(block)) continue;
    const lines = block.split('\n');
    let i = lines.findIndex((l) => l.trim() === 'proxies:');
    if (i < 0) continue;
    i++;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.startsWith('  -')) break;
      i++;
      const obj: Record<string, unknown> = {};
      while (i < lines.length && lines[i].startsWith('    ')) {
        const m = lines[i].match(/^    (\w+):\s*(.*)$/);
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
    }
  }
  return out;
}

function parseReadmeNodes(md: string): { name: string; url: string }[] {
  const out: { name: string; url: string }[] = [];
  const re = /^[ \t]*[-*]\s+\[?([^\]\n]+?)\]?\s*\(\s*(https?:\/\/[^\s)]+)\s*\)/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    out.push({ name: m[1].trim(), url: m[2].trim() });
  }
  return out;
}

export const freenodesScraper: Scraper = {
  id: 'freenodes',
  displayName: 'FreeNodes 节点池',
  url: `https://github.com/${REPO}`,
  type: 'node',
  cutoffDays: 0,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const entries: VpnEntry[] = [];
      let totalNodes = 0;
      for (const u of YAML_URLS) {
        const res = await fetchUrl(u, { timeout: 20000 });
        if (!res.ok) continue;
        const scrapedAt = nowIso();
        if (u.endsWith('.yaml') || u.endsWith('.yml')) {
          const nodes = parseYamlNodes(res.body);
          totalNodes += nodes.length;
          for (const n of nodes) {
            entries.push({
              id: makeId(n.name, n.server),
              name: n.name,
              type: 'node',
              description: `${n.type.toUpperCase()} · ${n.server}:${n.port}`,
              subscriptionUrl: u,
              subscriptionFormats: ['clash'],
              protocols: [n.type],
              nodeCount: 1,
              status: 'live',
              sources: ['freenodes'],
              sourceUrls: [u],
              publishedAt: scrapedAt,
              scrapedAt,
              isActive: true,
            });
          }
        } else {
          const links = parseReadmeNodes(res.body);
          totalNodes += links.length;
          for (const l of links) {
            entries.push({
              id: makeId(l.name, l.url),
              name: l.name,
              type: 'node',
              description: 'FreeNodes 节点订阅',
              subscriptionUrl: l.url,
              subscriptionFormats: ['clash'],
              status: 'live',
              sources: ['freenodes'],
              sourceUrls: [u],
              publishedAt: scrapedAt,
              scrapedAt,
              isActive: true,
            });
          }
        }
        if (entries.length > 0) break;
      }

      if (entries.length > 0) {
        entries.unshift({
          id: 'freenodes-index',
          name: 'FreeNodes 节点池统计',
          type: 'index',
          description: `4 小时更新节点池，当前 ${totalNodes} 个节点`,
          nodeCount: totalNodes,
          sources: ['freenodes'],
          sourceUrls: YAML_URLS,
          publishedAt: nowIso(),
          scrapedAt: nowIso(),
          isActive: true,
        });
      }
      ctx.log(`freenodes: ${entries.length} entries (${totalNodes} nodes)`);
      return { entries, meta: okMeta(this, ctx, entries.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
