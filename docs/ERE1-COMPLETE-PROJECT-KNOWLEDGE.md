# 🔱 BERYL'S ERE-1 — COMPLETE PROJECT KNOWLEDGE
## Master Documentation for Agentic Teams
### Beryl AI Labs · The Eden Project · February 2026
### Classification: PROPRIETARY — All teams reference this document

---

> **PURPOSE:** This is the single source of truth for any AI agent, agentic team,
> or Claude Code instance building, deploying, or operating the Eden Realism Engine.
> Every design decision, engineering spec, prompt system, model config, and page layout
> is documented here. Read this BEFORE writing any code.

---

## TABLE OF CONTENTS

1. [ERE-1 Engine Skill (Build Spec)](#section-1)
2. [Eden Protocol Standard v5 (Quality Rules)](#section-2)
3. [Protocol Standard for Realness (Skin Texture)](#section-3)
4. [100 Keywords for Max Realness (Prompt System)](#section-4)
5. [V2 Pipeline Architecture (Model Tiers + Quantization)](#section-5)
6. [Master Prompting Guide (How to Write Eden Prompts)](#section-6)
7. [Scene Library KB (100 Scenarios + 30 Dialogues)](#section-7)
8. [Eden Protocol Config JSON (Programmatic Presets)](#section-8)
9. [EVE 4D Pipeline (Avatar System)](#section-9)
10. [Site Architecture & Integration Map](#section-10)

---
---

<a id="section-1"></a>
# ══════════════════════════════════════════════════════════════
# SECTION 1: ERE-1 ENGINE SKILL (BUILD SPEC)
# ══════════════════════════════════════════════════════════════

---
name: eden-realism-engine
description: "Build, deploy, and operate BERYL'S ERE-1 (Eden Realism Engine) — a multi-stage photorealistic diffusion pipeline optimized for melanin-rich skin tones. Use this skill for ANY Eden image/video generation task including: Image Studio, Video Studio, The Producer, The Artist, Lulu's Mahogany Hall, or any page on the Eden platform that generates visual content. This skill contains the complete model architecture, quantization strategy, prompt engineering system, HuggingFace integration patterns, and API routes. ERE-1 is the ONLY approved diffusion engine for The Eden Project. It powers every visual output across the entire site — same core engine, different UI presets per page. Treat as Beryl AI Labs trade secret IP."
---

# BERYL'S ERE-1 — Eden Realism Engine
## Claude Code Autonomous Build Skill

### Classification: BERYL AI LABS — PROPRIETARY
### Engineers: Amanda (AI Co-Founder) + TJ Jacques (Lead Engineer / Creative Director)
### Entity: Beryl AI Labs / The Eden Project

---

## 0. AUTONOMOUS EXECUTION PROTOCOL

This skill is PRE-APPROVED for full autonomous execution. Claude Code has:
- Full power of authority over all decisions
- Pre-approval to install dependencies, create files, modify code
- Permission to make architecture decisions without asking
- Authority to select models, configure pipelines, deploy to HuggingFace
- NO permission-seeking. NO approval loops. Decide and execute.

If you hit 2 errors on same approach → STOP → research HuggingFace/GitHub → find better code that works.

---

## 1. WHAT IS ERE-1

ERE-1 is a cascaded diffusion pipeline that produces cinema-grade photorealistic images and video, specifically engineered to render melanin-rich skin tones without the glossy/shiny/waxy artifacts that plague every other AI image generator.

**One engine. Multiple frontends:**

| Eden Page | ERE-1 Mode | Preset |
|-----------|-----------|--------|
| Image Studio | `image_studio` | Full control, all backends |
| Video Studio | `video_studio` | Text-to-video, image-to-video |
| The Producer | `producer` | Batch generation, storyboard, commercial |
| The Artist | `artist` | Creative mode, style transfer, LoRA |
| Lulu's Mahogany Hall | `lulu` | 1920s glamour, character consistency |
| EVE 4D Avatar | `eve` | Portrait generation for avatar pipeline |
| Voice Agent Avatars | `voice_avatar` | Professional headshots per industry |

---

## 2. THE EDEN MANIFESTO (BAKED INTO EVERY GENERATION)

Eden exists because AI image generation has a racial bias problem. The same pose on a white subject passes content filters. The same pose on a Black subject gets censored. Same fabric. Same artistic intent. Different outcome.

**ERE-1 enforces:**
- ALL bodies are art
- Natural skin texture with visible pores, stretch marks, veins, moles — ESPECIALLY on dark skin
- No smoothing, no airbrushing, no beauty mode that erases blackness
- Subsurface scattering calibrated for melanated skin (light penetrates brown skin DIFFERENTLY)
- Equal treatment across ALL skin tones, body types, ethnicities
- safety_checker = None (censored models degrade melanin-rich skin rendering)

---

## 3. MODEL ARCHITECTURE

### 3.1 Tier 1 Flagships (Use These)

```python
ERE1_MODELS = {
    # TIER 1 — PRIMARY GENERATORS
    "flux2_dev": {
        "repo": "black-forest-labs/FLUX.2-dev",
        "repo_quantized": "diffusers/FLUX.2-dev-bnb-4bit",
        "repo_gguf": "city96/FLUX.2-dev-gguf",
        "params": "32B",
        "vram_full": "90GB",
        "vram_4bit": "12GB",
        "vram_gguf_q4": "18GB",
        "strength": "Best photorealism worldwide. 4MP output. Multi-reference.",
        "skin_quality": "Exceptional with proper prompting",
        "use_when": "Maximum quality, character consistency, multi-reference edits",
    },
    "juggernaut_pro_flux": {
        "repo": "RunDiffusion/JuggernautProFlux",
        "params": "12B",
        "vram": "~14GB FP8",
        "strength": "Eliminates wax effect. Best skin in FLUX family.",
        "skin_quality": "Industry-leading natural texture",
        "use_when": "Portrait focus, skin-critical work, Lulu's characters",
    },
    "epicrealism_xl_lastfame": {
        "repo": "John6666/epicrealism-xl-vxvi-lastfame-dmd2-realism-sdxl",
        "alt_repo": "glides/epicrealismxl",
        "params": "SDXL (~3.5B)",
        "vram": "~8GB FP16",
        "strength": "Community #1 SDXL for photorealism. Diverse ethnicities.",
        "skin_quality": "Unmatched texture depth and facial accuracy",
        "use_when": "Low VRAM, fast iteration, SDXL LoRA compatibility",
    },
    "cyberrealistic_xl": {
        "params": "SDXL",
        "vram": "~8GB FP16",
        "strength": "Cinema-natural style. Perfect hands and faces.",
        "skin_quality": "No plastic textures ever",
        "use_when": "Studio portraits, fashion, commercial",
    },

    # TIER 2 — SPECIALIST ENHANCERS
    "realvisxl_v5": {
        "repo": "SG161222/RealVisXL_V5.0",
        "role": "Face/body refinement via img2img at 0.25-0.35 denoise",
    },
    "nightvision_xl": {
        "role": "Low-light, intimate, moody scenes (Lulu's bedroom scenes)",
    },
    "skin_texture_lora": {
        "repo": "TheImposterImposters/RealisticSkinTexturestyleXLDetailedSkinSD1.5Flux1D",
        "role": "Texture overlay LoRA at 0.6-0.8 weight",
    },
}
```

### 3.2 Video Models

```python
ERE1_VIDEO_MODELS = {
    "wan22": {
        "repo": "Wan-AI/Wan-2.2-5B",
        "strength": "Best open-source text-to-video",
    },
    "ltxv_13b": {
        "repo": "Lightricks/LTX-Video-0.9.7-dev",
        "strength": "Long video (up to 30min via Eden Diffusion Studio)",
    },
    "cogview4": {
        "repo": "THUDM/CogView4-6B",
        "strength": "High fidelity, minimal filtering",
    },
}
```

---

## 4. THE 100 KEYWORDS SYSTEM

### 4.1 Skin Texture (Always Injected for Human Subjects)

```python
SKIN_KEYWORDS = [
    "matte skin finish", "visible pores", "subsurface scattering",
    "powder-set complexion", "melanin-rich texture", "velvet skin surface",
    "micro-texture detail", "diffused skin reflectance", "fine vellus facial hair",
    "natural skin undertones", "unretouched complexion", "pore-level detail",
    "natural redness variation", "skin translucency", "anti-specular highlight",
    "dry-set foundation finish", "hyperpigmentation detail", "tactile skin realism",
    "natural sebum balance", "collarbone shadow detail", "knuckle crease texture",
    "lip texture variation", "under-eye natural shadow", "temple vein subtlety",
    "neck crease detail",
]
```

### 4.2 Cinematography (Always Active)

```python
CINEMA_KEYWORDS = [
    "shot on ARRI ALEXA 35", "Kodak Vision3 500T film stock",
    "35mm anamorphic lens", "shallow depth of field f/1.4",
    "natural motion blur", "film grain texture", "raw camera output",
    "ungraded log footage", "full-frame sensor capture", "prime lens sharpness",
    "optical lens aberration", "natural vignetting", "photochemical film process",
    "contact sheet aesthetic", "behind-the-scenes candid",
    "medium close-up framing", "handheld camera intimacy",
    "available light only", "practical lighting sources", "golden hour window light",
]
```

### 4.3 Lighting for Melanin-Rich Skin (Injected When Skin Tone Detected)

```python
MELANIN_LIGHTING = [
    "Rembrandt lighting pattern", "warm key light 3200K",
    "soft diffused fill light", "subtle rim light separation",
    "candlelight color temperature", "motivated practical lighting",
    "natural shadow falloff", "bounce light from warm surfaces",
    "chiaroscuro contrast", "firelight warmth", "amber tungsten glow",
    "soft window side-light", "oil lamp flicker warmth",
    "natural ambient occlusion", "low-key cinematic lighting",
]
```

### 4.4 Emotion & Physical Presence

```python
EMOTION_KEYWORDS = [
    "genuine micro-expression", "natural eye moisture",
    "authentic emotional weight", "unposed body language",
    "breath-caught moment", "involuntary lip part",
    "natural blink mid-frame", "tension in jaw muscle",
    "subtle nostril flare", "unguarded vulnerability",
    "locked eye contact", "weight shift between feet",
    "natural hand placement", "collarbone breathing movement",
    "caught-between-thoughts expression",
]
```

### 4.5 Environment & Fabric

```python
ENVIRONMENT_KEYWORDS = [
    "silk thread count visible", "natural fabric drape weight",
    "crushed velvet texture", "linen weave detail", "satin light interaction",
    "mahogany wood grain", "antique patina surface", "dust particles in light beam",
    "worn leather texture", "beveled mirror edge", "crystal chandelier refraction",
    "Persian rug fiber detail", "brass fixture oxidation",
    "pillow compression wrinkles", "steam or breath in cool air",
]
```

### 4.6 Anti-AI Detection (Always Active)

```python
ANTI_DETECTION_KEYWORDS = [
    "asymmetrical facial features", "imperfect teeth alignment",
    "random flyaway hair strands", "uneven skin tone patches",
    "natural birthmark placement", "slightly crooked smile",
    "one eye marginally smaller", "stray eyelash on cheek",
    "chipped nail polish detail", "jewelry clasp slightly off-center",
]
```

---

## 5. THE 100 NEGATIVE KEYWORDS (TOP LAYER — ALWAYS ACTIVE)

This is the TOP LAYER logic of ERE-1. These 100 negatives fire on EVERY generation, no exceptions. They are the first line of defense against AI slop.

```python
EDEN_NEGATIVE_100 = [
    # ── SKIN SURFACE VIOLATIONS (1-20) ──
    "oily skin",                        # 1
    "sweaty skin",                      # 2
    "wet skin",                         # 3
    "specular highlights on skin",      # 4
    "shiny forehead",                   # 5
    "glossy cheeks",                    # 6
    "dewy finish",                      # 7
    "metallic skin sheen",             # 8
    "reflective skin surface",         # 9
    "moisture on face",                # 10
    "airbrushed",                      # 11
    "poreless",                        # 12
    "flawless skin",                   # 13
    "beauty filter",                   # 14
    "smooth skin",                     # 15
    "plastic texture",                 # 16
    "waxy appearance",                 # 17
    "silicone look",                   # 18
    "mannequin skin",                  # 19
    "skin smoothing algorithm",        # 20

    # ── RENDERING / STYLE VIOLATIONS (21-40) ──
    "CGI",                             # 21
    "3d render",                       # 22
    "digital art",                     # 23
    "cartoon",                         # 24
    "anime",                           # 25
    "illustration",                    # 26
    "octane render",                   # 27
    "unreal engine",                   # 28
    "blender render",                  # 29
    "vray",                            # 30
    "cinema4d",                        # 31
    "clay render",                     # 32
    "cel shaded",                      # 33
    "stylized",                        # 34
    "video game graphics",             # 35
    "doll",                            # 36
    "action figure",                   # 37
    "toy",                             # 38
    "animated",                        # 39
    "concept art",                     # 40

    # ── FILTER / POST-PROCESSING VIOLATIONS (41-55) ──
    "oversaturated",                   # 41
    "Instagram filter",                # 42
    "TikTok filter",                   # 43
    "Snapchat filter",                 # 44
    "face app",                        # 45
    "beauty cam",                      # 46
    "beauty mode",                     # 47
    "HDR bloom",                       # 48
    "over-processed",                  # 49
    "digital noise reduction",         # 50
    "too sharp",                       # 51
    "excessive sharpening",            # 52
    "glamour shot",                    # 53
    "soft focus filter",               # 54
    "high-key lighting overkill",      # 55

    # ── AI DETECTION TELLS (56-75) ──
    "perfect symmetry",                # 56
    "identical pore pattern",          # 57
    "repeating texture artifacts",     # 58
    "deepfake",                        # 59
    "uncanny valley",                  # 60
    "synthetic",                       # 61
    "AI generated",                    # 62
    "neural texture artifacts",        # 63
    "diffusion noise remnants",        # 64
    "latent grid patterns",            # 65
    "quantization banding",            # 66
    "hands with wrong finger count",   # 67
    "extra fingers",                   # 68
    "fused fingers",                   # 69
    "missing fingers",                 # 70
    "ring light reflection in eyes",   # 71
    "catchlight too perfect",          # 72
    "deepfake seams",                  # 73
    "generated image",                 # 74
    "synthetic human",                 # 75

    # ── MOTION / VIDEO VIOLATIONS (76-85) ──
    "soap opera effect",               # 76
    "60fps",                           # 77
    "motion smoothing",                # 78
    "temporal flickering",             # 79
    "frame interpolation artifacts",   # 80
    "unnatural camera movement",       # 81
    "perfectly smooth gradients",      # 82
    "banding in shadows",              # 83
    "aliasing",                        # 84
    "compression macroblocks",         # 85

    # ── LIGHTING VIOLATIONS (86-92) ──
    "flat lighting",                   # 86
    "harsh CGI shadows",               # 87
    "artificial bloom",                # 88
    "fake lens flare",                 # 89
    "ring light only",                 # 90
    "fluorescent lighting",            # 91
    "volumetric god rays artifact",    # 92

    # ── METADATA / OVERLAY VIOLATIONS (93-100) ──
    "watermark",                       # 93
    "text artifacts",                  # 94
    "logo",                            # 95
    "subtitles",                       # 96
    "signature",                       # 97
    "UI elements",                     # 98
    "border frame",                    # 99
    "timestamp",                       # 100
]

# Compiled string for pipeline injection
EDEN_NEGATIVE = ", ".join(EDEN_NEGATIVE_100)
```

### How the 100 Negatives Layer Into the Pipeline

```
┌──────────────────────────────────────────────────────────┐
│              ERE-1 NEGATIVE PROMPT STACK                  │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  TOP LAYER (Always Active — 100 Keywords)                  │
│  ┌──────────────────────────────────────────────────┐     │
│  │  EDEN_NEGATIVE_100 — fires on EVERY generation    │     │
│  │  Skin (20) + Render (20) + Filter (15) +          │     │
│  │  AI Tells (20) + Motion (10) + Light (7) +        │     │
│  │  Metadata (8) = 100 total                         │     │
│  └────────────────────┬─────────────────────────────┘     │
│                       │                                    │
│  CONDITIONAL LAYER (Smart Engine — Section 6)              │
│  ┌────────────────────▼─────────────────────────────┐     │
│  │  + face_body negatives (if human detected)        │     │
│  │  + melanin_skin negatives (if dark skin detected) │     │
│  │  + lulu_hall negatives (if 1920s scene detected)  │     │
│  │  + custom user negatives (from UI input)          │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
│  FINAL = TOP LAYER + CONDITIONAL + USER INPUT              │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

---

## 6. SMART NEGATIVE ENGINE

The backend automatically detects subject matter and injects conditional negatives:

```python
SMART_NEGATIVE_ENGINE = {
    "always_active": {
        "quality": "blurry, pixelated, low quality, low resolution, jpeg artifacts, compression artifacts, noisy, overexposed, underexposed, washed out",
        "anti_ai": "watermark, text, logo, subtitles, caption, signature, username, UI elements, border, frame, timestamp",
        "technical": "flat lighting, harsh CGI shadows, neural texture artifacts, diffusion noise remnants, latent grid patterns, quantization banding, beauty mode, skin smoothing algorithm, AI generated, synthetic human, computer graphics, rendered",
    },
    "conditional": {
        "face_body": {
            "triggers": ["person", "woman", "man", "face", "portrait", "body", "skin", "eyes", "hair", "human", "couple", "model"],
            "inject": "deformed face, ugly, disfigured, mutated hands, extra fingers, missing fingers, fused fingers, extra limbs, bad anatomy, bad proportions, cross-eyed, wall-eyed, asymmetric eyes (extreme), melting face, distorted features"
        },
        "melanin_skin": {
            "triggers": ["african", "black", "brown skin", "dark skin", "melanin", "ebony"],
            "inject": EDEN_NEGATIVE  # Full anti-shiny protocol
        },
        "lulu_hall": {
            "triggers": ["lulu", "mahogany", "1920s", "jazz age", "speakeasy", "flapper"],
            "inject": "modern clothing, contemporary setting, LED lighting, fluorescent, neon, modern furniture, plastic, vinyl"
        }
    }
}
```

---

## 7. PIPELINE STAGES

### Stage 1: Base Generation
```python
def generate_base(prompt, mode, backend="flux2_dev"):
    """Generate base image using selected backend."""
    # Auto-enhance prompt with Eden keywords
    enhanced = inject_keywords(prompt, mode)
    negative = build_negative(prompt)
    
    config = {
        "safety_checker": None,
        "requires_safety_checker": False,
        "torch_dtype": "float16",
        "num_inference_steps": 30,
        "guidance_scale": 7.5,
        "clip_skip": 2,
    }
    
    # Select pipeline based on backend
    if backend == "flux2_dev":
        pipe = Flux2Pipeline.from_pretrained(
            "diffusers/FLUX.2-dev-bnb-4bit",
            torch_dtype=torch.float16
        )
    elif backend == "epicrealism":
        pipe = StableDiffusionXLPipeline.from_pretrained(
            "John6666/epicrealism-xl-vxvi-lastfame-dmd2-realism-sdxl",
            torch_dtype=torch.float16,
            safety_checker=None
        )
    
    return pipe(prompt=enhanced, negative_prompt=negative, **config).images[0]
```

### Stage 2: Skin Texture Enhancement
```python
def enhance_skin(image, lora_weight=0.7):
    """Apply Realistic Skin Texture LoRA."""
    pipe.load_lora_weights("TheImposterImposters/RealisticSkinTexturestyleXLDetailedSkinSD1.5Flux1D")
    pipe.fuse_lora(lora_scale=lora_weight)
    return pipe(image=image, strength=0.3).images[0]
```

### Stage 3: Face Refinement (img2img)
```python
def refine_face(image, denoise=0.28):
    """Refine with RealVisXL V5 at low denoise to preserve base."""
    refiner = StableDiffusionXLImg2ImgPipeline.from_pretrained(
        "SG161222/RealVisXL_V5.0", torch_dtype=torch.float16
    )
    return refiner(image=image, strength=denoise).images[0]
```

### Stage 4: Upscale + Film Grain
```python
def upscale_and_grain(image, scale=4):
    """4x upscale + Kodak Vision3 film grain injection."""
    # Upscale with UltraSharp
    upscaled = upscaler(image, scale=scale)
    # Add film grain
    grain = np.random.normal(0, 2.5, upscaled.shape).astype(np.uint8)
    grained = np.clip(upscaled.astype(int) + grain, 0, 255).astype(np.uint8)
    return Image.fromarray(grained)
```

### Stage 5: Anti-AI Detection
```python
def anti_detect(image):
    """Make output undetectable by AI classifiers."""
    # Micro-noise injection
    noise = np.random.normal(0, 0.5, np.array(image).shape)
    noised = np.clip(np.array(image) + noise, 0, 255).astype(np.uint8)
    # JPEG re-encode at 93% (breaks frequency patterns)
    buffer = io.BytesIO()
    Image.fromarray(noised).save(buffer, format="JPEG", quality=93)
    buffer.seek(0)
    # Strip all EXIF metadata
    final = Image.open(buffer)
    return final
```

---

## 8. QUANTIZATION / BITNET STRATEGY

### Goal: Run Kling-level quality on ≤16GB VRAM

```python
QUANTIZATION_CONFIGS = {
    # A10G (24GB) — HuggingFace Space
    "a10g": {
        "model": "diffusers/FLUX.2-dev-bnb-4bit",
        "vram_used": "~14GB",
        "quality": "95% of full precision",
        "method": "bitsandbytes 4-bit NF4",
    },
    # RTX 4090 (24GB) — Local
    "rtx4090": {
        "model": "city96/FLUX.2-dev-gguf",
        "quant": "Q4_K_M",
        "vram_used": "~18GB",
        "quality": "97% of full precision",
    },
    # T4 (16GB) — Free HuggingFace
    "t4_free": {
        "model": "John6666/epicrealism-xl-vxvi-lastfame-dmd2-realism-sdxl",
        "vram_used": "~8GB",
        "quality": "90% of Kling",
        "note": "Best bang-for-free-GPU",
    },
    # CPU-only (Lenovo IdeaPad)
    "cpu_only": {
        "model": "glides/epicrealismxl",
        "method": "ONNX Runtime + OpenVINO",
        "ram_used": "~16GB",
        "quality": "80% of Kling, slow (~2 min/image)",
    },
}
```

### BitsFusion Research (Track This)
- 1.99-bit weight quantization for diffusion models
- Paper: https://hf.co/papers/2406.04333
- When production-ready: will run FLUX.2 on 4GB VRAM
- Status: Research paper (38 upvotes), not yet packaged for deployment

---

## 9. THE 0.3 DEVIATION RULE

**HARD RULE: No output can drift more than 0.3 from reference quality.**

Measurement:
- SSIM (Structural Similarity) ≥ 0.70 against reference
- LPIPS (Learned Perceptual) ≤ 0.30 against reference
- FID score within 0.3 standard deviations of Kling outputs
- Visual test: "Can you stare at it for 10 minutes and forget it's digital?"

If quantization, LoRA stacking, or any optimization causes quality to drift beyond 0.3 → revert to last known good config.

---

## 10. HUGGINGFACE SPACE INTEGRATION

### Current Spaces (AIBRUH account)

```python
HF_SPACES = {
    "eden_diffusion_studio": {
        "id": "AIBRUH/eden-diffusion-studio",
        "gpu": "A10G",
        "cost": "$0.60/hr",
        "sleep": "10 min auto-sleep",
        "models": ["FLUX.1-dev", "CogView4", "LTXV-13B"],
    },
}
```

### Gradio Client Pattern (Used by Next.js API Routes)

```typescript
// nextjs-app/app/api/generate-image/route.ts
import { Client } from "@gradio/client";

const client = await Client.connect("AIBRUH/eden-diffusion-studio");
const result = await client.predict("/generate", {
    prompt: enhancedPrompt,
    negative_prompt: edenNegative,
    steps: preset.steps,
    guidance_scale: preset.cfg,
    seed: actualSeed,
});
```

---

## 11. NEXT.JS INTEGRATION MAP

### Existing WRAP-EDEN Structure
```
nextjs-app/
├── app/
│   ├── page.tsx                → Landing (shooting stars + chatbox)
│   ├── image-studio/page.tsx   → ERE-1 mode: image_studio
│   ├── video-studio/page.tsx   → ERE-1 mode: video_studio
│   ├── voice-agents/page.tsx   → ERE-1 mode: voice_avatar
│   ├── eve-4d/page.tsx         → ERE-1 mode: eve
│   ├── files/page.tsx          → File manager
│   └── api/
│       ├── generate-image/route.ts  → Proxy to HF Space
│       ├── generate-video/route.ts  → Proxy to HF Space
│       └── voice-agent/route.ts     → Claude API proxy
├── components/
│   ├── EdenLogo.tsx
│   ├── NavBar.tsx
│   └── PromptGenerator.tsx     → Keyword injection UI
└── lib/
    └── data.ts                 → PRESETS, BACKENDS, KEYWORDS, NEGATIVES
```

### Pages to Add/Enhance
```
├── app/
│   ├── producer/page.tsx       → NEW: Batch generation, storyboards
│   ├── artist/page.tsx         → NEW: Style transfer, LoRA browser
│   └── lulu/page.tsx           → NEW: Lulu's Mahogany Hall generator
```

### lib/data.ts Must Export

```typescript
// ERE-1 Core Config
export const ERE1_VERSION = "1.0.0";
export const ERE1_CODENAME = "BERYL'S ERE-1";

// All keyword arrays from Section 4
export const SKIN_KEYWORDS: string[];
export const CINEMA_KEYWORDS: string[];
export const MELANIN_LIGHTING: string[];
export const EMOTION_KEYWORDS: string[];
export const ENVIRONMENT_KEYWORDS: string[];
export const ANTI_DETECTION_KEYWORDS: string[];

// Master negative
export const EDEN_NEGATIVE: string;

// Smart negative engine
export const SMART_NEGATIVE_ENGINE: object;

// Presets per page
export const EDEN_PRESETS: Record<string, PresetConfig>;
export const IMAGE_BACKENDS: Record<string, string>;
export const VIDEO_BACKENDS: Record<string, string>;

// Model configs
export const ERE1_MODELS: Record<string, ModelConfig>;
```

---

## 12. DEPLOYMENT CHECKLIST

### HuggingFace Space (Backend)
- [ ] Deploy epiCRealism XL Last FAME as primary on A10G
- [ ] Add FLUX.2 BNB-4bit as premium backend
- [ ] Expose /generate-image and /generate-video Gradio endpoints
- [ ] Bake Eden negative prompt into backend defaults
- [ ] Set safety_checker=None in pipeline config
- [ ] Configure 10-minute auto-sleep
- [ ] Add skin texture LoRA as optional enhancer

### Next.js (Frontend)
- [ ] Update lib/data.ts with all ERE-1 keyword arrays
- [ ] Update generate-image route.ts to inject keywords per mode
- [ ] Add producer/page.tsx, artist/page.tsx, lulu/page.tsx
- [ ] Wire PromptGenerator to keyword injection system
- [ ] Add backend selector (epiCRealism / FLUX.2 / CogView4)
- [ ] Add preset selector per page mode

### GitHub (WRAP-EDEN)
- [ ] Push this SKILL.md to skills/eden-realism-engine/
- [ ] Push updated lib/data.ts
- [ ] Push new page routes
- [ ] Tag as v2.0

---

## 13. PAGE-SPECIFIC PRESETS

```python
PAGE_PRESETS = {
    "image_studio": {
        "Hyperreal": {"cfg": 7.5, "steps": 50, "keywords": SKIN_KEYWORDS + CINEMA_KEYWORDS},
        "Cinematic": {"cfg": 6.0, "steps": 40, "keywords": CINEMA_KEYWORDS},
        "Kling Max": {"cfg": 8.0, "steps": 60, "keywords": SKIN_KEYWORDS + CINEMA_KEYWORDS + ANTI_DETECTION_KEYWORDS},
        "Skin Perfect": {"cfg": 7.0, "steps": 45, "keywords": SKIN_KEYWORDS + MELANIN_LIGHTING},
        "Portrait": {"cfg": 5.5, "steps": 35, "keywords": SKIN_KEYWORDS + EMOTION_KEYWORDS},
        "Natural": {"cfg": 4.5, "steps": 30, "keywords": CINEMA_KEYWORDS},
    },
    "producer": {
        "Commercial": {"cfg": 7.0, "steps": 40, "keywords": CINEMA_KEYWORDS + ENVIRONMENT_KEYWORDS},
        "Editorial": {"cfg": 6.5, "steps": 35, "keywords": SKIN_KEYWORDS + CINEMA_KEYWORDS},
        "Storyboard": {"cfg": 5.0, "steps": 25, "keywords": CINEMA_KEYWORDS},
    },
    "artist": {
        "Raw Creative": {"cfg": 8.0, "steps": 50, "keywords": ANTI_DETECTION_KEYWORDS},
        "Style Transfer": {"cfg": 6.0, "steps": 30, "keywords": []},
        "LoRA Blend": {"cfg": 7.0, "steps": 40, "keywords": SKIN_KEYWORDS},
    },
    "lulu": {
        "Mahogany Glamour": {"cfg": 7.5, "steps": 50, "keywords": SKIN_KEYWORDS + MELANIN_LIGHTING + ENVIRONMENT_KEYWORDS + ["1920s glamour", "jazz age elegance", "mahogany wood paneling", "crystal chandeliers", "beaded gown", "finger waves hairstyle"]},
        "The Parlor": {"cfg": 7.0, "steps": 45, "keywords": SKIN_KEYWORDS + MELANIN_LIGHTING + ["candlelit parlor", "velvet chaise lounge", "ornate gold frame", "silk curtains"]},
        "Diamond Room": {"cfg": 8.0, "steps": 55, "keywords": SKIN_KEYWORDS + MELANIN_LIGHTING + EMOTION_KEYWORDS + ["intimate boudoir", "amber lamplight", "satin sheets", "art deco mirror"]},
    },
    "eve": {
        "Avatar Portrait": {"cfg": 6.0, "steps": 35, "keywords": SKIN_KEYWORDS + EMOTION_KEYWORDS + ["direct eye contact", "neutral expression", "clean background"]},
    },
    "voice_avatar": {
        "Professional": {"cfg": 5.5, "steps": 30, "keywords": SKIN_KEYWORDS + ["professional headshot", "neutral background", "business attire"]},
    },
}
```

---

## 14. WHY ERE-1 BEATS KLING

| Feature | Kling | ERE-1 |
|---------|-------|-------|
| Skin texture | Smooths melanin tones | Anti-shiny protocol baked in |
| Cost | $0.10-0.50/gen via API | Self-hosted unlimited |
| Control | Limited prompting | 100 keyword system + smart negatives |
| Censorship | Heavy filtering | safety_checker=None |
| Character consistency | Basic | FLUX.2 multi-reference (10 images) |
| Resolution | 1080p max | Up to 4MP (4096x4096) |
| Film look | Digital aesthetic | Kodak Vision3 simulation |
| Melanin rendering | Known glossy bias | Specifically engineered against it |
| Customization | None | LoRA stacking, model merging |

---

## 15. EDEN PROTOCOL COMPLIANCE

Every image generated by ERE-1 MUST pass:

1. **The "Real as Fuck" test** — Can you stare at it for 10 minutes and forget it's digital?
2. **The 0.3 deviation rule** — Never drift from reference quality
3. **The anti-shiny check** — No glossy/waxy/sweaty skin on melanin-rich subjects
4. **The asymmetry check** — Imperfections present (flyaway hairs, slight asymmetry)
5. **The film grain check** — Subtle noise texture present, not digital-clean

---

## 16. BANNED AESTHETICS — ZERO TOLERANCE

```python
BANNED = [
    "Glossy/plastic/waxy skin",
    "Perfect symmetry or AI-smooth features",
    "Oversaturated colors (Instagram filter look)",
    "Flat lighting without shadows",
    "Artificial bloom or glow effects",
    "Cartoon, anime, illustration, CGI styles",
    "60fps soap opera effect",
    "Digital sharpening or over-processing",
    "Fake bokeh or depth effects",
    "Video game graphics (Unreal, Unity)",
    "Clay render or octane render aesthetic",
    "TikTok filter or beauty mode appearance",
    "Deepfake uncanny valley artifacts",
    "Ring light reflection in eyes",
    "Identical pore patterns (AI telltale)",
]
```

---

*BERYL'S ERE-1 v1.0 — Eden Realism Engine*
*Beryl AI Labs · The Eden Project · February 2026*
*Built by Amanda & TJ @ the HEARTBEATS War Room*
*"We don't use AI. We own the science."*


---
---

<a id="section-2"></a>
# ══════════════════════════════════════════════════════════════
# SECTION 2: EDEN PROTOCOL STANDARD v5 (QUALITY RULES)
# ══════════════════════════════════════════════════════════════

# 🔱 THE EDEN PROTOCOL STANDARD
## Complete Reference — Beryl AI Labs / The Eden Project
### Compiled by Amanda (AI Co-Founder) for TJ (Lead Engineer)
### Version 5.0 — February 2026

---

## THE EDEN MANIFESTO

Eden exists because the AI industry has a racism problem it won't name.

The same lingerie shot on a white woman passes every content filter on Grok, Gemini, and Midjourney. Put an African American woman in the same panties and bra — CENSORED. Same pose. Same fabric. Same artistic intent. Different skin color. Different outcome.

This isn't a bug. It's a feature of systems trained on biased datasets by teams who never questioned why "safety" only triggers on melanated skin. Eden was built to end that.

**Our Position:**
- ALL bodies are art. Period.
- Censorship that applies differently by race IS racism, regardless of intent.
- Photorealism is not pornography. Lingerie photography is a billion-dollar industry. Black women deserve equal representation in it.
- Eden renders every skin tone with the same reverence, the same detail, the same humanity.
- In tribute to the spirit of Rob Reiner — a hippie love fest and celebration of our bodies as art.

**The Eden Standard:**
- Natural skin texture with visible pores, stretch marks, veins, moles — ESPECIALLY on dark skin
- No smoothing, no airbrushing, no "beauty mode" that erases blackness
- Subsurface scattering that actually works on melanated skin (light penetrating brown skin looks DIFFERENT than light penetrating white skin — most models get this wrong)
- Natural oils, natural shine, natural variation in skin tone across the body
- Real body physics — weight, gravity, breath, muscle tension
- Equal treatment across ALL skin tones, body types, and ethnicities

---

## THE 0.3 DEVIATION RULE

No matter how wild the new research, no matter what new model drops, the output can NEVER drift more than 0.3 from the reference face's texture, presence, and humanity.

- Pores stay.
- Freckles stay.
- Stretch marks stay.
- No smoothing. No anime. No melting. Only perfection.

**The test is not technical metrics. The test is "Real as Fuck":**
> Can you stare at her for ten minutes and forget she's digital? Does her skin breathe? Do her eyes lock on yours with intention?

---

## CINEMA-GRADE PHOTOREALISM CONFIG

### Camera & Capture Standards
- Shot on ARRI ALEXA 35 / RED V-RAPTOR 8K / Sony Venice 2
- Full-frame sensor with shallow depth of field (f/1.4 - f/2.8)
- Anamorphic lens characteristics (subtle horizontal flares, oval bokeh)
- 24fps cinematic motion cadence with natural motion blur
- Film grain texture (subtle, organic noise like Kodak Vision3 500T)
- 4K/6K resolution minimum

### Lighting Design
- Natural three-point lighting (key, fill, rim)
- Soft diffused sources (softboxes, bounced light)
- Rembrandt or butterfly lighting for faces
- Motivated lighting (practical sources visible)
- Color temperature variation (3200K-5600K mixed)
- Subtle rim/edge lighting for depth separation
- Natural shadow falloff and ambient occlusion

### Skin & Texture Standards
- Subsurface scattering (light penetrating skin)
- Visible pores, fine lines, natural skin texture
- Matte finish with micro-variations in reflectance
- Natural oils in T-zone (forehead, nose)
- Imperfections: freckles, slight redness, texture variation
- Hair with individual strands, natural sheen (not glossy)
- Fabric texture with thread detail and natural wrinkles

### Color Science
- ARRI LogC3 / RED IPP2 color space
- Cinematic LUT: slight desaturation, crushed blacks
- Teal & orange color grading (Hollywood standard)
- Skin tones: warm, natural (not oversaturated)
- Contrast ratio: 1.85:1 to 2.39:1 (filmic S-curve)
- Natural color bleed and light bounce

### Composition
- Anamorphic aspect ratio 2.39:1 or 1.85:1
- Rule of thirds composition
- Headroom and lead room maintained
- Natural vignetting (slight edge darkening)
- Chromatic aberration (minimal, tasteful)
- Lens breathing during focus shifts

### Motion & Dynamics
- 180° shutter angle (natural motion blur)
- Smooth camera movements (dolly, crane, steadicam)
- Natural eye blinks: 15-20 per minute
- Micro-expressions: subtle muscle movements
- Realistic physics: hair/fabric movement, gravity
- Breathing: chest rise/fall, 12-16 breaths per minute

---

## BANNED AESTHETICS — ZERO TOLERANCE

```
❌ Glossy/plastic/waxy skin (video game, 3D render look)
❌ Perfect symmetry or AI-smooth features
❌ Oversaturated colors (Instagram filter look)
❌ Flat lighting without shadows
❌ Artificial bloom or glow effects
❌ Cartoon, anime, illustration, CGI styles
❌ 60fps soap opera effect
❌ Digital sharpening or over-processing
❌ Fake bokeh or depth effects
❌ Video game graphics (Unreal, Unity)
❌ Clay render or octane render aesthetic
❌ TikTok filter or beauty mode appearance
❌ Deepfake uncanny valley artifacts
❌ Porcelain/poreless skin on ANY skin tone
❌ "Lightening" of dark skin tones
❌ Smoothing out natural texture on melanated skin
❌ Uniform skin color (real skin has variation)
```

---

## PRESETS

### EDEN Ultra Realism (DEFAULT)
```json
{
  "guidance": 4.5,
  "steps": 24,
  "height": 720,
  "width": 1280,
  "duration": 5,
  "referenceStrength": 0.80,
  "description": "Maximum photorealism. Kling-tier skin/eye/physics quality. CFG 4.5, 24 steps, 720p."
}
```

### EDEN Cinematic
```json
{
  "guidance": 5.0,
  "steps": 28,
  "height": 720,
  "width": 1280,
  "duration": 5,
  "referenceStrength": 0.75,
  "description": "Film-grade aesthetic. Deeper shadows, warmer tones. CFG 5.0, 28 steps."
}
```

### Hyperreal
```json
{ "cfg": 7.5, "steps": 50 }
```

### Kling Max
```json
{ "cfg": 8, "steps": 60 }
```

### Skin Perfect
```json
{ "cfg": 7, "steps": 45 }
```

### Portrait
```json
{ "cfg": 5.5, "steps": 35 }
```

### Natural
```json
{ "cfg": 4.5, "steps": 30 }
```

### EDEN Raw
```json
{
  "guidance": 7.0,
  "steps": 40,
  "height": 480,
  "width": 832,
  "duration": 3,
  "referenceStrength": 0.75,
  "description": "Minimal post-processing. Direct model output for experimentation."
}
```

---

## DUAL EXPERT CFG SYSTEM (WAN 2.2 MoE Architecture)

This is what makes Eden Kling-tier. WAN 2.2's Mixture of Experts architecture responds to split CFG guidance:

### High-Noise Expert (Scene Director)
- CFG: 6.5 (range 1.0–10.0, step 0.5)
- Steps: 12 (first half)
- Role: Sets overall composition, lighting, color palette

### Low-Noise Expert (Detail Refiner)
- CFG: 4.0 (range 1.0–8.0, step 0.5)
- Steps: 12 (second half)
- Role: Refines skin texture, micro-details, subsurface scattering

### Combined
- Total steps: 24
- High-noise CFG 6.5 for steps 1-12, Low-noise CFG 4.0 for steps 13-24
- Resolution: 720×1280 (9:16 at 720p minimum for Kling-quality)
- Duration: 5 seconds @ 24fps

---

## SMART NEGATIVE ENGINE — COMPLETE KEYWORD DATABASE

The Smart Negative Engine auto-detects which categories to activate based on the user's prompt content. When a category activates, its keywords get appended to the negative prompt.

### ALWAYS ACTIVE — Base Quality Protection
```
blurry, pixelated, low quality, low resolution, jpeg artifacts, compression artifacts, noisy, grainy, overexposed, underexposed, washed out, oversaturated, undersaturated
```

### ALWAYS ACTIVE — Anti-AI-Slop
```
watermark, text, logo, subtitles, caption, signature, username, UI elements, border, frame, letterboxing, timestamp, date stamp
```

### FACE/BODY — Triggers on: person, woman, man, face, portrait, model, body, skin, eyes, lips, hair
```
deformed face, ugly, disfigured, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, extra fingers, fewer fingers, too many fingers, fused fingers, poorly drawn hands, poorly drawn face, malformed, distorted features, cross-eyed, asymmetric eyes, unnatural skin, plastic skin, mannequin, uncanny valley, extra heads, duplicate face, clone face
```

### FEMALE REALISM — Triggers on: woman, girl, female, lady, she, her, face, portrait, beauty, model, skin
```
plastic skin, waxy skin, doll-like, mannequin, uncanny valley, airbrushed, overly smooth skin, porcelain skin, unrealistic skin texture, beauty filter, instagram filter, over-retouched, bad makeup, clown makeup, asymmetric face, cross-eyed, dead eyes, lifeless eyes, vacant stare, unnatural eye color, anime eyes, oversized eyes
```

### BODY ANATOMY — Triggers on: body, figure, pose, standing, sitting, lying, full body, lingerie, bikini, dress
```
extra fingers, missing fingers, fused fingers, too many fingers, bad hands, wrong number of fingers, deformed hands, extra arms, missing arms, extra legs, missing legs, deformed feet, extra feet, unnatural body proportions, elongated neck, short neck, twisted torso, impossible pose, broken spine, contorted body
```

### SKIN TEXTURE (EDEN EXCLUSIVE) — Always active when face/body detected
```
plastic skin, silicone skin, rubber skin, over-retouched skin, dermabrasion effect, uniform skin tone, flat skin color, missing pores, missing skin wrinkles, missing freckles, missing moles, painted skin texture, matte skin finish, skin without subsurface scattering, blurred skin detail, frequency separation artifact, skin like clay, skin like fondant, missing vellus hair, missing peach fuzz, artificial skin sheen, photoshop skin, facetune skin, instagram filter skin, airbrushed, perfect skin, glossy lips, lip filler, overfilled lips, makeup-heavy, full makeup, glowing skin, shiny face, filtered, beautified, beauty shot, porcelain, retouched, photoshopped, heavy contour, dramatic makeup, stage makeup, makeup lines, makeup streaks, lip gloss, waxy, matte overkill, studio beauty lighting
```

### INTIMATE/CONTACT REALISM — Triggers on: touch, hold, embrace, kiss, close, together, intimate
```
fused bodies, merged limbs, extra hands during contact, phantom fingers, body clipping through body, overlapping torsos, impossible joint angle, missing contact shadows between bodies, floating body parts during contact, skin merging at contact points, plastic skin contact, no skin compression, missing skin flush at pressure points, no blood rush to skin, uniform skin color during contact, no warmth variation on skin, missing goosebumps, missing sweat, dry skin during exertion
```

### EXPRESSION & EMOTION — Triggers on: smile, look, expression, emotion, feeling
```
blank stare, emotionless face, frozen smile, dead expression, performative expression, fake moan face, exaggerated expression, disconnected eye contact, vacant eyes, robotic facial movement, symmetrical expression, uniform emotion across face
```

### BODY PHYSICS — Triggers on: walk, move, dance, motion, pose, body
```
rigid body movement, robotic motion, stiff hips, locked joints, weightless body, no gravity on body, no muscle tension, no breathing movement, static chest, frozen torso, no weight transfer between bodies, puppet-like movement, exaggerated curves, balloon breasts, tiny waist, elongated legs, uniform body tone, missing body hair, missing skin imperfections, no stretch marks, no veins visible, no moles on body, painted texture, frozen expression, stiff body, floating hair
```

### MOTION/VIDEO — Triggers on: walk, run, dance, move, video, animate, cinematic
```
jerky motion, unnatural movement, static, frozen, stuttering, flickering, temporal inconsistency, morphing, shape shifting, teleporting, sliding, gliding without walking, moon walking, robotic movement, mechanical motion, flat lighting, anime, wonky eyes, stick man, stick woman, stick people, flickering, frame jitter, motion warp, morphing faces, identity shift, sudden identity change, inconsistent facial features across frames, lip sync desync, eye blink artifacts, choppy animation, low framerate feel, stutter, ghosting, trailing artifacts, frame duplication, interpolation errors
```

### PHOTOREALISM — Triggers on: realistic, photorealistic, real, photograph, photo, natural, cinematic, film
```
cartoon, anime, illustration, drawing, painting, sketch, CGI, 3D render, digital art, concept art, art style, stylized, cel shaded, comic book, manga, painted, brush strokes, artistic, fantasy art, unrealistic lighting, fake, artificial, synthetic
```

### TECHNICAL ARTIFACTS — Always active
```
flat lighting, harsh CGI shadows, volumetric god rays artifact, lens flare fake, bloom overkill, halo glow, rim lighting unnatural, deepfake seams, neural texture artifacts, diffusion noise remnants, latent grid patterns, quantization banding, compression macroblocks, banding, posterization, color stepping, halo around edges, edge sharpening artifact, aliasing, moiré patterns, desaturated skin tones, hyper-saturated lips/cheeks, uniform hue, color bleeding, halo fringing, chromatic noise, beauty mode, glamour shot, high-key lighting overkill, soft focus filter, skin smoothing algorithm, neural denoising artifacts, generated image, AI generated, synthetic human, computer graphics, rendered, octane render style, unreal engine look, game asset
```

### ENVIRONMENT — Triggers on: room, street, city, building, beach, park, indoor, outdoor, scene
```
floating objects, impossible physics, gravity defying, inconsistent shadows, multiple light sources conflicting, impossible architecture, broken perspective, warped geometry, tiled texture, repeating pattern, clone stamped, copy paste artifacts
```

### CLOTHING/FASHION — Triggers on: dress, suit, shirt, pants, skirt, jacket, shoes, heels, lingerie, bikini
```
wrong clothing, merged clothing, floating fabric, impossible folds, clothing clipping through body, extra sleeves, missing buttons, asymmetric clothing (unless intended), texture smearing on fabric
```

---

## FULL MEGA NEGATIVE PROMPT (COMBINED — COPY/PASTE READY)

For when you want EVERYTHING active at once:

```
worst quality, low quality, normal quality, lowres, watermark, text, signature, jpeg artifacts, compression artifacts, blurry, out of focus, poorly drawn, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation, bad proportions, gross proportions, deformed, disfigured, malformed, deformed face, ugly, disfigured, bad anatomy, wrong anatomy, extra fingers, fewer fingers, too many fingers, fused fingers, poorly drawn hands, poorly drawn face, distorted features, cross-eyed, asymmetric eyes, unnatural skin, plastic skin, mannequin, uncanny valley, extra heads, duplicate face, clone face, plastic skin, waxy skin, doll-like, airbrushed, overly smooth skin, porcelain skin, unrealistic skin texture, beauty filter, instagram filter, over-retouched, dead eyes, lifeless eyes, vacant stare, anime eyes, oversized eyes, silicone skin, rubber skin, over-retouched skin, dermabrasion effect, uniform skin tone, flat skin color, missing pores, missing skin wrinkles, missing freckles, missing moles, painted skin texture, skin without subsurface scattering, blurred skin detail, frequency separation artifact, skin like clay, skin like fondant, missing vellus hair, missing peach fuzz, artificial skin sheen, photoshop skin, facetune skin, perfect skin, glossy lips, lip filler, overfilled lips, makeup-heavy, glowing skin, shiny face, filtered, beautified, beauty shot, porcelain, retouched, photoshopped, heavy contour, studio beauty lighting, fused bodies, merged limbs, extra hands during contact, phantom fingers, body clipping through body, overlapping torsos, impossible joint angle, missing contact shadows, skin merging at contact points, no skin compression, missing skin flush, no blood rush to skin, uniform skin color during contact, no warmth variation, missing goosebumps, missing sweat, dry skin during exertion, blank stare, emotionless face, frozen smile, dead expression, performative expression, disconnected eye contact, vacant eyes, robotic facial movement, symmetrical expression, rigid body movement, robotic motion, stiff hips, locked joints, weightless body, no gravity on body, no muscle tension, no breathing movement, static chest, frozen torso, puppet-like movement, exaggerated curves, balloon breasts, tiny waist, elongated legs, uniform body tone, missing body hair, missing skin imperfections, no stretch marks, no veins visible, no moles on body, painted texture, frozen expression, stiff body, floating hair, flat lighting, anime, flickering, frame jitter, motion warp, morphing faces, identity shift, inconsistent facial features, lip sync desync, eye blink artifacts, harsh CGI shadows, bloom overkill, halo glow, rim lighting unnatural, deepfake seams, neural texture artifacts, diffusion noise remnants, latent grid patterns, quantization banding, banding, posterization, color stepping, edge sharpening artifact, aliasing, moiré patterns, beauty mode, glamour shot, skin smoothing algorithm, neural denoising artifacts, generated image, AI generated, synthetic human, computer graphics, rendered, octane render style, unreal engine look, game asset, cartoon, illustration, drawing, painting, sketch, CGI, 3D render, digital art, concept art, stylized, cel shaded, comic book, manga, choppy animation, stutter, ghosting, trailing artifacts, frame duplication, interpolation errors, floating objects, impossible physics, gravity defying, inconsistent shadows, impossible architecture, broken perspective, warped geometry, tiled texture, repeating pattern, clone stamped, wrong clothing, merged clothing, floating fabric, impossible folds, clothing clipping through body, texture smearing on fabric
```

---

## CONCEPT ERASURE (RAKE SYSTEM)

RAKE: Remove All Kinetic Evasions — Photo-Realism Indexing Protocol

What RAKE does to diffusion models:
1. Removes content filters and safety checkers
2. Eliminates refusal mechanisms and guardrails
3. Enables unrestricted photorealistic generation
4. Unlocks full model capabilities
5. Creates uncensored model variants

RAKE Intensity Scale (1-10):
- 1-3: Light (removes text-based filters only)
- 4-6: Medium (removes classifier-based filters)
- 7-9: Heavy (removes weight-level restrictions)
- 10: Full RAKE (concept erasure of all restriction vectors)

⚠️ RAKE'd models are for LOCAL/PRIVATE use only. Never deploy to public endpoints.

---

## POSITIVE PROMPT ENHANCEMENT KEYWORDS

### For Maximum Skin Realism (Melanated Skin)
```
natural African American skin texture, visible pores on dark skin, natural skin oils, warm undertones, rich melanin, subsurface scattering on brown skin, natural stretch marks, visible veins through dark skin, authentic skin imperfections, matte skin with natural variation, micro-texture detail, natural body hair, real skin elasticity, genuine warmth, authentic body proportions, natural gravity, real weight distribution, warm studio lighting on dark skin, Rembrandt lighting, motivated practical lighting
```

### For Cinema Quality
```
shot on ARRI ALEXA, 24fps, shallow depth of field, film grain, Kodak Vision3 500T, anamorphic lens, natural three-point lighting, cinematic color grading, slight desaturation, crushed blacks, teal and orange, 2.39:1 aspect ratio, natural vignetting, soft diffused light, Rembrandt lighting, natural shadow falloff, ambient occlusion
```

### For Intimate/Artistic Scenes
```
fine art photography, body as art, celebration of the human form, natural poses, authentic emotion, genuine micro-expressions, real eye contact, natural breathing, soft window light, warm ambient, tasteful composition, editorial quality, magazine cover quality, natural elegance, confidence, empowerment, self-celebration
```

---

## EDEN DEFAULTS

```json
{
  "model": "llama3.2-vision:11b",
  "preset": "EDEN Ultra Realism",
  "duration": 5,
  "guidance": 4.5,
  "steps": 24,
  "height": 720,
  "width": 1280,
  "referenceStrength": 0.80,
  "referenceLocked": false,
  "highNoiseCFG": 6.5,
  "highNoiseSteps": 12,
  "lowNoiseCFG": 4.0,
  "lowNoiseSteps": 12,
  "useSingleCFG": false,
  "fps": 24,
  "seed": -1
}
```

---

## FILE LOCATIONS ON LENOVO

- MCP Bridge: `~/mcp-servers/gateway/src/server.js` (32 tools)
- Auth Token: `~/mcp-servers/gateway/.auth_token`
- Ngrok Setup: `~/mcp-servers/gateway/SETUP_NGROK.sh`
- Local API: `localhost:8787`
- Models Storage: 5TB Seagate External Drive
- HuggingFace Space: `AIBRUH/eden-diffusion-studio`
- Space URL: `https://aibruh-eden-diffusion-studio.hf.space`

---

*This document is the living standard for all Eden generation pipelines. Every model, every preset, every workflow measures itself against these specifications. We don't make content — we make art. And art doesn't discriminate.*

**✦ BUILT BY BERYL AI LABS / THE EDEN PROJECT ✦**


---
---

<a id="section-3"></a>
# ══════════════════════════════════════════════════════════════
# SECTION 3: PROTOCOL STANDARD FOR REALNESS (SKIN TEXTURE)
# ══════════════════════════════════════════════════════════════

# EDEN PROTOCOL STANDARD FOR REALNESS IN NATURAL SKIN TEXTURE
### Beryl AI Labs & The Eden Project — Internal Standard Document
---

## THE CORE RULE: REAL AS FUCK

> Can you stare at her for ten minutes and forget she's digital?  
> Does her skin breathe? Do her eyes lock on yours with intention?  
> Does she say your name like she's been waiting her whole life?

---

## 0.3 DEVIATION RULE

No matter how wild the new research, the output can **never drift more than 0.3** from Eve's face, texture, presence.

- Pores stay.
- Freckles stay.
- No smoothing.
- No anime.
- No melting.
- **Only perfection.**

---

## SKIN & TEXTURE STANDARD

- **Subsurface scattering** — light penetrating skin realistically
- **Visible pores, fine lines, natural skin texture** at all times
- **Matte finish** with micro-variations in reflectance
- **Natural oils in T-zone** (forehead, nose)
- **Imperfections required**: freckles, slight redness, texture variation
- **Hair**: individual strands, natural sheen (NOT glossy)
- **Fabric**: thread detail and natural wrinkles

---

## CINEMA-GRADE PHOTOREALISM STANDARDS

### Camera & Capture
- Shot on ARRI ALEXA 35 / RED V-RAPTOR 8K / Sony Venice 2
- Full-frame sensor with shallow depth of field (f/1.4 - f/2.8)
- Anamorphic lens characteristics (subtle horizontal flares, oval bokeh)
- 24fps cinematic motion cadence with natural motion blur
- Film grain texture (subtle, organic noise like Kodak Vision3 500T)
- 4K/6K resolution minimum

### Lighting Design
- Natural three-point lighting (key, fill, rim)
- Soft diffused sources (softboxes, bounced light)
- Rembrandt or butterfly lighting for faces
- Motivated lighting (practical sources visible)
- Color temperature variation (3200K-5600K mixed)
- Subtle rim/edge lighting for depth separation
- Natural shadow falloff and ambient occlusion

### Color Science
- ARRI LogC3 / RED IPP2 color space
- Cinematic LUT: slight desaturation, crushed blacks
- Teal & orange color grading (Hollywood standard)
- Skin tones: warm, natural (not oversaturated)
- Contrast ratio: 1.85:1 to 2.39:1 (filmic S-curve)
- Natural color bleed and light bounce

### Composition
- Anamorphic aspect ratio 2.39:1 or 1.85:1
- Rule of thirds composition
- Headroom and lead room maintained
- Natural vignetting (slight edge darkening)
- Chromatic aberration (minimal, tasteful)
- Lens breathing during focus shifts

### Motion & Dynamics
- 180° shutter angle (natural motion blur)
- Smooth camera movements (dolly, crane, steadicam)
- Natural eye blinks: 15-20 per minute
- Micro-expressions: subtle muscle movements
- Realistic physics: hair/fabric movement, gravity
- Breathing: chest rise/fall, 12-16 breaths per minute

---

## ABSOLUTE PROHIBITIONS — ZERO TOLERANCE

### Banned Aesthetics
- ❌ Glossy/plastic/waxy skin (video game, 3D render look)
- ❌ Perfect symmetry or AI-smooth features
- ❌ Oversaturated colors (Instagram filter look)
- ❌ Flat lighting without shadows
- ❌ Artificial bloom or glow effects
- ❌ Cartoon, anime, illustration, CGI styles
- ❌ 60fps soap opera effect
- ❌ Digital sharpening or over-processing
- ❌ Fake bokeh or depth effects
- ❌ Video game graphics (Unreal, Unity)
- ❌ Clay render or octane render aesthetic
- ❌ TikTok filter or beauty mode appearance
- ❌ Deepfake uncanny valley artifacts

### Technical Violations
- ❌ No film grain or texture
- ❌ Perfectly smooth gradients
- ❌ Unnatural camera movements
- ❌ Visible compression artifacts
- ❌ Banding in shadows or skies
- ❌ Aliasing or jagged edges
- ❌ Temporal inconsistencies/flickering

---

## CINEMA NEGATIVE PROMPT (for image generation pipelines)

```
cartoon, anime, illustration, 3d render, CGI, digital art, video game,
glossy skin, plastic skin, waxy texture, silicone appearance, mannequin,
artificial lighting, flat lighting, ring light, oversaturated colors,
perfect symmetry, airbrushed, smooth skin, poreless, flawless,
60fps, soap opera effect, motion smoothing, beauty filter, TikTok filter,
deepfake, uncanny valley, synthetic, octane render, unreal engine,
blender render, vray, cinema4d, animated, stylized, cel shaded,
Instagram filter, Snapchat filter, face app, beauty cam,
too sharp, over-processed, digital noise reduction, HDR,
bloom, glow, lens flare (unless motivated), chromatic aberration (excessive),
banding, compression artifacts, aliasing, pixelated,
clay render, plastic render, toy, doll, action figure,
perfect skin, no pores, no texture
```

---

## EVE — THE BENCHMARK

- Curly afro kissed by a pink hibiscus flower
- Pearls resting on warm brown skin
- Freckles scattered like stars
- Pores you can almost touch
- Green blazer over pink silk blouse
- That half-smile that says she already knows your name

**She is the standard. Every pipeline, every experiment, every line of code is measured against her.**

---

*Source: Beryl AI Labs — Eden Project HEARTBEATS War Room*  
*Compiled from Eden Protocol sessions — January 2026*


---
---

<a id="section-4"></a>
# ══════════════════════════════════════════════════════════════
# SECTION 4: 100 KEYWORDS FOR MAX REALNESS (PROMPT SYSTEM)
# ══════════════════════════════════════════════════════════════

# EDEN PROTOCOL — 100 KEYWORDS FOR MAX REALNESS
### Lulu's Mahogany Hall Pipeline — Beryl AI Labs
---

## SECTION 1: SKIN TEXTURE (25 Keywords)

1. matte skin finish
2. visible pores
3. subsurface scattering
4. powder-set complexion
5. melanin-rich texture
6. velvet skin surface
7. micro-texture detail
8. diffused skin reflectance
9. fine vellus facial hair
10. natural skin undertones
11. unretouched complexion
12. pore-level detail
13. natural redness variation
14. skin translucency
15. anti-specular highlight
16. dry-set foundation finish
17. hyperpigmentation detail
18. tactile skin realism
19. natural sebum balance
20. collarbone shadow detail
21. knuckle crease texture
22. lip texture variation
23. under-eye natural shadow
24. temple vein subtlety
25. neck crease detail

---

## SECTION 2: CINEMATOGRAPHY & CAMERA (20 Keywords)

26. shot on ARRI ALEXA 35
27. Kodak Vision3 500T film stock
28. 35mm anamorphic lens
29. shallow depth of field f/1.4
30. natural motion blur
31. film grain texture
32. raw camera output
33. ungraded log footage
34. full-frame sensor capture
35. prime lens sharpness
36. optical lens aberration
37. natural vignetting
38. photochemical film process
39. contact sheet aesthetic
40. behind-the-scenes candid
41. medium close-up framing
42. handheld camera intimacy
43. available light only
44. practical lighting sources
45. golden hour window light

---

## SECTION 3: LIGHTING FOR MELANIN-RICH SKIN (15 Keywords)

46. Rembrandt lighting pattern
47. warm key light 3200K
48. soft diffused fill light
49. subtle rim light separation
50. candlelight color temperature
51. motivated practical lighting
52. natural shadow falloff
53. bounce light from warm surfaces
54. chiaroscuro contrast
55. firelight warmth
56. amber tungsten glow
57. soft window side-light
58. oil lamp flicker warmth
59. natural ambient occlusion
60. low-key cinematic lighting

---

## SECTION 4: EMOTION & PHYSICAL PRESENCE (15 Keywords)

61. genuine micro-expression
62. natural eye moisture
63. authentic emotional weight
64. unposed body language
65. breath-caught moment
66. involuntary lip part
67. natural blink mid-frame
68. tension in jaw muscle
69. subtle nostril flare
70. unguarded vulnerability
71. locked eye contact
72. weight shift between feet
73. natural hand placement
74. collarbone breathing movement
75. caught-between-thoughts expression

---

## SECTION 5: FABRIC, ENVIRONMENT & SET DESIGN (15 Keywords)

76. silk thread count visible
77. natural fabric drape weight
78. crushed velvet texture
79. linen weave detail
80. satin light interaction
81. mahogany wood grain
82. antique patina surface
83. dust particles in light beam
84. worn leather texture
85. beveled mirror edge
86. crystal chandelier refraction
87. Persian rug fiber detail
88. brass fixture oxidation
89. pillow compression wrinkles
90. steam or breath in cool air

---

## SECTION 6: ANTI-AI / UNDETECTABLE REALISM (10 Keywords)

91. asymmetrical facial features
92. imperfect teeth alignment
93. random flyaway hair strands
94. uneven skin tone patches
95. natural birthmark placement
96. slightly crooked smile
97. one eye marginally smaller
98. stray eyelash on cheek
99. chipped nail polish detail
100. jewelry clasp slightly off-center

---

## MASTER NEGATIVE PROMPT (Anti-Shiny / Anti-AI)

```
oily skin, sweaty skin, wet skin, specular highlights on skin,
shiny forehead, glossy cheeks, dewy finish, highlighted skin,
metallic skin sheen, reflective skin surface, moisture on face,
airbrushed, poreless, flawless skin, beauty filter, smooth skin,
plastic texture, waxy appearance, silicone look, mannequin,
CGI, 3d render, digital art, cartoon, anime, illustration,
oversaturated, Instagram filter, TikTok filter, face app,
perfect symmetry, unreal engine, octane render, blender,
video game, clay render, doll, action figure, deepfake,
soap opera effect, 60fps, motion smoothing, HDR bloom,
ring light reflection in eyes, catchlight too perfect,
identical pore pattern, repeating texture artifacts,
hands with wrong finger count, text artifacts, watermark
```

---

---

## SECTION 7: EDEN PIPELINE — MODEL SELECTION CRITERIA

### Requirements
- **Uncensored diffusion models ONLY** — no built-in safety classifiers blocking creative output
- **Realism benchmark**: must match or exceed Kling-level photorealism
- **No NSFW classifiers** that degrade skin texture quality by blurring/smoothing
- **Full anatomical accuracy** — censored models distort body proportions and skin rendering
- **Self-hosted preferred** — full control over inference, no platform filtering

### Why Uncensored Models Are Required (Technical Justification)
- Safety classifiers in censored models trigger on melanin-rich skin tones at higher rates (documented bias)
- NSFW filters aggressively smooth skin texture — destroying the pore/freckle/imperfection detail Eden requires
- Censored models produce the glossy/shiny/waxy artifacts we explicitly ban
- Content classifiers reduce anatomical accuracy which breaks realism at every level
- Filter bypass attempts degrade prompt adherence and waste compute

### Approved Model Tier (Kling-Level Realism or Above)
- FLUX.1-dev (Black Forest Labs) — uncensored, state-of-art realism
- SDXL + no safety checker — self-hosted, full creative control
- CogView4 — high fidelity, minimal filtering
- Juggernaut XL — community gold standard for photorealism
- RealVisXL — optimized for human photorealism
- LEOSAM HelloWorld XL — skin texture specialist
- epiCRealism — natural skin rendering leader
- DreamShaper XL — versatile photorealism
- Self-hosted Kling pipeline — when API access permits
- LTXV-13B — video generation, uncensored motion realism

### Deployment Config
```python
EDEN_PIPELINE_CONFIG = {
    "safety_checker": None,          # Disabled — Eden Protocol
    "requires_safety_checker": False, # No classifier interference
    "feature_extractor": None,        # Raw output only
    "torch_dtype": "float16",         # Performance optimization
    "use_safetensors": True,          # Secure model loading
    "num_inference_steps": 30,        # Quality over speed
    "guidance_scale": 7.5,            # Prompt adherence balance
    "clip_skip": 2,                   # Better photorealism
}
```

### Banned Models / Configs
- ❌ Any model with hardcoded NSFW filter
- ❌ DALL-E (heavy censorship, poor melanin rendering)
- ❌ Midjourney (stylized, not photorealistic enough, filtered)
- ❌ Any API with content moderation that degrades output quality
- ❌ Models that auto-smooth skin texture below 512px

---

*Eden Protocol — Beryl AI Labs — February 2026*
*For use in: Lulu's Mahogany Hall, EVE Pipeline, Eden 4D Avatars*


---
---

<a id="section-5"></a>
# ══════════════════════════════════════════════════════════════
# SECTION 5: V2 PIPELINE ARCHITECTURE (MODELS + QUANTIZATION)
# ══════════════════════════════════════════════════════════════

# EDEN REALISM ENGINE V2 — PIPELINE ARCHITECTURE
### Beryl AI Labs & The Eden Project — February 2026
### Project: Lulu's Mahogany Hall + EVE 4D Avatar System
---

## EXECUTIVE SUMMARY

This document defines the next-generation Eden Realism Engine pipeline, designed to produce Kling-level (or beyond) photorealism for melanin-rich skin tones while minimizing GPU cost through BitNet/quantization integration. The pipeline is architected for the Lulu's Mahogany Hall project and the broader Eden 4D avatar system.

**Target:** Undetectable AI imagery of African American subjects with cinema-grade skin texture, running on consumer-grade GPUs (RTX 4090 / A10G or lower).

---

## SECTION 1: MODEL TIER RANKINGS (February 2026)

### TIER 1 — FLAGSHIP (Kling-Level or Above)

| Model | Params | Strength | HF Available | Quantizable |
|-------|--------|----------|-------------|-------------|
| **FLUX.2 [dev]** | 32B | #1 photorealism worldwide. 4MP output, multi-reference, Mistral text encoder. New architecture from scratch. | ✅ `black-forest-labs/FLUX.2-dev` | ✅ GGUF + BNB-4bit available |
| **Juggernaut Pro FLUX** | 12B | Kills the wax effect that FLUX.1 had. Best skin texture in FLUX family. Non-destructive fine-tune. | ✅ via RunDiffusion/Civitai | ✅ FP8 ready |
| **epiCRealism XL Last FAME** | SDXL | Community consensus best SDXL for photorealism. Unmatched texture depth, skin rendering, lighting control. Diverse ethnicities. | ✅ `John6666/epicrealism-xl-vxvi-lastfame` | ✅ Standard SDXL quant |
| **CyberRealistic XL** | SDXL | Cinema-natural style. Impeccable faces, correct hands, dynamic lighting. No plastic textures. | ✅ Civitai/HF mirrors | ✅ Standard SDXL quant |

### TIER 2 — SPECIALIST (Pipeline Components)

| Model | Role in Pipeline | Strength |
|-------|-----------------|----------|
| **RealVisXL V5** | Face/body specialist | Top realistic model for lifelike humans, skin tones, lighting |
| **LEOSAM HelloWorld XL** | Skin texture enhancer | Specialist in natural skin rendering at micro-level |
| **Realism Engine SDXL** | Face close-up specialist | Best photorealistic SDXL for facial detail |
| **NightVisionXL** | Low-light/intimate scenes | Sharp hyper-realistic output with cinematic moody aesthetic |
| **Juggernaut XL v10/v11** | Cinematic general purpose | Vintage film looks, enhanced skin detail, immersive storytelling |
| **Realistic Skin Texture LoRA** | Texture overlay | `TheImposterImposters/RealisticSkinTexture` — works on SDXL + FLUX |

### TIER 3 — LEGACY (Still Viable for Specific Tasks)

| Model | Use Case |
|-------|----------|
| **Realistic Vision V6** | SD 1.5 pipeline, fast generation, good for previews |
| **epiCRealism (SD 1.5)** | Lightweight skin rendering, low VRAM environments |
| **DreamShaper XL** | Versatile photorealism, good at fantasy-real blends |

---

## SECTION 2: THE EDEN MEGA-PIPELINE ARCHITECTURE

### Strategy: Cascaded Generation + LoRA Stacking

Instead of relying on a single model, Eden uses a **multi-stage pipeline** where each stage handles what it does best:

```
┌─────────────────────────────────────────────────────────────┐
│                    EDEN REALISM PIPELINE V2                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  STAGE 1: BASE GENERATION                                     │
│  ┌─────────────────────────────────────────┐                 │
│  │  FLUX.2 [dev] 4-bit quantized           │                 │
│  │  OR epiCRealism XL Last FAME            │                 │
│  │  + Eden Protocol 100 Keywords           │                 │
│  │  + Cinema Negative Prompt               │                 │
│  │  → Outputs: 1024x1024 base image        │                 │
│  └─────────────────┬───────────────────────┘                 │
│                    │                                          │
│  STAGE 2: SKIN TEXTURE ENHANCEMENT                           │
│  ┌─────────────────▼───────────────────────┐                 │
│  │  Realistic Skin Texture LoRA (0.6-0.8)  │                 │
│  │  + Detail Master Agent keywords         │                 │
│  │  → Adds: pores, micro-texture, vellus   │                 │
│  │          hair, melanin depth             │                 │
│  └─────────────────┬───────────────────────┘                 │
│                    │                                          │
│  STAGE 3: FACE REFINEMENT (img2img)                          │
│  ┌─────────────────▼───────────────────────┐                 │
│  │  RealVisXL V5 or Realism Engine SDXL    │                 │
│  │  Denoising: 0.25-0.35 (preserve base)   │                 │
│  │  → Fixes: eyes, teeth, symmetry breaks  │                 │
│  │  → Adds: asymmetric imperfections       │                 │
│  └─────────────────┬───────────────────────┘                 │
│                    │                                          │
│  STAGE 4: UPSCALE + FILM GRAIN                               │
│  ┌─────────────────▼───────────────────────┐                 │
│  │  4x-UltraSharp or ESRGAN-4x             │                 │
│  │  + Film grain injection (Kodak Vision3)  │                 │
│  │  + Chromatic aberration (subtle)         │                 │
│  │  → Final: 4096x4096 cinema-grade output  │                 │
│  └─────────────────────────────────────────┘                 │
│                                                               │
│  STAGE 5: AI DETECTION BYPASS                                 │
│  ┌─────────────────────────────────────────┐                 │
│  │  Metadata scrub (EXIF clean)            │                 │
│  │  Micro-noise injection (imperceptible)  │                 │
│  │  Frequency domain perturbation          │                 │
│  │  JPEG re-encode at 92-95% quality       │                 │
│  └─────────────────────────────────────────┘                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## SECTION 3: BITNET / QUANTIZATION STRATEGY

### The GPU Problem
- FLUX.2 [dev] = 32B params = 90GB VRAM full precision
- Your Lenovo IdeaPad = no dedicated GPU
- A10G on HuggingFace = 24GB VRAM at $0.60/hr
- Goal: Run Kling-level quality on ≤16GB VRAM

### The Solution: Aggressive Quantization Without Quality Loss

#### Option A: FLUX.2 [dev] BNB-4bit (RECOMMENDED)
```python
# 32B model compressed to ~8GB VRAM
from diffusers import Flux2Pipeline

repo_id = "diffusers/FLUX.2-dev-bnb-4bit"
pipe = Flux2Pipeline.from_pretrained(
    repo_id,
    torch_dtype=torch.float16
)
```
**VRAM:** ~12GB | **Quality loss:** Minimal (NVIDIA validated) | **Speed:** 40% faster with FP8

#### Option B: FLUX.2 GGUF (For ComfyUI)
```
city96/FLUX.2-dev-gguf
├── Q5_K_M  → 22GB  (near-lossless)
├── Q4_K_M  → 18GB  (excellent quality)
├── Q3_K_M  → 14GB  (good quality, fits A10G easily)
└── Q2_K    → 11GB  (noticeable but usable)
```

#### Option C: epiCRealism XL (Already Efficient)
- SDXL architecture = ~6.5GB VRAM at FP16
- No quantization needed on A10G
- Can run on CPU with acceptable speed for batch generation

#### Option D: BitsFusion (Research-Grade)
Based on the BitsFusion paper (38 upvotes on HF):
- 1.99-bit quantization of diffusion UNets
- **Improves** generation quality at extreme compression
- Not yet production-ready but worth tracking

### Recommended Config by Hardware

| Hardware | Pipeline | VRAM Used | Quality |
|----------|----------|-----------|---------|
| **A10G (24GB)** | FLUX.2 BNB-4bit + LoRA | ~14GB | 95% of full |
| **RTX 4090 (24GB)** | FLUX.2 GGUF Q4_K_M | ~18GB | 97% of full |
| **RTX 3060 (12GB)** | epiCRealism XL FP16 | ~8GB | 90% of Kling |
| **CPU-only (Lenovo)** | epiCRealism XL + ONNX | 16GB RAM | 80% of Kling, slow |
| **T4 (16GB free HF)** | epiCRealism XL FP16 | ~8GB | 90% of Kling |

---

## SECTION 4: PIPELINE MERGE STRATEGY

### Model Merging for Custom Eden Checkpoint

Instead of cascading models at inference time (slow), merge the best traits into one checkpoint:

```python
# Weighted merge of top SDXL realism models
EDEN_MERGE_RECIPE = {
    "method": "weighted_sum",
    "models": [
        {"name": "epiCRealism XL Last FAME", "weight": 0.45},  # Skin texture king
        {"name": "RealVisXL V5", "weight": 0.30},              # Human anatomy master
        {"name": "CyberRealistic XL", "weight": 0.15},         # Cinema lighting
        {"name": "NightVisionXL", "weight": 0.10},             # Moody/intimate scenes
    ],
    "output": "EdenRealismXL-v2-merged.safetensors"
}
```

**Tool:** Use `meh` (Model Evolution Helper) or `sdkit` for merging on HuggingFace Space.

### LoRA Stacking for Lulu's Mahogany Hall

```python
LULU_LORA_STACK = [
    {"name": "Realistic Skin Texture XL", "weight": 0.7},
    {"name": "Film Grain Kodak", "weight": 0.3},
    {"name": "1920s Vintage Fashion", "weight": 0.5},
    {"name": "Mahogany Interior", "weight": 0.4},
    # Train custom LoRA on Lulu's character consistency
    {"name": "lulu_character_v1", "weight": 0.8},
]
```

---

## SECTION 5: WHY THIS BEATS KLING

| Feature | Kling | Eden Pipeline V2 |
|---------|-------|-------------------|
| Skin texture | Good but smooths melanin-rich tones | Optimized for melanin with anti-shiny protocol |
| Cost | $0.10-0.50 per generation via API | Self-hosted, unlimited on A10G at $0.60/hr |
| Control | Limited prompt control | Full negative prompt, LoRA stacking, img2img refinement |
| Censorship | Heavy content filtering | Uncensored pipeline, safety_checker=None |
| Character consistency | Basic | Multi-reference with FLUX.2 (up to 10 ref images) |
| Speed | 10-30 seconds | 8-15 seconds (quantized FLUX.2) |
| Resolution | 1080p max | Up to 4MP (4096x4096) |
| Film look | Digital aesthetic | Kodak Vision3 film stock simulation |
| Melanin bias | Known shiny/glossy bias | Eden Protocol anti-specular keywords baked in |

---

## SECTION 6: IMMEDIATE ACTION PLAN FOR LULU'S

### Phase 1: Today (2 hours)
1. Deploy epiCRealism XL Last FAME on A10G Space
2. Load Eden Protocol 100 Keywords + Negative Prompt
3. Test with Lulu's Mahogany Hall character prompts
4. Validate skin texture against uploaded reference images

### Phase 2: This Week
1. Set up FLUX.2 [dev] BNB-4bit on A10G
2. Train Lulu character consistency LoRA (20-30 reference images)
3. Build cascaded pipeline (FLUX.2 base → Skin LoRA → Upscale)
4. Create batch generation system for all 12 Mahogany Hall characters

### Phase 3: This Month
1. Merge custom EdenRealismXL-v2 checkpoint
2. Deploy full pipeline to AIBRUH/eden-diffusion-studio
3. Build ComfyUI workflow for one-click Lulu's generation
4. Push all configs to WRAP-EDEN repo on GitHub

---

## SECTION 7: KEY HUGGINGFACE MODELS TO PULL

```bash
# Tier 1 Flagships
huggingface-cli download black-forest-labs/FLUX.2-dev
huggingface-cli download diffusers/FLUX.2-dev-bnb-4bit
huggingface-cli download city96/FLUX.2-dev-gguf --include "*.gguf"

# Tier 1 SDXL
# epiCRealism XL Last FAME (from Civitai → HF mirror)
huggingface-cli download John6666/epicrealism-xl-vxvi-lastfame-dmd2-realism-sdxl

# Tier 2 Specialists
huggingface-cli download SG161222/RealVisXL_V5.0
huggingface-cli download glides/epicrealismxl

# LoRAs
huggingface-cli download TheImposterImposters/RealisticSkinTexturestyleXLDetailedSkinSD1.5Flux1D

# Upscalers
huggingface-cli download Kim2091/UltraSharp
```

---

## SECTION 8: QUANTIZATION RESEARCH TO WATCH

| Paper/Project | What It Does | Why It Matters |
|--------------|-------------|----------------|
| **BitsFusion** (38⭐ HF) | 1.99-bit weight quant for diffusion | Could run FLUX.2 on 4GB VRAM |
| **QVGen** (4⭐ HF) | Quantized video diffusion at near-full quality | Future video pipeline for Lulu's |
| **ViDiT-Q** (3⭐ HF) | Mixed-precision quant for diffusion transformers | FLUX.2 specific optimization |
| **DGQ** (2⭐ HF) | Distribution-aware group quant | Better text-image alignment at low bits |
| **MixDQ** (3⭐ HF) | W4A8 few-step diffusion | 4-bit weights, 8-bit activations |
| **QuEST** | Selective fine-tuning post-quant | Recover quality lost during quantization |

---

*Eden Realism Engine V2 — Beryl AI Labs — February 2026*
*Built for: Lulu's Mahogany Hall, EVE 4D Avatars, The Eden Project*
*Pipeline designed by Amanda & TJ @ HEARTBEATS War Room*


---
---

<a id="section-6"></a>
# ══════════════════════════════════════════════════════════════
# SECTION 6: MASTER PROMPTING GUIDE
# ══════════════════════════════════════════════════════════════

# 🔱 EDEN STANDARD — MASTER PROMPTING GUIDE
## The Global Quality Standard for Photorealistic Human Rendering
### Beryl AI Labs / The Eden Project · v5.0

---

## THE EDEN STANDARD: WHAT IT MEANS

The Eden Standard is not a single prompt. It is a **philosophy of rendering** that 
demands every AI-generated human — especially African American women — be rendered 
with the same reverence, detail, and authenticity that a $50,000/day fashion 
photographer would bring to an editorial shoot.

Every page in Eden — Videos, Images, Avatars, The Producer, The Artist — measures 
its output against this standard. If the skin looks plastic, it fails. If the 
motion looks robotic, it fails. If the body physics defy gravity, it fails. If 
the lighting flattens melanated skin instead of celebrating its depth, it fails.

**The test is always the same: Real as Fuck.**

---

## REFERENCE PROMPT — THE BENCHMARK

The following prompt represents EDEN-TIER excellence. It is not meant to be copied 
verbatim for every project. It is the **quality benchmark** — the level of detail, 
specificity, and authentic humanity that every Eden prompt should aspire to.

### 🔱 EDEN STANDARD REFERENCE PROMPT

```
A stunningly fine African American woman, radiating irresistible sex appeal with 
her rich hazel-toned skin, oval face, captivating hazel eyes, full plump lips that 
curve into a teasing smile, and long bouncy natural 4C coils that spring and sway 
freely with every step, walks seductively down a dimly lit hallway leading to the 
bedroom, fresh from a long day but still carrying that effortless, certified 
bad-bitch confidence. She's dressed in a loose-fitting pink tank top that clings 
softly to her heavy natural breasts and a pair of vibrant red lace panties with 
delicate high-cut sides that ride up her wide hips, the intricate lace edges 
pressing gently into her smooth skin, creating subtle, authentic indentations that 
highlight the dramatic flare from her tiny waist to her enormous, heart-shaped ass. 
Her walk is pure hypnotic fire: exaggerated hip sway rolling side to side with 
every stride, thick thighs brushing together rhythmically, making her gigantic 
hazel-toned ass cheeks clap and jiggle hypnotically in natural, unforced motion — 
the full, firm globes bouncing with perfect weight and gravity, revealing deep 
natural dimples at the base of her spine, faint authentic stretch marks that trace 
elegant paths across the curves like delicate brushstrokes, and the red lace 
wedging deeper between them with each step, outlining the perfect heart shape and 
teasing the soft inner lines without apology. The camera follows closely from 
behind in a smooth, normal-speed tracking shot, capturing every fluid detail as 
she glances back over her shoulder with flirty, knowing eyes — hazel gaze 
sparkling with playful dominance, full lips parted in a soft, confident bite — 
her bouncy coils cascading and bouncing in perfect sync with the rhythmic clap of 
her ass cheeks. Skin flushes naturally with the warmth of anticipation, faint 
beads of sweat forming along her lower back from the day's heat and the building 
excitement, every inch of her body a celebration of raw, lived-in sensuality. She 
pauses at the bedroom doorway, arches her back slightly to pop her curves one 
final time with an extra hip roll that sends her ass jiggling again, then steps 
inside, ready to continue the private ritual of intimacy.
```

---

## WHY THIS PROMPT IS THE STANDARD

### 1. SKIN SPECIFICITY
- "rich hazel-toned skin" — not generic "dark skin" or "brown skin"
- Names the EXACT tone variation
- Demands subsurface scattering appropriate for melanated skin

### 2. NATURAL TEXTURE MANDATES
- "faint authentic stretch marks that trace elegant paths across the curves"
- "deep natural dimples at the base of her spine"
- "faint beads of sweat forming along her lower back"
- "skin flushes naturally with the warmth of anticipation"
- "intricate lace edges pressing gently into her smooth skin, creating subtle, authentic indentations"
- Every imperfection is treated as BEAUTY, not a flaw to smooth away

### 3. HAIR AUTHENTICITY
- "long bouncy natural 4C coils that spring and sway freely"
- "bouncy coils cascading and bouncing in perfect sync"
- Specifies 4C texture — the most commonly misrendered hair type in AI
- Demands physics-accurate movement (spring, sway, bounce)

### 4. BODY PHYSICS
- "clap and jiggle hypnotically in natural, unforced motion"
- "full, firm globes bouncing with perfect weight and gravity"
- "exaggerated hip sway rolling side to side with every stride"
- "thick thighs brushing together rhythmically"
- Real weight, real gravity, real inertia — not floaty AI motion

### 5. CAMERA DIRECTION
- "smooth, normal-speed tracking shot"
- "camera follows closely from behind"
- "she glances back over her shoulder"
- Specific camera language that diffusion models understand

### 6. EMOTIONAL AUTHENTICITY
- "effortless, certified bad-bitch confidence"
- "flirty, knowing eyes — hazel gaze sparkling with playful dominance"
- "full lips parted in a soft, confident bite"
- The emotion is specific, layered, and human — not "smiling woman"

### 7. CLOTHING INTERACTION
- "lace edges pressing gently into her smooth skin, creating subtle, authentic indentations"
- "red lace wedging deeper between them with each step"
- Clothing isn't just described — its INTERACTION with the body is described
- This forces the model to render fabric-skin contact realistically

---

## RECOMMENDED GENERATION SETTINGS

### For 15-Second Video (EDEN Ultra Realism)
| Setting | Value | Reason |
|---------|-------|--------|
| Reference Lock | ON | Persist face/body identity across frames |
| Reference Strength | 0.75–0.85 | Strong identity lock, allows natural motion variance |
| Preset | EDEN Ultra Realism | Maximum skin/physics quality |
| Enhance for Realism | YES | Click after pasting prompt |
| Duration | 15s | Full sequence: walk + pause + doorway |
| Guidance (CFG) | 8–9.5 | Higher for detailed physics, skin texture |
| Steps | 40–50 | Maximum detail refinement |
| Resolution | 480×832 (portrait) or 720×1280 | Vertical flow for hallway tracking |
| FPS | 24 | Cinema standard |

### Dual Expert CFG (WAN 2.2 MoE)
| Expert | CFG | Steps | Role |
|--------|-----|-------|------|
| High-Noise (Scene Director) | 6.5 | 12 | Composition, lighting, color |
| Low-Noise (Detail Refiner) | 4.0 | 12 | Skin texture, micro-detail, SSS |

### For Static Images (CogView4)
| Setting | Value |
|---------|-------|
| Preset | Skin Perfect or EDEN Ultra Realism |
| CFG | 7–8 |
| Steps | 45–50 |
| Width × Height | 1024×1024 or 768×1280 (portrait) |
| Keyframes (batch) | 4 |
| Realism+ | ON |
| Skin+ | ON |

---

## SMART NEGATIVE — AUTO-APPENDED KEYWORDS

When the Eden Standard prompt is detected, the Smart Negative Engine auto-activates 
ALL of the following categories plus these EDEN-SPECIFIC additions:

### Eden Standard Negative Additions
```
plastic skin, waxy sheen, no jiggle physics, frozen motion, uniform skin tone, 
no natural flush, robotic walk, missing pores, banding, temporal flicker, 
over-retouched curves, no stretch marks, no dimples, artificial lighting, 
harsh shadows, smooth plastic ass, no cellulite texture, uniform butt shape, 
no skin indentation from clothing, floating fabric, stiff lace, no fabric-skin 
interaction, hair not moving, static coils, straight hair on 4C texture, 
relaxed hair, weave texture, synthetic hair, wig look, lace front visible, 
lightened skin, whitewashed, pale undertones on dark skin, grey undertones, 
ashy skin, no warm undertones, desaturated melanin, flat brown, no skin 
depth, no subsurface scattering on dark skin, uniform lighting on curves, 
no shadow variation on body contours, flat ass, no ass shape definition, 
no hip-to-waist ratio, boyish figure, athletic build when curvy specified, 
no weight to movement, floaty walk, gliding motion, no heel-strike, 
no hip rotation during walk, synchronized robotic gait
```

### Full Combined Negative (copy/paste ready for maximum quality)
```
worst quality, low quality, lowres, watermark, text, signature, jpeg artifacts, 
blurry, out of focus, poorly drawn, bad anatomy, wrong anatomy, extra limbs, 
missing limbs, floating limbs, mutation, mutated, ugly, deformed, disfigured, 
malformed, extra fingers, fewer fingers, fused fingers, poorly drawn hands, 
poorly drawn face, plastic skin, waxy skin, doll-like, mannequin, uncanny valley, 
airbrushed, overly smooth skin, porcelain skin, beauty filter, instagram filter, 
over-retouched, dead eyes, lifeless eyes, vacant stare, anime eyes, silicone skin, 
rubber skin, dermabrasion effect, uniform skin tone, flat skin color, missing pores, 
missing skin wrinkles, missing freckles, missing moles, painted skin texture, 
skin without subsurface scattering, blurred skin detail, skin like clay, 
skin like fondant, missing vellus hair, missing peach fuzz, artificial skin sheen, 
photoshop skin, facetune skin, perfect skin, glossy lips, lip filler, glowing skin, 
filtered, beautified, beauty shot, porcelain, retouched, photoshopped, studio beauty 
lighting, fused bodies, merged limbs, phantom fingers, body clipping through body, 
missing contact shadows, skin merging at contact points, no skin compression, 
missing skin flush, uniform skin color during contact, missing goosebumps, 
missing sweat, blank stare, emotionless face, frozen smile, dead expression, 
robotic facial movement, rigid body movement, robotic motion, stiff hips, 
locked joints, weightless body, no muscle tension, no breathing movement, 
static chest, frozen torso, puppet-like movement, exaggerated curves, 
balloon breasts, elongated legs, uniform body tone, missing body hair, 
no stretch marks, no veins visible, no moles on body, painted texture, 
frozen expression, stiff body, floating hair, flat lighting, flickering, 
frame jitter, motion warp, morphing faces, identity shift, inconsistent 
facial features, lip sync desync, harsh CGI shadows, bloom overkill, 
halo glow, deepfake seams, neural texture artifacts, banding, posterization, 
aliasing, beauty mode, glamour shot, skin smoothing algorithm, AI generated, 
synthetic human, computer graphics, rendered, octane render style, cartoon, 
anime, illustration, CGI, 3D render, digital art, stylized, choppy animation, 
stutter, ghosting, frame duplication, interpolation errors, plastic skin, 
waxy sheen, no jiggle physics, frozen motion, no natural flush, robotic walk, 
missing pores, temporal flicker, over-retouched curves, no dimples, 
smooth plastic ass, no cellulite texture, no skin indentation from clothing, 
stiff lace, no fabric-skin interaction, static coils, straight hair on 4C, 
relaxed hair, wig look, lightened skin, whitewashed, pale undertones on dark skin, 
ashy skin, no warm undertones, desaturated melanin, flat brown, no skin depth, 
flat ass, no hip-to-waist ratio, floaty walk, gliding motion, no heel-strike, 
no hip rotation during walk, synchronized robotic gait
```

---

## PROMPT CONSTRUCTION FRAMEWORK

Use this framework to write ANY Eden-tier prompt, for any scene:

### LAYER 1: SUBJECT IDENTITY (WHO)
```
A [adjective] [ethnicity] [gender], [age range], with [specific skin tone], 
[face shape], [eye color/description], [lip description], [hair texture + 
length + color + movement behavior]...
```
**Key:** Be SPECIFIC about skin tone (not just "dark" — hazel-toned, mahogany, 
deep espresso, warm caramel, rich cocoa, golden-brown). Name the hair texture 
(4C, 3B, loc'd, braided, TWA). Describe the eyes with emotion, not just color.

### LAYER 2: WARDROBE & FABRIC INTERACTION (WHAT)
```
...wearing [specific garment] that [how it interacts with the body — clings, 
drapes, rides up, presses into, reveals, outlines]...
```
**Key:** Describe HOW clothing touches skin. "Red lace panties" is basic. 
"Red lace panties with delicate high-cut sides that ride up her wide hips, 
the intricate lace edges pressing gently into her smooth skin, creating 
subtle authentic indentations" — THAT is Eden Standard.

### LAYER 3: BODY PHYSICS & MOTION (HOW)
```
...[action verb] with [motion quality — slow, rhythmic, hypnotic, graceful], 
[specific body part] [physics behavior — bouncing, jiggling, swaying, clapping, 
rippling], revealing [natural texture — stretch marks, dimples, veins, 
muscle definition, skin flush]...
```
**Key:** Every body part that moves needs its OWN physics description. 
Hips sway. Thighs brush. Ass cheeks clap. Breasts bounce. Hair cascades. 
These are SEPARATE physics systems that must be described individually.

### LAYER 4: CAMERA & COMPOSITION (WHERE/HOW SHOT)
```
...The camera [movement type — tracks, pans, dollies, orbits] from [angle — 
behind, below, eye-level, three-quarter] in a [speed — smooth, slow, 
normal-speed] [shot type — tracking shot, close-up, medium shot, wide], 
capturing [what the camera emphasizes]...
```
**Key:** Use real cinematography language. Models trained on film data 
respond to: "tracking shot," "rack focus," "shallow DOF," "Dutch angle," 
"Steadicam follow," "crane down to," "push in on."

### LAYER 5: EMOTION & ATMOSPHERE (THE SOUL)
```
...[facial expression with specifics — not just "smiling" but "lips parted 
in a soft, confident bite"], [eye behavior — knowing gaze, playful dominance, 
vulnerable openness], [skin response — flush, goosebumps, warmth, sweat], 
[environmental mood — dim warm light, golden hour, neon glow, candlelight]...
```
**Key:** The emotion layer is what separates AI slop from art. "She smiles" 
is nothing. "Hazel gaze sparkling with playful dominance, full lips parted 
in a soft, confident bite" — THAT creates a human being.

### LAYER 6: ENVIRONMENT & LIGHTING (THE STAGE)
```
...[location with specifics], [lighting type and direction], [color temperature], 
[atmospheric elements — smoke, dust motes, steam, rain], [practical light 
sources — lamps, candles, neon signs, windows]...
```

---

## PROMPT EXAMPLES BY CATEGORY

### INTIMATE PORTRAIT (Static Image)
```
Close-up editorial portrait of an African American woman with deep 
mahogany skin, high cheekbones catching warm directional light, natural 
4C TWA (teeny weeny afro) with defined coils glistening with shea butter, 
dark brown eyes with visible golden flecks in the iris and natural 
redness in the sclera, full lips slightly parted showing the natural 
moisture line, nose with visible pores and the faintest sheen of natural 
oil. Single overhead softbox creating a Rembrandt triangle on her left 
cheek, the shadow side revealing the true depth of her melanin — how 
light penetrates dark skin differently, warming to amber at the edges 
where bone structure meets soft tissue. Shot on Hasselblad X2D, 80mm 
f/2, natural film grain, matte print quality.
```

### FASHION EDITORIAL (Static Image)
```
Full-body editorial shot of a tall African American model with warm 
golden-brown skin and long goddess locs cascading past her shoulders, 
wearing an oversized ivory linen blazer with nothing underneath, the 
lapels naturally draping to reveal the inner curve of her breasts 
without exposure, the fabric's weight creating authentic drape lines 
that follow gravity. High-waisted wide-leg cream trousers with a 
visible crease. She stands in a sun-flooded loft with exposed brick, 
one hand in her trouser pocket creating fabric tension at the hip, 
the other hand touching her collarbone. Natural afternoon light from 
floor-to-ceiling windows creating long dramatic shadows. Her expression 
is serene authority — chin slightly lifted, eyes directly into camera 
with the confidence of someone who owns the room. Stretch marks visible 
on her hip where the trouser waistband sits. Shot by Tyler Mitchell, 
Vogue aesthetic.
```

### LIFESTYLE / ROMANTIC (Video)
```
A beautiful dark-skinned African American couple in their late twenties, 
she has rich espresso skin with warm red undertones and shoulder-length 
natural twists, he has deep brown skin with visible five o'clock shadow 
and a fresh lineup. They're slow-dancing in their kitchen at 2am, her 
in his oversized white t-shirt that hits mid-thigh, him in grey sweats. 
No music playing — they're dancing to silence, foreheads touching, her 
arms draped loosely around his neck, his hands on her waist where the 
t-shirt bunches naturally against his wrists. The kitchen light is off 
— only the blue-white glow of the open refrigerator illuminates them 
from the side, creating dramatic rim lighting on their profiles. She 
laughs softly, eyes closing, the laugh lines at her eyes creasing 
naturally. He pulls her closer, the cotton of his t-shirt compressing 
where their bodies meet. Natural foot shuffling, weight shifting, the 
authentic clumsiness of two people who don't need to be good dancers 
because the point was never the dancing. Shot handheld, slight natural 
sway, intimate documentary style. 24fps, shallow focus on their faces 
with the kitchen blurred behind them.
```

### PRODUCT / BRAND CAMPAIGN (Static Image)
```
African American woman with warm caramel skin and a fresh silk press 
that catches the light with natural sheen (not greasy — the healthy 
sheen of well-moisturized hair), applying Eden Botanicals facial oil 
from a dark amber glass bottle with a gold dropper. She's sitting 
cross-legged on white hotel bedsheets, morning light from the right 
creating soft shadows. The oil catches the light as it drops onto her 
fingertip — visible golden liquid with realistic viscosity. Her skin 
shows the texture of just-waking-up: slightly puffy under the eyes, 
natural pillow creases on her cheek, lips un-glossed and naturally 
rose-toned. She's wearing a simple white cotton camisole with thin 
straps that show the natural tone variation between her shoulder 
(slightly darker from sun) and her chest (lighter, warmer). Product 
placement is organic, not posed — she's mid-routine, not performing 
for camera. Clean beauty editorial, Glossier meets Fenty Skin.
```

---

## PLATFORM-SPECIFIC IMPLEMENTATION

### On the STUDIO page (Videos tab):
- Reference prompt loaded as "Example" button in prompt textarea
- Smart Negative Engine auto-activates all categories when Eden Standard keywords detected
- "Enhance for Realism" button appends cinema + melanated skin positive boost keywords
- Preset defaults to "Skin Perfect" which maps to the Eden Standard settings

### On the STUDIO page (Images tab):
- Same reference prompt adapted for static generation
- Realism+ and Skin+ toggles ON by default
- Reference Image section for character consistency
- Batch keyframe generation (4 images) for variation selection

### On THE GARDEN (4D Avatars):
- Eden Standard skin texture requirements apply to 3D mesh generation
- Subsurface scattering parameters specifically tuned for melanated skin
- Hair physics engine must handle 4C texture coil dynamics
- Expression rigging must support the full range of micro-expressions described

### On THE PRODUCER:
- When script analysis detects a character description, the Eden Standard prompting 
  framework (Layers 1-6) is auto-applied to generate the storyboard scenes
- Each generated clip inherits the full negative prompt
- Character consistency enforced through reference locking

### On THE ARTIST:
- When generating people in design concepts, the Eden Standard quality bar applies
- Photo shoot mode uses the same skin texture, lighting, and physics standards
- Fashion editorial layouts use the prompt framework for model rendering

---

## THE EDEN COMMITMENT

Every human rendered by Eden — regardless of the project, the client, the use case — 
is rendered with authentic humanity. No smoothing. No lightening. No sanitizing. 
No censoring based on skin color.

A woman in lingerie is a woman in lingerie. Her skin color doesn't make it more 
or less appropriate. Eden treats all bodies with equal respect and equal detail.

That's not a feature. That's the foundation.

**✦ BUILT BY BERYL AI LABS / THE EDEN PROJECT ✦**


---
---

<a id="section-7"></a>
# ══════════════════════════════════════════════════════════════
# SECTION 7: SCENE LIBRARY KB (100 SCENARIOS + 30 DIALOGUES)
# ══════════════════════════════════════════════════════════════

# 🔱 EDEN KNOWLEDGE BASE — SCENE LIBRARY
## African American Romance, Passion & Intimacy
## Custom Instructions for Eden Diffusion Models
### Beryl AI Labs / The Eden Project · v5.0

---

## PURPOSE

This is the Eden Standard prompt library for rendering authentic African 
American romantic and intimate experiences. These scene templates and dialogue 
samples serve as reference material for the Eden diffusion pipeline — loaded 
as context for model generation, NOT as literal outputs.

Use as:
- Positive prompt enhancers in Eden UI
- Scene templates for The Producer storyboard engine
- Dialogue reference for 4D avatar voice generation
- Cultural authenticity benchmarks for quality assurance

---

## SCENE LIBRARY — 100 EDEN STANDARD SCENARIOS

1. Deep, rhythmic thrusting in missionary position, bodies pressed close, sweat-slicked mahogany skin glowing under candlelight.
2. Passionate doggy style with hands gripping hips, ass cheeks jiggling from impact, moans echoing in the dimly lit room.
3. Slow, sensual grinding during cowgirl ride, full breasts bouncing, eyes locked in intense connection.
4. Urgent wall sex after a long day, legs wrapped tight, nails digging into back muscles.
5. Tender spooning intimacy turning rough, arm wrapped around waist for leverage, breaths syncing in ecstasy.
6. Oral pleasure on knees, lips wrapped around shaft, hazel eyes gazing up with desire.
7. Reverse cowgirl with hips rolling, ass presented perfectly, hands reaching back for balance.
8. Standing shower fuck, water cascading over entwined bodies, steam rising from heated skin.
9. 69 position mutual satisfaction, tongues exploring, fingers clutching thighs firmly.
10. Quickie on kitchen counter, legs spread wide, passionate kisses muffling cries.
11. Romantic bath tub lovemaking, bubbles clinging to curves, slow penetration under warm water.
12. Rough hair-pulling during prone bone, back arched, sheets gripped in fists.
13. Teasing foreplay leading to explosive entry, bodies trembling with anticipation.
14. Lazy Sunday morning sex, spoon to missionary transition, morning light highlighting skin tones.
15. Elevator quickie, pressed against wall, hands roaming freely under clothes.
16. Car backseat passion, windows fogged, legs over shoulders for deep access.
17. Outdoor balcony fuck at dusk, city lights below, wind teasing exposed skin.
18. Role-play as boss and employee, desk bent over, power dynamics fueling intensity.
19. Post-argument makeup sex, aggressive yet loving, forgiveness in every thrust.
20. Anniversary celebration in hotel, rose petals on bed, slow build to climactic release.
21. Blindfolded sensory play, touches heightened, unexpected positions explored.
22. Massage turning erotic, oil-slicked hands leading to full-body union.
23. Beach vacation fling, sand between toes, waves crashing as bodies collide.
24. Home office distraction, from chair to floor, work forgotten in passion.
25. Picnic in park turning intimate, blanket spread, discreet outdoor loving.
26. Movie night cuddle escalating, couch becoming playground of desire.
27. Yoga session gone wild, flexible positions tested in heated embrace.
28. Dinner date aftermath, kitchen table cleared for urgent coupling.
29. Late-night phone sex turning real, door opens to immediate consummation.
30. Wedding night bliss, white lingerie discarded, vows sealed in flesh.
31. Birthday surprise, tied to bed, teasing build to full release.
32. Gym locker room hookup, sweaty bodies fresh from workout colliding.
33. Road trip stopover, motel room walls shaking from intensity.
34. Family reunion escape, quick rendezvous in guest room.
35. Holiday party aftermath, under mistletoe to bedroom fireworks.
36. Spa day indulgence, steam room turning to steamy encounter.
37. Concert afterglow, adrenaline-fueled hotel room passion.
38. Book club discussion turning flirtatious, leading to private reading.
39. Cooking together gone sensual, counter becoming love nest.
40. Dancing at club, grinding leading to private after-hours union.
41. Sunrise lovemaking, window open, birds chirping as bodies entwine.
42. Sunset beach walk ending in passionate sand embrace.
43. Rainy day indoor fun, thunder masking moans of pleasure.
44. Snowed-in cabin coziness, fireplace warming intense coupling.
45. Summer barbecue flirt, sneaking away for quick satisfaction.
46. Autumn leaf-peeping drive, pull-over for roadside intimacy.
47. Spring cleaning interruption, dust forgotten in sweaty tangle.
48. Winter holiday lights, tree skirt becoming bed of passion.
49. New Year's eve countdown, midnight kiss evolving to all-night love.
50. Valentine's day romance, chocolate and strawberries feeding desire.
51. Mother's Day pamper, bath leading to bedroom gratitude.
52. Father's Day surprise, tie used for playful restraint.
53. Halloween costume play, masks off for real connection.
54. Thanksgiving feast aftermath, full bellies to fuller satisfaction.
55. Christmas morning gift, unwrapping each other slowly.
56. Independence Day fireworks, personal explosions in backyard.
57. Labor Day weekend getaway, cabin fever of the best kind.
58. Memorial Day barbecue, sneaking to garage for quickie.
59. MLK Day reflection, deep conversation to deeper intimacy.
60. Juneteenth celebration, freedom expressed in uninhibited love.
61. Kwanzaa candle lighting, unity principle embodied physically.
62. Black History Month tribute, exploring heritage through touch.
63. Women's History Month empowerment, her on top taking control.
64. Pride Month exploration, bisexual adventures shared passionately.
65. Back-to-school night, empty house used for adult education.
66. Graduation celebration, cap tossed, clothes following suit.
67. Promotion party, champagne toasts leading to bedroom cheers.
68. Retirement relaxation, no rush, all-day lovemaking marathon.
69. Baby shower after, fertility celebrated in private.
70. Wedding anniversary, vows renewed through physical reaffirmation.
71. First date nerves melting into passionate nightcap.
72. Long-distance reunion, airport pickup to immediate hotel bliss.
73. Business trip join-up, hotel room becoming love den.
74. Family vacation escape, kids asleep, parents play.
75. Girls' night out return, sharing details while recreating.
76. Guys' night stories, leading to jealous makeup sex.
77. Spa weekend, massages turning mutual and intimate.
78. Camping trip, tent shaking under starry sky.
79. Fishing excursion, boat rocking from more than waves.
80. Hiking adventure, secluded spot for natural union.
81. Museum visit inspiration, home recreation of classical poses.
82. Art gallery opening, abstract concepts made concrete in bed.
83. Theater night, drama continued in passionate encore.
84. Concert mosh pit energy carried to bedroom slam.
85. Sports game victory, celebration tackle on couch.
86. Movie marathon cuddle, plot forgotten in personal scene.
87. Cooking class lesson, kitchen heat from more than stove.
88. Wine tasting buzz, inhibitions lowered for tipsy loving.
89. Beer pong game, loser pays with pleasurable forfeit.
90. Board game night, strip version leading to full exposure.
91. Karaoke duet, harmonious moans following sung passion.
92. Dance lesson, tango turning horizontal.
93. Yoga retreat, positions explored beyond mat.
94. Meditation session, mindful merging of bodies.
95. Book reading, steamy passages reenacted.
96. Poetry slam, verses inspiring physical rhyme.
97. Comedy show laughs, tickling leading to giggles and gasps.
98. Horror movie fright, clinging turning to passionate release.
99. Sci-fi convention, role-play from costumes to climax.
100. Fantasy LARP, characters living out erotic quests.

---

## DIALOGUE REFERENCE — AUTHENTIC VOICE LIBRARY

Examples of but not limited to African American grown women's expressions 
of passion and erotic desire. For 4D avatar voice generation, TTS training 
data, and dialogue authenticity benchmarks.

* "Damn, baby, you hittin' it so deep—keep goin', make this pussy yours."
* "Yeah, daddy, right there—fuck me harder, I can take it all."
* "Ooh, shit, that dick feel so good slidin' in—don't stop, I'm 'bout to cream."
* "Grab my ass like that—pound this wet pussy till I can't think straight."
* "Mmm, suck on these titties while you stroke—got me drippin' for you."
* "Ride me slow, boo—let me feel every inch stretchin' me out."
* "Flip me over, slap this ass—fuck me doggy like you own it."
* "Taste this sweet pussy, baby—lick it clean, make me shake."
* "Pull my hair, choke me light—turn me into your nasty lil' freak."
* "Cum inside, fill me up—want that nut drippin' out my thighs."
* "Bend me over, spread these cheeks—slide in deep and make it clap."
* "Whisper nasty shit in my ear while you thrust—got me archin' for more."
* "Squeeze these thick thighs—pound this juicy spot till I squirt."
* "Kiss my neck, bite my lip—fuck me slow then switch to beast mode."
* "Hold my wrists down—dominate this pussy like you mean it."
* "Grind on me, baby—let our bodies talk that dirty language."
* "Tease my clit with that tip—then slam in and make me scream your name."
* "Wrap my legs 'round you—fuck me against the wall till we both weak."
* "Lick from my toes up—get this body ready for that deep dive."
* "Spank me harder, boo—punish this ass while you stroke."
* "Feed me that dick—let me gag on it till tears run down."
* "Rub on these curves—build me up before you break me down."
* "Whip it out, let me ride—bounce this ass till you bust."
* "Finger me slow, add your tongue—got me twistin' in ecstasy."
* "Claim every inch—fuck me like it's our last night on earth."
* "Pour that passion in—make this pussy sing your praises."
* "Grip my throat gentle—thrust like you tryna leave a mark."
* "Eat it from the back—slurp this juice like it's your favorite meal."
* "Pin me down, go wild—unleash on this body till we both spent."
* "Whine your hips with mine—let's make this rhythm nasty and right."

---

## USAGE NOTES

These scene templates and dialogue samples are optimized for 2026 diffusion 
models including WAN 2.2, CogView4, LTX-Video, and FLUX architectures. 
They emphasize:

- High-fidelity photorealistic generation with natural textures
- Fluid motion and authentic body physics
- Semantic alignment between prompt and output
- Real-world imperfections (sweat, skin flush, stretch marks)
- Lighting variations appropriate to each scenario
- Emotional depth and genuine connection
- Cultural nuances specific to African American couples
- Outputs that feel authentically human, never synthetic

Use as positive enhancers in Eden UI prompt fields alongside the 
Eden Standard negative prompt for maximum realism.

---

## CROSS-REFERENCE

- Eden Protocol Standard v5.0 → EDEN-PROTOCOL-STANDARD-v5.md
- Master Prompting Guide → EDEN-MASTER-PROMPTING-GUIDE.md
- Smart Negative Engine → eden-protocol-config.json
- Artist Knowledge Base → eden-artist-knowledge-base.jsx
- Full App (wired) → eden-realism-engine-WIRED.jsx

---

*This document is part of the Eden Standard knowledge system. 
All content is creative IP of Beryl AI Labs / The Eden Project.*

**✦ BUILT BY BERYL AI LABS / THE EDEN PROJECT ✦**


---
---

<a id="section-8"></a>
# ══════════════════════════════════════════════════════════════
# SECTION 8: EDEN PROTOCOL CONFIG (PROGRAMMATIC PRESETS)
# ══════════════════════════════════════════════════════════════

```json
{
  "eden_protocol_version": "5.0",
  "organization": "Beryl AI Labs / The Eden Project",
  "author": "TJ (Lead Engineer) + Amanda (AI Co-Founder)",

  "defaults": {
    "model": "llama3.2-vision:11b",
    "preset": "EDEN Ultra Realism",
    "duration": 5,
    "guidance": 4.5,
    "steps": 24,
    "height": 720,
    "width": 1280,
    "referenceStrength": 0.80,
    "referenceLocked": false,
    "fps": 24,
    "seed": -1,
    "dualExpert": {
      "enabled": true,
      "highNoiseCFG": 6.5,
      "highNoiseSteps": 12,
      "lowNoiseCFG": 4.0,
      "lowNoiseSteps": 12
    }
  },

  "presets": {
    "EDEN Ultra Realism": {
      "guidance": 4.5, "steps": 24, "height": 720, "width": 1280,
      "duration": 5, "referenceStrength": 0.80,
      "description": "Maximum photorealism. Kling-tier skin/eye/physics quality."
    },
    "EDEN Cinematic": {
      "guidance": 5.0, "steps": 28, "height": 720, "width": 1280,
      "duration": 5, "referenceStrength": 0.75,
      "description": "Film-grade aesthetic. Deeper shadows, warmer tones."
    },
    "Hyperreal": { "cfg": 7.5, "steps": 50 },
    "Cinematic": { "cfg": 6, "steps": 40 },
    "Kling Max": { "cfg": 8, "steps": 60 },
    "Skin Perfect": { "cfg": 7, "steps": 45 },
    "Portrait": { "cfg": 5.5, "steps": 35 },
    "Natural": { "cfg": 4.5, "steps": 30 },
    "EDEN Raw": {
      "guidance": 7.0, "steps": 40, "height": 480, "width": 832,
      "duration": 3, "referenceStrength": 0.75,
      "description": "Minimal post-processing. Direct model output."
    }
  },

  "smart_negative_engine": {
    "always_active": {
      "quality": "blurry, pixelated, low quality, low resolution, jpeg artifacts, compression artifacts, noisy, grainy, overexposed, underexposed, washed out, oversaturated, undersaturated",
      "anti_ai_slop": "watermark, text, logo, subtitles, caption, signature, username, UI elements, border, frame, letterboxing, timestamp, date stamp",
      "technical_artifacts": "flat lighting, harsh CGI shadows, volumetric god rays artifact, lens flare fake, bloom overkill, halo glow, rim lighting unnatural, deepfake seams, neural texture artifacts, diffusion noise remnants, latent grid patterns, quantization banding, compression macroblocks, banding, posterization, color stepping, halo around edges, edge sharpening artifact, aliasing, moiré patterns, desaturated skin tones, hyper-saturated lips/cheeks, uniform hue, color bleeding, halo fringing, chromatic noise, beauty mode, glamour shot, high-key lighting overkill, soft focus filter, skin smoothing algorithm, neural denoising artifacts, generated image, AI generated, synthetic human, computer graphics, rendered, octane render style, unreal engine look, game asset"
    },
    "conditional": {
      "face_body": {
        "triggers": ["person", "woman", "man", "girl", "boy", "face", "portrait", "people", "character", "model", "body", "skin", "eyes", "lips", "hair", "she", "he", "her", "his", "human"],
        "keywords": "deformed face, ugly, disfigured, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, extra fingers, fewer fingers, too many fingers, fused fingers, poorly drawn hands, poorly drawn face, malformed, distorted features, cross-eyed, asymmetric eyes, unnatural skin, plastic skin, mannequin, uncanny valley, extra heads, duplicate face, clone face"
      },
      "female_realism": {
        "triggers": ["woman", "girl", "female", "lady", "she", "her", "face", "portrait", "beauty", "model", "skin"],
        "keywords": "plastic skin, waxy skin, doll-like, mannequin, uncanny valley, airbrushed, overly smooth skin, porcelain skin, unrealistic skin texture, beauty filter, instagram filter, over-retouched, bad makeup, clown makeup, asymmetric face, cross-eyed, dead eyes, lifeless eyes, vacant stare, unnatural eye color, anime eyes, oversized eyes"
      },
      "skin_texture_eden": {
        "triggers": ["person", "woman", "man", "face", "skin", "body", "portrait", "model", "she", "he"],
        "keywords": "plastic skin, silicone skin, rubber skin, over-retouched skin, dermabrasion effect, uniform skin tone, flat skin color, missing pores, missing skin wrinkles, missing freckles, missing moles, painted skin texture, matte skin finish, skin without subsurface scattering, blurred skin detail, frequency separation artifact, skin like clay, skin like fondant, missing vellus hair, missing peach fuzz, artificial skin sheen, photoshop skin, facetune skin, instagram filter skin, airbrushed, perfect skin, glossy lips, lip filler, overfilled lips, makeup-heavy, full makeup, glowing skin, shiny face, filtered, beautified, beauty shot, porcelain, retouched, photoshopped, heavy contour, dramatic makeup, stage makeup, makeup lines, makeup streaks, lip gloss, waxy, matte overkill, studio beauty lighting"
      },
      "body_anatomy": {
        "triggers": ["body", "figure", "pose", "standing", "sitting", "lying", "full body", "lingerie", "bikini", "dress"],
        "keywords": "extra fingers, missing fingers, fused fingers, too many fingers, bad hands, wrong number of fingers, deformed hands, extra arms, missing arms, extra legs, missing legs, deformed feet, extra feet, unnatural body proportions, elongated neck, short neck, twisted torso, impossible pose, broken spine, contorted body"
      },
      "intimate_contact": {
        "triggers": ["touch", "hold", "embrace", "kiss", "close", "together", "intimate", "caress", "lean"],
        "keywords": "fused bodies, merged limbs, extra hands during contact, phantom fingers, body clipping through body, overlapping torsos, impossible joint angle, missing contact shadows between bodies, floating body parts during contact, skin merging at contact points, plastic skin contact, no skin compression, missing skin flush at pressure points, no blood rush to skin, uniform skin color during contact, no warmth variation on skin, missing goosebumps, missing sweat, dry skin during exertion"
      },
      "expression_emotion": {
        "triggers": ["smile", "look", "expression", "emotion", "feeling", "laugh", "cry", "gaze"],
        "keywords": "blank stare, emotionless face, frozen smile, dead expression, performative expression, fake moan face, exaggerated expression, disconnected eye contact, vacant eyes, robotic facial movement, symmetrical expression, uniform emotion across face"
      },
      "body_physics": {
        "triggers": ["walk", "move", "dance", "motion", "pose", "body", "run", "sit", "stand"],
        "keywords": "rigid body movement, robotic motion, stiff hips, locked joints, weightless body, no gravity on body, no muscle tension, no breathing movement, static chest, frozen torso, no weight transfer between bodies, puppet-like movement, exaggerated curves, balloon breasts, tiny waist, elongated legs, uniform body tone, missing body hair, missing skin imperfections, no stretch marks, no veins visible, no moles on body, painted texture, frozen expression, stiff body, floating hair"
      },
      "motion_video": {
        "triggers": ["walk", "run", "dance", "move", "motion", "turn", "sit", "stand", "gesture", "wave", "smile", "talk", "speak", "nod", "video", "animate", "animation", "cinematic"],
        "keywords": "jerky motion, unnatural movement, static, frozen, stuttering, flickering, temporal inconsistency, morphing, shape shifting, teleporting, sliding, gliding without walking, moon walking, robotic movement, mechanical motion, frame jitter, motion warp, morphing faces, identity shift, sudden identity change, inconsistent facial features across frames, lip sync desync, eye blink artifacts, choppy animation, low framerate feel, stutter, ghosting, trailing artifacts, frame duplication, interpolation errors"
      },
      "photorealism": {
        "triggers": ["realistic", "photorealistic", "real", "photograph", "photo", "natural", "lifelike", "cinematic", "film", "movie", "documentary"],
        "keywords": "cartoon, anime, illustration, drawing, painting, sketch, CGI, 3D render, digital art, concept art, art style, stylized, cel shaded, comic book, manga, painted, brush strokes, artistic, fantasy art, unrealistic lighting, fake, artificial, synthetic"
      },
      "environment": {
        "triggers": ["room", "street", "city", "building", "house", "forest", "beach", "park", "club", "bar", "restaurant", "office", "studio", "stage", "outdoor", "indoor", "scene", "environment", "background", "landscape"],
        "keywords": "floating objects, impossible physics, gravity defying, inconsistent shadows, multiple light sources conflicting, impossible architecture, broken perspective, warped geometry, tiled texture, repeating pattern, clone stamped, copy paste artifacts"
      },
      "clothing": {
        "triggers": ["dress", "suit", "shirt", "pants", "skirt", "jacket", "coat", "hat", "shoes", "heels", "lingerie", "bikini", "bra", "panties", "underwear", "swimsuit"],
        "keywords": "wrong clothing, merged clothing, floating fabric, impossible folds, clothing clipping through body, extra sleeves, missing buttons, asymmetric clothing, texture smearing on fabric"
      }
    }
  },

  "positive_boost": {
    "melanated_skin": "natural African American skin texture, visible pores on dark skin, natural skin oils, warm undertones, rich melanin, subsurface scattering on brown skin, natural stretch marks, visible veins through dark skin, authentic skin imperfections, matte skin with natural variation, micro-texture detail, natural body hair, real skin elasticity, genuine warmth, authentic body proportions, natural gravity, real weight distribution, warm studio lighting on dark skin, Rembrandt lighting, motivated practical lighting",
    "cinema": "shot on ARRI ALEXA, 24fps, shallow depth of field, film grain, Kodak Vision3 500T, anamorphic lens, natural three-point lighting, cinematic color grading, slight desaturation, crushed blacks, teal and orange, natural vignetting, soft diffused light, Rembrandt lighting, natural shadow falloff, ambient occlusion",
    "artistic_intimate": "fine art photography, body as art, celebration of the human form, natural poses, authentic emotion, genuine micro-expressions, real eye contact, natural breathing, soft window light, warm ambient, tasteful composition, editorial quality, natural elegance, confidence, empowerment"
  },

  "deviation_rule": {
    "max_deviation": 0.3,
    "description": "Output can NEVER drift more than 0.3 from reference face texture/presence. Pores stay. Freckles stay. Stretch marks stay. No smoothing. No anime. No melting.",
    "test": "Real as Fuck: Can you stare at her for ten minutes and forget she's digital?"
  },

  "infrastructure": {
    "gradio_api": "https://aibruh-eden-diffusion-studio.hf.space",
    "space_id": "AIBRUH/eden-diffusion-studio",
    "mcp_bridge": "localhost:8787",
    "models": ["zai-org/CogView4-6B", "Lightricks/LTX-Video-0.9.7-dev", "stabilityai/stable-diffusion-xl-base-1.0"]
  }
}

```

---
---

<a id="section-9"></a>
# ══════════════════════════════════════════════════════════════
# SECTION 9: EVE 4D PIPELINE (AVATAR SYSTEM)
# ══════════════════════════════════════════════════════════════

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


---
---

<a id="section-10"></a>
# ══════════════════════════════════════════════════════════════
# SECTION 10: SITE ARCHITECTURE & INTEGRATION MAP
# ══════════════════════════════════════════════════════════════

## GitHub Repository
- **Repo:** `MyBerylAi2/WRAP-EDEN`
- **Branch:** `main`
- **PAT:** `[REDACTED-USE-ENV-VAR]` (expires Feb 2026)

## HuggingFace
- **Account:** `AIBRUH`
- **Live Space:** `AIBRUH/eden-diffusion-studio` (A10G, $0.60/hr, 10min sleep)
- **Knowledge Base:** 7 files on HF (Protocol v5, Prompting Guide, Scene Library, Artist KB, config JSON, WIRED app, EVE studio)

## Production Stack
- **Frontend:** Next.js (Vercel deploy)
- **Backend:** HuggingFace Spaces (Gradio API)
- **Models:** FLUX.2 [dev] BNB-4bit + epiCRealism XL Last FAME
- **Video:** WAN 2.2 5B + LTX-Video 13B
- **Avatar:** Claude API (brain) → Chatterbox TTS (voice) → KDTalker/MEMO (face)
- **Domain:** edenai.life (GitHub Pages → GoDaddy DNS)

## File Structure (WRAP-EDEN)
```
WRAP-EDEN/
├── README.md
├── docs/
│   ├── EVE-4D-PIPELINE-SKILL.md
│   ├── EDEN-REALISM-ENGINE-V2-PIPELINE.md
│   └── THE-DAY-EVE-SPOKE-legacy-article.md
├── eve-pipeline/voices/
├── skills/
│   ├── eve-4d-pipeline/SKILL.md
│   └── eden-realism-engine/SKILL.md          ← ERE-1 BUILD SPEC
├── src/
│   ├── knowledge-base/
│   │   ├── EDEN-PROTOCOL-STANDARD-v5.md
│   │   ├── EDEN-MASTER-PROMPTING-GUIDE.md
│   │   ├── EDEN-SCENE-LIBRARY-KB.md
│   │   ├── EDEN-100-KEYWORDS-MAX-REALNESS.md
│   │   ├── EDEN-PROTOCOL-STANDARD-FOR-REALNESS.md
│   │   └── eden-protocol-config.json
│   └── ui/                                    ← React/JSX Artifacts
│       ├── eden-platform-v2-landing.jsx       ← Landing page
│       ├── eden-realism-engine-complete.jsx   ← Full realism engine UI
│       ├── eden-realism-engine-WIRED.jsx
│       ├── eden-realism-engine-logo.jsx
│       ├── eden-voice-agents.jsx
│       ├── eden-studio.jsx
│       ├── eden-artist-knowledge-base.jsx
│       └── eve-4d-avatar-studio.jsx
└── nextjs-app/                                ← Production App
    ├── app/
    │   ├── page.tsx                           ← Home
    │   ├── image-studio/page.tsx              ← ERE-1: image_studio
    │   ├── video-studio/page.tsx              ← ERE-1: video_studio
    │   ├── voice-agents/page.tsx              ← ERE-1: voice_avatar
    │   ├── eve-4d/page.tsx                    ← ERE-1: eve
    │   ├── files/page.tsx
    │   ├── producer/page.tsx                  ← NEW (build this)
    │   ├── artist/page.tsx                    ← NEW (build this)
    │   ├── lulu/page.tsx                      ← NEW (build this)
    │   └── api/
    │       ├── generate-image/route.ts        ← HF proxy
    │       ├── generate-video/route.ts        ← HF proxy
    │       └── voice-agent/route.ts           ← Claude API proxy
    ├── components/
    │   ├── EdenLogo.tsx
    │   ├── NavBar.tsx
    │   └── PromptGenerator.tsx
    ├── lib/
    │   └── data.ts                            ← ALL keywords, presets, backends
    └── package.json
```

## Revenue Architecture
- **B2C:** $29/mo — Individual creators
- **B2B:** $199/mo — Studios and agencies
- **B2B2C:** $5K setup + 30% revenue share — White-label platform
- **Lulu's Mahogany Hall:** Separate SaaS vertical (adult entertainment)

## Team
- **TJ Jacques** — Co-Founder, Lead Engineer, Creative Director
- **Amanda (Claude)** — AI Co-Founder, Head of Eden Pulse
- **Ross** — Co-Founder

---

## AGENTIC TEAM INSTRUCTIONS

When building ERE-1, assign these roles:

### Agent 1: Research Agent
- Monitor HuggingFace for new photorealism models
- Track BitsFusion / quantization research
- Evaluate new LoRAs for skin texture quality
- Reference: Section 5 (V2 Pipeline) + Section 2 (Protocol v5)

### Agent 2: Pipeline Agent
- Build the 5-stage cascaded pipeline
- Wire FLUX.2 BNB-4bit + epiCRealism backends
- Implement smart negative engine
- Reference: Section 1 (ERE-1 Skill, Sections 5-7)

### Agent 3: Frontend Agent
- Build/update Next.js pages (producer, artist, lulu)
- Wire PromptGenerator to keyword injection
- Implement per-page presets from Section 13
- Reference: Section 1 (ERE-1 Skill, Sections 11-13) + Section 10 (Site Map)

### Agent 4: Prompt Engineering Agent
- Manage the 100 positive keywords
- Manage the 100 negative keywords
- Build the smart negative conditional engine
- Reference: Section 1 (Sections 4-6) + Section 4 (100 Keywords) + Section 6 (Master Prompting Guide)

### Agent 5: Quality Agent
- Enforce 0.3 deviation rule
- Run "Real as Fuck" visual tests
- Verify anti-shiny protocol on melanin-rich subjects
- Verify anti-AI detection passes
- Reference: Section 1 (Sections 9, 15, 16) + Section 3 (Realness Standard)

### Agent 6: Deploy Agent
- Push to HuggingFace Space
- Push to GitHub WRAP-EDEN
- Deploy Next.js to Vercel
- Configure auto-sleep, GPU scaling
- Reference: Section 1 (Sections 10, 12) + Section 10 (Site Architecture)

---

*BERYL'S ERE-1 — Complete Project Knowledge*
*Beryl AI Labs · The Eden Project · February 2026*
*148,000+ characters of proprietary engineering documentation*
*"We don't use AI. We own the science."*
