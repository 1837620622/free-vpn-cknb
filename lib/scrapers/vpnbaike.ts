/**
 * vpnbaike.github.io 抓取器（使用 article-base 共享逻辑）
 */
import { makeArticleScraper } from './article-base';

export const vpnbaikeScraper = makeArticleScraper(
  'https://vpnbaike.github.io',
  'vpnbaike',
  'VPN 百科',
  'node',
  15
);
