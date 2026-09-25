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
}

export function IntegrityAudit({ verification }: IntegrityAuditProps) {
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  const checks = [
    {
      id: "schema",
      label: "Schema validity",
      passed: verification.schema_valid,
      desc: "Structured JSON output conforms strictly to declared TypeScript contract",
      icon: FileCheck,
    },
    {
      id: "span",
      label: "Span alignment",
      passed: verification.span_alignment_valid,
      desc: "Character offsets deterministically aligned via forward rolling cursor",
      icon: Crosshair,
    },
    {
      id: "numbers",
      label: "Numeric parity",
      passed: verification.numeric_parity,
      desc: "Quantitative numbers and currency amounts preserved with zero loss",
      icon: Binary,
    },
    {
      id: "negation",
      label: "Negation parity",
      passed: verification.negation_parity,
      desc: "Polarity markers preserved without semantic drift or inversion",
      icon: Ban,
    },
    {
      id: "entities",
      label: "Entity preservation",
      passed: verification.entities_preserved,
      desc: "Extracted operational entities grounded in verified raw token spans",
      icon: Tag,
    },
  ];

  const allPassed = checks.every((c) => c.passed);
  const score = verification.integrity_score ?? (allPassed ? 100 : 75);

  return (
    <div className="space-y-2">
      {/* Deterministic Integrity Gate Panel */}
      <div className="rounded-xl border border-white/[0.08] bg-[#10121a] p-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Deterministic Integrity Gate
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-zinc-900 border border-white/[0.06] text-zinc-400">
                Post-LLM Assertion Engine
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Rule assertions evaluated deterministically on model generation before downstream dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <div className="px-2.5 py-1 rounded-md bg-[#090a0f] border border-white/[0.08] flex items-baseline gap-1.5 font-mono">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Score:</span>
              <span
                className={`text-sm font-bold ${
                  score >= 90 ? "text-emerald-400" : score >= 70 ? "text-amber-400" : "text-rose-400"
                }`}
              >
                {score} / 100
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAuditLogs(!showAuditLogs)}
              className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 px-2.5 py-1 rounded-md bg-[#090a0f] border border-white/[0.08] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Terminal className="w-3 h-3 text-zinc-500" />
              <span>{showAuditLogs ? "Hide Log" : "Audit Trail"}</span>
              {showAuditLogs ? (
                <ChevronUp className="w-3 h-3 text-zinc-500" />
              ) : (
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              )}
            </button>
          </div>
        </div>

        {/* Compact Verification Rows */}
        <div className="divide-y divide-white/[0.04]">
          {checks.map((check) => {
            const Icon = check.icon;
            return (
              <div
                key={check.id}
                className="py-2.5 flex items-center justify-between gap-4 text-xs hover:bg-white/[0.01] px-1 rounded transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      check.passed
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {check.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <span className="font-mono font-semibold text-zinc-200 text-xs shrink-0">
                      {check.label}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-sans truncate">
                      {check.desc}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold shrink-0 border ${
                    check.passed
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {check.passed ? "PASS" : "FAIL"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Expandable Forensic Audit Trail */}
        {showAuditLogs && (
          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              <span>Deterministic Assertion Log</span>
              <span>Total Assertions: {verification.audit_logs?.length || 0}</span>
            </div>

            <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06] font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
              {verification.audit_logs && verification.audit_logs.length > 0 ? (
                verification.audit_logs.map((log, idx) => {
                  const isPass = log.startsWith("[PASS]");
                  const isFail = log.startsWith("[FAIL]");
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 leading-relaxed ${
                        isPass
                          ? "text-emerald-300/80"
                          : isFail
                          ? "text-rose-400 font-bold"
                          : "text-amber-300/80"
                      }`}
                    >
                      <span className="select-none text-zinc-600 w-5 text-right shrink-0">
                        {idx + 1}.
                      </span>
                      <span>{log}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-zinc-600 italic">No specific audit log entries.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
