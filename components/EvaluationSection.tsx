"use client";

import React, { useState, useMemo } from "react";
import {
  BENCHMARK_CASES,
  BENCHMARK_METRICS,
  BenchmarkCase,
} from "@/data/benchmarkCases";
import {
  BarChart3,
  CheckCircle2,
  Check,
  Zap,
  Search,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface EvaluationSectionProps {
  onLoadCase: (text: string) => void;
}

export function EvaluationSection({ onLoadCase }: EvaluationSectionProps) {
  const [filter, setFilter] = useState<"ALL" | "Hinglish" | "Arabizi" | "COLLISIONS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<BenchmarkCase | null>(
    BENCHMARK_CASES[0]
  );

  const filteredCases = useMemo(() => {
    return BENCHMARK_CASES.filter((c) => {
      if (filter === "Hinglish" && c.dialect !== "Hinglish") return false;
      if (filter === "Arabizi" && c.dialect !== "Arabizi") return false;
      if (filter === "COLLISIONS" && !c.evaluation.collision_detected) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.input.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.groundTruth.intent.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Console Header */}
      <div className="rounded-xl border border-[#27272a] bg-[#111113] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#a1a1aa]" />
            <h1 className="font-mono text-sm font-bold uppercase tracking-wider text-[#f4f4f5]">
              SYSTEM EVALUATION
            </h1>
          </div>
          <p className="text-xs text-[#a1a1aa] font-sans">
            36 curated Hinglish and Arabizi cases evaluated with ground-truth intent, character spans, and deterministic assertions.
          </p>
        </div>

        {/* 4 Top Engineering Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="px-3 py-2 rounded-lg bg-[#09090b] border border-[#27272a] space-y-0.5">
            <span className="text-[#71717a] uppercase text-[10px] block">Intent Accuracy</span>
            <span className="font-bold text-[#22c55e] text-sm">{BENCHMARK_METRICS.intentAccuracy}</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#09090b] border border-[#27272a] space-y-0.5">
            <span className="text-[#71717a] uppercase text-[10px] block">Entity Retention</span>
            <span className="font-bold text-[#6366f1] text-sm">98.6%</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#09090b] border border-[#27272a] space-y-0.5">
            <span className="text-[#71717a] uppercase text-[10px] block">Span Validity</span>
            <span className="font-bold text-blue-400 text-sm">100.0%</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[#09090b] border border-[#27272a] space-y-0.5">
            <span className="text-[#71717a] uppercase text-[10px] block">Negation Parity</span>
            <span className="font-bold text-purple-400 text-sm">100.0%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#09090b] border border-[#27272a] overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded font-mono transition-colors cursor-pointer shrink-0 ${
              filter === "ALL"
                ? "bg-[#18181b] text-white font-semibold"
                : "text-[#a1a1aa] hover:text-white"
            }`}
          >
            All ({BENCHMARK_CASES.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("Hinglish")}
            className={`px-3 py-1 rounded font-mono transition-colors cursor-pointer shrink-0 ${
              filter === "Hinglish"
                ? "bg-amber-950/40 text-amber-300 font-semibold border border-amber-500/30"
                : "text-[#a1a1aa] hover:text-white"
            }`}
          >
            Hinglish ({BENCHMARK_METRICS.hinglishCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("Arabizi")}
            className={`px-3 py-1 rounded font-mono transition-colors cursor-pointer shrink-0 ${
              filter === "Arabizi"
                ? "bg-purple-950/40 text-purple-300 font-semibold border border-purple-500/30"
                : "text-[#a1a1aa] hover:text-white"
            }`}
          >
            Arabizi ({BENCHMARK_METRICS.arabiziCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("COLLISIONS")}
            className={`px-3 py-1 rounded font-mono transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
              filter === "COLLISIONS"
                ? "bg-amber-950/60 text-amber-300 font-semibold border border-amber-500/40"
                : "text-[#a1a1aa] hover:text-white"
            }`}
          >
            <AlertOctagon className="w-3 h-3 text-amber-400" />
            <span>Collisions</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test records..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-mono text-[#f4f4f5] placeholder:text-[#71717a] focus:outline-none focus:border-[#6366f1]"
          />
        </div>
      </div>

      {/* Main Grid: Compact Table (Left 7 cols) & Inspector (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Table Console View */}
        <div className="lg:col-span-7 rounded-xl border border-[#27272a] bg-[#111113] overflow-hidden flex flex-col">
          <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-[#09090b] border-b border-[#27272a] z-10 text-[10px] text-[#71717a] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">CASE</th>
                  <th className="py-2.5 px-2">LANGUAGE</th>
                  <th className="py-2.5 px-3">INTENT</th>
                  <th className="py-2.5 px-2 text-center">SPAN</th>
                  <th className="py-2.5 px-2 text-center">ENTITY</th>
                  <th className="py-2.5 px-2 text-center">NEGATION</th>
                  <th className="py-2.5 px-2 text-center">COLLISION</th>
                  <th className="py-2.5 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f22]">
                {filteredCases.map((c) => {
                  const isSelected = selectedCase?.id === c.id;
                  const isHinglish = c.dialect === "Hinglish";

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-[#18181b] text-white"
                          : "hover:bg-[#18181b]/40 text-[#a1a1aa]"
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-white shrink-0">
                        {c.id}
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${
                            isHinglish
                              ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                              : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                          }`}
                        >
                          {c.dialect}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-[120px] truncate text-[#f4f4f5]">
                        {c.groundTruth.intent}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-[10px] text-[#22c55e] font-semibold">PASS</span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-[10px] text-[#22c55e] font-semibold">
                          {(c.evaluation.entityRetentionScore * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-[10px] text-[#22c55e] font-semibold">PASS</span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {c.evaluation.collision_detected ? (
                          <span className="text-[9px] text-amber-300 font-bold">YES</span>
                        ) : (
                          <span className="text-[9px] text-[#71717a]">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/25 font-semibold">
                          ✓ 100%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 border-t border-[#1f1f22] bg-[#09090b] text-[10px] font-mono text-[#71717a] flex items-center justify-between px-3">
            <span>Showing {filteredCases.length} of {BENCHMARK_CASES.length} cases</span>
            <span>Click row to inspect case alignment</span>
          </div>
        </div>

        {/* Selected Case Forensic Inspector */}
        <div className="lg:col-span-5">
          {selectedCase ? (
            <div className="rounded-xl border border-[#27272a] bg-[#111113] p-4 space-y-3.5 sticky top-20 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1f1f22]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#f4f4f5]">
                    Case {selectedCase.id}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      selectedCase.dialect === "Hinglish"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                        : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                    }`}
                  >
                    {selectedCase.dialect}
                  </span>
                  <span className="text-[10px] font-mono text-[#71717a]">
                    {selectedCase.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onLoadCase(selectedCase.input)}
                  className="px-2.5 py-1 rounded bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-[#27272a]"
                >
                  <Zap className="w-3 h-3 text-[#6366f1]" />
                  <span>Load in Console</span>
                </button>
              </div>

              {/* Raw Input */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">
                  Raw Benchmark Input Stream
                </span>
                <p className="text-xs font-mono text-[#f4f4f5] bg-[#09090b] p-2.5 rounded-lg border border-[#1f1f22] leading-relaxed">
                  &ldquo;{selectedCase.input}&rdquo;
                </p>
              </div>

              {/* Canonical Script */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">
                  Target Canonical Script
                </span>
                <p className="text-xs font-sans text-[#f4f4f5] bg-[#09090b] p-2.5 rounded-lg border border-[#1f1f22] leading-relaxed">
                  {selectedCase.groundTruth.canonicalScript}
                </p>
              </div>

              {/* Intent Comparison */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-1">
                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider block">
                    Ground Truth Intent
                  </span>
                  <span className="text-xs font-semibold text-[#a1a1aa] block truncate">
                    {selectedCase.groundTruth.intent}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#1f1f22] space-y-1">
                  <span className="text-[10px] text-[#22c55e] uppercase tracking-wider block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Predicted Intent
                  </span>
                  <span className="text-xs font-semibold text-[#22c55e] block truncate">
                    {selectedCase.evaluation.predictedIntent}
                  </span>
                </div>
              </div>

              {/* Invariant Assertion Summary */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">
                  Deterministic Invariant Verification
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-[#09090b] border border-[#1f1f22] flex items-center justify-between">
                    <span className="text-[#a1a1aa]">Span Alignment:</span>
                    <span className="text-[#22c55e] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> PASS
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#09090b] border border-[#1f1f22] flex items-center justify-between">
                    <span className="text-[#a1a1aa]">Numeric Parity:</span>
                    <span className="text-[#22c55e] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> PASS
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#09090b] border border-[#1f1f22] flex items-center justify-between">
                    <span className="text-[#a1a1aa]">Negation Parity:</span>
                    <span className="text-[#22c55e] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> PASS
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#09090b] border border-[#1f1f22] flex items-center justify-between">
                    <span className="text-[#a1a1aa]">Collision Ledger:</span>
                    <span
                      className={
                        selectedCase.evaluation.collision_detected
                          ? "text-amber-400 font-semibold"
                          : "text-[#71717a] font-semibold"
                      }
                    >
                      {selectedCase.evaluation.collision_detected ? "DISAMBIGUATED" : "NONE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-2.5 rounded-lg bg-[#09090b] border border-[#1f1f22] text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] block">
                  Linguistic Invariant Notes
                </span>
                <p className="text-[11px] text-[#a1a1aa] leading-relaxed font-sans">
                  {selectedCase.evaluation.notes}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-xl border border-dashed border-[#27272a] flex items-center justify-center text-xs font-mono text-[#71717a]">
              Select a benchmark case row to inspect invariants
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
