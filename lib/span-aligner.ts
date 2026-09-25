import { AnalyzedToken } from "./types";

export interface SpanAlignmentResult {
  tokens: AnalyzedToken[];
  all_spans_valid: boolean;
  aligned_count: number;
  unaligned_count: number;
  audit_logs: string[];
}

/**
 * Deterministically aligns token spans against raw input using a single-pass rolling cursor.
 * 
 * Rules:
 * 1. Rolling cursor starts at 0 and strictly advances.
 * 2. Never performs a global indexOf from 0 for all tokens (prevents homograph misalignments like multiple "me"s).
 * 3. Asserts rawInput.substring(start_idx, end_idx) === token.raw.
 * 4. Includes fallback for whitespace / case-variation before giving up.
 * 5. If unaligned, marks span invalid and records an audit trail.
 */
export function alignTokenSpans(
  rawInput: string,
  tokens: AnalyzedToken[]
): SpanAlignmentResult {
  const auditLogs: string[] = [];
  let cursor = 0;
  let alignedCount = 0;
  let unalignedCount = 0;

  const alignedTokens: AnalyzedToken[] = tokens.map((originalToken, index) => {
    const token = { ...originalToken };
    const rawToken = token.raw;

    if (!rawToken || rawToken.trim() === "") {
      auditLogs.push(`[WARN] Token at index ${index} has empty raw value.`);
      unalignedCount++;
      return { ...token, start_idx: undefined, end_idx: undefined };
    }

    // Step 1: Exact substring search starting at current cursor
    let pos = rawInput.indexOf(rawToken, cursor);

    // Step 2: Fallback 1 - Case-insensitive search from cursor
    if (pos === -1) {
      const lowerInput = rawInput.toLowerCase();
      const lowerToken = rawToken.toLowerCase();
      pos = lowerInput.indexOf(lowerToken, cursor);
    }

    // Step 3: Fallback 2 - Strip trailing punctuation if token was normalized with/without punctuation
    if (pos === -1) {
      const cleanToken = rawToken.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").trim();
      if (cleanToken.length > 0) {
        const cleanPos = rawInput.indexOf(cleanToken, cursor);
        if (cleanPos !== -1) {
          pos = cleanPos;
        }
      }
    }

    // Evaluation of match
    if (pos !== -1) {
      const startIdx = pos;
      const endIdx = pos + rawToken.length;

      // Verification: Check substring equality (or case-insensitive equality in fallback)
      const matchedSubstring = rawInput.substring(startIdx, endIdx);
      if (
        matchedSubstring === rawToken ||
        matchedSubstring.toLowerCase() === rawToken.toLowerCase()
      ) {
        token.start_idx = startIdx;
        token.end_idx = endIdx;
        cursor = endIdx;
        alignedCount++;
        return token;
      }
    }

    // Unaligned case: do not invent an offset
    token.start_idx = undefined;
    token.end_idx = undefined;
    unalignedCount++;
    auditLogs.push(
      `[FAIL] Span alignment failed for token "${rawToken}" (token #${index}) at cursor position ${cursor}.`
    );
    return token;
  });

  const allSpansValid = unalignedCount === 0 && alignedCount === tokens.length;

  if (allSpansValid) {
    auditLogs.push(`[PASS] Span alignment: All ${alignedCount} token spans deterministically aligned.`);
  } else {
    auditLogs.push(
      `[FAIL] Span alignment: ${alignedCount} aligned, ${unalignedCount} unaligned out of ${tokens.length} tokens.`
    );
  }

  return {
    tokens: alignedTokens,
    all_spans_valid: allSpansValid,
    aligned_count: alignedCount,
    unaligned_count: unalignedCount,
    audit_logs: auditLogs,
  };
}
