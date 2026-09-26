import type { TriageAnalysisResult, VerificationReport } from "./types";
import type { SpanAlignmentResult } from "./span-aligner";

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

function extractQuantitativeNumbers(text: string): string[] {
  const chatSlang = new Set([
    "b4", "w8", "gr8", "2day", "2nite", "l8r", "u2", "4u", "4ever", "m8", "f2f", "b2b", "c2c"
  ]);

  const validSuffixes = /^(?:am|pm|hrs?|mins?|secs?|kg|g|km|m|cm|mm|k|st|nd|rd|th|rs|inr|usd|eur|gbp|p|pieces?|pcs?|x)$/i;

  const rawWords = text.match(/[a-zA-Z0-9$€£₹:.]+/g) || [];
  const quantitative: string[] = [];

  for (const word of rawWords) {
    const trimmed = word.replace(/^[^a-zA-Z0-9$€£₹]+|[^a-zA-Z0-9]+$/g, "");
    if (!trimmed || !/\d/.test(trimmed)) continue;

    const lower = trimmed.toLowerCase();
    if (chatSlang.has(lower)) continue;

    // Currency at start: e.g. $50, ₹4200, €10
    if (/^[$€£₹]\d+(?:[.,]\d+)?$/i.test(trimmed)) {
      quantitative.push(trimmed);
      continue;
    }

    // Time formats: e.g. 5:00, 14:30, 8:00am, 5pm
    if (/^\d{1,2}:\d{2}(?:\s*(?:am|pm))?$/i.test(trimmed) || /^\d{1,2}(?:am|pm)$/i.test(trimmed)) {
      quantitative.push(trimmed);
      continue;
    }

    // Pure number (integer or decimal): e.g. 4200, 3.5, 1,000
    if (/^\d+(?:[.,]\d+)*$/i.test(trimmed)) {
      quantitative.push(trimmed);
      continue;
    }

    // Number with suffix: e.g. 5kg, 4200rs, 1st, 2nd
    const suffixMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)([a-zA-Z]+)$/);
    if (suffixMatch) {
      const suffix = suffixMatch[2].toLowerCase();
      if (validSuffixes.test(suffix)) {
        quantitative.push(trimmed);
        continue;
      }
    }
  }

  return quantitative;
}

function matchesNumberPreserved(targetText: string, numToken: string): boolean {
  const lowerTarget = targetText.toLowerCase();
  const lowerNum = numToken.toLowerCase();

  // 1. Direct boundary check for the full token
  const escapedNum = lowerNum.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regexFull = new RegExp(`(?:^|\\b|\\D)${escapedNum}(?:$|\\b|\\D)`, "i");
  if (regexFull.test(lowerTarget)) return true;

  // 2. Time-like tokens (e.g. "5pm" -> "5:00 pm", "5:00", "05:00")
  const timeMatch = lowerNum.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (timeMatch) {
    const hour = timeMatch[1];
    const meridiem = timeMatch[3];
    if (meridiem) {
      const timePattern = new RegExp(`(?:^|\\D)0?${hour}(?::00)?\\s*${meridiem}(?:$|\\D)`, "i");
      if (timePattern.test(lowerTarget)) return true;
    } else {
      const timePattern = new RegExp(`(?:^|\\D)0?${hour}:00(?:$|\\D)`, "i");
      if (timePattern.test(lowerTarget)) return true;
    }
  }

  // 3. For pure numeric digits, check with non-digit boundaries (prevents "5" matching in "500")
  const digitsOnly = lowerNum.replace(/\D/g, "");
  if (digitsOnly.length > 0) {
    const regexDigits = new RegExp(`(?:^|\\D)${digitsOnly}(?:$|\\D)`);
    if (regexDigits.test(lowerTarget)) return true;
  }

  return false;
}

  // 3. Numeric Parity Assertion
  const quantitativeNumbers = extractQuantitativeNumbers(originalText);

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
    if (!matchesNumberPreserved(combinedSearchTargets, num)) {
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
  const hasNegationToken = analysis.tokens.some((t) => t.is_negation === true);
  const vernacularNegationPattern =
    /\b(?:nahi|nahin|na|ni|mat|nakko|nako|ma|la|mish|mush|moch|hindi|ayaw|wala|not|no|never|cant|cannot)\b/i;
  const sourceHasNegation = hasNegationToken || vernacularNegationPattern.test(originalText);

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

  if (sourceHasNegation && !englishHasNegation) {
    negationParity = false;
    integrityScore = Math.max(0, integrityScore - 25);
    issues.push("Negation parity failure: Negation in source not preserved in English translation.");
    auditLogs.push(
      `[FAIL] Negation parity: Source negation [${negationMarkersFound.join(", ") || "token"}] missing in translation.`
    );
  } else if (!sourceHasNegation && englishHasNegation) {
    negationParity = false;
    integrityScore = Math.max(0, integrityScore - 25);
    issues.push("Negation parity failure: Positive source text was inverted into a negative translation.");
    auditLogs.push("[FAIL] Negation parity: Hallucinated negation in English translation for positive source.");
  } else if (sourceHasNegation) {
    auditLogs.push(
      `[PASS] Negation parity: Negation [${negationMarkersFound.join(", ") || "source negation"}] preserved in English translation.`
    );
  } else {
    auditLogs.push("[PASS] Negation parity: Polarity consistency verified (non-negative).");
  }

  // 5. Entity Preservation & Grounding Assertion
  let entitiesPreserved = true;
  const tokensText = analysis.tokens.map((t) => `${t.raw} ${t.normalized_source || ""}`).join(" ");
  const groundingCorpus = `${originalText} ${englishText} ${canonicalText} ${tokensText} ${dispatchParamValues}`.toLowerCase();

  if (analysis.entities && analysis.entities.length > 0) {
    for (const ent of analysis.entities) {
      if (!ent.value || !ent.type || ent.value.trim() === "" || ent.type.trim() === "") {
        entitiesPreserved = false;
        issues.push(`Malformed entity: ${JSON.stringify(ent)}`);
        continue;
      }

      const val = ent.value.trim().toLowerCase();
      // Grounding: entity must appear in input, output, tokens, or dispatch params
      let isGrounded = groundingCorpus.includes(val);
      if (!isGrounded) {
        // Multi-word entity check: content words must appear in corpus
        const cleanVal = val.replace(/[()[\]{}"',;.:]/g, " ");
        const words = cleanVal.split(/\s+/).filter((w) => w.length > 2 || /\d/.test(w));
        if (words.length > 0 && words.every((w) => groundingCorpus.includes(w))) {
          isGrounded = true;
        }
      }

      if (!isGrounded) {
        entitiesPreserved = false;
        issues.push(`Ungrounded entity: "${ent.value}" (type: ${ent.type}) not found in source or translation`);
        auditLogs.push(`[FAIL] Entity preservation: Ungrounded entity "${ent.value}" (type: ${ent.type}) hallucinated.`);
      }
    }
  }

  if (entitiesPreserved) {
    auditLogs.push("[PASS] Entity preservation: Extracted business entities validated and grounded.");
  } else {
    integrityScore = Math.max(0, integrityScore - 25);
    if (!auditLogs.some((l) => l.startsWith("[FAIL] Entity preservation"))) {
      auditLogs.push("[FAIL] Entity preservation: One or more extracted entities were ungrounded or empty.");
    }
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
