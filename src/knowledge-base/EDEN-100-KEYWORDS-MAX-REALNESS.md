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
