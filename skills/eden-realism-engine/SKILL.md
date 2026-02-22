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

## 5. THE MASTER NEGATIVE PROMPT

```python
EDEN_NEGATIVE = """
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
"""
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
