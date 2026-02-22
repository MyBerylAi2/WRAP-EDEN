import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// EDEN PULSE — THE RELENTLESS EYE v2.0
// Research Intelligence Dashboard · Beryl AI Labs
// 7 HEARTBEATS + 1 DIRECTOR · Microsoft Agent Framework
// CNN/Bloomberg-Grade AI Research Command Center
// ═══════════════════════════════════════════════════════════════

const C = {
  bg: "#080503", bgCard: "rgba(18,12,8,0.95)", bgCardHover: "rgba(28,18,10,0.98)",
  bgSurface: "rgba(12,8,4,0.98)", bgInput: "rgba(197,179,88,0.03)",
  gold: "#C5B358", goldBright: "#F5E6A3", goldDark: "#8B6914", goldMid: "#D4AF37",
  green: "#4CAF50", greenBright: "#81C784", greenDark: "#1B5E20", greenVibrant: "#00E676",
  red: "#EF5350", redDark: "#C62828", orange: "#FF9800", orangeDark: "#E65100",
  cyan: "#00BCD4", cyanDark: "#006064", purple: "#AB47BC", purpleDark: "#6A1B9A",
  pink: "#EC407A", teal: "#26A69A",
  border: "rgba(197,179,88,0.12)", borderGreen: "rgba(76,175,80,0.15)",
  text: "#E8DCC8", textDim: "#8B7355", textBright: "#F5F0E8",
};

// ═══════════════════════════════════════
// THE TEAM — 1 Director + 7 Heartbeats
// ═══════════════════════════════════════

const DIRECTOR = {
  id: "director", name: "Dr. Wendy Okonkwo", title: "DIRECTOR",
  role: "Director of Eden Pulse", specialty: "Department oversight, research strategy, pipeline governance, investor genesis notes, cross-agent coordination",
  color: C.gold, photo: "/portraits/wendy_okonkwo_director.png",
  model: "Claude API (Opus)", phd: "AI Research Strategy, Carnegie Mellon",
  status: "active", uptime: "99.9%", last_scan: "always on",
  stat1: { label: "Directives Issued", value: "412" },
  stat2: { label: "Genesis Notes", value: "34" },
  stat3: { label: "Dept. Efficiency", value: "97%" },
  section: "DEPARTMENT OVERVIEW — Manages all 7 Heartbeats, sets research priorities, approves triage submissions, writes genesis governance notes for investors"
};

