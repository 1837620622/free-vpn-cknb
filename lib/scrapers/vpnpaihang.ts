/**
 * vpnpaihang.github.io 抓取器（使用 article-base 共享逻辑）
 */
import { makeArticleScraper } from './article-base';

export const vpnpaihangScraper = makeArticleScraper(
  'https://vpnpaihang.github.io',
  'vpnpaihang',
  'VPN 排行榜',
  'node',
  15
);
