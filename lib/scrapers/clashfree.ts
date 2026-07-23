/**
 * clashfree 抓取器
 * 来源：github.com/free-nodes/clashfree（16092★）
 * 每日生成独立 Clash YAML 文件，文件名含日期 clash{YYYYMMDD}.yml
 */
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl } from '../http';
import { nowIso } from '../format';
import { parseClashYaml, clashNodesToEntries } from './clash-yaml';

const RAW_BASE = 'https://raw.githubusercontent.com/free-nodes/clashfree/main';

function getTodayFileUrl(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${RAW_BASE}/clash${yyyy}${mm}${dd}.yml`;
}

function getYesterdayFileUrl(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${RAW_BASE}/clash${yyyy}${mm}${dd}.yml`;
}

export const clashfreeScraper: Scraper = {
  id: 'clashfree',
  displayName: 'clashfree 每日订阅',
  url: 'https://github.com/free-nodes/clashfree',
  type: 'node',
  cutoffDays: 0,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      // 优先尝试今日文件，失败则回退到昨日
      let res = await fetchUrl(getTodayFileUrl(), { timeout: 30000 });
      let fileUrl = getTodayFileUrl();

      if (!res.ok) {
        fileUrl = getYesterdayFileUrl();
        res = await fetchUrl(fileUrl, { timeout: 30000 });
      }

      if (!res.ok) {
        return { entries: [], meta: errMeta(this, ctx, new Error(`HTTP ${res.status}`)) };
      }

      const scrapedAt = nowIso();
      const nodes = parseClashYaml(res.body, 300);
      ctx.log(`clashfree: 解析到 ${nodes.length} 个节点`);

      const entries = clashNodesToEntries(nodes, {
        sourceId: 'clashfree',
        subscriptionUrl: fileUrl,
        scrapedAt,
      });

      // 添加索引条目
      if (entries.length > 0) {
        entries.unshift({
          id: 'clashfree-index',
          name: 'clashfree 每日订阅',
          type: 'index',
          description: `每日更新 Clash 订阅，当前 ${nodes.length} 个节点`,
          nodeCount: nodes.length,
          sources: ['clashfree'],
          sourceUrls: [fileUrl],
          publishedAt: scrapedAt,
          scrapedAt,
          isActive: true,
        });
      }

      return { entries, meta: okMeta(this, ctx, entries.length) };
    } catch (e) {
      return { entries: [], meta: errMeta(this, ctx, e) };
    }
  },
};
