import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";

const FILES = [
  { icon: "📜", name: "EDEN-PROTOCOL-STANDARD-v5.md", desc: "The protocol — 300+ keywords, 50+ presets, 0.3 Deviation Rule" },
  { icon: "🎨", name: "EDEN-MASTER-PROMPTING-GUIDE.md", desc: "Master prompting guide for photorealistic generation" },
  { icon: "🎬", name: "EDEN-SCENE-LIBRARY-KB.md", desc: "100 scenarios + 30 dialogues" },
  { icon: "⚙️", name: "eden-protocol-config.json", desc: "Configuration file for Eden engines" },
  { icon: "🖼️", name: "eden-artist-knowledge-base.jsx", desc: "7 landing pages for artists" },
  { icon: "🔧", name: "eden-realism-engine-WIRED.jsx", desc: "Diffusion engine w/ live API connections" },
  { icon: "🎭", name: "eve-4d-avatar-studio.jsx", desc: "EVE 4D pipeline UI component" },
  { icon: "🔊", name: "eden-voice-agents.jsx", desc: "18 voice agent sales page component" },
  { icon: "📝", name: "THE-DAY-EVE-SPOKE-legacy-article.md", desc: "Legacy article — the day EVE spoke" },
];

const STORAGE = [
  { icon: "🤗", label: "HuggingFace Space", path: "AIBRUH/eden-diffusion-studio" },
  { icon: "🔒", label: "HuggingFace Vault", path: "AIBRUH/eden-vault (private)" },
  { icon: "🧠", label: "HuggingFace Model", path: "AIBRUH/eden-knowledge-base" },
  { icon: "🐙", label: "GitHub", path: "AIBRUH/eden-knowledge-base" },
];

export default function FilesPage() {
  return (
    <div className="min-h-screen">
      <EdenPageLogo subtitle="Knowledge Base · Documentation · Code" />
      <NavBar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-2 mb-10">
          {FILES.map((f) => (
            <div key={f.name} className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(197,179,88,0.12)] bg-[#12100a]
              hover:border-[rgba(197,179,88,0.25)] transition-all cursor-default">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="text-sm font-bold text-[#C5B358]" style={{ fontFamily: '"DM Mono", monospace' }}>{f.name}</div>
                <div className="text-xs text-[#706850]">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-[#C5B358] mb-4" style={{ fontFamily: '"Cinzel", serif' }}>
          📦 Storage Architecture
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STORAGE.map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl border border-[rgba(197,179,88,0.1)] bg-[#0a0805]">
              <span className="text-2xl block mb-2">{s.icon}</span>
              <div className="text-xs font-bold text-[#C5B358]" style={{ fontFamily: '"DM Mono", monospace' }}>{s.label}</div>
              <div className="text-[10px] text-[#504830] mt-1">{s.path}</div>
            </div>
          ))}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
