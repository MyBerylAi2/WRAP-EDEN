import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// EDEN STUDIO — KLING-STYLE NEXT.JS FRONTEND
// Gradio API Backend @ aibruh-eden-diffusion-studio.hf.space
// ═══════════════════════════════════════════════════════════

const GRADIO_API = "https://aibruh-eden-diffusion-studio.hf.space";

// Preset configurations
const VIDEO_PRESETS = {
  HYPERREAL: { cfg: 7.5, steps: 50, label: "Hyperreal" },
  CINEMATIC: { cfg: 6.0, steps: 40, label: "Cinematic" },
  "KLING MAX": { cfg: 8.0, steps: 60, label: "Kling Max" },
  "SKIN PERFECT": { cfg: 7.0, steps: 45, label: "Skin Perfect" },
  PORTRAIT: { cfg: 5.5, steps: 35, label: "Portrait" },
  NATURAL: { cfg: 4.5, steps: 30, label: "Natural" },
};

const AVATAR_PRESETS = [
  { name: "Ashley", tag: "Makeup", tone: "warm" },
  { name: "Isabella", tag: "UGC Ad", tone: "bright" },
  { name: "Lia", tag: "OOTD", tone: "cool" },
  { name: "Raj", tag: "Live stream", tone: "energetic" },
  { name: "Arina", tag: "Talking Head", tone: "neutral" },
  { name: "Ethan", tag: "Working Baby", tone: "cute" },
  { name: "Lucas", tag: "Working Baby", tone: "cute" },
  { name: "Charlie", tag: "Talking Head", tone: "casual" },
  { name: "Matt", tag: "Podcast", tone: "deep" },
];

const VOICES = [
  { id: "bud", name: "Bud", rate: "1x", style: "Neutral" },
  { id: "aria", name: "Aria", rate: "1x", style: "Warm" },
  { id: "nova", name: "Nova", rate: "1x", style: "Confident" },
  { id: "echo", name: "Echo", rate: "0.9x", style: "Deep" },
  { id: "silk", name: "Silk", rate: "1.1x", style: "Breathy" },
];

// ─── Icon Components ───
const Icons = {
  Explore: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>,
  Assets: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Omni: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>,
  Generate: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  Canvas: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>,
  Tools: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Play: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  Upload: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Bind: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Mic: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  LipSync: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 18c4 0 6-2 6-4H6c0 2 2 4 6 4z"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="12" r="10"/></svg>,
  Frame: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  Film: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>,
};

// ─── Sidebar Navigation ───
function Sidebar({ activeIcon, onIconClick, credits }) {
  const icons = [
    { id: "explore", Icon: Icons.Explore, label: "Explore" },
    { id: "assets", Icon: Icons.Assets, label: "Assets" },
    { id: "omni", Icon: Icons.Omni, label: "Omni" },
    { id: "generate", Icon: Icons.Generate, label: "Generate", active: true },
    { id: "canvas", Icon: Icons.Canvas, label: "Canvas" },
    { id: "tools", Icon: Icons.Tools, label: "All Tools" },
  ];

  return (
    <div style={{
      width: 72, minHeight: "100vh", background: "#0a0a0a",
      borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column",
      alignItems: "center", paddingTop: 16, gap: 4, position: "relative", zIndex: 50,
    }}>
      {/* Eden Logo */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: "linear-gradient(135deg, #C5B358, #8B7355)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, fontSize: 18, fontWeight: 800, color: "#0a0a0a",
      }}>E</div>

      {icons.map(({ id, Icon, label }) => (
        <button key={id} onClick={() => onIconClick(id)} style={{
          width: 56, height: 56, border: "none", borderRadius: 12, cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 2, transition: "all 0.2s",
          background: activeIcon === id ? "rgba(197,179,88,0.15)" : "transparent",
          color: activeIcon === id ? "#C5B358" : "#666",
        }}>
          <Icon />
          <span style={{ fontSize: 9, fontWeight: 500 }}>{label}</span>
        </button>
      ))}

      {/* Bottom section */}
      <div style={{ marginTop: "auto", paddingBottom: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{
          background: "linear-gradient(135deg, #C5B358, #8B7355)",
          borderRadius: 20, padding: "6px 12px", fontSize: 11, fontWeight: 700,
          color: "#0a0a0a", display: "flex", alignItems: "center", gap: 4,
        }}>
          ◆ {credits}
        </div>
        <span style={{ fontSize: 9, color: "#555" }}>Standard</span>
      </div>
    </div>
  );
}

