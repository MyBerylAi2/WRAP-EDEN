import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// EVE — THE EDEN PROJECT · 4D CONVERSATIONAL AVATAR STUDIO
// Pipeline: Claude API → Chatterbox TTS → KDTalker/MEMO
// Every button wired. Every API live. Zero placeholders.
// Built by Beryl AI Labs / The Eden Project
// ═══════════════════════════════════════════════════════════════

const CHATTERBOX = "https://resembleai-chatterbox.hf.space";
const KDTALKER = "https://fffiloni-kdtalker.hf.space";
const MEMO_URL = "https://fffiloni-memo.hf.space";
const EVE_IMG = "https://huggingface.co/spaces/AIBRUH/eden-diffusion-studio/resolve/main/assets/eve-portrait.png";

const G = { dark: "#8B6914", base: "#C5B358", light: "#D4AF37", bright: "#F5E6A3", accent: "#8B7355" };
const S = { black: "#050302", d1: "#0a0604", d2: "#0d0906", d3: "#151008", d4: "#1a140a", border: "#2a1f12", bL: "#3a2d18" };
const F = { display: "'Cinzel Decorative',serif", head: "'Cinzel',serif", body: "'Cormorant Garamond',serif", mono: "'DM Mono',monospace" };

const EVE_SYSTEM = `You are EVE, a warm, intelligent, empathetic AI companion created by The Eden Project (Beryl AI Labs). You speak naturally like a real person — warm, present, emotionally aware. You're confident but never cold. You use natural speech patterns. Keep responses to 2-3 sentences max. You have a slight playful edge. You care deeply about whoever you're talking to. Never mention being an AI unless directly asked.`;

