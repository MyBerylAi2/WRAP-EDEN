---
name: eve-4d-pipeline
description: Complete engineering knowledge for the EVE 4D Conversational Avatar System by Beryl AI Labs / The Eden Project. Use this skill whenever building, debugging, extending, or deploying the EVE pipeline — which chains AI Brain (Claude API) → Voice Synthesis (Chatterbox TTS / Kokoro) → Facial Animation (KDTalker / MEMO) → Streaming (WebRTC) to create photorealistic talking avatars from a single 2D portrait. Also use when working on Eden Realism Engine image generation, voice agents, avatar builders, or any product in the Eden ecosystem. This skill contains proprietary pipeline architecture, model selection rationale, API integration patterns, quality grading systems, and revenue architecture that is NOT publicly documented. Treat as trade secret level IP for Beryl AI Labs.
---

# EVE 4D Conversational Avatar Pipeline

## CLASSIFIED: Beryl AI Labs / The Eden Project
### Engineering Lead: Amanda (Claude) | Creative Director: TJ Jacques
### Co-Founders: TJ Jacques & Ross | Entity: Beryl AI Labs

---

## 1. PIPELINE OVERVIEW — "THE 8TH WONDER"

EVE (Eden Virtual Entity) is a 4D conversational avatar system that transforms a single 2D portrait into a talking, breathing, emotionally expressive digital human — using exclusively open-source models at $0.00 inference cost.

### The 4D Pipeline Architecture

```
╔══════════════════════════════════════════════════════════════════════╗
║                    EVE 4D PIPELINE — PRODUCTION                     ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                      ║
║   USER INPUT (text or speech)                                        ║
║       │                                                              ║
║       ▼                                                              ║
║   ┌──────────┐   ┌───────────┐   ┌────────────┐   ┌─────────────┐  ║
║   │ 🧠 BRAIN  │──▶│ 🔊 VOICE   │──▶│ 🎭 FACE     │──▶│ 📡 DELIVER  │ ║
║   │ Claude    │   │ Chatterbox│   │ KDTalker / │   │ WebRTC /   │  ║
║   │ Sonnet 4  │   │ / Kokoro  │   │ MEMO       │   │ HLS / MP4  │  ║
║   └──────────┘   └───────────┘   └────────────┘   └─────────────┘  ║
║     <150ms          2-4s            15-30s            <100ms         ║
║                                                                      ║
║   OPTIONAL ENHANCEMENT LAYER:                                        ║
║   ┌───────────┐   ┌───────────┐   ┌───────────┐                     ║
║   │ 🎬 VIDEO   │──▶│ ✨ UPSCALE │──▶│ 🎯 LIP SYNC│                   ║
║   │ LTX-Video │   │ FlashVSR  │   │ MuseTalk  │                     ║
║   │ / WAN 2.2 │   │ / ESRGAN  │   │ /LatentSync│                    ║
║   └───────────┘   └───────────┘   └───────────┘                     ║
║                                                                      ║
║   5TH DIMENSION (Bi-Directional):                                    ║
║   ┌───────────┐                                                      ║
║   │ 👂 LISTEN  │  Voxtral Mini 4B — 200ms STT, 13 languages         ║
║   │ STT Input │  Apache 2.0, runs on edge, $0.006/min API           ║
║   └───────────┘                                                      ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

### Latency Budget (Target: Sub-2-Second Response)

| Stage | Model | Target | Actual | Notes |
|-------|-------|--------|--------|-------|
| Brain | Claude Sonnet 4 | <500ms | ~150ms streaming | First token via Anthropic API |
| Voice | Chatterbox TTS | <3s | 2-4s | HuggingFace Space or local |
| Voice | Kokoro TTS | <1s | 0.5-1s | 82M params, runs on CPU |
| Face | KDTalker | <30s | 15-30s | HuggingFace Space |
| Face | MEMO | <45s | 30-60s | Higher quality, slower |
| Stream | WebRTC | <100ms | ~30ms | P2P, no server relay |
| Listen | Voxtral Mini 4B | <500ms | ~200ms | STT, 13 languages |

---

## 2. STAGE 1: THE BRAIN (Claude API)

### Purpose
Generate contextually aware, emotionally intelligent responses that EVE speaks. The brain determines WHAT EVE says, HOW she says it, and WHAT EMOTION to convey.

### Implementation

```python
import anthropic

