# 🔱 EDEN PULSE v2.0 — BUILDER CONTEXT REFERENCE
## FOR CLAUDE CODE TEAMS · Beryl AI Labs · February 2026
## "THE RELENTLESS EYE" — Research Intelligence Division

---

## ⚡ CRITICAL: READ THIS FIRST

This document is the **single source of truth** for building Eden Pulse. Do not deviate. Do not ask TJ for clarification — decide and execute.

**Protocol:** No Human In The Loop (NHITL). Autonomous execution. No burnout engineering. If something breaks twice, stop and find better code.

---

## 1. WHAT IS EDEN PULSE?

Eden Pulse is a DARPA-grade autonomous research intelligence division powered by 8 AI agents (1 Director + 7 Heartbeats) on Microsoft Agent Framework. It continuously scans, extracts, analyzes, predicts, and publishes AI research intelligence.

**The Flow:** Eden Pulse → Eden Triage → Eden Studio → Production

---

## 2. THE TEAM — 1 DIRECTOR + 7 HEARTBEATS

| # | Title | Name | Ph.D. | University | Model | Section |
|---|-------|------|-------|------------|-------|---------|
| 👑 | DIRECTOR | Dr. Wendy Okonkwo | AI Research Strategy | Carnegie Mellon | Claude Opus | Dept oversight, governance |
| 📜 | ARCHIVIST | Dr. Amara Okafor | Comp. Linguistics | MIT | Qwen-3B | Paper Vault + Feed (extraction) |
| 🔬 | ANALYST | Dr. Suki Tanaka | Systems Engineering | Stanford | Phi-3.5 | Laying Pipe (validation) + Warnings |
| 🔮 | PROPHET | Dr. Nia Mensah | Predictive Analytics | Oxford | Qwen-3B | Pulse Radar + Forecasts |
| ⚗️ | SYNTHESIST | Dr. Zara Petrov | Multimodal AI | ETH Zurich | Qwen-Coder-3B | Laying Pipe (creation) |
| 📰 | JOURNALIST | Dr. Lena Adeyemi | Science Comm. | Columbia | Qwen-3B | Alluvial Feed (writing) + Reports |
| 📚 | CURATOR | Dr. Mei-Lin Chen | Info Science | UC Berkeley | Qwen-3B | Paper Vault + Knowledge Base |
| 🛡️ | SENTINEL | Dr. Priya Sharma | Cybersecurity | IIT Delhi | Phi-3.5 | Security + 0.3 Rule + QA |

---

## 3. AUTONOMOUS RESEARCH CYCLES — THE HEARTBEAT

**Content posting is 100% autonomous. No human approval needed.**

### Scan Frequencies

| Agent | Source | Frequency | Cron (CST) |
|-------|--------|-----------|------------|
| ARCHIVIST | arXiv API | Every 6 hours | 0 0,6,12,18 * * * |
| ARCHIVIST | HuggingFace Model Cards | Every 2 hours | 0 */2 * * * |
| ARCHIVIST | GitHub Trending AI | Every 12 hours | 0 6,18 * * * |
| ANALYST | Archivist Output | Event-driven | On trigger |
| PROPHET | HF Trending API | Hourly | 0 * * * * |
| PROPHET | Adoption Recalc | Every 6 hours | 0 3,9,15,21 * * * |
| SYNTHESIST | Pipeline Eval | Event-driven | On trigger |
| SYNTHESIST | Compatibility Check | Every 4 hours | 0 2,6,10,14,18,22 * * * |
| JOURNALIST | Article Gen | Event-driven | On trigger |
| JOURNALIST | Weekly Digest | Fridays 6pm | 0 18 * * 5 |
| CURATOR | Vault Sync | Every 4 hours | 0 1,5,9,13,17,21 * * * |
| CURATOR | Drive Sync | Every 8 hours | 0 4,12,20 * * * |
| SENTINEL | Security Scan | Every 2 hours | 0 */2 * * * |
| SENTINEL | 0.3 Rule Validation | Event-driven | On trigger |
| DIRECTOR | Dept Review | Daily 8am | 0 8 * * * |
| DIRECTOR | Strategy Brief | Mondays 9am | 0 9 * * 1 |

### Post-Article Autonomous Pipeline

```
ARTICLE PUBLISHED
    │
    ├──→ SENTINEL validates (0.3 Rule, anti-detect, security)
    │         └── FAIL → flag + hold from triage
    │         └── PASS → continue
    │
    ├──→ CURATOR archives to Paper Vault + tags + Drive sync
    ├──→ PROPHET recalculates spike probability for related models
    │
    ├──→ IF feasibility_score >= 75:
    │         └── SYNTHESIST → pipeline blueprint
    │         └── ANALYST → compatibility check
    │         └── → EDEN TRIAGE queue
    │
    ├──→ IF priority == "critical":
    │         └── DIRECTOR notified → genesis note
    │         └── BREAKING INTELLIGENCE updated
    │
    └──→ ALL AGENTS check for new assignments (next scan cycle)
```

