/**
 * 试用机场 / 免费机场 / 节点 / 评测 / 跑路 / 机场库 共用 ListPage
 */
import { SiteShell } from '@/components/ui/SiteShell';
import { VpnCard } from '@/components/ui/VpnCard';
import { getEntries, getMeta } from '@/lib/read-data';
import type { VpnEntry } from '@/lib/types';

export const dynamic = 'force-dynamic';

type Filter = 'trial' | 'free' | 'node' | 'review' | 'dead' | 'all' | string[];

export function ListPage({ title, subtitle, filter, badge }: { title: string; subtitle: string; filter: Filter; badge?: string }) {
  const meta = getMeta();
  const all = getEntries();
  const list: VpnEntry[] = Array.isArray(filter) ? all.filter((e) => (filter as string[]).includes(e.type)) : filter === 'all' ? all : all.filter((e) => e.type === filter);
  const updatedAt = meta.generatedAt ? new Date(meta.generatedAt).toLocaleString('zh-CN', { hour12: false }) : '';

  return (
    <SiteShell totalActive={all.length} totalSources={meta.sources?.length ?? 0} updatedAt={updatedAt}>
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {title} {badge && <span className="ml-2 align-middle px-2.5 py-0.5 text-[12px] rounded-full bg-slate-900/90 text-white">{badge}</span>}
        </h1>
        <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-300">{subtitle}</p>
        <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">共 {list.length} 条</p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((e) => <VpnCard key={e.id} entry={e} />)}
      </div>
    </SiteShell>
  );
}
