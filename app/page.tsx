"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PipelineFlow } from "@/components/PipelineFlow";
import { LinguisticLegend } from "@/components/LinguisticLegend";
import { InputPanel } from "@/components/InputPanel";
import { DEMO_PRESETS } from "@/data/presets";
import { TriageAnalysisResult } from "@/lib/types";
import {
  Sparkles,
  Braces,
  FileCheck,
  AlertCircle,
} from "lucide-react";

export default function Home() {
  const [inputText, setInputText] = useState(DEMO_PRESETS[0].text);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(DEMO_PRESETS[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TriageAnalysisResult | null>(null);

  const handleSelectPreset = (id: string) => {
    const found = DEMO_PRESETS.find((p) => p.id === id);
    if (found) {
      setSelectedPresetId(id);
      setInputText(found.text);
    }
  };

  const handleTextChange = (val: string) => {
    setInputText(val);
    const matchingPreset = DEMO_PRESETS.find((p) => p.text === val.trim());
    setSelectedPresetId(matchingPreset ? matchingPreset.id : null);
  };

  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setAnalysisResult(data);
    } catch (err: any) {
      console.error("Analysis request failed:", err);
      setAnalysisError(err.message || "Failed to analyze input.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a10] text-[#f3f4f8] selection:bg-blue-600/30 selection:text-blue-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Section */}
        <section className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Cross-Dialect NLP & Semantic Normalization
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                DECODE THE WAY PEOPLE{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  ACTUALLY COMMUNICATE.
                </span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mt-1">
                AI-powered interpretation of code-switched, phonetically spelled, and romanized language with deterministic integrity verification.
              </p>
            </div>

            {/* Quick dialect badges */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Hinglish (Devanagari/Latin)
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Arabizi (3rb/Numerals)
              </span>
            </div>
          </div>

          {/* Architectural pipeline */}
          <PipelineFlow />
        </section>

        {/* Main Grid: Input Panel (Left) & Results Workbench (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Input Panel */}
          <div className="lg:col-span-5">
            <InputPanel
              inputText={inputText}
              setInputText={handleTextChange}
              selectedPresetId={selectedPresetId}
              onSelectPreset={handleSelectPreset}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* RIGHT COLUMN: Results Workbench */}
          <div className="lg:col-span-7 space-y-4">
            {/* Taxonomy Legend */}
            <LinguisticLegend />

            {/* Workbench Shell Card */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-xl space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Braces className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-zinc-100 uppercase tracking-wider font-mono">
                    Linguistic Triage Workbench
                  </span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                  {selectedPresetId ? `Active Preset: ${selectedPresetId}` : "Custom Text"}
                </span>
              </div>

              {/* Error Banner */}
              {analysisError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3 text-rose-200 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold block">Analysis Issue Detected</span>
                    <p className="text-rose-300/90 leading-relaxed">{analysisError}</p>
                  </div>
                </div>
              )}

              {/* SECTION A: Token Breakdown Placeholder */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Section A — Token Analysis &amp; Classification
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Interactive Pills</span>
                </div>
                <div className="min-h-[70px] rounded-xl bg-black/40 border border-dashed border-white/10 p-3.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-zinc-500 italic">
                    Presets connected. Click &quot;Analyze Input&quot; or select a preset to feed the pipeline.
                  </span>
                </div>
              </div>

              {/* SECTION B: Canonical Dual-Script Reconstruction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300">
                      Native Script Reconstruction
                    </span>
                    <span className="text-[10px] text-amber-400/80 font-mono">
                      Devanagari / Arabic
                    </span>
                  </div>
                  <div className="h-14 flex items-center text-xs text-zinc-500 italic">
                    Awaiting pipeline analysis...
                  </div>
                </div>

                <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-300">
                      Standard English Translation
                    </span>
                    <span className="text-[10px] text-blue-400/80 font-mono">
                      Business Canonical
                    </span>
                  </div>
                  <div className="h-14 flex items-center text-xs text-zinc-500 italic">
                    Awaiting pipeline analysis...
                  </div>
                </div>
              </div>

              {/* SECTION C: Business Intent & Entities */}
              <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">
                    Section C — Business Intent &amp; Extracted Entities
                  </span>
                  <span className="text-[10px] text-purple-400/80 font-mono">
                    Triage Metadata
                  </span>
                </div>
                <div className="h-12 flex items-center text-xs text-zinc-500 italic">
                  Extracted intent labels, confidence scoring, and structured entity tags will display here.
                </div>
              </div>

              {/* SECTION D: AI Integrity Check */}
              <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/20 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <FileCheck className="w-4 h-4" />
                    <span>AI Integrity Check (Deterministic Guard)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-mono">
                    Post-LLM Verifier
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div className="p-2 rounded bg-black/30 border border-emerald-500/10 text-center">
                    <span className="text-[10px] text-zinc-400 block">Entities</span>
                    <span className="text-xs font-mono text-zinc-500">—</span>
                  </div>
                  <div className="p-2 rounded bg-black/30 border border-emerald-500/10 text-center">
                    <span className="text-[10px] text-zinc-400 block">Numbers</span>
                    <span className="text-xs font-mono text-zinc-500">—</span>
                  </div>
                  <div className="p-2 rounded bg-black/30 border border-emerald-500/10 text-center">
                    <span className="text-[10px] text-zinc-400 block">Negation</span>
                    <span className="text-xs font-mono text-zinc-500">—</span>
                  </div>
                  <div className="p-2 rounded bg-black/30 border border-emerald-500/10 text-center">
                    <span className="text-[10px] text-zinc-400 block">Schema</span>
                    <span className="text-xs font-mono text-zinc-500">—</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 mt-8 bg-[#07090e] text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-400">VernacTriage</span>
            <span>•</span>
            <span>Cross-Dialect NLP &amp; Deterministic Integrity System</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-600">
            MESSY INPUT → AI NLP → STRUCTURED LINGUISTIC DATA → VERIFIED OUTPUT
          </div>
        </div>
      </footer>
    </div>
  );
}
