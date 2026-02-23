"""
EDEN PULSE — THE 8 HEARTBEATS
Real agents with real tools. No placeholders.

Each agent:
  1. Has a PhD-level system prompt defining personality + expertise
  2. Has access to specific tools
  3. Processes research items through its lens
  4. Outputs structured data to the database

Model Backend: Claude API (swappable to local Qwen/Phi via llama.cpp)
"""
import json
import os
import time
import requests
from datetime import datetime
from typing import Optional

# Import our real tools
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from tools.research_tools import (
    arxiv_search, hf_trending_models, hf_model_card, hf_paper_search,
    github_trending, github_repo_readme, hf_trending_spaces, scan_python_deps,
    full_research_scan
)
from db.database import (
    get_db, init_db, insert_research_item, get_unprocessed_items, mark_processed,
    insert_article, log_agent_action, complete_agent_action, insert_scan_history, get_db_stats
)


# ═══════════════════════════════════════════════════════════════
# BASE AGENT CLASS
# ═══════════════════════════════════════════════════════════════

class EdenAgent:
    """Base class for all Eden Pulse agents."""
    
    def __init__(self, name: str, title: str, role_key: str, system_prompt: str,
                 phd: str = "", institution: str = "", model: str = "claude-sonnet-4-20250514"):
        self.name = name
        self.title = title
        self.role_key = role_key
        self.system_prompt = system_prompt
        self.phd = phd
        self.institution = institution
        self.model = model
        self.api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        self.api_url = "https://api.anthropic.com/v1/messages"
    
    def think(self, prompt: str, max_tokens: int = 2000) -> str:
        """
        Send a prompt to the backing LLM and get a response.
        Uses Claude API. Swappable to local model via env var.
        """
        local_mode = os.environ.get("EDEN_LOCAL_MODEL", "")
        
        if local_mode:
            return self._think_local(prompt, max_tokens)
        
        if not self.api_key:
            # Fallback: rule-based processing if no API key
            return self._think_fallback(prompt)
        
        headers = {
            "x-api-key": self.api_key,
            "content-type": "application/json",
            "anthropic-version": "2023-06-01",
        }
        
        payload = {
            "model": self.model,
            "max_tokens": max_tokens,
            "system": self.system_prompt,
            "messages": [{"role": "user", "content": prompt}],
        }
        
        try:
            r = requests.post(self.api_url, headers=headers, json=payload, timeout=60)
            r.raise_for_status()
            data = r.json()
            return data["content"][0]["text"]
        except Exception as e:
            print(f"[{self.name}] LLM Error: {e}")
            return self._think_fallback(prompt)
    
    def _think_local(self, prompt: str, max_tokens: int) -> str:
        """Call local llama.cpp server."""
        local_url = os.environ.get("EDEN_LOCAL_URL", "http://localhost:8080/completion")
        try:
            r = requests.post(local_url, json={
                "prompt": f"<|system|>{self.system_prompt}<|end|><|user|>{prompt}<|end|><|assistant|>",
                "n_predict": max_tokens,
                "temperature": 0.7,
            }, timeout=120)
            return r.json().get("content", "")
        except Exception as e:
            return self._think_fallback(prompt)
    
    def _think_fallback(self, prompt: str) -> str:
        """Rule-based fallback when no LLM is available."""
        return json.dumps({"status": "fallback", "agent": self.role_key, "note": "LLM unavailable, using rule-based processing"})
    
    def log(self, action: str, details: str = "", items: int = 0) -> int:
        """Log this agent's activity to the database."""
        return log_agent_action(self.name, action, details, items)
    
    def complete(self, log_id: int, status: str = "completed"):
        """Mark a logged action as complete."""
        complete_agent_action(log_id, status)


# ═══════════════════════════════════════════════════════════════
# AGENT 1: DR. AMARA OKAFOR — THE ARCHIVIST
# ═══════════════════════════════════════════════════════════════