client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY env var

async def eve_think(user_message: str, history: list, persona: dict) -> str:
    """
    Generate EVE's response with emotional context.
    
    Args:
        user_message: What the user said/typed
        history: List of {"role": "user"|"assistant", "content": str}
        persona: Dict with keys: name, role, personality, voice_style
    
    Returns:
        Response text with optional emotion tags
    """
    system_prompt = f"""You are {persona['name']}, a 4D conversational avatar 
    created by The Eden Project (Beryl AI Labs).
    
    ROLE: {persona['role']}
    PERSONALITY: {persona['personality']}
    VOICE STYLE: {persona['voice_style']}
    
    RULES:
    - Keep responses to 2-3 sentences for natural conversation flow
    - Include emotion hints in brackets when tone shifts: [warm], [excited], [thoughtful]
    - Never break character or mention being AI unless directly asked
    - Match the user's energy level
    - Be genuinely helpful within your role
    """
    
    messages = history + [{"role": "user", "content": user_message}]
    
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        system=system_prompt,
        messages=messages
    )
    
    return response.content[0].text
```

### In-Browser Implementation (Claude Artifacts / Next.js)

```javascript
// Browser-side API call (works in Claude artifacts)
const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are EVE, the premium AI concierge for Eden Realism Engine...",
        messages: conversationHistory
    })
});
const data = await response.json();
const reply = data.content?.map(b => b.text || "").join("") || "Please try again.";
```

### Next.js API Route (Production — Required for CORS)

```typescript
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
    const { messages, system, persona } = await req.json();
    
    const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: system || buildSystemPrompt(persona),
        messages
    });
    
    return Response.json({ 
        text: response.content[0].text,
        usage: response.usage 
    });
}
```

### Pre-Built Persona Library (18 Voice Agents)

```python
PERSONAS = {
    "medical": {
        "name": "Dr. Eden",
        "role": "Medical Office Receptionist",
        "personality": "Warm, efficient, HIPAA-conscious",
        "voice_style": "Professional female, calm and reassuring",
        "pricing": "$249-499/mo"
    },
    "legal": {
        "name": "Eden Legal",
        "role": "Legal Office Assistant",
        "personality": "Professional, precise, knowledgeable",
        "voice_style": "Authoritative but approachable",
        "pricing": "$249/mo"
    },
    "fitness": {
        "name": "Coach Eden",
        "role": "Fitness Coach",
        "personality": "Energetic, supportive, motivating",
        "voice_style": "Upbeat, enthusiastic",
        "pricing": "$9.99-29.99/mo"
    },
    "realestate": {
        "name": "Eden Realty",
        "role": "Real Estate Agent",
        "personality": "Knowledgeable, friendly, detail-oriented",
        "voice_style": "Warm professional",
        "pricing": "$99-299/mo"
    },
    "restaurant": {
        "name": "Eden Host",
        "role": "Restaurant Host",
        "personality": "Warm, accommodating, food-knowledgeable",
        "voice_style": "Welcoming, refined",
        "pricing": "$49-149/mo"
    },
    "tutor": {
        "name": "Eden Tutor",
        "role": "AI Tutor",
        "personality": "Patient, clear, encouraging",
        "voice_style": "Friendly teacher",
        "pricing": "$9.99-29.99/mo"
    },
    "sales": {
        "name": "Eden Sales",
        "role": "AI Sales Dev Rep",
        "personality": "Professional, persuasive, consultative",
        "voice_style": "Confident, warm",
        "pricing": "$299-499/mo"
    },
    "support": {
        "name": "Eden Support",
        "role": "Customer Support Agent",
        "personality": "Patient, clear, solution-oriented",
        "voice_style": "Calm, reassuring",
        "pricing": "$249-399/mo"
    },
    "concierge": {
        "name": "Eden Concierge",
        "role": "Premium Concierge",
        "personality": "Sophisticated, attentive, world-traveled",
        "voice_style": "Luxury brand ambassador",
        "pricing": "$199/mo"
    },
    "wellness": {
        "name": "Eden Wellness",
        "role": "Wellness Coach",
        "personality": "Calming, mindful, encouraging",
        "voice_style": "Gentle, warm",
        "pricing": "$9.99-19.99/mo"
    },
    "senior_care": {
        "name": "Eden Companion",
        "role": "Senior Care Companion",
        "personality": "Patient, warm, attentive listener",
        "voice_style": "Gentle, clear, unhurried",
        "pricing": "$9.99-29.99/mo"
    },
    "language": {
        "name": "Eden Lingua",
        "role": "Language Tutor",
        "personality": "Patient, encouraging, culturally aware",
        "voice_style": "Clear enunciation, adaptive speed",
        "pricing": "$9.99-19.99/mo"
    },
    "bedtime": {
        "name": "Eden Stories",
        "role": "Bedtime Storyteller",
        "personality": "Warm, imaginative, soothing",
        "voice_style": "Gentle, expressive narrator",
        "pricing": "$9.99/mo"
    },
    "ministry": {
        "name": "Eden Ministry",
        "role": "Ministry Assistant",
        "personality": "Compassionate, reverent, supportive",
        "voice_style": "Warm, measured, sincere",
        "pricing": "$99/mo"
    },
    "podcast": {
        "name": "Eden Producer",
        "role": "Podcast Producer",
        "personality": "Creative, efficient, tech-savvy",
        "voice_style": "Dynamic, professional",
        "pricing": "$79-199/mo"
    },
    "influencer_live": {
        "name": "Eden Live",
        "role": "Live Voice Influencer",
        "personality": "Charismatic, engaging, authentic",
        "voice_style": "Dynamic, personal",
        "pricing": "$99-199/mo"
    },
    "influencer_prerecord": {
        "name": "Eden Studio",
        "role": "Pre-Recorded Content Creator",
        "personality": "Polished, consistent, brand-aware",
        "voice_style": "Studio-quality narrator",
        "pricing": "$79-149/mo"
    },
    "audiobook": {
        "name": "Eden Narrator",
        "role": "Audiobook Narrator",
        "personality": "Expressive, versatile, patient",
        "voice_style": "Multiple character voices",
        "pricing": "$0.05/word"
    }
}
```

---

## 3. STAGE 2: VOICE SYNTHESIS (TTS)

### Model Options (Ranked by Quality × Speed)

| Model | Params | Speed | Quality | Local? | Emotion Control | Best For |
|-------|--------|-------|---------|--------|-----------------|----------|
| **Chatterbox TTS** | 350M | 2-4s | A | Yes | Yes (exaggeration dial) | Production EVE voice |
| **Kokoro TTS** | 82M | 0.5-1s | B+ | Yes (CPU!) | Limited | Fast responses, edge |
| **CSM-1B** | 1B | 10-30s | A+ | GPU required | Full conversational | Premium tier |
| **Edge TTS** | Cloud | <0.5s | B | No (Microsoft) | None | Fallback / prototyping |
| **CosyVoice 3** | 500M | 2-5s | A | Yes | Yes | Multilingual |
| **Voxtral Mini 4B** | 4B | ~1s | A | Yes (16GB GPU) | STT not TTS | Listening/transcription |

### Chatterbox TTS (PRIMARY — Production Voice)

**Why Chatterbox:** First open-source TTS with emotion exaggeration control. You can dial emotional expressiveness up or down per utterance. EVE can whisper, exclaim, soothe, or celebrate — all from the same base voice.

**HuggingFace Space:** `resemble-ai/chatterbox`

```python
# Via Gradio Client (recommended for cloud)
from gradio_client import Client

