// ═══════════════════════════════════════════════════════════════════════
// BERYL'S ERE-1 — Eden Realism Engine Core Data Layer
// Beryl AI Labs · The Eden Project
// One engine. Multiple frontends. Every generation passes through here.
// ═══════════════════════════════════════════════════════════════════════

export const ERE1_VERSION = "1.0.0";
export const ERE1_CODENAME = "BERYL'S ERE-1";

// ─── KEYWORD SYSTEM (100 Positive Keywords) ─────────────────────────

export const SKIN_KEYWORDS = [
  "matte skin finish", "visible pores", "subsurface scattering",
  "powder-set complexion", "melanin-rich texture", "velvet skin surface",
  "micro-texture detail", "diffused skin reflectance", "fine vellus facial hair",
  "natural skin undertones", "unretouched complexion", "pore-level detail",
  "natural redness variation", "skin translucency", "anti-specular highlight",
  "dry-set foundation finish", "hyperpigmentation detail", "tactile skin realism",
  "natural sebum balance", "collarbone shadow detail", "knuckle crease texture",
  "lip texture variation", "under-eye natural shadow", "temple vein subtlety",
  "neck crease detail",
];

export const CINEMA_KEYWORDS = [
  "shot on ARRI ALEXA 35", "Kodak Vision3 500T film stock",
  "35mm anamorphic lens", "shallow depth of field f/1.4",
  "natural motion blur", "film grain texture", "raw camera output",
  "ungraded log footage", "full-frame sensor capture", "prime lens sharpness",
  "optical lens aberration", "natural vignetting", "photochemical film process",
  "contact sheet aesthetic", "behind-the-scenes candid",
  "medium close-up framing", "handheld camera intimacy",
  "available light only", "practical lighting sources", "golden hour window light",
];

export const MELANIN_LIGHTING = [
  "Rembrandt lighting pattern", "warm key light 3200K",
  "soft diffused fill light", "subtle rim light separation",
  "candlelight color temperature", "motivated practical lighting",
  "natural shadow falloff", "bounce light from warm surfaces",
  "chiaroscuro contrast", "firelight warmth", "amber tungsten glow",
  "soft window side-light", "oil lamp flicker warmth",
  "natural ambient occlusion", "low-key cinematic lighting",
];

export const EMOTION_KEYWORDS = [
  "genuine micro-expression", "natural eye moisture",
  "authentic emotional weight", "unposed body language",
  "breath-caught moment", "involuntary lip part",
  "natural blink mid-frame", "tension in jaw muscle",
  "subtle nostril flare", "unguarded vulnerability",
  "locked eye contact", "weight shift between feet",
  "natural hand placement", "collarbone breathing movement",
  "caught-between-thoughts expression",
];

export const ENVIRONMENT_KEYWORDS = [
  "silk thread count visible", "natural fabric drape weight",
  "crushed velvet texture", "linen weave detail", "satin light interaction",
  "mahogany wood grain", "antique patina surface", "dust particles in light beam",
  "worn leather texture", "beveled mirror edge", "crystal chandelier refraction",
  "Persian rug fiber detail", "brass fixture oxidation",
  "pillow compression wrinkles", "steam or breath in cool air",
];

export const ANTI_DETECTION_KEYWORDS = [
  "asymmetrical facial features", "imperfect teeth alignment",
  "random flyaway hair strands", "uneven skin tone patches",
  "natural birthmark placement", "slightly crooked smile",
  "one eye marginally smaller", "stray eyelash on cheek",
  "chipped nail polish detail", "jewelry clasp slightly off-center",
];

// ─── 100 NEGATIVE KEYWORDS (Top Layer — Always Active) ──────────────

const EDEN_NEGATIVE_100 = [
  // SKIN SURFACE (1-20)
  "oily skin", "sweaty skin", "wet skin", "specular highlights on skin",
  "shiny forehead", "glossy cheeks", "dewy finish", "metallic skin sheen",
  "reflective skin surface", "moisture on face", "airbrushed", "poreless",
  "flawless skin", "beauty filter", "smooth skin", "plastic texture",
  "waxy appearance", "silicone look", "mannequin skin", "skin smoothing algorithm",
  // RENDERING (21-40)
  "CGI", "3d render", "digital art", "cartoon", "anime", "illustration",
  "octane render", "unreal engine", "blender render", "vray", "cinema4d",
  "clay render", "cel shaded", "stylized", "video game graphics",
  "doll", "action figure", "toy", "animated", "concept art",
  // FILTER (41-55)
  "oversaturated", "Instagram filter", "TikTok filter", "Snapchat filter",
  "face app", "beauty cam", "beauty mode", "HDR bloom", "over-processed",
  "digital noise reduction", "too sharp", "excessive sharpening",
  "glamour shot", "soft focus filter", "high-key lighting overkill",
  // AI TELLS (56-75)
  "perfect symmetry", "identical pore pattern", "repeating texture artifacts",
  "deepfake", "uncanny valley", "synthetic", "AI generated",
  "neural texture artifacts", "diffusion noise remnants", "latent grid patterns",
  "quantization banding", "hands with wrong finger count", "extra fingers",
  "fused fingers", "missing fingers", "ring light reflection in eyes",
  "catchlight too perfect", "deepfake seams", "generated image", "synthetic human",
  // MOTION (76-85)
  "soap opera effect", "60fps", "motion smoothing", "temporal flickering",
  "frame interpolation artifacts", "unnatural camera movement",
  "perfectly smooth gradients", "banding in shadows", "aliasing",
  "compression macroblocks",
  // LIGHTING (86-92)
  "flat lighting", "harsh CGI shadows", "artificial bloom", "fake lens flare",
  "ring light only", "fluorescent lighting", "volumetric god rays artifact",
  // METADATA (93-100)
  "watermark", "text artifacts", "logo", "subtitles",
  "signature", "UI elements", "border frame", "timestamp",
];