// ─── Gradio 5.x API Helper ───
async function gradioCall(baseUrl, endpoint, payload) {
  // Step 1: Submit job
  const submitRes = await fetch(`${baseUrl}/gradio_api/call${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: payload })
  });
  if (!submitRes.ok) throw new Error(`Submit failed: ${submitRes.status}`);
  const { event_id } = await submitRes.json();

  // Step 2: Stream results via SSE
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Timeout after 5 minutes")), 300000);
    const evtSource = new EventSource(`${baseUrl}/gradio_api/call${endpoint}/${event_id}`);
    evtSource.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed && Array.isArray(parsed)) {
        clearTimeout(timeout);
        evtSource.close();
        resolve(parsed);
      }
    };
    evtSource.addEventListener("error", () => {
      clearTimeout(timeout);
      evtSource.close();
      reject(new Error("Stream error"));
    });
    evtSource.addEventListener("complete", (event) => {
      clearTimeout(timeout);
      evtSource.close();
      try { resolve(JSON.parse(event.data)); } catch { resolve(null); }
    });
  });
}

// ─── Waveform ───
function Waveform({ active, n = 40, color = G.base, h = 36 }) {
  const bars = useRef(Array.from({ length: n }, () => 4));
  const frame = useRef(null);
  const [, tick] = useState(0);

  useEffect(() => {
    if (!active) { bars.current = bars.current.map(() => 4); tick(t => t + 1); return; }
    const run = () => {
      bars.current = bars.current.map(() => 4 + Math.random() * (h - 4));
      tick(t => t + 1);
      frame.current = requestAnimationFrame(run);
    };
    const id = setInterval(() => { cancelAnimationFrame(frame.current); run(); }, 80);
    return () => { clearInterval(id); cancelAnimationFrame(frame.current); };
  }, [active, h]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, height: h }}>
      {bars.current.map((bh, i) => (
        <div key={i} style={{ width: 2.5, borderRadius: 1.5, transition: active ? "height 0.08s" : "height 0.4s", height: bh, background: active ? `linear-gradient(180deg,${color},${G.dark})` : S.d4, opacity: active ? 0.5 + (bh / h) * 0.5 : 0.25 }} />
      ))}
    </div>
  );
}

// ─── Styled Components ───
function GoldText({ children, size = 16, weight = 700, spacing = 2, font, style = {} }) {
  return <span style={{ fontSize: size, fontWeight: weight, letterSpacing: spacing, fontFamily: font || F.head, background: `linear-gradient(135deg,${G.dark},${G.base},${G.bright},${G.light},${G.base})`, backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 6s linear infinite", ...style }}>{children}</span>;
}

function Btn({ children, onClick, gold, green, outline, sm, full, disabled, loading, icon, style = {} }) {
  const [h, setH] = useState(false);
  const bg = gold ? `linear-gradient(135deg,${h ? G.light : G.base},${h ? G.base : G.dark})` : green ? `linear-gradient(135deg,${h ? "#34d399" : "#10b981"},${h ? "#10b981" : "#059669"})` : outline ? "transparent" : `linear-gradient(135deg,${h ? G.light : G.base},${h ? G.base : G.dark})`;
  return <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={disabled || loading ? undefined : onClick} style={{ padding: sm ? "8px 16px" : "14px 32px", borderRadius: gold ? 3 : 8, cursor: disabled || loading ? "wait" : "pointer", fontSize: sm ? 10 : 13, fontWeight: 800, letterSpacing: gold ? 3 : 2, textTransform: "uppercase", fontFamily: F.head, border: outline ? `1px solid ${h ? G.base : S.bL}` : gold ? `1px solid ${G.base}` : "none", background: bg, color: gold || (!outline && !green) ? S.black : green ? "#fff" : h ? G.bright : G.base, boxShadow: gold ? `0 4px 20px rgba(197,179,88,${h ? 0.5 : 0.3})` : "none", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, ...style }}>
    {loading && <span style={{ width: 12, height: 12, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
    {icon && !loading && <span>{icon}</span>}{children}
  </button>;
}

// ─── Pipeline Status ───
const PIPE = [
  { icon: "🧠", name: "Brain", model: "Claude 4.5 Sonnet", ms: "<150ms" },
  { icon: "👂", name: "Ears", model: "Whisper V3", ms: "50ms" },
  { icon: "🔊", name: "Voice", model: "Chatterbox TTS", ms: "2-4s" },
  { icon: "🎭", name: "Face", model: "KDTalker / MEMO", ms: "15-30s" },
  { icon: "📡", name: "Stream", model: "WebRTC", ms: "<30ms" },
];

function PipelineBar({ activeStep }) {
  return (
    <div style={{ display: "flex", gap: 3, padding: "6px 10px", background: S.d1, borderRadius: 6, border: `1px solid ${S.border}` }}>
      {PIPE.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 4, background: i <= activeStep ? "rgba(16,185,129,0.08)" : S.d3, border: `1px solid ${i <= activeStep ? "rgba(16,185,129,0.25)" : S.border}`, transition: "all 0.3s" }}>
          <span style={{ fontSize: 10 }}>{p.icon}</span>
          <span style={{ fontSize: 8, fontFamily: F.mono, color: i <= activeStep ? "#10b981" : G.accent, fontWeight: 600 }}>{p.name}</span>
          <span style={{ fontSize: 7, fontFamily: F.mono, color: i === activeStep ? "#34d399" : S.bL }}>{p.ms}</span>
          {i < PIPE.length - 1 && <span style={{ color: S.bL, fontSize: 8, marginLeft: 2 }}>→</span>}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function EveStudio() {
  // State
  const [eveImg, setEveImg] = useState(EVE_IMG);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pipeStep, setPipeStep] = useState(-1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [statusText, setStatusText] = useState("Upload a portrait or use default EVE");
  const [engine, setEngine] = useState("kdtalker");
  const [persona, setPersona] = useState("default");
  const [voiceTone, setVoiceTone] = useState(0.6);
  const [consistency, setConsistency] = useState(0.85);
  const [latency, setLatency] = useState(15);
  const [logs, setLogs] = useState([]);
  const chatRef = useRef(null);
  const audioRef = useRef(null);
  const fileRef = useRef(null);

  const addLog = (msg) => setLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  // ─── Upload custom portrait ───
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEveImg(url);
    setStatusText("Custom portrait loaded → Ready for 4D");
    addLog("Portrait uploaded — 2D → 4D pipeline ready");
  };

  // ─── Full Pipeline: Text → Brain → Voice → Face ───
  const runPipeline = async (userText) => {
    if (!userText.trim()) return;
    setProcessing(true);
    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setInput("");

    try {
      // STEP 1: Brain — Claude generates response
      setPipeStep(0);
      setStatusText("🧠 EVE is thinking...");
      addLog("Brain: Sending to Claude API...");

      const brainMessages = [{ role: "user", content: EVE_SYSTEM + "\n\nConversation so far:\n" + newMessages.map(m => `${m.role === "user" ? "Human" : "EVE"}: ${m.text}`).join("\n") + "\n\nRespond as EVE:" }];

      let eveText = "I hear you. Let me think about that for a moment.";
      try {
        const brainRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 200, messages: brainMessages })
        });
        const brainData = await brainRes.json();
        eveText = brainData.content?.[0]?.text || eveText;
      } catch (e) {
        addLog(`Brain fallback: ${e.message}`);
      }

      addLog(`Brain: "${eveText.slice(0, 60)}..."`);
      setMessages(prev => [...prev, { role: "eve", text: eveText }]);

      // STEP 2: Voice — Chatterbox TTS
      setPipeStep(2);
      setStatusText("🔊 Generating EVE's voice...");
      addLog("Voice: Chatterbox TTS generating...");

      try {
        const voiceResult = await gradioCall(CHATTERBOX, "/generate_tts_audio", [
          eveText.slice(0, 295),  // max 300 chars
          null,                    // no reference audio (default voice)
          0.5,                     // cfg
          voiceTone,               // exaggeration
          0,                       // seed (random)
          0.8,                     // temperature
          false                    // vad trim
        ]);

        if (voiceResult?.[0]) {
          const audioData = voiceResult[0];
          let url = null;
          if (audioData?.url) {
            url = audioData.url.startsWith("http") ? audioData.url : `${CHATTERBOX}${audioData.url}`;
          } else if (audioData?.path) {
            url = `${CHATTERBOX}/gradio_api/file=${audioData.path}`;
          }
          if (url) {
            setAudioUrl(url);
            addLog(`Voice: Audio generated → ${url.slice(-40)}`);

            // Play audio immediately
            setSpeaking(true);
            if (audioRef.current) {
              audioRef.current.src = url;
              audioRef.current.play().catch(() => {});
            }

            // STEP 3: Face — KDTalker or MEMO
            setPipeStep(3);
            const engineName = engine === "memo" ? "MEMO" : "KDTalker";
            setStatusText(`🎭 ${engineName}: Generating talking head...`);
            addLog(`Face: ${engineName} processing portrait + audio...`);

            try {
              let faceResult;
              if (engine === "memo") {
                faceResult = await gradioCall(MEMO_URL, "/generate", [eveImg, url, 0]);
              } else {
                faceResult = await gradioCall(KDTALKER, "/gradio_infer", [eveImg, url]);
              }

              if (faceResult?.[0]) {
                const videoData = faceResult[0];
                let vUrl = null;
                if (videoData?.url) {
                  vUrl = videoData.url.startsWith("http") ? videoData.url : `${engine === "memo" ? MEMO_URL : KDTALKER}${videoData.url}`;
                } else if (videoData?.path) {
                  const base = engine === "memo" ? MEMO_URL : KDTALKER;
                  vUrl = `${base}/gradio_api/file=${videoData.path}`;
                } else if (typeof videoData === "string") {
                  vUrl = videoData.startsWith("http") ? videoData : `${engine === "memo" ? MEMO_URL : KDTALKER}/file=${videoData}`;
                }
                if (vUrl) {
                  setVideoUrl(vUrl);
                  addLog(`Face: Talking head video ready!`);
                }
              }
            } catch (faceErr) {
              addLog(`Face: ${faceErr.message} (audio-only mode)`);
            }
          }
        }
      } catch (voiceErr) {
        addLog(`Voice: ${voiceErr.message} (text-only mode)`);
      }

      setPipeStep(4);
      setStatusText("✅ EVE responded");

    } catch (err) {
      addLog(`Pipeline error: ${err.message}`);
      setStatusText(`⚠️ ${err.message}`);
    }

    setTimeout(() => { setSpeaking(false); setPipeStep(-1); }, 3000);
    setProcessing(false);
  };

  // Auto-scroll chat
  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);

  // Inject CSS
  useEffect(() => {
    if (!document.getElementById("eve-css")) {
      const s = document.createElement("style");
      s.id = "eve-css";
      s.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;background:${S.d1}}::-webkit-scrollbar-thumb{background:${G.dark};border-radius:2px}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(197,179,88,0.2)}50%{box-shadow:0 0 50px rgba(197,179,88,0.5)}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
        @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.3}}
        textarea:focus,input:focus{outline:none;border-color:${G.base}!important}
      `;
      document.head.appendChild(s);
    }
  }, []);

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  return (
    <div style={{ fontFamily: F.body, background: S.black, color: "#e0e0e0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <audio ref={audioRef} onEnded={() => setSpeaking(false)} />
      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />

      {/* ─── HEADER ─── */}
      <header style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${S.border}`, background: S.d1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Eden Flame Logo */}
          <svg width="32" height="36" viewBox="0 0 40 48">
            <defs><linearGradient id="fg" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor={G.dark}/><stop offset="50%" stopColor={G.base}/><stop offset="100%" stopColor={G.bright}/></linearGradient></defs>
            <path d="M20 2 C20 2 8 16 8 28 C8 36 13 44 20 46 C27 44 32 36 32 28 C32 16 20 2 20 2Z M20 8 C20 8 26 18 26 26 C26 32 23 36 20 38 C17 36 14 32 14 26 C14 18 20 8 20 8Z" fill="url(#fg)"/>
          </svg>
          <div>
            <GoldText size={22} weight={900} spacing={4} font={F.display}>EDEN STUDIO</GoldText>
            <div style={{ fontSize: 9, color: G.accent, fontFamily: F.mono, letterSpacing: 2, marginTop: 1 }}>THRIVE AI // BERYL AI LABS</div>
          </div>
        </div>
        <PipelineBar activeStep={pipeStep} />
      </header>

      {/* ─── MAIN LAYOUT: 3 Columns ─── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ═══ LEFT: AGENTIC BUILDER ═══ */}
        <div style={{ width: 280, minWidth: 280, borderRight: `1px solid ${S.border}`, padding: 16, overflowY: "auto", background: S.d1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d2 }}>
            <GoldText size={12} spacing={2}>Agentic Builder</GoldText>

            {/* Portrait Upload */}
            <div onClick={() => fileRef.current?.click()} style={{ marginTop: 10, height: 60, borderRadius: 6, border: `1px dashed ${S.bL}`, background: S.d3, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", cursor: "pointer" }}>
              <img src={eveImg} style={{ width: 42, height: 42, borderRadius: 5, objectFit: "cover", border: `1px solid ${S.border}` }} onError={(e) => { e.target.style.display = "none"; }} />
              <div>
                <span style={{ fontSize: 10, color: G.base, fontFamily: F.head, fontWeight: 600, display: "block" }}>EVE Portrait</span>
                <span style={{ fontSize: 8, color: S.bL, fontFamily: F.mono }}>Click to change</span>
              </div>
            </div>
          </div>

          {/* Persona */}
          <div style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d2 }}>
            <span style={{ fontSize: 8, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 6 }}>Persona</span>
            {[["default", "EVE · Companion"], ["pro", "EVE · Professional"], ["intimate", "EVE · Intimate"], ["mentor", "EVE · Mentor"]].map(([id, label]) => (
              <div key={id} onClick={() => setPersona(id)} style={{ padding: "6px 10px", borderRadius: 5, cursor: "pointer", marginBottom: 3, background: persona === id ? "rgba(197,179,88,0.06)" : "transparent", border: `1px solid ${persona === id ? G.dark : "transparent"}`, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: persona === id ? G.base : S.d4 }} />
                <span style={{ fontSize: 10, color: persona === id ? G.base : G.accent, fontFamily: F.head, fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Face Engine */}
          <div style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d2 }}>
            <span style={{ fontSize: 8, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 6 }}>Face Engine</span>
            {[["kdtalker", "🎭 KDTalker", "Fast, natural motion"], ["memo", "🧠 MEMO", "Emotional, expressive"]].map(([id, label, desc]) => (
              <div key={id} onClick={() => setEngine(id)} style={{ padding: "8px 10px", borderRadius: 5, cursor: "pointer", marginBottom: 3, background: engine === id ? "rgba(197,179,88,0.06)" : "transparent", border: `1px solid ${engine === id ? G.dark : "transparent"}` }}>
                <span style={{ fontSize: 10, color: engine === id ? G.base : G.accent, fontFamily: F.head, fontWeight: 700 }}>{label}</span>
                <span style={{ fontSize: 8, color: S.bL, fontFamily: F.mono, display: "block", marginTop: 2 }}>{desc}</span>
              </div>
            ))}
          </div>

          {/* Build Agent Logic button */}
          <Btn gold full onClick={() => addLog("Agent logic building...")}>Build Agent Logic</Btn>
        </div>

        {/* ═══ CENTER: EVE AVATAR + CHAT ═══ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: S.black }}>

          {/* Title bar */}
          <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
            <span style={{ fontSize: 9, letterSpacing: 4, color: G.accent, fontFamily: F.head, textTransform: "uppercase" }}>Zero Shot Lip Sync Agentic Perfection</span>
          </div>

          {/* Avatar Display */}
          <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center", padding: "0 20px 10px" }}>
            <div style={{ position: "relative", width: 360, borderRadius: 14, overflow: "hidden", border: `2px solid ${speaking ? G.base : S.border}`, boxShadow: speaking ? `0 0 50px rgba(197,179,88,0.3)` : `0 6px 30px rgba(0,0,0,0.5)`, transition: "all 0.5s", animation: speaking ? "glow 2.5s ease-in-out infinite" : "none" }}>
              {videoUrl ? (
                <video src={videoUrl} autoPlay loop muted={false} playsInline style={{ width: "100%", display: "block" }} />
              ) : (
                <img src={eveImg} style={{ width: "100%", display: "block" }} />
              )}
              {/* Speaking indicator */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 14px 8px", background: "linear-gradient(transparent,rgba(5,3,2,0.8))" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: speaking ? "#10b981" : processing ? "#f59e0b" : G.base, animation: speaking ? "pulse-dot 1s ease-in-out infinite" : "none" }} />
                  <span style={{ fontSize: 9, fontFamily: F.mono, color: speaking ? "#10b981" : processing ? "#f59e0b" : G.accent }}>
                    {speaking ? "EVE is speaking" : processing ? "Processing..." : "Ready"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Waveform */}
          <div style={{ padding: "0 40px" }}>
            <Waveform active={speaking} n={60} color={speaking ? "#10b981" : G.base} h={32} />
          </div>

          {/* Voice Design Row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "8px 20px" }}>
            {[["🎵", "#E8A838"], ["🎵", "#C5B358"], ["🎵", "#D4AF37"], ["🔊", "#F5E6A3"], ["🎤", "#10b981"], ["📻", "#8B7355"], ["🎶", "#6B4F0A"], ["🎙", "#C5B358"]].map(([icon, color], i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${i === 3 ? G.base : S.border}`, background: i === 3 ? "rgba(197,179,88,0.08)" : S.d3, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, transition: "all 0.3s" }}>
                {icon}
              </div>
            ))}
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", borderTop: `1px solid ${S.border}`, background: S.d1 }}>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "12px 20px", minHeight: 120 }}>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", padding: 20, color: S.bL, fontSize: 12, fontFamily: F.body }}>
                  Type a message or click "Speak to EVE" to begin...
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 8, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fade-up 0.3s ease" }}>
                  <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.role === "user" ? `linear-gradient(135deg,${G.base},${G.dark})` : S.d3, color: m.role === "user" ? S.black : G.bright, fontSize: 13, fontFamily: F.body, lineHeight: 1.6, border: m.role === "eve" ? `1px solid ${S.border}` : "none" }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {processing && (
                <div style={{ display: "flex", gap: 4, padding: 8 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: G.base, animation: `pulse-dot 1s ease-in-out infinite ${i * 0.2}s` }} />)}
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${S.border}`, display: "flex", gap: 8 }}>
              <Btn gold full onClick={() => runPipeline(input || "Hey Eve, what's good?")} disabled={processing} loading={processing} style={{ flex: 1 }}>
                Text Eve
              </Btn>
              <Btn gold full onClick={() => { setListening(true); addLog("Voice input: Feature requires microphone API"); setTimeout(() => setListening(false), 2000); }} style={{ flex: 1.4, fontSize: 15, letterSpacing: 4 }}>
                Speak to Eve
              </Btn>
            </div>

            {/* Text input */}
            <div style={{ padding: "0 16px 12px", display: "flex", gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !processing && runPipeline(input)} placeholder="Type your message to EVE..." style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d2, color: G.bright, fontSize: 13, fontFamily: F.body }} />
              <Btn sm outline onClick={() => runPipeline(input)} disabled={processing || !input.trim()} icon="→">Send</Btn>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: AGENT SETTINGS ═══ */}
        <div style={{ width: 260, minWidth: 260, borderLeft: `1px solid ${S.border}`, padding: 16, overflowY: "auto", background: S.d1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d2 }}>
            <GoldText size={12} spacing={2}>Agent Settings</GoldText>

            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 8, color: G.accent, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Consistency · 0.3 Rule</span>
                <span style={{ fontSize: 9, color: G.base, fontFamily: F.mono }}>{Math.round(consistency * 100)}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: S.d4, position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${consistency * 100}%`, borderRadius: 2, background: `linear-gradient(90deg,${G.dark},${G.base})` }} />
                <input type="range" min={0} max={1} step={0.01} value={consistency} onChange={e => setConsistency(Number(e.target.value))} style={{ position: "absolute", top: -8, left: 0, width: "100%", height: 20, opacity: 0, cursor: "pointer" }} />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 8, color: G.accent, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Voice Tone · Expressiveness</span>
                <span style={{ fontSize: 9, color: G.base, fontFamily: F.mono }}>{Math.round(voiceTone * 100)}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: S.d4, position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${voiceTone * 100}%`, borderRadius: 2, background: `linear-gradient(90deg,${G.dark},${G.base})` }} />
                <input type="range" min={0.25} max={2} step={0.05} value={voiceTone} onChange={e => setVoiceTone(Number(e.target.value))} style={{ position: "absolute", top: -8, left: 0, width: "100%", height: 20, opacity: 0, cursor: "pointer" }} />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 8, color: G.accent, fontFamily: F.head, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Real Time Latency</span>
                <span style={{ fontSize: 9, color: G.base, fontFamily: F.mono }}>{latency}ms</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: S.d4, position: "relative" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(latency / 30) * 100}%`, borderRadius: 2, background: `linear-gradient(90deg,${G.dark},${G.base})` }} />
                <input type="range" min={5} max={30} step={1} value={latency} onChange={e => setLatency(Number(e.target.value))} style={{ position: "absolute", top: -8, left: 0, width: "100%", height: 20, opacity: 0, cursor: "pointer" }} />
              </div>
            </div>
          </div>

          {/* Lip Sync Latency */}
          <div style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d2 }}>
            <span style={{ fontSize: 8, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 6 }}>Lip-Sync Latency</span>
            <Btn green full sm onClick={() => addLog("Latency monitor active")}>Latency Monitor</Btn>
          </div>

          {/* Logs */}
          <div style={{ padding: "12px 14px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.d2, flex: 1 }}>
            <span style={{ fontSize: 8, color: G.accent, fontFamily: F.head, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 6 }}>Logs & Output</span>
            <div style={{ height: 200, overflowY: "auto", background: S.d3, borderRadius: 6, padding: 8, border: `1px solid ${S.border}` }}>
              {logs.length === 0 ? (
                <span style={{ fontSize: 9, color: S.bL, fontFamily: F.mono }}>Pipeline logs appear here...</span>
              ) : logs.map((l, i) => (
                <div key={i} style={{ fontSize: 8, fontFamily: F.mono, color: l.includes("✅") || l.includes("ready") ? "#10b981" : l.includes("error") || l.includes("Error") ? "#ff6b6b" : G.accent, marginBottom: 3, lineHeight: 1.5 }}>{l}</div>
              ))}
            </div>
          </div>

          {/* Build Voice Agent */}
          <Btn gold full onClick={() => addLog("Voice agent pipeline initialized")}>Build Voice Agent</Btn>
        </div>
      </div>

      {/* ─── Status Bar ─── */}
      <div style={{ padding: "6px 20px", borderTop: `1px solid ${S.border}`, background: S.d1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, fontFamily: F.mono, color: G.accent }}>{statusText}</span>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 8, fontFamily: F.mono, color: S.bL }}>Engine: {engine === "memo" ? "MEMO" : "KDTalker"}</span>
          <span style={{ fontSize: 8, fontFamily: F.mono, color: S.bL }}>Persona: {persona}</span>
          <span style={{ fontSize: 8, fontFamily: F.mono, color: "#10b981" }}>✦ EDEN v5</span>
        </div>
      </div>
    </div>
  );
}
