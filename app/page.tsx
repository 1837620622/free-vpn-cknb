/**
 * 首页：双主题 + 栏目分清（每种 type 独立配色）
 */
import Link from 'next/link';
import { SiteShell } from '@/components/ui/SiteShell';
import { VpnCard } from '@/components/ui/VpnCard';
import { getEntries } from '@/lib/read-data';
import { getShellStats } from '@/lib/shell-stats';
import { getCronText, getWindowText, getDescription } from '@/lib/site-text';
import { TYPE_THEMES } from '@/lib/themes';
import { IconArrowRight, IconGitHub, IconBolt, IconLayers, IconRocket, IconServer, IconChevronRight, IconGlobe } from '@/components/ui/Icon';
import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const stats = getShellStats();
  const all = getEntries();
  const realtime = all.filter((e) => {
    if (!e.publishedAt) return false;
    return Date.now() - new Date(e.publishedAt).getTime() < 24 * 3600 * 1000;
  });
  const trial = all.filter((e) => e.type === 'trial');
  const free = all.filter((e) => e.type === 'free');
  const node = all.filter((e) => e.type === 'node');
  const review = all.filter((e) => e.type === 'review');

  return (
    <SiteShell stats={stats}>
      <section className="pt-10 sm:pt-16 pb-12 sm:pb-16">
        <div className="eyebrow mb-4 sm:mb-5 flex items-center gap-2 flex-wrap" style={{ color: 'var(--fg-mute)' }}>
          <span className="h-1.5 w-1.5 rounded-full pulse-soft" style={{ background: TYPE_THEMES.trial.color, boxShadow: `0 0 8px ${TYPE_THEMES.trial.color}` }} />
          <span>LIVE</span>
          <span className="opacity-30">·</span>
          <span>{stats.totalSources} 源 · {stats.cronText}同步 · {stats.windowText}窗口</span>
        </div>

        <h1 className="display text-[40px] sm:text-[68px] md:text-[88px] lg:text-[104px]" style={{ color: 'var(--fg-strong)' }}>
          今日可用<br />
          <span style={{ color: TYPE_THEMES.trial.color }}>免费 VPN</span><br />
          <span style={{ color: 'var(--fg-strong)', opacity: 0.85 }}>一站找全</span>
        </h1>

        <p className="mt-6 sm:mt-8 text-[15px] sm:text-[16px] max-w-2xl leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
          {getDescription()}。数据每 {getCronText()}自动从 {stats.totalSources} 个公开源抓取，
          保留最近 {stats.windowText}的有效条目，按类型分组展示，可直接点击注册或复制订阅。
        </p>

        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#realtime"
            className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-bold rounded-md text-black active:scale-[0.97] transition-transform"
            style={{ background: TYPE_THEMES.trial.color, boxShadow: `0 8px 24px ${TYPE_THEMES.trial.color}40` }}
          >
            浏览今日实时 <IconArrowRight width={14} height={14} />
          </a>
          <a
            href="https://github.com/1837620622/freevpn-cknb-ckk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-semibold rounded-md transition-colors"
            style={{ border: '1px solid var(--border-strong)', color: 'var(--fg)' }}
          >
            <IconGitHub width={14} height={14} />
            源码与说明
          </a>
        </div>

        <dl
          className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4"
          style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
        >
          <Stat label="活跃条目" value={stats.totalActive} sub="聚合去重" Icon={IconLayers} />
          <Stat label="24h 实时" value={stats.realtime24h} sub="新发布" Icon={IconBolt} theme={TYPE_THEMES.trial} />
          <Stat label="免费机场" value={free.length} sub="免费套餐" Icon={IconGlobe} theme={TYPE_THEMES.free} />
          <Stat label="实时节点" value={node.length} sub="公开订阅" Icon={IconServer} theme={TYPE_THEMES.node} />
        </dl>
      </section>

      {realtime.length > 0 && (
        <Section id="realtime" num="01" title="今日实时" subtitle="最近 24 小时内发布或更新的条目" link="/daily" theme={TYPE_THEMES.trial}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {realtime.slice(0, 9).map((e) => <VpnCard key={e.id} entry={e} />)}
          </div>
        </Section>
      )}

      <Section num="02" title="试用机场" subtitle="注册即得流量或试用期限，含优惠码" link="/trial" theme={TYPE_THEMES.trial}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {trial.slice(0, 9).map((e) => <VpnCard key={e.id} entry={e} />)}
        </div>
      </Section>

      <Section num="03" title="免费机场" subtitle="有免费套餐、长期免费或公益节点" link="/free" theme={TYPE_THEMES.free}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {free.slice(0, 9).map((e) => <VpnCard key={e.id} entry={e} />)}
        </div>
      </Section>

      <Section num="04" title="实时节点" subtitle="公开 clash/v2ray/ss 订阅，可直接复制使用" link="/nodes" theme={TYPE_THEMES.node}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {node.slice(0, 9).map((e) => <VpnCard key={e.id} entry={e} />)}
        </div>
      </Section>

      <Section num="05" title="机场评测" subtitle="精选机场深度评测与横评" link="/reviews" theme={TYPE_THEMES.review}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {review.slice(0, 9).map((e) => <VpnCard key={e.id} entry={e} />)}
        </div>
      </Section>

      <section className="py-14 sm:py-20">
        <div
          className="rounded-2xl p-7 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10"
          style={{
            background: 'color-mix(in srgb, var(--type-trial) 7%, var(--bg-card))',
            border: '1px solid color-mix(in srgb, var(--type-trial) 22%, var(--border))',
          }}
        >
          <div className="flex-1">
            <div className="eyebrow mb-3" style={{ color: 'var(--fg-mute)' }}>自部署</div>
            <h2 className="display text-[30px] sm:text-[40px] lg:text-[52px] leading-[0.98]" style={{ color: 'var(--fg-strong)' }}>
              5 分钟部署到<br />
              <span style={{ color: TYPE_THEMES.trial.color }}>自己的 Vercel</span>
            </h2>
            <p className="mt-3 text-[13.5px] max-w-md leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              完全开源 · GitHub Actions 每 {getCronText()}自动抓取并提交 · Vercel 自动重新部署。
            </p>
          </div>
          <a
            href="https://github.com/1837620622/freevpn-cknb-ckk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-bold rounded-md text-black shrink-0"
            style={{ background: TYPE_THEMES.trial.color, boxShadow: `0 8px 24px ${TYPE_THEMES.trial.color}40` }}
          >
            <IconGitHub width={14} height={14} />
            打开 GitHub <IconArrowRight width={14} height={14} />
          </a>
        </div>
      </section>
    </SiteShell>
  );
}

