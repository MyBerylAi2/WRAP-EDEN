import { useState, useEffect, useRef } from "react";

const GOLD = { dark: "#8B6914", base: "#C5B358", light: "#D4AF37", bright: "#F5E6A3", white: "#FFF8E1" };

const USE_CASES = [
  { id: "medical", icon: "🏥", title: "Medical Office Agent", subtitle: "HIPAA-Ready Voice AI", desc: "24/7 patient intake, appointment scheduling, prescription refill requests, post-visit follow-ups. Reduces front-desk overwhelm by 70%.", price: "Custom", tag: "ENTERPRISE", gradient: "linear-gradient(135deg, #1a3a4a, #0d2833)", accent: "#4ecdc4", stat: "70% fewer missed calls", demo: "Hi, this is Dr. O'Connor's office. I can help you schedule an appointment, refill a prescription, or answer questions about your upcoming visit. How can I help you today?" },
  { id: "tutoring", icon: "📚", title: "AI Tutor Voice Agent", subtitle: "Personalized Learning Companion", desc: "Socratic method voice tutor for K-12 and college. Math, science, languages, test prep. Adapts to learning pace in real-time.", price: "$29/mo", tag: "B2C", gradient: "linear-gradient(135deg, #2d1b4e, #1a0f30)", accent: "#a78bfa", stat: "2x faster comprehension", demo: "Hey! I'm your study buddy. Want to work through some calculus problems, or should we review for your chemistry exam? I'll walk you through it step by step." },
  { id: "presentations", icon: "🎙️", title: "Presentation Voice Agent", subtitle: "AI-Powered Keynotes", desc: "Generate professional voiceovers for slide decks, pitch decks, and corporate presentations. Multiple voice styles and languages.", price: "$49/mo", tag: "B2B", gradient: "linear-gradient(135deg, #1a1a2e, #16213e)", accent: "#6366f1", stat: "10x faster production", demo: "Welcome to the Q3 earnings presentation. Today we'll cover three key areas: revenue growth of 34%, our expansion into European markets, and our 2026 product roadmap." },
  { id: "influencer-live", icon: "🔴", title: "Live Voice for Influencers", subtitle: "Real-Time AI Co-Host", desc: "Your AI voice twin handles live streams, fan Q&A, podcast guest spots, and real-time engagement while you focus on content.", price: "$199/mo", tag: "CREATOR", gradient: "linear-gradient(135deg, #4a1942, #2d0f29)", accent: "#ec4899", stat: "24/7 fan engagement", demo: "Oh my god, thank you so much for the donation! You're asking about my skincare routine? Girl, let me break it down for you — step one is always double cleanse..." },
  { id: "influencer-prerecord", icon: "🎬", title: "Pre-Recorded Content Voice", subtitle: "Clone Your Voice at Scale", desc: "Record 60 seconds. Get unlimited content. YouTube narration, TikTok voiceovers, Instagram Reels, brand partnerships — all in YOUR voice.", price: "$99/mo", tag: "CREATOR", gradient: "linear-gradient(135deg, #1a1a1a, #2d2d2d)", accent: "#f59e0b", stat: "100x content output", demo: "Today I'm going to show you the top 5 hidden features in the new iPhone update that nobody is talking about. Number one is going to blow your mind..." },
  { id: "audiobooks", icon: "📖", title: "Audiobook Production", subtitle: "Full-Length Narration Engine", desc: "Turn any manuscript into a professional audiobook. Multiple narrator voices, character differentiation, emotional range. ACX-ready output.", price: "$0.05/word", tag: "PUBLISHING", gradient: "linear-gradient(135deg, #3d2b1f, #1a0f08)", accent: "#d97706", stat: "90% cost reduction", demo: "Chapter One. The old house at the end of Maple Street had been empty for thirty years. But tonight, as rain hammered the windows, a single light flickered in the attic..." },
  { id: "bedtime", icon: "🌙", title: "Bedtime Story App", subtitle: "AI Storyteller for Kids", desc: "Personalized bedtime stories featuring your child's name, interests, and life lessons. Calming voices with ambient soundscapes. Parents choose the moral.", price: "$9.99/mo", tag: "FAMILY", gradient: "linear-gradient(135deg, #1a1a3e, #0d0d2b)", accent: "#818cf8", stat: "15min avg to sleep", demo: "Once upon a time, in a magical garden where flowers could talk and butterflies carried wishes, there lived a brave little girl named Sofia who had the most wonderful adventure..." },
  { id: "realestate", icon: "🏠", title: "Real Estate Voice Agent", subtitle: "24/7 Property Concierge", desc: "Answer property inquiries, schedule showings, qualify leads, and provide virtual tour narration. Never miss a hot lead at 2 AM.", price: "$149/mo", tag: "B2B", gradient: "linear-gradient(135deg, #1a2f1a, #0d1f0d)", accent: "#34d399", stat: "3x more showings booked", demo: "Welcome to 742 Evergreen Terrace! This stunning 4-bedroom home features an open floor plan, renovated kitchen, and a backyard oasis. Would you like to schedule a private showing?" },
  { id: "support", icon: "🎧", title: "Customer Support Agent", subtitle: "Never Put Anyone On Hold", desc: "Handle Tier 1 support calls, process returns, troubleshoot common issues, escalate complex cases. Integrates with your CRM and ticketing.", price: "$299/mo", tag: "ENTERPRISE", gradient: "linear-gradient(135deg, #1a2a3a, #0d1520)", accent: "#38bdf8", stat: "85% first-call resolution", demo: "Thank you for calling TechCorp support. I see your account and the recent order. Looks like you're having trouble with the setup — let me walk you through it right now." },
  { id: "therapy", icon: "🧘", title: "Wellness Companion", subtitle: "AI Emotional Support Voice", desc: "Guided meditation, mood check-ins, CBT exercises, breathing techniques, journaling prompts. Not a replacement for therapy — a daily wellness tool.", price: "$19.99/mo", tag: "B2C", gradient: "linear-gradient(135deg, #2a1f3d, #1a1028)", accent: "#c084fc", stat: "40% anxiety reduction", demo: "Hey, I'm glad you're here. Before we start, take a deep breath with me. In through the nose... and out through the mouth. How are you feeling right now?" },
  { id: "sales", icon: "📞", title: "AI Sales Development Rep", subtitle: "Outbound Calling at Scale", desc: "Cold calls, follow-ups, appointment setting, lead qualification. Your AI SDR works 24/7, never gets discouraged, and books meetings while you sleep.", price: "$499/mo", tag: "ENTERPRISE", gradient: "linear-gradient(135deg, #3a1a1a, #200d0d)", accent: "#ef4444", stat: "5x pipeline growth", demo: "Hi, this is Jordan from Eden Solutions. I noticed your company just raised a Series B — congratulations! I'd love to show you how our voice AI could save your team 40 hours a week..." },
  { id: "podcast", icon: "🎙️", title: "AI Podcast Producer", subtitle: "Co-Host & Full Production", desc: "AI co-host that researches topics, generates talking points, performs interviews, and produces show notes. Full audio post-production included.", price: "$79/mo", tag: "CREATOR", gradient: "linear-gradient(135deg, #2a2a1a, #1a1a0d)", accent: "#eab308", stat: "4 episodes/week", demo: "Welcome back to another episode! Today we're diving deep into the AI revolution in healthcare. I've pulled some incredible stats that are going to surprise you..." },
  { id: "church", icon: "⛪", title: "Ministry Voice Agent", subtitle: "Prayer Line & Sermon Companion", desc: "24/7 prayer line, sermon summaries, Bible study companion, event announcements, member check-ins. Compassionate and faith-aligned.", price: "$99/mo", tag: "NONPROFIT", gradient: "linear-gradient(135deg, #2a1f1a, #1a130d)", accent: "#fb923c", stat: "Always available", demo: "Thank you for calling Grace Community Church. If you'd like someone to pray with you, I'm here right now. Or I can share information about our upcoming services and events." },
  { id: "fitness", icon: "💪", title: "Fitness Voice Coach", subtitle: "Personal Trainer in Your Ear", desc: "Real-time workout guidance, rep counting, form cues, motivational coaching, nutrition tracking. Syncs with wearables for heart rate zones.", price: "$14.99/mo", tag: "B2C", gradient: "linear-gradient(135deg, #1a2a1a, #0d200d)", accent: "#22c55e", stat: "3x workout consistency", demo: "Alright, let's crush this! We're starting with 3 sets of squats. Feet shoulder-width apart, chest up, and... down! One... two... great depth! Three... keep that core tight!" },
  { id: "language", icon: "🌍", title: "Language Learning Partner", subtitle: "Conversational AI Immersion", desc: "Practice conversations in 30+ languages. Corrects pronunciation, explains grammar, adjusts difficulty. Like having a native speaker on speed dial.", price: "$24.99/mo", tag: "B2C", gradient: "linear-gradient(135deg, #1a3a2a, #0d2015)", accent: "#2dd4bf", stat: "Fluency 6x faster", demo: "¡Hola! ¿Cómo estás hoy? Vamos a practicar una conversación en un restaurante. Imagina que acabas de sentarte y el camarero se acerca..." },
  { id: "senior", icon: "👴", title: "Senior Care Companion", subtitle: "Daily Check-In Voice Agent", desc: "Medication reminders, daily wellness checks, appointment reminders, emergency detection, family updates. Warm, patient, never rushed.", price: "$29.99/mo", tag: "FAMILY", gradient: "linear-gradient(135deg, #2a2a3a, #15151f)", accent: "#94a3b8", stat: "Peace of mind", demo: "Good morning, Margaret! How did you sleep last night? Don't forget, you have your eye doctor appointment at 2 o'clock today. Would you like me to remind you again at 1:30?" },
  { id: "legal", icon: "⚖️", title: "Legal Intake Agent", subtitle: "Client Screening & Scheduling", desc: "Screen potential clients, gather case details, schedule consultations, send intake forms. Billable-hour qualified leads only.", price: "$249/mo", tag: "B2B", gradient: "linear-gradient(135deg, #1a1a2a, #0d0d15)", accent: "#7c3aed", stat: "60% more qualified leads", demo: "Thank you for contacting Smith & Associates. I'd like to understand your situation better. Can you tell me briefly what type of legal matter you need help with?" },
  { id: "restaurant", icon: "🍽️", title: "Restaurant & Hospitality", subtitle: "Reservations & Ordering", desc: "Phone orders, reservation management, menu questions, special dietary accommodations, catering inquiries. Handles rush hour overflow calls.", price: "$129/mo", tag: "B2B", gradient: "linear-gradient(135deg, #3a1a2a, #200d15)", accent: "#f43f5e", stat: "Zero missed reservations", demo: "Welcome to Maison Belle! We have availability tonight at 7:30 and 9:00. Our chef's special is a pan-seared Chilean sea bass. Would you like to reserve a table?" },
];

