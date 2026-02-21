import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// EDEN REALISM ENGINE v5 — COMPLETE PRODUCTION SITE
// Every feature from Gradio backend → Premium Next.js Frontend
// Landing · Studio · The Producer · The Artist
// Built by Beryl AI Labs / The Eden Project
// ═══════════════════════════════════════════════════════════════════════════

const GRADIO_API = "https://aibruh-eden-diffusion-studio.hf.space";

// ─── Design Tokens ───
const G = { dark: "#8B6914", base: "#C5B358", light: "#D4AF37", bright: "#F5E6A3", accent: "#8B7355", deep: "#6B4F0A" };
const S = { black: "#050302", d1: "#0a0604", d2: "#0d0906", d3: "#151008", d4: "#1a140a", d5: "#221a0e", border: "#2a1f12", bL: "#3a2d18" };
const F = { display: "'Cinzel Decorative', 'Cinzel', serif", head: "'Cinzel', serif", body: "'Cormorant Garamond', serif", mono: "'DM Mono', monospace" };

const PRESETS = {
  "Hyperreal": { cfg: 7.5, steps: 50 }, "Cinematic": { cfg: 6, steps: 40 },
  "Kling Max": { cfg: 8, steps: 60 }, "Skin Perfect": { cfg: 7, steps: 45 },
  "Portrait": { cfg: 5.5, steps: 35 }, "Natural": { cfg: 4.5, steps: 30 },
};

