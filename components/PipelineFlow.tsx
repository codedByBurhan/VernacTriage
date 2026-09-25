"use client";

import React from "react";
import { ArrowRight, Terminal, Cpu, Layers, ShieldCheck } from "lucide-react";

export function PipelineFlow() {
  const steps = [
    { id: "01", name: "Raw Input Stream", role: "Vernacular / Code-switched", icon: Terminal },
    { id: "02", name: "Lexical Normalization", role: "Morphology & Phonetics", icon: Cpu },
    { id: "03", name: "Token Span Alignment", role: "Exact [start..end] Offsets", icon: Layers },
    { id: "04", name: "Deterministic Gate", role: "5-Invariant Verification", icon: ShieldCheck },
  ];

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0f17] p-3 text-xs font-mono">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="flex items-center justify-between p-2 rounded-lg bg-[#090a0f] border border-white/[0.04]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-400 shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500">{step.id}</span>
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {step.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate">{step.role}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="hidden lg:block w-3 h-3 text-zinc-700 shrink-0 ml-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
