"use client";

export function EdenMegaLogo() {
  return (
    <div className="text-center py-12 px-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(26,20,10,0.7),#050302_70%)]" />
      <div className="relative">
        <span className="text-[120px] block eden-glow leading-none">🔱</span>
        <h1
          className="eden-shimmer font-[var(--font-cinzel-decorative)] text-[clamp(3rem,10vw,8rem)] font-black tracking-[0.15em] leading-none mt-2"
          style={{ fontFamily: '"Cinzel Decorative", serif' }}
        >
          EDEN
        </h1>
        <p
          className="text-[clamp(0.9rem,2vw,1.6rem)] tracking-[0.4em] text-[#a09880] uppercase mt-4"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Voice Agents · Digital Souls · Own The Science
        </p>
      </div>
    </div>
  );
}

export function EdenPageLogo({ subtitle }: { subtitle?: string }) {
  return (
    <div className="text-center pt-8 pb-2 px-5">
      <span className="text-5xl block" style={{ filter: "drop-shadow(0 0 20px rgba(197,179,88,0.3))" }}>
        🔱
      </span>
      <h2
        className="eden-shimmer text-5xl font-black tracking-[0.5em] mt-1"
        style={{ fontFamily: '"Cinzel Decorative", serif' }}
      >
        EDEN
      </h2>
      {subtitle && (
        <p className="text-[#706850] text-lg mt-1" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