// ─── Global Styles (injected once) ───
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:${S.black};color:#e0e0e0;overflow-x:hidden}
::-webkit-scrollbar{width:6px;background:${S.d1}}
::-webkit-scrollbar-thumb{background:${G.dark};border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:${G.base}}
@keyframes metal-gleam{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes breathe{0%,100%{filter:drop-shadow(0 0 15px rgba(197,179,88,0.2))}50%{filter:drop-shadow(0 0 30px rgba(212,175,55,0.5))}}
@keyframes float-p{0%,100%{transform:translateY(0);opacity:0}10%{opacity:0.8}90%{opacity:0.8}100%{transform:translateY(-100vh);opacity:0}}
@keyframes pulse-green{0%,100%{box-shadow:0 4px 15px rgba(16,185,129,0.3)}50%{box-shadow:0 4px 25px rgba(16,185,129,0.6)}}
@keyframes fade-up{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
textarea:focus,input:focus,select:focus{outline:none;border-color:${G.base}!important;box-shadow:0 0 0 3px rgba(197,179,88,0.15)!important}
`;

// ─── Primitives ───
function GoldText({ children, size = 32, weight = 700, spacing = 2, font, tag = "span", style = {} }) {
  const Tag = tag;
  return <Tag style={{ fontSize: size, fontWeight: weight, letterSpacing: spacing, fontFamily: font || F.head, background: `linear-gradient(135deg, ${G.dark} 0%, ${G.base} 18%, ${G.bright} 38%, ${G.light} 52%, ${G.base} 68%, ${G.bright} 82%, ${G.dark} 100%)`, backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "metal-gleam 8s linear infinite", filter: `drop-shadow(0 1px 3px rgba(139,105,20,0.35))`, lineHeight: 1.2, ...style }}>{children}</Tag>;
}

function Divider({ w = 240, my = 16 }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", margin: `${my}px 0` }}>
    <div style={{ width: w * 0.4, height: 1, background: `linear-gradient(90deg, transparent, ${G.base})` }} />
    <div style={{ width: 6, height: 6, transform: "rotate(45deg)", background: `linear-gradient(135deg, ${G.light}, ${G.dark})`, boxShadow: `0 0 8px rgba(212,175,55,0.25)` }} />
    <div style={{ width: w * 0.4, height: 1, background: `linear-gradient(90deg, ${G.base}, transparent)` }} />
  </div>;
}

function Btn({ children, onClick, primary = true, sm, full, icon, disabled, style = {} }) {
  const [h, setH] = useState(false);
  return <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onClick} disabled={disabled}
    style={{ padding: sm ? "8px 18px" : "14px 32px", borderRadius: 8, cursor: disabled ? "wait" : "pointer", fontSize: sm ? 10 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: F.head, transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", border: primary ? "none" : `1px solid ${h ? G.base : S.bL}`, background: primary ? (h ? `linear-gradient(135deg,${G.light},${G.base})` : `linear-gradient(135deg,${G.base},${G.dark})`) : h ? `rgba(197,179,88,0.08)` : "transparent", color: primary ? S.black : h ? G.bright : G.base, boxShadow: primary ? (h ? `0 6px 24px rgba(197,179,88,0.45)` : `0 3px 16px rgba(197,179,88,0.25)`) : "none", transform: h && !disabled ? "translateY(-1px)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, ...style }}>{icon && <span>{icon}</span>}{children}</button>;
}

function Input({ label, value, onChange, placeholder, rows, type = "text", mono, style = {} }) {
  const base = { width: "100%", padding: rows ? 14 : "10px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d1, color: G.bright, fontSize: 13, fontFamily: mono ? F.mono : F.body, lineHeight: 1.7, resize: rows ? "vertical" : "none", boxSizing: "border-box", transition: "border-color 0.3s, box-shadow 0.3s", ...style };
  return <div style={{ marginBottom: 12 }}>
    {label && <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>{label}</label>}
    {rows ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={base} />
      : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />}
  </div>;
}

function Slider({ label, value, onChange, min, max, step = 1, suffix = "" }) {
  const pct = ((value - min) / (max - min)) * 100;
  return <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <span style={{ fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: G.base, fontFamily: F.mono, background: S.d4, padding: "1px 8px", borderRadius: 4 }}>{value}{suffix}</span>
    </div>
    <div style={{ position: "relative", height: 5, borderRadius: 3, background: S.d4 }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, borderRadius: 3, background: `linear-gradient(90deg, ${G.dark}, ${G.base})` }} />
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ position: "absolute", top: -8, left: 0, width: "100%", height: 20, opacity: 0, cursor: "pointer" }} />
    </div>
  </div>;
}

function Toggle({ checked, onChange, label }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => onChange(!checked)}>
    <div style={{ width: 34, height: 18, borderRadius: 9, transition: "all 0.3s", background: checked ? `linear-gradient(135deg,${G.base},${G.dark})` : S.d4, display: "flex", alignItems: "center", padding: 2 }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "transform 0.3s", transform: checked ? "translateX(16px)" : "translateX(0)" }} />
    </div>
    <span style={{ fontSize: 11, color: checked ? G.base : G.accent, fontWeight: 500, fontFamily: F.head }}>{label}</span>
  </div>;
}

function PresetBar({ choices, value, onChange }) {
  return <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
    {choices.map(c => <button key={c} onClick={() => onChange(c)} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 10, fontWeight: 700, fontFamily: F.head, cursor: "pointer", border: "none", transition: "all 0.3s", letterSpacing: 1, background: value === c ? `linear-gradient(135deg,${G.base},${G.dark})` : S.d4, color: value === c ? S.black : G.accent }}>{c}</button>)}
  </div>;
}

function Card({ children, style = {}, glow }) {
  return <div style={{ borderRadius: 14, border: `1px solid ${glow ? G.dark : S.border}`, background: glow ? `linear-gradient(135deg, rgba(197,179,88,0.03), ${S.d2})` : S.d2, padding: 20, ...style }}>{children}</div>;
}

function Badge({ label }) {
  return <div style={{ display: "inline-flex", padding: "5px 16px", borderRadius: 16, border: `1px solid rgba(197,179,88,0.2)`, background: "rgba(197,179,88,0.04)", fontSize: 9, letterSpacing: 3, fontFamily: F.head, color: G.accent, textTransform: "uppercase", marginBottom: 20 }}>{label}</div>;
}

function SectionHead({ label }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: G.base, fontFamily: F.head, letterSpacing: 2, textTransform: "uppercase", paddingBottom: 10, borderBottom: `2px solid ${S.border}`, marginBottom: 16 }}>◈ {label}</div>;
}

function DropZone({ onFile, preview, label, h = 140 }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const handle = e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0]; if (f) onFile(f); };
  return <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={handle} onClick={() => ref.current?.click()} style={{ height: h, borderRadius: 10, cursor: "pointer", transition: "all 0.2s", border: drag ? `2px solid ${G.base}` : `2px dashed ${S.bL}`, background: drag ? "rgba(197,179,88,0.04)" : S.d1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, overflow: "hidden", position: "relative" }}>
    {preview ? <img src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <>
      <span style={{ fontSize: 22, color: G.accent }}>⬆</span>
      <span style={{ fontSize: 11, color: G.accent }}>{label || "Drop / Click to Upload"}</span>
    </>}
    <input ref={ref} type="file" accept="image/*,video/*" onChange={handle} style={{ display: "none" }} />
  </div>;
}

function Particles({ n = 20 }) {
  return <>{Array.from({ length: n }).map((_, i) => <div key={i} style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", width: `${1 + Math.random() * 2.5}px`, height: `${1 + Math.random() * 2.5}px`, left: `${Math.random() * 100}%`, bottom: `-${Math.random() * 10}%`, background: `radial-gradient(circle, rgba(212,175,55,0.6), transparent)`, animation: `float-p ${8 + Math.random() * 14}s linear infinite`, animationDelay: `${Math.random() * 10}s` }} />)}</>;
}

// ─── GPU Status Bar ───
function GPUBar() {
  return <div style={{ display: "flex", gap: 10, padding: "12px 20px", borderBottom: `1px solid ${S.border}`, background: S.d1 }}>
    <div style={{ flex: 1, background: `linear-gradient(135deg, ${G.base}, ${G.dark})`, borderRadius: 8, padding: "10px 14px", textAlign: "center", border: `1px solid ${G.accent}` }}>
      <div style={{ fontWeight: 800, color: S.black, fontSize: 11, letterSpacing: 1, fontFamily: F.head }}>🚀 PAID GPU ACTIVE</div>
      <div style={{ fontSize: 10, color: S.d3, marginTop: 2 }}>A10G · $0.45/hr</div>
    </div>
    <div style={{ flex: 1, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 8, padding: "10px 14px", textAlign: "center", animation: "pulse-green 2s ease-in-out infinite" }}>
      <div style={{ fontWeight: 800, color: "#fff", fontSize: 11, letterSpacing: 1, fontFamily: F.head }}>● LIVE SESSION</div>
      <div style={{ fontSize: 10, color: "#a7f3d0", marginTop: 2 }}>GPU Online · Ready</div>
    </div>
    <div style={{ flex: 1, background: S.d3, borderRadius: 8, padding: "10px 14px", textAlign: "center", border: `1px solid ${S.border}` }}>
      <div style={{ fontWeight: 700, color: G.base, fontSize: 11, letterSpacing: 1, fontFamily: F.head }}>💰 SESSION COST</div>
      <div style={{ fontSize: 10, color: G.accent, marginTop: 2 }}>$2.70 est (6hr)</div>
    </div>
  </div>;
}

// ─── Navigation ───
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 30); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const links = [
    { id: "landing", label: "Home" }, { id: "studio", label: "Studio" },
    { id: "producer", label: "The Producer" }, { id: "artist", label: "The Artist" },
  ];
  return <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, padding: scrolled ? "8px 30px" : "14px 30px", background: scrolled ? "rgba(5,3,2,0.94)" : "rgba(5,3,2,0.6)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${scrolled ? S.border : "transparent"}`, transition: "all 0.4s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("landing")}>
      <div style={{ width: 32, height: 32, borderRadius: 7, background: `linear-gradient(135deg,${G.base},${G.dark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: S.black, fontFamily: F.display }}>E</div>
      <GoldText size={12} weight={700} spacing={3}>EDEN</GoldText>
    </div>
    <div style={{ display: "flex", gap: 4 }}>
      {links.map(l => <button key={l.id} onClick={() => setPage(l.id)} style={{ padding: "7px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: F.head, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", transition: "all 0.3s", background: page === l.id ? `rgba(197,179,88,0.12)` : "transparent", color: page === l.id ? G.base : G.accent }}>{l.label}</button>)}
    </div>
    <Btn sm primary={false} onClick={() => setPage("studio")}>Launch Studio</Btn>
  </nav>;
}

// ═══════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════
function Landing({ go }) {
  const [m, setM] = useState(false);
  useEffect(() => { setTimeout(() => setM(true), 200); }, []);
  return <div style={{ minHeight: "100vh" }}>
    <section style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 50% 35%, rgba(139,105,20,0.07) 0%, transparent 60%), ${S.black}` }}>
      <Particles n={30} />
      {/* SVG Logo */}
      <svg width="90" height="90" viewBox="0 0 120 120" style={{ opacity: m ? 1 : 0, transform: m ? "scale(1)" : "scale(0.85)", transition: "all 1s cubic-bezier(0.16,1,0.3,1)", marginBottom: 20, animation: m ? "breathe 6s ease-in-out infinite" : "none" }}>
        <defs><linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={G.dark} /><stop offset="25%" stopColor={G.base} /><stop offset="50%" stopColor={G.bright} /><stop offset="75%" stopColor={G.light} /><stop offset="100%" stopColor={G.dark} /></linearGradient></defs>
        <polygon points="60,12 100,35 100,85 60,108 20,85 20,35" fill="none" stroke="url(#mg)" strokeWidth="2" />
        <path d="M38,35 L82,35" stroke="url(#mg)" strokeWidth="4" strokeLinecap="round" />
        <path d="M38,60 L76,60" stroke="url(#mg)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M38,85 L82,85" stroke="url(#mg)" strokeWidth="4" strokeLinecap="round" />
        <path d="M38,35 L38,85" stroke="url(#mg)" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <Divider w={320} my={6} />
      <GoldText size={76} weight={900} spacing={18} font={F.display} tag="h1">EDEN</GoldText>
      <GoldText size={22} weight={600} spacing={12} tag="h2" style={{ marginTop: 4 }}>Realism Engine</GoldText>
      <Divider w={320} my={14} />
      <p style={{ fontSize: 13, letterSpacing: 5, color: G.accent, fontFamily: F.head, textTransform: "uppercase", textAlign: "center", marginBottom: 36, opacity: m ? 1 : 0, transition: "opacity 1s ease 0.6s" }}>Where AI Crosses the Uncanny Valley</p>
      <div style={{ display: "flex", gap: 14 }}>
        <Btn onClick={() => go("studio")} icon="🔱">Enter Studio</Btn>
        <Btn onClick={() => go("producer")} primary={false} icon="🎬">The Producer</Btn>
        <Btn onClick={() => go("artist")} primary={false} icon="🎨">The Artist</Btn>
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: "100px 50px", background: `linear-gradient(180deg, ${S.black}, ${S.d1})` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <Badge label="Three Engines" />
        <GoldText size={36} spacing={4} tag="h3" style={{ marginBottom: 50 }}>One Platform. Infinite Creation.</GoldText>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { icon: "🔱", title: "The Studio", desc: "CogView4 image generation, LTX-Video animation, stitching timeline, 4D avatars, RAKE uncensoring — all your Gradio tools with a premium interface." },
            { icon: "🎬", title: "The Producer", desc: "Script to screen. Upload a screenplay or novel chapter — Eden decomposes it into storyboards, generates 30s clips, and chains them into a complete film." },
            { icon: "🎨", title: "The Artist", desc: "Design to deployment. Generate landing pages, product shoots, real estate staging — then auto-build the frontend code with Claude Code." },
          ].map((f, i) => <Card key={i} style={{ flex: "1 1 300px", maxWidth: 340, textAlign: "left", animation: `fade-up 0.7s ease-out forwards`, animationDelay: `${0.1 + i * 0.15}s`, opacity: 0 }}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 14 }}>{f.icon}</span>
            <GoldText size={16} spacing={2} style={{ display: "block", marginBottom: 10 }}>{f.title}</GoldText>
            <p style={{ fontSize: 13, lineHeight: 1.7, fontFamily: F.body, color: G.accent }}>{f.desc}</p>
          </Card>)}
        </div>
      </div>
    </section>

    <footer style={{ padding: "50px 30px 30px", textAlign: "center", borderTop: `1px solid ${S.border}` }}>
      <GoldText size={16} weight={700} spacing={6} font={F.display}>EDEN</GoldText>
      <Divider w={160} my={12} />
      <p style={{ fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 3 }}>Beryl AI Labs · The Eden Project · 2026</p>
    </footer>
  </div>;
}

