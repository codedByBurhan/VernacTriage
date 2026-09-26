"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RotateCw } from "lucide-react";
import { runDeterministicVerification } from "@/lib/verifier";
import { alignTokenSpans } from "@/lib/span-aligner";
import { VerificationReport } from "@/lib/types";

const AUDIT_SAMPLE = {
  text: "Bhai kl parcel deliver ni hua, 4200 rupees deduct ho gye, cancel it b4 5pm",
  tokens: [
    { raw: "Bhai", is_negation: false, normalized_source: "Brother", detected_language: "hi" as const, classification: "transliterated" as const },
    { raw: "kl", is_negation: false, normalized_source: "yesterday", detected_language: "hi" as const, classification: "phonetic_ear" as const },
    { raw: "parcel", is_negation: false, normalized_source: "parcel", detected_language: "en" as const, classification: "standard" as const },
    { raw: "deliver", is_negation: false, normalized_source: "deliver", detected_language: "en" as const, classification: "standard" as const },
    { raw: "ni", is_negation: true, normalized_source: "not", detected_language: "hi" as const, classification: "phonetic_ear" as const },
    { raw: "hua,", is_negation: false, normalized_source: "happened", detected_language: "hi" as const, classification: "transliterated" as const },
    { raw: "4200", is_negation: false, normalized_source: "4200", detected_language: "en" as const, classification: "standard" as const },
    { raw: "rupees", is_negation: false, normalized_source: "rupees", detected_language: "en" as const, classification: "standard" as const },
    { raw: "deduct", is_negation: false, normalized_source: "deducted", detected_language: "en" as const, classification: "standard" as const },
    { raw: "ho", is_negation: false, normalized_source: "been", detected_language: "hi" as const, classification: "transliterated" as const },
    { raw: "gye,", is_negation: false, normalized_source: "done", detected_language: "hi" as const, classification: "transliterated" as const },
    { raw: "cancel", is_negation: false, normalized_source: "cancel", detected_language: "en" as const, classification: "standard" as const },
    { raw: "it", is_negation: false, normalized_source: "it", detected_language: "en" as const, classification: "standard" as const },
    { raw: "b4", is_negation: false, normalized_source: "before", detected_language: "en" as const, classification: "alphanumeric_sub" as const },
    { raw: "5pm", is_negation: false, normalized_source: "5:00 PM", detected_language: "en" as const, classification: "standard" as const },
  ],
  canonicalScript: "भाई कल पार्सल डिलीवर नहीं हुआ, 4200 रुपये कट गए, 5:00 PM से पहले कैंसिल करें",
  englishTranslation: "Brother, parcel was not delivered yesterday, 4200 rupees were deducted, please cancel it before 5:00 PM.",
  intent: "REFUND_REQUEST",
  entities: [
    { type: "AMOUNT", value: "4200 rupees" },
    { type: "TIME_DEADLINE", value: "5:00 PM" },
  ],
};

function executeVerification(): VerificationReport {
  const spanResult = alignTokenSpans(AUDIT_SAMPLE.text, AUDIT_SAMPLE.tokens);
  return runDeterministicVerification(
    AUDIT_SAMPLE.text,
    {
      original_text: AUDIT_SAMPLE.text,
      detected_languages: ["Hindi", "English"],
      phenomena: ["Code-Switching", "Phonetic Abbreviations"],
      tokens: spanResult.tokens,
      canonical_script: AUDIT_SAMPLE.canonicalScript,
      english_translation: AUDIT_SAMPLE.englishTranslation,
      intent: { label: AUDIT_SAMPLE.intent, confidence: 1.0 },
      entities: AUDIT_SAMPLE.entities,
    },
    spanResult
  );
}

