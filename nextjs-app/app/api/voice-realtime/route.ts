import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════
// GROK REALTIME VOICE — Ephemeral Token Generator
// Creates short-lived tokens for browser-side WebSocket connections
// to wss://api.x.ai/v1/realtime
// ═══════════════════════════════════════════════════════════════════

export async function POST() {
  try {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "XAI API key not configured" }, { status: 500 });
    }

    const res = await fetch("https://api.x.ai/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        expires_after: { seconds: 300 }, // 5-minute token
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      // If ephemeral tokens not available, fall back to direct key approach
      // (for development only — production should always use ephemeral tokens)
      if (res.status === 404 || res.status === 400) {
        return NextResponse.json({
          token: apiKey,
          fallback: true,
          expires_at: Date.now() + 300000,
        });
      }
      return NextResponse.json({ error: `xAI ${res.status}: ${errText.slice(0, 200)}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      token: data.client_secret?.value || data.token || data.secret,
      expires_at: data.client_secret?.expires_at || Date.now() + 300000,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
