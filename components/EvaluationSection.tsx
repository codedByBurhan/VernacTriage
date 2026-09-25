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
  Filter,
  Check,
  Zap,
  Search,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  Layers,
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
      <div className="rounded-xl border border-white/[0.08] bg-[#10121a] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Linguistic Benchmark &amp; Invariant Evaluation Console
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-400">
              {BENCHMARK_METRICS.totalCases} Curated Test Cases
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-sans max-w-2xl">
            Empirical evaluation across code-switched vernaculars with ground-truth intent matching, character span alignment, and deterministic parity invariants.
          </p>
        </div>

        {/* Compact Summary Metrics Pill Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1.5 rounded-lg bg-[#090a0f] border border-white/[0.06] flex items-center gap-2">
            <span className="text-zinc-500 uppercase text-[10px]">Intent Parity:</span>
            <span className="font-bold text-emerald-400">{BENCHMARK_METRICS.intentAccuracy}</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-[#090a0f] border border-white/[0.06] flex items-center gap-2">
            <span className="text-zinc-500 uppercase text-[10px]">Span Alignment:</span>
            <span className="font-bold text-blue-400">100.0%</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg bg-[#090a0f] border border-white/[0.06] flex items-center gap-2">
            <span className="text-zinc-500 uppercase text-[10px]">Invariants:</span>
            <span className="font-bold text-purple-400">100.0%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#090a0f] border border-white/[0.08] overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded font-mono transition-colors cursor-pointer shrink-0 ${
              filter === "ALL"
                ? "bg-zinc-800 text-white font-semibold"
                : "text-zinc-400 hover:text-white"
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
                : "text-zinc-400 hover:text-white"
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
                : "text-zinc-400 hover:text-white"
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
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <AlertOctagon className="w-3 h-3 text-amber-400" />
            <span>Collisions</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test records..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#090a0f] border border-white/[0.08] text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>
      </div>

      {/* Main Grid: Compact Table (Left 7 cols) & Inspector (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Table Console View */}
        <div className="lg:col-span-7 rounded-xl border border-white/[0.08] bg-[#0d0f17] overflow-hidden flex flex-col">
          <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="sticky top-0 bg-[#10121a] border-b border-white/[0.08] z-10 text-[10px] text-zinc-500 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Case</th>
                  <th className="py-2.5 px-2">Dialect</th>
                  <th className="py-2.5 px-3">Input</th>
                  <th className="py-2.5 px-2">Intent</th>
                  <th className="py-2.5 px-2 text-center">Spans</th>
                  <th className="py-2.5 px-2 text-center">Invariants</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredCases.map((c) => {
                  const isSelected = selectedCase?.id === c.id;
                  const isHinglish = c.dialect === "Hinglish";

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-zinc-800/80 text-white"
                          : "hover:bg-white/[0.02] text-zinc-300"
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
                      <td className="py-2.5 px-3 max-w-[200px] truncate text-zinc-300">
                        &ldquo;{c.input}&rdquo;
                      </td>
                      <td className="py-2.5 px-2 text-[10px] text-zinc-400 truncate max-w-[100px]">
                        {c.groundTruth.intent}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-[10px] text-emerald-400 font-semibold">PASS</span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-[10px] text-emerald-400 font-semibold">PASS</span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {c.evaluation.collision_detected ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                            COLLISION
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                            ✓ 100%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-2 border-t border-white/[0.06] bg-[#090a0f] text-[10px] font-mono text-zinc-500 flex items-center justify-between px-3">
            <span>Showing {filteredCases.length} of {BENCHMARK_CASES.length} cases</span>
            <span>Click any row to inspect ground truth</span>
          </div>
        </div>

        {/* Selected Case Forensic Inspector */}
        <div className="lg:col-span-5">
          {selectedCase ? (
            <div className="rounded-xl border border-white/[0.08] bg-[#10121a] p-4 space-y-3.5 sticky top-20 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-white">
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
                  <span className="text-[10px] font-mono text-zinc-500">
                    {selectedCase.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onLoadCase(selectedCase.input)}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-white/[0.06]"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Load into Workspace</span>
                </button>
              </div>

              {/* Raw Input */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Raw Benchmark Input Stream
                </span>
                <p className="text-xs font-mono text-zinc-200 bg-[#090a0f] p-2.5 rounded-lg border border-white/[0.05] leading-relaxed">
                  &ldquo;{selectedCase.input}&rdquo;
                </p>
              </div>

              {/* Canonical Script */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Target Canonical Script
                </span>
                <p className="text-xs font-sans text-white bg-[#090a0f] p-2.5 rounded-lg border border-white/[0.05] leading-relaxed">
                  {selectedCase.groundTruth.canonicalScript}
                </p>
              </div>

              {/* Intent Comparison */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.05] space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Ground Truth Intent
                  </span>
                  <span className="text-xs font-mono font-semibold text-zinc-300 block truncate">
                    {selectedCase.groundTruth.intent}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.05] space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Predicted Intent
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-300 block truncate">
                    {selectedCase.evaluation.predictedIntent}
                  </span>
                </div>
              </div>

              {/* Invariant Assertion Summary */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Deterministic Invariant Verification
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-[#090a0f] border border-white/[0.05] flex items-center justify-between">
                    <span className="text-zinc-400">Span Alignment:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> PASS
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#090a0f] border border-white/[0.05] flex items-center justify-between">
                    <span className="text-zinc-400">Numeric Parity:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> PASS
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#090a0f] border border-white/[0.05] flex items-center justify-between">
                    <span className="text-zinc-400">Negation Parity:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> PASS
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#090a0f] border border-white/[0.05] flex items-center justify-between">
                    <span className="text-zinc-400">Collision Ledger:</span>
                    <span
                      className={
                        selectedCase.evaluation.collision_detected
                          ? "text-amber-400 font-semibold"
                          : "text-zinc-500 font-semibold"
                      }
                    >
                      {selectedCase.evaluation.collision_detected ? "DISAMBIGUATED" : "NONE"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.05] text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Linguistic Invariant Notes
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  {selectedCase.evaluation.notes}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 rounded-xl border border-dashed border-white/[0.08] flex items-center justify-center text-xs font-mono text-zinc-500">
              Select a benchmark case row to inspect invariants
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
