"""
EDEN PULSE — DATABASE LAYER
SQLite persistence for all agent outputs.
"""
import sqlite3
import json
import os
from datetime import datetime
from typing import Optional

DB_PATH = os.environ.get("EDEN_PULSE_DB", os.path.join(os.path.dirname(__file__), "..", "eden_pulse.db"))


def get_db():
    """Get database connection with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Initialize all tables. Idempotent."""
    conn = get_db()
    conn.executescript("""
    -- Raw research items ingested by Archivist
    CREATE TABLE IF NOT EXISTS research_items (
        id TEXT PRIMARY KEY,
        source TEXT NOT NULL,              -- 'semantic_scholar', 'hf_model', 'hf_paper', 'github', 'hf_space'
        title TEXT NOT NULL,
        raw_data TEXT NOT NULL,            -- Full JSON blob
        ingested_at TEXT NOT NULL,
        processed INTEGER DEFAULT 0,       -- 0=new, 1=analyzed, 2=published, 3=archived
        priority TEXT DEFAULT 'medium',    -- 'critical', 'high', 'medium', 'low'
        eden_relevance REAL DEFAULT 0.0    -- 0-1 score for Eden Project relevance
    );

    -- Capability cards extracted by Archivist
    CREATE TABLE IF NOT EXISTS capability_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        research_item_id TEXT REFERENCES research_items(id),
        model_name TEXT NOT NULL,
        architecture TEXT,
        modalities TEXT,                   -- JSON array
        parameters TEXT,                   -- e.g. "1.3B"
        vram_requirements TEXT,
        fps_inference TEXT,
        constraints TEXT,
        full_card TEXT NOT NULL,           -- Full JSON capability card
        created_at TEXT NOT NULL
    );

    -- Compatibility graphs from Analyst
    CREATE TABLE IF NOT EXISTS compatibility_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        research_item_id TEXT REFERENCES research_items(id),
        feasibility_score REAL,
        compatibility_graph TEXT NOT NULL,  -- Full JSON
        risk_matrix TEXT,                  -- JSON {high, medium, low}
        known_failures TEXT,               -- JSON array
        created_at TEXT NOT NULL
    );

    -- Forecasts from Prophet
    CREATE TABLE IF NOT EXISTS forecasts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        research_item_id TEXT REFERENCES research_items(id),
        model_name TEXT,
        trend_30d TEXT,
        trend_90d TEXT,
        pulse_spike_probability REAL,
        hype_cycle_position TEXT,
        market_impact TEXT,
        full_forecast TEXT NOT NULL,        -- Full JSON
        created_at TEXT NOT NULL
    );

    -- Pipeline blueprints from Synthesist
    CREATE TABLE IF NOT EXISTS pipelines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        components TEXT NOT NULL,           -- JSON array
        flow TEXT,
        gpu_requirements TEXT,
        estimated_latency TEXT,
        probability_score REAL,
        full_blueprint TEXT NOT NULL,       -- Full JSON
        status TEXT DEFAULT 'proposed',     -- 'proposed', 'validated', 'production', 'deprecated'
        created_at TEXT NOT NULL
    );

    -- Published articles from Journalist
    CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subtitle TEXT,
        body TEXT NOT NULL,
        category TEXT,
        priority TEXT DEFAULT 'medium',
        tags TEXT,                          -- JSON array
        authors TEXT,                       -- JSON array of agent keys
        research_item_ids TEXT,             -- JSON array of source IDs
        thumbnail_prompt TEXT,
        feasibility_score REAL,
        journal TEXT,
        volume TEXT,
        published_at TEXT NOT NULL,
        updated_at TEXT
    );

    -- Trending model tracker from Curator
    CREATE TABLE IF NOT EXISTS trending_models (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_id TEXT NOT NULL,
        source TEXT NOT NULL,              -- 'huggingface', 'github', 'arxiv'
        name TEXT NOT NULL,
        category TEXT,
        spike_score REAL,
        direction TEXT,                    -- 'up', 'down', 'stable'
        change_pct TEXT,
        last_seen TEXT NOT NULL,
        first_seen TEXT NOT NULL
    );

    -- Security advisories from Sentinel
    CREATE TABLE IF NOT EXISTS security_alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        package TEXT NOT NULL,
        severity TEXT NOT NULL,            -- 'critical', 'high', 'medium', 'low'
        description TEXT NOT NULL,
        affected_versions TEXT,
        remediation TEXT,
        cve_id TEXT,
        created_at TEXT NOT NULL
    );

    -- Agent activity log
    CREATE TABLE IF NOT EXISTS agent_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_name TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT,
        items_processed INTEGER DEFAULT 0,
        started_at TEXT NOT NULL,
        completed_at TEXT,
        status TEXT DEFAULT 'running'      -- 'running', 'completed', 'failed'
    );

    -- Triage queue for Eden Studio
    CREATE TABLE IF NOT EXISTS triage_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id INTEGER REFERENCES articles(id),
        pipeline_id INTEGER REFERENCES pipelines(id),
        action TEXT NOT NULL,              -- 'swap_model', 'test_pipeline', 'security_patch', 'new_feature'
        priority TEXT DEFAULT 'medium',
        payload TEXT NOT NULL,             -- JSON
        status TEXT DEFAULT 'pending',     -- 'pending', 'in_progress', 'completed', 'rejected'
        created_at TEXT NOT NULL,
        resolved_at TEXT
    );

    -- Research scan history
    CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scan_type TEXT NOT NULL,           -- 'full', 'papers', 'models', 'github', 'spaces'
        items_found INTEGER DEFAULT 0,
        items_new INTEGER DEFAULT 0,
        duration_seconds REAL,
        scan_data TEXT,                    -- Full JSON scan results
        created_at TEXT NOT NULL
    );
    """)
    conn.commit()
    conn.close()
    return True