export function VerificationSection() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<VerificationReport>(executeVerification);

  const handleRunAudit = () => {
    setIsAuditing(true);
    // Execute real verification on sample payload
    const report = executeVerification();
    setAuditReport(report);
    setIsAuditing(false);
  };

  const assertionChecks = [
    {
      id: "numeric",
      name: "Numeric Invariance",
      assertion: "assert(source_numerals == target_numerals)",
      detail: "All numerical quantities, prices (4200), and timestamps (5pm) preserved without loss or rounding.",
      passed: auditReport.numeric_parity,
      proof: auditReport.numeric_parity
        ? "[PASS] Parity match: ['4200', '5pm'] ≡ ['4200', '5:00 PM']"
        : "[FAIL] Numeric discrepancy detected",
    },
    {
      id: "negation",
      name: "Negation Parity",
      assertion: "assert(negation_in_source == negation_in_target)",
      detail: "Dialectal negation markers ('ni', 'ma') must invert polarity in standardized English translation.",
      passed: auditReport.negation_parity,
      proof: auditReport.negation_parity
        ? "[PASS] Polarity preserved: 'ni hua' → 'was not delivered'"
        : "[FAIL] Polarity inversion detected",
    },
    {
      id: "ast_span",
      name: "AST Span Continuity",
      assertion: "assert(all(0 <= t.start_idx < t.end_idx <= len(raw)))",
      detail: "Every token retains exact character byte offsets against the source input buffer with zero drift.",
      passed: auditReport.span_alignment_valid,
      proof: auditReport.span_alignment_valid
        ? "[PASS] Offset bounds aligned: 15/15 tokens grounded without index gaps"
        : "[FAIL] Offset alignment mismatch",
    },
    {
      id: "entity",
      name: "Entity Preservation",
      assertion: "assert(extracted_entities.issubset(ground_truth))",
      detail: "Key business entities (actions, timeframes, items) are grounded directly against source text.",
      passed: auditReport.entities_preserved,
      proof: auditReport.entities_preserved
        ? "[PASS] Grounding verified: 2 extracted entities grounded in source/target"
        : "[FAIL] Ungrounded entity detected",
    },
    {
      id: "schema",
      name: "Schema Validity",
      assertion: "assert(validate_json_schema(payload, TriageContract))",
      detail: "Payload strictly conforms to deterministic TypeScript interface with typed fields.",
      passed: auditReport.schema_valid,
      proof: auditReport.schema_valid
        ? "[PASS] Strict adherence: 0 schema violations detected"
        : "[FAIL] Schema contract violation",
    },
  ];

  return (
    <section id="verification" className="py-20 sm:py-28 border-t border-[#27272a] bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#10b981]">
              <Image
                src="/assets/icon-deterministic-audit.png"
                alt="Deterministic Audit"
                width={16}
                height={16}
                className="h-4 w-auto object-contain"
              />
              <span className="uppercase tracking-wider">MATHEMATICAL GUARANTEES</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#fafafa] leading-tight">
              Deterministic Integrity Gate
            </h2>

            <p className="text-base text-[#a1a1aa] leading-relaxed">
              Large language models produce probabilistic distributions. Enterprise infrastructure requires
              deterministic invariants. Before any payload leaves VernacTriage, it must satisfy five non-negotiable assertions.
            </p>
          </div>

          {/* Trigger button */}
          <button
            type="button"
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-4 py-2 rounded-lg border border-[#27272a] hover:border-[#3f3f46] bg-[#0f0f12] text-[#fafafa] font-mono text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 shrink-0 self-start md:self-auto"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin text-[#10b981]" : ""}`} />
            <span>{isAuditing ? "Executing Assertions..." : "Run Invariant Audit"}</span>
          </button>
        </div>

        {/* Verification Console Card */}
        <div className="rounded-2xl border border-[#27272a] bg-[#0f0f12] p-5 sm:p-7 space-y-6 shadow-xl">
          {/* Top telemetry row */}
          <div className="flex items-center justify-between pb-4 border-b border-[#27272a] text-xs font-mono">
            <div className="flex items-center gap-2 text-[#71717a]">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-[#fafafa] font-semibold">VERIFICATION_GATE // SUITE_v1</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#71717a]">Integrity Score:</span>
              <span className="font-bold text-sm text-[#10b981] px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30">
                {auditReport.integrity_score} / 100
              </span>
            </div>
          </div>

          {/* Checks Stack */}
          <div className="space-y-3 font-mono text-xs">
            {assertionChecks.map((check) => (
              <div
                key={check.id}
                className="p-4 rounded-xl border transition-all bg-[#09090b] border-[#27272a]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#27272a]/50">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        check.passed
                          ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}
                    >
                      {check.passed ? "PASS" : "FAIL"}
                    </span>
                    <span className="font-semibold text-sm text-[#fafafa]">{check.name}</span>
                  </div>

                  <code className="text-[11px] text-[#71717a] font-mono">{check.assertion}</code>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <span className="text-[#a1a1aa] font-sans">{check.detail}</span>
                  <span
                    className={`font-mono shrink-0 ${
                      check.passed ? "text-[#10b981]" : "text-rose-400"
                    }`}
                  >
                    {check.proof}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Live Audit Log Stream */}
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[11px] space-y-1.5">
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">
              Active Invariant Verification Trail:
            </span>
            {auditReport.audit_logs.map((log, index) => (
              <div key={index} className="text-zinc-400">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
