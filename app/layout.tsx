import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CK 免费 VPN 搜集 — 13 源 6h 同步',
  description: '13 个公开源 · 6 小时自动抓取 · 试用 / 免费 / 实时节点 / 机场评测 · 完全开源',
  metadataBase: new URL('https://freevpn-cknb-ckk.vercel.app'),
  openGraph: {
    title: 'CK 免费 VPN 搜集',
    description: '13 个公开源 · 6 小时自动同步 · 试用 / 免费 / 实时节点',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F9FB' },
    { media: '(prefers-color-scheme: dark)', color: '#0E1116' },
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
