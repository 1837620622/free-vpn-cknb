/**
 * FreeSub 公益订阅池抓取器
 * 来源：github.com/ovmvo/FreeSub
 * sub/latest/ 目录存放最新订阅，标准 Clash YAML
 */
import type { Scraper, ScraperContext, ScraperResult } from './base';
import { okMeta, errMeta } from './base';
import { fetchUrl } from '../http';
import { nowIso } from '../format';
import { parseClashYaml, clashNodesToEntries } from './clash-yaml';

const YAML_URL = 'https://raw.githubusercontent.com/ovmvo/FreeSub/main/sub/latest/97429999.yaml';

export const freesubScraper: Scraper = {
  id: 'freesub',
  displayName: 'FreeSub 公益订阅池',
  url: 'https://github.com/ovmvo/FreeSub',
  type: 'node',
  cutoffDays: 0,
  async run(ctx: ScraperContext): Promise<ScraperResult> {
    try {
      const res = await fetchUrl(YAML_URL, { timeout: 30000 });
      if (!res.ok) {
        return { entries: [], meta: errMeta(this, ctx, new Error(`HTTP ${res.status}`)) };
      }

      const scrapedAt = nowIso();
      const nodes = parseClashYaml(res.body, 200);
      ctx.log(`freesub: 解析到 ${nodes.length} 个节点`);

      const entries = clashNodesToEntries(nodes, {
        sourceId: 'freesub',
        subscriptionUrl: YAML_URL,
        scrapedAt,
      });

      // 添加索引条目
      if (entries.length > 0) {
        entries.unshift({
          id: 'freesub-index',
          name: 'FreeSub 公益订阅池',
          type: 'index',
          description: `公益订阅池，当前 ${nodes.length} 个可用节点`,
          nodeCount: nodes.length,
          sources: ['freesub'],
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
