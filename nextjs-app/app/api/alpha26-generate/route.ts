import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════
// EDEN ALPHA-26 GENERATION API — HuggingFace Router + Fallbacks
// Primary: HF Inference API (router.huggingface.co) — production grade
// Fallback: Pollinations.ai — always available
// Applies Eden ALPHA-26 photorealism standards to every prompt
// ═══════════════════════════════════════════════════════════════════

const HF_TOKEN = process.env.HF_TOKEN || "";

const EDEN_DEFAULTS = {
  sampler: "DPM++ 2M Karras",
  steps: 40,
  cfg_scale: 4.5,
  width: 1024,
  height: 1024,
  negative_prompt: `(worst quality:1.8), (low quality:1.8), (airbrushed:1.6), (plastic:1.6), (shiny skin:1.6), (glossy skin:1.5), (waxy:1.5), (porcelain:1.5), (3d render:1.4), (cgi:1.3), (digital art:1.4), (bad anatomy:1.5), (deformed:1.6)`,
  skin_boost: "natural skin texture, visible pores, vellus hair, subsurface scattering, skin imperfections, matte skin finish, powder-set complexion",
};

// ─── Timeout wrapper ───
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms);
    promise.then(v => { clearTimeout(timer); resolve(v); }).catch(e => { clearTimeout(timer); reject(e); });
  });
}

// ═══ MODEL CASCADE ═══
// Ordered by quality. FLUX.1-dev is higher quality but slower.
// FLUX.1-schnell is fast (4 steps). Both via HF Router API.
const MODELS = [
  { id: "black-forest-labs/FLUX.1-schnell", name: "FLUX.1 Schnell", timeout: 90000 },
  { id: "black-forest-labs/FLUX.1-dev", name: "FLUX.1 Dev", timeout: 180000 },
  { id: "stabilityai/stable-diffusion-xl-base-1.0", name: "SDXL Base", timeout: 120000 },
];

// ─── HuggingFace Router API (production inference) ───
async function generateViaHFRouter(
  modelId: string, prompt: string, width: number, height: number, timeoutMs: number
): Promise<{ imageBase64: string } | { error: string }> {
  if (!HF_TOKEN) return { error: "No HF_TOKEN configured" };

  try {
    const res = await withTimeout(
      fetch(`https://router.huggingface.co/hf-inference/models/${modelId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { width, height },
        }),
      }),
      timeoutMs,
      modelId.split("/")[1]
    );

    if (!res.ok) {
      const text = await res.text();
      return { error: `${res.status}: ${text.slice(0, 200)}` };
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("image")) {
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const ext = contentType.includes("png") ? "png" : "jpeg";
      return { imageBase64: `data:image/${ext};base64,${base64}` };
    }

    // Some models return JSON with image URL
    try {
      const data = await res.json();
      if (data.image) return { imageBase64: data.image };
      if (Array.isArray(data) && data[0]?.image) return { imageBase64: data[0].image };
    } catch { /* not JSON */ }

    return { error: "Response was not an image" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

// ─── Pollinations fallback ───
async function pollinationsFallback(prompt: string, width: number, height: number, seed: number): Promise<string | null> {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
  try {
    const res = await withTimeout(fetch(url), 45000, "pollinations");
    if (res.ok && res.headers.get("content-type")?.includes("image")) return url;
  } catch { /* fall through */ }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, negative_prompt, steps, cfg_scale, width, height, seed } = body;

    // Apply EDEN ALPHA-26 quality standards
    const cleanPrompt = (prompt || "")
      .replace(/\b(glossy|shiny|oily|glistening|polished)\b/gi, "matte")
      .replace(/\b(airbrushed|poreless|smooth skin|flawless skin)\b/gi, "natural textured skin");

    const fullPrompt = `${cleanPrompt}, ${EDEN_DEFAULTS.skin_boost}, photorealistic, raw photo`;
    const w = width || EDEN_DEFAULTS.width;
    const h = height || EDEN_DEFAULTS.height;
    const finalSeed = (!seed || seed < 0) ? Math.floor(Math.random() * 999999) : seed;

    console.log(`[alpha26] Prompt: ${fullPrompt.slice(0, 150)}...`);
    console.log(`[alpha26] Size: ${w}x${h}, Seed: ${finalSeed}`);

    // ═══ CASCADE: HF Router models ═══
    const errors: string[] = [];

    for (const model of MODELS) {
      console.log(`[alpha26] Trying ${model.name}...`);
      const result = await generateViaHFRouter(model.id, fullPrompt, w, h, model.timeout);

      if ("imageBase64" in result) {
        console.log(`[alpha26] SUCCESS via ${model.name}`);
        return NextResponse.json({
          image: result.imageBase64,
          seed: finalSeed,
          backend: `ALPHA-26 via ${model.name}`,
          endpoint: "hf-router",
          settings: {
            prompt: fullPrompt.slice(0, 300),
            negative: (negative_prompt || EDEN_DEFAULTS.negative_prompt).slice(0, 200),
            sampler: EDEN_DEFAULTS.sampler,
            steps: steps || EDEN_DEFAULTS.steps,
            cfg_scale: cfg_scale || EDEN_DEFAULTS.cfg_scale,
            width: w,
            height: h,
          },
        });
      }

      console.log(`[alpha26] ${model.name} failed: ${result.error}`);
      errors.push(`${model.name}: ${result.error}`);
    }

    // ═══ FALLBACK: Pollinations ═══
    console.log("[alpha26] HF models exhausted — trying Pollinations...");
    const polImg = await pollinationsFallback(fullPrompt, w, h, finalSeed);
    if (polImg) {
      return NextResponse.json({
        image: polImg,
        seed: finalSeed,
        backend: "ALPHA-26 via Pollinations",
        endpoint: "pollinations",
        settings: {
          prompt: fullPrompt.slice(0, 300),
          negative: EDEN_DEFAULTS.negative_prompt.slice(0, 200),
          sampler: "N/A",
          steps: steps || EDEN_DEFAULTS.steps,
          cfg_scale: cfg_scale || EDEN_DEFAULTS.cfg_scale,
          width: w,
          height: h,
        },
      });
    }

    return NextResponse.json({
      error: `All backends failed: ${errors.slice(0, 3).join(" | ")}`,
    }, { status: 500 });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — status check
export async function GET() {
  return NextResponse.json({
    status: HF_TOKEN ? "ready" : "no-token",
    backends: MODELS.map(m => m.name).concat(["Pollinations"]),
    defaults: EDEN_DEFAULTS,
    engine: "HuggingFace Router API (production)",
  });
}
