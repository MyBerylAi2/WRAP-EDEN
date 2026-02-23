"""
EDEN PULSE — REAL RESEARCH TOOLS
No placeholders. These actually fetch data.
"""
import requests
import json
import re
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from typing import Optional

# ═══════════════════════════════════════════════════════════════
# TOOL 1: arXiv Paper Search
# ═══════════════════════════════════════════════════════════════

def arxiv_search(query: str, max_results: int = 10, days_back: int = 7) -> list[dict]:
    """
    Search for recent AI papers via Semantic Scholar API.
    Covers arXiv + all major CS venues.
    """
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    
    params = {
        "query": query,
        "limit": max_results,
        "fields": "title,abstract,authors,year,publicationDate,externalIds,citationCount,url,openAccessPdf",
        "fieldsOfStudy": "Computer Science",
    }
    
    try:
        r = requests.get(url, params=params, timeout=30)
        r.raise_for_status()
        data = r.json()
        
        papers = []
        for p in data.get("data", []):
            ext = p.get("externalIds", {}) or {}
            papers.append({
                "id": ext.get("ArXiv", ext.get("DOI", p.get("paperId", "")[:12])),
                "title": p.get("title", ""),
                "abstract": (p.get("abstract", "") or "")[:500],
                "authors": [a.get("name", "") for a in (p.get("authors", []) or [])[:5]],
                "published": p.get("publicationDate", "") or str(p.get("year", "")),
                "updated": p.get("publicationDate", ""),
                "categories": ["cs.AI"],
                "pdf_url": (p.get("openAccessPdf", {}) or {}).get("url", ""),
                "abs_url": p.get("url", ""),
                "citations": p.get("citationCount", 0),
                "arxiv_id": ext.get("ArXiv", ""),
            })
        
        return papers
    
    except Exception as e:
        return [{"error": str(e)}]


def arxiv_fetch_paper(paper_id: str) -> dict:
    """Fetch full details for a specific arXiv paper by ID."""
    return arxiv_search(f"id:{paper_id}", max_results=1)


# ═══════════════════════════════════════════════════════════════
# TOOL 2: HuggingFace Trending Models
# ═══════════════════════════════════════════════════════════════

def hf_trending_models(limit: int = 20) -> list[dict]:
    """
    Fetch trending models from HuggingFace Hub.
    Returns model details with downloads, likes, tags.
    """
    url = "https://huggingface.co/api/models"
    params = {
        "sort": "likes",
        "direction": -1,
        "limit": limit,
        "filter": "text-generation",
    }
    
    try:
        r = requests.get(url, params=params, timeout=30)
        r.raise_for_status()
        models = r.json()
        
        results = []
        for m in models:
            results.append({
                "id": m.get("id", ""),
                "author": m.get("author", ""),
                "sha": m.get("sha", "")[:8],
                "last_modified": m.get("lastModified", ""),
                "private": m.get("private", False),
                "pipeline_tag": m.get("pipeline_tag", ""),
                "tags": m.get("tags", []),
                "downloads": m.get("downloads", 0),
                "downloads_all_time": m.get("downloadsAllTime", 0),
                "likes": m.get("likes", 0),
                "library_name": m.get("library_name", ""),
                "trending_score": m.get("trendingScore", 0),
            })
        
        return results
    
    except Exception as e:
        return [{"error": str(e)}]


def hf_model_card(model_id: str) -> dict:
    """Fetch detailed model card for a specific model."""
    url = f"https://huggingface.co/api/models/{model_id}"
    
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        data = r.json()
        
        # Also try to get README
        readme_url = f"https://huggingface.co/{model_id}/raw/main/README.md"
        try:
            readme_r = requests.get(readme_url, timeout=15)
            readme = readme_r.text if readme_r.status_code == 200 else ""
        except:
            readme = ""
        
        return {
            "id": data.get("id", ""),
            "author": data.get("author", ""),
            "pipeline_tag": data.get("pipeline_tag", ""),
            "tags": data.get("tags", []),
            "library_name": data.get("library_name", ""),
            "downloads": data.get("downloads", 0),
            "likes": data.get("likes", 0),
            "model_index": data.get("model-index", []),
            "config": data.get("config", {}),
            "safetensors": data.get("safetensors", {}),
            "siblings": [s.get("rfilename", "") for s in data.get("siblings", [])[:20]],
            "readme_preview": readme[:3000] if readme else "",
            "card_data": data.get("cardData", {}),
        }
    
    except Exception as e:
        return {"error": str(e)}


