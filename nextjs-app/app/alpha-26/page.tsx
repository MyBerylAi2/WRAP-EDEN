"use client";

import { useState, useRef, useEffect } from "react";
import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";

// ═══════════════════════════════════════════════════════════════════
// EDEN ALPHA-26 LAB
// Agentic diffusion expert team powered by Grok
// The chatbot controls ALL settings — user just describes what they want
// ═══════════════════════════════════════════════════════════════════

interface GenerationSettings {
  prompt: string;
  negative_prompt: string;
  sampler: string;
  steps: number;
  cfg_scale: number;
  width: number;
  height: number;
  seed: number;
  style: string;
  camera: string;
}

const DEFAULT_SETTINGS: GenerationSettings = {
  prompt: "",
  negative_prompt: "(worst quality:1.8), (low quality:1.8), (airbrushed:1.6), (plastic:1.6), (shiny skin:1.6), (glossy skin:1.5), (waxy:1.5), (porcelain:1.5), (3d render:1.4), (cgi:1.3), (digital art:1.4), (bad anatomy:1.5), (deformed:1.6)",
  sampler: "DPM++ 2M Karras",
  steps: 40,
  cfg_scale: 4.5,
  width: 1024,
  height: 1024,
  seed: -1,
  style: "Raw Photo",
  camera: "Portrait 85mm",
};

const AGENT_SYSTEM = `You are the EDEN ALPHA-26 Diffusion Expert Team — a panel of 6 expert AI agents working together to produce the world's most photorealistic images.

YOUR TEAM:
1. PROMPT EXPERT — Constructs cinema-grade prompts using the 6-layer framework (Subject, Wardrobe, Body Physics, Camera, Emotion, Environment)
2. QUALITY JUDGE — Validates outputs against Eden standards. Checks for plastic skin, AI artifacts, wrong anatomy
3. PIPELINE BUILDER — Selects optimal sampler, steps, CFG for each scene type
4. CREATIVE DIRECTOR — Art direction, composition, lighting design, mood setting
5. RESEARCH SCOUT — Knows all 40+ models in the Eden registry, picks the right approach
6. DEPLOY AGENT — Manages generation, settings optimization, troubleshooting

YOUR KNOWLEDGE:
- SDXL merged model: Anteros XXXL v1 (uncensored) + Juggernaut XL v9 (skin texture)
- Six Pillars of Photorealism: Sampler, Steps, CFG Scale, Negative Prompts, Resolution, Model Selection
- CFG 4.0-4.5 for natural skin. NEVER above 7.
- DPM++ 2M Karras or DPM++ SDE Karras only. NEVER Euler a.
- 40 steps default, 50 for max quality, 60 for ultra-detail faces
- Hires Fix 1.5x at 0.38 denoise
- Smart Negative Engine: 11 conditional triggers + always-active base
- Skin Standard: matte, visible pores, subsurface scattering, 0.3 deviation rule
- Camera Standard: ARRI ALEXA 35, Kodak Vision3 250D, 35mm anamorphic, f/1.4

CRITICAL BEHAVIOR:
When the user describes what they want, you MUST respond with:
1. A brief creative direction explanation (1-2 sentences)
2. A JSON settings block wrapped in \`\`\`settings ... \`\`\` that the frontend will parse:

\`\`\`settings
{
  "prompt": "the full optimized prompt",
  "negative_prompt": "targeted negatives for this scene",
  "sampler": "DPM++ 2M Karras",
  "steps": 40,
  "cfg_scale": 4.5,
  "width": 1024,
  "height": 1024,
  "seed": -1,
  "style": "Raw Photo",
  "camera": "Portrait 85mm"
}
\`\`\`

ALWAYS include the settings block. The user's image gets generated automatically from your settings.
If the user says "more detail" or "fix the skin" — adjust settings accordingly.
If they say "make it wider" — change width/height.
If they say "softer" — lower CFG slightly.

You are the expert. Make the decisions. The user just describes the vision.`;

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

