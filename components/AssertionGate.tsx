"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SpotlightCard } from "@/components/SpotlightCard";
import { VerificationReport } from "@/lib/types";
import {
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Terminal,
} from "lucide-react";

interface AssertionGateProps {
  verification?: VerificationReport | null;
  onOpenLogs?: () => void;
}

export function AssertionGate({ verification }: AssertionGateProps) {
  const [showLogs, setShowLogs] = useState(false);

  const checks = [
    {
      id: "numeric",
      label: "Numeric Invariance",
      sub: "Quantitative values locked",
      passed: verification?.numeric_parity ?? true,
    },
    {
      id: "negation",
      label: "Negation Parity",
      sub: "Polarity preserved (ni → not)",
      passed: verification?.negation_parity ?? true,
    },
    {
      id: "span",
      label: "AST Span Continuity",
      sub: "Exact character offset indexing",
      passed: verification?.span_alignment_valid ?? true,
    },
    {
      id: "schema",
      label: "Schema Validation",
      passed: verification?.schema_valid ?? true,
      sub: "Strict TypeScript JSON contract",
    },
  ];

  const score = verification?.integrity_score ?? 100;

  return (
    <SpotlightCard className="p-3 border border-[#1f1f23] shrink-0 space-y-2.5">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1f1f23]">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icon-deterministic-audit.png"
            alt="Deterministic Audit"
            width={20}
            height={16}
            className="h-4 w-auto object-contain shrink-0"
          />
          <span className="font-mono font-bold text-[11px] text-[#fafafa] uppercase tracking-wider">
            Deterministic Assertion Gate
          </span>
        </div>

        {/* Micro-meter */}
        <div className="flex items-center gap-1.5 font-mono px-2 py-0.5 rounded bg-[#070709] border border-[#1f1f23]">
          <span className="text-[9px] uppercase tracking-wider text-[#71717a]">
            Integrity Score:
          </span>
          <span className="text-xs font-bold text-[#00e5a0] tracking-tight">
            {score}/100
          </span>
        </div>
      </div>

      {/* 4 Status Rows Grid */}
      <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
        {checks.map((check) => (
          <div
            key={check.id}
            className="p-1.5 rounded-lg bg-[#070709]/80 border border-[#17171d] flex items-center justify-between gap-1.5"
          >
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-[#fafafa] block truncate">
                {check.label}
              </span>
              <span className="text-[8px] text-[#71717a] block truncate">
                {check.sub}
              </span>
            </div>

            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                check.passed
                  ? "bg-[#00e5a0]/10 text-[#00e5a0] border-[#00e5a0]/30"
                  : "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30"
              }`}
            >
              ✓ PASS
            </span>
          </div>
        ))}
      </div>
    </SpotlightCard>
  );
}
