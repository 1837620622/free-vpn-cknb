# 免费VPN情报站 - 传康kk 项目指令 (AGENTS.md)

## 真实目录
/Volumes/320G/免费VPN情报站-传康kk/

## 数据来源
- 多源公开免费/试用机场、节点、评测、跑路名单聚合
- 当前抓取器：kerrynotes, tonykongcn, vpnpaihang, ygjc, waiyiyuyan, etc. (见 lib/scrapers/index.ts)
- 数据文件：data/vpns.json (活跃数据), data/archive.json (归档)
- 线上快照：Cloudflare KV via wrangler seed:remote

## 运行命令
- 本地开发： `pnpm dev` (http://localhost:3000)
- 抓取数据： `pnpm scrape` (tsx scripts/scrape.ts) 或 `pnpm scrape:single --source ygjc`
- 构建： `pnpm build`
- 预览构建包： `pnpm preview`
- 部署： `pnpm deploy` (opennextjs-cloudflare)
- 写入线上快照： `pnpm seed:remote`
- 清理缓存： `pnpm clean`

## 测试方式
- 爬虫：运行 scrape 后检查 data/vpns.json 字段完整性 (id, name, type:'trial', signupUrl, etc.)
- UI：使用 pnpm dev 访问页面，检查布局、3D 背景、响应式、主题切换、无错误控制台
- 字段正确性：爬虫输出必须符合 lib/types.ts VpnEntry 接口
- 定期验证：scrapers/run-scrape.ts 或 lib/run-scrape.ts

## 打包方式
- Next.js App Router + React 19 + TypeScript
- Tailwind CSS + Three.js 全局 3D 背景 (GlobalScene.tsx)
- Cloudflare Workers (wrangler.jsonc, open-next.config.ts) for edge deployment
- Data: local JSON + remote KV snapshot

## 已知风险与注意事项
- 爬虫需注意反爬、速率限制、页面改版导致抓取失败
- 字段正确性：确保所有新 scraper 填充 signupUrl, inviteCode, couponCode, period, type:'trial' 等必填
- 3D 背景移动端性能优化
- 数据去重：lib/dedupe.ts
- 内容指纹缓存：避免重复写入快照
- 禁止删除数据归档目录 /Volumes/320G/免费VPN情报站-传康kk/data/

## 任务列表 (后续执行)
1. 集成全网更多试用机场 trail (从 X/Twitter 和 web 搜索新增来源)
   - 搜索更多机场订阅链接
   - 创建/添加新 scraper 如 365vpn-scraper.ts 等
2. 优化美化网页布局 (globals.css, components/ui/, 3D 场景)
3. 检查 bug (跑步子代理验证 scrape, build, runtime)
4. 仔细美化 (UI 组件、颜色、动效、移动端)
5. 确保爬虫字段正确 (types.ts, scraper 实现)

使用 subagent 执行验证和修复。
