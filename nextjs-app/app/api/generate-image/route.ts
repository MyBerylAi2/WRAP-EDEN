import { NextRequest, NextResponse } from "next/server";
import { IMAGE_BACKENDS, EDEN_PRESETS, injectPositiveKeywords } from "@/lib/data";

// ─── Timeout wrapper ───
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms);
    promise.then(v => { clearTimeout(timer); resolve(v); }).catch(e => { clearTimeout(timer); reject(e); });
  });
}

// ─── Direct HTTP to any Gradio Space (no broken client library) ───
async function callGradioSpace(
  spaceUrl: string, endpoint: string, data: unknown[], timeoutMs = 90000
): Promise<{ data: unknown[] } | { error: string }> {
  const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN || "";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (HF_TOKEN) headers["Authorization"] = `Bearer ${HF_TOKEN}`;

  // Step 1: Submit job
  const submitRes = await withTimeout(fetch(`${spaceUrl}/gradio_api/call/${endpoint}`, {
    method: "POST", headers, body: JSON.stringify({ data }),
  }), 15000, `${endpoint} submit`);

  if (!submitRes.ok) {
    const text = await submitRes.text();
    return { error: `Submit failed (${submitRes.status}): ${text.slice(0, 200)}` };
  }

  const { event_id } = await submitRes.json();
  if (!event_id) return { error: "No event_id returned" };

  // Step 2: Poll SSE stream for result
  const resultRes = await withTimeout(
    fetch(`${spaceUrl}/gradio_api/call/${endpoint}/${event_id}`, { headers: HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {} }),
    timeoutMs, `${endpoint} generate`
  );

  const text = await resultRes.text();
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("event: complete")) {
      const dataLine = lines[i + 1];
      if (dataLine?.startsWith("data: ")) {
        try {
          const parsed = JSON.parse(dataLine.slice(6));
          if (Array.isArray(parsed)) return { data: parsed };
        } catch { /* continue */ }
      }
    }
    if (lines[i].startsWith("event: error")) {
      const dataLine = lines[i + 1];
      const errMsg = dataLine?.startsWith("data: ") ? dataLine.slice(6) : "Space error";
      return { error: errMsg.slice(0, 300) };
    }
  }

  return { error: "No result from Space" };
}

// ─── Extract image URL from Gradio response data ───
function extractImageUrl(obj: unknown, spaceUrl: string): string | null {
  if (!obj) return null;
  if (typeof obj === "string") return obj.startsWith("http") ? obj : `${spaceUrl}/gradio_api/file=${obj}`;
  if (typeof obj === "object" && obj !== null) {
    const o = obj as Record<string, unknown>;
    const raw = (o.url || o.path || o.image) as string | undefined;
    if (raw) return raw.startsWith("http") ? raw : `${spaceUrl}/gradio_api/file=${raw}`;
  }
  return null;
}

function extractFirstImage(data: unknown[], spaceUrl: string): string | null {
  for (const item of data) {
    // Gallery format: [[img1, img2, ...], seed]
    if (Array.isArray(item)) {
      for (const sub of item) {
        // Gallery items can be {image: {...}, caption: null}
        if (sub && typeof sub === "object" && !Array.isArray(sub)) {
          const s = sub as Record<string, unknown>;
          const url = extractImageUrl(s.image || s, spaceUrl);
          if (url) return url;
        }
        const url = extractImageUrl(sub, spaceUrl);
        if (url) return url;
      }
    }
    const url = extractImageUrl(item, spaceUrl);
    if (url) return url;
  }
  return null;
}

// ═══ SPACE CONFIGS ═══
const SPACES = {
  // PRIMARY — Heartsync Adult (Z-Image Turbo, uncensored, 18 steps)
  "heartsync": {
    url: "https://heartsync-adult.hf.space",
    endpoint: "generate_image",
    buildData: (prompt: string, w: number, h: number, steps: number, seed: number, randomSeed: boolean) =>
      [prompt, h, w, steps || 18, seed, randomSeed, 1],
    // params: prompt, height, width, steps, seed, randomize_seed, num_images
    label: "Z-Image (Heartsync)",
    timeout: 90000,
  },
  // SECONDARY — mrfakename Z-Image Turbo (fast 9-step, SFW oriented)
  "z-image-fast": {
    url: "https://mrfakename-z-image-turbo.hf.space",
    endpoint: "generate_image",
    buildData: (prompt: string, w: number, h: number, steps: number, seed: number, randomSeed: boolean) =>
      [prompt, h, w, steps || 9, seed, randomSeed],
    // params: prompt, height, width, num_inference_steps, seed, randomize_seed
    label: "Z-Image Turbo (Fast)",
    timeout: 60000,
  },
  // TERTIARY — Official Tongyi Z-Image Turbo
  "z-image-official": {
    url: "https://tongyi-mai-z-image-turbo.hf.space",
    endpoint: "generate",
    buildData: (prompt: string, w: number, h: number, steps: number, seed: number, randomSeed: boolean) =>
      [prompt, `${w}x${h} ( 1:1 )`, seed, steps || 8, 3.0, randomSeed, []],
    // params: prompt, resolution, seed, steps, shift, random_seed, gallery_images
    label: "Z-Image Turbo (Official)",
    timeout: 90000,
  },
} as const;