### Model Loading (Lenovo — Sequential)

```
1. Archivist loads Qwen-3B → processes → unloads
2. Analyst loads Phi-3.5 → processes → unloads
3. Prophet loads Qwen-3B → processes → unloads
4. Synthesist loads Qwen-Coder-3B → processes → unloads
5. Journalist loads Qwen-3B → produces article → unloads
6. Curator loads Qwen-3B → archives → unloads
7. Sentinel loads Phi-3.5 → validates → unloads

~3-5 min per item · ~100-200 items/day
```

---

## 4. DATABASE SCHEMA (SQLite → Prisma)

```prisma
model Article {
  id               String   @id @default(uuid())
  title            String
  subtitle         String
  body             String   @db.Text
  category         String
  priority         String
  tags             String
  authors          String   // JSON array of agent IDs
  journal          String
  volume           String
  cited            Int      @default(0)
  thumbnail_prompt String
  thumbnail_url    String?
  feasibility      Int?
  spike            Float?
  status           String   @default("published")
  created_at       DateTime @default(now())
  updated_at       DateTime @updatedAt
}

model CapabilityCard {
  id            String   @id @default(uuid())
  model_name    String
  architecture  String
  modalities    String
  params        String
  vram_min      String
  fps_stats     String
  paper_url     String?
  hf_url        String?
  github_url    String?
  extracted_by  String
  created_at    DateTime @default(now())
}

model Pipeline {
  id                String   @id @default(uuid())
  name              String
  description       String
  components        String
  flow              String
  gpu_requirement   String
  latency           String
  fps               Int?
  probability_score Int
  status            String
  created_by        String
  created_at        DateTime @default(now())
}

model TrendingModel {
  id            String   @id @default(uuid())
  name          String
  category      String
  spike         Float
  direction     String
  change        String
  tracked_since DateTime @default(now())
  updated_at    DateTime @updatedAt
}

model Forecast {
  id            String @id @default(uuid())
  model_name    String
  trend_30d     String
  trend_90d     String
  lifespan      String
  hype_position String
  market_impact String
  gpu_cost_note String?
  created_at    DateTime @default(now())
}

model Warning {
  id         String   @id @default(uuid())
  model_name String
  issue      String
  severity   String
  resolved   Boolean  @default(false)
  created_at DateTime @default(now())
}
```

---

## 5. DASHBOARD DESIGN SPEC

- **Background:** Onyx #080503, gold/green accents
- **Fonts:** Cinzel Decorative (logo), Cinzel (headers)
- **Bylines:** NEJM/Lancet journal style — photos, credentials, citations
- **Breaking Intelligence:** White #FFFFFF panel, dark green #1B5E20 bold headings
- **Nav Tabs:** Gold gradient, dark green text, hover flash animation
- **Logo:** Clover sprouting from middle E of "EDEN PULSE"
- **Nav Menu:** Top AND bottom of every page globally

### Nav Items (global, top + bottom):
1. HOME (/) 2. IMAGE STUDIO (/image-studio) 3. EVE 4D (/eve-4d)
4. **EDEN PULSE (/eden-pulse)** 5. FILES (/files) 6. SETTINGS (/settings)

---

## 6. FILE STRUCTURE

```
WRAP-EDEN/
├── nextjs-app/app/
│   ├── eden-pulse/page.tsx
│   ├── api/pulse/{feed,agents,trending,pipelines,triage,scan}/route.ts
│   └── page.tsx (landing)
├── nextjs-app/public/portraits/ (8 ERE-1 team photos)
├── src/ui/eden-pulse-dashboard.jsx
├── pulse-backend/
│   ├── agents/{archivist,analyst,prophet,synthesist,journalist,curator,sentinel,director}.py
│   ├── workflow.py · scheduler.py · post_publish.py
│   ├── scanners/{arxiv,hf_trending,github_trending,gdrive_watcher}.py
│   └── database/pulse.db
├── prisma/schema.prisma
└── docs/EDEN-PULSE-BUILDER-CONTEXT.md (THIS FILE)
```

---

## 7. API ROUTES

| Method | Route | Purpose |
|--------|-------|---------|
| GET | /api/pulse/feed | All articles + reports |
| GET | /api/pulse/agents | Agent status + stats |
| GET | /api/pulse/trending | Trending models + spikes |
| GET | /api/pulse/pipelines | Pipeline probability scores |
| POST | /api/pulse/triage | Send to Eden Triage |
| POST | /api/pulse/scan | Trigger new research scan |

---

## 8. COST

| Component | Cost |
|-----------|------|
| Agent Framework + local models | FREE |
| arXiv + HF + GitHub APIs | FREE |
| ERE-1 Thumbnails (A10G) | $0.60/hr |
| Claude API (Director) | $3/MTok |
| **Daily Total** | **~$0-5** |

---

*"We don't summarize. We extract. We simulate. We improve." · "Own the Science."*
