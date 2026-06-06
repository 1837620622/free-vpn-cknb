/**
 * 全局配置：源站列表、抓取窗口、抓取器映射
 */
export interface SourceConfig {
  id: string;
  displayName: string;
  url: string;
  enabled: boolean;
  type: 'trial' | 'free' | 'node' | 'index' | 'dead' | 'review';
  cutoffDays: number;
  description?: string;
}

export const CONFIG = {
  cutoffDays: 15,
  siteName: '免费 VPN 情报站',
  siteShortName: 'VPN情报',
  description: '自动同步多源免费/试用机场与节点信息，后台定时更新',
  cron: '20 19 * * *',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://free-vpn.chuankangkk.top',
  author: {
    wechat: '1837620622',
    nickname: '传康Kk',
    email: '2040168455@qq.com',
    bilibili: '万能程序员',
  },
  sources: {
    ygjc: {
      id: 'ygjc',
      displayName: '一个机场（ygjc.cc）',
      url: 'https://ygjc.cc',
      enabled: true,
      type: 'trial',
      cutoffDays: 60,
      description: '月度合集，含优惠码/流量/协议/节点/注册链接',
    },
    kerrynotes: {
      id: 'kerrynotes',
      displayName: 'Kerry 的学习笔记',
      url: 'https://kerrynotes.com',
      enabled: true,
      type: 'free',
      cutoffDays: 90,
      description: '免费机场表格 + 详细评测',
    },
    waiyiyuyan: {
      id: 'waiyiyuyan',
      displayName: '我爱白嫖（waiyiyuyan）',
      url: 'https://waiyiyuyan.github.io',
      enabled: true,
      type: 'trial',
      cutoffDays: 60,
      description: 'Hexo 月度合集 + atom.xml',
    },
    au1rxx: {
      id: 'au1rxx',
      displayName: 'Au1rxx 验证节点',
      url: 'https://github.com/Au1rxx/free-vpn-subscriptions',
      enabled: true,
      type: 'node',
      cutoffDays: 0,
      description: '每小时 HTTP-over-proxy 验证，按国家/协议分类',
    },
    tonykongcn: {
      id: 'tonykongcn',
      displayName: 'tonykongcn 验证节点',
      url: 'https://github.com/tonykongcn/free-vpn-subscriptions',
      enabled: true,
      type: 'node',
      cutoffDays: 0,
      description: 'Au1rxx fork，节点状态数组格式',
    },
    freenodes: {
      id: 'freenodes',
      displayName: 'FreeNodes 节点池',
      url: 'https://github.com/freenodes/freenodes',
      enabled: true,
      type: 'node',
      cutoffDays: 0,
      description: '4 小时更新，50+ 节点',
    },
    vpnpaihang: {
      id: 'vpnpaihang',
      displayName: 'VPN 排行榜',
      url: 'https://vpnpaihang.github.io',
      enabled: true,
      type: 'node',
      cutoffDays: 15,
      description: '每日 yaml/txt/json 订阅',
    },
    vpnbaike: {
      id: 'vpnbaike',
      displayName: 'VPN 百科',
      url: 'https://vpnbaike.github.io',
      enabled: true,
      type: 'node',
      cutoffDays: 15,
      description: '每日 yaml/txt/json 订阅',
    },
    everett7623: {
      id: 'everett7623',
      displayName: '机场推荐索引 2026',
      url: 'https://github.com/everett7623/airport-recommendations-2026',
      enabled: true,
      type: 'index',
      cutoffDays: 90,
      description: 'GitHub README 表格 23 个机场',
    },
    gfwoff: {
      id: 'gfwoff',
      displayName: 'GFWOFF 跑路名单',
      url: 'https://gfwoff.org',
      enabled: true,
      type: 'dead',
      cutoffDays: 365,
      description: '机场跑路/预警名单',
    },
  } satisfies Record<string, SourceConfig>,
} as const;

export type SourceId = keyof typeof CONFIG.sources;
