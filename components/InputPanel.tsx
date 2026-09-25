"use client";

import React from "react";
import { DEMO_PRESETS } from "@/data/presets";
import { ArrowRight, Loader2, Sparkles, CornerDownLeft } from "lucide-react";

interface InputPanelProps {
  inputText: string;
  setInputText: (val: string) => void;
  selectedPresetId: string | null;
  onSelectPreset: (id: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  highlightedSpan?: { start_idx: number; end_idx: number; raw: string } | null;
}

export function InputPanel({
  inputText,
  setInputText,
  selectedPresetId,
  onSelectPreset,
  onAnalyze,
  isAnalyzing,
}: InputPanelProps) {
  const charLimit = 500;
  const isOverLimit = inputText.length > charLimit;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      if (inputText.trim() && !isAnalyzing && !isOverLimit) {
        onAnalyze();
      }
    }
  };

  return (
    <div className="rounded-xl border border-[#27272a] bg-[#111113] p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1f1f22]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#f4f4f5]">
            Customer Message Input
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className={isOverLimit ? "text-[#ef4444] font-semibold" : "text-[#71717a]"}>
            {inputText.length} / {charLimit}
          </span>
        </div>
      </div>

      {/* Compact Preset Selector Buttons */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#71717a]">
          <span className="uppercase tracking-wider text-[10px]">Challenge Presets:</span>
          <span>1-click load</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {DEMO_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-[#18181b] border-[#6366f1] text-[#f4f4f5] font-medium"
                    : "bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:text-[#f4f4f5] hover:border-[#3f3f46]"
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste or type messy multilingual customer input (e.g. Hinglish, Arabizi, or Romanized)..."
          className="w-full p-3.5 rounded-lg bg-[#09090b] border border-[#27272a] text-sm font-mono text-[#f4f4f5] placeholder:text-[#71717a] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/30 transition-colors leading-relaxed resize-none"
        />
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-[11px] font-mono text-[#71717a] flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] text-[10px]">
            ⌘/Ctrl + Enter
          </kbd>
          <span>to submit</span>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!inputText.trim() || isAnalyzing || isOverLimit}
          className="px-5 py-2 rounded-lg bg-[#f4f4f5] hover:bg-white disabled:bg-[#18181b] text-[#09090b] disabled:text-[#71717a] font-medium text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm shrink-0"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Input…</span>
            </>
          ) : (
            <>
              <span>Analyze Message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
