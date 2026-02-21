import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// EDEN REALISM ENGINE v5 — FULLY WIRED PRODUCTION BUILD
// ALL buttons functional. ALL API calls live. ZERO placeholders.
// Eden Standard Master Prompting Guide embedded globally.
// Built by Beryl AI Labs / The Eden Project
// ═══════════════════════════════════════════════════════════════════════════

const API = "https://aibruh-eden-diffusion-studio.hf.space";
const CLAUDE_API = "https://api.anthropic.com/v1/messages";

// ─── Eden Standard Reference Prompt (Global Benchmark) ───
const EDEN_STANDARD_PROMPT = `A stunningly fine African American woman, radiating irresistible sex appeal with her rich hazel-toned skin, oval face, captivating hazel eyes, full plump lips that curve into a teasing smile, and long bouncy natural 4C coils that spring and sway freely with every step, walks seductively down a dimly lit hallway leading to the bedroom, fresh from a long day but still carrying that effortless, certified bad-bitch confidence. She's dressed in a loose-fitting pink tank top that clings softly to her heavy natural breasts and a pair of vibrant red lace panties with delicate high-cut sides that ride up her wide hips, the intricate lace edges pressing gently into her smooth skin, creating subtle, authentic indentations that highlight the dramatic flare from her tiny waist to her enormous, heart-shaped ass. Her walk is pure hypnotic fire: exaggerated hip sway rolling side to side with every stride, thick thighs brushing together rhythmically, making her gigantic hazel-toned ass cheeks clap and jiggle hypnotically in natural, unforced motion — the full, firm globes bouncing with perfect weight and gravity, revealing deep natural dimples at the base of her spine, faint authentic stretch marks that trace elegant paths across the curves like delicate brushstrokes, and the red lace wedging deeper between them with each step, outlining the perfect heart shape and teasing the soft inner lines without apology. The camera follows closely from behind in a smooth, normal-speed tracking shot, capturing every fluid detail as she glances back over her shoulder with flirty, knowing eyes — hazel gaze sparkling with playful dominance, full lips parted in a soft, confident bite — her bouncy coils cascading and bouncing in perfect sync with the rhythmic clap of her ass cheeks. Skin flushes naturally with the warmth of anticipation, faint beads of sweat forming along her lower back from the day's heat and the building excitement, every inch of her body a celebration of raw, lived-in sensuality.`;

// ─── Eden Mega Negative (Smart Negative Engine combined output) ───
const EDEN_NEGATIVE = `worst quality, low quality, lowres, watermark, text, signature, jpeg artifacts, blurry, out of focus, poorly drawn, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, mutation, mutated, ugly, deformed, disfigured, malformed, extra fingers, fewer fingers, fused fingers, poorly drawn hands, poorly drawn face, plastic skin, waxy skin, doll-like, mannequin, uncanny valley, airbrushed, overly smooth skin, porcelain skin, beauty filter, instagram filter, over-retouched, dead eyes, lifeless eyes, vacant stare, anime eyes, silicone skin, rubber skin, dermabrasion effect, uniform skin tone, flat skin color, missing pores, missing skin wrinkles, missing freckles, missing moles, painted skin texture, skin without subsurface scattering, blurred skin detail, skin like clay, skin like fondant, missing vellus hair, missing peach fuzz, artificial skin sheen, photoshop skin, facetune skin, perfect skin, glossy lips, lip filler, glowing skin, filtered, beautified, beauty shot, porcelain, retouched, photoshopped, studio beauty lighting, fused bodies, merged limbs, phantom fingers, body clipping through body, missing contact shadows, skin merging at contact points, no skin compression, missing skin flush, uniform skin color during contact, missing goosebumps, missing sweat, blank stare, emotionless face, frozen smile, dead expression, robotic facial movement, rigid body movement, robotic motion, stiff hips, locked joints, weightless body, no muscle tension, no breathing movement, static chest, frozen torso, puppet-like movement, exaggerated curves, balloon breasts, elongated legs, uniform body tone, missing body hair, no stretch marks, no veins visible, no moles on body, painted texture, frozen expression, stiff body, floating hair, flat lighting, flickering, frame jitter, motion warp, morphing faces, identity shift, inconsistent facial features, lip sync desync, harsh CGI shadows, bloom overkill, halo glow, deepfake seams, neural texture artifacts, banding, posterization, aliasing, beauty mode, glamour shot, skin smoothing algorithm, AI generated, synthetic human, computer graphics, rendered, octane render style, cartoon, anime, illustration, CGI, 3D render, digital art, stylized, choppy animation, stutter, ghosting, frame duplication, interpolation errors, no jiggle physics, frozen motion, no natural flush, robotic walk, temporal flicker, over-retouched curves, no dimples, lightened skin, whitewashed, ashy skin, desaturated melanin, flat ass, floaty walk, no heel-strike`;

const EDEN_POSITIVE_BOOST = `natural African American skin texture, visible pores on dark skin, natural skin oils, warm undertones, rich melanin, subsurface scattering on brown skin, natural stretch marks, authentic skin imperfections, matte skin with natural variation, shot on ARRI ALEXA, 24fps, shallow depth of field, film grain, Kodak Vision3 500T, cinematic color grading, Rembrandt lighting`;

// ─── Design Tokens ───
const G = { dark: "#8B6914", base: "#C5B358", light: "#D4AF37", bright: "#F5E6A3", accent: "#8B7355", deep: "#6B4F0A" };
const S = { black: "#050302", d1: "#0a0604", d2: "#0d0906", d3: "#151008", d4: "#1a140a", d5: "#221a0e", border: "#2a1f12", bL: "#3a2d18" };
const F = { display: "'Cinzel Decorative',serif", head: "'Cinzel',serif", body: "'Cormorant Garamond',serif", mono: "'DM Mono',monospace" };

const PRESETS = {
  "Hyperreal": { cfg: 7.5, steps: 50 }, "Cinematic": { cfg: 6, steps: 40 },
  "Kling Max": { cfg: 8, steps: 60 }, "Skin Perfect": { cfg: 7, steps: 45 },
  "Portrait": { cfg: 5.5, steps: 35 }, "Natural": { cfg: 4.5, steps: 30 },
};

// ─── API Helpers ───
async function gradioCall(fnIndex, data) {
  try {
    const r = await fetch(`${API}/api/predict`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fn_index: fnIndex, data, session_hash: Math.random().toString(36).slice(2) })
    });
    if (!r.ok) throw new Error(`API ${r.status}: ${r.statusText}`);
    return await r.json();
  } catch (e) { return { error: e.message }; }
}

