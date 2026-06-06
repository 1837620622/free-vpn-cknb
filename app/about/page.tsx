/**
 * 关于页（深色工具站风）
 */
import { SiteShell } from '@/components/ui/SiteShell';
import { getShellStatsRuntime } from '@/lib/shell-stats';
import { getWindowText, getSiteName } from '@/lib/site-text';
import { CONFIG } from '@/lib/config';
import { IconGitHub } from '@/components/ui/Icon';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const stats = await getShellStatsRuntime();

  return (
    <SiteShell stats={stats}>
      <section className="pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="eyebrow mb-3" style={{ color: 'var(--accent-text)' }}>关于</div>
        <h1 className="display text-[36px] sm:text-[56px] lg:text-[72px] text-fg-strong leading-[1.0]">
          关于本站
        </h1>
      </section>

      <section className="pb-8 sm:pb-10 max-w-3xl">
        <h2 className="eyebrow text-fg-mute mb-4">说明</h2>
        <div className="space-y-3.5 text-[15px] sm:text-[16px] text-fg-soft leading-relaxed">
          <p>
            <strong className="text-fg-strong">{getSiteName()}</strong> 是一个开源的免费 / 试用 VPN 情报聚合站。
            全部数据由后台定时任务每天从 {stats.totalSources} 个公开源抓取，
            自动去重、归档，并写入轻量数据快照。
            页面优先读取线上快照，快照不可用时回退到本地 <code className="px-1.5 py-0.5 rounded bg-bg-elev text-fg text-[13.5px] font-mono">data/vpns.json</code>。
          </p>
          <p>
            站点本身不提供任何 VPN 服务，只对公开数据进行索引与展示。
            点击卡片上的「立即注册」/「打开订阅」会跳转到原始来源。
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-10 border-t border-border">
        <h2 className="eyebrow text-fg-mute mb-6">数据策略</h2>
        <ul className="space-y-3 text-[14.5px] text-fg-soft max-w-3xl">
          <li className="flex gap-3">
            <span style={{ color: 'var(--accent-text)' }} className="shrink-0 mt-1">●</span>
            <span>滚动窗口：超 {getWindowText()}的条目进入 <code className="px-1.5 py-0.5 rounded bg-bg-elev text-[13px] font-mono">archive.json</code>，主站不展示</span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: 'var(--accent-text)' }} className="shrink-0 mt-1">●</span>
            <span>唯一键：<code className="px-1.5 py-0.5 rounded bg-bg-elev text-[13px] font-mono">SHA1(normalize(name) + normalize(signupUrl))</code>，跨源去重</span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: 'var(--accent-text)' }} className="shrink-0 mt-1">●</span>
            <span>新鲜度 5 级：实时（&lt; 24h）/ 今日（&lt; 3d）/ 本周（&lt; 7d）/ 近期（&lt; {getWindowText()}）/ 隐藏</span>
          </li>
          <li className="flex gap-3">
            <span style={{ color: 'var(--accent-text)' }} className="shrink-0 mt-1">●</span>
            <span>抓取器全部为 Node 脚本，失败不中断整体流程，单源失败只记日志</span>
          </li>
        </ul>
      </section>

      <section className="py-8 sm:py-10 border-t border-border">
        <h2 className="eyebrow text-fg-mute mb-6">技术栈</h2>
        <ul className="space-y-2 text-[14px] text-fg-soft max-w-3xl font-mono-num">
          <li>Next.js 15 (App Router) · React 19 · TypeScript</li>
          <li>Tailwind CSS 3 · Cheerio 1</li>
          <li>数据写入: <code className="px-1.5 py-0.5 rounded bg-bg-elev text-fg text-[13px]">data/vpns.json</code></li>
          <li>抓取调度: 每天一次，内容变化才写入快照</li>
          <li>部署: 本地执行 <code className="px-1.5 py-0.5 rounded bg-bg-elev text-fg text-[13px]">pnpm deploy</code>，绑定域名 <code className="px-1.5 py-0.5 rounded bg-bg-elev text-fg text-[13px]">free-vpn.chuankangkk.top</code></li>
        </ul>
      </section>

      <section className="py-8 sm:py-10 border-t border-border">
        <h2 className="eyebrow text-fg-mute mb-6">作者</h2>
        <ul className="space-y-2 text-[14.5px] text-fg-soft max-w-3xl">
          <li className="flex gap-3"><span style={{ color: 'var(--accent-text)' }}>●</span> {CONFIG.author.nickname}</li>
          <li className="flex gap-3"><span style={{ color: 'var(--accent-text)' }}>●</span> 微信：{CONFIG.author.wechat}</li>
          <li className="flex gap-3"><span style={{ color: 'var(--accent-text)' }}>●</span> 邮箱：{CONFIG.author.email}</li>
          <li className="flex gap-3"><span style={{ color: 'var(--accent-text)' }}>●</span> B站 / 咸鱼：{CONFIG.author.bilibili}</li>
        </ul>
      </section>

      <section className="py-8 sm:py-10 border-t border-border">
        <h2 className="eyebrow text-fg-mute mb-6">声明</h2>
        <p className="text-[13px] text-fg-mute leading-relaxed max-w-3xl">
          本项目仅供技术研究与学习用途，请遵守当地法律法规。
          数据来源于公开网络，仅作为索引展示，不对其中机场的可用性、安全性、合规性负责。
          使用任何免费服务前请自行评估风险。
        </p>
        <a
          href="https://github.com/1837620622/free-vpn-cknb"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 px-5 py-3 text-[14px] font-bold rounded-md text-black"
          style={{ background: 'var(--accent-green)', boxShadow: '0 0 18px rgba(118,185,0,0.3)' }}
        >
          <IconGitHub width={14} height={14} /> 打开 GitHub
        </a>
      </section>
    </SiteShell>
  );
}
