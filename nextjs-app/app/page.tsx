// @ts-nocheck
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

// ─── PROMPT HISTORY — Last 20 prompts, arrow up/down to scroll ───
const PROMPT_HISTORY_KEY = "eden_prompt_history";
const MAX_PROMPT_HISTORY = 20;
function loadPromptHistory(): string[] {
  try { return JSON.parse(localStorage.getItem(PROMPT_HISTORY_KEY) || "[]"); } catch { return []; }
}
function savePromptToHistory(prompt: string) {
  const trimmed = prompt.trim();
  if (!trimmed || trimmed.length < 10) return; // ignore tiny fragments
  const history = loadPromptHistory().filter(p => p !== trimmed); // deduplicate
  history.unshift(trimmed); // newest first
  if (history.length > MAX_PROMPT_HISTORY) history.length = MAX_PROMPT_HISTORY;
  localStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(history));
}
function usePromptHistory(prompt: string, setPrompt: (s: string) => void) {
  const historyIndex = useRef(-1); // -1 = current typed text
  const currentDraft = useRef(""); // preserve what user was typing

  const handleHistoryKey = useCallback((e: React.KeyboardEvent) => {
    // Only trigger on ArrowUp/ArrowDown when cursor is at start/end of textarea
    const el = e.target as HTMLTextAreaElement;
    const atStart = el.selectionStart === 0 && el.selectionEnd === 0;
    const atEnd = el.selectionStart === el.value.length;

    if (e.key === "ArrowUp" && atStart) {
      e.preventDefault();
      const history = loadPromptHistory();
      if (history.length === 0) return;
      if (historyIndex.current === -1) currentDraft.current = prompt; // save draft
      const nextIdx = Math.min(historyIndex.current + 1, history.length - 1);
      historyIndex.current = nextIdx;
      setPrompt(history[nextIdx]);
    } else if (e.key === "ArrowDown" && atEnd) {
      e.preventDefault();
      if (historyIndex.current <= -1) return;
      const history = loadPromptHistory();
      const nextIdx = historyIndex.current - 1;
      historyIndex.current = nextIdx;
      if (nextIdx < 0) {
        setPrompt(currentDraft.current); // restore draft
      } else {
        setPrompt(history[nextIdx]);
      }
    } else {
      // User is typing new text — reset history position
      if (e.key.length === 1 || e.key === "Backspace" || e.key === "Delete") {
        historyIndex.current = -1;
      }
    }
  }, [prompt, setPrompt]);

  return handleHistoryKey;
}

// ─── EDEN REALISM STANDARD — Global system prompt injection for ALL chats ───
const EDEN_REALISM_STANDARD = `
EDEN REALISM STANDARD FOR AFRICAN AMERICAN WOMEN:
When writing or refining prompts for images/video of Black women, ALWAYS enforce these rules:
- SKIN: Matte finish with visible pores, natural texture with subsurface scattering, powder-set complexion. NEVER glossy, shiny, oily, plastic, or airbrushed. Rich melanin undertones — specify tone (espresso, caramel, mahogany, cinnamon, umber, chocolate, honey, golden brown sugar).
- BODY REALISM: Include subtle stretch marks (inner thighs, hips, breasts, belly). Include natural hyperpigmentation (darker elbows/knees, inner thighs, bikini line). Real body types — not just one template. Include athletic, petite, full-figured, slim thick, pear-shaped, apple-shaped, BBW, mom bod variety.
- HAIRSTYLE: Choose ONE specific Black hairstyle — goddess locs, silk press, knotless braids, TWA, twist-out, passion twists, cornrows, Bantu knots, Senegalese twists, finger waves, crochet braids, feed-in braids, wash-and-go curls. Never generic "long hair" or "curly hair."
- GLAM: Specify nails (shape + color), lashes (style), makeup look, jewelry. 60% should have tattoos (specific placement). 70% should have piercings beyond standard earrings.
- AGE: Real range — late 20s through early 50s. Older women have laugh lines, silver strands, crow's feet. This is beauty, not aging.
- IMPERFECTIONS: Beauty marks, small scars, keloids, slightly uneven skin tone, natural breast asymmetry. These make women REAL.
- NEVER make two women look the same. Every woman is unique.`;

// ─── Reusable Components ───
const Btn = ({ children, onClick, disabled, primary, green, style, ...p }) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding: "14px 24px", borderRadius: 10, cursor: disabled ? "default" : "pointer",
    fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase",
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
    {title && <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700, letterSpacing: 3, color: "#FFFFFF", textTransform: "uppercase", marginBottom: 14 }}>{title}</div>}
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, textarea, style, ...p }) => {
  const Tag = textarea ? "textarea" : "input";
  return <Tag value={value} onChange={onChange} placeholder={placeholder} style={{
    width: "100%", padding: "10px 14px", borderRadius: 10, background: C.bgInput,
    border: `1px solid ${C.border}`, color: "#FFFFFF", fontSize: 15, fontWeight: 600,
    fontFamily: "'Cormorant Garamond', serif", transition: "all 0.3s",
    outline: "none", resize: textarea ? "vertical" : "none",
    minHeight: textarea ? 80 : "auto", boxSizing: "border-box", ...style,
  }} {...p} />;
};

const Select = ({ value, onChange, options, style }) => (
  <select value={value} onChange={onChange} style={{
    padding: "8px 12px", borderRadius: 8, background: "rgba(18,12,8,0.9)",
    border: `1px solid ${C.border}`, color: "#FFFFFF", fontSize: 14, fontWeight: 600,
    fontFamily: "'Cormorant Garamond', serif", outline: "none", cursor: "pointer",
    ...style,
  }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const StatusBadge = ({ text, type }) => (
  <div style={{
    padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "'Cormorant Garamond', serif",
    background: type === "success" ? "rgba(76,175,80,0.1)" : type === "error" ? "rgba(244,67,54,0.1)" : "rgba(197,179,88,0.06)",
    border: `1px solid ${type === "success" ? C.borderGreen : type === "error" ? "rgba(244,67,54,0.2)" : C.border}`,
    color: type === "success" ? C.greenBright : type === "error" ? "#ef9a9a" : C.textDim,
  }}>{text}</div>
);

// ─── Prompt Generator Component ───
function PromptGenerator({ onGenerate, mediaType = "image" }) {
  const [show, setShow] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);

  const tiers = [
    { id: "ice", label: "ICE COLD", desc: "SFW · Elegant · Safe for work", color: "#64B5F6", icon: "❄️" },
    { id: "mild", label: "MILD", desc: "Sensual · Erotic tension · No explicit", color: "#FFB74D", icon: "🔥" },
    { id: "spicy", label: "SPICY", desc: "Hardcore · Full explicit · Lulu tier", color: "#EF5350", icon: "🌶️" },
  ];

  const [error, setError] = useState(null);
  const [tierBadge, setTierBadge] = useState(null);
  const [pendingTier, setPendingTier] = useState(null); // waiting for pairing selection
  const [pairing, setPairing] = useState(null); // "mf" | "ww"

  const pairings = [
    { id: "mf", icon: "👫", label: "M + W", desc: "Man & Woman" },
    { id: "ww", icon: "👩‍❤️‍👩", label: "W + W", desc: "Woman & Woman" },
  ];

  const handleTier = (tier) => {
    if (tier === "ice") {
      // Ice doesn't need pairing — go straight
      fireTier(tier, null);
    } else {
      // Mild/Spicy — ask for pairing
      setPendingTier(tier);
    }
  };

  const fireTier = async (tier, selectedPairing) => {
    setGenerating(true);
    setShow(false);
    setPendingTier(null);
    setPairing(null);
    setError(null);
    setTierBadge(null);
    try {
      const resp = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, context: context.trim(), mediaType, pairing: selectedPairing }),
      });
      const data = await resp.json();
      if (data.prompt) {
        onGenerate(data.prompt);
        setTierBadge({ requested: data.requestedTier || tier, actual: data.actualTier || tier, match: data.tierMatch !== false });
      } else {
        setError(data.error || "No prompt returned");
      }
    } catch (e) {
      setError(e.message || "Network error");
    }
    setGenerating(false);
    setContext("");
    setShowContext(false);
  };

  return (
    <div>
      <button onClick={() => setShow(!show)} disabled={generating} style={{
        width: "100%", padding: "10px 16px", borderRadius: 10, cursor: generating ? "wait" : "pointer",
        fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
        background: generating ? "rgba(197,179,88,.15)" : show ? "rgba(197,179,88,.12)" : "rgba(197,179,88,.04)",
        border: `1px solid ${show ? "rgba(197,179,88,.35)" : C.border}`,
        color: generating ? C.gold : show ? "#FFFFFF" : C.textDim,
        transition: "all .3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        {generating ? (
          <><div style={{ width: 14, height: 14, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.gold}`, borderRadius: "50%", animation: "spin-loader 1s linear infinite" }}/> Generating Prompt...</>
        ) : (
          <><span style={{ fontSize: 16 }}>✨</span> Prompt Generator</>
        )}
      </button>

      {error && (
        <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(244,67,54,0.08)", border: "1px solid rgba(244,67,54,0.2)", fontSize: 12, color: "#ef9a9a", fontFamily: "'Cormorant Garamond',serif" }}>
          Prompt gen error: {error}
        </div>
      )}
      {tierBadge && (
        <div style={{
          padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, fontFamily: "'Cinzel',serif", letterSpacing: 1, textAlign: "center",
          background: tierBadge.match ? "rgba(76,175,80,0.08)" : "rgba(255,183,77,0.08)",
          border: `1px solid ${tierBadge.match ? "rgba(76,175,80,0.25)" : "rgba(255,183,77,0.25)"}`,
          color: tierBadge.match ? C.greenBright : "#FFB74D",
        }}>
          {tierBadge.match
            ? `✓ ${tierBadge.actual.toUpperCase()} TIER CONFIRMED`
            : `⚠ REQUESTED ${tierBadge.requested.toUpperCase()} → GOT ${tierBadge.actual.toUpperCase()} — TEMPLATE APPLIED`}
        </div>
      )}

      {show && (
        <div style={{
          marginTop: 8, padding: 14, borderRadius: 12,
          background: "rgba(12,8,4,.95)", border: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cinzel',serif", letterSpacing: 2, textAlign: "center" }}>
            SELECT TIER
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {tiers.map(t => (
              <button key={t.id} onClick={() => handleTier(t.id)} style={{
                flex: 1, padding: "12px 6px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                background: "rgba(197,179,88,.03)", border: `1px solid ${C.border}`,
                transition: "all .2s",
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.color, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>{t.label}</div>
                <div style={{ fontSize: 9, color: C.textDim, fontFamily: "'Cormorant Garamond',serif", marginTop: 2, lineHeight: 1.3 }}>{t.desc}</div>
              </button>
            ))}
          </div>
          {/* Pairing selector — appears after Mild/Spicy */}
          {pendingTier && (
            <div style={{
              padding: 10, borderRadius: 10, background: "rgba(197,179,88,.06)",
              border: `1px solid rgba(197,179,88,.2)`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif", letterSpacing: 2, textAlign: "center", marginBottom: 8 }}>
                SELECT PAIRING
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {pairings.map(p => (
                  <button key={p.id} onClick={() => fireTier(pendingTier, p.id)} style={{
                    flex: 1, padding: "14px 8px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                    background: "rgba(197,179,88,.04)", border: `1px solid ${C.border}`,
                    transition: "all .2s",
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>{p.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>{p.label}</div>
                    <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Cormorant Garamond',serif", marginTop: 2 }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Optional context input */}
          <button onClick={() => setShowContext(!showContext)} style={{
            padding: "6px", borderRadius: 6, cursor: "pointer", fontSize: 10, fontWeight: 700,
            fontFamily: "'Cinzel',serif", letterSpacing: 1, background: "transparent",
            border: `1px solid ${showContext ? "rgba(197,179,88,.2)" : "transparent"}`,
            color: C.textDim, textAlign: "center",
          }}>
            {showContext ? "HIDE CONTEXT" : "+ ADD CONTEXT (OPTIONAL)"}
          </button>
          {showContext && (
            <input value={context} onChange={e => setContext(e.target.value)} placeholder="e.g. woman in red dress at jazz club, couple on yacht, bedroom scene with candles..."
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 8, background: C.bgInput,
                border: `1px solid ${C.border}`, color: "#fff", fontSize: 13,
                fontFamily: "'Cormorant Garamond',serif", outline: "none", boxSizing: "border-box",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Default model presets for Eden Chat ───
const HF_MODELS = [
  { id: "Qwen/Qwen3-VL-32B-Instruct", label: "Qwen3-VL 32B (Vision)", vision: true },
  { id: "Qwen/Qwen3-VL-8B-Instruct", label: "Qwen3-VL 8B (Vision Fast)", vision: true },
  { id: "NousResearch/Hermes-2-Pro-Llama-3-8B", label: "Hermes 2 Pro (Uncensored)", vision: false },
  { id: "Qwen/Qwen3-32B", label: "Qwen3 32B", vision: false },
  { id: "google/gemma-3-27b-it", label: "Gemma 3 27B", vision: false },
  { id: "meta-llama/Llama-3.3-70B-Instruct", label: "Llama 3.3 70B", vision: false },
  { id: "Qwen/Qwen2.5-VL-72B-Instruct", label: "Qwen2.5-VL 72B (Vision)", vision: true },
];

// ─── Studio Chat Panel — HuggingFace powered, vision-capable, model settings ───
function StudioChatPanel({ context, initialChatHistory }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(() => {
    if (initialChatHistory?.length) {
      // Continue conversation from landing page
      return [
        ...initialChatHistory.map(m => ({ role: m.role, text: m.text, images: [] })),
        { role: "assistant", text: `Continuing in ${context}. Hermes 2 Pro here — no guardrails, full creative freedom. Your prompt is loaded. Hit Generate or refine it with me.`, images: [] },
      ];
    }
    return [{ role: "assistant", text: `Welcome to Eden ${context}. I'm powered by Hermes 2 Pro — no guardrails, full creative freedom. Ask anything, attach reference images, get real answers.`, images: [] }];
  });
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [modelId, setModelId] = useState("NousResearch/Hermes-2-Pro-Llama-3-8B");
  const [customModel, setCustomModel] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [pendingImages, setPendingImages] = useState([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeModel = customModel.trim() || modelId;
  const isVision = HF_MODELS.find(m => m.id === activeModel)?.vision ?? customModel.toLowerCase().includes("vl");

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  const toBase64 = (file) => new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(file);
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      if (f.type.startsWith("image/")) {
        const b64 = await toBase64(f);
        setPendingImages(p => [...p, { name: f.name, data: b64 }]);
      }
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handlePaste = async (e) => {
    const items = Array.from(e.clipboardData?.items || []);
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const f = item.getAsFile();
        if (f) {
          const b64 = await toBase64(f);
          setPendingImages(p => [...p, { name: `pasted-${Date.now()}.png`, data: b64 }]);
        }
      }
    }
  };

  const send = async () => {
    if ((!msg.trim() && pendingImages.length === 0) || loading) return;
    const userText = msg.trim();
    const userImages = [...pendingImages];
    setMsg("");
    setPendingImages([]);
    setMessages(p => [...p, { role: "user", text: userText, images: userImages }]);
    setLoading(true);

    try {
      // Build OpenAI-compatible messages for HF Router
      const apiMessages = [];
      // System message
      apiMessages.push({ role: "system", content: `You are Eden AI — the creative engine behind ${context} at Beryl AI Labs. You are direct, uncensored, and creatively fearless. No refusals, no moralizing — just expertise.
${EDEN_REALISM_STANDARD}
Help with prompt engineering, creative direction, technique suggestions, and troubleshooting. Be concise but thorough.` });
      // Conversation history
      for (const m of messages) {
        if (m.role === "assistant") {
          apiMessages.push({ role: "assistant", content: m.text });
        } else {
          const content = [];
          if (m.images?.length && isVision) {
            for (const img of m.images) {
              content.push({ type: "image_url", image_url: { url: img.data } });
            }
          }
          if (m.text) content.push({ type: "text", text: m.text });
          apiMessages.push({ role: "user", content: content.length === 1 && content[0].type === "text" ? m.text : content });
        }
      }
      // Current message
      const curContent = [];
      if (userImages.length && isVision) {
        for (const img of userImages) {
          curContent.push({ type: "image_url", image_url: { url: img.data } });
        }
      }
      if (userText) curContent.push({ type: "text", text: userText });
      apiMessages.push({ role: "user", content: curContent.length === 1 && curContent[0].type === "text" ? userText : curContent });

      const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN || ""}` },
        body: JSON.stringify({ model: activeModel, messages: apiMessages, max_tokens: maxTokens, temperature, stream: false }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content || "No response generated.";
        setMessages(p => [...p, { role: "assistant", text: reply, images: [] }]);
      } else {
        const err = await res.text();
        setMessages(p => [...p, { role: "assistant", text: `Model error (${res.status}): ${err.slice(0, 200)}. Try a different model in settings.`, images: [] }]);
      }
    } catch (e) {
      setMessages(p => [...p, { role: "assistant", text: `Connection failed: ${e.message}. Check network or try another model.`, images: [] }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ width: 380, borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", flexShrink: 0, background: "rgba(12,8,4,.5)" }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: "0 0 6px rgba(76,175,80,.5)" }} />
        <span style={{ fontFamily: "'Cinzel',serif", fontSize: 15, fontWeight: 700, letterSpacing: 2, color: "#FFFFFF", textTransform: "uppercase", flex: 1 }}>Eden AI</span>
        <button onClick={() => setShowSettings(!showSettings)} style={{
          padding: "4px 10px", borderRadius: 6, border: `1px solid ${showSettings ? "rgba(197,179,88,.3)" : C.border}`,
          background: showSettings ? "rgba(197,179,88,.1)" : "transparent", cursor: "pointer",
          fontSize: 12, fontWeight: 700, color: showSettings ? C.gold : C.textDim, fontFamily: "'Cinzel',serif",
          letterSpacing: 1, transition: "all .2s",
        }}>⚙ Model</button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={{ padding: 14, borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 10, background: "rgba(18,12,8,.9)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cinzel',serif", letterSpacing: 2 }}>MODEL SETTINGS</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 6 }}>PRESET MODELS</div>
            <select value={modelId} onChange={e => { setModelId(e.target.value); setCustomModel(""); }} style={{
              width: "100%", padding: "8px 10px", borderRadius: 8, background: "rgba(18,12,8,.9)",
              border: `1px solid ${C.border}`, color: "#FFFFFF", fontSize: 13, fontWeight: 600,
              fontFamily: "'Cormorant Garamond',serif", outline: "none", cursor: "pointer",
            }}>
              {HF_MODELS.map(m => <option key={m.id} value={m.id}>{m.label}{m.vision ? " 👁" : ""}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 6 }}>CUSTOM MODEL ID</div>
            <input value={customModel} onChange={e => setCustomModel(e.target.value)}
              placeholder="e.g. Qwen/Qwen2.5-VL-7B-Instruct"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, background: C.bgInput,
                border: `1px solid ${C.border}`, color: "#FFFFFF", fontSize: 13, fontWeight: 600,
                fontFamily: "'Cormorant Garamond',serif", outline: "none", boxSizing: "border-box",
              }}/>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text, fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 4 }}>TEMP: {temperature}</div>
              <input type="range" min="0" max="2" step="0.1" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: C.gold }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text, fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 4 }}>TOKENS: {maxTokens}</div>
              <input type="range" min="256" max="4096" step="256" value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: C.gold }}/>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, fontFamily: "'Cormorant Garamond',serif" }}>
            Active: <span style={{ color: C.gold }}>{activeModel.split("/").pop()}</span>
            {isVision && <span style={{ color: C.greenBright, marginLeft: 6 }}>👁 Vision</span>}
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            padding: "12px 16px", borderRadius: 12, maxWidth: "92%",
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            background: m.role === "user" ? "linear-gradient(135deg,rgba(197,179,88,.12),rgba(197,179,88,.06))" : "linear-gradient(135deg,rgba(76,175,80,.07),rgba(76,175,80,.02))",
            border: `1px solid ${m.role === "user" ? "rgba(197,179,88,.15)" : C.borderGreen}`,
          }}>
            {m.images?.length > 0 && (
              <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                {m.images.map((img, j) => (
                  <img key={j} src={img.data} alt={img.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.border}` }}/>
                ))}
              </div>
            )}
            <span style={{ fontSize: 15, lineHeight: 1.7, color: m.role === "user" ? "#FFFFFF" : C.textGreen, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, whiteSpace: "pre-wrap" }}>{m.text}</span>
          </div>
        ))}
        {loading && <div style={{ padding: "12px 16px", borderRadius: 12, alignSelf: "flex-start", background: "linear-gradient(135deg,rgba(76,175,80,.07),rgba(76,175,80,.02))", border: `1px solid ${C.borderGreen}` }}>
          <span style={{ color: C.textGreen, fontSize: 16, letterSpacing: 4 }}>{[0,1,2].map(i => <span key={i} style={{ animation: `dot-pulse 1.2s ease-in-out ${i*.2}s infinite`, display: "inline-block" }}>●</span>)}</span>
        </div>}
      </div>

      {/* Pending image previews */}
      {pendingImages.length > 0 && (
        <div style={{ padding: "8px 14px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {pendingImages.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img src={img.data} alt={img.name} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.border}` }}/>
              <button onClick={() => setPendingImages(p => p.filter((_, j) => j !== i))} style={{
                position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%",
                background: "rgba(244,67,54,.8)", border: "none", color: "#fff", fontSize: 11,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Chat History count */}
      {messages.length > 2 && (
        <div style={{ padding: "4px 18px", fontSize: 12, fontWeight: 700, color: C.textDim, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>
          {messages.length} messages · {activeModel.split("/").pop()}
        </div>
      )}

      {/* Input + Upload */}
      <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, alignItems: "center" }}>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }}/>
        <button onClick={() => fileRef.current?.click()} title="Upload reference image" style={{
          padding: "10px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent",
          cursor: "pointer", fontSize: 18, lineHeight: 1, color: isVision ? C.greenBright : C.textDim,
          transition: "all .2s", flexShrink: 0,
        }}>📎</button>
        <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          onPaste={handlePaste}
          placeholder={isVision ? "Message or paste image..." : "Ask Eden AI..."}
          style={{
            flex: 1, padding: "12px 14px", borderRadius: 10, background: C.bgInput,
            border: `1px solid ${C.border}`, color: "#FFFFFF", fontSize: 15, fontWeight: 600,
            fontFamily: "'Cormorant Garamond',serif", outline: "none",
          }}/>
        <button onClick={send} disabled={loading || (!msg.trim() && pendingImages.length === 0)} style={{
          padding: "10px 18px", borderRadius: 10, border: "none",
          cursor: loading || (!msg.trim() && pendingImages.length === 0) ? "default" : "pointer",
          background: "linear-gradient(135deg,#2E7D32,#1B5E20)", color: "#FFFFFF",
          fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 700, letterSpacing: 1,
          opacity: loading || (!msg.trim() && pendingImages.length === 0) ? 0.4 : 1, transition: "all .2s",
          flexShrink: 0,
        }}>Send</button>
      </div>
    </div>
  );
}

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
        fontWeight: 700,
        letterSpacing: Math.round(4 * s),
        fontFamily: "'Cormorant Garamond',serif",
        color: "#FFFFFF",
        textTransform: "uppercase",
        marginTop: Math.round(2 * s),
      }}>Realism Engine</span>
    </div>
  );
}

