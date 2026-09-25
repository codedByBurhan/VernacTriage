"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Cpu, Layers, BookOpen, Loader2 } from "lucide-react";

interface AnalysisProgressProps {
  isAnalyzing: boolean;
}

const STAGES = [
  { label: "Parsing input stream", icon: Cpu, detail: "Scanning token morphology & language boundaries" },
  { label: "Reconstructing tokens & spans", icon: Layers, detail: "Determining character offsets & collision risks" },
  { label: "Synthesizing canonical script", icon: BookOpen, detail: "Normalizing phonetic romanization to native orthography" },
  { label: "Verifying deterministic invariants", icon: ShieldCheck, detail: "Auditing numbers, negation, and entity preservation" },
];

export function AnalysisProgress({ isAnalyzing }: AnalysisProgressProps) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStage(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#10121a] p-4 space-y-3.5 text-xs font-mono">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span className="font-semibold uppercase tracking-wider text-zinc-200 text-[11px]">
            Linguistic Analysis Pipeline Active
          </span>
        </div>
        <span className="text-[10px] text-zinc-500">
          Stage {currentStage + 1} of {STAGES.length}
        </span>
      </div>

      {/* Progress Track */}
      <div className="grid grid-cols-4 gap-1.5">
        {STAGES.map((_, idx) => (
          <div key={idx} className="h-1 rounded-full bg-zinc-800/80 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                idx <= currentStage ? "bg-blue-400 w-full" : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Progressive Stage Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;
          const Icon = stage.icon;

          return (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border transition-colors ${
                isCurrent
                  ? "bg-[#090a0f] border-blue-500/40 text-white"
                  : isDone
                  ? "bg-[#090a0f] border-white/[0.05] text-zinc-400"
                  : "bg-transparent border-transparent text-zinc-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isCurrent ? "text-blue-400" : isDone ? "text-emerald-400" : "text-zinc-600"
                  }`}
                />
                <span className="text-xs font-medium truncate">{stage.label}</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-sans mt-1 truncate">
                {stage.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