const AGENTS = [
  {
    id: "archivist", name: "Dr. Amara Okafor", title: "THE ARCHIVIST",
    role: "Excavator of Truth", specialty: "Paper extraction, model card analysis, quantization specs, safetensors metadata, arxiv deep-dive, capability card generation",
    color: C.gold, photo: "/portraits/amara_okafor_archivist.png",
    model: "Qwen/Qwen2.5-3B-Instruct", phd: "Computational Linguistics, MIT",
    status: "active", uptime: "99.7%", last_scan: "12 min ago",
    stat1: { label: "Papers Processed", value: "847" },
    stat2: { label: "Models Indexed", value: "312" },
    stat3: { label: "Capability Cards", value: "289" },
    section: "PAPER VAULT + ALLUVIAL FEED (extraction) — Processes every research paper, model card, and GitHub repo into structured capability cards"
  },
  {
    id: "analyst", name: "Dr. Suki Tanaka", title: "THE ANALYST",
    role: "Engineer of Logic", specialty: "Compatibility graphs, VRAM feasibility, risk matrices, failure mode analysis, cross-model alignment testing",
    color: C.cyan, photo: "/portraits/suki_tanaka_analyst.png",
    model: "microsoft/Phi-3.5-mini-instruct", phd: "Systems Engineering, Stanford",
    status: "active", uptime: "99.4%", last_scan: "8 min ago",
    stat1: { label: "Compatibility Tests", value: "1,203" },
    stat2: { label: "Risk Flags", value: "28" },
    stat3: { label: "Feasibility Scores", value: "534" },
    section: "LAYING PIPE (validation) + WARNINGS — Runs compatibility tests, generates feasibility scores, flags security risks and benchmark discrepancies"
  },
  {
    id: "prophet", name: "Dr. Nia Mensah", title: "THE PROPHET",
    role: "The Future-Seer", specialty: "Trend prediction, adoption curves, GPU cost forecasting, hype cycle positioning, market impact analysis",
    color: C.purple, photo: "/portraits/nia_mensah_prophet.png",
    model: "Qwen/Qwen2.5-3B-Instruct", phd: "Predictive Analytics, Oxford",
    status: "active", uptime: "99.1%", last_scan: "22 min ago",
    stat1: { label: "Predictions Made", value: "156" },
    stat2: { label: "Accuracy Rate", value: "87%" },
    stat3: { label: "Spike Alerts", value: "43" },
    section: "PULSE RADAR + FORECASTS — Tracks trending models, predicts adoption curves, monitors GPU cost trajectories, issues spike probability alerts"
  },
  {
    id: "synthesist", name: "Dr. Zara Petrov", title: "THE SYNTHESIST",
    role: "The Inventor", specialty: "Pipeline blueprints, model merges, hybrid architectures, probability scoring, component optimization",
    color: C.greenVibrant, photo: "/portraits/zara_petrov_synthesist.png",
    model: "Qwen/Qwen2.5-Coder-3B-Instruct", phd: "Multimodal AI Systems, ETH Zurich",
    status: "active", uptime: "99.8%", last_scan: "5 min ago",
    stat1: { label: "Pipelines Created", value: "89" },
    stat2: { label: "Merges Designed", value: "34" },
    stat3: { label: "Blueprints Active", value: "12" },
    section: "LAYING PIPE (creation) — Designs new pipeline architectures, calculates probability scores, creates hybrid model merges, proposes optimizations"
  },
  {
    id: "journalist", name: "Dr. Lena Adeyemi", title: "THE JOURNALIST",
    role: "Voice of Eden", specialty: "Intelligence reports, article writing, triage payloads, master prompts, stakeholder communications, weekly digests",
    color: C.orange, photo: "/portraits/lena_adeyemi_journalist.png",
    model: "Qwen/Qwen2.5-3B-Instruct", phd: "Science Communication, Columbia",
    status: "active", uptime: "99.5%", last_scan: "3 min ago",
    stat1: { label: "Articles Written", value: "234" },
    stat2: { label: "Triage Briefs", value: "67" },
    stat3: { label: "Weekly Digests", value: "18" },
    section: "ALLUVIAL FEED (writing) + WEEKLY REPORTS — Writes all intelligence articles, weekly digests, triage payloads, and master prompts for Studio"
  },
  {
    id: "curator", name: "Dr. Mei-Lin Chen", title: "THE CURATOR",
    role: "Keeper of Knowledge", specialty: "Knowledge base management, paper vault organization, Google Drive sync, taxonomy and tagging, research archive maintenance",
    color: C.teal, photo: "/portraits/mei_lin_chen_curator.png",
    model: "Qwen/Qwen2.5-3B-Instruct", phd: "Information Science, UC Berkeley",
    status: "active", uptime: "99.6%", last_scan: "15 min ago",
    stat1: { label: "Papers Archived", value: "1,847" },
    stat2: { label: "Tags Maintained", value: "156" },
    stat3: { label: "Drive Syncs", value: "89" },
    section: "PAPER VAULT + KNOWLEDGE BASE — Organizes research archive, maintains taxonomy, syncs Google Drive folders, ensures no paper is lost or misfiled"
  },
  {
    id: "sentinel", name: "Dr. Priya Sharma", title: "THE SENTINEL",
    role: "Guardian of Quality", specialty: "0.3 Deviation Rule enforcement, anti-AI detection, security scanning, data leak monitoring, benchmark verification",
    color: C.pink, photo: "/portraits/priya_sharma_sentinel.png",
    model: "microsoft/Phi-3.5-mini-instruct", phd: "Cybersecurity & AI Safety, IIT Delhi",
    status: "active", uptime: "99.3%", last_scan: "2 min ago",
    stat1: { label: "Quality Checks", value: "2,103" },
    stat2: { label: "Threats Blocked", value: "47" },
    stat3: { label: "0.3 Rule Passes", value: "891" },
    section: "SECURITY + QUALITY ASSURANCE — Enforces the 0.3 Deviation Rule, scans for data leaks, verifies benchmarks, guards the 'Real as Fuck' standard"
  },
];

const ALL_TEAM = [DIRECTOR, ...AGENTS];

const BREAKING = [
  { id: 1, tag: "BREAKING", title: "FLUX.2 Achieves Human-Parity Skin Texture at 4-bit Quantization — Priya Validated via 0.3 Rule", time: "2h ago", agent: "sentinel", priority: "critical", category: "Image Gen", spike: 0.94, views: "2.4K" },
  { id: 2, tag: "LAYING PIPE", title: "Zara's New Pipeline: Chatterbox → KDTalker Chain Achieves 180ms Latency", time: "5h ago", agent: "synthesist", priority: "high", category: "4D Avatar", spike: 0.87, views: "1.8K" },
  { id: 3, tag: "UNDER INVESTIGATION", title: "Suki Flags CogVideo X-2: Claims 60fps But Benchmarks Show 24fps Real-World", time: "8h ago", agent: "analyst", priority: "medium", category: "Video Gen", spike: 0.62, views: "956" },
  { id: 4, tag: "FORECAST", title: "Nia Predicts 30% A100 Cost Drop by Q2 — Budget Impact Brief from Lena", time: "12h ago", agent: "prophet", priority: "high", category: "Economics", spike: 0.71, views: "1.2K" },
  { id: 5, tag: "ARCHIVED", title: "Mei-Lin Completed 2026 Paper Vault Sync — 47 New Papers Indexed This Week", time: "1d ago", agent: "curator", priority: "medium", category: "Knowledge Base", spike: 0.55, views: "678" },
];