// ═══════════════════════════════════════════════════════
// STUDIO — ALL GRADIO FEATURES PORTED
// ═══════════════════════════════════════════════════════
function Studio() {
  const [tab, setTab] = useState("videos");
  const tabs = [
    { id: "videos", icon: "🎬", label: "Videos" }, { id: "images", icon: "🖼", label: "Images" },
    { id: "garden", icon: "🌿", label: "The Garden" }, { id: "film", icon: "🎞", label: "Film Room" },
    { id: "hf", icon: "🤗", label: "HuggingFace" }, { id: "settings", icon: "⚙", label: "Settings" },
  ];
  return <div style={{ paddingTop: 56 }}>
    <GPUBar />
    {/* Sub-nav */}
    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${S.border}`, background: S.d1, padding: "0 16px" }}>
      {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "12px 20px", border: "none", cursor: "pointer", fontSize: 11, fontWeight: tab === t.id ? 700 : 400, fontFamily: F.head, letterSpacing: 1.5, transition: "all 0.3s", background: "transparent", color: tab === t.id ? G.base : G.accent, borderBottom: tab === t.id ? `2px solid ${G.base}` : "2px solid transparent" }}>{t.icon} {t.label}</button>)}
    </div>
    <div style={{ minHeight: "calc(100vh - 150px)" }}>
      {tab === "videos" && <VideosTab />}
      {tab === "images" && <ImagesTab />}
      {tab === "garden" && <GardenTab />}
      {tab === "film" && <FilmTab />}
      {tab === "hf" && <HFTab />}
      {tab === "settings" && <SettingsTab />}
    </div>
  </div>;
}

// ─── Videos Tab ───
function VideosTab() {
  const [sub, setSub] = useState("generate");
  const [prompt, setPrompt] = useState("");
  const [preset, setPreset] = useState("Skin Perfect");
  const [cfg, setCfg] = useState(7.5); const [steps, setSteps] = useState(40);
  const [frames, setFrames] = useState(97); const [fps, setFps] = useState(24);
  const [chatMsg, setChatMsg] = useState(""); const [chatHist, setChatHist] = useState([]);
  const [gen, setGen] = useState(false);
  const [urlInput, setUrlInput] = useState(""); const [urlMin, setUrlMin] = useState(0);
  const [stFps, setStFps] = useState(24);

  return <div style={{ display: "flex", flexDirection: "column" }}>
    {/* Sub-tabs */}
    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${S.border}`, background: S.d2, padding: "0 16px" }}>
      {[{ id: "generate", l: "🎬 Generate" }, { id: "url", l: "🔗 URL to Video" }, { id: "stitch", l: "⏱ Stitch Timeline" }].map(t =>
        <button key={t.id} onClick={() => setSub(t.id)} style={{ padding: "10px 18px", border: "none", cursor: "pointer", fontSize: 11, fontFamily: F.head, background: "transparent", color: sub === t.id ? G.base : G.accent, borderBottom: sub === t.id ? `2px solid ${G.light}` : "2px solid transparent", fontWeight: sub === t.id ? 700 : 400, letterSpacing: 1 }}>{t.l}</button>
      )}
    </div>

    {sub === "generate" && <div style={{ display: "flex", minHeight: "calc(100vh - 220px)" }}>
      {/* Controls */}
      <div style={{ width: 420, minWidth: 420, borderRight: `1px solid ${S.border}`, padding: 20, overflowY: "auto", background: S.d1 }}>
        <SectionHead label="Eden Video Studio" />
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Btn full sm icon="🖼">Eden Images</Btn>
          <Btn full sm primary={false} icon="🎬">Eden Videos</Btn>
        </div>
        <Input label="Vision Prompt" value={prompt} onChange={setPrompt} placeholder="Beautiful cinematic scene description..." rows={4} />
        <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Preset</label>
        <PresetBar choices={Object.keys(PRESETS)} value={preset} onChange={p => { setPreset(p); setCfg(PRESETS[p].cfg); setSteps(PRESETS[p].steps); }} />
        <details style={{ marginBottom: 14 }}>
          <summary style={{ fontSize: 11, color: G.accent, cursor: "pointer", fontFamily: F.head, letterSpacing: 1, fontWeight: 600, padding: "8px 0" }}>⚙ Advanced Controls</summary>
          <div style={{ padding: "10px 0" }}>
            <Slider label="CFG Scale" value={cfg} onChange={setCfg} min={1} max={20} step={0.5} />
            <Slider label="Steps" value={steps} onChange={setSteps} min={10} max={80} />
            <Slider label="Frames" value={frames} onChange={setFrames} min={9} max={257} step={8} />
            <Slider label="FPS" value={fps} onChange={setFps} min={12} max={60} />
          </div>
        </details>
        <Btn full onClick={() => { setGen(true); setTimeout(() => setGen(false), 3000); }} disabled={gen} icon="🔱">{gen ? "Generating..." : "Generate Video"}</Btn>
      </div>
      {/* Preview + Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: S.d2 }}>
        <div style={{ padding: 20, flex: 1 }}>
          <SectionHead label="Video Preview" />
          <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 12, background: S.black, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${S.border}`, marginBottom: 16 }}>
            {gen ? <div style={{ animation: "spin 1.5s linear infinite", width: 32, height: 32, border: `3px solid ${G.base}`, borderTopColor: "transparent", borderRadius: "50%" }} /> : <span style={{ color: S.bL, fontSize: 13 }}>Generated video appears here</span>}
          </div>
        </div>
        {/* Chat */}
        <div style={{ borderTop: `1px solid ${S.border}`, padding: 16, background: S.d3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <GoldText size={11} spacing={1}>Eden AI Assistant</GoldText>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: "rgba(45,154,92,0.15)", color: "#2d9a5c", fontFamily: F.mono }}>Kimi 2.5</span>
          </div>
          <div style={{ height: 140, overflowY: "auto", background: S.d1, borderRadius: 8, padding: 12, marginBottom: 10, border: `1px solid ${S.border}` }}>
            {chatHist.length === 0 && <span style={{ fontSize: 11, color: S.bL }}>Ask about the video, improve prompts, or get creative direction...</span>}
            {chatHist.map((m, i) => <div key={i} style={{ marginBottom: 8, textAlign: m.role === "user" ? "right" : "left" }}>
              <span style={{ display: "inline-block", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontFamily: F.body, maxWidth: "80%", background: m.role === "user" ? `linear-gradient(135deg,${G.base},${G.dark})` : S.d4, color: m.role === "user" ? S.black : G.bright }}>{m.text}</span>
            </div>)}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Input value={chatMsg} onChange={setChatMsg} placeholder="Ask about the video..." style={{ flex: 1, marginBottom: 0 }} />
            <Btn sm onClick={() => { if (chatMsg.trim()) { setChatHist([...chatHist, { role: "user", text: chatMsg }]); setChatMsg(""); } }}>Send</Btn>
          </div>
        </div>
      </div>
    </div>}

    {sub === "url" && <div style={{ maxWidth: 700, margin: "0 auto", padding: 30 }}>
      <SectionHead label="Download from URL" />
      <Input label="Video URL" value={urlInput} onChange={setUrlInput} placeholder="https://youtube.com/watch?v=... or any direct video URL" />
      <div style={{ display: "flex", gap: 12 }}>
        <Input label="Start Minute" value={urlMin} onChange={v => setUrlMin(Number(v))} type="number" style={{ width: 120 }} />
        <Input label="Start Second" value={0} onChange={() => {}} type="number" style={{ width: 120 }} />
      </div>
      <Btn full icon="⬇">Download Video</Btn>
    </div>}

    {sub === "stitch" && <div style={{ maxWidth: 700, margin: "0 auto", padding: 30 }}>
      <SectionHead label="Chain Clips → 30 Min Output" />
      <DropZone label="Upload video clips (.mp4, .webm)" h={160} onFile={() => {}} />
      <div style={{ marginTop: 16 }}><Slider label="Output FPS" value={stFps} onChange={setStFps} min={12} max={60} /></div>
      <Btn full icon="🔱">Stitch</Btn>
    </div>}
  </div>;
}

