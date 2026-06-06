# CK 免费 VPN 搜集

> **今日可用 / 免费 / 试用 VPN 一站找全。**
> 每 6 小时自动从 12 个公开渠道抓取，15 天滚动去重，自动归档失活节点。

<p align="left">
  <a href="https://github.com/1837620622/freevpn-cknb-ckk/stargazers"><img src="https://img.shields.io/github/stars/1837620622/freevpn-cknb-ckk?style=for-the-badge" alt="Stars"></a>
  <a href="https://github.com/1837620622/freevpn-cknb-ckk/network/members"><img src="https://img.shields.io/github/forks/1837620622/freevpn-cknb-ckk?style=for-the-badge" alt="Forks"></a>
  <a href="https://github.com/1837620622/freevpn-cknb-ckk/blob/main/LICENSE"><img src="https://img.shields.io/github/license/1837620622/freevpn-cknb-ckk?style=for-the-badge" alt="License"></a>
  <a href="https://github.com/1837620622/freevpn-cknb-ckk/actions/workflows/scrape.yml"><img src="https://img.shields.io/github/actions/workflow/status/1837620622/freevpn-cknb-ckk/scrape.yml?style=for-the-badge&label=scrape" alt="Scrape"></a>
</p>

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-15.5-000?style=flat-square&logo=nextdotjs" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Cheerio-1.1-E88C30?style=flat-square" alt="Cheerio">
  <img src="https://img.shields.io/badge/Vercel-Ready-000?style=flat-square&logo=vercel" alt="Vercel">
  <img src="https://img.shields.io/badge/GitHub_Actions-6h_Cron-2088FF?style=flat-square&logo=githubactions" alt="Actions">
</p>

---

## 它解决什么

网上零散的"免费 VPN 列表"有几个通病：**抓一次再也不更新 / 链接 70% 已失效 / 不区分试用和跑路 / 需要翻 20 个站点对比**。

本项目把这条链路自动化：

1. **抓**：GitHub Actions 每 6 小时跑一次抓取器（覆盖 12 个公开渠道，含机场测速榜、节点池 wiki、Telegram 频道）。
2. **存**：抓到的条目按 `SHA1(name+signupUrl)` 去重，15 天内出现的才展示，超过 15 天自动归档。
3. **显**：静态站点（Next.js 15 App Router）每 6 小时跟着 `data/vpns.json` 重新部署一次，全程零人工。

## 主要功能

| 功能 | 说明 |
| --- | --- |
| **双主题** | 跟随系统 / 日间 / 夜间三态切换，localStorage 记忆，首屏防闪烁 |
| **5 级新鲜度** | 实时 (< 24h) / 今日 (< 3d) / 本周 (< 7d) / 近期 (< 15d) / 隐藏 (> 15d) |
| **6 种 type** | `trial` 试用 / `free` 免费 / `node` 节点池 / `review` 评测 / `index` 索引站 / `dead` 已跑路，每种独立配色 |
| **去重** | 同名同 URL 的条目只保留最近一次 |
| **自动归档** | 15 天没出现的条目自动进 `dead` 列表，不在首页噪声 |
| **协议解析** | 自动识别 SS / SSR / Trojan / VMess / VLESS / Hysteria / Clash / Shadowrocket |
| **按地区聚合** | 节点自动归类 HK / US / JP / SG 等常用地区 |
| **响应式** | 移动端单列 drawer，桌面多列 grid |
| **可配置** | 源清单、抓取频率、滚动窗口天数、站点名/描述全部走 config，不写死 |

## 技术栈

- **前端**：Next.js 15.5（App Router） + React 19 + TypeScript 5.6 + Tailwind 3.4
- **抓取**：Node.js 20 + Cheerio 1.1（无 headless browser，秒级完成全量抓取）
- **调度**：GitHub Actions（`0 */6 * * *`）
- **部署**：Vercel（静态导出，CDN 缓存）
- **去重**：`crypto` SHA1
- **编码**：GB18030 自动嗅探（兼容国内老站）

## 仓库结构