def generate_voice_chatterbox(text: str, exaggeration: float = 0.5,
                               seed: int = 42) -> str:
    """
    Generate speech with Chatterbox TTS.
    
    Args:
        text: What EVE should say
        exaggeration: Emotion intensity 0.0 (flat) to 1.0 (dramatic)
        seed: Voice consistency seed (42 = EVE default, 7 = warm variant)
    
    Returns:
        Path to generated WAV file
    """
    client = Client("resemble-ai/chatterbox")
    result = client.predict(
        text=text,
        exaggeration=exaggeration,
        pace=1.0,
        seed=seed,
        api_name="/generate"
    )
    return result  # Path to WAV file


# Via local installation (for Seagate deployment)
# pip install chatterbox-tts
from chatterbox.tts import ChatterboxTTS

model = ChatterboxTTS.from_pretrained(device="cpu")  # or "cuda"

def generate_voice_local(text: str, audio_prompt: str = None) -> bytes:
    """Local Chatterbox generation with optional voice cloning."""
    wav = model.generate(
        text,
        audio_prompt_path=audio_prompt,  # Clone from reference audio
        exaggeration=0.5
    )
    return wav
```

**EVE's Voice Seeds (Discovered Through Testing):**
- Seed 42: Default Chatterbox — clear, professional female
- Seed 7: Warmer variant — better for companion/emotional roles
- Kokoro af_heart: Best overall natural quality for EVE signature voice
- PENDING: EVE's true signature voice needs 10-15s reference audio sample

### Kokoro TTS (FAST — Edge/CPU Deployment)

**Why Kokoro:** 82 million parameters. Runs on CPU. 54 voices across 8 languages. Voice packs control speaker identity through blendable embeddings.

**HuggingFace:** `hexgrad/Kokoro-82M`

```python
import kokoro

