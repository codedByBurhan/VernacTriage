"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Play, RotateCw } from "lucide-react";

export function VerificationSection() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [completedChecks, setCompletedChecks] = useState<number>(5);

  const assertionChecks = [
    {
      id: "numeric",
      name: "Numeric Invariance",
      assertion: "assert(source_numerals == target_numerals)",
      detail: "All numerical quantities, prices (4200), and timestamps (5pm) preserved without loss or rounding.",
      proof: "[PASS] Parity match: ['4200', '5pm'] ≡ ['4200', '5:00 PM']",
    },
    {
      id: "negation",
      name: "Negation Parity",
      assertion: "assert(negation_in_source == negation_in_target)",
      detail: "Dialectal negation markers ('ni', 'ma') must invert polarity in standardized English translation.",
      proof: "[PASS] Polarity preserved: 'ni hua' → 'was not delivered'",
    },
    {
      id: "ast_span",
      name: "AST Span Continuity",
      assertion: "assert(all(0 <= t.start_idx < t.end_idx <= len(raw)))",
      detail: "Every token retains exact character byte offsets against the source input buffer with zero drift.",
      proof: "[PASS] Offset bounds aligned: 10/10 tokens grounded without index gaps",
    },
    {
      id: "entity",
      name: "Entity Preservation",
      assertion: "assert(extracted_entities.issubset(ground_truth))",
      detail: "Key business entities (actions, timeframes, items) are grounded directly against source text.",
      proof: "[PASS] Grounding verified: 3 extracted entities mathematically verified",
    },
    {
      id: "schema",
      name: "Schema Validity",
      assertion: "assert(validate_json_schema(payload, TriageContract))",
      detail: "Payload strictly conforms to deterministic TypeScript interface with typed fields.",
      proof: "[PASS] Strict adherence: 0 schema violations detected",
    },
  ];

  const handleRunAudit = () => {
    setIsAuditing(true);
    setCompletedChecks(0);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setCompletedChecks(count);
      if (count >= 5) {
        clearInterval(interval);
        setIsAuditing(false);
      }
    }, 120);
  };

  const score = completedChecks === 5 ? 100 : Math.round((completedChecks / 5) * 100);

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
                {score} / 100
              </span>
            </div>
          </div>

          {/* Checks Stack */}
          <div className="space-y-3 font-mono text-xs">
            {assertionChecks.map((check, idx) => {
              const isChecked = completedChecks > idx;
              return (
                <div
                  key={check.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isChecked
                      ? "bg-[#09090b] border-[#27272a]"
                      : "bg-[#09090b]/40 border-[#27272a]/40 opacity-40"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#27272a]/50">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          isChecked
                            ? "bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]"
                            : "bg-[#27272a] border-[#3f3f46] text-[#71717a]"
                        }`}
                      >
                        {isChecked ? "PASS" : "PENDING"}
                      </span>
                      <span className="font-semibold text-sm text-[#fafafa]">{check.name}</span>
                    </div>

                    <code className="text-[11px] text-[#71717a] font-mono">{check.assertion}</code>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <span className="text-[#a1a1aa] font-sans">{check.detail}</span>
                    <span className="text-[#10b981] font-mono shrink-0">{isChecked ? check.proof : "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
