"use client";

import { useState } from "react";
import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";
import { PromptGenerator } from "@/components/PromptGenerator";
import {
  SCENE_CATEGORIES, SUBJECT_TYPES, SKIN_TONES, CAMERAS, LIGHTINGS,
  VISUAL_STYLES, PLATFORM_PRESETS, EDEN_PRESETS, IMAGE_BACKENDS, RESOLUTIONS,
} from "@/lib/data";

export default function ImageStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [preset, setPreset] = useState(Object.keys(EDEN_PRESETS)[0]);
  const [backend, setBackend] = useState(Object.keys(IMAGE_BACKENDS)[0]);
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [steps, setSteps] = useState(8);
  const [seed, setSeed] = useState(42);
  const [randomSeed, setRandomSeed] = useState(true);
  const [enhance, setEnhance] = useState(true);
  const [negative, setNegative] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  // Grok-powered prompt enhancement — offloads from Claude
  const handleGrokEnhance = async () => {
    if (!prompt.trim()) return;
    setEnhancing(true);
    try {
      const res = await fetch("/api/prompt-enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tier: "ice", mediaType: "image" }),
      });
      const data = await res.json();
      if (data.enhanced) {
        setPrompt(data.enhanced);
        setStatus("⚡ Prompt enhanced by Grok");
      }
    } catch { /* silent */ }
    setEnhancing(false);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { setStatus("⚠️ Enter a prompt."); return; }
    setLoading(true);
    setStatus("🔱 Generating...");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, preset, backend, resolution, steps, seed, randomSeed, enhance, negative }),
      });
      const data = await res.json();
      if (data.image) {
        setImageUrl(data.image);
        setStatus(`✅ Generated! Seed: ${data.seed || seed}`);
      } else {
        setStatus(`❌ ${data.error || "Generation failed"}`);
      }
    } catch (e: unknown) {
      setStatus(`❌ ${e instanceof Error ? e.message : "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <EdenPageLogo subtitle="Photorealistic Generation · Eden Protocol · No Filters" />
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* PROMPT GENERATOR */}
        <PromptGenerator
          mode="image"
          sceneCategories={SCENE_CATEGORIES}
          subjects={SUBJECT_TYPES}
          skinTones={SKIN_TONES}
          cameras={CAMERAS}
          lightings={LIGHTINGS}
          visualStyles={VISUAL_STYLES}
          platforms={PLATFORM_PRESETS}
        />

        {/* GENERATION UI */}
        <h3
          className="text-xl font-bold text-[#C5B358] mb-4"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          ⚡ Generate
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                PROMPT
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your image in detail..."
                rows={4}
                className="w-full resize-none"
              />
              <button
                onClick={handleGrokEnhance}
                disabled={enhancing || !prompt.trim()}
                className="mt-1.5 px-3 py-1 rounded text-xs font-mono tracking-wider border border-[rgba(197,179,88,0.2)] text-[#C5B358] hover:bg-[rgba(197,179,88,0.08)] transition-all disabled:opacity-30"
              >
                {enhancing ? "ENHANCING..." : "⚡ ENHANCE WITH GROK"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                  🔱 EDEN PRESET
                </label>
                <select value={preset} onChange={(e) => setPreset(e.target.value)} className="w-full text-sm">
                  {Object.keys(EDEN_PRESETS).map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                  ⚡ ENGINE
                </label>
                <select value={backend} onChange={(e) => setBackend(e.target.value)} className="w-full text-sm">
                  {Object.keys(IMAGE_BACKENDS).map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                📐 RESOLUTION
              </label>
              <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full text-sm">
                {RESOLUTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                  STEPS: {steps}
                </label>
                <input type="range" min={1} max={50} value={steps} onChange={(e) => setSteps(+e.target.value)}
                  className="w-full accent-[#C5B358]" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                  SEED
                </label>
                <input type="number" value={seed} onChange={(e) => setSeed(+e.target.value)}
                  className="w-full text-sm" disabled={randomSeed} />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#a09880]">
                <input type="checkbox" checked={randomSeed} onChange={(e) => setRandomSeed(e.target.checked)}
                  className="accent-[#C5B358]" /> Random Seed
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#a09880]">
                <input type="checkbox" checked={enhance} onChange={(e) => setEnhance(e.target.checked)}
                  className="accent-[#C5B358]" /> Enhance Prompt
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                NEGATIVE (OPTIONAL)
              </label>
              <textarea value={negative} onChange={(e) => setNegative(e.target.value)}
                placeholder="Extra things to avoid..." rows={2} className="w-full resize-none text-sm" />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-lg tracking-wider uppercase transition-all duration-300
                bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302]
                hover:shadow-[0_0_30px_rgba(197,179,88,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {loading ? "⏳ GENERATING..." : "🔱 GENERATE IMAGE"}
            </button>
          </div>

          {/* RIGHT: Output */}
          <div className="space-y-4">
            <div className="min-h-[512px] rounded-xl border border-[rgba(197,179,88,0.15)] bg-[#0a0805] flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl} alt="Generated" className="max-w-full max-h-[600px] object-contain" />
              ) : (
                <div className="text-center text-[#504830]">
                  <span className="text-6xl block mb-4">🔱</span>
                  <p style={{ fontFamily: '"Cinzel", serif' }}>Your creation will appear here</p>
                </div>
              )}
            </div>
            {status && (
              <div className="p-3 rounded-lg border border-[rgba(197,179,88,0.12)] bg-[#0a0805] text-sm text-[#a09880]"
                style={{ fontFamily: '"DM Mono", monospace' }}>
                {status}
              </div>
            )}
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
