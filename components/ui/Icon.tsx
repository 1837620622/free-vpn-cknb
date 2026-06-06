/**
 * 苹果风 UI 图标库（使用 Lucide 风格 SVG）
 */
import type { SVGProps } from 'react';

const base = (children: React.ReactNode, props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

export const IconClock = (p: SVGProps<SVGSVGElement>) =>
  base(<><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>, p);

export const IconSparkle = (p: SVGProps<SVGSVGElement>) =>
  base(
    <>
      <path d="M12 3l1.8 4.8L18.6 9.6l-4.8 1.8L12 16.2l-1.8-4.8L5.4 9.6l4.8-1.8z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />
    </>, p);

export const IconArrowUpRight = (p: SVGProps<SVGSVGElement>) =>
  base(<><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></>, p);

export const IconGlobe = (p: SVGProps<SVGSVGElement>) =>
  base(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" /></>, p);

export const IconShield = (p: SVGProps<SVGSVGElement>) =>
  base(<path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" />, p);

export const IconLock = (p: SVGProps<SVGSVGElement>) =>
  base(<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>, p);

export const IconCopy = (p: SVGProps<SVGSVGElement>) =>
  base(<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>, p);

export const IconCheck = (p: SVGProps<SVGSVGElement>) =>
  base(<polyline points="4 12 10 18 20 6" />, p);

export const IconX = (p: SVGProps<SVGSVGElement>) =>
  base(<><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></>, p);

export const IconRocket = (p: SVGProps<SVGSVGElement>) =>
  base(<><path d="M5 19l4-4M9 15c-2-1-4-4-4-8 4 0 7 2 8 4l-3 3a1 1 0 0 1-1 1z" /><path d="M14 8l2-2 5 5-2 2z" /><path d="M3 21l5-1" /></>, p);

export const IconList = (p: SVGProps<SVGSVGElement>) =>
  base(<><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>, p);

export const IconCalendar = (p: SVGProps<SVGSVGElement>) =>
  base(<><rect x="3" y="5" width="18" height="16" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="16" y1="3" x2="16" y2="7" /></>, p);

export const IconTag = (p: SVGProps<SVGSVGElement>) =>
  base(<><path d="M3 12V4h8l10 10-8 8z" /><circle cx="8" cy="8" r="1.4" /></>, p);

export const IconServer = (p: SVGProps<SVGSVGElement>) =>
  base(<><rect x="3" y="3" width="18" height="6" rx="2" /><rect x="3" y="15" width="18" height="6" rx="2" /><line x1="7" y1="6" x2="7" y2="6" /><line x1="7" y1="18" x2="7" y2="18" /></>, p);

export const IconTelegram = (p: SVGProps<SVGSVGElement>) =>
  base(<path d="M21 3L2 11l6 2 2 6 4-4 6 5z" />, p);

export const IconGift = (p: SVGProps<SVGSVGElement>) =>
  base(<><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>, p);

export const IconSearch = (p: SVGProps<SVGSVGElement>) =>
  base(<><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /></>, p);

export const IconMenu = (p: SVGProps<SVGSVGElement>) =>
  base(<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>, p);

export const IconBolt = (p: SVGProps<SVGSVGElement>) =>
  base(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />, p);

export const IconLayers = (p: SVGProps<SVGSVGElement>) =>
  base(<><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>, p);

export const IconSkull = (p: SVGProps<SVGSVGElement>) =>
  base(<><circle cx="12" cy="10" r="7" /><circle cx="9" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" /><path d="M9 17v4M15 17v4M12 17v4" /></>, p);
