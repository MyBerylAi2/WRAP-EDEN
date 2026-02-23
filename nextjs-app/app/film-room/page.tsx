"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";

// ═══════════════════════════════════════════════════════════════════
// EDEN FILM ROOM — Two Departments, One Page
//
// TOP:    MOVIE MAKER — Scene pipeline editor (Script/Timeline/Preview)
// BOTTOM: PRODUCER PORTAL — Storybook playground with live Artifacts
//         Previewer + Stitching Suite that builds & cleans in motion
//
// Covers: films, novels, documentaries, cartoons, kids, sleep,
//         promos, adult, audiobooks, and AI news (Eden Pulse)
// ═══════════════════════════════════════════════════════════════════

type ContentType =
  | "film" | "novel" | "documentary" | "cartoon" | "kids"
  | "sleep" | "promo" | "adult" | "audiobook" | "news";

interface Scene {
  id: string;
  title: string;
  imagePrompt: string;
  videoPrompt: string;
  narration: string;
  duration: number;
  mood: string;
  imageUrl?: string;
  videoUrl?: string;
  imageLoading?: boolean;
  videoLoading?: boolean;
}

// Producer Portal artifact — each item in the live build feed
interface Artifact {
  id: string;
  sceneIndex: number;
  type: "breakdown" | "image" | "video" | "narration" | "stitch";
  status: "building" | "done" | "failed";
  label: string;
  timestamp: number;
  url?: string;
}

type TabId = "script" | "timeline" | "preview";

const CONTENT_TYPES: { id: ContentType; icon: string; label: string }[] = [
  { id: "film", icon: "\uD83C\uDFAC", label: "FILM" },
  { id: "novel", icon: "\uD83D\uDCD6", label: "NOVEL" },
  { id: "documentary", icon: "\uD83C\uDFA5", label: "DOCUMENTARY" },
  { id: "cartoon", icon: "\uD83C\uDFA8", label: "CARTOON" },
  { id: "kids", icon: "\uD83D\uDC76", label: "KIDS" },
  { id: "sleep", icon: "\uD83D\uDE34", label: "SLEEP" },
  { id: "promo", icon: "\uD83D\uDCF1", label: "PROMO" },
  { id: "adult", icon: "\uD83D\uDD25", label: "ADULT" },
  { id: "audiobook", icon: "\uD83C\uDFA7", label: "AUDIOBOOK" },
  { id: "news", icon: "\uD83D\uDCF0", label: "NEWS" },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "script", label: "SCRIPT" },
  { id: "timeline", label: "TIMELINE" },
  { id: "preview", label: "PREVIEW" },
];

const IMAGE_STYLE: Record<ContentType, string> = {
  film: "cinematic 4K, dramatic lighting, film grain, ARRI ALEXA 35, anamorphic lens",
  novel: "cinematic book illustration, dramatic, literary, rich atmosphere",
  documentary: "documentary photograph, natural lighting, raw, authentic",
  cartoon: "colorful cartoon illustration, cel-shaded, vibrant, Pixar quality",
  kids: "bright colorful children's illustration, friendly, safe, educational",
  sleep: "serene ambient nature, soft dreamy, ethereal, calming pastels",
  promo: "high-energy commercial, vibrant, trending, eye-catching, 4K product shot",
  adult: "artistic intimate photography, moody warm lighting, tasteful, cinematic",
  audiobook: "atmospheric book scene illustration, evocative, literary mood",
  news: "clean modern tech aesthetic, data visualization, broadcast quality, Bloomberg style",
};

const VIDEO_STYLE: Record<ContentType, string> = {
  film: "cinematic camera movement, 4K, film grain, dramatic",
  novel: "literary cinematic, slow camera, atmospheric",
  documentary: "documentary footage, handheld camera, natural",
  cartoon: "animated cartoon style, smooth motion, colorful",
  kids: "gentle animated, educational, bright colors",
  sleep: "slow ambient footage, calming, gentle drift",
  promo: "fast-paced promo, dynamic cuts, energetic",
  adult: "artistic sensual, warm tones, slow intimate camera",
  audiobook: "gentle atmospheric pan, literary mood, subtle motion",
  news: "broadcast camera, clean transitions, tech overlay graphics",
};

const MOOD_COLORS: Record<string, string> = {
  suspense: "#E53E3E", joy: "#F6E05E", calm: "#81E6D9", tension: "#FC8181",
  wonder: "#B794F4", intimate: "#FBB6CE", energy: "#F6AD55", melancholy: "#90CDF4",
  triumph: "#68D391", mystery: "#9F7AEA",
};

