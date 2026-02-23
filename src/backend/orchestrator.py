#!/usr/bin/env python3
"""
EDEN PULSE — THE HEARTBEAT ENGINE
Main orchestrator that runs the full research cycle.

One command: python3 orchestrator.py
It scans → ingests → triages → analyzes → forecasts → synthesizes → publishes.

This is the living organism.
"""
import json
import os
import sys
import time
from datetime import datetime

# Add parent to path
sys.path.insert(0, os.path.dirname(__file__))

from db.database import (
    init_db, get_db, get_unprocessed_items, mark_processed,
    get_latest_articles, get_db_stats, insert_research_item
)
from agents.heartbeats import (
    get_all_agents, Archivist, Analyst, Prophet, Synthesist, 
    Journalist, Curator, Sentinel, Director, AGENT_PROFILES
)
from tools.research_tools import hf_trending_models, hf_trending_spaces


def print_banner():
    print("""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🔱  E D E N   P U L S E  —  H E A R T B E A T  🔱       ║
║                                                              ║
║   Beryl AI Labs · Research Intelligence Division             ║
║   "THE RELENTLESS EYE"                                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    """)


def run_scan_phase(archivist: Archivist) -> dict:
    """Phase 1: Archivist scans all research sources."""
    print("\n📜 PHASE 1 — ARCHIVIST SCAN")
    print("=" * 50)
    print(f"  Agent: {archivist.name}")
    print(f"  Scanning: Semantic Scholar, HuggingFace, GitHub...")
    
    start = time.time()
    results = archivist.scan()
    elapsed = time.time() - start
    
    print(f"  Items found: {results['items_found']}")
    print(f"  New items: {results['items_new']}")
    print(f"  Duration: {elapsed:.1f}s")
    print(f"  Sources: {json.dumps(results['sources'])}")
    
    return results


def run_triage_phase(director: Director) -> dict:
    """Phase 2: Director triages unprocessed items."""
    print("\n🎯 PHASE 2 — DIRECTOR TRIAGE")
    print("=" * 50)
    print(f"  Agent: {director.name}")
    
    items = get_unprocessed_items(limit=20)
    print(f"  Unprocessed items: {len(items)}")
    
    if not items:
        print("  No items to triage. Cycle complete.")
        return {"critical": [], "high": [], "monitor": [], "skip": []}
    
    # If no LLM available, use rule-based triage
    if not director.api_key:
        return rule_based_triage(items)
    
    triage = director.triage(items)
    
    critical = triage.get("critical", [])
    high = triage.get("high", [])
    monitor = triage.get("monitor", [])
    skip = triage.get("skip", [])
    
    print(f"  Critical: {len(critical)}")
    print(f"  High: {len(high)}")
    print(f"  Monitor: {len(monitor)}")
    print(f"  Skip: {len(skip)}")
    
    # Mark skipped items
    for item_id in skip:
        mark_processed(item_id, level=3)
    
    return triage


def rule_based_triage(items: list[dict]) -> dict:
    """Fallback triage when no LLM is available. Uses keyword matching."""
    print("  Using rule-based triage (no LLM)")
    
    # High-priority keywords for Eden
    critical_keywords = ["face animation", "talking head", "lip sync", "tts", "text to speech",
                         "voice synthesis", "avatar", "real-time", "streaming", "kdtalker",
                         "teller", "chatterbox", "whisper", "soul"]
    high_keywords = ["diffusion", "image generation", "flux", "quantization", "bitnet",
                     "video generation", "lora", "sdxl", "stable diffusion"]
    
    triage = {"critical": [], "high": [], "monitor": [], "skip": []}
    
    for item in items:
        title_lower = item.get("title", "").lower()
        raw = item.get("raw_data", "").lower()
        combined = title_lower + " " + raw[:500]
        
        if any(kw in combined for kw in critical_keywords):
            triage["critical"].append(item["id"])
        elif any(kw in combined for kw in high_keywords):
            triage["high"].append(item["id"])
        else:
            triage["monitor"].append(item["id"])
    
    print(f"  Critical: {len(triage['critical'])}")
    print(f"  High: {len(triage['high'])}")
    print(f"  Monitor: {len(triage['monitor'])}")
    
    return triage


