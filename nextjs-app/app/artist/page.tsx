"use client";

import { useState, useRef } from "react";
import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";
import { EDEN_PRESETS, IMAGE_BACKENDS, RESOLUTIONS, VISUAL_STYLES } from "@/lib/data";

// ─── Style Gallery Data ─────────────────────────────────────────────
const ARTIST_STYLES: { name: string; icon: string; keywords: string; description: string }[] = [
  {
    name: "Eden Ultra Realism",
    icon: "🔱",
    keywords: "photorealistic, 8k uhd, shot on ARRI ALEXA 35, natural skin texture, film grain, shallow depth of field, Kodak Vision3 500T, visible pores, natural imperfections, matte skin finish, subsurface scattering",
    description: "Maximum photorealism — the Eden standard",
  },
  {
    name: "Cinema RAW",
    icon: "🎞",
    keywords: "shot on ARRI ALEXA 35, Kodak Vision3 500T film stock, 35mm anamorphic lens, shallow depth of field f/1.4, natural motion blur, film grain texture, raw camera output, ungraded log footage",
    description: "Ungraded cinema straight from the camera",
  },
  {
    name: "Film Noir",
    icon: "🌑",
    keywords: "film noir, dramatic shadows, high contrast black and white, 1940s cinematic, low-key lighting, chiaroscuro, deep shadows, venetian blind light patterns, cigarette smoke atmosphere, classic Hollywood",
    description: "1940s shadow-heavy noir aesthetic",
  },
  {
    name: "Afrofuturism",
    icon: "🌍",
    keywords: "Afrofuturism, cosmic Black excellence, solar punk Africa, futuristic African architecture, melanin-rich skin glowing, galaxy braids, iridescent fabric, ancient future aesthetic, Wakanda-grade worldbuilding",
    description: "Black excellence meets cosmic future",
  },
  {
    name: "Neon Noir",
    icon: "🌆",
    keywords: "neon noir, cyberpunk city, rain-slicked streets, neon reflections, teal and magenta gels, 2am city fog, moody cinematic, urban melancholy, colored light on wet pavement, Tokyo street atmosphere",
    description: "Cyberpunk rain and neon glow",
  },
  {
    name: "Golden Age Hollywood",
    icon: "⭐",
    keywords: "golden age Hollywood, 1940s glamour photography, Hurrell portrait style, soft diffused studio light, satin sheen, finger waves, ivory skin, classic film beauty, Hollywood lighting, platinum blonde era, timeless elegance",
    description: "1940s Hollywood glamour photography",
  },
  {
    name: "Fine Art",
    icon: "🖼",
    keywords: "fine art photography, museum quality, artistic composition, considered negative space, Baroque lighting, chiaroscuro, old masters paint quality, gallery exhibition print, timeless artistic vision",
    description: "Museum-quality artistic photography",
  },
  {
    name: "Dreamlike",
    icon: "🌙",
    keywords: "dreamlike atmosphere, soft bokeh, ethereal light, pastel color palette, floating particles, surreal soft focus, gentle bloom, otherworldly, gossamer, soft haze, romantic reverie, magic hour diffusion",
    description: "Soft ethereal dreamscape atmosphere",
  },
];

