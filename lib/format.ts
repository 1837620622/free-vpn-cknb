/**
 * 工具函数：归一化、字段清洗、过期判断
 */
import { createHash } from 'node:crypto';

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[·•・.\-_/【】\[\]()（）「」『』"'`~!@#$%^&*+=?:;,<>\\|]/g, '')
    .replace(/机场|加速|加速器|节点|科学上网|vpn|cloud|net/g, '')
    .trim();
}

export function normalizeUrl(url: string | undefined | null): string {
  if (!url) return '';
  try {
    const u = new URL(url);
    u.hash = '';
    u.searchParams.forEach((v, k) => {
      if (k.startsWith('utm_') || k === 'ref' || k === 'aff' || k === 'source') {
        u.searchParams.delete(k);
      }
    });
    return u.toString();
  } catch {
    return url;
  }
}

export function makeId(name: string, url?: string): string {
  const key = normalizeName(name) + '|' + normalizeUrl(url ?? name);
  return createHash('sha1').update(key).digest('hex').slice(0, 16);
}

export function isRecent(iso: string, cutoffDays: number): boolean {
  if (cutoffDays <= 0) return true;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return true;
  const cutoff = Date.now() - cutoffDays * 24 * 3600 * 1000;
  return t >= cutoff;
}

export function isInLast(iso: string, days: number): boolean {
  return isRecent(iso, days);
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function parseChineseDate(text: string): string | null {
  if (!text) return null;
  const cleaned = text.trim();
  const patterns: RegExp[] = [
    /(\d{4})[\-./年](\d{1,2})[\-./月](\d{1,2})/,
    /(\d{4})(\d{2})(\d{2})/,
  ];
  for (const p of patterns) {
    const m = cleaned.match(p);
    if (m) {
      const y = m[1];
      const mo = m[2].padStart(2, '0');
      const d = m[3].padStart(2, '0');
      return `${y}-${mo}-${d}T00:00:00+08:00`;
    }
  }
  return null;
}

export function parseTitleDateSpeed(title: string): { date: string; speed: string | null } {
  const dateMatch = title.match(/(\d{1,2})月(\d{1,2})日/);
  let dateStr: string | null = null;
  if (dateMatch) {
    const year = new Date().getFullYear();
    const mo = dateMatch[1].padStart(2, '0');
    const d = dateMatch[2].padStart(2, '0');
    dateStr = `${year}-${mo}-${d}T00:00:00+08:00`;
  }
  const speedMatch = title.match(/(\d+(?:\.\d+)?)\s*([MGK])\/S/i);
  let speed: string | null = null;
  if (speedMatch) {
    speed = `${speedMatch[1]}${speedMatch[2].toUpperCase()}/S`;
  }
  return { date: dateStr ?? nowIso(), speed };
}

export function cleanText(s: string | undefined | null): string {
  if (!s) return '';
  return s
    .replace(/\s+/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

export function extractTgLinks(text: string | undefined | null): {
  group?: string;
  channel?: string;
} {
  if (!text) return {};
  const result: { group?: string; channel?: string } = {};
  const re = /https?:\/\/(t\.me|telegram\.me|telegram\.org)\/([A-Za-z0-9_+\-]{3,64})/g;
  const m = re.exec(text);
  if (m) {
    const handle = m[2];
    const isGroup = /^\+|joinchat$/.test(handle) || text.toLowerCase().includes('群');
    const url = `https://t.me/${handle}`;
    if (isGroup) result.group = url;
    else result.channel = url;
  }
  return result;
}

export function isValidUrl(s: string | undefined | null): s is string {
  if (!s) return false;
  try {
    new URL(s);
    return /^https?:\/\//i.test(s);
  } catch {
    return false;
  }
}

export function uniqBy<T, K>(arr: T[], key: (t: T) => K): T[] {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const item of arr) {
    const k = key(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
