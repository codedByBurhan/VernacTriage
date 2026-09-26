import { NextRequest, NextResponse } from "next/server";
import { analyzeWithGemini } from "@/lib/gemini";
import { alignTokenSpans } from "@/lib/span-aligner";
import { runDeterministicVerification } from "@/lib/verifier";
import { TriageAnalysisResult } from "@/lib/types";
import { DEMO_PRESETS } from "@/data/presets";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  // 1. Rate Limiting: 30 requests per minute per IP
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  const rateCheck = checkRateLimit(`triage:${clientIp}`, 30, 60_000);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "RATE_LIMIT_EXCEEDED", message: "Too many triage requests. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateCheck.resetMs / 1000).toString(),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { text, mode = "demo" } = body;

    // 2. Validate input
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "Please provide a non-empty text string to analyze." },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: "TEXT_TOO_LONG", message: "Text exceeds maximum allowed length of 1000 characters." },
        { status: 400 }
      );
    }

    const customKey = req.headers.get("x-gemini-api-key")?.trim() || "";
    const apiKey = customKey || process.env.GEMINI_API_KEY?.trim() || "";

    const normalizedText = text.trim();
    const cleanInput = normalizedText.toLowerCase().replace(/[^a-z0-9]/g, "");
    const matchingPreset = DEMO_PRESETS.find((p) => {
      const cleanPreset = p.text.toLowerCase().replace(/[^a-z0-9]/g, "");
      return (
        p.text.toLowerCase().trim() === normalizedText.toLowerCase() ||
        cleanPreset === cleanInput ||
        cleanInput.includes(cleanPreset) ||
        cleanPreset.includes(cleanInput)
      );
    });

    const isLive = mode === "live";

    // Mode A: Demo / Mock Mode
    if (!isLive) {
      if (matchingPreset) {
        // Return precomputed static payload with simulated realistic processing delay (~250ms)
        await new Promise((resolve) => setTimeout(resolve, 250));
        return NextResponse.json(
          {
            ...matchingPreset.expectedResult,
            model_source: "demo-fallback",
          },
          { status: 200 }
        );
      }

      // If demo mode was requested with custom text not matching any precomputed scenario
      return NextResponse.json(
        {
          error: "DEMO_PRESET_NOT_FOUND",
          message:
            "Demo mode only supports precomputed scenarios. Please select a preset scenario from the menu, or configure a Gemini API key to run live inferences on custom text.",
        },
        { status: 400 }
      );
    }

    // Mode B: Live Mode
    if (isLive && !apiKey) {
      return NextResponse.json(
        {
          error: "MISSING_API_KEY",
          message: "No Gemini API key provided. Add your key in the header to run live queries.",
        },
        { status: 401 }
      );
    }

    // 3. Call Gemini with custom key
    const baseAnalysis = await analyzeWithGemini(text, apiKey);

    // 4. Run deterministic span aligner
    const spanResult = alignTokenSpans(text, baseAnalysis.tokens);

    // 5. Run deterministic verifier
    const verification = runDeterministicVerification(
      text,
      {
        ...baseAnalysis,
        tokens: spanResult.tokens,
      },
      spanResult
    );

    // 6. Inject verification report
    const result: TriageAnalysisResult = {
      ...baseAnalysis,
      tokens: spanResult.tokens,
      verification,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    if (err.code === "MISSING_API_KEY" || err.status === 401) {
      return NextResponse.json(
        {
          error: "MISSING_API_KEY",
          message: err.message || "No Gemini API key provided. Add your key in the header to run live queries.",
        },
        { status: 401 }
      );
    }

    if (err.code === "QUOTA_EXCEEDED" || err.status === 429) {
      return NextResponse.json(
        {
          error: "QUOTA_EXCEEDED",
          message: "Gemini quota exhausted. Provide a personal key or use preset demo mode.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: err.code || "ANALYSIS_FAILED",
        message: err.message || "An error occurred during linguistic triage analysis.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "METHOD_NOT_ALLOWED", message: "Only POST requests are supported for linguistic analysis." },
    { status: 405 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-gemini-api-key",
    },
  });
}
