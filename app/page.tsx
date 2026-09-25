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
  AlertCircle,
  Info,
  X,
  RefreshCw,
  Terminal,
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
        setAnalysisError("Gemini API key is not configured in server environment.");
      } else if (matchingPreset) {
        setAnalysisResult({
          ...matchingPreset.expectedResult,
          model_source: "demo-fallback",
        });
        setCacheNotice("Network/API offline: Served verified ground-truth demo cache.");
      } else {
        setAnalysisError(
          err.message ||
            "Analysis service unavailable. For custom un-cached text, ensure GEMINI_API_KEY is configured in .env.local, or test our curated presets."
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
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-[#ededed] antialiased selection:bg-blue-600/30 selection:text-blue-200">
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Mobile View Switcher (visible on small viewports) */}
        <div className="flex sm:hidden items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
          <span className="font-mono text-zinc-400 text-[11px] uppercase tracking-wider">
            Workspace Mode
          </span>
          <div className="flex items-center gap-1 p-1 rounded-md bg-[#10121a] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveTab("workbench")}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === "workbench"
                  ? "bg-zinc-800 text-white font-medium"
                  : "text-zinc-400"
              }`}
            >
              Workbench
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("evaluation")}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === "evaluation"
                  ? "bg-zinc-800 text-white font-medium"
                  : "text-zinc-400"
              }`}
            >
              Benchmark
            </button>
          </div>
        </div>

        {activeTab === "workbench" ? (
          <div className="space-y-5">
            {/* Header & Pipeline Architecture Schematic */}
            <section className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-1">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-white">
                    LINGUISTIC RECONSTRUCTION WORKSPACE
                  </h1>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">
                    Deterministic parsing, token span alignment, and forensic triage for code-switched vernaculars.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 hidden sm:block">
                  v2.5 · Core NLP Infrastructure
                </div>
              </div>

              {/* Compact Pipeline Schematic */}
              <PipelineFlow />
            </section>

            {/* Input Stream Workstation */}
            <section>
              <InputPanel
                inputText={inputText}
                setInputText={handleTextChange}
                selectedPresetId={selectedPresetId}
                onSelectPreset={handleSelectPreset}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                highlightedSpan={highlightedSpan}
              />
            </section>

            {/* Notices & Error States */}
            {cacheNotice && (
              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/25 flex items-center gap-2.5 text-blue-200 text-xs font-mono">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{cacheNotice}</span>
              </div>
            )}

            {analysisError && (
              <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-500/30 flex items-start justify-between gap-3 text-rose-200 text-xs font-mono">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold block text-rose-300">
                      Analysis Service Unavailable
                    </span>
                    <p className="text-rose-300/80 leading-relaxed font-sans">{analysisError}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="px-2 py-1 rounded bg-rose-900/40 hover:bg-rose-900/60 text-rose-200 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer border border-rose-500/30"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalysisError(null)}
                    className="p-1 rounded hover:bg-rose-900/40 text-rose-400 hover:text-white transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Pipeline Stage Tracker while analyzing */}
            {isAnalyzing && <AnalysisProgress isAnalyzing={isAnalyzing} />}

            {/* Main Analysis Results Stream */}
            {analysisResult ? (
              <section className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between text-xs pb-1 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Reconstruction Stream
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.2 rounded border flex items-center gap-1.5 ${
                        analysisResult.model_source === "gemini-2.5-flash"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          : "bg-blue-500/10 text-blue-300 border-blue-500/25"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          analysisResult.model_source === "gemini-2.5-flash"
                            ? "bg-emerald-400"
                            : "bg-blue-400"
                        }`}
                      />
                      {analysisResult.model_source === "gemini-2.5-flash"
                        ? "Live Gemini 2.5 Flash"
                        : "Verified Ground Truth Cache"}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                    Deterministic Invariant Verification Active
                  </span>
                </div>

                {/* ROW 1: Dual Analytical Columns (Canonical Script & Normalized English) */}
                <CanonicalReconstruction
                  canonicalScript={analysisResult.canonical_script}
                  englishTranslation={analysisResult.english_translation}
                />

                {/* ROW 2: Token Reconstruction & Span Alignment + Inspector + Collision Ledger */}
                <TokenVisualization
                  tokens={analysisResult.tokens}
                  detectedLanguages={analysisResult.detected_languages}
                  phenomena={analysisResult.phenomena}
                  onHoverToken={setHoveredToken}
                  hoveredToken={hoveredToken}
                />

                {/* ROW 3: Operational Interpretation (Intent, Register, Grounded Entities) */}
                <TriageInformation
                  intent={analysisResult.intent}
                  entities={analysisResult.entities}
                  pragmaticRegister={analysisResult.pragmatic_register}
                />

                {/* ROW 4: Deterministic Integrity Gate (5 Invariants + Audit Log) */}
                <IntegrityAudit verification={analysisResult.verification} />

                {/* ROW 5: Machine Payload (Downstream Webhook Action Dispatch) */}
                {analysisResult.action_dispatch && (
                  <ActionDispatchDrawer dispatch={analysisResult.action_dispatch} />
                )}
              </section>
            ) : (
              /* Deliberate Empty State */
              <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#0d0f17] p-8 text-center space-y-3 font-mono">
                <Terminal className="w-6 h-6 text-zinc-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                    No Analysis Yet
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans max-w-md mx-auto">
                    Enter a customer message or choose one of our challenge presets above to begin linguistic reconstruction.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {DEMO_PRESETS.slice(0, 3).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className="px-2.5 py-1 rounded bg-[#10121a] hover:bg-zinc-800 border border-white/[0.06] text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Benchmark Tab Console */
          <div className="space-y-4">
            <EvaluationSection onLoadCase={handleLoadCase} />
          </div>
        )}
      </main>

      {/* Engineering Footer */}
      <footer className="border-t border-white/[0.06] py-3.5 mt-8 bg-[#07080c] text-xs font-mono text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">VernacTriage</span>
            <span>/</span>
            <span>Compiler-Inspired Lexical Reconstruction Engine</span>
          </div>
          <div className="text-[10px] text-zinc-600 uppercase tracking-wider">
            RAW INPUT → TOKEN ALIGNMENT → CANONICAL SCRIPT → INTEGRITY AUDIT → MACHINE PAYLOAD
          </div>
        </div>
      </footer>
    </div>
  );
}