```
.
├── app/                        # Next.js 15 App Router
│   ├── page.tsx                # 首页（巨号标题 + 4 stats + 5 sections）
│   ├── trial/ free/ nodes/     # 按 type 分页
│   ├── reviews/ dead/          # 评测 + 跑路归档
│   ├── daily/                  # 日报（4 段时间段）
│   ├── sources/                # 12 个数据源状态
│   ├── about/                  # 关于
│   ├── vpn/[id]/               # 详情页
│   ├── layout.tsx              # 双主题 root layout + themeBootstrap
│   └── globals.css             # CSS 变量系统
├── components/
│   └── ui/
│       ├── SiteShell.tsx       # 全局 layout（header/footer/drawer）
│       ├── ThemeToggle.tsx     # 主题切换 + localStorage
│       ├── VpnCard.tsx         # 卡片（顶部主题色条 + 状态行）
│       ├── ListPage.tsx        # 列表页通用壳
│       ├── FreshnessBadge.tsx  # 5 级新鲜度
│       ├── TypeChip.tsx        # type chip（color-mix 适配明暗）
│       ├── GradientBg.tsx      # 双主题背景（CSS 变量驱动）
│       └── Icon.tsx            # Lucide 风格 SVG 库
├── lib/
│   ├── config.ts               # 12 源 + cron + cutoffDays
│   ├── types.ts                # VpnEntry / SourceMeta / Meta
│   ├── site-text.ts            # 动态文案 helper
│   ├── themes.ts               # 6 type 独立配色
│   ├── shell-stats.ts          # getShellStats() 统一 meta
│   ├── scrapers/               # 12 个抓取器 + 1 个后处理
│   │   ├── article-base.ts     # vpnpaihang / vpnbaike 共享
│   │   ├── vpnpaihang.ts       # yaml flow parser
│   │   ├── au1rxx.ts           # 4 空格缩进 clash.yaml
│   │   ├── gfwoff.ts           # h2 + nextAll 段落
│   │   └── ...
│   ├── read-data.ts            # 前端读 data/vpns.json
│   ├── data.ts                 # 写盘 + buildMeta
│   ├── http.ts                 # fetchUrl（GB18030 兼容）
│   ├── format.ts               # normalize / parseChineseDate
│   └── dedupe.ts               # SHA1 去重
├── scripts/
│   └── scrape.ts               # 抓取入口
├── data/
│   └── vpns.json               # 抓取产物（git 跟踪，Actions 自动 commit）
├── .github/workflows/
│   └── scrape.yml              # cron 6h + workflow_dispatch
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── MD说明.md                   # 中文部署说明（Mac + Windows 双版）
```

## 数据源

| 源 | 类型 | 说明 |
| --- | --- | --- |
| `au1rxx` | node | clash.yaml 节点池（4 空格缩进） |
| `airport-access` | review | 机场测速榜单 |
| `everett7623` | node | 节点 wiki |
| `freenodes` | node | 节点池 |
| `gfwoff` | review | h2 段落解析 |
| `kerrynotes` | node | 节点 wiki |
| `panda-vpn-pro` | review | 评测 |
| `tg-enricher` | enrichment | Telegram 频道后处理 |
| `tonykongcn` | node | 节点列表 |
| `vpnpaihang` | review | yaml flow parser |
| `vpnbaike` | review | 维基式条目 |
| `waiyiyuyan` | node | 节点池 |
| `ygjc` | review | 评测 |

> 想加源？编辑 `lib/config.ts` 加 `SOURCES.push({...})` + 写一个 `lib/scrapers/<id>.ts` 即可。

## 本地开发

```bash
# 1. 装依赖
pnpm install
# 或 npm i / yarn / bun install

# 2. 跑一次抓取（会写 data/vpns.json）
pnpm scrape

# 3. 起开发服
pnpm dev
# → http://localhost:3000

# 4. 跑构建
pnpm build
```

Node ≥ 20。

## 部署到 Vercel

1. 仓库 → Settings → Actions → Workflow permissions → **Read and write permissions**（否则 Actions 无法自动 commit）
2. 去 https://vercel.com/new → Import `1837620622/freevpn-cknb-ckk`
3. 框架预设 Next.js，直接 Deploy
4. 每次 Actions 跑完抓取 → 仓库新 commit → Vercel 自动 rebuild

## 工作流

```
┌──────────────────────┐    ┌──────────────────┐    ┌──────────────────────┐
│  GitHub Actions      │    │  data/vpns.json  │    │  Vercel              │
│  cron 0 */6 * * *    │───▶│  自动 commit     │───▶│  自动 rebuild        │
│  12 scrapers 并行    │    │  15 天滚动去重   │    │  静态 CDN 缓存       │
└──────────────────────┘    └──────────────────┘    └──────────────────────┘
```

## 配置项

`lib/config.ts` 集中管理所有可调字段：

```ts
export const CONFIG = {
  baseUrl: 'https://freevpn-cknb-ckk.vercel.app',
  author: { name: '传康Kk', wechat: '1837620622', email: '2040168455@qq.com' },
  siteName: 'CK 免费 VPN 搜集',
  description: '今日可用 / 免费 / 试用 VPN 一站找全',
  cron: '0 */6 * * *',      // 抓取频率
  cutoffDays: 15,            // 滚动窗口
  // ...
};

export const SOURCES: SourceConfig[] = [ /* 12 源 */ ];
```

## License

MIT — 见 [LICENSE](./LICENSE)。

## 作者

- 微信：`1837620622`（传康Kk）
- 邮箱：`2040168455@qq.com`
- 咸鱼 / B 站：`万能程序员`

## 免责声明

本项目仅做**公开信息聚合**，不提供任何 VPN 服务本身。所有链接均指向第三方，使用前请自行判断合规性与安全性。