// ─── Top Tab Bar ───
function TopTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: "image", label: "Image Generation" },
    { id: "video", label: "Video Generation" },
    { id: "motion", label: "Motion Control" },
    { id: "avatar", label: "Avatar" },
  ];

  return (
    <div style={{
      display: "flex", gap: 0, borderBottom: "1px solid #1a1a1a",
      background: "#0d0d0d", padding: "0 20px",
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onTabChange(t.id)} style={{
          padding: "14px 24px", border: "none", cursor: "pointer", fontSize: 13,
          fontWeight: activeTab === t.id ? 600 : 400, transition: "all 0.2s",
          background: "transparent",
          color: activeTab === t.id ? "#fff" : "#666",
          borderBottom: activeTab === t.id ? "2px solid #C5B358" : "2px solid transparent",
        }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Slider Control ───
function SliderControl({ label, value, onChange, min, max, step = 1, suffix = "" }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{label}</span>
        <span style={{
          fontSize: 12, fontWeight: 600, color: "#C5B358",
          background: "#1a1a1a", padding: "2px 10px", borderRadius: 4,
        }}>{value}{suffix}</span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 3, background: "#1a1a1a" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, borderRadius: 3, background: "linear-gradient(90deg, #1a6b3c, #C5B358)" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", top: -8, left: 0, width: "100%", height: 20, opacity: 0, cursor: "pointer" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 10, color: "#444" }}>{min}</span>
        <span style={{ fontSize: 10, color: "#444" }}>{max}</span>
      </div>
    </div>
  );
}

// ─── Toggle Switch ───
function Toggle({ checked, onChange, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => onChange(!checked)}>
      <div style={{
        width: 36, height: 20, borderRadius: 10, transition: "all 0.2s",
        background: checked ? "linear-gradient(135deg, #1a6b3c, #2d9a5c)" : "#333",
        display: "flex", alignItems: "center", padding: 2,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          transition: "transform 0.2s",
          transform: checked ? "translateX(16px)" : "translateX(0)",
        }} />
      </div>
      <span style={{ fontSize: 12, color: checked ? "#2d9a5c" : "#666", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ─── Drop Zone ───
function DropZone({ onFile, label, accept, preview, height = 180 }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);

  const handle = useCallback(e => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (f) onFile(f);
  }, [onFile]);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handle}
      onClick={() => ref.current?.click()}
      style={{
        height, borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
        border: drag ? "2px solid #C5B358" : "2px dashed #2a2a2a",
        background: drag ? "rgba(197,179,88,0.05)" : "#0d0d0d",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        overflow: "hidden", position: "relative",
      }}
    >
      {preview ? (
        <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <>
          <Icons.Upload />
          <span style={{ fontSize: 12, color: "#666" }}>{label || "Click / Drop / Paste"}</span>
          <span style={{ fontSize: 10, color: "#444" }}>Select from History</span>
        </>
      )}
      <input ref={ref} type="file" accept={accept} onChange={handle} style={{ display: "none" }} />
    </div>
  );
}

// ─── Bind Elements Modal ───
function BindModal({ open, onClose, subjects, onSelect, onCreateNew }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#151515", border: "1px solid #2a2a2a", borderRadius: 16,
        padding: 24, width: 360, maxHeight: "70vh",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
            <Icons.Bind /> Bind elements to enhance consistency
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}><Icons.X /></button>
        </div>
        <input placeholder="search-subject-name" style={{
          width: "100%", padding: "10px 14px", background: "#0d0d0d", border: "1px solid #2a2a2a",
          borderRadius: 8, color: "#fff", fontSize: 13, marginBottom: 16, boxSizing: "border-box",
        }} />
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div onClick={onCreateNew} style={{
            width: 80, height: 100, borderRadius: 12, border: "2px dashed #2a2a2a",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 4, cursor: "pointer", transition: "all 0.2s",
          }}>
            <span style={{ fontSize: 24, color: "#666" }}>+</span>
            <span style={{ fontSize: 10, color: "#666" }}>Create...</span>
          </div>
          {subjects.map((s, i) => (
            <div key={i} onClick={() => onSelect(s)} style={{
              width: 80, height: 100, borderRadius: 12, overflow: "hidden",
              border: s.selected ? "2px solid #2d9a5c" : "2px solid #2a2a2a",
              cursor: "pointer", position: "relative", transition: "all 0.2s",
            }}>
              <div style={{
                width: "100%", height: 70, background: `linear-gradient(135deg, ${s.color || '#333'}, #1a1a1a)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 28 }}>👤</span>
              </div>
              <div style={{ padding: "4px 6px", background: "#0d0d0d" }}>
                <span style={{ fontSize: 9, color: "#aaa" }}>{s.name}</span>
              </div>
              {s.selected && (
                <div style={{
                  position: "absolute", top: 4, right: 4, width: 18, height: 18,
                  borderRadius: "50%", background: "#2d9a5c", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Icons.Check />
                </div>
              )}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#C5B358", marginTop: 16, padding: "10px 14px", background: "rgba(197,179,88,0.08)", borderRadius: 8 }}>
          After uploading the reference image, bind the element to enhance consistency.
        </p>
      </div>
    </div>
  );
}

// ─── Video Generation Panel ───
function VideoPanel({ onGenerate, generating }) {
  const [prompt, setPrompt] = useState("Realistic cinematic style, a 15-second single continuous take with no cuts. A tall, slim Black professional woman walks out of an elevator as the doors close naturally behind her. The camera strictly follows her movement throughout.");
  const [preset, setPreset] = useState("CINEMATIC");
  const [cfg, setCfg] = useState(7.5);
  const [steps, setSteps] = useState(40);
  const [frames, setFrames] = useState(97);
  const [fps, setFps] = useState(24);
  const [multiShot, setMultiShot] = useState(true);
  const [resolution, setResolution] = useState("1080p");
  const [duration, setDuration] = useState("15s");
  const [outputs, setOutputs] = useState(2);
  const [startFrame, setStartFrame] = useState(null);
  const [startPreview, setStartPreview] = useState(null);
  const [endFrame, setEndFrame] = useState(null);
  const [showBind, setShowBind] = useState(false);
  const [subjects, setSubjects] = useState([
    { name: "Black s...", selected: true, color: "#4a3728" },
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleStartFrame = (f) => {
    setStartFrame(f);
    setStartPreview(URL.createObjectURL(f));
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Left Panel - Controls */}
      <div style={{
        width: 440, minWidth: 440, borderRight: "1px solid #1a1a1a",
        padding: 20, overflowY: "auto", background: "#0a0a0a",
      }}>
        {/* Version Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            background: "linear-gradient(135deg, #1a6b3c, #0d4025)",
            borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#2d9a5c" }}>3.0</span>
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>VIDEO 3.0</span>
            <span style={{
              marginLeft: 8, fontSize: 10, padding: "2px 8px", borderRadius: 4,
              background: "#2d9a5c", color: "#fff", fontWeight: 700,
            }}>NEW</span>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Enhanced Native Audio, Improved Element...</div>
          </div>
        </div>

        {/* Start / End Frames */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <DropZone onFile={handleStartFrame} preview={startPreview} label="Start Frame" accept="image/*" height={140} />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "#444", fontSize: 18 }}>⇄</span>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Icons.Upload />
            <span style={{ fontSize: 11, color: "#555", marginTop: 6 }}>Add an end frame (Optional)</span>
            <button style={{
              marginTop: 8, padding: "4px 12px", borderRadius: 6, border: "1px solid #2a2a2a",
              background: "#151515", color: "#888", fontSize: 11, cursor: "pointer",
            }}>History</button>
          </div>
        </div>

        {/* Element Binding */}
        <button onClick={() => setShowBind(true)} style={{
          width: "100%", padding: "10px 14px", borderRadius: 8, cursor: "pointer",
          border: "1px solid #2a2a2a", background: "#0d0d0d", color: "#aaa",
          display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 12,
        }}>
          <Icons.Bind /> Bind elements to enhance consistency
          <span style={{ marginLeft: "auto", color: subjects.filter(s => s.selected).length > 0 ? "#2d9a5c" : "#444" }}>
            {subjects.filter(s => s.selected).length > 0 ? `${subjects.filter(s => s.selected).length} bound` : ""}
          </span>
        </button>

        {/* Prompt */}
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={8}
          placeholder="Describe your video scene..."
          style={{
            width: "100%", padding: 14, borderRadius: 10, border: "1px solid #2a2a2a",
            background: "#0d0d0d", color: "#e0e0e0", fontSize: 13, lineHeight: 1.6,
            resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
          }} />

        {/* Multi-Shot Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
          <Toggle checked={multiShot} onChange={setMultiShot} label="Multi-Shot" />
          <button style={{
            padding: "6px 14px", borderRadius: 6, border: "1px solid #2a2a2a",
            background: "#0d0d0d", color: "#888", fontSize: 11, cursor: "pointer",
          }}>
            Custom Multi-Shot →
          </button>
        </div>

        {/* Advanced Controls */}
        <button onClick={() => setShowAdvanced(!showAdvanced)} style={{
          width: "100%", padding: "10px 0", background: "transparent", border: "none",
          color: "#888", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          marginBottom: showAdvanced ? 12 : 0,
        }}>
          <span style={{ transform: showAdvanced ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <Icons.ChevronDown />
          </span>
          Advanced Controls
        </button>

        {showAdvanced && (
          <div style={{ padding: "0 4px" }}>
            {/* Presets */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {Object.entries(VIDEO_PRESETS).map(([key, val]) => (
                <button key={key} onClick={() => {
                  setPreset(key); setCfg(val.cfg); setSteps(val.steps);
                }} style={{
                  padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s", border: "none",
                  background: preset === key ? "linear-gradient(135deg, #C5B358, #8B7355)" : "#1a1a1a",
                  color: preset === key ? "#0a0a0a" : "#888",
                }}>
                  {val.label}
                </button>
              ))}
            </div>
            <SliderControl label="CFG Scale" value={cfg} onChange={setCfg} min={1} max={20} step={0.5} />
            <SliderControl label="Steps" value={steps} onChange={setSteps} min={10} max={80} />
            <SliderControl label="Frames" value={frames} onChange={setFrames} min={9} max={257} step={8} />
            <SliderControl label="FPS" value={fps} onChange={setFps} min={12} max={60} />
          </div>
        )}

        {/* Bottom Controls */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginTop: 20,
          padding: "12px 0", borderTop: "1px solid #1a1a1a",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
            borderRadius: 6, border: "1px solid #2a2a2a", background: "#0d0d0d",
          }}>
            <span style={{ fontSize: 11, color: "#888" }}>⊙ {resolution} · {duration} · {outputs}</span>
            <Icons.ChevronDown />
          </div>
          <Toggle checked={true} onChange={() => {}} label="Native Audio" />
        </div>

        {/* Generate Button */}
        <button onClick={() => onGenerate({ prompt, cfg, steps, frames, fps, preset })}
          disabled={generating}
          style={{
            width: "100%", padding: "16px 0", borderRadius: 10, border: "none",
            cursor: generating ? "wait" : "pointer", fontSize: 14, fontWeight: 700,
            marginTop: 12, transition: "all 0.3s",
            background: generating
              ? "linear-gradient(135deg, #333, #222)"
              : "linear-gradient(135deg, #1a6b3c, #2d9a5c)",
            color: "#fff",
            boxShadow: generating ? "none" : "0 4px 20px rgba(45,154,92,0.3)",
          }}>
          {generating ? "⏳ Generating..." : `◆ 450  Generate`}
        </button>
      </div>

      {/* Bind Modal */}
      <BindModal
        open={showBind}
        onClose={() => setShowBind(false)}
        subjects={subjects}
        onSelect={s => {
          setSubjects(subjects.map(sub => sub.name === s.name ? { ...sub, selected: !sub.selected } : sub));
        }}
        onCreateNew={() => {}}
      />
    </div>
  );
}

// ─── Avatar Builder Panel ───
function AvatarPanel() {
  const [avatarImage, setAvatarImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [speechText, setSpeechText] = useState("");
  const [avatarPrompt, setAvatarPrompt] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [quality, setQuality] = useState("standard");
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeLibTab, setActiveLibTab] = useState("presets");

  const handleAvatarFile = (f) => {
    setAvatarImage(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Left - Build Controls */}
      <div style={{
        width: 420, minWidth: 420, borderRight: "1px solid #1a1a1a",
        padding: 20, overflowY: "auto", background: "#0a0a0a",
      }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <button style={{
            padding: "10px 20px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600,
            cursor: "pointer", background: "#1a1a1a", color: "#fff",
          }}>Build Avatar</button>
          <button style={{
            padding: "10px 20px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 500,
            cursor: "pointer", background: "transparent", color: "#666",
          }}>Lip Sync</button>
        </div>

        {/* Face Upload Section */}
        <div style={{
          border: "1px solid #C5B358", borderRadius: 12, padding: 16, marginBottom: 20,
          background: "rgba(197,179,88,0.03)",
        }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 8, fontWeight: 500 }}>
            Add Facial Image of a Person
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10, overflow: "hidden",
              background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 24 }}>👤</span>
              )}
            </div>
            <span style={{ fontSize: 12, color: "#aaa" }}>Build Your Avatar with the Following Steps</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={() => setShowLibrary(true)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: "none", fontSize: 11,
              fontWeight: 600, cursor: "pointer",
              background: "linear-gradient(135deg, #1a6b3c, #0d4025)", color: "#fff",
            }}>🎭 Avatar Library</button>
            <button style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #2a2a2a",
              fontSize: 11, fontWeight: 600, cursor: "pointer",
              background: "#0d0d0d", color: "#aaa",
            }}>✨ AI Image</button>
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#C5B358", fontWeight: 600 }}>1. Avatar Input</span>
          </div>
          <DropZone onFile={handleAvatarFile} preview={avatarPreview} label="Click / Drop / Paste" accept="image/*" height={120} />
        </div>

        {/* Speech Section */}
        <div style={{
          border: "1px solid #2a2a2a", borderRadius: 12, padding: 16, marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Speech</span>
            <button style={{
              display: "flex", alignItems: "center", gap: 4, padding: "6px 12px",
              borderRadius: 6, border: "1px solid #2a2a2a", background: "#0d0d0d",
              color: "#888", fontSize: 11, cursor: "pointer",
            }}>
              <Icons.Upload /> Upload Audio
            </button>
          </div>
          <textarea value={speechText} onChange={e => setSpeechText(e.target.value)}
            placeholder="Please input the text you'd like the character to say."
            rows={3} style={{
              width: "100%", padding: 12, borderRadius: 8, border: "1px solid #2a2a2a",
              background: "#0d0d0d", color: "#e0e0e0", fontSize: 13, resize: "vertical",
              fontFamily: "inherit", marginBottom: 12, boxSizing: "border-box",
            }} />
          <span style={{ fontSize: 12, color: "#C5B358", fontWeight: 600 }}>2. Speech Input</span>
          <div style={{ fontSize: 11, color: "#666", margin: "6px 0 10px" }}>
            ▸ Sample different voices to learn the accurate speech duration
          </div>
          {/* Voice selector */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
            borderRadius: 8, border: "1px solid #2a2a2a", background: "#0d0d0d",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, #C5B358, #8B7355)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
            }}>🎙</div>
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{selectedVoice.name}</span>
            <span style={{ fontSize: 10, color: "#666", padding: "2px 8px", background: "#1a1a1a", borderRadius: 4 }}>
              Speech Rate{selectedVoice.rate}
            </span>
            <span style={{ fontSize: 10, color: "#666", padding: "2px 8px", background: "#1a1a1a", borderRadius: 4 }}>
              {selectedVoice.style}
            </span>
            <span style={{ marginLeft: "auto", color: "#444", cursor: "pointer" }}>→</span>
          </div>
        </div>

        {/* Avatar Prompt */}
        <div style={{
          border: "1px solid #2a2a2a", borderRadius: 12, padding: 16, marginBottom: 20,
        }}>
          <span style={{ fontSize: 11, color: "#888" }}>Avatar Prompt (Optional)</span>
          <textarea value={avatarPrompt} onChange={e => setAvatarPrompt(e.target.value)}
            placeholder="Enter the Avatar's actions, emotions, etc"
            rows={2} style={{
              width: "100%", padding: 12, borderRadius: 8, border: "1px solid #2a2a2a",
              background: "#0d0d0d", color: "#e0e0e0", fontSize: 13, resize: "vertical",
              fontFamily: "inherit", marginTop: 8, boxSizing: "border-box",
            }} />
          <span style={{ fontSize: 12, color: "#C5B358", fontWeight: 600, marginTop: 6, display: "block" }}>
            3. Avatar Prompt Input
          </span>
        </div>

        {/* Quality + Generate */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <select value={quality} onChange={e => setQuality(e.target.value)}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #2a2a2a",
              background: "#0d0d0d", color: "#fff", fontSize: 12,
            }}>
            <option value="standard">Standard (720P + 24FPS)</option>
            <option value="professional">Professional (1080P + 48FPS) VIP</option>
          </select>
          <select style={{
            padding: "10px 14px", borderRadius: 8, border: "1px solid #2a2a2a",
            background: "#0d0d0d", color: "#fff", fontSize: 12,
          }}>
            <option>1 Output</option>
            <option>2 VIP</option>
          </select>
        </div>

        <button style={{
          width: "100%", padding: "14px 0", borderRadius: 10, border: "none",
          background: "linear-gradient(135deg, #1a6b3c, #2d9a5c)", color: "#fff",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 20px rgba(45,154,92,0.3)",
        }}>Generate</button>
      </div>

      {/* Right - Avatar Library (when open) or Preview */}
      <div style={{ flex: 1, padding: 20, overflowY: "auto", background: "#111" }}>
        {showLibrary ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: 0 }}>Avatar Library</h3>
              <button onClick={() => setShowLibrary(false)} style={{
                background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 18,
              }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              {["Presets", "My Avatars"].map(tab => (
                <button key={tab} onClick={() => setActiveLibTab(tab.toLowerCase().replace(" ", ""))}
                  style={{
                    padding: "8px 16px", borderRadius: 6, border: "none", fontSize: 12,
                    fontWeight: activeLibTab === tab.toLowerCase().replace(" ", "") ? 600 : 400,
                    cursor: "pointer",
                    background: activeLibTab === tab.toLowerCase().replace(" ", "") ? "#1a1a1a" : "transparent",
                    color: activeLibTab === tab.toLowerCase().replace(" ", "") ? "#fff" : "#666",
                  }}>{tab}</button>
              ))}
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140, 1fr))",
              gap: 12,
            }}>
              {AVATAR_PRESETS.map((av, i) => (
                <div key={i} onClick={() => { setShowLibrary(false); }}
                  style={{
                    borderRadius: 12, overflow: "hidden", cursor: "pointer",
                    border: "1px solid #2a2a2a", transition: "all 0.2s",
                    background: "#0d0d0d",
                  }}>
                  <div style={{
                    height: 160, background: `linear-gradient(${135 + i * 20}deg, hsl(${i * 40}, 30%, 25%), hsl(${i * 40 + 60}, 20%, 15%))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 48, opacity: 0.5 }}>👤</span>
                  </div>
                  <div style={{ padding: "8px 10px", display: "flex", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>{av.name}</span>
                    <span style={{
                      fontSize: 10, color: "#888", padding: "1px 6px",
                      background: "#1a1a1a", borderRadius: 4,
                    }}>{av.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{
            height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", color: "#333",
          }}>
            <span style={{ fontSize: 48, marginBottom: 16 }}>👤</span>
            <span style={{ fontSize: 14, color: "#444" }}>Upload an avatar image to preview</span>
            <span style={{ fontSize: 11, color: "#333", marginTop: 4 }}>Or select from the Avatar Library</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Asset Sidebar (Right) ───
function AssetSidebar({ assets, activeFilter, onFilterChange }) {
  const filters = ["All", "Images", "Videos", "Audio", "Favorites"];

  return (
    <div style={{
      width: 320, minWidth: 320, borderLeft: "1px solid #1a1a1a",
      background: "#0a0a0a", display: "flex", flexDirection: "column",
    }}>
      {/* Filter Bar */}
      <div style={{
        display: "flex", gap: 0, padding: "0 12px", borderBottom: "1px solid #1a1a1a",
      }}>
        {filters.map(f => (
          <button key={f} onClick={() => onFilterChange(f)} style={{
            padding: "12px 12px", border: "none", background: "transparent",
            cursor: "pointer", fontSize: 12, transition: "all 0.2s",
            color: activeFilter === f ? "#fff" : "#555",
            borderBottom: activeFilter === f ? "2px solid #C5B358" : "2px solid transparent",
          }}>{f}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, padding: "0 8px" }}>
          <button style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>⊞</button>
          <button style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>☰</button>
          <span style={{ fontSize: 11, color: "#555", marginLeft: 4 }}>Assets</span>
        </div>
      </div>

      {/* Asset List */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {assets.length === 0 ? (
          <div style={{
            height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 32, opacity: 0.3 }}>📁</span>
            <span style={{ fontSize: 12, color: "#444" }}>All Generation Assets and Previews Area</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {assets.map((a, i) => (
              <div key={i} style={{
                borderRadius: 10, overflow: "hidden", border: "1px solid #1a1a1a",
                cursor: "pointer", transition: "all 0.2s",
              }}>
                <div style={{
                  height: 120,
                  background: `linear-gradient(135deg, hsl(${i * 60}, 30%, 20%), #0a0a0a)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icons.Play />
                </div>
                <div style={{ padding: "8px 10px", background: "#0d0d0d" }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {a.tags?.map((t, j) => (
                      <span key={j} style={{
                        fontSize: 9, padding: "2px 6px", borderRadius: 4,
                        background: "#1a1a1a", color: "#888",
                      }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
                    <button style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 12 }}>
                      <Icons.LipSync /> Lip Sync
                    </button>
                    <button style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 12 }}>
                      <Icons.Frame /> Extract Frame
                    </button>
                    <span style={{ marginLeft: "auto" }}>
                      <Icons.Star />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Video Preview Area ───
function VideoPreview({ videoUrl, prompt, metadata }) {
  return (
    <div style={{ flex: 1, padding: 20, overflowY: "auto", background: "#111" }}>
      {/* Metadata bar */}
      {metadata && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 12, color: "#888" }}><Icons.Film /> Video</span>
          {metadata.tags?.map((t, i) => (
            <span key={i} style={{
              fontSize: 10, padding: "3px 10px", borderRadius: 6,
              background: "#1a1a1a", color: "#aaa", fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>
      )}

      {/* Prompt display */}
      {prompt && (
        <div style={{
          fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 16,
          padding: 12, background: "#0d0d0d", borderRadius: 8,
          maxHeight: 60, overflow: "hidden",
        }}>
          {prompt}
        </div>
      )}

      {/* Video player */}
      <div style={{
        width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden",
        background: "#000", position: "relative", marginBottom: 16,
      }}>
        {videoUrl ? (
          <video src={videoUrl} controls style={{ width: "100%", height: "100%" }} />
        ) : (
          <div style={{
            width: "100%", height: "100%", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12,
            background: "linear-gradient(135deg, #0a0a0a, #151515)",
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "rgba(197,179,88,0.1)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <Icons.Play />
            </div>
            <span style={{ fontSize: 12, color: "#444" }}>Generated video will appear here</span>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16, padding: "8px 0",
      }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
          borderRadius: 8, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #1a6b3c, #0d4025)", color: "#fff",
          fontSize: 12, fontWeight: 600,
        }}>
          <Icons.Omni /> Create in Omni
        </button>
        <button style={{
          display: "flex", alignItems: "center", gap: 4, padding: "8px 14px",
          borderRadius: 8, border: "1px solid #2a2a2a", background: "#0d0d0d",
          color: "#888", fontSize: 12, cursor: "pointer",
        }}>
          <Icons.LipSync /> Lip Sync
        </button>
        <button style={{
          display: "flex", alignItems: "center", gap: 4, padding: "8px 14px",
          borderRadius: 8, border: "1px solid #2a2a2a", background: "#0d0d0d",
          color: "#888", fontSize: 12, cursor: "pointer",
        }}>
          <Icons.Frame /> Extract Frame
        </button>
      </div>
    </div>
  );
}

// ─── Image Generation Panel ───
function ImagePanel() {
  const [prompt, setPrompt] = useState("");
  const [negPrompt, setNegPrompt] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [cfg, setCfg] = useState(7.0);
  const [steps, setSteps] = useState(30);
  const [refImage, setRefImage] = useState(null);
  const [refPreview, setRefPreview] = useState(null);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{
        width: 440, minWidth: 440, borderRight: "1px solid #1a1a1a",
        padding: 20, overflowY: "auto", background: "#0a0a0a",
      }}>
        <div style={{ fontSize: 11, color: "#C5B358", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
          ◈ GLM-4 POWERED KEYFRAME STUDIO
        </div>

        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4}
          placeholder="Beautiful African American goddess walking on beach, two-piece swimsuit, golden hour..."
          style={{
            width: "100%", padding: 14, borderRadius: 10, border: "1px solid #2a2a2a",
            background: "#0d0d0d", color: "#e0e0e0", fontSize: 13, lineHeight: 1.6,
            resize: "vertical", fontFamily: "inherit", marginBottom: 16, boxSizing: "border-box",
          }} />

        {/* Reference Image */}
        <div style={{
          border: "1px solid #2a2a2a", borderRadius: 10, padding: 14, marginBottom: 16,
        }}>
          <span style={{ fontSize: 11, color: "#888" }}>📎 Reference Image (Character Consistency)</span>
          <DropZone
            onFile={f => { setRefImage(f); setRefPreview(URL.createObjectURL(f)); }}
            preview={refPreview}
            label="Upload reference for consistency"
            accept="image/*"
            height={100}
          />
        </div>

        <textarea value={negPrompt} onChange={e => setNegPrompt(e.target.value)} rows={2}
          placeholder="Negative prompt: low quality, blurry, deformed..."
          style={{
            width: "100%", padding: 12, borderRadius: 8, border: "1px solid #2a2a2a",
            background: "#0d0d0d", color: "#e0e0e0", fontSize: 12, resize: "vertical",
            fontFamily: "inherit", marginBottom: 16, boxSizing: "border-box",
          }} />

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <SliderControl label="Width" value={width} onChange={setWidth} min={512} max={2048} step={64} suffix="px" />
          </div>
          <div style={{ flex: 1 }}>
            <SliderControl label="Height" value={height} onChange={setHeight} min={512} max={2048} step={64} suffix="px" />
          </div>
        </div>
        <SliderControl label="CFG Scale" value={cfg} onChange={setCfg} min={1} max={15} step={0.5} />
        <SliderControl label="Steps" value={steps} onChange={setSteps} min={10} max={60} />

        <button style={{
          width: "100%", padding: "16px 0", borderRadius: 10, border: "none",
          background: "linear-gradient(135deg, #C5B358, #8B7355)", color: "#0a0a0a",
          fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8,
          boxShadow: "0 4px 20px rgba(197,179,88,0.3)",
        }}>🔱 GENERATE IMAGE</button>
      </div>

      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        background: "#111",
      }}>
        <div style={{ textAlign: "center", color: "#333" }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>🖼</span>
          <span style={{ fontSize: 14, color: "#444" }}>Generated images will appear here</span>
        </div>
      </div>
    </div>
  );
}

// ─── Motion Control Panel ───
function MotionPanel() {
  return (
    <div style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      background: "#111",
    }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20, margin: "0 auto 20px",
          background: "linear-gradient(135deg, rgba(197,179,88,0.1), rgba(45,154,92,0.1))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36,
        }}>🎯</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Motion Control</h3>
        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
          Camera trajectories, subject tracking, and motion paths.
          Coming soon with LTX-Video motion vectors.
        </p>
        <div style={{
          display: "flex", gap: 8, justifyContent: "center", marginTop: 20,
        }}>
          {["Pan", "Zoom", "Orbit", "Track"].map(m => (
            <span key={m} style={{
              padding: "6px 14px", borderRadius: 6, background: "#1a1a1a",
              color: "#555", fontSize: 11, fontWeight: 500,
            }}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function EdenStudio() {
  const [activeTab, setActiveTab] = useState("video");
  const [activeIcon, setActiveIcon] = useState("generate");
  const [credits, setCredits] = useState("7.5k");
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [assetFilter, setAssetFilter] = useState("All");
  const [showAssets, setShowAssets] = useState(true);
  const [assets, setAssets] = useState([
    { tags: ["Start", "Element", "Video 3.0", "1080p"], type: "video" },
  ]);

  const handleGenerate = async (params) => {
    setGenerating(true);
    // Gradio API call would go here
    setTimeout(() => {
      setGenerating(false);
      // setVideoUrl(result);
    }, 3000);
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "video": return <VideoPanel onGenerate={handleGenerate} generating={generating} />;
      case "image": return <ImagePanel />;
      case "avatar": return <AvatarPanel />;
      case "motion": return <MotionPanel />;
      default: return null;
    }
  };

  return (
    <div style={{
      display: "flex", width: "100vw", height: "100vh", overflow: "hidden",
      background: "#0a0a0a", color: "#e0e0e0",
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Sidebar */}
      <Sidebar activeIcon={activeIcon} onIconClick={setActiveIcon} credits={credits} />

      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Tabs */}
        <TopTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Panel + Preview */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {renderPanel()}
            {activeTab === "video" && (
              <VideoPreview
                videoUrl={videoUrl}
                prompt="Realistic cinematic style, a 15-second single continuous take..."
                metadata={{ tags: ["Start", "Element", "Video 3.0", "1080p"] }}
              />
            )}
          </div>

          {/* Right Asset Sidebar */}
          {showAssets && (activeTab === "video" || activeTab === "image") && (
            <AssetSidebar assets={assets} activeFilter={assetFilter} onFilterChange={setAssetFilter} />
          )}
        </div>
      </div>
    </div>
  );
}
