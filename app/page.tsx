/**
 * 首页：双主题 + 栏目分清（每种 type 独立配色）
 */
import Link from 'next/link';
import { SiteShell } from '@/components/ui/SiteShell';
import { VpnCard } from '@/components/ui/VpnCard';
import { getEntriesRuntime } from '@/lib/read-data';
import { getShellStatsRuntime } from '@/lib/shell-stats';
import { getDescription } from '@/lib/site-text';
import { TYPE_THEMES } from '@/lib/themes';
import type { TypeTheme } from '@/lib/themes';
import { IconArrowRight, IconBolt, IconLayers, IconRocket, IconServer, IconChevronRight, IconGlobe } from '@/components/ui/Icon';
import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const stats = await getShellStatsRuntime();
  const all = await getEntriesRuntime();
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
      <section className="hero-stage pt-7 sm:pt-10 pb-8 sm:pb-10 grid lg:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.82fr)] gap-7 lg:gap-10 items-center">
        <div className="relative z-10 fade-in-up">
          <div className="eyebrow mb-4 sm:mb-5 flex items-center gap-2 flex-wrap" style={{ color: 'var(--fg-mute)' }}>
            <span className="h-1.5 w-1.5 rounded-full pulse-soft" style={{ background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }} />
            <span>LIVE EDGE DATA</span>
            <span className="opacity-30">·</span>
            <span>{stats.totalSources} 源 · 每日同步 · {stats.windowText}窗口</span>
          </div>

          <h1 className="display hero-title text-[42px] sm:text-[72px] md:text-[90px] lg:text-[108px]" style={{ color: 'var(--fg-strong)' }}>
            免费 VPN<br />
            <span className="text-gradient-nv">情报引擎</span><br />
            <span style={{ color: 'var(--fg-strong)', opacity: 0.86 }}>实时聚合</span>
          </h1>

          <p className="mt-5 sm:mt-6 text-[15px] sm:text-[16px] max-w-2xl leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
            {getDescription()}。后台每天自动抓取公开源并生成轻量快照，
            页面请求读取最新可用数据，不依赖外部流水线额度。
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#realtime"
              className="btn-nv inline-flex items-center gap-2 px-5 py-3 text-[14px] font-bold rounded-md text-black active:scale-[0.97] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(118,185,0,0.35)]"
              style={{ background: 'var(--accent-green)', boxShadow: '0 8px 24px rgba(118, 185, 0, 0.25)' }}
            >
              浏览实时情报 <IconArrowRight width={14} height={14} />
            </a>
            <a
              href="/sources"
              className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-semibold rounded-md transition-all duration-200 surface-button hover:border-strong"
            >
              查看数据源 <IconChevronRight width={13} height={13} />
            </a>
          </div>
        </div>

        <aside className="hero-dashboard fade-in-up delay-200">
          <div className="hero-dashboard__head">
            <span className="eyebrow" style={{ color: 'var(--accent-text)' }}>LIVE SNAPSHOT</span>
            <span>{stats.updatedAt}</span>
          </div>
          <dl className="grid grid-cols-2">
            <Stat label="活跃条目" value={stats.totalActive} sub="聚合去重" Icon={IconLayers} />
            <Stat label="24h 实时" value={stats.realtime24h} sub="新发布" Icon={IconBolt} theme={{ ...TYPE_THEMES.trial, color: 'var(--accent-text)' }} />
            <Stat label="免费机场" value={free.length} sub="免费套餐" Icon={IconGlobe} theme={TYPE_THEMES.free} />
            <Stat label="实时节点" value={node.length} sub="公开订阅" Icon={IconServer} theme={TYPE_THEMES.node} />
          </dl>
        </aside>
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

      <section className="py-6 sm:py-8">
        <div
          className="rounded-lg p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6"
          style={{
            background: 'color-mix(in srgb, var(--type-trial) 7%, var(--bg-card))',
            border: '1px solid color-mix(in srgb, var(--type-trial) 22%, var(--border))',
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="eyebrow mb-2" style={{ color: 'var(--fg-mute)' }}>自部署</div>
            <h2 className="display text-[26px] sm:text-[34px] lg:text-[40px] leading-[1.02]" style={{ color: 'var(--fg-strong)' }}>
              本地直发到 <span className="break-words" style={{ color: 'var(--accent-text)' }}>free-vpn.chuankangkk.top</span>
            </h2>
            <p className="mt-2 text-[13.5px] max-w-2xl leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              完全开源 · 每天自动抓取公开源 · 内容变化才写入快照 · 页面实时读取最新数据。
            </p>
          </div>
          <a
            href="/about"
            className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-bold rounded-md text-black shrink-0"
            style={{ background: 'var(--accent-green)', boxShadow: '0 8px 24px rgba(118, 185, 0, 0.25)' }}
          >
            <IconRocket width={14} height={14} />
            查看部署说明 <IconArrowRight width={14} height={14} />
          </a>
        </div>
      </section>
    </SiteShell>
  );
}

function Stat({ label, value, sub, Icon, theme }: { label: string; value: number; sub: string; Icon: React.ComponentType<{ width?: number; height?: number }>; theme?: { color: string } }) {
  return (
    <div className="px-4 sm:px-5 py-4 sm:py-5" style={{ borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
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

function Section({ id, num, title, subtitle, link, theme, children }: { id?: string; num: string; title: string; subtitle: string; link?: string; theme: TypeTheme; children: ReactNode }) {
  return (
    <section id={id} className="py-9 sm:py-12 fade-in-up" style={{ borderTop: '1px solid var(--border)' }}>
      <header className="flex items-end justify-between gap-4 mb-6 sm:mb-7">
        <div className="flex items-start gap-4 sm:gap-5">
          <div
            className="hidden sm:flex h-11 w-11 rounded-lg items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110"
            style={{
              background: `color-mix(in srgb, ${theme.color} 12%, transparent)`,
              border: `1px solid color-mix(in srgb, ${theme.color} 28%, transparent)`,
            }}
          >
            <span className="display text-[18px]" style={{ color: theme.id === 'trial' ? 'var(--accent-text)' : theme.color }}>{num}</span>
          </div>
          <div>
            <div className="eyebrow mb-2 flex items-center gap-2" style={{ color: theme.id === 'trial' ? 'var(--accent-text)' : theme.color }}>
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
            className="hidden sm:inline-flex items-center gap-1.5 text-[12.5px] font-semibold shrink-0 transition-all duration-200 hover:gap-2.5"
            style={{ color: theme.id === 'trial' ? 'var(--accent-text)' : theme.color }}
          >
            查看全部 <IconChevronRight width={13} height={13} />
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}