const ARTICLES = [
  { id: 1, title: "SOUL v2 Drops: 1M Training Samples Now Open-Source — Amara's Full Capability Card Inside", subtitle: "The model that powers next-gen digital humans just got accessible. Archivist extracted every equation.", category: "Face Animation", agent: "archivist", time: "Today", readTime: "8 min", priority: "critical", tags: ["soul", "open-source", "lip-sync"], feasibility: 92, trending: true, gradient: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #C5B358 100%)" },
  { id: 2, title: "Why BitNet b1.58 Changes Everything for Consumer 4D Avatars", subtitle: "70B on a single 4090 — Nia's 90-day forecast says this is the one. Prophet confidence: 87%.", category: "Quantization", agent: "prophet", time: "Today", readTime: "12 min", priority: "high", tags: ["bitnet", "quantization", "consumer-gpu"], feasibility: 78, trending: true, gradient: "linear-gradient(135deg, #6A1B9A 0%, #AB47BC 40%, #C5B358 100%)" },
  { id: 3, title: "Pipeline Blueprint: The Sub-200ms Conversational Avatar Stack", subtitle: "Zara's masterpiece: Whisper → BitNet-3B → Chatterbox → TELLER at 25fps. Probability score: 85.", category: "Pipeline", agent: "synthesist", time: "Yesterday", readTime: "15 min", priority: "critical", tags: ["pipeline", "avatar", "sub-200ms"], feasibility: 85, trending: false, gradient: "linear-gradient(135deg, #006064 0%, #00E676 40%, #1B5E20 100%)" },
  { id: 4, title: "TELLER vs KDTalker vs MEMO: Suki's Definitive Benchmark", subtitle: "All three through the 0.3 Deviation Rule — Priya co-signed. Only one survived.", category: "Benchmark", agent: "analyst", time: "Yesterday", readTime: "10 min", priority: "high", tags: ["benchmark", "teller", "kdtalker"], feasibility: 91, trending: true, gradient: "linear-gradient(135deg, #C62828 0%, #EF5350 40%, #FF9800 100%)" },
  { id: 5, title: "This Week in AI: 7 Models You Need to Know — Lena's Weekly Digest", subtitle: "Vision-language to audio-driven animation — the Journalist's curated intelligence brief.", category: "Weekly Digest", agent: "journalist", time: "Feb 21", readTime: "6 min", priority: "medium", tags: ["weekly", "digest", "trending"], feasibility: null, trending: false, gradient: "linear-gradient(135deg, #E65100 0%, #FF9800 40%, #C5B358 100%)" },
  { id: 6, title: "LoRA Stacking for Melanin-Rich Skin: Our Protocol Beats CivitAI Top 10", subtitle: "Amara extracted the technique, Priya validated against 0.3 Rule. Result: undetectable.", category: "ERE-1", agent: "archivist", time: "Feb 20", readTime: "9 min", priority: "high", tags: ["lora", "skin-texture", "melanin"], feasibility: 96, trending: false, gradient: "linear-gradient(135deg, #8B6914 0%, #C5B358 40%, #4CAF50 100%)" },
  { id: 7, title: "Paper Vault 2026: Mei-Lin's Complete Archive Now Searchable", subtitle: "1,847 papers organized by category, date, and capability. Google Drive synced and tagged.", category: "Knowledge Base", agent: "curator", time: "Feb 19", readTime: "5 min", priority: "medium", tags: ["archive", "papers", "vault"], feasibility: null, trending: false, gradient: "linear-gradient(135deg, #00695C 0%, #26A69A 40%, #C5B358 100%)" },
  { id: 8, title: "DANGER: MuseTalk Fork Has Silent Data Leak — Priya's Full Report", subtitle: "Sentinel flagged unauthorized telemetry in v2.3.1 — patch and risk matrix included.", category: "Security", agent: "sentinel", time: "Feb 18", readTime: "4 min", priority: "critical", tags: ["security", "musetalk", "data-leak"], feasibility: null, trending: false, gradient: "linear-gradient(135deg, #880E4F 0%, #EC407A 40%, #C62828 100%)" },
];

const TRENDING = [
  { name: "TELLER", cat: "Face Anim", spike: 0.94, dir: "up", chg: "+12%" },
  { name: "FLUX.2-dev", cat: "Image Gen", spike: 0.92, dir: "up", chg: "+15%" },
  { name: "BitNet b1.58", cat: "Quant", spike: 0.91, dir: "up", chg: "+22%" },
  { name: "Chatterbox", cat: "TTS", spike: 0.89, dir: "up", chg: "+8%" },
  { name: "Wan 2.2-5B", cat: "Video Gen", spike: 0.86, dir: "up", chg: "+6%" },
  { name: "MEMO", cat: "Emotion", spike: 0.83, dir: "up", chg: "+9%" },
  { name: "KDTalker", cat: "Lip Sync", spike: 0.81, dir: "stable", chg: "+2%" },
  { name: "LongLive-1.3B", cat: "Long Vid", spike: 0.77, dir: "down", chg: "-3%" },
];

const PIPELINES = [
  { name: "ERE-1 Cascade", desc: "FLUX.2 → Skin LoRA → RealVis Face → UltraSharp → Anti-Detect", score: 94, status: "production", gpu: "A10G", fps: null, lat: "8.2s" },
  { name: "EVE 4D v2", desc: "Claude Brain → Chatterbox TTS → KDTalker → WebRTC Stream", score: 87, status: "validated", gpu: "A10G", fps: 25, lat: "180ms" },
  { name: "Voice Clone Pipeline", desc: "Upload WAV → Chatterbox Clone → F5-TTS Verify → Emotion Layer", score: 81, status: "validated", gpu: "T4", fps: null, lat: "2.1s" },
  { name: "Sub-200ms Streamer", desc: "BitNet-3B → XTTS-v2 → TELLER 25fps → WebSocket", score: 72, status: "testing", gpu: "RTX 4090", fps: 25, lat: "148ms" },
  { name: "Lulu Content Engine", desc: "Wan 2.2 → FlashVSR 4K → Anti-Detect → CDN Delivery", score: 68, status: "investigation", gpu: "A100", fps: 24, lat: "12s" },
];

// ─── Micro Components ───

const PulseRing = ({ value, size = 40 }) => {
  const pct = Math.round(value * 100);
  const color = pct >= 85 ? C.greenVibrant : pct >= 70 ? C.gold : pct >= 50 ? C.orange : C.red;
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(197,179,88,0.06)" strokeWidth="3" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${circ * pct / 100} ${circ * (1 - pct / 100)}`}
          strokeLinecap="round" style={{ transition: "all 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.3, fontFamily: "'Cinzel', serif", color, fontWeight: 700 }}>{pct}</div>
    </div>
  );
};

const Badge = ({ text, color }) => (
  <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 9, fontFamily: "'Cinzel', serif", letterSpacing: 2, textTransform: "uppercase", background: `${color}18`, border: `1px solid ${color}33`, color, whiteSpace: "nowrap" }}>{text}</span>
);

