/**
 * 5 级新鲜度徽章（深 / 浅双主题）
 */
import { IconBolt, IconClock, IconCalendar, IconSparkle, type IconProps } from './Icon';
import type { ComponentType, SVGProps } from 'react';

export type Freshness = 'realtime' | 'today' | 'week' | 'recent';

export function getFreshness(publishedAt: string | undefined | null): Freshness | null {
  if (!publishedAt) return null;
  const t = new Date(publishedAt).getTime();
  if (Number.isNaN(t)) return null;
  const diff = Date.now() - t;
  const day = 24 * 3600 * 1000;
  if (diff < day) return 'realtime';
  if (diff < 3 * day) return 'today';
  if (diff < 7 * day) return 'week';
  if (diff < 15 * day) return 'recent';
  return null;
}

interface Cfg { label: string; bg: string; fg: string; border: string; Icon: ComponentType<IconProps & SVGProps<SVGSVGElement>> }

const config: Record<Freshness, Cfg> = {
  realtime: { label: '实时', bg: '#76B900', fg: '#FFFFFF', border: 'transparent', Icon: IconBolt },
  today: { label: '今日', bg: '#FFFFFF', fg: '#000000', border: 'transparent', Icon: IconSparkle },
  week: { label: '本周', bg: '#404040', fg: '#FFFFFF', border: 'transparent', Icon: IconClock },
  recent: { label: '近期', bg: '#707070', fg: '#FFFFFF', border: 'transparent', Icon: IconCalendar },
};

export function FreshnessBadge({ publishedAt, size = 'md' }: { publishedAt: string | undefined | null; size?: 'sm' | 'md' | 'lg' }) {
  const f = getFreshness(publishedAt);
  if (!f) return null;
  const c = config[f];
  const sizing = size === 'lg' ? 'px-2.5 py-1 text-[12px] gap-1' : size === 'sm' ? 'px-1.5 py-0.5 text-[10px] gap-0.5' : 'px-2 py-0.5 text-[11px] gap-0.5';
  const iconSize = size === 'lg' ? 11 : size === 'sm' ? 9 : 10;
  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wide rounded ${sizing}`}
      style={{ background: c.bg, color: c.fg, boxShadow: f === 'realtime' ? '0 0 12px rgba(118, 185, 0, 0.5)' : 'none' }}
    >
      <c.Icon width={iconSize} height={iconSize} strokeWidth={2.4} />
      {c.label}
    </span>
  );
}
