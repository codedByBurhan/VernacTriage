"use client";

import React from "react";
import { DEMO_PRESETS } from "@/data/presets";
import { ArrowRight, Loader2, RotateCcw, Sparkles } from "lucide-react";

interface InputPanelProps {
  inputText: string;
  setInputText: (val: string) => void;
  selectedPresetId: string | null;
  onSelectPreset: (id: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onClear?: () => void;
}

export function InputPanel({
  inputText,
  setInputText,
  selectedPresetId,
  onSelectPreset,
  onAnalyze,
  isAnalyzing,
  onClear,
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

  const handleClear = () => {
    setInputText("");
    if (onClear) onClear();
  };

  return (
    <div className="rounded-xl border border-[#27272a] bg-[#111114] p-4 sm:p-5 space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1f1f23]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#00e5a0]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#fafafa]">
            Customer Input Stream
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#71717a] hidden sm:inline">
            Auto-Detect: Hinglish • Arabizi • Romanized
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          {inputText && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-[#71717a] hover:text-[#fafafa] flex items-center gap-1 transition-colors cursor-pointer"
              title="Clear input"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          <span className={isOverLimit ? "text-[#f43f5e] font-semibold" : "text-[#71717a]"}>
            {inputText.length} / {charLimit}
          </span>
        </div>
      </div>

      {/* Preset Selector Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#71717a]">
          <span className="uppercase tracking-wider text-[10px]">Challenge Presets:</span>
          <span className="text-[10px]">1-click forensic sample</span>
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
                    ? "bg-[#18181b] border-[#00e5a0] text-[#fafafa] font-semibold"
                    : "bg-[#09090b] border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46]"
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste or type messy multilingual customer input (e.g. Hinglish, Arabizi, or Romanized)..."
          className="w-full p-3.5 rounded-lg bg-[#09090b] border border-[#27272a] text-sm font-mono text-[#fafafa] placeholder:text-[#71717a] focus:outline-none focus:border-[#00e5a0] focus:ring-1 focus:ring-[#00e5a0]/30 transition-colors leading-relaxed resize-none"
        />
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-[11px] font-mono text-[#71717a] flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa] text-[10px]">
            ⌘/Ctrl + Enter
          </kbd>
          <span>to execute linguistic reconstruction</span>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!inputText.trim() || isAnalyzing || isOverLimit}
          className="px-5 py-2 rounded-lg bg-[#fafafa] hover:bg-white disabled:bg-[#18181b] text-[#09090b] disabled:text-[#71717a] font-semibold text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm shrink-0"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#09090b]" />
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
