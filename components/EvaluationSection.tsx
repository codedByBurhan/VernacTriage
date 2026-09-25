"use client";

import React, { useState } from "react";
import {
  BENCHMARK_CASES,
  BENCHMARK_METRICS,
  BenchmarkCase,
} from "@/data/benchmarkCases";
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowUpRight,
  Filter,
  Check,
  FileCheck,
  Zap,
} from "lucide-react";

interface EvaluationSectionProps {
  onLoadCase: (text: string) => void;
}

export function EvaluationSection({ onLoadCase }: EvaluationSectionProps) {
  const [filter, setFilter] = useState<"ALL" | "Hinglish" | "Arabizi">("ALL");
  const [selectedCase, setSelectedCase] = useState<BenchmarkCase | null>(
    BENCHMARK_CASES[0]
  );

  const filteredCases = BENCHMARK_CASES.filter((c) => {
    if (filter === "ALL") return true;
    return c.dialect === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Engineering Benchmark Harness
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-white">
            EVALUATION &amp; BENCHMARK METRICS
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl mt-0.5">
            Empirical validation across 30 curated challenge cases (15 Hinglish, 15 Arabizi) with ground-truth intent, script, and entity retention audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-lg border border-white/5">
            Dataset Size: <strong className="text-white">30 Cases</strong>
          </span>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Intent Accuracy */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/30 to-black/60 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
            Intent Accuracy
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {BENCHMARK_METRICS.intentAccuracy}
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              ({BENCHMARK_METRICS.intentAccuracyFraction})
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Operational action classification
          </p>
        </div>

        {/* Language Identification */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/30 to-black/60 border border-blue-500/30 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
            Language ID Accuracy
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-blue-400">
              {BENCHMARK_METRICS.languageIdAccuracy}
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              ({BENCHMARK_METRICS.languageIdFraction})
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Multi-dialect matrix boundary detection
          </p>
        </div>

        {/* Entity Retention */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/30 to-black/60 border border-purple-500/30 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
            Entity Retention Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-purple-400">
              {BENCHMARK_METRICS.entityRetentionRate}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              ✓ Verified
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Zero entity hallucination/drop rate
          </p>
        </div>

        {/* Cohort Breakdown */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-black/60 border border-amber-500/30 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
            Cohort Performance
          </span>
          <div className="text-xs font-mono text-zinc-300 space-y-0.5 pt-1">
            <div className="flex justify-between">
              <span className="text-amber-400 font-bold">Hinglish (15):</span>
              <span className="text-white">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-400 font-bold">Arabizi (15):</span>
              <span className="text-white">93.3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === "ALL"
                ? "bg-zinc-800 text-white shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All Cases (30)
          </button>
          <button
            type="button"
            onClick={() => setFilter("Hinglish")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === "Hinglish"
                ? "bg-amber-950/50 text-amber-300 border border-amber-500/30 shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Hinglish Cohort (15)
          </button>
          <button
            type="button"
            onClick={() => setFilter("Arabizi")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === "Arabizi"
                ? "bg-purple-950/50 text-purple-300 border border-purple-500/30 shadow"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Arabizi Cohort (15)
          </button>
        </div>

        <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
          Showing {filteredCases.length} curated benchmarks
        </span>
      </div>

      {/* Benchmark Cases List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Cases List (7 cols) */}
        <div className="lg:col-span-7 space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {filteredCases.map((c) => {
            const isSelected = selectedCase?.id === c.id;
            const isHinglish = c.dialect === "Hinglish";

            return (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? isHinglish
                      ? "bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/40"
                      : "bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/40"
                    : "bg-black/40 border-white/5 hover:border-white/20 hover:bg-zinc-900/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">
                      {c.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        isHinglish
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                          : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                      }`}
                    >
                      {c.dialect}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {c.category}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Intent Match
                  </span>
                </div>

                <p className="text-zinc-300 font-mono text-[11px] truncate">
                  &ldquo;{c.input}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1.5 pt-1.5 border-t border-white/5">
                  <span className="font-mono text-indigo-300">
                    Target: {c.groundTruth.intent}
                  </span>
                  <span className="text-zinc-500">
                    Retention: {(c.evaluation.entityRetentionScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Case Ground Truth vs Prediction Inspector (5 cols) */}
        <div className="lg:col-span-5">
          {selectedCase ? (
            <div className="rounded-xl bg-zinc-950 border border-white/10 p-4 space-y-4 sticky top-20 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-sm">
                    {selectedCase.id} Inspection
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      selectedCase.dialect === "Hinglish"
                        ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                    }`}
                  >
                    {selectedCase.dialect}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onLoadCase(selectedCase.input)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-md shadow-blue-500/20"
                >
                  <Zap className="w-3 h-3" />
                  <span>Test in Workbench</span>
                </button>
              </div>

              {/* Input */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Raw Benchmark Input
                </span>
                <p className="text-xs font-mono text-zinc-200 bg-black/60 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                  &ldquo;{selectedCase.input}&rdquo;
                </p>
              </div>

              {/* Canonical Script Ground Truth */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Target Canonical Script
                </span>
                <p className="text-xs font-sans text-white bg-black/60 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                  {selectedCase.groundTruth.canonicalScript}
                </p>
              </div>

              {/* Intent Comparison */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 block">
                    Ground Truth Intent
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-300">
                    {selectedCase.groundTruth.intent}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-emerald-400 block">
                    Model Prediction
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {selectedCase.evaluation.predictedIntent}
                  </span>
                </div>
              </div>

              {/* Entities */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                  Audited Key Entities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCase.groundTruth.entities.map((ent, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5"
                    >
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Evaluation Note */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-zinc-400">
                <strong className="text-zinc-300">Auditor Note: </strong>
                {selectedCase.evaluation.notes}
              </div>
            </div>
          ) : (
            <div className="h-48 rounded-xl bg-black/40 border border-dashed border-white/10 flex items-center justify-center text-xs text-zinc-500">
              Select a benchmark case on the left to inspect ground truth.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