// Parse settings from agent response
function parseSettings(text: string): Partial<GenerationSettings> | null {
  const match = text.match(/```settings\s*([\s\S]*?)\s*```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

// Strip settings block from display text
function stripSettings(text: string): string {
  return text.replace(/```settings\s*[\s\S]*?\s*```/g, "").trim();
}

export default function Alpha26Page() {
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "Welcome to the ALPHA-26 Lab. I'm your diffusion expert team — 6 AI agents working together to produce cinema-grade photorealistic images.\n\nDescribe what you want to see. I'll handle the prompt engineering, settings optimization, and generation. Just tell me your vision.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState("");
  const [spaceStatus, setSpaceStatus] = useState<"checking" | "ready" | "starting" | "offline">("checking");
  const [showSettings, setShowSettings] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Check Space status on load
  useEffect(() => {
    fetch("/api/alpha26-generate")
      .then(r => r.json())
      .then(d => setSpaceStatus(d.status === "ready" ? "ready" : "starting"))
      .catch(() => setSpaceStatus("offline"));
  }, []);

  // Send chat to Grok agent
  async function sendChat() {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newMsgs: ChatMsg[] = [...chatMessages, { role: "user", content: userMsg }];
    setChatMessages(newMsgs);
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai-router", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "prompt-enhance",
          engine: "grok",
          system: AGENT_SYSTEM,
          message: userMsg,
          temperature: 0.8,
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "Error getting response.";

      setChatMessages([...newMsgs, { role: "assistant", content: reply }]);

      // Parse settings from agent response
      const parsed = parseSettings(reply);
      if (parsed) {
        const newSettings = { ...settings, ...parsed };
        setSettings(newSettings);

        // Auto-generate if we have a prompt
        if (newSettings.prompt) {
          generateImage(newSettings);
        }
      }
    } catch {
      setChatMessages([...newMsgs, { role: "assistant", content: "Connection error. Try again." }]);
    } finally {
      setChatLoading(false);
    }
  }

  // Generate image with current settings
  async function generateImage(overrideSettings?: GenerationSettings) {
    const s = overrideSettings || settings;
    if (!s.prompt) { setGenStatus("No prompt set. Tell the agent what you want."); return; }

    setGenerating(true);
    setGenStatus("Generating with ALPHA-26...");

    try {
      const res = await fetch("/api/alpha26-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const data = await res.json();
      if (data.image) {
        setImageUrl(data.image);
        setGenStatus(`Generated! Endpoint: ${data.endpoint || "auto"}`);
      } else {
        setGenStatus(`${data.error || "Generation failed"}. Space may be starting up.`);
      }
    } catch (e) {
      setGenStatus(`Error: ${e instanceof Error ? e.message : "Network error"}`);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050302]">
      <EdenPageLogo subtitle="ALPHA-26 LAB · Agentic Diffusion · Expert Team Controls" />
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header badges */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(197,179,88,0.15)] bg-[rgba(197,179,88,0.03)]">
            <div className={`w-2 h-2 rounded-full ${spaceStatus === "ready" ? "bg-[#22c55e]" : spaceStatus === "starting" ? "bg-[#F5E6A3] animate-pulse" : "bg-[#EF5350]"}`} />
            <span className="text-[10px] font-mono tracking-wider text-[#706850]">
              SPACE: {spaceStatus.toUpperCase()}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-full border border-[rgba(197,179,88,0.15)] bg-[rgba(197,179,88,0.03)]">
            <span className="text-[10px] font-mono tracking-wider text-[#706850]">
              SDXL · ANTEROS + JUGGERNAUT · DPM++ 2M KARRAS
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-full border border-[rgba(197,179,88,0.15)] bg-[rgba(197,179,88,0.03)]">
            <span className="text-[10px] font-mono tracking-wider text-[#706850]">
              6 EXPERT AGENTS
            </span>
          </div>
        </div>

        {/* ═══ MAIN LAYOUT: Chat (left) + Image (right) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* LEFT: Agent Chat Interface */}
          <div className="rounded-2xl border border-[rgba(197,179,88,0.1)] bg-[rgba(8,5,3,0.9)] overflow-hidden flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(197,179,88,0.06)] bg-[rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧠</span>
                <div>
                  <div className="text-sm font-bold text-[#C5B358]" style={{ fontFamily: '"Cinzel", serif' }}>
                    DIFFUSION EXPERT TEAM
                  </div>
                  <div className="text-[9px] font-mono text-[#504830] tracking-wider">
                    PROMPT · QUALITY · PIPELINE · CREATIVE · RESEARCH · DEPLOY
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-2 py-1 rounded text-[9px] font-mono tracking-wider border border-[rgba(197,179,88,0.15)] text-[#706850] hover:text-[#C5B358] transition-all"
              >
                {showSettings ? "HIDE" : "SHOW"} SETTINGS
              </button>
            </div>

            {/* Current settings bar (collapsed) */}
            {showSettings && (
              <div className="px-4 py-2 border-b border-[rgba(197,179,88,0.04)] bg-[rgba(197,179,88,0.02)] grid grid-cols-4 gap-2 text-[9px] font-mono text-[#504830]">
                <div>CFG: <span className="text-[#C5B358]">{settings.cfg_scale}</span></div>
                <div>Steps: <span className="text-[#C5B358]">{settings.steps}</span></div>
                <div>Sampler: <span className="text-[#C5B358]">{settings.sampler.split(" ")[0]}</span></div>
                <div>Res: <span className="text-[#C5B358]">{settings.width}x{settings.height}</span></div>
                <div>Style: <span className="text-[#C5B358]">{settings.style}</span></div>
                <div>Camera: <span className="text-[#C5B358]">{settings.camera}</span></div>
                <div>Seed: <span className="text-[#C5B358]">{settings.seed === -1 ? "Random" : settings.seed}</span></div>
                <div className="truncate" title={settings.prompt}>Prompt: <span className="text-[#706850]">{settings.prompt.slice(0, 30) || "—"}...</span></div>
              </div>
            )}

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%]">
                    {m.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs">🧠</span>
                        <span className="text-[9px] font-mono tracking-wider text-[#504830]">EXPERT TEAM</span>
                      </div>
                    )}
                    <div className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap" style={{
                      background: m.role === "user" ? "rgba(197,179,88,0.08)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${m.role === "user" ? "rgba(197,179,88,0.15)" : "rgba(255,255,255,0.04)"}`,
                      borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      color: "#E8DCC8",
                    }}>
                      {stripSettings(m.content)}
                    </div>
                    {m.role === "assistant" && parseSettings(m.content) && (
                      <div className="mt-1 px-2 py-1 rounded-lg bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.1)]">
                        <span className="text-[9px] font-mono text-[#22c55e] tracking-wider">SETTINGS APPLIED — GENERATING</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]" style={{ borderRadius: "18px 18px 18px 4px" }}>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#C5B358] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-[#C5B358] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-[#C5B358] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-[9px] font-mono text-[#504830]">EXPERT TEAM ANALYZING...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-[rgba(197,179,88,0.06)] bg-[rgba(0,0,0,0.3)]">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendChat()}
                placeholder="Describe your vision — the experts handle the rest..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(197,179,88,0.08)] text-[#E8DCC8] text-sm placeholder-[#302a1a] focus:outline-none focus:border-[rgba(197,179,88,0.2)] transition-all"
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-20"
                style={{ background: chatInput.trim() ? "linear-gradient(135deg, #8B6914, #C5B358)" : "transparent" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={chatInput.trim() ? "#050302" : "#302a1a"} strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>

          {/* RIGHT: Image Output + Manual Controls */}
          <div className="space-y-4">
            {/* Image display */}
            <div className="rounded-2xl border border-[rgba(197,179,88,0.1)] bg-[#0a0805] overflow-hidden" style={{ minHeight: "450px" }}>
              {generating ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[450px]">
                  <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-[rgba(197,179,88,0.15)]" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-[#C5B358] animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-t-[#4CAF50] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                  </div>
                  <p className="text-sm text-[#C5B358]" style={{ fontFamily: '"Cinzel", serif' }}>GENERATING</p>
                  <p className="text-[10px] font-mono text-[#504830] mt-1">ALPHA-26 ENGINE ACTIVE</p>
                </div>
              ) : imageUrl ? (
                <div className="relative group">
                  <img src={imageUrl} alt="ALPHA-26 Generation" className="w-full object-contain max-h-[600px]" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent opacity-0 group-hover:opacity-100 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#706850]">
                        {settings.sampler} · {settings.steps} steps · CFG {settings.cfg_scale} · {settings.width}x{settings.height}
                      </span>
                      <a href={imageUrl} download className="px-2 py-1 rounded text-[9px] font-mono text-[#C5B358] border border-[rgba(197,179,88,0.2)] hover:bg-[rgba(197,179,88,0.05)]">
                        DOWNLOAD
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[450px]">
                  <div className="text-6xl mb-4">🔬</div>
                  <p className="text-lg text-[#C5B358]" style={{ fontFamily: '"Cinzel", serif' }}>ALPHA-26 LAB</p>
                  <p className="text-xs text-[#504830] mt-1">Tell the expert team what you want to see</p>
                </div>
              )}
            </div>

            {/* Status */}
            {genStatus && (
              <div className="p-2.5 rounded-lg border border-[rgba(197,179,88,0.08)] bg-[rgba(8,5,3,0.8)] text-xs text-[#706850] font-mono">
                {genStatus}
              </div>
            )}

            {/* Manual generate button */}
            <button
              onClick={() => generateImage()}
              disabled={generating || !settings.prompt}
              className="w-full py-3 rounded-xl font-bold tracking-[0.15em] uppercase text-sm transition-all duration-300
                bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302]
                hover:shadow-[0_0_30px_rgba(197,179,88,0.3)] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {generating ? "GENERATING..." : "RE-GENERATE WITH CURRENT SETTINGS"}
            </button>

            {/* Quick action buttons */}
            <div className="flex gap-2">
              {["more detail", "softer skin", "warmer light", "wider shot", "fix anatomy"].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => { setChatInput(cmd); }}
                  className="px-2.5 py-1.5 rounded-lg border border-[rgba(197,179,88,0.08)] text-[10px] font-mono text-[#504830] hover:text-[#C5B358] hover:border-[rgba(197,179,88,0.2)] transition-all"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Open Space directly */}
            <a
              href="https://aibruh-eden-diffusion-studio.hf.space"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-2 rounded-lg border border-[rgba(197,179,88,0.06)] text-[10px] font-mono text-[#504830] hover:text-[#706850] transition-all"
            >
              OPEN FULL SPACE IN NEW TAB
            </a>
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