export default function ArtistPage() {
  const [prompt, setPrompt] = useState("");
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [styleIntensity, setStyleIntensity] = useState(0.75);
  const [backend, setBackend] = useState(Object.keys(IMAGE_BACKENDS)[0]);
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStyleClick = (style: (typeof ARTIST_STYLES)[0]) => {
    if (activeStyle === style.name) {
      // Deselect — strip the style keywords from prompt
      setActiveStyle(null);
      setPrompt((prev) => prev.replace(style.keywords + ", ", "").replace(", " + style.keywords, "").replace(style.keywords, "").trim());
    } else {
      // Switch style: remove previous style keywords, prepend new ones
      if (activeStyle) {
        const prev = ARTIST_STYLES.find((s) => s.name === activeStyle);
        if (prev) {
          setPrompt((p) => p.replace(prev.keywords + ", ", "").replace(", " + prev.keywords, "").replace(prev.keywords, "").trim());
        }
      }
      setActiveStyle(style.name);
      setPrompt((prev) => {
        const base = prev.trim();
        return base ? `${style.keywords}, ${base}` : style.keywords;
      });
    }
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReferenceImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReferencePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearReference = () => {
    setReferenceImage(null);
    setReferencePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { setStatus("Enter a prompt or select a style."); return; }
    setLoading(true);
    setStatus("Generating...");
    try {
      const body: Record<string, unknown> = {
        prompt,
        backend,
        resolution,
        steps: Math.round(styleIntensity * 40 + 10),
        seed: Math.floor(Math.random() * 999999),
        randomSeed: true,
        enhance: true,
        negative: "",
        preset: "EDEN Ultra Realism",
      };

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.image) {
        setImageUrl(data.image);
        setStatus(`Generated! Seed: ${data.seed ?? "–"}`);
      } else {
        setStatus(`Error: ${data.error || "Generation failed"}`);
      }
    } catch (e: unknown) {
      setStatus(`Error: ${e instanceof Error ? e.message : "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `eden-artist-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen">
      <EdenPageLogo subtitle="Creative Mode · Style Exploration · Artistic Vision" />
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── STYLE GALLERY ─────────────────────────────────────────── */}
        <div className="mb-10">
          <h3
            className="text-xl font-bold text-[#C5B358] mb-2"
            style={{ fontFamily: '"Cinzel", serif' }}
          >
            Style Gallery
          </h3>
          <p className="text-xs text-[#8B7355] mb-5" style={{ fontFamily: '"DM Mono", monospace' }}>
            SELECT A STYLE — KEYWORDS INJECT INTO YOUR PROMPT AUTOMATICALLY
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ARTIST_STYLES.map((style) => {
              const isActive = activeStyle === style.name;
              return (
                <button
                  key={style.name}
                  onClick={() => handleStyleClick(style)}
                  className={`
                    relative p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer
                    ${isActive
                      ? "border-[#C5B358] bg-[rgba(197,179,88,0.08)] shadow-[0_0_16px_rgba(197,179,88,0.25)]"
                      : "border-[rgba(197,179,88,0.15)] bg-[#0a0805] hover:border-[rgba(197,179,88,0.35)] hover:bg-[rgba(197,179,88,0.04)]"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute top-2 right-2 text-[#C5B358] text-xs font-bold" style={{ fontFamily: '"DM Mono", monospace' }}>
                      ACTIVE
                    </span>
                  )}
                  <span className="text-2xl block mb-2">{style.icon}</span>
                  <p
                    className={`text-sm font-bold mb-1 leading-tight ${isActive ? "text-[#F5E6A3]" : "text-[#E8DCC8]"}`}
                    style={{ fontFamily: '"Cinzel", serif' }}
                  >
                    {style.name}
                  </p>
                  <p className="text-xs text-[#8B7355] leading-snug" style={{ fontFamily: '"DM Mono", monospace' }}>
                    {style.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── GENERATION UI ─────────────────────────────────────────── */}
        <h3
          className="text-xl font-bold text-[#C5B358] mb-4"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          Generate
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Controls */}
          <div className="space-y-4">

            {/* Prompt */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                PROMPT
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your artistic vision... (style keywords auto-prepend when you select a style above)"
                rows={5}
                className="w-full resize-none"
              />
            </div>

            {/* Style Intensity */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                STYLE INTENSITY: {styleIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={styleIntensity}
                onChange={(e) => setStyleIntensity(parseFloat(e.target.value))}
                className="w-full accent-[#C5B358]"
              />
              <div className="flex justify-between text-[10px] text-[#8B7355] mt-1" style={{ fontFamily: '"DM Mono", monospace' }}>
                <span>0.1 — Subtle</span>
                <span>0.5 — Balanced</span>
                <span>1.0 — Maximum</span>
              </div>
            </div>

            {/* Reference Image */}
            <div>
              <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                REFERENCE IMAGE (STYLE TRANSFER SOURCE)
              </label>
              {referencePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-[rgba(197,179,88,0.25)] bg-[#0a0805]">
                  <img
                    src={referencePreview}
                    alt="Reference"
                    className="w-full max-h-48 object-contain"
                  />
                  <button
                    onClick={clearReference}
                    className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold bg-[#1a1208] border border-[rgba(197,179,88,0.3)] text-[#C5B358] hover:bg-[rgba(197,179,88,0.1)] transition-all"
                    style={{ fontFamily: '"DM Mono", monospace' }}
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 rounded-lg border border-dashed border-[rgba(197,179,88,0.25)] bg-[#0a0805] flex items-center justify-center cursor-pointer hover:border-[rgba(197,179,88,0.45)] hover:bg-[rgba(197,179,88,0.04)] transition-all"
                >
                  <div className="text-center">
                    <span className="text-2xl block mb-1">🖼</span>
                    <span className="text-xs text-[#8B7355]" style={{ fontFamily: '"DM Mono", monospace' }}>
                      CLICK TO UPLOAD REFERENCE
                    </span>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleReferenceUpload}
                className="hidden"
              />
            </div>

            {/* Backend + Resolution */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                  ENGINE
                </label>
                <select value={backend} onChange={(e) => setBackend(e.target.value)} className="w-full text-sm">
                  {Object.keys(IMAGE_BACKENDS).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={{ fontFamily: '"DM Mono", monospace' }}>
                  RESOLUTION
                </label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full text-sm">
                  {RESOLUTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-lg tracking-wider uppercase transition-all duration-300
                bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302]
                hover:shadow-[0_0_30px_rgba(197,179,88,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {loading ? "GENERATING..." : "CREATE ARTWORK"}
            </button>
          </div>

          {/* RIGHT: Output */}
          <div className="space-y-4">
            <div className="min-h-[512px] rounded-xl border border-[rgba(197,179,88,0.15)] bg-[#0a0805] flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Generated artwork"
                  className="max-w-full max-h-[600px] object-contain"
                />
              ) : (
                <div className="text-center text-[#504830]">
                  <span className="text-6xl block mb-4">🎨</span>
                  <p style={{ fontFamily: '"Cinzel", serif' }}>Your artwork will appear here</p>
                </div>
              )}
            </div>

            {status && (
              <div
                className="p-3 rounded-lg border border-[rgba(197,179,88,0.12)] bg-[#0a0805] text-sm text-[#a09880]"
                style={{ fontFamily: '"DM Mono", monospace' }}
              >
                {status}
              </div>
            )}

            {imageUrl && (
              <button
                onClick={handleDownload}
                className="w-full py-3 rounded-lg font-bold tracking-wider uppercase text-sm transition-all duration-200
                  border border-[rgba(197,179,88,0.35)] text-[#C5B358] bg-transparent
                  hover:bg-[rgba(197,179,88,0.08)] hover:border-[#C5B358]"
                style={{ fontFamily: '"Cinzel", serif' }}
              >
                DOWNLOAD ARTWORK
              </button>
            )}
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
