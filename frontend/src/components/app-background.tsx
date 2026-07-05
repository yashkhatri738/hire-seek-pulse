/**
 * Ambient premium backdrop shared across the portal shells and auth pages.
 * Fixed, non-interactive layer of soft violet/pink/emerald orbs plus a faint
 * masked grid — the same visual language as the landing hero.
 */
export function AppBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Ambient orbs */}
      <div className="absolute -top-40 -left-32 h-[600px] w-[600px] rounded-full bg-violet-600 opacity-[0.14] blur-[130px] animate-pulse" />
      <div className="absolute top-40 -right-24 h-[460px] w-[460px] rounded-full bg-pink-500 opacity-[0.10] blur-[130px]" />
      <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-emerald-500 opacity-[0.06] blur-[130px]" />

      {/* Masked grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,58,237,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.045) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 0%, black 25%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 0%, black 25%, transparent 100%)",
        }}
      />
    </div>
  );
}

export default AppBackground;