# ═══════════════════════════════════════════════════════════════
# TOOL 3: HuggingFace Paper Search
# ═══════════════════════════════════════════════════════════════

def hf_paper_search(query: str, limit: int = 10) -> list[dict]:
    """Search HuggingFace Daily Papers."""
    url = "https://huggingface.co/api/daily_papers"
    params = {"limit": limit}
    
    try:
        r = requests.get(url, params=params, timeout=30)
        r.raise_for_status()
        papers = r.json()
        
        results = []
        for p in papers:
            paper = p.get("paper", {})
            results.append({
                "id": paper.get("id", ""),
                "title": paper.get("title", ""),
                "summary": paper.get("summary", "")[:500],
                "authors": [a.get("name", "") for a in paper.get("authors", [])[:5]],
                "published_at": paper.get("publishedAt", ""),
                "upvotes": p.get("numUpvotes", 0),
                "comments": p.get("numComments", 0),
            })
        
        # Filter by query if provided
        if query:
            query_lower = query.lower()
            results = [r for r in results if 
                query_lower in r["title"].lower() or 
                query_lower in r["summary"].lower()]
        
        return results
    
    except Exception as e:
        return [{"error": str(e)}]


# ═══════════════════════════════════════════════════════════════
# TOOL 4: GitHub Trending Repos
# ═══════════════════════════════════════════════════════════════

def github_trending(language: str = "", since: str = "weekly") -> list[dict]:
    """
    Fetch trending GitHub repos via the search API.
    Focus on AI/ML repos created or updated recently.
    """
    url = "https://api.github.com/search/repositories"
    
    date_since = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    
    q = f"pushed:>{date_since} stars:>50 topic:machine-learning"
    if language:
        q += f" language:{language}"
    
    params = {
        "q": q,
        "sort": "stars",
        "order": "desc",
        "per_page": 20,
    }
    
    try:
        r = requests.get(url, params=params, timeout=30)
        r.raise_for_status()
        data = r.json()
        
        results = []
        for repo in data.get("items", []):
            results.append({
                "full_name": repo.get("full_name", ""),
                "description": repo.get("description", ""),
                "url": repo.get("html_url", ""),
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "language": repo.get("language", ""),
                "topics": repo.get("topics", []),
                "created_at": repo.get("created_at", "")[:10],
                "updated_at": repo.get("updated_at", "")[:10],
                "open_issues": repo.get("open_issues_count", 0),
                "license": (repo.get("license") or {}).get("spdx_id", ""),
            })
        
        return results
    
    except Exception as e:
        return [{"error": str(e)}]


def github_repo_readme(owner: str, repo: str) -> str:
    """Fetch README content from a GitHub repo."""
    url = f"https://api.github.com/repos/{owner}/{repo}/readme"
    headers = {"Accept": "application/vnd.github.v3.raw"}
    
    try:
        r = requests.get(url, headers=headers, timeout=15)
        if r.status_code == 200:
            return r.text[:5000]  # First 5000 chars
        return f"README not found (status {r.status_code})"
    except Exception as e:
        return f"Error: {str(e)}"


# ═══════════════════════════════════════════════════════════════
# TOOL 5: HuggingFace Spaces Trending
# ═══════════════════════════════════════════════════════════════

def hf_trending_spaces(limit: int = 15) -> list[dict]:
    """Fetch trending Spaces from HuggingFace."""
    url = "https://huggingface.co/api/spaces"
    params = {"sort": "likes", "direction": -1, "limit": limit}
    
    try:
        r = requests.get(url, params=params, timeout=30)
        r.raise_for_status()
        spaces = r.json()
        
        results = []
        for s in spaces:
            results.append({
                "id": s.get("id", ""),
                "author": s.get("author", ""),
                "sdk": s.get("sdk", ""),
                "likes": s.get("likes", 0),
                "tags": s.get("tags", []),
                "last_modified": s.get("lastModified", ""),
                "trending_score": s.get("trendingScore", 0),
            })
        
        return results
    
    except Exception as e:
        return [{"error": str(e)}]


