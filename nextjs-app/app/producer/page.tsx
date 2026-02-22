"use client";

import { useState, useCallback } from "react";
import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";
import { PromptGenerator } from "@/components/PromptGenerator";
import {
  SCENE_CATEGORIES, SUBJECT_TYPES, SKIN_TONES, CAMERAS, LIGHTINGS,
  VISUAL_STYLES, PLATFORM_PRESETS, EDEN_PRESETS, IMAGE_BACKENDS, RESOLUTIONS,
} from "@/lib/data";

type BatchCount = 1 | 4 | 8 | 16;

interface GeneratedImage {
  url: string;
  seed: number;
  index: number;
}

const BATCH_OPTIONS: BatchCount[] = [1, 4, 8, 16];

const STORYBOARD_SUFFIXES = [
  "establishing wide shot, scene begins",
  "medium shot, action develops",
  "close-up, emotional peak",
  "pull back reveal, scene resolves",
];

export default function ProducerPage() {
  const [prompt, setPrompt] = useState("");
  const [preset, setPreset] = useState(Object.keys(EDEN_PRESETS)[0]);
  const [backend, setBackend] = useState(Object.keys(IMAGE_BACKENDS)[0]);
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [steps, setSteps] = useState(8);
  const [seed, setSeed] = useState(42);
  const [randomSeed, setRandomSeed] = useState(true);
  const [enhance, setEnhance] = useState(true);
  const [negative, setNegative] = useState("");
  const [batchCount, setBatchCount] = useState<BatchCount>(4);
  const [storyboardMode, setStoryboardMode] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const buildStoryboardPrompt = (basePrompt: string, index: number): string => {
    return `${basePrompt}, ${STORYBOARD_SUFFIXES[index % STORYBOARD_SUFFIXES.length]}`;
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) { setStatus("Enter a prompt to generate images."); return; }

    const count = storyboardMode ? 4 : batchCount;
    setLoading(true);
    setImages([]);
    setProgress(0);
    setStatus(`Generating ${count} image${count > 1 ? "s" : ""}...`);

    const results: GeneratedImage[] = [];

    for (let i = 0; i < count; i++) {
      const framePrompt = storyboardMode ? buildStoryboardPrompt(prompt, i) : prompt;
      const frameSeed = randomSeed ? Math.floor(Math.random() * 999999) : seed + i;

      try {
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: framePrompt,
            preset,
            backend,
            resolution,
            steps,
            seed: frameSeed,
            randomSeed: false,
            enhance,
            negative,
          }),
        });

        const data = await res.json();
        if (data.image) {
          results.push({ url: data.image, seed: data.seed ?? frameSeed, index: i });
          setImages([...results]);
        }

        setProgress(Math.round(((i + 1) / count) * 100));
        setStatus(
          storyboardMode
            ? `Frame ${i + 1}/${count}: ${STORYBOARD_SUFFIXES[i % STORYBOARD_SUFFIXES.length]}`
            : `Generated ${i + 1} of ${count}...`
        );
      } catch (e: unknown) {
        setStatus(`Frame ${i + 1} failed: ${e instanceof Error ? e.message : "Network error"}`);
      }
    }

    setLoading(false);
    setProgress(100);
    setStatus(
      results.length === count
        ? `${storyboardMode ? "Storyboard" : "Batch"} complete — ${count} image${count > 1 ? "s" : ""} generated.`
        : `Completed with ${count - results.length} failure(s). ${results.length} image${results.length !== 1 ? "s" : ""} ready.`
    );
  }, [prompt, preset, backend, resolution, steps, seed, randomSeed, enhance, negative, batchCount, storyboardMode]);

  const handleDownloadAll = useCallback(async () => {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      try {
        const res = await fetch(img.url);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = storyboardMode
          ? `eden-storyboard-frame-${i + 1}-seed${img.seed}.png`
          : `eden-batch-${i + 1}-seed${img.seed}.png`;
        a.click();
        URL.revokeObjectURL(url);
        await new Promise((r) => setTimeout(r, 300));
      } catch {
        // skip failed downloads silently
      }
    }
  }, [images, storyboardMode]);

  const effectiveBatchCount = storyboardMode ? 4 : batchCount;
  const gridCols = effectiveBatchCount === 1
    ? "grid-cols-1"
    : effectiveBatchCount <= 4
      ? "grid-cols-2"
      : "grid-cols-4";

  return (
    <div className="min-h-screen">
      <EdenPageLogo subtitle="Batch Generation · Storyboards · Commercial Production" />
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
          Batch Generate
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Controls */}
          <div className="space-y-4">
            <div>
              <label
                className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5"
                style={{ fontFamily: '"DM Mono", monospace' }}
              >
                PROMPT
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your scene or campaign concept..."
                rows={4}
                className="w-full resize-none"
              />
            </div>

            {/* BATCH COUNT */}
            <div>
              <label
                className="block text-xs font-bold tracking-wider text-[#C5B358] mb-2"
                style={{ fontFamily: '"DM Mono", monospace' }}
              >
                BATCH COUNT
              </label>
              <div className="flex gap-2">
                {BATCH_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => { if (!storyboardMode) setBatchCount(n); }}
                    disabled={storyboardMode}
                    className={[
                      "flex-1 py-2 rounded-lg text-sm font-bold tracking-wider transition-all duration-200",
                      !storyboardMode && batchCount === n
                        ? "bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302]"
                        : storyboardMode
                          ? "border border-[rgba(197,179,88,0.1)] text-[#504830] cursor-not-allowed"
                          : "border border-[rgba(197,179,88,0.2)] text-[#8B7355] hover:border-[#C5B358] hover:text-[#C5B358]",
                    ].join(" ")}
                    style={{ fontFamily: '"DM Mono", monospace' }}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>

            {/* STORYBOARD MODE */}
            <div
              className={[
                "flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer",
                storyboardMode
                  ? "border-[rgba(197,179,88,0.5)] bg-[rgba(197,179,88,0.06)]"
                  : "border-[rgba(197,179,88,0.15)] bg-[#0a0805] hover:border-[rgba(197,179,88,0.3)]",
              ].join(" ")}
              onClick={() => setStoryboardMode((v) => !v)}
            >
              <div>
                <p
                  className="text-sm font-bold text-[#E8DCC8]"
                  style={{ fontFamily: '"Cinzel", serif' }}
                >
                  Storyboard Mode
                </p>
                <p
                  className="text-xs text-[#8B7355] mt-0.5"
                  style={{ fontFamily: '"DM Mono", monospace' }}
                >
                  Generates 4 sequential frames — establishing, medium, close-up, reveal
                </p>
              </div>
              <div
                className={[
                  "w-12 h-6 rounded-full relative transition-all duration-300",
                  storyboardMode ? "bg-[#C5B358]" : "bg-[#1a1510]",
                ].join(" ")}
              >
                <div
                  className={[
                    "absolute top-1 w-4 h-4 rounded-full bg-[#050302] transition-all duration-300",
                    storyboardMode ? "left-7" : "left-1",
                  ].join(" ")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5"
                  style={{ fontFamily: '"DM Mono", monospace' }}
                >
                  EDEN PRESET
                </label>
                <select
                  value={preset}
                  onChange={(e) => setPreset(e.target.value)}
                  className="w-full text-sm"
                >
                  {Object.keys(EDEN_PRESETS).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5"
                  style={{ fontFamily: '"DM Mono", monospace' }}
                >
                  ENGINE
                </label>
                <select
                  value={backend}
                  onChange={(e) => setBackend(e.target.value)}
                  className="w-full text-sm"
                >
                  {Object.keys(IMAGE_BACKENDS).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5"
                style={{ fontFamily: '"DM Mono", monospace' }}
              >
                RESOLUTION
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full text-sm"
              >
                {RESOLUTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5"
                  style={{ fontFamily: '"DM Mono", monospace' }}
                >
                  STEPS: {steps}
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={steps}
                  onChange={(e) => setSteps(+e.target.value)}
                  className="w-full accent-[#C5B358]"
                />
              </div>
              <div>
                <label
                  className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5"
                  style={{ fontFamily: '"DM Mono", monospace' }}
                >
                  BASE SEED
                </label>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(+e.target.value)}
                  className="w-full text-sm"
                  disabled={randomSeed}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#a09880]">
                <input
                  type="checkbox"
                  checked={randomSeed}
                  onChange={(e) => setRandomSeed(e.target.checked)}
                  className="accent-[#C5B358]"
                />
                Random Seeds
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-[#a09880]">
                <input
                  type="checkbox"
                  checked={enhance}
                  onChange={(e) => setEnhance(e.target.checked)}
                  className="accent-[#C5B358]"
                />
                Enhance Prompt
              </label>
            </div>

            <div>
              <label
                className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5"
                style={{ fontFamily: '"DM Mono", monospace' }}
              >
                NEGATIVE (OPTIONAL)
              </label>
              <textarea
                value={negative}
                onChange={(e) => setNegative(e.target.value)}
                placeholder="Elements to exclude from all frames..."
                rows={2}
                className="w-full resize-none text-sm"
              />
            </div>

            {/* GENERATE BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-lg tracking-wider uppercase transition-all duration-300
                bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302]
                hover:shadow-[0_0_30px_rgba(197,179,88,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {loading
                ? `GENERATING ${progress}%...`
                : storyboardMode
                  ? "GENERATE STORYBOARD"
                  : `GENERATE ${effectiveBatchCount}x`}
            </button>

            {/* PROGRESS BAR */}
            {loading && (
              <div className="w-full h-1 rounded-full bg-[#1a1510] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8B6914] to-[#C5B358] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* STATUS */}
            {status && (
              <div
                className="p-3 rounded-lg border border-[rgba(197,179,88,0.12)] bg-[#0a0805] text-sm text-[#a09880]"
                style={{ fontFamily: '"DM Mono", monospace' }}
              >
                {status}
              </div>
            )}
          </div>

          {/* RIGHT: Output Grid */}
          <div className="space-y-4">
            {images.length > 0 ? (
              <>
                <div className={`grid ${gridCols} gap-3`}>
                  {images.map((img, i) => (
                    <div
                      key={img.index}
                      className="relative rounded-xl overflow-hidden border border-[rgba(197,179,88,0.15)] bg-[#0a0805] aspect-square"
                    >
                      <img
                        src={img.url}
                        alt={`Generated frame ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {storyboardMode && (
                        <div
                          className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] text-[#C5B358] bg-[rgba(5,3,2,0.85)]"
                          style={{ fontFamily: '"DM Mono", monospace' }}
                        >
                          FRAME {i + 1} — {STORYBOARD_SUFFIXES[i % STORYBOARD_SUFFIXES.length].toUpperCase()}
                        </div>
                      )}
                      {!storyboardMode && (
                        <div
                          className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] text-[#C5B358] bg-[rgba(5,3,2,0.75)] rounded"
                          style={{ fontFamily: '"DM Mono", monospace' }}
                        >
                          #{i + 1}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Empty slots while loading */}
                  {loading &&
                    Array.from({ length: effectiveBatchCount - images.length }).map((_, i) => (
                      <div
                        key={`slot-${i}`}
                        className="rounded-xl border border-[rgba(197,179,88,0.08)] bg-[#0a0805] aspect-square flex items-center justify-center"
                      >
                        <div className="text-[#2a2010] text-2xl animate-pulse">
                          {storyboardMode ? `F${images.length + i + 1}` : "..."}
                        </div>
                      </div>
                    ))}
                </div>

                {/* DOWNLOAD ALL */}
                {!loading && images.length > 0 && (
                  <button
                    onClick={handleDownloadAll}
                    className="w-full py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition-all duration-300
                      border border-[#C5B358] text-[#C5B358]
                      hover:bg-[rgba(197,179,88,0.08)] hover:shadow-[0_0_20px_rgba(197,179,88,0.2)]"
                    style={{ fontFamily: '"Cinzel", serif' }}
                  >
                    DOWNLOAD ALL ({images.length} IMAGE{images.length !== 1 ? "S" : ""})
                  </button>
                )}
              </>
            ) : (
              <div className="min-h-[512px] rounded-xl border border-[rgba(197,179,88,0.15)] bg-[#0a0805] flex items-center justify-center">
                {loading ? (
                  <div className="text-center space-y-4 px-8">
                    <div
                      className="text-[#C5B358] text-2xl font-bold"
                      style={{ fontFamily: '"Cinzel", serif' }}
                    >
                      {storyboardMode ? "Building Storyboard..." : `Generating Batch...`}
                    </div>
                    <div
                      className="text-[#8B7355] text-sm"
                      style={{ fontFamily: '"DM Mono", monospace' }}
                    >
                      {status}
                    </div>
                    <div className="w-48 h-1 mx-auto rounded-full bg-[#1a1510] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B6914] to-[#C5B358] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-[#504830] px-8">
                    <span className="text-6xl block mb-4">
                      {storyboardMode ? "🎬" : ""}
                    </span>
                    <p style={{ fontFamily: '"Cinzel", serif' }}>
                      {storyboardMode
                        ? "4-frame storyboard will appear here"
                        : `Your ${effectiveBatchCount} images will appear here`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