export default function FilmRoomPage() {
  // ═══ SHARED STATE ══════════════════════════════════════
  const [projectName, setProjectName] = useState("Untitled Project");
  const [contentType, setContentType] = useState<ContentType>("film");

  // ═══ MOVIE MAKER STATE ═════════════════════════════════
  const [script, setScript] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedScene, setSelectedScene] = useState<number | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("script");
  const [sceneCount, setSceneCount] = useState(6);
  const [status, setStatus] = useState("");
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ═══ PRODUCER PORTAL STATE ═════════════════════════════
  const [portalScript, setPortalScript] = useState("");
  const [portalScenes, setPortalScenes] = useState<Scene[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [stitchingActive, setStitchingActive] = useState(false);
  const [stitchPhase, setStitchPhase] = useState("");
  const [portalSceneCount, setPortalSceneCount] = useState(8);
  const stitchAbort = useRef(false);
  const artifactsEndRef = useRef<HTMLDivElement>(null);

  // ═══ COMPUTED ══════════════════════════════════════════
  const totalDuration = scenes.reduce((s, sc) => s + sc.duration, 0);
  const generatedImages = scenes.filter((s) => s.imageUrl).length;
  const generatedVideos = scenes.filter((s) => s.videoUrl).length;
  const portalImages = portalScenes.filter((s) => s.imageUrl).length;
  const portalVideos = portalScenes.filter((s) => s.videoUrl).length;

  // ═══ STYLES ════════════════════════════════════════════
  const cinzel = { fontFamily: '"Cinzel", serif' };
  const mono = { fontFamily: '"DM Mono", monospace' };
  const cormorant = { fontFamily: '"Cormorant Garamond", Georgia, serif' };
  const goldBtn = "py-3 px-6 rounded-lg font-bold tracking-wider uppercase transition-all duration-300 bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302] hover:shadow-[0_0_30px_rgba(197,179,88,0.4)] disabled:opacity-50 disabled:cursor-not-allowed";
  const outlineBtn = "py-2 px-4 rounded-lg font-bold text-xs tracking-wider uppercase transition-all duration-300 border border-[rgba(197,179,88,0.3)] text-[#C5B358] hover:bg-[rgba(197,179,88,0.08)] disabled:opacity-40 disabled:cursor-not-allowed";
  const cardBg = "rounded-xl border border-[rgba(197,179,88,0.12)] bg-[#0a0805]";

  // ═══════════════════════════════════════════════════════
  // MOVIE MAKER FUNCTIONS
  // ═══════════════════════════════════════════════════════

  const handleBreakdown = useCallback(async () => {
    if (!script.trim()) { setStatus("Paste a script, chapter, or idea first."); return; }
    setBreakdownLoading(true);
    setStatus("Grok is reading your script...");
    try {
      const res = await fetch("/api/script-breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, contentType, sceneCount }),
      });
      const data = await res.json();
      if (data.error) { setStatus(`Breakdown failed: ${data.error}`); setBreakdownLoading(false); return; }
      const newScenes: Scene[] = data.scenes.map(
        (s: { title: string; imagePrompt: string; videoPrompt: string; narration: string; duration: number; mood: string }, i: number) => ({
          id: `scene-${Date.now()}-${i}`, title: s.title, imagePrompt: s.imagePrompt,
          videoPrompt: s.videoPrompt, narration: s.narration, duration: s.duration || 5, mood: s.mood || "wonder",
        }),
      );
      setScenes(newScenes);
      setSelectedScene(null);
      setStatus(`${newScenes.length} scenes ready. Edit prompts or start generating.`);
    } catch (e: unknown) {
      setStatus(`Network error: ${e instanceof Error ? e.message : "Failed"}`);
    }
    setBreakdownLoading(false);
  }, [script, contentType, sceneCount]);

  const generateImage = useCallback(async (index: number, targetScenes?: Scene[], setTarget?: React.Dispatch<React.SetStateAction<Scene[]>>) => {
    const src = targetScenes || scenes;
    const setter = setTarget || setScenes;
    const scene = src[index];
    if (!scene) return;
    setter((prev) => prev.map((s, i) => (i === index ? { ...s, imageLoading: true } : s)));
    try {
      const styledPrompt = `${IMAGE_STYLE[contentType]}, ${scene.imagePrompt}`;
      const res = await fetch("/api/generate-image", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: styledPrompt, enhance: true, randomSeed: true }),
      });
      const data = await res.json();
      if (data.image) {
        setter((prev) => prev.map((s, i) => (i === index ? { ...s, imageUrl: data.image, imageLoading: false } : s)));
        return data.image;
      } else {
        setter((prev) => prev.map((s, i) => (i === index ? { ...s, imageLoading: false } : s)));
      }
    } catch {
      setter((prev) => prev.map((s, i) => (i === index ? { ...s, imageLoading: false } : s)));
    }
    return null;
  }, [scenes, contentType]);

  const generateVideo = useCallback(async (index: number, targetScenes?: Scene[], setTarget?: React.Dispatch<React.SetStateAction<Scene[]>>) => {
    const src = targetScenes || scenes;
    const setter = setTarget || setScenes;
    const scene = src[index];
    if (!scene) return;
    setter((prev) => prev.map((s, i) => (i === index ? { ...s, videoLoading: true } : s)));
    try {
      const styledPrompt = `${VIDEO_STYLE[contentType]}, ${scene.videoPrompt}`;
      const res = await fetch("/api/generate-video", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: styledPrompt, duration: Math.min(scene.duration, 5) }),
      });
      const data = await res.json();
      if (data.video) {
        setter((prev) => prev.map((s, i) => (i === index ? { ...s, videoUrl: data.video, videoLoading: false } : s)));
        return data.video;
      } else {
        setter((prev) => prev.map((s, i) => (i === index ? { ...s, videoLoading: false } : s)));
      }
    } catch {
      setter((prev) => prev.map((s, i) => (i === index ? { ...s, videoLoading: false } : s)));
    }
    return null;
  }, [scenes, contentType]);

  const generateAllImages = useCallback(async () => {
    for (let i = 0; i < scenes.length; i++) { if (!scenes[i].imageUrl) await generateImage(i); }
    setStatus("All images generated.");
  }, [scenes, generateImage]);

  const generateAllVideos = useCallback(async () => {
    for (let i = 0; i < scenes.length; i++) { if (!scenes[i].videoUrl) await generateVideo(i); }
    setStatus("All videos generated.");
  }, [scenes, generateVideo]);

  const moveScene = useCallback((index: number, dir: -1 | 1) => {
    setScenes((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const updateScene = useCallback((index: number, field: keyof Scene, value: string | number) => {
    setScenes((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }, []);

  // Preview playback
  const playableScenes = scenes.filter((s) => s.imageUrl || s.videoUrl);

  const startPreview = useCallback(() => {
    if (playableScenes.length === 0) return;
    setPreviewPlaying(true); setPreviewIndex(0);
  }, [playableScenes]);

  const stopPreview = useCallback(() => {
    setPreviewPlaying(false);
    if (previewTimer.current) clearTimeout(previewTimer.current);
  }, []);

  useEffect(() => {
    if (!previewPlaying) return;
    if (previewIndex >= playableScenes.length) { setPreviewPlaying(false); return; }
    const scene = playableScenes[previewIndex];
    previewTimer.current = setTimeout(() => setPreviewIndex((p) => p + 1), scene.duration * 1000);
    return () => { if (previewTimer.current) clearTimeout(previewTimer.current); };
  }, [previewPlaying, previewIndex, playableScenes]);

  const downloadAll = useCallback(async () => {
    for (const scene of scenes) {
      const url = scene.videoUrl || scene.imageUrl;
      if (!url) continue;
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objUrl;
        a.download = `eden-${projectName.replace(/\s+/g, "-").toLowerCase()}-${scene.title.replace(/\s+/g, "-").toLowerCase()}.${scene.videoUrl ? "mp4" : "png"}`;
        a.click(); URL.revokeObjectURL(objUrl);
        await new Promise((r) => setTimeout(r, 400));
      } catch { /* skip */ }
    }
  }, [scenes, projectName]);

  // ═══════════════════════════════════════════════════════
  // PRODUCER PORTAL — STITCHING SUITE
  // The autonomous pipeline: breakdown → images → videos → stitch
  // Builds and cleans as it goes. Editing in motion.
  // ═══════════════════════════════════════════════════════

  const addArtifact = useCallback((a: Omit<Artifact, "id" | "timestamp">) => {
    const artifact: Artifact = { ...a, id: `art-${Date.now()}-${Math.random()}`, timestamp: Date.now() };
    setArtifacts((prev) => [...prev, artifact]);
    return artifact.id;
  }, []);

  const updateArtifact = useCallback((id: string, updates: Partial<Artifact>) => {
    setArtifacts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }, []);

  // Auto-scroll artifacts feed
  useEffect(() => {
    artifactsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [artifacts]);

  const runStitchingSuite = useCallback(async () => {
    if (!portalScript.trim()) return;
    setStitchingActive(true);
    stitchAbort.current = false;
    setArtifacts([]);
    setPortalScenes([]);

    // PHASE 1: Script Breakdown
    setStitchPhase("BREAKING DOWN SCRIPT");
    const breakdownId = addArtifact({ sceneIndex: -1, type: "breakdown", status: "building", label: "Grok analyzing script..." });

    try {
      const res = await fetch("/api/script-breakdown", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: portalScript, contentType, sceneCount: portalSceneCount }),
      });
      const data = await res.json();
      if (data.error || !data.scenes) {
        updateArtifact(breakdownId, { status: "failed", label: `Breakdown failed: ${data.error || "Unknown"}` });
        setStitchingActive(false); return;
      }

      const newScenes: Scene[] = data.scenes.map(
        (s: { title: string; imagePrompt: string; videoPrompt: string; narration: string; duration: number; mood: string }, i: number) => ({
          id: `portal-${Date.now()}-${i}`, title: s.title, imagePrompt: s.imagePrompt,
          videoPrompt: s.videoPrompt, narration: s.narration, duration: s.duration || 5, mood: s.mood || "wonder",
        }),
      );
      setPortalScenes(newScenes);
      updateArtifact(breakdownId, { status: "done", label: `${newScenes.length} scenes extracted` });

      if (stitchAbort.current) { setStitchingActive(false); return; }

      // PHASE 2: Generate Images — scene by scene
      setStitchPhase("GENERATING VISUALS");
      for (let i = 0; i < newScenes.length; i++) {
        if (stitchAbort.current) break;
        const scene = newScenes[i];
        const imgId = addArtifact({ sceneIndex: i, type: "image", status: "building", label: `Scene ${i + 1}: "${scene.title}" — generating image...` });

        try {
          const styledPrompt = `${IMAGE_STYLE[contentType]}, ${scene.imagePrompt}`;
          const imgRes = await fetch("/api/generate-image", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: styledPrompt, enhance: true, randomSeed: true }),
          });
          const imgData = await imgRes.json();
          if (imgData.image) {
            newScenes[i] = { ...newScenes[i], imageUrl: imgData.image };
            setPortalScenes([...newScenes]);
            updateArtifact(imgId, { status: "done", label: `Scene ${i + 1}: "${scene.title}" — image ready`, url: imgData.image });
          } else {
            updateArtifact(imgId, { status: "failed", label: `Scene ${i + 1}: image failed — ${imgData.error || "retrying later"}` });
          }
        } catch {
          updateArtifact(imgId, { status: "failed", label: `Scene ${i + 1}: image network error` });
        }
      }

      if (stitchAbort.current) { setStitchingActive(false); return; }

      // PHASE 3: Generate Videos
      setStitchPhase("PRODUCING VIDEO CLIPS");
      for (let i = 0; i < newScenes.length; i++) {
        if (stitchAbort.current) break;
        const scene = newScenes[i];
        const vidId = addArtifact({ sceneIndex: i, type: "video", status: "building", label: `Scene ${i + 1}: "${scene.title}" — generating video...` });

        try {
          const styledPrompt = `${VIDEO_STYLE[contentType]}, ${scene.videoPrompt}`;
          const vidRes = await fetch("/api/generate-video", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: styledPrompt, duration: Math.min(scene.duration, 5) }),
          });
          const vidData = await vidRes.json();
          if (vidData.video) {
            newScenes[i] = { ...newScenes[i], videoUrl: vidData.video };
            setPortalScenes([...newScenes]);
            updateArtifact(vidId, { status: "done", label: `Scene ${i + 1}: "${scene.title}" — video ready`, url: vidData.video });
          } else {
            updateArtifact(vidId, { status: "failed", label: `Scene ${i + 1}: video failed — moving on` });
          }
        } catch {
          updateArtifact(vidId, { status: "failed", label: `Scene ${i + 1}: video network error` });
        }
      }

      // PHASE 4: Stitch Complete
      setStitchPhase("STITCHING COMPLETE");
      const doneCount = newScenes.filter((s) => s.imageUrl || s.videoUrl).length;
      addArtifact({ sceneIndex: -1, type: "stitch", status: "done", label: `Production complete: ${doneCount}/${newScenes.length} scenes rendered` });

    } catch (e: unknown) {
      addArtifact({ sceneIndex: -1, type: "stitch", status: "failed", label: `Pipeline error: ${e instanceof Error ? e.message : "Unknown"}` });
    }

    setStitchingActive(false);
  }, [portalScript, contentType, portalSceneCount, addArtifact, updateArtifact]);

  const stopStitching = useCallback(() => {
    stitchAbort.current = true;
    setStitchPhase("STOPPING...");
  }, []);

  const downloadPortal = useCallback(async () => {
    for (const scene of portalScenes) {
      const url = scene.videoUrl || scene.imageUrl;
      if (!url) continue;
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objUrl;
        a.download = `eden-${projectName.replace(/\s+/g, "-").toLowerCase()}-${scene.title.replace(/\s+/g, "-").toLowerCase()}.${scene.videoUrl ? "mp4" : "png"}`;
        a.click(); URL.revokeObjectURL(objUrl);
        await new Promise((r) => setTimeout(r, 400));
      } catch { /* skip */ }
    }
  }, [portalScenes, projectName]);

  // Send portal scenes up to Movie Maker for fine editing
  const sendToMovieMaker = useCallback(() => {
    setScenes([...portalScenes]);
    setActiveTab("timeline");
    setStatus(`${portalScenes.length} scenes imported from Producer Portal.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [portalScenes]);

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <div className="min-h-screen pb-24">
      <EdenPageLogo subtitle="Film Room \u00B7 Movie Maker + Producer Portal" />
      <NavBar />

      {/* ═══ SHARED PROJECT HEADER ═══ */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent text-2xl font-bold text-[#E8DCC8] border-b border-[rgba(197,179,88,0.2)] focus:border-[#C5B358] outline-none pb-1 w-full md:w-auto"
            style={cinzel}
          />
          {(scenes.length > 0 || portalScenes.length > 0) && (
            <span className="text-xs text-[#8B7355] tracking-wider" style={mono}>
              {scenes.length + portalScenes.length} SCENES &middot; {totalDuration}s
            </span>
          )}
        </div>

        {/* CONTENT TYPE PILLS */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.id}
              onClick={() => setContentType(ct.id)}
              className={[
                "px-3 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300",
                contentType === ct.id
                  ? "bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302] shadow-[0_0_16px_rgba(197,179,88,0.3)]"
                  : "border border-[rgba(197,179,88,0.2)] text-[#8B7355] hover:border-[#C5B358] hover:text-[#C5B358]",
              ].join(" ")}
              style={mono}
            >
              {ct.icon} {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */}
      {/* ░░░  DEPARTMENT 1: MOVIE MAKER EDITOR  ░░░░░░░░░░░ */}
      {/* ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */}

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(197,179,88,0.3)] to-transparent" />
          <h2 className="text-sm font-bold tracking-[6px] text-[#C5B358]" style={cinzel}>MOVIE MAKER</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(197,179,88,0.3)] to-transparent" />
        </div>

        {/* TAB BAR */}
        <div className="flex gap-1 border-b border-[rgba(197,179,88,0.12)] mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "px-6 py-3 text-sm font-bold tracking-[3px] transition-all duration-300 border-b-2",
                activeTab === tab.id
                  ? "border-[#C5B358] text-[#C5B358]"
                  : "border-transparent text-[#504830] hover:text-[#8B7355]",
              ].join(" ")}
              style={cinzel}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ TAB: SCRIPT ═══ */}
        {activeTab === "script" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-1.5" style={mono}>SCRIPT / CHAPTER / IDEA</label>
                <textarea
                  value={script} onChange={(e) => setScript(e.target.value)}
                  placeholder={contentType === "news" ? "Paste Eden Pulse nuggets or AI news content..." : contentType === "audiobook" ? "Paste a chapter or story text for audiobook production..." : contentType === "sleep" ? "Describe a calming scene \u2014 gentle rain, ocean waves, forest at night..." : "Paste a chapter, script, scene description, or just an idea..."}
                  rows={10}
                  className="w-full resize-none rounded-xl border border-[rgba(197,179,88,0.15)] bg-[#0a0805] p-4 text-[#E8DCC8] focus:border-[#C5B358] outline-none text-base leading-relaxed"
                  style={cormorant}
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-2" style={mono}>TARGET SCENES: {sceneCount}</label>
                <input type="range" min={2} max={16} value={sceneCount} onChange={(e) => setSceneCount(+e.target.value)} className="w-full accent-[#C5B358]" />
              </div>
              <button onClick={handleBreakdown} disabled={breakdownLoading || !script.trim()} className={`w-full text-lg ${goldBtn}`} style={cinzel}>
                {breakdownLoading ? "GROK IS BREAKING IT DOWN..." : "BREAK INTO SCENES"}
              </button>
              {breakdownLoading && (
                <div className="w-full h-1 rounded-full bg-[#1a1510] overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8B6914] to-[#C5B358] animate-pulse w-full" />
                </div>
              )}
              {status && <div className="p-3 rounded-lg border border-[rgba(197,179,88,0.12)] bg-[#0a0805] text-sm text-[#a09880]" style={mono}>{status}</div>}
            </div>

            {/* Scene Cards */}
            <div className="lg:col-span-5 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              {scenes.length === 0 ? (
                <div className={`${cardBg} min-h-[300px] flex items-center justify-center`}>
                  <div className="text-center text-[#504830] px-6">
                    <span className="text-5xl block mb-3">{CONTENT_TYPES.find((c) => c.id === contentType)?.icon || "\uD83C\uDFAC"}</span>
                    <p style={cinzel} className="text-sm">Scene breakdown appears here</p>
                  </div>
                </div>
              ) : scenes.map((scene, i) => (
                <div key={scene.id} className={`${cardBg} p-4 space-y-2 transition-all duration-300 ${selectedScene === i ? "border-[rgba(197,179,88,0.4)] shadow-[0_0_20px_rgba(197,179,88,0.08)]" : ""}`} onClick={() => setSelectedScene(i)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#8B6914] to-[#C5B358] flex items-center justify-center text-[#050302] text-[10px] font-bold" style={mono}>{i + 1}</span>
                      <input value={scene.title} onChange={(e) => updateScene(i, "title", e.target.value)} className="bg-transparent text-sm font-bold text-[#E8DCC8] border-none outline-none w-full" style={cinzel} />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider" style={{ ...mono, backgroundColor: `${MOOD_COLORS[scene.mood] || "#C5B358"}20`, color: MOOD_COLORS[scene.mood] || "#C5B358" }}>{scene.mood.toUpperCase()}</span>
                  </div>
                  <textarea value={scene.imagePrompt} onChange={(e) => updateScene(i, "imagePrompt", e.target.value)} rows={2} className="w-full resize-none rounded-lg border border-[rgba(197,179,88,0.08)] bg-[rgba(5,3,2,0.5)] p-2 text-xs text-[#a09880] focus:border-[#C5B358] outline-none" style={mono} />
                  <textarea value={scene.narration} onChange={(e) => updateScene(i, "narration", e.target.value)} rows={2} className="w-full resize-none rounded-lg border border-[rgba(197,179,88,0.08)] bg-[rgba(5,3,2,0.5)] p-2 text-xs text-[#E8DCC8] focus:border-[#C5B358] outline-none" style={cormorant} />
                  {scene.imageUrl && <img src={scene.imageUrl} alt={scene.title} className="w-full rounded-lg border border-[rgba(197,179,88,0.1)]" />}
                  {scene.videoUrl && <video src={scene.videoUrl} controls className="w-full rounded-lg border border-[rgba(197,179,88,0.1)]" />}
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); generateImage(i); }} disabled={scene.imageLoading} className={`flex-1 ${outlineBtn}`} style={mono}>{scene.imageLoading ? "..." : scene.imageUrl ? "REGEN IMG" : "GEN IMAGE"}</button>
                    <button onClick={(e) => { e.stopPropagation(); generateVideo(i); }} disabled={scene.videoLoading} className={`flex-1 ${outlineBtn}`} style={mono}>{scene.videoLoading ? "..." : scene.videoUrl ? "REGEN VID" : "GEN VIDEO"}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TAB: TIMELINE ═══ */}
        {activeTab === "timeline" && (
          <div className="space-y-6">
            {scenes.length === 0 ? (
              <div className={`${cardBg} min-h-[200px] flex items-center justify-center`}>
                <p className="text-[#504830] text-sm" style={cinzel}>Break a script into scenes first</p>
              </div>
            ) : (
              <>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={generateAllImages} className={outlineBtn} style={mono}>GENERATE ALL IMAGES</button>
                  <button onClick={generateAllVideos} className={outlineBtn} style={mono}>GENERATE ALL VIDEOS</button>
                  <button onClick={downloadAll} className={outlineBtn} style={mono}>DOWNLOAD ALL</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarColor: "#C5B358 #0a0805" }}>
                  {scenes.map((scene, i) => (
                    <div key={scene.id} onClick={() => setSelectedScene(selectedScene === i ? null : i)} className={["flex-none w-44 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden bg-[#0a0805]", selectedScene === i ? "border-[#C5B358] shadow-[0_0_20px_rgba(197,179,88,0.15)]" : "border-[rgba(197,179,88,0.12)] hover:border-[rgba(197,179,88,0.3)]"].join(" ")}>
                      <div className="h-24 bg-[#050302] flex items-center justify-center overflow-hidden">
                        {scene.imageUrl ? <img src={scene.imageUrl} alt={scene.title} className="w-full h-full object-cover" /> : <span className="text-2xl">{CONTENT_TYPES.find((c) => c.id === contentType)?.icon || "\uD83C\uDFAC"}</span>}
                      </div>
                      <div className="p-2 space-y-1">
                        <p className="text-[10px] font-bold text-[#E8DCC8] truncate" style={cinzel}>{i + 1}. {scene.title}</p>
                        <div className="flex items-center gap-1 text-[10px]" style={mono}>
                          <span className="text-[#8B7355]">{scene.duration}s</span>
                          <span className={`px-1 py-0.5 rounded ${scene.imageUrl ? "text-[#4CAF50]" : "text-[#3a3020]"}`}>IMG</span>
                          <span className={`px-1 py-0.5 rounded ${scene.videoUrl ? "text-[#4CAF50]" : "text-[#3a3020]"}`}>VID</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={(e) => { e.stopPropagation(); moveScene(i, -1); }} disabled={i === 0} className="text-[#8B7355] hover:text-[#C5B358] disabled:text-[#2a2010] text-xs">&larr;</button>
                          <button onClick={(e) => { e.stopPropagation(); moveScene(i, 1); }} disabled={i === scenes.length - 1} className="text-[#8B7355] hover:text-[#C5B358] disabled:text-[#2a2010] text-xs">&rarr;</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedScene !== null && scenes[selectedScene] && (
                  <div className={`${cardBg} p-5 space-y-4`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#C5B358]" style={cinzel}>Scene {selectedScene + 1}: {scenes[selectedScene].title}</h3>
                      <button onClick={() => setSelectedScene(null)} className="text-[#8B7355] hover:text-[#C5B358] text-xs" style={mono}>CLOSE</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div><label className="block text-[10px] font-bold tracking-wider text-[#8B7355] mb-1" style={mono}>IMAGE PROMPT</label><textarea value={scenes[selectedScene].imagePrompt} onChange={(e) => updateScene(selectedScene, "imagePrompt", e.target.value)} rows={3} className="w-full resize-none rounded-lg border border-[rgba(197,179,88,0.08)] bg-[rgba(5,3,2,0.5)] p-2 text-xs text-[#a09880] focus:border-[#C5B358] outline-none" style={mono} /></div>
                        <div><label className="block text-[10px] font-bold tracking-wider text-[#8B7355] mb-1" style={mono}>VIDEO PROMPT</label><textarea value={scenes[selectedScene].videoPrompt} onChange={(e) => updateScene(selectedScene, "videoPrompt", e.target.value)} rows={3} className="w-full resize-none rounded-lg border border-[rgba(197,179,88,0.08)] bg-[rgba(5,3,2,0.5)] p-2 text-xs text-[#a09880] focus:border-[#C5B358] outline-none" style={mono} /></div>
                        <div><label className="block text-[10px] font-bold tracking-wider text-[#8B7355] mb-1" style={mono}>NARRATION</label><textarea value={scenes[selectedScene].narration} onChange={(e) => updateScene(selectedScene, "narration", e.target.value)} rows={3} className="w-full resize-none rounded-lg border border-[rgba(197,179,88,0.08)] bg-[rgba(5,3,2,0.5)] p-2 text-xs text-[#E8DCC8] focus:border-[#C5B358] outline-none" style={cormorant} /></div>
                        <div className="flex gap-2">
                          <button onClick={() => generateImage(selectedScene)} disabled={scenes[selectedScene].imageLoading} className={`flex-1 ${outlineBtn}`} style={mono}>{scenes[selectedScene].imageLoading ? "..." : "GENERATE IMAGE"}</button>
                          <button onClick={() => generateVideo(selectedScene)} disabled={scenes[selectedScene].videoLoading} className={`flex-1 ${outlineBtn}`} style={mono}>{scenes[selectedScene].videoLoading ? "..." : "GENERATE VIDEO"}</button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {scenes[selectedScene].imageUrl ? <img src={scenes[selectedScene].imageUrl} alt={scenes[selectedScene].title} className="w-full rounded-lg border border-[rgba(197,179,88,0.1)]" /> : <div className="aspect-video rounded-lg border border-[rgba(197,179,88,0.08)] bg-[#050302] flex items-center justify-center"><span className="text-[#2a2010] text-sm" style={mono}>NO IMAGE YET</span></div>}
                        {scenes[selectedScene].videoUrl && <video src={scenes[selectedScene].videoUrl} controls className="w-full rounded-lg border border-[rgba(197,179,88,0.1)]" />}
                      </div>
                    </div>
                  </div>
                )}
                {status && <div className="p-3 rounded-lg border border-[rgba(197,179,88,0.12)] bg-[#0a0805] text-sm text-[#a09880]" style={mono}>{status}</div>}
              </>
            )}
          </div>
        )}

        {/* ═══ TAB: PREVIEW ═══ */}
        {activeTab === "preview" && (
          <div className="space-y-4">
            {playableScenes.length === 0 ? (
              <div className={`${cardBg} min-h-[300px] flex items-center justify-center`}>
                <p className="text-[#504830] text-sm" style={cinzel}>Generate scenes to preview your production</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={previewPlaying ? stopPreview : startPreview} className={outlineBtn} style={mono}>{previewPlaying ? "PAUSE" : "PLAY"}</button>
                  <button onClick={() => { stopPreview(); setPreviewIndex(0); }} className={outlineBtn} style={mono}>RESTART</button>
                  <span className="text-xs text-[#8B7355]" style={mono}>{previewPlaying ? `SCENE ${previewIndex + 1} OF ${playableScenes.length}` : `${playableScenes.length} SCENES READY`}</span>
                </div>
                <div className="relative aspect-video rounded-xl border border-[rgba(197,179,88,0.15)] bg-[#050302] overflow-hidden">
                  {previewPlaying && previewIndex < playableScenes.length ? (
                    <>
                      {playableScenes[previewIndex].videoUrl ? (
                        <video key={playableScenes[previewIndex].id} src={playableScenes[previewIndex].videoUrl} autoPlay muted className="w-full h-full object-cover" />
                      ) : playableScenes[previewIndex].imageUrl ? (
                        <img key={playableScenes[previewIndex].id} src={playableScenes[previewIndex].imageUrl} alt={playableScenes[previewIndex].title} className="w-full h-full object-cover" />
                      ) : null}
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[rgba(5,3,2,0.8)]"><p className="text-xs font-bold text-[#C5B358]" style={cinzel}>{playableScenes[previewIndex].title}</p></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[rgba(5,3,2,0.9)] to-transparent"><p className="text-sm text-[#E8DCC8] text-center leading-relaxed" style={cormorant}>{playableScenes[previewIndex].narration}</p></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {playableScenes[0]?.imageUrl ? <img src={playableScenes[0].imageUrl} alt="Preview" className="w-full h-full object-cover opacity-40" /> : <span className="text-[#2a2010] text-4xl">{"\u25B6"}</span>}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {playableScenes.map((scene, i) => (
                    <button key={scene.id} onClick={() => { setPreviewIndex(i); setPreviewPlaying(true); }} className={["flex-none w-20 h-14 rounded-lg overflow-hidden border-2 transition-all", previewPlaying && previewIndex === i ? "border-[#C5B358]" : "border-[rgba(197,179,88,0.1)]"].join(" ")}>
                      {scene.imageUrl ? <img src={scene.imageUrl} alt={scene.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#0a0805] flex items-center justify-center"><span className="text-[10px] text-[#3a3020]" style={mono}>{i + 1}</span></div>}
                    </button>
                  ))}
                </div>
                <button onClick={downloadAll} className={`w-full ${goldBtn}`} style={cinzel}>DOWNLOAD ALL CLIPS</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */}
      {/* ░░░  DEPARTMENT 2: PRODUCER PORTAL  ░░░░░░░░░░░░░░░░ */}
      {/* ░░░  Storybook Playground + Artifacts Previewer  ░░░ */}
      {/* ░░░  Stitching Suite — builds & cleans in motion ░░░ */}
      {/* ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */}

      <div className="max-w-7xl mx-auto px-4 mt-12">
        {/* Department Divider */}
        <div className="relative mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-[#C5B358] to-transparent" />
          <div className="absolute inset-x-0 -top-3 flex justify-center">
            <span className="px-6 bg-[#080503] text-xs font-bold tracking-[8px] text-[#C5B358]" style={cinzel}>PRODUCER PORTAL</span>
          </div>
        </div>
        <p className="text-center text-sm text-[#8B7355] mb-6" style={cormorant}>
          Paste your script. Hit Auto-Produce. Watch the Stitching Suite build your production in real time.
        </p>

        {/* SPLIT PANE: Script Left / Artifacts Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ─── LEFT: SCRIPT PANE ─── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold tracking-wider text-[#C5B358]" style={mono}>SCRIPT</label>
              <span className="text-[10px] text-[#504830]" style={mono}>
                {contentType === "audiobook" ? "AUDIOBOOK \u2192 SHORT FILM" : contentType === "news" ? "EDEN PULSE \u2192 NEWS SEGMENTS" : "SCRIPT \u2192 PRODUCTION"}
              </span>
            </div>
            <textarea
              value={portalScript} onChange={(e) => setPortalScript(e.target.value)}
              placeholder={
                contentType === "audiobook"
                  ? "Paste a chapter or full audiobook text. The Stitching Suite will convert it into a short film with narration, scene images, and video clips..."
                  : contentType === "news"
                    ? "Paste Eden Pulse nuggets. The Stitching Suite will produce broadcast-ready AI news segments..."
                    : contentType === "adult"
                      ? "Paste your script. The Stitching Suite will produce artistic, premium scenes for content distribution..."
                      : "Paste a script, chapter, novel excerpt, or theater script. The Stitching Suite does the rest..."
              }
              rows={16}
              className="w-full resize-none rounded-xl border border-[rgba(197,179,88,0.15)] bg-[#0a0805] p-4 text-[#E8DCC8] focus:border-[#C5B358] outline-none text-base leading-relaxed"
              style={cormorant}
            />

            <div>
              <label className="block text-xs font-bold tracking-wider text-[#C5B358] mb-2" style={mono}>TARGET SCENES: {portalSceneCount}</label>
              <input type="range" min={3} max={16} value={portalSceneCount} onChange={(e) => setPortalSceneCount(+e.target.value)} className="w-full accent-[#C5B358]" />
            </div>

            {/* AUTO-PRODUCE BUTTON */}
            {!stitchingActive ? (
              <button onClick={runStitchingSuite} disabled={!portalScript.trim()} className={`w-full text-lg ${goldBtn}`} style={cinzel}>
                AUTO-PRODUCE
              </button>
            ) : (
              <button onClick={stopStitching} className="w-full py-3 px-6 rounded-lg font-bold text-lg tracking-wider uppercase transition-all duration-300 bg-gradient-to-r from-[#8B1414] via-[#E53E3E] to-[#C53030] text-white hover:shadow-[0_0_30px_rgba(229,62,62,0.4)]" style={cinzel}>
                STOP STITCHING
              </button>
            )}

            {/* Stitching Phase Indicator */}
            {stitchPhase && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-[rgba(197,179,88,0.15)] bg-[#0a0805]">
                {stitchingActive && (
                  <div className="w-3 h-3 rounded-full bg-[#C5B358] animate-pulse flex-none" />
                )}
                <span className="text-xs font-bold tracking-wider text-[#C5B358]" style={mono}>{stitchPhase}</span>
              </div>
            )}

            {/* Portal Scene Storybook — thumbnails of what's been built */}
            {portalScenes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-wider text-[#C5B358]" style={mono}>STORYBOOK ({portalScenes.length} SCENES)</label>
                  <div className="flex gap-2">
                    <button onClick={sendToMovieMaker} className={outlineBtn} style={mono}>SEND TO EDITOR</button>
                    <button onClick={downloadPortal} className={outlineBtn} style={mono}>DOWNLOAD</button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {portalScenes.map((scene, i) => (
                    <div key={scene.id} className="rounded-lg border border-[rgba(197,179,88,0.1)] bg-[#050302] overflow-hidden">
                      <div className="aspect-video flex items-center justify-center overflow-hidden">
                        {scene.imageUrl ? (
                          <img src={scene.imageUrl} alt={scene.title} className="w-full h-full object-cover" />
                        ) : scene.imageLoading ? (
                          <div className="w-6 h-6 border-2 border-[#C5B358] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="text-lg text-[#1a1510]">{i + 1}</span>
                        )}
                      </div>
                      <div className="px-2 py-1">
                        <p className="text-[9px] font-bold text-[#8B7355] truncate" style={mono}>{scene.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 text-[10px] text-[#8B7355]" style={mono}>
                  <span>{portalImages} IMG</span>
                  <span>&middot;</span>
                  <span>{portalVideos} VID</span>
                  <span>&middot;</span>
                  <span>{portalScenes.reduce((a, s) => a + s.duration, 0)}s TOTAL</span>
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT: ARTIFACTS PREVIEWER ─── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold tracking-wider text-[#C5B358]" style={mono}>ARTIFACTS PREVIEWER</label>
              {stitchingActive && (
                <span className="flex items-center gap-1.5 text-[10px] text-[#00E676]" style={mono}>
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                  LIVE
                </span>
              )}
            </div>

            {/* Artifacts Feed — live build log */}
            <div className="rounded-xl border border-[rgba(197,179,88,0.15)] bg-[#050302] min-h-[500px] max-h-[70vh] overflow-y-auto p-4 space-y-2">
              {artifacts.length === 0 ? (
                <div className="h-full min-h-[460px] flex items-center justify-center">
                  <div className="text-center text-[#2a2010] px-6">
                    <div className="text-5xl mb-4">{"\u2692\uFE0F"}</div>
                    <p className="text-sm" style={cinzel}>Stitching Suite</p>
                    <p className="text-xs mt-2" style={mono}>
                      Hit Auto-Produce to watch your production build in real time
                    </p>
                    <div className="mt-6 space-y-1 text-[10px] text-[#1a1510]" style={mono}>
                      <p>1. SCRIPT BREAKDOWN &rarr; Grok extracts scenes</p>
                      <p>2. IMAGE GENERATION &rarr; Each scene visualized</p>
                      <p>3. VIDEO PRODUCTION &rarr; Motion for every scene</p>
                      <p>4. STITCH &amp; CLEAN &rarr; Final production assembled</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {artifacts.map((art) => (
                    <div
                      key={art.id}
                      className={[
                        "flex items-start gap-3 p-3 rounded-lg border transition-all duration-500",
                        art.status === "building"
                          ? "border-[rgba(197,179,88,0.2)] bg-[rgba(197,179,88,0.03)]"
                          : art.status === "done"
                            ? "border-[rgba(76,175,80,0.15)] bg-[rgba(76,175,80,0.03)]"
                            : "border-[rgba(229,62,62,0.15)] bg-[rgba(229,62,62,0.03)]",
                      ].join(" ")}
                    >
                      {/* Status indicator */}
                      <div className="flex-none mt-0.5">
                        {art.status === "building" ? (
                          <div className="w-4 h-4 border-2 border-[#C5B358] border-t-transparent rounded-full animate-spin" />
                        ) : art.status === "done" ? (
                          <div className="w-4 h-4 rounded-full bg-[#4CAF50] flex items-center justify-center text-[8px] text-white font-bold">{"\u2713"}</div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-[#E53E3E] flex items-center justify-center text-[8px] text-white font-bold">!</div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#a09880]" style={mono}>{art.label}</p>
                        {art.url && art.type === "image" && (
                          <img src={art.url} alt="" className="mt-2 w-full max-w-[280px] rounded-lg border border-[rgba(197,179,88,0.1)]" />
                        )}
                        {art.url && art.type === "video" && (
                          <video src={art.url} controls className="mt-2 w-full max-w-[280px] rounded-lg border border-[rgba(197,179,88,0.1)]" />
                        )}
                      </div>

                      {/* Type badge */}
                      <span className="flex-none text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded" style={{
                        ...mono,
                        color: art.type === "breakdown" ? "#B794F4" : art.type === "image" ? "#F6E05E" : art.type === "video" ? "#81E6D9" : art.type === "stitch" ? "#68D391" : "#C5B358",
                        backgroundColor: art.type === "breakdown" ? "rgba(183,148,244,0.1)" : art.type === "image" ? "rgba(246,224,94,0.1)" : art.type === "video" ? "rgba(129,230,217,0.1)" : art.type === "stitch" ? "rgba(104,211,145,0.1)" : "rgba(197,179,88,0.1)",
                      }}>
                        {art.type.toUpperCase()}
                      </span>
                    </div>
                  ))}
                  <div ref={artifactsEndRef} />
                </>
              )}
            </div>

            {/* Portal preview strip — quick visual of completed scenes */}
            {portalScenes.some((s) => s.imageUrl) && (
              <div className="flex gap-1.5 overflow-x-auto pb-2">
                {portalScenes.filter((s) => s.imageUrl).map((scene) => (
                  <div key={scene.id} className="flex-none w-16 h-10 rounded overflow-hidden border border-[rgba(197,179,88,0.1)]">
                    <img src={scene.imageUrl} alt={scene.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ STICKY BOTTOM BAR ═══ */}
      {(scenes.length > 0 || portalScenes.length > 0) && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-[rgba(197,179,88,0.15)] bg-[rgba(8,5,3,0.95)] backdrop-blur-md z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-[#8B7355]" style={mono}>
              {scenes.length > 0 && <span>EDITOR: {scenes.length} scenes / {generatedImages} img / {generatedVideos} vid</span>}
              {portalScenes.length > 0 && <span>PORTAL: {portalScenes.length} scenes / {portalImages} img / {portalVideos} vid</span>}
              {stitchingActive && <span className="text-[#00E676] animate-pulse">STITCHING...</span>}
            </div>
            <div className="flex items-center gap-2">
              {scenes.length > 0 && <button onClick={downloadAll} className={outlineBtn} style={mono}>DOWNLOAD EDITOR</button>}
              {portalScenes.length > 0 && <button onClick={downloadPortal} className={outlineBtn} style={mono}>DOWNLOAD PORTAL</button>}
            </div>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  );
}
