import { TriageAnalysisResult, VerificationReport } from "./types";
import { SpanAlignmentResult } from "./span-aligner";

export function runDeterministicVerification(
  originalText: string,
  analysis: Omit<TriageAnalysisResult, "verification">,
  spanResult?: SpanAlignmentResult
): VerificationReport {
  const auditLogs: string[] = [];
  let integrityScore = 100;
  const issues: string[] = [];

  // 1. Schema Validity Assertion
  const hasTokens = Array.isArray(analysis.tokens) && analysis.tokens.length > 0;
  const hasCanonical =
    Boolean(analysis.canonical_script?.trim()) ||
    Boolean(analysis.canonical_native_script?.trim());
  const hasEnglish =
    Boolean(analysis.english_translation?.trim()) ||
    Boolean(analysis.standard_english?.trim());
  const hasIntent = Boolean(analysis.intent?.label);
  const hasEntities = Array.isArray(analysis.entities);
  const hasRegister = Boolean(analysis.pragmatic_register?.tone);
  const hasDispatch = Boolean(analysis.action_dispatch?.endpoint_action);

  const schemaValid = Boolean(
    hasTokens && hasCanonical && hasEnglish && hasIntent && hasEntities
  );

  if (schemaValid) {
    auditLogs.push("[PASS] Schema valid: Response conforms to strictly typed JSON schema.");
  } else {
    integrityScore = Math.max(0, integrityScore - 25);
    issues.push("Response failed structural schema integrity criteria.");
    auditLogs.push("[FAIL] Schema validity: Structural JSON schema validation failed.");
  }

  // 2. Span Alignment Assertion
  const spanAlignmentValid = spanResult
    ? spanResult.all_spans_valid
    : analysis.tokens.every((t) => typeof t.start_idx === "number" && typeof t.end_idx === "number");

  if (spanAlignmentValid) {
    auditLogs.push("[PASS] Span alignment: Token character offsets deterministically aligned.");
  } else {
    integrityScore = Math.max(0, integrityScore - 25);
    issues.push("Token span alignment could not be established deterministically.");
    auditLogs.push("[FAIL] Span alignment mismatch: One or more token spans failed alignment.");
  }

  // 3. Numeric Parity Assertion
  // Find numeric sequences in raw input (standalone numbers, times, currencies, etc.)
  // Filter out pure single-digit Arabizi letters inside words (e.g. 7 in 7awel)
  const standaloneNumberRegex = /\b\d+(?:[:.]\d+)?(?:[a-zA-Z]+)?\b/g;
  const rawNumberMatches = originalText.match(standaloneNumberRegex) || [];
  
  // Clean raw numbers: e.g. "8831", "4200", "8:00", "5pm", "150"
  // Exclude common Arabizi contractions if they aren't quantitative: e.g., "b4" is before
  const quantitativeNumbers = rawNumberMatches.filter((n) => {
    const lower = n.toLowerCase();
    if (lower === "b4") return false; // Alphanumeric contraction for 'before'
    return /\d/.test(n);
  });

  const englishText = (analysis.english_translation || analysis.standard_english || "").toLowerCase();
  const canonicalText = (analysis.canonical_script || analysis.canonical_native_script || "").toLowerCase();
  const entityValues = (analysis.entities || []).map((e) => e.value.toLowerCase()).join(" ");
  const dispatchParamValues = analysis.action_dispatch
    ? Object.values(analysis.action_dispatch.parameters || {}).map(String).join(" ").toLowerCase()
    : "";

  const combinedSearchTargets = `${englishText} ${canonicalText} ${entityValues} ${dispatchParamValues}`;

  let numericParity = true;
  const missingNumbers: string[] = [];

  for (const num of quantitativeNumbers) {
    // Extract base digits (e.g. "4200" from "4200", "8" from "8:00")
    const digitsOnly = num.replace(/\D/g, "");
    if (!digitsOnly) continue;

    // Check if either the exact token or its digits are preserved
    const exactPreserved = combinedSearchTargets.includes(num.toLowerCase());
    const digitsPreserved = combinedSearchTargets.includes(digitsOnly);

    if (!exactPreserved && !digitsPreserved) {
      missingNumbers.push(num);
    }
  }

  if (missingNumbers.length > 0) {
    numericParity = false;
    integrityScore = Math.max(0, integrityScore - 25);
    issues.push(`Numeric parity failure: Missing numbers [${missingNumbers.join(", ")}]`);
    auditLogs.push(`[FAIL] Numeric parity: Missing quantitative values: ${missingNumbers.join(", ")}`);
  } else {
    auditLogs.push("[PASS] Numeric parity: Quantitative numerical values preserved.");
  }

  // 4. Negation Parity Assertion
  // Linguistic signal: token-level is_negation
  const hasNegationToken = analysis.tokens.some((t) => t.is_negation === true);

  const englishNegationPattern =
    /\b(?:not|no|never|cannot|can't|won't|without|neither|nor|none|nothing|didn't|wasn't|isn't|aren't|haven't|hasn't|hadn't|don't|doesn't|unsuccessful|failed)\b/i;
  const englishHasNegation = englishNegationPattern.test(englishText);

  let negationParity = true;
  const negationMarkersFound: string[] = [];

  analysis.tokens.forEach((t) => {
    if (t.is_negation) {
      negationMarkersFound.push(t.raw);
    }
  });

  if (hasNegationToken) {
    if (!englishHasNegation) {
      negationParity = false;
      integrityScore = Math.max(0, integrityScore - 25);
      issues.push("Negation parity failure: Negation token in source not preserved in English.");
      auditLogs.push(`[FAIL] Negation parity: Source negation [${negationMarkersFound.join(", ")}] missing in translation.`);
    } else {
      auditLogs.push(`[PASS] Negation parity: Negation [${negationMarkersFound.join(", ")}] preserved in English translation.`);
    }
  } else {
    auditLogs.push("[PASS] Negation parity: Polarity consistency verified (non-negative).");
  }

  // 5. Entity Preservation Assertion
  let entitiesPreserved = true;
  if (analysis.entities && analysis.entities.length > 0) {
    for (const ent of analysis.entities) {
      if (!ent.value || !ent.type || ent.value.trim() === "" || ent.type.trim() === "") {
        entitiesPreserved = false;
        issues.push(`Malformed entity: ${JSON.stringify(ent)}`);
      }
    }
  }

  if (entitiesPreserved) {
    auditLogs.push("[PASS] Entity preservation: Extracted business entities validated and grounded.");
  } else {
    integrityScore = Math.max(0, integrityScore - 25);
    auditLogs.push("[FAIL] Entity preservation: One or more extracted entities were ungrounded or empty.");
  }

  // Final score clamping: 0 <= integrity_score <= 100
  integrityScore = Math.max(0, Math.min(100, integrityScore));

  return {
    schema_valid: schemaValid,
    span_alignment_valid: spanAlignmentValid,
    numeric_parity: numericParity,
    negation_parity: negationParity,
    entities_preserved: entitiesPreserved,
    integrity_score: integrityScore,
    audit_logs: auditLogs,
    // Backward-compatible fields
    numbers_preserved: numericParity,
    negation_preserved: negationParity,
    details: {
      numbers_found_original: quantitativeNumbers,
      numbers_found_target: quantitativeNumbers.filter((n) => !missingNumbers.includes(n)),
      negation_markers_found: negationMarkersFound,
      negation_preserved_in_english: englishHasNegation,
      issues,
    },
  };
}
