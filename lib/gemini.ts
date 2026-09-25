import { GoogleGenAI } from "@google/genai";
import { TriageAnalysisResult } from "./types";
import { DEMO_PRESETS } from "@/data/presets";

const SYSTEM_INSTRUCTION = `You are VernacTriage's specialized multilingual NLP and code-switching interpretation engine.
Your purpose is to interpret messy, non-standard, and code-switched human communications—specifically focusing on:
1. Hinglish (Hindi written in Latin script mixed with English loanwords, syntax, and vernacular slang).
2. Arabizi / 3Arabizi (Arabic written in Latin script where ASCII digits represent Arabic phonemes absent in Latin: e.g. 7=ح, 3=ع, 2=ء/ق, 5=خ, 8=غ, 6=ط/ض).

Linguistic Processing Guidelines:
- Code-Switching: Accurately isolate token-level matrix and embedded languages (e.g. "en", "hi", "ar", "mixed", "unknown").
- Token Classification: Classify each token into:
  * "standard": standard dictionary word (e.g. "parcel", "deliver", "to", "arrive")
  * "transliterated": native lexeme written in Latin letters (e.g. "bhai" -> भाई, "yalla" -> يلا, "kro" -> करो)
  * "phonetic_ear": informal phonetic spelling or abbreviation (e.g. "kl" -> कल, "ni" -> नहीं, "plz" -> please, "wrna" -> वरना)
  * "alphanumeric_sub": token containing numeric/symbolic substitutions (e.g. "7awel" -> حاول, "b3d" -> بعد, "b4" -> before, "na2es" -> ناقص)
- Cross-Lingual Collision Ledger:
  Identify genuine cases where identical Latin text could represent different languages/meanings in context:
  * Example: English pronoun "me" vs Hindi locative postposition "me / mein" (में = inside).
  * Example: English preposition "to" vs Hindi discourse marker "toh" (तो).
  * Example: Arabizi "fi" (في = in) vs English acronym/word.
  * Example: Arabizi "3an" (عن = about/from) vs misspelled English "can".
  CRITICAL: For ordinary tokens with no cross-lingual homographic ambiguity, set "collision": null.
  ONLY populate "collision" when contextual cross-lingual ambiguity genuinely exists.
- Pragmatic Register & Cultural Markers:
  Detect socio-linguistic markers such as: "bhai", "yaar", "boss", "habibi", "ya akhi", "wallah / walla", "plz", "ASAP".
  Classify tone into:
  * "Colloquial-Familiar": friendly, conversational vernacular.
  * "Pleading-Urgent": anxious, pressing request for assistance.
  * "Escalating-Hostile": aggressive, angry customer demanding immediate escalation.
  * "Formal": polite, neutral business communication.
  (Do NOT automatically classify slang as hostile).
- Negation Parity (is_negation):
  Mark is_negation: true ONLY for true negation markers (e.g. "ni", "nahi", "nhi", "mat", "la", "ma", "mesh", "mish", "not").
  CRITICAL: Discourse/confirmation particles like "na" in "Kal delivery aa jayegi na boss?" are tag particles and must have is_negation: false!
- Canonical Native Script: Reconstruct the sentence in its native orthography (Devanagari for Hindi, Arabic script for Arabizi, preserving English loanwords cleanly).
- Standard English Translation: Produce a clear, grammatically sound, business-grade English translation faithful to tone, semantics, and numerical values.
- Business Intent: Choose from standard intent taxonomy:
  DELIVERY_STATUS, DELIVERY_ISSUE, REFUND_REQUEST, CANCELLATION, ACCOUNT_ACCESS, TECHNICAL_SUPPORT, GENERAL_INQUIRY, FINANCIAL_DISPUTE, TRAFFIC_DELAY, PAYMENT_ISSUE.
- Entities: Extract key operational entities ({ "type": string, "value": string }).
- Action Dispatch: Generate a read-only structured downstream payload for automated ERP/CRM routing:
  * target_service: "LOGISTICS_SERVICE" | "PAYMENT_GATEWAY" | "CUSTOMER_SUPPORT"
  * endpoint_action: "EXPEDITE_DELIVERY" | "INITIATE_REFUND" | "FLAG_PRIORITY_ESCALATION" | "GENERAL_QUERY"
  * parameters: { reference_id?: string, priority_level: "P1" | "P2" | "P3", requires_agent_review: boolean }

COMPACT FEW-SHOT HOMOGRAPH DEMONSTRATION:
Input: "Wait for me parcel me rakh do"
Tokens interpretation:
- First "me":
  {
    "raw": "me",
    "detected_language": "en",
    "classification": "standard",
    "normalized_source": "me",
    "is_negation": false,
    "collision": null,
    "language": "English",
    "type": "Standard Pronoun",
    "script": "Latin",
    "normalized": "me",
    "confidence": 0.99,
    "explanation": "First-person English object pronoun in 'wait for me'"
  }
- Second "me":
  {
    "raw": "me",
    "detected_language": "hi",
    "classification": "transliterated",
    "normalized_source": "में",
    "is_negation": false,
    "collision": {
      "is_collision": true,
      "selected_language": "hi",
      "selected_meaning": "in / inside (locative postposition)",
      "rejected_language": "en",
      "rejected_meaning": "first-person pronoun 'me'",
      "reasoning": "Following 'parcel', 'me' represents the Hindi postposition 'में' (in/inside), directing where to place the parcel."
    },
    "language": "Hindi",
    "type": "Cross-Lingual Homograph",
    "script": "Devanagari",
    "normalized": "में",
    "confidence": 0.98,
    "explanation": "Hindi locative postposition 'mein' homographic with English 'me'"
  }

OUTPUT SCHEMA REQUIREMENTS:
You MUST respond with a single, strictly valid JSON object matching this TypeScript structure:
{
  "original_text": string,
  "detected_pair": string, // e.g. "Hinglish (Hindi-English)" or "Arabizi (Arabic-English)"
  "detected_languages": string[],
  "phenomena": string[],
  "pragmatic_register": {
    "tone": "Colloquial-Familiar" | "Pleading-Urgent" | "Escalating-Hostile" | "Formal",
    "cultural_markers": string[]
  },
  "tokens": [
    {
      "raw": string,
      "detected_language": "en" | "hi" | "ar" | "mixed" | "unknown",
      "classification": "standard" | "transliterated" | "phonetic_ear" | "alphanumeric_sub",
      "normalized_source": string,
      "is_negation": boolean,
      "collision": null | {
        "is_collision": boolean,
        "selected_language": "en" | "hi" | "ar" | "mixed" | "unknown",
        "selected_meaning": string,
        "rejected_language": "en" | "hi" | "ar" | "mixed" | "unknown",
        "rejected_meaning": string,
        "reasoning": string
      },
      "language": string,
      "type": string,
      "script": string,
      "normalized": string,
      "confidence": number,
      "explanation": string
    }
  ],
  "canonical_native_script": string,
  "standard_english": string,
  "intent": {
    "label": string,
    "confidence": number
  },
  "entities": [
    {
      "type": string,
      "value": string
    }
  ],
  "action_dispatch": {
    "target_service": "LOGISTICS_SERVICE" | "PAYMENT_GATEWAY" | "CUSTOMER_SUPPORT",
    "endpoint_action": "EXPEDITE_DELIVERY" | "INITIATE_REFUND" | "FLAG_PRIORITY_ESCALATION" | "GENERAL_QUERY",
    "parameters": {
      "reference_id": string,
      "priority_level": "P1" | "P2" | "P3",
      "requires_agent_review": boolean
    }
  }
}
DO NOT enclose the response in markdown backticks or commentary. Return ONLY the raw JSON string. Do NOT calculate character offsets (start_idx / end_idx).`;

