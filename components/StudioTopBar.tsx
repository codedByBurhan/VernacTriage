"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  ShieldCheck,
  FileCode,
  Zap,
  Terminal,
  BarChart3,
  Code2,
} from "lucide-react";

interface StudioTopBarProps {
  activeTab: "compiler" | "benchmark";
  onTabChange: (tab: "compiler" | "benchmark") => void;
  onOpenDocs: () => void;
  latency?: number;
  caseCount?: number;
}

export function StudioTopBar({
  activeTab,
  onTabChange,
  onOpenDocs,
  latency = 640,
  caseCount = 36,
}: StudioTopBarProps) {
  return (
    <header className="h-[48px] px-3.5 rounded-xl border border-[#1f1f23] bg-[#0c0c0f]/80 backdrop-blur-md flex items-center justify-between gap-3 shrink-0 shadow-lg relative z-20">
      {/* Left: Brand Logo & Title with Active Pulse Dot */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/vernactriage-mark.png"
            alt="VernacTriage Logo"
            width={26}
            height={26}
            className="rounded-md object-contain shrink-0"
            priority
          />
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-[#fafafa] tracking-tight">
              VernacTriage
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00e5a0]/10 border border-[#00e5a0]/30 text-[10px] font-mono text-[#00e5a0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
              <span>v1.4 Lexical Compiler</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Segmented Glass Tab Switcher */}
      <div className="flex items-center p-0.5 rounded-lg bg-[#070709] border border-[#1f1f23] shadow-inner text-xs font-mono">
        <button
          type="button"
          onClick={() => onTabChange("compiler")}
          className={`relative px-3.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "compiler"
              ? "text-[#fafafa] font-semibold"
              : "text-[#71717a] hover:text-[#a1a1aa]"
          }`}
        >
          {activeTab === "compiler" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-[#16161b] border border-[#27272a] rounded-md shadow-sm"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <Terminal className="w-3.5 h-3.5 text-[#00e5a0] relative z-10" />
          <span className="relative z-10">Studio Compiler</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange("benchmark")}
          className={`relative px-3.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "benchmark"
              ? "text-[#fafafa] font-semibold"
              : "text-[#71717a] hover:text-[#a1a1aa]"
          }`}
        >
          {activeTab === "benchmark" && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-[#16161b] border border-[#27272a] rounded-md shadow-sm"
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
            />
          )}
          <BarChart3 className="w-3.5 h-3.5 text-[#00b8ff] relative z-10" />
          <span className="relative z-10">Evaluation Benchmark</span>
          <span className="relative z-10 text-[9px] px-1 py-0.2 rounded bg-[#070709] text-[#71717a] border border-[#1f1f23]">
            {caseCount} Cases
          </span>
        </button>
      </div>

      {/* Right: Live Latency Ticker, Status Badge & Quick Links */}
      <div className="flex items-center gap-2.5 text-xs font-mono">
        {/* Latency Ticker */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#070709] border border-[#1f1f23] text-[#a1a1aa] text-[11px]">
          <Clock className="w-3 h-3 text-[#00b8ff]" />
          <span>⏱ {latency}ms</span>
        </div>

        {/* Gemini + Gate Status Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00e5a0]/10 border border-[#00e5a0]/25 text-[#00e5a0] text-[10px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Gemini 2.5 Flash • Deterministic Gate: ACTIVE</span>
        </div>

        {/* System Specs / Docs Button */}
        <button
          type="button"
          onClick={onOpenDocs}
          className="p-1.5 rounded-md hover:bg-[#16161b] border border-[#1f1f23] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
          title="Architecture Specifications & Pipeline Specs"
        >
          <FileCode className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
