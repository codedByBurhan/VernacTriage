const test = require('node:test');
const assert = require('node:assert');

// In modern Node, we can require compiled or transpile, or import ts via tsx or run direct JS logic.
// Let's create an inline or imported test.
function alignTokenSpans(rawInput, tokens) {
  const auditLogs = [];
  let cursor = 0;
  let alignedCount = 0;
  let unalignedCount = 0;

  const alignedTokens = tokens.map((originalToken, index) => {
    const token = { ...originalToken };
    const rawToken = token.raw;

    if (!rawToken || rawToken.trim() === '') {
      auditLogs.push(`[WARN] Token at index ${index} has empty raw value.`);
      unalignedCount++;
      return { ...token, start_idx: undefined, end_idx: undefined };
    }

    let pos = rawInput.indexOf(rawToken, cursor);

    if (pos === -1) {
      const lowerInput = rawInput.toLowerCase();
      const lowerToken = rawToken.toLowerCase();
      pos = lowerInput.indexOf(lowerToken, cursor);
    }

    if (pos === -1) {
      const cleanToken = rawToken.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '').trim();
      if (cleanToken.length > 0) {
        const cleanPos = rawInput.indexOf(cleanToken, cursor);
        if (cleanPos !== -1) {
          pos = cleanPos;
        }
      }
    }

    if (pos !== -1) {
      const startIdx = pos;
      const endIdx = pos + rawToken.length;
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

    token.start_idx = undefined;
    token.end_idx = undefined;
    unalignedCount++;
    auditLogs.push(
      `[FAIL] Span alignment failed for token "${rawToken}" at cursor ${cursor}.`
    );
    return token;
  });

  const allSpansValid = unalignedCount === 0 && alignedCount === tokens.length;
  return {
    tokens: alignedTokens,
    all_spans_valid: allSpansValid,
    aligned_count: alignedCount,
    unaligned_count: unalignedCount,
    audit_logs: auditLogs,
  };
}

test('repeated tokens / duplicate words: "Wait for me parcel me rakh do"', () => {
  const input = "Wait for me parcel me rakh do";
  const tokens = [
    { raw: "Wait" },
    { raw: "for" },
    { raw: "me" },
    { raw: "parcel" },
    { raw: "me" },
    { raw: "rakh" },
    { raw: "do" }
  ];

  const result = alignTokenSpans(input, tokens);
  assert.strictEqual(result.all_spans_valid, true);

  // Check first "me"
  const firstMe = result.tokens[2];
  assert.strictEqual(firstMe.start_idx, 9);
  assert.strictEqual(firstMe.end_idx, 11);
  assert.strictEqual(input.substring(firstMe.start_idx, firstMe.end_idx), "me");

  // Check second "me"
  const secondMe = result.tokens[4];
  assert.strictEqual(secondMe.start_idx, 19);
  assert.strictEqual(secondMe.end_idx, 21);
  assert.strictEqual(input.substring(secondMe.start_idx, secondMe.end_idx), "me");
  assert.notStrictEqual(firstMe.start_idx, secondMe.start_idx);
});

test('punctuation handling and multiple spaces', () => {
  const input = "Bhai   kl   parcel, deliver ni hua!";
  const tokens = [
    { raw: "Bhai" },
    { raw: "kl" },
    { raw: "parcel" },
    { raw: "deliver" },
    { raw: "ni" },
    { raw: "hua" }
  ];

  const result = alignTokenSpans(input, tokens);
  assert.strictEqual(result.all_spans_valid, true);
  tokens.forEach((t, i) => {
    const aligned = result.tokens[i];
    assert.strictEqual(input.substring(aligned.start_idx, aligned.end_idx), t.raw);
  });
});

test('case preservation and case-insensitive fallback', () => {
  const input = "PLEASE confirm ASAP";
  const tokens = [
    { raw: "PLEASE" },
    { raw: "confirm" },
    { raw: "asap" } // lowercase in token, uppercase in input
  ];

  const result = alignTokenSpans(input, tokens);
  assert.strictEqual(result.all_spans_valid, true);
  assert.strictEqual(result.tokens[2].start_idx, 15);
  assert.strictEqual(result.tokens[2].end_idx, 19);
});

test('token sequences containing numbers and alphanumeric tokens', () => {
  const input = "Order #8831 deliver b4 8:00";
  const tokens = [
    { raw: "Order" },
    { raw: "#8831" },
    { raw: "deliver" },
    { raw: "b4" },
    { raw: "8:00" }
  ];

  const result = alignTokenSpans(input, tokens);
  assert.strictEqual(result.all_spans_valid, true);
  assert.strictEqual(input.substring(result.tokens[1].start_idx, result.tokens[1].end_idx), "#8831");
  assert.strictEqual(input.substring(result.tokens[4].start_idx, result.tokens[4].end_idx), "8:00");
});

test('failed alignment handles gracefully without silent offsets', () => {
  const input = "Simple delivery question";
  const tokens = [
    { raw: "Simple" },
    { raw: "phantom_word_not_in_text" },
    { raw: "question" }
  ];

  const result = alignTokenSpans(input, tokens);
  assert.strictEqual(result.all_spans_valid, false);
  assert.strictEqual(result.tokens[1].start_idx, undefined);
  assert.strictEqual(result.tokens[1].end_idx, undefined);
  assert.strictEqual(result.unaligned_count, 1);
});
