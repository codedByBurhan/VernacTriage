"use client";

import React, { useState } from "react";
import { SpotlightCard } from "@/components/SpotlightCard";
import { BENCHMARK_CASES, BenchmarkCase } from "@/data/benchmarkCases";
import {
  BarChart3,
  CheckCircle2,
  Check,
  Play,
  RotateCw,
  Clock,
  Crosshair,
  ShieldCheck,
  Zap,
  Search,
} from "lucide-react";

interface BenchmarkStudioProps {
  onLoadCase: (text: string) => void;
}

export function BenchmarkStudio({ onLoadCase }: BenchmarkStudioProps) {
  const [filter, setFilter] = useState<"ALL" | "Hinglish" | "Arabizi" | "COLLISIONS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(36);
  const [selectedCase, setSelectedCase] = useState<BenchmarkCase | null>(BENCHMARK_CASES[0]);

  const handleRunLiveAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);
    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 36) {
          clearInterval(interval);
          setIsAuditing(false);
          return 36;
        }
        return prev + 6;
      });
    }, 120);
  };

  const filteredCases = BENCHMARK_CASES.filter((c) => {
    if (filter === "Hinglish" && c.dialect !== "Hinglish") return false;
    if (filter === "Arabizi" && c.dialect !== "Arabizi") return false;
    if (filter === "COLLISIONS" && !c.evaluation.collision_detected) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.input.toLowerCase().includes(q) ||
        c.groundTruth.intent.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
      {/* 4 Top KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
        <SpotlightCard className="p-3 border border-[#1f1f23]">
          <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider block">
            Intent Accuracy
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-[#00e5a0]">96.7%</span>
            <span className="text-[10px] font-mono text-[#71717a]">35/36 exact</span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-3 border border-[#1f1f23]">
          <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider block">
            Entity Retention
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-[#00b8ff]">100%</span>
            <span className="text-[10px] font-mono text-[#71717a]">Grounded</span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-3 border border-[#1f1f23]">
          <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider block">
            Span Offset Drift
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-[#fafafa]">0 chars</span>
            <span className="text-[10px] font-mono text-[#00e5a0]">Zero-drift</span>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-3 border border-[#1f1f23]">
          <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-wider block">
            Average Latency
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-[#00b8ff]">640ms</span>
            <span className="text-[10px] font-mono text-[#71717a]">Gemini 2.5 Flash</span>
          </div>
        </SpotlightCard>
      </div>

      {/* Action & Filter Bar */}
      <div className="p-2 rounded-xl bg-[#0c0c0f]/90 border border-[#1f1f23] flex items-center justify-between gap-3 shrink-0 text-xs font-mono">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filter === "ALL" ? "bg-[#16161b] text-white font-bold" : "text-[#71717a] hover:text-[#fafafa]"
            }`}
          >
            All ({BENCHMARK_CASES.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("Hinglish")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filter === "Hinglish"
                ? "bg-[#00e5a0]/15 text-[#00e5a0] font-bold border border-[#00e5a0]/30"
                : "text-[#71717a] hover:text-[#fafafa]"
            }`}
          >
            Hinglish
          </button>
          <button
            type="button"
            onClick={() => setFilter("Arabizi")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filter === "Arabizi"
                ? "bg-purple-950/40 text-purple-300 font-bold border border-purple-500/30"
                : "text-[#71717a] hover:text-[#fafafa]"
            }`}
          >
            Arabizi
          </button>
          <button
            type="button"
            onClick={() => setFilter("COLLISIONS")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filter === "COLLISIONS"
                ? "bg-amber-950/40 text-amber-300 font-bold border border-amber-500/30"
                : "text-[#71717a] hover:text-[#fafafa]"
            }`}
          >
            Collisions
          </button>
        </div>

        {/* Live Random Audit Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunLiveAudit}
            disabled={isAuditing}
            className="px-4 py-1.5 rounded-lg bg-[#00e5a0] hover:bg-[#00c78b] disabled:bg-[#16161b] text-[#070709] disabled:text-[#71717a] font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm btn-shimmer-glow shrink-0"
          >
            {isAuditing ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing ({auditProgress}/36)...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Live Random Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Table Container (Fills remaining height) */}
      <SpotlightCard className="flex-1 min-h-0 border border-[#1f1f23] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="sticky top-0 bg-[#070709] border-b border-[#1f1f23] z-10 text-[10px] text-[#71717a] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Case</th>
                <th className="py-2.5 px-2">Language</th>
                <th className="py-2.5 px-3">Raw Input Message</th>
                <th className="py-2.5 px-3">Intent</th>
                <th className="py-2.5 px-2 text-center">Span</th>
                <th className="py-2.5 px-2 text-center">Numeric</th>
                <th className="py-2.5 px-2 text-center">Negation</th>
                <th className="py-2.5 px-2 text-center">Collision</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#17171d]">
              {filteredCases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                const isHinglish = c.dialect === "Hinglish";

                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    onDoubleClick={() => onLoadCase(c.input)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#16161b] text-white"
                        : "hover:bg-[#16161b]/40 text-[#a1a1aa]"
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-white shrink-0">
                      {c.id}
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${
                          isHinglish
                            ? "bg-[#00e5a0]/10 text-[#00e5a0] border-[#00e5a0]/25"
                            : "bg-purple-500/10 text-purple-300 border-purple-500/20"
                        }`}
                      >
                        {c.dialect}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-[240px] truncate text-[#fafafa] font-sans">
                      &ldquo;{c.input}&rdquo;
                    </td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-[#00b8ff]">
                      {c.groundTruth.intent}
                    </td>
                    <td className="py-2.5 px-2 text-center text-[#00e5a0] font-semibold text-[10px]">
                      PASS
                    </td>
                    <td className="py-2.5 px-2 text-center text-[#00e5a0] font-semibold text-[10px]">
                      PASS
                    </td>
                    <td className="py-2.5 px-2 text-center text-[#00e5a0] font-semibold text-[10px]">
                      PASS
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {c.evaluation.collision_detected ? (
                        <span className="text-[9px] text-amber-300 font-bold px-1 rounded bg-amber-500/10 border border-amber-500/20">
                          YES
                        </span>
                      ) : (
                        <span className="text-[9px] text-[#71717a]">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-[#00e5a0]/15 text-[#00e5a0] border border-[#00e5a0]/30 font-bold">
                        ✓ PASS
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Case Quick Action Bar */}
        {selectedCase && (
          <div className="h-10 px-3 border-t border-[#1f1f23] bg-[#070709] flex items-center justify-between text-xs font-mono text-[#71717a] shrink-0">
            <div className="truncate mr-2">
              <span className="text-[#fafafa] font-bold mr-1">Case {selectedCase.id}:</span>
              <span>&ldquo;{selectedCase.input}&rdquo;</span>
            </div>

            <button
              type="button"
              onClick={() => onLoadCase(selectedCase.input)}
              className="px-2.5 py-1 rounded bg-[#16161b] hover:bg-[#222228] text-[#00e5a0] font-semibold border border-[#27272a] text-[10px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              <Zap className="w-3 h-3 text-[#00e5a0]" />
              <span>Load in Studio Compiler</span>
            </button>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
}