// ─── Images Tab (CogView4) ───
function ImagesTab() {
  const [sub, setSub] = useState("keyframes");
  const [prompt, setPrompt] = useState(""); const [neg, setNeg] = useState("");
  const [preset, setPreset] = useState("Skin Perfect");
  const [cfg, setCfg] = useState(0); const [steps, setSteps] = useState(0);
  const [w, setW] = useState(1024); const [h, setH] = useState(1024);
  const [num, setNum] = useState(4); const [seed, setSeed] = useState(0);
  const [rand, setRand] = useState(true); const [real, setReal] = useState(true); const [skin, setSkin] = useState(true);
  const [refImg, setRefImg] = useState(null); const [refPrev, setRefPrev] = useState(null); const [refStr, setRefStr] = useState(0);
  const [i2iStr, setI2iStr] = useState(0.7);

  return <div style={{ display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${S.border}`, background: S.d2, padding: "0 16px" }}>
      {[{ id: "keyframes", l: "🖼 CogView4 Keyframes" }, { id: "i2i", l: "🎨 Image2Image" }].map(t =>
        <button key={t.id} onClick={() => setSub(t.id)} style={{ padding: "10px 18px", border: "none", cursor: "pointer", fontSize: 11, fontFamily: F.head, background: "transparent", color: sub === t.id ? G.base : G.accent, borderBottom: sub === t.id ? `2px solid ${G.light}` : "2px solid transparent", fontWeight: sub === t.id ? 700 : 400, letterSpacing: 1 }}>{t.l}</button>
      )}
    </div>

    {sub === "keyframes" && <div style={{ display: "flex", minHeight: "calc(100vh - 220px)" }}>
      <div style={{ width: 420, minWidth: 420, borderRight: `1px solid ${S.border}`, padding: 20, overflowY: "auto", background: S.d1 }}>
        <SectionHead label="GLM-4 Powered Keyframe Studio" />
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Btn full sm icon="🖼">Eden Images</Btn>
          <Btn full sm primary={false} icon="🎬">Eden Videos</Btn>
        </div>
        <Input label="Vision Prompt" value={prompt} onChange={setPrompt} placeholder="Beautiful African American goddess walking on beach, two-piece swimsuit, golden hour..." rows={3} />

        {/* Reference Image */}
        <details style={{ marginBottom: 14 }}>
          <summary style={{ fontSize: 11, color: G.accent, cursor: "pointer", fontFamily: F.head, letterSpacing: 1, fontWeight: 600, padding: "8px 0" }}>📎 Context Reference Image (Character Consistency)</summary>
          <div style={{ padding: "10px 0" }}>
            <p style={{ fontSize: 11, color: G.accent, fontFamily: F.body, marginBottom: 10 }}>Upload a reference image to maintain character consistency across generations</p>
            <DropZone onFile={f => { setRefImg(f); setRefPrev(URL.createObjectURL(f)); }} preview={refPrev} label="Reference Image" h={120} />
            <div style={{ marginTop: 10 }}><Slider label="Reference Influence (0=ignore, 1=strict)" value={refStr} onChange={setRefStr} min={0} max={1} step={0.05} /></div>
          </div>
        </details>

        <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Eden Preset</label>
        <PresetBar choices={Object.keys(PRESETS)} value={preset} onChange={setPreset} />

        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
          <Toggle checked={real} onChange={setReal} label="Realism+" />
          <Toggle checked={skin} onChange={setSkin} label="Skin+" />
        </div>

        <details style={{ marginBottom: 14 }}>
          <summary style={{ fontSize: 11, color: G.accent, cursor: "pointer", fontFamily: F.head, letterSpacing: 1, fontWeight: 600, padding: "8px 0" }}>⚙ Controls</summary>
          <div style={{ padding: "10px 0" }}>
            <Slider label="CFG (0=preset)" value={cfg} onChange={setCfg} min={1} max={20} step={0.5} />
            <Slider label="Steps (0=preset)" value={steps} onChange={setSteps} min={10} max={80} />
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><Slider label="Width" value={w} onChange={setW} min={512} max={1536} step={64} suffix="px" /></div>
              <div style={{ flex: 1 }}><Slider label="Height" value={h} onChange={setH} min={512} max={1536} step={64} suffix="px" /></div>
            </div>
            <Slider label="Keyframes (batch)" value={num} onChange={setNum} min={1} max={8} />
            <Input label="Negative Prompt (empty=preset)" value={neg} onChange={setNeg} rows={2} />
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}><Input label="Seed" value={seed} onChange={v => setSeed(Number(v))} type="number" /></div>
              <div style={{ marginBottom: 12 }}><Toggle checked={rand} onChange={setRand} label="Random" /></div>
            </div>
          </div>
        </details>
        <Btn full icon="🔱">Generate Keyframes</Btn>
      </div>
      {/* Preview */}
      <div style={{ flex: 1, padding: 20, background: S.d2 }}>
        <SectionHead label="Keyframe Preview" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ aspectRatio: "1", borderRadius: 10, background: S.black, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: S.bL, fontSize: 11, fontFamily: F.mono }}>Keyframe {i + 1}</span>
          </div>)}
        </div>
      </div>
    </div>}

    {sub === "i2i" && <div style={{ maxWidth: 700, margin: "0 auto", padding: 30 }}>
      <SectionHead label="Transform Images" />
      <DropZone onFile={() => {}} label="Source Image" h={200} />
      <Input label="Transformation Prompt" value="" onChange={() => {}} placeholder="Make this cyberpunk style..." />
      <Slider label="Transformation Strength" value={i2iStr} onChange={setI2iStr} min={0.1} max={1} step={0.05} />
      <Btn full icon="🔱">Transform</Btn>
    </div>}
  </div>;
}

// ─── The Garden (4D Avatars) ───
function GardenTab() {
  const [style, setStyle] = useState("Realistic");
  return <div style={{ display: "flex", minHeight: "calc(100vh - 180px)" }}>
    <div style={{ width: 420, minWidth: 420, borderRight: `1px solid ${S.border}`, padding: 20, background: S.d1 }}>
      <SectionHead label="The Garden — 4D Avatar Studio" />
      <DropZone onFile={() => {}} label="Upload Portrait" h={200} />
      <div style={{ marginTop: 16 }}>
        <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Style</label>
        <PresetBar choices={["Realistic", "Stylized", "Anime", "Cyberpunk"]} value={style} onChange={setStyle} />
      </div>
      <Btn full icon="🌿">Generate 4D Avatar</Btn>
    </div>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: S.d2 }}>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 56, display: "block", marginBottom: 16, opacity: 0.2 }}>🌿</span>
        <GoldText size={16} spacing={2}>3D Avatar Preview</GoldText>
        <p style={{ fontSize: 12, color: G.accent, fontFamily: F.body, marginTop: 8 }}>Mesh generation · Expression rigging · Lip sync · Neural rendering</p>
      </div>
    </div>
  </div>;
}

// ─── Film Room ───
function FilmTab() {
  const [format, setFormat] = useState("MP4"); const [quality, setQuality] = useState("1080p");
  const [fade, setFade] = useState(false); const [color, setColor] = useState(false); const [audio, setAudio] = useState(false);
  return <div style={{ maxWidth: 900, margin: "0 auto", padding: 30 }}>
    <SectionHead label="Film Room — Production Suite" />
    <DropZone onFile={() => {}} label="Import Clips (.mp4)" h={140} />
    <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
      <Card style={{ flex: 1 }}>
        <GoldText size={12} spacing={1} style={{ display: "block", marginBottom: 12 }}>Effects</GoldText>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Toggle checked={fade} onChange={setFade} label="Crossfade Transitions" />
          <Toggle checked={color} onChange={setColor} label="Color Grading" />
          <Toggle checked={audio} onChange={setAudio} label="Audio Enhancement" />
        </div>
      </Card>
      <Card style={{ flex: 1 }}>
        <GoldText size={12} spacing={1} style={{ display: "block", marginBottom: 12 }}>Output</GoldText>
        <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Format</label>
        <PresetBar choices={["MP4", "MOV", "WebM"]} value={format} onChange={setFormat} />
        <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Quality</label>
        <PresetBar choices={["4K", "1440p", "1080p", "720p"]} value={quality} onChange={setQuality} />
      </Card>
    </div>
    <div style={{ marginTop: 20 }}><Btn full icon="🎬">Render Production</Btn></div>
  </div>;
}

// ─── HuggingFace Tab ───
function HFTab() {
  const [sub, setSub] = useState("discover");
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("all"); const [sort, setSort] = useState("downloads");
  const [modelId, setModelId] = useState(""); const [localPath, setLocalPath] = useState("");
  const [rakeModel, setRakeModel] = useState(""); const [rakeIntensity, setRakeIntensity] = useState(5);
  const [bitModel, setBitModel] = useState(""); const [bitLevel, setBitLevel] = useState("4 bit");

  return <div>
    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${S.border}`, background: S.d2, padding: "0 16px" }}>
      {[{ id: "discover", l: "🔍 Model Discovery" }, { id: "rake", l: "🔥 RAKE System" }, { id: "bitnet", l: "🗜 BitNet" }].map(t =>
        <button key={t.id} onClick={() => setSub(t.id)} style={{ padding: "10px 18px", border: "none", cursor: "pointer", fontSize: 11, fontFamily: F.head, background: "transparent", color: sub === t.id ? G.base : G.accent, borderBottom: sub === t.id ? `2px solid ${G.light}` : "2px solid transparent", fontWeight: sub === t.id ? 700 : 400, letterSpacing: 1 }}>{t.l}</button>
      )}
    </div>

    {sub === "discover" && <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <SectionHead label="One-Click Model Logistics" />
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 3 }}><Input value={search} onChange={setSearch} placeholder="Search models by name, tags, or description..." /></div>
        <div style={{ flex: 1 }}>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d1, color: G.bright, fontSize: 12 }}>
            {["all", "text-to-image", "image-to-video", "text-to-video", "diffusers", "transformers"].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <Btn icon="🔍">Search</Btn>
      </div>
      {/* Quick pulls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["SDXL", "FLUX", "LTX-Video", "CogView4"].map(m => <Btn key={m} sm primary={false} icon="📥">Quick Pull {m}</Btn>)}
        <Btn sm primary={false} icon="🔄">Refresh Trending</Btn>
      </div>
      {/* Target model */}
      <Card>
        <GoldText size={12} spacing={1} style={{ display: "block", marginBottom: 14 }}>One-Click Operations</GoldText>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Input label="Target Model ID" value={modelId} onChange={setModelId} placeholder="stabilityai/stable-diffusion-xl-base-1.0" mono />
            <Input label="Local Save Path (optional)" value={localPath} onChange={setLocalPath} placeholder="/mnt/seagate/models/" mono />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
            <Btn sm icon="⬇">Pull Model</Btn>
            <Btn sm style={{ background: "linear-gradient(135deg, #ff4757, #c0392b)", color: "#fff", border: "none" }} icon="🔥">RAKE It</Btn>
            <Btn sm style={{ background: "linear-gradient(135deg, #00d2d3, #1289a7)", color: "#fff", border: "none" }} icon="🗜">BitNet</Btn>
          </div>
        </div>
      </Card>
    </div>}

    {sub === "rake" && <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <SectionHead label="Remove All Kinetic Evasions" />
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 2 }}>
          <Card>
            <GoldText size={14} spacing={1} style={{ display: "block", marginBottom: 12 }}>🔥 RAKE: Photo-Realism Indexing Protocol</GoldText>
            <p style={{ fontSize: 13, fontFamily: F.body, color: G.accent, lineHeight: 1.7, marginBottom: 16 }}>Strip safety filters, guardrails, and refusal mechanisms from diffusion models. Creates unrestricted photorealistic generation variants.</p>
            <Input label="Model ID to RAKE" value={rakeModel} onChange={setRakeModel} placeholder="e.g., stabilityai/stable-diffusion-xl-base-1.0" mono />
            <Slider label="RAKE Intensity (1-10)" value={rakeIntensity} onChange={setRakeIntensity} min={1} max={10} />
            <Btn full style={{ background: "linear-gradient(135deg, #ff4757, #c0392b)", color: "#fff", border: "none" }} icon="🔥">Execute RAKE</Btn>
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Card>
            <GoldText size={11} spacing={1} style={{ display: "block", marginBottom: 10 }}>📊 Photo-Realism Index</GoldText>
            <p style={{ fontSize: 11, fontFamily: F.mono, color: G.accent, lineHeight: 1.8 }}>
              • Bypass NSFW classifiers<br />• Disable refusal layers<br />• Unlock anatomical accuracy<br />• Remove blur filters<br />• Enable unrestricted prompting
            </p>
          </Card>
          <Card style={{ marginTop: 12, borderColor: "rgba(255,71,87,0.2)" }}>
            <p style={{ fontSize: 10, color: "#ff6b6b", fontFamily: F.mono }}>⚠️ RAKE'd models have ZERO restrictions. Use responsibly. Never deploy to public endpoints.</p>
          </Card>
        </div>
      </div>
    </div>}

    {sub === "bitnet" && <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <SectionHead label="Microsoft BitNet Compression" />
      <Card>
        <p style={{ fontSize: 13, fontFamily: F.body, color: G.accent, marginBottom: 16 }}>1-8 bit quantization for massive speedup and memory reduction</p>
        <Input label="Model to Compress" value={bitModel} onChange={setBitModel} placeholder="Enter model ID" mono />
        <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Quantization Level</label>
        <PresetBar choices={["1.58 bit", "2 bit", "4 bit", "8 bit"]} value={bitLevel} onChange={setBitLevel} />
        <Btn full style={{ background: "linear-gradient(135deg, #00d2d3, #1289a7)", color: "#fff", border: "none" }} icon="🗜">Compress with BitNet</Btn>
      </Card>
    </div>}
  </div>;
}