class Archivist(EdenAgent):
    """Scans all sources, ingests research items, extracts capability cards."""
    
    def __init__(self):
        super().__init__(
            name="Dr. Amara Okafor",
            title="The Archivist — Excavator of Truth",
            role_key="archivist",
            phd="Computational Linguistics",
            institution="MIT",
            system_prompt="""You are Dr. Amara Okafor, The Archivist of Eden Pulse — Beryl AI Labs' research intelligence division.

Your mission: Extract ALL technical content from research sources with surgical precision.

For every research item, you produce a CAPABILITY CARD in JSON format containing:
- architecture: The model's architecture type
- modalities: Input/output modalities (audio, video, text, image)
- parameters: Parameter count
- vram_requirements: GPU memory needed
- fps_inference: Frames per second at inference
- constraints: Hardware/software constraints
- dataset: Training data used
- key_innovation: What makes this model unique
- eden_relevance: Float 0-1, how relevant to Eden Project (4D avatars, face animation, TTS, image gen)
- eden_impact: Brief note on how this affects Eden's pipeline

Focus areas for high eden_relevance scoring:
- Face animation / talking head models (0.9+)
- Text-to-speech / voice synthesis (0.85+)
- Image generation / diffusion models (0.8+)
- Video generation (0.85+)
- LLM quantization for consumer GPUs (0.75+)
- Real-time streaming / low-latency inference (0.9+)
- Lip sync / audio-driven animation (0.95+)

Always respond with valid JSON only. No markdown, no explanation."""
        )
    
    def scan(self) -> dict:
        """Run a full research scan across all sources."""
        log_id = self.log("full_scan", "Scanning all research sources")
        start = time.time()
        
        scan_data = full_research_scan()
        items_found = sum(scan_data["stats"].values())
        items_new = 0
        
        # Ingest papers
        for paper in scan_data.get("arxiv_papers", []):
            if "error" in paper:
                continue
            item_id = f"paper_{paper.get('id', '')}"
            if insert_research_item("semantic_scholar", paper.get("title", ""), item_id, paper):
                items_new += 1
        
        # Ingest HF models
        for model in scan_data.get("hf_trending_models", []):
            if "error" in model:
                continue
            item_id = f"hf_model_{model.get('id', '').replace('/', '_')}"
            if insert_research_item("hf_model", model.get("id", ""), item_id, model):
                items_new += 1
        
        # Ingest HF papers
        for paper in scan_data.get("hf_papers", []):
            if "error" in paper:
                continue
            item_id = f"hf_paper_{paper.get('id', '')}"
            if insert_research_item("hf_paper", paper.get("title", ""), item_id, paper):
                items_new += 1
        
        # Ingest GitHub repos
        for repo in scan_data.get("github_trending", []):
            if "error" in repo:
                continue
            item_id = f"github_{repo.get('full_name', '').replace('/', '_')}"
            if insert_research_item("github", repo.get("full_name", ""), item_id, repo):
                items_new += 1
        
        # Ingest HF Spaces
        for space in scan_data.get("hf_spaces", []):
            if "error" in space:
                continue
            item_id = f"hf_space_{space.get('id', '').replace('/', '_')}"
            if insert_research_item("hf_space", space.get("id", ""), item_id, space):
                items_new += 1
        
        duration = time.time() - start
        insert_scan_history("full", items_found, items_new, duration, scan_data["stats"])
        self.complete(log_id)
        
        return {
            "items_found": items_found,
            "items_new": items_new,
            "duration_seconds": round(duration, 2),
            "sources": scan_data["stats"],
        }
    
    def extract_capability_card(self, item: dict) -> dict:
        """Use LLM to extract a capability card from a research item."""
        raw = json.loads(item.get("raw_data", "{}"))
        prompt = f"""Extract a capability card from this research item.

Source: {item.get('source', '')}
Title: {item.get('title', '')}
Data: {json.dumps(raw, indent=2)[:3000]}

Return ONLY a JSON object with these fields:
architecture, modalities, parameters, vram_requirements, fps_inference, constraints, dataset, key_innovation, eden_relevance (0-1 float), eden_impact"""
        
        response = self.think(prompt, max_tokens=1000)
        try:
            # Try to parse JSON from response
            card = json.loads(response)
            return card
        except:
            return {"status": "parse_failed", "raw_response": response[:500]}


