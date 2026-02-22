"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { EdenMegaLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";

// ═══════════════════════════════════════════════════════════════
// EDEN LANDING — Clover Landing Page → App Dashboard
// The clover page is the FIRST thing anyone sees.
// "Enter Eden" transitions to the product dashboard.
// ═══════════════════════════════════════════════════════════════

const C = {
  bg: "#080503", gold: "#C5B358", goldBright: "#F5E6A3", goldDark: "#8B6914",
  green: "#4CAF50", greenVibrant: "#00E676", greenDark: "#1B5E20",
  text: "#E8DCC8", textDim: "#8B7355", border: "rgba(197,179,88,0.12)",
};

// ─── Photorealistic Four-Leaf Clover SVG ───
function LivingClover({ phase, growthProgress, breezeAngle, totalScale }: {
  phase: string; growthProgress: number; breezeAngle: number; totalScale: number;
}) {
  const bloomed = phase === "bloomed" || phase === "growing";
  const showLeaves = bloomed || phase === "bursting";
  const leafOpacity = phase === "bursting" ? 0.7 : bloomed ? 1 : 0;
  const hubY = 98;
  const leafW = showLeaves ? 1 : 0;

  const leafPath = "M0,-2 C-6,-10 -18,-22 -20,-32 C-22,-42 -14,-48 -6,-44 C-2,-42 0,-36 0,-36 C0,-36 2,-42 6,-44 C14,-48 22,-42 20,-32 C18,-22 6,-10 0,-2 Z";

  const veins = (flip: number) => {
    const s = flip;
    return (
      <>
        <path d={`M0,-2 L0,-34`} stroke="rgba(30,80,30,0.35)" strokeWidth="0.9" fill="none" />
        {[[-4*s,-14],[4*s,-14],[-8*s,-20],[8*s,-20],[-12*s,-27],[12*s,-27],[-6*s,-33],[6*s,-33],[-14*s,-34],[14*s,-34],[-10*s,-38],[10*s,-38]].map(([x,y],i) => (
          <path key={i} d={`M0,${y} Q${x*0.5},${y+Number(x)*0.05*s} ${x},${y-2}`} stroke={`rgba(30,80,30,${0.15+i*0.015})`} strokeWidth={i<2?0.7:i<6?0.5:0.3} fill="none"/>
        ))}
        {[[-3*s,-10,-7*s,-16],[-5*s,-18,-11*s,-24],[3*s,-22,8*s,-30],[-7*s,-28,-14*s,-32],[5*s,-30,12*s,-36],[-9*s,-35,-15*s,-40],[3*s,-12,7*s,-18]].map(([x1,y1,x2,y2],i) => (
          <path key={`t${i}`} d={`M${x1},${y1} L${x2},${y2}`} stroke={`rgba(40,90,40,${0.08+i*0.01})`} strokeWidth={0.25} fill="none"/>
        ))}
      </>
    );
  };

  const dewDrop = (cx: number, cy: number, r: number) => (
    <g key={`${cx}${cy}`}>
      <ellipse cx={cx} cy={cy} rx={r} ry={r*1.15} fill="url(#dw)" opacity={0.8}/>
      <ellipse cx={cx-r*0.25} cy={cy-r*0.3} rx={r*0.3} ry={r*0.2} fill="rgba(255,255,255,0.7)"/>
    </g>
  );

  const leaf = (rotation: number, scaleX: number) => (
    <g transform={`rotate(${rotation},0,0) scale(${scaleX},1)`}>
      <path d={leafPath} fill="url(#lf)" />
      <path d={leafPath} fill="url(#ls)" opacity={0.4} />
      <path d={leafPath} fill="url(#le)" opacity={0.3} />
      <path d={leafPath} fill="url(#lp)" opacity={0.15} />
      {veins(scaleX)}
      {dewDrop(-5, -20, 1.2)}
      {dewDrop(8, -30, 0.9)}
      {dewDrop(-3, -38, 0.7)}
    </g>
  );

  return (
    <svg viewBox="0 0 140 140" width="140" height="140"
      style={{ overflow:"visible", transform:`rotate(${breezeAngle}deg)`, transformOrigin:"70px 138px" }}>
      <defs>
        <radialGradient id="lf" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#7bc67a"/><stop offset="30%" stopColor="#5aad58"/>
          <stop offset="60%" stopColor="#4a9d48"/><stop offset="85%" stopColor="#3d8a3b"/>
          <stop offset="100%" stopColor="#2d6b2b"/>
        </radialGradient>
        <radialGradient id="ls" cx="40%" cy="30%" r="50%">
          <stop offset="0%" stopColor="rgba(255,240,180,0.3)"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="le" cx="50%" cy="50%" r="55%">
          <stop offset="60%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(20,50,20,0.4)"/>
        </radialGradient>
        <radialGradient id="lp" cx="60%" cy="35%" r="30%">
          <stop offset="0%" stopColor="rgba(160,140,60,0.3)"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="st" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#2d5a1e"/><stop offset="100%" stopColor="#4a8a3a"/>
        </linearGradient>
        <radialGradient id="dw" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/><stop offset="50%" stopColor="rgba(200,230,255,0.3)"/>
          <stop offset="100%" stopColor="rgba(100,180,255,0.1)"/>
        </radialGradient>
      </defs>
      <path d={`M70,138 Q69,125 70,${hubY+2}`} stroke="url(#st)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <g transform={`translate(70,${hubY})`} opacity={leafOpacity} style={{ transition:"opacity 0.8s" }}>
        <g transform={`scale(${leafW})`} style={{ transition:"transform 0.6s", transformOrigin:"0 0" }}>
          {leaf(-10, 1)}{leaf(-10, -1)}{leaf(170, 1)}{leaf(170, -1)}
        </g>
      </g>
    </svg>
  );
}