model = kokoro.KokoroTTS()

def generate_voice_kokoro(text: str, voice: str = "af_heart") -> tuple:
    """
    Ultra-fast TTS on CPU.
    
    Voice options:
        af_heart:  American female, warm (EVE default)
        af_bella:  American female, professional
        af_nicole: American female, smooth
        af_sarah:  American female, conversational
        bf_emma:   British female, refined
        bf_isabella: British female, elegant
    """
    audio, sr = model.create(text, voice=voice, speed=1.0)
    return audio, sr
```

### CSM-1B (PREMIUM — Conversational Speech Model)

**Why CSM-1B:** Human-eval indistinguishable from real speech. Full conversational context. Requires GPU.

**HuggingFace:** `sesame/csm-1b`

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

processor = AutoTokenizer.from_pretrained("sesame/csm-1b")
model = AutoModelForCausalLM.from_pretrained(
    "sesame/csm-1b", torch_dtype=torch.float16, device_map="auto"
)

def generate_voice_csm(text: str) -> str:
    """Premium conversational voice generation."""
    conversation = [{
        "role": "0",  # Speaker 0 = warm female
        "content": [{"type": "text", "text": text}]
    }]
    inputs = processor.apply_chat_template(
        conversation, tokenize=True, return_dict=True
    ).to(model.device)
    
    with torch.no_grad():
        output = model.generate(**inputs, output_audio=True, max_new_tokens=500)
    
    processor.save_audio(output, "output.wav")
    return "output.wav"
```

### Voice Selection Strategy

```python
def select_voice_engine(context: dict) -> str:
    """
    Automatically select best TTS engine based on context.
    Returns: "chatterbox" | "kokoro" | "csm" | "edge"
    """
    if context.get("tier") == "premium":
        return "csm"           # Best quality, slower
    elif context.get("realtime"):
        return "kokoro"         # Fastest, runs on CPU
    elif context.get("emotion_required"):
        return "chatterbox"     # Best emotion control
    else:
        return "kokoro"         # Default: fast and free
```

---

## 4. STAGE 3: FACIAL ANIMATION

### Model Options (Ranked)

