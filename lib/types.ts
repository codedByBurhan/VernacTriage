export type LanguageCategory = "English" | "Hindi" | "Arabic" | "Mixed" | "Other";

export interface TokenAnalysis {
  raw: string;
  language: string; // e.g. "English", "Hindi", "Arabic"
  type: string; // e.g. "Standard", "Phonetic / Romanized", "Arabizi Numeral", "Slang / Abbr"
  script?: string; // e.g. "Latin", "Devanagari", "Arabic"
  normalized: string; // Native or canonical form (e.g. "नहीं", "حاول")
  confidence?: number;
  explanation?: string;
}

export interface IntentAnalysis {
  label: string; // e.g. "DELIVERY_ISSUE", "TRAFFIC_DELAY", "REFUND_REQUEST"
  confidence: number;
}

export interface EntityItem {
  type: string; // e.g. "ORDER_ID", "TIME", "STATUS", "ACTION_REQ"
  value: string;
}

export interface VerificationResult {
  entities_preserved: boolean;
  numbers_preserved: boolean;
  negation_preserved: boolean;
  schema_valid: boolean;
  details?: {
    numbers_found_original?: string[];
    numbers_found_target?: string[];
    negation_markers_found?: string[];
    negation_preserved_in_english?: boolean;
    issues?: string[];
  };
}

export interface TriageAnalysisResult {
  original_text: string;
  detected_languages: string[];
  phenomena: string[];
  tokens: TokenAnalysis[];
  canonical_script: string;
  english_translation: string;
  intent: IntentAnalysis;
  entities: EntityItem[];
  verification: VerificationResult;
  model_source?: "gemini-2.5-flash" | "demo-fallback";
}

export interface DemoPreset {
  id: string;
  name: string;
  badge: string;
  language: string;
  text: string;
  expectedResult: TriageAnalysisResult;
}
