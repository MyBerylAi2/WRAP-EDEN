import Link from "next/link";
import { EdenMegaLogo } from "@/components/EdenLogo";
import { NavBar } from "@/components/NavBar";

const PRODUCTS = [
  { href: "/image-studio", icon: "🖼️", title: "Image Studio", desc: "Photorealistic generation. Eden Protocol. 4 engines. No restrictions.", badge: "4 Engines" },
  { href: "/video-studio", icon: "🎬", title: "Video Studio", desc: "Text-to-Video & Image-to-Video. 6 engines. Full creative control.", badge: "6 Engines" },
  { href: "/voice-agents", icon: "🔊", title: "Voice Agents", desc: "18 industry solutions. Deploy in 48 hours. Revenue on day one.", badge: "$9.99-$499/mo" },
  { href: "/eve-4d", icon: "🎭", title: "EVE 4D Avatar", desc: "Brain → Voice → Face → Stream. The first digital soul.", badge: "Open Source" },
];

const STATS = [
  { value: "18+", label: "VOICE SOLUTIONS" },
  { value: "24/7", label: "ALWAYS ON" },
  { value: "<300ms", label: "RESPONSE TIME" },
  { value: "30+", label: "LANGUAGES" },
  { value: "$0", label: "VENDOR LOCK-IN" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <EdenMegaLogo />
      <NavBar />

      {/* Hero Text */}
      <div className="text-center py-12 px-5">
        <h2
          className="eden-shimmer text-[clamp(1.2rem,3vw,2.2rem)] font-bold max-w-4xl mx-auto leading-snug"
          style={{ fontFamily: '"Cinzel Decorative", serif' }}
        >
          Voice Agents That Close Deals. Digital Souls That Cross the Uncanny Valley.
        </h2>
        <p className="text-xs text-[#504830] tracking-[0.3em] uppercase mt-5" style={{ fontFamily: '"DM Mono", monospace' }}>
          BERYL AI LABS · NEW ORLEANS · EST. 2024
        </p>
      </div>

      {/* Product Cards */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {PRODUCTS.map((p) => (
          <Link key={p.href} href={p.href} className="group">
            <div className="text-center p-7 rounded-xl border border-[rgba(197,179,88,0.12)] bg-[#12100a]
              hover:border-[rgba(197,179,88,0.3)] transition-all duration-300 h-full
              hover:shadow-[0_0_30px_rgba(197,179,88,0.08)]">
              <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">{p.icon}</span>
              <h3 className="text-xl font-bold text-[#FFF8E1] mb-2" style={{ fontFamily: '"Cinzel", serif' }}>{p.title}</h3>
              <p className="text-sm text-[#a09880] leading-relaxed mb-4">{p.desc}</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider
                bg-[rgba(197,179,88,0.1)] text-[#C5B358] border border-[rgba(197,179,88,0.2)]"
                style={{ fontFamily: '"DM Mono", monospace' }}>
                {p.badge}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 flex-wrap px-4 py-10">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl font-black text-[#C5B358]" style={{ fontFamily: '"Cinzel", serif' }}>{s.value}</div>
            <div className="text-[10px] text-[#504830] tracking-[0.2em] mt-1" style={{ fontFamily: '"DM Mono", monospace' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Philosophy */}
      <div className="text-center py-10 px-5 mx-4 border-y border-[rgba(197,179,88,0.1)]">
        <p className="text-2xl text-[#C5B358] italic" style={{ fontFamily: '"Cinzel", serif' }}>
          &ldquo;We don&apos;t use AI. We own the science.&rdquo;
        </p>
        <p className="text-xs text-[#504830] tracking-[0.2em] mt-3" style={{ fontFamily: '"DM Mono", monospace' }}>
          — THE EDEN PROJECT PHILOSOPHY
        </p>
      </div>

      <NavBar />
    </div>
  );
}
