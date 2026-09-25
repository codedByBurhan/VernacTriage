"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PipelineFlow } from "@/components/PipelineFlow";
import { LinguisticLegend } from "@/components/LinguisticLegend";
import {
  Sparkles,
  ArrowRight,
  Languages,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Braces,
  Fingerprint,
  FileCheck,
  Zap,
} from "lucide-react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
                DECODE THE WAY PEOPLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">ACTUALLY COMMUNICATE.</span>
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
          {/* LEFT COLUMN: Input Panel (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-zinc-100 uppercase tracking-wider font-mono">
                    Messy Input Stream
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  {inputText.length} / 500 chars
                </div>
              </div>

              {/* Presets Bar Placeholder (Phase 2 shell) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">
                    Quick Presets (1-Click Load):
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Phase 3 Active
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInputText(
                        "Bhai kl parcel deliver ni hua, plz check kro na wrna refund initiate kr do ASAP"
                      )
                    }
                    className="text-left p-2.5 rounded-lg bg-zinc-900/70 border border-amber-500/20 hover:border-amber-500/40 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-300">
                        1. Hinglish Delivery
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Hindi+Eng
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-1">
                      &quot;Bhai kl parcel deliver ni hua...&quot;
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setInputText(
                        "Yalla ya bro, el traffic ktir ktir zameh today, 7awel to arrive b4 8:00"
                      )
                    }
                    className="text-left p-2.5 rounded-lg bg-zinc-900/70 border border-purple-500/20 hover:border-purple-500/40 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-purple-300">
                        2. Arabizi Traffic
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Arabic 3rb
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-1">
                      &quot;Yalla ya bro, el traffic ktir...&quot;
                    </p>
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  rows={5}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or type messy multilingual text (e.g. Hinglish code-switching or Arabizi with numbers like 7awel, 3ala, etc.)..."
                  className="w-full rounded-xl bg-black/50 border border-white/10 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 font-sans resize-none transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  disabled={!inputText.trim()}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-blue-200" />
                  Analyze Input
                </button>

                {inputText && (
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
            </div>

            {/* Dialect Reference Guide */}
            <div className="glass-panel-subtle rounded-xl p-4 border border-white/5 space-y-2 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px] block">
                Target Linguistic Challenges
              </span>
              <ul className="space-y-1 list-disc list-inside text-zinc-400 text-[11px]">
                <li><strong className="text-zinc-200">Code-Switching:</strong> Intra-sentential matrix language alternating (e.g., Hindi + English).</li>
                <li><strong className="text-zinc-200">Phonetic Romanization:</strong> Non-standard phonetic Latin spellings (&quot;kl&quot;, &quot;ni&quot;, &quot;plz&quot;, &quot;wrna&quot;).</li>
                <li><strong className="text-zinc-200">Arabizi Numerals:</strong> Digits representing phonetic Arabic phonemes (e.g., &apos;7&apos; for ح / Ḥā&apos;, &apos;3&apos; for ع / &apos;Ayn).</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Results Workbench (lg:col-span-7) */}
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
                  Ready for Analysis
                </span>
              </div>

              {/* SECTION A Preview Shell: Token Breakdown */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Section A — Token Analysis & Classification
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Interactive Pills</span>
                </div>
                <div className="min-h-[70px] rounded-xl bg-black/40 border border-dashed border-white/10 p-3.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-zinc-500 italic">
                    Load a preset or click &quot;Analyze Input&quot; to inspect token-level language identification, phonetic types, and normalized native forms.
                  </span>
                </div>
              </div>

              {/* SECTION B Preview Shell: Canonical Dual-Script Reconstruction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Native Script Card */}
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

                {/* English Standard Card */}
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

              {/* SECTION C Preview Shell: Business Intent & Entities */}
              <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300">
                    Section C — Business Intent & Extracted Entities
                  </span>
                  <span className="text-[10px] text-purple-400/80 font-mono">
                    Triage Metadata
                  </span>
                </div>
                <div className="h-12 flex items-center text-xs text-zinc-500 italic">
                  Extracted intent labels, confidence scoring, and structured entity tags will display here.
                </div>
              </div>

              {/* SECTION D Preview Shell: AI Integrity Check */}
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
