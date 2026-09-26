import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  // 1. Rate Limiting: 10 requests per minute per IP
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  const rateCheck = checkRateLimit(`validate-key:${clientIp}`, 10, 60_000);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { valid: false, error: "Too many key validation attempts. Please retry in a few moments." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateCheck.resetMs / 1000).toString(),
        },
      }
    );
  }

  try {
    // 2. Extract key from header first, fallback to JSON body
    let apiKey = req.headers.get("x-gemini-api-key");
    if (!apiKey) {
      try {
        const body = await req.json();
        apiKey = body?.apiKey;
      } catch {
        // Body was either empty or invalid JSON
      }
    }

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json(
        { valid: false, error: "API key is required via x-gemini-api-key header or body." },
        { status: 400 }
      );
    }

    const trimmedKey = apiKey.trim();

    // 3. Metadata-only verification (avoids consuming token quota or triggering content safety filters)
    const ai = new GoogleGenAI({ apiKey: trimmedKey });
    const modelInfo = await ai.models.get({
      model: "gemini-2.5-flash",
    });

    return NextResponse.json({
      valid: true,
      model: modelInfo?.name || "gemini-2.5-flash",
      displayName: modelInfo?.displayName || "Gemini 2.5 Flash",
      timestamp: Date.now(),
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-gemini-api-key",
    },
  });
}