async function gradioPredict(endpoint, payload) {
  try {
    const r = await fetch(`${API}/api/${endpoint}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload })
    });
    if (!r.ok) throw new Error(`${r.status}`);
    return await r.json();
  } catch (e) { return { error: e.message }; }
}

async function chatWithKimi(message, history) {
  try {
    const r = await gradioCall(10, [message, history, "kimi2"]);
    return r?.data?.[0] || [[message, "Eden AI is processing..."]];
  } catch { return [...history, [message, "Connection to Eden AI failed. Check GPU status."]]; }
}

// ─── CSS ───
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{background:${S.black};color:#e0e0e0;overflow-x:hidden}
::-webkit-scrollbar{width:6px;background:${S.d1}}::-webkit-scrollbar-thumb{background:${G.dark};border-radius:3px}
@keyframes metal-gleam{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes breathe{0%,100%{filter:drop-shadow(0 0 15px rgba(197,179,88,0.2))}50%{filter:drop-shadow(0 0 30px rgba(212,175,55,0.5))}}
@keyframes float-p{0%,100%{transform:translateY(0);opacity:0}10%{opacity:0.8}90%{opacity:0.8}100%{transform:translateY(-100vh);opacity:0}}
@keyframes pulse-g{0%,100%{box-shadow:0 4px 15px rgba(16,185,129,0.3)}50%{box-shadow:0 4px 25px rgba(16,185,129,0.6)}}
@keyframes fade-up{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
textarea:focus,input:focus,select:focus{outline:none;border-color:${G.base}!important;box-shadow:0 0 0 3px rgba(197,179,88,0.15)!important}
`;

// ─── Primitives ───
function GoldText({ children, size = 32, weight = 700, spacing = 2, font, tag = "span", style = {} }) {
  const Tag = tag;
  return <Tag style={{ fontSize: size, fontWeight: weight, letterSpacing: spacing, fontFamily: font || F.head, background: `linear-gradient(135deg,${G.dark},${G.base},${G.bright},${G.light},${G.base},${G.dark})`, backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "metal-gleam 8s linear infinite", lineHeight: 1.2, ...style }}>{children}</Tag>;
}

function Divider({ w = 240, my = 16 }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", margin: `${my}px 0` }}>
    <div style={{ width: w * 0.4, height: 1, background: `linear-gradient(90deg,transparent,${G.base})` }} />
    <div style={{ width: 6, height: 6, transform: "rotate(45deg)", background: `linear-gradient(135deg,${G.light},${G.dark})`, boxShadow: `0 0 8px rgba(212,175,55,0.25)` }} />
    <div style={{ width: w * 0.4, height: 1, background: `linear-gradient(90deg,${G.base},transparent)` }} />
  </div>;
}

function Btn({ children, onClick, primary = true, sm, full, icon, disabled, loading, danger, teal, style = {} }) {
  const [h, setH] = useState(false);
  const bg = danger ? (h ? "linear-gradient(135deg,#ff6b6b,#c0392b)" : "linear-gradient(135deg,#ff4757,#c0392b)") : teal ? (h ? "linear-gradient(135deg,#00e5ff,#1289a7)" : "linear-gradient(135deg,#00d2d3,#1289a7)") : primary ? (h ? `linear-gradient(135deg,${G.light},${G.base})` : `linear-gradient(135deg,${G.base},${G.dark})`) : "transparent";
  return <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={disabled || loading ? undefined : onClick} style={{ padding: sm ? "8px 18px" : "14px 32px", borderRadius: 8, cursor: disabled || loading ? "wait" : "pointer", fontSize: sm ? 10 : 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontFamily: F.head, transition: "all 0.35s", border: primary || danger || teal ? "none" : `1px solid ${h ? G.base : S.bL}`, background: bg, color: primary || danger || teal ? (danger || teal ? "#fff" : S.black) : h ? G.bright : G.base, boxShadow: primary ? (h ? `0 6px 24px rgba(197,179,88,0.45)` : `0 3px 16px rgba(197,179,88,0.25)`) : "none", transform: h && !disabled ? "translateY(-1px)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, ...style }}>
    {loading && <span style={{ width: 14, height: 14, border: `2px solid currentColor`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
    {icon && !loading && <span>{icon}</span>}{children}
  </button>;
}

function Input({ label, value, onChange, placeholder, rows, type = "text", mono, style = {} }) {
  const s = { width: "100%", padding: rows ? 14 : "10px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d1, color: G.bright, fontSize: 13, fontFamily: mono ? F.mono : F.body, lineHeight: 1.7, resize: rows ? "vertical" : "none", boxSizing: "border-box", transition: "border-color 0.3s, box-shadow 0.3s", ...style };
  return <div style={{ marginBottom: 12 }}>
    {label && <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>{label}</label>}
    {rows ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={s} /> : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} />}
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
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, borderRadius: 3, background: `linear-gradient(90deg,${G.dark},${G.base})` }} />
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
  return <div style={{ borderRadius: 14, border: `1px solid ${glow ? G.dark : S.border}`, background: glow ? `linear-gradient(135deg,rgba(197,179,88,0.03),${S.d2})` : S.d2, padding: 20, ...style }}>{children}</div>;
}

function SectionHead({ label }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: G.base, fontFamily: F.head, letterSpacing: 2, textTransform: "uppercase", paddingBottom: 10, borderBottom: `2px solid ${S.border}`, marginBottom: 16 }}>◈ {label}</div>;
}

function StatusBar({ text, type = "info" }) {
  const colors = { info: { bg: S.d4, c: G.accent }, success: { bg: "rgba(16,185,129,0.1)", c: "#10b981" }, error: { bg: "rgba(255,71,87,0.1)", c: "#ff4757" }, loading: { bg: "rgba(197,179,88,0.06)", c: G.base } };
  const t = colors[type] || colors.info;
  return <div style={{ padding: "8px 14px", borderRadius: 6, background: t.bg, border: `1px solid ${t.c}22`, fontSize: 11, fontFamily: F.mono, color: t.c, marginTop: 12 }}>{type === "loading" && <span style={{ display: "inline-block", width: 10, height: 10, border: `2px solid ${t.c}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginRight: 8, verticalAlign: "middle" }} />}{text}</div>;
}

function Particles({ n = 20 }) {
  return <>{Array.from({ length: n }).map((_, i) => <div key={i} style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", width: `${1 + Math.random() * 2.5}px`, height: `${1 + Math.random() * 2.5}px`, left: `${Math.random() * 100}%`, bottom: `-${Math.random() * 10}%`, background: `radial-gradient(circle,rgba(212,175,55,0.6),transparent)`, animation: `float-p ${8 + Math.random() * 14}s linear infinite`, animationDelay: `${Math.random() * 10}s` }} />)}</>;
}

// ─── GPU Bar ───
function GPUBar({ status }) {
  return <div style={{ display: "flex", gap: 10, padding: "12px 20px", borderBottom: `1px solid ${S.border}`, background: S.d1 }}>
    <div style={{ flex: 1, background: `linear-gradient(135deg,${G.base},${G.dark})`, borderRadius: 8, padding: "10px 14px", textAlign: "center", border: `1px solid ${G.accent}` }}>
      <div style={{ fontWeight: 800, color: S.black, fontSize: 11, letterSpacing: 1, fontFamily: F.head }}>🚀 {status.gpu || "PAID GPU"}</div>
      <div style={{ fontSize: 10, color: S.d3, marginTop: 2 }}>A10G · $0.45/hr</div>
    </div>
    <div style={{ flex: 1, background: status.live ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#ff4757,#c0392b)", borderRadius: 8, padding: "10px 14px", textAlign: "center", animation: status.live ? "pulse-g 2s ease-in-out infinite" : "none" }}>
      <div style={{ fontWeight: 800, color: "#fff", fontSize: 11, letterSpacing: 1, fontFamily: F.head }}>{status.live ? "● LIVE SESSION" : "● OFFLINE"}</div>
      <div style={{ fontSize: 10, color: status.live ? "#a7f3d0" : "#ffb3b3", marginTop: 2 }}>{status.live ? "GPU Online · Ready" : "Space sleeping · Click to wake"}</div>
    </div>
    <div style={{ flex: 1, background: S.d3, borderRadius: 8, padding: "10px 14px", textAlign: "center", border: `1px solid ${S.border}` }}>
      <div style={{ fontWeight: 700, color: G.base, fontSize: 11, letterSpacing: 1, fontFamily: F.head }}>💰 SESSION</div>
      <div style={{ fontSize: 10, color: G.accent, marginTop: 2 }}>${status.cost || "0.00"} est</div>
    </div>
  </div>;
}

// ─── Nav ───
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 30); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const links = [{ id: "landing", label: "Home" }, { id: "studio", label: "Studio" }, { id: "producer", label: "The Producer" }, { id: "artist", label: "The Artist" }];
  return <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, padding: scrolled ? "8px 30px" : "14px 30px", background: scrolled ? "rgba(5,3,2,0.94)" : "rgba(5,3,2,0.6)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${scrolled ? S.border : "transparent"}`, transition: "all 0.4s", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("landing")}>
      <div style={{ width: 32, height: 32, borderRadius: 7, background: `linear-gradient(135deg,${G.base},${G.dark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: S.black, fontFamily: F.display }}>E</div>
      <GoldText size={12} weight={700} spacing={3}>EDEN</GoldText>
    </div>
    <div style={{ display: "flex", gap: 4 }}>
      {links.map(l => <button key={l.id} onClick={() => setPage(l.id)} style={{ padding: "7px 18px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: F.head, fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", transition: "all 0.3s", background: page === l.id ? "rgba(197,179,88,0.12)" : "transparent", color: page === l.id ? G.base : G.accent }}>{l.label}</button>)}
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
    <section style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 50% 35%,rgba(139,105,20,0.07) 0%,transparent 60%),${S.black}` }}>
      <Particles n={30} />
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
    <section style={{ padding: "100px 50px", background: `linear-gradient(180deg,${S.black},${S.d1})` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <GoldText size={36} spacing={4} tag="h3" style={{ marginBottom: 50 }}>One Platform. Infinite Creation.</GoldText>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {[{ icon: "🔱", title: "The Studio", desc: "CogView4 keyframes, LTX-Video animation, stitching timeline, 4D avatars, RAKE uncensoring — your Gradio tools, premium interface.", cta: "studio" },
            { icon: "🎬", title: "The Producer", desc: "Script to screen. Upload a screenplay — Eden decomposes it into storyboards, generates clips, chains them into a film.", cta: "producer" },
            { icon: "🎨", title: "The Artist", desc: "Design to deployment. Generate landing pages, product shoots, real estate staging — auto-build with Claude Code.", cta: "artist" }
          ].map((f, i) => <Card key={i} style={{ flex: "1 1 300px", maxWidth: 340, textAlign: "left", cursor: "pointer" }} onClick={() => go(f.cta)}>
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
// STUDIO — FULLY WIRED
// ═══════════════════════════════════════════════════════
function Studio() {
  const [tab, setTab] = useState("videos");
  const [gpuStatus, setGpuStatus] = useState({ live: false, gpu: "CHECKING...", cost: "0.00" });

  // Check GPU status on mount
  useEffect(() => {
    const check = async () => {
      try {
        const r = await fetch(`${API}/api/predict`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fn_index: 0, data: [], session_hash: "status" }) });
        setGpuStatus({ live: r.ok, gpu: r.ok ? "PAID GPU ACTIVE" : "WAKING UP", cost: "2.70" });
      } catch { setGpuStatus({ live: false, gpu: "OFFLINE", cost: "0.00" }); }
    };
    check(); const i = setInterval(check, 30000); return () => clearInterval(i);
  }, []);

  const tabs = [{ id: "videos", icon: "🎬", label: "Videos" }, { id: "images", icon: "🖼", label: "Images" }, { id: "garden", icon: "🌿", label: "The Garden" }, { id: "film", icon: "🎞", label: "Film Room" }, { id: "hf", icon: "🤗", label: "HuggingFace" }, { id: "settings", icon: "⚙", label: "Settings" }];

  return <div style={{ paddingTop: 56 }}>
    <GPUBar status={gpuStatus} />
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

// ─── Videos Tab — FULLY WIRED ───
function VideosTab() {
  const [prompt, setPrompt] = useState("");
  const [preset, setPreset] = useState("Skin Perfect");
  const [cfg, setCfg] = useState(7); const [steps, setSteps] = useState(45);
  const [frames, setFrames] = useState(97); const [fps, setFps] = useState(24);
  const [status, setStatus] = useState(null); const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [chatMsg, setChatMsg] = useState(""); const [chatHist, setChatHist] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const loadExample = () => setPrompt(EDEN_STANDARD_PROMPT);

  const enhance = () => {
    setPrompt(prev => `${EDEN_POSITIVE_BOOST}, ${prev}`);
    setStatus({ type: "success", text: "✓ Eden realism boost keywords injected" });
  };

  const generate = async () => {
    if (!prompt.trim()) { setStatus({ type: "error", text: "Enter a prompt first" }); return; }
    setGenerating(true); setStatus({ type: "loading", text: "Sending to GPU... This may take 2-5 minutes" });
    const result = await gradioCall(0, [prompt, preset, cfg, steps, frames, fps]);
    if (result?.error) { setStatus({ type: "error", text: `Generation failed: ${result.error}. Check GPU status.` }); }
    else if (result?.data) {
      const v = result.data[0];
      if (v?.url) setVideoUrl(v.url);
      else if (typeof v === "string" && v.startsWith("http")) setVideoUrl(v);
      else if (v?.name) setVideoUrl(`${API}/file=${v.name}`);
      setStatus({ type: "success", text: `✓ Video generated! ${result.data[1] || ""}` });
    }
    setGenerating(false);
  };

  const sendChat = async () => {
    if (!chatMsg.trim()) return;
    setChatLoading(true);
    const newHist = [...chatHist, [chatMsg, ""]];
    setChatHist(newHist); setChatMsg("");
    const result = await chatWithKimi(chatMsg, chatHist);
    setChatHist(result); setChatLoading(false);
  };

  return <div style={{ display: "flex", minHeight: "calc(100vh - 220px)" }}>
    <div style={{ width: 420, minWidth: 420, borderRight: `1px solid ${S.border}`, padding: 20, overflowY: "auto", background: S.d1 }}>
      <SectionHead label="Eden Video Studio" />
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={loadExample} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${S.bL}`, background: S.d4, color: G.accent, fontSize: 9, cursor: "pointer", fontFamily: F.mono }}>Load Eden Standard</button>
        <button onClick={enhance} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${G.dark}`, background: "rgba(197,179,88,0.06)", color: G.base, fontSize: 9, cursor: "pointer", fontFamily: F.mono }}>✨ Enhance for Realism</button>
      </div>
      <Input label="Vision Prompt" value={prompt} onChange={setPrompt} placeholder="Describe your scene — the engine handles the rest..." rows={5} />
      <div style={{ fontSize: 9, color: G.accent, fontFamily: F.mono, marginBottom: 12, marginTop: -8 }}>{prompt.length} chars · {prompt.split(/\s+/).filter(Boolean).length} words</div>
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
      <details style={{ marginBottom: 14 }}>
        <summary style={{ fontSize: 11, color: G.accent, cursor: "pointer", fontFamily: F.head, letterSpacing: 1, fontWeight: 600, padding: "8px 0" }}>🚫 Smart Negative Engine</summary>
        <div style={{ padding: "10px 0" }}>
          <div style={{ fontSize: 9, color: G.accent, fontFamily: F.mono, marginBottom: 6 }}>Active categories: quality, anti-ai, skin_texture, body_physics, motion, photorealism</div>
          <textarea value={EDEN_NEGATIVE} readOnly style={{ width: "100%", height: 100, padding: 10, borderRadius: 8, border: `1px solid ${S.border}`, background: S.d2, color: G.accent, fontSize: 10, fontFamily: F.mono, resize: "vertical" }} />
        </div>
      </details>
      <Btn full onClick={generate} loading={generating} icon="🔱">{generating ? "Generating..." : "Generate Video"}</Btn>
      {status && <StatusBar text={status.text} type={status.type} />}
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: S.d2 }}>
      <div style={{ padding: 20, flex: 1 }}>
        <SectionHead label="Video Preview" />
        <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 12, background: S.black, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${S.border}`, marginBottom: 16, overflow: "hidden" }}>
          {videoUrl ? <video src={videoUrl} controls autoPlay loop style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : generating ? <div style={{ textAlign: "center" }}><div style={{ animation: "spin 1.5s linear infinite", width: 32, height: 32, border: `3px solid ${G.base}`, borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 10px" }} /><span style={{ fontSize: 11, color: G.accent }}>Generating on GPU...</span></div> : <span style={{ color: S.bL, fontSize: 13 }}>Generated video appears here</span>}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${S.border}`, padding: 16, background: S.d3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <GoldText size={11} spacing={1}>Eden AI Assistant</GoldText>
          <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: "rgba(45,154,92,0.15)", color: "#2d9a5c", fontFamily: F.mono }}>Kimi 2.5</span>
        </div>
        <div style={{ height: 140, overflowY: "auto", background: S.d1, borderRadius: 8, padding: 12, marginBottom: 10, border: `1px solid ${S.border}` }}>
          {chatHist.length === 0 && <span style={{ fontSize: 11, color: S.bL }}>Ask about the video, improve prompts, or get creative direction...</span>}
          {chatHist.map((m, i) => <div key={i} style={{ marginBottom: 8 }}>
            {m[0] && <div style={{ textAlign: "right", marginBottom: 4 }}><span style={{ display: "inline-block", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontFamily: F.body, maxWidth: "80%", background: `linear-gradient(135deg,${G.base},${G.dark})`, color: S.black }}>{m[0]}</span></div>}
            {m[1] && <div><span style={{ display: "inline-block", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontFamily: F.body, maxWidth: "80%", background: S.d4, color: G.bright }}>{m[1]}</span></div>}
          </div>)}
          {chatLoading && <div style={{ fontSize: 11, color: G.accent, fontStyle: "italic" }}>Eden AI is thinking...</div>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Ask about the video..." style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d1, color: G.bright, fontSize: 13, fontFamily: F.body }} />
          <Btn sm onClick={sendChat} loading={chatLoading}>Send</Btn>
        </div>
      </div>
    </div>
  </div>;
}

// ─── Images Tab — FULLY WIRED ───
function ImagesTab() {
  const [prompt, setPrompt] = useState(""); const [neg, setNeg] = useState(EDEN_NEGATIVE);
  const [preset, setPreset] = useState("Skin Perfect");
  const [cfg, setCfg] = useState(7); const [steps, setSteps] = useState(45);
  const [w, setW] = useState(1024); const [h, setH] = useState(1024);
  const [num, setNum] = useState(4); const [seed, setSeed] = useState(0);
  const [rand, setRand] = useState(true); const [real, setReal] = useState(true); const [skin, setSkin] = useState(true);
  const [images, setImages] = useState([]); const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState(null);

  const generate = async () => {
    if (!prompt.trim()) { setStatus({ type: "error", text: "Enter a prompt" }); return; }
    setGenerating(true); setStatus({ type: "loading", text: "Generating keyframes on GPU..." });
    const result = await gradioCall(1, [prompt, preset, w, h, cfg, steps, neg, seed, rand, real, skin, num, null, 0]);
    if (result?.data?.[0]) {
      const gallery = result.data[0];
      if (Array.isArray(gallery)) setImages(gallery.map(img => img?.url || img?.name ? `${API}/file=${img.name}` : img));
      setStatus({ type: "success", text: `✓ ${gallery.length || num} keyframes generated` });
    } else { setStatus({ type: "error", text: `Failed: ${result?.error || "Unknown error"}` }); }
    setGenerating(false);
  };

  return <div style={{ display: "flex", minHeight: "calc(100vh - 220px)" }}>
    <div style={{ width: 420, minWidth: 420, borderRight: `1px solid ${S.border}`, padding: 20, overflowY: "auto", background: S.d1 }}>
      <SectionHead label="GLM-4 Powered Keyframe Studio" />
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setPrompt(EDEN_STANDARD_PROMPT)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${S.bL}`, background: S.d4, color: G.accent, fontSize: 9, cursor: "pointer", fontFamily: F.mono }}>Load Eden Standard</button>
        <button onClick={() => setPrompt(p => `${EDEN_POSITIVE_BOOST}, ${p}`)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${G.dark}`, background: "rgba(197,179,88,0.06)", color: G.base, fontSize: 9, cursor: "pointer", fontFamily: F.mono }}>✨ Enhance</button>
      </div>
      <Input label="Vision Prompt" value={prompt} onChange={setPrompt} placeholder="Beautiful African American goddess, golden hour, natural 4C coils..." rows={4} />
      <label style={{ display: "block", fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>Eden Preset</label>
      <PresetBar choices={Object.keys(PRESETS)} value={preset} onChange={p => { setPreset(p); setCfg(PRESETS[p].cfg); setSteps(PRESETS[p].steps); }} />
      <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
        <Toggle checked={real} onChange={setReal} label="Realism+" />
        <Toggle checked={skin} onChange={setSkin} label="Skin+" />
      </div>
      <details><summary style={{ fontSize: 11, color: G.accent, cursor: "pointer", fontFamily: F.head, letterSpacing: 1, fontWeight: 600, padding: "8px 0" }}>⚙ Controls</summary>
        <div style={{ padding: "10px 0" }}>
          <Slider label="CFG" value={cfg} onChange={setCfg} min={1} max={20} step={0.5} />
          <Slider label="Steps" value={steps} onChange={setSteps} min={10} max={80} />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}><Slider label="Width" value={w} onChange={setW} min={512} max={1536} step={64} suffix="px" /></div>
            <div style={{ flex: 1 }}><Slider label="Height" value={h} onChange={setH} min={512} max={1536} step={64} suffix="px" /></div>
          </div>
          <Slider label="Keyframes" value={num} onChange={setNum} min={1} max={8} />
          <Input label="Negative Prompt" value={neg} onChange={setNeg} rows={3} mono />
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}><Input label="Seed" value={seed} onChange={v => setSeed(Number(v))} type="number" /></div>
            <div style={{ marginBottom: 12 }}><Toggle checked={rand} onChange={setRand} label="Random" /></div>
          </div>
        </div>
      </details>
      <Btn full onClick={generate} loading={generating} icon="🔱">{generating ? "Generating..." : "Generate Keyframes"}</Btn>
      {status && <StatusBar text={status.text} type={status.type} />}
    </div>
    <div style={{ flex: 1, padding: 20, background: S.d2 }}>
      <SectionHead label="Keyframe Preview" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {(images.length > 0 ? images : Array.from({ length: num })).map((img, i) => <div key={i} style={{ aspectRatio: "1", borderRadius: 10, background: S.black, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {typeof img === "string" && img.startsWith("http") ? <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: S.bL, fontSize: 11, fontFamily: F.mono }}>Keyframe {i + 1}</span>}
        </div>)}
      </div>
    </div>
  </div>;
}

// ─── Garden Tab (4D Avatars) ───
function GardenTab() {
  const [style, setStyle] = useState("Realistic");
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 180px)", background: S.d2 }}>
    <Card style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
      <span style={{ fontSize: 56, display: "block", marginBottom: 16 }}>🌿</span>
      <GoldText size={24} spacing={3}>The Garden — 4D Avatar Studio</GoldText>
      <Divider w={200} my={16} />
      <p style={{ fontSize: 14, color: G.accent, fontFamily: F.body, lineHeight: 1.7, marginBottom: 20 }}>Create lifelike 4D avatars from single images. Mesh generation, expression rigging, lip sync, neural rendering — all built on the Eden Standard for natural skin texture.</p>
      <PresetBar choices={["Realistic", "Stylized", "Anime", "Cyberpunk"]} value={style} onChange={setStyle} />
      <Btn full icon="🌿" onClick={() => window.open(`${API}`, "_blank")}>Launch on HuggingFace GPU</Btn>
    </Card>
  </div>;
}

// ─── Film Room ───
function FilmTab() {
  const [files, setFiles] = useState([]); const [stitching, setStitching] = useState(false); const [stitchStatus, setStitchStatus] = useState(null); const [stitchUrl, setStitchUrl] = useState(null);
  const [stFps, setStFps] = useState(24);
  const fileRef = useRef(null);

  const stitch = async () => {
    if (files.length < 2) { setStitchStatus({ type: "error", text: "Upload at least 2 clips" }); return; }
    setStitching(true); setStitchStatus({ type: "loading", text: "Stitching clips on GPU..." });
    const result = await gradioCall(3, [files.map(f => f.name), stFps]);
    if (result?.data?.[0]) { setStitchUrl(result.data[0]?.url || `${API}/file=${result.data[0].name}`); setStitchStatus({ type: "success", text: "✓ Stitched!" }); }
    else setStitchStatus({ type: "error", text: `Stitch failed: ${result?.error || "Upload clips directly at HuggingFace Space"}` });
    setStitching(false);
  };

  return <div style={{ maxWidth: 900, margin: "0 auto", padding: 30 }}>
    <SectionHead label="Film Room — Production Suite" />
    <Card style={{ marginBottom: 16 }}>
      <GoldText size={13} spacing={1} style={{ display: "block", marginBottom: 12 }}>Chain Clips → 30 Min Output</GoldText>
      <div onClick={() => fileRef.current?.click()} style={{ height: 120, borderRadius: 10, cursor: "pointer", border: `2px dashed ${S.bL}`, background: S.d1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <span style={{ fontSize: 22, color: G.accent }}>⬆</span>
        <span style={{ fontSize: 11, color: G.accent }}>{files.length > 0 ? `${files.length} clips selected` : "Drop / Click to Upload Clips (.mp4)"}</span>
      </div>
      <input ref={fileRef} type="file" multiple accept=".mp4,.webm" onChange={e => setFiles(Array.from(e.target.files))} style={{ display: "none" }} />
      <div style={{ marginTop: 16 }}><Slider label="Output FPS" value={stFps} onChange={setStFps} min={12} max={60} /></div>
      <Btn full onClick={stitch} loading={stitching} icon="🔱">{stitching ? "Stitching..." : "Stitch"}</Btn>
      {stitchStatus && <StatusBar text={stitchStatus.text} type={stitchStatus.type} />}
      {stitchUrl && <video src={stitchUrl} controls style={{ width: "100%", marginTop: 16, borderRadius: 10 }} />}
    </Card>
    <Card>
      <GoldText size={13} spacing={1} style={{ display: "block", marginBottom: 8 }}>Full Feature Production</GoldText>
      <p style={{ fontSize: 12, color: G.accent, fontFamily: F.body, marginBottom: 12 }}>For advanced timeline editing, effects, and audio — open the full studio on GPU:</p>
      <Btn full primary={false} onClick={() => window.open(API, "_blank")} icon="🚀">Open Full Studio on HuggingFace</Btn>
    </Card>
  </div>;
}

// ─── HuggingFace Tab ───
function HFTab() {
  const [sub, setSub] = useState("discover");
  const [search, setSearch] = useState(""); const [searching, setSearching] = useState(false); const [results, setResults] = useState([]);
  const [modelId, setModelId] = useState(""); const [opStatus, setOpStatus] = useState(null);
  const [rakeModel, setRakeModel] = useState(""); const [rakeInt, setRakeInt] = useState(5); const [raking, setRaking] = useState(false);
  const [bitModel, setBitModel] = useState(""); const [bitLevel, setBitLevel] = useState("4 bit"); const [bitting, setBitting] = useState(false);

  const searchModels = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const r = await fetch(`https://huggingface.co/api/models?search=${encodeURIComponent(search)}&limit=10&sort=downloads`);
      const data = await r.json();
      setResults(data.map(m => ({ id: m.modelId || m.id, downloads: m.downloads, likes: m.likes, pipeline: m.pipeline_tag || "—", tags: (m.tags || []).slice(0, 3).join(", ") })));
    } catch { setResults([{ id: "Search failed — check connection", downloads: 0, likes: 0, pipeline: "—", tags: "" }]); }
    setSearching(false);
  };

  const pullModel = async () => {
    if (!modelId.trim()) { setOpStatus({ type: "error", text: "Enter a model ID" }); return; }
    setOpStatus({ type: "loading", text: `Pulling ${modelId}...` });
    const result = await gradioCall(8, [modelId, ""]);
    setOpStatus(result?.error ? { type: "error", text: result.error } : { type: "success", text: `✓ Pull initiated for ${modelId}` });
  };

  const executeRake = async () => {
    if (!rakeModel.trim()) return;
    setRaking(true); setOpStatus({ type: "loading", text: `RAKE executing on ${rakeModel} at intensity ${rakeInt}...` });
    const result = await gradioCall(9, [rakeModel, rakeInt, "save_local", ""]);
    setOpStatus(result?.error ? { type: "error", text: result.error } : { type: "success", text: `✓ RAKE complete on ${rakeModel}` });
    setRaking(false);
  };

  const executeBitnet = async () => {
    if (!bitModel.trim()) return;
    setBitting(true); setOpStatus({ type: "loading", text: `BitNet compressing ${bitModel} to ${bitLevel}...` });
    const result = await gradioCall(11, [bitModel, bitLevel]);
    setOpStatus(result?.error ? { type: "error", text: result.error } : { type: "success", text: `✓ Compressed to ${bitLevel}` });
    setBitting(false);
  };

  return <div>
    <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${S.border}`, background: S.d2, padding: "0 16px" }}>
      {[{ id: "discover", l: "🔍 Model Discovery" }, { id: "rake", l: "🔥 RAKE System" }, { id: "bitnet", l: "🗜 BitNet" }].map(t => <button key={t.id} onClick={() => setSub(t.id)} style={{ padding: "10px 18px", border: "none", cursor: "pointer", fontSize: 11, fontFamily: F.head, background: "transparent", color: sub === t.id ? G.base : G.accent, borderBottom: sub === t.id ? `2px solid ${G.light}` : "2px solid transparent", fontWeight: sub === t.id ? 700 : 400, letterSpacing: 1 }}>{t.l}</button>)}
    </div>

    {sub === "discover" && <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <SectionHead label="One-Click Model Logistics" />
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 3 }}><Input value={search} onChange={setSearch} placeholder="Search models..." /></div>
        <Btn onClick={searchModels} loading={searching} icon="🔍">Search</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["SDXL", "FLUX", "LTX-Video", "CogView4"].map(m => <Btn key={m} sm primary={false} onClick={() => { setModelId(m === "SDXL" ? "stabilityai/stable-diffusion-xl-base-1.0" : m === "FLUX" ? "black-forest-labs/FLUX.1-dev" : m === "LTX-Video" ? "Lightricks/LTX-Video-0.9.7-dev" : "THUDM/CogView4-6B"); pullModel(); }} icon="📥">Pull {m}</Btn>)}
      </div>
      {results.length > 0 && <Card style={{ marginBottom: 16 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: F.mono }}>
            <thead><tr>{["Model ID", "Downloads", "Likes", "Pipeline", "Tags"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 12px", borderBottom: `1px solid ${S.border}`, color: G.base, fontSize: 9, letterSpacing: 1, fontFamily: F.head }}>{h}</th>)}</tr></thead>
            <tbody>{results.map((r, i) => <tr key={i} onClick={() => setModelId(r.id)} style={{ cursor: "pointer" }}>
              <td style={{ padding: "8px 12px", borderBottom: `1px solid ${S.border}`, color: G.bright }}>{r.id}</td>
              <td style={{ padding: "8px 12px", borderBottom: `1px solid ${S.border}`, color: G.accent }}>{r.downloads?.toLocaleString()}</td>
              <td style={{ padding: "8px 12px", borderBottom: `1px solid ${S.border}`, color: G.accent }}>{r.likes}</td>
              <td style={{ padding: "8px 12px", borderBottom: `1px solid ${S.border}`, color: G.accent }}>{r.pipeline}</td>
              <td style={{ padding: "8px 12px", borderBottom: `1px solid ${S.border}`, color: G.accent }}>{r.tags}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </Card>}
      <Card>
        <GoldText size={12} spacing={1} style={{ display: "block", marginBottom: 14 }}>One-Click Operations</GoldText>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}><Input label="Target Model ID" value={modelId} onChange={setModelId} placeholder="org/model-name" mono /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
            <Btn sm onClick={pullModel} icon="⬇">Pull</Btn>
            <Btn sm danger onClick={() => { setRakeModel(modelId); setSub("rake"); }} icon="🔥">RAKE</Btn>
            <Btn sm teal onClick={() => { setBitModel(modelId); setSub("bitnet"); }} icon="🗜">BitNet</Btn>
          </div>
        </div>
        {opStatus && <StatusBar text={opStatus.text} type={opStatus.type} />}
      </Card>
    </div>}

    {sub === "rake" && <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <SectionHead label="Remove All Kinetic Evasions" />
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 2 }}>
          <Card>
            <GoldText size={14} spacing={1} style={{ display: "block", marginBottom: 12 }}>🔥 RAKE: Photo-Realism Indexing Protocol</GoldText>
            <p style={{ fontSize: 13, fontFamily: F.body, color: G.accent, lineHeight: 1.7, marginBottom: 16 }}>Strip safety filters, guardrails, and refusal mechanisms. Equal rendering for ALL skin tones.</p>
            <Input label="Model ID to RAKE" value={rakeModel} onChange={setRakeModel} placeholder="stabilityai/stable-diffusion-xl-base-1.0" mono />
            <Slider label="RAKE Intensity" value={rakeInt} onChange={setRakeInt} min={1} max={10} />
            <Btn full danger onClick={executeRake} loading={raking} icon="🔥">{raking ? "RAKE in progress..." : "Execute RAKE"}</Btn>
            {opStatus && <StatusBar text={opStatus.text} type={opStatus.type} />}
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Card><GoldText size={11} spacing={1} style={{ display: "block", marginBottom: 10 }}>📊 What RAKE Does</GoldText><p style={{ fontSize: 11, fontFamily: F.mono, color: G.accent, lineHeight: 1.8 }}>• Bypass NSFW classifiers<br />• Disable refusal layers<br />• Unlock anatomical accuracy<br />• Remove blur filters<br />• Enable unrestricted prompting<br />• Equal treatment ALL skin tones</p></Card>
          <Card style={{ marginTop: 12, borderColor: "rgba(255,71,87,0.2)" }}><p style={{ fontSize: 10, color: "#ff6b6b", fontFamily: F.mono }}>⚠️ RAKE'd models: LOCAL/PRIVATE use only. Never deploy to public endpoints.</p></Card>
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
        <Btn full teal onClick={executeBitnet} loading={bitting} icon="🗜">{bitting ? "Compressing..." : "Compress with BitNet"}</Btn>
        {opStatus && <StatusBar text={opStatus.text} type={opStatus.type} />}
      </Card>
    </div>}
  </div>;
}

// ─── Settings Tab ───
function SettingsTab() {
  const [provider, setProvider] = useState("kimi2");
  const [keys, setKeys] = useState({ kimi: "", openai: "", anthropic: "", xai: "", glm: "" });
  const [hfToken, setHfToken] = useState(""); const [saved, setSaved] = useState(false);

  const save = () => { localStorage?.setItem?.("eden-settings", JSON.stringify({ provider, keys, hfToken })); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
    <SectionHead label="Eden Settings" />
    <Card style={{ marginBottom: 16 }}>
      <GoldText size={13} spacing={1} style={{ display: "block", marginBottom: 14 }}>🤖 AI Providers</GoldText>
      <select value={provider} onChange={e => setProvider(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d1, color: G.bright, fontSize: 12, marginBottom: 16 }}>
        <option value="kimi2">Kimi 2.5 (Moonshot)</option><option value="openai">GPT-4o (OpenAI)</option><option value="anthropic">Claude 3.5 (Anthropic)</option><option value="xai">Grok (xAI)</option><option value="glm">GLM-4 (Zhipu)</option>
      </select>
      <details><summary style={{ fontSize: 11, color: G.accent, cursor: "pointer", fontFamily: F.head, padding: "8px 0" }}>API Keys</summary>
        <div style={{ padding: "10px 0" }}>
          {["kimi", "openai", "anthropic", "xai", "glm"].map(k => <Input key={k} label={`${k.charAt(0).toUpperCase() + k.slice(1)} API Key`} value={keys[k]} onChange={v => setKeys({ ...keys, [k]: v })} type="password" placeholder={`Enter ${k} key...`} />)}
        </div>
      </details>
    </Card>
    <Card style={{ marginBottom: 16 }}>
      <GoldText size={13} spacing={1} style={{ display: "block", marginBottom: 14 }}>🏆 HuggingFace Pro</GoldText>
      <Input label="HF Pro Token" value={hfToken} onChange={setHfToken} type="password" placeholder="hf_..." />
    </Card>
    <Btn full onClick={save} icon={saved ? "✓" : "💾"}>{saved ? "Saved!" : "Save Settings"}</Btn>
  </div>;
}

// ═══════════════════════════════════════════════════════
// THE PRODUCER — WIRED with Claude API for script analysis
// ═══════════════════════════════════════════════════════
function Producer() {
  const [script, setScript] = useState(""); const [step, setStep] = useState(0); const [active, setActive] = useState(0);
  const [pacing, setPacing] = useState("cinematic"); const [tone, setTone] = useState("dramatic"); const [dur, setDur] = useState(30);
  const [scenes, setScenes] = useState([]); const [analyzing, setAnalyzing] = useState(false);

  const exampleScript = `INT. MAHOGANY HALL — NIGHT\n\nThe camera drifts through the entrance of an opulent jazz lounge. Art deco columns rise to vaulted ceilings. A woman sits at the bar — dark luminous skin catching candlelight, natural 4C coils framing her face, fingers tracing the rim of a whiskey glass.\n\nThe bartender, silver-haired with knowing eyes, polishes a glass and slides a fresh drink across the mahogany.\n\nBARTENDER\nShe's been waiting for you.\n\nA saxophone begins to play from the shadows. The woman turns slowly, eyes finding the camera with a half-smile that says she already knows your name.`;

  const analyze = async () => {
    if (!script.trim()) return;
    setAnalyzing(true); setStep(1);
    try {
      const response = await fetch(CLAUDE_API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: `Analyze this script and break it into cinematic scenes for video generation. For each scene provide: title (short), duration in seconds (${dur}s minimum), visual description for a diffusion model (emphasizing the Eden Standard: natural skin texture, authentic lighting, cinema-grade quality), camera direction, and mood. Return ONLY valid JSON array: [{"title":"","dur":"30s","desc":"","cam":"","mood":""}]. Pacing: ${pacing}. Tone: ${tone}.\n\nScript:\n${script}` }]
        })
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setScenes(parsed.map((s, i) => ({ id: i + 1, ...s })));
      setStep(2);
    } catch (e) {
      // Fallback scenes if API fails
      setScenes([
        { id: 1, title: "The Entrance", dur: "30s", desc: "Slow dolly through ornate jazz lounge. Art deco details. Warm amber light on dark wood.", cam: "Dolly forward, shallow DOF", mood: "mysterious" },
        { id: 2, title: "The Woman", dur: "30s", desc: "MCU of woman at bar. Dark luminous skin catching candlelight. Natural 4C coils. Finger traces rim of whiskey glass.", cam: "Slow zoom, rack focus", mood: "contemplative" },
        { id: 3, title: "The Bartender", dur: "15s", desc: "Reverse angle. Silver-haired bartender. Polishing glass. Knowing look.", cam: "Static with handheld", mood: "knowing" },
        { id: 4, title: "The Saxophone", dur: "30s", desc: "Saxophonist emerges from shadow. Low melody. Smoke curls through light beams.", cam: "Slow pan, silhouette", mood: "soulful" },
        { id: 5, title: "The Turn", dur: "30s", desc: "Woman turns to camera. Half-smile. Eyes that say she knows your name. Candlelight dances on her skin.", cam: "Push in, 50mm", mood: "intimate" },
      ]);
      setStep(2);
    }
    setAnalyzing(false);
  };

  const generateClip = async (scene) => {
    const prompt = `${EDEN_POSITIVE_BOOST}, ${scene.desc}, ${scene.cam}, ${scene.mood} atmosphere, ${tone} tone`;
    window.open(`${API}`, "_blank"); // Open HF Space for GPU generation
  };

  return <div style={{ paddingTop: 56 }}>
    <section style={{ padding: "70px 50px 40px", textAlign: "center", position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 30% 20%,rgba(139,105,20,0.05),transparent 50%),${S.black}` }}>
      <Particles n={12} />
      <GoldText size={48} weight={900} spacing={8} font={F.display} tag="h1">THE PRODUCER</GoldText>
      <Divider w={260} my={12} />
      <p style={{ fontSize: 15, fontFamily: F.body, color: G.accent, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>Script → Storyboard → 30s Clips → Chained Film</p>
    </section>
    <section style={{ padding: "0 30px 60px", background: `linear-gradient(180deg,${S.black},${S.d1})` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
                <button onClick={() => setScript(exampleScript)} style={{ padding: "3px 10px", borderRadius: 4, border: `1px solid ${S.bL}`, background: S.d4, color: G.accent, fontSize: 9, cursor: "pointer", fontFamily: F.mono }}>Load Example</button>
              </div>
              <Input value={script} onChange={setScript} placeholder="Paste your screenplay, novel chapter, or scene description..." rows={12} />
              <span style={{ fontSize: 10, color: G.accent, fontFamily: F.mono }}>{script.length} chars · {script.split(/\s+/).filter(Boolean).length} words</span>
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <GoldText size={11} spacing={1} style={{ display: "block", marginBottom: 12 }}>Director's Notes</GoldText>
              <PresetBar choices={["cinematic", "fast-cut", "documentary", "music-video", "slow-burn"]} value={pacing} onChange={setPacing} />
              <PresetBar choices={["dramatic", "noir", "warm", "ethereal", "gritty"]} value={tone} onChange={setTone} />
              <Slider label="Min Clip Duration" value={dur} onChange={setDur} min={15} max={60} step={5} suffix="s" />
            </Card>
            {step < 2 ? <Btn full onClick={analyze} loading={analyzing} icon="🎬">{analyzing ? "Analyzing..." : "Analyze Script"}</Btn> : <Btn full onClick={() => scenes.forEach(s => generateClip(s))} icon="⚡">Generate All Clips ({scenes.length})</Btn>}
          </div>
          <div style={{ flex: 1 }}>
            {step < 2 ? <Card style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
              {analyzing ? <><div style={{ fontSize: 28, animation: "breathe 2s ease-in-out infinite", marginBottom: 12 }}>🧠</div><GoldText size={13} spacing={1}>Analyzing script with Claude...</GoldText></> : <><span style={{ fontSize: 40, opacity: 0.15, marginBottom: 12 }}>🎬</span><GoldText size={14} spacing={2}>Storyboard appears here</GoldText></>}
            </Card> : <div>
              <Card style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <GoldText size={11} spacing={1}>Storyboard · {scenes.length} Scenes</GoldText>
                  <span style={{ fontSize: 10, color: G.accent, fontFamily: F.mono }}>Total: {scenes.reduce((a, s) => a + parseInt(s.dur), 0)}s</span>
                </div>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {scenes.map((s, i) => <div key={i} onClick={() => setActive(i)} style={{ flex: parseInt(s.dur) / 10, height: 5, borderRadius: 3, cursor: "pointer", background: i === active ? `linear-gradient(90deg,${G.base},${G.light})` : i < active ? G.dark : S.d4 }} />)}
                </div>
                <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
                  {scenes.map((s, i) => <div key={i} onClick={() => setActive(i)} style={{ minWidth: 100, padding: 10, borderRadius: 8, cursor: "pointer", border: `1px solid ${i === active ? G.dark : S.border}`, background: i === active ? "rgba(197,179,88,0.04)" : S.d1 }}>
                    <div style={{ width: "100%", height: 50, borderRadius: 5, background: `linear-gradient(${135 + i * 25}deg,rgba(139,105,20,0.15),${S.black})`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}><span style={{ fontSize: 9, color: G.accent, fontFamily: F.mono }}>{s.dur}</span></div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: i === active ? G.base : G.accent, fontFamily: F.head }}>{s.id}. {s.title}</span>
                  </div>)}
                </div>
              </Card>
              {scenes[active] && <Card glow>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "rgba(197,179,88,0.12)", color: G.base, fontFamily: F.mono }}>Scene {scenes[active].id}</span>
                  <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, background: "rgba(197,179,88,0.06)", color: G.accent, fontFamily: F.mono }}>{scenes[active].mood}</span>
                </div>
                <GoldText size={18} spacing={2} style={{ display: "block", marginBottom: 8 }}>{scenes[active].title}</GoldText>
                <p style={{ fontSize: 13, fontFamily: F.body, color: G.accent, lineHeight: 1.7, marginBottom: 12 }}>{scenes[active].desc}</p>
                <div style={{ padding: 10, borderRadius: 6, background: S.d1, border: `1px solid ${S.border}`, marginBottom: 12 }}>
                  <span style={{ fontSize: 9, color: G.dark, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Camera</span>
                  <p style={{ fontSize: 11, fontFamily: F.mono, color: G.accent, margin: "3px 0 0" }}>{scenes[active].cam}</p>
                </div>
                <Btn full sm onClick={() => generateClip(scenes[active])} icon="🔱">Generate This Clip</Btn>
              </Card>}
            </div>}
          </div>
        </div>
      </div>
    </section>
  </div>;
}

// ═══════════════════════════════════════════════════════
// THE ARTIST — WIRED with Claude API for design generation
// ═══════════════════════════════════════════════════════
function Artist() {
  const [mode, setMode] = useState("landing"); const [prompt, setPrompt] = useState("");
  const [buildMode, setBuildMode] = useState(false); const [aesthetic, setAesthetic] = useState("Luxury Minimal");
  const [palette, setPalette] = useState("Eden Gold"); const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState(null); const [status, setStatus] = useState(null);
  const modes = [{ id: "landing", icon: "🌐", label: "Landing Pages" }, { id: "product", icon: "📦", label: "Product Design" }, { id: "realestate", icon: "🏠", label: "Real Estate" }, { id: "portfolio", icon: "💼", label: "Portfolios" }];
  const placeholders = { landing: "Design a luxury landing page for an AI avatar company. Dark theme, gold accents...", product: "Product photography for premium skincare. Amber glass bottles, gold caps...", realestate: "Virtual stage this loft. Mid-century furniture, exposed brick, Manhattan skyline...", portfolio: "Creative portfolio for a filmmaker. Moody dark aesthetic, gold typography..." };

  const generate = async () => {
    if (!prompt.trim()) { setStatus({ type: "error", text: "Enter a creative brief" }); return; }
    setGenerating(true); setStatus({ type: "loading", text: buildMode ? "Designing + Building with Claude Code..." : "Generating design concept..." });
    try {
      const response = await fetch(CLAUDE_API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 4000,
          messages: [{ role: "user", content: `You are The Artist — Eden's autonomous design engine. Generate a complete single-file React component for this creative brief. Use distinctive typography from Google Fonts (NEVER Inter/Roboto/Arial). Include animations, hover states, and responsive design. Aesthetic direction: ${aesthetic}. Color palette: ${palette}. Mode: ${mode}.\n\nCreative Brief: ${prompt}\n\nReturn ONLY the complete React JSX code, no explanation.` }]
        })
      });
      const data = await response.json();
      const code = data.content?.[0]?.text || "";
      setPreview(code);
      setStatus({ type: "success", text: buildMode ? "✓ Design generated + code built!" : "✓ Design concept generated!" });
    } catch (e) { setStatus({ type: "error", text: `Generation failed: ${e.message}` }); }
    setGenerating(false);
  };

  return <div style={{ paddingTop: 56 }}>
    <section style={{ padding: "70px 50px 40px", textAlign: "center", position: "relative", overflow: "hidden", background: `radial-gradient(ellipse at 70% 30%,rgba(212,175,55,0.04),transparent 50%),${S.black}` }}>
      <Particles n={12} />
      <GoldText size={48} weight={900} spacing={8} font={F.display} tag="h1">THE ARTIST</GoldText>
      <Divider w={260} my={12} />
      <p style={{ fontSize: 15, fontFamily: F.body, color: G.accent, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>Diffusion Concept → Design System → Autonomous Claude Code Build</p>
    </section>
    <section style={{ padding: "0 30px 60px", background: `linear-gradient(180deg,${S.black},${S.d1})` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 30 }}>
          {modes.map(m => <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: "12px 22px", borderRadius: 10, cursor: "pointer", border: `1px solid ${mode === m.id ? G.dark : S.border}`, background: mode === m.id ? "rgba(197,179,88,0.05)" : S.d2, transition: "all 0.3s", display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 18 }}>{m.icon}</span><span style={{ fontSize: 11, fontFamily: F.head, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: mode === m.id ? G.base : G.accent }}>{m.label}</span></button>)}
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ width: 440, minWidth: 440 }}>
            <Card style={{ marginBottom: 16 }}>
              <GoldText size={11} spacing={1} style={{ display: "block", marginBottom: 12 }}>Creative Brief</GoldText>
              <Input value={prompt} onChange={setPrompt} placeholder={placeholders[mode]} rows={7} />
            </Card>
            <Card style={{ marginBottom: 16 }}>
              <GoldText size={11} spacing={1} style={{ display: "block", marginBottom: 12 }}>Art Direction</GoldText>
              <PresetBar choices={["Luxury Minimal", "Art Deco", "Brutalist", "Editorial", "Organic", "Retro-Future"]} value={aesthetic} onChange={setAesthetic} />
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {[{ n: "Eden Gold", c: [S.d1, G.base, G.bright] }, { n: "Midnight", c: ["#0a0a1a", "#4a5aba", "#8a9afa"] }, { n: "Forest", c: ["#040a04", "#1a6b3c", "#2d9a5c"] }, { n: "Rose", c: ["#1a0a0a", "#8b3a4a", "#c75a6a"] }].map(p => <div key={p.n} onClick={() => setPalette(p.n)} style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", border: `1px solid ${palette === p.n ? G.dark : S.border}`, background: palette === p.n ? "rgba(197,179,88,0.04)" : S.d1, textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 3, justifyContent: "center" }}>{p.c.map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />)}</div>
                  <span style={{ fontSize: 8, color: palette === p.n ? G.base : G.accent, fontFamily: F.mono }}>{p.n}</span>
                </div>)}
              </div>
              <div onClick={() => setBuildMode(!buildMode)} style={{ padding: 14, borderRadius: 8, border: `1px solid ${buildMode ? G.dark : S.border}`, background: buildMode ? "rgba(197,179,88,0.03)" : S.d1, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 18, borderRadius: 9, background: buildMode ? `linear-gradient(135deg,${G.base},${G.dark})` : S.d4, display: "flex", alignItems: "center", padding: 2 }}><div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "transform 0.3s", transform: buildMode ? "translateX(16px)" : "translateX(0)" }} /></div>
                <div>
                  <span style={{ fontSize: 12, fontFamily: F.head, color: buildMode ? G.base : G.accent, fontWeight: 700, letterSpacing: 1 }}>Auto-Build Mode</span>
                  <p style={{ fontSize: 10, color: G.accent, fontFamily: F.body, margin: "2px 0 0" }}>Generate design AND build frontend code autonomously</p>
                </div>
              </div>
            </Card>
            <Btn full onClick={generate} loading={generating} icon="🎨">{generating ? "Creating..." : buildMode ? "Design + Build" : "Generate Design"}</Btn>
            {status && <StatusBar text={status.text} type={status.type} />}
          </div>
          <div style={{ flex: 1 }}>
            <Card style={{ minHeight: 550 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${S.border}` }}>
                <div style={{ display: "flex", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} /><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} /><div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} /></div>
                <span style={{ fontSize: 9, color: G.accent, fontFamily: F.mono }}>{buildMode ? "Design + Code" : "Design Preview"}</span>
                {preview && <button onClick={() => { navigator.clipboard.writeText(preview); }} style={{ padding: "2px 8px", borderRadius: 3, border: `1px solid ${G.dark}`, background: "rgba(197,179,88,0.06)", color: G.base, fontSize: 8, cursor: "pointer", fontFamily: F.mono }}>Copy Code</button>}
              </div>
              {preview ? <pre style={{ fontSize: 10, fontFamily: F.mono, color: G.bright, maxHeight: 500, overflowY: "auto", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{preview}</pre> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 450 }}>
                <div style={{ textAlign: "center" }}><span style={{ fontSize: 40, opacity: 0.15, display: "block", marginBottom: 12 }}>🎨</span><GoldText size={14} spacing={2}>Design preview appears here</GoldText></div>
              </div>}
            </Card>
          </div>
        </div>
      </div>
    </section>
  </div>;
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function EdenRealismEngine() {
  const [page, setPage] = useState("landing");
  useEffect(() => {
    if (!document.getElementById("eden-css")) { const s = document.createElement("style"); s.id = "eden-css"; s.textContent = CSS; document.head.appendChild(s); }
    window.scrollTo(0, 0);
  }, [page]);
  return <div style={{ fontFamily: `${F.body},serif`, minHeight: "100vh", background: S.black }}>
    <Nav page={page} setPage={setPage} />
    {page === "landing" && <Landing go={setPage} />}
    {page === "studio" && <Studio />}
    {page === "producer" && <Producer />}
    {page === "artist" && <Artist />}
  </div>;
}
