"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Sparkles, CheckCircle2, ShieldCheck, Cpu, Layers } from "lucide-react";

interface AnalysisProgressProps {
  isAnalyzing: boolean;
}

const STEPS = [
  { label: "Analyzing linguistic patterns...", icon: Cpu, detail: "Scanning token morphology & language boundary markers" },
  { label: "Detecting code-switching & phonetics...", icon: Layers, detail: "Isolating matrix vs embedded dialect syntax" },
  { label: "Reconstructing canonical script...", icon: Sparkles, detail: "Normalizing phonetic romanization to native orthography" },
  { label: "Running deterministic integrity verification...", icon: ShieldCheck, detail: "Asserting number, entity, and negation preservation" },
];

export function AnalysisProgress({ isAnalyzing }: AnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 650);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <div className="rounded-2xl bg-zinc-950/90 border border-blue-500/30 p-6 space-y-5 shadow-2xl relative overflow-hidden backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-sm font-bold font-mono tracking-wider text-white uppercase">
            NLP Pipeline Active
          </span>
        </div>
        <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
          Step {currentStep + 1} of {STEPS.length}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-4 gap-2">
        {STEPS.map((_, idx) => (
          <div key={idx} className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                idx <= currentStep
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 w-full"
                  : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Steps List */}
      <div className="space-y-3 pt-1">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const Icon = step.icon;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                isCurrent
                  ? "bg-blue-950/30 border-blue-500/40 text-blue-100"
                  : isDone
                  ? "bg-emerald-950/20 border-emerald-500/20 text-zinc-300"
                  : "bg-black/20 border-white/5 text-zinc-600 opacity-60"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isCurrent
                    ? "bg-blue-500/20 text-blue-400"
                    : isDone
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className={`w-4 h-4 ${isCurrent ? "animate-pulse" : ""}`} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? "text-blue-200"
                        : isDone
                        ? "text-zinc-200"
                        : "text-zinc-500"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-blue-400 animate-pulse">
                      In progress...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 truncate font-sans">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
