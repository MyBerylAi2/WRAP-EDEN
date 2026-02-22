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
  // Light Wells — strategic brightness zones
  well: "rgba(245,240,230,0.035)",        // Frosted glass panel base
  wellBright: "rgba(245,240,230,0.06)",    // Elevated reading zone
  wellGold: "rgba(197,179,88,0.05)",       // Gold-tinted warm panel
  wellBorder: "rgba(197,179,88,0.18)",     // Visible gold border for panels
  wellGlow: "0 0 30px rgba(197,179,88,0.06), inset 0 1px 0 rgba(245,240,230,0.05)",  // Ambient glow
  wellGlowStrong: "0 0 40px rgba(197,179,88,0.09), inset 0 1px 0 rgba(245,240,230,0.08)", // Feature glow
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

// Articles with multi-author support — medical journal style
// authors[0] = lead researcher, authors[1+] = contributors
const ARTICLES = [
  { id: 1, title: "SOUL v2 Drops: 1M Training Samples Now Open-Source — Full Capability Card and Pipeline Impact Analysis",
    subtitle: "The model that powers next-gen digital humans just got accessible to everyone. Complete technical extraction with compatibility assessment and production readiness scoring.",
    category: "Face Animation", authors: ["archivist", "analyst", "sentinel"], time: "Feb 22, 2026", readTime: "8 min", priority: "critical",
    tags: ["soul", "open-source", "lip-sync", "1M-samples", "face-anim"], feasibility: 92, trending: true, cited: 12,
    journal: "Eden Pulse Intelligence Report", volume: "Vol. 2, No. 47",
    gradient: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #C5B358 100%)" },
  { id: 2, title: "Why BitNet b1.58 Changes Everything for Consumer 4D Avatars: A 90-Day Forecast",
    subtitle: "70B LLM parameter-count on a single RTX 4090 with 15GB headroom for diffusion pipelines. Comprehensive adoption curve analysis with market impact projections.",
    category: "Quantization", authors: ["prophet", "synthesist"], time: "Feb 22, 2026", readTime: "12 min", priority: "high",
    tags: ["bitnet", "quantization", "consumer-gpu", "4090", "forecast"], feasibility: 78, trending: true, cited: 8,
    journal: "Eden Pulse Forecast Bulletin", volume: "Vol. 2, No. 46",
    gradient: "linear-gradient(135deg, #6A1B9A 0%, #AB47BC 40%, #C5B358 100%)" },
  { id: 3, title: "Pipeline Blueprint: The Sub-200ms Conversational Avatar Stack — Design, Testing, and Validation",
    subtitle: "Whisper-Turbo → BitNet-3B → Chatterbox → TELLER at 25fps. Full architecture blueprint with component-level latency breakdown and probability scoring.",
    category: "Pipeline", authors: ["synthesist", "analyst", "sentinel"], time: "Feb 21, 2026", readTime: "15 min", priority: "critical",
    tags: ["pipeline", "real-time", "avatar", "sub-200ms", "blueprint"], feasibility: 85, trending: false, cited: 15,
    journal: "Eden Pulse Technical Report", volume: "Vol. 2, No. 45",
    gradient: "linear-gradient(135deg, #006064 0%, #00E676 40%, #1B5E20 100%)" },
  { id: 4, title: "TELLER vs KDTalker vs MEMO: Definitive Benchmark Under Eden's 0.3 Deviation Rule",
    subtitle: "Systematic head-to-head comparison across LSE-D, LSE-C, SyncNet, CSIM, and FID metrics. Only one model survived the 'Real as Fuck' standard.",
    category: "Benchmark", authors: ["analyst", "sentinel"], time: "Feb 21, 2026", readTime: "10 min", priority: "high",
    tags: ["benchmark", "teller", "kdtalker", "memo", "0.3-rule"], feasibility: 91, trending: true, cited: 22,
    journal: "Eden Pulse Benchmark Series", volume: "Vol. 2, No. 44",
    gradient: "linear-gradient(135deg, #C62828 0%, #EF5350 40%, #FF9800 100%)" },
  { id: 5, title: "This Week in AI: 7 Models That Dropped You Need to Know — Weekly Intelligence Digest",
    subtitle: "From vision-language architectures to audio-driven animation engines — curated intelligence brief covering HuggingFace trending, arXiv drops, and GitHub releases.",
    category: "Weekly Digest", authors: ["journalist", "curator", "archivist"], time: "Feb 21, 2026", readTime: "6 min", priority: "medium",
    tags: ["weekly", "digest", "trending", "huggingface"], feasibility: null, trending: false, cited: 5,
    journal: "Eden Pulse Weekly", volume: "Issue 18",
    gradient: "linear-gradient(135deg, #E65100 0%, #FF9800 40%, #C5B358 100%)" },
  { id: 6, title: "LoRA Stacking for Melanin-Rich Skin Texture: Eden Protocol Outperforms CivitAI Top 10",
    subtitle: "Realistic Skin Texture LoRA + Eden Protocol achieves undetectable AI imagery across all major forensic detection tools. Full lab results with 0.3 Rule validation.",
    category: "ERE-1", authors: ["archivist", "sentinel"], time: "Feb 20, 2026", readTime: "9 min", priority: "high",
    tags: ["lora", "skin-texture", "melanin", "ere-1", "anti-detect"], feasibility: 96, trending: false, cited: 18,
    journal: "Eden Realism Engine Technical Note", volume: "ERE-TN-007",
    gradient: "linear-gradient(135deg, #8B6914 0%, #C5B358 40%, #4CAF50 100%)" },
  { id: 7, title: "Paper Vault 2026: Complete Research Archive — Taxonomy, Indexing, and Search Architecture",
    subtitle: "1,847 papers organized across 156 tags with capability card cross-referencing. Google Drive bi-directional sync operational.",
    category: "Knowledge Base", authors: ["curator", "archivist"], time: "Feb 19, 2026", readTime: "5 min", priority: "medium",
    tags: ["archive", "papers", "vault", "taxonomy"], feasibility: null, trending: false, cited: 3,
    journal: "Eden Pulse Internal Memo", volume: "Memo 2026-019",
    gradient: "linear-gradient(135deg, #00695C 0%, #26A69A 40%, #C5B358 100%)" },
  { id: 8, title: "SECURITY ADVISORY: MuseTalk v2.3.1 Silent Telemetry Leak — Full Risk Matrix and Remediation",
    subtitle: "Unauthorized data exfiltration detected in popular open-source fork. Complete threat analysis, affected versions, and immediate patch instructions.",
    category: "Security", authors: ["sentinel", "analyst", "director"], time: "Feb 18, 2026", readTime: "4 min", priority: "critical",
    tags: ["security", "musetalk", "data-leak", "advisory"], feasibility: null, trending: false, cited: 31,
    journal: "Eden Pulse Security Advisory", volume: "SEC-2026-003",
    gradient: "linear-gradient(135deg, #880E4F 0%, #EC407A 40%, #C62828 100%)" },
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
  <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${C.wellBorder}`, position: "relative" }}>
    {children}
    <div style={{ position: "absolute", bottom: -1, left: 0, width: 60, height: 2, background: `linear-gradient(to right, ${C.gold}, transparent)`, borderRadius: 1 }} />
  </div>
);

// ─── JOURNAL-STYLE BYLINE (Like NEJM / The Lancet / Nature) ───
const JournalByline = ({ authorIds, size = "full", journal, volume, time }) => {
  const authors = authorIds.map(id => ALL_TEAM.find(x => x.id === id)).filter(Boolean);
  if (!authors.length) return null;
  const lead = authors[0];
  const contribs = authors.slice(1);

  if (size === "compact") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", marginRight: -4 }}>
          {authors.map((a, i) => (
            <div key={a.id} style={{ width: 24, height: 24, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.bg}`, marginLeft: i > 0 ? -8 : 0, zIndex: authors.length - i, position: "relative" }}>
              <img src={a.photo} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, color: C.textBright, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {lead.name.replace("Dr. ", "")}{contribs.length > 0 && <span style={{ color: C.textDim }}> et al.</span>}
          </div>
          <div style={{ fontSize: 8, color: C.textDim }}>{time}</div>
        </div>
      </div>
    );
  }

  // Full journal byline — NEJM style
  return (
    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 14 }}>
      {/* Journal line */}
      {journal && (
        <div style={{ fontSize: 9, letterSpacing: 2, color: C.goldDark, fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 10 }}>
          {journal} {volume && <span style={{ color: C.textDim }}>· {volume}</span>}
        </div>
      )}
      {/* Author photos row */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {authors.map((a, i) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: `2px solid ${a.color}35`, boxShadow: `0 0 10px ${a.color}10` }}>
              <img src={a.photo} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: C.textBright, fontWeight: 500 }}>
                {a.name}
                {i === 0 && <span style={{ fontSize: 8, color: C.gold, marginLeft: 6, fontFamily: "'Cinzel', serif", letterSpacing: 1, verticalAlign: "super" }}>LEAD</span>}
              </div>
              <div style={{ fontSize: 9, color: a.color, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>{a.title}</div>
              <div style={{ fontSize: 9, color: C.textDim }}>{a.phd}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Affiliation */}
      <div style={{ fontSize: 9, color: C.textDim, marginTop: 8, fontStyle: "italic" }}>
        Eden Pulse Research Division, Beryl AI Labs, The Eden Project · {time}
      </div>
    </div>
  );
};

