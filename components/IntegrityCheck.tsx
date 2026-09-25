"use client";

import React, { useState } from "react";
import { VerificationResult } from "@/lib/types";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  Binary,
  Ban,
  Tag,
  ChevronDown,
  ChevronUp,
  Cpu,
} from "lucide-react";

interface IntegrityCheckProps {
  verification: VerificationResult;
}

export function IntegrityCheck({ verification }: IntegrityCheckProps) {
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  const allPassed =
    verification.entities_preserved &&
    verification.numbers_preserved &&
    verification.negation_preserved &&
    verification.schema_valid;

  const checks = [
    {
      id: "entities",
      label: "Entity Preservation",
      passed: verification.entities_preserved,
      desc: "Structured business entities validated for completeness",
      icon: Tag,
    },
    {
      id: "numbers",
      label: "Number Preservation",
      passed: verification.numbers_preserved,
      desc: "Numeric sequences (times, amounts, IDs) verified across output",
      icon: Binary,
    },
    {
      id: "negation",
      label: "Negation Preservation",
      passed: verification.negation_preserved,
      desc: "Polarity markers (ni, not, mish) verified against polarity drift",
      icon: Ban,
    },
    {
      id: "schema",
      label: "Output Schema Valid",
      passed: verification.schema_valid,
      desc: "Strongly typed JSON contract parsed without hallucination drift",
      icon: FileCheck,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-zinc-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Section D — AI Integrity Check (Deterministic Guard)
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
        {/* Overall Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
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
                    : "⚠ VERIFICATION ISSUE DETECTED"}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    allPassed
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {allPassed ? "4 / 4 PASSED" : "AUDIT FLAGGED"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Deterministic rule assertions applied to the LLM output without relying on self-evaluation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAuditLogs(!showAuditLogs)}
            className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 flex items-center gap-1.5 self-start sm:self-center transition-colors cursor-pointer"
          >
            <span>{showAuditLogs ? "Hide Audit Details" : "View Audit Details"}</span>
            {showAuditLogs ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* 4 Check Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {checks.map((check) => {
            const Icon = check.icon;
            return (
              <div
                key={check.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  check.passed
                    ? "bg-black/40 border-emerald-500/20"
                    : "bg-rose-950/20 border-rose-500/40"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-1.5 rounded-md ${
                        check.passed
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {check.passed ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PASSED
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        FAILED
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200 font-mono pt-1">
                    {check.label}
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    {check.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expandable Audit Logs */}
        {showAuditLogs && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-300 font-mono flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Rule-Based Verification Engine Report
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                TypeScript Deterministic Guard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                  Numeric Sequence Audit
                </span>
                <p className="text-zinc-300 font-mono text-[11px]">
                  Original: [
                  {(verification.details?.numbers_found_original || []).join(", ") || "None detected"}
                  ] → Target: [
                  {(verification.details?.numbers_found_target || []).join(", ") || "None detected"}
                  ]
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                  Negation Polarity Audit
                </span>
                <p className="text-zinc-300 font-mono text-[11px]">
                  Markers: [
                  {(verification.details?.negation_markers_found || []).join(", ") || "None detected"}
                  ] | Retained:{" "}
                  {verification.details?.negation_preserved_in_english ? "True" : "N/A"}
                </p>
              </div>
            </div>

            {verification.details?.issues && verification.details.issues.length > 0 && (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 space-y-1">
                <span className="font-bold block">Flagged Discrepancies:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {verification.details.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[11px] text-zinc-500 italic bg-black/30 p-2.5 rounded-lg border border-white/5 leading-relaxed">
              Note: This verification layer uses deterministic heuristic checks rather than semantic embeddings to ensure mission-critical fidelity on numbers, entities, and polarities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
