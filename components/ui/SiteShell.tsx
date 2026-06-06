/**
 * 站点通用 layout - 顶部 hero + 玻璃 nav
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { GradientBg } from './GradientBg';
import { IconMenu } from './Icon';

const NAV = [
  { href: '/', label: '概览' },
  { href: '/trial', label: '试用' },
  { href: '/free', label: '免费' },
  { href: '/nodes', label: '节点' },
  { href: '/airports', label: '机场库' },
  { href: '/daily', label: '日报' },
  { href: '/sources', label: '源' },
  { href: '/about', label: '关于' },
];

export function SiteShell({ children, totalActive, totalSources, updatedAt }: { children: ReactNode; totalActive: number; totalSources: number; updatedAt: string }) {
  return (
    <div className="min-h-screen text-slate-900 dark:text-white antialiased" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Helvetica Neue", sans-serif' }}>
      <GradientBg />
      <header className="sticky top-0 z-30 border-b border-white/30 dark:border-white/10 backdrop-blur-2xl bg-white/60 dark:bg-black/30">
        <div className="mx-auto max-w-6xl px-5 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 shadow-lg shadow-blue-500/40" />
            <div className="leading-tight">
              <div className="text-[15px] font-semibold">CK 免费 VPN 搜集</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{totalActive} 条 · {totalSources} 源 · 更新 {updatedAt}</div>
            </div>
          </Link>
          <nav className="ml-auto hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="px-3 py-1.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-white/60">
                {n.label}
              </Link>
            ))}
          </nav>
          <button className="md:hidden ml-auto p-2 rounded-full bg-white/60">
            <IconMenu width={18} height={18} />
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-5 py-10 text-[12px] text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap gap-3 justify-between border-t border-white/30 pt-6">
          <div>
            © {new Date().getFullYear()} 传康Kk · 微信 1837620622 · 邮箱 2040168455@qq.com
          </div>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-slate-800">关于</Link>
            <Link href="/sources" className="hover:text-slate-800">数据源</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
