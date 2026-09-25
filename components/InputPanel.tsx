"use client";

import React from "react";
import { DEMO_PRESETS } from "@/data/presets";
import { ArrowRight, RotateCcw, Loader2, Crosshair } from "lucide-react";

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
  highlightedSpan,
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

  const hasValidSpan =
    highlightedSpan &&
    typeof highlightedSpan.start_idx === "number" &&
    typeof highlightedSpan.end_idx === "number" &&
    highlightedSpan.start_idx >= 0 &&
    highlightedSpan.end_idx <= inputText.length;

  return (
    <div className="workbench-panel p-5 space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="tech-label font-bold text-zinc-200">
            Raw Input Stream
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <span
            className={isOverLimit ? "text-rose-400 font-semibold" : "text-zinc-500"}
          >
            {inputText.length} / {charLimit}
          </span>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="font-mono uppercase text-[10px] text-zinc-500 tracking-wider">
            Evaluation Presets
          </span>
          <span className="text-zinc-500 text-[10px] font-mono">1-Click Load</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DEMO_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`text-left p-2.5 rounded-lg border transition-workbench cursor-pointer text-xs ${
                  isSelected
                    ? "bg-zinc-800 border-white/20 text-white"
                    : "bg-zinc-900/60 border-white/[0.06] text-zinc-300 hover:border-white/15 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-zinc-200 text-xs">
                    {preset.name}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {preset.language}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1 font-mono">
                  {preset.text}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste or type multilingual input (Hinglish or Arabizi with 3/7/5 numerals)..."
          className="w-full rounded-lg bg-[#0a0c12] border border-white/[0.08] px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/60 font-mono resize-none transition-workbench leading-relaxed"
        />
        {isAnalyzing && (
          <div className="absolute inset-0 bg-[#090a0f]/80 backdrop-blur-[1px] rounded-lg flex items-center justify-center pointer-events-none">
            <span className="text-xs font-mono text-zinc-300 flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-md border border-white/10">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              Analyzing linguistic structure…
            </span>
          </div>
        )}
      </div>

      {/* Live Character Span Alignment Visualizer */}
      {hasValidSpan && (
        <div className="p-3 rounded-lg bg-[#0c0e17] border border-blue-500/30 text-xs space-y-1.5 transition-workbench">
          <div className="flex items-center justify-between text-[10px] font-mono text-blue-300">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <Crosshair className="w-3 h-3 text-blue-400" />
              Verified Character Span [{highlightedSpan!.start_idx}..{highlightedSpan!.end_idx}]
            </span>
            <span className="text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-white/[0.06]">
              Token: <strong className="text-white">&ldquo;{highlightedSpan!.raw}&rdquo;</strong>
            </span>
          </div>

          <div className="font-mono text-xs bg-black/60 p-2.5 rounded border border-white/[0.04] break-words leading-relaxed text-zinc-300">
            <span className="text-zinc-500">{inputText.substring(0, highlightedSpan!.start_idx)}</span>
            <mark className="bg-blue-500/30 text-blue-100 px-1 py-0.5 rounded border border-blue-400/80 font-bold">
              {inputText.substring(highlightedSpan!.start_idx, highlightedSpan!.end_idx)}
            </mark>
            <span className="text-zinc-500">{inputText.substring(highlightedSpan!.end_idx)}</span>
          </div>
        </div>
      )}

      {/* Bottom CTA Row */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!inputText.trim() || isAnalyzing || isOverLimit}
          className="flex-1 py-2 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-xs flex items-center justify-center gap-2 transition-workbench cursor-pointer font-mono"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
              <span>Analyzing…</span>
            </>
          ) : (
            <>
              <span>Run Triage Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
              <kbd className="hidden sm:inline-block text-[10px] bg-zinc-200 px-1.5 py-0.2 rounded text-zinc-700">
                ⌘↵
              </kbd>
            </>
          )}
        </button>

        {inputText && !isAnalyzing && (
          <button
            type="button"
            onClick={() => setInputText("")}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-zinc-200 transition-workbench cursor-pointer"
            title="Reset input"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
