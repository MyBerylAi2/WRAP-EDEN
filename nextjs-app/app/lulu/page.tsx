"use client";

import { useState } from "react";
import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";
import { EDEN_PRESETS, IMAGE_BACKENDS, RESOLUTIONS, SKIN_TONES } from "@/lib/data";

// ─── LULU ROOM CARDS ────────────────────────────────────────────────

const LULU_ROOMS = [
  {
    id: "mahogany-glamour",
    name: "Mahogany Glamour",
    icon: "🪔",
    desc: "The main stage — crystal chandeliers, mahogany walls, beaded gowns, finger waves.",
    keywords: "1920s glamour, jazz age elegance, mahogany wood paneling, crystal chandeliers, beaded gown, finger waves hairstyle",
  },
  {
    id: "the-parlor",
    name: "The Parlor",
    icon: "🕯️",
    desc: "A candlelit parlor — velvet chaise lounge, ornate gold frames, silk curtains.",
    keywords: "candlelit parlor, velvet chaise lounge, ornate gold frame, silk curtains",
  },
  {
    id: "diamond-room",
    name: "Diamond Room",
    icon: "💎",
    desc: "The inner sanctum — amber lamplight, art deco mirror, satin and shadow.",
    keywords: "intimate boudoir, amber lamplight, satin sheets, art deco mirror",
  },
];

// ─── ERA OPTIONS ─────────────────────────────────────────────────────

const ERAS = [
  "1920s Classic",
  "Art Deco",
  "Harlem Renaissance",
  "Jazz Age Paris",
];