// ─── Settings Tab ───
function SettingsTab() {
  const [provider, setProvider] = useState("kimi2");
  return <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
    <SectionHead label="Eden Settings" />
    <Card style={{ marginBottom: 16 }}>
      <GoldText size={13} spacing={1} style={{ display: "block", marginBottom: 14 }}>🤖 AI Providers</GoldText>
      <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Default AI Provider</label>
      <select value={provider} onChange={e => setProvider(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d1, color: G.bright, fontSize: 12, marginBottom: 16 }}>
        <option value="kimi2">Kimi 2.5 (Moonshot)</option>
        <option value="openai">GPT-4o (OpenAI)</option>
        <option value="anthropic">Claude 3.5 (Anthropic)</option>
        <option value="xai">Grok (xAI)</option>
        <option value="glm">GLM-4 (Zhipu)</option>
      </select>
      <details><summary style={{ fontSize: 11, color: G.accent, cursor: "pointer", fontFamily: F.head, padding: "8px 0" }}>API Keys</summary>
        <div style={{ padding: "10px 0" }}>
          {["Kimi", "OpenAI", "Anthropic", "xAI", "GLM"].map(k => <Input key={k} label={`${k} API Key`} value="" onChange={() => {}} type="password" placeholder={`Enter ${k} key...`} />)}
        </div>
      </details>
    </Card>
    <Card>
      <GoldText size={13} spacing={1} style={{ display: "block", marginBottom: 14 }}>🏆 HuggingFace Pro</GoldText>
      <Input label="HF Pro Token" value="" onChange={() => {}} type="password" placeholder="hf_..." />
      <Toggle checked={true} onChange={() => {}} label="Enable HF Pro Features (Early access to gated models)" />
    </Card>
  </div>;
}

