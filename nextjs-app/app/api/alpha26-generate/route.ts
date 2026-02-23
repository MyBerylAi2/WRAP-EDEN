import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════
// EDEN ALPHA-26 GENERATION API
// Bridges our Next.js app to the AIBRUH/eden-diffusion-studio Space
// The Space has its own massive settings panel — we pass params through
// ═══════════════════════════════════════════════════════════════════

const SPACE_URL = "https://aibruh-eden-diffusion-studio.hf.space";
const HF_TOKEN = process.env.HF_TOKEN || "";

// EDEN ALPHA-26 DEFAULTS (from knowledge lake C01/C10)
const EDEN_DEFAULTS = {
  sampler: "DPM++ 2M Karras",
  steps: 40,
  cfg_scale: 4.5,
  width: 1024,
  height: 1024,
  negative_prompt: `(worst quality:1.8), (low quality:1.8), (airbrushed:1.6), (plastic:1.6), (shiny skin:1.6), (glossy skin:1.5), (waxy:1.5), (porcelain:1.5), (3d render:1.4), (cgi:1.3), (digital art:1.4), (bad anatomy:1.5), (deformed:1.6)`,
  skin_boost: "natural skin texture, visible pores, vellus hair, subsurface scattering, skin imperfections, matte skin finish, powder-set complexion",
};

// Timeout wrapper
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms);
    promise.then(v => { clearTimeout(timer); resolve(v); }).catch(e => { clearTimeout(timer); reject(e); });
  });
}

// Discover available endpoints from the Space
async function discoverEndpoints(): Promise<string[]> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (HF_TOKEN) headers["Authorization"] = `Bearer ${HF_TOKEN}`;

    const res = await withTimeout(
      fetch(`${SPACE_URL}/gradio_api/info`, { headers }),
      10000, "discover"
    );
    if (!res.ok) return [];
    const info = await res.json();
    return Object.keys(info.named_endpoints || {}).map(k => k.replace("/", ""));
  } catch {
    return [];
  }
}

// Call Gradio Space endpoint
async function callSpace(endpoint: string, data: unknown[], timeoutMs = 300000) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (HF_TOKEN) headers["Authorization"] = `Bearer ${HF_TOKEN}`;

  // Submit job
  const submitRes = await withTimeout(
    fetch(`${SPACE_URL}/gradio_api/call/${endpoint}`, {
      method: "POST", headers, body: JSON.stringify({ data }),
    }),
    15000, `${endpoint} submit`
  );

  if (!submitRes.ok) {
    const text = await submitRes.text();
    return { error: `Submit failed (${submitRes.status}): ${text.slice(0, 300)}` };
  }

  const { event_id } = await submitRes.json();
  if (!event_id) return { error: "No event_id returned" };

  // Poll SSE for result
  const resultRes = await withTimeout(
    fetch(`${SPACE_URL}/gradio_api/call/${endpoint}/${event_id}`, {
      headers: HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {},
    }),
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
      return { error: dataLine?.slice(6)?.trim() || "Space returned error" };
    }
  }

  return { error: "No result from Space" };
}