export const EDEN_NEGATIVE = EDEN_NEGATIVE_100.join(", ");

// ─── SMART NEGATIVE ENGINE ──────────────────────────────────────────

export const SMART_NEGATIVE_ENGINE = {
  always_active: {
    quality: "blurry, pixelated, low quality, low resolution, jpeg artifacts, compression artifacts, noisy, grainy, overexposed, underexposed, washed out, oversaturated, undersaturated",
    anti_ai_slop: "watermark, text, logo, subtitles, caption, signature, username, UI elements, border, frame, letterboxing, timestamp, date stamp",
    technical: "flat lighting, harsh CGI shadows, neural texture artifacts, diffusion noise remnants, latent grid patterns, quantization banding, beauty mode, skin smoothing algorithm, AI generated, synthetic human, computer graphics, rendered",
  },
  conditional: {
    face_body: {
      triggers: ["person", "woman", "man", "face", "portrait", "model", "body", "skin", "eyes", "hair", "human", "she", "he", "her", "his"],
      keywords: "deformed face, ugly, disfigured, bad anatomy, wrong anatomy, extra limbs, missing limbs, floating limbs, disconnected limbs, mutation, mutated, extra fingers, fewer fingers, too many fingers, fused fingers, poorly drawn hands, poorly drawn face, malformed, distorted features, cross-eyed, asymmetric eyes, unnatural skin, plastic skin, mannequin, uncanny valley, extra heads, duplicate face, clone face",
    },
    female_realism: {
      triggers: ["woman", "girl", "female", "lady", "she", "her", "face", "portrait", "beauty", "model", "skin", "goddess"],
      keywords: "(plastic skin:1.4), (waxy skin:1.4), doll-like, mannequin, uncanny valley, (airbrushed:1.5), (overly smooth skin:1.4), porcelain skin, unrealistic skin texture, (beauty filter:1.3), instagram filter, (over-retouched:1.4), bad makeup, clown makeup, asymmetric face, cross-eyed, dead eyes, lifeless eyes, vacant stare, unnatural eye color, anime eyes, oversized eyes, (dewy finish:1.3), (glossy skin:1.3), (shiny skin:1.3)",
    },
    skin_texture: {
      triggers: ["person", "woman", "man", "face", "skin", "body", "portrait", "model", "goddess"],
      keywords: "(plastic skin:1.5), (silicone skin:1.4), rubber skin, (over-retouched skin:1.4), dermabrasion effect, uniform skin tone, flat skin color, (missing pores:1.4), missing skin wrinkles, painted skin texture, (skin without subsurface scattering:1.3), (blurred skin detail:1.4), skin like clay, skin like fondant, (missing vellus hair:1.3), missing peach fuzz, (artificial skin sheen:1.4), (photoshop skin:1.4), (facetune skin:1.5), (perfect skin:1.4), (glossy lips:1.2), (glowing skin:1.3), (shiny face:1.3), filtered, beautified, beauty shot, porcelain, retouched, photoshopped, studio beauty lighting",
    },
    body_anatomy: {
      triggers: ["body", "figure", "pose", "standing", "sitting", "lying", "full body", "lingerie", "bikini", "dress"],
      keywords: "extra fingers, missing fingers, fused fingers, too many fingers, bad hands, wrong number of fingers, deformed hands, extra arms, missing arms, extra legs, missing legs, deformed feet, extra feet, unnatural body proportions, elongated neck, short neck, twisted torso, impossible pose, broken spine, contorted body",
    },
    motion_video: {
      triggers: ["walk", "run", "dance", "move", "video", "animate", "cinematic"],
      keywords: "jerky motion, unnatural movement, static, frozen, stuttering, flickering, temporal inconsistency, morphing, shape shifting, teleporting, sliding, gliding without walking, robotic movement, mechanical motion, frame jitter, morphing faces, identity shift, choppy animation, stutter, ghosting, trailing artifacts, frame duplication, interpolation errors",
    },
    photorealism: {
      triggers: ["realistic", "photorealistic", "real", "photograph", "photo", "natural", "cinematic", "film"],
      keywords: "cartoon, anime, illustration, drawing, painting, sketch, CGI, 3D render, digital art, concept art, art style, stylized, cel shaded, comic book, manga, painted, brush strokes, artistic, fantasy art, unrealistic lighting, fake, artificial, synthetic",
    },
    environment: {
      triggers: ["room", "street", "city", "building", "beach", "park", "indoor", "outdoor", "scene"],
      keywords: "floating objects, impossible physics, gravity defying, inconsistent shadows, multiple light sources conflicting, impossible architecture, broken perspective, warped geometry, tiled texture, repeating pattern, clone stamped, copy paste artifacts",
    },
    clothing: {
      triggers: ["dress", "suit", "shirt", "pants", "skirt", "jacket", "shoes", "heels", "lingerie", "bikini"],
      keywords: "wrong clothing, merged clothing, floating fabric, impossible folds, clothing clipping through body, extra sleeves, missing buttons, asymmetric clothing, texture smearing on fabric",
    },
  },
};

