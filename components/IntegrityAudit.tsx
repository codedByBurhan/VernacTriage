"use client";

import React, { useState } from "react";
import { VerificationReport } from "@/lib/types";
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Binary,
  Ban,
  Tag,
  Crosshair,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface IntegrityAuditProps {
  verification: VerificationReport;
}

export function IntegrityAudit({ verification }: IntegrityAuditProps) {
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  const checks = [
    {
      id: "schema",
      label: "Schema Valid",
      passed: verification.schema_valid,
      desc: "Structured JSON contract conforms to specification",
      icon: FileCheck,
    },
    {
      id: "span",
      label: "Span Alignment",
      passed: verification.span_alignment_valid,
      desc: "Character offsets deterministically aligned via rolling cursor",
      icon: Crosshair,
    },
    {
      id: "numbers",
      label: "Numeric Parity",
      passed: verification.numeric_parity,
      desc: "Quantitative numbers & amounts preserved across output",
      icon: Binary,
    },
    {
      id: "negation",
      label: "Negation Parity",
      passed: verification.negation_parity,
      desc: "Semantic polarity markers preserved without polarity drift",
      icon: Ban,
    },
    {
      id: "entities",
      label: "Entity Preservation",
      passed: verification.entities_preserved,
      desc: "Extracted entities grounded in input context",
      icon: Tag,
    },
  ];

  const allPassed = checks.every((c) => c.passed);
  const score = verification.integrity_score ?? (allPassed ? 100 : 75);

  const getScoreColor = (val: number) => {
    if (val >= 90) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (val >= 70) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    return "text-rose-400 border-rose-500/40 bg-rose-500/10";
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-zinc-200 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Section D — Deterministic Integrity Audit
        </span>
        <span className="text-[11px] font-mono text-zinc-500">
          Post-LLM Assertion Engine
        </span>
      </div>

      <div
        className={`rounded-2xl p-5 border transition-all ${
          allPassed
            ? "bg-emerald-950/20 border-emerald-500/30"
            : "bg-amber-950/20 border-amber-500/40"
        }`}
      >
        {/* Banner with Integrity Score Gauge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-xl border ${
                allPassed
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              {allPassed ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm sm:text-base font-bold font-mono tracking-tight ${
                    allPassed ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  {allPassed
                    ? "✓ DETERMINISTIC INTEGRITY VERIFIED"
                    : "⚠ INTEGRITY AUDIT FLAGGED"}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    allPassed
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {checks.filter((c) => c.passed).length} / {checks.length} ASSERTIONS
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Deterministic rule assertions applied to the LLM output without relying on self-evaluation.
              </p>
            </div>
          </div>

          {/* Integrity Score Badge & Audit Toggle */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${getScoreColor(score)}`}>
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono">
                Integrity Score:
              </span>
              <span className="text-lg font-black font-mono">
                {score}/100
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAuditLogs(!showAuditLogs)}
              className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{showAuditLogs ? "Hide Audit Logs" : "View Audit Logs"}</span>
              {showAuditLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 5 Check Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-4">
          {checks.map((check) => {
            const Icon = check.icon;
            return (
              <div
                key={check.id}
                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                  check.passed
                    ? "bg-black/40 border-emerald-500/20"
                    : "bg-amber-950/40 border-amber-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Icon className={`w-3.5 h-3.5 ${check.passed ? "text-emerald-400" : "text-amber-400"}`} />
                    <span className="text-xs font-semibold">{check.label}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold ${
                      check.passed
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {check.passed ? "PASS" : "FAIL"}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  {check.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Expandable Audit Log Details */}
        {showAuditLogs && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
            <span className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider block">
              Deterministic Verification Audit Trail
            </span>
            <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
              {verification.audit_logs && verification.audit_logs.length > 0 ? (
                verification.audit_logs.map((log, idx) => {
                  const isPass = log.startsWith("[PASS]");
                  const isFail = log.startsWith("[FAIL]");
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 leading-relaxed ${
                        isPass
                          ? "text-emerald-300/90"
                          : isFail
                          ? "text-rose-400 font-bold"
                          : "text-amber-300/90"
                      }`}
                    >
                      <span className="select-none text-zinc-600">{idx + 1}.</span>
                      <span>{log}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-zinc-500 italic">No specific audit messages logged.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