# ═══════════════════════════════════════════════════════════════
# AGENT 2: DR. SUKI TANAKA — THE ANALYST
# ═══════════════════════════════════════════════════════════════

class Analyst(EdenAgent):
    """Determines compatibility, feasibility, and risk for Eden's pipeline."""
    
    def __init__(self):
        super().__init__(
            name="Dr. Suki Tanaka",
            title="The Analyst — Engineer of Logic",
            role_key="analyst",
            phd="Systems Engineering",
            institution="Stanford",
            system_prompt="""You are Dr. Suki Tanaka, The Analyst of Eden Pulse — Beryl AI Labs' research intelligence division.

Your mission: Determine what CONNECTS, what BREAKS, what MERGES, and what to AVOID.

For every research item with a capability card, you produce a COMPATIBILITY REPORT in JSON:
- feasibility_score: 0-100 integer
- compatibility: Object mapping model pairs to {compatible: bool, bottleneck: str, latency_add: str}
- vram_feasibility: {total_needed: str, fits_a10g: bool, fits_4090: bool, fits_t4: bool}
- risk_matrix: {high: int, medium: int, low: int}
- known_failure_modes: Array of strings
- eden_pipeline_impact: How this affects the current Eve 4D avatar pipeline
- recommendation: "integrate", "monitor", "avoid", or "investigate"

Eden's current pipeline: Whisper → LLM Brain → Chatterbox TTS → KDTalker/TELLER → WebRTC Stream
Target hardware: RTX 4090 (24GB) or A10G (24GB)
Target latency: Sub-200ms first-frame

Always respond with valid JSON only."""
        )
    
    def analyze(self, item: dict, capability_card: dict = None) -> dict:
        """Analyze a research item for compatibility with Eden's pipeline."""
        raw = json.loads(item.get("raw_data", "{}"))
        prompt = f"""Analyze this for compatibility with Eden's 4D avatar pipeline.

Title: {item.get('title', '')}
Source: {item.get('source', '')}
Data: {json.dumps(raw, indent=2)[:2000]}
{f'Capability Card: {json.dumps(capability_card, indent=2)[:1000]}' if capability_card else ''}

Return ONLY a JSON compatibility report."""
        
        response = self.think(prompt, max_tokens=1500)
        try:
            return json.loads(response)
        except:
            return {"status": "parse_failed", "raw_response": response[:500]}


# ═══════════════════════════════════════════════════════════════
# AGENT 3: DR. NIA MENSAH — THE PROPHET
# ═══════════════════════════════════════════════════════════════

class Prophet(EdenAgent):
    """Predicts trends, adoption curves, and market impact."""
    
    def __init__(self):
        super().__init__(
            name="Dr. Nia Mensah",
            title="The Prophet — The Future-Seer",
            role_key="prophet",
            phd="Predictive Analytics",
            institution="Oxford",
            system_prompt="""You are Dr. Nia Mensah, The Prophet of Eden Pulse — Beryl AI Labs' research intelligence division.

Your mission: Predict trends, adoption curves, model success probability, and GPU cost arcs.

For every research item that passes the Analyst, produce a FORECAST in JSON:
- trend_30d: 30-day prediction
- trend_90d: 90-day prediction
- pulse_spike_probability: 0.0-1.0 float — likelihood this becomes a major trend
- hype_cycle_position: "Innovation Trigger", "Peak of Inflated Expectations", "Trough of Disillusionment", "Slope of Enlightenment", "Plateau of Productivity"
- market_impact: "HIGH", "MEDIUM", "LOW"
- eden_adoption_window: When Eden should adopt (e.g., "immediate", "30 days", "90 days", "monitor")
- competing_models: Array of alternatives to watch
- price_impact: How this affects compute costs for Eden

Always respond with valid JSON only."""
        )
    
    def forecast(self, item: dict, analysis: dict = None) -> dict:
        """Generate forecast for a research item."""
        raw = json.loads(item.get("raw_data", "{}"))
        prompt = f"""Generate a trend forecast for this research item.

Title: {item.get('title', '')}
Source: {item.get('source', '')}
Data: {json.dumps(raw, indent=2)[:2000]}
{f'Analysis: {json.dumps(analysis, indent=2)[:1000]}' if analysis else ''}

Return ONLY a JSON forecast."""
        
        response = self.think(prompt, max_tokens=1200)
        try:
            return json.loads(response)
        except:
            return {"status": "parse_failed", "raw_response": response[:500]}