// ─── Article Card Byline (for grid cards — medium size) ───
const CardByline = ({ authorIds, time, readTime, cited }) => {
  const authors = authorIds.map(id => ALL_TEAM.find(x => x.id === id)).filter(Boolean);
  if (!authors.length) return null;
  const lead = authors[0];

  return (
    <div style={{ marginTop: 10 }}>
      {/* Author row with overlapping photos */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex" }}>
          {authors.map((a, i) => (
            <div key={a.id} title={`${a.name} — ${a.title}`} style={{
              width: 26, height: 26, borderRadius: "50%", overflow: "hidden",
              border: `2px solid ${C.bg}`, marginLeft: i > 0 ? -8 : 0,
              zIndex: authors.length - i, position: "relative",
            }}>
              <img src={a.photo} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: C.textBright, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {lead.name}
            {authors.length > 1 && <span style={{ color: C.textDim, fontStyle: "italic" }}>{` + ${authors.length - 1} more`}</span>}
          </div>
          <div style={{ fontSize: 8, color: lead.color, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>{lead.title} · {lead.phd?.split(",")[0]}</div>
        </div>
      </div>
      {/* Journal metadata */}
      <div style={{ display: "flex", gap: 10, marginTop: 6, alignItems: "center" }}>
        <span style={{ fontSize: 9, color: C.textDim }}>{time}</span>
        <span style={{ fontSize: 9, color: C.textDim }}>·</span>
        <span style={{ fontSize: 9, color: C.textDim }}>{readTime}</span>
        {cited && <>
          <span style={{ fontSize: 9, color: C.textDim }}>·</span>
          <span style={{ fontSize: 9, color: C.gold, fontFamily: "'Cinzel', serif" }}>⊕ {cited} cited</span>
        </>}
      </div>
    </div>
  );
};

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
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        @keyframes ticker { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes glow { 0%,100% { box-shadow:0 0 8px rgba(197,179,88,0.08) } 50% { box-shadow:0 0 20px rgba(197,179,88,0.18) } }
        * { box-sizing:border-box; margin:0; padding:0 }
        ::-webkit-scrollbar { width:5px } ::-webkit-scrollbar-thumb { background:rgba(197,179,88,0.12); border-radius:3px }
        .card-hover:hover { border-color: rgba(197,179,88,0.28) !important; transform: translateY(-2px) }
      `}</style>

      {/* ═══ HEADER — LARGE LOGO WITH CLOVER ═══ */}
      <div style={{ background: C.bgSurface, borderBottom: `1px solid ${C.border}`, padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* LEFT: CLOVER LOGO + EDEN PULSE + TAGLINE */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* THE CLOVER — Static, from index page */}
          <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
            <svg width={56} height={56} viewBox="0 0 56 56" style={{ overflow: "visible", filter: "drop-shadow(0 0 8px rgba(0,230,118,.3))" }}>
              <defs>
                <radialGradient id="plf" cx="30%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#7bc67a" stopOpacity=".95"/>
                  <stop offset="25%" stopColor="#43A047"/>
                  <stop offset="55%" stopColor="#2E7D32"/>
                  <stop offset="100%" stopColor="#1B5E20"/>
                </radialGradient>
                <linearGradient id="pst" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#1B5E20"/>
                  <stop offset="100%" stopColor="#43A047"/>
                </linearGradient>
              </defs>
              {/* Stem */}
              <path d="M28,53 C28,43 28,22 28,19" stroke="url(#pst)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* 4 Leaves */}
              <g transform="translate(28,18) rotate(-10)"><path d="M0,0 C-0.5,-2.5 1,-7 3,-11 C5,-13.5 7.5,-15 10,-14.5 C12,-13.5 12.5,-11 12,-8 C11.5,-5.5 8.5,-2 5,-0.8 C2.5,0 0.5,0 0,0 Z" fill="url(#plf)" stroke="#145214" strokeWidth=".4"/></g>
              <g transform="translate(28,18) rotate(-10) scale(-1,1)"><path d="M0,0 C-0.5,-2.5 1,-7 3,-11 C5,-13.5 7.5,-15 10,-14.5 C12,-13.5 12.5,-11 12,-8 C11.5,-5.5 8.5,-2 5,-0.8 C2.5,0 0.5,0 0,0 Z" fill="url(#plf)" stroke="#145214" strokeWidth=".4"/></g>
              <g transform="translate(28,18) rotate(170)"><path d="M0,0 C-0.5,-2.5 1,-7 3,-11 C5,-13.5 7.5,-15 10,-14.5 C12,-13.5 12.5,-11 12,-8 C11.5,-5.5 8.5,-2 5,-0.8 C2.5,0 0.5,0 0,0 Z" fill="url(#plf)" stroke="#145214" strokeWidth=".4"/></g>
              <g transform="translate(28,18) rotate(170) scale(-1,1)"><path d="M0,0 C-0.5,-2.5 1,-7 3,-11 C5,-13.5 7.5,-15 10,-14.5 C12,-13.5 12.5,-11 12,-8 C11.5,-5.5 8.5,-2 5,-0.8 C2.5,0 0.5,0 0,0 Z" fill="url(#plf)" stroke="#145214" strokeWidth=".4"/></g>
              {/* Hub */}
              <circle cx={28} cy={18} r={2.2} fill="#2E7D32"/>
              <circle cx={28} cy={18} r={1.3} fill="#388E3C"/>
            </svg>
          </div>
          {/* EDEN PULSE text */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{
                fontFamily: "'Cinzel Decorative','Cinzel',serif", fontSize: 36, letterSpacing: 10, fontWeight: 900,
                background: "linear-gradient(135deg,#8B6914 0%,#C5B358 15%,#F5E6A3 30%,#D4AF37 45%,#C5B358 55%,#F5E6A3 65%,#D4AF37 80%,#8B6914 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>EDEN PULSE</span>
              <span style={{ fontSize: 14, letterSpacing: 3, color: C.goldDark, fontFamily: "'Cinzel', serif", fontWeight: 600 }}>v2.0</span>
            </div>
            <div style={{ fontSize: 12, letterSpacing: 5, color: "#FFFFFF", textTransform: "uppercase", marginTop: 5, fontWeight: 700, fontFamily: "'Cinzel', serif" }}>THE RELENTLESS EYE · BERYL AI LABS · RESEARCH INTELLIGENCE DIVISION</div>
          </div>
        </div>
        {/* RIGHT: CLOCK + STATUS */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.textDim }}>{now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: C.gold, letterSpacing: 3, fontWeight: 600 }}>{now.toLocaleTimeString("en-US", { hour12: false })}</div>
          </div>
          <div style={{ height: 44, width: 1, background: C.border }} />
          <div style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(0,230,118,0.06)", border: `1px solid rgba(0,230,118,0.15)` }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: C.greenVibrant, fontFamily: "'Cinzel', serif", fontWeight: 600 }}>8 TEAM MEMBERS ONLINE</div>
            <div style={{ fontSize: 9, color: C.greenBright, letterSpacing: 1, marginTop: 2 }}>1 DIRECTOR · 7 HEARTBEATS · AGENT FRAMEWORK</div>
          </div>
        </div>
      </div>

      {/* ═══ DIRECTOR BAR ═══ */}
      <div style={{ background: C.wellGold, borderBottom: `1px solid ${C.wellBorder}`, padding: "12px 28px", display: "flex", alignItems: "center", gap: 16 }}>
        <AgentPhoto agentId="director" size={48} />
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 16, letterSpacing: 4, color: C.gold, fontWeight: 600 }}>DEPARTMENT DIRECTOR</span>
          <span style={{ fontSize: 17, color: C.textBright, marginLeft: 14, fontWeight: 500 }}>{DIRECTOR.name}, Ph.D.</span>
          <span style={{ fontSize: 14, color: C.textDim, marginLeft: 10, fontStyle: "italic" }}>"{DIRECTOR.role}"</span>
        </div>
        <div style={{ display: "flex", gap: 22 }}>
          {[DIRECTOR.stat1, DIRECTOR.stat2, DIRECTOR.stat3].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontFamily: "'Cinzel', serif", color: C.gold, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ TICKER — White bar, dark bold text ═══ */}
      <div style={{ background: "#FFFFFF", borderBottom: `2px solid ${C.gold}40`, borderTop: `2px solid ${C.gold}40`, padding: "10px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "ticker 90s linear infinite" }}>
          {[...ticker, ...ticker].map((t, i) => <span key={i} style={{ fontSize: 16, color: "#1A1510", fontWeight: 700, marginRight: 60, letterSpacing: 0.5 }}>{t}</span>)}
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: "rgba(12,8,4,0.6)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "14px 24px", background: tab === t.id ? "rgba(197,179,88,0.04)" : "none", border: "none", cursor: "pointer",
            fontFamily: "'Cinzel', serif", fontSize: 14, letterSpacing: 4, textTransform: "uppercase",
            color: tab === t.id ? C.gold : C.textDim,
            borderBottom: tab === t.id ? `3px solid ${C.gold}` : "3px solid transparent",
            transition: "all 0.3s", display: "flex", alignItems: "center", gap: 6,
          }}><span style={{ fontSize: 16 }}>{t.icon}</span>{t.label}</button>
        ))}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", minHeight: "calc(100vh - 185px)" }}>

        {/* LEFT */}
        <div style={{ padding: 24, overflowY: "auto", maxHeight: "calc(100vh - 185px)" }}>

          {/* ═══ ALLUVIAL FEED ═══ */}
          {tab === "feed" && <>
            <SectionHead>BREAKING INTELLIGENCE</SectionHead>
            {/* Frosted Panel Container */}
            <div style={{ background: C.well, borderRadius: 14, border: `1px solid ${C.wellBorder}`, padding: "12px 14px", marginBottom: 20, boxShadow: C.wellGlow }}>
            {BREAKING.map((item, i) => {
              const colors = { BREAKING: C.red, "LAYING PIPE": C.greenVibrant, "UNDER INVESTIGATION": C.orange, FORECAST: C.purple, ARCHIVED: C.teal };
              const tagColor = colors[item.tag];
              return (
                <div key={item.id} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "10px 14px",
                  background: i === 0 ? `${tagColor}10` : C.wellBright,
                  border: `1px solid ${i === 0 ? `${tagColor}25` : "rgba(197,179,88,0.08)"}`,
                  borderRadius: 10, marginBottom: i < BREAKING.length - 1 ? 6 : 0, animation: `fadeUp 0.5s ease ${i * 0.06}s both`, cursor: "pointer",
                  transition: "all 0.3s",
                }}>
                  <Badge text={item.tag === "BREAKING" ? `🔴 ${item.tag}` : item.tag} color={tagColor} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.textBright, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                    <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>{item.category} · {item.time} · {item.views} views</div>
                  </div>
                  <PulseRing value={item.spike} size={32} />
                  <AgentPhoto agentId={item.agent} size={28} />
                </div>
              );
            })}
            </div>

            <div style={{ height: 24 }} />
            <SectionHead>FEATURED INTELLIGENCE</SectionHead>
            {/* HERO — Journal Style */}
            <div style={{ background: ARTICLES[0].gradient, borderRadius: 16, padding: 32, marginBottom: 24, border: `1px solid rgba(197,179,88,0.15)`, position: "relative", overflow: "hidden", cursor: "pointer", animation: "fadeUp 0.6s ease both" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,5,3,0.97) 0%, rgba(8,5,3,0.6) 35%, rgba(8,5,3,0.2) 100%)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <Badge text={ARTICLES[0].priority} color={C.red} />
                  <Badge text={ARTICLES[0].category} color={C.goldBright} />
                  {ARTICLES[0].trending && <Badge text="🔥 TRENDING" color={C.greenVibrant} />}
                  {ARTICLES[0].feasibility && <div style={{ marginLeft: "auto" }}><PulseRing value={ARTICLES[0].feasibility / 100} size={52} /></div>}
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 600, color: "#fff", lineHeight: 1.25, marginBottom: 10, maxWidth: "85%" }}>{ARTICLES[0].title}</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", fontStyle: "italic", marginBottom: 6, maxWidth: "80%", lineHeight: 1.5 }}>{ARTICLES[0].subtitle}</div>
                {/* JOURNAL BYLINE — Full NEJM Style */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, marginTop: 14 }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: "rgba(245,230,163,0.5)", fontFamily: "'Cinzel', serif", textTransform: "uppercase", marginBottom: 10 }}>
                    {ARTICLES[0].journal} · {ARTICLES[0].volume}
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {ARTICLES[0].authors.map(id => ALL_TEAM.find(x => x.id === id)).filter(Boolean).map((a, i) => (
                      <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", border: `2px solid rgba(255,255,255,0.2)`, boxShadow: "0 0 12px rgba(0,0,0,0.5)" }}>
                          <img src={a.photo} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>
                            {a.name}
                            {i === 0 && <span style={{ fontSize: 7, color: C.goldBright, marginLeft: 6, fontFamily: "'Cinzel', serif", letterSpacing: 1, verticalAlign: "super", background: "rgba(197,179,88,0.2)", padding: "1px 5px", borderRadius: 3 }}>LEAD RESEARCHER</span>}
                          </div>
                          <div style={{ fontSize: 9, color: a.color, fontFamily: "'Cinzel', serif", letterSpacing: 1 }}>{a.title}</div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{a.phd}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Eden Pulse Research Division, Beryl AI Labs</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>·</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{ARTICLES[0].time}</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>·</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{ARTICLES[0].readTime} read</span>
                    {ARTICLES[0].cited && <>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>·</span>
                      <span style={{ fontSize: 9, color: C.goldBright, fontFamily: "'Cinzel', serif" }}>⊕ Cited by {ARTICLES[0].cited} reports</span>
                    </>}
                  </div>
                </div>
              </div>
            </div>

            <SectionHead>LATEST REPORTS</SectionHead>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {ARTICLES.slice(1).map((a, i) => (
                <div key={a.id} className="card-hover" style={{
                  background: C.wellBright, border: `1px solid ${C.wellBorder}`, borderRadius: 14,
                  overflow: "hidden", cursor: "pointer", transition: "all 0.35s", animation: `fadeUp 0.5s ease ${(i+1)*0.06}s both`,
                  boxShadow: C.wellGlow,
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
                  <div style={{ padding: "11px 13px 14px", background: C.well }}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 12.5, fontWeight: 600, color: C.textBright, lineHeight: 1.3, marginBottom: 5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.4, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.subtitle}</div>
                    {/* JOURNAL BYLINE — Medical Journal Card Style */}
                    <CardByline authorIds={a.authors} time={a.time} readTime={a.readTime} cited={a.cited} />
                  </div>
                </div>
              ))}
            </div>
          </>}

          {/* ═══ THE HEARTBEATS ═══ */}
          {tab === "team" && <>
            <SectionHead>DEPARTMENT LEADERSHIP</SectionHead>
            {/* DIRECTOR CARD — Gold Light Well */}
            <div style={{ background: C.wellBright, border: `2px solid ${C.gold}35`, borderRadius: 18, padding: 26, marginBottom: 28, display: "grid", gridTemplateColumns: "110px 1fr 220px", gap: 24, alignItems: "center", animation: "fadeUp 0.5s ease both", boxShadow: C.wellGlowStrong }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.gold}60`, boxShadow: `0 0 35px ${C.gold}20` }}>
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
                background: C.wellBright, border: `1px solid ${a.color}30`, borderRadius: 16, padding: 22, marginBottom: 14,
                display: "grid", gridTemplateColumns: "90px 1fr 200px", gap: 22, alignItems: "center",
                animation: `fadeUp 0.5s ease ${(i+1)*0.08}s both`, transition: "all 0.3s",
                boxShadow: `0 0 28px ${a.color}08, inset 0 1px 0 rgba(245,240,230,0.04)`,
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 76, height: 76, borderRadius: "50%", overflow: "hidden", border: `2px solid ${a.color}45`, boxShadow: `0 0 24px ${a.color}18` }}>
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
                  background: C.well, border: `1px solid ${C.wellBorder}`, borderRadius: 14, padding: 20, marginBottom: 12,
                  display: "flex", alignItems: "center", gap: 20, animation: `fadeUp 0.5s ease ${i*0.08}s both`,
                  boxShadow: C.wellGlow,
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
                  background: i < 3 ? C.wellBright : C.well, border: `1px solid ${i < 3 ? C.wellBorder : C.border}`, borderRadius: 12, padding: 16,
                  display: "flex", alignItems: "center", gap: 14, animation: `fadeUp 0.4s ease ${i*0.05}s both`, cursor: "pointer",
                  boxShadow: i < 3 ? C.wellGlow : "none",
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
                background: C.well, border: `1px solid rgba(0,230,118,0.15)`, borderRadius: 12, padding: 18, marginBottom: 10,
                display: "flex", alignItems: "center", gap: 16, animation: `fadeUp 0.4s ease ${i*0.1}s both`,
                boxShadow: "0 0 20px rgba(0,230,118,0.04)",
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

        {/* ═══ RIGHT SIDEBAR — Light Well Panels ═══ */}
        <div style={{ borderLeft: `1px solid ${C.wellBorder}`, background: "linear-gradient(180deg, rgba(197,179,88,0.03) 0%, rgba(12,8,4,0.6) 100%)", padding: "18px 16px", overflowY: "auto", maxHeight: "calc(100vh - 185px)" }}>

          {/* TEAM STATUS — Frosted Panel */}
          <div style={{ background: C.well, borderRadius: 10, border: `1px solid ${C.wellBorder}`, padding: "10px 10px 8px", marginBottom: 16, boxShadow: C.wellGlow }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.gold, marginBottom: 8 }}>TEAM STATUS</div>
            <div style={{ display: "grid", gap: 2 }}>
              {ALL_TEAM.map(a => (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 6px", borderRadius: 5, background: a.id === "director" ? C.wellGold : "transparent" }}>
                  <StatusDot size={5} />
                  <AgentPhoto agentId={a.id} size={20} />
                  <span style={{ fontSize: 10, color: a.color, fontFamily: "'Cinzel', serif", flex: 1 }}>{a.id === "director" ? "👑 DIRECTOR" : a.title}</span>
                  <span style={{ fontSize: 8, color: C.greenBright }}>{a.last_scan}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TRENDING — Frosted Panel */}
          <div style={{ background: C.well, borderRadius: 10, border: `1px solid ${C.wellBorder}`, padding: "10px 10px 8px", marginBottom: 16, boxShadow: C.wellGlow }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.gold, marginBottom: 8 }}>TRENDING (NIA'S RADAR)</div>
            <div style={{ display: "grid", gap: 1 }}>
              {TRENDING.slice(0, 6).map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 6px", borderRadius: 4, background: i < 3 ? C.wellGold : "transparent" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: i < 3 ? C.gold : C.textDim, width: 14, fontFamily: "'Cinzel', serif" }}>{i+1}</span>
                  <span style={{ fontSize: 11, color: i < 3 ? C.textBright : C.text, flex: 1 }}>{m.name}</span>
                  <span style={{ fontSize: 9, color: m.dir === "up" ? C.greenVibrant : m.dir === "down" ? C.red : C.gold, fontFamily: "'Cinzel', serif" }}>
                    {m.dir === "up" ? "▲" : m.dir === "down" ? "▼" : "●"}{m.chg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TOP PIPES — Frosted Panel */}
          <div style={{ background: C.well, borderRadius: 10, border: `1px solid ${C.wellBorder}`, padding: "10px 10px 8px", marginBottom: 16, boxShadow: C.wellGlow }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.gold, marginBottom: 8 }}>TOP PIPELINES (ZARA'S)</div>
            <div style={{ display: "grid", gap: 5 }}>
              {PIPELINES.filter(p => p.score >= 80).slice(0, 3).map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 7, background: C.wellBright, border: `1px solid rgba(197,179,88,0.1)` }}>
                  <PulseRing value={p.score/100} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: C.textBright, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: 9, color: C.textDim }}>{p.gpu} · {p.lat}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WEEKLY — Bright Panel */}
          <div style={{ background: C.wellBright, borderRadius: 10, border: `1px solid ${C.wellBorder}`, padding: "10px 12px", marginBottom: 16, boxShadow: C.wellGlowStrong }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, color: C.gold, marginBottom: 8 }}>THIS WEEK</div>
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
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i < a.length - 1 ? `1px solid rgba(197,179,88,0.06)` : "none" }}>
                <span style={{ fontSize: 10, color: C.text }}>{s.l}</span>
                <span style={{ fontSize: 11, fontFamily: "'Cinzel', serif", color: s.c, fontWeight: 600 }}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* ACTIONS — Elevated */}
          <div style={{ background: C.well, borderRadius: 10, border: `1px solid ${C.wellBorder}`, padding: 10, marginBottom: 16, boxShadow: C.wellGlow }}>
            <div style={{ display: "grid", gap: 6 }}>
              <button style={{ width: "100%", padding: "11px 14px", borderRadius: 9, cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, background: "linear-gradient(135deg, rgba(0,230,118,0.12), rgba(0,230,118,0.04))", border: "1px solid rgba(0,230,118,0.25)", color: C.greenVibrant, animation: "glow 4s infinite" }}>⚡ SEND TO TRIAGE</button>
              <button style={{ width: "100%", padding: "9px 14px", borderRadius: 9, cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, background: C.wellGold, border: `1px solid ${C.wellBorder}`, color: C.gold }}>📊 WEEKLY REPORT (LENA)</button>
              <button style={{ width: "100%", padding: "9px 14px", borderRadius: 9, cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, background: "rgba(171,71,188,0.06)", border: "1px solid rgba(171,71,188,0.18)", color: C.purple }}>🔮 PROPHET FORECAST (NIA)</button>
              <button style={{ width: "100%", padding: "9px 14px", borderRadius: 9, cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: 3, background: "rgba(236,64,122,0.06)", border: "1px solid rgba(236,64,122,0.15)", color: C.pink }}>🛡️ SECURITY SCAN (PRIYA)</button>
            </div>
          </div>

          {/* ECOSYSTEM FLOW */}
          <div style={{ padding: 12, borderRadius: 8, background: C.wellGold, border: `1px solid ${C.wellBorder}` }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: 3, color: C.gold, marginBottom: 6 }}>EDEN ECOSYSTEM</div>
            {["📡 PULSE → Intelligence (Wendy)", "🔬 TRIAGE → Validation (Lab)", "🎨 STUDIO → Production", "🔱 DEPLOYMENT → Revenue"].map((s, i) => (
              <div key={i} style={{ fontSize: 10, color: i === 0 ? C.gold : C.text, padding: "2px 4px" }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