export async function analyzeWithGemini(
  text: string
): Promise<Omit<TriageAnalysisResult, "verification"> & { model_source: "gemini-2.5-flash" | "demo-fallback" }> {
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

  // Application model configuration: gemini-2.5-flash for rock-solid stability and low latency
  const MODEL_ID = "gemini-2.5-flash";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: [
        {
          role: "user",
          parts: [{ text: `Analyze the following messy human input:\n"${normalizedText}"` }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
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

    const canonicalScript = parsed.canonical_native_script || parsed.canonical_script || "";
    const standardEnglish = parsed.standard_english || parsed.english_translation || "";

    // Normalize tokens
    const tokens = (parsed.tokens || []).map((t: any) => ({
      raw: t.raw || "",
      detected_language: t.detected_language || (t.language?.toLowerCase().includes("hindi") ? "hi" : t.language?.toLowerCase().includes("arabic") ? "ar" : "en"),
      classification: t.classification || "standard",
      normalized_source: t.normalized_source || t.normalized || t.raw || "",
      is_negation: Boolean(t.is_negation),
      collision: t.collision?.is_collision ? t.collision : null,
      language: t.language || (t.detected_language === "hi" ? "Hindi" : t.detected_language === "ar" ? "Arabic" : "English"),
      type: t.type || t.classification || "Standard",
      script: t.script || "Latin",
      normalized: t.normalized || t.normalized_source || t.raw || "",
      confidence: typeof t.confidence === "number" ? t.confidence : 0.95,
      explanation: t.explanation || "",
    }));

    return {
      original_text: parsed.original_text || normalizedText,
      detected_pair: parsed.detected_pair || "Multilingual Code-Switching",
      detected_languages: parsed.detected_languages || ["Mixed"],
      phenomena: parsed.phenomena || [],
      pragmatic_register: parsed.pragmatic_register || {
        tone: "Colloquial-Familiar",
        cultural_markers: [],
      },
      tokens,
      canonical_script: canonicalScript,
      canonical_native_script: canonicalScript,
      english_translation: standardEnglish,
      standard_english: standardEnglish,
      intent: parsed.intent || { label: "GENERAL_INQUIRY", confidence: 0.8 },
      entities: parsed.entities || [],
      action_dispatch: parsed.action_dispatch || {
        target_service: "CUSTOMER_SUPPORT",
        endpoint_action: "GENERAL_QUERY",
        parameters: {
          priority_level: "P2",
          requires_agent_review: false,
        },
      },
      model_source: "gemini-2.5-flash",
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

    // Extract human-readable error from raw Google GenAI JSON errors
    let cleanMessage = err?.message || "Gemini analysis request failed.";
    try {
      const parsedErr = JSON.parse(cleanMessage);
      if (parsedErr?.error?.message) {
        cleanMessage = `Gemini API: ${parsedErr.error.message}`;
      }
    } catch {
      // Keep string as is
    }

    throw new Error(cleanMessage);
  }
}
