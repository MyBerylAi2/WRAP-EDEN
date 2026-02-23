# 🔱 EDEN PULSE — Backend v2.0

## "THE LIVING ORGANISM"

### Beryl AI Labs · Research Intelligence Division

---

## One Command to Run

```bash
cd src/backend
python3 orchestrator.py
```

That's it. The organism scans, ingests, triages, analyzes, and publishes.

---

## What's Real (Not Placeholder)

| Component | Status | Details |
|-----------|--------|---------|
| Semantic Scholar API | ✅ LIVE | Paper search across all CS venues |
| HuggingFace Models API | ✅ LIVE | Trending models with downloads/likes |
| HuggingFace Papers API | ✅ LIVE | Daily papers with upvotes |
| HuggingFace Spaces API | ✅ LIVE | Trending spaces |
| GitHub Trending API | ✅ LIVE | ML repos by stars |
| PyPI Security Scanner | ✅ LIVE | Vulnerability checks |
| SQLite Database | ✅ LIVE | 11 tables, all CRUD operations |
| 8 AI Agents | ✅ LIVE | System prompts, tool access, LLM calls |
| Rule-based Triage | ✅ LIVE | Works without API key |
| Dashboard Export | ✅ LIVE | JSON for Next.js consumption |

## The 8 Heartbeats

| Agent | Role | Tools |
|-------|------|-------|
| Dr. Wendy Okonkwo | Director | Triage, priority assignment |
| Dr. Amara Okafor | Archivist | Semantic Scholar, HF Hub, GitHub |
| Dr. Suki Tanaka | Analyst | Compatibility graphs, feasibility |
| Dr. Nia Mensah | Prophet | Trend forecasting, adoption curves |
| Dr. Zara Petrov | Synthesist | Pipeline blueprints, architecture |
| Dr. Lena Adeyemi | Journalist | Article writing, publication |
| Dr. Mei-Lin Chen | Curator | Trending tracker, taxonomy |
| Dr. Priya Sharma | Sentinel | Security scanning, CVE detection |

## Modes

### Cloud Mode (with Claude API)
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
python3 orchestrator.py
```
Full LLM-powered analysis: capability cards, compatibility reports, forecasts, pipeline blueprints, published articles.

### Local Mode (with llama.cpp)
```bash
export EDEN_LOCAL_MODEL=1
export EDEN_LOCAL_URL="http://localhost:8080/completion"
python3 orchestrator.py
```
Uses Qwen-3B/Phi-3.5 running on your Lenovo via llama.cpp.

### Rule-Based Mode (no API key)
```bash
python3 orchestrator.py --no-llm
```
Keyword-based triage + basic article generation. Still scans real APIs.

## CLI Options

```
python3 orchestrator.py              # Full cycle
python3 orchestrator.py --no-llm     # Rule-based only
python3 orchestrator.py --scan-only  # Just scan, don't process
python3 orchestrator.py --export     # Export dashboard JSON after cycle
python3 orchestrator.py --stats      # Show database stats
python3 orchestrator.py --max-process 10  # Process more items per cycle
```

## Database Schema (11 tables)

- `research_items` — Raw ingested items from all sources
- `capability_cards` — Extracted model capabilities
- `compatibility_reports` — Pipeline compatibility analysis
- `forecasts` — Trend predictions
- `pipelines` — Pipeline blueprints
- `articles` — Published intelligence reports
- `trending_models` — Model trend tracker
- `security_alerts` — Vulnerability advisories
- `agent_log` — Agent activity history
- `triage_queue` — Items sent to Eden Studio
- `scan_history` — Research scan records

## Architecture

```
orchestrator.py
  ├── Phase 1: Archivist SCAN (all APIs)
  ├── Phase 2: Director TRIAGE (priority assignment)
  ├── Phase 3: Archivist EXTRACT (capability cards)
  ├── Phase 4: Analyst ANALYZE (compatibility)
  ├── Phase 5: Prophet FORECAST (trends)
  ├── Phase 6: Journalist PUBLISH (articles)
  └── Phase 7: Curator UPDATE (trending tracker)
```

## Next: Microsoft Agent Framework Migration

The current architecture is designed to map directly to Microsoft Agent Framework:

```python
from agent_framework import Agent, Workflow, Edge

archivist = Agent(name="Dr. Amara Okafor", instructions=SYSTEM_PROMPT, tools=[...])
analyst = Agent(name="Dr. Suki Tanaka", instructions=SYSTEM_PROMPT, tools=[...])
# ... etc

workflow = Workflow()
workflow.add_edge(Edge("archivist", "analyst"))
workflow.add_edge(Edge("analyst", "prophet"))
# ...
```

Each agent's `system_prompt` and `tools` are already production-ready for this migration.