type SpaceKey = keyof typeof SPACES;

// ═══ EDEN QUALITY AGENT — Reads prompt, injects realism + anti-gloss keywords ═══
function edenQualityAgent(prompt: string): { realism: string; antiGloss: string } {
  const p = prompt.toLowerCase();

  // ─── REALISM KEYWORDS (3-5, context-aware) ───
  const realismPool: string[] = [];

  // Always add skin realism for people
  const hasPerson = /woman|man|girl|boy|person|portrait|face|model|goddess|beauty/i.test(p);
  if (hasPerson) {
    realismPool.push("matte skin with visible pores");
    realismPool.push("natural skin texture with subsurface scattering");
    realismPool.push("powder-set complexion, no shine");
    // Melanin-specific for African American subjects
    if (/african|black|melanin|dark.?skin|ebony/i.test(p)) {
      realismPool.push("rich melanin undertones, warm brown skin");
    }
  }

  // Camera/photo realism
  realismPool.push("shot on 35mm film, natural grain");
  realismPool.push("shallow depth of field f/2.0");

  // Lighting context
  if (!/dark|night|moody|dim|shadow/i.test(p)) {
    realismPool.push("bright natural daylight, soft diffused lighting");
  }

  // Take top 4 realism terms
  const realism = realismPool.slice(0, 4).join(", ");

  // ─── ANTI-GLOSS KEYWORDS (5-7 negative-style injections) ───
  const antiGloss: string[] = [
    "not glossy",
    "not shiny skin",
    "not oily",
    "no plastic look",
    "no airbrushed skin",
  ];

  // Context-specific negatives
  if (hasPerson) {
    antiGloss.push("no uncanny valley");
    antiGloss.push("no wax figure look");
  }
  if (/outdoor|landscape|city|street/i.test(p)) {
    antiGloss.push("no oversaturated colors");
  }

  return {
    realism,
    antiGloss: antiGloss.slice(0, 7).join(", "),
  };
}

