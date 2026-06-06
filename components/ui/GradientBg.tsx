/**
 * 全局背景：跟随主题变量，使用网格、扫描线和噪点。
 */
export function GradientBg() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--bg)' }} />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.46) 58%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.46) 58%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(110deg, transparent 0%, rgba(118,185,0,var(--scan-opacity)) 42%, transparent 64%)',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.75), transparent 72%)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.75), transparent 72%)',
        }}
      />
      <div className="absolute inset-0 bg-noise" style={{ opacity: 'var(--noise-opacity)' }} />
    </div>
  );
}