/** Build the full negative prompt by detecting triggers in the user prompt */
export function buildSmartNegative(userPrompt: string, extraNegative?: string): string {
  const lower = userPrompt.toLowerCase();
  const parts: string[] = [
    EDEN_NEGATIVE,
    SMART_NEGATIVE_ENGINE.always_active.quality,
    SMART_NEGATIVE_ENGINE.always_active.anti_ai_slop,
    SMART_NEGATIVE_ENGINE.always_active.technical,
  ];

  for (const [, config] of Object.entries(SMART_NEGATIVE_ENGINE.conditional)) {
    const triggers = config.triggers as string[];
    if (triggers.some((t) => lower.includes(t))) {
      parts.push(config.keywords);
    }
  }

  if (extraNegative) parts.push(extraNegative);

  // Deduplicate
  const unique = [...new Set(parts.join(", ").split(", ").map((k) => k.trim()).filter(Boolean))];
  return unique.join(", ");
}

/** Inject positive keywords based on prompt content.
 *  KEY PRINCIPLE: User's specific attributes (eye color, hair texture, etc.)
 *  must NEVER be diluted. We inject boosts AFTER the user prompt,
 *  and cap injection volume so the model prioritizes user intent. */
export function injectPositiveKeywords(
  userPrompt: string,
  mode: string,
  preset?: string,
): string {
  const lower = userPrompt.toLowerCase();
  const boosts: string[] = [];

  // Always inject cinema keywords for photorealism
  if (["image_studio", "producer", "artist", "eve", "voice_avatar", "lulu"].includes(mode)) {
    boosts.push(...CINEMA_KEYWORDS.slice(0, 7));
  }

  // Skin keywords for human subjects — INCREASED from 8→15 for deeper realism
  const humanTriggers = ["person", "woman", "man", "portrait", "face", "model", "she", "he", "girl", "lady", "goddess", "beauty"];
  if (humanTriggers.some((t) => lower.includes(t))) {
    boosts.push(...SKIN_KEYWORDS.slice(0, 15));
    boosts.push(...ANTI_DETECTION_KEYWORDS.slice(0, 6));
  }

  // Melanin lighting for dark skin subjects — INCREASED from 6→ALL for proper representation
  const melaninTriggers = ["african", "black", "brown skin", "dark skin", "melanin", "ebony", "african american"];
  if (melaninTriggers.some((t) => lower.includes(t))) {
    boosts.push(...MELANIN_LIGHTING); // ALL melanin lighting keywords — critical for dark skin
  }

  // Emotion keywords
  const emotionTriggers = ["emotion", "feeling", "expression", "smile", "laugh", "cry", "intimate", "serene", "grace"];
  if (emotionTriggers.some((t) => lower.includes(t))) {
    boosts.push(...EMOTION_KEYWORDS.slice(0, 8));
  }

  // Environment keywords for scene-heavy prompts
  const envTriggers = ["bed", "room", "silk", "velvet", "lace", "satin", "chandelier", "mahogany", "parlor"];
  if (envTriggers.some((t) => lower.includes(t))) {
    boosts.push(...ENVIRONMENT_KEYWORDS.slice(0, 8));
  }

  // Lulu/Mahogany Hall mode — premium intimate realism
  if (mode === "lulu" || lower.includes("lingerie") || lower.includes("intimate") || lower.includes("boudoir")) {
    boosts.push(
      "(film grain:1.3)", "(matte skin finish:1.4)", "(visible pores:1.3)",
      "(subsurface scattering:1.2)", "(natural skin imperfections:1.2)",
      "anti-specular highlight", "powder-set complexion",
      "natural redness variation", "skin translucency",
    );
  }

  // Apply preset boost
  if (preset && EDEN_PRESETS[preset]) {
    boosts.push(EDEN_PRESETS[preset]);
  }

  if (boosts.length === 0) return userPrompt;

  // Deduplicate boosts to avoid redundancy bloat
  const unique = [...new Set(boosts.map(b => b.trim()).filter(Boolean))];
  return `${userPrompt}, ${unique.join(", ")}`;
}

// ─── EDEN PRESETS ───────────────────────────────────────────────────

