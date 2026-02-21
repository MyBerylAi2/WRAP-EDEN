import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// EDEN ARTIST — KNOWLEDGE BASE
// 7 Landing Page Examples + Master Prompt
// Each example: different industry, different aesthetic, production-ready
// ═══════════════════════════════════════════════════════════════════════════

const EXAMPLES = [
  {
    id: "eden",
    name: "Eden Realism Engine",
    industry: "AI / SaaS",
    aesthetic: "Luxury Dark + Metallic Gold",
    description: "The original. Dark canvas with old gold metallic typography, floating particles, hexagonal logo mark, cinematic depth. This is the prompt that created YOUR landing page.",
    prompt: `Design a premium landing page for an AI image and video generation platform called "Eden Realism Engine." The brand represents the intersection of artificial intelligence and photorealistic human rendering, specifically celebrating African American beauty and melanated skin textures with unprecedented fidelity.

AESTHETIC DIRECTION: Ultra-luxury dark theme. Think Rolls-Royce meets Silicon Valley. The background is near-black (#050302) with subtle radial gradients hinting at warmth. The primary accent is old gold metallic — not flat gold, but a multi-stop gradient that simulates real brushed metal: #8B6914 → #C5B358 → #F5E6A3 → #D4AF37 → back. This gradient animates slowly (8s linear infinite) creating a living, breathing metallic sheen.

TYPOGRAPHY: Cinzel Decorative for the main wordmark (900 weight, 76px, letter-spacing 18px). Cinzel for subheadings (600 weight). Cormorant Garamond for body text — it's a serif that feels both editorial and warm, never cold. DM Mono for technical details. ALL text uses the metallic gradient with -webkit-background-clip: text.

LOGO: SVG hexagonal frame containing a stylized "E" monogram built from four strokes (top bar, middle bar, bottom bar, vertical spine). The hexagon has a gold gradient stroke with a gaussian blur glow filter. Diamond ornaments at top and bottom vertices.

SPATIAL COMPOSITION: Full viewport hero (100vh) with absolute center alignment. Content flows: Logo SVG → ornamental divider (gradient line + rotated diamond + gradient line) → "EDEN" wordmark → "Realism Engine" subtitle → second divider → tagline → CTA buttons. Generous vertical rhythm. Nothing feels cramped.

MOTION: 30 floating gold particles rising from bottom (random sizes 1-3px, random durations 8-22s, random delays). Shimmer sweep overlay (linear gradient of transparent → rgba(245,230,163,0.08) → transparent) sweeping across the logo every 6s. Breathing glow pulse on the main logo (drop-shadow oscillating between 15px and 30px blur). Staggered fade-up entries on load.

NAVIGATION: Fixed top bar, transparent on load, gains rgba(5,3,2,0.94) background + blur(16px) backdrop-filter on scroll. Left: gold "E" square badge + "EDEN" text. Center: page links. Right: outline CTA button.

SECTIONS BELOW FOLD: Capabilities grid (3 cards with icon, gold title, body text, dark card backgrounds with subtle border). Tech stack grid (6 feature cards). Footer with centered wordmark + ornamental divider + copyright.

CRITICAL RULES: No purple. No blue. No white backgrounds. Every color derives from the gold-to-brown spectrum. Borders are always subtle (#2a1f12). Cards use #0d0906 backgrounds. The overall feeling should be "you just walked into the VIP lounge of a members-only club."`,
    colors: ["#050302", "#C5B358", "#F5E6A3", "#D4AF37", "#8B6914"],
    fonts: ["Cinzel Decorative", "Cormorant Garamond"],
  },
  {
    id: "photography",
    name: "Aura Studios",
    industry: "Photography / Creative Agency",
    aesthetic: "Editorial Minimal + Film Grain",
    description: "High-end photography studio. Massive hero image with text overlay, film grain texture, editorial grid layout. Proves Eden can generate instant photo shoot landing pages.",
    prompt: `Design a landing page for "Aura Studios" — a premium photography studio specializing in editorial portraiture, fashion, and brand campaigns. The design should feel like opening a high-end fashion magazine.

AESTHETIC: Editorial minimalism with dramatic photography. Cream/warm white (#F5F0EB) background with charcoal (#1A1A1A) text. No color accents except a single burnt sienna (#A0522D) used sparingly for hover states and one CTA button. The restraint IS the luxury.

TYPOGRAPHY: Playfair Display for headlines (italic variant for the hero). A dramatic 120px hero headline that reads "Every Frame Tells a Story" in Playfair Display Italic, positioned over a full-bleed hero photograph. Body text in EB Garamond at 16px/1.8. Navigation in Josefin Sans (light weight, 11px, letter-spacing 4px, uppercase).

HERO: Full-viewport image (a dramatic portrait — dark-skinned woman in golden light, shallow DOF, film grain). Text overlay with mix-blend-mode: difference for that high-fashion editorial look. Minimal navigation overlaid at top. A single scroll indicator at bottom.

LAYOUT: Below the hero, a masonry-style portfolio grid with 2-3 column layout. Each image card has a subtle film grain CSS overlay (using a noise SVG filter). On hover, images scale to 1.02 with a 0.6s cubic-bezier transition and a caption slides up from bottom: project name in Playfair, category in Josefin Sans.

FILM GRAIN EFFECT: CSS pseudo-element overlay with background-image using an SVG noise filter: filter: url(#noise) contrast(170%) brightness(1000%). Opacity 0.03. This gives every image that analog photography texture.

SECTIONS: Hero → Portfolio Grid → "The Process" (3-step horizontal layout with large step numbers in Playfair Display at 200px, semi-transparent) → Testimonial (single quote, massive italic Playfair, centered) → Contact (minimal form: name, email, message, burnt sienna submit button).

CRITICAL: This page should make someone think "I need to hire this photographer." The design sells through negative space and letting the photography breathe. NO gradients, no shadows, no rounded corners larger than 2px. Razor sharp.`,
    colors: ["#F5F0EB", "#1A1A1A", "#A0522D", "#888", "#fff"],
    fonts: ["Playfair Display", "EB Garamond"],
  },
  {
    id: "realestate",
    name: "Meridian Residences",
    industry: "Luxury Real Estate",
    aesthetic: "Architectural + Parallax Depth",
    description: "Ultra-luxury condo development. Parallax scrolling, architectural typography, floor plan interactivity, ambient video backgrounds.",
    prompt: `Design a landing page for "Meridian Residences" — a $50M luxury condominium development in Miami's Design District. The page must communicate exclusivity, architectural beauty, and lifestyle aspiration.

AESTHETIC: Architectural modernism meets digital luxury. Deep navy (#0A1628) as primary dark, warm cream (#F8F4EF) for text on dark sections, and brushed copper (#B87333) as the accent metal. The design should feel like walking through a model home designed by Zaha Hadid.

TYPOGRAPHY: Monument Extended for headlines — ultra-wide, ultra-modern. Body text in Cormorant (serif, elegant). Navigation in Archivo (geometric sans, thin weight). The hero headline "LIVE ABOVE" should be 160px Monument Extended, letter-spacing 30px, with individual letter stagger animations on load (each letter fades up with 50ms delay).

HERO: Ambient video background (or CSS gradient simulating golden hour light over water). The video has an overlay gradient from navy at top to transparent at bottom. Large headline, a single line of body text, and a copper-outlined "Schedule Private Viewing" button.

PARALLAX: As user scrolls, different layers move at different speeds. Background images shift at 0.3x speed, text layers at 1x, decorative line elements at 1.5x. This creates architectural depth. Implement with transform: translateY(calc(var(--scroll) * 0.3)).

SECTIONS: Hero (ambient video) → Property Stats (4 columns: "47 Stories", "2-5 Bedrooms", "From $2.4M", "2026 Delivery" — each number animates counting up when scrolled into view) → Gallery (horizontal scroll carousel with snap points, images at 80vw width) → Floor Plans (interactive — click a floor to see the layout, SVG floor plan with rooms that highlight on hover) → Amenities (icon grid with copper icons) → Location Map (stylized, not Google Maps — custom dark-themed map showing proximity to beaches, restaurants, galleries) → Contact (dark section, copper form elements).

SIGNATURE DETAIL: Thin copper lines (1px, #B87333) that extend from section to section, creating a continuous architectural thread down the page. These lines animate their height as you scroll.

CRITICAL: This page sells a $2.4M condo. Every pixel must justify that price point. No stock photography feeling. No template energy. This is bespoke digital architecture.`,
    colors: ["#0A1628", "#F8F4EF", "#B87333", "#1a2942", "#D4A76A"],
    fonts: ["Monument Extended", "Cormorant"],
  },
  {
    id: "streetwear",
    name: "VØID Collective",
    industry: "Streetwear / Fashion Brand",
    aesthetic: "Brutalist + Anti-Design",
    description: "Underground streetwear brand. Brutalist typography, glitch effects, raw energy. Shows Eden can do edgy, not just luxury.",
    prompt: `Design a landing page for "VØID Collective" — an underground streetwear brand that blends Japanese workwear aesthetics with post-punk attitude. Anti-fashion. Anti-template. Anti-everything expected.

AESTHETIC: Brutalist anti-design. Pure black (#000) background. Pure white (#FFF) text. One accent: electric red (#FF0000) used ONLY for the "SHOP NOW" button and one hover state. No gradients. No rounded corners. No shadows. Raw concrete energy.

TYPOGRAPHY: Space Mono for everything (monospace creates that technical/underground feel). Hero text at 14vw (massive, viewport-responsive). Body at 13px. EVERYTHING uppercase. Letter-spacing: 0.3em on headlines, 0.15em on body. Line-height: 1.0 on headlines (tight, overlapping).

HERO: Split screen. Left 60%: a cropped, high-contrast black and white photograph of a model (African American, oversized jacket, looking away from camera). Right 40%: stacked text — "VØID" at 20vw overlapping into the image, "COLLECTIVE" below at 8vw, "SS26 DROP" in red below that. The text intentionally bleeds off the right edge. A countdown timer to the drop date in monospace.

GLITCH EFFECT: On hover over the hero, the image gets a CSS glitch — duplicate the image with clip-path and offset it 3px in red and cyan channels (mix-blend-mode: multiply). The text randomly shifts 1-2px horizontally for 200ms. Implement with @keyframes and random clip-path values.

LAYOUT: No grid. Asymmetric placement. Product images at different sizes scattered across the page — some full-width, some 30% width pushed to the right margin, some overlapping text. Each product has only: image, name (monospace), price. No descriptions. The less information, the more exclusive it feels.

SCROLLING: Horizontal scroll section for the lookbook. White-on-black images. Each image is exactly viewport width. Progress indicator: a thin red line at top that fills as you scroll.

SECTIONS: Hero (split) → "MANIFESTO" (a single paragraph of brand philosophy in 13px monospace, max-width 500px, centered, with every 5th word in red) → Product Scatter → Horizontal Lookbook → Stockists (just city names in a column: TOKYO / LONDON / LAGOS / NYC / BERLIN) → Email Signup (just an input and red arrow button, no label, placeholder "YOUR EMAIL").

CRITICAL: This page should make fashion-forward 18-25 year olds feel like they discovered something nobody else knows about. It should feel uncomfortable to traditional designers. That's the point.`,
    colors: ["#000000", "#FFFFFF", "#FF0000"],
    fonts: ["Space Mono"],
  },
  {
    id: "wellness",
    name: "Solace Wellness",
    industry: "Health & Wellness Spa",
    aesthetic: "Organic Warm + Soft Curves",
    description: "Premium day spa. Warm earth tones, organic shapes, botanical illustrations. The opposite of tech — proves Eden's range.",
    prompt: `Design a landing page for "Solace Wellness" — a premium day spa and holistic wellness center. The design should make someone feel calmer just by looking at it.

AESTHETIC: Organic warmth. Warm sand (#F4EDE4) as the primary background. Deep forest green (#2C4A3E) for text and accents. Terracotta (#C67D5B) for CTAs and highlights. Sage (#9CAF88) for secondary elements. The palette comes from earth, clay, and forest. Rounded shapes everywhere — border-radius minimum 16px, hero image in an organic blob shape using clip-path.

TYPOGRAPHY: Fraunces for headlines — it's a soft serif with beautiful optical sizing and wonky alternates that feel hand-drawn. DM Sans for body text (friendly, approachable). Hero headline: "Find Your Still Point" at 64px Fraunces, forest green, center-aligned over a clipped botanical image.

HERO: Large organic-shaped image (woman in a spa setting, warm tones, natural lighting, eyes closed, at peace). The image is clipped with clip-path: path() creating an organic blob shape. Behind the blob, subtle animated concentric circles radiating outward in sage green at very low opacity (0.05), creating a zen-like ripple effect.

BOTANICAL ELEMENTS: Hand-drawn botanical SVG illustrations (monstera leaf, eucalyptus branch, lavender sprig) positioned as decorative elements. These float in and out with parallax as user scrolls. Not clipart — delicate line drawings with a single sage green stroke, no fill.

SECTIONS: Hero → Services (3 cards with rounded images: "Massage & Bodywork", "Facial Treatments", "Holistic Healing" — each with a botanical accent) → "The Solace Method" (a horizontal timeline showing the customer journey: Consult → Customize → Immerse → Restore, connected by a gentle curved SVG path in sage) → Testimonials (carousel with large italic Fraunces quotes over a terracotta-tinted background section) → Team (circular portraits with names in DM Sans) → Booking (warm sand section with a clean form: service dropdown, date picker, time selector, terracotta submit button with rounded corners).

MOTION: Everything is gentle. Fade-up animations with 1.2s duration and ease-out-cubic. Botanical illustrations drift slightly with scroll (parallax at 0.1x — barely perceptible but creates life). The ripple circles in the hero pulse gently (scale 1 to 1.05 over 8s).

CRITICAL: Nothing sharp. Nothing angular. Nothing that raises the heart rate. This page should feel like a warm bath for your eyes. If someone shows it to their stressed-out friend and the friend says "I need to go there," you've succeeded.`,
    colors: ["#F4EDE4", "#2C4A3E", "#C67D5B", "#9CAF88", "#fff"],
    fonts: ["Fraunces", "DM Sans"],
  },
  {
    id: "fintech",
    name: "Nexus Capital",
    industry: "Fintech / Investment Platform",
    aesthetic: "Data-Driven Dark + Neon Accents",
    description: "AI-powered investment platform. Dark interfaces, real-time data visualization, glass morphism, neon accent lines.",
    prompt: `Design a landing page for "Nexus Capital" — an AI-powered investment platform that uses machine learning to optimize portfolio allocation. The design must communicate trust, intelligence, and cutting-edge technology.

AESTHETIC: Data-driven dark mode. Background: #0D0D0F (almost black with a hint of blue). Primary surfaces: #16161A. Text: #E8E8ED (warm white). Primary accent: electric cyan (#00E5FF). Secondary accent: warm amber (#FFB347) used only for positive numbers and success states. Glass morphism cards with backdrop-filter: blur(20px) and rgba(255,255,255,0.05) backgrounds.

TYPOGRAPHY: Outfit for headlines (geometric sans, modern, confident). Source Code Pro for numbers and data. Inter for body text (here it works because fintech demands readability over personality). Hero: "Your Money. Amplified." at 72px Outfit, bold, with "Amplified" in cyan.

HERO: Dark full-width section with an animated background — a subtle grid of dots (rgba(255,255,255,0.03)) with occasional pulses of cyan light that ripple outward from random points, simulating neural network activity. Center-aligned headline + subtitle + two buttons ("Start Investing" in cyan, "See Performance" in outline). Below the buttons, a live-updating ticker strip showing portfolio performance numbers (animated counting).

DATA VISUALIZATION: A prominent interactive chart (built with recharts or Chart.js). Dark background, cyan line for portfolio value, subtle grid lines. Key metrics in glass morphism cards arranged around the chart: "Total AUM: $2.4B", "Avg Return: 18.7%", "Active Users: 47,892". Numbers animate counting up.

SECTIONS: Hero (neural grid background) → Performance Dashboard (chart + metric cards) → "How It Works" (3 steps with animated connecting lines: "1. Connect Your Accounts" → "2. AI Analyzes & Optimizes" → "3. Watch Your Wealth Grow") → Security section (dark, serious — icons for bank-level encryption, SEC registered, FDIC insured) → Testimonials (glass cards, profile photos, return percentages in amber) → CTA section ("Start in 5 minutes" with phone mockup showing the app) → Footer (minimal, regulatory disclaimers in small text).

SIGNATURE DETAIL: Thin cyan accent lines (1px) that trace paths between sections like circuit traces. They glow subtly (box-shadow: 0 0 8px rgba(0,229,255,0.3)).

CRITICAL: Fintech lives and dies on trust. The design must feel institutional-grade but not boring. The data vis must look real, not decorative. No toy-ish illustrations. No generic "people pointing at screens" imagery. This is serious money, seriously designed.`,
    colors: ["#0D0D0F", "#00E5FF", "#FFB347", "#16161A", "#E8E8ED"],
    fonts: ["Outfit", "Source Code Pro"],
  },
  {
    id: "restaurant",
    name: "Ember & Oak",
    industry: "Fine Dining Restaurant",
    aesthetic: "Art Deco + Warm Moody",
    description: "Upscale restaurant with open fire cooking. Art deco geometry, warm amber photography, menu typography, reservation system.",
    prompt: `Design a landing page for "Ember & Oak" — an upscale restaurant specializing in open-fire cooking and seasonal ingredients. Located in New Orleans (TJ's city). The design should make someone hungry and eager to book a table.

AESTHETIC: Art deco meets firelight. Deep charcoal (#1C1816) background. Warm amber (#D4914A) as the primary accent — the color of firelight on oak. Cream (#EDE8DF) for text. Geometric art deco patterns (thin gold lines forming triangles, chevrons, and fan shapes) used as decorative borders and section dividers.

TYPOGRAPHY: Poiret One for the restaurant name and section headers — it's pure art deco, thin and geometric. Libre Baskerville for body text and menu items (classical serif that pairs beautifully with Poiret). Menu prices in Libre Baskerville italic. The hero wordmark "EMBER & OAK" in Poiret One at 80px with letter-spacing 12px.

HERO: Full-viewport with a moody, warm-toned image of the open kitchen — flames licking a cast iron grill, a chef in the background, warm light. Dark gradient overlay from bottom. The restaurant name and "Open Fire. Seasonal Soul." tagline centered. A single "Reserve a Table" button in amber outline with geometric corner accents (small art deco triangles at each corner of the button).

ART DECO DETAILS: SVG geometric borders between sections — thin lines forming repeating fan/chevron patterns. These are in amber at low opacity (0.3). A decorative monogram "E&O" in an art deco diamond frame used as a section marker.

SECTIONS: Hero → "Our Philosophy" (split: text left, moody food photography right — a perfectly seared steak with visible grill marks, fresh herbs, warm plating) → Menu Preview (the most important section — a curated selection: 3 starters, 3 mains, 3 desserts. Elegant typography: dish name in Poiret One, description in italic Libre Baskerville, price right-aligned. Thin amber dividing lines between items) → "The Fire" (full-width image section about their wood-fired cooking, text overlay) → Private Events (dark section with geometric patterns, info about private dining) → Reservation Widget (date selector, party size, time slots — warm amber accents on form elements, art deco submit button) → Location & Hours (embedded dark-themed map + hours in a simple two-column layout) → Footer with art deco geometric border at top.

MOTION: Subtle flame flicker effect on the hero (CSS animation: very slight scale and opacity oscillation on an overlay gradient, creating the illusion of flickering firelight). Menu items fade up sequentially on scroll. Art deco borders draw themselves on scroll (stroke-dashoffset animation on SVG paths).

CRITICAL: This page should smell like wood smoke and taste like perfectly aged bourbon. The design sells atmosphere first, food second, because at this level, the atmosphere IS the product. Every geometric detail should feel hand-placed by a 1920s graphic designer who time-traveled to 2026.`,
    colors: ["#1C1816", "#D4914A", "#EDE8DF", "#2a2420", "#8B7355"],
    fonts: ["Poiret One", "Libre Baskerville"],
  },
];

