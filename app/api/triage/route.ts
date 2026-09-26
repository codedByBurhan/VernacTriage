import { NextRequest, NextResponse } from "next/server";
import { analyzeWithGemini } from "@/lib/gemini";
import { alignTokenSpans } from "@/lib/span-aligner";
import { runDeterministicVerification } from "@/lib/verifier";
import { TriageAnalysisResult } from "@/lib/types";
import { DEMO_PRESETS } from "@/data/presets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, mode = "demo" } = body;

    // 1. Validate input
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
        // Return precomputed static payload with realistic latency (~350ms)
        await new Promise((resolve) => setTimeout(resolve, 350));
        return NextResponse.json(
          {
            ...matchingPreset.expectedResult,
            model_source: "demo-fallback",
          },
          { status: 200 }
        );
      }
      // If demo mode but custom text, check if API key exists to serve live, otherwise return fallback
      if (!apiKey) {
        // Return default preset with notice
        const defaultPreset = DEMO_PRESETS[3]; // homograph_collision
        return NextResponse.json(
          {
            ...defaultPreset.expectedResult,
            original_text: normalizedText,
            model_source: "demo-fallback",
          },
          { status: 200 }
        );
      }
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

    // 2. Call Gemini with custom key
    const baseAnalysis = await analyzeWithGemini(text, apiKey, isLive);

    // 3. Run deterministic span aligner
    const spanResult = alignTokenSpans(text, baseAnalysis.tokens);

    // 4. Run deterministic verifier
    const verification = runDeterministicVerification(
      text,
      {
        ...baseAnalysis,
        tokens: spanResult.tokens,
      },
      spanResult
    );

    // 5. Inject verification report
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
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-gemini-api-key",
    },
  });
}
