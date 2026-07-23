/**
 * 详情页（深色工具站风：清晰排版、信息密度高、移动端友好）
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/ui/SiteShell';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { TypeChip } from '@/components/ui/TypeChip';
import { IconArrowUpRight, IconClock, IconGlobe, IconTelegram, IconCalendar, IconBolt, IconSpeed, IconData, IconChevronRight } from '@/components/ui/Icon';
import { CopyButton } from '@/components/ui/CopyButton';
import { getEntryByIdRuntime } from '@/lib/read-data';
import { getShellStatsRuntime } from '@/lib/shell-stats';
import { formatUpdatedAt } from '@/lib/site-text';
import type { VpnEntry } from '@/lib/types';

export const dynamic = 'force-dynamic';

const TYPE_LABELS: Record<string, string> = {
  trial: '试用机场',
  free: '免费机场',
  node: '实时节点',
  review: '机场评测',
  index: '机场索引',
  dead: '跑路机场',
};

export default async function VpnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getEntryByIdRuntime(id);
  if (!entry) return notFound();
  const stats = await getShellStatsRuntime();
  const primaryUrl = entry.signupUrl || entry.websiteUrl || entry.subscriptionUrl;

  return (
    <SiteShell stats={stats}>
      <section className="pt-7 sm:pt-10 pb-7 sm:pb-9">
        <nav className="mb-6 sm:mb-8 flex items-center gap-1.5 text-[12px] text-fg-mute">
          <Link href="/" className="hover:text-fg-strong">首页</Link>
          <IconChevronRight width={11} height={11} className="opacity-50" />
          <Link href={`/${entry.type === 'node' ? 'nodes' : entry.type === 'trial' ? 'trial' : entry.type === 'free' ? 'free' : entry.type === 'review' ? 'reviews' : entry.type === 'dead' ? 'dead' : 'airports'}`} className="hover:text-fg-strong">
            {TYPE_LABELS[entry.type] || entry.type}
          </Link>
          <IconChevronRight width={11} height={11} className="opacity-50" />
          <span className="text-fg-soft truncate max-w-[40vw]">{entry.name}</span>
        </nav>

        <div className="flex items-center gap-2 flex-wrap mb-4">
          <TypeChip type={entry.type} />
          <FreshnessBadge publishedAt={entry.publishedAt} size="md" />
          {entry.couponCode && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded border border-amber-400/30 bg-amber-400/10 text-amber-200">
              优惠码 {entry.couponCode}
            </span>
          )}
        </div>

        <h1 className="display text-[32px] sm:text-[48px] lg:text-[64px] text-fg-strong leading-[1.0]">
          {entry.name}
        </h1>

        {entry.description && (
          <p className="mt-5 sm:mt-6 text-[15px] sm:text-[16px] text-fg-soft leading-relaxed max-w-3xl whitespace-pre-wrap">
            {entry.description}
          </p>
        )}

        {entry.notice && (
          <div className="mt-5 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[13.5px] text-amber-100 max-w-3xl">
            {entry.notice}
          </div>
        )}

        <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-2.5">
          {primaryUrl && (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-bold rounded-md text-black"
              style={{ background: 'var(--accent-green)', boxShadow: '0 0 18px rgba(118,185,0,0.3)' }}
            >
              <IconGlobe width={14} height={14} />
              {entry.type === 'node' ? '打开订阅' : '打开官网'}
              <IconArrowUpRight width={12} height={12} />
            </a>
          )}
          {entry.telegramGroup && (
            <a href={entry.telegramGroup} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[14px] font-semibold rounded-md border border-border-strong text-fg-strong hover:bg-bg-elev">
              <IconTelegram width={13} height={13} /> 群组
            </a>
          )}
          {entry.telegramChannel && (
            <a href={entry.telegramChannel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[14px] font-semibold rounded-md border border-border-strong text-fg-strong hover:bg-bg-elev">
              <IconTelegram width={13} height={13} /> 频道
            </a>
          )}
          {entry.subscriptionUrl && (
            <CopyButton text={entry.subscriptionUrl} />
          )}
        </div>
      </section>

      <Section title="详细信息" items={[
        entry.traffic && { label: '流量', value: entry.traffic },
        entry.period && { label: '周期', value: entry.period },
        entry.price && { label: '价格', value: entry.price },
        entry.speed && { label: '速度', value: entry.speed },
        entry.nodeCount != null && { label: '节点数', value: String(entry.nodeCount) },
        entry.latencyMs != null && { label: '延迟', value: entry.latencyMs + 'ms' },
        entry.status && { label: '状态', value: entry.status },
        entry.couponCode && { label: '优惠码', value: entry.couponCode },
        entry.inviteCode && { label: '邀请码', value: entry.inviteCode },
        entry.rating != null && { label: '评分', value: '★ ' + entry.rating.toFixed(1) },
      ].filter(Boolean) as { label: string; value: string }[]} />

      {((entry.protocols?.length ?? 0) > 0 || (entry.regions?.length ?? 0) > 0) && (
        <Section title="协议与地区" items={undefined}>
          {entry.protocols?.length ? (
            <div>
              <div className="eyebrow text-fg-mute mb-3">协议</div>
              <div className="flex flex-wrap gap-1.5">
                {entry.protocols.map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-md text-[12px] font-bold uppercase tracking-wider border border-border-strong text-fg">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {entry.regions?.length ? (
            <div className={entry.protocols?.length ? 'mt-6' : ''}>
              <div className="eyebrow text-fg-mute mb-3">地区</div>
              <div className="flex flex-wrap gap-1.5">
                {entry.regions.map((r) => (
                  <span key={r} className="px-2.5 py-1 rounded-md text-[12px] font-medium text-fg-soft border border-border bg-bg-elev">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </Section>
      )}

      <Section title="元数据" items={undefined}>
        <div className="space-y-2.5 text-[13px] text-fg-soft">
          <MetaRow Icon={IconClock} label="抓取时间">{formatUpdatedAt(entry.scrapedAt)}</MetaRow>
          {entry.publishedAt && <MetaRow Icon={IconCalendar} label="发布时间">{formatUpdatedAt(entry.publishedAt)}</MetaRow>}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-fg-mute shrink-0">标签</span>
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[11px] bg-bg-elev text-fg-soft border border-border">{t}</span>
                ))}
              </div>
            </div>
          )}
          {entry.sourceUrls?.length > 0 && (
            <div className="pt-2">
              <div className="eyebrow text-fg-mute mb-2">来源</div>
              <div className="flex flex-col gap-1.5">
                {entry.sourceUrls.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="text-[12.5px] text-fg-soft hover:text-fg-strong truncate inline-flex items-center gap-1">
                    <IconArrowUpRight width={11} height={11} /> {u}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    </SiteShell>
  );
}

function Section({ title, items, children }: { title: string; items?: { label: string; value: string }[]; children?: React.ReactNode }) {
  return (
    <section className="py-8 sm:py-10 border-t border-border">
      <div className="eyebrow text-fg-mute mb-5 sm:mb-6">{title}</div>
      {items ? (
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-5 sm:gap-y-6 max-w-3xl">
          {items.map((it) => (
            <div key={it.label}>
              <dt className="text-[10.5px] font-bold uppercase tracking-wider text-fg-mute mb-1">{it.label}</dt>
              <dd className="text-[14px] sm:text-[15px] font-semibold tracking-tight break-all">{it.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        children
      )}
    </section>
  );
}

function MetaRow({ Icon, label, children }: { Icon: React.ComponentType<{ width?: number; height?: number }>; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon width={12} height={12} />
      <span className="text-fg-mute">{label}</span>
      <span className="text-fg font-mono-num">{children}</span>
    </div>
  );
}