export default function LuluPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [skinTone, setSkinTone] = useState(SKIN_TONES[0]);
  const [era, setEra] = useState(ERAS[0]);
  const [preset, setPreset] = useState(Object.keys(EDEN_PRESETS)[0]);
  const [backend, setBackend] = useState(Object.keys(IMAGE_BACKENDS)[0]);
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [enhance, setEnhance] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Room card selection injects keywords into prompt ──
  const handleRoomSelect = (room: typeof LULU_ROOMS[0]) => {
    setSelectedRoom(room.id);
    const existing = prompt.trim();
    if (!existing) {
      setPrompt(room.keywords);
    } else {
      // Append room keywords if not already present
      if (!existing.includes(room.keywords.split(",")[0])) {
        setPrompt(`${existing}, ${room.keywords}`);
      }
    }
  };

  // ── Build the full generation prompt ──
  const buildFullPrompt = () => {
    const parts: string[] = [];
    if (prompt.trim()) parts.push(prompt.trim());
    parts.push(era);
    if (skinTone !== "Auto-Detect (Smart Engine)") {
      parts.push(`${skinTone} skin tone`);
    }
    return parts.join(", ");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setStatus("⚠️ Describe your Mahogany Hall scene.");
      return;
    }
    setLoading(true);
    setStatus("🪔 The Hall awakens...");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: buildFullPrompt(),
          preset,
          backend,
          resolution,
          steps: 50,
          seed: Math.floor(Math.random() * 999999),
          randomSeed: true,
          enhance,
          negative: "",
        }),
      });
      const data = await res.json();
      if (data.image) {
        setImageUrl(data.image);
        setStatus(`✅ Scene rendered. Seed: ${data.seed ?? "—"}`);
      } else {
        setStatus(`❌ ${data.error || "Generation failed"}`);
      }
    } catch (e: unknown) {
      setStatus(`❌ ${e instanceof Error ? e.message : "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `lulu-mahogany-hall-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen">
      <EdenPageLogo subtitle="1920s Glamour · Jazz Age Elegance · Mahogany Hall" />
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── ROOM CARDS ─────────────────────────────────────────── */}
        <div className="mb-8">
          <h3
            className="text-xl font-bold mb-4"
            style={{
              fontFamily: '"Cinzel", serif',
              color: "#D4A853",
              letterSpacing: "4px",
            }}
          >
            CHOOSE YOUR ROOM
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LULU_ROOMS.map((room) => {
              const isSelected = selectedRoom === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => handleRoomSelect(room)}
                  className="text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(139,90,20,0.35), rgba(197,179,88,0.12))"
                      : "rgba(10,8,5,0.8)",
                    borderColor: isSelected
                      ? "rgba(212,168,83,0.6)"
                      : "rgba(139,90,20,0.25)",
                    boxShadow: isSelected
                      ? "0 0 24px rgba(212,168,83,0.2), inset 0 0 16px rgba(197,179,88,0.06)"
                      : "none",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{room.icon}</span>
                    <div>
                      <h4
                        className="font-bold text-sm mb-1 tracking-wider"
                        style={{
                          fontFamily: '"Cinzel", serif',
                          color: isSelected ? "#F5E6A3" : "#D4A853",
                          letterSpacing: "2px",
                        }}
                      >
                        {room.name}
                      </h4>
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          color: isSelected ? "#C9A96E" : "#6B5230",
                          fontFamily: '"Cormorant Garamond", serif',
                          fontSize: "0.85rem",
                        }}
                      >
                        {room.desc}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── GENERATION UI ──────────────────────────────────────── */}
        <h3
          className="text-xl font-bold mb-4"
          style={{
            fontFamily: '"Cinzel", serif',
            color: "#D4A853",
            letterSpacing: "4px",
          }}
        >
          COMPOSE YOUR SCENE
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Controls */}
          <div className="space-y-4">

            {/* Prompt */}
            <div>
              <label
                className="block text-xs font-bold tracking-wider mb-1.5"
                style={{ fontFamily: '"DM Mono", monospace', color: "#D4A853" }}
              >
                SCENE DESCRIPTION
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your Mahogany Hall scene..."
                rows={4}
                className="w-full resize-none"
                style={{
                  background: "rgba(10,8,5,0.9)",
                  border: "1px solid rgba(139,90,20,0.35)",
                  borderRadius: "8px",
                  color: "#E8DCC8",
                  padding: "12px",
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: "1rem",
                  outline: "none",
                }}
              />
            </div>

            {/* Skin Tone + Era */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-bold tracking-wider mb-1.5"
                  style={{ fontFamily: '"DM Mono", monospace', color: "#D4A853" }}
                >
                  SKIN TONE
                </label>
                <select
                  value={skinTone}
                  onChange={(e) => setSkinTone(e.target.value)}
                  className="w-full text-sm"
                  style={{
                    background: "rgba(10,8,5,0.9)",
                    border: "1px solid rgba(139,90,20,0.35)",
                    borderRadius: "6px",
                    color: "#E8DCC8",
                    padding: "8px 10px",
                  }}
                >
                  {SKIN_TONES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-xs font-bold tracking-wider mb-1.5"
                  style={{ fontFamily: '"DM Mono", monospace', color: "#D4A853" }}
                >
                  ERA
                </label>
                <select
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                  className="w-full text-sm"
                  style={{
                    background: "rgba(10,8,5,0.9)",
                    border: "1px solid rgba(139,90,20,0.35)",
                    borderRadius: "6px",
                    color: "#E8DCC8",
                    padding: "8px 10px",
                  }}
                >
                  {ERAS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Eden Preset + Engine */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-bold tracking-wider mb-1.5"
                  style={{ fontFamily: '"DM Mono", monospace', color: "#D4A853" }}
                >
                  🔱 EDEN PRESET
                </label>
                <select
                  value={preset}
                  onChange={(e) => setPreset(e.target.value)}
                  className="w-full text-sm"
                  style={{
                    background: "rgba(10,8,5,0.9)",
                    border: "1px solid rgba(139,90,20,0.35)",
                    borderRadius: "6px",
                    color: "#E8DCC8",
                    padding: "8px 10px",
                  }}
                >
                  {Object.keys(EDEN_PRESETS).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-xs font-bold tracking-wider mb-1.5"
                  style={{ fontFamily: '"DM Mono", monospace', color: "#D4A853" }}
                >
                  ⚡ ENGINE
                </label>
                <select
                  value={backend}
                  onChange={(e) => setBackend(e.target.value)}
                  className="w-full text-sm"
                  style={{
                    background: "rgba(10,8,5,0.9)",
                    border: "1px solid rgba(139,90,20,0.35)",
                    borderRadius: "6px",
                    color: "#E8DCC8",
                    padding: "8px 10px",
                  }}
                >
                  {Object.keys(IMAGE_BACKENDS).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label
                className="block text-xs font-bold tracking-wider mb-1.5"
                style={{ fontFamily: '"DM Mono", monospace', color: "#D4A853" }}
              >
                📐 RESOLUTION
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full text-sm"
                style={{
                  background: "rgba(10,8,5,0.9)",
                  border: "1px solid rgba(139,90,20,0.35)",
                  borderRadius: "6px",
                  color: "#E8DCC8",
                  padding: "8px 10px",
                }}
              >
                {RESOLUTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Enhance Toggle */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "#8B7355" }}>
                <input
                  type="checkbox"
                  checked={enhance}
                  onChange={(e) => setEnhance(e.target.checked)}
                  className="accent-[#D4A853]"
                />
                Enhance Prompt
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-lg tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontFamily: '"Cinzel", serif',
                background: loading
                  ? "rgba(139,90,20,0.4)"
                  : "linear-gradient(to right, #6B3F10, #D4A853, #B8892E)",
                color: "#0a0805",
                boxShadow: loading ? "none" : "0 0 28px rgba(212,168,83,0.35)",
                letterSpacing: "4px",
              }}
            >
              {loading ? "⏳ ENTERING THE HALL..." : "ENTER THE HALL"}
            </button>
          </div>

          {/* RIGHT: Output */}
          <div className="space-y-4">
            <div
              className="min-h-[512px] rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                background: "rgba(8,5,3,0.95)",
                border: "1px solid rgba(139,90,20,0.2)",
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Generated Mahogany Hall scene"
                  className="max-w-full max-h-[600px] object-contain"
                />
              ) : (
                <div className="text-center" style={{ color: "#3D2A10" }}>
                  <span className="text-6xl block mb-4">🪔</span>
                  <p style={{ fontFamily: '"Cinzel", serif', letterSpacing: "3px", fontSize: "0.8rem" }}>
                    YOUR SCENE WILL APPEAR HERE
                  </p>
                </div>
              )}
            </div>

            {/* Status */}
            {status && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{
                  background: "rgba(8,5,3,0.95)",
                  border: "1px solid rgba(139,90,20,0.18)",
                  color: "#8B7355",
                  fontFamily: '"DM Mono", monospace',
                }}
              >
                {status}
              </div>
            )}

            {/* Download Button — only shown when image exists */}
            {imageUrl && (
              <button
                onClick={handleDownload}
                className="w-full py-3 rounded-lg font-bold tracking-wider uppercase transition-all duration-300"
                style={{
                  fontFamily: '"Cinzel", serif',
                  background: "transparent",
                  border: "1px solid rgba(212,168,83,0.4)",
                  color: "#D4A853",
                  letterSpacing: "3px",
                  fontSize: "0.85rem",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(139,90,20,0.15)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(212,168,83,0.7)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "rgba(212,168,83,0.4)";
                }}
              >
                ↓ DOWNLOAD SCENE
              </button>
            )}
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