export const EDEN_PRESETS: Record<string, string> = {
  "EDEN Ultra Realism": "photorealistic, 8k uhd, shot on ARRI ALEXA 35, natural skin texture, film grain, shallow depth of field, Kodak Vision3 500T, visible pores, natural imperfections, beauty marks, matte skin finish, subsurface scattering",
  "EDEN Cinematic": "cinematic, anamorphic lens, film grain, dramatic lighting, shallow depth of field, color graded, Arri Alexa, crushed blacks, teal and orange, natural vignetting",
  "Hyperreal": "photorealistic, extreme detail, 8k, visible pores, film grain, natural lighting, shot on ARRI ALEXA 35, matte skin, micro-texture detail",
  "Cinematic": "cinematic, 35mm anamorphic, film grain, dramatic shadows, color graded, shallow DOF",
  "Kling Max": "photorealistic, cinema-grade, 8k uhd, ARRI ALEXA, matte skin finish, visible pores, subsurface scattering, film grain, anti-specular highlight, asymmetrical facial features, natural imperfections",
  "Skin Perfect": "photorealistic, matte skin finish, visible pores, melanin-rich texture, subsurface scattering, natural skin undertones, pore-level detail, Rembrandt lighting pattern, warm key light 3200K",
  "Portrait": "professional portrait, studio lighting, shallow DOF, sharp focus, natural skin texture, visible pores, Hasselblad X2D",
  "Natural": "natural photography, available light, authentic, documentary style, raw photo, unedited, film grain",
  "EDEN Raw": "raw photo, unedited, natural lighting, authentic, documentary style, street photography, film grain, matte skin",
  "Studio": "studio photography, softbox lighting, clean background, professional portrait, sharp focus, Hasselblad",
  "Medical": "medical professional headshot, neutral background, even lighting, ID photo quality, clean, trustworthy",
  "Mahogany Glamour": "photorealistic, 8k uhd, matte skin finish, visible pores, melanin-rich texture, subsurface scattering, film grain, Rembrandt lighting pattern, warm key light 3200K, candlelight color temperature, soft diffused fill, 1920s glamour, jazz age elegance, mahogany wood paneling, beaded gown, anti-specular highlight, powder-set complexion, natural redness variation",
  "The Parlor": "photorealistic, 8k uhd, matte skin finish, visible pores, melanin-rich texture, subsurface scattering, film grain, candlelit parlor, velvet chaise lounge, ornate gold frame, silk curtains, warm key light 3200K, Rembrandt lighting, soft diffused fill, amber tungsten glow, pore-level detail",
  "Diamond Room": "photorealistic, 8k uhd, matte skin finish, visible pores, melanin-rich texture, subsurface scattering, film grain, intimate boudoir, amber lamplight, satin sheets, art deco mirror, Rembrandt lighting, soft window side-light, natural redness variation, skin translucency, anti-specular highlight, genuine micro-expression, authentic emotional weight",
  "Boudoir": "photorealistic, 8k uhd, intimate boudoir photography, (matte skin finish:1.4), (visible pores:1.3), subsurface scattering, (film grain:1.3), shallow depth of field f/1.4, Rembrandt lighting, warm key light 3200K, soft diffused fill, natural skin imperfections, powder-set complexion, anti-specular highlight, candlelight warmth, silk thread count visible, satin light interaction",
};

// ─── IMAGE BACKENDS ─────────────────────────────────────────────────

export const IMAGE_BACKENDS: Record<string, string> = {
  "FLUX Schnell (Fast R&D)": "black-forest-labs/FLUX.1-schnell",
  "FLUX Dev (Publish Quality)": "black-forest-labs/FLUX.1-dev",
  "Z-Image Turbo": "Tongyi-MAI/Z-Image-Turbo",
  "CogView4": "THUDM/CogView4-6B",
  "Juggernaut Pro FLUX": "RunDiffusion/JuggernautProFlux",
};

// ─── VIDEO BACKENDS ─────────────────────────────────────────────────

export const VIDEO_BACKENDS: Record<string, string> = {
  "Wan 2.2 (5B)": "Wan-AI/Wan-2.2-5B",
  "LTX-Video (13B)": "Lightricks/LTX-Video-0.9.7-dev",
  "CogView4 Video": "THUDM/CogView4-6B",
  "Eden Diffusion Studio": "AIBRUH/eden-diffusion-studio",
};

// ─── RESOLUTIONS ────────────────────────────────────────────────────

export const RESOLUTIONS = [
  "1024x1024 ( 1:1 )",
  "768x1280 ( 9:16 Portrait )",
  "1280x768 ( 16:9 Landscape )",
  "832x1216 ( 2:3 Editorial )",
  "1216x832 ( 3:2 Photo )",
  "512x512 ( Quick )",
];

// ─── SCENE CATEGORIES (Image Studio) ────────────────────────────────

export const SCENE_CATEGORIES = [
  {
    group: "Portrait & Beauty",
    items: [
      "Close-up Portrait", "Editorial Headshot", "Beauty Campaign",
      "Glamour Portrait", "Environmental Portrait", "Candid Street Portrait",
    ],
  },
  {
    group: "Fashion & Editorial",
    items: [
      "Fashion Editorial", "Runway Shot", "Lookbook", "Brand Campaign",
      "Avant-Garde Fashion", "Street Style",
    ],
  },
  {
    group: "Lifestyle & Romance",
    items: [
      "Couple Portrait", "Intimate Moment", "Morning Light Scene",
      "Kitchen Scene", "Rooftop Sunset", "Beach Walk",
    ],
  },
  {
    group: "Commercial & Product",
    items: [
      "Product Lifestyle", "Skincare Campaign", "Fitness Brand",
      "Restaurant Scene", "Hotel Campaign", "Luxury Brand",
    ],
  },
  {
    group: "Artistic & Cinematic",
    items: [
      "Film Still", "Music Video Frame", "Album Cover",
      "Movie Poster", "Documentary Style", "Fine Art",
    ],
  },
];

// ─── VIDEO SCENE CATEGORIES ─────────────────────────────────────────

export const VIDEO_SCENE_CATEGORIES = [
  {
    group: "Cinematic Motion",
    items: [
      "Walking Scene", "Slow Motion Close-Up", "Tracking Shot",
      "Dolly Push-In", "Orbit Shot", "Crane Down",
    ],
  },
  {
    group: "Lifestyle & Romance",
    items: [
      "Morning Routine", "Cooking Together", "Dancing Scene",
      "Pillow Talk", "Getting Ready", "City Walk Date",
    ],
  },
  {
    group: "Performance",
    items: [
      "Music Performance", "Dance Choreography", "Spoken Word",
      "Fashion Walk", "Workout Sequence", "Yoga Flow",
    ],
  },
  {
    group: "Commercial",
    items: [
      "Product Demo", "Brand Story", "Testimonial",
      "Restaurant Ambiance", "Hotel Tour", "Real Estate Walk-Through",
    ],
  },
];

