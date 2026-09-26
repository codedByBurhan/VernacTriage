"use client";

import React, { useRef } from "react";
import { SpotlightCard } from "@/components/SpotlightCard";
import { BorderBeam } from "@/components/BorderBeam";
import { AnalyzedToken } from "@/lib/types";
import {
  Terminal,
  ArrowRight,
  Loader2,
  RotateCcw,
  Sparkles,
  Command,
} from "lucide-react";

interface SourceConsoleProps {
  inputText: string;
  setInputText: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  activeToken?: AnalyzedToken | null;
  detectedPair?: string;
  onClear: () => void;
}

export function SourceConsole({
  inputText,
  setInputText,
  onAnalyze,
  isAnalyzing,
  activeToken,
  detectedPair = "Hinglish (Devanagari-Latn)",
  onClear,
}: SourceConsoleProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charLimit = 500;
  const isOverLimit = inputText.length > charLimit;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      if (inputText.trim() && !isAnalyzing && !isOverLimit) {
        onAnalyze();
      }
    }
  };

  // Determine span highlight
  const hasValidSpan =
    activeToken &&
    typeof activeToken.start_idx === "number" &&
    typeof activeToken.end_idx === "number" &&
    activeToken.start_idx >= 0 &&
    activeToken.end_idx <= inputText.length &&
    activeToken.start_idx < activeToken.end_idx;

  const beforeSpan = hasValidSpan ? inputText.slice(0, activeToken.start_idx) : "";
  const spanText = hasValidSpan
    ? inputText.slice(activeToken.start_idx, activeToken.end_idx)
    : "";
  const afterSpan = hasValidSpan ? inputText.slice(activeToken.end_idx) : "";

  // Split into lines for terminal gutter
  const lines = inputText.split("\n");
  const lineCount = Math.max(lines.length, 3);

  return (
    <SpotlightCard className="flex flex-col flex-1 min-h-0 border border-[#1f1f23] shadow-md">
      {/* Terminal Title Bar */}
      <div className="h-9 px-3.5 border-b border-[#1f1f23] bg-[#09090c]/80 flex items-center justify-between shrink-0 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e5a0]/80" />
          </div>
          <span className="text-[#71717a] ml-1">/</span>
          <span className="text-[#fafafa] font-semibold text-[11px] tracking-tight">
            SOURCE STREAM [stdin]
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-[10px]">
          {/* Language Detection Pill */}
          <span className="px-2 py-0.5 rounded bg-[#16161b] border border-[#27272a] text-[#00e5a0] font-semibold tracking-wider uppercase">
            {detectedPair}
          </span>

          {inputText && (
            <button
              type="button"
              onClick={onClear}
              className="text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer flex items-center gap-1"
              title="Reset input"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Body with Line Numbers & Span Mirror Layer */}
      <div className="flex-1 min-h-0 relative flex overflow-hidden font-mono text-xs leading-relaxed">
        {/* Line Numbers Gutter */}
        <div className="w-9 py-3 pr-2 text-right text-[#3f3f46] select-none bg-[#070709]/70 border-r border-[#17171d] shrink-0 font-mono text-[11px] leading-relaxed">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Input Container with underlying Mirror Highlight Layer */}
        <div className="flex-1 relative h-full">
          {/* Interactive Span Mirror Layer (Underlying Backdrop) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words pointer-events-none select-none text-transparent overflow-hidden"
          >
            {hasValidSpan ? (
              <>
                <span>{beforeSpan}</span>
                <mark className="bg-[#00e5a0]/25 text-transparent border-b-2 border-[#00e5a0] shadow-sm rounded-xs transition-all animate-pulse">
                  {spanText}
                </mark>
                <span>{afterSpan}</span>
              </>
            ) : null}
          </div>

          {/* Foreground Active Textarea */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter or select code-switched vernacular input (e.g. Hinglish, Arabizi, or Romanized)..."
            className="w-full h-full p-3 bg-transparent text-[#fafafa] placeholder:text-[#3f3f46] focus:outline-none resize-none font-mono text-xs leading-relaxed caret-[#00e5a0] selection:bg-[#00e5a0]/30 selection:text-white"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="h-11 px-3 border-t border-[#1f1f23] bg-[#09090c]/80 flex items-center justify-between gap-3 shrink-0 text-xs font-mono">
        <div className="flex items-center gap-3 text-[11px] text-[#71717a]">
          <span className={isOverLimit ? "text-[#f43f5e] font-bold" : ""}>
            {inputText.length} / {charLimit} chars
          </span>
          <span className="hidden sm:inline text-[#3f3f46]">|</span>
          <span className="hidden sm:flex items-center gap-1 text-[10px]">
            <kbd className="px-1 py-0.2 rounded bg-[#16161b] border border-[#27272a] text-[#a1a1aa]">
              ⌘↵
            </kbd>
            <span>to compile</span>
          </span>
        </div>

        {/* Primary Glowing COMPILE & TRIAGE Button with BorderBeam */}
        <div className="relative">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={!inputText.trim() || isAnalyzing || isOverLimit}
            className="relative px-4 py-1.5 rounded-lg bg-[#00e5a0] hover:bg-[#00c78b] disabled:bg-[#16161b] text-[#070709] disabled:text-[#71717a] font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md btn-shimmer-glow overflow-hidden"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#070709]" />
                <span>COMPILING...</span>
              </>
            ) : (
              <>
                <span>COMPILE &amp; TRIAGE ↵</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
}