def run_analysis_pipeline(item: dict, agents: dict, use_llm: bool = True) -> dict:
    """Phase 3-6: Run a single item through the full analysis pipeline."""
    item_id = item.get("id", "")
    title = item.get("title", "")
    
    results = {"item_id": item_id, "title": title}
    
    # Step 1: Archivist extracts capability card
    if use_llm:
        cap_card = agents["archivist"].extract_capability_card(item)
        results["capability_card"] = cap_card
    else:
        cap_card = None
    
    mark_processed(item_id, level=1)
    
    # Step 2: Analyst checks compatibility
    if use_llm:
        analysis = agents["analyst"].analyze(item, cap_card)
        results["analysis"] = analysis
    else:
        analysis = None
    
    # Step 3: Prophet forecasts
    if use_llm:
        forecast = agents["prophet"].forecast(item, analysis)
        results["forecast"] = forecast
    else:
        forecast = None
    
    # Step 4: Synthesist designs pipelines
    if use_llm:
        blueprint = agents["synthesist"].synthesize(item, analysis, forecast)
        results["blueprint"] = blueprint
    else:
        blueprint = None
    
    # Step 5: Journalist writes article
    if use_llm:
        article = agents["journalist"].write_article(item, cap_card, analysis, forecast, blueprint)
        results["article"] = article
    else:
        # Generate a basic article without LLM
        article = generate_basic_article(item)
        results["article"] = article
    
    return results


def generate_basic_article(item: dict) -> dict:
    """Generate a basic article without LLM. Rule-based."""
    raw = json.loads(item.get("raw_data", "{}"))
    title = item.get("title", "Untitled Research Item")
    source = item.get("source", "unknown")
    
    # Determine category from source
    category_map = {
        "semantic_scholar": "Research",
        "hf_model": "Model Release",
        "hf_paper": "Research",
        "github": "Open Source",
        "hf_space": "Demo",
    }
    category = category_map.get(source, "General")
    
    # Build body from raw data
    body_parts = [f"## {title}\n"]
    if "abstract" in raw:
        body_parts.append(raw["abstract"][:500])
    elif "description" in raw:
        body_parts.append(raw["description"][:500])
    
    if "authors" in raw:
        authors_str = ", ".join(raw["authors"][:5]) if isinstance(raw["authors"], list) else str(raw["authors"])
        body_parts.append(f"\n**Authors:** {authors_str}")
    
    if "downloads" in raw:
        body_parts.append(f"\n**Downloads:** {raw['downloads']:,}")
    if "stars" in raw:
        body_parts.append(f"\n**Stars:** {raw['stars']:,}")
    
    body = "\n".join(body_parts)
    
    from db.database import insert_article
    article_id = insert_article(
        title=title[:100],
        subtitle=f"Source: {source} | Ingested by Eden Pulse Archivist",
        body=body,
        category=category,
        priority="medium",
        tags=[source, category.lower()],
        authors=["archivist", "journalist"],
        research_item_ids=[item.get("id", "")],
        journal="Eden Pulse Intelligence Report",
        volume=f"Auto-{datetime.now().strftime('%Y%m%d')}",
    )
    mark_processed(item.get("id", ""), level=2)
    
    return {"title": title, "category": category, "db_id": article_id}


