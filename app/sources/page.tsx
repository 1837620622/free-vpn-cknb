/**
 * 数据源页（深色工具站风）
 */
import { SiteShell } from '@/components/ui/SiteShell';
import { IconArrowUpRight } from '@/components/ui/Icon';
import { getMeta, getEntries } from '@/lib/read-data';
import { getShellStats } from '@/lib/shell-stats';
import { formatUpdatedAt, getCronText, getWindowText } from '@/lib/site-text';

export const dynamic = 'force-dynamic';

const NV_GREEN = '#76B900';

export default function SourcesPage() {
  const stats = getShellStats();
  const all = getEntries();
  const meta = getMeta();
  const sources = meta.sources || [];
  const bySource = new Map<string, number>();
  for (const e of all) for (const s of e.sources || []) bySource.set(s, (bySource.get(s) || 0) + 1);

  const enabledCount = sources.length;
  const okCount = sources.filter((s) => s.lastSuccess).length;
  const failCount = sources.filter((s) => !s.lastSuccess).length;

  return (
    <SiteShell stats={stats}>
      <section className="pt-10 sm:pt-16 pb-8 sm:pb-12">
        <div className="eyebrow mb-3" style={{ color: NV_GREEN }}>数据源</div>
        <h1 className="display text-[36px] sm:text-[56px] lg:text-[72px] text-white leading-[1.0]">
          {enabledCount} 个公开源
        </h1>
        <p className="mt-4 text-[14px] sm:text-[15px] text-white/60 max-w-2xl leading-relaxed">
          所有数据均由 GitHub Actions 自动抓取，每 {getCronText()}一次，超过 {getWindowText()}的条目自动归档。
        </p>

        <div className="mt-6 flex flex-wrap gap-2 sm:gap-3 text-[12px] font-mono-num">
          <span className="px-2.5 py-1 rounded border border-white/10 bg-white/[0.02] text-white/70">
            <span className="text-white/40">总源</span> <span className="font-bold text-white">{enabledCount}</span>
          </span>
          <span className="px-2.5 py-1 rounded border border-white/10 bg-white/[0.02] text-white/70">
            <span className="text-white/40">正常</span> <span className="font-bold" style={{ color: NV_GREEN }}>{okCount}</span>
          </span>
          <span className="px-2.5 py-1 rounded border border-white/10 bg-white/[0.02] text-white/70">
            <span className="text-white/40">异常</span> <span className={`font-bold ${failCount > 0 ? 'text-rose-400' : 'text-white/40'}`}>{failCount}</span>
          </span>
        </div>
      </section>

      <section className="pb-20">
        {sources.length === 0 ? (
          <div className="py-20 text-center text-white/45 text-[14px]">暂无数据</div>
        ) : (
          <div className="border-t border-white/10">
            {sources.map((s) => {
              const count = bySource.get(s.id) || 0;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid grid-cols-12 gap-3 sm:gap-4 items-center py-4 sm:py-5 border-b border-white/8 hover:bg-white/[0.03] transition-colors -mx-3 px-3"
                >
                  <div className="col-span-12 sm:col-span-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[15px] sm:text-[16px] font-bold tracking-tight text-white">{s.displayName || s.id}</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border border-white/10 text-white/55 font-mono-num">
                        {s.id}
                      </span>
                    </div>
                    <div className="text-[12px] text-white/45 truncate">{s.url.replace(/^https?:\/\//, '')}</div>
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-[12px] text-white/55 font-mono-num">
                    <div className="text-white/40 text-[10.5px] uppercase tracking-wider mb-0.5">收录</div>
                    <div className="text-white font-semibold text-[15px]">{count}</div>
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-[12px] text-white/55 font-mono-num">
                    <div className="text-white/40 text-[10.5px] uppercase tracking-wider mb-0.5">状态</div>
                    <div className={`text-[12px] font-bold inline-flex items-center gap-1 ${s.lastSuccess ? '' : 'text-rose-400'}`} style={{ color: s.lastSuccess ? NV_GREEN : undefined }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.lastSuccess ? NV_GREEN : '#F87171', boxShadow: s.lastSuccess ? '0 0 6px rgba(118,185,0,0.7)' : 'none' }} />
                      {s.lastSuccess ? '正常' : '失败'}
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-3 text-[12px] text-white/45 font-mono-num">
                    <div className="text-white/40 text-[10.5px] uppercase tracking-wider mb-0.5">最近成功</div>
                    <div className="text-white/70">{s.lastRunAt ? formatUpdatedAt(s.lastRunAt) : '—'}</div>
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
