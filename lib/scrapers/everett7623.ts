/**
 * everett7623/airport-recommendations-2026 抓取器
 * - GitHub README 表格：23 个机场
 * - 分类标签：免费试用/入门经济/性价比均衡/高端专线/按量计费
 */
import type { VpnEntry } from '../types';
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl, loadHtml, absoluteUrl } from '../http';
import { cleanText, makeId, nowIso } from '../format';

const REPO = 'everett7623/airport-recommendations-2026';
const README_URL = `https://raw.githubusercontent.com/${REPO}/main/README.md`;
const HTML_URL = `https://github.com/${REPO}`;

interface AirportRow {
  category: string;
  name: string;
  url: string | null;
  description: string;
  tags: string[];
}

function parseMarkdownTable(md: string): AirportRow[] {
  const out: AirportRow[] = [];
  const lines = md.split('\n');
  let currentCategory = '';
  for (const raw of lines) {
    const line = raw.trim();
    const h = line.match(/^#{1,6}\s+(.+)$/);
    if (h) {
      currentCategory = cleanText(h[1]);
      continue;
    }
    const row = line.match(/^\|[^\|]*\|[^\|]*\|/);
    if (!row) continue;
    const cells = line.split('|').map((c) => cleanText(c)).filter((c) => c.length > 0);
    if (cells.length < 2) continue;
    if (/^[-:\s]+$/.test(cells[0])) continue;
    if (cells[0] === '机场' || cells[0] === '名称' || cells[0] === 'Name') continue;
    const urlMatch = cells[1].match(/\[([^\]]+)\]\(([^)]+)\)/);
    let name = cells[0];
    let url: string | null = null;
    if (urlMatch) {
      name = cleanText(urlMatch[1]);
      url = urlMatch[2];
    } else if (/^https?:\/\//.test(cells[1])) {
      url = cells[1];
    }
    const description = cells.slice(urlMatch ? 1 : 2).join(' · ');
    const tags: string[] = [];
    if (currentCategory) tags.push(currentCategory);
    out.push({ category: currentCategory, name, url, description, tags });
  }
  return out;
}

export const everett7623Scraper: Scraper = {
  id: 'everett7623',
  displayName: '机场推荐索引 2026',
  url: `https://github.com/${REPO}`,
  type: 'index',
  cutoffDays: 90,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const res = await fetchUrl(README_URL, { timeout: 20000 });
      if (!res.ok) throw new Error('README 抓取失败 ' + res.error);
      const rows = parseMarkdownTable(res.body);
      const scrapedAt = nowIso();
      const entries: VpnEntry[] = rows.map((r) => ({
        id: makeId(r.name, r.url ?? r.name),
        name: r.name,
        type: 'index',
        description: r.description || r.category,
        signupUrl: r.url ?? undefined,
        websiteUrl: r.url ?? undefined,
        tags: r.tags,
        sources: ['everett7623'],
        sourceUrls: [README_URL],
        publishedAt: scrapedAt,
        scrapedAt,
        isActive: true,
      }));

      ctx.log(`everett7623: ${entries.length} airports`);
      return { entries, meta: okMeta(this, ctx, entries.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