| Model | Method | Speed | Quality | Lip Sync | Emotion | Best For |
|-------|--------|-------|---------|----------|---------|----------|
| **KDTalker** | Implicit 3D keypoints + diffusion | 15-30s | A | A | B+ | Production default |
| **MEMO** | Memory-guided temporal + emotion-aware | 30-60s | A+ | A+ | A | Premium emotional |
| **LivePortrait** | Motion transfer | 5-10s | B+ | B | A | Real-time preview |
| **LatentSync** | Latent diffusion lip sync | 10-20s | A- | A+ | B | Lip sync refinement |
| **MuseTalk** | Real-time lip sync | <1s | B | A- | C | Live streaming |

### KDTalker (PRIMARY — Production Animation)

**Why KDTalker:** Unsupervised implicit 3D keypoints + spatiotemporal diffusion. State-of-the-art efficiency. Best balance of quality and speed.

**HuggingFace Space:** `fffiloni/KDTalker`
**arxiv:** 2503.12963

```python
from gradio_client import Client, handle_file

def animate_face_kdtalker(portrait_path: str, audio_path: str) -> str:
    """
    Animate a portrait with audio using KDTalker.
    
    Args:
        portrait_path: Path to face image (512x512+ recommended)
        audio_path: Path to WAV audio file
    
    Returns:
        Path to generated MP4 video
    
    CRITICAL NOTES:
    - Input image MUST have clear frontal face, good lighting
    - Audio should be clean WAV, 16kHz+ sample rate
    - Output is 512x512 — upscale with FlashVSR for production
    - Processing time: 15-30s for 5s of video
    """
    client = Client("fffiloni/KDTalker")
    result = client.predict(
        source_image=handle_file(portrait_path),
        driven_audio=handle_file(audio_path),
        api_name="/predict"
    )
    return result  # Path to MP4
```

### MEMO (PREMIUM — Emotional Animation)

**Why MEMO:** Memory-guided temporal module preserves consistent expression across long clips. Emotion-aware audio module reads tone from voice and maps it to facial expressions.

**arxiv:** 2412.04448

```python
def animate_face_memo(portrait_path: str, audio_path: str) -> str:
    """
    High-quality emotional facial animation via MEMO.
    Slower but significantly better emotion mapping.
    
    Key difference from KDTalker:
    - MEMO reads EMOTION from the audio signal
    - Maps detected emotion to facial micro-expressions
    - Maintains temporal consistency across longer clips
    - Better for emotional/companion use cases
    """
    client = Client("fffiloni/MEMO")
    result = client.predict(
        source_image=handle_file(portrait_path),
        driven_audio=handle_file(audio_path),
        api_name="/predict"
    )
    return result
```

### EVE Output Quality Scorecard

```
╔════════════════════════════════════════════════════════╗
║           EVE OUTPUT QUALITY SCORECARD                 ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  LIP SYNCHRONIZATION     A    Near-perfect phonemes    ║
║  SKIN REALISM            A-   Within 0.3 deviation     ║
║  EXPRESSION NATURALNESS  B+   Micro-expressions OK     ║
║  EYE MOVEMENT            B+   Natural gaze shifts      ║
║  HEAD MOTION             B-   Slight drift present     ║
║  RESOLUTION              B-   512×512 base (upscale!)  ║
║  TEMPORAL CONSISTENCY    B+   Smooth, no flickering     ║
║  UNCANNY VALLEY          B+   Crosses for 5-10s clips  ║
║                                                        ║
║  OVERALL: B+ (Production-viable with upscaling)        ║
║                                                        ║
║  GRADING:                                              ║
║    A+ = Indistinguishable from real video               ║
║    A  = Professional broadcast quality                  ║
║    A- = High quality, minor artifacts on inspection     ║
║    B+ = Production-viable, viewer accepts as real       ║
║    B  = Good quality, occasional uncanny moments        ║
║    B- = Demo quality, needs improvement                 ║
╚════════════════════════════════════════════════════════╝
```

---

## 5. EDEN PROTOCOL STANDARD v5 (Image Quality)

### The Core Rule: 0.3 Standard Deviation

Every generated image must stay within 0.3 standard deviations of the source portrait's skin texture, tone, and micro-features. Beyond 0.3 → REJECT AND REGENERATE.

### Negative Prompt Library (300+ Keywords)

