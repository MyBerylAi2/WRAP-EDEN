"use client";

import { useState } from "react";
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

export default function VoiceAgentsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [agent, setAgent] = useState(VOICE_AGENTS[0].title);
  const [submitted, setSubmitted] = useState(false);

  // Grok Live Chat State
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  async function sendMessage() {
    if (!chatInput.trim() || selectedAgent === null) return;
    const a = VOICE_AGENTS[selectedAgent];
    const newMsgs = [...messages, { role: "user", content: chatInput }];
    setMessages(newMsgs);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/voice-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt: a.sys, agentName: a.title, messages: newMsgs }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: "assistant", content: data.reply || `Error: ${data.error || "Failed"}` }]);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Connection error. Try again." }]);
    } finally {
      setChatLoading(false);
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

        {/* Agent Cards — Clickable for Grok demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {VOICE_AGENTS.map((a, idx) => (
            <div key={a.title}
              onClick={() => { setSelectedAgent(idx); setMessages([]); }}
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
              <div className="pt-3 border-t border-[rgba(197,179,88,0.1)]">
                <span className="text-2xl font-black text-white" style={{ fontFamily: '"Cinzel", serif' }}>{a.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ⚡ GROK LIVE CHAT DEMO */}
        <div className="max-w-3xl mx-auto mb-12 p-6 rounded-xl border border-[rgba(197,179,88,0.15)] bg-[#12100a]">
          <h2 className="text-xl font-bold text-[#C5B358] mb-1" style={{ fontFamily: '"Cinzel", serif' }}>
            ⚡ Live Agent Demo — Powered by Grok
          </h2>
          <p className="text-xs text-[#504830] mb-5" style={{ fontFamily: '"DM Mono", monospace' }}>
            Click any agent above → chat below to test the conversation live
          </p>

          {selectedAgent !== null ? (
            <>
              {/* Active Agent Banner */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-[rgba(197,179,88,0.04)] border border-[rgba(197,179,88,0.12)]">
                <span className="text-3xl">{VOICE_AGENTS[selectedAgent].icon}</span>
                <div>
                  <div className="font-bold text-[#FFF8E1]" style={{ fontFamily: '"Cinzel", serif' }}>{VOICE_AGENTS[selectedAgent].title}</div>
                  <div className="text-xs text-[#22c55e]" style={{ fontFamily: '"DM Mono", monospace' }}>● ACTIVE — GROK ENGINE</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto p-3 rounded-lg bg-[#0a0805] border border-[rgba(197,179,88,0.08)]">
                {messages.length === 0 && (
                  <p className="text-sm italic text-[#504830]">Start chatting with {VOICE_AGENTS[selectedAgent].title}...</p>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[80%] p-3 rounded-xl" style={{
                      background: m.role === "user" ? "rgba(197,179,88,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${m.role === "user" ? "rgba(197,179,88,0.2)" : "rgba(255,255,255,0.06)"}`,
                    }}>
                      <p className="text-sm leading-relaxed">{m.content}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                      <span className="text-[#C5B358] animate-pulse">●●●</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <button
                  onClick={sendMessage}
                  disabled={chatLoading}
                  className="px-6 py-2 rounded-lg font-bold tracking-wider uppercase bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302] hover:shadow-[0_0_20px_rgba(197,179,88,0.3)] transition-all disabled:opacity-50"
                  style={{ fontFamily: '"Cinzel", serif' }}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-[#504830]">
              <div className="text-5xl mb-3">👆</div>
              <p>Select an agent above to start the live demo</p>
            </div>
          )}
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
                🔱 Submit Order
              </button>
            </div>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
