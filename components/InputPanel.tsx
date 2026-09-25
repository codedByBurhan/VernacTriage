"use client";

import React from "react";
import { DEMO_PRESETS } from "@/data/presets";
import { Fingerprint, Zap, RotateCcw, Sparkles, Loader2, Crosshair } from "lucide-react";

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
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-xl space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-zinc-100 uppercase tracking-wider font-mono">
            Messy Input Stream
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-mono ${
              isOverLimit ? "text-rose-400 font-bold" : "text-zinc-400"
            }`}
          >
            {inputText.length} / {charLimit} chars
          </span>
        </div>
      </div>

      {/* Preset Quick Selectors */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Curated Problem Presets:
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">
            Instant 1-Click Load
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DEMO_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const isHinglish = preset.id.includes("hinglish");

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.id)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? isHinglish
                      ? "bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/40"
                      : "bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/40"
                    : isHinglish
                    ? "bg-zinc-900/60 border-amber-500/20 hover:border-amber-500/40 hover:bg-zinc-900/90"
                    : "bg-zinc-900/60 border-purple-500/20 hover:border-purple-500/40 hover:bg-zinc-900/90"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-xs font-bold ${
                      isHinglish ? "text-amber-300" : "text-purple-300"
                    }`}
                  >
                    {preset.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                      isHinglish
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    }`}
                  >
                    {isHinglish ? "Devanagari" : "Arabizi 3rb"}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  &ldquo;{preset.text}&rdquo;
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste or type messy multilingual text (e.g. Hinglish code-switching or Arabizi with numbers like 7awel, 3ala, etc.). Press Ctrl+Enter to analyze."
          className="w-full rounded-xl bg-black/50 border border-white/10 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 font-sans resize-none transition-all leading-relaxed"
        />
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-xl flex items-center justify-center pointer-events-none">
            <span className="text-xs font-mono text-blue-300 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-lg border border-blue-500/30">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              Processing linguistic stream...
            </span>
          </div>
        )}
      </div>

      {/* Character Span Highlight Viewer (Live Alignment Feedback) */}
      {hasValidSpan && (
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-black/70 border border-indigo-500/40 text-xs space-y-1.5 animate-fadeIn shadow-lg shadow-indigo-500/10">
          <div className="flex items-center justify-between text-[10px] font-mono text-indigo-300">
            <span className="font-bold flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
              RAW CHARACTER SPAN: [{highlightedSpan!.start_idx}..{highlightedSpan!.end_idx}]
            </span>
            <span className="text-zinc-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
              Token: <strong className="text-amber-300">&ldquo;{highlightedSpan!.raw}&rdquo;</strong>
            </span>
          </div>

          <div className="font-mono text-zinc-300 text-xs bg-black/70 p-2.5 rounded-lg border border-white/10 break-words leading-relaxed">
            <span className="text-zinc-500">{inputText.substring(0, highlightedSpan!.start_idx)}</span>
            <mark className="bg-amber-400/30 text-amber-200 px-1 py-0.5 rounded border border-amber-400 font-bold shadow-md shadow-amber-500/40">
              {inputText.substring(highlightedSpan!.start_idx, highlightedSpan!.end_idx)}
            </mark>
            <span className="text-zinc-500">{inputText.substring(highlightedSpan!.end_idx)}</span>
          </div>
        </div>
      )}

      {/* Action CTA & Clear */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!inputText.trim() || isAnalyzing || isOverLimit}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
              <span>Analyzing Dialect Patterns...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-blue-200" />
              <span>Analyze Input</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-black/30 rounded border border-white/20 text-zinc-300">
                Ctrl+↵
              </kbd>
            </>
          )}
        </button>

        {inputText && !isAnalyzing && (
          <button
            type="button"
            onClick={() => setInputText("")}
            className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            title="Clear text"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Target Linguistic Scope Card */}
      <div className="glass-panel-subtle rounded-xl p-4 border border-white/5 space-y-2 text-xs text-zinc-400">
        <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] block">
          Triage Engine Scope
        </span>
        <ul className="space-y-1.5 list-disc list-inside text-zinc-400">
          <li>
            <strong className="text-zinc-200">Hinglish:</strong> Matrix Hindi + English loanwords, phonetic spelling (kl, ni, plz, wrna).
          </li>
          <li>
            <strong className="text-zinc-200">Arabizi (3rb):</strong> Arabic in Latin script using ASCII numerals (7=ح, 3=ع, 2=ء, 5=خ).
          </li>
          <li>
            <strong className="text-zinc-200">Compiler Verification:</strong> Deterministic character spans, homograph collision ledger, and invariant checks.
          </li>
        </ul>
      </div>
    </div>
  );
}
