/**
 * 数据源页（深/浅双主题）
 */
import { SiteShell } from '@/components/ui/SiteShell';
import { getMetaRuntime, getEntriesRuntime } from '@/lib/read-data';
import { getShellStatsRuntime } from '@/lib/shell-stats';
import { formatUpdatedAt, getWindowText } from '@/lib/site-text';

export const dynamic = 'force-dynamic';

export default async function SourcesPage() {
  const stats = await getShellStatsRuntime();
  const all = await getEntriesRuntime();
  const meta = await getMetaRuntime();
  const sources = meta.sources || [];
  const bySource = new Map<string, number>();
  for (const e of all) for (const s of e.sources || []) bySource.set(s, (bySource.get(s) || 0) + 1);

  const enabledCount = sources.length;
  const okCount = sources.filter((s) => s.lastSuccess).length;
  const failCount = sources.filter((s) => !s.lastSuccess).length;

  return (
    <SiteShell stats={stats}>
      <section className="pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="eyebrow mb-3" style={{ color: 'var(--accent-text)' }}>数据源</div>
        <h1 className="display text-[36px] sm:text-[56px] lg:text-[72px] text-fg-strong leading-[1.0]">
          {enabledCount} 个公开源
        </h1>
        <p className="mt-4 text-[14px] sm:text-[15px] text-fg-soft max-w-2xl leading-relaxed">
          所有数据均由后台定时任务自动抓取，每天一次，超过 {getWindowText()}的条目自动归档。
        </p>

        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3 text-[12px] font-mono-num">
          <span className="px-2.5 py-1 rounded border border-border bg-bg-elev text-fg-soft">
            <span className="text-fg-mute">总源</span> <span className="font-bold text-fg">{enabledCount}</span>
          </span>
          <span className="px-2.5 py-1 rounded border border-border bg-bg-elev text-fg-soft">
            <span className="text-fg-mute">正常</span> <span className="font-bold" style={{ color: 'var(--accent-text)' }}>{okCount}</span>
          </span>
          <span className="px-2.5 py-1 rounded border border-border bg-bg-elev text-fg-soft">
            <span className="text-fg-mute">异常</span> <span className={`font-bold ${failCount > 0 ? 'text-rose-500 dark:text-rose-400' : 'text-fg-mute'}`}>{failCount}</span>
          </span>
        </div>
      </section>

      <section className="pb-14 sm:pb-18">
        {sources.length === 0 ? (
          <div className="py-12 text-center text-fg-mute text-[14px]">暂无数据</div>
        ) : (
          <div className="border-t border-border">
            {sources.map((s) => {
              const count = bySource.get(s.id) || 0;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid grid-cols-12 gap-3 sm:gap-4 items-center py-4 sm:py-5 border-b border-border hover:bg-bg-elev transition-colors -mx-3 px-3"
                >
                  <div className="col-span-12 sm:col-span-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[15px] sm:text-[16px] font-bold tracking-tight text-fg-strong">{s.displayName || s.id}</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border border-border text-fg-soft font-mono-num">
                        {s.id}
                      </span>
                    </div>
                    <div className="text-[12px] text-fg-mute truncate">{s.url.replace(/^https?:\/\//, '')}</div>
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-[12px] text-fg-soft font-mono-num">
                    <div className="text-fg-mute text-[10.5px] uppercase tracking-wider mb-0.5">收录</div>
                    <div className="text-fg-strong font-semibold text-[15px]">{count}</div>
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-[12px] text-fg-soft font-mono-num">
                    <div className="text-fg-mute text-[10.5px] uppercase tracking-wider mb-0.5">状态</div>
                    <div className={`text-[12px] font-bold inline-flex items-center gap-1 ${s.lastSuccess ? '' : 'text-rose-500 dark:text-rose-400'}`} style={{ color: s.lastSuccess ? 'var(--accent-text)' : undefined }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.lastSuccess ? 'var(--accent-green)' : '#F87171', boxShadow: s.lastSuccess ? '0 0 6px rgba(118,185,0,0.7)' : 'none' }} />
                      {s.lastSuccess ? '正常' : '失败'}
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-3 text-[12px] text-fg-soft font-mono-num">
                    <div className="text-fg-mute text-[10.5px] uppercase tracking-wider mb-0.5">最近成功</div>
                    <div className="text-fg">{s.lastRunAt ? formatUpdatedAt(s.lastRunAt) : '—'}</div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
