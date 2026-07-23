/**
 * AutoMergePublicNodes 抓取器
 * 来源：github.com/chengaopan/AutoMergePublicNodes（7793★）
 * 每日自动聚合互联网公开节点，输出标准 Clash YAML
 */
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl } from '../http';
import { nowIso } from '../format';
import { parseClashYaml, clashNodesToEntries } from './clash-yaml';

const YAML_URL = 'https://raw.githubusercontent.com/chengaopan/AutoMergePublicNodes/master/list.yml';

export const automergeScraper: Scraper = {
  id: 'automerge',
  displayName: 'AutoMerge 公开节点池',
  url: 'https://github.com/chengaopan/AutoMergePublicNodes',
  type: 'node',
  cutoffDays: 0,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const res = await fetchUrl(YAML_URL, { timeout: 30000 });
      if (!res.ok) {
        return { entries: [], meta: errMeta(this, ctx, new Error(`HTTP ${res.status}`)) };
      }

      const scrapedAt = nowIso();
      const nodes = parseClashYaml(res.body, 300);
      ctx.log(`automerge: 解析到 ${nodes.length} 个节点`);

      const entries = clashNodesToEntries(nodes, {
        sourceId: 'automerge',
        subscriptionUrl: YAML_URL,
        scrapedAt,
      });

      // 添加索引条目
      if (entries.length > 0) {
        entries.unshift({
          id: 'automerge-index',
          name: 'AutoMerge 公开节点池',
          type: 'index',
          description: `每日自动聚合公开节点，当前 ${nodes.length} 个可用节点`,
          nodeCount: nodes.length,
          sources: ['automerge'],
          sourceUrls: [YAML_URL],
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