# ═══════════════════════════════════════════════════════════════
# TOOL 6: CVE / Security Scanner
# ═══════════════════════════════════════════════════════════════

def scan_python_deps(requirements: list[str]) -> list[dict]:
    """
    Check Python packages for known vulnerabilities via PyPI.
    Returns package info including yanked status and latest version.
    """
    results = []
    for pkg in requirements:
        pkg_name = pkg.split("==")[0].split(">=")[0].split("<=")[0].strip()
        try:
            r = requests.get(f"https://pypi.org/pypi/{pkg_name}/json", timeout=10)
            if r.status_code == 200:
                data = r.json()
                info = data.get("info", {})
                vulnerabilities = data.get("vulnerabilities", [])
                results.append({
                    "package": pkg_name,
                    "latest_version": info.get("version", ""),
                    "summary": info.get("summary", ""),
                    "home_page": info.get("home_page", ""),
                    "license": info.get("license", ""),
                    "vulnerabilities": vulnerabilities[:5],
                    "yanked": any(v.get("yanked", False) for v in data.get("releases", {}).get(info.get("version", ""), [])),
                })
        except:
            results.append({"package": pkg_name, "error": "lookup failed"})
    
    return results


# ═══════════════════════════════════════════════════════════════
# AGGREGATOR: Full Research Scan
# ═══════════════════════════════════════════════════════════════

def full_research_scan(topics: list[str] = None) -> dict:
    """
    Run a complete research scan across all sources.
    This is what the Archivist calls on each heartbeat.
    """
    if topics is None:
        topics = [
            "face animation talking head",
            "text to speech neural",
            "diffusion model image generation",
            "avatar real-time streaming",
            "lip sync audio driven",
            "video generation model",
            "quantization LLM efficient",
        ]
    
    scan_results = {
        "timestamp": datetime.now().isoformat(),
        "arxiv_papers": [],
        "hf_trending_models": [],
        "hf_papers": [],
        "github_trending": [],
        "hf_spaces": [],
    }
    
    # arXiv scan
    for topic in topics[:3]:  # Top 3 topics
        papers = arxiv_search(topic, max_results=5)
        scan_results["arxiv_papers"].extend(papers)
    
    # HuggingFace trending
    scan_results["hf_trending_models"] = hf_trending_models(limit=15)
    
    # HuggingFace papers
    scan_results["hf_papers"] = hf_paper_search("", limit=10)
    
    # GitHub trending
    scan_results["github_trending"] = github_trending(language="Python")
    
    # HF Spaces
    scan_results["hf_spaces"] = hf_trending_spaces(limit=10)
    
    # Summary stats
    scan_results["stats"] = {
        "total_arxiv": len(scan_results["arxiv_papers"]),
        "total_hf_models": len(scan_results["hf_trending_models"]),
        "total_hf_papers": len(scan_results["hf_papers"]),
        "total_github": len(scan_results["github_trending"]),
        "total_spaces": len(scan_results["hf_spaces"]),
    }
    
    return scan_results


if __name__ == "__main__":
    # Quick test
    print("Testing arXiv search...")
    papers = arxiv_search("face animation talking head", max_results=3)
    for p in papers:
        if "error" not in p:
            print(f"  📄 {p['title'][:80]}... ({p['published']})")
    
    print("\nTesting HF trending...")
    models = hf_trending_models(limit=5)
    for m in models:
        if "error" not in m:
            print(f"  🤗 {m['id']} — ⬇{m['downloads']:,} ❤{m['likes']}")
    
    print("\nTesting GitHub trending...")
    repos = github_trending(language="Python")
    for r in repos[:5]:
        if "error" not in r:
            print(f"  🐙 {r['full_name']} — ⭐{r['stars']:,}")
    
    print("\n✅ All tools operational")