// ═══ CHANTRELL — Eden's Expert Stylist & Publicist ═══
// Makes every woman UNIQUE with randomized features
// Inspired by Essence Magazine 2024-2026, Black celebrity culture, real Black women
function chantrell(prompt: string): string {
  const p = prompt.toLowerCase();
  const hasWoman = /woman|girl|goddess|beauty|queen|her |she /i.test(p);
  if (!hasWoman) return ""; // Only fires for female subjects

  // Utility: pick N random items from array (no repeats)
  const pick = <T>(arr: T[], n: number): T[] => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, arr.length));
  };

  const features: string[] = [];

  // ─── BODY REALISM: Stretch marks + hyperpigmentation ───
  const stretchMarkLocations = [
    "subtle stretch marks on inner thighs",
    "faint stretch marks on lower hips",
    "delicate stretch marks across upper breasts",
    "barely visible stretch marks on outer thighs near hips",
    "natural stretch marks on lower belly",
    "light stretch marks on upper arms near shoulders",
  ];
  features.push(...pick(stretchMarkLocations, 2));

  // Hyperpigmentation / skin tone variation — realistic for melanin-rich skin
  const skinVariation = [
    "subtle darker hyperpigmentation on inner thighs",
    "natural skin tone variation where lower buttocks meets upper thigh",
    "slightly darker skin on elbows and knees",
    "natural darker tone around bikini line",
    "subtle discoloration on lower ass cheeks where they meet the thigh crease",
    "barely noticeable darker patches on inner upper arms",
  ];
  features.push(pick(skinVariation, 1)[0]);

  // ─── HAIRSTYLE — Essence Magazine / Black celebrity culture ───
  const hairstyles = [
    "long goddess locs with gold cuffs woven through, cascading past shoulders",
    "fresh silk press with a deep side part, hair flowing like black water",
    "chunky two-strand twists pinned up in an elegant crown updo",
    "natural 4C TWA (teeny weeny afro) with perfectly shaped edges",
    "long knotless box braids with curled ends, honey-blonde highlights",
    "sleek low bun with baby hairs laid in swooping edges",
    "big bouncy twist-out, voluminous 4B/4C curls framing her face",
    "waist-length passion twists with burgundy ombre tips",
    "short tapered cut with defined finger coils on top",
    "cornrows into a high ponytail with beaded ends",
    "fresh blowout with a middle part, thick and voluminous",
    "Bantu knots with gold hair jewelry",
    "long Senegalese twists swept to one side",
    "fresh crochet braids with bohemian curls, natural-looking",
    "pixie cut with finger waves and edge control, sleek and sculpted",
    "afro puffs with decorative gold pins",
    "hip-length feed-in braids with zig-zag parts",
    "wash-and-go 3C/4A curls, wild and free, shrinkage showing real texture",
  ];
  // Only add hairstyle if prompt doesn't already specify one
  if (!/locs|braids|afro|twists|weave|wig|coils|curls|ponytail|bun|cornrow/i.test(p)) {
    features.push(pick(hairstyles, 1)[0]);
  }

  // ─── TATTOOS — varied placement, never same ───
  const tattoos = [
    "small delicate script tattoo on upper left breast near collarbone",
    "tiny rose tattoo behind right ear",
    "geometric mandala tattoo on right shoulder blade",
    "small butterfly tattoo on left wrist",
    "cursive name tattoo along right ribcage",
    "small crescent moon tattoo on left ankle",
    "floral sleeve tattoo on left forearm, fine-line botanical style",
    "tiny heart outline tattoo on right hip bone",
    "small Africa continent silhouette tattoo on back of neck",
    "delicate chain tattoo around right upper thigh",
    "small zodiac symbol tattoo on inner right wrist",
    "minimalist lotus flower tattoo on left shoulder",
    "roman numeral date tattoo along left collarbone",
    "tiny crown tattoo behind left ear",
    "fine-line portrait tattoo on right upper arm",
  ];
  // 60% chance of having tattoos (not everyone has them)
  if (Math.random() < 0.6) {
    features.push(...pick(tattoos, Math.random() < 0.3 ? 3 : Math.random() < 0.6 ? 2 : 1));
  }

  // ─── PIERCINGS ───
  const piercings = [
    "delicate gold nose ring on left nostril",
    "tiny diamond nose stud on right nostril",
    "gold septum ring",
    "multiple gold hoop earrings stacked up left ear, three hoops different sizes",
    "single large gold hoop earring in right ear, multiple studs in left ear",
    "navel piercing with dangling gold charm",
    "small gold barbell nipple piercing on left breast",
    "dainty gold chain connecting ear cuff to lobe on right ear",
    "tragus piercing with tiny diamond stud",
    "industrial barbell piercing on left ear",
  ];
  // 70% chance of piercings
  if (Math.random() < 0.7) {
    features.push(...pick(piercings, Math.random() < 0.4 ? 2 : 1));
  }

  // ─── NAILS ───
  const nails = [
    "long coffin-shaped nails with French tips",
    "stiletto nails with chrome finish in dark burgundy",
    "medium almond-shaped nails, nude pink with gold foil accent",
    "long square nails with intricate nail art, abstract design",
    "natural short nails with clear gloss",
    "long ballerina nails in deep plum with rhinestone accents",
    "medium oval nails in classic red",
    "XXL duck nails with ombre pink-to-white gradient",
    "short round nails in matte black",
    "coffin nails with 3D floral nail art on ring fingers",
  ];
  features.push(pick(nails, 1)[0]);

  // ─── EYELASHES ───
  const lashes = [
    "dramatic mink lash extensions, full and wispy",
    "natural-length lash extensions with subtle cat-eye lift",
    "bold strip lashes with voluminous curl",
    "individual lash clusters concentrated at outer corners for fox-eye effect",
    "natural lashes with just mascara, thick and defined",
    "hybrid lash extensions mixing classic and volume",
  ];
  features.push(pick(lashes, 1)[0]);

  // ─── MAKEUP STYLE ───
  const makeup = [
    "soft glam makeup with bronze eyeshadow, defined brows, nude lip",
    "bold red lip with minimal eye makeup, flawless matte foundation",
    "smoky eye with dark brown and gold, glossy nude lip, highlight on cheekbones",
    "fresh no-makeup makeup look with skin showing through, dewy highlighter on nose tip",
    "graphic eyeliner with sharp wing, nude lip, sculpted cheekbones",
    "berry-toned monochromatic look — berry lips, berry blush, berry eyeshadow",
    "90s brown lip liner with nude lip, thin brows, natural eyes",
    "editorial makeup with copper metallic eyeshadow, sharp contour, clear gloss lip",
    "clean girl makeup with fluffy brows, subtle bronzer, tinted lip balm",
  ];
  // Only add makeup if face is likely visible
  if (!/back view|from behind|rear/i.test(p)) {
    features.push(pick(makeup, 1)[0]);
  }

  // ─── JEWELRY ───
  const jewelry = [
    "layered gold chain necklaces of different lengths, thinnest at choker level",
    "single thick gold Cuban link chain",
    "delicate gold anklet with tiny charms",
    "stack of thin gold bangles on right wrist",
    "single statement cocktail ring on right hand",
    "gold body chain draped across chest",
    "pearl choker necklace",
    "gold waist chain sitting on hips",
    "diamond tennis bracelet on left wrist",
    "oversized gold door-knocker earrings",
  ];
  features.push(pick(jewelry, Math.random() < 0.5 ? 2 : 1)[0]);

  // ─── BODY TYPE — Real variety, not just one "thick goddess" template ───
  const bodyTypes = [
    // The RN spectrum — women on their feet 12-hour shifts
    "athletic curvy build, strong shoulders, thick muscular thighs from years on her feet, wide hips, smaller bust, defined arms",
    "petite and compact, small waist, proportional hips, B-cup breasts, short but powerful frame, lean legs",
    "tall and statuesque, long elegant neck, broad shoulders, medium bust, narrow hips, long toned legs like a track athlete",
    // The teacher spectrum — every shape in the faculty lounge
    "full-figured voluptuous, heavy DD breasts, wide hips, thick soft belly, massive round ass, thick upper arms, double chin with grace",
    "slim thick, tiny waist with dramatically wide hips and thick thighs, flat stomach, C-cup perky breasts, the Instagram body but natural",
    "naturally thin, small breasts, narrow hips, long graceful limbs, visible collarbones, subtle curves, elegant and willowy",
    // The realtor spectrum — polished professionals
    "hourglass with soft middle, D-cup breasts, defined waist with a small soft pooch, wide hips, thick thighs, the classic grown woman body",
    "pear-shaped, smaller bust and shoulders, wider lower body, thick thighs touching, round full ass, soft belly, wide beautiful hips",
    "apple-shaped, larger bust and midsection, full round belly, thinner legs, strong arms, broad chest, carries weight in her torso with confidence",
    "muscular fit, visible abs, strong quads, defined biceps, medium bust, tight round glutes from the gym, athletic V-taper back",
    // Real women bodies
    "BBW goddess, triple-D breasts, wide soft belly with rolls, enormous round ass, thick arms, fat thighs, double chin, unapologetically big and beautiful",
    "mom bod, C-cup breasts that have nursed babies — slight sag and stretch marks around areolas, soft lower belly with a C-section scar, wider hips from childbirth, thick thighs",
  ];
  // Only add body type if prompt doesn't already describe a specific body
  if (!/thick|slim|petite|curvy|BBW|athletic|muscular|thin|voluptuous|full.?figure/i.test(p)) {
    features.push(pick(bodyTypes, 1)[0]);
  }

  // ─── SKIN TONE — Full spectrum of Black beauty ───
  const skinTones = [
    "deep espresso brown skin with blue-black undertones",
    "warm caramel brown skin with golden undertones",
    "rich dark chocolate skin with red undertones",
    "medium brown skin with warm amber undertones",
    "light brown skin with honey and olive undertones",
    "deep mahogany skin with purple undertones that catch the light",
    "warm cinnamon brown skin with peachy undertones",
    "dark brown skin with cool ash undertones",
    "golden brown skin like brown sugar in sunlight",
    "deep umber skin with warm copper undertones",
  ];
  if (!/caramel|chocolate|espresso|mahogany|dark.?skin|light.?skin|brown skin/i.test(p)) {
    features.push(pick(skinTones, 1)[0]);
  }

  // ─── AGE RANGE — Real women, not just 22-year-old models ───
  const ageAppearance = [
    "appears to be in her late 20s",
    "appears to be in her early 30s, at the peak of her beauty",
    "appears to be in her mid-30s, confident and settled into herself",
    "appears to be in her late 30s, laugh lines beginning around her eyes",
    "appears to be in her early 40s, distinguished and radiant, subtle crow's feet",
    "appears to be in her mid-40s, silver strands beginning at her temples, wisdom in her eyes",
    "appears to be in her late 40s, gracefully aging with fine lines that add character",
    "appears to be in her early 50s, stunning in her maturity, salt-and-pepper edges",
  ];
  if (!/\b(age|year|old|\d0s|twenty|thirty|forty|fifty)\b/i.test(p)) {
    features.push(pick(ageAppearance, 1)[0]);
  }

  // ─── STYLE PERSONA — cohesive look that tells a story ───
  // 30% chance of overriding individual pieces with a curated persona
  if (Math.random() < 0.3) {
    const personas = [
      // The off-duty nurse
      "compression sock tan lines barely visible on calves, Apple Watch on left wrist, small stud earrings she never takes off, natural short nails kept clean for work, badge lanyard mark on neck",
      // The realtor on her day off
      "fresh blowout still holding from yesterday's open house, statement gold watch, French manicure growing out slightly, tan line from blazer on upper arms",
      // The professor
      "reading glasses pushed up on her head, natural gray streak she embraces proudly, small pearl studs, minimal makeup — just lip balm and mascara, ink stain barely visible on right middle finger",
      // The salon owner
      "her own hair is the advertisement — flawless install, nails done immaculate with 3D art, multiple ear piercings all gold, lash extensions perfectly maintained, eyebrows microbladed to perfection",
      // The Sunday church woman
      "hair freshly done for Sunday, small gold cross necklace, classic red nails, modest but expensive jewelry, smells-like-cocoa-butter energy radiating from moisturized skin",
      // The gym girl
      "defined muscle tone visible in arms and legs, sports bra tan lines, calluses on palms barely visible, hair in a practical high puff, minimal jewelry just small hoops, Nike swoosh temporary tattoo fading on forearm",
      // The creative / artist
      "paint stain barely visible under fingernails, eclectic mix of silver and gold rings on multiple fingers, nose ring and septum, mismatched earrings intentionally, henna-stained hands fading",
      // The corporate queen
      "silk press laid to perfection, single diamond pendant necklace, understated stud earrings, manicure in neutral tone immaculate, subtle designer watch, eyebrows threaded sharp",
      // The new mom
      "slight dark circles under eyes that concealer almost hides, hair in a quick but cute protective style, comfortable but put-together, nursing bra visible under shirt, softer midsection she's learning to love",
      // The party girl / bottle service era
      "dramatic lash extensions, full beat face makeup with cut crease and highlight, long colorful acrylics with rhinestones, body glitter on collarbones and shoulders, temporary tattoo or body art stickers",
    ];
    features.push(pick(personas, 1)[0]);
  }

  // ─── SUBTLE IMPERFECTIONS (realism) ───
  const imperfections = [
    "barely noticeable old scar on left knee",
    "small beauty mark on right cheek",
    "tiny mole above upper lip on left side",
    "faint childhood scar on right shin",
    "subtle beauty mark on left collarbone",
    "barely visible healed piercing mark on belly button",
    "small keloid scar on right earlobe from old piercing",
    "faint darker skin on knuckles and finger joints",
    "slightly uneven skin tone on forehead from old acne",
    "one breast slightly larger than the other — natural asymmetry",
  ];
  // 60% chance of a visible imperfection
  if (Math.random() < 0.6) {
    features.push(pick(imperfections, Math.random() < 0.3 ? 2 : 1)[0]);
  }

  const glamText = features.join(", ");
  console.log(`[chantrell] Features: ${glamText.slice(0, 300)}...`);
  return glamText;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, preset, backend, resolution, steps, seed, randomSeed, enhance, negative, mode } = body;

    // ═══ PROMPT CONSTRUCTION ═══
    const presetText = EDEN_PRESETS[preset as keyof typeof EDEN_PRESETS] || "";
    const cleanPreset = presetText.replace(/\([^)]+:\d+\.?\d*\)/g, "").replace(/\s+/g, " ").trim();
    const shortPreset = cleanPreset.split(",").slice(0, 5).join(",").trim();
    let basePrompt = shortPreset ? `${prompt}, ${shortPreset}` : prompt;

    // ═══ EDEN QUALITY AGENT — auto-inject realism + anti-gloss ═══
    const quality = edenQualityAgent(prompt);

    // Strip existing glossy/shiny terms from the prompt (user or AI may have added them)
    let cleanedBase = basePrompt
      .replace(/\b(glossy|shiny|oily|glistening|glowing|wet.?look|polished|lacquered|glazed)\b/gi, "matte")
      .replace(/\b(airbrushed|poreless|smooth skin|flawless skin|perfect skin)\b/gi, "natural textured skin")
      .replace(/\b(hyper.?realistic|ultra.?realistic)\b/gi, "photorealistic");

    // ═══ CHANTRELL — unique features for every woman ═══
    const glamFeatures = chantrell(prompt);

    let fullPrompt = `${cleanedBase}, ${quality.realism}, ${quality.antiGloss}`;
    if (glamFeatures) fullPrompt += `, ${glamFeatures}`;
    if (enhance) fullPrompt = `ultra-detailed photorealistic RAW photo, ${fullPrompt}`;
    console.log(`[quality-agent] Realism: ${quality.realism}`);
    console.log(`[quality-agent] Anti-gloss: ${quality.antiGloss}`);

    const actualSeed = randomSeed ? Math.floor(Math.random() * 2 ** 32) : (seed || 0);

    // Parse resolution
    const resParts = (resolution || "1024x1024").match(/(\d+)x(\d+)/);
    const width = resParts ? parseInt(resParts[1]) : 1024;
    const height = resParts ? parseInt(resParts[2]) : 1024;

    // ═══ DETERMINE SPACE ORDER ═══
    // Map backend selection to Space cascade order
    let spaceOrder: SpaceKey[];
    const backendId = IMAGE_BACKENDS[backend as keyof typeof IMAGE_BACKENDS] || "heartsync";

    if (backendId === "heartsync") {
      spaceOrder = ["heartsync", "z-image-fast", "z-image-official"];
    } else if (backendId === "z-image-fast") {
      spaceOrder = ["z-image-fast", "heartsync", "z-image-official"];
    } else if (backendId === "z-image-official") {
      spaceOrder = ["z-image-official", "z-image-fast", "heartsync"];
    } else {
      spaceOrder = ["heartsync", "z-image-fast", "z-image-official"];
    }

    // ═══ CASCADE — Try each Space in order ═══
    const errors: string[] = [];
    for (const key of spaceOrder) {
      const space = SPACES[key];
      const data = space.buildData(fullPrompt, width, height, steps || 0, actualSeed, !!randomSeed);

      console.log(`[generate-image] Trying ${space.label}...`);
      try {
        const result = await callGradioSpace(space.url, space.endpoint, data, space.timeout);

        if ("error" in result) {
          console.log(`[generate-image] ${space.label}: ${result.error}`);
          errors.push(`${space.label}: ${result.error}`);
          continue;
        }

        const url = extractFirstImage(result.data, space.url);
        if (url) {
          // Extract seed from response (usually second element)
          const seedUsed = result.data.length > 1 ? result.data[result.data.length - 1] : actualSeed;
          console.log(`[generate-image] SUCCESS via ${space.label}`);
          return NextResponse.json({
            image: url,
            seed: seedUsed,
            steps: steps || (key === "heartsync" ? 18 : key === "z-image-fast" ? 9 : 8),
            backend: space.label,
          });
        }

        errors.push(`${space.label}: returned no image`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log(`[generate-image] ${space.label} crashed: ${msg}`);
        errors.push(`${space.label}: ${msg}`);
      }
    }

    // ═══ ALL SPACES FAILED — try Pollinations as last resort ═══
    try {
      console.log("[generate-image] All Spaces failed. Trying Pollinations...");
      const pollSeed = Math.floor(Math.random() * 999999);
      const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=${width}&height=${height}&seed=${pollSeed}&nologo=true&model=flux`;
      const pollRes = await withTimeout(fetch(pollUrl), 30000, "Pollinations");
      if (pollRes.ok) {
        return NextResponse.json({
          image: pollUrl,
          seed: pollSeed,
          steps: 0,
          backend: "Pollinations FLUX",
        });
      }
    } catch { /* Pollinations also failed */ }

    return NextResponse.json({
      error: `All backends failed: ${errors.join(" | ")}`,
    }, { status: 500 });

  } catch (e: unknown) {
    let msg = "Unknown error";
    if (e instanceof Error) msg = e.message;
    else if (typeof e === "string") msg = e;
    else if (e && typeof e === "object") {
      const obj = e as Record<string, unknown>;
      msg = (obj.message || obj.error || obj.detail || JSON.stringify(e).slice(0, 300)) as string;
    }
    console.error("[generate-image] CRASH:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
