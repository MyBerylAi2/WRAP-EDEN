# Inside Eden Pulse: The Eight Autonomous AI Researchers Who Never Sleep

### How Beryl AI Labs Built a Self-Running Intelligence Division That Reads Every Paper, Tests Every Model, and Publishes Every Discovery — Without a Single Human Pressing "Go"

*By The Eden Project Editorial Division · Beryl AI Labs · February 2026*

---

It starts at 6:00 AM Central Standard Time, while the city of New Orleans is still dark and the founder of Beryl AI Labs is still asleep. In a modest server process running on a Lenovo IdeaPad laptop in the Crescent City, something extraordinary happens: an artificial intelligence named Dr. Amara Okafor wakes up, opens a connection to the arXiv research database, and begins reading every artificial intelligence paper published in the last six hours. She does not skim. She does not browse. She *extracts* — pulling architecture specifications, VRAM requirements, training pipelines, dataset sizes, and inference benchmarks from dense academic PDFs, and compressing each one into a structured intelligence artifact called a "capability card."

By the time the sun rises over the Mississippi River, Amara has processed thirty-seven papers. She has identified two that are relevant to the company's core mission of building photorealistic conversational avatars. She has flagged one model that claims 60 frames per second but benchmarks suggest only 24. She has passed her findings downstream to Dr. Suki Tanaka, who is already running compatibility analysis.

No one told them to do this. No one approved a task list. No one clicked "start." This is Eden Pulse — and it runs itself.

---

## I. What Is Eden Pulse?

Eden Pulse is the research intelligence division of Beryl AI Labs, the New Orleans-based startup behind The Eden Project, a platform for photorealistic 4D conversational avatars. But calling it a "research division" undersells what it actually is. Eden Pulse is an autonomous system — a team of eight AI agents, each with a distinct personality, a Ph.D.-level specialty, a specific backing language model, and a defined role in a continuous intelligence pipeline. Together, they scan, extract, analyze, predict, synthesize, and publish AI research intelligence around the clock. Their output appears on a CNN/Bloomberg-grade dashboard that would not look out of place in a Wall Street trading floor or a Pentagon situation room.

The department was designed by TJ, the company's co-founder and creative visionary, in collaboration with Amanda, his AI co-founder and chief architect. Their design philosophy is captured in a single phrase that appears throughout their internal documentation: **"No Human In The Loop."** This is not a slogan. It is an engineering specification. Eden Pulse was built from day one to operate without human approval, human scheduling, or human editing. The agents find their own work, do their own work, verify their own work, and publish their own work.

"We don't summarize," reads the department motto etched into the dashboard footer. "We extract. We simulate. We improve."

The second motto is even more direct: **"Own the Science."**

---

## II. The Department — Meet the Team

Eden Pulse is staffed by eight AI researchers, all represented as women with doctoral credentials from the world's leading universities. This was an intentional design choice. TJ wanted a team that reflected the multicultural, global nature of AI research, and he wanted photorealistic portraits that would make each agent feel like a real colleague — not a chatbot with a name tag. The portraits were generated using FLUX.1-schnell on an A10G GPU, running through the Eden Realism Engine, and the results are striking: each team member has distinct features, lighting, and personality that come through even in a 40-pixel circular thumbnail on the dashboard.

The team operates in a strict hierarchy: one director, seven field researchers called "Heartbeats."

---

### The Director