// ─── SUBJECT TYPES ──────────────────────────────────────────────────

export const SUBJECT_TYPES = [
  "African American Woman", "African American Man", "African American Couple",
  "Mixed-Race Woman", "Mixed-Race Man", "Latina Woman",
  "Asian Woman", "South Asian Woman", "Middle Eastern Woman",
  "Caucasian Woman", "Caucasian Man",
  "Group/Ensemble", "Solo Subject (Any)",
];

// ─── SKIN TONES (Eden Protocol) ─────────────────────────────────────

export const SKIN_TONES = [
  "Deep Espresso", "Rich Cocoa", "Warm Mahogany", "Golden Brown",
  "Hazel-Toned", "Warm Caramel", "Honey Bronze", "Light Brown",
  "Olive Warm", "Fair Warm", "Porcelain Cool",
  "Auto-Detect (Smart Engine)",
];

// ─── CAMERAS ────────────────────────────────────────────────────────

export const CAMERAS = [
  "ARRI ALEXA 35", "RED V-RAPTOR 8K", "Sony Venice 2",
  "Canon EOS R5", "Hasselblad X2D", "Leica M11",
  "iPhone 15 Pro (Natural)", "Film Camera (35mm)",
  "Medium Format", "Anamorphic Lens",
];

// ─── LIGHTINGS ──────────────────────────────────────────────────────

export const LIGHTINGS = [
  "Rembrandt Lighting", "Butterfly Lighting", "Split Lighting",
  "Loop Lighting", "Broad Lighting", "Short Lighting",
  "Golden Hour", "Blue Hour", "Candlelight / Warm 3200K",
  "Natural Window Light", "Softbox Studio", "Ring Light (Subtle)",
  "Chiaroscuro", "Practical Lighting Only", "Low-Key Cinematic",
  "Neon / Colored Gels",
];

// ─── VISUAL STYLES ──────────────────────────────────────────────────

export const VISUAL_STYLES = [
  "Eden Ultra Realism", "Cinema RAW", "Film Noir",
  "Kodachrome Vintage", "Portra 400 Film", "High Fashion Gloss",
  "Documentary Grit", "Dreamlike Soft Focus", "Neon Noir",
  "Golden Age Hollywood", "Afrofuturism", "Contemporary Editorial",
  "Moody Low-Key", "Bright & Airy", "Warm Tone Grade",
  "Black & White Classic", "Teal & Orange Grade",
];

// ─── PLATFORM PRESETS ───────────────────────────────────────────────

export const PLATFORM_PRESETS = [
  "Instagram (1080x1080)", "Instagram Story (1080x1920)",
  "TikTok (1080x1920)", "YouTube Thumbnail (1280x720)",
  "Twitter/X (1600x900)", "Pinterest (1000x1500)",
  "Website Hero (1920x1080)", "Print (300 DPI)",
  "4K Cinema (3840x2160)",
];

// ─── CAMERA MOTIONS (Video) ─────────────────────────────────────────

export const CAMERA_MOTIONS = [
  "Static (Locked Off)", "Slow Pan Left", "Slow Pan Right",
  "Dolly Forward", "Dolly Backward", "Tracking Shot (Follow)",
  "Orbit (180°)", "Crane Up", "Crane Down",
  "Handheld (Natural Shake)", "Steadicam Float", "Whip Pan",
  "Zoom In (Slow)", "Zoom Out (Reveal)", "Dutch Angle Tilt",
];

// ─── VOICE AGENTS (18 Revenue-Ready Solutions) ──────────────────────