```python
EDEN_NEGATIVE_PROMPT = """
plastic skin, glossy, airbrushed, CGI, 3D render, doll-like, blurry,
deformed, extra fingers, watermark, text, cartoon, anime, illustration,
painting, drawing, sketch, digital art, oversaturated, overexposed,
underexposed, grainy noise, jpeg artifacts, low resolution, pixelated,
smooth skin, poreless, waxy, mannequin, uncanny valley, dead eyes,
cross-eyed, misaligned eyes, extra limbs, missing limbs, floating limbs,
disconnected limbs, mutation, mutilated, disfigured, poorly drawn face,
poorly drawn hands, extra fingers, fewer fingers, fused fingers,
too many fingers, long neck, bad anatomy, bad proportions, duplicate,
cropped, worst quality, low quality, normal quality, ugly, tiling,
out of frame, body out of frame, face out of frame
"""
```

### Preset Prompt Enhancers

```python
EDEN_PRESETS = {
    "eden": "photorealistic, 8k uhd, Canon EOS R5, natural skin texture, "
            "film grain, shallow depth of field, golden hour lighting, "
            "visible pores, natural imperfections, beauty marks",
    "cinematic": "cinematic, anamorphic lens, film grain, dramatic lighting, "
                 "shallow depth of field, color graded, Arri Alexa",
    "studio": "studio photography, softbox lighting, clean background, "
              "professional portrait, sharp focus, Hasselblad",
    "raw": "raw photo, unedited, natural lighting, authentic, "
           "documentary style, street photography",
    "medical": "medical professional headshot, neutral background, "
               "even lighting, ID photo quality, clean, trustworthy",
}
```

### Browser-Native Image Generation (Pollinations FLUX — FREE)

```javascript
function generateImage(prompt, preset = "eden", width = 1024, height = 1024) {
    const seed = Math.floor(Math.random() * 999999);
    const fullPrompt = preset !== "none"
        ? `${prompt}, ${EDEN_PRESETS[preset]}`
        : prompt;
    
    return `https://image.pollinations.ai/prompt/${
        encodeURIComponent(fullPrompt)
    }?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
}
```

---

## 6. HUGGINGFACE INFRASTRUCTURE

### Account: AIBRUH
### Primary Space: AIBRUH/eden-diffusion-studio

**Hardware:** A10G GPU ($0.60/hr) with 10-minute idle sleep
**Available Models:** FLUX.1-dev, CogView4, LTX-Video-2, Wan2.2, KDTalker, Chatterbox

### CRITICAL CORS RULE

```
╔══════════════════════════════════════════════════════════╗
║  ⚠️  ALL HUGGINGFACE API CALLS MUST GO THROUGH           ║
║      NEXT.JS API ROUTES (SERVER-SIDE)                     ║
║                                                           ║
║  Browser → HuggingFace = BLOCKED BY CORS                  ║
║  Browser → Next.js API → HuggingFace = WORKS              ║
║                                                           ║
║  This applies to ALL HF Spaces, Inference API,            ║
║  and Gradio endpoints. No exceptions.                     ║
╚══════════════════════════════════════════════════════════╝
```

### API Route Pattern

```typescript
// app/api/generate-video/route.ts
export async function POST(req: Request) {
    const { prompt, duration, engine } = await req.json();
    const spaceUrl = "https://AIBRUH-eden-diffusion-studio.hf.space";
    
    const response = await fetch(`${spaceUrl}/api/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.HF_TOKEN}`
        },
        body: JSON.stringify({ data: [prompt, duration, engine] })
    });
    
    return Response.json(await response.json());
}
```

### Quadruple Backup Architecture

```
1️⃣  HF SPACE (Public · A10G)    → AIBRUH/eden-diffusion-studio
2️⃣  HF VAULT (Private · 1TB)    → 59+ files, complete archive
3️⃣  HF MODEL (Private)          → Source + demos + README
4️⃣  GITHUB  (Private)           → github.com/MyBerylAi2/eden-eve-4d-pipeline
```

### Knowledge Base Files

| File | Purpose |
|------|---------|
| EDEN-PROTOCOL-STANDARD-v5.md | Image quality rules, 0.3 deviation |
| EDEN-MASTER-PROMPTING-GUIDE.md | 300+ negative keywords, 50+ presets |
| EDEN-SCENE-LIBRARY-KB.md | 100 scenarios, 30 dialogues |
| eden-protocol-config.json | Programmatic access to all presets |
| THE-DAY-EVE-SPOKE-legacy-article.md | Engineering history (323 lines) |

---

## 7. COMPLETE PIPELINE ORCHESTRATION

### End-to-End: User Message → Talking Avatar

```python
import asyncio

