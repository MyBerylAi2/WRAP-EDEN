import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// EDEN REALISM ENGINE v3.1 — THE LIVING GARDEN (REVISED)
// Landing Page with Photorealistic Living Clover + Full App
// Beryl AI Labs / The Eden Project
// ═══════════════════════════════════════════════════════════════

// ─── Color Palette ───
const C = {
  bg: "#080503", bgCard: "rgba(18,12,8,0.95)", bgInput: "rgba(197,179,88,0.03)",
  gold: "#C5B358", goldBright: "#F5E6A3", goldDark: "#8B6914", goldMid: "#D4AF37",
  green: "#4CAF50", greenBright: "#81C784", greenDark: "#1B5E20", greenLight: "#C8E6C9",
  greenVibrant: "#00E676", greenEmerald: "#2E7D32",
  border: "rgba(197,179,88,0.12)", borderGreen: "rgba(76,175,80,0.15)",
  text: "#E8DCC8", textDim: "#8B7355", textGreen: "#C8E6C9",
};

// ─── Reusable Components ───
const Btn = ({ children, onClick, disabled, primary, green, style, ...p }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: "10px 20px", borderRadius: 10, cursor: disabled ? "default" : "pointer",
    fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
    transition: "all 0.3s",
    background: green ? "linear-gradient(135deg, #2E7D32, #1B5E20)" : primary ? "linear-gradient(135deg, rgba(197,179,88,0.2), rgba(197,179,88,0.1))" : "rgba(197,179,88,0.06)",
    border: `1px solid ${green ? "rgba(76,175,80,0.4)" : primary ? "rgba(197,179,88,0.3)" : C.border}`,
    color: green ? "#C8E6C9" : primary ? C.gold : C.textDim,
    opacity: disabled ? 0.4 : 1, ...style,
  }} {...p}>{children}</button>
);

const Card = ({ children, title, style }) => (
  <div style={{
    background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: 20, ...style,
  }}>
    {title && <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: C.gold, textTransform: "uppercase", marginBottom: 14 }}>{title}</div>}
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, textarea, style, ...p }) => {
  const Tag = textarea ? "textarea" : "input";
  return <Tag value={value} onChange={onChange} placeholder={placeholder} style={{
    width: "100%", padding: "10px 14px", borderRadius: 10, background: C.bgInput,
    border: `1px solid ${C.border}`, color: C.text, fontSize: 13,
    fontFamily: "'Cormorant Garamond', serif", transition: "all 0.3s",
    outline: "none", resize: textarea ? "vertical" : "none",
    minHeight: textarea ? 80 : "auto", boxSizing: "border-box", ...style,
  }} {...p} />;
};

