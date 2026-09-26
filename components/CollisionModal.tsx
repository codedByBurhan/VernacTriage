"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AnalyzedToken } from "@/lib/types";
import {
  X,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Zap,
  Crosshair,
  Code2,
} from "lucide-react";

interface CollisionModalProps {
  token: AnalyzedToken | null;
  onClose: () => void;
}

export function CollisionModal({ token, onClose }: CollisionModalProps) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!token) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(token.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const hasCollision = Boolean(token.collision && token.collision.is_collision);

  // Fallbacks if inspecting token without collision
  const selectedMeaning =
    token.collision?.selected_meaning ||
    `Normalized: ${token.normalized_source || token.normalized || token.raw}`;
  const rejectedMeaning =
    token.collision?.rejected_meaning || "Alternative dialect interpretations discarded";
  const reasoning =
    token.collision?.reasoning ||
    token.explanation ||
    "Contextual syntax disambiguates lexical unit within surrounding code-switched frame.";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-full max-w-lg rounded-2xl bg-[#09090d]/95 border border-[#27272a] shadow-2xl p-5 space-y-4 font-mono text-xs z-10 overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 bg-[#00b8ff]/15 rounded-full blur-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1f1f23]">
            <div className="flex items-center gap-2.5">
              <Image
                src="/assets/icon-homograph-collision.png"
                alt="Homograph Collision"
                width={20}
                height={28}
                className="h-5 w-auto object-contain shrink-0"
              />
              <span className="font-bold text-sm text-[#fafafa] uppercase tracking-wider">
                Cross-Lingual Collision Ledger
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[#16161b] text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Token Hero Banner */}
          <div className="p-3.5 rounded-xl bg-[#070709] border border-[#1f1f23] flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#71717a] block">
                Inspected Token
              </span>
              <div className="text-xl font-bold text-white tracking-tight font-mono mt-0.5">
                &ldquo;{token.raw}&rdquo;
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#16161b] border border-[#27272a] text-[#00b8ff] font-bold">
                {token.language || token.detected_language || "Multi-dialect"}
              </span>

              <span className="text-[10px] text-[#71717a] flex items-center gap-1">
                <Crosshair className="w-3 h-3 text-[#00e5a0]" />
                [{token.start_idx}..{token.end_idx}]
              </span>
            </div>
          </div>

          {/* Collision Disambiguation Paths */}
          <div className="space-y-2.5">
            {/* Path A (Selected) */}
            <div className="p-3 rounded-xl bg-[#00e5a0]/5 border border-[#00e5a0]/30 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#00e5a0] text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Path A (Selected Interpretation)
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00e5a0]/15 text-[#00e5a0] font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-[#fafafa] font-sans font-medium pl-5">
                {selectedMeaning}
              </p>
            </div>

            {/* Path B (Rejected) */}
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                  <XCircle className="w-3.5 h-3.5" />
                  Path B (Rejected Interpretation)
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-400 font-bold">
                  PRUNED
                </span>
              </div>
              <p className="text-xs text-[#71717a] font-sans line-through pl-5">
                {rejectedMeaning}
              </p>
            </div>

            {/* Syntactic Reasoning Callout */}
            <div className="p-3 rounded-xl bg-[#070709] border border-[#1f1f23] space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">
                Syntactic Reasoning
              </span>
              <p className="text-xs text-[#a1a1aa] font-sans leading-relaxed">
                {reasoning}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-[#1f1f23] text-[10px] text-[#71717a]">
            <span>Deterministic Disambiguation Pass</span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded-md bg-[#16161b] hover:bg-[#222228] text-white transition-colors cursor-pointer"
            >
              Close (Esc)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
