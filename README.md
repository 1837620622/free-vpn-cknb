# 免费 VPN 情报站

公开情报聚合平台。自动抓取、去重、归档互联网公开来源中的免费节点、试用机场、机场索引、日报与评测内容，以轻量快照形式在边缘节点实时读取。

**线上地址** — [free-vpn.chuankangkk.top](https://free-vpn.chuankangkk.top)

---

## 项目特性

| 模块 | 说明 |
| :--- | :--- |
| 多源聚合 | 17 个公开数据源并行抓取，单源失败不中断整体流程 |
| 稳定去重 | 按 `SHA1(normalize(name) + normalize(url))` 生成稳定 ID，跨来源合并重复条目 |
| 省资源写入 | 对核心字段计算内容指纹，数据未变化时跳过全量快照写入 |
| 每日同步 | Workers Cron每天触发一次，适合低频更新内容 |
| 黑白双主题 | 日间 / 夜间 / 跟随系统，CSS 变量驱动，切换无闪烁 |
| 全局 3D 背景 | Three.js 线框核心 + 轨道环 + 粒子场，移动端限帧降采样 |
| 响应式布局 | 390px 至 1440px 全断点适配，无横向溢出 |
| 安全加固 | CSP / HSTS / X-Frame-Options / URL 协议白名单（防 `javascript:` 注入） |

---

## 页面结构

| 页面 | 路径 | 内容 |
| :--- | :--- | :--- |
| 首页 | `/` | 总览统计、分类入口、实时窗口、3D 情报背景 |
| 试用 | `/trial` | 带试用周期、注册入口、优惠码的机场 |
| 免费 | `/free` | 免费套餐、公益节点、公开资源 |
| 节点 | `/nodes` | 公开订阅、协议标签、地区与更新时间 |
| 机场库 | `/airports` | 试用 + 免费 + 索引 + 评测汇总 |
| 日报 | `/daily` | 按互斥时间窗口展示近期新增内容 |
| 评测 | `/reviews` | 公开评测、体验说明、参考文章 |
| 跑路名单 | `/dead` | 已确认跑路或长期不可用的机场 |
| 数据源 | `/sources` | 各来源状态、收录数量、最近成功时间 |
| 关于 | `/about` | 项目定位、数据策略、作者、声明 |

---

## 数据源

### 机场 / 试用 / 免费

| ID | 名称 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `ygjc` | 一个机场 | trial | 月度合集，含优惠码 / 流量 / 协议 / 注册链接 |
| `kerrynotes` | Kerry 的学习笔记 | free | 免费机场表格 + 评测文章 |
| `waiyiyuyan` | 我爱白嫖 | trial | Hexo 月度合集 + atom.xml |
| `freenode` | 免费节点机场大全 | free | 机场表格，含协议 / 特色 / 价格 |

### 实时节点

| ID | 名称 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `au1rxx` | Au1rxx 验证节点 | node | 每小时验证，按国家 / 协议分类 |
| `tonykongcn` | tonykongcn 验证节点 | node | Au1rxx fork，节点状态数组格式 |
| `freenodes` | FreeNodes 节点池 | node | 4 小时更新 |
| `vpnpaihang` | VPN 排行榜 | node | 每日 yaml/txt/json 订阅 |
| `vpnbaike` | VPN 百科 | node | 每日 yaml/txt/json 订阅 |
| `automerge` | AutoMerge 公开节点池 | node | 每日自动聚合互联网公开节点 |
| `clashfree` | clashfree 每日订阅 | node | 每日独立 Clash 文件，含国家 / 协议标识 |
| `freesub` | FreeSub 公益订阅池 | node | 公益订阅池，含最新与长期有效节点 |

### 索引 / 评测 / 跑路

| ID | 名称 | 类型 | 说明 |
| :--- | :--- | :--- | :--- |
| `everett7623` | 机场推荐索引 | index | GitHub README 表格 |
| `panda-vpn-pro` | Panda 低价机场评测 | review | 30+ 机场，含价格 /流量 / 优惠码 / 跑路记录 |
| `airport-access` | ChatGPT 机场精选评测 | review | 机场评测表格 + 注册链接 |
| `gfwoff` | GFWOFF 跑路名单 | dead | 机场跑路 / 预警名单 |
| `tg-enricher` | Telegram 链接补全 | — | 为已有条目补充群组 / 频道链接 |

---

## 技术栈

| 层级 | 技术 |
| :--- | :--- |
| 框架 | Next.js 15.5 (App Router) · React 19 · TypeScript 5.7 |
| 样式 | Tailwind CSS 3.4 · CSS 变量主题系统（40+ 语义化 token） |
| 3D 背景 | Three.js 0.184 |
| 爬虫 | Cheerio 1.1 · 自研 HTTP 工具（编码自动检测 / 重试 / URL 安全校验） |
| 部署 | Cloudflare Workers（OpenNext）· KV 存储 · Cron Triggers |

---

## 本地运行

环境要求：Node.js >= 20，pnpm >= 9。

```bash
pnpm install        # 安装依赖
pnpm scrape         # 抓取全部数据源（首次运行必须）
pnpm dev            # 启动开发服务 http://localhost:3000
```

### 常用命令

| 命令 | 作用 |
| :--- | :--- |
| `pnpm dev` | 启动本地开发服务 |
| `pnpm scrape` | 抓取全部 17 个公开源 |
| `pnpm scrape:single ygjc` | 抓取单个来源 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览生产运行包 |
| `pnpm deploy` | 发布到 Cloudflare Workers |
| `pnpm seed:remote` | 将本地数据写入线上 KV |
| `pnpm types:runtime` | 重新生成 Cloudflare 环境类型 |
| `pnpm clean` | 清理构建缓存 |

---

## 部署

```bash
npx wrangler login  # 首次登录 Cloudflare
pnpm deploy         # 构建并部署
pnpm seed:remote    # 可选：写入本地数据到线上 KV
```

### 数据策略

| 项目 | 策略 |
| :--- | :--- |
| 同步频率 | 每天一次（Workers Cron，UTC 19:20） |
| 写入判断 | SHA-256 内容指纹比对，未变化则跳过快照写入 |
| 活跃快照 | 线上 KV 只保留当前展示需要的活跃数据 |
| 运行状态 | 保留最近一次同步的时间 / 哈希 / 条目数 / 日志 |
| 本地归档 | 超过 15 天窗口的条目进入 `data/archive.json` |
| 失败处理 | 单源失败不中断整体，页面读取最近可用数据 |
| 读取优先级 | 线上 KV 快照 → 本地 `data/vpns.json` |

---

## 目录结构

```text
.
├── app/                    #页面路由（App Router）
│   ├── page.tsx            # 首页
│   ├── layout.tsx          # 根布局（主题引导脚本）
│   ├── globals.css         # 全局样式（主题变量 + 动画）
│   ├── vpn/[id]/           # 条目详情页
│   └── ...                 # 各分类页面
├── components/ui/          # UI 组件
│   ├── SiteShell.tsx       # 全局布局（导航 + 抽屉 + 页脚）
│   ├── VpnCard.tsx         # 条目卡片
│   ├── GlobalScene.tsx     # Three.js 3D 背景
│   └── ...
├── lib/                    # 核心逻辑
│   ├── config.ts           # 全局配置
│   ├── types.ts            # 数据模型
│   ├── http.ts             # HTTP 工具
│   ├── dedupe.ts           # 去重与合并
│   ├── run-scrape.ts       # 抓取流水线
│   └── scrapers/           # 17 个爬虫
├── data/                   # 本地数据（vpns.json / archive.json）
├── custom-worker.ts        # Workers 入口（fetch + cron）
└── wrangler.jsonc          # Cloudflare 配置
```

---

## 设计说明

| 特性 | 说明 |
| :--- | :--- |
| 双主题系统 | CSS 变量驱动，`data-theme` 属性切换，内联引导脚本避免闪烁 |
| 类型配色 | 6 种类型独立色系：试用绿 / 免费蓝 / 节点紫 / 评测橙 / 索引青 / 跑路红 |
| 新鲜度徽章 | 实时（< 24h）/ 今日（< 3d）/ 本周（< 7d）/ 近期（< 15d）/ 隐藏 |
| 入场动画 | 卡片交错渐入 + 悬浮抬升 + 类型色边框发光，支持 `prefers-reduced-motion` 降级 |
| 控制台页脚 | 指标面板 + 分类链接 + 作者信息 + 域名状态栏 |

---

## 声明

本站只对公开网络中的信息进行索引、整理和展示，不提供任何 VPN 服务。点击外部链接会跳转到原始来源，使用任何第三方服务前请自行判断可用性、安全性与合规性。本项目仅供技术研究与学习用途，请遵守当地法律法规。

---

## 作者

| 项目 | 信息 |
| :--- | :--- |
| 作者 | 传康Kk |
| 微信 | `1837620622` |
| 邮箱 | `2040168455@qq.com` |
| B站 / 咸鱼 | `万能程序员` |
