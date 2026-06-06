import { SiteShell } from '@/components/ui/SiteShell';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { TypeChip } from '@/components/ui/TypeChip';
import { IconArrowUpRight, IconCalendar, IconClock, IconCopy, IconGlobe, IconTag, IconTelegram } from '@/components/ui/Icon';
import { getEntryById, getMeta, getEntries } from '@/lib/read-data';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function VpnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getEntryById(id);
  if (!entry) return notFound();
  const meta = getMeta();
  const all = getEntries();
  const updatedAt = meta.generatedAt ? new Date(meta.generatedAt).toLocaleString('zh-CN', { hour12: false }) : '';

  const primaryUrl = entry.signupUrl || entry.websiteUrl || entry.subscriptionUrl;

  return (
    <SiteShell totalActive={all.length} totalSources={meta.sources?.length ?? 0} updatedAt={updatedAt}>
      <a href="/" className="text-[12px] text-slate-500 hover:text-slate-800 inline-block mb-4">← 返回</a>
      <div className="rounded-3xl bg-white/72 dark:bg-white/5 backdrop-blur-2xl ring-1 ring-white/40 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{entry.name}</h1>
          <TypeChip type={entry.type} />
          <FreshnessBadge publishedAt={entry.publishedAt} size="lg" />
        </div>
        {entry.description && (
          <p className="mt-3 text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{entry.description}</p>
        )}
        {entry.notice && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/15 text-[13px] text-amber-800 dark:text-amber-200">{entry.notice}</div>
        )}

        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
          {entry.traffic && <Field label="流量" value={entry.traffic} />}
          {entry.period && <Field label="周期" value={entry.period} />}
          {entry.speed && <Field label="速度" value={entry.speed} />}
          {entry.nodeCount != null && <Field label="节点数" value={String(entry.nodeCount)} />}
          {entry.couponCode && <Field label="优惠码" value={entry.couponCode} />}
          {entry.status && <Field label="状态" value={entry.status} />}
        </div>

        {(entry.protocols?.length || entry.regions?.length) ? (
          <div className="mt-4">
            <div className="text-[12px] text-slate-500 mb-1.5">协议</div>
            <div className="flex flex-wrap gap-1.5">
              {entry.protocols?.map((p) => <span key={p} className="px-2 py-0.5 rounded-full text-[11px] bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300">{p.toUpperCase()}</span>)}
            </div>
            {entry.regions?.length ? (
              <>
                <div className="text-[12px] text-slate-500 mb-1.5 mt-3">地区</div>
                <div className="flex flex-wrap gap-1.5">
                  {entry.regions.map((r) => <span key={r} className="px-2 py-0.5 rounded-full text-[11px] bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300">{r}</span>)}
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {primaryUrl && (
            <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_4px_18px_rgba(59,130,246,0.4)]">
              <IconGlobe width={14} height={14} />
              {entry.type === 'node' ? '打开订阅' : '打开官网'}
              <IconArrowUpRight width={13} height={13} />
            </a>
          )}
          {entry.telegramGroup && (
            <a href={entry.telegramGroup} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-full bg-sky-50 text-sky-700">
              <IconTelegram width={13} height={13} /> 群组
            </a>
          )}
          {entry.telegramChannel && (
            <a href={entry.telegramChannel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-full bg-sky-50 text-sky-700">
              <IconTelegram width={13} height={13} /> 频道
            </a>
          )}
          {entry.subscriptionUrl && (
            <button onClick={() => navigator.clipboard?.writeText(entry.subscriptionUrl!).then(() => alert('已复制订阅链接'))} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-full bg-slate-100 text-slate-700">
              <IconCopy width={13} height={13} /> 复制订阅
            </button>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-white/30 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5"><IconClock width={11} height={11} /> 抓取时间 {new Date(entry.scrapedAt).toLocaleString('zh-CN', { hour12: false })}</div>
          {entry.publishedAt && <div className="flex items-center gap-1.5"><IconCalendar width={11} height={11} /> 发布时间 {new Date(entry.publishedAt).toLocaleString('zh-CN', { hour12: false })}</div>}
          {entry.sourceUrls?.length > 0 && (
            <div>
              <div className="mt-2">来源</div>
              <div className="flex flex-col gap-1 mt-1">
                {entry.sourceUrls.map((u) => <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 truncate max-w-2xl">{u}</a>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/60 dark:bg-white/5 ring-1 ring-white/40 p-3">
      <div className="text-[11px] text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-[14px] font-medium text-slate-800 dark:text-white break-all">{value}</div>
    </div>
  );
}
