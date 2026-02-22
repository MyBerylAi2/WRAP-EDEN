import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";
import { IMAGE_BACKENDS, EDEN_PRESETS, buildSmartNegative, injectPositiveKeywords } from "@/lib/data";

// ─── Smart step selection based on backend capability ───
// Z-Image Turbo: 4-12 steps (distilled, fast)
// FLUX.1/2: 20-50 steps (full diffusion)
// epiCRealism XL / Juggernaut: 30-60 steps (SDXL, max quality)
// CogView4: 25-40 steps
function getOptimalSteps(spaceId: string, requestedSteps?: number): number {
  if (requestedSteps && requestedSteps > 0) return requestedSteps;

  if (spaceId.includes("Z-Image") || spaceId.includes("Tongyi")) return 8;
  if (spaceId.includes("epicrealism") || spaceId.includes("Juggernaut")) return 50;
  if (spaceId.includes("FLUX.2")) return 40;
  if (spaceId.includes("FLUX.1")) return 35;
  if (spaceId.includes("CogView")) return 30;
  if (spaceId.includes("eden-diffusion")) return 45;
  return 30; // safe default
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, preset, backend, resolution, steps, seed, randomSeed, enhance, negative, mode } = body;

    // ERE-1: Inject positive keywords based on prompt content + mode
    // Keywords are appended AFTER user prompt to preserve user's specific attributes
    let fullPrompt = injectPositiveKeywords(prompt, mode || "image_studio", preset);
    const presetText = EDEN_PRESETS[preset as keyof typeof EDEN_PRESETS] || "";
    if (presetText) fullPrompt = `${fullPrompt}, ${presetText}`;
    if (enhance) fullPrompt = `(masterpiece, best quality, extremely detailed, raw photo), ${fullPrompt}`;

    // ERE-1: Smart Negative Engine — auto-detects subject and injects conditionals
    const fullNeg = buildSmartNegative(prompt, negative || undefined);

    const spaceId = IMAGE_BACKENDS[backend as keyof typeof IMAGE_BACKENDS] || "Tongyi-MAI/Z-Image-Turbo";
    const actualSeed = randomSeed ? Math.floor(Math.random() * 2 ** 32) : seed;
    const optimalSteps = getOptimalSteps(spaceId, steps);

    const client = await Client.connect(spaceId);

    // ═══ Z-IMAGE TURBO PATH ═══
    if (spaceId.includes("Z-Image") || spaceId.includes("Tongyi")) {
      const result = await client.predict("/Z_Image_Turbo_generate", {
        prompt: fullPrompt,
        resolution: resolution || "1024x1024 ( 1:1 )",
        random_seed: randomSeed,
        seed: actualSeed,
        steps: optimalSteps,
        shift: 3.0,
      });

      const data = result.data as unknown[];
      if (Array.isArray(data) && data.length > 0) {
        const gallery = data[0];
        if (Array.isArray(gallery) && gallery.length > 0) {
          const img = gallery[gallery.length - 1];
          const url = typeof img === "string" ? img : (img as Record<string, unknown>)?.image || (img as Record<string, unknown>)?.url || (img as Record<string, unknown>)?.path;
          return NextResponse.json({ image: url, seed: data[2] || actualSeed, steps: optimalSteps, backend: "Z-Image Turbo" });
        }
      }
      return NextResponse.json({ error: "No image in result" }, { status: 500 });
    }

    // ═══ FLUX / SDXL / COGVIEW — Full realism path ═══
    // These models support negative prompts and higher step counts
    try {
      const result = await client.predict("/predict", [fullPrompt, fullNeg]);
      const data = result.data;
      if (typeof data === "string") {
        return NextResponse.json({ image: data, seed: actualSeed, steps: optimalSteps, backend: backend || "FLUX" });
      }
      // Some spaces return arrays or objects
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const url = typeof item === "string" ? item : (item as Record<string, unknown>)?.image || (item as Record<string, unknown>)?.url || (item as Record<string, unknown>)?.path;
        if (url) {
          return NextResponse.json({ image: url, seed: actualSeed, steps: optimalSteps, backend: backend || "FLUX" });
        }
      }
    } catch {
      // Some spaces use different endpoint names — try alternatives
      try {
        const result = await client.predict("/generate", { prompt: fullPrompt, negative_prompt: fullNeg, num_inference_steps: optimalSteps, seed: actualSeed });
        const data = result.data;
        const url = typeof data === "string" ? data : Array.isArray(data) ? (typeof data[0] === "string" ? data[0] : (data[0] as Record<string, unknown>)?.url || (data[0] as Record<string, unknown>)?.path) : null;
        if (url) return NextResponse.json({ image: url, seed: actualSeed, steps: optimalSteps, backend: backend || "alt" });
      } catch {
        // Final fallback
      }
    }

    return NextResponse.json({ error: "No image generated — try a different backend" }, { status: 500 });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
