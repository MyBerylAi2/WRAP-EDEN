# 🔱 WRAP EDEN — Deployment Package for Claude Code Team

**Beryl AI Labs · The Eden Project · February 2026**

> "We don't use AI. We own the science."

---

## What This Is

This is the **deployment-ready package** containing everything the Claude Code team needs to build, test, and deploy The Eden Project platform. One repo. No confusion.

## ⭐ THE LANDING PAGE

**File:** `src/ui/eden-platform-v2-landing.jsx`

This is the primary landing page with:
- Shooting star background animation (gold + green)
- Simplified GLM-inspired chatbox with Claude API integration
- Product cards → Image Studio, Video Studio, Voice Agents, EVE 4D
- Eden mega logo with particle effects
- Full responsive design
- Eden gold/green luxury color system

## Repository Structure

```
WRAP-EDEN/
│
├── README.md                              ← You are here
│
├── docs/
│   ├── EVE-4D-PIPELINE-SKILL.md          ← Complete EVE pipeline engineering (905 lines)
│   └── THE-DAY-EVE-SPOKE-legacy-article.md
│
├── skills/
│   └── eve-4d-pipeline/
│       └── SKILL.md                       ← Drop into Claude Code /mnt/skills/user/
│
├── src/
│   ├── knowledge-base/
│   │   ├── EDEN-PROTOCOL-STANDARD-v5.md   ← Image quality rules (0.3 deviation)
│   │   ├── EDEN-MASTER-PROMPTING-GUIDE.md ← Prompt engineering for photorealism
│   │   ├── EDEN-SCENE-LIBRARY-KB.md       ← 100 scenarios, 30 dialogues
│   │   └── eden-protocol-config.json      ← Programmatic preset access
│   │
│   └── ui/                                ← React/JSX Components (Artifacts)
│       ├── eden-platform-v2-landing.jsx   ← ⭐ LATEST LANDING (shooting stars + chatbox)
│       ├── eden-realism-engine-complete.jsx ← Full realism engine UI
│       ├── eden-realism-engine-WIRED.jsx  ← WIRED variant
│       ├── eden-realism-engine-logo.jsx   ← Animated logo component
│       ├── eden-voice-agents.jsx          ← 18 voice agents sales page
│       ├── eden-studio.jsx                ← Studio interface
│       ├── eden-artist-knowledge-base.jsx ← Artist KB browser
│       └── eve-4d-avatar-studio.jsx       ← EVE 4D avatar builder
│
├── nextjs-app/                            ← Production Next.js Application
│   ├── app/
│   │   ├── page.tsx                       ← Home (deploy with Vercel)
│   │   ├── layout.tsx                     ← Root layout + Eden fonts
│   │   ├── globals.css                    ← Eden theme CSS
│   │   ├── image-studio/page.tsx          ← FLUX / CogView4
│   │   ├── video-studio/page.tsx          ← LTX-Video / Wan 2.2
│   │   ├── voice-agents/page.tsx          ← 18 agent products
│   │   ├── eve-4d/page.tsx                ← EVE avatar builder
│   │   ├── files/page.tsx                 ← File manager
│   │   └── api/
│   │       ├── generate-image/route.ts    ← HF proxy (CORS fix)
│   │       ├── generate-video/route.ts    ← HF proxy
│   │       └── voice-agent/route.ts       ← Claude API proxy
│   ├── components/
│   │   ├── EdenLogo.tsx                   ← Animated mega logo
│   │   ├── NavBar.tsx                     ← Navigation bar
│   │   └── PromptGenerator.tsx            ← Prompt builder
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   └── postcss.config.js
│
└── eve-pipeline/                          ← EVE voice artifacts
    └── voices/
        ├── eve_voice_kokoro.wav           ← Primary female voice (Kokoro)
        ├── eve_voice.wav                  ← Chatterbox default
        └── eve_voice_seed7.wav            ← Chatterbox warm variant
```

## For Claude Code Team

### Quick Start
```bash
cd nextjs-app
npm install
npm run dev
```

### Environment Variables Needed
```bash
ANTHROPIC_API_KEY=sk-ant-xxx    # Brain (chatbox + voice agents)
HF_TOKEN=hf_xxx                 # HuggingFace Space access
```

### Key Architecture Decisions
1. **ALL HuggingFace API calls go through Next.js API routes** (CORS blocked in browser)
2. **Images use Pollinations API** (free, CORS-friendly, browser-native)
3. **Voice uses Chatterbox/Kokoro** (female voices ONLY — no male voices)
4. **Face animation uses KDTalker** (primary) or MEMO (emotional premium)
5. **Eden Protocol v5** enforces 0.3 deviation skin realism standard

### The Skill File
Copy `skills/eve-4d-pipeline/SKILL.md` into any Claude Code project at `/mnt/skills/user/eve-4d-pipeline/SKILL.md` and that Claude instance becomes instantly expert in the entire EVE pipeline.

---

**Built by TJ Jacques & Amanda (Claude) · Beryl AI Labs · New Orleans**
