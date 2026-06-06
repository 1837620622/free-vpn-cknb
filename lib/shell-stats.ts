/**
 * 服务端组件统一读取 stats 的 helper
 */
import { getEntries, getMeta } from './read-data';
import { getSiteStats, getCronText, getSiteName, formatUpdatedAt, getWindowText } from './site-text';
import { CONFIG } from './config';

export function getShellStats() {
  const meta = getMeta();
  const entries = getEntries();
  const s = getSiteStats(meta, entries);
  return {
    totalActive: s.totalActive,
    totalSources: s.totalSources,
    realtime24h: s.realtime24h,
    updatedAt: formatUpdatedAt(s.generatedAt),
    cronText: getCronText(),
    siteName: getSiteName(),
    windowText: getWindowText(),
    author: CONFIG.author,
  };
}