const AgentPhoto = ({ agentId, size = 32 }) => {
  const a = ALL_TEAM.find(x => x.id === agentId) || AGENTS[0];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", border: `2px solid ${a.color}40`, flexShrink: 0, position: "relative" }}>
      <img src={a.photo} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={(e) => { e.target.style.display = "none"; e.target.parentElement.style.background = `${a.color}15`; e.target.parentElement.innerHTML = `<span style="display:flex;align-items:center;justify-content:center;height:100%;font-size:${size*0.45}px">${a.title.charAt(4)}</span>`; }} />
    </div>
  );
};

const StatusDot = ({ color = C.greenVibrant, size = 8 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color, boxShadow: `0 0 ${size}px ${color}`, animation: "pulse 2s infinite", flexShrink: 0 }} />
);

const SectionHead = ({ children }) => (
  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 4, color: C.textDim, textTransform: "uppercase", marginBottom: 18, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>{children}</div>
);

// ─── MAIN DASHBOARD ───

export default function EdenPulseDashboard() {
  const [tab, setTab] = useState("feed");
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const tabs = [
    { id: "feed", label: "ALLUVIAL FEED", icon: "📡" },
    { id: "team", label: "THE HEARTBEATS", icon: "💜" },
    { id: "pipes", label: "LAYING PIPE", icon: "🔧" },
    { id: "radar", label: "PULSE RADAR", icon: "📊" },
    { id: "vault", label: "PAPER VAULT", icon: "📄" },
    { id: "triage", label: "TRIAGE QUEUE", icon: "🔬" },
  ];

  const ticker = [
    "🔴 FLUX.2 4-bit quant validated by Priya via 0.3 Rule — matches fp16 quality",
    "🟢 Zara's Chatterbox → KDTalker pipeline hits 180ms — ready for triage",
    "🟡 Suki investigating CogVideo X-2 benchmark discrepancy",
    "🔵 Nia: BitNet adoption spike +22% weekly — Prophet confidence HIGH",
    "🟢 Mei-Lin completed 2026 paper vault sync — 47 new papers",
    "🔴 Priya flagged MuseTalk v2.3.1 data leak — patch issued",
    "🟡 Amara extracted SOUL v2 capability card — 1M sample dataset",
    "🟢 Lena published weekly digest — 7 trending models covered",
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Cormorant Garamond', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        @keyframes ticker { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes glow { 0%,100% { box-shadow:0 0 8px rgba(197,179,88,0.08) } 50% { box-shadow:0 0 20px rgba(197,179,88,0.18) } }
        * { box-sizing:border-box; margin:0; padding:0 }
        ::-webkit-scrollbar { width:5px } ::-webkit-scrollbar-thumb { background:rgba(197,179,88,0.12); border-radius:3px }
        .card-hover:hover { border-color: rgba(197,179,88,0.28) !important; transform: translateY(-2px) }
      `}</style>

      {/* ═══ HEADER ═══ */}
      <div style={{ background: C.bgSurface, borderBottom: `1px solid ${C.border}`, padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <StatusDot size={12} />
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 18, letterSpacing: 8, color: C.gold, fontWeight: 600 }}>EDEN PULSE</span>
              <span style={{ fontSize: 10, letterSpacing: 2, color: C.goldDark, fontFamily: "'Cinzel', serif" }}>v2.0</span>
            </div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: C.textDim, textTransform: "uppercase", marginTop: 2 }}>THE RELENTLESS EYE · BERYL AI LABS · RESEARCH INTELLIGENCE DIVISION</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.textDim }}>{now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: C.gold, letterSpacing: 3, fontWeight: 600 }}>{now.toLocaleTimeString("en-US", { hour12: false })}</div>
          </div>
          <div style={{ height: 40, width: 1, background: C.border }} />
          <div style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(0,230,118,0.06)", border: `1px solid rgba(0,230,118,0.15)` }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: C.greenVibrant, fontFamily: "'Cinzel', serif", fontWeight: 600 }}>8 TEAM MEMBERS ONLINE</div>
            <div style={{ fontSize: 8, color: C.greenBright, letterSpacing: 1, marginTop: 2 }}>1 DIRECTOR · 7 HEARTBEATS · AGENT FRAMEWORK</div>
          </div>
        </div>
      </div>

      {/* ═══ DIRECTOR BAR ═══ */}
      <div style={{ background: "rgba(197,179,88,0.04)", borderBottom: `1px solid ${C.border}`, padding: "8px 28px", display: "flex", alignItems: "center", gap: 14 }}>
        <AgentPhoto agentId="director" size={36} />
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: C.gold }}>DEPARTMENT DIRECTOR</span>
          <span style={{ fontSize: 12, color: C.textBright, marginLeft: 12 }}>{DIRECTOR.name}, Ph.D.</span>
          <span style={{ fontSize: 10, color: C.textDim, marginLeft: 8, fontStyle: "italic" }}>"{DIRECTOR.role}"</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {[DIRECTOR.stat1, DIRECTOR.stat2, DIRECTOR.stat3].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontFamily: "'Cinzel', serif", color: C.gold, fontWeight: 600 }}>{s.value}</div>
              <div style={{ fontSize: 8, color: C.textDim, letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ TICKER ═══ */}
      <div style={{ background: "rgba(197,179,88,0.02)", borderBottom: `1px solid ${C.border}`, padding: "6px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "ticker 90s linear infinite" }}>
          {[...ticker, ...ticker].map((t, i) => <span key={i} style={{ fontSize: 12, color: C.textDim, marginRight: 50 }}>{t}</span>)}
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: "rgba(12,8,4,0.6)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "11px 20px", background: tab === t.id ? "rgba(197,179,88,0.04)" : "none", border: "none", cursor: "pointer",
            fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
            color: tab === t.id ? C.gold : C.textDim,
            borderBottom: tab === t.id ? `2px solid ${C.gold}` : "2px solid transparent",
            transition: "all 0.3s", display: "flex", alignItems: "center", gap: 5,
          }}><span style={{ fontSize: 11 }}>{t.icon}</span>{t.label}</button>
        ))}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", minHeight: "calc(100vh - 185px)" }}>

        {/* LEFT */}
        <div style={{ padding: 24, overflowY: "auto", maxHeight: "calc(100vh - 185px)" }}>

          {/* ═══ ALLUVIAL FEED ═══ */}
          {tab === "feed" && <>
            <SectionHead>BREAKING INTELLIGENCE</SectionHead>
            {BREAKING.map((item, i) => {
              const colors = { BREAKING: C.red, "LAYING PIPE": C.greenVibrant, "UNDER INVESTIGATION": C.orange, FORECAST: C.purple, ARCHIVED: C.teal };
              return (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "10px 14px",
                  background: i === 0 ? "rgba(239,83,80,0.04)" : "rgba(197,179,88,0.01)",
                  border: `1px solid ${i === 0 ? "rgba(239,83,80,0.12)" : C.border}`,
                  borderRadius: 10, marginBottom: 6, animation: `fadeUp 0.5s ease ${i * 0.06}s both`, cursor: "pointer",
                }}>
                  <Badge text={item.tag === "BREAKING" ? `🔴 ${item.tag}` : item.tag} color={colors[item.tag]} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.textBright, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                    <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{item.category} · {item.time} · {item.views} views</div>
                  </div>
                  <PulseRing value={item.spike} size={32} />
                  <AgentPhoto agentId={item.agent} size={28} />
                </div>
              );
            })}

            <div style={{ height: 24 }} />
            <SectionHead>FEATURED INTELLIGENCE</SectionHead>
            {/* HERO */}
            <div style={{ background: ARTICLES[0].gradient, borderRadius: 16, padding: 30, marginBottom: 24, border: `1px solid rgba(197,179,88,0.15)`, position: "relative", overflow: "hidden", cursor: "pointer", animation: "fadeUp 0.6s ease both" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,5,3,0.96) 0%, rgba(8,5,3,0.4) 40%, transparent 100%)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  <Badge text={ARTICLES[0].priority} color={C.red} />
                  <Badge text={ARTICLES[0].category} color={C.goldBright} />
                  <Badge text="🔥 TRENDING" color={C.greenVibrant} />
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 600, color: "#fff", lineHeight: 1.25, marginBottom: 10, maxWidth: "85%" }}>{ARTICLES[0].title}</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", fontStyle: "italic", marginBottom: 16, maxWidth: "80%" }}>{ARTICLES[0].subtitle}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <AgentPhoto agentId={ARTICLES[0].agent} size={28} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{AGENTS.find(a => a.id === ARTICLES[0].agent)?.name} · {ARTICLES[0].readTime} · {ARTICLES[0].time}</span>
                  {ARTICLES[0].feasibility && <div style={{ marginLeft: "auto" }}><PulseRing value={ARTICLES[0].feasibility / 100} size={48} /></div>}
                </div>
              </div>
            </div>

            <SectionHead>LATEST REPORTS</SectionHead>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {ARTICLES.slice(1).map((a, i) => (
                <div key={a.id} className="card-hover" style={{
                  background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14,
                  overflow: "hidden", cursor: "pointer", transition: "all 0.35s", animation: `fadeUp 0.5s ease ${(i+1)*0.06}s both`,
                }}>
                  <div style={{ height: 105, background: a.gradient, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18,12,8,0.65) 0%, transparent 55%)" }} />
                    {a.feasibility && <div style={{ position: "absolute", top: 8, left: 8 }}><PulseRing value={a.feasibility/100} size={28} /></div>}
                    {a.trending && <div style={{ position: "absolute", top: 8, right: 8 }}><Badge text="🔥" color={C.greenVibrant} /></div>}
                    <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: 4 }}>
                      <Badge text={a.priority} color={{ critical: C.red, high: C.orange, medium: C.gold }[a.priority]} />
                      <Badge text={a.category} color={C.goldBright} />
                    </div>
                  </div>
                  <div style={{ padding: "11px 13px 13px" }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12.5, fontWeight: 600, color: C.textBright, lineHeight: 1.3, marginBottom: 5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.4, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.subtitle}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <AgentPhoto agentId={a.agent} size={22} />
                      <span style={{ fontSize: 10, color: C.textDim }}>{ALL_TEAM.find(x => x.id === a.agent)?.name?.split(" ").slice(-1)}</span>
                      <span style={{ fontSize: 10, color: C.textDim, marginLeft: "auto" }}>{a.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>}

          {/* ═══ THE HEARTBEATS ═══ */}
          {tab === "team" && <>
            <SectionHead>DEPARTMENT LEADERSHIP</SectionHead>
            {/* DIRECTOR CARD */}
            <div style={{ background: "rgba(197,179,88,0.03)", border: `2px solid ${C.gold}25`, borderRadius: 18, padding: 26, marginBottom: 28, display: "grid", gridTemplateColumns: "110px 1fr 220px", gap: 24, alignItems: "center", animation: "fadeUp 0.5s ease both" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.gold}50`, boxShadow: `0 0 30px ${C.gold}15` }}>
                  <img src={DIRECTOR.photo} alt={DIRECTOR.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <StatusDot size={8} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, letterSpacing: 4, color: C.gold, fontWeight: 700 }}>👑 {DIRECTOR.title}</span>
                  <Badge text="LEADERSHIP" color={C.gold} />
                </div>
                <div style={{ fontSize: 20, fontWeight: 500, color: C.textBright }}>{DIRECTOR.name}, Ph.D.</div>
                <div style={{ fontSize: 11, color: C.textDim, fontStyle: "italic", marginTop: 2 }}>{DIRECTOR.phd}</div>
                <div style={{ fontSize: 12, color: C.textDim, marginTop: 8, lineHeight: 1.5 }}>{DIRECTOR.specialty}</div>
                <div style={{ fontSize: 11, color: C.goldDark, marginTop: 8, padding: "6px 10px", background: "rgba(197,179,88,0.04)", borderRadius: 6, border: `1px solid ${C.border}` }}>📌 {DIRECTOR.section}</div>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {[DIRECTOR.stat1, DIRECTOR.stat2, DIRECTOR.stat3].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                    <span style={{ fontSize: 10, color: C.textDim }}>{s.label}</span>
                    <span style={{ fontSize: 12, fontFamily: "'Cinzel', serif", color: C.gold, fontWeight: 700 }}>{s.value}</span>
                  </div>
                ))}
                <Badge text={DIRECTOR.model} color={C.gold} />
              </div>
            </div>

            <SectionHead>THE 7 HEARTBEATS — RESEARCH AGENTS</SectionHead>
            {AGENTS.map((a, i) => (
              <div key={a.id} style={{
                background: C.bgCard, border: `1px solid ${a.color}20`, borderRadius: 16, padding: 22, marginBottom: 14,
                display: "grid", gridTemplateColumns: "90px 1fr 200px", gap: 22, alignItems: "center",
                animation: `fadeUp 0.5s ease ${(i+1)*0.08}s both`, transition: "all 0.3s",
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 76, height: 76, borderRadius: "50%", overflow: "hidden", border: `2px solid ${a.color}35`, boxShadow: `0 0 20px ${a.color}10` }}>
                    <img src={a.photo} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <StatusDot size={6} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 4, color: a.color, fontWeight: 600 }}>{a.title}</div>
                  <div style={{ fontSize: 18, fontWeight: 500, color: C.textBright, marginTop: 2 }}>{a.name}, Ph.D.</div>
                  <div style={{ fontSize: 11, color: C.textDim, fontStyle: "italic", marginTop: 1 }}>"{a.role}" · {a.phd}</div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 6, lineHeight: 1.4 }}>{a.specialty}</div>
                  <div style={{ fontSize: 10, color: a.color, marginTop: 8, padding: "5px 8px", background: `${a.color}08`, borderRadius: 5, border: `1px solid ${a.color}15` }}>📌 {a.section}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <Badge text={a.model.split("/").pop()} color={a.color} />
                    <span style={{ fontSize: 9, color: C.textDim, alignSelf: "center" }}>llama.cpp GGUF Q4_K_M</span>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {[a.stat1, a.stat2, a.stat3].map((s, j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: j < 2 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize: 10, color: C.textDim }}>{s.label}</span>
                      <span style={{ fontSize: 12, fontFamily: "'Cinzel', serif", color: a.color, fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                    <span style={{ fontSize: 10, color: C.textDim }}>Uptime</span>
                    <span style={{ fontSize: 10, color: C.greenVibrant }}>{a.uptime}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                    <span style={{ fontSize: 10, color: C.textDim }}>Last Scan</span>
                    <span style={{ fontSize: 10, color: C.textDim }}>{a.last_scan}</span>
                  </div>
                </div>
              </div>
            ))}
          </>}

          {/* ═══ LAYING PIPE ═══ */}
          {tab === "pipes" && <>
            <SectionHead>LAYING PIPE — PIPELINE PROBABILITY SCORES (Zara + Suki)</SectionHead>
            {PIPELINES.map((p, i) => {
              const sc = { production: C.greenVibrant, validated: C.gold, testing: C.cyan, investigation: C.orange };
              return (
                <div key={i} style={{
                  background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 12,
                  display: "flex", alignItems: "center", gap: 20, animation: `fadeUp 0.5s ease ${i*0.08}s both`,
                }}>
                  <PulseRing value={p.score / 100} size={60} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, color: C.textBright, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: C.textDim, marginTop: 4, lineHeight: 1.4 }}>{p.desc}</div>
                    <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <Badge text={p.status} color={sc[p.status]} />
                      <span style={{ fontSize: 10, color: C.textDim }}>GPU: <span style={{ color: C.gold, fontFamily: "'Cinzel', serif" }}>{p.gpu}</span></span>
                      {p.fps && <span style={{ fontSize: 10, color: C.textDim }}>FPS: <span style={{ color: C.greenVibrant }}>{p.fps}</span></span>}
                      <span style={{ fontSize: 10, color: C.textDim }}>Latency: <span style={{ color: C.cyan }}>{p.lat}</span></span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <button style={{ padding: "8px 14px", borderRadius: 8, background: p.score >= 80 ? "rgba(0,230,118,0.08)" : "rgba(197,179,88,0.03)", border: `1px solid ${p.score >= 80 ? "rgba(0,230,118,0.2)" : C.border}`, color: p.score >= 80 ? C.greenVibrant : C.textDim, fontSize: 9, fontFamily: "'Cinzel', serif", letterSpacing: 2, cursor: "pointer", whiteSpace: "nowrap" }}>
                      {p.score >= 80 ? "⚡ TO TRIAGE" : "🔍 NEEDS WORK"}
                    </button>
                  </div>
                </div>
              );
            })}
          </>}

          {/* ═══ PULSE RADAR ═══ */}
          {tab === "radar" && <>
            <SectionHead>PULSE RADAR — TRENDING MODEL ANALYSIS (Nia's Domain)</SectionHead>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {TRENDING.map((m, i) => (
                <div key={i} style={{
                  background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16,
                  display: "flex", alignItems: "center", gap: 14, animation: `fadeUp 0.4s ease ${i*0.05}s both`, cursor: "pointer",
                }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: i < 3 ? C.gold : C.textDim, fontWeight: 700, width: 22 }}>#{i+1}</span>
                  <PulseRing value={m.spike} size={46} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.textBright, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: C.textDim }}>{m.cat}</div>
                  </div>
                  <div style={{ fontSize: 15, fontFamily: "'Cinzel', serif", fontWeight: 700, color: m.dir === "up" ? C.greenVibrant : m.dir === "down" ? C.red : C.gold }}>
                    {m.dir === "up" ? "▲" : m.dir === "down" ? "▼" : "●"} {m.chg}
                  </div>
                </div>
              ))}
            </div>
          </>}

          {/* ═══ PAPER VAULT ═══ */}
          {tab === "vault" && <>
            <SectionHead>PAPER VAULT — MANAGED BY MEI-LIN CHEN</SectionHead>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: 14, borderRadius: 10, background: "rgba(38,166,154,0.04)", border: `1px solid rgba(38,166,154,0.12)` }}>
              <AgentPhoto agentId="curator" size={40} />
              <div>
                <div style={{ fontSize: 13, color: C.teal, fontFamily: "'Cinzel', serif" }}>Dr. Mei-Lin Chen — THE CURATOR</div>
                <div style={{ fontSize: 11, color: C.textDim }}>1,847 papers archived · 156 tags · Google Drive synced</div>
              </div>
            </div>
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12, letterSpacing: 3, color: C.gold }}>PAPER VAULT READY FOR 2026 BACKFILL</div>
              <div style={{ fontSize: 12, color: C.textDim, marginTop: 8, lineHeight: 1.5 }}>Mei-Lin has organized the existing archive. Trigger a scan to index your 2026 Google Drive folders.</div>
              <button style={{ marginTop: 16, padding: "10px 24px", borderRadius: 10, background: "rgba(38,166,154,0.08)", border: `1px solid rgba(38,166,154,0.2)`, color: C.teal, fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 3, cursor: "pointer" }}>📜 SCAN GOOGLE DRIVE</button>
            </div>
          </>}

          {/* ═══ TRIAGE ═══ */}
          {tab === "triage" && <>
            <SectionHead>TRIAGE QUEUE — PIPELINES AWAITING LAB CONFIRMATION</SectionHead>
            {PIPELINES.filter(p => p.score >= 80).map((p, i) => (
              <div key={i} style={{
                background: C.bgCard, border: `1px solid rgba(0,230,118,0.1)`, borderRadius: 12, padding: 18, marginBottom: 10,
                display: "flex", alignItems: "center", gap: 16, animation: `fadeUp 0.4s ease ${i*0.1}s both`,
              }}>
                <PulseRing value={p.score/100} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13, color: C.textBright }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{p.desc}</div>
                </div>
                <button style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)", color: C.greenVibrant, fontSize: 9, fontFamily: "'Cinzel', serif", letterSpacing: 2, cursor: "pointer" }}>✓ CONFIRM</button>
                <button style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(239,83,80,0.06)", border: "1px solid rgba(239,83,80,0.15)", color: C.red, fontSize: 9, fontFamily: "'Cinzel', serif", letterSpacing: 2, cursor: "pointer" }}>✕ REJECT</button>
              </div>
            ))}
          </>}
        </div>

        {/* ═══ RIGHT SIDEBAR ═══ */}
        <div style={{ borderLeft: `1px solid ${C.border}`, background: "rgba(12,8,4,0.4)", padding: "18px 16px", overflowY: "auto", maxHeight: "calc(100vh - 185px)" }}>

          {/* TEAM STATUS */}
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 10 }}>TEAM STATUS</div>
          <div style={{ display: "grid", gap: 3, marginBottom: 20 }}>
            {ALL_TEAM.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", borderRadius: 5, background: a.id === "director" ? "rgba(197,179,88,0.03)" : "transparent" }}>
                <StatusDot size={5} />
                <AgentPhoto agentId={a.id} size={20} />
                <span style={{ fontSize: 10, color: a.color, fontFamily: "'Cinzel', serif", flex: 1 }}>{a.id === "director" ? "👑 DIRECTOR" : a.title}</span>
                <span style={{ fontSize: 8, color: C.greenBright }}>{a.last_scan}</span>
              </div>
            ))}
          </div>

          {/* TRENDING */}
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 10 }}>TRENDING (NIA'S RADAR)</div>
          <div style={{ display: "grid", gap: 2, marginBottom: 20 }}>
            {TRENDING.slice(0, 6).map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: i < 3 ? C.gold : C.textDim, width: 14, fontFamily: "'Cinzel', serif" }}>{i+1}</span>
                <span style={{ fontSize: 11, color: C.text, flex: 1 }}>{m.name}</span>
                <span style={{ fontSize: 9, color: m.dir === "up" ? C.greenVibrant : m.dir === "down" ? C.red : C.gold, fontFamily: "'Cinzel', serif" }}>
                  {m.dir === "up" ? "▲" : m.dir === "down" ? "▼" : "●"}{m.chg}
                </span>
              </div>
            ))}
          </div>

          {/* TOP PIPES */}
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 10 }}>TOP PIPELINES (ZARA'S)</div>
          <div style={{ display: "grid", gap: 5, marginBottom: 20 }}>
            {PIPELINES.filter(p => p.score >= 80).slice(0, 3).map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 7, background: "rgba(197,179,88,0.02)", border: `1px solid ${C.border}` }}>
                <PulseRing value={p.score/100} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: C.textBright, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 9, color: C.textDim }}>{p.gpu} · {p.lat}</div>
                </div>
              </div>
            ))}
          </div>

          {/* WEEKLY */}
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.textDim, marginBottom: 10 }}>THIS WEEK</div>
          <div style={{ background: "rgba(197,179,88,0.02)", borderRadius: 8, padding: 12, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            {[
              { l: "Papers (Amara)", v: "47", c: C.gold },
              { l: "Models (Amara)", v: "23", c: C.gold },
              { l: "Compat Tests (Suki)", v: "89", c: C.cyan },
              { l: "Forecasts (Nia)", v: "12", c: C.purple },
              { l: "Pipelines (Zara)", v: "6", c: C.greenVibrant },
              { l: "Articles (Lena)", v: "14", c: C.orange },
              { l: "Archived (Mei-Lin)", v: "47", c: C.teal },
              { l: "Quality Checks (Priya)", v: "203", c: C.pink },
            ].map((s, i, a) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: i < a.length - 1 ? `1px solid rgba(197,179,88,0.05)` : "none" }}>
                <span style={{ fontSize: 10, color: C.textDim }}>{s.l}</span>
                <span style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: s.c, fontWeight: 600 }}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div style={{ display: "grid", gap: 7 }}>
            <button style={{ width: "100%", padding: "11px 14px", borderRadius: 9, cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, background: "linear-gradient(135deg, rgba(0,230,118,0.1), rgba(0,230,118,0.04))", border: "1px solid rgba(0,230,118,0.2)", color: C.greenVibrant, animation: "glow 4s infinite" }}>⚡ SEND TO TRIAGE</button>
            <button style={{ width: "100%", padding: "9px 14px", borderRadius: 9, cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, background: "rgba(197,179,88,0.04)", border: `1px solid ${C.border}`, color: C.gold }}>📊 WEEKLY REPORT (LENA)</button>
            <button style={{ width: "100%", padding: "9px 14px", borderRadius: 9, cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, background: "rgba(171,71,188,0.05)", border: "1px solid rgba(171,71,188,0.15)", color: C.purple }}>🔮 PROPHET FORECAST (NIA)</button>
            <button style={{ width: "100%", padding: "9px 14px", borderRadius: 9, cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, background: "rgba(236,64,122,0.05)", border: "1px solid rgba(236,64,122,0.12)", color: C.pink }}>🛡️ SECURITY SCAN (PRIYA)</button>
          </div>

          {/* FLOW */}
          <div style={{ marginTop: 18, padding: 12, borderRadius: 8, background: "rgba(197,179,88,0.015)", border: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 3, color: C.textDim, marginBottom: 6 }}>EDEN ECOSYSTEM</div>
            {["📡 PULSE → Intelligence (Wendy)", "🔬 TRIAGE → Validation (Lab)", "🎨 STUDIO → Production", "🔱 DEPLOYMENT → Revenue"].map((s, i) => (
              <div key={i} style={{ fontSize: 10, color: i === 0 ? C.gold : C.textDim, padding: "2px 4px" }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
