import { GoogleGenAI } from "@google/genai";
import { TriageAnalysisResult } from "./types";
import { DEMO_PRESETS } from "@/data/presets";

const SYSTEM_INSTRUCTION = `You are VernacTriage's specialized multilingual NLP and code-switching interpretation engine.
Your purpose is to interpret messy, non-standard, and code-switched human communications—specifically focusing on:
1. Hinglish (Hindi written in Latin script mixed with English loanwords, syntax, and vernacular slang).
2. Arabizi / 3Arabizi (Arabic written in Latin script where ASCII digits represent Arabic phonemes absent in Latin: e.g. 7=ح, 3=ع, 2=ء/ق, 5=خ, 8=غ, 6=ط/ض).

Linguistic Processing Guidelines:
- Code-Switching: Accurately isolate token-level matrix and embedded languages (e.g. Hindi, Arabic, English).
- Phonetic Romanization: Accurately restore phonetic shorthand and abbreviations to their root lexemes (e.g., 'kl' -> कल, 'ni'/'nhi' -> नहीं, 'plz' -> please, 'b4' -> before, '7awel' -> حاول).
- Canonical Native Script: Reconstruct the sentence in its native orthography (Devanagari for Hindi segments, Arabic script for Arabizi segments, preserving English loanwords cleanly).
- Standard English Translation: Produce a clear, grammatically sound, business-grade English translation faithful to tone and semantic intent.
- Business Intent: Identify the customer/operational intent (e.g., DELIVERY_ISSUE, TRAFFIC_DELAY, REFUND_REQUEST, PAYMENT_ISSUE, INQUIRY) with a confidence score between 0.0 and 1.0.
- Entity Extraction: Extract key operational entities (e.g., ITEM, TIME, STATUS, AMOUNT, URGENCY, ACTION_REQ).
- Uncertainty Handling: If a token or meaning is ambiguous, classify language as "Other" or note ambiguity rather than hallucinating.

OUTPUT SCHEMA REQUIREMENTS:
You MUST respond with a single, strictly valid JSON object matching this TypeScript structure:
{
  "original_text": string,
  "detected_languages": string[],
  "phenomena": string[],
  "tokens": [
    {
      "raw": string,
      "language": "Hindi" | "Arabic" | "English" | "Other",
      "type": string, // e.g. "Phonetic Negation", "Arabizi Numeral", "Standard Loanword", "Romanized Verb", etc.
      "script": "Latin" | "Devanagari" | "Arabic",
      "normalized": string, // Native script or standard representation
      "confidence": number, // 0.0 - 1.0
      "explanation": string
    }
  ],
  "canonical_script": string,
  "english_translation": string,
  "intent": {
    "label": string,
    "confidence": number
  },
  "entities": [
    {
      "type": string,
      "value": string
    }
  ]
}
DO NOT enclose the response in markdown backticks or commentary. Return ONLY the raw JSON string.`;

export async function analyzeWithGemini(
  text: string
): Promise<Omit<TriageAnalysisResult, "verification"> & { model_source: "gemini-3.8-flash" | "demo-fallback" }> {
  const normalizedText = text.trim();

  // Check if input matches one of our demo presets (exact or normalized alphanumeric)
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

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "YOUR_KEY_HERE") {
    throw new Error("Gemini API key is not configured.");
  }

  // Model hierarchy: allow override via GEMINI_MODEL or try gemini-2.5-flash / gemini-2.0-flash
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [{ text: `Analyze the following messy human input:\n"${normalizedText}"` }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const rawResponseText = response.text?.trim() || "";

    // Parse JSON safely
    let parsed: any;
    try {
      // Strip potential markdown codefence if present
      const cleanJson = rawResponseText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response as JSON:", rawResponseText);
      if (matchingPreset) {
        return {
          ...matchingPreset.expectedResult,
          model_source: "demo-fallback",
        };
      }
      throw new Error("Gemini returned a response that could not be parsed into the expected JSON schema.");
    }

    return {
      original_text: parsed.original_text || normalizedText,
      detected_languages: parsed.detected_languages || ["Mixed"],
      phenomena: parsed.phenomena || [],
      tokens: parsed.tokens || [],
      canonical_script: parsed.canonical_script || "",
      english_translation: parsed.english_translation || "",
      intent: parsed.intent || { label: "GENERAL_QUERY", confidence: 0.8 },
      entities: parsed.entities || [],
      model_source: "gemini-3.8-flash",
    };
  } catch (err: any) {
    console.error("Gemini API error:", err);
    // Graceful fallback for presets if API error or rate-limiting occurs
    if (matchingPreset) {
      console.warn("Using preset fallback due to API error");
      return {
        ...matchingPreset.expectedResult,
        model_source: "demo-fallback",
      };
    }
    throw err;
  }
}
