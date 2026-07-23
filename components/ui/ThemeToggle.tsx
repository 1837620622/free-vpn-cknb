/**
 * 主题切换：dark / light / system
 * 持久化到 localStorage，首屏通过内联脚本应用避免闪烁
 */
'use client';

import { useEffect, useState } from 'react';
import { IconSun, IconMoon } from './Icon';

export type ThemeMode = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'theme-mode';

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  try {
    return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system';
  } catch {
    // Safari 隐私模式下 localStorage 可能抛异常
    return 'system';
  }
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  let resolved: 'dark' | 'light' = 'dark';
  if (mode === 'light') resolved = 'light';
  else if (mode === 'dark') resolved = 'dark';
  else {
    resolved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', resolved);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const m = getStoredTheme();
    setMode(m);
    applyTheme(m);

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      const cur = getStoredTheme();
      if (cur === 'system') applyTheme('system');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const cycle = () => {
    const order: ThemeMode[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(mode) + 1) % order.length];
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Safari 隐私模式下 localStorage 可能抛异常
    }
    applyTheme(next);
  };

  if (!mounted) {
    return <span className="inline-flex h-8 w-8" aria-hidden />;
  }

  const label = mode === 'system' ? '跟随系统' : mode === 'light' ? '日间模式' : '夜间模式';

  return (
    <button
      type="button"
      onClick={cycle}
      title={`主题：${label}（点击切换）`}
      aria-label={`切换主题，当前${label}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-bg-elev transition-colors"
      style={{ color: 'var(--fg-soft)' }}
    >
      {mode === 'light' ? (
        <IconSun width={16} height={16} />
      ) : (
        <IconMoon width={16} height={16} />
      )}
    </button>
  );
}