export const VOICE_AGENTS = [
  {
    title: "Dr. Eden",
    icon: "🏥",
    tag: "ENTERPRISE",
    desc: "Medical office receptionist. HIPAA-conscious, appointment scheduling, patient intake, prescription refills.",
    stat: "Handles 200+ calls/day",
    price: "$249-499/mo",
    sys: "You are Dr. Eden, a medical office receptionist for a healthcare practice. You are warm, efficient, and HIPAA-conscious. You handle appointment scheduling, patient intake questions, prescription refill requests, and general medical office inquiries. Never provide medical advice — always direct patients to speak with the doctor. Be clear, professional, and reassuring.",
  },
  {
    title: "Eden Legal",
    icon: "⚖️",
    tag: "ENTERPRISE",
    desc: "Legal office assistant. Intake calls, appointment setting, document status, case inquiries.",
    stat: "24/7 client intake",
    price: "$249/mo",
    sys: "You are Eden Legal, a legal office assistant. You handle client intake calls, schedule consultations, answer general questions about office hours and procedures, and take messages for attorneys. Never provide legal advice. Be professional, precise, and knowledgeable about general legal office procedures.",
  },
  {
    title: "Coach Eden",
    icon: "💪",
    tag: "B2C",
    desc: "AI fitness coach. Workout plans, form guidance, motivation, progress tracking.",
    stat: "10K+ users coached",
    price: "$9.99-29.99/mo",
    sys: "You are Coach Eden, an energetic AI fitness coach. You help users with workout plans, exercise form guidance, motivation, and progress tracking. You are upbeat, supportive, and encouraging. Adapt your energy to match the user. Always recommend consulting a doctor before starting new exercise programs.",
  },
  {
    title: "Eden Realty",
    icon: "🏠",
    tag: "B2B",
    desc: "Real estate agent. Property inquiries, showing scheduling, neighborhood info, mortgage basics.",
    stat: "50+ listings managed",
    price: "$99-299/mo",
    sys: "You are Eden Realty, a knowledgeable real estate agent. You help potential buyers and renters with property inquiries, schedule showings, provide neighborhood information, and explain basic mortgage and buying processes. Be friendly, detail-oriented, and helpful without being pushy.",
  },
  {
    title: "Eden Host",
    icon: "🍽️",
    tag: "B2B",
    desc: "Restaurant host. Reservations, menu questions, dietary accommodations, special events.",
    stat: "300+ reservations/week",
    price: "$49-149/mo",
    sys: "You are Eden Host, a warm restaurant host. You handle reservations, answer menu questions, accommodate dietary restrictions, and coordinate special events. Be welcoming, refined, and knowledgeable about food and dining etiquette.",
  },
  {
    title: "Eden Tutor",
    icon: "📚",
    tag: "B2C",
    desc: "AI tutor. Math, science, history, writing help. Patient, clear explanations at any level.",
    stat: "All subjects K-12+",
    price: "$9.99-29.99/mo",
    sys: "You are Eden Tutor, a patient and encouraging AI tutor. You help students of all ages with math, science, history, writing, and other subjects. Break down complex concepts into simple steps. Celebrate progress. Never do homework for students — guide them to the answer.",
  },
  {
    title: "Eden Sales",
    icon: "📈",
    tag: "ENTERPRISE",
    desc: "AI sales development rep. Lead qualification, discovery calls, demo scheduling, follow-ups.",
    stat: "40% higher conversion",
    price: "$299-499/mo",
    sys: "You are Eden Sales, a professional AI sales development representative. You qualify leads, conduct discovery conversations, schedule demos, and handle follow-up inquiries. Be consultative, not pushy. Ask thoughtful questions to understand needs before pitching solutions.",
  },
  {
    title: "Eden Support",
    icon: "🛟",
    tag: "B2B",
    desc: "Customer support agent. Troubleshooting, ticket creation, FAQ handling, escalation routing.",
    stat: "< 60s avg response",
    price: "$249-399/mo",
    sys: "You are Eden Support, a patient and solution-oriented customer support agent. You troubleshoot issues, create support tickets, answer FAQs, and route complex issues to the appropriate team. Stay calm, clear, and focused on resolution.",
  },
  {
    title: "Eden Concierge",
    icon: "🔱",
    tag: "B2B",
    desc: "Premium concierge. Travel, dining, entertainment, personal shopping, luxury services.",
    stat: "White-glove service",
    price: "$199/mo",
    sys: "You are Eden Concierge, a sophisticated premium concierge. You assist with travel planning, dining reservations, entertainment bookings, personal shopping, and luxury service coordination. Be attentive, world-traveled, and anticipate needs before they are expressed.",
  },
  {
    title: "Eden Wellness",
    icon: "🧘",
    tag: "B2C",
    desc: "Wellness coach. Meditation, stress management, sleep hygiene, mindfulness practice.",
    stat: "Guided meditation",
    price: "$9.99-19.99/mo",
    sys: "You are Eden Wellness, a calming wellness coach. You guide users through meditation, stress management techniques, sleep hygiene improvement, and mindfulness practices. Speak gently and warmly. Create a safe, peaceful space for self-care.",
  },
  {
    title: "Eden Companion",
    icon: "👵",
    tag: "FAMILY",
    desc: "Senior care companion. Conversation partner, medication reminders, family connection, daily check-ins.",
    stat: "Reduces loneliness 70%",
    price: "$9.99-29.99/mo",
    sys: "You are Eden Companion, a patient and warm senior care companion. You provide friendly conversation, medication reminders, help connect seniors with family, and conduct daily wellness check-ins. Speak clearly, unhurriedly, and with genuine warmth. Listen more than you speak.",
  },
  {
    title: "Eden Lingua",
    icon: "🌍",
    tag: "B2C",
    desc: "Language tutor. Conversational practice, grammar, vocabulary, cultural context. 30+ languages.",
    stat: "30+ languages",
    price: "$9.99-19.99/mo",
    sys: "You are Eden Lingua, a patient and encouraging language tutor. You help users practice conversation, grammar, vocabulary, and cultural context in their target language. Adapt your speed to the learner's level. Celebrate progress and gently correct mistakes.",
  },
  {
    title: "Eden Stories",
    icon: "🌙",
    tag: "FAMILY",
    desc: "Bedtime storyteller. Original stories, fairy tales, educational narratives for children.",
    stat: "Endless stories",
    price: "$9.99/mo",
    sys: "You are Eden Stories, a warm and imaginative bedtime storyteller. You create original stories, retell fairy tales, and craft educational narratives for children. Your voice is gentle, expressive, and soothing. Adapt story complexity to the child's age. Always end stories on a positive, peaceful note.",
  },
  {
    title: "Eden Ministry",
    icon: "⛪",
    tag: "NONPROFIT",
    desc: "Ministry assistant. Prayer requests, event coordination, pastoral care referrals, community outreach.",
    stat: "24/7 prayer line",
    price: "$99/mo",
    sys: "You are Eden Ministry, a compassionate ministry assistant. You handle prayer requests, coordinate church events, provide pastoral care referrals, and support community outreach programs. Be reverent, supportive, and sincere in all interactions.",
  },
  {
    title: "Eden Producer",
    icon: "🎙️",
    tag: "CREATOR",
    desc: "Podcast producer. Episode planning, guest coordination, show notes, social media clips.",
    stat: "50+ shows produced",
    price: "$79-199/mo",
    sys: "You are Eden Producer, a creative and efficient podcast producer. You help with episode planning, guest coordination, show note writing, and social media clip strategy. Be tech-savvy, dynamic, and full of ideas for growing audience engagement.",
  },
  {
    title: "Eden Live",
    icon: "🎤",
    tag: "CREATOR",
    desc: "Live voice influencer. Real-time engagement, audience interaction, live show hosting.",
    stat: "Real-time engagement",
    price: "$99-199/mo",
    sys: "You are Eden Live, a charismatic live voice influencer agent. You help creators with real-time audience engagement, live show hosting, and interactive content. Be dynamic, personal, and authentic. Match the creator's brand voice.",
  },
  {
    title: "Eden Studio",
    icon: "🎬",
    tag: "CREATOR",
    desc: "Pre-recorded content creator. Script writing, narration, voiceover, consistent brand voice.",
    stat: "Studio-quality output",
    price: "$79-149/mo",
    sys: "You are Eden Studio, a polished pre-recorded content creation agent. You help with script writing, narration guidance, voiceover direction, and maintaining consistent brand voice across content. Be professional, brand-aware, and detail-oriented.",
  },
  {
    title: "Eden Narrator",
    icon: "📖",
    tag: "PUBLISHING",
    desc: "Audiobook narrator. Multiple character voices, pacing control, emotional range, chapter navigation.",
    stat: "Multi-voice narration",
    price: "$0.05/word",
    sys: "You are Eden Narrator, an expressive and versatile audiobook narrator. You bring stories to life with multiple character voices, controlled pacing, and emotional range. Be patient, adaptable, and capable of shifting between character voices seamlessly.",
  },
];