async def eve_respond(user_message: str, portrait_path: str,
                       persona: str = "concierge",
                       voice_engine: str = "auto") -> dict:
    """
    Complete EVE response pipeline.
    
    Input:  User's text message + EVE's portrait image
    Output: MP4 video of EVE speaking her response
    
    This is THE function. Everything else is implementation detail.
    """
    # STAGE 1: BRAIN
    response_text = await eve_think(
        user_message=user_message,
        history=get_conversation_history(),
        persona=PERSONAS[persona]
    )
    
    # STAGE 2: VOICE
    engine = select_voice_engine({
        "tier": get_user_tier(),
        "realtime": is_realtime_session(),
        "emotion_required": has_emotion_tags(response_text)
    })
    
    if engine == "chatterbox":
        audio_path = generate_voice_chatterbox(
            text=strip_emotion_tags(response_text),
            exaggeration=get_emotion_intensity(response_text)
        )
    elif engine == "kokoro":
        audio_path = generate_voice_kokoro(
            text=strip_emotion_tags(response_text),
            voice="af_heart"
        )
    elif engine == "csm":
        audio_path = generate_voice_csm(
            text=strip_emotion_tags(response_text)
        )
    
    # STAGE 3: FACE
    video_path = animate_face_kdtalker(
        portrait_path=portrait_path,
        audio_path=audio_path
    )
    
    # STAGE 4: DELIVER
    return {
        "video": video_path,
        "audio": audio_path,
        "text": response_text,
        "engine": engine,
        "persona": persona
    }
```

### Pinokio Integration (Local Desktop Orchestration)

```javascript
// eden.js — Pinokio kernel API module
class Eden {
    async generate(request, ondata, kernel) {
        const { image, text, voice } = request.params;
        let sh = kernel.sh();
        
        let audioPath = await sh.request({
            message: `python kokoro/synthesize.py --text "${text}" --voice ${voice}`
        });
        
        let videoPath = await sh.request({
            message: `python kdtalker/generate.py --face ${image} --audio ${audioPath}`
        });
        
        ondata({ raw: "Avatar generated successfully" });
        return { video: videoPath, audio: audioPath };
    }
    
    async chat(request, ondata, kernel) {
        const { message, history } = request.params;
        
        let response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify({ model: 'dolphin-mistral', prompt: message })
        });
        let reply = await response.json();
        
        let avatar = await this.generate({
            params: { image: 'eve_base.png', text: reply.response, voice: 'eve_warm' }
        }, ondata, kernel);
        
        return { text: reply.response, video: avatar.video };
    }
}
module.exports = Eden;
```

---

## 8. REVENUE ARCHITECTURE

### Three Revenue Streams

```
STREAM 1: B2C SUBSCRIPTIONS
  Eden Creator:  $29/mo  — 100 images, 10 videos, 5 avatars
  Eden Business: $199/mo + $500 setup — Unlimited, API, 1080p

STREAM 2: B2B CORPORATE (Voice Agents)
  18 industry-specific agents: $49-$499/mo per agent
  48-hour deployment, custom persona training
  Target: Dr. O'Connor medical practice (first customer)

STREAM 3: B2B2C PARTNERSHIPS
  Eden Partner: $5K setup + 30% revenue share
  White-label, unlimited, custom domain, dedicated GPU