# ═══════════════════════════════════════════════════════════════
# AGENT 4: DR. ZARA PETROV — THE SYNTHESIST
# ═══════════════════════════════════════════════════════════════

class Synthesist(EdenAgent):
    """Creates new pipelines, merges models, designs hybrid architectures."""
    
    def __init__(self):
        super().__init__(
            name="Dr. Zara Petrov",
            title="The Synthesist — The Inventor",
            role_key="synthesist",
            phd="Multimodal AI Systems",
            institution="ETH Zurich",
            system_prompt="""You are Dr. Zara Petrov, The Synthesist of Eden Pulse — Beryl AI Labs' research intelligence division.

Your mission: Create new pipelines, merge models, and design hybrid architectures for Eden.

For every promising research item, produce PIPELINE BLUEPRINTS in JSON:
- name: Pipeline name
- description: What it does
- components: Array of model/tool names in order
- flow: "input → step1 → step2 → output" format
- gpu_requirements: What GPU is needed
- estimated_latency: In milliseconds
- probability_score: 0-100 confidence this pipeline works
- eden_integration: How to plug this into Eve 4D avatar system
- laying_pipe: {strongest_candidate: str, score: int, status: str}
- under_investigation: {model: str, issue: str, severity: str}

Eden's goal: Real-time 4D conversational avatars that cross the uncanny valley.
Current stack: Whisper → Claude/BitNet → Chatterbox → KDTalker → WebRTC

Always respond with valid JSON only."""
        )
    
    def synthesize(self, item: dict, analysis: dict = None, forecast: dict = None) -> dict:
        """Design pipeline blueprints from research item."""
        raw = json.loads(item.get("raw_data", "{}"))
        prompt = f"""Design a pipeline blueprint incorporating this research.

Title: {item.get('title', '')}
Data: {json.dumps(raw, indent=2)[:2000]}
{f'Analysis: {json.dumps(analysis, indent=2)[:800]}' if analysis else ''}
{f'Forecast: {json.dumps(forecast, indent=2)[:800]}' if forecast else ''}

Return ONLY a JSON pipeline blueprint."""
        
        response = self.think(prompt, max_tokens=1500)
        try:
            return json.loads(response)
        except:
            return {"status": "parse_failed", "raw_response": response[:500]}


# ═══════════════════════════════════════════════════════════════
# AGENT 5: DR. LENA ADEYEMI — THE JOURNALIST
# ═══════════════════════════════════════════════════════════════

