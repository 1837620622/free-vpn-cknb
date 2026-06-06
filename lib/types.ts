/**
 * 统一数据模型：所有抓取器输出此结构
 */
export type VpnType = 'trial' | 'free' | 'node' | 'index' | 'review' | 'dead';

export interface VpnEntry {
  id: string;
  name: string;
  type: VpnType;
  description?: string;
  notice?: string;

  // T1 官方信息
  signupUrl?: string;
  websiteUrl?: string;
  couponCode?: string;
  inviteCode?: string;
  telegramGroup?: string;
  telegramChannel?: string;

  // 套餐
  traffic?: string;
  period?: string;
  price?: string;
  protocols?: string[];
  regions?: string[];

  // 节点
  speed?: string;
  nodeCount?: number;
  subscriptionUrl?: string;
  subscriptionFormats?: string[];
  latencyMs?: number;
  status?: 'live' | 'dead' | 'unknown';

  // 跑路
  warningLevel?: string;
  warningDate?: string;

  // 评测
  rating?: number;
  tags?: string[];

  // 元数据
  sources: string[];
  sourceUrls: string[];
  publishedAt: string;
  scrapedAt: string;
  isActive: boolean;
  raw?: unknown;
}

export interface SourceMeta {
  id: string;
  displayName: string;
  url: string;
  lastRunAt: string;
  lastSuccess: boolean;
  itemsScraped: number;
  errorMessage?: string;
  cutoffDays: number;
}

export interface Meta {
  generatedAt: string;
  totalActive: number;
  totalDead: number;
  totalByType: Record<VpnType, number>;
  totalBySource: Record<string, number>;
  sources: SourceMeta[];
  cutoffDays: number;
}

export interface DataFile {
  entries: VpnEntry[];
  meta: Meta;
}

export const VALID_PROTOCOLS = new Set([
  'clash',
  'v2ray',
  'trojan',
  'ssr',
  'shadowsocks',
  'ss',
  'hysteria',
  'hysteria2',
  'vless',
  'vmess',
  'anytls',
  'reality',
  'tuic',
]);

export const VALID_TYPES: VpnType[] = ['trial', 'free', 'node', 'index', 'review', 'dead'];

export const TYPE_LABELS: Record<VpnType, string> = {
  trial: '试用机场',
  free: '免费机场',
  node: '实时节点',
  index: '机场索引',
  review: '机场评测',
  dead: '跑路名单',
};
