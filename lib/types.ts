export type LanguageCategory = "English" | "Hindi" | "Arabic" | "Mixed" | "Other";

export type SupportedLang = "en" | "hi" | "ar" | "mixed" | "unknown";

export type TokenClassification =
  | "standard"
  | "transliterated"
  | "phonetic_ear"
  | "alphanumeric_sub";

export interface CollisionResolution {
  is_collision: boolean;
  selected_language: SupportedLang;
  selected_meaning: string;
  rejected_language: SupportedLang;
  rejected_meaning: string;
  reasoning: string;
}

export interface AnalyzedToken {
  raw: string;
  detected_language: SupportedLang;
  classification: TokenClassification;
  normalized_source: string;
  is_negation: boolean;
  collision?: CollisionResolution | null;
  start_idx?: number;
  end_idx?: number;
  // Legacy & display fields preserved for backward compatibility
  language?: string;
  type?: string;
  script?: string;
  normalized?: string;
  confidence?: number;
  explanation?: string;
}

export type TokenAnalysis = AnalyzedToken;

export type IntentType =
  | "DELIVERY_STATUS"
  | "DELIVERY_ISSUE"
  | "REFUND_REQUEST"
  | "CANCELLATION"
  | "ACCOUNT_ACCESS"
  | "TECHNICAL_SUPPORT"
  | "GENERAL_INQUIRY"
  | "GENERAL_QUERY"
  | "FINANCIAL_DISPUTE"
  | "TRAFFIC_DELAY"
  | "PAYMENT_ISSUE"
  | "TRACKING_LINK_INQUIRY"
  | "TRANSIT_DELAY"
  | string;

export interface IntentAnalysis {
  label: IntentType;
  confidence: number;
}

export interface EntityItem {
  type: string;
  value: string;
}

export interface PragmaticRegister {
  tone:
    | "Colloquial-Familiar"
    | "Pleading-Urgent"
    | "Escalating-Hostile"
    | "Formal";
  cultural_markers: string[];
}

export interface ActionDispatch {
  target_service:
    | "LOGISTICS_SERVICE"
    | "PAYMENT_GATEWAY"
    | "CUSTOMER_SUPPORT";
  endpoint_action:
    | "EXPEDITE_DELIVERY"
    | "INITIATE_REFUND"
    | "FLAG_PRIORITY_ESCALATION"
    | "GENERAL_QUERY";
  parameters: {
    reference_id?: string;
    priority_level: "P1" | "P2" | "P3";
    requires_agent_review: boolean;
  };
}

export interface VerificationReport {
  schema_valid: boolean;
  span_alignment_valid: boolean;
  numeric_parity: boolean;
  negation_parity: boolean;
  entities_preserved: boolean;
  integrity_score: number;
  audit_logs: string[];
  // Legacy fields for backward compatibility
  numbers_preserved?: boolean;
  negation_preserved?: boolean;
  details?: {
    numbers_found_original?: string[];
    numbers_found_target?: string[];
    negation_markers_found?: string[];
    negation_preserved_in_english?: boolean;
    issues?: string[];
  };
}

export type VerificationResult = VerificationReport;

export interface TriageAnalysisResult {
  original_text: string;
  detected_languages: string[];
  detected_pair?: string;
  phenomena: string[];
  tokens: AnalyzedToken[];
  canonical_script: string;
  canonical_native_script?: string;
  english_translation: string;
  standard_english?: string;
  intent: IntentAnalysis;
  entities: EntityItem[];
  pragmatic_register?: PragmaticRegister;
  action_dispatch?: ActionDispatch;
  verification: VerificationReport;
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
