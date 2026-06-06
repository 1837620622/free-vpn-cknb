/**
 * 日报：按 publishedAt 排序的最新节点 + 试用机场
 */
import { SiteShell } from '@/components/ui/SiteShell';
import { VpnCard } from '@/components/ui/VpnCard';
import { getEntries, getMeta } from '@/lib/read-data';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';

export const dynamic = 'force-dynamic';

export default function DailyPage() {
  const meta = getMeta();
  const all = getEntries();
  const updatedAt = meta.generatedAt ? new Date(meta.generatedAt).toLocaleString('zh-CN', { hour12: false }) : '';

  const sorted = [...all].sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
  const dayMs = 24 * 3600 * 1000;
  const groups: { label: string; ms: number; items: typeof sorted }[] = [
    { label: '今日（24h 内）', ms: dayMs, items: sorted.filter((e) => Date.now() - new Date(e.publishedAt || 0).getTime() < dayMs) },
    { label: '近 3 日', ms: 3 * dayMs, items: sorted.filter((e) => { const d = Date.now() - new Date(e.publishedAt || 0).getTime(); return d >= dayMs && d < 3 * dayMs; }) },
    { label: '近 7 日', ms: 7 * dayMs, items: sorted.filter((e) => { const d = Date.now() - new Date(e.publishedAt || 0).getTime(); return d >= 3 * dayMs && d < 7 * dayMs; }) },
    { label: '近 15 日', ms: 15 * dayMs, items: sorted.filter((e) => { const d = Date.now() - new Date(e.publishedAt || 0).getTime(); return d >= 7 * dayMs && d < 15 * dayMs; }) },
  ];

  return (
    <SiteShell totalActive={all.length} totalSources={meta.sources?.length ?? 0} updatedAt={updatedAt}>
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">日报</h1>
        <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-300">按发布时间分组 · 最先看最近 24 小时</p>
      </section>
      {groups.map((g) => g.items.length > 0 && (
        <section key={g.label} className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <FreshnessBadge publishedAt={new Date(Date.now() - g.ms / 2).toISOString()} size="md" />
            <h2 className="text-[20px] font-semibold tracking-tight">{g.label}</h2>
            <span className="text-[12px] text-slate-500 dark:text-slate-400">{g.items.length} 条</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {g.items.slice(0, 30).map((e) => <VpnCard key={e.id} entry={e} />)}
          </div>
        </section>
      ))}
    </SiteShell>
  );
}
