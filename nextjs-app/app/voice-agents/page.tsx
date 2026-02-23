"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { useState, useRef, useCallback, useEffect } from "react";
import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";
import { VOICE_AGENTS } from "@/lib/data";

const TAG_COLORS: Record<string, string> = {
  ENTERPRISE: "bg-[rgba(239,68,68,0.15)] text-red-400 border-red-900",
  B2B: "bg-[rgba(59,130,246,0.15)] text-blue-400 border-blue-900",
  B2C: "bg-[rgba(34,197,94,0.15)] text-green-400 border-green-900",
  CREATOR: "bg-[rgba(168,85,247,0.15)] text-purple-400 border-purple-900",
  FAMILY: "bg-[rgba(251,191,36,0.15)] text-amber-400 border-amber-900",
  PUBLISHING: "bg-[rgba(20,184,166,0.15)] text-teal-400 border-teal-900",
  NONPROFIT: "bg-[rgba(244,114,182,0.15)] text-pink-400 border-pink-900",
};

// Waveform visualizer component
function WaveformVisualizer({ isActive, isListening }: { isActive: boolean; isListening: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    let phase = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const barCount = 40;
      const barWidth = w / barCount - 2;
      const mid = h / 2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);

        let amplitude: number;
        if (isActive && isListening) {
          // Listening — active waveform
          amplitude = (Math.sin(phase + i * 0.3) * 0.4 + 0.5) * mid * (0.5 + Math.random() * 0.5);
        } else if (isActive) {
          // Speaking — smooth wave
          amplitude = (Math.sin(phase * 0.5 + i * 0.2) * 0.3 + 0.4) * mid;
        } else {
          // Idle — flat line pulse
          amplitude = (Math.sin(phase * 0.3 + i * 0.1) * 0.05 + 0.08) * mid;
        }

        const gradient = ctx.createLinearGradient(x, mid - amplitude, x, mid + amplitude);
        gradient.addColorStop(0, isListening ? "rgba(34,197,94,0.8)" : "rgba(197,179,88,0.6)");
        gradient.addColorStop(0.5, isListening ? "rgba(34,197,94,1)" : "rgba(197,179,88,1)");
        gradient.addColorStop(1, isListening ? "rgba(34,197,94,0.8)" : "rgba(197,179,88,0.6)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, mid - amplitude, barWidth, amplitude * 2);
      }

      phase += 0.1;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive, isListening]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={80}
      className="w-full max-w-md h-20 rounded-lg"
      style={{ opacity: isActive ? 1 : 0.3 }}
    />
  );
}

