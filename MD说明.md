# CK 免费 VPN 搜集

> 苹果风免费 VPN / 机场情报聚合站 · 13 个公开源 · 6 小时自动同步 · 完全开源

## 项目简介

`CK 免费 VPN 搜集`（英文名 `freevpn-cknb-ckk`）是一个开源、纯静态、自动化的免费 VPN 与机场情报聚合站。
后台使用 TypeScript + Cheerio 从 13 个公开源自动抓取试用码、免费节点、机场评测，
通过 **GitHub Actions 每 6 小时跑一次** 抓取并提交 `data/vpns.json`，
再由 **Vercel** 监听 `main` 分支 push 自动重新部署。

## 数据源（共 13 个）

| 源 ID | 来源 | 类型 |
| --- | --- | --- |
| `ygjc` | [一个机场 ygjc.cc](https://ygjc.cc) | 试用 / 免费 / 优惠码 |
| `kerrynotes` | [Kerry 的学习笔记](https://kerrynotes.com) | 试用码 / 免费 |
| `waiyiyuyan` | [我爱白嫖](https://waiyiyuyan.com) | 试用 / 免费 |
| `vpnpaihang` | [VPN 排行榜](https://vpnpaihang.github.io) | 日榜节点 + 推荐机场 |
| `vpnbaike` | [VPN 百科](https://vpnbaike.github.io) | 镜像日榜 |
| `au1rxx` | [Au1rxx 验证节点](https://github.com/Au1rxx/free-vpn-subscriptions) | clash 订阅 |
| `tonykongcn` | [tonykongcn 节点](https://github.com/tonykongcn/vpn-list) | 多协议节点 |
| `freenodes` | [FreeNodes 节点池](https://github.com/free-nodes/free-nodes) | 公开节点 |
| `gfwoff` | [GFWOFF 评测](https://gfwoff.org) | VPN / 机场评测文章 |
| `everett7623` | [机场推荐索引 2026](https://github.com/everett7623/2026-airport-recommend) | 全面评测 |
| `panda` | [Panda-VPN-Pro (DiningFactory)](https://github.com/DiningFactory/Panda-VPN-Pro) | 低价机场评测 |
| `airport-access` | [ChatGPT 机场精选 (chatgpt-helper-tech)](https://github.com/chatgpt-helper-tech/airport-access) | markdown 表格 |
| `tg-enricher` | 访问注册页补全 Telegram 群/频道 | 后处理 |

## 数据策略

- **15 天滚动窗口**：超过 15 天的条目自动移入 `data/archive.json`
- **去重键**：`SHA1(normalize(name) + normalize(signupUrl))`
- **5 级新鲜度**：
  - `< 24h` 绿色 #10B981 实时
  - `< 3d`  蓝色 #3B82F6 今日
  - `< 7d`  紫色 #8B5CF6 本周
  - `< 15d` 灰色 #6B7280 近期
  - `> 15d` 不显示
- **类型**：`trial` 试用 / `free` 免费 / `node` 实时节点 / `index` 机场索引 / `review` 评测 / `dead` 跑路

## 技术栈

- **前端**：Next.js 15 (App Router) + React 19 + Tailwind 3
- **UI 风格**：苹果玻璃（`backdrop-blur-2xl` + mesh-gradient + SF Pro 字体栈）
- **抓取**：TypeScript + Cheerio 1.1.0 + tsx（自写 parser）
- **CI/CD**：GitHub Actions（cron 6h） + Vercel 自动部署

## Mac 部署步骤

环境：macOS 14+ / Node 20+ / pnpm 9+

```bash
# 1. 克隆
git clone https://github.com/1837620622/freevpn-cknb-ckk.git
cd freevpn-cknb-ckk

# 2. 安装依赖
pnpm install

# 3. 本地试跑抓取（可选）
pnpm scrape

# 4. 启动开发服务器
pnpm dev
# 访问 http://localhost:3000

# 5. 生产构建
pnpm build
pnpm start

# 6. 部署到 Vercel
npx vercel login
npx vercel --prod
```

## Windows 部署步骤

环境：Windows 10/11 / Node 20+ / pnpm 9+

```bat
:: 1. 克隆
git clone https://github.com/1837620622/freevpn-cknb-ckk.git
cd freevpn-cknb-ckk

:: 2. 安装依赖
pnpm install

:: 3. 本地试跑抓取
pnpm scrape

:: 4. 启动开发
pnpm dev

:: 5. 生产构建
pnpm build
pnpm start

:: 6. 部署到 Vercel
npx vercel login
npx vercel --prod
```

## 启用 GitHub Actions 自动抓取

1. 将仓库 fork 到自己账号
2. Settings → Actions → General → Workflow permissions → 勾选 **Read and write permissions**
3. 启用后，每 6 小时（cron `0 */6 * * *`）自动跑一次 `pnpm scrape`
4. 若 `data/vpns.json` 有变化，会自动 commit 并 push 到 `main`
5. 配合 Vercel 即可全自动更新

## 启用 Vercel 自动部署

1. 登录 [vercel.com](https://vercel.com) → New Project → Import Git Repository
2. 选择 `freevpn-cknb-ckk` 仓库
3. Framework Preset 选 `Next.js`
4. 部署完成后，每次 push 到 `main` 自动 rebuild

## 目录结构

```text
免费VPN情报站-传康kk/
├── app/                      # Next.js App Router 页面
│   ├── page.tsx              # 首页（概览）
│   ├── trial/                # 试用机场
│   ├── free/                 # 免费机场
│   ├── nodes/                # 实时节点
│   ├── airports/             # 机场库
│   ├── daily/                # 日报
│   ├── sources/              # 数据源
│   ├── about/                # 关于
│   ├── dead/                 # 跑路名单
│   ├── reviews/              # 评测
│   ├── vpn/[id]/             # 详情页
│   └── api/scrape/           # 触发抓取 API（备用）
├── components/ui/            # 玻璃 UI 组件库
│   ├── Icon.tsx              # SVG 图标
│   ├── FreshnessBadge.tsx    # 5 级新鲜度徽章
│   ├── Glass.tsx             # 玻璃卡 / 按钮
│   ├── GradientBg.tsx        # mesh-gradient 背景
│   ├── VpnCard.tsx           # VPN 卡片
│   ├── ListPage.tsx          # 列表页
│   ├── SiteShell.tsx         # 全局布局
│   └── TypeChip.tsx          # 类型 chip
├── lib/
│   ├── config.ts             # 13 源配置 + cron + 作者
│   ├── types.ts              # VpnEntry / SourceMeta / Meta
│   ├── http.ts               # fetchUrl + GB18030 解码
│   ├── format.ts             # normalize / makeId / 日期解析
│   ├── dedupe.ts             # SHA1 去重 + 合并
│   ├── data.ts               # 读写 data/vpns.json
│   ├── read-data.ts          # 前端读 data/vpns.json
│   └── scrapers/             # 12 个抓取器
│       ├── article-base.ts   # vpnpaihang/vpnbaike 共享逻辑
│       ├── ygjc.ts
│       ├── kerrynotes.ts
│       ├── waiyiyuyan.ts
│       ├── au1rxx.ts
│       ├── tonykongcn.ts
│       ├── freenodes.ts
│       ├── vpnpaihang.ts
│       ├── vpnbaike.ts
│       ├── everett7623.ts
│       ├── gfwoff.ts
│       ├── panda.ts
│       ├── airport-access.ts
│       ├── tg-enricher.ts
│       └── index.ts
├── scripts/scrape.ts         # 抓取入口
├── data/                     # 抓取产物
│   ├── vpns.json             # 活跃 + meta
│   └── archive.json          # 超期归档
├── .github/workflows/
│   └── scrape.yml            # cron 6h + 自动 commit
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.mjs
├── package.json
└── MD说明.md
```

## 关键脚本

| 命令 | 作用 |
| --- | --- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动开发服务器（http://localhost:3000） |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务器 |
| `pnpm scrape` | 运行所有抓取器并写入 `data/vpns.json` |
| `pnpm scrape:single <id>` | 跑单个抓取器 |

## 作者

- **传康Kk**
- 微信：`1837620622`
- 邮箱：`2040168455@qq.com`
- B站 / 咸鱼：`万能程序员`

## 声明

本项目仅供技术研究与学习用途，请遵守当地法律法规。
数据来源于公开网络，仅作为索引展示，不对其中机场的可用性、安全性、合规性负责。
使用任何免费服务前请自行评估风险。
