"use client";

import { useState } from "react";
import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";
import { PromptGenerator } from "@/components/PromptGenerator";
import {
  VIDEO_SCENE_CATEGORIES, SUBJECT_TYPES, CAMERA_MOTIONS,
  VISUAL_STYLES, PLATFORM_PRESETS, VIDEO_BACKENDS,
} from "@/lib/data";

export default function VideoStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [backend, setBackend] = useState(Object.keys(VIDEO_BACKENDS)[0]);
  const [duration, setDuration] = useState(5);
  const [fps, setFps] = useState(24);
  const [seed, setSeed] = useState(42);
  const [randomSeed, setRandomSeed] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) { setStatus("⚠️ Enter a prompt."); return; }
    setLoading(true);
    setStatus("🎬 Generating (1-5 min)...");
    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, backend, duration, fps, seed, randomSeed }),
      });
      const data = await res.json();
      if (data.video) {
        setVideoUrl(data.video);
        setStatus(`✅ Video generated! Seed: ${data.seed || seed}`);
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
      <EdenPageLogo subtitle="Text-to-Video · Image-to-Video · Full Creative Control" />
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <PromptGenerator
          mode="video"
          sceneCategories={VIDEO_SCENE_CATEGORIES}
          subjects={SUBJECT_TYPES}
          cameraMotions={CAMERA_MOTIONS}
          visualStyles={VISUAL_STYLES}
          platforms={PLATFORM_PRESETS}
        />

        <h3 className="text-xl font-bold text-[#C5B358] mb-4" style={{ fontFamily: '"Cinzel", serif' }}>
          ⚡ Generate
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                PROMPT
              </label>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your video scene..." rows={4} className="w-full resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                📷 INPUT IMAGE (OPTIONAL — IMAGE-TO-VIDEO)
              </label>
              <input type="file" accept="image/*"
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold
                  file:bg-gradient-to-r file:from-[#8B6914] file:to-[#C5B358] file:text-[#050302] file:cursor-pointer" />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                ⚡ VIDEO ENGINE
              </label>
              <select value={backend} onChange={(e) => setBackend(e.target.value)} className="w-full text-sm">
                {Object.keys(VIDEO_BACKENDS).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                  DURATION: {duration}s
                </label>
                <input type="range" min={2} max={16} value={duration} onChange={(e) => setDuration(+e.target.value)}
                  className="w-full accent-[#C5B358]" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                  FPS: {fps}
                </label>
                <input type="range" min={8} max={30} value={fps} onChange={(e) => setFps(+e.target.value)}
                  className="w-full accent-[#C5B358]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                  SEED
                </label>
                <input type="number" value={seed} onChange={(e) => setSeed(+e.target.value)}
                  className="w-full text-sm" disabled={randomSeed} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#a09880] self-end pb-2.5">
                <input type="checkbox" checked={randomSeed} onChange={(e) => setRandomSeed(e.target.checked)}
                  className="accent-[#C5B358]" /> Random Seed
              </label>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-lg tracking-wider uppercase transition-all duration-300
                bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302]
                hover:shadow-[0_0_30px_rgba(197,179,88,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {loading ? "⏳ GENERATING..." : "🎬 GENERATE VIDEO"}
            </button>
          </div>

          <div className="space-y-4">
            <div className="min-h-[400px] rounded-xl border border-[rgba(197,179,88,0.15)] bg-[#0a0805] flex items-center justify-center overflow-hidden">
              {videoUrl ? (
                <video src={videoUrl} controls className="max-w-full max-h-[500px]" />
              ) : (
                <div className="text-center text-[#504830]">
                  <span className="text-6xl block mb-4">🎬</span>
                  <p style={{ fontFamily: '"Cinzel", serif' }}>Your video will appear here</p>
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
