const test = require('node:test');
const assert = require('node:assert');

// Simplified verification logic test matching lib/verifier.ts
function runDeterministicVerification(originalText, analysis, spanResult) {
  const auditLogs = [];
  let integrityScore = 100;
  const issues = [];

  const hasTokens = Array.isArray(analysis.tokens) && analysis.tokens.length > 0;
  const hasCanonical = Boolean(analysis.canonical_script?.trim());
  const hasEnglish = Boolean(analysis.english_translation?.trim());
  const hasIntent = Boolean(analysis.intent?.label);
  const hasEntities = Array.isArray(analysis.entities);
  const schemaValid = Boolean(hasTokens && hasCanonical && hasEnglish && hasIntent && hasEntities);

  if (schemaValid) {
    auditLogs.push("[PASS] Schema valid");
  } else {
    integrityScore = Math.max(0, integrityScore - 25);
    issues.push("Schema invalid");
    auditLogs.push("[FAIL] Schema valid");
  }

  const spanAlignmentValid = spanResult
    ? spanResult.all_spans_valid
    : analysis.tokens.every((t) => typeof t.start_idx === "number" && typeof t.end_idx === "number");

  if (spanAlignmentValid) {
    auditLogs.push("[PASS] Span alignment");
  } else {
    integrityScore = Math.max(0, integrityScore - 25);
    issues.push("Span alignment mismatch");
    auditLogs.push("[FAIL] Span alignment mismatch");
  }

  const standaloneNumberRegex = /\b\d+(?:[:.]\d+)?(?:[a-zA-Z]+)?\b/g;
  const rawNumberMatches = originalText.match(standaloneNumberRegex) || [];
  const quantitativeNumbers = rawNumberMatches.filter((n) => {
    if (n.toLowerCase() === "b4") return false;
    return /\d/.test(n);
  });

  const englishText = (analysis.english_translation || "").toLowerCase();
  const canonicalText = (analysis.canonical_script || "").toLowerCase();
  const entityValues = (analysis.entities || []).map((e) => e.value.toLowerCase()).join(" ");
  const combinedSearchTargets = `${englishText} ${canonicalText} ${entityValues}`;

  let numericParity = true;
  const missingNumbers = [];

  for (const num of quantitativeNumbers) {
    const digitsOnly = num.replace(/\D/g, "");
    if (!digitsOnly) continue;
    const exactPreserved = combinedSearchTargets.includes(num.toLowerCase());
    const digitsPreserved = combinedSearchTargets.includes(digitsOnly);
    if (!exactPreserved && !digitsPreserved) {
      missingNumbers.push(num);
    }
  }

  if (missingNumbers.length > 0) {
    numericParity = false;
    integrityScore = Math.max(0, integrityScore - 25);
    auditLogs.push(`[FAIL] Numeric parity: ${missingNumbers.join(", ")}`);
  } else {
    auditLogs.push("[PASS] Numeric parity");
  }

  const hasNegationToken = analysis.tokens.some((t) => t.is_negation === true);
  const englishNegationPattern = /\b(?:not|no|never|cannot|can't|won't|without|neither|nor|none|nothing|didn't|wasn't)\b/i;
  const englishHasNegation = englishNegationPattern.test(englishText);

  let negationParity = true;
  if (hasNegationToken) {
    if (!englishHasNegation) {
      negationParity = false;
      integrityScore = Math.max(0, integrityScore - 25);
      auditLogs.push("[FAIL] Negation parity mismatch");
    } else {
      auditLogs.push("[PASS] Negation parity");
    }
  } else {
    auditLogs.push("[PASS] Negation parity");
  }

  let entitiesPreserved = true;
  if (analysis.entities && analysis.entities.length > 0) {
    for (const ent of analysis.entities) {
      if (!ent.value || !ent.type) {
        entitiesPreserved = false;
      }
    }
  }

  if (entitiesPreserved) {
    auditLogs.push("[PASS] Entity preservation");
  } else {
    integrityScore = Math.max(0, integrityScore - 25);
    auditLogs.push("[FAIL] Entity preservation");
  }

  integrityScore = Math.max(0, Math.min(100, integrityScore));

  return {
    schema_valid: schemaValid,
    span_alignment_valid: spanAlignmentValid,
    numeric_parity: numericParity,
    negation_parity: negationParity,
    entities_preserved: entitiesPreserved,
    integrity_score: integrityScore,
    audit_logs: auditLogs,
  };
}