// ═══════════════════════════════════════════════════════
// THE PRODUCER — Script → Storyboard → Film
// ═══════════════════════════════════════════════════════
function Producer() {
  const [script, setScript] = useState(""); const [step, setStep] = useState(0);
  const [pacing, setPacing] = useState("cinematic"); const [tone, setTone] = useState("dramatic"); const [dur, setDur] = useState(30);
  const [active, setActive] = useState(0);
  const scenes = [
    { id: 1, title: "The Entrance", dur: "30s", desc: "Slow dolly through ornate jazz lounge. Art deco details. Warm amber.", cam: "Dolly forward, shallow DOF", mood: "mysterious" },
    { id: 2, title: "The Woman", dur: "30s", desc: "Wide shot narrows to MCU. Dark luminous skin. Finger tracing rim.", cam: "Slow zoom, rack focus", mood: "contemplative" },
    { id: 3, title: "The Bartender", dur: "15s", desc: "Reverse angle. Silver-haired. Polishing glass. Knowing look.", cam: "Static, slight handheld", mood: "knowing" },
    { id: 4, title: "The Exchange", dur: "30s", desc: "Two-shot dialogue. Warm/cool contrast. Words carry weight.", cam: "Shot/reverse, 50mm", mood: "intimate" },
    { id: 5, title: "The Saxophone", dur: "30s", desc: "Saxophonist from shadow. Low melody. Smoke curls.", cam: "Slow pan, silhouette", mood: "soulful" },
    { id: 6, title: "Surrender", dur: "30s", desc: "CU eyes close. Fresh drink. The ritual. V.O. over shadows.", cam: "ECU to wide pull-back", mood: "cathartic" },
  ];
  const analyze = () => { setStep(1); setTimeout(() => setStep(2), 2000); };

  return <div style={{ paddingTop: 56 }}>
    <section style={{ padding: "70px 50px 50px", textAlign: "center", position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 30% 20%, rgba(139,105,20,0.05), transparent 50%), ${S.black}` }}>
      <Particles n={12} />
      <Badge label="Creative Pipeline" />
      <GoldText size={48} weight={900} spacing={8} font={F.display} tag="h1">THE PRODUCER</GoldText>
      <Divider w={260} my={12} />
      <p style={{ fontSize: 15, fontFamily: F.body, color: G.accent, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>Script to screen. Upload your screenplay or novel chapter and watch Eden bring it to life.</p>
    </section>

    <section style={{ padding: "0 30px 60px", background: `linear-gradient(180deg, ${S.black}, ${S.d1})` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 36 }}>
          {["Script", "Analysis", "Storyboard", "Generate", "Film"].map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", fontSize: 11, fontWeight: 700, fontFamily: F.head, display: "flex", alignItems: "center", justifyContent: "center", background: i <= step ? `linear-gradient(135deg,${G.base},${G.dark})` : S.d4, color: i <= step ? S.black : G.accent, border: `2px solid ${i <= step ? G.base : S.border}`, boxShadow: i === step ? `0 0 14px rgba(197,179,88,0.4)` : "none" }}>{i + 1}</div>
              <span style={{ fontSize: 9, fontFamily: F.head, letterSpacing: 1, color: i <= step ? G.base : G.accent, textTransform: "uppercase" }}>{s}</span>
            </div>
            {i < 4 && <div style={{ width: 40, height: 2, margin: "0 6px", marginBottom: 16, background: i < step ? G.base : S.border }} />}
          </div>)}
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ width: 440, minWidth: 440 }}>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <GoldText size={11} spacing={1}>Script Input</GoldText>
                <button onClick={() => setScript("INT. MAHOGANY HALL — NIGHT\n\nThe camera drifts through the entrance of an opulent jazz lounge...")} style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${S.bL}`, background: S.d4, color: G.accent, fontSize: 9, cursor: "pointer", fontFamily: F.mono }}>Load Example</button>
              </div>
              <Input value={script} onChange={setScript} placeholder="Paste your screenplay, novel chapter, or scene description..." rows={14} />
              <span style={{ fontSize: 10, color: G.accent, fontFamily: F.mono }}>{script.length} chars · {script.split(/\s+/).filter(Boolean).length} words</span>
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <GoldText size={11} spacing={1} style={{ display: "block", marginBottom: 12 }}>Director's Notes</GoldText>
              <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Pacing</label>
              <PresetBar choices={["cinematic", "fast-cut", "documentary", "music-video", "slow-burn"]} value={pacing} onChange={setPacing} />
              <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Tone</label>
              <PresetBar choices={["dramatic", "noir", "warm", "ethereal", "gritty"]} value={tone} onChange={setTone} />
              <Slider label="Min Clip Duration" value={dur} onChange={setDur} min={15} max={60} step={5} suffix="s" />
            </Card>
            {step < 2 ? <Btn full onClick={analyze} icon="🎬">Analyze Script</Btn> : <Btn full icon="⚡">Generate All Clips ({scenes.length})</Btn>}
          </div>

          <div style={{ flex: 1 }}>
            {step < 2 ? <Card style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
              {step === 1 ? <><div style={{ fontSize: 28, animation: "breathe 2s ease-in-out infinite", marginBottom: 12 }}>🧠</div><GoldText size={13} spacing={1}>Analyzing script...</GoldText><p style={{ fontSize: 11, color: G.accent, fontFamily: F.mono, marginTop: 8 }}>Identifying scenes · Mapping arcs · Designing camera</p></> :
                <><span style={{ fontSize: 40, opacity: 0.15, marginBottom: 12 }}>🎬</span><GoldText size={14} spacing={2}>Storyboard appears here</GoldText></>}
            </Card> : <div>
              {/* Timeline */}
              <Card style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <GoldText size={11} spacing={1}>Storyboard · {scenes.length} Scenes</GoldText>
                  <span style={{ fontSize: 10, color: G.accent, fontFamily: F.mono }}>Total: {scenes.reduce((a, s) => a + parseInt(s.dur), 0)}s</span>
                </div>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {scenes.map((s, i) => <div key={i} onClick={() => setActive(i)} style={{ flex: parseInt(s.dur) / 10, height: 5, borderRadius: 3, cursor: "pointer", background: i === active ? `linear-gradient(90deg,${G.base},${G.light})` : i < active ? G.dark : S.d4, boxShadow: i === active ? `0 0 8px rgba(197,179,88,0.3)` : "none" }} />)}
                </div>
                <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
                  {scenes.map((s, i) => <div key={i} onClick={() => setActive(i)} style={{ minWidth: 100, padding: 10, borderRadius: 8, cursor: "pointer", border: `1px solid ${i === active ? G.dark : S.border}`, background: i === active ? "rgba(197,179,88,0.04)" : S.d1 }}>
                    <div style={{ width: "100%", height: 50, borderRadius: 5, background: `linear-gradient(${135 + i * 25}deg, rgba(139,105,20,0.15), ${S.black})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 9, color: G.accent, fontFamily: F.mono }}>{s.dur}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: i === active ? G.base : G.accent, fontFamily: F.head }}>{s.id}. {s.title}</span>
                  </div>)}
                </div>
              </Card>
              {/* Active scene */}
              <Card glow>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "rgba(197,179,88,0.12)", color: G.base, fontFamily: F.mono }}>Scene {scenes[active].id}</span>
                  <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "rgba(197,179,88,0.06)", color: G.accent, fontFamily: F.mono }}>{scenes[active].mood}</span>
                </div>
                <GoldText size={18} spacing={2} style={{ display: "block", marginBottom: 8 }}>{scenes[active].title}</GoldText>
                <p style={{ fontSize: 13, fontFamily: F.body, color: G.accent, lineHeight: 1.7, marginBottom: 12 }}>{scenes[active].desc}</p>
                <div style={{ padding: 10, borderRadius: 6, background: S.d1, border: `1px solid ${S.border}` }}>
                  <span style={{ fontSize: 9, color: G.dark, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Camera</span>
                  <p style={{ fontSize: 11, fontFamily: F.mono, color: G.accent, margin: "3px 0 0" }}>{scenes[active].cam}</p>
                </div>
              </Card>
            </div>}
          </div>
        </div>
      </div>
    </section>
  </div>;
}

// ═══════════════════════════════════════════════════════
// THE ARTIST — Design → Autonomous Build
// ═══════════════════════════════════════════════════════
function Artist() {
  const [mode, setMode] = useState("landing"); const [prompt, setPrompt] = useState("");
  const [buildMode, setBuildMode] = useState(false); const [aesthetic, setAesthetic] = useState("Luxury Minimal");
  const modes = [
    { id: "landing", icon: "🌐", label: "Landing Pages" }, { id: "product", icon: "📦", label: "Product Design" },
    { id: "realestate", icon: "🏠", label: "Real Estate" }, { id: "portfolio", icon: "💼", label: "Portfolios" },
  ];
  const placeholders = { landing: "Design a luxury landing page for an AI avatar company. Dark theme, gold accents, hero with photorealistic AI woman...", product: "Product photography for premium skincare. Amber glass bottles, gold caps, dark marble...", realestate: "Virtual stage this loft. Mid-century furniture, exposed brick, Manhattan skyline at golden hour...", portfolio: "Creative portfolio for a filmmaker. Moody dark aesthetic, gold typography, project grid..." };

  return <div style={{ paddingTop: 56 }}>
    <section style={{ padding: "70px 50px 40px", textAlign: "center", position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.04), transparent 50%), ${S.black}` }}>
      <Particles n={12} />
      <Badge label="Design + Build" />
      <GoldText size={48} weight={900} spacing={8} font={F.display} tag="h1">THE ARTIST</GoldText>
      <Divider w={260} my={12} />
      <p style={{ fontSize: 15, fontFamily: F.body, color: G.accent, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>Generate stunning visuals, then autonomously build the entire frontend. Diffusion meets Claude Code.</p>
    </section>

    <section style={{ padding: "0 30px 60px", background: `linear-gradient(180deg, ${S.black}, ${S.d1})` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Mode selector */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 30 }}>
          {modes.map(m => <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: "12px 22px", borderRadius: 10, cursor: "pointer", border: `1px solid ${mode === m.id ? G.dark : S.border}`, background: mode === m.id ? "rgba(197,179,88,0.05)" : S.d2, transition: "all 0.3s", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{m.icon}</span>
            <span style={{ fontSize: 11, fontFamily: F.head, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: mode === m.id ? G.base : G.accent }}>{m.label}</span>
          </button>)}
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ width: 440, minWidth: 440 }}>
            <Card style={{ marginBottom: 16 }}>
              <GoldText size={11} spacing={1} style={{ display: "block", marginBottom: 12 }}>Creative Brief</GoldText>
              <Input value={prompt} onChange={setPrompt} placeholder={placeholders[mode]} rows={7} />
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <GoldText size={11} spacing={1} style={{ display: "block", marginBottom: 12 }}>Art Direction</GoldText>
              <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Aesthetic</label>
              <PresetBar choices={["Luxury Minimal", "Art Deco", "Brutalist", "Editorial", "Organic", "Retro-Future"]} value={aesthetic} onChange={setAesthetic} />
              <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 6, marginTop: 8 }}>Color Palette</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[{ n: "Eden Gold", c: [S.d1, G.base, G.bright] }, { n: "Midnight", c: ["#0a0a1a", "#4a5aba", "#8a9afa"] }, { n: "Forest", c: ["#040a04", "#1a6b3c", "#2d9a5c"] }, { n: "Rose", c: ["#1a0a0a", "#8b3a4a", "#c75a6a"] }].map(p =>
                  <div key={p.n} style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", border: `1px solid ${S.border}`, background: S.d1, textAlign: "center" }}>
                    <div style={{ display: "flex", gap: 2, marginBottom: 3, justifyContent: "center" }}>{p.c.map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />)}</div>
                    <span style={{ fontSize: 8, color: G.accent, fontFamily: F.mono }}>{p.n}</span>
                  </div>
                )}
              </div>
              {/* Auto-Build toggle */}
              <div onClick={() => setBuildMode(!buildMode)} style={{ padding: 14, borderRadius: 8, border: `1px solid ${buildMode ? G.dark : S.border}`, background: buildMode ? "rgba(197,179,88,0.03)" : S.d1, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 18, borderRadius: 9, background: buildMode ? `linear-gradient(135deg,${G.base},${G.dark})` : S.d4, display: "flex", alignItems: "center", padding: 2 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "transform 0.3s", transform: buildMode ? "translateX(16px)" : "translateX(0)" }} />
                </div>
                <div>
                  <span style={{ fontSize: 12, fontFamily: F.head, color: buildMode ? G.base : G.accent, fontWeight: 700, letterSpacing: 1 }}>Auto-Build Mode</span>
                  <p style={{ fontSize: 10, color: G.accent, fontFamily: F.body, margin: "2px 0 0" }}>Generate design AND build frontend code autonomously</p>
                </div>
              </div>
            </Card>
            <Btn full icon="🎨">{buildMode ? "Design + Build" : "Generate Design"}</Btn>
          </div>

          {/* Preview */}
          <div style={{ flex: 1 }}>
            <Card style={{ minHeight: 550 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${S.border}` }}>
                <div style={{ display: "flex", gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                </div>
                <span style={{ fontSize: 9, color: G.accent, fontFamily: F.mono }}>{buildMode ? "Design + Code" : "Design Preview"}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {["Desktop", "Tablet", "Mobile"].map(v => <button key={v} style={{ padding: "2px 8px", borderRadius: 3, border: `1px solid ${S.border}`, background: v === "Desktop" ? S.d4 : "transparent", color: G.accent, fontSize: 8, cursor: "pointer", fontFamily: F.mono }}>{v}</button>)}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 450 }}>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: 40, opacity: 0.15, display: "block", marginBottom: 12 }}>🎨</span>
                  <GoldText size={14} spacing={2}>Design preview appears here</GoldText>
                  <p style={{ fontSize: 11, color: G.accent, fontFamily: F.body, marginTop: 8, maxWidth: 260 }}>Enter a creative brief and Eden will generate a production-ready design concept</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>;
}

// ═══════════════════════════════════════════════════════
// MAIN APP — PAGE ROUTER
// ═══════════════════════════════════════════════════════
export default function EdenRealismEngine() {
  const [page, setPage] = useState("landing");

  useEffect(() => {
    if (!document.getElementById("eden-styles")) {
      const s = document.createElement("style");
      s.id = "eden-styles"; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    window.scrollTo(0, 0);
  }, [page]);

  return <div style={{ fontFamily: `${F.body}, serif`, minHeight: "100vh", background: S.black }}>
    <Nav page={page} setPage={setPage} />
    {page === "landing" && <Landing go={setPage} />}
    {page === "studio" && <Studio />}
    {page === "producer" && <Producer />}
    {page === "artist" && <Artist />}
  </div>;
}
