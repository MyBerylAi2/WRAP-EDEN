import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🔱 EDEN — Image & Video Studio | Beryl AI Labs",
  description: "Voice Agents · 4D Avatars · Photorealistic Generation. Own The Science.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#050302]">
        {children}
      </body>
    </html>
  );
}
