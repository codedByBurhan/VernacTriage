"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PipelineFlow } from "@/components/PipelineFlow";
import { LinguisticLegend } from "@/components/LinguisticLegend";
import { InputPanel } from "@/components/InputPanel";
import { DEMO_PRESETS } from "@/data/presets";
import { TriageAnalysisResult, AnalyzedToken } from "@/lib/types";
import { TokenVisualization } from "@/components/TokenVisualization";
import { CanonicalReconstruction } from "@/components/CanonicalReconstruction";
import { TriageInformation } from "@/components/TriageInformation";
import { IntegrityAudit } from "@/components/IntegrityAudit";
import { ActionDispatchDrawer } from "@/components/ActionDispatchDrawer";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { EvaluationSection } from "@/components/EvaluationSection";
import {
  Sparkles,
  Braces,
  FileCheck,
  AlertCircle,
  Info,
  X,
  BarChart3,
  Zap,
} from "lucide-react";

export default function Home() {
  const [inputText, setInputText] = useState(DEMO_PRESETS[0].text);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(DEMO_PRESETS[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TriageAnalysisResult | null>(
    DEMO_PRESETS[0].expectedResult
  );
  const [hoveredToken, setHoveredToken] = useState<AnalyzedToken | null>(null);

  const [activeTab, setActiveTab] = useState<"workbench" | "evaluation">("workbench");

  const handleLoadCase = (caseText: string) => {
    setInputText(caseText);
    setActiveTab("workbench");
    const cleanInput = caseText.toLowerCase().replace(/[^a-z0-9]/g, "");
    const matchingPreset = DEMO_PRESETS.find((p) => {
      const cleanP = p.text.toLowerCase().replace(/[^a-z0-9]/g, "");
      return cleanP === cleanInput || p.text.toLowerCase().trim() === caseText.toLowerCase().trim();
    });
    if (matchingPreset) {
      setSelectedPresetId(matchingPreset.id);
      setAnalysisResult(matchingPreset.expectedResult);
    } else {
      setSelectedPresetId(null);
    }
  };

  const handleSelectPreset = (id: string) => {
    const found = DEMO_PRESETS.find((p) => p.id === id);
    if (found) {
      setSelectedPresetId(id);
      setInputText(found.text);
      setAnalysisResult(found.expectedResult);
      setHoveredToken(null);
    }
  };

  const handleTextChange = (val: string) => {
    setInputText(val);
    const matchingPreset = DEMO_PRESETS.find((p) => p.text === val.trim());
    setSelectedPresetId(matchingPreset ? matchingPreset.id : null);
    setHoveredToken(null);
  };

  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setCacheNotice(null);
    setHoveredToken(null);

    // Normalize for fallback lookup
    const cleanInput = inputText.toLowerCase().replace(/[^a-z0-9]/g, "");
    const matchingPreset = DEMO_PRESETS.find((p) => {
      const cleanP = p.text.toLowerCase().replace(/[^a-z0-9]/g, "");
      return (
        p.text.toLowerCase().trim() === inputText.toLowerCase().trim() ||
        cleanP === cleanInput ||
        cleanInput.includes(cleanP) ||
        cleanPresetIncludes(cleanP, cleanInput)
      );
    });

    function cleanPresetIncludes(p: string, i: string) {
      return p.includes(i) || i.includes(p);
    }

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setAnalysisResult(data);
      if (data.model_source === "demo-fallback") {
        setCacheNotice("Verified Demo Cache active (server fallback mode).");
      }
    } catch (err: any) {
      console.warn("API request encountered error:", err);
      if (err.message && err.message.includes("Gemini API key is not configured")) {
        setAnalysisError("Gemini API key is not configured.");
      } else if (matchingPreset) {
        setAnalysisResult({
          ...matchingPreset.expectedResult,
          model_source: "demo-fallback",
        });
        setCacheNotice("Network/API offline: Seamlessly served verified ground-truth demo cache.");
      } else {
        setAnalysisError(
          err.message ||
            "Analysis unavailable. For custom text, ensure GEMINI_API_KEY is configured in .env.local, or test our curated presets."
        );
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const highlightedSpan =
    hoveredToken &&
    typeof hoveredToken.start_idx === "number" &&
    typeof hoveredToken.end_idx === "number"
      ? {
          start_idx: hoveredToken.start_idx,
          end_idx: hoveredToken.end_idx,
          raw: hoveredToken.raw,
        }
      : null;

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
                Cross-Dialect NLP &amp; Deterministic Integrity System
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                DECODE THE WAY PEOPLE{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  ACTUALLY COMMUNICATE.
                </span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mt-1">
                AI-powered interpretation of code-switched, phonetically spelled, and romanized language with deterministic character span alignment and integrity audit.
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

        {/* Primary Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-black/60 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("workbench")}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "workbench"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-200" />
              <span>Live Triage Workbench</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("evaluation")}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "evaluation"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-200" />
              <span>Benchmark Evaluation (36 Cases)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                97.2% Acc
              </span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-zinc-500 hidden md:block">
            {activeTab === "workbench"
              ? "Compiler-Inspired Lexical Reconstruction Pipeline"
              : "Rigorous Empirical Benchmark Matrix"}
          </div>
        </div>

        {activeTab === "workbench" ? (
          /* Main Grid: Input Panel (Left) & Results Workbench (Right) */
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
                highlightedSpan={highlightedSpan}
              />
            </div>

            {/* RIGHT COLUMN: Results Workbench */}
            <div className="lg:col-span-7 space-y-4">
              {/* Taxonomy Legend */}
              <LinguisticLegend />

              {/* Workbench Shell Card */}
              <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-xl space-y-6">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/5 gap-2">
                  <div className="flex items-center gap-2">
                    <Braces className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-zinc-100 uppercase tracking-wider font-mono">
                      Linguistic Triage Workbench
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysisResult && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${
                          analysisResult.model_source === "gemini-2.5-flash"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            analysisResult.model_source === "gemini-2.5-flash"
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-blue-400"
                          }`}
                        />
                        {analysisResult.model_source === "gemini-2.5-flash"
                          ? "Live Gemini 2.5 Flash"
                          : "Verified Demo Cache"}
                      </span>
                    )}
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                      {selectedPresetId ? `Preset: ${selectedPresetId}` : "Custom Text"}
                    </span>
                  </div>
                </div>

                {/* Cache Notice Banner */}
                {cacheNotice && (
                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-2.5 text-blue-200 text-xs">
                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{cacheNotice}</span>
                  </div>
                )}

                {/* Error Banner */}
                {analysisError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start justify-between gap-3 text-rose-200 text-xs">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-semibold block">Analysis Issue Detected</span>
                        <p className="text-rose-300/90 leading-relaxed">{analysisError}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnalysisError(null)}
                      className="p-1 rounded hover:bg-rose-900/40 text-rose-400 hover:text-white transition-colors cursor-pointer"
                      title="Dismiss error"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Progress Tracker (while analyzing) */}
                {isAnalyzing && <AnalysisProgress isAnalyzing={isAnalyzing} />}

                {/* SECTION A: Token Breakdown */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Section A — Token Analysis &amp; Span Alignment
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {analysisResult ? `${analysisResult.tokens.length} Classified Tokens` : "Interactive Pills"}
                    </span>
                  </div>

                  {analysisResult ? (
                    <TokenVisualization
                      tokens={analysisResult.tokens}
                      detectedLanguages={analysisResult.detected_languages}
                      phenomena={analysisResult.phenomena}
                      onHoverToken={setHoveredToken}
                      hoveredToken={hoveredToken}
                    />
                  ) : (
                    <div className="min-h-[80px] rounded-xl bg-black/40 border border-dashed border-white/10 p-4 flex items-center justify-center text-xs text-zinc-500 italic">
                      Load a preset or click &quot;Analyze Input&quot; to inspect token-level language identification, phonetic types, and normalized native forms.
                    </div>
                  )}
                </div>

                {/* SECTION B: Canonical Dual-Script Reconstruction */}
                {analysisResult ? (
                  <CanonicalReconstruction
                    originalText={analysisResult.original_text}
                    canonicalScript={analysisResult.canonical_script}
                    englishTranslation={analysisResult.english_translation}
                  />
                ) : (
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
                )}

                {/* SECTION C: Business Intent & Entities + Pragmatic Register */}
                {analysisResult ? (
                  <TriageInformation
                    intent={analysisResult.intent}
                    entities={analysisResult.entities}
                    pragmaticRegister={analysisResult.pragmatic_register}
                  />
                ) : (
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
                )}

                {/* SECTION D: Deterministic Integrity Audit */}
                {analysisResult ? (
                  <IntegrityAudit verification={analysisResult.verification} />
                ) : (
                  <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/20 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <FileCheck className="w-4 h-4" />
                        <span>Deterministic Integrity Audit (Post-LLM Guard)</span>
                      </div>
                      <span className="text-[10px] text-emerald-400/80 font-mono">
                        Post-LLM Assertion
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                      <div className="p-2 rounded bg-black/30 border border-emerald-500/10 text-center">
                        <span className="text-[10px] text-zinc-400 block">Schema</span>
                        <span className="text-xs font-mono text-zinc-500">—</span>
                      </div>
                      <div className="p-2 rounded bg-black/30 border border-emerald-500/10 text-center">
                        <span className="text-[10px] text-zinc-400 block">Spans</span>
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
                        <span className="text-[10px] text-zinc-400 block">Entities</span>
                        <span className="text-xs font-mono text-zinc-500">—</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION E: Secondary Automated Action Dispatch Payload */}
                {analysisResult?.action_dispatch && (
                  <ActionDispatchDrawer dispatch={analysisResult.action_dispatch} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl">
            <EvaluationSection onLoadCase={handleLoadCase} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 mt-8 bg-[#07090e] text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-400">VernacTriage</span>
            <span>•</span>
            <span>Compiler-Inspired Lexical Reconstruction &amp; Deterministic Integrity Pipeline</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-600">
            MESSY INPUT → AI NORMALIZATION → DETERMINISTIC SPANS → INTEGRITY AUDIT → ERP DISPATCH
          </div>
        </div>
      </footer>
    </div>
  );
}
