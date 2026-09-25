"use client";

import React, { useEffect } from "react";
import { X, BookOpen, ShieldCheck, Terminal, Layers, ArrowRight } from "lucide-react";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-4 sm:inset-12 lg:inset-20 z-50 bg-[#111113] border border-[#27272a] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-4xl mx-auto my-auto max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f1f22] flex items-center justify-between bg-[#0f0f12]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#6366f1]" />
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#f4f4f5]">
              VernacTriage Engineering Documentation
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#18181b] text-[#71717a] hover:text-[#f4f4f5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#a1a1aa] font-sans leading-relaxed">
          {/* Section 1: Overview */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#f4f4f5] font-semibold">
              1. System Architecture
            </h3>
            <p>
              VernacTriage solves the breakdown of enterprise conversational AI when interacting with the 2+ billion speakers who communicate via code-switched vernaculars, phonetic romanization, and Arabizi numerals.
            </p>
            <div className="p-3 rounded-lg bg-[#09090b] border border-[#1f1f22] font-mono text-[11px] text-[#f4f4f5]">
              RAW INPUT STREAM → MORPHOLOGICAL DECOMPOSITION → DETERMINISTIC SPAN CURSOR → NATIVE RECONSTRUCTION → INVARIANT AUDIT GATE → ACTION DISPATCH
            </div>
          </div>

          {/* Section 2: 5 Invariant Guarantees */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#f4f4f5] font-semibold">
              2. Deterministic Invariant Guarantees
            </h3>
            <p>
              To ensure safety in fintech and logistics dispatch, the model output is passed to an invariant verification engine that calculates deterministic compliance with zero self-evaluation bias:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-[#f4f4f5]">Schema Validity:</strong> Output validated strictly against TypeScript JSON contract.
              </li>
              <li>
                <strong className="text-[#f4f4f5]">Span Alignment:</strong> A forward rolling cursor verifies token character offsets against exact source substrings.
              </li>
              <li>
                <strong className="text-[#f4f4f5]">Numeric Parity:</strong> Quantities, currencies, and time figures must match input figures with zero loss.
              </li>
              <li>
                <strong className="text-[#f4f4f5]">Negation Parity:</strong> Negation tokens (ni, nahi, ma, no) cannot be lost or inverted during canonical translation.
              </li>
              <li>
                <strong className="text-[#f4f4f5]">Entity Preservation:</strong> Extracted business entities are grounded in verified token spans.
              </li>
            </ul>
          </div>

          {/* Section 3: Cross-Lingual Homograph Disambiguation */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#f4f4f5] font-semibold">
              3. Cross-Lingual Homograph Disambiguation
            </h3>
            <p>
              Tokens that exist in multiple languages (e.g., <code className="text-amber-300 font-mono">me</code> in Hindi locative postposition vs. English objective pronoun) are detected and routed through the Collision Ledger with explicit selected and rejected interpretations.
            </p>
          </div>

          {/* Section 4: Machine Action Dispatch Payload */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#f4f4f5] font-semibold">
              4. Automated ERP/CRM Action Dispatch
            </h3>
            <p>
              Every verified triage result serializes a machine payload ready for downstream webhook invocation into systems like SAP, Salesforce, or Zendesk with priority tagging (P1/P2/P3).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1f1f22] bg-[#0f0f12] flex items-center justify-between text-[11px] font-mono text-[#71717a]">
          <span>VernacTriage v2.5 Specification</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-[#18181b] hover:bg-[#27272a] text-[#f4f4f5] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
