/**
 * 全局 layout：双主题（深 / 浅）+ 干净 nav + 移动端 drawer + footer
 * 所有颜色通过 var(--xxx) 走主题系统，无硬编码颜色（除品牌强调色）
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { GradientBg } from './GradientBg';
import { IconMenu, IconClose, IconSearch } from './Icon';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { href: '/', label: '概览' },
  { href: '/trial', label: '试用' },
  { href: '/free', label: '免费' },
  { href: '/nodes', label: '节点' },
  { href: '/airports', label: '机场库' },
  { href: '/daily', label: '日报' },
  { href: '/reviews', label: '评测' },
  { href: '/sources', label: '数据源' },
  { href: '/about', label: '关于' },
];

const NV_GREEN = '#76B900';

export function SiteShell({ children, stats }: { children: ReactNode; stats: { totalActive: number; totalSources: number; realtime24h: number; updatedAt: string; cronText: string; siteName: string; author: { wechat: string; nickname: string; email: string; bilibili: string }; windowText: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="min-h-screen antialiased" style={{ color: 'var(--fg)' }}>
      <GradientBg />

      <header
        className="sticky top-0 z-40 backdrop-blur-xl transition-colors"
        style={{
          background: 'color-mix(in srgb, var(--bg) 75%, transparent)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 h-14 sm:h-16 flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="返回首页">
            <span
              className="h-7 w-7 rounded-md flex items-center justify-center font-black text-black text-[13px] tracking-tighter"
              style={{ background: NV_GREEN, boxShadow: '0 0 18px rgba(118,185,0,0.35)' }}
            >
              CK
            </span>
            <span className="text-[14px] sm:text-[15px] font-bold tracking-tight">{stats.siteName}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 ml-2" aria-label="主导航">
            {NAV.map((n) => {
              const active = n.href === '/' ? pathname === '/' : pathname?.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="relative px-3 py-1.5 text-[13px] font-medium transition-colors"
                  style={{ color: active ? 'var(--fg-strong)' : 'var(--fg-soft)' }}
                >
                  {n.label}
                  {active && (
                    <span className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full" style={{ background: NV_GREEN }} />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <div className="hidden md:flex items-center gap-1.5 text-[11.5px] font-mono-num" style={{ color: 'var(--fg-soft)' }}>
              <span className="font-bold tabular-nums" style={{ color: 'var(--fg-strong)' }}>{stats.totalActive}</span>
              <span>条</span>
              <span className="opacity-30">·</span>
              <span className="font-bold tabular-nums" style={{ color: 'var(--fg-strong)' }}>{stats.totalSources}</span>
              <span>源</span>
            </div>
            <span className="hidden md:flex items-center gap-1.5 text-[11.5px] font-mono-num" style={{ color: 'var(--fg-mute)' }}>
              <span className="h-1.5 w-1.5 rounded-full pulse-soft" style={{ background: NV_GREEN, boxShadow: '0 0 10px rgba(118,185,0,0.7)' }} />
              <span className="hidden lg:inline">更新 {stats.updatedAt}</span>
              <span className="lg:hidden">LIVE</span>
            </span>
            <ThemeToggle />
            <button
              className="hidden sm:inline-flex p-2 rounded-md hover:bg-white/8 transition-colors"
              style={{ color: 'var(--fg-soft)' }}
              aria-label="搜索"
            >
              <IconSearch width={16} height={16} />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-white/8 transition-colors"
              style={{ color: 'var(--fg)' }}
              aria-label="打开菜单"
            >
              <IconMenu width={18} height={18} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <aside
            className="absolute right-0 top-0 h-full w-[min(360px,85vw)] border-l flex flex-col"
            style={{ background: 'var(--bg-elev)', borderColor: 'var(--border)' }}
          >
            <div className="h-14 px-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-md flex items-center justify-center font-black text-black text-[13px]" style={{ background: NV_GREEN }}>CK</span>
                <span className="text-[15px] font-bold">{stats.siteName}</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-white/8" style={{ color: 'var(--fg-soft)' }} aria-label="关闭菜单">
                <IconClose width={18} height={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4" aria-label="移动导航">
              {NAV.map((n) => {
                const active = n.href === '/' ? pathname === '/' : pathname?.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="flex items-center justify-between px-5 py-3 text-[16px] font-medium border-b transition-colors"
                    style={{ color: active ? NV_GREEN : 'var(--fg)', borderColor: 'var(--border)' }}
                  >
                    <span>{n.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full" style={{ background: NV_GREEN }} />}
                  </Link>
                );
              })}
            </nav>
            <div className="px-5 py-4 border-t text-[12px] font-mono-num space-y-1" style={{ color: 'var(--fg-mute)', borderColor: 'var(--border)' }}>
              <div>活跃 {stats.totalActive} 条 · {stats.totalSources} 源</div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full pulse-soft" style={{ background: NV_GREEN, boxShadow: '0 0 8px rgba(118,185,0,0.8)' }} />
                <span>更新 {stats.updatedAt}</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-5 sm:px-6">{children}</main>

      <footer
        className="mt-24 sm:mt-32 backdrop-blur-xl transition-colors"
        style={{
          background: 'color-mix(in srgb, var(--bg) 92%, transparent)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 py-14 sm:py-20">
          <div className="grid grid-cols-2 sm:grid-cols-12 gap-8 sm:gap-10">
            <div className="col-span-2 sm:col-span-5">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="h-7 w-7 rounded-md flex items-center justify-center font-black text-black text-[13px]" style={{ background: NV_GREEN }}>CK</span>
                <span className="text-[15px] font-bold tracking-tight">{stats.siteName}</span>
              </div>
              <p className="text-[13px] leading-relaxed max-w-sm mb-5" style={{ color: 'var(--fg-soft)' }}>
                {stats.totalSources} 个公开源 · {stats.cronText}自动同步 · {stats.windowText}滚动窗口 · 完全开源。
              </p>
              <div className="text-[12px] space-y-0.5" style={{ color: 'var(--fg-mute)' }}>
                <div>© {new Date().getFullYear()} {stats.author.nickname}</div>
                <div>微信 {stats.author.wechat} · 邮箱 {stats.author.email}</div>
                <div>B站 / 咸鱼: {stats.author.bilibili}</div>
              </div>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <h4 className="eyebrow mb-3" style={{ color: 'var(--fg-faint)' }}>分类</h4>
              <ul className="space-y-2 text-[13px]" style={{ color: 'var(--fg-soft)' }}>
                <li><Link href="/trial" className="hover:opacity-80" style={{ color: 'inherit' }}>试用机场</Link></li>
                <li><Link href="/free" className="hover:opacity-80" style={{ color: 'inherit' }}>免费机场</Link></li>
                <li><Link href="/nodes" className="hover:opacity-80" style={{ color: 'inherit' }}>实时节点</Link></li>
                <li><Link href="/airports" className="hover:opacity-80" style={{ color: 'inherit' }}>机场库</Link></li>
              </ul>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <h4 className="eyebrow mb-3" style={{ color: 'var(--fg-faint)' }}>内容</h4>
              <ul className="space-y-2 text-[13px]" style={{ color: 'var(--fg-soft)' }}>
                <li><Link href="/daily" className="hover:opacity-80" style={{ color: 'inherit' }}>日报</Link></li>
                <li><Link href="/reviews" className="hover:opacity-80" style={{ color: 'inherit' }}>评测</Link></li>
                <li><Link href="/dead" className="hover:opacity-80" style={{ color: 'inherit' }}>跑路名单</Link></li>
                <li><Link href="/sources" className="hover:opacity-80" style={{ color: 'inherit' }}>数据源</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <h4 className="eyebrow mb-3" style={{ color: 'var(--fg-faint)' }}>项目</h4>
              <ul className="space-y-2 text-[13px]" style={{ color: 'var(--fg-soft)' }}>
                <li><Link href="/about" className="hover:opacity-80" style={{ color: 'inherit' }}>关于</Link></li>
                <li>
                  <a href="https://github.com/1837620622/freevpn-cknb-ckk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 inline-flex items-center gap-1.5" style={{ color: 'inherit' }}>
                    GitHub <IconSearch width={11} height={11} />
                  </a>
                </li>
                <li><a href="/MD说明.md" className="hover:opacity-80" style={{ color: 'inherit' }}>说明文档</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11.5px]" style={{ borderTop: '1px solid var(--border)', color: 'var(--fg-mute)' }}>
            <span>本项目仅供技术研究与学习用途，请遵守当地法律法规</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full pulse-soft" style={{ background: NV_GREEN, boxShadow: '0 0 8px rgba(118,185,0,0.8)' }} />
              <span className="font-bold" style={{ color: NV_GREEN }}>LIVE</span>
              <span className="font-mono-num">{stats.totalSources} 源 · {stats.cronText}同步</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
