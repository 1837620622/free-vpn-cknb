import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CK 免费 VPN 搜集',
  description: '13 个公开源，6 小时自动同步。试用、免费、实时节点、机场评测一站聚合。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
