/**
 * 通用 vpnpaihang/vpnbaike 文章型抓取逻辑
 * - 首页文章列表：/free-nodes/2026-6-6-vpn-github.htm
 * - 文章内提取：机场注册链接、uploads 订阅链接、协议类型
 * - 标题格式：6月6日20.6M/S|免费Shadowrocket节点/Trojan节点/Clash节点...
 * - 订阅路径：/uploads/2026/06/N-20260606.yaml
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl, loadHtml, absoluteUrl } from '../http';
import { makeId, nowIso } from '../format';

export interface ArticleMeta {
  url: string;
  date: string;
  speed: string | null;
  protocols: string[];
  signupUrls: string[];
  subscriptionUrls: string[];
}

function cleanText(s: string | undefined | null): string {
  if (!s) return '';
  return s.replace(/\s+/g, ' ').trim();
}

export async function listArticleUrls(base: string): Promise<string[]> {
  const res = await fetchUrl(base + '/free-nodes/', { timeout: 20000 });
  if (!res.ok) return [];
  const $ = loadHtml(res.body);
  const urls = new Set<string>();
  $('a').each((_i: number, a: any) => {
    const href = $(a).attr('href');
    if (!href) return;
    if (/\/free-nodes\/\d{4}-\d{1,2}-\d{1,2}-[a-z\-]+\.htm/i.test(href)) {
      const abs = absoluteUrl(base + '/', href);
      if (abs) urls.add(abs);
    }
  });
  return Array.from(urls).sort().reverse().slice(0, 15);
}

export async function scrapeArticle(
  base: string,
  url: string
): Promise<ArticleMeta | null> {
  const res = await fetchUrl(url, { timeout: 15000 });
  if (!res.ok) return null;
  const $ = loadHtml(res.body);
  const titleText = cleanText($('title').first().text()) || cleanText($('h1').first().text());
  const dateMatch = titleText.match(/(\d{1,2})月(\d{1,2})日/);
  const speedMatch = titleText.match(/(\d+(?:\.\d+)?)\s*([MGK])\/S/i);
  const protoMatch = titleText.match(/免费([A-Za-z\/\-]+)节点/);
  const protocols = protoMatch
    ? protoMatch[1].split(/[\/／、|]/).map((p) => p.trim().toLowerCase()).filter(Boolean)
    : [];
  const year = new Date().getFullYear();
  const date = dateMatch
    ? `${year}-${dateMatch[1].padStart(2, '0')}-${dateMatch[2].padStart(2, '0')}`
    : new Date().toISOString().slice(0, 10);

  const signupUrls = new Set<string>();
  const subscriptionUrls = new Set<string>();
  $('a').each((_i: number, a: any) => {
    const href = $(a).attr('href');
    if (!href) return;
    const abs = absoluteUrl(url, href);
    if (!abs) return;
    if (/\/uploads\/\d{4}\/\d{2}\/[^\/]+\.(yaml|txt|json)/i.test(abs)) {
      subscriptionUrls.add(abs);
    } else if (new RegExp(`^https?:\\/\\/(?!${base.replace(/\./g, '\\.')}|github\\.com|www\\.gov\\.cn)`, 'i').test(abs) && /register|sign|join|\?code=|#\/register/i.test(abs)) {
      signupUrls.add(abs);
    }
  });

  $('p, code, pre, li, span').each((_i: number, el: any) => {
    const text = $(el).text() || '';
    for (const m of text.matchAll(/(https?:\/\/[^\s<>'"]+\.(yaml|txt|json))/g)) {
      const u = m[1];
      if (/\/uploads\/\d{4}\/\d{2}\//.test(u)) {
        subscriptionUrls.add(u);
      }
    }
  });

  return {
    url,
    date,
    speed: speedMatch ? `${speedMatch[1]}${speedMatch[2].toUpperCase()}/S` : null,
    protocols,
    signupUrls: Array.from(signupUrls).slice(0, 8),
    subscriptionUrls: Array.from(subscriptionUrls),
  };
}

export async function scrapeSubscription(
  url: string
): Promise<{ nodes: { name: string; server: string; port: number; type: string }[]; format: string } | null> {
  const res = await fetchUrl(url, { timeout: 20000 });
  if (!res.ok) return null;
  const format = url.match(/\.(yaml|json|txt)$/i)?.[1].toLowerCase() ?? 'txt';
  const nodes: { name: string; server: string; port: number; type: string }[] = [];

  if (format === 'yaml') {
    const flowRe = /^\s*-\s*\{(.+)\}\s*$/;
    const lines = res.body.split('\n');
    let inProxies = false;
    let cur: Record<string, string> | null = null;
    for (const line of lines) {
      if (/^proxies:\s*$/.test(line)) { inProxies = true; cur = null; continue; }
      if (inProxies && /^[a-zA-Z]/.test(line.trim()) && !line.startsWith('  -') && !line.startsWith('    ')) { inProxies = false; cur = null; }
      if (!inProxies) continue;
      const flow = line.match(flowRe);
      if (flow) {
        if (cur && cur.name && cur.server) nodes.push(cur as any);
        const obj: Record<string, string> = {};
        const inner = flow[1];
        const fieldRe = /(\w[\w-]*):\s*("(?:[^"\\]|\\.)*"|\([^)]*\)|\[[^\]]*\]|[^,}]+)/g;
        let m: RegExpExecArray | null;
        while ((m = fieldRe.exec(inner)) !== null) {
          let v = m[2].trim();
          v = v.replace(/^["']|["']$/g, '');
          obj[m[1]] = v;
        }
        if (obj.name && obj.server) {
          cur = obj;
          nodes.push(cur as any);
        } else {
          cur = obj;
        }
        continue;
      }
      const start = line.match(/^\s*-\s+(\w+):\s*(.*)$/);
      if (start) {
        if (cur && cur.name && cur.server) nodes.push(cur as any);
        cur = { [start[1]]: start[2].trim().replace(/^["']|["']$/g, '') };
        continue;
      }
      const cont = line.match(/^\s{2,}(\w+):\s*(.*)$/);
      if (cont && cur) cur[cont[1]] = cont[2].trim().replace(/^["']|["']$/g, '');
      else if (line.trim() === '' && cur) {
        if (cur.name && cur.server) nodes.push(cur as any);
        cur = null;
      }
    }
    if (cur && cur.name && cur.server) nodes.push(cur as any);
  } else if (format === 'json') {
    try {
      const data = JSON.parse(res.body);
      const arr = Array.isArray(data) ? data : data.proxies ?? data.outbounds ?? data.nodes ?? [];
      for (const n of arr) {
        if (n?.name && n?.server) {
          nodes.push({ name: String(n.name), server: String(n.server), port: Number(n.port ?? n.server_port ?? 0), type: String(n.type ?? n.protocol ?? 'unknown') });
        }
      }
    } catch { /* skip */ }
  } else {
    for (const line of res.body.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#') || t.startsWith('//')) continue;
      const m = t.match(/^([a-z0-9]+):\/\/([^:]+):(\d+)(?:#(.+))?$/i);
      if (m) {
        nodes.push({ name: m[4]?.trim() || `${m[1]}-${m[2]}`, server: m[2], port: Number(m[3]), type: m[1] });
        continue;
      }
      const b = t.match(/^vmess:\/\/([A-Za-z0-9+/=]{20,})$/);
      if (b) {
        try {
          const raw = Buffer.from(b[1], 'base64').toString('utf-8');
          const j = JSON.parse(raw);
          if (j.add && j.port && j.id) nodes.push({ name: j.ps || `vmess-${j.add}`, server: j.add, port: Number(j.port), type: 'vmess' });
        } catch { /* skip */ }
      }
    }
  }
  return { nodes, format };
}

export function makeArticleScraper(
  base: string,
  id: string,
  displayName: string,
  type: 'node' | 'review',
  cutoffDays: number
): Scraper {
  return {
    id,
    displayName,
    url: base,
    type,
    cutoffDays,
    async run(ctx: ScraperContext): Promise<ScraperResult> {
      try {
        const articleUrls = await listArticleUrls(base);
        ctx.log(`${id}: ${articleUrls.length} articles`);
        const articles: ArticleMeta[] = [];
        for (const u of articleUrls) {
          try {
            const a = await scrapeArticle(base, u);
            if (a) articles.push(a);
          } catch { /* skip */ }
          await new Promise((r) => setTimeout(r, 200));
        }

        const entries: VpnEntry[] = [];
        let totalNodes = 0;
        for (const a of articles.slice(0, 7)) {
          try {
            const publishedAt = a.date + 'T00:00:00+08:00';
            for (const sub of a.subscriptionUrls.slice(0, 2)) {
              let r: Awaited<ReturnType<typeof scrapeSubscription>> = null;
              try {
                r = await scrapeSubscription(sub);
              } catch { continue; }
              if (!r) continue;
              totalNodes += r.nodes.length;
              for (const n of r.nodes.slice(0, 60)) {
                const proto = (n.type || 'unknown').toLowerCase();
                entries.push({
                  id: makeId(n.name, n.server),
                  name: n.name,
                  type: 'node',
                  description: `${proto.toUpperCase()} · ${n.server}:${n.port}${a.speed ? ' · ' + a.speed : ''}`,
                  subscriptionUrl: sub,
                  subscriptionFormats: [r.format],
                  protocols: [proto],
                  nodeCount: 1,
                  status: 'live',
                  speed: a.speed ?? undefined,
                  sources: [id],
                  sourceUrls: [a.url, sub],
                  publishedAt,
                  scrapedAt: nowIso(),
                  isActive: true,
                });
              }
              if (entries.length > 0) break;
            }
            await new Promise((r) => setTimeout(r, 200));
            for (const reg of a.signupUrls) {
              let name = reg;
              try {
                const u = new URL(reg);
                name = u.hostname.replace(/^www\./, '').split('.')[0] || u.hostname;
              } catch { /* keep */ }
              entries.push({
                id: makeId(name, reg),
                name,
                type: 'trial',
                description: `${displayName} 推荐机场 · ${a.protocols.join('/')} · ${a.speed ?? ''}`,
                signupUrl: reg,
                websiteUrl: reg,
                protocols: a.protocols.length > 0 ? a.protocols : undefined,
                speed: a.speed ?? undefined,
                sources: [id],
                sourceUrls: [a.url],
                publishedAt,
                scrapedAt: nowIso(),
                isActive: true,
              });
            }
          } catch { /* skip article */ }
          await new Promise((r) => setTimeout(r, 200));
        }

        if (entries.length > 0) {
          entries.unshift({
            id: `${id}-index`,
            name: `${displayName}日榜`,
            type: 'index',
            description: `最近 ${articles.length} 天日榜节点，共 ${totalNodes} 个有效节点`,
            nodeCount: totalNodes,
            sources: [id],
            sourceUrls: articleUrls,
            publishedAt: nowIso(),
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
}
