"use client";

import React from "react";
import { MessageSquareCode, Cpu, Layers, ShieldCheck, ArrowRight } from "lucide-react";

interface PipelineFlowProps {
  currentStage?: "idle" | "analyzing" | "complete";
}

export function PipelineFlow({ currentStage = "idle" }: PipelineFlowProps) {
  const stages = [
    {
      id: "input",
      label: "Messy Human Input",
      desc: "Code-switching & Arabizi",
      icon: MessageSquareCode,
      color: "text-blue-400",
      border: "border-blue-500/30",
      bg: "bg-blue-950/20",
    },
    {
      id: "nlp",
      label: "AI Interpretation",
      desc: "Gemini 2.5 Flash Engine",
      icon: Cpu,
      color: "text-indigo-400",
      border: "border-indigo-500/30",
      bg: "bg-indigo-950/20",
    },
    {
      id: "structured",
      label: "Structured Data",
      desc: "Token, Script & Intent",
      icon: Layers,
      color: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-950/20",
    },
    {
      id: "verified",
      label: "Integrity Verified",
      desc: "Deterministic Rules",
      icon: ShieldCheck,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/20",
    },
  ];

  return (
    <div className="w-full glass-panel-subtle rounded-xl p-3 border border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              className={`flex items-center space-x-2.5 p-2.5 rounded-lg border ${stage.border} ${stage.bg} transition-all duration-200`}
            >
              <div className={`p-2 rounded-md bg-black/40 ${stage.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-zinc-200 truncate">
                    {stage.label}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 truncate">{stage.desc}</p>
              </div>
              {idx < stages.length - 1 && (
                <ArrowRight className="hidden md:block w-3.5 h-3.5 text-zinc-600 -mr-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