// Extract image URL from result
function extractImageUrl(data: unknown[]): string | null {
  for (const item of data) {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const obj = item as Record<string, unknown>;
      const url = (obj.url || obj.path) as string | undefined;
      if (url) return url.startsWith("http") ? url : `${SPACE_URL}/gradio_api/file=${url}`;
      // Gallery format
      if (Array.isArray(obj.value)) {
        for (const v of obj.value) {
          if (v && typeof v === "object") {
            const inner = v as Record<string, unknown>;
            const imgObj = inner.image as Record<string, unknown> | undefined;
            const innerUrl = (inner.url || imgObj?.url || inner.path) as string | undefined;
            if (innerUrl) return innerUrl.startsWith("http") ? innerUrl : `${SPACE_URL}/gradio_api/file=${innerUrl}`;
          }
        }
      }
    }
    if (typeof item === "string" && (item.endsWith(".png") || item.endsWith(".jpg") || item.endsWith(".webp") || item.includes("/file="))) {
      return item.startsWith("http") ? item : `${SPACE_URL}/gradio_api/file=${item}`;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      negative_prompt,
      sampler,
      steps,
      cfg_scale,
      width,
      height,
      seed,
      endpoint, // optional — override endpoint name
    } = body;

    // Apply Eden standards to prompt
    const cleanPrompt = (prompt || "")
      .replace(/\b(glossy|shiny|oily|glistening|polished)\b/gi, "matte")
      .replace(/\b(airbrushed|poreless|smooth skin|flawless skin)\b/gi, "natural textured skin");

    const fullPrompt = `${cleanPrompt}, ${EDEN_DEFAULTS.skin_boost}, photorealistic, raw photo`;
    const fullNegative = `${negative_prompt || ""}, ${EDEN_DEFAULTS.negative_prompt}`.replace(/^,\s*/, "");

    console.log(`[alpha26] Prompt: ${fullPrompt.slice(0, 200)}`);
    console.log(`[alpha26] Settings: ${sampler || EDEN_DEFAULTS.sampler}, ${steps || EDEN_DEFAULTS.steps} steps, CFG ${cfg_scale || EDEN_DEFAULTS.cfg_scale}`);

    // Discover endpoints if needed
    const endpoints = await discoverEndpoints();
    console.log(`[alpha26] Available endpoints: ${endpoints.join(", ") || "none (Space may be starting)"}`);

    // Try known Gradio endpoint names
    const tryEndpoints = endpoint ? [endpoint] : [
      "generate", "txt2img", "run", "predict", "submit",
      ...endpoints.filter(e => !["api", "info"].includes(e)),
    ];

    // Build params — adapt to common Gradio txt2img patterns
    const paramSets = [
      // Pattern 1: Forge/A1111 style (prompt, negative, steps, sampler, cfg, seed, width, height)
      [fullPrompt, fullNegative, steps || EDEN_DEFAULTS.steps, sampler || EDEN_DEFAULTS.sampler,
       cfg_scale || EDEN_DEFAULTS.cfg_scale, seed || -1, width || EDEN_DEFAULTS.width, height || EDEN_DEFAULTS.height],
      // Pattern 2: Simple (prompt, negative, width, height, steps, cfg, seed)
      [fullPrompt, fullNegative, width || EDEN_DEFAULTS.width, height || EDEN_DEFAULTS.height,
       steps || EDEN_DEFAULTS.steps, cfg_scale || EDEN_DEFAULTS.cfg_scale, seed || -1],
      // Pattern 3: Minimal (prompt only)
      [fullPrompt],
    ];

    const errors: string[] = [];
    for (const ep of tryEndpoints) {
      for (const params of paramSets) {
        console.log(`[alpha26] Trying ${ep} with ${params.length} params...`);
        try {
          const result = await callSpace(ep, params, 300000);

          if ("error" in result) {
            errors.push(`${ep}: ${result.error}`);
            continue;
          }

          console.log(`[alpha26] ${ep} raw:`, JSON.stringify(result.data).slice(0, 500));
          const imageUrl = extractImageUrl(result.data);
          if (imageUrl) {
            return NextResponse.json({
              image: imageUrl,
              seed: seed || -1,
              backend: "EDEN ALPHA-26",
              endpoint: ep,
              settings: {
                prompt: fullPrompt.slice(0, 300),
                negative: fullNegative.slice(0, 200),
                sampler: sampler || EDEN_DEFAULTS.sampler,
                steps: steps || EDEN_DEFAULTS.steps,
                cfg_scale: cfg_scale || EDEN_DEFAULTS.cfg_scale,
                width: width || EDEN_DEFAULTS.width,
                height: height || EDEN_DEFAULTS.height,
              },
            });
          }
          errors.push(`${ep}: returned no image`);
        } catch (e) {
          errors.push(`${ep}: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    }

    return NextResponse.json({
      error: `ALPHA-26 Space: ${errors.slice(0, 3).join(" | ")}`,
      spaceUrl: SPACE_URL,
      endpoints: endpoints,
    }, { status: 500 });

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — check Space status
export async function GET() {
  try {
    const endpoints = await discoverEndpoints();
    return NextResponse.json({
      status: endpoints.length > 0 ? "ready" : "starting",
      endpoints,
      spaceUrl: SPACE_URL,
      defaults: EDEN_DEFAULTS,
    });
  } catch {
    return NextResponse.json({ status: "offline", endpoints: [] });
  }
}
