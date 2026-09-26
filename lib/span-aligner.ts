import type { AnalyzedToken } from "./types";

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

function findTokenPosition(
  haystack: string,
  needle: string,
  fromIndex: number,
  caseInsensitive: boolean = false
): number {
  if (!needle) return -1;
  const searchHaystack = caseInsensitive ? haystack.toLowerCase() : haystack;
  const searchNeedle = caseInsensitive ? needle.toLowerCase() : needle;

  const isWordChar = (ch: string) => /[\p{L}\p{N}]/u.test(ch);
  const startsWord = isWordChar(searchNeedle[0]);
  const endsWord = isWordChar(searchNeedle[searchNeedle.length - 1]);

  let cur = fromIndex;
  // First pass: try boundary-respecting match from current cursor
  while (cur <= searchHaystack.length - searchNeedle.length) {
    const idx = searchHaystack.indexOf(searchNeedle, cur);
    if (idx === -1) break;

    const leftOk = !startsWord || idx === 0 || !isWordChar(searchHaystack[idx - 1]);
    const rightOk =
      !endsWord ||
      idx + searchNeedle.length >= searchHaystack.length ||
      !isWordChar(searchHaystack[idx + searchNeedle.length]);

    if (leftOk && rightOk) {
      return idx;
    }
    cur = idx + 1;
  }

  // Fallback: raw substring search if no strict boundary match was found
  return searchHaystack.indexOf(searchNeedle, fromIndex);
}

    let matchLen = rawToken.length;
    let expectedText = rawToken;

    // Step 1: Exact substring search starting at current cursor with boundary preference
    let pos = findTokenPosition(rawInput, rawToken, cursor, false);

    // Step 2: Fallback 1 - Case-insensitive search from cursor
    if (pos === -1) {
      pos = findTokenPosition(rawInput, rawToken, cursor, true);
    }

    // Step 3: Fallback 2 - Strip trailing punctuation if token was normalized with/without punctuation
    if (pos === -1) {
      const cleanToken = rawToken.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").trim();
      if (cleanToken.length > 0) {
        const cleanPos = findTokenPosition(rawInput, cleanToken, cursor, true);
        if (cleanPos !== -1) {
          pos = cleanPos;
          matchLen = cleanToken.length;
          expectedText = cleanToken;
        }
      }
    }

    // Evaluation of match
    if (pos !== -1) {
      const startIdx = pos;
      const endIdx = pos + matchLen;

      // Verification: Check substring equality (or case-insensitive equality in fallback)
      const matchedSubstring = rawInput.substring(startIdx, endIdx);
      if (
        matchedSubstring === expectedText ||
        matchedSubstring.toLowerCase() === expectedText.toLowerCase()
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
