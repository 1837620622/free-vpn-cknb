import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: ['class', ':root[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elev': 'var(--bg-elev)',
        fg: 'var(--fg)',
        'fg-strong': 'var(--fg-strong)',
        'fg-soft': 'var(--fg-soft)',
        'fg-mute': 'var(--fg-mute)',
        'fg-faint': 'var(--fg-faint)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        'border-card': 'var(--border-card)',
      },
    },
  },
  plugins: [],
};
export default config;
