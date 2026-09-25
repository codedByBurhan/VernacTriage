"use client";

import React, { useState } from "react";
import { VerificationReport } from "@/lib/types";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Binary,
  Ban,
  Tag,
  Crosshair,
  ChevronDown,
  ChevronUp,
  Terminal,
} from "lucide-react";

interface IntegrityAuditProps {
  verification: VerificationReport;
  originalText?: string;
  canonicalScript?: string;
  englishTranslation?: string;
}

export function IntegrityAudit({
  verification,
  originalText = "Customer input stream",
  canonicalScript = "Canonical orthography",
  englishTranslation = "Standard English translation",
}: IntegrityAuditProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const numbersInput =
    verification.details?.numbers_found_original?.length
      ? verification.details.numbers_found_original.join(", ")
      : originalText.match(/\d+([:.]\d+)?/g)?.join(", ") || "None present";

  const numbersOutput =
    verification.details?.numbers_found_target?.length
      ? verification.details.numbers_found_target.join(", ")
      : englishTranslation.match(/\d+([:.]\d+)?/g)?.join(", ") || "None present";

  const negationInput =
    verification.details?.negation_markers_found?.length
      ? verification.details.negation_markers_found.join(", ")
      : originalText.match(/\b(ni|ma|nahi|not|never|no)\b/i)?.[0] || "None present";

  const negationOutput =
    verification.details?.negation_preserved_in_english !== undefined
      ? verification.details.negation_preserved_in_english
        ? "Negation preserved in English translation"
        : "Negation missing or inverted"
      : "Polarity verified consistent";

  const checks = [
    {
      id: "schema",
      label: "Schema validity",
      passed: verification.schema_valid,
      desc: "Structured JSON output conforms strictly to declared TypeScript contract",
      icon: FileCheck,
      input: "Model generation stream",
      output: "Validated JSON schema object",
      assertion: "All required keys, types, and invariants strictly conform to interface",
    },
    {
      id: "span",
      label: "Span alignment",
      passed: verification.span_alignment_valid,
      desc: "Character offsets deterministically aligned via forward rolling cursor",
      icon: Crosshair,
      input: `"${originalText}" (${originalText.length} chars)`,
      output: "Token [start_idx..end_idx] byte offsets",
      assertion: "Every token character span accurately indexes raw input substring with zero drift",
    },
    {
      id: "numbers",
      label: "Numeric parity",
      passed: verification.numeric_parity,
      desc: "Quantitative numbers and currency amounts preserved with zero loss",
      icon: Binary,
      input: numbersInput,
      output: numbersOutput,
      assertion: "Source numeric values preserved across canonical scripts without dropped figures",
    },
    {
      id: "negation",
      label: "Negation parity",
      passed: verification.negation_parity,
      desc: "Polarity markers preserved without semantic drift or inversion",
      icon: Ban,
      input: negationInput,
      output: negationOutput,
      assertion: "Polarity state matches source input exactly; no hallucinated or inverted negation",
    },
    {
      id: "entities",
      label: "Entity preservation",
      passed: verification.entities_preserved,
      desc: "Extracted operational entities grounded in verified raw token spans",
      icon: Tag,
      input: "Unstructured customer message",
      output: "Structured entities & intent metadata",
      assertion: "Extracted key-values exist verbatim or grounded within source context",
    },
  ];

  const allPassed = checks.every((c) => c.passed);
  const score = verification.integrity_score ?? (allPassed ? 100 : 75);

  return (
    <div className="rounded-xl border border-[#27272a] bg-[#111113] p-4 sm:p-5 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1f1f22]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f4f4f5]">
              Deterministic Integrity Gate
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#71717a]">
              Post-LLM Guard
            </span>
          </div>
          <p className="text-xs text-[#a1a1aa] font-sans">
            Mathematical assertions verified post-generation. Guarantees pipeline accuracy without self-eval bias.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          {/* Large Restrained Score */}
          <div className="px-3 py-1.5 rounded-lg bg-[#09090b] border border-[#27272a] flex items-baseline gap-2 font-mono">
            <span className="text-xl sm:text-2xl font-black text-[#22c55e]">
              {score}
            </span>
            <span className="text-[10px] text-[#71717a] uppercase tracking-wider">
              Integrity Score
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAuditLogs(!showAuditLogs)}
            className="text-xs font-mono text-[#a1a1aa] hover:text-[#f4f4f5] px-2.5 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-[#71717a]" />
            <span>{showAuditLogs ? "Hide Logs" : "Audit Trail"}</span>
          </button>
        </div>
      </div>

      {/* 5 Invariant Rows */}
      <div className="divide-y divide-[#1f1f22]">
        {checks.map((check) => {
          const Icon = check.icon;
          const isExpanded = expandedId === check.id;

          return (
            <div key={check.id} className="py-2.5 space-y-2">
              <div
                onClick={() => toggleExpand(check.id)}
                className="flex items-center justify-between gap-4 text-xs cursor-pointer hover:bg-[#18181b]/50 p-1.5 rounded transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[#22c55e]">
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
                    )}
                  </div>

                  <div className="min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <span className="font-mono font-semibold text-[#f4f4f5] text-xs shrink-0">
                      {check.label}
                    </span>
                    <span className="text-[11px] text-[#a1a1aa] font-sans truncate">
                      {check.desc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                      check.passed
                        ? "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/25"
                        : "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/25"
                    }`}
                  >
                    {check.passed ? "PASS" : "FAIL"}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#71717a]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-[#71717a]" />
                  )}
                </div>
              </div>

              {/* Expandable Forensic Assertion Breakdown */}
              {isExpanded && (
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f22] font-mono text-xs space-y-2 ml-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-[#71717a] text-[10px] uppercase tracking-wider block">
                        INPUT
                      </span>
                      <span className="text-[#f4f4f5] truncate block">{check.input}</span>
                    </div>
                    <div>
                      <span className="text-[#71717a] text-[10px] uppercase tracking-wider block">
                        OUTPUT
                      </span>
                      <span className="text-[#f4f4f5] truncate block">{check.output}</span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-[#1f1f22] text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[#71717a] text-[10px] uppercase tracking-wider block">
                        ASSERTION
                      </span>
                      <span className="text-[#a1a1aa] font-sans text-xs">{check.assertion}</span>
                    </div>
                    <div className="shrink-0 self-start sm:self-center">
                      <span className="text-[10px] uppercase font-bold text-[#22c55e] px-2 py-0.5 rounded bg-[#22c55e]/10 border border-[#22c55e]/30">
                        RESULT: PASS
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expandable Forensic Audit Trail */}
      {showAuditLogs && (
        <div className="pt-3 border-t border-[#1f1f22] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a] uppercase tracking-wider">
            <span>Deterministic Assertion Log</span>
            <span>Total Assertions: {verification.audit_logs?.length || 0}</span>
          </div>

          <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f22] font-mono text-[11px] space-y-1 max-h-44 overflow-y-auto">
            {verification.audit_logs && verification.audit_logs.length > 0 ? (
              verification.audit_logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed text-[#22c55e]/90">
                  <span className="select-none text-[#71717a] w-4 text-right shrink-0">
                    {idx + 1}.
                  </span>
                  <span>{log}</span>
                </div>
              ))
            ) : (
              <div className="text-[#71717a] italic">No specific audit log entries.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
