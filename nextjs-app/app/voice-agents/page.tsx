"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { useState, useRef, useEffect, useCallback } from "react";
import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";
import { VOICE_AGENTS, VOICE_AGENT_SALES_WRAPPER } from "@/lib/data";
import { useGrokVoice } from "@/hooks/useGrokVoice";

// ═══════════════════════════════════════════════════════════════════
// EDEN VOICE — Re-engineered from xAI Grok Realtime API
// Real-time WebSocket voice: Browser → Grok → Audio playback
// x.ai/api/voice look & feel, Eden luxury branding
// ═══════════════════════════════════════════════════════════════════

const TAG_COLORS: Record<string, string> = {
  ENTERPRISE: "bg-[rgba(239,68,68,0.12)] text-red-400 border-red-900/50",
  B2B: "bg-[rgba(59,130,246,0.12)] text-blue-400 border-blue-900/50",
  B2C: "bg-[rgba(34,197,94,0.12)] text-green-400 border-green-900/50",
  CREATOR: "bg-[rgba(168,85,247,0.12)] text-purple-400 border-purple-900/50",
  FAMILY: "bg-[rgba(251,191,36,0.12)] text-amber-400 border-amber-900/50",
  PUBLISHING: "bg-[rgba(20,184,166,0.12)] text-teal-400 border-teal-900/50",
  NONPROFIT: "bg-[rgba(244,114,182,0.12)] text-pink-400 border-pink-900/50",
};

const GROK_VOICES = [
  { id: "Eve", label: "EVE", desc: "Energetic & upbeat", color: "#C5B358" },
  { id: "Ara", label: "ARA", desc: "Warm & friendly", color: "#4CAF50" },
  { id: "Leo", label: "LEO", desc: "Authoritative", color: "#64B5F6" },
  { id: "Rex", label: "REX", desc: "Confident & professional", color: "#EF5350" },
  { id: "Sal", label: "SAL", desc: "Smooth & versatile", color: "#AB47BC" },
] as const;

