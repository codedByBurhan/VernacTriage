"use client";

import React from "react";
import { ShieldCheck, Cpu } from "lucide-react";

interface NavbarProps {
  activeTab?: "workbench" | "evaluation";
  onTabChange?: (tab: "workbench" | "evaluation") => void;
}

export function Navbar({ activeTab = "workbench", onTabChange }: NavbarProps) {
  return (
    <header className="w-full border-b border-white/[0.08] bg-[#090a0f]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand & Tabs */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-blue-400">
              VT
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-semibold text-sm tracking-tight text-white font-mono">
                VernacTriage
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Lexical Engine
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          {onTabChange && (
            <nav className="hidden sm:flex items-center space-x-1 border-l border-white/[0.08] pl-5">
              <button
                type="button"
                onClick={() => onTabChange("workbench")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === "workbench"
                    ? "bg-zinc-800 text-white border border-white/10"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Triage Workspace
              </button>
              <button
                type="button"
                onClick={() => onTabChange("evaluation")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "evaluation"
                    ? "bg-zinc-800 text-white border border-white/10"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>Benchmark Matrix</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-white/10 text-zinc-400">
                  36
                </span>
              </button>
            </nav>
          )}
        </div>

        {/* Engine Status Indicators */}
        <div className="flex items-center space-x-2.5 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-white/[0.06] text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-400 hidden sm:inline">Engine:</span>
            <span className="text-zinc-200">Gemini 2.5 Flash</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-white/[0.06] text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400 hidden md:inline">Audit:</span>
            <span className="text-emerald-400">Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