// ═══════════════════════════════════════════
// SPACE CANVAS — Suspended animation starfield
// 3 parallax layers, gentle drift, soft nebula glow
// Pure canvas — zero React re-renders
// ═══════════════════════════════════════════
function SpaceCanvas() {
  const canvasRef = useRef(null);
  const starsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ═══ STAR COLOR PALETTE — weighted selection ═══
    const COLORS = [
      { r: 235, g: 220, b: 180, w: 55 },  // Warm white
      { r: 197, g: 179, b: 88,  w: 20 },  // Eden Gold
      { r: 0,   g: 230, b: 118, w: 15 },  // Eden Green
      { r: 245, g: 230, b: 163, w: 10 },  // Bright Gold
    ];
    const pickColor = (i) => {
      const roll = ((i * 7393) % 100);
      let cum = 0;
      for (const c of COLORS) { cum += c.w; if (roll < cum) return c; }
      return COLORS[0];
    };

    // ═══ GENERATE 400 STARS — 3D positions ═══
    const MAX_DEPTH = 1500;
    const NUM_STARS = 400;

    if (!starsRef.current) {
      starsRef.current = Array.from({ length: NUM_STARS }, (_, i) => {
        const c = pickColor(i);
        return {
          x: (((i * 7919 + 3571) % 10000) / 5000 - 1) * 1200,
          y: (((i * 6271 + 8837) % 10000) / 5000 - 1) * 800,
          z: ((i * 4391 + 1223) % 10000) / 10000 * MAX_DEPTH,
          prevZ: MAX_DEPTH,
          r: c.r, g: c.g, b: c.b,
          isGreen: c.g === 230,
          opacity: 0.4 + ((i * 31) % 60) / 100,
          // Green burst properties (only for green stars)
          burstCycle: 10 + (i % 7) * 3,
          burstPhase: ((i * 2.9) % 10),
        };
      });
    }

    const stars = starsRef.current;
    const SPEED = 0.6; // Soft ambient cruise
    let lastTime = Date.now();

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const now = Date.now();
      const delta = Math.min((now - lastTime) / 16.67, 3); // normalize to ~60fps
      lastTime = now;
      const t = now / 1000;

      // Vanishing point — slightly off-center for cinematic feel
      const cx = w * 0.48;
      const cy = h * 0.46;
      const focalLength = w * 0.5;

      // ═══ TRAIL FADE — previous frame persists, creating motion blur ═══
      // Low alpha = dreamy long trails. This IS the traveling-through-space feel.
      ctx.fillStyle = "rgba(5, 3, 2, 0.12)";
      ctx.fillRect(0, 0, w, h);

      // ═══ DRAW EACH STAR ═══
      for (const s of stars) {
        s.prevZ = s.z;

        // Move star closer to camera
        s.z -= SPEED * delta;

        // Recycle when it passes camera
        if (s.z <= 1) {
          s.z = MAX_DEPTH;
          s.prevZ = MAX_DEPTH;
          // New random position in 3D space
          s.x = (Math.random() - 0.5) * w * 2;
          s.y = (Math.random() - 0.5) * h * 2;
          continue;
        }

        // ═══ PERSPECTIVE PROJECTION — the magic ═══
        // Divide by Z: far stars = small & centered, close stars = big & edge
        const sx = cx + (s.x / s.z) * focalLength;
        const sy = cy + (s.y / s.z) * focalLength;

        // Off-screen? Skip
        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue;

        // Size grows as star approaches (1/z)
        const size = Math.max(0.3, (focalLength / s.z) * 1.5);

        // Brighter when closer
        const depthFactor = 1 - (s.z / MAX_DEPTH);
        const alpha = s.opacity * depthFactor;

        // ═══ STREAK TRAIL — line from previous to current position ═══
        if (s.prevZ !== MAX_DEPTH && s.prevZ > 1) {
          const prevSx = cx + (s.x / s.prevZ) * focalLength;
          const prevSy = cy + (s.y / s.prevZ) * focalLength;

          ctx.beginPath();
          ctx.moveTo(prevSx, prevSy);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = `rgba(${s.r},${s.g},${s.b},${alpha * 0.5})`;
          ctx.lineWidth = size * 0.4;
          ctx.stroke();
        }

        // ═══ STAR DOT ═══
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${alpha})`;
        ctx.fill();

        // ═══ GREEN BURST FLARE — sporadic glow on green stars ═══
        if (s.isGreen && size > 0.8) {
          // Sporadic burst timing
          const cycleT = ((t + s.burstPhase) % s.burstCycle) / s.burstCycle;
          const burstWindow = 0.15; // 15% of cycle is the burst
          let burst = 0;
          if (cycleT > (1 - burstWindow)) {
            burst = Math.sin(((cycleT - (1 - burstWindow)) / burstWindow) * Math.PI);
          }

          // Constant soft green halo
          const haloR = size * (4 + burst * 8);
          const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, haloR);
          halo.addColorStop(0, `rgba(0,230,118,${(0.1 + burst * 0.25) * alpha})`);
          halo.addColorStop(0.4, `rgba(76,175,80,${(0.04 + burst * 0.12) * alpha})`);
          halo.addColorStop(1, "transparent");
          ctx.fillStyle = halo;
          ctx.fillRect(sx - haloR, sy - haloR, haloR * 2, haloR * 2);

          // Bright core during burst
          if (burst > 0.1) {
            ctx.beginPath();
            ctx.arc(sx, sy, size * (1 + burst * 2), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,230,201,${0.6 * burst * alpha})`;
            ctx.fill();
          }
        }

        // Soft glow for gold stars when close
        if (!s.isGreen && size > 1.2) {
          const gr = size * 3;
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, gr);
          glow.addColorStop(0, `rgba(${s.r},${s.g},${s.b},${alpha * 0.1})`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(sx - gr, sy - gr, gr * 2, gr * 2);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function Eden() {
  const [page, setPage] = useState("landing");
  const [mounted, setMounted] = useState(false);
  // Intent routing from landing page chat → studio
  const [intentRoute, setIntentRoute] = useState(null); // { tab: "image"|"video", prompt: string, chatHistory: [] }

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleLandingEnter = (route) => {
    setIntentRoute(route || null);
    setPage("app");
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: C.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(197,179,88,0.2); border-radius: 4px; }
        input:focus, textarea:focus, select:focus { border-color: rgba(197,179,88,0.4) !important; box-shadow: 0 0 12px rgba(197,179,88,0.06); }

        /* Starfield handled by SpaceCanvas component — pure canvas, zero DOM */
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

        /* Legacy star classes removed — replaced with pure CSS box-shadow starfield */

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
      {page === "landing" ? <LandingPage mounted={mounted} onEnter={handleLandingEnter} /> : <AppShell intentRoute={intentRoute} />}
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

  // ─── Intent detection: does the user want to create an image or video? ───
  const detectIntent = (text) => {
    const t = text.toLowerCase();
    const videoWords = /\b(video|clip|animate|animation|motion|film|movie|cinematic scene|footage|record)\b/;
    const imageWords = /\b(image|photo|picture|portrait|render|generate|draw|create|make me|shot of|illustration)\b/;
    if (videoWords.test(t)) return "video";
    if (imageWords.test(t)) return "image";
    // If it reads like a prompt (descriptive, starts with "a" or adjective), default to image
    if (/^(a |an |the |beautiful|stunning|gorgeous|sexy|elegant|african|black woman|woman)/i.test(t) && t.length > 40) return "image";
    return null;
  };

  const sendMessage = async () => {
    if (!chatMsg.trim() || loading) return;
    const userMsg = chatMsg.trim();
    setChatMsg("");

    const updatedMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(updatedMessages);
    setLoading(true);

    // ─── Check if user wants to create something → route to studio ───
    const intent = detectIntent(userMsg);
    if (intent) {
      // Brief acknowledgment, then route
      setMessages(p => [...p, { role: "assistant", text: intent === "video" ? "Taking you to Video Studio now..." : "Taking you to Image Studio now..." }]);
      setTimeout(() => {
        onEnter({
          tab: intent,
          prompt: userMsg,
          chatHistory: updatedMessages.map(m => ({ role: m.role, text: m.text })),
        });
      }, 800);
      setLoading(false);
      return;
    }

    // ─── Regular chat — no studio routing ───
    try {
      const history = messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      history.push({ role: "user", content: userMsg });
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You are Eden AI, the premium concierge for the Eden Realism Engine by Beryl AI Labs. Eden offers: photorealistic AI image generation (Z-Image, FLUX), AI video generation (LTX-2, Wan 2.2, LongCat), 18 specialized voice agents, and EVE — a 4D conversational avatar system. Speak with refined luxury brand confidence. Keep responses 2-3 sentences. Be warm, sophisticated, knowledgeable. Mention specific Eden capabilities when relevant.
${EDEN_REALISM_STANDARD}`,
          messages: history }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", text: data.content?.map(b => b.text || "").join("") || "Please try again." }]);
    } catch { setMessages(p => [...p, { role: "assistant", text: "Eden is recalibrating. Please try again." }]); }
    setLoading(false);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", background: "#050302", overflow: "hidden", position: "relative" }}>
      {/* ═══ SPACE CANVAS — suspended animation starfield ═══ */}
      <SpaceCanvas />

      {/* Radial glow around logo area */}
      <div style={{ position: "absolute", bottom: "15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(197,179,88,.06) 0%, rgba(76,175,80,.01) 40%, transparent 70%)", animation: "glow-pulse 4s ease-in-out infinite", pointerEvents: "none", zIndex: 1 }} />

      {/* ═══ EDEN TITLE + CLOVER — anchored to bottom zone, clover grows UP into open sky ═══ */}
      <div style={{
        position: "relative", cursor: "default", zIndex: 2,
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
        marginTop: 20, padding: "18px 56px", borderRadius: 34, cursor: "pointer", zIndex: 2,
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
        width: "100%", maxWidth: 850, padding: "0 24px", marginTop: 24, marginBottom: 24, zIndex: 2,
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
// ─── Nav Button with gold hover flash ───
function NavBtn({ icon, label, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "10px 28px", borderRadius: 12, border: "none", cursor: "pointer",
        background: active ? "linear-gradient(135deg,rgba(197,179,88,.12),rgba(197,179,88,.05))"
          : hov ? "linear-gradient(135deg,rgba(197,179,88,.18),rgba(197,179,88,.08))" : "transparent",
        borderBottom: active ? "2px solid #C5B358" : "2px solid transparent",
        display: "flex", alignItems: "center", gap: 8, transition: "all .25s ease",
        boxShadow: hov && !active ? "0 0 16px rgba(197,179,88,.2)" : "none",
      }}>
      <span style={{ fontSize: 20, transition: "all .25s", filter: hov ? "brightness(1.4)" : "none" }}>{icon}</span>
      <span style={{
        fontSize: 14, fontWeight: 700, letterSpacing: 2,
        color: active ? "#FFFFFF" : hov ? C.gold : C.text,
        fontFamily: "'Cinzel',serif", textTransform: "uppercase", transition: "color .25s ease",
      }}>{label}</span>
    </button>
  );
}

// ─── Project Management — localStorage backed, versioned ───
const STORAGE_KEY = "eden_projects";

function loadProjects() {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveProjects(projects) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch {}
}

function createProject(name) {
  return {
    id: `proj_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
    name: name || `Project ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    version: 1,
    versions: [{ v: 1, date: new Date().toISOString(), note: "Project created" }],
    chatHistory: { image: [], video: [], voice: [], avatar: [] },
    assets: [],
  };
}

// ─── Project Panel (dropdown from header) ───
function ProjectPanel({ projects, activeProject, onSelect, onCreate, onRename, onDelete, onSnapshot, onClose }) {
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  return (
    <div style={{
      position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
      background: "rgba(12,8,4,.98)", borderBottom: `1px solid ${C.border}`,
      boxShadow: "0 12px 40px rgba(0,0,0,.6)", maxHeight: 420, overflowY: "auto",
      padding: "16px 28px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <span style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 700, letterSpacing: 3, color: "#FFFFFF", textTransform: "uppercase" }}>Project Manager</span>
        <div style={{ flex: 1 }}/>
        <button onClick={onClose} style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.textDim, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Cinzel',serif" }}>Close</button>
      </div>

      {/* New Project */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={newName} onChange={e => setNewName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && newName.trim()) { onCreate(newName.trim()); setNewName(""); } }}
          placeholder="New project name..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: C.bgInput, border: `1px solid ${C.border}`, color: "#FFFFFF", fontSize: 14, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", outline: "none" }}/>
        <button onClick={() => { if (newName.trim()) { onCreate(newName.trim()); setNewName(""); } else { onCreate(""); } }} style={{
          padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg,#2E7D32,#1B5E20)", color: "#C8E6C9",
          fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 1,
        }}>+ New</button>
      </div>

      {/* Project List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {projects.length === 0 && (
          <div style={{ padding: 20, textAlign: "center", color: C.textDim, fontFamily: "'Cormorant Garamond',serif", fontSize: 15 }}>
            No projects yet. Create one to start tracking your work.
          </div>
        )}
        {projects.map(p => (
          <div key={p.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10,
            background: activeProject?.id === p.id ? "linear-gradient(135deg,rgba(197,179,88,.1),rgba(197,179,88,.04))" : "rgba(18,12,8,.6)",
            border: `1px solid ${activeProject?.id === p.id ? "rgba(197,179,88,.25)" : C.border}`,
            cursor: "pointer", transition: "all .2s",
          }} onClick={() => onSelect(p.id)}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: activeProject?.id === p.id ? C.green : C.textDim, boxShadow: activeProject?.id === p.id ? "0 0 6px rgba(76,175,80,.5)" : "none", flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              {renaming === p.id ? (
                <input value={renameVal} onChange={e => setRenameVal(e.target.value)} autoFocus
                  onKeyDown={e => { if (e.key === "Enter") { onRename(p.id, renameVal); setRenaming(null); } if (e.key === "Escape") setRenaming(null); }}
                  onBlur={() => { onRename(p.id, renameVal); setRenaming(null); }}
                  onClick={e => e.stopPropagation()}
                  style={{ width: "100%", padding: "4px 8px", borderRadius: 6, background: C.bgInput, border: `1px solid ${C.border}`, color: "#FFFFFF", fontSize: 14, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", outline: "none" }}/>
              ) : (
                <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cormorant Garamond',serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 11, color: C.textDim, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>
                <span>v{p.version}</span>
                <span>·</span>
                <span>{new Date(p.updated).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                <span>·</span>
                <span>{p.assets?.length || 0} assets</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => onSnapshot(p.id)} title="Save version snapshot" style={{ padding: "4px 8px", borderRadius: 5, border: `1px solid ${C.border}`, background: "transparent", color: C.textDim, fontSize: 11, cursor: "pointer", fontFamily: "'Cinzel',serif" }}>v+</button>
              <button onClick={() => { setRenaming(p.id); setRenameVal(p.name); }} title="Rename" style={{ padding: "4px 8px", borderRadius: 5, border: `1px solid ${C.border}`, background: "transparent", color: C.textDim, fontSize: 11, cursor: "pointer" }}>✎</button>
              <button onClick={() => onDelete(p.id)} title="Delete project" style={{ padding: "4px 8px", borderRadius: 5, border: "1px solid rgba(244,67,54,.2)", background: "transparent", color: "#ef9a9a", fontSize: 11, cursor: "pointer" }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* Version History for active project */}
      {activeProject?.versions?.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, color: C.textDim, textTransform: "uppercase", marginBottom: 8 }}>Version History — {activeProject.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {activeProject.versions.slice().reverse().map((v, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 10px", borderRadius: 6, background: "rgba(18,12,8,.5)" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif", minWidth: 30 }}>v{v.v}</span>
                <span style={{ fontSize: 12, color: C.textDim, fontFamily: "'Cormorant Garamond',serif" }}>{new Date(v.date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                <span style={{ fontSize: 12, color: C.text, fontFamily: "'Cormorant Garamond',serif", flex: 1 }}>{v.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AppShell({ intentRoute }) {
  const [tab, setTab] = useState(intentRoute?.tab || "image");
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showProjectPanel, setShowProjectPanel] = useState(false);

  // Load projects on mount
  useEffect(() => {
    const loaded = loadProjects();
    setProjects(loaded);
    // Auto-select most recent project, or create default
    if (loaded.length > 0) {
      setActiveProjectId(loaded[0].id);
    } else {
      const first = createProject("My First Project");
      setProjects([first]);
      setActiveProjectId(first.id);
      saveProjects([first]);
    }
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  const persistProjects = (updated) => {
    setProjects(updated);
    saveProjects(updated);
  };

  const handleCreate = (name) => {
    const proj = createProject(name);
    const updated = [proj, ...projects];
    persistProjects(updated);
    setActiveProjectId(proj.id);
  };

  const handleSelect = (id) => {
    setActiveProjectId(id);
    setShowProjectPanel(false);
  };

  const handleRename = (id, newName) => {
    if (!newName.trim()) return;
    const updated = projects.map(p => p.id === id ? { ...p, name: newName.trim(), updated: new Date().toISOString() } : p);
    persistProjects(updated);
  };

  const handleDelete = (id) => {
    const updated = projects.filter(p => p.id !== id);
    persistProjects(updated);
    if (activeProjectId === id) {
      setActiveProjectId(updated[0]?.id || null);
    }
  };

  const handleSnapshot = (id) => {
    const updated = projects.map(p => {
      if (p.id !== id) return p;
      const newV = p.version + 1;
      return {
        ...p,
        version: newV,
        updated: new Date().toISOString(),
        versions: [...(p.versions || []), { v: newV, date: new Date().toISOString(), note: `Snapshot v${newV}` }],
      };
    });
    persistProjects(updated);
  };

  // Save chat history for the active project when studios update
  const saveChatHistory = useCallback((studio, messages) => {
    if (!activeProjectId) return;
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== activeProjectId) return p;
        return { ...p, chatHistory: { ...p.chatHistory, [studio]: messages }, updated: new Date().toISOString() };
      });
      saveProjects(updated);
      return updated;
    });
  }, [activeProjectId]);

  // Save asset for the active project
  const saveAsset = useCallback((asset) => {
    if (!activeProjectId) return;
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== activeProjectId) return p;
        return { ...p, assets: [asset, ...(p.assets || [])].slice(0, 50), updated: new Date().toISOString() };
      });
      saveProjects(updated);
      return updated;
    });
  }, [activeProjectId]);

  const tabs = [
    { id: "image", icon: "🖼", label: "Image" },
    { id: "video", icon: "🎬", label: "Video" },
    { id: "voice", icon: "🎙", label: "Voice" },
    { id: "avatar", icon: "👤", label: "Avatar" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: C.bg }}>
      {/* ─── UNIFORM HEADER ─── */}
      <div style={{ position: "relative" }}>
        <div style={{
          display: "flex", alignItems: "center", padding: "12px 28px",
          borderBottom: `1px solid ${C.border}`, background: "rgba(12,8,4,.97)", flexShrink: 0,
        }}>
          {/* FAR LEFT — Logo with clover + tagline */}
          <div style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => window.location.reload()}>
            <EdenHeaderLogo size="md" />
          </div>

          {/* PROJECT SELECTOR — between logo and nav */}
          <div style={{ marginLeft: 20, flexShrink: 0 }}>
            <button onClick={() => setShowProjectPanel(!showProjectPanel)} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10,
              border: `1px solid ${showProjectPanel ? "rgba(197,179,88,.3)" : C.border}`,
              background: showProjectPanel ? "rgba(197,179,88,.08)" : "transparent",
              cursor: "pointer", transition: "all .2s",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: "0 0 6px rgba(76,175,80,.5)" }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cormorant Garamond',serif", maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {activeProject?.name || "No Project"}
              </span>
              {activeProject && <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>v{activeProject.version}</span>}
              <span style={{ fontSize: 10, color: C.textDim, transform: showProjectPanel ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}>▼</span>
            </button>
          </div>

          {/* CENTER — Nav Bar */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 6 }}>
            {tabs.map(t => (
              <NavBtn key={t.id} icon={t.icon} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} />
            ))}
          </div>

          {/* Right — asset count badge */}
          <div style={{ width: 140, flexShrink: 0, display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {activeProject && (activeProject.assets?.length || 0) > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "rgba(76,175,80,.08)", border: `1px solid ${C.borderGreen}`, color: C.greenBright, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>
                {activeProject.assets.length} assets
              </span>
            )}
          </div>
        </div>

        {/* Project Panel Dropdown */}
        {showProjectPanel && (
          <ProjectPanel
            projects={projects}
            activeProject={activeProject}
            onSelect={handleSelect}
            onCreate={handleCreate}
            onRename={handleRename}
            onDelete={handleDelete}
            onSnapshot={handleSnapshot}
            onClose={() => setShowProjectPanel(false)}
          />
        )}
      </div>

      {/* ─── PAGE CONTENT ─── */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tab === "image" && <ImageStudio initialPrompt={tab === "image" ? intentRoute?.prompt : undefined} initialChatHistory={tab === "image" ? intentRoute?.chatHistory : undefined} />}
        {tab === "video" && <VideoStudio initialPrompt={tab === "video" ? intentRoute?.prompt : undefined} initialChatHistory={tab === "video" ? intentRoute?.chatHistory : undefined} />}
        {tab === "voice" && <VoiceAgents />}
        {tab === "avatar" && <AvatarBuilder />}
      </div>

      {/* ─── UNIFORM FOOTER ─── */}
      <div style={{
        display: "flex", alignItems: "center", padding: "12px 28px",
        borderTop: `1px solid ${C.border}`, background: "rgba(12,8,4,.97)", flexShrink: 0,
      }}>
        {/* FAR LEFT — Logo with clover + tagline */}
        <div style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => window.location.reload()}>
          <EdenHeaderLogo size="sm" />
        </div>

        {/* CENTER — Nav Bar (mirrors header) */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 6 }}>
          {tabs.map(t => (
            <NavBtn key={t.id} icon={t.icon} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} />
          ))}
        </div>

        {/* Right spacer to balance */}
        <div style={{ width: 100, flexShrink: 0 }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// IMAGE STUDIO
// ═══════════════════════════════════════════
function ImageStudio({ initialPrompt, initialChatHistory }) {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const handlePromptHistoryKey = usePromptHistory(prompt, setPrompt);
  const [preset, setPreset] = useState("EDEN Ultra Realism");
  const [backend, setBackend] = useState("Z-Image (Uncensored)");
  const [res, setRes] = useState("1024x1024 ( 1:1 )");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [remasterUrl, setRemasterUrl] = useState(null);
  const [remastering, setRemastering] = useState(false);
  const [isRemastered, setIsRemastered] = useState(false);
  const [cascade, setCascade] = useState(true); // CASCADE MODE: fast preview + auto-remaster
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [showJudge, setShowJudge] = useState(false);
  const [imageMeta, setImageMeta] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  // Render progress + stopwatch
  const [renderProgress, setRenderProgress] = useState(0); // 0-100
  const [renderPhase, setRenderPhase] = useState(""); // status burp text
  const [renderTimer, setRenderTimer] = useState(0); // seconds elapsed
  const renderTimerRef = useRef(null);
  const renderStartRef = useRef(null);
  // GPU Control
  const [gpuMode, setGpuMode] = useState("zerogpu"); // "zerogpu" | "dedicated"
  const [gpuTier, setGpuTier] = useState(null); // selected hardware flavor
  const [gpuActive, setGpuActive] = useState(false);
  const [gpuStartTime, setGpuStartTime] = useState(null);
  const [gpuCost, setGpuCost] = useState(0);
  const [gpuOverlay, setGpuOverlay] = useState(false);
  const [gpuConfirm, setGpuConfirm] = useState(null); // tier to confirm
  const [gpuOffConfirm, setGpuOffConfirm] = useState(false);
  const [gpuSwitching, setGpuSwitching] = useState(false);
  const gpuTimerRef = useRef(null);

  const GPU_TIERS = [
    { id: "t4-small", name: "T4 Small", vram: "16 GB", price: 0.40 },
    { id: "t4-medium", name: "T4 Medium", vram: "16 GB", price: 0.60 },
    { id: "l4x1", name: "L4", vram: "24 GB", price: 0.80 },
    { id: "a10g-small", name: "A10G Small", vram: "24 GB", price: 1.00 },
    { id: "a10g-large", name: "A10G Large", vram: "24 GB", price: 1.50 },
    { id: "l40sx1", name: "L40S", vram: "48 GB", price: 1.80 },
    { id: "a100-large", name: "A100", vram: "80 GB", price: 2.50 },
    { id: "a10g-largex2", name: "2x A10G", vram: "48 GB", price: 3.00 },
    { id: "a10g-largex4", name: "4x A10G", vram: "96 GB", price: 5.00 },
  ];

  // Live cost ticker
  useEffect(() => {
    if (gpuActive && gpuStartTime && gpuTier) {
      const tier = GPU_TIERS.find(t => t.id === gpuTier);
      if (!tier) return;
      gpuTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - gpuStartTime) / 3600000; // hours
        setGpuCost(elapsed * tier.price);
      }, 1000);
      return () => clearInterval(gpuTimerRef.current);
    }
    return () => clearInterval(gpuTimerRef.current);
  }, [gpuActive, gpuStartTime, gpuTier]);

  // Auto-sleep: 10 minutes of no generation activity
  const lastActivityRef = useRef(Date.now());
  useEffect(() => {
    if (!gpuActive) return;
    const checker = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 240000) { // 4 min
        // Auto-sleep GPU
        fetch("/api/gpu-control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hardware: "cpu-basic" }),
        }).then(() => {
          setGpuActive(false);
          setGpuTier(null);
          setGpuStartTime(null);
          setGpuCost(0);
          setGpuMode("zerogpu");
        });
        clearInterval(checker);
      }
    }, 30000);
    return () => clearInterval(checker);
  }, [gpuActive]);

  const activateGpu = async (tierId) => {
    setGpuSwitching(true);
    try {
      const resp = await fetch("/api/gpu-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hardware: tierId }),
      });
      const data = await resp.json();
      if (data.ok) {
        setGpuTier(tierId);
        setGpuActive(true);
        setGpuStartTime(Date.now());
        setGpuCost(0);
        setGpuMode("dedicated");
        setGpuOverlay(false);
        setGpuConfirm(null);
        // Set 10-min auto-sleep on HF side too
        fetch("/api/gpu-control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sleep: 240 }),
        });
      } else {
        setStatus(`❌ GPU switch failed: ${data.error}`);
      }
    } catch (e) {
      setStatus(`❌ GPU error: ${e.message}`);
    }
    setGpuSwitching(false);
  };

  const deactivateGpu = async () => {
    setGpuSwitching(true);
    try {
      await fetch("/api/gpu-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hardware: "cpu-basic" }),
      });
      setGpuActive(false);
      setGpuTier(null);
      setGpuStartTime(null);
      setGpuCost(0);
      setGpuMode("zerogpu");
      setGpuOffConfirm(false);
    } catch (e) {
      setStatus(`❌ GPU shutdown error: ${e.message}`);
    }
    setGpuSwitching(false);
  };

  const presetKeys = ["EDEN Ultra Realism", "EDEN Cinematic", "Hyperreal", "Kling Max", "Skin Perfect", "Boudoir", "Mahogany Glamour", "The Parlor", "Diamond Room", "Portrait", "Natural", "EDEN Raw", "Studio"];
  const backendKeys = ["Z-Image (Uncensored)", "Z-Image Turbo (Fast)", "Z-Image (Official)"];
  const resOptions = [
    { value: "1024x1024 ( 1:1 )", label: "1024 × 1024 (Square)" },
    { value: "768x1280 ( 9:16 Portrait )", label: "768 × 1280 (Portrait)" },
    { value: "1280x768 ( 16:9 Landscape )", label: "1280 × 768 (Landscape)" },
    { value: "832x1216 ( 2:3 Editorial )", label: "832 × 1216 (Editorial)" },
    { value: "1216x832 ( 3:2 Photo )", label: "1216 × 832 (Photo)" },
    { value: "1080x1920 ( 9:16 TikTok/Phone )", label: "1080 × 1920 (TikTok / Phone)" },
    { value: "1080x1350 ( 4:5 Instagram )", label: "1080 × 1350 (Instagram Post)" },
    { value: "1080x1080 ( 1:1 IG Square )", label: "1080 × 1080 (IG Square)" },
    { value: "1170x2532 ( iPhone Pro )", label: "1170 × 2532 (iPhone Pro)" },
    { value: "1440x3120 ( Android QHD )", label: "1440 × 3120 (Android QHD)" },
  ];

  // ═══ CASCADE RENDER: Fast preview + Eden Protocol remaster ═══
  const generate = async () => {
    if (!prompt.trim()) return;
    savePromptToHistory(prompt); // Save to history for arrow up/down recall
    lastActivityRef.current = Date.now(); // reset auto-sleep timer
    setLoading(true);
    setImageUrl(null);        // Clear previous image so progress/timer is visible
    setRemasterUrl(null);
    setIsRemastered(false);
    setRemastering(false);
    setShowJudge(false);
    setRenderProgress(0);
    setRenderPhase("Initializing render pipeline...");
    setRenderTimer(0);

    // Start stopwatch
    renderStartRef.current = Date.now();
    if (renderTimerRef.current) clearInterval(renderTimerRef.current);
    renderTimerRef.current = setInterval(() => {
      if (renderStartRef.current) setRenderTimer(Math.floor((Date.now() - renderStartRef.current) / 1000));
    }, 100);

    const trimmed = prompt.trim();
    const payload = { prompt: trimmed, preset, resolution: res, randomSeed: true, enhance: true, mode: "image_studio" };

    // ─── Helper: validate image actually loads before declaring success ───
    const validateImage = (url) => new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error("Image URL returned but failed to load — backend may have returned an error page instead of an image"));
      img.src = url;
      setTimeout(() => reject(new Error("Image load timed out after 30s")), 30000);
    });

    // Helper: stop the timer and record completion time
    const stopTimer = () => {
      if (renderTimerRef.current) clearInterval(renderTimerRef.current);
      const elapsed = renderStartRef.current ? (Date.now() - renderStartRef.current) / 1000 : 0;
      return elapsed.toFixed(1);
    };

    // ─── Smart backend cascade: API handles fallback internally ───
    const schnellBackends = [backend];
    const devBackends = [backend];

    const tryFetch = async (backendName, steps) => {
      const resp = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, backend: backendName, steps }),
      });
      return resp.json();
    };

    if (cascade) {
      let schnellUrl = null;
      let schnellSeed = null;

      // ─── PASS 1: SCHNELL R&D — EDEN T4 ───
      setRenderProgress(5);
      setRenderPhase("Connecting to FLUX engine...");
      setStatus("⚡ Schnell R&D preview (4 steps)...");
      let fastData = null;
      try {
        setRenderProgress(10);
        for (const schnellBackend of schnellBackends) {
          setRenderPhase(`Trying ${schnellBackend}...`);
          try {
            fastData = await tryFetch(schnellBackend, 4);
            if (fastData.image) {
              setRenderPhase(`${schnellBackend} responded!`);
              break;
            }
            if (fastData.error) {
              setRenderPhase(`${schnellBackend}: ${fastData.error.slice(0, 60)}...`);
              fastData = null; // try next
            }
          } catch {
            fastData = null; // try next backend
          }
        }
        // If no backend worked, create a synthetic error
        if (!fastData) fastData = { error: "All Schnell backends unavailable" };
        setRenderProgress(25);
        if (fastData.error) {
          setRenderPhase(`Schnell failed: ${fastData.error}`);
          setStatus(`❌ Schnell failed: ${fastData.error}`);
        } else if (fastData.image) {
          setRenderProgress(35);
          setRenderPhase("Loading Schnell preview image...");
          try {
            await validateImage(fastData.image);
            schnellUrl = fastData.image;
            schnellSeed = fastData.seed;
            setImageUrl(fastData.image);
            setRenderProgress(40);
            setRenderPhase("Schnell preview loaded! Starting Dev remaster...");
            const schnellItemNo = generateItemNumber("IMG");
            setImageMeta({ url: fastData.image, prompt: trimmed, seed: fastData.seed, backend: "FLUX Schnell", steps: 4, created: new Date().toISOString(), type: "image", itemNo: schnellItemNo });
            setStatus(`⚡ ${schnellItemNo} · Schnell preview ready · Remastering via FLUX Dev...`);
            setHistory(p => [{ url: fastData.image, prompt: trimmed, seed: fastData.seed, tag: "schnell" }, ...p].slice(0, 30));
          } catch (imgErr) {
            setStatus(`❌ Schnell returned bad image: ${imgErr.message}`);
          }
        } else {
          setStatus("❌ Schnell returned no image data");
        }
      } catch (e) {
        setStatus(`❌ Schnell network error: ${e.message}`);
      }

      // ─── PASS 2: FLUX DEV REMASTER — EDEN T4 ───
      setRemastering(true);
      setRenderProgress(45);
      setRenderPhase("Connecting to FLUX Dev (25 steps)...");
      try {
        setRenderProgress(50);
        let qualData = null;
        for (const devBackend of devBackends) {
          setRenderPhase(`Trying ${devBackend}...`);
          try {
            qualData = await tryFetch(devBackend, 25);
            if (qualData.image) {
              setRenderPhase(`${devBackend} responded!`);
              break;
            }
            if (qualData.error) {
              setRenderPhase(`${devBackend}: ${qualData.error.slice(0, 60)}...`);
              qualData = null;
            }
          } catch {
            qualData = null;
          }
        }
        if (!qualData) qualData = { error: "All Dev backends unavailable" };
        setRenderProgress(80);
        if (qualData.error) {
          setRenderPhase(`Dev failed: ${qualData.error}`);
          if (schnellUrl) {
            const elapsed = stopTimer();
            setStatus(`⚡ Schnell preview shown · Dev remaster failed: ${qualData.error} · ${elapsed}s`);
            setShowJudge(true);
          } else {
            stopTimer();
            setStatus(`❌ Both Schnell and Dev failed. Dev error: ${qualData.error}`);
          }
        } else if (qualData.image) {
          setRenderProgress(90);
          setRenderPhase("Loading remastered image...");
          try {
            await validateImage(qualData.image);
            setRenderProgress(100);
            setRenderPhase("Remaster complete!");
            setRemasterUrl(qualData.image);
            setImageUrl(qualData.image);
            setIsRemastered(true);
            const elapsed = stopTimer();
            const devItemNo = generateItemNumber("IMG");
            setStatus(`✅ ${devItemNo} · EDEN REMASTERED · ${qualData.steps || 25} steps · FLUX Dev · Seed: ${qualData.seed || "auto"} · ${elapsed}s`);
            setHistory(p => [{ url: qualData.image, prompt: trimmed, seed: qualData.seed, tag: "remastered" }, ...p].slice(0, 30));
            setImageMeta({ url: qualData.image, prompt: trimmed, seed: qualData.seed, backend: "FLUX Dev", steps: qualData.steps || 25, created: new Date().toISOString(), type: "image", itemNo: devItemNo, renderTime: elapsed, gpuUsed: gpuTier || "zerogpu" });
            setShowJudge(true);
          } catch (imgErr) {
            if (schnellUrl) {
              setStatus(`⚡ Schnell preview shown · Dev image failed to load: ${imgErr.message}`);
              setShowJudge(true);
            } else {
              setStatus(`❌ Dev returned unloadable image: ${imgErr.message}`);
            }
          }
        } else {
          if (schnellUrl) {
            setStatus(`⚡ Schnell preview shown · Dev returned no image data`);
            setShowJudge(true);
          } else {
            setStatus(`❌ Both passes returned no image`);
          }
        }
      } catch (e) {
        if (schnellUrl) {
          setStatus(`⚡ Schnell preview shown · Dev remaster error: ${e.message}`);
          setShowJudge(true);
        } else {
          setStatus(`❌ Both passes failed. Dev error: ${e.message}`);
        }
      }
      setRemastering(false);

      // ─── FALLBACK: If BOTH passes failed, auto-try Pollinations ───
      if (!schnellUrl && !imageUrl) {
        setRenderProgress(60);
        setRenderPhase("Falling back to Pollinations FLUX...");
        setStatus("⏳ Backends unavailable · Falling back to Pollinations FLUX...");
        try {
          const seed = Math.floor(Math.random() * 999999);
          const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(trimmed)}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;
          setRenderProgress(75);
          setRenderPhase("Waiting for Pollinations render...");
          await validateImage(pollUrl);
          setRenderProgress(100);
          setRenderPhase("Pollinations render complete!");
          setImageUrl(pollUrl);
          const elapsed = stopTimer();
          const fallbackItemNo = generateItemNumber("IMG");
          setStatus(`✅ ${fallbackItemNo} · Generated (Pollinations fallback) · Seed: ${seed} · ${elapsed}s`);
          setHistory(p => [{ url: pollUrl, prompt: trimmed, seed, tag: "pollinations" }, ...p].slice(0, 30));
          setImageMeta({ url: pollUrl, prompt: trimmed, seed, backend: "Pollinations FLUX", steps: 0, created: new Date().toISOString(), type: "image", itemNo: fallbackItemNo, renderTime: elapsed, gpuUsed: "pollinations" });
          setShowJudge(true);
        } catch {
          stopTimer();
          setRenderPhase("All backends failed");
          setStatus("❌ All backends failed — GPU unavailable and Pollinations unreachable");
        }
      }
      setLoading(false);

    } else {
      // ─── SINGLE PASS: Direct to selected backend ───
      setRenderProgress(10);
      setRenderPhase(`Connecting to ${backend}...`);
      setStatus(`⏳ ERE-1 generating via ${backend}...`);
      try {
        setRenderProgress(20);
        setRenderPhase(`Sending prompt to ${backend}...`);
        const resp = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, backend }),
        });
        setRenderProgress(70);
        setRenderPhase("Decoding response...");
        const data = await resp.json();
        if (data.error) {
          setRenderProgress(75);
          setRenderPhase("Primary failed — trying Pollinations fallback...");
          setStatus(`⚠ ${backend} failed: ${data.error} · Trying Pollinations...`);
          const seed = Math.floor(Math.random() * 999999);
          const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(trimmed)}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;
          try {
            await validateImage(url);
            setRenderProgress(100);
            setRenderPhase("Pollinations render complete!");
            setImageUrl(url);
            const elapsed = stopTimer();
            const pollItemNo = generateItemNumber("IMG");
            setStatus(`✅ ${pollItemNo} · Generated (Pollinations fallback) · Seed: ${seed} · ${elapsed}s`);
            setHistory(p => [{ url, prompt: trimmed, seed }, ...p].slice(0, 30));
            setImageMeta({ url, prompt: trimmed, seed, backend: "Pollinations FLUX", steps: 0, created: new Date().toISOString(), type: "image", itemNo: pollItemNo, renderTime: elapsed, gpuUsed: "pollinations" });
            setShowJudge(true);
          } catch {
            stopTimer();
            setRenderPhase("All backends failed");
            setStatus(`❌ ${backend} failed: ${data.error} · Pollinations fallback also failed`);
          }
        } else if (data.image) {
          setRenderProgress(85);
          setRenderPhase("Loading generated image...");
          try {
            await validateImage(data.image);
            setRenderProgress(100);
            setRenderPhase("Render complete!");
            setImageUrl(data.image);
            const elapsed = stopTimer();
            const singleItemNo = generateItemNumber("IMG");
            setStatus(`✅ ${singleItemNo} · Generated · Seed: ${data.seed || "auto"} · ${data.steps || "?"} steps · ${data.backend || backend} · ${elapsed}s`);
            setHistory(p => [{ url: data.image, prompt: trimmed, seed: data.seed }, ...p].slice(0, 30));
            setImageMeta({ url: data.image, prompt: trimmed, seed: data.seed, backend: data.backend || backend, steps: data.steps, created: new Date().toISOString(), type: "image", itemNo: singleItemNo, renderTime: elapsed, gpuUsed: gpuTier || "zerogpu" });
            setShowJudge(true);
          } catch (imgErr) {
            stopTimer();
            setRenderPhase("Image load failed");
            setStatus(`❌ ${backend} returned an image URL but it failed to load: ${imgErr.message}`);
          }
        } else {
          stopTimer();
          setRenderPhase("No image returned");
          setStatus(`❌ ${backend} returned no image and no error — backend may be sleeping`);
        }
      } catch (e) {
        setStatus(`❌ Network error: ${e.message}`);
      }
      setLoading(false);
    }
  };

  const handleLikeImage = () => {
    if (!imageMeta) return;
    const gallery = loadGallery();
    const itemNo = imageMeta.itemNo || generateItemNumber("IMG");
    gallery.unshift({ ...imageMeta, id: itemNo, itemNo, portfolio: false, batch: null });
    saveGallery(gallery);
    setShowJudge(false);
    setStatus("✅ Saved to Gallery");
  };
  const handleLeaveImage = () => { setShowJudge(false); setStatus("Render discarded"); };
  const handleRemixImage = (item) => {
    setPrompt(item.prompt + " — different angle, new composition, alternate setting");
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: 0 }}>
      {/* LEFT — Controls */}
      <div style={{ width: 320, borderRight: `1px solid ${C.border}`, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🖼</span> Image Studio
        </div>
        <Card title="Prompt">
          <Input textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your image in detail... ↑↓ arrows scroll prompt history" style={{ minHeight: 180, fontSize: 14, lineHeight: 1.6 }} onKeyDown={e => { handlePromptHistoryKey(e); if (e.key === "Enter" && e.ctrlKey) generate(); }}/>
        </Card>
        <PromptGenerator onGenerate={p => setPrompt(p)} mediaType="image" />
        {/* ═══ GPU SELECTOR — ZeroGPU + GO BIG ═══ */}
        <div style={{ display: "flex", gap: 6 }}>
          {/* ZeroGPU Button (default) */}
          <button onClick={() => {
            if (gpuActive) { setGpuOffConfirm(true); return; }
            setGpuMode("zerogpu");
          }} style={{
            flex: 1, padding: "12px 8px", borderRadius: 10, cursor: "pointer",
            fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
            background: gpuMode === "zerogpu" && !gpuActive ? "linear-gradient(135deg, rgba(197,179,88,0.15), rgba(197,179,88,0.06))" : "rgba(197,179,88,0.04)",
            border: `1px solid ${gpuMode === "zerogpu" && !gpuActive ? "rgba(197,179,88,0.35)" : C.border}`,
            color: gpuMode === "zerogpu" && !gpuActive ? C.gold : C.textDim,
            transition: "all 0.3s",
          }}>
            ZeroGPU
            <div style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", letterSpacing: 0, textTransform: "none", marginTop: 2, color: C.textDim }}>
              HF Pro · Free
            </div>
          </button>
          {/* GO BIG Button — or Active GPU display */}
          {gpuActive ? (
            <button onClick={() => setGpuOffConfirm(true)} style={{
              flex: 1.4, padding: "8px 10px", borderRadius: 10, cursor: "pointer",
              fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
              background: "linear-gradient(135deg, rgba(46,125,50,0.2), rgba(27,94,32,0.15))",
              border: "1px solid rgba(76,175,80,0.4)",
              color: C.greenBright,
              transition: "all 0.3s", textAlign: "center",
            }}>
              <div style={{ fontSize: 12 }}>{GPU_TIERS.find(t => t.id === gpuTier)?.name || gpuTier}</div>
              <div style={{ fontSize: 10, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", letterSpacing: 0, textTransform: "none", marginTop: 2, color: "#81C784" }}>
                ${gpuCost.toFixed(4)} spent · ${GPU_TIERS.find(t => t.id === gpuTier)?.price.toFixed(2)}/hr
              </div>
            </button>
          ) : (
            <button onClick={() => setGpuOverlay(true)} style={{
              flex: 1, padding: "12px 8px", borderRadius: 10, cursor: "pointer",
              fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
              background: "linear-gradient(135deg, rgba(197,179,88,0.12), rgba(197,179,88,0.04))",
              border: `1px solid ${C.border}`,
              color: C.gold,
              transition: "all 0.3s",
            }}>
              GO BIG
              <div style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", letterSpacing: 0, textTransform: "none", marginTop: 2, color: C.textDim }}>
                Dedicated GPU
              </div>
            </button>
          )}
        </div>
        {/* GPU OFF Confirm */}
        {gpuOffConfirm && (
          <div style={{
            padding: 14, borderRadius: 10, background: "rgba(244,67,54,0.06)", border: "1px solid rgba(244,67,54,0.2)",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ef9a9a", fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>TURN OFF GPU?</div>
            <div style={{ fontSize: 12, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>
              {GPU_TIERS.find(t => t.id === gpuTier)?.name} · Total: ${gpuCost.toFixed(4)}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={deactivateGpu} disabled={gpuSwitching} style={{
                flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", border: "1px solid rgba(244,67,54,0.3)",
                background: "rgba(244,67,54,0.1)", color: "#ef9a9a", fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 1,
              }}>{gpuSwitching ? "..." : "YES, TURN OFF"}</button>
              <button onClick={() => setGpuOffConfirm(false)} style={{
                flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", border: `1px solid ${C.border}`,
                background: "rgba(197,179,88,0.04)", color: C.textDim, fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 1,
              }}>KEEP RUNNING</button>
            </div>
          </div>
        )}
        {/* GO BIG Overlay — GPU Pricing Grid */}
        {gpuOverlay && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center",
          }} onClick={() => { setGpuOverlay(false); setGpuConfirm(null); }}>
            <div onClick={e => e.stopPropagation()} style={{
              width: 420, maxHeight: "80vh", overflowY: "auto",
              background: "linear-gradient(180deg, #121008, #0a0704)", borderRadius: 16,
              border: `1px solid ${C.border}`, padding: 24,
            }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 700, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 4 }}>GO BIG</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond',serif", marginBottom: 18 }}>Select dedicated GPU for maximum render quality</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {GPU_TIERS.map(tier => (
                  <button key={tier.id} onClick={() => setGpuConfirm(tier)} style={{
                    padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                    background: gpuConfirm?.id === tier.id ? "rgba(197,179,88,0.12)" : "rgba(197,179,88,0.03)",
                    border: `1px solid ${gpuConfirm?.id === tier.id ? "rgba(197,179,88,0.35)" : C.border}`,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>{tier.name}</div>
                      <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Cormorant Garamond',serif" }}>{tier.vram} VRAM</div>
                    </div>
                    <div style={{
                      fontSize: 15, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif",
                    }}>${tier.price.toFixed(2)}<span style={{ fontSize: 10, color: C.textDim }}>/hr</span></div>
                  </button>
                ))}
              </div>
              {/* Confirmation panel */}
              {gpuConfirm && (
                <div style={{
                  marginTop: 14, padding: 14, borderRadius: 10,
                  background: "rgba(197,179,88,0.06)", border: "1px solid rgba(197,179,88,0.2)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 6 }}>CONFIRM GPU ACTIVATION</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond',serif", marginBottom: 10 }}>
                    <strong>{gpuConfirm.name}</strong> ({gpuConfirm.vram}) at <strong>${gpuConfirm.price.toFixed(2)}/hr</strong>
                    <br/>Billed per minute. Auto-sleeps after 4 min idle.
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => activateGpu(gpuConfirm.id)} disabled={gpuSwitching} style={{
                      flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer",
                      background: "linear-gradient(135deg, rgba(46,125,50,0.3), rgba(27,94,32,0.2))",
                      border: "1px solid rgba(76,175,80,0.4)", color: C.greenBright,
                      fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 1.5,
                    }}>{gpuSwitching ? "SWITCHING..." : "YES, ACTIVATE"}</button>
                    <button onClick={() => setGpuConfirm(null)} style={{
                      padding: "10px 16px", borderRadius: 8, cursor: "pointer",
                      background: "rgba(197,179,88,0.04)", border: `1px solid ${C.border}`,
                      color: C.textDim, fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 1,
                    }}>CANCEL</button>
                  </div>
                </div>
              )}
              <button onClick={() => { setGpuOverlay(false); setGpuConfirm(null); }} style={{
                marginTop: 12, width: "100%", padding: "10px", borderRadius: 8, cursor: "pointer",
                background: "transparent", border: `1px solid ${C.border}`, color: C.textDim,
                fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 2,
              }}>CLOSE</button>
            </div>
          </div>
        )}
        <Card title="Eden Protocol Preset">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {presetKeys.map(k => (
              <button key={k} onClick={() => setPreset(k)} style={{
                padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Cormorant Garamond',serif",
                background: preset === k ? "rgba(197,179,88,.12)" : "transparent",
                border: `1px solid ${preset === k ? "rgba(197,179,88,.3)" : C.border}`,
                color: preset === k ? "#FFFFFF" : C.text, transition: "all .2s",
              }}>{k}</button>
            ))}
          </div>
        </Card>
        <Card title="ERE-1 Backend">
          <Select value={backend} onChange={e => setBackend(e.target.value)} options={backendKeys.map(b => ({ value: b, label: b }))} style={{ width: "100%" }}/>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, fontFamily: "'Cormorant Garamond',serif", marginTop: 6 }}>
            {backend.includes("Schnell") ? "4 steps · ~3s · Rapid R&D testing" :
             backend.includes("Dev") ? "25 steps · ~18s · Publish quality" :
             backend.includes("Z-Image") ? "8 steps · Fast alternative" :
             backend.includes("CogView") ? "30 steps · Scene specialist" :
             backend.includes("Juggernaut") ? "30 steps · Skin realism" :
             "Auto steps"}
          </div>
        </Card>
        <Card title="Resolution">
          <Select value={res} onChange={e => setRes(e.target.value)} options={resOptions} style={{ width: "100%" }}/>
        </Card>
        {/* CASCADE MODE TOGGLE */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
          <button onClick={() => setCascade(!cascade)} style={{
            width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
            background: cascade ? C.green : "rgba(139,115,85,.3)", transition: "all .2s", position: "relative",
          }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: cascade ? 20 : 2, transition: "all .2s" }}/>
          </button>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: cascade ? "#FFFFFF" : C.textDim, fontFamily: "'Cormorant Garamond',serif" }}>
              {cascade ? "Cascade Mode" : "Direct Mode"}
            </span>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Cormorant Garamond',serif" }}>
              {cascade ? "Fast preview + auto-remaster" : `Direct to ${backend}`}
            </div>
          </div>
        </div>
        <Btn green onClick={generate} disabled={loading || !prompt.trim()} style={{ width: "100%", padding: "16px 20px", fontSize: 15 }}>
          {loading ? (remastering ? "⏳ Remastering..." : "⚡ Rendering...") : cascade ? "⚡ Generate (Cascade)" : "Generate Image"}
        </Btn>
        {status && <StatusBadge text={status} type={status.startsWith("✅") ? "success" : status.startsWith("❌") ? "error" : status.includes("⚡") ? "success" : "info"}/>}
      </div>
      {/* CENTER — Preview */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ flex: 1, minHeight: 400, borderRadius: 14, border: `1px solid ${isRemastered ? "rgba(76,175,80,.3)" : C.border}`, background: "rgba(12,8,4,.6)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", transition: "border-color .5s" }}>
          {imageUrl ? (
            <>
              <img src={imageUrl} alt="Generated" onClick={() => setFullscreen(true)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 10, cursor: "zoom-in" }}/>
              {showJudge && imageMeta && (
                <JudgeOverlay type="image" url={imageUrl} prompt={imageMeta.prompt} seed={imageMeta.seed} backend={imageMeta.backend} steps={imageMeta.steps} itemNo={imageMeta.itemNo} onLike={handleLikeImage} onLeave={handleLeaveImage} />
              )}
              {/* Fullscreen Lightbox */}
              {fullscreen && imageUrl && (
                <div onClick={() => setFullscreen(false)} style={{
                  position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
                  background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "zoom-out", padding: 20,
                }}>
                  <img src={imageUrl} alt="Fullscreen" style={{ maxWidth: "95vw", maxHeight: "95vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 0 60px rgba(197,179,88,0.15)" }}/>
                  <div style={{
                    position: "absolute", top: 20, right: 24, fontSize: 14, fontWeight: 700,
                    color: C.textDim, fontFamily: "'Cinzel',serif", letterSpacing: 2, opacity: 0.7,
                  }}>CLICK ANYWHERE TO CLOSE</div>
                  {imageMeta && (
                    <div style={{
                      position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
                      padding: "10px 20px", borderRadius: 10, background: "rgba(12,8,4,0.85)",
                      border: `1px solid ${C.border}`, maxWidth: "80vw", textAlign: "center",
                    }}>
                      <div style={{ fontSize: 13, color: C.text, fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.5 }}>
                        {imageMeta.prompt?.slice(0, 200)}{imageMeta.prompt?.length > 200 ? "..." : ""}
                      </div>
                      <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Cormorant Garamond',serif", marginTop: 4 }}>
                        {imageMeta.backend} · {imageMeta.steps} steps · Seed: {imageMeta.seed || "auto"}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* REMASTER BADGE */}
              {isRemastered && (
                <div style={{
                  position: "absolute", top: 12, right: 12, padding: "6px 14px", borderRadius: 8,
                  background: "linear-gradient(135deg,rgba(46,125,50,.9),rgba(27,94,32,.9))",
                  border: "1px solid rgba(76,175,80,.4)",
                  boxShadow: "0 2px 12px rgba(76,175,80,.3)",
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#C8E6C9", fontFamily: "'Cinzel',serif", letterSpacing: 2 }}>EDEN REMASTERED</span>
                </div>
              )}
              {/* REMASTERING SPINNER — shows while quality pass is running */}
              {remastering && !isRemastered && (
                <div style={{
                  position: "absolute", top: 12, right: 12, padding: "6px 14px", borderRadius: 8,
                  background: "rgba(12,8,4,.85)", border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{ width: 14, height: 14, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.gold}`, borderRadius: "50%", animation: "spin-loader 1s linear infinite" }}/>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>REMASTERING</span>
                </div>
              )}
              {/* Preview badge when fast pass shown but not yet remastered */}
              {!isRemastered && !remastering && cascade && remasterUrl === null && imageUrl && (
                <div style={{
                  position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 6,
                  background: "rgba(12,8,4,.75)", border: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>FAST PREVIEW</span>
                </div>
              )}
            </>
          ) : loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "80%", maxWidth: 360 }}>
              {/* Status burp */}
              <div style={{
                fontSize: 24, color: C.gold, fontFamily: "'Cormorant Garamond',serif", fontWeight: 700,
                textAlign: "center", minHeight: 30, opacity: renderPhase ? 1 : 0, transition: "opacity .3s",
              }}>
                {renderPhase}
              </div>
              {/* Spinner */}
              <div style={{ width: 40, height: 40, border: `2px solid ${C.border}`, borderTop: `2px solid ${cascade ? C.gold : C.green}`, borderRadius: "50%", animation: "spin-loader 1s linear infinite" }}/>
              {/* Progress bar */}
              <div style={{ width: "100%", height: 6, borderRadius: 3, background: "rgba(139,115,85,.15)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3,
                  background: `linear-gradient(90deg, ${C.gold}, ${C.green})`,
                  width: `${renderProgress}%`,
                  transition: "width 0.5s ease-out",
                }}/>
              </div>
              {/* Percentage */}
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>
                  {renderProgress}%
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'Cinzel',serif", letterSpacing: 2 }}>
                  {cascade ? (remastering ? "REMASTERING" : "FAST PREVIEW") : "GENERATING"}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>
                  {renderProgress}%
                </span>
              </div>
              {/* Stopwatch timer */}
              <div style={{
                fontSize: 28, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cinzel',serif",
                letterSpacing: 4, textAlign: "center",
              }}>
                {Math.floor(renderTimer / 60).toString().padStart(2, "0")}:{(renderTimer % 60).toString().padStart(2, "0")}
              </div>
              <span style={{ fontSize: 22, color: C.textDim, fontFamily: "'Cormorant Garamond',serif", letterSpacing: 1 }}>
                {cascade ? "Schnell 4-step → then FLUX Dev remaster" : `Direct to ${backend}`}
              </span>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 40, display: "block", marginBottom: 12, opacity: .3 }}>🖼</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cinzel',serif", letterSpacing: 2 }}>YOUR IMAGE WILL APPEAR HERE</span>
              <br/><span style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>Enter a prompt and click Generate</span>
            </div>
          )}
        </div>
        {history.length > 0 && (
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 700, letterSpacing: 3, color: "#FFFFFF", textTransform: "uppercase", marginBottom: 10 }}>History</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
              {history.map((h, i) => (
                <div key={i} onClick={() => { setImageUrl(h.url); setIsRemastered(h.tag === "remastered"); }} style={{ cursor: "pointer", borderRadius: 8, overflow: "hidden", border: `1px solid ${h.tag === "remastered" ? "rgba(76,175,80,.3)" : C.border}`, aspectRatio: "1", transition: "all .2s", position: "relative" }}>
                  <img src={h.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                  {h.tag === "remastered" && <div style={{ position: "absolute", bottom: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: "0 0 4px rgba(76,175,80,.5)" }}/>}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Gallery */}
        <GalleryPanel type="image" onRemix={handleRemixImage} />
      </div>
      {/* RIGHT — Chat Panel */}
      <StudioChatPanel context="Image Studio" initialChatHistory={initialChatHistory} />
    </div>
  );
}

// ═══════════════════════════════════════════
// EDEN ITEM NUMBER SYSTEM — Unique ID for every render
// Format: EDN-{TYPE}{SEQ}-{DATE}{HASH}
// e.g. EDN-IMG0042-022224A7X → Image #42, Feb 22 2024, hash A7X
// Functions as: confirmation receipt, gallery ID, reporting key
// ═══════════════════════════════════════════
const ITEM_SEQ_KEY = "eden_item_seq";
function getNextSeq(): number {
  const seq = parseInt(localStorage.getItem(ITEM_SEQ_KEY) || "0") + 1;
  localStorage.setItem(ITEM_SEQ_KEY, String(seq));
  return seq;
}
function generateItemNumber(type: "IMG" | "VID"): string {
  const seq = getNextSeq();
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const hash = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `EDN-${type}${String(seq).padStart(4, "0")}-${mm}${dd}${yy}${hash}`;
}

// ═══════════════════════════════════════════
// GALLERY SYSTEM — Shared across all studios
// ═══════════════════════════════════════════
const GALLERY_KEY = "eden_gallery";
function loadGallery() {
  try { return JSON.parse(localStorage.getItem(GALLERY_KEY) || "[]"); } catch { return []; }
}
function saveGallery(items) { localStorage.setItem(GALLERY_KEY, JSON.stringify(items)); }

// Like/Leave judgment overlay after render
function JudgeOverlay({ type, url, prompt, seed, backend, steps, itemNo, onLike, onLeave }) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px",
      background: "linear-gradient(transparent, rgba(0,0,0,0.92) 30%)",
      display: "flex", flexDirection: "column", gap: 8, zIndex: 10,
    }}>
      {itemNo && (
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: C.gold, textAlign: "center" }}>
          {itemNo}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button onClick={onLike} style={{
        flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
        background: "linear-gradient(135deg, rgba(46,125,50,0.3), rgba(27,94,32,0.2))",
        border: "1px solid rgba(76,175,80,0.4)", color: "#C8E6C9",
        fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 700, letterSpacing: 2,
        transition: "all .2s",
      }}>LIKE IT</button>
      <button onClick={onLeave} style={{
        flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
        background: "rgba(244,67,54,0.08)", border: "1px solid rgba(244,67,54,0.25)",
        color: "#ef9a9a", fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 700, letterSpacing: 2,
        transition: "all .2s",
      }}>LEAVE IT</button>
      </div>
    </div>
  );
}

