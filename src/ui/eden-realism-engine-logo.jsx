import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// EDEN REALISM ENGINE — PREMIUM METALLIC LOGO
// Old Gold Metallic Shine with Next-Gen Design
// Beryl AI Labs / The Eden Project
// ═══════════════════════════════════════════════════════════

export default function EdenLogo() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      width: "100vw", height: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 50% 40%, #1a0f05 0%, #0a0604 40%, #050302 100%)",
      overflow: "hidden", position: "relative",
      fontFamily: "'Cormorant Garamond', 'Playfair Display', 'Didot', serif",
    }}>
      {/* Ambient particles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&display=swap');

        @keyframes float-particle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-200%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        @keyframes breathe {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(197,179,88,0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(212,175,55,0.6)); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes text-reveal {
          0% { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @keyframes line-grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes metal-gleam {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .eden-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.8), transparent);
          animation: float-particle linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Floating gold particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="eden-particle" style={{
          left: `${Math.random() * 100}%`,
          bottom: `-${Math.random() * 20}%`,
          width: `${1 + Math.random() * 3}px`,
          height: `${1 + Math.random() * 3}px`,
          animationDuration: `${8 + Math.random() * 12}s`,
          animationDelay: `${Math.random() * 8}s`,
        }} />
      ))}

      {/* Radial light behind logo */}
      <div style={{
        position: "absolute",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(197,179,88,0.06) 0%, transparent 70%)",
        animation: "glow-pulse 4s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Main Logo Container */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative", cursor: "default",
          transform: mounted ? "scale(1)" : "scale(0.9)",
          opacity: mounted ? 1 : 0,
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          animation: mounted ? "breathe 6s ease-in-out infinite" : "none",
        }}
      >
        {/* SVG Logo Mark */}
        <svg width="120" height="120" viewBox="0 0 120 120" style={{
          display: "block", margin: "0 auto 24px",
          transform: hovered ? "rotateY(15deg) scale(1.05)" : "none",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <defs>
            {/* Metallic Gold Gradient */}
            <linearGradient id="metalGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B6914" />
              <stop offset="15%" stopColor="#C5B358" />
              <stop offset="30%" stopColor="#F5E6A3" />
              <stop offset="45%" stopColor="#D4AF37" />
              <stop offset="55%" stopColor="#C5B358" />
              <stop offset="70%" stopColor="#F5E6A3" />
              <stop offset="85%" stopColor="#B8960C" />
              <stop offset="100%" stopColor="#8B6914" />
            </linearGradient>
            {/* Inner shine */}
            <linearGradient id="innerShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5E6A3" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8B6914" stopOpacity="0.9" />
            </linearGradient>
            {/* Radial highlight */}
            <radialGradient id="highlight" cx="35%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>
            {/* Shadow filter */}
            <filter id="goldGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feFlood floodColor="#D4AF37" floodOpacity="0.5" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Emboss effect */}
            <filter id="emboss">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
              <feFlood floodColor="#000" floodOpacity="0.4" result="black" />
              <feComposite in="black" in2="offsetBlur" operator="in" result="shadow" />
              <feOffset in="blur" dx="-1" dy="-1" result="offsetBlur2" />
              <feFlood floodColor="#F5E6A3" floodOpacity="0.3" result="light" />
              <feComposite in="light" in2="offsetBlur2" operator="in" result="highlight" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="highlight" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring */}
          <circle cx="60" cy="60" r="56" fill="none" stroke="url(#metalGold)" strokeWidth="1.5" opacity="0.6" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="url(#metalGold)" strokeWidth="0.5" opacity="0.3" />

          {/* Inner hexagonal frame */}
          <polygon
            points="60,12 100,35 100,85 60,108 20,85 20,35"
            fill="none" stroke="url(#metalGold)" strokeWidth="2"
            filter="url(#goldGlow)"
          />

          {/* The E monogram */}
          <g filter="url(#emboss)">
            {/* Outer E strokes */}
            <path d="M38,35 L82,35" stroke="url(#metalGold)" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M38,60 L76,60" stroke="url(#metalGold)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M38,85 L82,85" stroke="url(#metalGold)" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M38,35 L38,85" stroke="url(#metalGold)" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>

          {/* Decorative corner diamonds */}
          <polygon points="60,6 63,10 60,14 57,10" fill="url(#metalGold)" opacity="0.8" />
          <polygon points="60,106 63,110 60,114 57,110" fill="url(#metalGold)" opacity="0.8" />

          {/* Highlight overlay */}
          <circle cx="60" cy="60" r="50" fill="url(#highlight)" />
        </svg>

        {/* Top ornamental line */}
        <div style={{
          width: 300, height: 1, margin: "0 auto 16px",
          background: "linear-gradient(90deg, transparent, #C5B358, #F5E6A3, #C5B358, transparent)",
          animation: mounted ? "line-grow 1.5s ease-out forwards" : "none",
          animationDelay: "0.3s",
          transformOrigin: "center",
          opacity: mounted ? 1 : 0,
        }} />

        {/* EDEN text */}
        <h1 style={{
          fontSize: 72, fontWeight: 900, letterSpacing: 24, margin: 0, textAlign: "center",
          fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
          background: "linear-gradient(135deg, #8B6914 0%, #C5B358 15%, #F5E6A3 30%, #D4AF37 45%, #C5B358 55%, #F5E6A3 65%, #D4AF37 80%, #8B6914 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: mounted ? "metal-gleam 8s linear infinite" : "none",
          textShadow: "none",
          filter: "drop-shadow(0 2px 4px rgba(139,105,20,0.5)) drop-shadow(0 0 20px rgba(197,179,88,0.15))",
          lineHeight: 1,
        }}>
          EDEN
        </h1>

        {/* Decorative separator */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, justifyContent: "center",
          margin: "12px 0",
          animation: mounted ? "fade-up 1s ease-out forwards" : "none",
          animationDelay: "0.5s",
          opacity: mounted ? 1 : 0,
        }}>
          <div style={{
            width: 60, height: 1,
            background: "linear-gradient(90deg, transparent, #C5B358)",
          }} />
          <div style={{
            width: 8, height: 8, transform: "rotate(45deg)",
            background: "linear-gradient(135deg, #D4AF37, #8B6914)",
            boxShadow: "0 0 10px rgba(212,175,55,0.4)",
          }} />
          <div style={{
            width: 60, height: 1,
            background: "linear-gradient(90deg, #C5B358, transparent)",
          }} />
        </div>

        {/* REALISM ENGINE text */}
        <h2 style={{
          fontSize: 22, fontWeight: 600, letterSpacing: 14, margin: 0, textAlign: "center",
          fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
          background: "linear-gradient(135deg, #8B6914 0%, #C5B358 20%, #F5E6A3 35%, #D4AF37 50%, #F5E6A3 65%, #C5B358 80%, #8B6914 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: mounted ? "metal-gleam 8s linear infinite" : "none",
          animationDelay: "0.5s",
          filter: "drop-shadow(0 1px 2px rgba(139,105,20,0.4))",
        }}>
          Realism Engine
        </h2>

        {/* Bottom ornamental line */}
        <div style={{
          width: 300, height: 1, margin: "16px auto 20px",
          background: "linear-gradient(90deg, transparent, #C5B358, #F5E6A3, #C5B358, transparent)",
          animation: mounted ? "line-grow 1.5s ease-out forwards" : "none",
          animationDelay: "0.6s",
          transformOrigin: "center",
        }} />

        {/* Tagline */}
        <p style={{
          fontSize: 10, letterSpacing: 6, textAlign: "center", margin: 0,
          fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
          color: "#8B7355",
          animation: mounted ? "fade-up 1s ease-out forwards" : "none",
          animationDelay: "0.8s",
          opacity: mounted ? 1 : 0,
        }}>
          Beryl AI Labs &nbsp;·&nbsp; The Eden Project
        </p>

        {/* Shimmer sweep overlay */}
        <div style={{
          position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
          borderRadius: 20,
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(245,230,163,0.08), transparent)",
            animation: "shimmer-sweep 6s ease-in-out infinite",
            animationDelay: "2s",
          }} />
        </div>
      </div>

      {/* Version badge */}
      <div style={{
        marginTop: 40,
        padding: "6px 20px", borderRadius: 20,
        border: "1px solid rgba(197,179,88,0.2)",
        background: "rgba(197,179,88,0.03)",
        animation: mounted ? "fade-up 1s ease-out forwards" : "none",
        animationDelay: "1.2s",
        opacity: mounted ? 1 : 0,
      }}>
        <span style={{
          fontSize: 10, letterSpacing: 4,
          fontFamily: "'Cinzel', serif",
          color: "#8B7355",
          textTransform: "uppercase",
        }}>
          v5.0 &nbsp;·&nbsp; CogView4 &nbsp;·&nbsp; LTX-Video &nbsp;·&nbsp; 4D Avatars
        </span>
      </div>
    </div>
  );
}
