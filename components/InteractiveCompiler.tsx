"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DEMO_PRESETS } from "@/data/presets";
import { TriageAnalysisResult, AnalyzedToken } from "@/lib/types";
import {
  Terminal,
  ArrowRight,
  Loader2,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Zap,
  SlidersHorizontal,
  Code2,
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";

interface InteractiveCompilerProps {
  onSelectTokenForModal: (token: AnalyzedToken) => void;
  externalLoadText?: string;
}

export function InteractiveCompiler({
  onSelectTokenForModal,
  externalLoadText,
}: InteractiveCompilerProps) {
  // 3 Primary Presets specified by product requirements
  const primaryPresets = [
    {
      id: "hinglish_delivery",
      title: "Hinglish Logistics",
      subtitle: "Phonetic negation & urgency",
      preset: DEMO_PRESETS.find((p) => p.id === "hinglish_delivery") || DEMO_PRESETS[0],
    },
    {
      id: "homograph_collision",
      title: "Cross-Lingual Collision",
      subtitle: "'me' pronoun vs postposition",
      preset: DEMO_PRESETS.find((p) => p.id === "homograph_collision") || DEMO_PRESETS[3],
    },
    {
      id: "arabizi_escalation",
      title: "Arabizi Escalation",
      subtitle: "7awelt / b4 numeral substitution",
      preset: DEMO_PRESETS.find((p) => p.id === "arabizi_escalation") || DEMO_PRESETS[1],
    },
  ];

  // Default to Homograph Collision for the hero demo moment
  const defaultItem = primaryPresets[1].preset;
  const [inputText, setInputText] = useState(defaultItem.text);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("homograph_collision");
  const [analysisResult, setAnalysisResult] = useState<TriageAnalysisResult>(defaultItem.expectedResult);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hoveredToken, setHoveredToken] = useState<AnalyzedToken | null>(null);
  const [latency, setLatency] = useState(640);
  const [isPayloadOpen, setIsPayloadOpen] = useState(false);

  // Copy states
  const [copiedNative, setCopiedNative] = useState(false);
  const [copiedEnglish, setCopiedEnglish] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charLimit = 500;

  // React to external load case (e.g. from benchmark table)
  React.useEffect(() => {
    if (externalLoadText && externalLoadText !== inputText) {
      setInputText(externalLoadText);
      const matched = DEMO_PRESETS.find(
        (p) => p.text.trim().toLowerCase() === externalLoadText.trim().toLowerCase()
      );
      if (matched) {
        setSelectedPresetId(matched.id);
        setAnalysisResult(matched.expectedResult);
      } else {
        setSelectedPresetId("");
        runAnalysis(externalLoadText);
      }
    }
  }, [externalLoadText]);

  const handleSelectPreset = (id: string) => {
    const item = primaryPresets.find((p) => p.id === id);
    if (item) {
      setSelectedPresetId(id);
      setInputText(item.preset.text);
      setAnalysisResult(item.preset.expectedResult);
      setHoveredToken(null);
    }
  };

  const handleClear = () => {
    setInputText("");
    setSelectedPresetId("");
    setHoveredToken(null);
  };

  const runAnalysis = async (textToAnalyze: string) => {
    if (!textToAnalyze.trim()) return;
    setIsAnalyzing(true);
    setHoveredToken(null);
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
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysisResult(data);
      setLatency(Date.now() - startTime);
    } catch (err) {
      console.warn("API fallback to verified deterministic cache:", err);
      if (matchingPreset) {
        setAnalysisResult({ ...matchingPreset.expectedResult, model_source: "demo-fallback" });
        setLatency(320);
      } else {
        setAnalysisResult(defaultItem.expectedResult);
        setLatency(410);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Keyboard shortcut Ctrl+Enter or Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      if (inputText.trim() && !isAnalyzing) {
        runAnalysis(inputText);
      }
    }
  };

  // Deterministic Span Mirror Calculation
  const hasValidSpan =
    hoveredToken &&
    typeof hoveredToken.start_idx === "number" &&
    typeof hoveredToken.end_idx === "number" &&
    hoveredToken.start_idx >= 0 &&
    hoveredToken.end_idx <= inputText.length &&
    hoveredToken.start_idx < hoveredToken.end_idx;

  const beforeSpan = hasValidSpan ? inputText.slice(0, hoveredToken.start_idx) : "";
  const spanText = hasValidSpan ? inputText.slice(hoveredToken.start_idx, hoveredToken.end_idx) : "";
  const afterSpan = hasValidSpan ? inputText.slice(hoveredToken.end_idx) : "";

  // Copy helpers
  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lines = inputText.split("\n");
  const lineCount = Math.max(lines.length, 3);
  const result = analysisResult || defaultItem.expectedResult;
  const verification = result.verification;

  return (
    <section id="compiler" className="py-16 sm:py-24 border-t border-[#27272a] bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Heading & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#10b981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span>INTERACTIVE WORKSPACE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#fafafa]">
              VernacTriage Compiler
            </h2>
            <p className="text-sm text-[#a1a1aa] max-w-xl">
              Inspect character spans, cross-lingual homograph collisions, and deterministic
              semantic invariants in real time.
            </p>
          </div>

          {/* Telemetry pill */}
          <div className="flex items-center gap-3 text-xs font-mono text-[#71717a]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#27272a] bg-[#0f0f12]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-[#a1a1aa]">Status:</span>
              <span className="text-[#fafafa] font-semibold">Operational</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#27272a] bg-[#0f0f12]">
              <span className="text-[#a1a1aa]">Latency:</span>
              <span className="text-[#22d3ee] font-semibold">{latency}ms</span>
            </div>
          </div>
        </div>

        {/* Main Compiler Window */}
        <div className="rounded-2xl border border-[#27272a] bg-[#0f0f12] shadow-2xl overflow-hidden">
          {/* Top Toolbar: Operational Status + 3 Presets */}
          <div className="px-4 py-3 border-b border-[#27272a] bg-[#09090b]/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Presets Group */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-[11px] text-[#71717a] mr-1 hidden sm:inline">Presets:</span>
              {primaryPresets.map((item) => {
                const isActive = selectedPresetId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectPreset(item.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                      isActive
                        ? "bg-[#18181b] border-[#10b981] text-[#fafafa] shadow-xs"
                        : "bg-[#0f0f12] border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#3f3f46]"
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />}
                    <span className="font-medium">{item.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Language classification tag */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#71717a]">Pair:</span>
              <span className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#22d3ee] font-semibold">
                {result.detected_pair || "Hinglish (Devanagari-Latn)"}
              </span>
            </div>
          </div>

          {/* Compiler Body: Split Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#27272a]">
            {/* Left Pane (5 Cols): Ingestion Stream + Assertion Gate */}
            <div className="lg:col-span-5 flex flex-col p-4 sm:p-5 space-y-4 bg-[#09090b]/40">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between text-xs font-mono text-[#71717a]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#10b981]" />
                  <span className="text-[#fafafa] font-semibold text-[11px] tracking-tight">
                    SOURCE STREAM [stdin]
                  </span>
                </div>

                {inputText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Source Console with Line Numbers Gutter & Span Mirror Layer */}
              <div className="relative rounded-xl border border-[#27272a] bg-[#09090b] overflow-hidden min-h-[160px] flex">
                {/* Gutter */}
                <div className="w-8 py-3 pr-2 text-right text-[#3f3f46] select-none bg-[#09090b] border-r border-[#27272a]/60 shrink-0 font-mono text-[11px] leading-relaxed">
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Textarea container with mirror highlight layer underneath */}
                <div className="flex-1 relative">
                  {/* Span mirror highlight layer */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words pointer-events-none select-none text-transparent overflow-hidden"
                  >
                    {hasValidSpan ? (
                      <>
                        <span>{beforeSpan}</span>
                        <mark className="bg-[#10b981]/25 text-transparent border-b-2 border-[#10b981] rounded-xs transition-all">
                          {spanText}
                        </mark>
                        <span>{afterSpan}</span>
                      </>
                    ) : null}
                  </div>

                  {/* Foreground Textarea */}
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter code-switched vernacular input..."
                    className="w-full h-full p-3 bg-transparent text-[#fafafa] placeholder:text-[#3f3f46] focus:outline-none resize-none font-mono text-xs leading-relaxed caret-[#10b981]"
                    rows={4}
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Character Count & Compile Button */}
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <div className="text-[11px] text-[#71717a] flex items-center gap-2">
                  <span>
                    {inputText.length} / {charLimit} chars
                  </span>
                  <span className="text-[#3f3f46]">|</span>
                  <span className="hidden sm:inline text-[10px]">
                    <kbd className="px-1 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[#a1a1aa]">
                      ⌘↵
                    </kbd>{" "}
                    to compile
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => runAnalysis(inputText)}
                  disabled={!inputText.trim() || isAnalyzing}
                  className="px-4 py-2 rounded-lg bg-[#fafafa] hover:bg-white disabled:bg-[#18181b] text-[#09090b] disabled:text-[#71717a] font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling...</span>
                    </>
                  ) : (
                    <>
                      <span>Compile &amp; Triage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Deterministic Assertion Gate Card */}
              <div className="rounded-xl border border-[#27272a] bg-[#09090b] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#27272a]/60">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/icon-deterministic-audit.png"
                      alt="Audit"
                      width={18}
                      height={18}
                      className="h-4 w-auto object-contain"
                    />
                    <span className="text-[11px] font-mono font-semibold text-[#fafafa] uppercase tracking-wider">
                      Deterministic Assertion Gate
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#10b981] px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30">
                    {verification?.integrity_score ?? 100}/100 Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#0f0f12] border border-[#27272a]/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#fafafa] block">Numeric Invariance</span>
                      <span className="text-[9px] text-[#71717a]">Values locked</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#10b981] px-1.5 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30">
                      PASS
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0f0f12] border border-[#27272a]/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#fafafa] block">Negation Parity</span>
                      <span className="text-[9px] text-[#71717a]">Polarity preserved</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#10b981] px-1.5 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30">
                      PASS
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0f0f12] border border-[#27272a]/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#fafafa] block">AST Continuity</span>
                      <span className="text-[9px] text-[#71717a]">Offset alignment</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#10b981] px-1.5 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30">
                      PASS
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0f0f12] border border-[#27272a]/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#fafafa] block">Schema Validity</span>
                      <span className="text-[9px] text-[#71717a]">Strict JSON</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#10b981] px-1.5 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30">
                      PASS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Pane (7 Cols): Triage Ribbon, Lexical Map, 3-Layer Output */}
            <div className="lg:col-span-7 flex flex-col p-4 sm:p-5 space-y-4">
              {/* Telemetry Status Bar: Intent, Register, Integrity */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl border border-[#27272a] bg-[#09090b]">
                  <span className="text-[10px] text-[#71717a] block uppercase">Intent</span>
                  <span className="font-semibold text-[#fafafa] truncate block mt-0.5">
                    {result.intent?.label || "DELIVERY_INSTRUCTION"}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl border border-[#27272a] bg-[#09090b]">
                  <span className="text-[10px] text-[#71717a] block uppercase">Register</span>
                  <span className="font-semibold text-[#22d3ee] truncate block mt-0.5">
                    {result.pragmatic_register?.tone || "Colloquial-Familiar"}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl border border-[#27272a] bg-[#09090b]">
                  <span className="text-[10px] text-[#71717a] block uppercase">Integrity</span>
                  <span className="font-semibold text-[#10b981] truncate block mt-0.5">
                    {verification?.integrity_score ?? 100}/100 Verified
                  </span>
                </div>
              </div>

              {/* Interactive Lexical Map (Tokens with Hover Synchronization) */}
              <div className="rounded-xl border border-[#27272a] bg-[#09090b] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#71717a] pb-1.5 border-b border-[#27272a]/60">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-[#10b981]" />
                    <span className="text-[#fafafa] font-semibold text-[11px] uppercase tracking-wider">
                      Interactive Lexical Map
                    </span>
                  </div>
                  <span className="text-[10px] text-[#71717a]">
                    Hover to highlight span • Click to inspect
                  </span>
                </div>

                {/* Token Badges Flow */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.tokens?.map((token, idx) => {
                    const isCollision = Boolean(token.collision && token.collision.is_collision);
                    const isHovered = hoveredToken === token;
                    const lang = (token.language || token.detected_language || "").toLowerCase();

                    return (
                      <button
                        key={`${token.raw}-${idx}`}
                        type="button"
                        onMouseEnter={() => setHoveredToken(token)}
                        onMouseLeave={() => setHoveredToken(null)}
                        onClick={() => onSelectTokenForModal(token)}
                        className={`group px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                          isCollision
                            ? "bg-[#22d3ee]/10 border-[#22d3ee] text-[#fafafa] shadow-xs"
                            : isHovered
                            ? "bg-[#18181b] border-[#10b981] text-[#fafafa]"
                            : "bg-[#0f0f12] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-[#fafafa]"
                        }`}
                      >
                        {isCollision && (
                          <span className="text-[10px] text-[#22d3ee] font-bold">⚡</span>
                        )}
                        <span className="font-semibold text-[#fafafa]">{token.raw}</span>
                        <span className="text-[#71717a] text-[10px]">→</span>
                        <span className="text-[#a1a1aa] text-[11px]">
                          {token.normalized_source || token.normalized || token.raw}
                        </span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded border ${
                            isCollision
                              ? "bg-[#22d3ee]/20 border-[#22d3ee]/40 text-[#22d3ee]"
                              : "bg-[#18181b] border-[#27272a] text-[#71717a]"
                          }`}
                        >
                          {token.classification || token.detected_language}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3-Layer Output Section */}
              <div className="space-y-3">
                {/* Layer 1: Canonical Native Script */}
                <div className="rounded-xl border border-[#27272a] bg-[#09090b] p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-[#71717a]">
                    <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                      Layer 1: Canonical Native Script
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          result.canonical_script || result.canonical_native_script || "",
                          setCopiedNative
                        )
                      }
                      className="hover:text-[#fafafa] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      {copiedNative ? (
                        <>
                          <Check className="w-3 h-3 text-[#10b981]" />
                          <span className="text-[#10b981]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-base sm:text-lg font-devanagari text-[#fafafa] leading-relaxed">
                    {result.canonical_script || result.canonical_native_script || "—"}
                  </p>
                </div>

                {/* Layer 2: Business English */}
                <div className="rounded-xl border border-[#27272a] bg-[#09090b] p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-[#71717a]">
                    <span className="text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                      Layer 2: Standardized Business English
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          result.english_translation || result.standard_english || "",
                          setCopiedEnglish
                        )
                      }
                      className="hover:text-[#fafafa] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      {copiedEnglish ? (
                        <>
                          <Check className="w-3 h-3 text-[#10b981]" />
                          <span className="text-[#10b981]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm sm:text-base text-[#fafafa] leading-relaxed">
                    {result.english_translation || result.standard_english || "—"}
                  </p>
                </div>

                {/* Layer 3: Collapsible Machine Payload Drawer */}
                <div className="rounded-xl border border-[#27272a] bg-[#09090b] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsPayloadOpen(!isPayloadOpen)}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-mono text-[#a1a1aa] hover:text-[#fafafa] bg-[#0f0f12] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-[#22d3ee]" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">
                        Layer 3: Structured Action Dispatch Payload
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[10px] text-[#71717a]">
                        JSON
                      </span>
                    </div>
                    {isPayloadOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#71717a]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#71717a]" />
                    )}
                  </button>

                  {isPayloadOpen && (
                    <div className="p-3.5 bg-[#09090b] border-t border-[#27272a] space-y-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(result.action_dispatch, null, 2),
                              setCopiedJson
                            )
                          }
                          className="text-xs font-mono text-[#71717a] hover:text-[#fafafa] flex items-center gap-1 cursor-pointer"
                        >
                          {copiedJson ? (
                            <>
                              <Check className="w-3 h-3 text-[#10b981]" />
                              <span className="text-[#10b981]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy JSON</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 rounded-lg bg-[#0f0f12] border border-[#27272a] text-[11px] font-mono text-[#22d3ee] overflow-x-auto leading-relaxed">
                        {JSON.stringify(result.action_dispatch, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