// ─── Landing Page ───
function LandingPage({ mounted, onEnter }: { mounted: boolean; onEnter: () => void }) {
  const [phase, setPhase] = useState("dormant");
  const [growthProgress, setGrowthProgress] = useState(0);
  const [breezeAngle, setBreezeAngle] = useState(0);
  const [growthBursts, setGrowthBursts] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("sprouting"), 500),
      setTimeout(() => setPhase("struggling"), 1500),
      setTimeout(() => setPhase("bursting"), 4000),
      setTimeout(() => setPhase("bloomed"), 5500),
      setTimeout(() => setPhase("growing"), 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "growing") return;
    const iv = setInterval(() => {
      setGrowthBursts(prev => {
        if (prev >= 3) { clearInterval(iv); return prev; }
        setGrowthProgress(p => p + (p < 0.1 ? 0.5 : p * 1.0));
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(iv);
  }, [phase]);

  useEffect(() => {
    let raf: number;
    const animate = () => {
      const t = Date.now() / 1000;
      const sway = Math.sin(t * 0.3) * 4.0 + Math.sin(t * 0.55 + 0.8) * 2.0 + Math.sin(t * 0.9 + 2.1) * 0.8;
      setBreezeAngle(sway);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const bloomed = phase === "bloomed" || phase === "growing";
  const totalScale = 1.0 + (bloomed || phase === "bursting" ? 0.66 : 0) + growthProgress * 1.0;

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-end",
      background: "radial-gradient(ellipse at 50% 70%, #1a0f05 0%, #0a0604 40%, #050302 100%)",
      overflow: "hidden", position: "relative",
    }}>
      {/* Twinkling Stars */}
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={`star${i}`} style={{
          position: "absolute",
          top: `${5 + Math.random() * 70}%`,
          left: `${Math.random() * 95}%`,
          width: `${1 + Math.random() * 2}px`,
          height: `${1 + Math.random() * 2}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(197,179,88,${0.4 + Math.random() * 0.4}), transparent)`,
          animation: `twinkle ${3 + Math.random() * 5}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
          pointerEvents: "none",
        }} />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={`gstar${i}`} style={{
          position: "absolute",
          top: `${10 + Math.random() * 55}%`,
          left: `${Math.random() * 90}%`,
          width: `${1 + Math.random() * 1.5}px`,
          height: `${1 + Math.random() * 1.5}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0,230,118,${0.3 + Math.random() * 0.3}), transparent)`,
          animation: `twinkle ${4 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 6}s`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Radial glow */}
      <div style={{
        position: "absolute", bottom: "15%", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(197,179,88,.06) 0%, rgba(76,175,80,.01) 40%, transparent 70%)",
        animation: "glow-pulse 4s ease-in-out infinite", pointerEvents: "none",
      }} />

      {/* EDEN TITLE + CLOVER */}
      <div style={{
        position: "relative", cursor: "default",
        transform: mounted ? "scale(1)" : "scale(0.9)",
        opacity: mounted ? 1 : 0,
        transition: "all 1.2s cubic-bezier(0.16,1,0.3,1)",
        marginBottom: "12vh",
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative" }}>
          <span style={{
            fontFamily: "'Cinzel Decorative', serif", fontWeight: 900,
            fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: 12,
            background: "linear-gradient(180deg, #F5E6A3 0%, #C5B358 40%, #8B6914 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 8px rgba(197,179,88,0.3))",
            animation: "metal-gleam 6s ease-in-out infinite",
          }}>
            ED
          </span>

          {/* Clover container */}
          <div style={{
            position: "relative", width: 140, height: 140,
            marginLeft: -18, marginRight: -24,
            transform: `scale(${totalScale})`, transformOrigin: "center bottom",
            transition: "transform 0.8s cubic-bezier(0.34,1.56,0.64,1)",
            top: -105,
          }}>
            <LivingClover phase={phase} growthProgress={growthProgress} breezeAngle={breezeAngle} totalScale={totalScale} />
          </div>

          <span style={{
            fontFamily: "'Cinzel Decorative', serif", fontWeight: 900,
            fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: 12,
            background: "linear-gradient(180deg, #F5E6A3 0%, #C5B358 40%, #8B6914 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 8px rgba(197,179,88,0.3))",
            animation: "metal-gleam 6s ease-in-out infinite",
          }}>
            EN
          </span>
        </div>

        {/* Subtitle */}
        <div style={{ textAlign: "center", marginTop: -20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(197,179,88,0.4))" }} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, letterSpacing: 6, color: C.textDim, textTransform: "uppercase" }}>
              Realism Engine
            </span>
            <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(197,179,88,0.4), transparent)" }} />
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "rgba(200,190,170,0.5)", fontStyle: "italic", marginBottom: 28 }}>
            Where digital souls come alive
          </p>

          {/* Enter Eden Button */}
          <button onClick={onEnter} style={{
            padding: "16px 52px", borderRadius: 14, cursor: "pointer",
            fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: 5, textTransform: "uppercase",
            background: "linear-gradient(135deg, rgba(197,179,88,0.15), rgba(197,179,88,0.05))",
            border: "1px solid rgba(197,179,88,0.25)", color: C.gold,
            transition: "all 0.4s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(197,179,88,0.25), rgba(197,179,88,0.1))"; e.currentTarget.style.borderColor = "rgba(197,179,88,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg, rgba(197,179,88,0.15), rgba(197,179,88,0.05))"; e.currentTarget.style.borderColor = "rgba(197,179,88,0.25)"; }}
          >
            Enter Eden
          </button>
        </div>
      </div>

      <style>{`
        @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 0.75; } }
        @keyframes glow-pulse { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
        @keyframes metal-gleam { 0%,100% { filter: drop-shadow(0 2px 8px rgba(197,179,88,0.3)) brightness(1); } 50% { filter: drop-shadow(0 2px 12px rgba(197,179,88,0.5)) brightness(1.1); } }
      `}</style>
    </div>
  );
}

// ─── Product Dashboard (shows after "Enter Eden") ───
const PRODUCTS = [
  { href: "/image-studio", icon: "🖼️", title: "Image Studio", desc: "Photorealistic generation. Eden Protocol. 4 engines. No restrictions.", badge: "4 Engines" },
  { href: "/video-studio", icon: "🎬", title: "Video Studio", desc: "Text-to-Video & Image-to-Video. 6 engines. Full creative control.", badge: "6 Engines" },
  { href: "/voice-agents", icon: "🔊", title: "Voice Agents", desc: "18 industry solutions. Deploy in 48 hours. Revenue on day one.", badge: "$9.99-$499/mo" },
  { href: "/eve-4d", icon: "🎭", title: "EVE 4D Avatar", desc: "Brain → Voice → Face → Stream. The first digital soul.", badge: "Open Source" },
];

const STATS = [
  { value: "18+", label: "VOICE SOLUTIONS" },
  { value: "24/7", label: "ALWAYS ON" },
  { value: "<300ms", label: "RESPONSE TIME" },
  { value: "30+", label: "LANGUAGES" },
  { value: "$0", label: "VENDOR LOCK-IN" },
];

function AppDashboard() {
  return (
    <div className="min-h-screen">
      <EdenMegaLogo />
      <NavBar />
      <div className="text-center py-12 px-5">
        <h2 className="eden-shimmer text-[clamp(1.2rem,3vw,2.2rem)] font-bold max-w-4xl mx-auto leading-snug"
          style={{ fontFamily: '"Cinzel Decorative", serif' }}>
          Voice Agents That Close Deals. Digital Souls That Cross the Uncanny Valley.
        </h2>
        <p className="text-xs text-[#504830] tracking-[0.3em] uppercase mt-5" style={{ fontFamily: '"DM Mono", monospace' }}>
          BERYL AI LABS · NEW ORLEANS · EST. 2024
        </p>
      </div>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {PRODUCTS.map((p) => (
          <Link key={p.href} href={p.href} className="group">
            <div className="text-center p-7 rounded-xl border border-[rgba(197,179,88,0.12)] bg-[#12100a]
              hover:border-[rgba(197,179,88,0.3)] transition-all duration-300 h-full
              hover:shadow-[0_0_30px_rgba(197,179,88,0.08)]">
              <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">{p.icon}</span>
              <h3 className="text-xl font-bold text-[#FFF8E1] mb-2" style={{ fontFamily: '"Cinzel", serif' }}>{p.title}</h3>
              <p className="text-sm text-[#a09880] leading-relaxed mb-4">{p.desc}</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider
                bg-[rgba(197,179,88,0.1)] text-[#C5B358] border border-[rgba(197,179,88,0.2)]"
                style={{ fontFamily: '"DM Mono", monospace' }}>
                {p.badge}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-8 flex-wrap px-4 py-10">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl font-black text-[#C5B358]" style={{ fontFamily: '"Cinzel", serif' }}>{s.value}</div>
            <div className="text-[10px] text-[#504830] tracking-[0.2em] mt-1" style={{ fontFamily: '"DM Mono", monospace' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="text-center py-10 px-5 mx-4 border-y border-[rgba(197,179,88,0.1)]">
        <p className="text-2xl text-[#C5B358] italic" style={{ fontFamily: '"Cinzel", serif' }}>
          &ldquo;We don&apos;t use AI. We own the science.&rdquo;
        </p>
        <p className="text-xs text-[#504830] tracking-[0.2em] mt-3" style={{ fontFamily: '"DM Mono", monospace' }}>
          — THE EDEN PROJECT PHILOSOPHY
        </p>
      </div>
      <NavBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN — Landing first, then App
// ═══════════════════════════════════════════════════════════════
export default function HomePage() {
  const [showApp, setShowApp] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (showApp) return <AppDashboard />;

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: C.bg }}>
      <LandingPage mounted={mounted} onEnter={() => setShowApp(true)} />
    </div>
  );
}
