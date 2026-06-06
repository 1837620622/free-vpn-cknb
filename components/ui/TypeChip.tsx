/**
 * 类型标签 chip：每种 type 用对应 CSS 变量（深 / 浅双主题）
 */
import { getTheme } from '@/lib/themes';

export function TypeChip({ type, size = 'sm' }: { type: string; size?: 'sm' | 'md' }) {
  const theme = getTheme(type);
  const sizeCls = size === 'md' ? 'px-2 py-0.5 text-[11px]' : 'px-1.5 py-0.5 text-[10px]';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-bold uppercase tracking-wider ${sizeCls}`}
      style={{
        background: `color-mix(in srgb, ${theme.color} 14%, transparent)`,
        color: `color-mix(in srgb, ${theme.color} 75%, var(--fg))`,
        border: `1px solid color-mix(in srgb, ${theme.color} 30%, transparent)`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.color, boxShadow: `0 0 4px ${theme.color}` }} />
      {theme.plural}
    </span>
  );
}