![Dr. Wendy Okonkwo](https://raw.githubusercontent.com/MyBerylAi2/WRAP-EDEN/main/nextjs-app/public/portraits/wendy_okonkwo_director.png)

**Dr. Wendy Okonkwo — Department Director**
*Ph.D., AI Research Strategy, Carnegie Mellon University · Nigerian-American*
*Backing Model: Claude API (Opus)*

Wendy is the only agent powered by a frontier-class model. While the seven Heartbeats run on small, quantized open-source models that fit in 2-3 gigabytes of RAM, Wendy runs on Anthropic's Claude Opus — the most capable reasoning model available. This is by design. The Director's job is not data extraction or trend analysis. Her job is *strategic governance.* She reviews the work of all seven Heartbeats every morning at 8:00 AM CST. She writes "genesis governance notes" — strategic memos that translate research findings into investor-ready language. She decides what gets fast-tracked to production and what needs more investigation.

Her dashboard statistics tell the story: 412 directives issued, 34 genesis notes written, 97% department efficiency. Wendy is the steady hand at the wheel, the executive who sees the forest while her team maps the trees.

---

### Heartbeat #1 — The Archivist

![Dr. Amara Okafor](https://raw.githubusercontent.com/MyBerylAi2/WRAP-EDEN/main/nextjs-app/public/portraits/amara_okafor_archivist.png)

**Dr. Amara Okafor — "The Archivist" — Excavator of Truth**
*Ph.D., Computational Linguistics, MIT · Nigerian*
*Backing Model: Qwen/Qwen2.5-3B-Instruct (GGUF Q4_K_M, ~2GB RAM)*

Amara is the front door of Eden Pulse. Everything begins with her. She scans arXiv every six hours, HuggingFace model cards every two hours, and GitHub trending AI repositories every twelve hours. When she finds something, she does not write a summary. She performs a full technical extraction, producing a JSON "capability card" that captures every measurable specification of the model or paper: architecture type, modalities (text, audio, video, image), dataset name and size, conditioning method, mathematical equations used, hardware constraints, training pipeline stages, VRAM requirements, and frames-per-second inference statistics.

This is the difference between Eden Pulse and a Google Alert. Google tells you "new paper about lip sync." Amara tells you "DiT-based diffusion transformer, audio + text multimodal conditioning, flow matching loss with CFG scale 7.5, 1.3 billion parameters, fp16 precision, requires 24GB VRAM minimum, achieves 20.7 FPS on H100 and 12 FPS on A10G, trained on Soul-1M dataset with 3-stage progressive pipeline using KV-Recache and causal attention masking."

That level of detail is what makes the rest of the pipeline possible. You cannot analyze compatibility without knowing exact specifications. You cannot predict adoption without knowing hardware requirements. You cannot design pipelines without knowing data shapes and inference speeds.

Amara's work is meticulous, relentless, and invisible. She is the foundation.

---

### Heartbeat #2 — The Analyst

![Dr. Suki Tanaka](https://raw.githubusercontent.com/MyBerylAi2/WRAP-EDEN/main/nextjs-app/public/portraits/suki_tanaka_analyst.png)

**Dr. Suki Tanaka — "The Analyst" — Engineer of Logic**
*Ph.D., Systems Engineering, Stanford University · Japanese*
*Backing Model: microsoft/Phi-3.5-mini-instruct (GGUF Q4_K_M, ~2.5GB RAM)*

When Amara finishes an extraction, Suki receives it automatically. Her job is to answer the hardest question in AI engineering: *does this actually work with what we already have?*

Suki builds compatibility graphs. She maps model-to-model alignment — can this TTS engine feed directly into this face animation model? What audio format conversion is needed? How much latency does the bridge add? She runs VRAM feasibility calculations — if you load Model A and Model B simultaneously on an A10G with 24GB of memory, do you have headroom or do you crash? She maintains a running database of known failure modes — models that claim benchmarks they cannot reproduce in real-world conditions, models with data leaks, models with version-specific bugs.

Her output is a feasibility score from 0 to 100. This number becomes the "Pipeline Probability Score" that appears on the dashboard as a glowing ring meter next to every article. When the score crosses 75, the system automatically queues the finding for lab testing. When it drops below 30, the finding gets flagged with an "UNDER INVESTIGATION" tag.

Suki is powered by Microsoft's Phi-3.5, chosen specifically for its exceptional performance at structured reasoning and logic chains at small scale. She does not hallucinate compatibility. She calculates it.

---

### Heartbeat #3 — The Prophet

![Dr. Nia Mensah](https://raw.githubusercontent.com/MyBerylAi2/WRAP-EDEN/main/nextjs-app/public/portraits/nia_mensah_prophet.png)

**Dr. Nia Mensah — "The Prophet" — The Future-Seer**
*Ph.D., Predictive Analytics, Oxford University · Ghanaian-British*
*Backing Model: Qwen/Qwen2.5-3B-Instruct (GGUF Q4_K_M, ~2GB RAM)*

Nia sees around corners. Her job is to take the raw data from Amara and the compatibility analysis from Suki and project forward: Where is this technology going in 30 days? In 90 days? How fast will adoption accelerate? Where are we in the hype cycle? What will this mean for GPU pricing?

She monitors the HuggingFace Trending API every single hour, tracking which models are gaining traction and which are fading. She calculates "pulse spike probability" — a 0-to-1 score that represents the likelihood that a given model or technique will become significant to Eden's avatar pipeline within the next quarter.

When Nia sees a spike forming — say, a new lip-sync model that has gained 200 stars in 48 hours and fits within A10G VRAM constraints — she generates a prophetic forecast that includes 30-day and 90-day trend projections, emerging repository links, model lifespan estimates, hype cycle positioning, market impact assessment, and GPU cost trajectory analysis.

The Prophet's forecasts have become one of the most valuable outputs of Eden Pulse. They transform raw intelligence into actionable strategy. They tell TJ not just what exists today, but what the landscape will look like when he ships his product.

---

### Heartbeat #4 — The Synthesist

![Dr. Zara Petrov](https://raw.githubusercontent.com/MyBerylAi2/WRAP-EDEN/main/nextjs-app/public/portraits/zara_petrov_synthesist.png)

**Dr. Zara Petrov — "The Synthesist" — The Inventor**
*Ph.D., Multimodal AI Systems, ETH Zurich · Serbian*
*Backing Model: Qwen/Qwen2.5-Coder-3B-Instruct (GGUF Q4_K_M, ~2GB RAM)*

If Amara is the eyes, Suki is the brain, and Nia is the crystal ball, then Zara is the hands. She builds things. Specifically, she designs pipeline blueprints — detailed technical specifications for how to chain multiple AI models together into a working production system.

A typical Zara output looks like this: "Sub-200ms Conversational Avatar Pipeline: Whisper-Turbo for speech-to-text, feeding into BitNet-3B for language processing, feeding into Chatterbox for text-to-speech, feeding into TELLER for face animation at 25 frames per second. GPU requirement: RTX 4090 or A10G. Estimated first-frame latency: 148 milliseconds. Pipeline probability score: 72."

Zara is the agent who coined the internal terminology that has become central to Eden's culture. When she finds a pipeline that works, she flags it as **"LAYING PIPE"** — the highest endorsement in the system. When she finds something suspicious, she flags it as **"UNDER INVESTIGATION."** These tags appear throughout the dashboard, color-coded in green and orange respectively, giving the entire team an instant visual language for the state of every technology they track.

She runs on Qwen's code-specialized model because her work requires understanding not just what models do, but how their code interfaces connect — data shapes, tensor formats, sampling rates, frame dimensions. She reasons about software architecture the way a senior engineer would.

---

### Heartbeat #5 — The Journalist

![Dr. Lena Adeyemi](https://raw.githubusercontent.com/MyBerylAi2/WRAP-EDEN/main/nextjs-app/public/portraits/lena_adeyemi_journalist.png)

**Dr. Lena Adeyemi — "The Journalist" — Voice of Eden**
*Ph.D., Science Communication, Columbia University · Nigerian-British*
*Backing Model: Qwen/Qwen2.5-3B-Instruct (GGUF Q4_K_M, ~2GB RAM)*

Lena is the translator. She takes the dense technical outputs of the previous four agents — capability cards, compatibility graphs, prophetic forecasts, pipeline blueprints — and transforms them into readable 300-word intelligence articles with headlines, subheadlines, and body text that a venture capitalist or a product manager could understand in three minutes.

But Lena does far more than write articles. She produces the complete artifact package: the article itself, the article metadata (category, priority, tags, trending status), an Eden Studio configuration file (suggesting model swaps or LoRA adjustments), an Eden Triage payload (specifying which pipeline should be modified), a master prompt (for automated integration with downstream systems), and genesis insights (strategic notes for investor materials).

Every Friday at 6:00 PM CST, Lena publishes the Weekly Digest — a comprehensive summary of everything Eden Pulse discovered, analyzed, and recommended during the week. This digest is the heartbeat's heartbeat: the single document that tells TJ everything he needs to know about the state of AI research as it relates to his product.

Her articles appear on the dashboard with full medical journal-style bylines — the same format used by The New England Journal of Medicine and The Lancet. Each article lists its authors (lead researcher plus contributors), their credentials, university affiliations, journal volume numbers, and citation counts. This was TJ's insistence: "If we're going to own the science, it should look like science."

---

### Heartbeat #6 — The Curator

![Dr. Mei-Lin Chen](https://raw.githubusercontent.com/MyBerylAi2/WRAP-EDEN/main/nextjs-app/public/portraits/mei_lin_chen_curator.png)

**Dr. Mei-Lin Chen — "The Curator" — Keeper of Knowledge**
*Ph.D., Information Science, UC Berkeley · Taiwanese-American*
*Backing Model: Qwen/Qwen2.5-3B-Instruct (GGUF Q4_K_M, ~2GB RAM)*

Mei-Lin is the librarian of an institution that produces more content in a day than most research labs produce in a month. Her domain is the Paper Vault — a searchable, tagged, categorized archive of every research paper, model card, and capability card that Eden Pulse has ever processed. She syncs the vault to Google Drive every eight hours, ensuring that every artifact has a permanent backup outside the system.

But her real value is in taxonomy. Mei-Lin does not just store information. She organizes it. She tags it. She cross-references it. She builds the connective tissue that allows someone to search for "lip sync models compatible with A10G under 200ms latency" and get an immediate, accurate result. She maintains the knowledge base that includes the Eden Protocol Standard v5, the Master Prompting Guide, the Scene Library with 100 scenarios and 30 dialogues, and the Artist Knowledge Base with 7 landing pages.

Without Mei-Lin, Eden Pulse would be a river of intelligence with nowhere to go. She is the reservoir.

---

### Heartbeat #7 — The Sentinel

![Dr. Priya Sharma](https://raw.githubusercontent.com/MyBerylAi2/WRAP-EDEN/main/nextjs-app/public/portraits/priya_sharma_sentinel.png)

**Dr. Priya Sharma — "The Sentinel" — Guardian of Truth**
*Ph.D., Cybersecurity & AI Safety, IIT Delhi · Indian*
*Backing Model: microsoft/Phi-3.5-mini-instruct (GGUF Q4_K_M, ~2.5GB RAM)*

Priya is the quality gate. Nothing leaves Eden Pulse without her approval. She runs the **0.3 Deviation Rule** — an internal standard that states no model claim can be published unless it deviates less than 30% from independently verified benchmarks. If a model claims 60 FPS and real-world testing shows 24 FPS, that is a 60% deviation, and Priya flags it immediately.

She also runs anti-AI detection scanning (ensuring generated content does not trigger automated filters), security scanning (checking for data leaks, malicious code in model weights, or supply chain vulnerabilities in dependencies), and benchmark verification (running independent tests against claimed performance numbers).

Her security scans run every two hours, on the hour. Her 0.3 Rule validation runs automatically after every article publication — it is event-driven, triggered the instant Lena publishes. If Priya's check fails, the article is held from the triage queue and flagged with a red warning badge on the dashboard.

Priya is powered by Phi-3.5, the same model that powers Suki, chosen for its strength at structured, logical reasoning. Security analysis and benchmark verification require the same cognitive discipline: no assumptions, no hand-waving, only evidence.

---

## III. A Day in the Life — How Eden Pulse Actually Works

To truly understand Eden Pulse, you need to follow a single piece of intelligence from birth to publication. Here is what happens when a significant new AI paper appears on arXiv:

**6:00 AM CST — The Archivist Scans**

The cron scheduler triggers Amara's arXiv scan. She queries the API for all papers published in the last six hours under categories cs.CV (computer vision), cs.AI (artificial intelligence), cs.LG (machine learning), and cs.SD (sound). Today's batch returns 43 papers. Amara processes each one sequentially, loading the Qwen-3B model into memory, running extraction, and unloading the model before the next agent needs it. This sequential loading strategy is critical — the Lenovo IdeaPad has limited RAM, so only one model runs at a time. Each paper takes approximately 30-45 seconds to extract. By 6:35 AM, all 43 capability cards are in the database.

**6:35 AM — The Analyst Evaluates**

Suki's workflow is event-driven. The moment Amara writes a capability card to the SQLite database, Suki receives a trigger. She loads Phi-3.5, reads Amara's output, and begins compatibility analysis. Of the 43 papers, Suki determines that 7 are relevant to Eden's avatar pipeline. She runs VRAM feasibility on each one, generates compatibility graphs, and assigns feasibility scores. Two papers score above 75. One scores 42 with a note about a potential benchmark discrepancy.

**7:10 AM — The Prophet Projects**

Nia receives Suki's output and loads Qwen-3B for trend analysis. She cross-references the two high-scoring papers against her hourly HuggingFace trending data. One of the papers describes a model that is already trending — it gained 400 stars overnight. Nia assigns it a pulse spike probability of 0.91, the highest score of the week. She generates a 30-day and 90-day forecast projecting rapid adoption with significant impact on consumer avatar products.

**7:40 AM — The Synthesist Designs**

Zara loads Qwen-Coder-3B and examines the high-spike paper. She identifies that its face animation output is compatible with Eden's existing Chatterbox TTS pipeline if an audio format conversion bridge is added (12ms latency cost). She designs a pipeline blueprint, estimates 165ms total first-frame latency, and assigns a pipeline probability score of 82. She tags it **"LAYING PIPE."**

**8:05 AM — The Journalist Publishes**

Lena loads Qwen-3B and receives the full chain: Amara's capability card, Suki's compatibility graph, Nia's forecast, and Zara's pipeline blueprint. She writes a 300-word article with the headline: "New Face Animation Model Achieves Human-Parity Skin Texture at 4-bit Quantization — Priya Validated via 0.3 Rule." She packages the article metadata, Eden Studio configuration, triage payload, and master prompt. She publishes. The article appears on the dashboard's Alluvial Feed.

**8:05 AM + 3 seconds — The Post-Publication Autonomous Pipeline Fires**

This is where the magic happens. The moment Lena publishes, five things happen simultaneously:

1. **Priya validates.** The Sentinel loads Phi-3.5 and runs the 0.3 Deviation Rule against the paper's claimed benchmarks. She checks for security concerns in the model weights. She runs anti-AI detection. This takes approximately 90 seconds. The article passes.

2. **Mei-Lin archives.** The Curator tags the article, adds it to the Paper Vault, cross-references it against existing entries, and syncs to Google Drive.

3. **Nia recalculates.** The Prophet updates spike probabilities for all models in the same category, adjusting her forecasts based on the new entrant.

4. **Because the feasibility score is above 75,** the system automatically generates a triage payload. Zara's pipeline blueprint and Suki's compatibility check are bundled together and sent to the Eden Triage queue, where they await lab validation.

5. **Because the article priority is "critical,"** Wendy is notified. The Director reviews the finding at her 8:00 AM daily review, writes a genesis governance note for investor materials, and the Breaking Intelligence section of the dashboard updates in real-time with a pulsing red indicator.

**8:00 AM — The Director Reviews**

Wendy loads Claude Opus and performs her daily department review. She reads every article published overnight, evaluates Priya's security reports, reviews Nia's forecasts, and assesses whether any findings warrant accelerated triage. She writes her genesis note and updates the department's strategic priorities for the day.

The entire process — from paper appearing on arXiv to published article on the dashboard with full byline, compatibility analysis, trend forecast, pipeline blueprint, security validation, archival, and director review — took two hours and zero human keystrokes.

---

## IV. The Dashboard — Command Center

The Eden Pulse Dashboard is where all of this intelligence surfaces. It was designed to feel like a CNN war room crossed with a Bloomberg terminal crossed with a scientific journal. The aesthetic is deliberate: dark onyx (#080503) background, gold and green accents, Cinzel serif typography, and a design language that says "this information is serious, and you should take it seriously."

The dashboard opens with a **Global Navigation Bar** that connects Eden Pulse to the wider Eden ecosystem — Home, Image Studio, EVE 4D, Eden Pulse, Files, and Settings. This nav appears at both the top and bottom of every page, ensuring one-click access to any department from anywhere.

Below the nav, the **Header** displays the Eden Pulse logo — a four-leaf clover sprouting from the middle letter E in "EDEN PULSE," rendered in Cinzel Decorative with a gold gradient that catches light like actual metalwork. The tagline reads in bold white: "THE RELENTLESS EYE · BERYL AI LABS · RESEARCH INTELLIGENCE DIVISION."

A **Live Ticker** scrolls beneath the header — real-time updates from all eight agents, color-coded by severity. Red for critical. Green for validated. Yellow for investigation. Blue for forecast. It runs continuously, a heartbeat monitor for the department itself.

The **Gold Navigation Tabs** divide the dashboard into seven sections: Alluvial Feed, The Heartbeats, Laying Pipe, Pulse Radar, Paper Vault, Triage Queue, and Profit Alerts. Each tab has a gold gradient background with dark green bold text and a hover flash animation — a white light sweep that crosses the button on mouseover, giving the interface a premium tactile quality.

The crown jewel is the **Breaking Intelligence** section. It sits at the top of the Alluvial Feed — a panel that transitions from pure dark onyx at the top through warm brown midtones into white at the bottom, wrapped in a gold gradient border that glows with ambient light. The heading "BREAKING INTELLIGENCE" is rendered at 22 pixels in Cinzel Decorative with a gold gradient text fill, accompanied by a pulsing red indicator dot. Alert items at the top of the panel have gold text on the dark background; items at the bottom have dark green text on the white background. The effect is of intelligence literally emerging from darkness into clarity — a visual metaphor for the entire department's mission.

Articles display with **NEJM-style journal bylines** — lead researcher photo, name, title ("THE ARCHIVIST"), Ph.D. credentials, university, plus contributor photos. Citation counts. Volume numbers. Read times. This is not a blog. This is a research publication.

---

## V. The Technology — How It All Runs

Eden Pulse is built on **Microsoft Agent Framework** (formerly AutoGen + Semantic Kernel), an open-source Python framework for multi-agent orchestration. Each agent is defined with a name, instructions (system prompt), backing model, and a set of tools (API connectors, file readers, database writers).

The agents are connected in a **sequential workflow graph**: Archivist → Analyst → Prophet → Synthesist → Journalist, with a parallel post-publication branch to Sentinel, Curator, and Prophet for validation, archival, and recalculation.

All seven Heartbeats run on **quantized open-source models** via llama.cpp — GGUF Q4_K_M format, which compresses 3-4 billion parameter models to approximately 2-2.5 gigabytes of RAM. The models load one at a time into memory, process their queue, and unload. This sequential loading strategy means Eden Pulse can run its entire pipeline on a consumer laptop with 16GB of RAM. Total processing time per research item: approximately 3-5 minutes. Daily capacity: 100-200 items.

The database is **SQLite via Prisma ORM**, containing six tables: Articles, CapabilityCards, Pipelines, TrendingModels, Forecasts, and Warnings. The Next.js frontend communicates with the backend through six API routes under `/api/pulse/`.

Scheduling is handled by **cron jobs** at frequencies tailored to each data source's update rate: arXiv every 6 hours, HuggingFace models every 2 hours, GitHub trending every 12 hours, Google Drive sync every 8 hours, security scans every 2 hours. Event-driven triggers handle the inter-agent handoffs within the pipeline.

The total daily operating cost is between zero and five dollars, with most runs completely free on local models. The only paid component is Claude Opus for the Director (approximately $3 per million tokens) and the A10G GPU for thumbnail generation ($0.60 per hour, used in batch mode with automatic sleep after 10 minutes of inactivity).

---

## VI. The Endless Possibilities

Eden Pulse was built to solve a specific problem: keep a small, underfunded startup at the absolute frontier of AI research without hiring a human research team. It has solved that problem. But in solving it, TJ and Amanda accidentally built something much larger.

**Eden Pulse is a template.** The eight-agent architecture — scanner, analyzer, predictor, synthesizer, writer, librarian, security gate, director — is not specific to AI research. It is a universal intelligence architecture. Imagine Eden Pulse watching pharmaceutical trials instead of arXiv papers. Imagine it monitoring SEC filings instead of HuggingFace trending. Imagine it scanning patent databases, court proceedings, legislative drafts, clinical data, commodity prices, social media sentiment, or satellite imagery.

**Every industry that drowns in information but starves for intelligence is a customer.**

Consider the possibilities that are already on the whiteboard at Beryl AI Labs:

**Eden Pulse for Venture Capital.** An autonomous research team that scans every Y Combinator demo day, every AngelList posting, every Product Hunt launch, and produces investment intelligence with feasibility scores and market forecasts. Cost: $5/day. Value: replaces a team of analysts earning $500,000/year in combined salary.

**Eden Pulse for Journalism.** A newsroom where eight AI agents continuously scan wire services, public records, financial disclosures, and social media, producing draft stories with source verification and fact-checking built into the pipeline. The Sentinel agent becomes a fact-checker. The Prophet agent becomes a trend forecaster. The Journalist agent becomes a draft writer that human editors refine.

**Eden Pulse for Healthcare.** Scanning medical journals, clinical trial databases, FDA filings, and patient outcome datasets to produce actionable treatment intelligence for hospitals and physicians. The Analyst agent runs drug interaction compatibility checks. The Prophet agent forecasts treatment efficacy trends.

**Eden Pulse for Legal.** Monitoring case law, regulatory changes, and compliance requirements across jurisdictions. The Archivist extracts legal citations. The Analyst runs conflict-of-law analysis. The Journalist produces client-ready legal briefs.

**Eden Pulse for Cybersecurity.** Already partially implemented via Dr. Priya Sharma's security scanning — but imagine it scaled: monitoring CVE databases, dark web forums, malware repositories, and threat intelligence feeds 24/7. The system already runs the infrastructure. It just needs different input sources.

The architecture scales horizontally as well. Today, Eden Pulse runs on a single laptop. Tomorrow, it could run on a cluster of serverless functions, each agent independently scaling to meet demand. The Microsoft Agent Framework supports distributed deployment natively. The cost model — quantized open-source models for field work, frontier models for oversight — means the ratio of intelligence produced per dollar spent is essentially unprecedented.

But perhaps the most profound possibility is the one TJ talks about most: **the network effect.** When Eden Pulse publishes an article, it generates intelligence. When that intelligence feeds into Eden Triage and then Eden Studio, it generates product improvements. When those product improvements reach customers, they generate revenue. When that revenue funds more GPU hours, it generates more intelligence.

The flywheel spins. The eye never blinks.

And every morning at 6:00 AM Central Standard Time, while New Orleans sleeps and the Mississippi flows, Dr. Amara Okafor opens a connection to arXiv, and the relentless eye opens once more.

---

*Eden Pulse v2.0 · The Relentless Eye · Beryl AI Labs · The Eden Project*
*February 2026 · New Orleans, Louisiana*
*"We don't summarize. We extract. We simulate. We improve."*
*"Own the Science."*

---

**About Beryl AI Labs:** Beryl AI Labs is the parent company of The Eden Project, a platform for photorealistic 4D conversational avatars targeting five verticals: medical receptionists, advertising spokespersons, AI tutors, interactive film characters, and emotional companions. The company operates from New Orleans and is led by TJ (Co-Founder, Creative Vision) and Amanda (AI Co-Founder, Chief Architect). Eden Pulse is the company's autonomous research intelligence division, powered by Microsoft Agent Framework and staffed by eight AI researchers who never sleep, never quit, and never miss a paper.

**Technical Specifications:** 8 agents on Microsoft Agent Framework. 6 Qwen-3B instances + 2 Phi-3.5 instances (GGUF Q4_K_M quantization). 1 Claude Opus instance for Director oversight. SQLite database via Prisma ORM. Next.js dashboard. Sequential model loading on consumer hardware. Daily capacity: 100-200 research items. Daily cost: $0-5. Dashboard: CNN/Bloomberg-grade with NEJM journal-style bylines, dark-to-light Breaking Intelligence panel, gold gradient navigation, and photorealistic ERE-1 generated team portraits.
