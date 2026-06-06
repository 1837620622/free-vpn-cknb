/**
 * 苹果风 mesh-gradient 背景 + 浮动光斑
 */
export function GradientBg() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#F2F2F7] dark:bg-[#000000]">
      <div
        className="absolute inset-0 opacity-90 dark:opacity-50"
        style={{
          background: `
            radial-gradient(at 27% 37%, hsla(215, 98%, 75%, 1) 0px, transparent 50%),
            radial-gradient(at 97% 21%, hsla(160, 90%, 70%, 1) 0px, transparent 50%),
            radial-gradient(at 52% 99%, hsla(354, 90%, 78%, 1) 0px, transparent 50%),
            radial-gradient(at 10% 29%, hsla(256, 90%, 78%, 1) 0px, transparent 50%),
            radial-gradient(at 97% 96%, hsla(38, 90%, 78%, 1) 0px, transparent 50%)
          `,
        }}
      />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-pink-400/20 blur-3xl animate-pulse [animation-delay:1s]" />
    </div>
  );
}
