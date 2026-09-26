const test = require('node:test');
const assert = require('node:assert');

// Real import of production TypeScript code
let alignTokenSpans;

test.before(async () => {
  const mod = await import('../lib/span-aligner.ts');
  alignTokenSpans = mod.alignTokenSpans;
});

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
    { raw: "asap" }
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

test('REGRESSION: sub-word false match ("Remember me") when cursor precedes container word', () => {
  // If input has "Please remember me", token "me" must align to standalone "me", not "re-me-mber"
  const input = "Please remember me";
  const tokens = [
    { raw: "me" }
  ];

  const result = alignTokenSpans(input, tokens);
  assert.strictEqual(result.all_spans_valid, true);
  // "Please remember me": "me" is at index 16..18
  assert.strictEqual(result.tokens[0].start_idx, 16);
  assert.strictEqual(result.tokens[0].end_idx, 18);
  assert.strictEqual(input.substring(result.tokens[0].start_idx, result.tokens[0].end_idx), "me");
});

test('REGRESSION: Fallback-2 handles token with trailing punctuation when rawInput has none', () => {
  const input = "parcel please";
  const tokens = [
    { raw: "parcel," },
    { raw: "please" }
  ];

  const result = alignTokenSpans(input, tokens);
  assert.strictEqual(result.all_spans_valid, true);
  assert.strictEqual(result.tokens[0].start_idx, 0);
  assert.strictEqual(result.tokens[0].end_idx, 6);
  assert.strictEqual(input.substring(result.tokens[0].start_idx, result.tokens[0].end_idx), "parcel");
});
