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
