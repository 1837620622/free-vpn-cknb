/**
 * HTTP 请求工具：带 UA/超时/retry/字符编码自动处理
 */
import * as cheerio from 'cheerio';

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
};

export interface FetchOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  as?: 'text' | 'json' | 'buffer';
}

export interface FetchResult {
  ok: boolean;
  status: number;
  body: string;
  url: string;
  encoding: string;
  contentType: string;
  error?: string;
}

function decodeBuffer(buf: Buffer, contentType: string, rawText: string): string {
  const charsetMatch = contentType.match(/charset=([^;]+)/i);
  let charset = charsetMatch?.[1]?.toLowerCase().trim();

  if (!charset) {
    const metaMatch = rawText.match(/<meta[^>]+charset=["']?([^"'>\s]+)/i);
    charset = metaMatch?.[1]?.toLowerCase();
  }

  if (!charset) {
    const head = rawText.slice(0, 4096);
    const gbBytes = String.fromCharCode(0xC0) + '-' + String.fromCharCode(0xFF);
    const gbPattern = new RegExp('[' + gbBytes + '][' + String.fromCharCode(0x80) + '-' + String.fromCharCode(0xBF) + ']{2}');
    const cjkPattern = /[\u3040-\u30FF\uAC00-\uD7AF]/;
    charset = gbPattern.test(head) && !cjkPattern.test(head) ? 'gb18030' : 'utf-8';
  }

  if (charset === 'gb2312') charset = 'gb18030';
  if (charset === 'iso-8859-1' || charset === 'latin1') charset = 'utf-8';

  try {
    return new TextDecoder(charset, { fatal: false }).decode(buf);
  } catch {
    return buf.toString('utf-8');
  }
}

export async function fetchUrl(url: string, options: FetchOptions = {}): Promise<FetchResult> {
  const timeout = options.timeout ?? 15000;
  const retries = options.retries ?? 2;
  const headers = { ...DEFAULT_HEADERS, ...options.headers };

  let lastError: string = '';
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(url, {
        headers,
        signal: controller.signal,
        redirect: 'follow',
        cache: 'no-store',
      });
      clearTimeout(timer);

      const contentType = res.headers.get('content-type') ?? '';
      const status = res.status;

      if (!res.ok) {
        lastError = `HTTP ${status}`;
        if (status === 404) {
          return {
            ok: false,
            status,
            body: '',
            url,
            encoding: '',
            contentType,
            error: '404',
          };
        }
        continue;
      }

      const buf = Buffer.from(await res.arrayBuffer());
      const body =
        options.as === 'json'
          ? buf.toString('utf-8')
          : decodeBuffer(buf, contentType, buf.toString('utf-8'));

      return {
        ok: true,
        status,
        body,
        url,
        encoding:
          contentType.match(/charset=([^;]+)/i)?.[1]?.toLowerCase() ??
          (body.includes('�') ? 'gb18030?' : 'utf-8'),
        contentType,
      };
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  return {
    ok: false,
    status: 0,
    body: '',
    url,
    encoding: '',
    contentType: '',
    error: lastError,
  };
}

export async function fetchJson<T = unknown>(url: string, options: FetchOptions = {}): Promise<T | null> {
  const res = await fetchUrl(url, { ...options, as: 'json' });
  if (!res.ok) return null;
  try {
    return JSON.parse(res.body) as T;
  } catch {
    return null;
  }
}

export function loadHtml(html: string) {
  return cheerio.load(html);
}

export function absoluteUrl(base: string, maybe: string | undefined | null): string | undefined {
  if (!maybe) return undefined;
  if (/^https?:\/\//i.test(maybe)) return maybe;
  if (maybe.startsWith('//')) return 'https:' + maybe;
  try {
    return new URL(maybe, base).toString();
  } catch {
    return undefined;
  }
}
