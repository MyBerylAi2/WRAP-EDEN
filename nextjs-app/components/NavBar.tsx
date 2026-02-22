"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "🔱 Eden" },
  { href: "/image-studio", label: "Image Studio" },
  { href: "/video-studio", label: "Video Studio" },
  { href: "/producer", label: "Producer" },
  { href: "/artist", label: "Artist" },
  { href: "/lulu", label: "Lulu's Hall" },
  { href: "/voice-agents", label: "Voice Agents" },
  { href: "/eve-4d", label: "EVE 4D" },
  { href: "/files", label: "Files" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="text-center py-3 px-4 border-y border-[rgba(197,179,88,0.12)] bg-[rgba(10,8,5,0.95)] backdrop-blur-md">
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {NAV_ITEMS.map((item, i) => (
          <span key={item.href} className="flex items-center">
            {i > 0 && <span className="text-[#504830] mx-1 text-xs">·</span>}
            <Link
              href={item.href}
              className={`
                px-3 py-1.5 rounded-md text-sm font-bold tracking-wider transition-all duration-300
                ${pathname === item.href
                  ? "bg-gradient-to-r from-[#8B6914] via-[#C5B358] to-[#D4AF37] text-[#050302] shadow-[0_0_16px_rgba(197,179,88,0.3)]"
                  : "text-[#C5B358] hover:bg-[rgba(197,179,88,0.08)] hover:text-[#F5E6A3]"
                }
              `}
              style={{ fontFamily: '"Cinzel", serif' }}
            >
              {item.label}
            </Link>
          </span>
        ))}
        <span className="text-[#504830] mx-1 text-xs">·</span>
        <span
          className="text-sm font-bold tracking-wider text-[#8B6914]"
          style={{ fontFamily: '"Cinzel", serif' }}
        >
          OWN THE SCIENCE
        </span>
      </div>
    </nav>
  );
}