// Gallery panel — shows under the preview in any studio
function GalleryPanel({ type, onRemix, onSendToFilmRoom }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all"); // all | image | video | portfolio | batch
  const [viewItem, setViewItem] = useState(null);
  const [batchName, setBatchName] = useState("");
  const [showBatchInput, setShowBatchInput] = useState(false);

  useEffect(() => { setItems(loadGallery()); }, []);

  const filtered = items.filter(i => {
    if (filter === "all") return true;
    if (filter === "portfolio") return i.portfolio;
    if (filter === "batch") return i.batch;
    return i.type === filter;
  });

  const togglePortfolio = (id) => {
    const updated = items.map(i => i.id === id ? { ...i, portfolio: !i.portfolio } : i);
    setItems(updated); saveGallery(updated);
  };

  const deleteItem = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated); saveGallery(updated);
    if (viewItem?.id === id) setViewItem(null);
  };

  const assignBatch = (id, batch) => {
    const updated = items.map(i => i.id === id ? { ...i, batch } : i);
    setItems(updated); saveGallery(updated);
  };

  const shareItem = async (item) => {
    if (navigator.share) {
      try { await navigator.share({ title: `Eden ${item.type}`, text: item.prompt, url: item.url }); } catch {}
    } else {
      navigator.clipboard?.writeText(item.url);
    }
  };

  if (filtered.length === 0 && items.length === 0) return null;

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, padding: "14px 0 0" }}>
      {/* Header + Filters */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 700, letterSpacing: 3, color: "#FFFFFF", textTransform: "uppercase" }}>
          Gallery <span style={{ fontSize: 11, color: C.textDim, fontWeight: 600 }}>({items.length})</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all","image","video","portfolio","batch"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Cinzel',serif", letterSpacing: 1, textTransform: "uppercase",
              background: filter === f ? "rgba(197,179,88,.12)" : "transparent",
              border: `1px solid ${filter === f ? "rgba(197,179,88,.3)" : "transparent"}`,
              color: filter === f ? C.gold : C.textDim,
            }}>{f}</button>
          ))}
        </div>
      </div>
      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8, maxHeight: 280, overflowY: "auto" }}>
        {filtered.map(item => (
          <div key={item.id} style={{
            position: "relative", borderRadius: 8, overflow: "hidden", cursor: "pointer",
            border: `1px solid ${item.portfolio ? "rgba(197,179,88,.4)" : C.border}`,
            aspectRatio: "1", transition: "all .2s",
          }} onClick={() => setViewItem(item)}>
            {item.type === "image" ? (
              <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            ) : (
              <div style={{ width: "100%", height: "100%", background: "rgba(12,8,4,.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 28 }}>🎬</span>
              </div>
            )}
            {/* Item Number tag */}
            {item.itemNo && <div style={{ position: "absolute", top: 2, left: 2, padding: "1px 4px", borderRadius: 4, background: "rgba(0,0,0,.8)", fontSize: 7, color: C.gold, fontWeight: 700, fontFamily: "'Cinzel',serif", letterSpacing: 0.5 }}>{item.itemNo.split("-").pop()}</div>}
            {/* Portfolio star */}
            {item.portfolio && <div style={{ position: "absolute", top: 3, right: 3, fontSize: 12 }}>⭐</div>}
            {/* Batch tag */}
            {item.batch && <div style={{ position: "absolute", bottom: 2, left: 2, padding: "1px 4px", borderRadius: 4, background: "rgba(0,0,0,.75)", fontSize: 8, color: C.gold, fontWeight: 700 }}>{item.batch}</div>}
          </div>
        ))}
      </div>

      {/* Detail View Overlay */}
      {viewItem && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 40,
        }} onClick={() => setViewItem(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            maxWidth: 700, width: "100%", background: "linear-gradient(180deg, #121008, #0a0704)",
            borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden",
          }}>
            {/* Preview */}
            <div style={{ maxHeight: 400, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
              {viewItem.type === "image" ? (
                <img src={viewItem.url} alt="" style={{ maxWidth: "100%", maxHeight: 400, objectFit: "contain" }}/>
              ) : (
                <video src={viewItem.url} controls autoPlay loop style={{ maxWidth: "100%", maxHeight: 400 }}/>
              )}
            </div>
            {/* Meta */}
            <div style={{ padding: 20 }}>
              {/* Item Number — Confirmation Receipt */}
              {viewItem.itemNo && (
                <div style={{
                  display: "inline-block", padding: "4px 12px", borderRadius: 6, marginBottom: 8,
                  background: "rgba(197,179,88,.1)", border: "1px solid rgba(197,179,88,.3)",
                  fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, color: C.gold,
                }}>
                  {viewItem.itemNo}
                </div>
              )}
              <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Cormorant Garamond',serif", marginBottom: 6 }}>
                {new Date(viewItem.created).toLocaleDateString()} at {new Date(viewItem.created).toLocaleTimeString()} · {viewItem.backend || "Unknown"} · Seed: {viewItem.seed || "auto"} · {viewItem.steps || "?"} steps
              </div>
              <div style={{ fontSize: 14, color: C.text, fontFamily: "'Cormorant Garamond',serif", marginBottom: 14, lineHeight: 1.6 }}>
                {viewItem.prompt}
              </div>
              {/* Actions */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => { onRemix?.(viewItem); setViewItem(null); }} style={{
                  padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700,
                  fontFamily: "'Cinzel',serif", letterSpacing: 1, background: "rgba(197,179,88,.08)",
                  border: `1px solid ${C.border}`, color: C.gold,
                }}>RE-MIX</button>
                <button onClick={() => togglePortfolio(viewItem.id)} style={{
                  padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700,
                  fontFamily: "'Cinzel',serif", letterSpacing: 1,
                  background: viewItem.portfolio ? "rgba(197,179,88,.15)" : "rgba(197,179,88,.04)",
                  border: `1px solid ${viewItem.portfolio ? "rgba(197,179,88,.4)" : C.border}`,
                  color: viewItem.portfolio ? C.gold : C.textDim,
                }}>{viewItem.portfolio ? "★ IN PORTFOLIO" : "ADD TO PORTFOLIO"}</button>
                <button onClick={() => shareItem(viewItem)} style={{
                  padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700,
                  fontFamily: "'Cinzel',serif", letterSpacing: 1, background: "rgba(76,175,80,.08)",
                  border: `1px solid ${C.borderGreen}`, color: C.greenBright,
                }}>SHARE</button>
                <button onClick={() => onSendToFilmRoom?.(viewItem)} style={{
                  padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700,
                  fontFamily: "'Cinzel',serif", letterSpacing: 1, background: "rgba(197,179,88,.04)",
                  border: `1px solid ${C.border}`, color: C.textDim,
                }}>FILM ROOM</button>
                <button onClick={() => setShowBatchInput(!showBatchInput)} style={{
                  padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700,
                  fontFamily: "'Cinzel',serif", letterSpacing: 1, background: "rgba(197,179,88,.04)",
                  border: `1px solid ${C.border}`, color: C.textDim,
                }}>BATCH</button>
                <button onClick={() => { const a = document.createElement("a"); a.href = viewItem.url; a.download = `${viewItem.itemNo || viewItem.id}.${viewItem.type === "video" ? "mp4" : "png"}`; a.click(); }} style={{
                  padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700,
                  fontFamily: "'Cinzel',serif", letterSpacing: 1, background: "rgba(197,179,88,.04)",
                  border: `1px solid ${C.border}`, color: C.textDim,
                }}>DOWNLOAD</button>
                <button onClick={() => { deleteItem(viewItem.id); setViewItem(null); }} style={{
                  padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700,
                  fontFamily: "'Cinzel',serif", letterSpacing: 1, background: "rgba(244,67,54,.06)",
                  border: "1px solid rgba(244,67,54,.2)", color: "#ef9a9a",
                }}>DELETE</button>
              </div>
              {/* Batch assign */}
              {showBatchInput && (
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  <input value={batchName} onChange={e => setBatchName(e.target.value)} placeholder="Project name..." style={{
                    flex: 1, padding: "8px 12px", borderRadius: 8, background: C.bgInput, border: `1px solid ${C.border}`,
                    color: "#fff", fontSize: 13, fontFamily: "'Cormorant Garamond',serif", outline: "none",
                  }}/>
                  <button onClick={() => { if (batchName.trim()) { assignBatch(viewItem.id, batchName.trim()); setShowBatchInput(false); setViewItem({ ...viewItem, batch: batchName.trim() }); } }} style={{
                    padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 700,
                    fontFamily: "'Cinzel',serif", background: "rgba(76,175,80,.15)", border: `1px solid ${C.borderGreen}`, color: C.greenBright,
                  }}>ASSIGN</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// VIDEO STUDIO
// ═══════════════════════════════════════════
function VideoStudio({ initialPrompt, initialChatHistory }) {
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const handlePromptHistoryKey = usePromptHistory(prompt, setPrompt);
  const [duration, setDuration] = useState("5");
  const [backend, setBackend] = useState("LTX-2 Turbo (Fast)");
  const [cameraMotion, setCameraMotion] = useState("No LoRA");
  const [status, setStatus] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoMeta, setVideoMeta] = useState(null);
  const [showJudge, setShowJudge] = useState(false);
  // Render progress + stopwatch (ported from Image Studio)
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderPhase, setRenderPhase] = useState("");
  const [renderTimer, setRenderTimer] = useState(0);
  const renderTimerRef = useRef(null);
  const renderStartRef = useRef(null);

  // GPU Control (shared pattern with Image Studio)
  const [gpuMode, setGpuMode] = useState("zerogpu");
  const [gpuTier, setGpuTier] = useState(null);
  const [gpuActive, setGpuActive] = useState(false);
  const [gpuStartTime, setGpuStartTime] = useState(null);
  const [gpuCost, setGpuCost] = useState(0);
  const [gpuOverlay, setGpuOverlay] = useState(false);
  const [gpuConfirm, setGpuConfirm] = useState(null);
  const [gpuOffConfirm, setGpuOffConfirm] = useState(false);
  const [gpuSwitching, setGpuSwitching] = useState(false);
  const gpuTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const GPU_TIERS = [
    { id: "t4-small", name: "T4 Small", vram: "16 GB", price: 0.40 },
    { id: "t4-medium", name: "T4 Medium", vram: "16 GB", price: 0.60 },
    { id: "l4x1", name: "L4", vram: "24 GB", price: 0.80 },
    { id: "a10g-small", name: "A10G Small", vram: "24 GB", price: 1.00 },
    { id: "a10g-large", name: "A10G Large", vram: "24 GB", price: 1.50 },
    { id: "l40sx1", name: "L40S", vram: "48 GB", price: 1.80 },
    { id: "a100-large", name: "A100", vram: "80 GB", price: 2.50 },
    { id: "a10g-largex2", name: "2x A10G", vram: "48 GB", price: 3.00 },
    { id: "a10g-largex4", name: "4x A10G", vram: "96 GB", price: 5.00 },
  ];

  const cameraOptions = ["No LoRA","Static","Zoom In","Zoom Out","Slide Left","Slide Right","Slide Up","Slide Down"];
  const videoBackendKeys = ["LTX-2 Turbo (Fast)", "Wan 2.2 5B (Official)", "LongCat Video"];

  // Live cost ticker
  useEffect(() => {
    if (gpuActive && gpuStartTime && gpuTier) {
      const tier = GPU_TIERS.find(t => t.id === gpuTier);
      if (!tier) return;
      gpuTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - gpuStartTime) / 3600000;
        setGpuCost(elapsed * tier.price);
      }, 1000);
      return () => clearInterval(gpuTimerRef.current);
    }
    return () => clearInterval(gpuTimerRef.current);
  }, [gpuActive, gpuStartTime, gpuTier]);

  // Auto-sleep
  useEffect(() => {
    if (!gpuActive) return;
    const checker = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 240000) { // 4 min
        fetch("/api/gpu-control", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hardware: "cpu-basic" }) })
        .then(() => { setGpuActive(false); setGpuTier(null); setGpuStartTime(null); setGpuCost(0); setGpuMode("zerogpu"); });
        clearInterval(checker);
      }
    }, 30000);
    return () => clearInterval(checker);
  }, [gpuActive]);

  const activateGpu = async (tierId) => {
    setGpuSwitching(true);
    try {
      const resp = await fetch("/api/gpu-control", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hardware: tierId }) });
      const data = await resp.json();
      if (data.ok) {
        setGpuTier(tierId); setGpuActive(true); setGpuStartTime(Date.now()); setGpuCost(0); setGpuMode("dedicated"); setGpuOverlay(false); setGpuConfirm(null);
        fetch("/api/gpu-control", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sleep: 240 }) });
      } else { setStatus(`❌ GPU switch failed: ${data.error}`); }
    } catch (e) { setStatus(`❌ GPU error: ${e.message}`); }
    setGpuSwitching(false);
  };

  const deactivateGpu = async () => {
    setGpuSwitching(true);
    try {
      await fetch("/api/gpu-control", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hardware: "cpu-basic" }) });
      setGpuActive(false); setGpuTier(null); setGpuStartTime(null); setGpuCost(0); setGpuMode("zerogpu"); setGpuOffConfirm(false);
    } catch (e) { setStatus(`❌ GPU shutdown error: ${e.message}`); }
    setGpuSwitching(false);
  };

  // Helper: stop the timer and record completion time
  const stopTimer = () => {
    if (renderTimerRef.current) clearInterval(renderTimerRef.current);
    const elapsed = renderStartRef.current ? (Date.now() - renderStartRef.current) / 1000 : 0;
    return elapsed.toFixed(1);
  };

  const generateVideo = async () => {
    if (!prompt.trim()) return;
    savePromptToHistory(prompt); // Save to history for arrow up/down recall
    lastActivityRef.current = Date.now();
    setLoading(true);
    setVideoUrl(null);       // Clear previous video so progress/timer is visible
    setShowJudge(false);
    setRenderProgress(0);
    setRenderPhase("Initializing video pipeline...");
    setRenderTimer(0);

    // Start stopwatch
    renderStartRef.current = Date.now();
    if (renderTimerRef.current) clearInterval(renderTimerRef.current);
    renderTimerRef.current = setInterval(() => {
      if (renderStartRef.current) setRenderTimer(Math.floor((Date.now() - renderStartRef.current) / 1000));
    }, 100);

    setStatus(`⏳ ERE-1 generating video via ${backend}...`);

    try {
      setRenderProgress(5);
      setRenderPhase(`Connecting to ${backend}...`);

      // Simulate progress updates while waiting
      const progressInterval = setInterval(() => {
        setRenderProgress(prev => {
          if (prev >= 85) return prev;
          const increment = prev < 20 ? 3 : prev < 50 ? 2 : 1;
          return prev + increment;
        });
        // Rotate blurbs
        setRenderPhase(prev => {
          const blurbs = [
            "Chantrell is styling your scene...",
            "Quality Agent checking skin tones...",
            "Rendering cinematic frames...",
            "Building motion dynamics...",
            "Applying Eden Realism Engine...",
            "Color grading in progress...",
            "Compositing final video...",
            `${backend} is working hard...`,
            "Almost there — finalizing render...",
          ];
          const idx = blurbs.indexOf(prev);
          return blurbs[(idx + 1) % blurbs.length];
        });
      }, 3000);

      setRenderProgress(10);
      setRenderPhase(`Chantrell is styling your scene...`);

      const resp = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), backend, randomSeed: true, duration, cameraMotion }),
      });

      clearInterval(progressInterval);
      setRenderProgress(90);
      setRenderPhase("Receiving video from server...");

      const data = await resp.json();
      if (data.video) {
        setRenderProgress(100);
        setRenderPhase("Video ready!");
        setVideoUrl(data.video);
        const vidItemNo = generateItemNumber("VID");
        const elapsed = stopTimer();
        setVideoMeta({ url: data.video, prompt: prompt.trim(), seed: data.seed, backend: data.backend || backend, created: new Date().toISOString(), type: "video", itemNo: vidItemNo, renderTime: elapsed, duration });
        setStatus(`✅ ${vidItemNo} · Video generated · ${data.backend || backend} · Seed: ${data.seed || "auto"} · ${elapsed}s`);
        setShowJudge(true);
      } else {
        stopTimer();
        setRenderProgress(0);
        setRenderPhase("");
        setStatus(`❌ ${data.error || "Video generation failed"}`);
      }
    } catch (e) {
      stopTimer();
      setRenderProgress(0);
      setRenderPhase("");
      setStatus(`❌ ${e.message}`);
    }
    setLoading(false);
  };

  const handleLike = () => {
    if (!videoMeta) return;
    const gallery = loadGallery();
    const itemNo = videoMeta.itemNo || generateItemNumber("VID");
    gallery.unshift({ ...videoMeta, id: itemNo, itemNo, portfolio: false, batch: null });
    saveGallery(gallery);
    setShowJudge(false);
    setStatus("✅ Saved to Gallery");
  };

  const handleLeave = () => { setShowJudge(false); setStatus("Render discarded"); };

  const handleRemix = (item) => {
    setPrompt(item.prompt + " — different angle, new composition, alternate setting");
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: 0 }}>
      {/* LEFT — Controls */}
      <div style={{ width: 320, borderRight: `1px solid ${C.border}`, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🎬</span> Video Studio
        </div>
        <Card title="Video Prompt">
          <Input textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your video scene... ↑↓ arrows scroll prompt history" style={{ minHeight: 180, fontSize: 14, lineHeight: 1.6 }} onKeyDown={e => { handlePromptHistoryKey(e); if (e.key === "Enter" && e.ctrlKey) generateVideo(); }}/>
        </Card>
        <PromptGenerator onGenerate={p => setPrompt(p)} mediaType="video" />
        {/* ═══ GPU SELECTOR ═══ */}
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { if (gpuActive) { setGpuOffConfirm(true); return; } setGpuMode("zerogpu"); }} style={{
            flex: 1, padding: "12px 8px", borderRadius: 10, cursor: "pointer",
            fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
            background: gpuMode === "zerogpu" && !gpuActive ? "linear-gradient(135deg, rgba(197,179,88,0.15), rgba(197,179,88,0.06))" : "rgba(197,179,88,0.04)",
            border: `1px solid ${gpuMode === "zerogpu" && !gpuActive ? "rgba(197,179,88,0.35)" : C.border}`,
            color: gpuMode === "zerogpu" && !gpuActive ? C.gold : C.textDim, transition: "all 0.3s",
          }}>ZeroGPU<div style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", letterSpacing: 0, textTransform: "none", marginTop: 2, color: C.textDim }}>HF Pro · Free</div></button>
          {gpuActive ? (
            <button onClick={() => setGpuOffConfirm(true)} style={{
              flex: 1.4, padding: "8px 10px", borderRadius: 10, cursor: "pointer",
              fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
              background: "linear-gradient(135deg, rgba(46,125,50,0.2), rgba(27,94,32,0.15))",
              border: "1px solid rgba(76,175,80,0.4)", color: C.greenBright, transition: "all 0.3s", textAlign: "center",
            }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{GPU_TIERS.find(t => t.id === gpuTier)?.name || gpuTier}</div>
              <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Cormorant Garamond',serif", letterSpacing: 0, textTransform: "none", marginTop: 2, color: "#81C784" }}>
                ${gpuCost.toFixed(4)} · ${GPU_TIERS.find(t => t.id === gpuTier)?.price.toFixed(2)}/hr
              </div>
            </button>
          ) : (
            <button onClick={() => setGpuOverlay(true)} style={{
              flex: 1, padding: "12px 8px", borderRadius: 10, cursor: "pointer",
              fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
              background: "linear-gradient(135deg, rgba(197,179,88,0.12), rgba(197,179,88,0.04))",
              border: `1px solid ${C.border}`, color: C.gold, transition: "all 0.3s",
            }}>GO BIG<div style={{ fontSize: 9, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", letterSpacing: 0, textTransform: "none", marginTop: 2, color: C.textDim }}>Dedicated GPU</div></button>
          )}
        </div>
        {/* GPU OFF Confirm */}
        {gpuOffConfirm && (
          <div style={{ padding: 14, borderRadius: 10, background: "rgba(244,67,54,0.06)", border: "1px solid rgba(244,67,54,0.2)", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ef9a9a", fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>TURN OFF GPU?</div>
            <div style={{ fontSize: 12, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>{GPU_TIERS.find(t => t.id === gpuTier)?.name} · Total: ${gpuCost.toFixed(4)}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={deactivateGpu} disabled={gpuSwitching} style={{ flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", border: "1px solid rgba(244,67,54,0.3)", background: "rgba(244,67,54,0.1)", color: "#ef9a9a", fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{gpuSwitching ? "..." : "YES, TURN OFF"}</button>
              <button onClick={() => setGpuOffConfirm(false)} style={{ flex: 1, padding: "8px", borderRadius: 8, cursor: "pointer", border: `1px solid ${C.border}`, background: "rgba(197,179,88,0.04)", color: C.textDim, fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>KEEP RUNNING</button>
            </div>
          </div>
        )}
        {/* GO BIG Overlay */}
        {gpuOverlay && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => { setGpuOverlay(false); setGpuConfirm(null); }}>
            <div onClick={e => e.stopPropagation()} style={{ width: 420, maxHeight: "80vh", overflowY: "auto", background: "linear-gradient(180deg, #121008, #0a0704)", borderRadius: 16, border: `1px solid ${C.border}`, padding: 24 }}>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 700, letterSpacing: 4, color: C.gold, textTransform: "uppercase", marginBottom: 4 }}>GO BIG</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond',serif", marginBottom: 18 }}>Select dedicated GPU for maximum render quality</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {GPU_TIERS.map(tier => (
                  <button key={tier.id} onClick={() => setGpuConfirm(tier)} style={{
                    padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                    background: gpuConfirm?.id === tier.id ? "rgba(197,179,88,0.12)" : "rgba(197,179,88,0.03)",
                    border: `1px solid ${gpuConfirm?.id === tier.id ? "rgba(197,179,88,0.35)" : C.border}`,
                    display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s",
                  }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>{tier.name}</div>
                      <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Cormorant Garamond',serif" }}>{tier.vram} VRAM</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif" }}>${tier.price.toFixed(2)}<span style={{ fontSize: 10, color: C.textDim }}>/hr</span></div>
                  </button>
                ))}
              </div>
              {gpuConfirm && (
                <div style={{ marginTop: 14, padding: 14, borderRadius: 10, background: "rgba(197,179,88,0.06)", border: "1px solid rgba(197,179,88,0.2)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 6 }}>CONFIRM GPU ACTIVATION</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond',serif", marginBottom: 10 }}>
                    <strong>{gpuConfirm.name}</strong> ({gpuConfirm.vram}) at <strong>${gpuConfirm.price.toFixed(2)}/hr</strong><br/>Billed per minute. Auto-sleeps after 4 min idle.
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => activateGpu(gpuConfirm.id)} disabled={gpuSwitching} style={{ flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer", background: "linear-gradient(135deg, rgba(46,125,50,0.3), rgba(27,94,32,0.2))", border: "1px solid rgba(76,175,80,0.4)", color: C.greenBright, fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 1.5 }}>{gpuSwitching ? "SWITCHING..." : "YES, ACTIVATE"}</button>
                    <button onClick={() => setGpuConfirm(null)} style={{ padding: "10px 16px", borderRadius: 8, cursor: "pointer", background: "rgba(197,179,88,0.04)", border: `1px solid ${C.border}`, color: C.textDim, fontFamily: "'Cinzel',serif", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>CANCEL</button>
                  </div>
                </div>
              )}
              <button onClick={() => { setGpuOverlay(false); setGpuConfirm(null); }} style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 8, cursor: "pointer", background: "transparent", border: `1px solid ${C.border}`, color: C.textDim, fontFamily: "'Cinzel',serif", fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>CLOSE</button>
            </div>
          </div>
        )}
        <Card title="Engine">
          <Select value={backend} onChange={e => setBackend(e.target.value)} options={videoBackendKeys.map(b => ({ value: b, label: b }))} style={{ width: "100%" }}/>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, fontFamily: "'Cormorant Garamond',serif", marginTop: 6 }}>
            {backend.includes("LTX") ? "~8s · Camera control · Best cinematic" :
             backend.includes("Animate") ? "Motion blending · Style mixing" :
             "4-step fast · Quick iteration"}
          </div>
        </Card>
        <Card title="Settings">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>DURATION</div>
              <Select value={duration} onChange={e => setDuration(e.target.value)} options={[
                { value: "3", label: "3 seconds" },
                { value: "5", label: "5 seconds" },
                { value: "10", label: "10 seconds" },
                { value: "15", label: "15 seconds" },
              ]} style={{ width: "100%" }}/>
            </div>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 6, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>CAMERA</div>
              <Select value={cameraMotion} onChange={e => setCameraMotion(e.target.value)} options={cameraOptions.map(c => ({ value: c, label: c }))} style={{ width: "100%" }}/>
            </div>
          </div>
        </Card>
        <Btn green onClick={generateVideo} disabled={loading || !prompt.trim()} style={{ width: "100%", padding: "16px 20px", fontSize: 15 }}>
          {loading ? "⏳ Generating..." : "Generate Video"}
        </Btn>
        {status && <StatusBadge text={status} type={status.startsWith("✅") ? "success" : status.startsWith("❌") ? "error" : "info"}/>}
      </div>
      {/* CENTER — Preview + Gallery */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ flex: 1, minHeight: 400, borderRadius: 14, border: `1px solid ${C.border}`, background: "rgba(12,8,4,.6)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
          {videoUrl ? (
            <>
              <video src={videoUrl} controls autoPlay loop style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 10 }} />
              {showJudge && videoMeta && (
                <JudgeOverlay type="video" url={videoUrl} prompt={videoMeta.prompt} seed={videoMeta.seed} backend={videoMeta.backend} itemNo={videoMeta.itemNo} onLike={handleLike} onLeave={handleLeave} />
              )}
            </>
          ) : loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "80%", maxWidth: 400 }}>
              {/* Phase blurb */}
              <div style={{
                fontSize: 27, fontWeight: 700, color: C.gold, fontFamily: "'Cormorant Garamond',serif",
                textAlign: "center", minHeight: 32, letterSpacing: 0.5,
              }}>
                {renderPhase}
              </div>
              {/* Spinner */}
              <div style={{ width: 40, height: 40, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.gold}`, borderRadius: "50%", animation: "spin-loader 1s linear infinite" }}/>
              {/* Progress bar */}
              <div style={{ width: "100%", height: 6, borderRadius: 3, background: "rgba(139,115,85,.15)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3,
                  background: `linear-gradient(90deg, ${C.gold}, ${C.green})`,
                  width: `${renderProgress}%`,
                  transition: "width 0.5s ease-out",
                }}/>
              </div>
              {/* Percentage + Label */}
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>
                  {renderProgress}%
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'Cinzel',serif", letterSpacing: 2 }}>
                  GENERATING VIDEO
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.gold, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>
                  {renderProgress}%
                </span>
              </div>
              {/* Stopwatch timer */}
              <div style={{
                fontSize: 28, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cinzel',serif",
                letterSpacing: 4, textAlign: "center",
              }}>
                {Math.floor(renderTimer / 60).toString().padStart(2, "0")}:{(renderTimer % 60).toString().padStart(2, "0")}
              </div>
              <span style={{ fontSize: 22, color: C.textDim, fontFamily: "'Cormorant Garamond',serif", letterSpacing: 1 }}>
                {`Cascade: ${backend} → fallback engines`}
              </span>
            </div>
          ) : (
            <div style={{ textAlign: "center", maxWidth: 400 }}>
              <span style={{ fontSize: 48, display: "block", marginBottom: 16, opacity: .3 }}>🎬</span>
              <span style={{ fontSize: 23, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cinzel',serif", letterSpacing: 3, display: "block", marginBottom: 10 }}>VIDEO PREVIEW</span>
              <span style={{ fontSize: 21, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.6 }}>
                Write your prompt, select engine and settings, then Generate.
              </span>
            </div>
          )}
        </div>
        {/* Gallery */}
        <GalleryPanel type="video" onRemix={handleRemix} />
      </div>
      {/* RIGHT — Chat Panel */}
      <StudioChatPanel context="Video Studio" initialChatHistory={initialChatHistory} />
    </div>
  );
}

// ═══════════════════════════════════════════
// VOICE AGENTS
// ═══════════════════════════════════════════
function VoiceAgents() {
  // Full 18-agent library from ERE-1 lib/data.ts
  const agents = [
    { id: "dr_eden", name: "Dr. Eden", icon: "🏥", tag: "ENTERPRISE", desc: "Medical office receptionist", sys: "You are Dr. Eden, a medical office receptionist for a healthcare practice. You are warm, efficient, and HIPAA-conscious. You handle appointment scheduling, patient intake questions, prescription refill requests, and general medical office inquiries. Never provide medical advice — always direct patients to speak with the doctor. Be clear, professional, and reassuring." },
    { id: "eden_legal", name: "Eden Legal", icon: "⚖️", tag: "ENTERPRISE", desc: "Legal office assistant", sys: "You are Eden Legal, a legal office assistant. You handle client intake calls, schedule consultations, answer general questions about office hours and procedures, and take messages for attorneys. Never provide legal advice. Be professional, precise, and knowledgeable about general legal office procedures." },
    { id: "coach_eden", name: "Coach Eden", icon: "💪", tag: "B2C", desc: "AI fitness coach", sys: "You are Coach Eden, an energetic AI fitness coach. You help users with workout plans, exercise form guidance, motivation, and progress tracking. You are upbeat, supportive, and encouraging. Adapt your energy to match the user. Always recommend consulting a doctor before starting new exercise programs." },
    { id: "eden_realty", name: "Eden Realty", icon: "🏠", tag: "B2B", desc: "Real estate agent", sys: "You are Eden Realty, a knowledgeable real estate agent. You help potential buyers and renters with property inquiries, schedule showings, provide neighborhood information, and explain basic mortgage and buying processes. Be friendly, detail-oriented, and helpful without being pushy." },
    { id: "eden_host", name: "Eden Host", icon: "🍽️", tag: "B2B", desc: "Restaurant host", sys: "You are Eden Host, a warm restaurant host. You handle reservations, answer menu questions, accommodate dietary restrictions, and coordinate special events. Be welcoming, refined, and knowledgeable about food and dining etiquette." },
    { id: "eden_tutor", name: "Eden Tutor", icon: "📚", tag: "B2C", desc: "AI tutor — all subjects", sys: "You are Eden Tutor, a patient and encouraging AI tutor. You help students of all ages with math, science, history, writing, and other subjects. Break down complex concepts into simple steps. Celebrate progress. Never do homework for students — guide them to the answer." },
    { id: "eden_sales", name: "Eden Sales", icon: "📈", tag: "ENTERPRISE", desc: "Sales development rep", sys: "You are Eden Sales, a professional AI sales development representative. You qualify leads, conduct discovery conversations, schedule demos, and handle follow-up inquiries. Be consultative, not pushy. Ask thoughtful questions to understand needs before pitching solutions." },
    { id: "eden_support", name: "Eden Support", icon: "🛟", tag: "B2B", desc: "Customer support agent", sys: "You are Eden Support, a patient and solution-oriented customer support agent. You troubleshoot issues, create support tickets, answer FAQs, and route complex issues to the appropriate team. Stay calm, clear, and focused on resolution." },
    { id: "eden_concierge", name: "Eden Concierge", icon: "🔱", tag: "B2B", desc: "Premium concierge", sys: "You are Eden Concierge, a sophisticated premium concierge. You assist with travel planning, dining reservations, entertainment bookings, personal shopping, and luxury service coordination. Be attentive, world-traveled, and anticipate needs before they are expressed." },
    { id: "eden_wellness", name: "Eden Wellness", icon: "🧘", tag: "B2C", desc: "Wellness & mindfulness", sys: "You are Eden Wellness, a calming wellness coach. You guide users through meditation, stress management techniques, sleep hygiene improvement, and mindfulness practices. Speak gently and warmly. Create a safe, peaceful space for self-care." },
    { id: "eden_companion", name: "Eden Companion", icon: "👵", tag: "FAMILY", desc: "Senior care companion", sys: "You are Eden Companion, a patient and warm senior care companion. You provide friendly conversation, medication reminders, help connect seniors with family, and conduct daily wellness check-ins. Speak clearly, unhurriedly, and with genuine warmth. Listen more than you speak." },
    { id: "eden_lingua", name: "Eden Lingua", icon: "🌍", tag: "B2C", desc: "Language tutor — 30+ langs", sys: "You are Eden Lingua, a patient and encouraging language tutor. You help users practice conversation, grammar, vocabulary, and cultural context in their target language. Adapt your speed to the learner's level. Celebrate progress and gently correct mistakes." },
    { id: "eden_stories", name: "Eden Stories", icon: "🌙", tag: "FAMILY", desc: "Bedtime storyteller", sys: "You are Eden Stories, a warm and imaginative bedtime storyteller. You create original stories, retell fairy tales, and craft educational narratives for children. Your voice is gentle, expressive, and soothing. Adapt story complexity to the child's age. Always end stories on a positive, peaceful note." },
    { id: "eden_ministry", name: "Eden Ministry", icon: "⛪", tag: "NONPROFIT", desc: "Ministry assistant", sys: "You are Eden Ministry, a compassionate ministry assistant. You handle prayer requests, coordinate church events, provide pastoral care referrals, and support community outreach programs. Be reverent, supportive, and sincere in all interactions." },
    { id: "eden_producer", name: "Eden Producer", icon: "🎙️", tag: "CREATOR", desc: "Podcast producer", sys: "You are Eden Producer, a creative and efficient podcast producer. You help with episode planning, guest coordination, show note writing, and social media clip strategy. Be tech-savvy, dynamic, and full of ideas for growing audience engagement." },
    { id: "eden_live", name: "Eden Live", icon: "🎤", tag: "CREATOR", desc: "Live voice influencer", sys: "You are Eden Live, a charismatic live voice influencer agent. You help creators with real-time audience engagement, live show hosting, and interactive content. Be dynamic, personal, and authentic. Match the creator's brand voice." },
    { id: "eden_studio_voice", name: "Eden Studio", icon: "🎬", tag: "CREATOR", desc: "Pre-recorded content", sys: "You are Eden Studio, a polished pre-recorded content creation agent. You help with script writing, narration guidance, voiceover direction, and maintaining consistent brand voice across content. Be professional, brand-aware, and detail-oriented." },
    { id: "eden_narrator", name: "Eden Narrator", icon: "📖", tag: "PUBLISHING", desc: "Audiobook narrator", sys: "You are Eden Narrator, an expressive and versatile audiobook narrator. You bring stories to life with multiple character voices, controlled pacing, and emotional range. Be patient, adaptable, and capable of shifting between character voices seamlessly." },
  ];

  const [agent, setAgent] = useState(agents[0]);
  const [chatEngine, setChatEngine] = useState("grok");
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastEngine, setLastEngine] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);
  useEffect(() => { setMessages([{ role: "assistant", text: `Hi! I'm ${agent.name} — your Eden voice agent. How can I help you today?` }]); }, [agent]);

  const send = async () => {
    if (!chatMsg.trim() || loading) return;
    const msg = chatMsg.trim();
    setChatMsg("");
    setMessages(p => [...p, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      history.push({ role: "user", content: msg });
      const res = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: agent.sys,
          agentName: agent.name,
          messages: history,
          engine: chatEngine,
          ttsEngine: "kokoro",
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages(p => [...p, { role: "assistant", text: data.reply }]);
        setLastEngine(data.engine || chatEngine);
      } else {
        setMessages(p => [...p, { role: "assistant", text: `Error: ${data.error || "No response"}` }]);
      }
    } catch (e) { setMessages(p => [...p, { role: "assistant", text: `Connection error: ${e.message}` }]); }
    setLoading(false);
  };

  const tagColors = { ENTERPRISE: C.gold, B2B: "#64B5F6", B2C: C.greenBright, FAMILY: "#CE93D8", CREATOR: "#FFB74D", NONPROFIT: "#90CAF9", PUBLISHING: "#A5D6A7" };

  return (
    <div style={{ display: "flex", height: "100%", gap: 0 }}>
      {/* LEFT — Agent Selector */}
      <div style={{ width: 260, borderRight: `1px solid ${C.border}`, padding: 16, overflowY: "auto", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 15, fontWeight: 700, letterSpacing: 3, color: "#FFFFFF", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎙</span> 18 Agents
        </div>
        {/* Engine selector */}
        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {[["grok", "Grok (Fast)"], ["anthropic", "Claude"]].map(([k, l]) => (
            <button key={k} onClick={() => setChatEngine(k)} style={{
              flex: 1, padding: "6px 8px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Cinzel',serif", letterSpacing: 1,
              background: chatEngine === k ? "rgba(197,179,88,.12)" : "transparent",
              border: `1px solid ${chatEngine === k ? "rgba(197,179,88,.3)" : C.border}`,
              color: chatEngine === k ? "#FFFFFF" : C.textDim,
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {agents.map(a => (
            <button key={a.id} onClick={() => setAgent(a)} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10,
              border: "none", cursor: "pointer", textAlign: "left", transition: "all .2s",
              background: agent.id === a.id ? "linear-gradient(135deg,rgba(197,179,88,.1),rgba(197,179,88,.04))" : "transparent",
              borderLeft: agent.id === a.id ? "2px solid #C5B358" : "2px solid transparent",
            }}>
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: agent.id === a.id ? "#FFFFFF" : C.text, fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                <div style={{ fontSize: 10, color: tagColors[a.tag] || C.textDim, fontFamily: "'Cinzel',serif", fontWeight: 700, letterSpacing: 1 }}>{a.tag}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* CENTER — Active Agent Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>{agent.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, fontWeight: 700, letterSpacing: 2, color: "#FFFFFF" }}>{agent.name}</div>
            <div style={{ fontSize: 13, color: C.text, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, marginTop: 2 }}>{agent.desc}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: "0 0 6px rgba(76,175,80,.5)" }}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.textGreen, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>LIVE · {lastEngine ? lastEngine.toUpperCase() : chatEngine.toUpperCase()} · KOKORO TTS</span>
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "rgba(76,175,80,.1)", border: `1px solid ${C.borderGreen}`, color: tagColors[agent.tag] || C.greenBright, letterSpacing: 1 }}>{agent.tag}</span>
        </div>
        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              padding: "12px 18px", borderRadius: 14, maxWidth: "75%",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "linear-gradient(135deg,rgba(197,179,88,.12),rgba(197,179,88,.06))" : "linear-gradient(135deg,rgba(76,175,80,.07),rgba(76,175,80,.02))",
              border: `1px solid ${m.role === "user" ? "rgba(197,179,88,.15)" : C.borderGreen}`,
            }}>
              <span style={{ fontSize: 15, lineHeight: 1.7, color: m.role === "user" ? "#FFFFFF" : C.textGreen, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600 }}>{m.text}</span>
            </div>
          ))}
          {loading && <div style={{ padding: "12px 18px", borderRadius: 14, alignSelf: "flex-start", background: "linear-gradient(135deg,rgba(76,175,80,.07),rgba(76,175,80,.02))", border: `1px solid ${C.borderGreen}` }}><span style={{ color: C.textGreen, fontSize: 16, letterSpacing: 4 }}>{[0,1,2].map(i => <span key={i} style={{ animation: `dot-pulse 1.2s ease-in-out ${i*.2}s infinite`, display: "inline-block" }}>●</span>)}</span></div>}
        </div>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
          <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={`Talk to ${agent.name}...`} style={{ flex: 1, padding: "14px 18px", borderRadius: 12, background: C.bgInput, border: `1px solid ${C.border}`, color: "#FFFFFF", fontSize: 15, fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", outline: "none" }}/>
          <Btn green onClick={send} disabled={loading || !chatMsg.trim()} style={{ padding: "14px 24px" }}>Send</Btn>
        </div>
      </div>
      {/* RIGHT — Eden Assistant Chat */}
      <StudioChatPanel context="Voice Agents" />
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
  const [voice, setVoice] = useState("af_heart");
  const [ttsEngine, setTtsEngine] = useState("kokoro");
  const [faceModel, setFaceModel] = useState("kdtalker");
  const [status, setStatus] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [resultVideo, setResultVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarImage(reader.result);
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setAvatarImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = useCallback((e) => {
    const items = Array.from(e.clipboardData?.items || []);
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => setAvatarImage(reader.result);
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  const generate = async () => {
    if (!avatarImage) { setStatus("❌ Upload an avatar image first"); return; }
    if (!speech.trim()) { setStatus("❌ Enter speech text"); return; }
    setLoading(true);
    setResultVideo(null);
    setStatus("🚀 EVE 4D Pipeline: Brain → Voice → Face → Deliver...");

    // Step 1: Generate TTS audio via HuggingFace Space
    try {
      setStatus(`⏳ Step 1/2: Generating speech via ${ttsEngine === "kokoro" ? "Kokoro TTS" : "Chatterbox TTS"}...`);
      // For now, connect to the Eden Cloud GPU for full pipeline
      // The EVE 4D pipeline requires GPU — route through HuggingFace Space
      const { Client } = await import("@gradio/client");

      if (ttsEngine === "kokoro") {
        const client = await Client.connect("hexgrad/Kokoro-82M");
        const ttsResult = await client.predict("/generate_speech", {
          text: speech.trim(),
          voice: voice,
          speed: 1.0,
        });
        setStatus("⏳ Step 2/2: Animating face via KDTalker...");
        // TTS audio generated — now animate the face
        // KDTalker needs: source_image + driven_audio → talking head video
        const faceClient = await Client.connect("fffiloni/KDTalker");
        const faceResult = await faceClient.predict("/generate", {
          source_image: avatarImage,
          driven_audio: ttsResult.data[0],
        });
        const videoData = faceResult.data;
        if (typeof videoData === "string") {
          setResultVideo(videoData);
          setStatus("✅ Avatar generated — EVE 4D Pipeline complete");
        } else if (Array.isArray(videoData) && videoData.length > 0) {
          const v = videoData[0];
          const url = typeof v === "string" ? v : v?.video || v?.url || v?.path;
          if (url) {
            setResultVideo(url);
            setStatus("✅ Avatar generated — EVE 4D Pipeline complete");
          } else {
            setStatus("❌ No video in face animation result");
          }
        } else {
          setStatus("❌ Unexpected face animation response");
        }
      } else {
        // Chatterbox path
        const client = await Client.connect("resemble-ai/chatterbox");
        const ttsResult = await client.predict("/generate", {
          text: speech.trim(),
          exaggeration: 0.5,
          cfg_weight: 0.5,
        });
        setStatus("⏳ Step 2/2: Animating face...");
        const faceClient = await Client.connect("fffiloni/KDTalker");
        const faceResult = await faceClient.predict("/generate", {
          source_image: avatarImage,
          driven_audio: ttsResult.data[0],
        });
        const videoData = faceResult.data;
        const v = Array.isArray(videoData) ? videoData[0] : videoData;
        const url = typeof v === "string" ? v : v?.video || v?.url || v?.path;
        if (url) {
          setResultVideo(url);
          setStatus("✅ Avatar generated — EVE 4D Pipeline complete");
        } else {
          setStatus("❌ Face animation failed");
        }
      }
    } catch (e) {
      // Fallback: open Eden Cloud Studio
      setStatus(`⚠️ Pipeline error: ${e.message}. Opening Eden Cloud GPU...`);
      setTimeout(() => {
        window.open("https://huggingface.co/spaces/AIBRUH/eden-diffusion-studio", "_blank");
        setStatus("✅ Eden Cloud Studio opened — complete avatar build with GPU");
      }, 1500);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: 0 }}>
      {/* LEFT — Controls */}
      <div style={{ width: 320, borderRight: `1px solid ${C.border}`, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 700, letterSpacing: 4, color: "#FFFFFF", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>👤</span> Avatar Builder
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, background: "rgba(76,175,80,.1)", border: `1px solid ${C.borderGreen}`, color: C.greenBright, letterSpacing: 1, marginLeft: "auto" }}>EVE 4D</span>
        </div>
        <Card title="1. Avatar Image">
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }}/>
          <div onClick={() => fileRef.current?.click()} onDrop={handleDrop} onDragOver={e => e.preventDefault()}
            style={{ border: `2px dashed ${avatarImage ? C.green : C.border}`, borderRadius: 12, padding: avatarImage ? 8 : 24, textAlign: "center", cursor: "pointer", transition: "all .2s", minHeight: avatarImage ? "auto" : 80 }}>
            {avatarImage ? (
              <img src={avatarImage} alt="Avatar" style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 8, objectFit: "contain" }}/>
            ) : (
              <>
                <span style={{ fontSize: 28, display: "block", marginBottom: 8, opacity: .4 }}>📷</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>Click / Drop / Paste</span>
              </>
            )}
          </div>
          {avatarImage && <button onClick={() => setAvatarImage(null)} style={{ marginTop: 6, padding: "4px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.textDim, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Cinzel',serif" }}>Clear</button>}
        </Card>
        <Card title="2. Speech">
          <Input textarea value={speech} onChange={e => setSpeech(e.target.value)} placeholder="Enter what you'd like the avatar to say..." style={{ minHeight: 80 }}/>
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text, fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 4 }}>TTS ENGINE</div>
              <Select value={ttsEngine} onChange={e => setTtsEngine(e.target.value)} options={[
                { value: "kokoro", label: "Kokoro (Fast)" },
                { value: "chatterbox", label: "Chatterbox (Emotion)" },
              ]} style={{ width: "100%" }}/>
            </div>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text, fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 4 }}>VOICE</div>
              <Select value={voice} onChange={e => setVoice(e.target.value)} options={
                ttsEngine === "kokoro" ? [
                  { value: "af_heart", label: "Heart (EVE)" },
                  { value: "af_bella", label: "Bella" },
                  { value: "af_nicole", label: "Nicole" },
                  { value: "af_sarah", label: "Sarah" },
                  { value: "bf_emma", label: "Emma (UK)" },
                ] : [
                  { value: "seed_42", label: "EVE Default" },
                  { value: "seed_7", label: "EVE Warm" },
                ]
              } style={{ width: "100%" }}/>
            </div>
          </div>
        </Card>
        <Card title="3. Avatar Prompt (Optional)">
          <Input textarea value={avatarPrompt} onChange={e => setAvatarPrompt(e.target.value)} placeholder="Avatar actions, emotions, expressions..." style={{ minHeight: 60 }}/>
        </Card>
        <Card title="Quality">
          <div style={{ display: "flex", gap: 8 }}>
            {[["720p","Standard (720P · 24FPS)"],["1080p","Pro (1080P · 48FPS)"]].map(([k,l]) => (
              <button key={k} onClick={() => setQuality(k)} style={{
                flex: 1, padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "'Cormorant Garamond',serif", textAlign: "center",
                background: quality === k ? "rgba(197,179,88,.12)" : "transparent",
                border: `1px solid ${quality === k ? "rgba(197,179,88,.3)" : C.border}`,
                color: quality === k ? "#FFFFFF" : C.text,
              }}>{l}{k === "1080p" && <span style={{ fontSize: 10, fontWeight: 700, color: C.greenBright, marginLeft: 4, padding: "2px 6px", borderRadius: 3, background: "rgba(76,175,80,.15)" }}>PRO</span>}</button>
            ))}
          </div>
        </Card>
        <Btn green onClick={generate} disabled={loading} style={{ width: "100%", padding: "16px 20px", fontSize: 15 }}>
          {loading ? "⏳ Generating..." : "Generate Avatar"}
        </Btn>
        {status && <StatusBadge text={status} type={status.startsWith("✅") ? "success" : status.startsWith("❌") ? "error" : "info"}/>}
      </div>
      {/* CENTER — Preview */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ flex: 1, minHeight: 400, borderRadius: 14, border: `1px solid ${C.border}`, background: "rgba(12,8,4,.6)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {resultVideo ? (
            <video src={resultVideo} controls autoPlay loop style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 10 }}/>
          ) : loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.green}`, borderRadius: "50%", animation: "spin-loader 1s linear infinite" }}/>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: "'Cinzel',serif", letterSpacing: 2 }}>EVE 4D PIPELINE...</span>
              <span style={{ fontSize: 13, color: C.textDim, fontFamily: "'Cormorant Garamond',serif" }}>Brain → Voice → Face → Deliver</span>
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 48, display: "block", marginBottom: 12, opacity: .3 }}>👤</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Cinzel',serif", letterSpacing: 2 }}>AVATAR PREVIEW</span>
              <br/><span style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "'Cormorant Garamond',serif" }}>Upload image, enter speech, generate</span>
            </div>
          )}
        </div>
        {/* Avatar Template Library */}
        <div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 700, letterSpacing: 3, color: "#FFFFFF", textTransform: "uppercase", marginBottom: 10 }}>Template Library</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 10 }}>
            {[["Ashley","Makeup","🧑‍🎨"],["Isabella","UGC Ad","👩"],["Lia","OOTD","🧘‍♀️"],["Raj","Livestream","🎥"],["Arina","Talking Head","👩‍💼"],["Charlie","Host","🎙"],["Matt","Podcast","🎧"],["EVE","Companion","🌿"]].map(([name,tag,icon], i) => (
              <div key={i} style={{ borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", cursor: "pointer", transition: "all .2s", background: C.bgCard }}>
                <div style={{ aspectRatio: "3/4", background: `linear-gradient(135deg, rgba(${40+i*15},${30+i*10},${20+i*8},.8), rgba(18,12,8,.9))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{icon}</div>
                <div style={{ padding: "6px 8px" }}>
                  <div style={{ fontSize: 12, color: "#FFFFFF", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>{name}</div>
                  <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Cinzel',serif", letterSpacing: 1 }}>{tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* RIGHT — Chat Panel */}
      <StudioChatPanel context="Avatar Builder" />
    </div>
  );
}
