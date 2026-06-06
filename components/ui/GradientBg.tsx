/**
 * 全局背景：跟随时变量（dark / light）
 * 夜间 = 深灰蓝 + 网格 + 多层柔光 + 噪点
 * 白天 = 白底 + 极淡网格 + 极淡光斑
 */
export function GradientBg() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'var(--bg)' }} />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
        }}
      />
      <div className="absolute -top-40 -right-40 h-[45rem] w-[45rem] rounded-full blur-[160px]" style={{ background: 'var(--orb-1)' }} />
      <div className="absolute top-1/3 -left-40 h-[38rem] w-[38rem] rounded-full blur-[140px]" style={{ background: 'var(--orb-2)' }} />
      <div className="absolute -bottom-40 right-1/4 h-[40rem] w-[40rem] rounded-full blur-[140px]" style={{ background: 'var(--orb-3)' }} />
      <div className="absolute inset-0 bg-noise" style={{ opacity: 'var(--noise-opacity)' }} />
    </div>
  );
}
