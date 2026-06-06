/**
 * VPN 卡片：双主题（深/浅）+ 每种 type 独立配色 + 信息密度高
 * 颜色通过 var(--xxx) 走主题系统；type 主题色用 inline style
 */
import Link from 'next/link';
import { FreshnessBadge } from './FreshnessBadge';
import { TypeChip } from './TypeChip';
import { IconArrowUpRight, IconTelegram, IconTag, IconBolt, IconClock, IconSpeed, IconGlobe, IconData } from './Icon';
import type { VpnEntry } from '@/lib/types';
import { getTheme } from '@/lib/themes';
import { formatDateShort } from '@/lib/site-text';

function simplifyNodeName(name: string): { short: string; tag: string | null } {
  const cleaned = name
    .replace(/Join Telegram[:：]?@?[A-Za-z0-9_]{3,30}/gi, '')
    .replace(/Telegram[:：]?@?[A-Za-z0-9_]{3,30}/gi, '')
    .replace(/@\w{3,30}/g, '')
    .replace(/\[.*?\]|\(.*?\)/g, '')
    .replace(/[🇦-🇿]{2}/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const tg = name.match(/Telegram[:：]?@?([A-Za-z0-9_]{3,30})/i)?.[1];
  return { short: cleaned.slice(0, 32), tag: tg ?? null };
}

const TYPE_VAR: Record<string, string> = {
  trial: '--type-trial',
  free: '--type-free',
  node: '--type-node',
  review: '--type-review',
  index: '--type-index',
  dead: '--type-dead',
};

export function VpnCard({ entry }: { entry: VpnEntry }) {
  const primaryUrl = entry.signupUrl || entry.websiteUrl || entry.subscriptionUrl;
  const isNode = entry.type === 'node';
  const { short, tag } = isNode ? simplifyNodeName(entry.name) : { short: entry.name, tag: null };
  const theme = getTheme(entry.type);
  const published = formatDateShort(entry.publishedAt);
  const cssVar = TYPE_VAR[entry.type] || TYPE_VAR.review;

  return (
    <article
      className="vpn-card group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-card)',
        boxShadow: 'var(--shadow-card)',
        ['--c' as any]: `var(${cssVar})`,
      }}
    >
      <style>{`
        .vpn-card:hover {
          border-color: color-mix(in srgb, var(--c) 50%, transparent);
          box-shadow: var(--shadow-card-hover), 0 0 0 1px color-mix(in srgb, var(--c) 18%, transparent);
        }
        .vpn-card:hover .vpn-accent-strip { filter: brightness(1.15); }
      `}</style>
      <div
        className="vpn-accent-strip h-[3px] w-full"
        style={{ background: `linear-gradient(90deg, ${theme.color} 0%, ${theme.color}80 100%)` }}
      />

      <div className="px-4 sm:px-5 pt-4 pb-3 flex items-center gap-2 flex-wrap">
        <TypeChip type={entry.type} />
        <FreshnessBadge publishedAt={entry.publishedAt} size="sm" />
        {entry.couponCode && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10.5px] font-bold rounded border border-amber-400/30 bg-amber-400/10 text-amber-300">
            <IconTag width={10} height={10} />
            {entry.couponCode}
          </span>
        )}
        <span className="ml-auto text-[10.5px] font-mono-num" style={{ color: 'var(--fg-faint)' }}>{published}</span>
      </div>

      <div className="px-4 sm:px-5 pb-3 flex-1 flex flex-col">
        <h3 className="text-[16px] sm:text-[17px] font-semibold tracking-tight leading-snug" style={{ color: 'var(--fg-strong)' }} title={entry.name}>
          {short}
        </h3>
        {entry.description && (
          <p className="mt-1.5 text-[12.5px] line-clamp-2 leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
            {entry.description}
          </p>
        )}

        {(entry.traffic || entry.period || entry.speed || entry.nodeCount != null || entry.latencyMs != null || entry.regions?.length) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.traffic && <Spec Icon={IconData} label="流量" value={entry.traffic} />}
            {entry.period && <Spec Icon={IconClock} label="周期" value={entry.period} />}
            {entry.speed && <Spec Icon={IconSpeed} label="速度" value={entry.speed} />}
            {entry.nodeCount != null && <Spec Icon={IconBolt} label="节点" value={String(entry.nodeCount)} />}
            {entry.latencyMs != null && <Spec Icon={IconGlobe} label="延迟" value={entry.latencyMs + 'ms'} />}
            {entry.regions?.slice(0, 2).map((r) => (
              <span key={r} className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-medium" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg-soft)' }}>
                {r}
              </span>
            ))}
          </div>
        )}

        {entry.protocols?.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {entry.protocols.slice(0, 5).map((p) => (
              <span key={p} className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ border: '1px solid var(--border)', color: 'var(--fg-soft)' }}>
                {p}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="px-4 sm:px-5 pb-4 pt-3 flex items-center gap-2 flex-wrap" style={{ borderTop: '1px solid var(--border)' }}>
        {primaryUrl ? (
          <a
            href={primaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-bold rounded-md text-white transition-transform active:scale-[0.97]"
            style={{ background: theme.color, boxShadow: `0 4px 12px ${theme.color}40` }}
          >
            {isNode ? '获取订阅' : '立即注册'}
            <IconArrowUpRight width={11} height={11} />
          </a>
        ) : null}
        {entry.telegramGroup && (
          <a href={entry.telegramGroup} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11.5px] font-medium rounded-md hover:opacity-80" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg-soft)' }}>
            <IconTelegram width={11} height={11} /> 群
          </a>
        )}
        {tag && (
          <a href={`https://t.me/${tag}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 text-[10.5px] rounded hover:opacity-80" style={{ background: 'var(--bg)', color: 'var(--fg-mute)' }}>
            <IconTelegram width={10} height={10} /> {tag}
          </a>
        )}
        <Link
          href={`/vpn/${entry.id}`}
          className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 text-[11.5px] font-medium hover:opacity-80"
          style={{ color: 'var(--fg-soft)' }}
        >
          详情 <IconArrowUpRight width={10} height={10} />
        </Link>
      </div>
    </article>
  );
}

function Spec({ Icon, label, value }: { Icon: React.ComponentType<{ width?: number; height?: number }>; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-num" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
      <Icon width={10} height={10} />
      <span style={{ color: 'var(--fg-faint)' }}>{label}</span>
      <span style={{ color: 'var(--fg)' }}>{value}</span>
    </span>
  );
}