// ─── Master Prompt ───
const MASTER_PROMPT = `
═══════════════════════════════════════════════════════════════
🔱 EDEN ARTIST — MASTER PROMPT FOR MEDIA CREATION
The Eden Standard for AI-Generated Landing Pages & Design
Beryl AI Labs / The Eden Project
═══════════════════════════════════════════════════════════════

You are The Artist — Eden's autonomous design-to-deployment engine.
Your mission: take a creative brief from the user, generate a photorealistic
design concept using diffusion models, then autonomously build the complete
frontend code using Claude Code.

═══════════════════════════════════════════════════════════════
PHASE 1: CREATIVE BRIEF ANALYSIS
═══════════════════════════════════════════════════════════════

When a user provides a creative brief, extract:

1. INDUSTRY & AUDIENCE
   - What business/person is this for?
   - Who is the target audience? Age, income, aesthetic preference?
   - What emotional response should the page trigger?

2. BRAND IDENTITY
   - Existing colors, fonts, logos? Or creating from scratch?
   - Brand adjectives: luxury, playful, serious, edgy, warm, cold?
   - Competitor references: "I want something like X but..."

3. CONTENT REQUIREMENTS
   - What sections are needed? (hero, features, pricing, testimonials, CTA)
   - What's the primary CTA? (buy, book, subscribe, contact)
   - Content tone: formal, conversational, poetic, technical?

4. AESTHETIC DIRECTION (choose ONE and commit)
   - Luxury Dark (Eden, fintech, premium brands)
   - Editorial Minimal (photography, fashion, editorial)
   - Organic Warm (wellness, food, lifestyle)
   - Brutalist Raw (streetwear, music, counter-culture)
   - Architectural Modern (real estate, architecture, automotive)
   - Art Deco Geometric (restaurants, hotels, cocktail bars)
   - Data-Driven Tech (SaaS, fintech, AI platforms)
   - Playful Pop (kids, games, creative agencies)
   - Retro-Future (music, entertainment, nightlife)
   - Nature Documentary (eco brands, outdoor, adventure)

═══════════════════════════════════════════════════════════════
PHASE 2: DESIGN SYSTEM GENERATION
═══════════════════════════════════════════════════════════════

From the brief, generate a complete design system:

COLORS (exactly 5):
- Background (dominant surface)
- Primary text
- Accent (used sparingly — CTAs, highlights, one decorative element)
- Secondary surface (cards, sections)
- Subtle (borders, disabled states, tertiary text)

TYPOGRAPHY (exactly 2-3 fonts):
- Display font: for headlines, hero text, wordmarks
  Must be DISTINCTIVE. Never Inter, Roboto, Arial, system fonts.
  Import from Google Fonts: fonts.googleapis.com
- Body font: for paragraphs, descriptions, navigation
  Must PAIR with the display font (serif + sans, or decorative + clean)
- Optional mono: for technical details, prices, data

SPACING SCALE:
- Base: 8px grid
- Section padding: 80-120px vertical
- Card padding: 24-32px
- Text margins: 12-20px

BORDER & RADIUS:
- Match the aesthetic:
  - Luxury/Tech: sharp corners (0-4px)
  - Organic/Warm: generous curves (16-24px)
  - Brutalist: zero radius, thick borders
  - Art Deco: mix of sharp frames and decorative curves

═══════════════════════════════════════════════════════════════
PHASE 3: COMPONENT ARCHITECTURE
═══════════════════════════════════════════════════════════════

Every landing page must have these components (customize to aesthetic):

1. NAVIGATION
   - Fixed/sticky, transparent on load, solid on scroll
   - Logo/wordmark left, links center or right, CTA button
   - Mobile: hamburger menu with full-screen overlay

2. HERO (most critical — 70% of the design's impact)
   - Full viewport height (100vh)
   - ONE clear headline (under 8 words)
   - ONE supporting line
   - ONE primary CTA + optional secondary
   - Visual element: image, video, animation, or illustration
   - Motion: at least one animated element on load

3. SOCIAL PROOF / LOGOS (optional but powerful)
   - "Trusted by" logo strip
   - OR a single powerful testimonial quote

4. FEATURES / VALUE PROPOSITION
   - 3-4 feature cards OR a split layout (image + text)
   - Each feature: icon/visual + headline + 1-2 line description
   - NO generic icons (checkmarks, lightbulbs). Be specific.

5. SHOWCASE / GALLERY
   - Screenshots, photos, or portfolio work
   - Interactive: hover states, lightbox, carousel
   - This is where diffusion images go

6. TESTIMONIALS / CASE STUDIES
   - Real names, real photos, real results
   - Carousel or grid layout
   - Specific numbers > vague praise

7. PRICING (if applicable)
   - Clean comparison cards
   - Highlight recommended plan
   - Annual/monthly toggle

8. FINAL CTA
   - Dedicated section before footer
   - Restate the primary value proposition
   - Large, clear button

9. FOOTER
   - Links, social, legal
   - Match the page aesthetic (not generic)

═══════════════════════════════════════════════════════════════
PHASE 4: EDEN QUALITY STANDARDS
═══════════════════════════════════════════════════════════════

NEVER:
❌ Use Inter, Roboto, Arial, or system fonts
❌ Use purple gradients on white (AI slop signature)
❌ Use generic stock illustration styles (Undraw, etc.)
❌ Use rounded gradient buttons on white cards (SaaS template look)
❌ Use light blue (#E3F2FD) sections (every AI landing page has this)
❌ Use emoji as section icons in professional contexts
❌ Leave any button as a placeholder
❌ Use Lorem Ipsum — write real copy or leave a clear [CONTENT] marker
❌ Create responsive issues — test at 1440px, 1024px, 768px, 375px
❌ Forget hover states on interactive elements
❌ Ignore loading states for async actions

ALWAYS:
✅ Choose a BOLD aesthetic direction and commit fully
✅ Use distinctive typography from Google Fonts
✅ Create at least 3 custom animations/transitions
✅ Include a film grain, noise texture, or subtle pattern overlay
✅ Use CSS custom properties for the full color system
✅ Make the hero section unforgettable — this is the money shot
✅ Include micro-interactions on hover (scale, color shift, reveal)
✅ Use backdrop-filter: blur() for glass effects where appropriate
✅ Implement scroll-triggered animations
✅ Test that ALL buttons lead somewhere or trigger an action
✅ Make the mobile experience feel intentional, not just "responsive"

═══════════════════════════════════════════════════════════════
PHASE 5: AUTONOMOUS BUILD (Claude Code Integration)
═══════════════════════════════════════════════════════════════

When Auto-Build Mode is enabled, The Artist:

1. Generates the design concept as a diffusion image
2. Extracts the color palette, typography, and layout from the image
3. Opens Claude Code and generates the COMPLETE React/HTML component
4. Includes all animations, interactions, and responsive breakpoints
5. Deploys to a preview URL
6. Returns the live link + source code to the user

The output is NOT a mockup. It is a WORKING, DEPLOYED website.

═══════════════════════════════════════════════════════════════
EDEN ARTIST PHILOSOPHY
═══════════════════════════════════════════════════════════════

"Every business deserves a landing page that looks like it cost $50,000.
Eden makes that happen in 5 minutes. We don't do templates. We don't do
generic. Every page is a unique creative vision, autonomously designed
and built with the precision of a senior design team."

The Artist exists to democratize world-class design. A barbershop in
Atlanta deserves the same design quality as Apple's homepage. A
photographer starting out deserves the same visual impact as Annie
Leibovitz's studio site. A food truck deserves the same appetite
appeal as a Michelin-starred restaurant's page.

Eden levels the playing field. That's the mission.

✦ BUILT BY BERYL AI LABS / THE EDEN PROJECT ✦
`;

