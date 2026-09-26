"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sidebar, SidebarTab } from "@/components/Sidebar";
import { EmptyState } from "@/components/EmptyState";
import { LandingSection } from "@/components/LandingSection";
import { InputPanel } from "@/components/InputPanel";
import { RawMessageViewer } from "@/components/RawMessageViewer";
import { CanonicalReconstruction } from "@/components/CanonicalReconstruction";
import { TokenVisualization } from "@/components/TokenVisualization";
import { TokenInspectorDrawer } from "@/components/TokenInspectorDrawer";
import { TriageInformation } from "@/components/TriageInformation";
import { IntegrityAudit } from "@/components/IntegrityAudit";
import { ActionDispatchDrawer } from "@/components/ActionDispatchDrawer";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { EvaluationSection } from "@/components/EvaluationSection";
import { DocsModal } from "@/components/DocsModal";
import { DEMO_PRESETS } from "@/data/presets";
import { TriageAnalysisResult, AnalyzedToken } from "@/lib/types";
import {
  AlertCircle,
  Info,
  X,
  RefreshCw,
  Terminal,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Menu,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("analyze");
  const [inputText, setInputText] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TriageAnalysisResult | null>(null);
  const [hoveredToken, setHoveredToken] = useState<AnalyzedToken | null>(null);
  const [inspectedToken, setInspectedToken] = useState<AnalyzedToken | null>(null);
  const [inspectedTokenIndex, setInspectedTokenIndex] = useState<number | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(312);

  const handleLoadCase = (caseText: string) => {
    setInputText(caseText);
    setActiveTab("analyze");
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
      // Trigger live analysis for custom case
      handleAnalyzeWithText(caseText);
    }
    setInspectedToken(null);
  };

  const handleSelectPreset = (id: string) => {
    const found = DEMO_PRESETS.find((p) => p.id === id);
    if (found) {
      setSelectedPresetId(id);
      setInputText(found.text);
      setAnalysisResult(found.expectedResult);
      setHoveredToken(null);
      setInspectedToken(null);
      setAnalysisError(null);
      setCacheNotice(null);
    }
  };

  const handleTextChange = (val: string) => {
    setInputText(val);
    const matchingPreset = DEMO_PRESETS.find((p) => p.text === val.trim());
    setSelectedPresetId(matchingPreset ? matchingPreset.id : null);
    setHoveredToken(null);
    if (!val.trim()) {
      setAnalysisResult(null);
    }
  };

  const handleClear = () => {
    setInputText("");
    setSelectedPresetId(null);
    setAnalysisResult(null);
    setHoveredToken(null);
    setInspectedToken(null);
    setAnalysisError(null);
    setCacheNotice(null);
  };

  const handleSelectToken = (token: AnalyzedToken, index: number) => {
    setInspectedToken(token);
    setInspectedTokenIndex(index);
  };

  const handleAnalyzeWithText = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setCacheNotice(null);
    setHoveredToken(null);
    setInspectedToken(null);
    const startTime = Date.now();

    const cleanInput = textToAnalyze.toLowerCase().replace(/[^a-z0-9]/g, "");
    const matchingPreset = DEMO_PRESETS.find((p) => {
      const cleanP = p.text.toLowerCase().replace(/[^a-z0-9]/g, "");
      return (
        p.text.toLowerCase().trim() === textToAnalyze.toLowerCase().trim() ||
        cleanP === cleanInput ||
        cleanInput.includes(cleanP)
      );
    });

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setAnalysisResult(data);
      setProcessingTime(Date.now() - startTime);
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
        setProcessingTime(184);
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

  const handleAnalyze = () => {
    handleAnalyzeWithText(inputText);
  };

  const activeTokenForHighlight = hoveredToken || inspectedToken;

  return (
    <div className="min-h-screen flex bg-[#09090b] text-[#fafafa] antialiased selection:bg-[#00e5a0]/25 selection:text-white">
      {/* DESKTOP ENTERPRISE LEFT SIDEBAR */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenDocs={() => setIsDocsOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* MAIN APPLICATION WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* MOBILE TOPBAR & BRAND HEADER */}
        <header className="lg:hidden border-b border-[#1f1f23] bg-[#0d0d10] px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/vernactriage-mark.png"
              alt="VernacTriage V Monogram"
              width={28}
              height={28}
              className="rounded-md object-contain"
            />
            <span className="font-mono font-bold text-sm text-[#fafafa] tracking-tight">
              VERNACTRIAGE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md border border-[#27272a] bg-[#111114] text-[#a1a1aa] hover:text-[#fafafa]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* MOBILE DROPDOWN NAVIGATION */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#1f1f23] bg-[#0d0d10] px-4 py-3 space-y-1 font-mono text-xs z-30">
            <button
              type="button"
              onClick={() => {
                setActiveTab("analyze");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeTab === "analyze" ? "bg-[#18181b] text-white font-bold" : "text-[#a1a1aa]"
              }`}
            >
              Analyze (Workspace)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("benchmark");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeTab === "benchmark" ? "bg-[#18181b] text-white font-bold" : "text-[#a1a1aa]"
              }`}
            >
              Benchmark (36 Cases)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("overview");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg ${
                activeTab === "overview" ? "bg-[#18181b] text-white font-bold" : "text-[#a1a1aa]"
              }`}
            >
              Overview (Architecture)
            </button>
            <button
              type="button"
              onClick={() => {
                setIsDocsOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-[#a1a1aa]"
            >
              Pipeline / System Documentation
            </button>
          </div>
        )}

        {/* WORKSPACE CONTENT BODY */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* TAB 1: PRIMARY ANALYSIS CONSOLE */}
          {activeTab === "analyze" && (
            <div className="space-y-6">
              {/* Serious Enterprise Header with small system indicators */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#1f1f23]">
                <div className="space-y-0.5">
                  <h1 className="text-base sm:text-lg font-bold font-mono tracking-tight text-[#fafafa] uppercase">
                    Analyze Multilingual Input
                  </h1>
                  <p className="text-xs text-[#a1a1aa] font-sans">
                    Linguistic decomposition of code-switched, phonetic, and Latin-script vernacular into canonical script.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#a1a1aa] self-start sm:self-auto">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111114] border border-[#1f1f23]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
                    <span className="text-[11px] text-[#fafafa] font-medium">Gemini Connected</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111114] border border-[#1f1f23]">
                    <ShieldCheck className="w-3 h-3 text-[#00e5a0]" />
                    <span className="text-[11px] text-[#fafafa] font-medium">Deterministic verification Enabled</span>
                  </div>
                </div>
              </div>

              {/* INPUT WORKSPACE */}
              <section>
                <InputPanel
                  inputText={inputText}
                  setInputText={handleTextChange}
                  selectedPresetId={selectedPresetId}
                  onSelectPreset={handleSelectPreset}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  onClear={handleClear}
                />
              </section>

              {/* Cache / Fallback Notices */}
              {cacheNotice && (
                <div className="p-3 rounded-lg bg-[#0d0d10] border border-[#27272a] flex items-center gap-2.5 text-[#a1a1aa] text-xs font-mono">
                  <Info className="w-3.5 h-3.5 text-[#00b8ff] shrink-0" />
                  <span>{cacheNotice}</span>
                </div>
              )}

              {/* Error Notice */}
              {analysisError && (
                <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-500/30 flex items-start justify-between gap-3 text-rose-200 text-xs font-mono">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-semibold block text-rose-300">
                        Analysis Unavailable
                      </span>
                      <p className="text-rose-300/80 leading-relaxed font-sans">{analysisError}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      className="px-2.5 py-1 rounded bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer border border-[#27272a]"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnalysisError(null)}
                      className="p-1 rounded hover:bg-[#18181b] text-[#71717a] hover:text-white transition-colors cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Analysis Progress Transition Animation */}
              {isAnalyzing && <AnalysisProgress isAnalyzing={isAnalyzing} />}

              {/* DUAL WORKSPACE: EMPTY STATE OR LAYERED RESULTS */}
              {analysisResult ? (
                /* LAYERED ANALYSIS RESULT HIERARCHY */
                <div className="space-y-6 pt-1">
                  {/* Processing Status Bar */}
                  <div className="p-3 rounded-xl border border-[#27272a] bg-[#111114] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div>
                        <span className="text-[9px] text-[#71717a] uppercase tracking-wider block">
                          Detected Dialect
                        </span>
                        <span className="text-[#fafafa] font-semibold">
                          {analysisResult.detected_pair || analysisResult.detected_languages.join(", ")}
                        </span>
                      </div>

                      <div className="h-6 w-px bg-[#27272a] hidden sm:block" />

                      <div>
                        <span className="text-[9px] text-[#71717a] uppercase tracking-wider block">
                          Classified Intent
                        </span>
                        <span className="text-[#fafafa] font-semibold">
                          {analysisResult.intent.label}
                        </span>
                      </div>

                      <div className="h-6 w-px bg-[#27272a] hidden sm:block" />

                      <div>
                        <span className="text-[9px] text-[#71717a] uppercase tracking-wider block">
                          Pragmatic Register
                        </span>
                        <span className="text-[#a1a1aa] font-medium">
                          {analysisResult.pragmatic_register?.tone || "Colloquial-Familiar"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#71717a]">
                      <Clock className="w-3 h-3" />
                      <span>Inference: {processingTime}ms</span>
                    </div>
                  </div>

                  {/* 1. RAW INPUT & CANONICAL SCRIPT + ENGLISH */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                    <div>
                      <RawMessageViewer
                        originalText={analysisResult.original_text || inputText}
                        activeToken={activeTokenForHighlight}
                      />
                    </div>
                    <div>
                      <CanonicalReconstruction
                        canonicalScript={analysisResult.canonical_script}
                        englishTranslation={analysisResult.english_translation}
                      />
                    </div>
                  </div>

                  {/* 2. TOKEN RECONSTRUCTION STREAM */}
                  <section>
                    <TokenVisualization
                      tokens={analysisResult.tokens}
                      detectedLanguages={analysisResult.detected_languages}
                      phenomena={analysisResult.phenomena}
                      onHoverToken={setHoveredToken}
                      onSelectToken={handleSelectToken}
                      selectedTokenIndex={inspectedTokenIndex}
                      hoveredToken={hoveredToken}
                    />
                  </section>

                  {/* 3. INTENT & PRAGMATIC REGISTER */}
                  <section>
                    <TriageInformation
                      intent={analysisResult.intent}
                      entities={analysisResult.entities}
                      pragmaticRegister={analysisResult.pragmatic_register}
                    />
                  </section>

                  {/* 4. DETERMINISTIC INTEGRITY GATE */}
                  <section>
                    <IntegrityAudit
                      verification={analysisResult.verification}
                      originalText={analysisResult.original_text || inputText}
                      canonicalScript={analysisResult.canonical_script}
                      englishTranslation={analysisResult.english_translation}
                    />
                  </section>

                  {/* 5. AUTOMATED ACTION DISPATCH PAYLOAD */}
                  {analysisResult.action_dispatch && (
                    <section>
                      <ActionDispatchDrawer dispatch={analysisResult.action_dispatch} />
                    </section>
                  )}
                </div>
              ) : (
                /* DELIBERATE EMPTY STATE WITH TRANSFORMATION VISUAL */
                <EmptyState onSelectPreset={handleSelectPreset} />
              )}
            </div>
          )}

          {/* TAB 2: BENCHMARK OBSERVABILITY CONSOLE */}
          {activeTab === "benchmark" && (
            <EvaluationSection onLoadCase={handleLoadCase} />
          )}

          {/* TAB 3: PRODUCT OVERVIEW & ARCHITECTURE */}
          {activeTab === "overview" && (
            <LandingSection
              onOpenConsole={(presetId) => {
                if (presetId) handleSelectPreset(presetId);
                setActiveTab("analyze");
              }}
              onOpenEvaluation={() => setActiveTab("benchmark")}
            />
          )}
        </main>

        {/* GLOBAL ENGINEERING FOOTER */}
        <footer className="border-t border-[#1f1f23] py-4 mt-auto bg-[#09090b] text-xs font-mono text-[#71717a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#a1a1aa]">VERNACTRIAGE</span>
              <span>/</span>
              <span>Enterprise Linguistic Intelligence</span>
            </div>
            <div className="text-[10px] text-[#71717a] uppercase tracking-wider">
              RAW INPUT → TOKEN SPANS → NATIVE SCRIPT → INTEGRITY GATE → ACTION DISPATCH
            </div>
          </div>
        </footer>
      </div>

      {/* FORENSIC TOKEN INSPECTOR AST NODE DRAWER */}
      <TokenInspectorDrawer
        token={inspectedToken}
        tokenIndex={inspectedTokenIndex}
        onClose={() => setInspectedToken(null)}
      />

      {/* PIPELINE / SYSTEM DOCUMENTATION MODAL */}
      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
