import { TriageAnalysisResult, VerificationResult } from "./types";

export function runDeterministicVerification(
  originalText: string,
  analysis: Omit<TriageAnalysisResult, "verification">
): VerificationResult {
  const issues: string[] = [];

  // A. Number Preservation Check
  // Extract number patterns like 8:00, 12345, 120, etc.
  const numberRegex = /\b\d+(?:[:.]\d+)?\b/g;
  const originalNumbers = originalText.match(numberRegex) || [];
  const combinedTarget = `${analysis.canonical_script} ${analysis.english_translation} ${analysis.entities.map(e => e.value).join(" ")}`;
  const targetNumbers = combinedTarget.match(numberRegex) || [];

  let numbersPreserved = true;
  if (originalNumbers.length > 0) {
    const missingNumbers = originalNumbers.filter(
      (num) => !combinedTarget.includes(num)
    );
    if (missingNumbers.length > 0) {
      numbersPreserved = false;
      issues.push(`Missing numbers in output: ${missingNumbers.join(", ")}`);
    }
  }

  // B. Entity Preservation Check
  let entitiesPreserved = true;
  if (analysis.entities && analysis.entities.length > 0) {
    for (const ent of analysis.entities) {
      if (!ent.value || !ent.type) {
        entitiesPreserved = false;
        issues.push(`Malformed entity encountered: ${JSON.stringify(ent)}`);
      }
    }
  }

  // C. Negation Preservation Check
  // Check common Hindi/Urdu, English, and Arabic negation indicators
  const hindiNegationTerms = [/\bni\b/i, /\bnahi\b/i, /\bnhi\b/i, /\bmat\b/i, /\bna\b/i];
  const englishNegationTerms = [/\bnot\b/i, /\bno\b/i, /\bnever\b/i, /n['’]t\b/i, /\bnone\b/i];
  const arabicNegationTerms = [/\bla\b/i, /\bma\b/i, /\bmesh\b/i, /\bmish\b/i, /\bmu\b/i, /\bmo\b/i];

  const hasOriginalNegation =
    hindiNegationTerms.some((regex) => regex.test(originalText)) ||
    englishNegationTerms.some((regex) => regex.test(originalText)) ||
    arabicNegationTerms.some((regex) => regex.test(originalText));

  const englishTranslation = (analysis.english_translation || "").toLowerCase();
  const canonicalScript = (analysis.canonical_script || "").toLowerCase();

  const englishHasNegation =
    englishNegationTerms.some((regex) => regex.test(englishTranslation)) ||
    englishTranslation.includes("without") ||
    englishTranslation.includes("fail") ||
    englishTranslation.includes("didn't") ||
    englishTranslation.includes("wasn't") ||
    englishTranslation.includes("un-");

  const nativeHasNegation =
    canonicalScript.includes("नहीं") ||
    canonicalScript.includes("ना") ||
    canonicalScript.includes("مت") ||
    canonicalScript.includes("لا") ||
    canonicalScript.includes("ما") ||
    canonicalScript.includes("مش");

  let negationPreserved = true;
  const negationMarkersFound: string[] = [];

  if (hasOriginalNegation) {
    if (/\bni\b/i.test(originalText)) negationMarkersFound.push("ni");
    if (/\bnahi\b/i.test(originalText)) negationMarkersFound.push("nahi");
    if (/\bnhi\b/i.test(originalText)) negationMarkersFound.push("nhi");
    if (/\bmesh\b/i.test(originalText) || /\bmish\b/i.test(originalText)) negationMarkersFound.push("mesh/mish");

    if (!englishHasNegation && !nativeHasNegation) {
      // Conservative check: if source clearly had negation like 'ni hua' but translation is positive
      negationPreserved = false;
      issues.push("Negation marker present in source input was not retained in translation.");
    }
  }

  // D. Schema Validity Check
  const schemaValid =
    typeof analysis.original_text === "string" &&
    Array.isArray(analysis.detected_languages) &&
    analysis.detected_languages.length > 0 &&
    Array.isArray(analysis.tokens) &&
    analysis.tokens.length > 0 &&
    typeof analysis.canonical_script === "string" &&
    analysis.canonical_script.trim().length > 0 &&
    typeof analysis.english_translation === "string" &&
    analysis.english_translation.trim().length > 0 &&
    typeof analysis.intent?.label === "string" &&
    typeof analysis.intent?.confidence === "number" &&
    Array.isArray(analysis.entities);

  if (!schemaValid) {
    issues.push("Response failed structural schema integrity criteria.");
  }

  return {
    entities_preserved: entitiesPreserved,
    numbers_preserved: numbersPreserved,
    negation_preserved: negationPreserved,
    schema_valid: schemaValid,
    details: {
      numbers_found_original: originalNumbers,
      numbers_found_target: targetNumbers,
      negation_markers_found: negationMarkersFound,
      negation_preserved_in_english: englishHasNegation,
      issues,
    },
  };
}
