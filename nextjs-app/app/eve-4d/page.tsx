import { EdenPageLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";

const PIPELINE = [
  { step: "🧠 Brain", model: "Claude / Groq Llama 3.3 70B", latency: "<150ms", status: "✅ Live" },
  { step: "🔊 Voice", model: "Kokoro TTS / Chatterbox", latency: "2-4s", status: "✅ Live" },
  { step: "🎭 Face", model: "KDTalker / MEMO", latency: "15-30s", status: "✅ Live" },
  { step: "📡 Stream", model: "WebRTC P2P", latency: "<30ms", status: "✅ Ready" },
];

export default function Eve4DPage() {
  return (
    <div className="min-h-screen">
      <EdenPageLogo subtitle="The 8th Wonder · Brain → Voice → Face → Stream" />
      <NavBar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(197,179,88,0.15)]">
                {["Step", "Model", "Latency", "Status"].map((h) => (
                  <th key={h} className="py-3 px-4 text-xs font-bold tracking-wider text-[#C5B358]"
                    style={{ fontFamily: '"DM Mono", monospace' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PIPELINE.map((row) => (
                <tr key={row.step} className="border-b border-[rgba(197,179,88,0.06)] hover:bg-[rgba(197,179,88,0.03)]">
                  <td className="py-3 px-4 text-lg">{row.step}</td>
                  <td className="py-3 px-4 text-sm text-[#a09880]" style={{ fontFamily: '"DM Mono", monospace' }}>{row.model}</td>
                  <td className="py-3 px-4 text-sm text-[#C5B358]" style={{ fontFamily: '"DM Mono", monospace' }}>{row.latency}</td>
                  <td className="py-3 px-4 text-sm">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center py-12 text-[#504830]">
          <span className="text-6xl block mb-4">🎭</span>
          <p className="text-lg" style={{ fontFamily: '"Cinzel", serif' }}>EVE demo videos available on the HuggingFace Space</p>
          <a href="https://huggingface.co/spaces/AIBRUH/eden-diffusion-studio" target="_blank" rel="noopener noreferrer"
            className="inline-block mt-4 px-6 py-2.5 rounded-lg text-sm font-bold tracking-wider
              bg-gradient-to-r from-[#8B6914] to-[#C5B358] text-[#050302]
              hover:shadow-[0_0_20px_rgba(197,179,88,0.3)] transition-all"
            style={{ fontFamily: '"Cinzel", serif' }}>
            View on HuggingFace →
          </a>
        </div>
      </div>

      <NavBar />
    </div>
  );
}