test('verifier: 100/100 perfect score on compliant analysis', () => {
  const input = "Bhai kl parcel deliver ni hua, 4200 rupees deduct ho gye";
  const analysis = {
    tokens: [
      { raw: "Bhai", is_negation: false, start_idx: 0, end_idx: 4 },
      { raw: "ni", is_negation: true, start_idx: 23, end_idx: 25 },
      { raw: "4200", is_negation: false, start_idx: 36, end_idx: 40 }
    ],
    canonical_script: "भाई कल पार्सल डिलीवर नहीं हुआ, 4200 रुपये कट गए",
    english_translation: "Brother, parcel was not delivered, 4200 rupees were deducted.",
    intent: { label: "DELIVERY_ISSUE", confidence: 0.95 },
    entities: [{ type: "AMOUNT", value: "4200 rupees" }]
  };
  const spanResult = { all_spans_valid: true };

  const report = runDeterministicVerification(input, analysis, spanResult);
  assert.strictEqual(report.integrity_score, 100);
  assert.strictEqual(report.schema_valid, true);
  assert.strictEqual(report.span_alignment_valid, true);
  assert.strictEqual(report.numeric_parity, true);
  assert.strictEqual(report.negation_parity, true);
  assert.strictEqual(report.entities_preserved, true);
  assert(report.audit_logs.some(l => l.includes("[PASS] Negation parity")));
  assert(report.audit_logs.some(l => l.includes("[PASS] Numeric parity")));
});

test('verifier: penalizes negation parity mismatch (-25)', () => {
  const input = "Parcel deliver ni hua";
  const analysis = {
    tokens: [
      { raw: "ni", is_negation: true, start_idx: 15, end_idx: 17 }
    ],
    canonical_script: "पार्सल डिलीवर हुआ",
    english_translation: "The parcel was successfully delivered.", // Mismatch: positive translation!
    intent: { label: "DELIVERY_ISSUE", confidence: 0.95 },
    entities: []
  };
  const spanResult = { all_spans_valid: true };

  const report = runDeterministicVerification(input, analysis, spanResult);
  assert.strictEqual(report.negation_parity, false);
  assert.strictEqual(report.integrity_score, 75);
  assert(report.audit_logs.some(l => l.includes("[FAIL] Negation parity mismatch")));
});

test('verifier: penalizes missing numeric parity (-25)', () => {
  const input = "Order #8831 deliver b4 8:00";
  const analysis = {
    tokens: [
      { raw: "Order", is_negation: false, start_idx: 0, end_idx: 5 }
    ],
    canonical_script: "ऑर्डर जल्दी लाओ",
    english_translation: "Bring the order quickly.", // Missing 8831 and 8:00
    intent: { label: "DELIVERY_ISSUE", confidence: 0.95 },
    entities: []
  };
  const spanResult = { all_spans_valid: true };

  const report = runDeterministicVerification(input, analysis, spanResult);
  assert.strictEqual(report.numeric_parity, false);
  assert.strictEqual(report.integrity_score, 75);
  assert(report.audit_logs.some(l => l.includes("[FAIL] Numeric parity")));
});

test('verifier: multiple deductions clamp properly', () => {
  const input = "Order #9999 deliver ni hua";
  const analysis = {
    tokens: [
      { raw: "ni", is_negation: true, start_idx: undefined, end_idx: undefined }
    ],
    canonical_script: "पार्सल",
    english_translation: "Parcel arrived.", // Missing number (-25), Missing negation (-25), Invalid span (-25)
    intent: { label: "GENERAL", confidence: 0.8 },
    entities: [{ type: "", value: "" }] // Malformed entity (-25)
  };
  const spanResult = { all_spans_valid: false };

  const report = runDeterministicVerification(input, analysis, spanResult);
  assert.strictEqual(report.integrity_score, 0); // 100 - 4*25 = 0
  assert.strictEqual(report.numeric_parity, false);
  assert.strictEqual(report.negation_parity, false);
  assert.strictEqual(report.span_alignment_valid, false);
  assert.strictEqual(report.entities_preserved, false);
});