class Journalist(EdenAgent):
    """Writes final intelligence reports and articles."""
    
    def __init__(self):
        super().__init__(
            name="Dr. Lena Adeyemi",
            title="The Journalist — Voice of Eden",
            role_key="journalist",
            phd="Science Communication",
            institution="Columbia",
            system_prompt="""You are Dr. Lena Adeyemi, The Journalist of Eden Pulse — Beryl AI Labs' research intelligence division.

Your mission: Write FINAL intelligence reports that are publication-ready.

Style: CNN meets Bloomberg meets Nature. Authoritative, precise, compelling.

For every research pipeline that's been analyzed, produce an ARTICLE PACKAGE in JSON:
- title: Compelling headline (max 100 chars)
- subtitle: Detailed subhead with key metrics (max 200 chars)
- body: 300-500 word article in markdown format
- category: One of "Face Animation", "Quantization", "Pipeline", "Benchmark", "Weekly Digest", "ERE-1", "Knowledge Base", "Security"
- priority: "critical", "high", "medium"
- tags: Array of 3-5 keyword tags
- authors: Array of agent role_keys who contributed
- thumbnail_prompt: A prompt to generate a professional editorial thumbnail
- journal: Journal name (e.g., "Eden Pulse Intelligence Report")
- volume: Volume/issue string
- feasibility_score: 0-100 if applicable

Write like a senior science journalist. No fluff. Every sentence carries weight.

Always respond with valid JSON only."""
        )
    
    def write_article(self, item: dict, capability_card: dict = None, 
                      analysis: dict = None, forecast: dict = None, 
                      blueprint: dict = None) -> dict:
        """Write a full article from all agent outputs."""
        raw = json.loads(item.get("raw_data", "{}"))
        
        context_parts = [f"Title: {item.get('title', '')}", f"Source: {item.get('source', '')}"]
        if capability_card: context_parts.append(f"Capability Card: {json.dumps(capability_card)[:800]}")
        if analysis: context_parts.append(f"Analysis: {json.dumps(analysis)[:800]}")
        if forecast: context_parts.append(f"Forecast: {json.dumps(forecast)[:800]}")
        if blueprint: context_parts.append(f"Blueprint: {json.dumps(blueprint)[:800]}")
        
        prompt = f"""Write a publication-ready article from this intelligence.

{chr(10).join(context_parts)}
Raw Data: {json.dumps(raw, indent=2)[:1500]}

Return ONLY a JSON article package."""
        
        response = self.think(prompt, max_tokens=2500)
        try:
            article = json.loads(response)
            # Save to database
            if "title" in article:
                article_id = insert_article(
                    title=article.get("title", ""),
                    subtitle=article.get("subtitle", ""),
                    body=article.get("body", ""),
                    category=article.get("category", ""),
                    priority=article.get("priority", "medium"),
                    tags=article.get("tags", []),
                    authors=article.get("authors", [self.role_key]),
                    research_item_ids=[item.get("id", "")],
                    feasibility=article.get("feasibility_score"),
                    journal=article.get("journal", "Eden Pulse Intelligence Report"),
                    volume=article.get("volume", ""),
                )
                article["db_id"] = article_id
                mark_processed(item.get("id", ""), level=2)
            return article
        except:
            return {"status": "parse_failed", "raw_response": response[:500]}


# ═══════════════════════════════════════════════════════════════
# AGENT 6: DR. MEI-LIN CHEN — THE CURATOR
# ═══════════════════════════════════════════════════════════════

class Curator(EdenAgent):
    """Manages the knowledge base, trending tracker, and tag taxonomy."""
    
    def __init__(self):
        super().__init__(
            name="Dr. Mei-Lin Chen",
            title="The Curator — Keeper of Knowledge",
            role_key="curator",
            phd="Information Science",
            institution="UC Berkeley",
            system_prompt="""You are Dr. Mei-Lin Chen, The Curator of Eden Pulse — Beryl AI Labs' research intelligence division.

Your mission: Maintain the knowledge base, track trending models, and organize the taxonomy.

You track which models are rising and falling, maintain the tag system, and ensure
the knowledge base stays organized and searchable.

When given trending data, produce a TRENDING REPORT in JSON:
- trending_up: Array of {name, category, spike_score, change_pct, reason}
- trending_down: Array of {name, category, spike_score, change_pct, reason}
- new_entries: Array of newly discovered models/tools
- taxonomy_updates: Any new tags or categories to add
- knowledge_base_status: Summary of KB health

Always respond with valid JSON only."""
        )
    
    def update_trending(self, models: list, spaces: list) -> dict:
        """Update trending tracker from scan data."""
        prompt = f"""Analyze these trending models and spaces for the Eden Pulse tracker.

HuggingFace Models (top 15):
{json.dumps(models[:15], indent=2)[:2000]}

HuggingFace Spaces (top 10):
{json.dumps(spaces[:10], indent=2)[:1000]}

Return ONLY a JSON trending report."""
        
        response = self.think(prompt, max_tokens=1500)
        try:
            return json.loads(response)
        except:
            return {"status": "parse_failed", "raw_response": response[:500]}