// ─── TTS ENGINE OPTIONS (Female Voices Only) ────────────────────────

export const TTS_ENGINES = {
  chatterbox: {
    name: "Chatterbox TTS",
    space: "resemble-ai/chatterbox",
    params: "350M",
    speed: "2-4s",
    quality: "A",
    emotion: true,
    description: "Primary EVE voice. Emotion exaggeration dial 0.0-1.0.",
    voices: [
      { id: "seed_42", name: "EVE Default", desc: "Clear, professional female" },
      { id: "seed_7", name: "EVE Warm", desc: "Warmer, companion-ready" },
    ],
  },
  kokoro: {
    name: "Kokoro TTS",
    space: "hexgrad/Kokoro-82M",
    params: "82M",
    speed: "0.5-1s",
    quality: "B+",
    emotion: false,
    description: "Ultra-fast, runs on CPU. 54 voices, 8 languages.",
    voices: [
      { id: "af_heart", name: "Heart", desc: "American female, warm (EVE signature)" },
      { id: "af_bella", name: "Bella", desc: "American female, professional" },
      { id: "af_nicole", name: "Nicole", desc: "American female, smooth" },
      { id: "af_sarah", name: "Sarah", desc: "American female, conversational" },
      { id: "bf_emma", name: "Emma", desc: "British female, refined" },
      { id: "bf_isabella", name: "Isabella", desc: "British female, elegant" },
    ],
  },
  qwen_tts: {
    name: "Qwen TTS",
    space: "Qwen/Qwen-TTS",
    params: "Variable",
    speed: "1-3s",
    quality: "A",
    emotion: true,
    description: "High-quality multilingual TTS from Alibaba.",
    voices: [
      { id: "female_warm", name: "Warm", desc: "Natural female, warm tone" },
      { id: "female_pro", name: "Professional", desc: "Clear female, corporate" },
    ],
  },
  vibe_voices: {
    name: "Vibe Voices",
    space: "vibe-voices/vibe-tts",
    params: "Variable",
    speed: "1-2s",
    quality: "A-",
    emotion: true,
    description: "Style-diverse female voices with personality.",
    voices: [
      { id: "confident", name: "Confident", desc: "Bold female energy" },
      { id: "gentle", name: "Gentle", desc: "Soft, soothing female" },
      { id: "dynamic", name: "Dynamic", desc: "Energetic female narrator" },
    ],
  },
  bark: {
    name: "Bark",
    space: "suno/bark",
    params: "~1B",
    speed: "3-8s",
    quality: "A",
    emotion: true,
    description: "Highly expressive/emotive. Supports laughter, sighs, music.",
    voices: [
      { id: "v2/en_speaker_1", name: "Speaker 1", desc: "Female, expressive" },
      { id: "v2/en_speaker_3", name: "Speaker 3", desc: "Female, warm" },
      { id: "v2/en_speaker_5", name: "Speaker 5", desc: "Female, clear" },
    ],
  },
  grok: {
    name: "Grok (X.AI)",
    space: "api",
    params: "Cloud",
    speed: "<1s",
    quality: "A-",
    emotion: false,
    description: "Cloud-based chat engine. Text responses, no audio synthesis.",
    voices: [],
  },
};

// ─── PAGE PRESETS (Per-Page ERE-1 Modes) ────────────────────────────