const Select = ({ value, onChange, options, style }) => (
  <select value={value} onChange={onChange} style={{
    padding: "8px 12px", borderRadius: 8, background: "rgba(18,12,8,0.9)",
    border: `1px solid ${C.border}`, color: C.text, fontSize: 12,
    fontFamily: "'Cormorant Garamond', serif", outline: "none", cursor: "pointer",
    ...style,
  }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const StatusBadge = ({ text, type }) => (
  <div style={{
    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontFamily: "'Cormorant Garamond', serif",
    background: type === "success" ? "rgba(76,175,80,0.1)" : type === "error" ? "rgba(244,67,54,0.1)" : "rgba(197,179,88,0.06)",
    border: `1px solid ${type === "success" ? C.borderGreen : type === "error" ? "rgba(244,67,54,0.2)" : C.border}`,
    color: type === "success" ? C.greenBright : type === "error" ? "#ef9a9a" : C.textDim,
  }}>{text}</div>
);

// ═══════════════════════════════════════════
// PHOTOREALISTIC FOUR-LEAF CLOVER SVG
// Inspired by macro photography: lush, full,
// plump leaves with water droplets, visible veins,
// subsurface scattering, natural imperfections.
// SHORT STEM — leaves are the star of the show.
// ═══════════════════════════════════════════
function LivingClover({ phase, growthProgress, breezeAngle, totalScale }) {
  const bloomed = ["bloomed","growing"].includes(phase);
  const bursting = phase === "bursting";

  // Stem reveal: grows upward from base
  const stemReveal = phase === "dormant" ? 0 : phase === "sprouting" ? 0.4 : phase === "struggling" ? 0.7 : 1;
  // Leaves only appear after burst
  const leafReveal = !bloomed && !bursting ? 0 : 1;

  // SVG dimensions — compact, self-contained plant
  // NO SCALING HERE — scaling is done by the parent container div
  const vbW = 120;
  const vbH = 120;
  const cx = 60;
  const stemBase = 118;
  const stemTop = 88;
  const hub = stemTop - 2;

  // Single leaf path — plump heart shape, origin at hub (0,0)
  const leaf = "M0,0 C2,-10 10,-26 20,-32 C28,-36 34,-30 32,-20 C30,-10 18,-2 0,0 Z";

  return (
    <svg
      width={vbW} height={vbH} viewBox={`0 0 ${vbW} ${vbH}`}
      style={{
        overflow: "visible",
        /* NO transform scale here — parent div handles all scaling */
        /* Only breeze rotation, pivoting from stem base so the whole plant sways as one */
        transform: `rotate(${breezeAngle}deg)`,
        transformOrigin: `${cx}px ${stemBase}px`,
        transition: "transform 2s ease-in-out",
        filter: bloomed
          ? "drop-shadow(0 0 18px rgba(0,230,118,.35)) drop-shadow(0 0 40px rgba(76,175,80,.12))"
          : "none",
      }}
    >
      <defs>
        <radialGradient id="lf" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#4CAF50" stopOpacity=".95"/>
          <stop offset="18%" stopColor="#43A047"/>
          <stop offset="40%" stopColor="#2E7D32"/>
          <stop offset="65%" stopColor="#1B5E20"/>
          <stop offset="100%" stopColor="#0D3B0D"/>
        </radialGradient>
        <radialGradient id="ls" cx="40%" cy="25%" r="55%">
          <stop offset="0%" stopColor="#81C784" stopOpacity=".45"/>
          <stop offset="25%" stopColor="#66BB6A" stopOpacity=".25"/>
          <stop offset="100%" stopColor="#1B5E20" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="vn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C8E6C9" stopOpacity=".55"/>
          <stop offset="100%" stopColor="#66BB6A" stopOpacity=".15"/>
        </linearGradient>
        <linearGradient id="st" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#1B5E20"/>
          <stop offset="40%" stopColor="#2E7D32"/>
          <stop offset="100%" stopColor="#43A047"/>
        </linearGradient>
        <radialGradient id="dw" cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".85"/>
          <stop offset="40%" stopColor="#E8F5E9" stopOpacity=".4"/>
          <stop offset="100%" stopColor="#A5D6A7" stopOpacity=".05"/>
        </radialGradient>
        <filter id="lg" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/>
          <feFlood floodColor="#00E676" floodOpacity=".25" result="c"/>
          <feComposite in="c" in2="b" operator="in" result="s"/>
          <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* STEM — grows up, WELDED to leaves above */}
      <g style={{
        transform: `scaleY(${stemReveal})`,
        transformOrigin: `${cx}px ${stemBase}px`,
        transition: phase === "struggling"
          ? "transform 2s cubic-bezier(0.2,0,0.8,0.2)"
          : "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <path d={`M${cx},${stemBase} C${cx},${stemBase-8} ${cx-0.5},${stemBase-18} ${cx},${stemTop}`}
          stroke="url(#st)" strokeWidth="4" fill="none" strokeLinecap="round"/>
        <path d={`M${cx+0.8},${stemBase-2} C${cx+0.8},${stemBase-10} ${cx+0.3},${stemBase-18} ${cx+0.5},${stemTop+4}`}
          stroke="rgba(165,214,167,.3)" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <ellipse cx={cx} cy={stemBase-14} rx="2.2" ry="1.5" fill="#388E3C" opacity=".4"/>
      </g>

      {/* FOUR LEAVES — ALL WELDED to stem at hub point — NEVER DETACH */}
      <g filter="url(#lg)" style={{
        opacity: leafReveal,
        transform: `scale(${leafReveal})`,
        transformOrigin: `${cx}px ${hub}px`,
        transition: bursting
          ? "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        {/* LEAF 1: TOP */}
        <g transform={`translate(${cx},${hub})`}>
          <path d={leaf} fill="url(#lf)" stroke="#145214" strokeWidth=".3"/>
          <path d={leaf} fill="url(#ls)"/>
          <path d="M0,0 C3,-8 10,-20 21,-30" stroke="url(#vn)" strokeWidth=".8" fill="none"/>
          <path d="M5,-10 C10,-16 18,-20 25,-22" stroke="url(#vn)" strokeWidth=".35" fill="none"/>
          <ellipse cx="14" cy="-18" rx="2" ry="2.5" fill="url(#dw)" opacity=".65"/>
          <ellipse cx="14.6" cy="-19.2" rx=".7" ry=".5" fill="white" opacity=".8"/>
        </g>
        {/* LEAF 2: RIGHT */}
        <g transform={`translate(${cx},${hub}) rotate(90)`}>
          <path d={leaf} fill="url(#lf)" stroke="#145214" strokeWidth=".3"/>
          <path d={leaf} fill="url(#ls)"/>
          <path d="M0,0 C3,-8 10,-20 21,-30" stroke="url(#vn)" strokeWidth=".8" fill="none"/>
          <path d="M5,-10 C10,-16 18,-20 25,-22" stroke="url(#vn)" strokeWidth=".35" fill="none"/>
          <ellipse cx="18" cy="-22" rx="1.8" ry="2.2" fill="url(#dw)" opacity=".5"/>
          <ellipse cx="18.5" cy="-23" rx=".6" ry=".45" fill="white" opacity=".7"/>
        </g>
        {/* LEAF 3: BOTTOM */}
        <g transform={`translate(${cx},${hub}) rotate(180)`}>
          <path d={leaf} fill="url(#lf)" stroke="#145214" strokeWidth=".3"/>
          <path d={leaf} fill="url(#ls)"/>
          <path d="M0,0 C3,-8 10,-20 21,-30" stroke="url(#vn)" strokeWidth=".8" fill="none"/>
          <path d="M5,-10 C10,-16 18,-20 25,-22" stroke="url(#vn)" strokeWidth=".35" fill="none"/>
          <ellipse cx="12" cy="-16" rx="1.6" ry="2" fill="url(#dw)" opacity=".45"/>
          <ellipse cx="12.5" cy="-17" rx=".5" ry=".4" fill="white" opacity=".65"/>
        </g>
        {/* LEAF 4: LEFT */}
        <g transform={`translate(${cx},${hub}) rotate(270)`}>
          <path d={leaf} fill="url(#lf)" stroke="#145214" strokeWidth=".3"/>
          <path d={leaf} fill="url(#ls)"/>
          <path d="M0,0 C3,-8 10,-20 21,-30" stroke="url(#vn)" strokeWidth=".8" fill="none"/>
          <path d="M5,-10 C10,-16 18,-20 25,-22" stroke="url(#vn)" strokeWidth=".35" fill="none"/>
          <ellipse cx="16" cy="-20" rx="2" ry="2.4" fill="url(#dw)" opacity=".55"/>
          <ellipse cx="16.6" cy="-21" rx=".6" ry=".5" fill="white" opacity=".7"/>
        </g>
        {/* Center hub — welded junction */}
        <circle cx={cx} cy={hub} r="3.5" fill="#2E7D32" stroke="#1B5E20" strokeWidth=".5"/>
        <circle cx={cx} cy={hub} r="2" fill="#388E3C"/>
        <circle cx={cx-0.6} cy={hub-0.6} r=".8" fill="rgba(165,214,167,.35)"/>
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function Eden() {
  const [page, setPage] = useState("landing");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: C.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(197,179,88,0.2); border-radius: 4px; }
        input:focus, textarea:focus, select:focus { border-color: rgba(197,179,88,0.4) !important; box-shadow: 0 0 12px rgba(197,179,88,0.06); }

        @keyframes float-particle { 0%,100%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-100vh) rotate(360deg);opacity:0} }
        @keyframes shooting-star { 0%{transform:translate(0,0) rotate(-25deg);opacity:0;width:0}1%{opacity:.5;width:60px}3%{opacity:.4}6%{opacity:.25}10%{opacity:.1}15%{opacity:0}100%{transform:translate(300px,180px) rotate(-25deg);opacity:0} }
        @keyframes breathe { 0%,100%{filter:drop-shadow(0 0 20px rgba(197,179,88,.3))}50%{filter:drop-shadow(0 0 40px rgba(212,175,55,.6))} }
        @keyframes glow-pulse { 0%,100%{opacity:.4}50%{opacity:.8} }
        @keyframes fade-up { 0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)} }
        @keyframes metal-gleam { 0%{background-position:-200% center}100%{background-position:200% center} }
        @keyframes line-grow { 0%{transform:scaleX(0)}100%{transform:scaleX(1)} }
        @keyframes shimmer-sweep { 0%{transform:translateX(-200%) skewX(-20deg)}100%{transform:translateX(200%) skewX(-20deg)} }
        @keyframes dot-pulse { 0%,80%,100%{opacity:.3}40%{opacity:1} }
        @keyframes chat-slide { 0%{transform:translateY(20px);opacity:0}100%{transform:translateY(0);opacity:1} }
        @keyframes spin-loader { 0%{transform:rotate(0)}100%{transform:rotate(360deg)} }
        @keyframes green-gem { 0%{box-shadow:0 0 8px rgba(76,175,80,.4),inset 0 0 4px rgba(76,175,80,.2)}50%{box-shadow:0 0 16px rgba(0,230,118,.6),inset 0 0 8px rgba(129,199,132,.3)}100%{box-shadow:0 0 8px rgba(76,175,80,.4),inset 0 0 4px rgba(76,175,80,.2)} }
        @keyframes border-shimmer { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
        @keyframes gentle-breeze { 0%,100%{transform:rotate(0deg)}15%{transform:rotate(1.8deg)}35%{transform:rotate(-1.2deg)}55%{transform:rotate(1deg)}75%{transform:rotate(-0.8deg)} }

        .eden-particle { position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,.8),transparent);animation:float-particle linear infinite;pointer-events:none; }
        .shooting-star { position:absolute;height:1.5px;background:linear-gradient(90deg,rgba(245,230,163,.9),rgba(212,175,55,.5),rgba(197,179,88,.2),transparent);animation:shooting-star linear infinite;pointer-events:none;border-radius:2px; }
        .shooting-star::before { content:'';position:absolute;left:0;top:-1.5px;width:4px;height:4px;border-radius:50%;background:radial-gradient(circle,#FFF8DC,#F5E6A3);box-shadow:0 0 8px 3px rgba(245,230,163,.7),0 0 16px 6px rgba(212,175,55,.3); }
        .green-star { background:linear-gradient(90deg,rgba(0,230,118,.8),rgba(76,175,80,.4),rgba(56,142,60,.2),transparent)!important; }
        .green-star::before { background:radial-gradient(circle,#C8E6C9,#00E676)!important;box-shadow:0 0 8px 3px rgba(0,230,118,.7),0 0 16px 6px rgba(76,175,80,.3)!important; }

        .chat-shimmer-border {
          background: linear-gradient(135deg, #8B6914, #C5B358, #F5E6A3, #D4AF37, #C5B358, #F5E6A3, #8B6914, #C5B358);
          background-size: 400% 400%;
          animation: border-shimmer 6s ease-in-out infinite;
          padding: 2px;
          border-radius: 18px;
        }
        .chat-shimmer-border-inner {
          background: rgba(8,5,3,.85);
          border-radius: 16px;
          width: 100%;
          height: 100%;
        }

        .clover-container {
          /* No CSS animation here — all transforms handled inline via React state */
          /* This prevents transform conflicts that caused leaf detachment */
        }
      `}</style>
      {page === "landing" ? <LandingPage mounted={mounted} onEnter={() => setPage("app")} /> : <AppShell />}
    </div>
  );
}

// ═══════════════════════════════════════════
// LANDING PAGE — THE LIVING GARDEN (REVISED)
// ═══════════════════════════════════════════
function LandingPage({ mounted, onEnter }) {
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Welcome to Eden. I'm your AI concierge — ask me about photorealistic image generation, 4D avatars, voice agents, or anything Eden can create for you." }
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // ═══ CLOVER GROWTH STATE ═══
  const [cloverPhase, setCloverPhase] = useState("dormant");
  const [growthProgress, setGrowthProgress] = useState(0); // 0→1 smooth
  const [breezeAngle, setBreezeAngle] = useState(0);

  // ═══ CLOVER LIFECYCLE ═══
  useEffect(() => {
    if (!mounted) return;

    const t1 = setTimeout(() => setCloverPhase("sprouting"), 1000);
    const t2 = setTimeout(() => setCloverPhase("struggling"), 2500);
    const t3 = setTimeout(() => setCloverPhase("bursting"), 4500);
    const t4 = setTimeout(() => setCloverPhase("bloomed"), 5500);
    const t5 = setTimeout(() => setCloverPhase("growing"), 30000);

    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
  }, [mounted]);

  // ═══ LEAF GROWTH — 33% EXPLOSIVE BURSTS every 5 seconds ═══
  // Leaves grow in dramatic visible jumps, not slow continuous
  useEffect(() => {
    if (cloverPhase !== "growing") return;

    let burstCount = 0;
    const maxBursts = 12; // 12 bursts × 5s = 60 seconds of dramatic growth

    // First burst immediately when entering "growing" phase
    setGrowthProgress(0.33);
    burstCount = 1;

    const interval = setInterval(() => {
      burstCount++;
      if (burstCount >= maxBursts) {
        clearInterval(interval);
        setGrowthProgress(1);
        return;
      }
      // Each burst adds ~33% of remaining growth (diminishing but always noticeable)
      setGrowthProgress(prev => {
        const remaining = 1 - prev;
        return Math.min(prev + remaining * 0.33, 1);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [cloverPhase]);

  // ═══ BREEZE EFFECT — continuous subtle sway ═══
  useEffect(() => {
    if (cloverPhase === "dormant") return;
    let frame;
    let start = Date.now();
    const animate = () => {
      const t = (Date.now() - start) / 1000;
      const sway = Math.sin(t * 0.4) * 2.5
        + Math.sin(t * 0.7 + 1) * 1.2
        + Math.sin(t * 1.3) * 0.6;
      setBreezeAngle(sway);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [cloverPhase]);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  const sendMessage = async () => {
    if (!chatMsg.trim() || loading) return;
    const userMsg = chatMsg.trim();
    setChatMsg("");
    setMessages(p => [...p, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      history.push({ role: "user", content: userMsg });
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: "You are Eden AI, the premium concierge for the Eden Realism Engine by Beryl AI Labs. Eden offers: photorealistic AI image generation (FLUX, CogView4), AI video generation (LTX-Video, Wan 2.2, Kling 3.0), 18 specialized voice agents, and EVE — a 4D conversational avatar system. Speak with refined luxury brand confidence. Keep responses 2-3 sentences. Be warm, sophisticated, knowledgeable. Mention specific Eden capabilities when relevant.",
          messages: history }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", text: data.content?.map(b => b.text || "").join("") || "Please try again." }]);
    } catch { setMessages(p => [...p, { role: "assistant", text: "Eden is recalibrating. Please try again." }]); }
    setLoading(false);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", background: "radial-gradient(ellipse at 50% 70%, #1a0f05 0%, #0a0604 40%, #050302 100%)", overflow: "hidden", position: "relative" }}>
      {/* Particles */}
      {Array.from({ length: 25 }).map((_, i) => <div key={`p${i}`} className="eden-particle" style={{ left: `${Math.random()*100}%`, bottom: `-${Math.random()*20}%`, width: `${1+Math.random()*3}px`, height: `${1+Math.random()*3}px`, animationDuration: `${8+Math.random()*12}s`, animationDelay: `${Math.random()*8}s` }} />)}
      {Array.from({ length: 8 }).map((_, i) => <div key={`g${i}`} className="eden-particle" style={{ left: `${25+Math.random()*50}%`, bottom: `-${Math.random()*15}%`, width: `${1+Math.random()*2}px`, height: `${1+Math.random()*2}px`, background: `radial-gradient(circle,rgba(0,230,118,${.3+Math.random()*.4}),transparent)`, animationDuration: `${10+Math.random()*14}s`, animationDelay: `${Math.random()*10}s` }} />)}

      {/* ═══ SHOOTING STARS — SUSPENDED IN SPACE, barely drifting ═══ */}
      {Array.from({ length: 3 }).map((_, i) => <div key={`s${i}`} className="shooting-star" style={{ top: `${5+Math.random()*30}%`, left: `${-10+Math.random()*20}%`, width: `${30+Math.random()*40}px`, animationDuration: `${40+Math.random()*30}s`, animationDelay: `${i*12+Math.random()*10}s`, opacity: 0 }} />)}
      {Array.from({ length: 1 }).map((_, i) => <div key={`gs${i}`} className="shooting-star green-star" style={{ top: `${15+Math.random()*25}%`, left: `${-10+Math.random()*15}%`, width: `${25+Math.random()*30}px`, animationDuration: `${50+Math.random()*20}s`, animationDelay: `${20+Math.random()*15}s`, opacity: 0 }} />)}

      {/* Radial glow — shifted lower to follow the logo position */}
      <div style={{ position: "absolute", bottom: "15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(197,179,88,.06) 0%, rgba(76,175,80,.01) 40%, transparent 70%)", animation: "glow-pulse 4s ease-in-out infinite", pointerEvents: "none" }} />

      {/* ═══ EDEN TITLE + CLOVER — anchored to bottom zone, clover grows UP into open sky ═══ */}
      <div style={{
        position: "relative", cursor: "default",
        transform: mounted ? "scale(1)" : "scale(0.9)",
        opacity: mounted ? 1 : 0,
        transition: "all 1.2s cubic-bezier(0.16,1,0.3,1)",
        marginTop: 0,
      }}>
        {/* Gold top line */}
        <div style={{ width: 600, height: 1, margin: "0 auto 20px", background: "linear-gradient(90deg, transparent, #C5B358, #F5E6A3, #C5B358, transparent)", animation: mounted ? "line-grow 1.5s ease-out forwards" : "none", animationDelay: ".3s", transformOrigin: "center", opacity: mounted ? 1 : 0 }}/>

        {/* EDEN text — +40% from 128 = 179px — with clover sprouting from CENTER E */}
        <div style={{ position: "relative", textAlign: "center" }}>
          <h1 style={{
            fontSize: 179, fontWeight: 900, letterSpacing: 44, margin: 0,
            fontFamily: "'Cinzel Decorative','Cinzel',serif",
            background: "linear-gradient(135deg,#8B6914 0%,#C5B358 15%,#F5E6A3 30%,#D4AF37 45%,#C5B358 55%,#F5E6A3 65%,#D4AF37 80%,#8B6914 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: mounted ? "metal-gleam 8s linear infinite" : "none",
            filter: "drop-shadow(0 2px 4px rgba(139,105,20,.5)) drop-shadow(0 0 20px rgba(197,179,88,.15))",
            lineHeight: 1,
          }}>EDEN</h1>

          {/* ═══ LIVING CLOVER — WELDED to top of center E, grows upward ═══ */}
          {/* Container handles ALL growth scaling from bottom-center (where stem meets E) */}
          {/* The SVG inside only handles breeze rotation — NO scaling on SVG */}
          <div className="clover-container" style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            marginLeft: "-60px",
            width: 120,
            height: 120,
            zIndex: 10,
            pointerEvents: "none",
            /* ALL SCALING HAPPENS HERE — from the bottom center where stem meets the E */
            transform: `scale(${1.0 + (["bloomed","growing"].includes(cloverPhase) || cloverPhase === "bursting" ? 0.66 : 0) + (growthProgress * 1.0)})`,
            transformOrigin: "center bottom",
            transition: "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}>
            <LivingClover
              phase={cloverPhase}
              growthProgress={growthProgress}
              breezeAngle={breezeAngle}
            />
          </div>
        </div>

        {/* Separator with green gem */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", margin: "14px 0", animation: mounted ? "fade-up 1s ease-out forwards" : "none", animationDelay: ".5s", opacity: mounted ? 1 : 0 }}>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg,transparent,#C5B358)" }}/>
          <div style={{ width: 8, height: 8, transform: "rotate(45deg)", background: "linear-gradient(135deg,#00E676,#1B5E20)", animation: "green-gem 3s ease-in-out infinite" }}/>
          <div style={{ width: 80, height: 1, background: "linear-gradient(90deg,#C5B358,transparent)" }}/>
        </div>

        {/* REALISM ENGINE */}
        <h2 style={{
          fontSize: 29, fontWeight: 600, letterSpacing: 18, margin: 0, textAlign: "center",
          fontFamily: "'Cinzel',serif", textTransform: "uppercase",
          background: "linear-gradient(135deg,#8B6914 0%,#C5B358 20%,#F5E6A3 35%,#D4AF37 50%,#F5E6A3 65%,#C5B358 80%,#8B6914 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: mounted ? "metal-gleam 8s linear infinite" : "none",
          animationDelay: ".5s",
          filter: "drop-shadow(0 1px 2px rgba(139,105,20,.4))",
        }}>Realism Engine</h2>

        {/* Bottom line */}
        <div style={{ width: 600, height: 1, margin: "18px auto 20px", background: "linear-gradient(90deg,transparent,#C5B358,#F5E6A3,#C5B358,transparent)", animation: mounted ? "line-grow 1.5s ease-out forwards" : "none", animationDelay: ".6s", transformOrigin: "center" }}/>

        <p style={{ fontSize: 17, letterSpacing: 8, textAlign: "center", margin: 0, fontFamily: "'Cinzel',serif", textTransform: "uppercase", color: C.textDim, animation: mounted ? "fade-up 1s ease-out forwards" : "none", animationDelay: ".8s", opacity: mounted ? 1 : 0 }}>Beryl AI Labs &nbsp;·&nbsp; The Eden Project</p>

        {/* Shimmer */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: 20 }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(245,230,163,.08),transparent)", animation: "shimmer-sweep 6s ease-in-out infinite", animationDelay: "2s" }}/>
        </div>
      </div>

      {/* ═══ ENTER OUR AI GARDEN — LARGER BUTTON ═══ */}
      <button onClick={onEnter} style={{
        marginTop: 20, padding: "18px 56px", borderRadius: 34, cursor: "pointer",
        background: "linear-gradient(135deg, rgba(76,175,80,0.14), rgba(76,175,80,0.05))",
        border: "1px solid rgba(76,175,80,0.35)", color: C.greenBright,
        fontFamily: "'Cinzel',serif", fontSize: 15, letterSpacing: 7, textTransform: "uppercase",
        transition: "all 0.4s", animation: mounted ? "fade-up 1s ease-out forwards" : "none",
        animationDelay: "1.2s", opacity: mounted ? 1 : 0,
      }} onMouseOver={e => { e.target.style.background = "linear-gradient(135deg,rgba(76,175,80,.22),rgba(76,175,80,.1))"; e.target.style.boxShadow = "0 0 40px rgba(76,175,80,.18), 0 0 80px rgba(76,175,80,.06)"; e.target.style.borderColor = "rgba(76,175,80,.5)"; }}
         onMouseOut={e => { e.target.style.background = "linear-gradient(135deg,rgba(76,175,80,.14),rgba(76,175,80,.05))"; e.target.style.boxShadow = "none"; e.target.style.borderColor = "rgba(76,175,80,.35)"; }}>
        Enter Our AI Garden
      </button>

      {/* ═══ CHAT — with ANIMATED GOLD SHIMMER BORDER ═══ */}
      <div style={{
        width: "100%", maxWidth: 850, padding: "0 24px", marginTop: 24, marginBottom: 24,
        animation: mounted ? "fade-up 1s ease-out forwards" : "none",
        animationDelay: "1.4s", opacity: mounted ? 1 : 0,
      }}>
        {messages.length > 1 && (
          <div className="chat-shimmer-border" style={{ marginBottom: 16 }}>
            <div className="chat-shimmer-border-inner">
              <div ref={chatRef} style={{
                maxHeight: 275, overflowY: "auto", padding: 24,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                {messages.map((m, i) => (
                  <div key={i} style={{
                    padding: "12px 18px", borderRadius: 14,
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    background: m.role === "user"
                      ? "linear-gradient(135deg,rgba(197,179,88,.1),rgba(197,179,88,.04))"
                      : "linear-gradient(135deg,rgba(76,175,80,.06),rgba(76,175,80,.02))",
                    border: `1px solid ${m.role === "user" ? "rgba(197,179,88,.12)" : C.borderGreen}`,
                  }}>
                    <span style={{ fontSize: 15, lineHeight: 1.7, color: m.role === "user" ? C.text : C.textGreen, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500 }}>{m.text}</span>
                  </div>
                ))}
                {loading && (
                  <div style={{ padding: "12px 18px", borderRadius: 14, alignSelf: "flex-start", background: "linear-gradient(135deg,rgba(76,175,80,.06),rgba(76,175,80,.02))", border: `1px solid ${C.borderGreen}` }}>
                    <span style={{ color: C.textGreen, fontSize: 16, letterSpacing: 4 }}>{[0,1,2].map(i => <span key={i} style={{ animation: `dot-pulse 1.2s ease-in-out ${i*.2}s infinite`, display: "inline-block" }}>●</span>)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="chat-shimmer-border">
          <div className="chat-shimmer-border-inner" style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 24px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#4CAF50,#00E676)", boxShadow: "0 0 8px rgba(0,230,118,.5)", animation: "glow-pulse 2s ease-in-out infinite" }}/>
            <input
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Talk to Eden..."
              style={{
                flex: 1, padding: "14px 0", background: "transparent", border: "none",
                color: C.text, fontSize: 17, fontFamily: "'Cormorant Garamond',serif",
                outline: "none", letterSpacing: 0.5,
              }}
            />
            <button onClick={sendMessage} disabled={loading || !chatMsg.trim()} style={{
              padding: "12px 28px", borderRadius: 12, cursor: loading || !chatMsg.trim() ? "default" : "pointer",
              background: chatMsg.trim() && !loading ? "linear-gradient(135deg,#2E7D32,#1B5E20)" : "rgba(197,179,88,.04)",
              border: `1px solid ${chatMsg.trim() && !loading ? "rgba(76,175,80,.4)" : C.border}`,
              color: chatMsg.trim() && !loading ? "#C8E6C9" : C.textDim,
              fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
              transition: "all .3s", opacity: loading || !chatMsg.trim() ? 0.4 : 1, flexShrink: 0,
            }}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>

        {messages.length <= 1 && (
          <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, letterSpacing: 4, fontFamily: "'Cinzel',serif", color: "rgba(197,179,88,.55)", textTransform: "uppercase" }}>
            Ask about image generation · voice agents · 4D avatars
          </p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// APP SHELL — Sidebar + Pages
// ═══════════════════════════════════════════
function AppShell() {
  const [tab, setTab] = useState("image");
  const tabs = [
    { id: "image", icon: "🖼", label: "Image" },
    { id: "video", icon: "🎬", label: "Video" },
    { id: "voice", icon: "🎙", label: "Voice" },
    { id: "avatar", icon: "👤", label: "Avatar" },
  ];

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: C.bg }}>
      <div style={{ width: 72, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16, gap: 4, background: "rgba(12,8,4,.95)", flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,rgba(76,175,80,.1),rgba(197,179,88,.05))", border: `1px solid ${C.borderGreen}`, marginBottom: 16, cursor: "pointer", fontSize: 16 }} onClick={() => window.location.reload()}>🌿</div>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            width: 56, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
            background: tab === t.id ? "linear-gradient(135deg,rgba(197,179,88,.1),rgba(197,179,88,.04))" : "transparent",
            borderLeft: tab === t.id ? "2px solid #C5B358" : "2px solid transparent",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all .2s",
          }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 8, letterSpacing: 1, color: tab === t.id ? C.gold : C.textDim, fontFamily: "'Cinzel',serif", textTransform: "uppercase" }}>{t.label}</span>
          </button>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ padding: "8px 0 16px", textAlign: "center" }}>
          <div style={{ fontSize: 7, letterSpacing: 2, color: "rgba(139,115,85,.4)", fontFamily: "'Cinzel',serif", writingMode: "vertical-rl", textOrientation: "mixed" }}>BERYL AI</div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tab === "image" && <ImageStudio />}
        {tab === "video" && <VideoStudio />}
        {tab === "voice" && <VoiceAgents />}
        {tab === "avatar" && <AvatarBuilder />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// IMAGE STUDIO
// ═══════════════════════════════════════════
function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [preset, setPreset] = useState("eden");
  const [res, setRes] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);

  const presets = {
    eden: "photorealistic, 8k uhd, Canon EOS R5, natural skin texture, film grain, shallow depth of field, golden hour lighting",
    cinematic: "cinematic, anamorphic lens, film grain, dramatic lighting, shallow depth of field, color graded",
    studio: "studio photography, softbox lighting, clean background, professional portrait, sharp focus",
    raw: "raw photo, unedited, natural lighting, authentic, documentary style",
    none: "",
  };
  const neg = "plastic skin, glossy, airbrushed, CGI, 3D render, doll-like, blurry, deformed, extra fingers, watermark, text, cartoon, anime";

  const generate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setStatus("⏳ Generating with FLUX...");
    const [w, h] = res.split("x").map(Number);
    const seed = Math.floor(Math.random() * 999999);
    const fullPrompt = preset !== "none" ? `${prompt}, ${presets[preset]}` : prompt;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${w}&height=${h}&seed=${seed}&nologo=true&negative=${encodeURIComponent(neg)}&model=flux`;

    const img = new Image();
    img.onload = () => { setImageUrl(url); setStatus(`✅ Generated · Seed: ${seed}`); setHistory(p => [{ url, prompt: prompt.trim(), seed }, ...p].slice(0, 12)); setLoading(false); };
    img.onerror = () => { setStatus("❌ Generation failed — try different prompt"); setLoading(false); };
    img.src = url;
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: 0 }}>
      <div style={{ width: 380, borderRight: `1px solid ${C.border}`, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, letterSpacing: 4, color: C.gold, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🖼</span> Image Studio
        </div>
        <Card title="Prompt">
          <Input textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your image in detail..." style={{ minHeight: 100 }} onKeyDown={e => e.key === "Enter" && e.ctrlKey && generate()}/>
        </Card>
        <Card title="Eden Protocol Preset">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {[["eden","🔱 Eden"],["cinematic","🌙 Cinematic"],["studio","✨ Studio"],["raw","📸 Raw"],["none","🔥 None"]].map(([k,l]) => (
              <button key={k} onClick={() => setPreset(k)} style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                fontFamily: "'Cormorant Garamond',serif",
                background: preset === k ? "rgba(197,179,88,.12)" : "transparent",
                border: `1px solid ${preset === k ? "rgba(197,179,88,.3)" : C.border}`,
                color: preset === k ? C.gold : C.textDim, transition: "all .2s",
              }}>{l}</button>
            ))}
          </div>
        </Card>
        <Card title="Resolution">
          <Select value={res} onChange={e => setRes(e.target.value)} options={[
            { value: "1024x1024", label: "1024 × 1024 (Square)" },
            { value: "1280x720", label: "1280 × 720 (Landscape)" },
            { value: "720x1280", label: "720 × 1280 (Portrait)" },
            { value: "1536x1024", label: "1536 × 1024 (Wide)" },
          ]} style={{ width: "100%" }}/>
        </Card>
        <Btn green onClick={generate} disabled={loading || !prompt.trim()} style={{ width: "100%", padding: "14px 20px", fontSize: 12 }}>
          {loading ? "⏳ Generating..." : "Generate Image"}
        </Btn>
        {status && <StatusBadge text={status} type={status.startsWith("✅") ? "success" : status.startsWith("❌") ? "error" : "info"}/>}
      </div>
      <div style={{ flex: 1, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ flex: 1, minHeight: 400, borderRadius: 14, border: `1px solid ${C.border}`, background: "rgba(12,8,4,.6)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
          {imageUrl ? (
            <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 10 }}/>
          ) : loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.green}`, borderRadius: "50%", animation: "spin-loader 1s linear infinite" }}/>
              <span style={{ fontSize: 12, color: C.textDim, fontFamily: "'Cinzel',serif", letterSpacing: 2 }}>GENERATING...</span>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 40, display: "block", marginBottom: 12, opacity: .3 }}>🖼</span>
              <span style={{ fontSize: 12, color: C.textDim, fontFamily: "'Cinzel',serif", letterSpacing: 2 }}>YOUR IMAGE WILL APPEAR HERE</span>
              <br/><span style={{ fontSize: 11, color: "rgba(139,115,85,.4)", fontFamily: "'Cormorant Garamond',serif" }}>Enter a prompt and click Generate</span>
            </div>
          )}
        </div>
        {history.length > 0 && (
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 10, letterSpacing: 3, color: C.textDim, textTransform: "uppercase", marginBottom: 10 }}>History</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
              {history.map((h, i) => (
                <div key={i} onClick={() => setImageUrl(h.url)} style={{ cursor: "pointer", borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "1", transition: "all .2s" }}>
                  <img src={h.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// VIDEO STUDIO
// ═══════════════════════════════════════════
function VideoStudio() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("5s");
  const [quality, setQuality] = useState("1080p");
  const [engine, setEngine] = useState("ltx");
  const [audio, setAudio] = useState(true);
  const [status, setStatus] = useState(null);

  const generateVideo = () => {
    if (!prompt.trim()) return;
    setStatus("🚀 Connecting to Eden Cloud GPU...");
    setTimeout(() => {
      window.open("https://huggingface.co/spaces/AIBRUH/eden-diffusion-studio", "_blank");
      setStatus("✅ Eden Cloud Studio opened — generate your video there with GPU power");
    }, 1000);
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: 0 }}>
      <div style={{ width: 380, borderRight: `1px solid ${C.border}`, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, letterSpacing: 4, color: C.gold, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🎬</span> Video Studio
        </div>
        <Card title="Video Prompt">
          <Input textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your video scene in detail. Include camera movement, lighting, and action..." style={{ minHeight: 120 }}/>
        </Card>
        <Card title="Engine">
          <div style={{ display: "flex", gap: 6 }}>
            {[["ltx","LTX-Video 2"],["wan","Wan 2.2"],["kling","Kling 3.0"]].map(([k,l]) => (
              <button key={k} onClick={() => setEngine(k)} style={{
                flex: 1, padding: "8px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                fontFamily: "'Cormorant Garamond',serif", textAlign: "center",
                background: engine === k ? "rgba(197,179,88,.12)" : "transparent",
                border: `1px solid ${engine === k ? "rgba(197,179,88,.3)" : C.border}`,
                color: engine === k ? C.gold : C.textDim,
              }}>{l}</button>
            ))}
          </div>
        </Card>
        <Card title="Settings">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>QUALITY</div>
              <Select value={quality} onChange={e => setQuality(e.target.value)} options={[
                { value: "720p", label: "720p (Standard)" },
                { value: "1080p", label: "1080p (HD)" },
              ]} style={{ width: "100%" }}/>
            </div>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ fontSize: 10, color: C.textDim, marginBottom: 6, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>DURATION</div>
              <Select value={duration} onChange={e => setDuration(e.target.value)} options={[
                { value: "5s", label: "5 seconds" },
                { value: "10s", label: "10 seconds" },
                { value: "15s", label: "15 seconds" },
              ]} style={{ width: "100%" }}/>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
            <button onClick={() => setAudio(!audio)} style={{
              width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer",
              background: audio ? C.green : "rgba(139,115,85,.3)", transition: "all .2s", position: "relative",
            }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: audio ? 18 : 2, transition: "all .2s" }}/>
            </button>
            <span style={{ fontSize: 12, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>Native Audio</span>
          </div>
        </Card>
        <Btn green onClick={generateVideo} disabled={!prompt.trim()} style={{ width: "100%", padding: "14px 20px", fontSize: 12 }}>
          Generate Video
        </Btn>
        {status && <StatusBadge text={status} type={status.startsWith("✅") ? "success" : "info"}/>}
        <div style={{ padding: 12, borderRadius: 10, background: "rgba(76,175,80,.04)", border: `1px solid ${C.borderGreen}` }}>
          <span style={{ fontSize: 11, color: C.textGreen, fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.5 }}>
            Video generation requires GPU compute. Clicking Generate opens Eden Cloud Studio powered by A10G GPU on HuggingFace. Your prompt and settings will be ready to use.
          </span>
        </div>
      </div>
      <div style={{ flex: 1, padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 16, opacity: .3 }}>🎬</span>
          <span style={{ fontSize: 13, color: C.textDim, fontFamily: "'Cinzel',serif", letterSpacing: 2, display: "block", marginBottom: 8 }}>VIDEO PREVIEW</span>
          <span style={{ fontSize: 12, color: "rgba(139,115,85,.5)", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.6 }}>
            Write your prompt, select engine and settings, then Generate to create your video in Eden Cloud Studio.
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// VOICE AGENTS
// ═══════════════════════════════════════════
function VoiceAgents() {
  const agents = [
    { id: "medical", name: "Medical Office", icon: "🏥", sys: "You are a medical office receptionist AI. Handle scheduling, prescription refills, patient intake with warm, efficient, HIPAA-conscious language. Keep responses to 2-3 sentences." },
    { id: "legal", name: "Legal Assistant", icon: "⚖️", sys: "You are a legal office assistant AI. Help with intake, scheduling consultations, general legal FAQ. Professional, precise. 2-3 sentences." },
    { id: "fitness", name: "Fitness Coach", icon: "💪", sys: "You are a fitness coach AI. Guide workouts, form tips, motivation. Energetic and supportive. 2-3 sentences." },
    { id: "realestate", name: "Real Estate", icon: "🏠", sys: "You are a real estate agent AI. Help with property inquiries, scheduling viewings, neighborhood info. Knowledgeable and friendly. 2-3 sentences." },
    { id: "restaurant", name: "Restaurant Host", icon: "🍽", sys: "You are a restaurant host AI. Handle reservations, menu questions, special dietary needs. Warm and accommodating. 2-3 sentences." },
    { id: "tutor", name: "AI Tutor", icon: "📚", sys: "You are an AI tutor. Help students with homework, explain concepts clearly, encourage learning. Patient and clear. 2-3 sentences." },
    { id: "sales", name: "Sales Rep", icon: "💼", sys: "You are an AI sales representative. Handle product inquiries, qualify leads, schedule demos. Professional and persuasive. 2-3 sentences." },
    { id: "support", name: "Tech Support", icon: "🔧", sys: "You are a tech support AI. Troubleshoot issues, guide users through solutions, escalate when needed. Patient and clear. 2-3 sentences." },
    { id: "concierge", name: "Hotel Concierge", icon: "🏨", sys: "You are a luxury hotel concierge AI. Help with reservations, local recommendations, room service. Sophisticated and attentive. 2-3 sentences." },
  ];

  const [agent, setAgent] = useState(agents[0]);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);
  useEffect(() => { setMessages([{ role: "assistant", text: `Hi! I'm your ${agent.name} agent. How can I help you today?` }]); }, [agent]);

  const send = async () => {
    if (!chatMsg.trim() || loading) return;
    const msg = chatMsg.trim();
    setChatMsg("");
    setMessages(p => [...p, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      history.push({ role: "user", content: msg });
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `${agent.sys} You are part of Eden Voice Agents by Beryl AI Labs.`, messages: history }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", text: data.content?.map(b => b.text || "").join("") || "Please try again." }]);
    } catch { setMessages(p => [...p, { role: "assistant", text: "Connection interrupted. Please try again." }]); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: 0 }}>
      <div style={{ width: 240, borderRight: `1px solid ${C.border}`, padding: 16, overflowY: "auto", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, letterSpacing: 3, color: C.gold, textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🎙</span> Agents
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {agents.map(a => (
            <button key={a.id} onClick={() => setAgent(a)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
              border: "none", cursor: "pointer", textAlign: "left", transition: "all .2s",
              background: agent.id === a.id ? "linear-gradient(135deg,rgba(197,179,88,.1),rgba(197,179,88,.04))" : "transparent",
              borderLeft: agent.id === a.id ? "2px solid #C5B358" : "2px solid transparent",
            }}>
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              <span style={{ fontSize: 12, color: agent.id === a.id ? C.gold : C.textDim, fontFamily: "'Cormorant Garamond',serif", fontWeight: agent.id === a.id ? 600 : 400 }}>{a.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>{agent.icon}</span>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, letterSpacing: 2, color: C.gold }}>{agent.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: "0 0 6px rgba(76,175,80,.5)" }}/>
              <span style={{ fontSize: 10, color: C.textGreen, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>LIVE · POWERED BY CLAUDE</span>
            </div>
          </div>
        </div>
        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              padding: "12px 16px", borderRadius: 14, maxWidth: "75%",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "linear-gradient(135deg,rgba(197,179,88,.12),rgba(197,179,88,.06))" : "linear-gradient(135deg,rgba(76,175,80,.07),rgba(76,175,80,.02))",
              border: `1px solid ${m.role === "user" ? "rgba(197,179,88,.15)" : C.borderGreen}`,
            }}>
              <span style={{ fontSize: 14, lineHeight: 1.6, color: m.role === "user" ? C.text : C.textGreen, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500 }}>{m.text}</span>
            </div>
          ))}
          {loading && <div style={{ padding: "12px 16px", borderRadius: 14, alignSelf: "flex-start", background: "linear-gradient(135deg,rgba(76,175,80,.07),rgba(76,175,80,.02))", border: `1px solid ${C.borderGreen}` }}><span style={{ color: C.textGreen, fontSize: 16, letterSpacing: 4 }}>{[0,1,2].map(i => <span key={i} style={{ animation: `dot-pulse 1.2s ease-in-out ${i*.2}s infinite`, display: "inline-block" }}>●</span>)}</span></div>}
        </div>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
          <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={`Talk to ${agent.name}...`} style={{ flex: 1, padding: "12px 16px", borderRadius: 12, background: C.bgInput, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, fontFamily: "'Cormorant Garamond',serif", outline: "none" }}/>
          <Btn green onClick={send} disabled={loading || !chatMsg.trim()} style={{ padding: "12px 20px" }}>Send</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// AVATAR BUILDER
// ═══════════════════════════════════════════
function AvatarBuilder() {
  const [speech, setSpeech] = useState("");
  const [avatarPrompt, setAvatarPrompt] = useState("");
  const [quality, setQuality] = useState("720p");
  const [status, setStatus] = useState(null);

  const generate = () => {
    setStatus("🚀 Connecting to Eden Cloud GPU...");
    setTimeout(() => {
      window.open("https://huggingface.co/spaces/AIBRUH/eden-diffusion-studio", "_blank");
      setStatus("✅ Eden Cloud Studio opened — build your avatar there with GPU power");
    }, 1000);
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: 0 }}>
      <div style={{ width: 400, borderRight: `1px solid ${C.border}`, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, letterSpacing: 4, color: C.gold, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>👤</span> Avatar Builder
          <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 6, background: "rgba(76,175,80,.1)", border: `1px solid ${C.borderGreen}`, color: C.greenBright, letterSpacing: 1, marginLeft: "auto" }}>EVE 4D</span>
        </div>
        <Card title="1. Avatar Image">
          <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: 32, textAlign: "center", cursor: "pointer", transition: "all .2s" }}>
            <span style={{ fontSize: 28, display: "block", marginBottom: 8, opacity: .4 }}>📷</span>
            <span style={{ fontSize: 12, color: C.textDim, fontFamily: "'Cormorant Garamond',serif" }}>Click / Drop / Paste</span>
            <br/><span style={{ fontSize: 10, color: "rgba(139,115,85,.4)", fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>Select from History</span>
          </div>
        </Card>
        <Card title="2. Speech">
          <Input textarea value={speech} onChange={e => setSpeech(e.target.value)} placeholder="Enter what you'd like the avatar to say..." style={{ minHeight: 80 }}/>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            <span style={{ fontSize: 10, color: C.textDim, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>VOICE:</span>
            <Select value="natural" onChange={() => {}} options={[
              { value: "natural", label: "Natural Female" },
              { value: "warm", label: "Warm Narrator" },
            ]} style={{ flex: 1 }}/>
          </div>
        </Card>
        <Card title="3. Avatar Prompt (Optional)">
          <Input textarea value={avatarPrompt} onChange={e => setAvatarPrompt(e.target.value)} placeholder="Enter the avatar's actions, emotions, expressions..." style={{ minHeight: 60 }}/>
        </Card>
        <Card title="Quality">
          <div style={{ display: "flex", gap: 8 }}>
            {[["720p","Standard (720P · 24FPS)"],["1080p","Professional (1080P · 48FPS)"]].map(([k,l]) => (
              <button key={k} onClick={() => setQuality(k)} style={{
                flex: 1, padding: "10px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                fontFamily: "'Cormorant Garamond',serif", textAlign: "center",
                background: quality === k ? "rgba(197,179,88,.12)" : "transparent",
                border: `1px solid ${quality === k ? "rgba(197,179,88,.3)" : C.border}`,
                color: quality === k ? C.gold : C.textDim,
              }}>{l}{k === "1080p" && <span style={{ fontSize: 8, color: C.greenBright, marginLeft: 6, padding: "1px 4px", borderRadius: 3, background: "rgba(76,175,80,.15)" }}>PRO</span>}</button>
            ))}
          </div>
        </Card>
        <Btn green onClick={generate} style={{ width: "100%", padding: "14px 20px", fontSize: 12 }}>
          Generate Avatar
        </Btn>
        {status && <StatusBadge text={status} type={status.startsWith("✅") ? "success" : "info"}/>}
        <div style={{ padding: 12, borderRadius: 10, background: "rgba(76,175,80,.04)", border: `1px solid ${C.borderGreen}` }}>
          <span style={{ fontSize: 11, color: C.textGreen, fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.5 }}>
            Avatar generation uses EVE 4D pipeline with KDTalker + Chatterbox TTS. Requires GPU compute via Eden Cloud Studio.
          </span>
        </div>
      </div>
      <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 10, letterSpacing: 3, color: C.textDim, textTransform: "uppercase", marginBottom: 16 }}>Avatar Library</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12, flex: 1, alignContent: "start" }}>
          {[["Ashley","Makeup","🧑‍🎨"],["Isabella","UGC Ad","👩"],["Lia","OOTD","🧘‍♀️"],["Raj","Live Stream","🎥"],["Arina","Talking Head","👩‍💼"],["Ethan","Working Baby","👶"],["Charlie","Host","🎙"],["Matt","Podcast","🎧"]].map(([name,tag,icon], i) => (
            <div key={i} style={{ borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", cursor: "pointer", transition: "all .2s", background: C.bgCard }}>
              <div style={{ aspectRatio: "3/4", background: `linear-gradient(135deg, rgba(${40+i*15},${30+i*10},${20+i*8},.8), rgba(18,12,8,.9))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>{icon}</div>
              <div style={{ padding: "8px 10px" }}>
                <div style={{ fontSize: 11, color: C.text, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: 9, color: C.textDim, fontFamily: "'Cinzel',serif", letterSpacing: 1, marginTop: 2 }}>{tag}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
