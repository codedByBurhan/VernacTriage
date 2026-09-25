import { NextRequest, NextResponse } from "next/server";
import { analyzeWithGemini } from "@/lib/gemini";
import { runDeterministicVerification } from "@/lib/verification";
import { TriageAnalysisResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

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

    // 1. Analyze with Gemini (with demo preset fallback if key missing or network fails)
    const baseAnalysis = await analyzeWithGemini(text);

    // 2. Deterministic Verification Layer
    const verification = runDeterministicVerification(text, baseAnalysis);

    // 3. Assemble Final Structured Output
    const result: TriageAnalysisResult = {
      ...baseAnalysis,
      verification,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("API /api/analyze error:", err);
    return NextResponse.json(
      {
        error: err.message || "An error occurred during linguistic triage analysis.",
      },
      { status: 500 }
    );
  }
}