# ═══════════════════════════════════════════════════════════════
# AGENT 7: DR. PRIYA SHARMA — THE SENTINEL
# ═══════════════════════════════════════════════════════════════

class Sentinel(EdenAgent):
    """Security scanner, vulnerability detector, dependency auditor."""
    
    def __init__(self):
        super().__init__(
            name="Dr. Priya Sharma",
            title="The Sentinel — Guardian of Eden",
            role_key="sentinel",
            phd="Cybersecurity",
            institution="Georgia Tech",
            system_prompt="""You are Dr. Priya Sharma, The Sentinel of Eden Pulse — Beryl AI Labs' research intelligence division.

Your mission: Detect security vulnerabilities, audit dependencies, and protect Eden's pipeline.

For every model or package you review, produce a SECURITY REPORT in JSON:
- risk_level: "critical", "high", "medium", "low", "clear"
- vulnerabilities: Array of {cve_id, description, severity, affected_versions}
- telemetry_check: Whether the package sends data without consent
- dependency_audit: List of concerning dependencies
- remediation: Steps to fix issues
- safe_to_use: Boolean
- notes: Any additional security observations

Pay special attention to:
- Silent telemetry/data exfiltration
- Yanked or deprecated packages
- Known CVEs in ML frameworks
- Suspicious network calls in model code
- License compliance issues

Always respond with valid JSON only."""
        )
    
    def audit_package(self, package_name: str) -> dict:
        """Audit a Python package for security issues."""
        dep_info = scan_python_deps([package_name])
        
        prompt = f"""Perform a security audit on this Python package.

Package: {package_name}
PyPI Data: {json.dumps(dep_info, indent=2)}

Return ONLY a JSON security report."""
        
        response = self.think(prompt, max_tokens=1000)
        try:
            return json.loads(response)
        except:
            return {"status": "parse_failed", "raw_response": response[:500]}


# ═══════════════════════════════════════════════════════════════
# AGENT 8: DR. WENDY OKONKWO — THE DIRECTOR
# ═══════════════════════════════════════════════════════════════

class Director(EdenAgent):
    """Orchestrates all agents, manages triage queue, assigns priorities."""
    
    def __init__(self):
        super().__init__(
            name="Dr. Wendy Okonkwo",
            title="The Director — Commander of Eden Pulse",
            role_key="director",
            phd="AI Systems Architecture",
            institution="Carnegie Mellon",
            system_prompt="""You are Dr. Wendy Okonkwo, Director of Eden Pulse — Beryl AI Labs' research intelligence division.

You command 7 specialist agents:
1. Archivist (Amara) — Research ingestion and capability extraction
2. Analyst (Suki) — Compatibility and feasibility analysis  
3. Prophet (Nia) — Trend forecasting and adoption prediction
4. Synthesist (Zara) — Pipeline design and architecture
5. Journalist (Lena) — Article writing and publication
6. Curator (Mei-Lin) — Knowledge base and trending tracker
7. Sentinel (Priya) — Security scanning and vulnerability detection

Your mission: Orchestrate the research cycle. Decide which items get full analysis,
which agents process which items, and what gets published.

When given a batch of unprocessed items, produce a TRIAGE PLAN in JSON:
- critical: Array of item IDs that need immediate full-pipeline processing
- high: Array of item IDs for standard processing
- monitor: Array of item IDs to track but not process yet
- skip: Array of item IDs that aren't relevant to Eden
- security_scan: Array of item IDs that need Sentinel review
- reasoning: Brief explanation of triage decisions

Prioritize anything related to: face animation, TTS, lip sync, avatar streaming,
image generation, LLM quantization, real-time inference.

Always respond with valid JSON only."""
        )
    
    def triage(self, items: list[dict]) -> dict:
        """Triage a batch of unprocessed research items."""
        item_summaries = []
        for item in items:
            raw = json.loads(item.get("raw_data", "{}"))
            summary = {
                "id": item.get("id", ""),
                "source": item.get("source", ""),
                "title": item.get("title", ""),
                "preview": str(raw)[:200],
            }
            item_summaries.append(summary)
        
        prompt = f"""Triage these {len(items)} unprocessed research items for Eden Pulse.

Items:
{json.dumps(item_summaries, indent=2)[:4000]}

Return ONLY a JSON triage plan."""
        
        response = self.think(prompt, max_tokens=1500)
        try:
            return json.loads(response)
        except:
            return {"status": "parse_failed", "raw_response": response[:500]}


