import { NextRequest, NextResponse } from "next/server";
import { analyzeWithGemini } from "@/lib/gemini";
import { alignTokenSpans } from "@/lib/span-aligner";
import { runDeterministicVerification } from "@/lib/verifier";
import { TriageAnalysisResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    // 1. Validate input
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid input: Please provide a non-empty text string to analyze." },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: "Text exceeds maximum allowed length of 1000 characters." },
        { status: 400 }
      );
    }

    // 2 & 3. Call Gemini exactly once & Parse structured output
    const baseAnalysis = await analyzeWithGemini(text);

    // 4. Run deterministic span aligner (TypeScript-only, rolling cursor, never relies on LLM)
    const spanResult = alignTokenSpans(text, baseAnalysis.tokens);

    // 5. Run deterministic verifier (Invariant assertions, deterministic 0-100 score, audit logs)
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

    // 7. Return final response
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("API /api/triage error:", err);
    return NextResponse.json(
      {
        error: err.message || "An error occurred during linguistic triage analysis.",
      },
      { status: 500 }
    );
  }
}
