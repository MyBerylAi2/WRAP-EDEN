"use client";
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
  const stemReveal = phase === "dormant" ? 0 : phase === "sprouting" ? 0.4 : phase === "struggling" ? 0.7 : 1;
  const leafReveal = !bloomed && !bursting ? 0 : 1;

  const vbW = 140;
  const vbH = 140;
  const cx = 70;
  const stemBase = 138;
  const stemTop = 100;
  const hub = stemTop - 2;

  // PHOTOREALISTIC leaf — wide, plump heart shape matching reference photo
  // Rounder, fuller shape with pronounced heart notch at tip
  const leafOuter = "M0,0 C-1,-5 2,-14 6,-22 C10,-28 16,-36 24,-41 C28,-43 32,-44 36,-42 C40,-39 42,-34 42,-28 C42,-20 38,-12 30,-6 C22,-1 10,1 0,0 Z";

  // Dense vein system — matches reference photo's intricate branching network
  const Veins = () => (
    <g>
      {/* Central vein — thick, prominent midrib */}
      <path d="M0,0 C3,-6 10,-20 26,-38" stroke="rgba(200,230,201,.55)" strokeWidth="1.1" fill="none"/>
      {/* Primary veins — 6 major branches curving toward leaf edge */}
      <path d="M2,-4 C8,-6 16,-8 26,-10" stroke="rgba(200,230,201,.4)" strokeWidth=".6" fill="none"/>
      <path d="M4,-8 C10,-11 18,-14 30,-16" stroke="rgba(200,230,201,.4)" strokeWidth=".55" fill="none"/>
      <path d="M6,-13 C12,-16 20,-20 32,-23" stroke="rgba(200,230,201,.4)" strokeWidth=".5" fill="none"/>
      <path d="M9,-18 C15,-22 24,-26 35,-29" stroke="rgba(200,230,201,.38)" strokeWidth=".5" fill="none"/>
      <path d="M12,-23 C18,-27 26,-31 36,-34" stroke="rgba(200,230,201,.35)" strokeWidth=".45" fill="none"/>
      <path d="M16,-28 C22,-32 28,-35 35,-37" stroke="rgba(200,230,201,.3)" strokeWidth=".4" fill="none"/>
      {/* Secondary veins — branches off primaries */}
      <path d="M6,-5 C9,-7 12,-9 16,-10" stroke="rgba(200,230,201,.28)" strokeWidth=".35" fill="none"/>
      <path d="M8,-10 C11,-12 15,-14 20,-15" stroke="rgba(200,230,201,.28)" strokeWidth=".35" fill="none"/>
      <path d="M10,-14 C14,-16 18,-19 24,-20" stroke="rgba(200,230,201,.25)" strokeWidth=".3" fill="none"/>
      <path d="M13,-19 C17,-22 22,-24 28,-26" stroke="rgba(200,230,201,.25)" strokeWidth=".3" fill="none"/>
      <path d="M15,-23 C19,-26 24,-28 30,-30" stroke="rgba(200,230,201,.22)" strokeWidth=".3" fill="none"/>
      <path d="M18,-27 C22,-30 27,-32 32,-34" stroke="rgba(200,230,201,.2)" strokeWidth=".28" fill="none"/>
      <path d="M20,-31 C24,-34 28,-36 33,-37" stroke="rgba(200,230,201,.18)" strokeWidth=".25" fill="none"/>
      {/* Tertiary veins — fine webbing between secondaries */}
      <path d="M5,-6 C7,-8 9,-10 12,-11" stroke="rgba(200,230,201,.15)" strokeWidth=".22" fill="none"/>
      <path d="M7,-9 C9,-11 12,-13 15,-14" stroke="rgba(200,230,201,.15)" strokeWidth=".22" fill="none"/>
      <path d="M9,-13 C12,-15 15,-17 19,-18" stroke="rgba(200,230,201,.14)" strokeWidth=".2" fill="none"/>
      <path d="M11,-16 C14,-18 17,-20 22,-22" stroke="rgba(200,230,201,.14)" strokeWidth=".2" fill="none"/>
      <path d="M14,-20 C17,-23 20,-25 25,-27" stroke="rgba(200,230,201,.13)" strokeWidth=".2" fill="none"/>
      <path d="M17,-25 C20,-28 23,-30 28,-32" stroke="rgba(200,230,201,.12)" strokeWidth=".18" fill="none"/>
      <path d="M19,-29 C22,-31 25,-33 30,-35" stroke="rgba(200,230,201,.11)" strokeWidth=".18" fill="none"/>
      {/* Cross-veins — connecting network between major veins (like reference photo) */}
      <path d="M8,-8 C9,-11 10,-14 12,-16" stroke="rgba(200,230,201,.12)" strokeWidth=".18" fill="none"/>
      <path d="M14,-13 C15,-16 16,-19 18,-22" stroke="rgba(200,230,201,.12)" strokeWidth=".18" fill="none"/>
      <path d="M20,-18 C21,-22 22,-25 24,-28" stroke="rgba(200,230,201,.1)" strokeWidth=".16" fill="none"/>
      <path d="M26,-22 C27,-26 28,-29 30,-32" stroke="rgba(200,230,201,.1)" strokeWidth=".16" fill="none"/>
      <path d="M32,-26 C33,-29 34,-32 35,-34" stroke="rgba(200,230,201,.09)" strokeWidth=".15" fill="none"/>
      {/* Quaternary — ultra-fine meshwork for photorealism */}
      <path d="M4,-7 C5,-8 6,-9 8,-10" stroke="rgba(200,230,201,.08)" strokeWidth=".15" fill="none"/>
      <path d="M7,-11 C8,-12 10,-14 12,-15" stroke="rgba(200,230,201,.08)" strokeWidth=".15" fill="none"/>
      <path d="M10,-15 C12,-17 13,-18 16,-20" stroke="rgba(200,230,201,.08)" strokeWidth=".14" fill="none"/>
      <path d="M16,-22 C18,-24 19,-25 22,-27" stroke="rgba(200,230,201,.07)" strokeWidth=".14" fill="none"/>
      <path d="M22,-27 C24,-29 26,-31 28,-32" stroke="rgba(200,230,201,.07)" strokeWidth=".13" fill="none"/>
      <path d="M28,-31 C30,-33 31,-34 33,-36" stroke="rgba(200,230,201,.06)" strokeWidth=".13" fill="none"/>
      {/* Margin veins — running along leaf edge */}
      <path d="M30,-8 C34,-14 38,-20 40,-28" stroke="rgba(200,230,201,.12)" strokeWidth=".2" fill="none"/>
      <path d="M34,-16 C37,-22 39,-28 40,-34" stroke="rgba(200,230,201,.1)" strokeWidth=".18" fill="none"/>
    </g>
  );

  // Dew drops with caustic refraction highlight
  const DewDrop = ({ x, y, rx, ry, op }) => (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="url(#dw)" opacity={op}/>
      <ellipse cx={x+rx*0.3} cy={y-ry*0.35} rx={rx*0.3} ry={ry*0.25} fill="white" opacity={op*1.2}/>
      <ellipse cx={x-rx*0.15} cy={y+ry*0.3} rx={rx*0.2} ry={ry*0.15} fill="rgba(255,255,255,.15)" opacity={op*0.5}/>
    </g>
  );

  return (
    <svg
      width={vbW} height={vbH} viewBox={`0 0 ${vbW} ${vbH}`}
      style={{
        overflow: "visible",
        transform: `rotate(${breezeAngle}deg)`,
        transformOrigin: `${cx}px ${stemBase}px`,
        transition: "transform 2s ease-in-out",
        filter: bloomed
          ? "drop-shadow(0 0 18px rgba(0,230,118,.3)) drop-shadow(0 0 40px rgba(76,175,80,.1))"
          : "none",
      }}
    >
      <defs>
        {/* Photorealistic leaf body — lighter yellow-green like reference, subsurface glow in center */}
        <radialGradient id="lf" cx="30%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#7bc67a" stopOpacity=".95"/>
          <stop offset="12%" stopColor="#6abf69"/>
          <stop offset="28%" stopColor="#53a653"/>
          <stop offset="45%" stopColor="#43A047"/>
          <stop offset="60%" stopColor="#388E3C"/>
          <stop offset="78%" stopColor="#2E7D32"/>
          <stop offset="100%" stopColor="#1B5E20"/>
        </radialGradient>
        {/* Subsurface scattering — warm light passing through leaf tissue */}
        <radialGradient id="ls" cx="35%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#A5D6A7" stopOpacity=".35"/>
          <stop offset="20%" stopColor="#81C784" stopOpacity=".2"/>
          <stop offset="50%" stopColor="#66BB6A" stopOpacity=".1"/>
          <stop offset="100%" stopColor="#1B5E20" stopOpacity="0"/>
        </radialGradient>
        {/* Edge darkening — natural shadow at leaf margins */}
        <radialGradient id="le" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="transparent" stopOpacity="0"/>
          <stop offset="85%" stopColor="#0D3B0D" stopOpacity=".15"/>
          <stop offset="100%" stopColor="#0D3B0D" stopOpacity=".35"/>
        </radialGradient>
        {/* Natural color spots — subtle yellow-brown patches like real leaves */}
        <radialGradient id="lp" cx="60%" cy="40%" r="30%">
          <stop offset="0%" stopColor="#8fad5e" stopOpacity=".15"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="st" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#1B5E20"/>
          <stop offset="30%" stopColor="#2E7D32"/>
          <stop offset="70%" stopColor="#43A047"/>
          <stop offset="100%" stopColor="#4CAF50"/>
        </linearGradient>
        <radialGradient id="dw" cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".9"/>
          <stop offset="25%" stopColor="#E8F5E9" stopOpacity=".5"/>
          <stop offset="60%" stopColor="#C8E6C9" stopOpacity=".15"/>
          <stop offset="100%" stopColor="#A5D6A7" stopOpacity=".03"/>
        </radialGradient>
        <filter id="lg" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b"/>
          <feFlood floodColor="#00E676" floodOpacity=".18" result="c"/>
          <feComposite in="c" in2="b" operator="in" result="s"/>
          <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* STEM */}
      <g style={{
        transform: `scaleY(${stemReveal})`,
        transformOrigin: `${cx}px ${stemBase}px`,
        transition: phase === "struggling"
          ? "transform 2s cubic-bezier(0.2,0,0.8,0.2)"
          : "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <path d={`M${cx},${stemBase} C${cx},${stemBase-10} ${cx-0.5},${stemBase-22} ${cx},${stemTop}`}
          stroke="url(#st)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        <path d={`M${cx+1},${stemBase-3} C${cx+1},${stemBase-12} ${cx+0.3},${stemBase-22} ${cx+0.5},${stemTop+5}`}
          stroke="rgba(165,214,167,.3)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      </g>

      {/* FOUR PHOTOREALISTIC LEAVES — welded at hub, never detach */}
      <g filter="url(#lg)" style={{
        opacity: leafReveal,
        transform: `scale(${leafReveal})`,
        transformOrigin: `${cx}px ${hub}px`,
        transition: bursting
          ? "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        {/* LEAF 1: TOP-RIGHT (like reference: ~1 o'clock) */}
        <g transform={`translate(${cx},${hub}) rotate(-10)`}>
          <path d={leafOuter} fill="url(#lf)" stroke="#145214" strokeWidth=".5"/>
          <path d={leafOuter} fill="url(#ls)"/>
          <path d={leafOuter} fill="url(#le)"/>
          <path d={leafOuter} fill="url(#lp)"/>
          <path d="M28,-42 C31,-44 34,-44 37,-42" stroke="#1B5E20" strokeWidth=".7" fill="none"/>
          <Veins/>
          <DewDrop x={18} y={-20} rx={2.2} ry={2.8} op={0.65}/>
          <DewDrop x={30} y={-30} rx={1.5} ry={1.8} op={0.5}/>
          <DewDrop x={12} y={-32} rx={1.2} ry={1.4} op={0.4}/>
        </g>

        {/* LEAF 2: TOP-LEFT (mirror, ~11 o'clock) */}
        <g transform={`translate(${cx},${hub}) rotate(-10) scale(-1,1)`}>
          <path d={leafOuter} fill="url(#lf)" stroke="#145214" strokeWidth=".5"/>
          <path d={leafOuter} fill="url(#ls)"/>
          <path d={leafOuter} fill="url(#le)"/>
          <path d={leafOuter} fill="url(#lp)"/>
          <path d="M28,-42 C31,-44 34,-44 37,-42" stroke="#1B5E20" strokeWidth=".7" fill="none"/>
          <Veins/>
          <DewDrop x={22} y={-24} rx={2} ry={2.5} op={0.55}/>
          <DewDrop x={14} y={-14} rx={1.3} ry={1.6} op={0.4}/>
          <DewDrop x={34} y={-34} rx={1.1} ry={1.3} op={0.35}/>
        </g>

        {/* LEAF 3: BOTTOM-RIGHT (~5 o'clock) */}
        <g transform={`translate(${cx},${hub}) rotate(170)`}>
          <path d={leafOuter} fill="url(#lf)" stroke="#145214" strokeWidth=".5"/>
          <path d={leafOuter} fill="url(#ls)"/>
          <path d={leafOuter} fill="url(#le)"/>
          <path d={leafOuter} fill="url(#lp)"/>
          <path d="M28,-42 C31,-44 34,-44 37,-42" stroke="#1B5E20" strokeWidth=".7" fill="none"/>
          <Veins/>
          <DewDrop x={20} y={-22} rx={1.8} ry={2.2} op={0.5}/>
          <DewDrop x={32} y={-32} rx={1.2} ry={1.5} op={0.35}/>
        </g>

        {/* LEAF 4: BOTTOM-LEFT (mirror, ~7 o'clock) */}
        <g transform={`translate(${cx},${hub}) rotate(170) scale(-1,1)`}>
          <path d={leafOuter} fill="url(#lf)" stroke="#145214" strokeWidth=".5"/>
          <path d={leafOuter} fill="url(#ls)"/>
          <path d={leafOuter} fill="url(#le)"/>
          <path d={leafOuter} fill="url(#lp)"/>
          <path d="M28,-42 C31,-44 34,-44 37,-42" stroke="#1B5E20" strokeWidth=".7" fill="none"/>
          <Veins/>
          <DewDrop x={16} y={-18} rx={2} ry={2.4} op={0.55}/>
          <DewDrop x={28} y={-28} rx={1.3} ry={1.6} op={0.38}/>
        </g>

        {/* Center hub — where stem meets all 4 leaves */}
        <circle cx={cx} cy={hub} r="4" fill="#2E7D32" stroke="#1B5E20" strokeWidth=".6"/>
        <circle cx={cx} cy={hub} r="2.5" fill="#388E3C"/>
        <circle cx={cx-0.5} cy={hub-0.5} r="1" fill="rgba(165,214,167,.35)"/>
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════
// HEADER LOGO — EDEN with full bloom clover on the E + REALISM ENGINE below
// For internal pages (sidebar, top nav)
// ═══════════════════════════════════════════
function EdenHeaderLogo({ size = "md", onClick }) {
  const s = size === "sm" ? 0.55 : size === "lg" ? 1.4 : 1.0;
  const fontSize = Math.round(38 * s);
  const subSize = Math.round(9 * s);
  const cloverH = Math.round(32 * s);

  // Static full-bloom clover — matches landing page style
  const MiniClover = () => {
    const w = cloverH;
    const h = cloverH;
    const cx = w / 2;
    const stemBase = h * 0.95;
    const stemTop = h * 0.55;
    const hub = stemTop - 1;
    const leaf = "M0,0 C-0.5,-2.5 1,-7 3,-11 C5,-13.5 7.5,-15 10,-14.5 C12,-13.5 12.5,-11 12,-8 C11.5,-5.5 8.5,-2 5,-0.8 C2.5,0 0.5,0 0,0 Z";
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", filter: "drop-shadow(0 0 6px rgba(0,230,118,.25))" }}>
        <defs>
          <radialGradient id="hlf" cx="30%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#7bc67a" stopOpacity=".95"/>
            <stop offset="25%" stopColor="#43A047"/>
            <stop offset="55%" stopColor="#2E7D32"/>
            <stop offset="100%" stopColor="#1B5E20"/>
          </radialGradient>
          <linearGradient id="hst" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#1B5E20"/>
            <stop offset="100%" stopColor="#43A047"/>
          </linearGradient>
        </defs>
        {/* Stem */}
        <path d={`M${cx},${stemBase} C${cx},${stemBase*0.82} ${cx},${stemTop+2} ${cx},${stemTop}`}
          stroke="url(#hst)" strokeWidth={Math.max(1.5, 2*s)} fill="none" strokeLinecap="round"/>
        {/* 4 leaves at cardinal angles like landing page */}
        <g transform={`translate(${cx},${hub}) rotate(-10)`}><path d={leaf} fill="url(#hlf)" stroke="#145214" strokeWidth=".3"/></g>
        <g transform={`translate(${cx},${hub}) rotate(-10) scale(-1,1)`}><path d={leaf} fill="url(#hlf)" stroke="#145214" strokeWidth=".3"/></g>
        <g transform={`translate(${cx},${hub}) rotate(170)`}><path d={leaf} fill="url(#hlf)" stroke="#145214" strokeWidth=".3"/></g>
        <g transform={`translate(${cx},${hub}) rotate(170) scale(-1,1)`}><path d={leaf} fill="url(#hlf)" stroke="#145214" strokeWidth=".3"/></g>
        {/* Hub */}
        <circle cx={cx} cy={hub} r={Math.max(1.5, 2*s)} fill="#2E7D32"/>
        <circle cx={cx} cy={hub} r={Math.max(0.8, 1.2*s)} fill="#388E3C"/>
      </svg>
    );
  };

  const goldGrad = "linear-gradient(135deg,#8B6914 0%,#C5B358 15%,#F5E6A3 30%,#D4AF37 45%,#C5B358 55%,#F5E6A3 65%,#D4AF37 80%,#8B6914 100%)";

  return (
    <div onClick={onClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: onClick ? "pointer" : "default", userSelect: "none" }}>
      {/* EDEN word with clover sprouting from top of the center E */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <span style={{
          fontSize,
          fontWeight: 900,
          letterSpacing: Math.round(8 * s),
          fontFamily: "'Cinzel Decorative','Cinzel',serif",
          background: goldGrad,
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}>EDEN</span>
        {/* Clover positioned on top of the second E — matches landing page layout */}
        <div style={{
          position: "absolute",
          top: -cloverH + Math.round(4 * s),
          left: "50%",
          marginLeft: Math.round(4 * s),
          pointerEvents: "none",
        }}>
          <MiniClover />
        </div>
      </div>
      {/* REALISM ENGINE — directly below */}
      <span style={{
        fontSize: subSize,
        fontWeight: 500,
        letterSpacing: Math.round(4 * s),
        fontFamily: "'Cormorant Garamond',serif",
        color: "rgba(197,179,88,.55)",
        textTransform: "uppercase",
        marginTop: Math.round(2 * s),
      }}>Realism Engine</span>
    </div>
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

        @keyframes twinkle { 0%,100%{opacity:.2}50%{opacity:.75} }
        @keyframes slow-drift { 0%{transform:translate(0,0);opacity:0}5%{opacity:.5}25%{opacity:.35}50%{transform:translate(15px,8px);opacity:.55}75%{opacity:.3}95%{opacity:.45}100%{transform:translate(30px,15px);opacity:0} }
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

        .twinkle-star { position:absolute;border-radius:50%;animation:twinkle ease-in-out infinite;pointer-events:none; }
        .slow-drift-star { position:absolute;width:2px;height:2px;border-radius:50%;background:radial-gradient(circle,rgba(245,230,163,.8),rgba(212,175,55,.3),transparent);animation:slow-drift linear infinite;pointer-events:none; }
        .slow-drift-star::before { content:'';position:absolute;left:-1px;top:-1px;width:4px;height:4px;border-radius:50%;background:radial-gradient(circle,rgba(255,248,220,.6),transparent);}
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

  // ═══ GROWTH — 3 size doublings, every 3 seconds, then stops ═══
  const [growthBursts, setGrowthBursts] = useState(0);
  useEffect(() => {
    if (!["bloomed","growing"].includes(cloverPhase)) return;
    if (growthBursts >= 3) return;

    const interval = setInterval(() => {
      setGrowthBursts(prev => {
        if (prev >= 3) { clearInterval(interval); return prev; }
        setGrowthProgress(p => p + (p < 0.1 ? 0.5 : p * 1.0)); // double
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [cloverPhase, growthBursts]);

  // ═══ GENTLE ROCKING BREEZE — slow, visible sway like wind blowing ═══
  useEffect(() => {
    if (cloverPhase === "dormant") return;
    let frame;
    let start = Date.now();
    const animate = () => {
      const t = (Date.now() - start) / 1000;
      // Slow primary sway + subtle secondary wobble
      const sway = Math.sin(t * 0.3) * 4.0
        + Math.sin(t * 0.55 + 0.8) * 2.0
        + Math.sin(t * 0.9 + 2.1) * 0.8;
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
      {/* Static twinkling stars — no movement, just gentle opacity pulse */}
      {Array.from({ length: 28 }).map((_, i) => <div key={`t${i}`} className="twinkle-star" style={{ top: `${3+Math.random()*75}%`, left: `${2+Math.random()*96}%`, width: `${1+Math.random()*2}px`, height: `${1+Math.random()*2}px`, background: `radial-gradient(circle,rgba(212,175,55,${.4+Math.random()*.5}),transparent)`, animationDuration: `${3+Math.random()*5}s`, animationDelay: `${Math.random()*6}s` }} />)}
      {Array.from({ length: 8 }).map((_, i) => <div key={`tg${i}`} className="twinkle-star" style={{ top: `${10+Math.random()*60}%`, left: `${15+Math.random()*70}%`, width: `${1+Math.random()*1.5}px`, height: `${1+Math.random()*1.5}px`, background: `radial-gradient(circle,rgba(0,230,118,${.25+Math.random()*.35}),transparent)`, animationDuration: `${4+Math.random()*6}s`, animationDelay: `${Math.random()*8}s` }} />)}

      {/* Near-static drift stars — barely perceptible movement */}
      {Array.from({ length: 6 }).map((_, i) => <div key={`s${i}`} className="slow-drift-star" style={{ top: `${8+Math.random()*55}%`, left: `${5+Math.random()*85}%`, animationDuration: `${200+Math.random()*150}s`, animationDelay: `${Math.random()*50}s`, opacity: 0 }} />)}

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

          {/* ═══ LIVING CLOVER — stem grows from TOP DEAD CENTER of second E ═══ */}
          {/* EDEN = E(0) D(1) E(2) N(3). With 179px font + 44 letter-spacing: */}
          {/* Each char ~135px wide. E2 center ≈ 60% from left of text block */}
          {/* Container bottom edge = where stem base touches the E top */}
          <div className="clover-container" style={{
            position: "absolute",
            top: "-126px",
            left: "60%",
            marginLeft: "-70px",
            width: 140,
            height: 140,
            zIndex: 10,
            pointerEvents: "none",
            transform: `scale(${1.0 + (["bloomed","growing"].includes(cloverPhase) || cloverPhase === "bursting" ? 0.66 : 0) + (Math.min(growthProgress, 1.5) * 0.3)})`,
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
        <div style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => window.location.reload()}><EdenHeaderLogo size="sm" /></div>
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