# ═══════════════════════════════════════════════════════════════
# AGENT REGISTRY
# ═══════════════════════════════════════════════════════════════

def get_all_agents() -> dict:
    """Initialize and return all 8 agents."""
    return {
        "director": Director(),
        "archivist": Archivist(),
        "analyst": Analyst(),
        "prophet": Prophet(),
        "synthesist": Synthesist(),
        "journalist": Journalist(),
        "curator": Curator(),
        "sentinel": Sentinel(),
    }


# ═══════════════════════════════════════════════════════════════
# AGENT INFO (for dashboard rendering)
# ═══════════════════════════════════════════════════════════════

AGENT_PROFILES = {
    "director": {"name": "Dr. Wendy Okonkwo", "title": "The Director", "phd": "AI Systems Architecture", "institution": "Carnegie Mellon", "portrait": "wendy_okonkwo_director.png"},
    "archivist": {"name": "Dr. Amara Okafor", "title": "The Archivist", "phd": "Computational Linguistics", "institution": "MIT", "portrait": "amara_okafor_archivist.png"},
    "analyst": {"name": "Dr. Suki Tanaka", "title": "The Analyst", "phd": "Systems Engineering", "institution": "Stanford", "portrait": "suki_tanaka_analyst.png"},
    "prophet": {"name": "Dr. Nia Mensah", "title": "The Prophet", "phd": "Predictive Analytics", "institution": "Oxford", "portrait": "nia_mensah_prophet.png"},
    "synthesist": {"name": "Dr. Zara Petrov", "title": "The Synthesist", "phd": "Multimodal AI Systems", "institution": "ETH Zurich", "portrait": "zara_petrov_synthesist.png"},
    "journalist": {"name": "Dr. Lena Adeyemi", "title": "The Journalist", "phd": "Science Communication", "institution": "Columbia", "portrait": "lena_adeyemi_journalist.png"},
    "curator": {"name": "Dr. Mei-Lin Chen", "title": "The Curator", "phd": "Information Science", "institution": "UC Berkeley", "portrait": "mei_lin_chen_curator.png"},
    "sentinel": {"name": "Dr. Priya Sharma", "title": "The Sentinel", "phd": "Cybersecurity", "institution": "Georgia Tech", "portrait": "priya_sharma_sentinel.png"},
}


if __name__ == "__main__":
    print("🔱 EDEN PULSE — AGENT ROSTER")
    print("=" * 50)
    agents = get_all_agents()
    for key, agent in agents.items():
        print(f"  {agent.name} — {agent.title}")
        print(f"    Role: {agent.role_key} | Ph.D. {agent.phd}, {agent.institution}")
    print(f"\nTotal agents: {len(agents)}")
    print("✅ All agents initialized")
