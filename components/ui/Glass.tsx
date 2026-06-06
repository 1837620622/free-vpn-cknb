/**
 * 苹果风玻璃卡片
 */
import type { ReactNode } from 'react';

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-bg-elev backdrop-blur-2xl ring-1 ring-border shadow-[0_8px_30px_rgba(15,23,42,0.08)] ${className}`}>
      {children}
    </div>
  );
}

export function GlassButton({ children, href, onClick, external, variant = 'primary' }: { children: ReactNode; href?: string; onClick?: () => void; external?: boolean; variant?: 'primary' | 'ghost' | 'dark' }) {
  const cls = variant === 'primary'
    ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_4px_18px_rgba(59,130,246,0.4)] ring-1 ring-white/30'
    : variant === 'dark'
    ? 'bg-slate-900/90 text-white ring-1 ring-white/20'
    : 'bg-bg-elev text-fg ring-1 ring-border';
  const wrap = `inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-transform active:scale-[0.97] ${cls}`;
  if (href) {
    return (
      <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={wrap}>
        {children}
      </a>
    );
  }
  return <button onClick={onClick} className={wrap}>{children}</button>;
}