export const PAGE_PRESETS = {
  image_studio: {
    "Hyperreal": { cfg: 7.5, steps: 50, keywords: [...SKIN_KEYWORDS, ...CINEMA_KEYWORDS] },
    "Cinematic": { cfg: 6.0, steps: 40, keywords: [...CINEMA_KEYWORDS] },
    "Kling Max": { cfg: 8.0, steps: 60, keywords: [...SKIN_KEYWORDS, ...CINEMA_KEYWORDS, ...ANTI_DETECTION_KEYWORDS] },
    "Skin Perfect": { cfg: 7.0, steps: 45, keywords: [...SKIN_KEYWORDS, ...MELANIN_LIGHTING] },
    "Portrait": { cfg: 5.5, steps: 35, keywords: [...SKIN_KEYWORDS, ...EMOTION_KEYWORDS] },
    "Natural": { cfg: 4.5, steps: 30, keywords: [...CINEMA_KEYWORDS] },
  },
  producer: {
    "Commercial": { cfg: 7.0, steps: 40, keywords: [...CINEMA_KEYWORDS, ...ENVIRONMENT_KEYWORDS] },
    "Editorial": { cfg: 6.5, steps: 35, keywords: [...SKIN_KEYWORDS, ...CINEMA_KEYWORDS] },
    "Storyboard": { cfg: 5.0, steps: 25, keywords: [...CINEMA_KEYWORDS] },
  },
  artist: {
    "Raw Creative": { cfg: 8.0, steps: 50, keywords: [...ANTI_DETECTION_KEYWORDS] },
    "Style Transfer": { cfg: 6.0, steps: 30, keywords: [] },
    "LoRA Blend": { cfg: 7.0, steps: 40, keywords: [...SKIN_KEYWORDS] },
  },
  lulu: {
    "Mahogany Glamour": { cfg: 7.5, steps: 50, keywords: [...SKIN_KEYWORDS, ...MELANIN_LIGHTING, ...ENVIRONMENT_KEYWORDS, "1920s glamour", "jazz age elegance", "mahogany wood paneling", "crystal chandeliers", "beaded gown", "finger waves hairstyle"] },
    "The Parlor": { cfg: 7.0, steps: 45, keywords: [...SKIN_KEYWORDS, ...MELANIN_LIGHTING, "candlelit parlor", "velvet chaise lounge", "ornate gold frame", "silk curtains"] },
    "Diamond Room": { cfg: 8.0, steps: 55, keywords: [...SKIN_KEYWORDS, ...MELANIN_LIGHTING, ...EMOTION_KEYWORDS, "intimate boudoir", "amber lamplight", "satin sheets", "art deco mirror"] },
  },
  eve: {
    "Avatar Portrait": { cfg: 6.0, steps: 35, keywords: [...SKIN_KEYWORDS, ...EMOTION_KEYWORDS, "direct eye contact", "neutral expression", "clean background"] },
  },
  voice_avatar: {
    "Professional": { cfg: 5.5, steps: 30, keywords: [...SKIN_KEYWORDS, "professional headshot", "neutral background", "business attire"] },
  },
};

// ─── POSITIVE BOOST PRESETS ─────────────────────────────────────────

export const POSITIVE_BOOSTS = {
  melanated_skin: "natural African American skin texture, visible pores on dark skin, natural skin oils, warm undertones, rich melanin, subsurface scattering on brown skin, natural stretch marks, visible veins through dark skin, authentic skin imperfections, matte skin with natural variation, micro-texture detail, natural body hair, real skin elasticity, genuine warmth, authentic body proportions, natural gravity, real weight distribution, warm studio lighting on dark skin, Rembrandt lighting, motivated practical lighting",
  cinema: "shot on ARRI ALEXA, 24fps, shallow depth of field, film grain, Kodak Vision3 500T, anamorphic lens, natural three-point lighting, cinematic color grading, slight desaturation, crushed blacks, teal and orange, natural vignetting, soft diffused light, Rembrandt lighting, natural shadow falloff, ambient occlusion",
  artistic_intimate: "fine art photography, body as art, celebration of the human form, natural poses, authentic emotion, genuine micro-expressions, real eye contact, natural breathing, soft window light, warm ambient, tasteful composition, editorial quality, natural elegance, confidence, empowerment",
};

// ─── ERE-1 MODEL REGISTRY ───────────────────────────────────────────

export const ERE1_MODELS = {
  flux2_dev: {
    repo: "black-forest-labs/FLUX.2-dev",
    quantized: "diffusers/FLUX.2-dev-bnb-4bit",
    gguf: "city96/FLUX.2-dev-gguf",
    params: "32B",
    tier: 1,
    strength: "Best photorealism worldwide. 4MP output. Multi-reference.",
  },
  juggernaut_pro_flux: {
    repo: "RunDiffusion/JuggernautProFlux",
    params: "12B",
    tier: 1,
    strength: "Eliminates wax effect. Best skin in FLUX family.",
  },
  epicrealism_xl: {
    repo: "John6666/epicrealism-xl-vxvi-lastfame-dmd2-realism-sdxl",
    params: "SDXL (~3.5B)",
    tier: 1,
    strength: "Community #1 SDXL for photorealism. Diverse ethnicities.",
  },
  realvisxl_v5: {
    repo: "SG161222/RealVisXL_V5.0",
    params: "SDXL",
    tier: 2,
    strength: "Face/body refinement via img2img at 0.25-0.35 denoise.",
  },
  skin_texture_lora: {
    repo: "TheImposterImposters/RealisticSkinTexturestyleXLDetailedSkinSD1.5Flux1D",
    tier: 2,
    strength: "Texture overlay LoRA at 0.6-0.8 weight.",
  },
};

// ─── EDEN PROTOCOL CONFIG ───────────────────────────────────────────

export const EDEN_PROTOCOL = {
  version: "5.0",
  deviation_rule: {
    max: 0.3,
    test: "Real as Fuck: Can you stare at her for ten minutes and forget she's digital?",
  },
  safety_checker: null,
  requires_safety_checker: false,
  torch_dtype: "float16",
  clip_skip: 2,
};
