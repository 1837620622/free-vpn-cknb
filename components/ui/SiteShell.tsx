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
import { GlobalScene } from './GlobalScene';
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
      <GlobalScene />

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
                  className="relative px-3 py-1.5 text-[13px] font-medium transition-all duration-200 rounded-md hover:bg-bg-elev/50"
                  style={{ color: active ? 'var(--fg-strong)' : 'var(--fg-soft)' }}
                >
                  {n.label}
                  {active && (
                    <span className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full transition-all duration-300" style={{ background: NV_GREEN, boxShadow: '0 0 8px rgba(118,185,0,0.5)' }} />
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
            <Link
              href="/sources"
              className="hidden sm:inline-flex p-2 rounded-md hover:bg-bg-elev transition-colors"
              style={{ color: 'var(--fg-soft)' }}
              aria-label="查看数据源"
            >
              <IconSearch width={16} height={16} />
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-bg-elev transition-colors"
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
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-bg-elev" style={{ color: 'var(--fg-soft)' }} aria-label="关闭菜单">
                <IconClose width={18} height={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4" aria-label="移动导航">
              {NAV.map((n, i) => {
                const active = n.href === '/' ? pathname === '/' : pathname?.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="flex items-center justify-between px-5 py-3 text-[16px] font-medium border-b transition-all duration-200 card-enter"
                    style={{ color: active ? NV_GREEN : 'var(--fg)', borderColor: 'var(--border)', animationDelay: `${i * 0.04}s` }}
                  >
                    <span>{n.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full pulse-soft" style={{ background: NV_GREEN, boxShadow: '0 0 8px rgba(118,185,0,0.8)' }} />}
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
        className="mt-10 sm:mt-14 transition-colors"
        style={{
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg) 70%, transparent), color-mix(in srgb, var(--bg-elev) 82%, transparent))',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 py-8 sm:py-10">
          <div className="footer-console">
            <div className="footer-console__metrics">
              <FooterMetric label="活跃条目" value={stats.totalActive} />
              <FooterMetric label="公开源" value={stats.totalSources} />
              <FooterMetric label="24h 实时" value={stats.realtime24h} />
              <FooterMetric label="窗口" value={stats.windowText} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-12 gap-6 sm:gap-8 px-4 sm:px-5 py-6 sm:py-7">
              <div className="col-span-2 sm:col-span-5">
                <div className="flex items-center gap-2.5 mb-3">
                <span className="h-7 w-7 rounded-md flex items-center justify-center font-black text-black text-[13px]" style={{ background: NV_GREEN }}>CK</span>
                <span className="text-[15px] font-bold tracking-tight">{stats.siteName}</span>
              </div>
                <p className="text-[13px] leading-relaxed max-w-sm" style={{ color: 'var(--fg-soft)' }}>
                  每天自动同步公开源，内容变化才写入快照。作者传康Kk，域名 free-vpn.chuankangkk.top。
                </p>
              </div>
              <FooterLinks title="分类" links={[
                { href: '/trial', label: '试用机场' },
                { href: '/free', label: '免费机场' },
                { href: '/nodes', label: '实时节点' },
                { href: '/airports', label: '机场库' },
              ]} />
              <FooterLinks title="内容" links={[
                { href: '/daily', label: '日报' },
                { href: '/reviews', label: '评测' },
                { href: '/dead', label: '跑路名单' },
                { href: '/sources', label: '数据源' },
              ]} />
              <div className="col-span-2 sm:col-span-3">
                <h4 className="eyebrow mb-3" style={{ color: 'var(--fg-faint)' }}>作者</h4>
                <ul className="space-y-1.5 text-[13px]" style={{ color: 'var(--fg-soft)' }}>
                  <li>传康Kk</li>
                  <li>微信 {stats.author.wechat}</li>
                  <li>邮箱 {stats.author.email}</li>
                  <li>B站 / 咸鱼: {stats.author.bilibili}</li>
                </ul>
              </div>
            </div>

            <div className="footer-console__bar">
              <span>本项目仅供技术研究与学习用途，请遵守当地法律法规</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full pulse-soft" style={{ background: NV_GREEN, boxShadow: '0 0 8px rgba(118,185,0,0.8)' }} />
                <span className="font-bold" style={{ color: 'var(--accent-text)' }}>LIVE</span>
                <span className="font-mono-num">free-vpn.chuankangkk.top</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="footer-metric transition-colors duration-200 hover:bg-bg-elev/30">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FooterLinks({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="col-span-1 sm:col-span-2">
      <h4 className="eyebrow mb-3" style={{ color: 'var(--fg-faint)' }}>{title}</h4>
      <ul className="space-y-1.5 text-[13px]" style={{ color: 'var(--fg-soft)' }}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="footer-link" style={{ color: 'inherit' }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