const LIVE_DEMO_MESSAGES = [
  { role: "agent", text: "Hi! I'm an Eden Voice Agent. I can demonstrate any of our 18 voice solutions live. What industry are you in?" },
  { role: "user", text: "I run a medical practice with 3 locations." },
  { role: "agent", text: "Perfect. Our Medical Office Agent handles patient intake, scheduling, prescription refills, and follow-ups across all your locations — 24/7. Your front desk staff focuses on in-person care while I handle the phones. Want to hear how I'd greet your patients?" },
  { role: "user", text: "Yes, show me." },
  { role: "agent", text: "Thank you for calling Riverside Medical Group. I can help you schedule an appointment, request a prescription refill, or get answers about your upcoming visit. For urgent medical concerns, please hang up and dial 911. How may I help you today?" },
  { role: "user", text: "That's impressive. What about HIPAA?" },
  { role: "agent", text: "Great question. All conversations are encrypted end-to-end, we never store PHI on our servers, and our infrastructure is fully HIPAA-compliant with a signed BAA. Your patients' data stays protected. Ready to get started?" },
];

const EdenLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="gld" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={GOLD.bright} />
        <stop offset="50%" stopColor={GOLD.light} />
        <stop offset="100%" stopColor={GOLD.dark} />
      </linearGradient>
    </defs>
    <path d="M50 8 L58 35 L87 35 L63 52 L72 80 L50 64 L28 80 L37 52 L13 35 L42 35Z" fill="url(#gld)" />
  </svg>
);