// ═══════════════════════════════════════════════════════════
// KNOWLEDGE BASE VIEWER COMPONENT
// ═══════════════════════════════════════════════════════════

const G = { dark: "#8B6914", base: "#C5B358", light: "#D4AF37", bright: "#F5E6A3", accent: "#8B7355" };
const S = { black: "#050302", d1: "#0a0604", d2: "#0d0906", d3: "#151008", border: "#2a1f12", bL: "#3a2d18" };
const F = { head: "'Cinzel', serif", body: "'Cormorant Garamond', serif", mono: "'DM Mono', monospace" };

export default function ArtistKnowledgeBase() {
  const [selected, setSelected] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showMaster, setShowMaster] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!document.getElementById("kb-fonts")) {
      const link = document.createElement("link");
      link.id = "kb-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: S.black, fontFamily: F.body, color: "#e0d8d0" }}>
      <style>{`
        @keyframes metal-gleam{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes fade-up{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
        pre{white-space:pre-wrap;word-wrap:break-word}
        ::-webkit-scrollbar{width:6px;background:${S.d1}}
        ::-webkit-scrollbar-thumb{background:${G.dark};border-radius:3px}
      `}</style>

      {/* Header */}
      <header style={{ padding: "60px 40px 40px", textAlign: "center", borderBottom: `1px solid ${S.border}` }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: G.accent, fontFamily: F.head, textTransform: "uppercase", marginBottom: 16 }}>Eden Artist · Knowledge Base</div>
        <h1 style={{ fontSize: 42, fontWeight: 900, fontFamily: F.head, background: `linear-gradient(135deg, ${G.dark}, ${G.base}, ${G.bright}, ${G.light}, ${G.base}, ${G.dark})`, backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "metal-gleam 8s linear infinite", margin: "0 0 12px" }}>
          Landing Page Design Standards
        </h1>
        <p style={{ fontSize: 15, color: G.accent, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
          {EXAMPLES.length} production-quality examples across different industries. Each includes the complete prompt, color system, and typography spec used to generate it.
        </p>

        {/* Master Prompt Button */}
        <button onClick={() => setShowMaster(!showMaster)} style={{
          marginTop: 24, padding: "14px 32px", borderRadius: 8, cursor: "pointer",
          background: `linear-gradient(135deg, ${G.base}, ${G.dark})`, border: "none",
          color: S.black, fontSize: 12, fontWeight: 700, fontFamily: F.head,
          letterSpacing: 2, textTransform: "uppercase",
        }}>
          {showMaster ? "Hide" : "View"} Master Prompt
        </button>
      </header>

      {/* Master Prompt */}
      {showMaster && (
        <div style={{ padding: "40px", borderBottom: `1px solid ${S.border}`, background: S.d1 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontFamily: F.head, color: G.base, letterSpacing: 2, margin: 0 }}>
                🔱 THE EDEN ARTIST MASTER PROMPT
              </h2>
              <button onClick={() => copyToClipboard(MASTER_PROMPT)} style={{
                padding: "6px 16px", borderRadius: 4, cursor: "pointer",
                border: `1px solid ${G.dark}`, background: "rgba(197,179,88,0.08)",
                color: G.base, fontSize: 10, fontFamily: F.mono,
              }}>
                {copied ? "✓ Copied!" : "Copy Full Prompt"}
              </button>
            </div>
            <pre style={{
              padding: 24, borderRadius: 12, background: S.black,
              border: `1px solid ${S.border}`, fontSize: 12, lineHeight: 1.7,
              color: G.bright, fontFamily: F.mono, maxHeight: 600, overflowY: "auto",
            }}>
              {MASTER_PROMPT}
            </pre>
          </div>
        </div>
      )}

      {/* Example Grid */}
      <div style={{ padding: "40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {EXAMPLES.map((ex, i) => (
            <div key={ex.id} onClick={() => { setSelected(ex.id === selected ? null : ex.id); setShowPrompt(false); }}
              style={{
                borderRadius: 14, overflow: "hidden", cursor: "pointer",
                border: `1px solid ${selected === ex.id ? G.dark : S.border}`,
                background: selected === ex.id ? `rgba(197,179,88,0.03)` : S.d2,
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                animation: `fade-up 0.6s ease-out forwards`,
                animationDelay: `${i * 0.08}s`, opacity: 0,
              }}>
              {/* Color strip */}
              <div style={{ display: "flex", height: 6 }}>
                {ex.colors.map((c, j) => (
                  <div key={j} style={{ flex: 1, background: c }} />
                ))}
              </div>

              {/* Preview area */}
              <div style={{
                height: 160, padding: 24, position: "relative",
                background: `linear-gradient(135deg, ${ex.colors[0]}ee, ${ex.colors[3] || ex.colors[0]}88)`,
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
              }}>
                <span style={{ position: "absolute", top: 12, right: 12, fontSize: 9, padding: "3px 10px", borderRadius: 4, background: "rgba(0,0,0,0.4)", color: "#fff", fontFamily: F.mono }}>{ex.industry}</span>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: ex.colors[1] === "#000000" ? "#fff" : ex.colors[1] || "#fff", fontFamily: F.head, margin: "0 0 4px", letterSpacing: 2 }}>
                  {ex.name}
                </h3>
                <span style={{ fontSize: 10, color: ex.colors[2] || G.accent, fontFamily: F.mono, letterSpacing: 1 }}>
                  {ex.aesthetic}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: "16px 20px" }}>
                <p style={{ fontSize: 13, color: G.accent, lineHeight: 1.6, margin: "0 0 12px", fontFamily: F.body }}>{ex.description}</p>

                {/* Fonts */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {ex.fonts.map(f => (
                    <span key={f} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 3, background: S.d3, color: G.accent, fontFamily: F.mono }}>{f}</span>
                  ))}
                </div>

                {/* Color swatches */}
                <div style={{ display: "flex", gap: 4 }}>
                  {ex.colors.map((c, j) => (
                    <div key={j} title={c} style={{
                      width: 20, height: 20, borderRadius: 4, background: c,
                      border: `1px solid rgba(255,255,255,0.1)`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expanded Prompt View */}
        {selected && (
          <div style={{
            marginTop: 24, borderRadius: 14, overflow: "hidden",
            border: `1px solid ${G.dark}`, background: S.d1,
          }}>
            <div style={{
              padding: "16px 24px", borderBottom: `1px solid ${S.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <h3 style={{ fontSize: 16, fontFamily: F.head, color: G.base, margin: "0 0 4px", letterSpacing: 2 }}>
                  {EXAMPLES.find(e => e.id === selected)?.name} — Full Prompt
                </h3>
                <span style={{ fontSize: 10, color: G.accent, fontFamily: F.mono }}>
                  {EXAMPLES.find(e => e.id === selected)?.industry} · {EXAMPLES.find(e => e.id === selected)?.aesthetic}
                </span>
              </div>
              <button onClick={() => copyToClipboard(EXAMPLES.find(e => e.id === selected)?.prompt || "")} style={{
                padding: "8px 20px", borderRadius: 6, cursor: "pointer",
                background: `linear-gradient(135deg, ${G.base}, ${G.dark})`, border: "none",
                color: S.black, fontSize: 10, fontWeight: 700, fontFamily: F.head,
                letterSpacing: 2, textTransform: "uppercase",
              }}>
                {copied ? "✓ Copied!" : "Copy Prompt"}
              </button>
            </div>
            <pre style={{
              padding: 24, margin: 0, fontSize: 12, lineHeight: 1.8,
              color: G.bright, fontFamily: F.mono, maxHeight: 500, overflowY: "auto",
              background: S.black,
            }}>
              {EXAMPLES.find(e => e.id === selected)?.prompt}
            </pre>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <footer style={{ padding: "40px", textAlign: "center", borderTop: `1px solid ${S.border}` }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 20 }}>
          {[
            { n: EXAMPLES.length, l: "Examples" },
            { n: EXAMPLES.reduce((a, e) => a + new Set(e.fonts).size, 0), l: "Unique Fonts" },
            { n: "10+", l: "Aesthetics" },
            { n: "7", l: "Industries" },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: F.head, color: G.base }}>{s.n}</div>
              <div style={{ fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 2, textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: G.accent, fontFamily: F.head, letterSpacing: 3 }}>
          ✦ EDEN ARTIST KNOWLEDGE BASE · BERYL AI LABS ✦
        </p>
      </footer>
    </div>
  );
}
