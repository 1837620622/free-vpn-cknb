/**
 * 类型标签 chip
 */
const LABEL: Record<string, { label: string; bg: string; text: string }> = {
  trial: { label: '试用', bg: 'bg-blue-50 dark:bg-blue-500/15', text: 'text-blue-700 dark:text-blue-300' },
  free: { label: '免费', bg: 'bg-emerald-50 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-300' },
  node: { label: '节点', bg: 'bg-amber-50 dark:bg-amber-500/15', text: 'text-amber-700 dark:text-amber-300' },
  index: { label: '索引', bg: 'bg-violet-50 dark:bg-violet-500/15', text: 'text-violet-700 dark:text-violet-300' },
  review: { label: '评测', bg: 'bg-pink-50 dark:bg-pink-500/15', text: 'text-pink-700 dark:text-pink-300' },
  dead: { label: '跑路', bg: 'bg-rose-50 dark:bg-rose-500/15', text: 'text-rose-700 dark:text-rose-300' },
};

export function TypeChip({ type }: { type: string }) {
  const c = LABEL[type] || LABEL.review;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
}