// ─── Animated Waveform ───
function VoiceWaveform({ level, state }: { level: number; state: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      phaseRef.current += 0.03;
      const mid = h / 2;

      // Draw concentric rings (idle) or waveform (active)
      if (state === "idle" || state === "connecting") {
        // Subtle breathing rings
        for (let ring = 0; ring < 3; ring++) {
          const r = 30 + ring * 25 + Math.sin(phaseRef.current + ring * 0.5) * 5;
          const alpha = 0.08 - ring * 0.02;
          ctx.beginPath();
          ctx.arc(w / 2, mid, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(197,179,88,${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        // Center dot
        ctx.beginPath();
        ctx.arc(w / 2, mid, 4, 0, Math.PI * 2);
        ctx.fillStyle = state === "connecting" ? "rgba(197,179,88,0.6)" : "rgba(197,179,88,0.2)";
        ctx.fill();
      } else {
        // Active waveform — circular orb with audio-reactive bars
        const barCount = 64;
        const baseRadius = 50;
        const isListening = state === "listening";
        const isSpeaking = state === "speaking";
        const isProcessing = state === "processing";

        for (let i = 0; i < barCount; i++) {
          const angle = (i / barCount) * Math.PI * 2;
          let amplitude: number;

          if (isListening) {
            amplitude = level * 60 + Math.sin(phaseRef.current * 2 + i * 0.3) * 15 * level;
          } else if (isSpeaking) {
            amplitude = 15 + Math.sin(phaseRef.current * 1.5 + i * 0.2) * 20 + Math.cos(phaseRef.current * 0.8 + i * 0.4) * 10;
          } else if (isProcessing) {
            amplitude = 5 + Math.sin(phaseRef.current * 3 + i * 0.5) * 8;
          } else {
            amplitude = 3 + Math.sin(phaseRef.current + i * 0.15) * 3;
          }

          const innerR = baseRadius;
          const outerR = baseRadius + amplitude;
          const x1 = w / 2 + Math.cos(angle) * innerR;
          const y1 = mid + Math.sin(angle) * innerR;
          const x2 = w / 2 + Math.cos(angle) * outerR;
          const y2 = mid + Math.sin(angle) * outerR;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = 2;

          const hue = isListening ? "34,197,94" : isSpeaking ? "197,179,88" : "100,100,100";
          const alpha = 0.3 + (amplitude / 80) * 0.7;
          ctx.strokeStyle = `rgba(${hue},${alpha})`;
          ctx.stroke();
        }

        // Inner glow circle
        const gradient = ctx.createRadialGradient(w / 2, mid, 0, w / 2, mid, baseRadius);
        const glowColor = isListening ? "34,197,94" : "197,179,88";
        gradient.addColorStop(0, `rgba(${glowColor},0.08)`);
        gradient.addColorStop(1, `rgba(${glowColor},0)`);
        ctx.beginPath();
        ctx.arc(w / 2, mid, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // State indicator dot
        ctx.beginPath();
        ctx.arc(w / 2, mid, 6, 0, Math.PI * 2);
        ctx.fillStyle = isListening ? "#22c55e" : isSpeaking ? "#C5B358" : isProcessing ? "#F5E6A3" : "#555";
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [level, state]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={200}
      className="mx-auto"
      style={{ width: "300px", height: "200px" }}
    />
  );
}

// ─── Status Badge ───
function StateBadge({ state }: { state: string }) {
  const configs: Record<string, { label: string; color: string; pulse: boolean }> = {
    idle: { label: "READY", color: "#504830", pulse: false },
    connecting: { label: "CONNECTING", color: "#C5B358", pulse: true },
    connected: { label: "CONNECTED", color: "#4CAF50", pulse: false },
    listening: { label: "LISTENING", color: "#22c55e", pulse: true },
    processing: { label: "THINKING", color: "#F5E6A3", pulse: true },
    speaking: { label: "SPEAKING", color: "#C5B358", pulse: true },
    error: { label: "ERROR", color: "#EF5350", pulse: false },
  };
  const cfg = configs[state] || configs.idle;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
        {cfg.pulse && <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-40" style={{ backgroundColor: cfg.color }} />}
      </div>
      <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}

export default function VoiceAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(0); // Dr. Eden on load
  const [selectedVoice, setSelectedVoice] = useState<string>("Eve");
  const [messages, setMessages] = useState<{ role: string; content: string; time: string }[]>([
    { role: "assistant", content: (VOICE_AGENTS[0] as any).greeting || "Welcome! How can I help you today?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [textInput, setTextInput] = useState("");
  const [mode, setMode] = useState<"realtime" | "text">("realtime");

  // Fallback text chat state
  const [textLoading, setTextLoading] = useState(false);
  const [fallbackMessages, setFallbackMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: (VOICE_AGENTS[0] as any).greeting || "Welcome! How can I help you today?" },
  ]);

  // Order form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [orderAgent, setOrderAgent] = useState(VOICE_AGENTS[0].title);
  const [submitted, setSubmitted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const agentSys = selectedAgent !== null
    ? `${VOICE_AGENT_SALES_WRAPPER}\n\n${VOICE_AGENTS[selectedAgent].sys}\n\nPricing: ${VOICE_AGENTS[selectedAgent].price}. Deployment: 48 hours.`
    : "";
  const agentTitle = selectedAgent !== null ? VOICE_AGENTS[selectedAgent].title : "Eden Voice";

  // Grok Realtime Voice Hook
  const voice = useGrokVoice({
    voice: selectedVoice as any,
    instructions: agentSys,
    agentName: agentTitle,
    onTranscript: (text) => {
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { role: "user", content: text, time }]);
    },
    onResponse: (text) => {
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { role: "assistant", content: text, time }]);
    },
    onError: (err) => {
      console.error("[voice]", err);
      // Auto-fallback to text mode
      if (mode === "realtime") setMode("text");
    },
  });

  // Agent selection with auto-greeting — must be after voice hook
  const selectAgent = useCallback((idx: number, scrollToTop = false) => {
    const a = VOICE_AGENTS[idx];
    setSelectedAgent(idx);
    if (voice.isConnected) voice.disconnect();

    // Auto-greet — the agent introduces itself immediately
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const greeting = (a as any).greeting || `Hi! I'm ${a.title}. How can I help you today?`;
    setMessages([{ role: "assistant", content: greeting, time }]);
    setFallbackMessages([{ role: "assistant", content: greeting }]);

    if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [voice]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, fallbackMessages]);

  // Text fallback send
  const sendTextMessage = useCallback(async () => {
    if (!textInput.trim() || selectedAgent === null) return;

    if (mode === "realtime" && voice.isConnected) {
      voice.sendText(textInput.trim());
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => [...prev, { role: "user", content: textInput.trim(), time }]);
      setTextInput("");
      return;
    }

    // Text fallback via /api/voice-agent
    const a = VOICE_AGENTS[selectedAgent];
    const newMsgs = [...fallbackMessages, { role: "user", content: textInput.trim() }];
    setFallbackMessages(newMsgs);
    setTextInput("");
    setTextLoading(true);

    try {
      const res = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: a.sys,
          agentName: a.title,
          messages: newMsgs,
          engine: "grok",
        }),
      });
      const data = await res.json();
      setFallbackMessages([...newMsgs, { role: "assistant", content: data.reply || data.error || "Error" }]);
    } catch {
      setFallbackMessages([...newMsgs, { role: "assistant", content: "Connection error." }]);
    } finally {
      setTextLoading(false);
    }
  }, [textInput, selectedAgent, mode, voice, fallbackMessages]);

  const handleMicToggle = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  return (
    <div className="min-h-screen bg-[#050302]">
      <EdenPageLogo subtitle="Real-Time Voice Intelligence · Powered by Grok" />
      <NavBar />

      {/* ═══════════════════════════════════════════════════════
          HERO — x.ai-inspired dark premium section
          ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(197,179,88,0.04) 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
          {/* Stats bar */}
          <div className="flex justify-center gap-8 mb-8">
            {[
              ["<1s", "LATENCY"],
              ["$0.05", "/MINUTE"],
              ["100+", "LANGUAGES"],
              ["5", "VOICES"],
              ["24/7", "ALWAYS ON"],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <div className="text-lg font-black text-[#C5B358]" style={{ fontFamily: '"Cinzel", serif' }}>{value}</div>
                <div className="text-[9px] text-[#504830] tracking-[0.15em] font-mono">{label}</div>
              </div>
            ))}
          </div>

          {/* Agent Selector — Horizontal pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide justify-center flex-wrap">
            {VOICE_AGENTS.map((a, idx) => (
              <button
                key={a.title}
                onClick={() => selectAgent(idx)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all duration-200 whitespace-nowrap"
                style={{
                  borderColor: selectedAgent === idx ? "rgba(197,179,88,0.4)" : "rgba(197,179,88,0.08)",
                  background: selectedAgent === idx ? "rgba(197,179,88,0.08)" : "transparent",
                  color: selectedAgent === idx ? "#C5B358" : "#504830",
                }}
              >
                <span>{a.icon}</span>
                <span style={{ fontFamily: '"Cinzel", serif' }}>{a.title}</span>
              </button>
            ))}
          </div>

          {/* ═══ MAIN VOICE INTERFACE ═══ */}
          {selectedAgent !== null ? (
            <div className="rounded-2xl border border-[rgba(197,179,88,0.1)] bg-[rgba(8,5,3,0.9)] backdrop-blur-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(197,179,88,0.06)]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{VOICE_AGENTS[selectedAgent].icon}</span>
                  <div>
                    <div className="text-sm font-bold text-[#FFF8E1]" style={{ fontFamily: '"Cinzel", serif' }}>
                      {VOICE_AGENTS[selectedAgent].title}
                    </div>
                    <StateBadge state={voice.state} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Voice Selector */}
                  <div className="flex gap-1">
                    {GROK_VOICES.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVoice(v.id)}
                        title={`${v.label} — ${v.desc}`}
                        className="w-7 h-7 rounded-full border text-[8px] font-bold tracking-wider transition-all"
                        style={{
                          borderColor: selectedVoice === v.id ? v.color : "rgba(255,255,255,0.06)",
                          background: selectedVoice === v.id ? `${v.color}15` : "transparent",
                          color: selectedVoice === v.id ? v.color : "#504830",
                        }}
                      >
                        {v.label[0]}
                      </button>
                    ))}
                  </div>
                  {/* Mode toggle */}
                  <button
                    onClick={() => setMode(mode === "realtime" ? "text" : "realtime")}
                    className="px-2 py-1 rounded text-[9px] font-mono tracking-wider border transition-all"
                    style={{
                      borderColor: mode === "realtime" ? "rgba(34,197,94,0.3)" : "rgba(197,179,88,0.15)",
                      color: mode === "realtime" ? "#22c55e" : "#706850",
                    }}
                  >
                    {mode === "realtime" ? "VOICE" : "TEXT"}
                  </button>
                </div>
              </div>

              {/* Waveform Visualizer — The star of the show */}
              <div className="py-6 bg-[rgba(0,0,0,0.4)]">
                <VoiceWaveform level={voice.audioLevel} state={voice.state} />

                {/* Live transcript */}
                {voice.responseText && (
                  <p className="text-center text-sm text-[#C5B358] mt-3 px-8 animate-pulse font-serif italic">
                    {voice.responseText}
                  </p>
                )}
                {voice.transcript && voice.state === "listening" && (
                  <p className="text-center text-sm text-[#22c55e] mt-3 px-8 font-mono">
                    {voice.transcript}
                  </p>
                )}
              </div>

              {/* Conversation Log */}
              <div className="h-64 overflow-y-auto px-4 py-3 space-y-2.5 border-t border-[rgba(197,179,88,0.04)]">
                {(mode === "realtime" ? messages : fallbackMessages.map(m => ({ ...m, time: "" }))).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[#3a3520] text-sm font-serif">{VOICE_AGENTS[selectedAgent].desc}</p>
                    <p className="text-[#252015] text-xs mt-2 font-mono">
                      {mode === "realtime" ? "Tap the mic to start a live voice conversation" : "Type below to chat"}
                    </p>
                  </div>
                )}
                {(mode === "realtime" ? messages : fallbackMessages.map(m => ({ ...m, time: "" }))).map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[75%]">
                      <div className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed" style={{
                        background: m.role === "user"
                          ? "rgba(197,179,88,0.08)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${m.role === "user" ? "rgba(197,179,88,0.15)" : "rgba(255,255,255,0.04)"}`,
                        borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        color: "#E8DCC8",
                      }}>
                        {m.content}
                      </div>
                      {m.time && (
                        <div className={`text-[9px] text-[#302a1a] mt-0.5 font-mono ${m.role === "user" ? "text-right" : "text-left"} px-2`}>
                          {m.time}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {textLoading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]" style={{ borderRadius: "18px 18px 18px 4px" }}>
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#C5B358] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-[#C5B358] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-[#C5B358] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 px-4 py-3 border-t border-[rgba(197,179,88,0.06)] bg-[rgba(0,0,0,0.3)]">
                {/* Connect/Disconnect */}
                {mode === "realtime" && !voice.isConnected && (
                  <button
                    onClick={voice.connect}
                    className="px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider border border-[rgba(197,179,88,0.2)] text-[#C5B358] hover:bg-[rgba(197,179,88,0.05)] transition-all"
                  >
                    CONNECT
                  </button>
                )}

                {mode === "realtime" && voice.isConnected && (
                  <>
                    {/* Mic Button — The big one */}
                    <button
                      onClick={handleMicToggle}
                      className="relative w-14 h-14 rounded-full border-2 transition-all duration-300 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: voice.isListening ? "#22c55e" : voice.isSpeaking ? "#C5B358" : "rgba(197,179,88,0.2)",
                        background: voice.isListening
                          ? "radial-gradient(circle, rgba(34,197,94,0.2), transparent)"
                          : voice.isSpeaking
                            ? "radial-gradient(circle, rgba(197,179,88,0.15), transparent)"
                            : "transparent",
                        boxShadow: voice.isListening
                          ? "0 0 40px rgba(34,197,94,0.2)"
                          : voice.isSpeaking
                            ? "0 0 30px rgba(197,179,88,0.15)"
                            : "none",
                      }}
                    >
                      {voice.isListening ? (
                        <div className="w-5 h-5 rounded-sm bg-[#22c55e]" />
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C5B358" strokeWidth="2">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="23" />
                          <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                      )}
                      {voice.isListening && (
                        <div className="absolute inset-0 rounded-full border-2 border-[#22c55e] animate-ping opacity-20" />
                      )}
                    </button>

                    {/* Disconnect */}
                    <button
                      onClick={voice.disconnect}
                      className="w-10 h-10 rounded-full border border-[rgba(239,83,80,0.2)] flex items-center justify-center hover:bg-[rgba(239,83,80,0.05)] transition-all flex-shrink-0"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF5350" strokeWidth="2">
                        <path d="M18.36 5.64l-12.72 12.72M5.64 5.64l12.72 12.72" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Text input — always available */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendTextMessage()}
                    placeholder={voice.isListening ? "Listening..." : mode === "realtime" ? "Type or use mic..." : "Type a message..."}
                    className="w-full px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(197,179,88,0.08)] text-[#E8DCC8] text-sm placeholder-[#252015] focus:outline-none focus:border-[rgba(197,179,88,0.2)] transition-all"
                    disabled={voice.isListening}
                  />
                </div>

                {/* Send */}
                <button
                  onClick={sendTextMessage}
                  disabled={!textInput.trim() || textLoading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 disabled:opacity-20"
                  style={{
                    background: textInput.trim() ? "linear-gradient(135deg, #8B6914, #C5B358)" : "transparent",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={textInput.trim() ? "#050302" : "#302a1a"} strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* No agent selected */
            <div className="text-center py-20 rounded-2xl border border-[rgba(197,179,88,0.06)] bg-[rgba(8,5,3,0.5)]">
              <div className="text-7xl mb-6">🎙️</div>
              <h2 className="text-2xl font-bold text-[#C5B358] tracking-widest mb-2" style={{ fontFamily: '"Cinzel", serif' }}>
                EDEN VOICE
              </h2>
              <p className="text-sm text-[#504830] mb-1">Real-time AI voice conversations</p>
              <p className="text-xs text-[#302a1a] font-mono">Select an agent above to begin</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FEATURE CARDS — x.ai-inspired minimal grid
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: "⚡", title: "Sub-1s Latency", desc: "Real-time WebSocket streaming" },
            { icon: "🌍", title: "100+ Languages", desc: "Auto-detect, native accents" },
            { icon: "🔧", title: "Function Calling", desc: "Book, search, action mid-call" },
            { icon: "🛡️", title: "GLM-5 Governance", desc: "Independent quality auditor" },
          ].map(f => (
            <div key={f.title} className="p-4 rounded-xl border border-[rgba(197,179,88,0.06)] bg-[rgba(18,16,10,0.5)]">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-bold text-[#E8DCC8] mb-1" style={{ fontFamily: '"Cinzel", serif' }}>{f.title}</div>
              <div className="text-[11px] text-[#504830]">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* AGENT CARDS */}
        <h2 className="text-xl font-bold text-[#C5B358] text-center mb-6 tracking-[0.2em]" style={{ fontFamily: '"Cinzel", serif' }}>
          18 REVENUE-READY AGENTS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {VOICE_AGENTS.map((a, idx) => (
            <div key={a.title}
              onClick={() => selectAgent(idx, true)}
              className="p-4 rounded-xl border bg-[rgba(12,10,6,0.8)] hover:border-[rgba(197,179,88,0.25)] transition-all duration-300 cursor-pointer group"
              style={{
                borderColor: selectedAgent === idx ? "rgba(197,179,88,0.4)" : "rgba(197,179,88,0.06)",
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-3xl group-hover:scale-110 transition-transform">{a.icon}</span>
                <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${TAG_COLORS[a.tag] || ""}`}
                  style={{ fontFamily: '"DM Mono", monospace' }}>
                  {a.tag}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#FFF8E1] mb-1" style={{ fontFamily: '"Cinzel", serif' }}>{a.title}</h3>
              <p className="text-xs text-[#706850] leading-relaxed mb-2 line-clamp-2">{a.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-[#22c55e]" />
                  <span className="text-[10px] text-[#22c55e] font-mono">{a.stat}</span>
                </div>
                <span className="text-sm font-black text-white" style={{ fontFamily: '"Cinzel", serif' }}>{a.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* PRICING */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-[#C5B358] tracking-[0.2em] mb-2" style={{ fontFamily: '"Cinzel", serif' }}>
            PRICING
          </h2>
          <p className="text-xs text-[#504830] font-mono">Voice API powered by Grok · Eden quality standards by GLM-5</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { tier: "B2C", price: "$29", period: "/mo", features: ["Unlimited voice minutes", "5 custom agents", "All 5 voices", "Basic analytics"] },
            { tier: "B2B", price: "$199", period: "/mo + $500 setup", features: ["Unlimited agents", "Custom voice training", "CRM integration", "Priority support", "GLM-5 governance"], highlight: true },
            { tier: "B2B2C", price: "$5K", period: "+ 30% rev share", features: ["White-label platform", "Unlimited everything", "Custom model fine-tuning", "Dedicated GPU", "Direct engineering support"] },
          ].map(p => (
            <div key={p.tier}
              className="p-5 rounded-xl border text-center"
              style={{
                borderColor: p.highlight ? "rgba(197,179,88,0.3)" : "rgba(197,179,88,0.06)",
                background: p.highlight ? "rgba(197,179,88,0.03)" : "rgba(12,10,6,0.5)",
              }}
            >
              <div className="text-[10px] font-mono tracking-[0.2em] text-[#706850] mb-2">{p.tier}</div>
              <div className="text-3xl font-black text-[#C5B358] mb-0.5" style={{ fontFamily: '"Cinzel", serif' }}>{p.price}</div>
              <div className="text-[10px] text-[#504830] font-mono mb-4">{p.period}</div>
              <ul className="space-y-1.5 text-left">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#a09880]">
                    <span className="text-[#4CAF50] text-[10px]">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ORDER FORM */}
        <div className="max-w-lg mx-auto">
          <h2 className="text-lg font-bold text-[#C5B358] text-center mb-4 tracking-widest" style={{ fontFamily: '"Cinzel", serif' }}>
            ORDER YOUR AGENT
          </h2>
          {submitted ? (
            <div className="text-center p-6 rounded-xl border border-[rgba(197,179,88,0.15)] bg-[rgba(197,179,88,0.03)]">
              <div className="text-4xl mb-3">🔱</div>
              <h3 className="text-lg font-bold text-[#C5B358] mb-1" style={{ fontFamily: '"Cinzel", serif' }}>Order Received</h3>
              <p className="text-sm text-[#706850]">{name} — {orderAgent}<br />We&apos;ll reach out at {email} within 24hrs.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full" />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} className="w-full" />
                <select value={orderAgent} onChange={e => setOrderAgent(e.target.value)} className="w-full text-sm">
                  {VOICE_AGENTS.map(a => <option key={a.title} value={a.title}>{a.title}</option>)}
                </select>
              </div>
              <button
                onClick={() => { if (name && email) setSubmitted(true); }}
                className="w-full py-3 rounded-xl font-bold tracking-[0.15em] uppercase text-sm
                  bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302]
                  hover:shadow-[0_0_30px_rgba(197,179,88,0.3)] transition-all duration-300"
                style={{ fontFamily: '"Cinzel", serif' }}
              >
                SUBMIT ORDER
              </button>
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