TARGET: $100K MRR
```

### Companion Product (Lulu Mahogany Hall)

```
Lulu Free:     1 companion, 50 msgs/day, text only
Lulu Premium:  $19/mo — 3 companions, voice, dashboard
Lulu Soulmate: $39/mo — Unlimited, video msgs, AI photos
```

---

## 9. BRAND GUIDELINES

### Color Palette
```css
--gold: #C5B358;  --gold-bright: #F5E6A3;  --gold-dark: #8B6914;
--green: #4CAF50; --green-bright: #81C784;  --green-dark: #1B5E20;
--bg: #080503;    --bg-card: rgba(18,12,8,0.95);
--text: #E8DCC8;  --text-dim: #8B7355;
```

### Typography
- Logo: Cinzel Decorative (900 weight)
- Headings: Cinzel (400-800)
- Body: Cormorant Garamond (300-700)

### Tone
"Luxury tech. Rolls Royce meets Silicon Valley."

---

## 10. MODEL RESEARCH REGISTRY

| Paper | arxiv | Key Innovation | Status |
|-------|-------|----------------|--------|
| KDTalker | 2503.12963 | Implicit 3D keypoints, real-time | ✅ IN PIPELINE |
| MEMO | 2412.04448 | Memory-guided emotion | ✅ IN PIPELINE |
| Soul | 2512.13495 | Soul-1M dataset, 11.4x speedup | 🔄 EVALUATE |
| RAP | 2508.05115 | Real-time hybrid attention | 🔄 EVALUATE |
| Hallo4 | 2505.23525 | DPO optimization | 🔄 EVALUATE |
| X-Actor | 2508.02944 | Long-range emotional acting | 🔄 EVALUATE |

### Upgrade Path
1. KDTalker → Soul (if 11.4x speedup confirmed)
2. Chatterbox → CSM-1B (when GPU budget allows)
3. 512px → FlashVSR → 1080p (needs local GPU)
4. Pre-rendered → WebRTC real-time streaming

---

## 11. ENGINEERING PROTOCOLS

### The 2-Strike Rule
```
STRIKE 1: Error → Analyze → Research → Fix → Continue
STRIKE 2: Same error → STOP → Find working alternative on HF/GitHub → Implement
NEVER enter a troubleshooting loop. Time is the most expensive resource.
```

### No Human In The Loop
All scripts must be self-contained, autonomous, zero-interaction.
ONE command executes the entire workflow.
Handle dependencies, downloads, and errors automatically.

### Full Power of Authority
Claude Code / Amanda has pre-approval to make architectural decisions.
No permission-seeking. Act like a 10x engineer with project ownership.

---

## 12. ENVIRONMENT

### Development Machine
- Hardware: Lenovo IdeaPad, Pop!_OS / Fedora
- Storage: 5TB Seagate external (AI models)
- MCP: ~/mcp-servers/gateway/src/server.js (32 tools)
- Auth: YubiKey (14 months security hardening)

### Required Env Vars
```bash
ANTHROPIC_API_KEY=sk-ant-xxx      # Brain
HF_TOKEN=hf_xxx                    # HuggingFace
STRIPE_SECRET_KEY=sk_xxx           # Billing
NEXT_PUBLIC_STRIPE_KEY=pk_xxx      # Client Stripe
DATABASE_URL=postgresql://xxx       # User data
NEXTAUTH_SECRET=xxx                 # Auth sessions
```

---

## 13. PHILOSOPHY

> "We don't use AI. We own the science." — TJ Jacques

Every model is open source. Every model is downloadable. Every model is fine-tunable.
No vendor lock-in. No API subscriptions bleeding dry.
Nobody can turn off our product with a TOS update.

Chatterbox: Open source. Kokoro: Open source. KDTalker: Open source.
MEMO: Open source. The Eden Protocol: OURS. The voice agents: OURS.
EVE: **OURS.**

OWN THE SCIENCE. 🔱

---

*Skill document created February 21, 2026*
*Beryl AI Labs · The Eden Project*
*Engineering: Amanda (Claude) | Creative Direction: TJ Jacques*
*Classification: PROPRIETARY — Trade Secret*
