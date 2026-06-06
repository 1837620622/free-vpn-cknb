import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '免费 VPN 情报站 — 实时聚合',
  description: '公开源自动抓取 · 后台定时同步 · 试用 / 免费 / 实时节点 / 机场评测',
  metadataBase: new URL('https://free-vpn.chuankangkk.top'),
  openGraph: {
    title: '免费 VPN 情报站',
    description: '公开源自动抓取 · 后台定时同步 · 试用 / 免费 / 实时节点',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F8FA' },
    { media: '(prefers-color-scheme: dark)', color: '#090C10' },
  ],
};

const themeBootstrap = `
(function() {
  try {
    var k = 'theme-mode';
    var m = localStorage.getItem(k) || 'system';
    var r = m === 'light' ? 'light' : m === 'dark' ? 'dark' :
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', r);
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
