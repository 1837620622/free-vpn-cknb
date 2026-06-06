/**
 * 线上运行入口：复用 OpenNext 生成的 fetch，同时加入定时抓取。
 */
// @ts-ignore .open-next/worker.js 由 opennextjs-cloudflare build 生成
import { default as handler } from './.open-next/worker.js';
import { runScrapeJob } from './lib/run-scrape';
import type { VpnEntry } from './lib/types';

const DATA_KEY = 'vpn:data';
const HASH_KEY = 'vpn:hash';
const LAST_RUN_KEY = 'vpn:last-run';

type StableEntry = Pick<
  VpnEntry,
  | 'id'
  | 'name'
  | 'type'
  | 'description'
  | 'notice'
  | 'signupUrl'
  | 'websiteUrl'
  | 'couponCode'
  | 'inviteCode'
  | 'telegramGroup'
  | 'telegramChannel'
  | 'traffic'
  | 'period'
  | 'price'
  | 'speed'
  | 'nodeCount'
  | 'subscriptionUrl'
  | 'latencyMs'
  | 'status'
  | 'warningLevel'
  | 'warningDate'
  | 'rating'
  | 'publishedAt'
  | 'isActive'
>;

function stableSignature(entries: VpnEntry[]): string {
  const stable = entries
    .map((entry): StableEntry & { protocols?: string[]; regions?: string[]; subscriptionFormats?: string[]; tags?: string[]; sources: string[]; sourceUrls: string[] } => ({
      id: entry.id,
      name: entry.name,
      type: entry.type,
      description: entry.description,
      notice: entry.notice,
      signupUrl: entry.signupUrl,
      websiteUrl: entry.websiteUrl,
      couponCode: entry.couponCode,
      inviteCode: entry.inviteCode,
      telegramGroup: entry.telegramGroup,
      telegramChannel: entry.telegramChannel,
      traffic: entry.traffic,
      period: entry.period,
      price: entry.price,
      speed: entry.speed,
      nodeCount: entry.nodeCount,
      subscriptionUrl: entry.subscriptionUrl,
      latencyMs: entry.latencyMs,
      status: entry.status,
      warningLevel: entry.warningLevel,
      warningDate: entry.warningDate,
      rating: entry.rating,
      publishedAt: entry.publishedAt,
      isActive: entry.isActive,
      protocols: [...(entry.protocols ?? [])].sort(),
      regions: [...(entry.regions ?? [])].sort(),
      subscriptionFormats: [...(entry.subscriptionFormats ?? [])].sort(),
      tags: [...(entry.tags ?? [])].sort(),
      sources: [...entry.sources].sort(),
      sourceUrls: [...entry.sourceUrls].sort(),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
  return JSON.stringify(stable);
}

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function refreshVpnData(env: CloudflareEnv, cron: string) {
  const logs: string[] = [];
  const result = await runScrapeJob({
    logger: {
      log(msg: string) {
        logs.push(msg);
        console.log(msg);
      },
    },
  });

  const nextHash = await sha256Hex(stableSignature(result.data.entries));
  const oldHash = await env.VPN_DATA.get(HASH_KEY);
  const changed = oldHash !== nextHash;
  if (changed) {
    await env.VPN_DATA.put(DATA_KEY, JSON.stringify(result.data));
    await env.VPN_DATA.put(HASH_KEY, nextHash);
  }

  await env.VPN_DATA.put(
    LAST_RUN_KEY,
    JSON.stringify({
      cron,
      changed,
      hash: nextHash,
      generatedAt: result.data.meta.generatedAt,
      totalActive: result.data.meta.totalActive,
      logs: logs.slice(-20),
    })
  );

  return result.data.meta;
}

export default {
  fetch: handler.fetch,

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(refreshVpnData(env, controller.cron));
  },
} satisfies ExportedHandler<CloudflareEnv>;

// @ts-ignore .open-next/worker.js 由 opennextjs-cloudflare build 生成
export { DOQueueHandler, DOShardedTagCache } from './.open-next/worker.js';