function Stat({ label, value, sub, Icon, theme }: { label: string; value: number; sub: string; Icon: React.ComponentType<{ width?: number; height?: number }>; theme?: { color: string } }) {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-5 first:pl-0" style={{ borderRight: '1px solid var(--border)' }}>
      <dt className="flex items-center gap-2 text-[11.5px] mb-2" style={{ color: 'var(--fg-mute)' }}>
        <Icon width={12} height={12} />
        <span>{label}</span>
      </dt>
      <dd className="flex items-baseline gap-2">
        <span
          className="display text-[36px] sm:text-[44px] lg:text-[52px] leading-none tabular-nums"
          style={{ color: theme ? theme.color : 'var(--fg-strong)' }}
        >
          {value}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--fg-faint)' }}>{sub}</span>
      </dd>
    </div>
  );
}

function Section({ id, num, title, subtitle, link, theme, children }: { id?: string; num: string; title: string; subtitle: string; link?: string; theme: { color: string; colorDim: string; border: string }; children: ReactNode }) {
  return (
    <section id={id} className="py-12 sm:py-20" style={{ borderTop: '1px solid var(--border)' }}>
      <header className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
        <div className="flex items-start gap-4 sm:gap-5">
          <div
            className="hidden sm:flex h-12 w-12 rounded-xl items-center justify-center shrink-0"
            style={{
              background: `color-mix(in srgb, ${theme.color} 12%, transparent)`,
              border: `1px solid color-mix(in srgb, ${theme.color} 28%, transparent)`,
            }}
          >
            <span className="display text-[18px]" style={{ color: theme.color }}>{num}</span>
          </div>
          <div>
            <div className="eyebrow mb-2 flex items-center gap-2" style={{ color: theme.color }}>
              <span className="sm:hidden font-mono-num">{num}</span>
              <span className="hidden sm:inline">{title}</span>
            </div>
            <h2 className="display text-[26px] sm:text-[36px] lg:text-[44px] leading-[1.02]" style={{ color: 'var(--fg-strong)' }}>{title}</h2>
            <p className="mt-2 text-[13.5px] sm:text-[14px] max-w-2xl" style={{ color: 'var(--fg-soft)' }}>{subtitle}</p>
          </div>
        </div>
        {link && (
          <Link
            href={link}
            className="hidden sm:inline-flex items-center gap-1.5 text-[12.5px] font-semibold shrink-0 hover:opacity-80"
            style={{ color: theme.color }}
          >
            查看全部 <IconChevronRight width={13} height={13} />
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}