def run_curator_phase(curator: Curator) -> dict:
    """Phase 7: Curator updates trending tracker."""
    print("\n📊 PHASE 7 — CURATOR UPDATE")
    print("=" * 50)
    print(f"  Agent: {curator.name}")
    
    models = hf_trending_models(limit=15)
    spaces = hf_trending_spaces(limit=10)
    
    # Store trending data in DB
    conn = get_db()
    for m in models:
        if "error" not in m:
            conn.execute(
                """INSERT OR REPLACE INTO trending_models 
                   (model_id, source, name, category, spike_score, direction, change_pct, last_seen, first_seen)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (m.get("id", ""), "huggingface", m.get("id", ""), m.get("pipeline_tag", ""),
                 m.get("trending_score", 0), "up", "", datetime.now().isoformat(), datetime.now().isoformat())
            )
    conn.commit()
    conn.close()
    
    print(f"  Updated {len(models)} model trends")
    print(f"  Updated {len(spaces)} space trends")
    
    return {"models_tracked": len(models), "spaces_tracked": len(spaces)}


def run_full_cycle(use_llm: bool = True, max_process: int = 5):
    """Run one complete research cycle."""
    print_banner()
    print(f"  Timestamp: {datetime.now().isoformat()}")
    print(f"  LLM Mode: {'Claude API' if use_llm else 'Rule-based (no API key)'}")
    print(f"  Max items to process: {max_process}")
    
    # Initialize
    init_db()
    agents = get_all_agents()
    use_llm = use_llm and bool(agents["director"].api_key)
    
    if not use_llm:
        print("\n  ⚠️  No ANTHROPIC_API_KEY found. Running in rule-based mode.")
        print("  Set ANTHROPIC_API_KEY env var for full LLM-powered analysis.\n")
    
    cycle_start = time.time()
    
    # Phase 1: Scan
    scan_results = run_scan_phase(agents["archivist"])
    
    # Phase 2: Triage
    triage = run_triage_phase(agents["director"])
    
    # Phase 3-6: Process top items through pipeline
    priority_items = triage.get("critical", []) + triage.get("high", [])
    items_to_process = priority_items[:max_process]
    
    if items_to_process:
        print(f"\n⚡ PHASE 3-6 — PIPELINE PROCESSING ({len(items_to_process)} items)")
        print("=" * 50)
        
        conn = get_db()
        for item_id in items_to_process:
            row = conn.execute("SELECT * FROM research_items WHERE id = ?", (item_id,)).fetchone()
            if row:
                item = dict(row)
                print(f"\n  Processing: {item['title'][:60]}...")
                result = run_analysis_pipeline(item, agents, use_llm=use_llm)
                if result.get("article"):
                    print(f"  → Article published: {result['article'].get('title', 'N/A')[:60]}")
        conn.close()
    
    # Phase 7: Curator
    curator_results = run_curator_phase(agents["curator"])
    
    # Summary
    cycle_duration = time.time() - cycle_start
    stats = get_db_stats()
    
    print("\n" + "=" * 60)
    print("🔱 CYCLE COMPLETE")
    print("=" * 60)
    print(f"  Duration: {cycle_duration:.1f}s")
    print(f"  Research items: {stats.get('research_items', 0)}")
    print(f"  Articles: {stats.get('articles', 0)}")
    print(f"  Trending models: {stats.get('trending_models', 0)}")
    print(f"  Agent actions: {stats.get('agent_log', 0)}")
    print(f"  Scan history: {stats.get('scan_history', 0)}")
    
    return {
        "duration": cycle_duration,
        "scan": scan_results,
        "triage": triage,
        "stats": stats,
    }


def export_dashboard_data(output_path: str = None) -> dict:
    """Export all data needed by the Next.js dashboard."""
    if output_path is None:
        output_path = os.path.join(os.path.dirname(__file__), "outputs", "dashboard_data.json")
    
    conn = get_db()
    
    data = {
        "generated_at": datetime.now().isoformat(),
        "articles": [dict(r) for r in conn.execute(
            "SELECT * FROM articles ORDER BY published_at DESC LIMIT 20"
        ).fetchall()],
        "trending_models": [dict(r) for r in conn.execute(
            "SELECT * FROM trending_models ORDER BY spike_score DESC LIMIT 20"
        ).fetchall()],
        "agent_log": [dict(r) for r in conn.execute(
            "SELECT * FROM agent_log ORDER BY started_at DESC LIMIT 50"
        ).fetchall()],
        "scan_history": [dict(r) for r in conn.execute(
            "SELECT * FROM scan_history ORDER BY created_at DESC LIMIT 10"
        ).fetchall()],
        "stats": get_db_stats(),
        "agent_profiles": AGENT_PROFILES,
    }
    
    conn.close()
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2, default=str)
    
    print(f"Dashboard data exported to: {output_path}")
    return data


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Eden Pulse Heartbeat Engine")
    parser.add_argument("--no-llm", action="store_true", help="Run without LLM (rule-based only)")
    parser.add_argument("--max-process", type=int, default=5, help="Max items to process per cycle")
    parser.add_argument("--export", action="store_true", help="Export dashboard data after cycle")
    parser.add_argument("--scan-only", action="store_true", help="Only run scan phase")
    parser.add_argument("--stats", action="store_true", help="Show database stats")
    
    args = parser.parse_args()
    
    if args.stats:
        init_db()
        stats = get_db_stats()
        print("📊 Eden Pulse Database Stats:")
        for table, count in stats.items():
            print(f"  {table}: {count}")
        sys.exit(0)
    
    if args.scan_only:
        init_db()
        archivist = Archivist()
        run_scan_phase(archivist)
        sys.exit(0)
    
    results = run_full_cycle(use_llm=not args.no_llm, max_process=args.max_process)
    
    if args.export:
        export_dashboard_data()
