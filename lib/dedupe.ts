/**
 * 去重与合并：按 ID（SHA1）合并多源同一机场
 */
import type { VpnEntry } from './types';

export function dedupe(entries: VpnEntry[]): VpnEntry[] {
  const map = new Map<string, VpnEntry>();
  for (const e of entries) {
    const existing = map.get(e.id);
    if (!existing) {
      map.set(e.id, { ...e });
      continue;
    }
    map.set(e.id, mergeEntries(existing, e));
  }
  return Array.from(map.values());
}

function mergeEntries(a: VpnEntry, b: VpnEntry): VpnEntry {
  return {
    ...a,
    ...b,
    name: a.name || b.name,
    description: a.description || b.description,
    notice: a.notice || b.notice,
    signupUrl: a.signupUrl || b.signupUrl,
    websiteUrl: a.websiteUrl || b.websiteUrl,
    couponCode: a.couponCode || b.couponCode,
    inviteCode: a.inviteCode || b.inviteCode,
    telegramGroup: a.telegramGroup || b.telegramGroup,
    telegramChannel: a.telegramChannel || b.telegramChannel,
    traffic: a.traffic || b.traffic,
    period: a.period || b.period,
    price: a.price || b.price,
    speed: a.speed || b.speed,
    nodeCount: Math.max(a.nodeCount ?? 0, b.nodeCount ?? 0),
    subscriptionUrl: a.subscriptionUrl || b.subscriptionUrl,
    warningLevel: a.warningLevel || b.warningLevel,
    warningDate: a.warningDate || b.warningDate,
    rating: a.rating ?? b.rating,
    protocols: uniqArr([...(a.protocols ?? []), ...(b.protocols ?? [])]),
    regions: uniqArr([...(a.regions ?? []), ...(b.regions ?? [])]),
    subscriptionFormats: uniqArr([
      ...(a.subscriptionFormats ?? []),
      ...(b.subscriptionFormats ?? []),
    ]),
    tags: uniqArr([...(a.tags ?? []), ...(b.tags ?? [])]),
    sources: uniqArr([...a.sources, ...b.sources]),
    sourceUrls: uniqArr([...a.sourceUrls, ...b.sourceUrls]),
    publishedAt: earliestIso(a.publishedAt, b.publishedAt),
    scrapedAt: latestIso(a.scrapedAt, b.scrapedAt),
  };
}

function uniqArr<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function earliestIso(a: string, b: string): string {
  try {
    return new Date(a).getTime() <= new Date(b).getTime() ? a : b;
  } catch {
    return a;
  }
}

function latestIso(a: string, b: string): string {
  try {
    return new Date(a).getTime() >= new Date(b).getTime() ? a : b;
  } catch {
    return a;
  }
}

/**
 * 标记 isActive：与跑路名单交叉
 * - dead 条目本身是展示内容（跑路名单页），保持 isActive=true
 * - 与跑路名单匹配的正常条目标记为 isActive=false，不在正常列表展示
 */
export function applyDeadList(entries: VpnEntry[]): VpnEntry[] {
  const deadNames = new Set<string>();
  for (const e of entries) {
    if (e.type === 'dead') deadNames.add(normalizeForMatch(e.name));
  }
  return entries.map((e) => {
    if (e.type === 'dead') return { ...e, isActive: true };
    const key = normalizeForMatch(e.name);
    return { ...e, isActive: !deadNames.has(key) };
  });
}

function normalizeForMatch(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/机场|加速|加速器|node|cloud|net|vpn/g, '')
    .trim();
}
