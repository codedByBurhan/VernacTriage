import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json(
        { valid: false, error: "API key is required." },
        { status: 400 }
      );
    }

    const trimmedKey = apiKey.trim();

    // Lightweight ping to verify the key
    const ai = new GoogleGenAI({ apiKey: trimmedKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "ping",
    });

    if (response && response.text) {
      return NextResponse.json({
        valid: true,
        model: "gemini-2.5-flash",
        timestamp: Date.now(),
      });
    }

    return NextResponse.json({
      valid: true,
      model: "gemini-2.5-flash",
    });
  } catch (err: any) {
    let errorMessage = err.message || "Failed to validate Gemini API key.";
    try {
      const parsed = JSON.parse(errorMessage);
      if (parsed?.error?.message) {
        errorMessage = parsed.error.message;
      }
    } catch {}

    return NextResponse.json(
      {
        valid: false,
        error: errorMessage,
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "METHOD_NOT_ALLOWED", message: "Only POST requests are supported for key validation." },
    { status: 405 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
