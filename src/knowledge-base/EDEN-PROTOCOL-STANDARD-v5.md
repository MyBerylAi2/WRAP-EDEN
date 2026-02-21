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