# ═══════════════════════════════════════════════════════════════
# CRUD Operations
# ═══════════════════════════════════════════════════════════════

def insert_research_item(source: str, title: str, item_id: str, raw_data: dict, 
                         priority: str = "medium", eden_relevance: float = 0.0) -> bool:
    """Insert a new research item. Skips if already exists."""
    conn = get_db()
    try:
        conn.execute(
            "INSERT OR IGNORE INTO research_items (id, source, title, raw_data, ingested_at, priority, eden_relevance) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (item_id, source, title, json.dumps(raw_data), datetime.now().isoformat(), priority, eden_relevance)
        )
        conn.commit()
        return True
    except Exception as e:
        print(f"DB Error: {e}")
        return False
    finally:
        conn.close()


def get_unprocessed_items(limit: int = 20) -> list[dict]:
    """Get research items that haven't been analyzed yet."""
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM research_items WHERE processed = 0 ORDER BY eden_relevance DESC, ingested_at DESC LIMIT ?",
        (limit,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def mark_processed(item_id: str, level: int = 1):
    """Mark item as processed (1=analyzed, 2=published, 3=archived)."""
    conn = get_db()
    conn.execute("UPDATE research_items SET processed = ? WHERE id = ?", (level, item_id))
    conn.commit()
    conn.close()


def insert_article(title: str, subtitle: str, body: str, category: str, priority: str,
                   tags: list, authors: list, research_item_ids: list, feasibility: float = None,
                   journal: str = "", volume: str = "") -> int:
    """Insert a published article. Returns article ID."""
    conn = get_db()
    cursor = conn.execute(
        """INSERT INTO articles (title, subtitle, body, category, priority, tags, authors, 
           research_item_ids, feasibility_score, journal, volume, published_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (title, subtitle, body, category, priority, json.dumps(tags), json.dumps(authors),
         json.dumps(research_item_ids), feasibility, journal, volume, datetime.now().isoformat())
    )
    article_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return article_id


def get_latest_articles(limit: int = 20) -> list[dict]:
    """Get most recent published articles."""
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM articles ORDER BY published_at DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def log_agent_action(agent_name: str, action: str, details: str = "", items: int = 0) -> int:
    """Log an agent's activity."""
    conn = get_db()
    cursor = conn.execute(
        "INSERT INTO agent_log (agent_name, action, details, items_processed, started_at) VALUES (?, ?, ?, ?, ?)",
        (agent_name, action, details, items, datetime.now().isoformat())
    )
    log_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return log_id


def complete_agent_action(log_id: int, status: str = "completed"):
    """Mark an agent action as complete."""
    conn = get_db()
    conn.execute(
        "UPDATE agent_log SET completed_at = ?, status = ? WHERE id = ?",
        (datetime.now().isoformat(), status, log_id)
    )
    conn.commit()
    conn.close()


def insert_scan_history(scan_type: str, items_found: int, items_new: int, 
                        duration: float, scan_data: dict = None) -> int:
    """Log a completed research scan."""
    conn = get_db()
    cursor = conn.execute(
        "INSERT INTO scan_history (scan_type, items_found, items_new, duration_seconds, scan_data, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (scan_type, items_found, items_new, duration, json.dumps(scan_data) if scan_data else None, datetime.now().isoformat())
    )
    scan_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return scan_id


def get_db_stats() -> dict:
    """Get current database statistics."""
    conn = get_db()
    stats = {}
    for table in ["research_items", "capability_cards", "compatibility_reports", 
                   "forecasts", "pipelines", "articles", "trending_models", 
                   "security_alerts", "agent_log", "triage_queue", "scan_history"]:
        try:
            row = conn.execute(f"SELECT COUNT(*) as cnt FROM {table}").fetchone()
            stats[table] = row["cnt"]
        except:
            stats[table] = 0
    conn.close()
    return stats


if __name__ == "__main__":
    print("Initializing Eden Pulse database...")
    init_db()
    print(f"Database created at: {DB_PATH}")
    stats = get_db_stats()
    print(f"Tables: {len(stats)}")
    for table, count in stats.items():
        print(f"  {table}: {count} rows")
    print("✅ Database ready")