const WaveAnimation = () => {
  const bars = 40;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 60 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2, background: `linear-gradient(to top, ${GOLD.dark}, ${GOLD.bright})`,
          animation: `wave 1.2s ease-in-out ${i * 0.03}s infinite alternate`,
          height: `${15 + Math.sin(i * 0.5) * 20 + Math.random() * 15}px`,
        }} />
      ))}
    </div>
  );
};

export default function EdenVoiceAgents() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [showOrder, setShowOrder] = useState(false);
  const [orderCase, setOrderCase] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const demoRef = useRef(null);

  useEffect(() => { setHeroVisible(true); }, []);
  useEffect(() => {
    if (!isPlaying) return;
    const t = setTimeout(() => {
      if (demoStep < LIVE_DEMO_MESSAGES.length - 1) setDemoStep(s => s + 1);
      else setIsPlaying(false);
    }, 2500);
    return () => clearTimeout(t);
  }, [demoStep, isPlaying]);

  const tags = ["ALL", ...new Set(USE_CASES.map(u => u.tag))];
  const filtered = filter === "ALL" ? USE_CASES : USE_CASES.filter(u => u.tag === filter);

  const openOrder = (uc) => { setOrderCase(uc); setShowOrder(true); setSubmitted(false); };
  const submitOrder = () => { setSubmitted(true); };

  return (
    <div style={{ minHeight: "100vh", background: "#050302", color: "#e8e0d0", fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes wave { 0% { transform: scaleY(0.3); } 100% { transform: scaleY(1); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes breathe { 0%, 100% { box-shadow: 0 0 20px rgba(197,179,88,0.1); } 50% { box-shadow: 0 0 40px rgba(197,179,88,0.25); } }
        @keyframes typing { 0% { width: 0; } 100% { width: 100%; } }
        .card-hover { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-8px) scale(1.02); }
        .btn-gold { 
          background: linear-gradient(135deg, ${GOLD.dark}, ${GOLD.base}, ${GOLD.light});
          color: #050302; font-family: 'Cinzel', serif; font-weight: 700; border: none;
          cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 2px;
        }
        .btn-gold:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(197,179,88,0.4); }
        .btn-outline {
          background: transparent; border: 1px solid ${GOLD.base}40; color: ${GOLD.base};
          font-family: 'Cinzel', serif; cursor: pointer; transition: all 0.3s; letter-spacing: 1px;
        }
        .btn-outline:hover { background: ${GOLD.base}15; border-color: ${GOLD.base}; }
        .tag-btn { padding: 8px 20px; border-radius: 100px; font-size: 11px; font-family: 'DM Mono', monospace; cursor: pointer; transition: all 0.3s; }
        input, textarea { background: #0a0805; border: 1px solid ${GOLD.dark}40; color: #e8e0d0; padding: 14px 18px; border-radius: 8px; font-family: 'Cormorant Garamond', serif; font-size: 16px; width: 100%; outline: none; transition: border 0.3s; }
        input:focus, textarea:focus { border-color: ${GOLD.base}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0805; }
        ::-webkit-scrollbar-thumb { background: ${GOLD.dark}40; border-radius: 3px; }
      `}</style>

      {/* ═══ HERO ═══ */}
      <div style={{
        position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", textAlign: "center", padding: "60px 20px",
        background: "radial-gradient(ellipse at 50% 30%, #1a140a 0%, #0a0805 40%, #050302 100%)",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, ${GOLD.dark}20 50px, ${GOLD.dark}20 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, ${GOLD.dark}20 50px, ${GOLD.dark}20 51px)` }} />
        
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD.base}08, transparent)`, animation: "float 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "8%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${GOLD.light}06, transparent)`, animation: "float 6s ease-in-out 2s infinite" }} />

        <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(40px)", transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 32 }}>
            <EdenLogo />
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 14, letterSpacing: 6, color: GOLD.base, textTransform: "uppercase" }}>The Eden Project</span>
          </div>

          <h1 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, background: `linear-gradient(135deg, ${GOLD.bright}, ${GOLD.base}, ${GOLD.light}, ${GOLD.bright})`, backgroundSize: "200% auto", animation: "shimmer 4s linear infinite", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Voice Agents<br />That Close Deals
          </h1>

          <p style={{ fontSize: "clamp(18px, 2.5vw, 24px)", color: "#a09880", maxWidth: 680, margin: "0 auto 20px", lineHeight: 1.7, fontWeight: 300 }}>
            AI voice agents that sound human, work 24/7, and generate revenue while you sleep.
            Medical. Legal. Sales. Content. Built by Eden. Powered by digital souls.
          </p>

          <div style={{ marginBottom: 48 }}>
            <WaveAnimation />
          </div>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-gold" style={{ padding: "16px 40px", borderRadius: 8, fontSize: 14 }}
              onClick={() => document.getElementById("solutions")?.scrollIntoView({ behavior: "smooth" })}>
              Browse Solutions
            </button>
            <button className="btn-outline" style={{ padding: "16px 40px", borderRadius: 8, fontSize: 14 }}
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}>
              Live Demo ▸
            </button>
          </div>

          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
            {[["18+", "Voice Solutions"], ["24/7", "Always On"], ["< 300ms", "Response Time"], ["30+", "Languages"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 32, fontWeight: 900, color: GOLD.base }}>{val}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#706850", letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ SOLUTIONS GRID ═══ */}
      <div id="solutions" style={{ padding: "100px 20px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 4, color: GOLD.dark, textTransform: "uppercase", marginBottom: 12 }}>Solutions</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: GOLD.white, marginBottom: 16 }}>
            18 Revenue-Ready Voice Agents
          </h2>
          <p style={{ color: "#706850", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>Each solution ships production-ready. Pick your industry, customize the voice, deploy in 48 hours.</p>
        </div>

        {/* Filter Tags */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          {tags.map(t => (
            <button key={t} className="tag-btn" onClick={() => setFilter(t)}
              style={{ background: filter === t ? `linear-gradient(135deg, ${GOLD.dark}, ${GOLD.base})` : "transparent",
                color: filter === t ? "#050302" : "#706850",
                border: `1px solid ${filter === t ? "transparent" : GOLD.dark + "40"}`,
                fontWeight: filter === t ? 700 : 400,
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
          {filtered.map((uc, i) => (
            <div key={uc.id} className="card-hover" style={{
              background: uc.gradient, borderRadius: 16, overflow: "hidden",
              border: `1px solid ${uc.accent}20`, animation: `fadeUp 0.6s ease ${i * 0.05}s both`,
              position: "relative",
            }}>
              {/* Card Header — Icon Scene */}
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 80%, ${uc.accent}15, transparent 70%)` }} />
                <div style={{ fontSize: 64, filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))", animation: "float 4s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}>{uc.icon}</div>
                <div style={{ position: "absolute", top: 12, right: 12, background: `${uc.accent}20`, color: uc.accent, padding: "4px 12px", borderRadius: 100, fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 1, border: `1px solid ${uc.accent}30` }}>{uc.tag}</div>
              </div>

              <div style={{ padding: "0 24px 24px" }}>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{uc.title}</h3>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: uc.accent, letterSpacing: 1, marginBottom: 12 }}>{uc.subtitle}</div>
                <p style={{ fontSize: 14, color: "#a09880", lineHeight: 1.6, marginBottom: 16, minHeight: 60 }}>{uc.desc}</p>

                {/* Stat Badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: uc.accent, animation: "pulse 2s infinite" }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: uc.accent }}>{uc.stat}</span>
                </div>

                {/* Price + Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${uc.accent}15` }}>
                  <div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, color: "#fff" }}>{uc.price}</div>
                    <div style={{ fontSize: 11, color: "#706850", fontFamily: "'DM Mono', monospace" }}>starting</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-outline" onClick={() => setSelectedCase(selectedCase === uc.id ? null : uc.id)}
                      style={{ padding: "8px 16px", borderRadius: 8, fontSize: 11, borderColor: `${uc.accent}40`, color: uc.accent }}>
                      {selectedCase === uc.id ? "Close" : "Demo"}
                    </button>
                    <button className="btn-gold" onClick={() => openOrder(uc)}
                      style={{ padding: "8px 20px", borderRadius: 8, fontSize: 11 }}>
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Demo */}
              {selectedCase === uc.id && (
                <div style={{ padding: "0 24px 24px", animation: "fadeIn 0.3s ease" }}>
                  <div style={{ background: "#00000040", borderRadius: 12, padding: 16, border: `1px solid ${uc.accent}20` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" }} />
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#22c55e" }}>VOICE PREVIEW</span>
                    </div>
                    <div style={{ background: "#0a080520", borderRadius: 8, padding: 16, fontStyle: "italic", color: "#c0b89c", fontSize: 15, lineHeight: 1.6, borderLeft: `3px solid ${uc.accent}40` }}>
                      "{uc.demo}"
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ LIVE CONVERSATION DEMO ═══ */}
      <div id="demo" style={{ padding: "100px 20px", background: "linear-gradient(180deg, #050302, #0a0805, #050302)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 4, color: GOLD.dark, textTransform: "uppercase", marginBottom: 12 }}>Live Demo</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: GOLD.white, marginBottom: 16 }}>
              Real Conversations. Real Results.
            </h2>
            <p style={{ color: "#706850", fontSize: 16 }}>Watch an Eden Voice Agent handle a live sales conversation</p>
          </div>

          <div style={{ background: "#0a0805", borderRadius: 20, border: `1px solid ${GOLD.dark}30`, overflow: "hidden", animation: "breathe 4s ease-in-out infinite" }}>
            {/* Demo Header */}
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${GOLD.dark}20`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: isPlaying ? "#22c55e" : "#ef4444", animation: isPlaying ? "pulse 1s infinite" : "none" }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: GOLD.base }}>
                  {isPlaying ? "CONVERSATION ACTIVE" : "READY"}
                </span>
              </div>
              <button className="btn-gold" onClick={() => { setDemoStep(0); setIsPlaying(true); }}
                style={{ padding: "8px 24px", borderRadius: 8, fontSize: 11 }}>
                {isPlaying ? "Playing..." : "▶ Start Demo"}
              </button>
            </div>

            {/* Messages */}
            <div ref={demoRef} style={{ padding: 24, minHeight: 360, maxHeight: 400, overflowY: "auto" }}>
              {LIVE_DEMO_MESSAGES.slice(0, demoStep + 1).map((msg, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 16, animation: "fadeUp 0.4s ease",
                }}>
                  <div style={{
                    maxWidth: "80%", padding: "14px 18px", borderRadius: 16,
                    background: msg.role === "agent" ? `linear-gradient(135deg, ${GOLD.dark}30, ${GOLD.dark}15)` : "#1a1a2e",
                    border: `1px solid ${msg.role === "agent" ? GOLD.dark + "40" : "#2a2a3e"}`,
                  }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: msg.role === "agent" ? GOLD.base : "#6366f1", marginBottom: 6, letterSpacing: 1 }}>
                      {msg.role === "agent" ? "🔱 EDEN AGENT" : "👤 PROSPECT"}
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.6, color: "#d0c8b8" }}>{msg.text}</div>
                  </div>
                </div>
              ))}
              {isPlaying && demoStep < LIVE_DEMO_MESSAGES.length - 1 && (
                <div style={{ display: "flex", gap: 6, padding: "10px 0" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD.base, opacity: 0.5, animation: `pulse 1s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ HOW IT WORKS ═══ */}
      <div style={{ padding: "100px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 4, color: GOLD.dark, textTransform: "uppercase", marginBottom: 12 }}>How We Ship</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: GOLD.white }}>
            From Order to Live in 48 Hours
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
          {[
            { step: "01", title: "Choose Your Agent", desc: "Pick from 18 industry solutions or request a custom build.", icon: "🎯" },
            { step: "02", title: "Customize Voice & Persona", desc: "Select voice tone, personality, scripts, and brand alignment.", icon: "🎨" },
            { step: "03", title: "We Build & Test", desc: "48-hour turnaround. Full QA with your team before launch.", icon: "⚡" },
            { step: "04", title: "Deploy & Earn", desc: "Goes live on your phone lines, website, or app. Revenue day one.", icon: "🚀" },
          ].map(({ step, title, desc, icon }) => (
            <div key={step} style={{ textAlign: "center", padding: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
              <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 36, color: GOLD.dark, opacity: 0.4, marginBottom: 8 }}>{step}</div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 18, color: GOLD.white, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "#706850", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CTA ═══ */}
      <div style={{ padding: "80px 20px", textAlign: "center", background: `radial-gradient(ellipse at center, ${GOLD.dark}15, transparent)` }}>
        <h2 style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 700, color: GOLD.base, marginBottom: 16 }}>
          Ready to Deploy Your Voice Agent?
        </h2>
        <p style={{ color: "#706850", fontSize: 16, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
          Every minute without an AI agent is a missed call, a lost lead, a deal that went to your competitor.
        </p>
        <button className="btn-gold" onClick={() => openOrder(USE_CASES[0])}
          style={{ padding: "18px 48px", borderRadius: 8, fontSize: 16 }}>
          Get Started Now
        </button>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div style={{ padding: "40px 20px", borderTop: `1px solid ${GOLD.dark}20`, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
          <EdenLogo />
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 16, color: GOLD.base }}>The Eden Project</span>
        </div>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#504830", letterSpacing: 1 }}>
          Beryl AI Labs · Voice Agents · Digital Souls · OWN THE SCIENCE 🔱
        </p>
      </div>

      {/* ═══ ORDER MODAL ═══ */}
      {showOrder && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowOrder(false); }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }} />
          <div style={{
            position: "relative", width: "100%", maxWidth: 520, background: "#0a0805",
            borderRadius: 20, border: `1px solid ${GOLD.dark}40`, overflow: "hidden",
            animation: "fadeUp 0.4s ease", maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ padding: "24px 28px", borderBottom: `1px solid ${GOLD.dark}20`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 700, color: GOLD.white }}>
                  {submitted ? "Order Received! 🔱" : `Order: ${orderCase?.title}`}
                </div>
                {!submitted && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: GOLD.dark, marginTop: 4 }}>{orderCase?.price} · {orderCase?.tag}</div>}
              </div>
              <button onClick={() => setShowOrder(false)}
                style={{ background: "none", border: "none", color: "#706850", fontSize: 24, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ padding: 28 }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🔱</div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 24, color: GOLD.base, marginBottom: 12 }}>We're On It</h3>
                  <p style={{ color: "#a09880", lineHeight: 1.6, marginBottom: 24 }}>
                    Your voice agent order has been received. Our team will reach out within 24 hours to begin customization.
                  </p>
                  <button className="btn-gold" onClick={() => setShowOrder(false)}
                    style={{ padding: "12px 32px", borderRadius: 8, fontSize: 13 }}>Close</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: GOLD.dark, letterSpacing: 1, display: "block", marginBottom: 6 }}>FULL NAME *</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your name" />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: GOLD.dark, letterSpacing: 1, display: "block", marginBottom: 6 }}>EMAIL *</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@company.com" />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: GOLD.dark, letterSpacing: 1, display: "block", marginBottom: 6 }}>COMPANY</label>
                    <input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Company name" />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: GOLD.dark, letterSpacing: 1, display: "block", marginBottom: 6 }}>PHONE</label>
                    <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(555) 000-0000" />
                  </div>
                  <div>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: GOLD.dark, letterSpacing: 1, display: "block", marginBottom: 6 }}>TELL US ABOUT YOUR USE CASE</label>
                    <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="What problem are you trying to solve?" />
                  </div>
                  <button className="btn-gold" onClick={submitOrder}
                    style={{ padding: "16px 32px", borderRadius: 8, fontSize: 14, marginTop: 8, width: "100%" }}>
                    Submit Order →
                  </button>
                  <p style={{ fontSize: 12, color: "#504830", textAlign: "center" }}>We'll contact you within 24 hours to begin building.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
