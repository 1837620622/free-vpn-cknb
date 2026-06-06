/**
 * SVG 图标库（Lucide 风格，stroke 1.6，stroke-linecap round）
 */
import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & { width?: number; height?: number; strokeWidth?: number };

const base = (props: IconProps) => ({
  width: props.width ?? 16,
  height: props.height ?? 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: props.strokeWidth ?? 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export function IconClock(props: IconProps) {
  return <svg {...base(props)}><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></svg>;
}
export function IconCalendar(props: IconProps) {
  return <svg {...base(props)}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>;
}
export function IconBolt(props: IconProps) {
  return <svg {...base(props)}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>;
}
export function IconSparkle(props: IconProps) {
  return <svg {...base(props)}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" /></svg>;
}
export function IconArrowUpRight(props: IconProps) {
  return <svg {...base(props)}><path d="M7 17 17 7M9 7h8v8" /></svg>;
}
export function IconArrowRight(props: IconProps) {
  return <svg {...base(props)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
export function IconArrowUpRightArrow(props: IconProps) {
  return <svg {...base(props)}><path d="M7 17 17 7M9 7h8v8" /></svg>;
}
export function IconGlobe(props: IconProps) {
  return <svg {...base(props)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>;
}
export function IconLock(props: IconProps) {
  return <svg {...base(props)}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
}
export function IconCopy(props: IconProps) {
  return <svg {...base(props)}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
}
export function IconCheck(props: IconProps) {
  return <svg {...base(props)}><polyline points="4 12 10 18 20 6" /></svg>;
}
export function IconX(props: IconProps) {
  return <svg {...base(props)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
}
export function IconRocket(props: IconProps) {
  return <svg {...base(props)}><path d="M5 15c1-5 5-9 10-10 0 0 0 8-5 13-2 0-5-1-5-3zM9 15l-3 3M14 10l3-3" /><circle cx="14" cy="10" r="1.5" fill="currentColor" stroke="none" /></svg>;
}
export function IconLayers(props: IconProps) {
  return <svg {...base(props)}><path d="M12 2 2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5" /></svg>;
}
export function IconServer(props: IconProps) {
  return <svg {...base(props)}><rect x="3" y="3" width="18" height="7" rx="1.5" /><rect x="3" y="14" width="18" height="7" rx="1.5" /><circle cx="6" cy="6.5" r="0.6" fill="currentColor" /><circle cx="6" cy="17.5" r="0.6" fill="currentColor" /></svg>;
}
export function IconTelegram(props: IconProps) {
  return <svg {...base(props)}><path d="M21 4 3 11l6 2 2 6 4-4 5 4 1-15z" /><path d="M9 13l5-4" /></svg>;
}
export function IconTag(props: IconProps) {
  return <svg {...base(props)}><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9z" /><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" /></svg>;
}
export function IconSearch(props: IconProps) {
  return <svg {...base(props)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
}
export function IconMenu(props: IconProps) {
  return <svg {...base(props)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}
export function IconClose(props: IconProps) {
  return <svg {...base(props)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
}
export function IconStar(props: IconProps) {
  return <svg {...base(props)}><path d="m12 3 2.6 6 6.4.5-4.9 4.2 1.5 6.3L12 16.8 6.4 20l1.5-6.3L3 9.5l6.4-.5L12 3z" /></svg>;
}
export function IconShield(props: IconProps) {
  return <svg {...base(props)}><path d="M12 2 4 5v7c0 5 4 9 8 10 4-1 8-5 8-10V5l-8-3z" /></svg>;
}
export function IconExternal(props: IconProps) {
  return <svg {...base(props)}><path d="M14 4h6v6M10 14 20 4M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" /></svg>;
}
export function IconGitHub(props: IconProps) {
  return <svg {...base(props)}><path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.6 18.4.5 12 .5z" /></svg>;
}
export function IconChevronRight(props: IconProps) {
  return <svg {...base(props)}><path d="m9 6 6 6-6 6" /></svg>;
}
export function IconSpeed(props: IconProps) {
  return <svg {...base(props)}><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /><path d="M12 21a9 9 0 1 1 6.4-2.6" /><path d="m12 12 5-3" /></svg>;
}
export function IconData(props: IconProps) {
  return <svg {...base(props)}><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>;
}
export function IconSun(props: IconProps) {
  return <svg {...base(props)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
}
export function IconMoon(props: IconProps) {
  return <svg {...base(props)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;
}