export default function VoiceAgentsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [agent, setAgent] = useState(VOICE_AGENTS[0].title);
  const [submitted, setSubmitted] = useState(false);

  // Live Voice Chat State
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speech Recognition setup
  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser. Use Chrome.");
      return;
    }

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interimTranscript += t;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
      if (finalTranscript) {
        setChatInput(finalTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript("");
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // Text-to-Speech for agent responses
  const speakResponse = useCallback((text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    // Try to find a good female voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes("Samantha") || v.name.includes("Google US English") ||
      v.name.includes("Microsoft Zira") || v.name.includes("Female")
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Send message (text or voice)
  async function sendMessage(overrideText?: string) {
    const text = overrideText || chatInput;
    if (!text.trim() || selectedAgent === null) return;

    const a = VOICE_AGENTS[selectedAgent];
    const newMsgs = [...messages, { role: "user", content: text.trim() }];
    setMessages(newMsgs);
    setChatInput("");
    setTranscript("");
    setChatLoading(true);

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
      const reply = data.reply || `Error: ${data.error || "Failed"}`;
      setMessages([...newMsgs, { role: "assistant", content: reply }]);
      speakResponse(reply);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Connection error. Try again." }]);
    } finally {
      setChatLoading(false);
    }
  }

  // Push-to-talk handler
  function handlePushToTalk() {
    if (isListening) {
      stopListening();
      // Auto-send after stopping
      setTimeout(() => {
        const text = chatInput || transcript;
        if (text.trim()) sendMessage(text);
      }, 300);
    } else {
      startListening();
    }
  }

  return (
    <div className="min-h-screen">
      <EdenPageLogo subtitle="18 Revenue-Ready Voice Solutions · Deploy in 48 Hours" />
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[["18+", "Solutions"], ["24/7", "Always On"], ["<300ms", "Response"], ["30+", "Languages"], ["48hr", "Deploy"]].map(([v, l]) => (
            <div key={l} className="text-center p-5 rounded-xl border border-[rgba(197,179,88,0.1)] bg-gradient-to-b from-[#12100a] to-[#0a0805]">
              <div className="text-3xl font-black text-[#C5B358]" style={{ fontFamily: '"Cinzel", serif' }}>{v}</div>
              <div className="text-xs text-[#706850] tracking-wider mt-1" style={{ fontFamily: '"DM Mono", monospace' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════
            GROK LIVE VOICE — Full-Screen Experience
            ══════════════════════════════════════════════════════ */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#C5B358] tracking-widest" style={{ fontFamily: '"Cinzel", serif' }}>
              LIVE VOICE DEMO
            </h2>
            <p className="text-sm text-[#706850] mt-1" style={{ fontFamily: '"DM Mono", monospace' }}>
              Click an agent below. Hold the mic button to speak. Powered by Grok.
            </p>
          </div>

          {/* Agent Selector — Horizontal scroll on mobile */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {VOICE_AGENTS.map((a, idx) => (
              <button
                key={a.title}
                onClick={() => { setSelectedAgent(idx); setMessages([]); }}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200"
                style={{
                  borderColor: selectedAgent === idx ? "rgba(197,179,88,0.5)" : "rgba(197,179,88,0.12)",
                  background: selectedAgent === idx ? "rgba(197,179,88,0.1)" : "rgba(18,16,10,0.8)",
                  boxShadow: selectedAgent === idx ? "0 0 15px rgba(197,179,88,0.15)" : undefined,
                }}
              >
                <span className="text-xl">{a.icon}</span>
                <span className="text-sm font-medium whitespace-nowrap" style={{
                  color: selectedAgent === idx ? "#C5B358" : "#706850",
                  fontFamily: '"Cinzel", serif',
                }}>{a.title}</span>
              </button>
            ))}
          </div>

          {selectedAgent !== null ? (
            <div className="rounded-2xl border border-[rgba(197,179,88,0.15)] bg-[#0c0a06] overflow-hidden">
              {/* Active Agent Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(197,179,88,0.1)] bg-[rgba(197,179,88,0.03)]">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{VOICE_AGENTS[selectedAgent].icon}</span>
                  <div>
                    <div className="font-bold text-lg text-[#FFF8E1]" style={{ fontFamily: '"Cinzel", serif' }}>
                      {VOICE_AGENTS[selectedAgent].title}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                      <span className="text-xs text-[#22c55e] font-mono tracking-wider">GROK ENGINE ACTIVE</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider border transition-all"
                    style={{
                      borderColor: voiceEnabled ? "rgba(34,197,94,0.3)" : "rgba(197,179,88,0.2)",
                      background: voiceEnabled ? "rgba(34,197,94,0.1)" : "transparent",
                      color: voiceEnabled ? "#22c55e" : "#706850",
                    }}
                  >
                    {voiceEnabled ? "VOICE ON" : "VOICE OFF"}
                  </button>
                  <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border ${TAG_COLORS[VOICE_AGENTS[selectedAgent].tag] || ""}`}
                    style={{ fontFamily: '"DM Mono", monospace' }}>
                    {VOICE_AGENTS[selectedAgent].tag}
                  </span>
                </div>
              </div>

              {/* Waveform Visualizer */}
              <div className="flex justify-center py-4 bg-[rgba(0,0,0,0.3)]">
                <WaveformVisualizer isActive={isListening || isSpeaking || chatLoading} isListening={isListening} />
              </div>

              {/* Chat Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-10">
                    <div className="text-5xl mb-3">{VOICE_AGENTS[selectedAgent].icon}</div>
                    <p className="text-[#504830] text-sm">{VOICE_AGENTS[selectedAgent].desc}</p>
                    <p className="text-[#3a3520] text-xs mt-2 font-mono">{VOICE_AGENTS[selectedAgent].stat}</p>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[80%] p-3.5 rounded-2xl" style={{
                      background: m.role === "user"
                        ? "linear-gradient(135deg, rgba(197,179,88,0.15), rgba(197,179,88,0.08))"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${m.role === "user" ? "rgba(197,179,88,0.25)" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: m.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                    }}>
                      {m.role === "assistant" && (
                        <div className="text-[10px] text-[#504830] font-mono mb-1 tracking-wider">
                          {VOICE_AGENTS[selectedAgent].title.toUpperCase()}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed text-[#E8DCC8]">{m.content}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="p-3.5 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]" style={{ borderRadius: "20px 20px 20px 4px" }}>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C5B358] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C5B358] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C5B358] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Live transcript */}
              {isListening && transcript && (
                <div className="px-4 py-2 bg-[rgba(34,197,94,0.05)] border-t border-[rgba(34,197,94,0.1)]">
                  <p className="text-sm text-[#22c55e] italic font-mono">{transcript}</p>
                </div>
              )}

              {/* Input Controls */}
              <div className="flex items-center gap-3 p-4 border-t border-[rgba(197,179,88,0.1)] bg-[rgba(0,0,0,0.2)]">
                {/* Push-to-Talk Button */}
                <button
                  onClick={handlePushToTalk}
                  disabled={chatLoading}
                  className="relative flex-shrink-0 w-14 h-14 rounded-full border-2 transition-all duration-300 flex items-center justify-center group"
                  style={{
                    borderColor: isListening ? "#22c55e" : "rgba(197,179,88,0.3)",
                    background: isListening
                      ? "radial-gradient(circle, rgba(34,197,94,0.3), rgba(34,197,94,0.05))"
                      : "radial-gradient(circle, rgba(197,179,88,0.1), transparent)",
                    boxShadow: isListening ? "0 0 30px rgba(34,197,94,0.3)" : "none",
                  }}
                >
                  {isListening ? (
                    <div className="w-5 h-5 rounded-sm bg-[#22c55e]" /> /* Stop square */
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={chatLoading ? "#3a3520" : "#C5B358"} strokeWidth="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  )}
                  {isListening && (
                    <div className="absolute inset-0 rounded-full border-2 border-[#22c55e] animate-ping opacity-30" />
                  )}
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder={isListening ? "Listening..." : "Type or tap the mic..."}
                    className="w-full px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(197,179,88,0.12)] text-[#E8DCC8] text-sm placeholder-[#3a3520] focus:outline-none focus:border-[rgba(197,179,88,0.3)] transition-all"
                    disabled={isListening}
                  />
                </div>

                {/* Send Button */}
                <button
                  onClick={() => sendMessage()}
                  disabled={chatLoading || !chatInput.trim()}
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                  style={{
                    background: chatInput.trim() ? "linear-gradient(135deg, #8B6914, #C5B358)" : "rgba(197,179,88,0.05)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={chatInput.trim() ? "#050302" : "#504830"} strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-[rgba(197,179,88,0.08)] bg-[#0c0a06]">
              <div className="text-6xl mb-4">🎙️</div>
              <p className="text-lg text-[#706850]" style={{ fontFamily: '"Cinzel", serif' }}>Select an agent to begin</p>
              <p className="text-xs text-[#3a3520] mt-2 font-mono">18 agents ready for live voice conversation</p>
            </div>
          )}
        </div>

        {/* Agent Cards Grid */}
        <h2 className="text-2xl font-bold text-[#C5B358] text-center mb-6 tracking-widest" style={{ fontFamily: '"Cinzel", serif' }}>
          ALL AGENTS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {VOICE_AGENTS.map((a, idx) => (
            <div key={a.title}
              onClick={() => { setSelectedAgent(idx); setMessages([]); window.scrollTo({ top: 200, behavior: "smooth" }); }}
              className="p-5 rounded-xl border bg-[#12100a] hover:border-[rgba(197,179,88,0.3)] transition-all duration-300 group cursor-pointer"
              style={{
                borderColor: selectedAgent === idx ? "rgba(197,179,88,0.5)" : "rgba(197,179,88,0.12)",
                boxShadow: selectedAgent === idx ? "0 0 20px rgba(197,179,88,0.15)" : undefined,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-4xl group-hover:scale-110 transition-transform">{a.icon}</span>
                <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border ${TAG_COLORS[a.tag] || "bg-[rgba(197,179,88,0.1)] text-[#C5B358] border-[#8B6914]"}`}
                  style={{ fontFamily: '"DM Mono", monospace' }}>
                  {a.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#FFF8E1] mb-1" style={{ fontFamily: '"Cinzel", serif' }}>{a.title}</h3>
              <p className="text-sm text-[#a09880] leading-relaxed mb-3">{a.desc}</p>
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span className="text-xs text-[#22c55e]" style={{ fontFamily: '"DM Mono", monospace' }}>{a.stat}</span>
              </div>
              <div className="pt-3 border-t border-[rgba(197,179,88,0.1)] flex items-center justify-between">
                <span className="text-2xl font-black text-white" style={{ fontFamily: '"Cinzel", serif' }}>{a.price}</span>
                <span className="text-xs text-[#504830] font-mono">TAP TO DEMO</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[#C5B358] text-center mb-6" style={{ fontFamily: '"Cinzel", serif' }}>
            Order Your Agent
          </h2>

          {submitted ? (
            <div className="text-center p-8 rounded-xl border border-[rgba(197,179,88,0.2)] bg-[rgba(197,179,88,0.04)]">
              <span className="text-5xl block mb-4">🔱</span>
              <h3 className="text-xl font-bold text-[#C5B358] mb-2" style={{ fontFamily: '"Cinzel", serif' }}>Order Received!</h3>
              <p className="text-[#a09880]">{name} — {agent}<br />We&apos;ll reach out at {email} within 24hrs.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full" />
                <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full" />
                <select value={agent} onChange={(e) => setAgent(e.target.value)} className="w-full text-sm">
                  {VOICE_AGENTS.map((a) => <option key={a.title} value={a.title}>{a.title}</option>)}
                </select>
              </div>
              <button
                onClick={() => { if (name && email) setSubmitted(true); }}
                className="w-full py-3 rounded-lg font-bold tracking-wider uppercase
                  bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302]
                  hover:shadow-[0_0_30px_rgba(197,179,88,0.4)] transition-all duration-300"
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
