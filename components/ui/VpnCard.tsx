/**
 * VPN 单卡片
 */
import Link from 'next/link';
import { FreshnessBadge } from './FreshnessBadge';
import { TypeChip } from './TypeChip';
import { IconArrowUpRight, IconCopy, IconGlobe, IconTelegram, IconTag } from './Icon';
import type { VpnEntry } from '@/lib/types';

export function VpnCard({ entry }: { entry: VpnEntry }) {
  const primaryUrl = entry.signupUrl || entry.websiteUrl || entry.subscriptionUrl;
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/72 dark:bg-white/5 backdrop-blur-2xl ring-1 ring-white/40 dark:ring-white/10 shadow-[0_8px_40px_rgba(15,23,42,0.08)] p-5 hover:shadow-[0_12px_50px_rgba(15,23,42,0.12)] transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[17px] font-semibold tracking-tight truncate">{entry.name}</h3>
            <TypeChip type={entry.type} />
            <FreshnessBadge publishedAt={entry.publishedAt} />
          </div>
          {entry.description && (
            <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {entry.description}
            </p>
          )}
        </div>
      </div>

      {(entry.traffic || entry.period || entry.speed || entry.nodeCount) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.traffic && <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">流量 {entry.traffic}</span>}
          {entry.period && <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">周期 {entry.period}</span>}
          {entry.speed && <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">速度 {entry.speed}</span>}
          {entry.nodeCount != null && <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">节点 {entry.nodeCount}</span>}
        </div>
      )}

      {(entry.protocols?.length || entry.regions?.length) ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.protocols?.map((p) => <span key={p} className="px-2 py-0.5 rounded-full text-[11px] bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300">{p.toUpperCase()}</span>)}
          {entry.regions?.slice(0, 5).map((r) => <span key={r} className="px-2 py-0.5 rounded-full text-[11px] bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300">{r}</span>)}
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {primaryUrl && (
          <a href={primaryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_4px_14px_rgba(59,130,246,0.35)] ring-1 ring-white/30 active:scale-[0.97]">
            <IconGlobe width={13} height={13} />
            {entry.type === 'node' ? '获取订阅' : '立即注册'}
            <IconArrowUpRight width={12} height={12} />
          </a>
        )}
        {entry.couponCode && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300">
            <IconTag width={11} height={11} /> 优惠码 {entry.couponCode}
          </span>
        )}
        {entry.telegramGroup && (
          <a href={entry.telegramGroup} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-full bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300">
            <IconTelegram width={12} height={12} /> 群
          </a>
        )}
        {entry.telegramChannel && (
          <a href={entry.telegramChannel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-full bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300">
            <IconTelegram width={12} height={12} /> 频道
          </a>
        )}
        <Link href={`/vpn/${entry.id}`} className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-medium rounded-full bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-200 ring-1 ring-white/50">
          详情 <IconArrowUpRight width={11} height={11} />
        </Link>
      </div>
    </div>
  );
}
