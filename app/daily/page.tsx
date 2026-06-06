/**
 * 日报（深色工具站风）
 */
import { SiteShell } from '@/components/ui/SiteShell';
import { VpnCard } from '@/components/ui/VpnCard';
import { getEntriesRuntime } from '@/lib/read-data';
import { getShellStatsRuntime } from '@/lib/shell-stats';
import { getWindowText } from '@/lib/site-text';

export const dynamic = 'force-dynamic';

const BUCKETS = [
  { key: 'day', label: '今日 24h', ms: 24 * 3600 * 1000 },
  { key: '3d', label: '近 3 日', ms: 3 * 24 * 3600 * 1000 },
  { key: '7d', label: '近 7 日', ms: 7 * 24 * 3600 * 1000 },
  { key: '15d', label: getWindowText() + '内', ms: 15 * 24 * 3600 * 1000 },
] as const;

export default async function DailyPage() {
  const stats = await getShellStatsRuntime();
  const all = await getEntriesRuntime();
  const sorted = [...all].sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
  const now = Date.now();

  const groups = BUCKETS.map((b) => ({
    label: b.label,
    key: b.key,
    items: sorted.filter((e) => {
      if (!e.publishedAt) return false;
      const d = now - new Date(e.publishedAt).getTime();
      return d < b.ms;
    }),
  }));

  return (
    <SiteShell stats={stats}>
      <section className="pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="eyebrow mb-3" style={{ color: 'var(--accent-text)' }}>日报</div>
        <h1 className="display text-[36px] sm:text-[56px] lg:text-[72px] text-fg-strong leading-[1.0]">
          每日动态
        </h1>
        <p className="mt-4 text-[14px] sm:text-[15px] text-fg-soft max-w-2xl">
          按发布时间倒序，最新发布的在最上面。{getWindowText()}之外的条目已自动归档。
        </p>
      </section>

      {groups.map((g, i) => g.items.length > 0 && (
        <section key={g.key} className={`py-8 sm:py-10 ${i > 0 ? 'border-t border-border' : ''}`}>
          <header className="flex items-baseline justify-between mb-6 sm:mb-8">
            <div>
              <div className="eyebrow mb-2" style={{ color: 'var(--accent-text)' }}>0{i + 1}</div>
              <h2 className="display text-[24px] sm:text-[32px] lg:text-[40px] text-fg-strong leading-[1.0]">{g.label}</h2>
            </div>
            <span className="text-[12.5px] text-fg-mute font-mono-num">{g.items.length} 条</span>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {g.items.slice(0, 30).map((e) => <VpnCard key={e.id} entry={e} />)}
          </div>
        </section>
      ))}

      {groups.every((g) => g.items.length === 0) && (
        <div className="py-12 text-center text-fg-mute text-[14px]">{getWindowText()}内暂无新条目</div>
      )}
    </SiteShell>
  );
}
