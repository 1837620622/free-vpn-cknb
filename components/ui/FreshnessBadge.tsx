/**
 * 5 级新鲜度徽章（醒目）
 *  < 24h  绿色 #10B981  "实时"
 *  < 3d   蓝色 #3B82F6  "今日"
 *  < 7d   紫色 #8B5CF6  "本周"
 *  < 15d  灰色 #6B7280  "近期"
 *  > 15d  不显示
 */
import { IconBolt, IconClock, IconCalendar, IconSparkle } from './Icon';

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

const config: Record<Freshness, { label: string; bg: string; text: string; ring: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  realtime: { label: '实时', bg: 'bg-emerald-500/95', text: 'text-white', ring: 'ring-emerald-300/60', Icon: IconBolt },
  today: { label: '今日', bg: 'bg-blue-500/95', text: 'text-white', ring: 'ring-blue-300/60', Icon: IconSparkle },
  week: { label: '本周', bg: 'bg-violet-500/95', text: 'text-white', ring: 'ring-violet-300/60', Icon: IconClock },
  recent: { label: '近期', bg: 'bg-slate-400/90', text: 'text-white', ring: 'ring-slate-300/60', Icon: IconCalendar },
};

export function FreshnessBadge({ publishedAt, size = 'md' }: { publishedAt: string | undefined | null; size?: 'sm' | 'md' | 'lg' }) {
  const f = getFreshness(publishedAt);
  if (!f) return null;
  const c = config[f];
  const sizing = size === 'lg' ? 'px-3 py-1.5 text-sm gap-1.5' : size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';
  const iconSize = size === 'lg' ? 14 : size === 'sm' ? 11 : 12;
  return (
    <span className={`inline-flex items-center ${sizing} ${c.bg} ${c.text} font-medium rounded-full ring-1 ${c.ring} shadow-sm`}>
      <c.Icon width={iconSize} height={iconSize} />
      {c.label}
    </span>
  );
}
