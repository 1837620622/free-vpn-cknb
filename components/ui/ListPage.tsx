/**
 * 列表页通用（深色工具站风：统一 header、清晰排版、移动端友好）
 */
import { SiteShell } from '@/components/ui/SiteShell';
import { VpnCard } from '@/components/ui/VpnCard';
import { IconArrowRight, IconChevronRight } from '@/components/ui/Icon';
import { getEntries } from '@/lib/read-data';
import { getShellStats } from '@/lib/shell-stats';
import type { VpnEntry } from '@/lib/types';

export const dynamic = 'force-dynamic';

type Filter = 'trial' | 'free' | 'node' | 'review' | 'dead' | 'all' | string[];

const NV_GREEN = '#76B900';

export function ListPage({ eyebrow, title, subtitle, filter, badge }: { eyebrow: string; title: string; subtitle: string; filter: Filter; badge?: string }) {
  const stats = getShellStats();
  const all = getEntries();
  const list: VpnEntry[] = Array.isArray(filter)
    ? all.filter((e) => (filter as string[]).includes(e.type))
    : filter === 'all'
    ? all
    : all.filter((e) => e.type === filter);

  return (
    <SiteShell stats={stats}>
      <section className="pt-10 sm:pt-16 pb-8 sm:pb-12">
        <div className="eyebrow mb-3" style={{ color: NV_GREEN }}>{eyebrow}</div>
        <h1 className="display text-[36px] sm:text-[56px] lg:text-[72px] text-white leading-[1.0] flex flex-wrap items-baseline gap-3">
          {title}
          {badge && <span className="text-[18px] sm:text-[22px] font-bold text-white/45 align-middle">{badge}</span>}
        </h1>
        <p className="mt-4 text-[14px] sm:text-[15px] text-white/60 max-w-2xl leading-relaxed">{subtitle}</p>
        <p className="mt-2 text-[12px] text-white/40 font-mono-num">共 {list.length} 条</p>
      </section>
      <section className="pb-20">
        {list.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {list.map((e) => <VpnCard key={e.id} entry={e} />)}
          </div>
        ) : (
          <div className="py-20 text-center text-white/45">
            <p className="text-[14px]">暂无数据</p>
            <a href="/" className="inline-flex items-center gap-1.5 mt-3 text-[13px] font-semibold hover:text-white">
              返回首页 <IconChevronRight width={12} height={12} />
            </a>
          </div>
        )}
      </section>
    </SiteShell>
  );
}
