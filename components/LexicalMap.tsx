"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SpotlightCard } from "@/components/SpotlightCard";
import { AnalyzedToken } from "@/lib/types";
import { Sparkles, Zap, Layers, HelpCircle } from "lucide-react";

interface LexicalMapProps {
  tokens: AnalyzedToken[];
  onHoverToken: (token: AnalyzedToken | null) => void;
  onSelectToken: (token: AnalyzedToken, index: number) => void;
  selectedTokenIndex?: number | null;
  hoveredToken?: AnalyzedToken | null;
}

export function LexicalMap({
  tokens,
  onHoverToken,
  onSelectToken,
  selectedTokenIndex,
  hoveredToken,
}: LexicalMapProps) {
  const getTokenVisual = (token: AnalyzedToken, isSelected: boolean, isHovered: boolean) => {
    const hasCollision = Boolean(token.collision && token.collision.is_collision);
    const type = (token.type || token.classification || "").toLowerCase();
    const lang = (token.language || token.detected_language || "").toLowerCase();

    // 1. Cross-Lingual Homograph Collision Token
    if (hasCollision) {
      return {
        badgeLabel: "COLLISION",
        badgeStyle: "bg-cyan-500/20 text-[#00b8ff] border-cyan-400/40",
        containerStyle: `bg-cyan-950/40 border-[#00b8ff] text-[#fafafa] shadow-[0_0_15px_rgba(0,184,255,0.35)] ring-2 ring-[#00b8ff]/40 ${
          isSelected || isHovered ? "ring-4 ring-[#00b8ff]/70" : ""
        }`,
        dotColor: "bg-[#00b8ff]",
        isCollision: true,
      };
    }

    // 2. Phonetic Ear-Spelling
    if (
      type.includes("phonetic") ||
      type.includes("ear") ||
      type.includes("slang") ||
      type.includes("abbreviation")
    ) {
      return {
        badgeLabel: "PHONETIC",
        badgeStyle: "bg-rose-500/10 border-rose-500/30 text-rose-300",
        containerStyle: `bg-rose-950/20 border-rose-500/30 text-rose-100 hover:border-rose-400/60 ${
          isSelected || isHovered ? "border-rose-400 bg-rose-950/40 ring-1 ring-rose-400/40" : ""
        }`,
        dotColor: "bg-rose-400",
        isCollision: false,
      };
    }

    // 3. Romanized Vernacular
    if (
      type.includes("romanized") ||
      type.includes("transliterated") ||
      type.includes("arabizi") ||
      lang.includes("hindi") ||
      lang.includes("arabic")
    ) {
      return {
        badgeLabel: lang.includes("arabic") ? "ARABIZI" : "ROMANIZED",
        badgeStyle: "bg-amber-500/10 border-amber-500/30 text-amber-300",
        containerStyle: `bg-amber-950/20 border-amber-500/30 text-amber-100 hover:border-amber-400/60 ${
          isSelected || isHovered ? "border-amber-400 bg-amber-950/40 ring-1 ring-amber-400/40" : ""
        }`,
        dotColor: "bg-amber-400",
        isCollision: false,
      };
    }

    // 4. Standard English
    return {
      badgeLabel: "ENGLISH",
      badgeStyle: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
      containerStyle: `bg-indigo-950/20 border-indigo-500/30 text-indigo-100 hover:border-indigo-400/60 ${
        isSelected || isHovered ? "border-indigo-400 bg-indigo-950/40 ring-1 ring-indigo-400/40" : ""
      }`,
      dotColor: "bg-indigo-400",
      isCollision: false,
    };
  };

  return (
    <SpotlightCard className="p-3 border border-[#1f1f23] shrink-0 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#1f1f23] text-xs font-mono">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icon-phonetic-ear-spelling.png"
            alt="Phonetic Ear-Spelling"
            width={20}
            height={18}
            className="h-3.5 w-auto object-contain shrink-0"
          />
          <span className="font-bold uppercase tracking-wider text-[#fafafa] text-[11px]">
            Interactive Lexical Map
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#070709] border border-[#1f1f23] text-[#71717a]">
            {tokens.length} Lexical Units
          </span>
        </div>

        <span className="text-[10px] text-[#71717a] hidden sm:inline">
          Hover to isolate span • Click to open Collision Ledger
        </span>
      </div>

      {/* Floating Badges Stream */}
      <div className="flex flex-wrap gap-1.5 items-center py-1">
        {tokens.map((token, idx) => {
          const isSelected = selectedTokenIndex === idx;
          const isHovered = hoveredToken === token;
          const { badgeLabel, badgeStyle, containerStyle, dotColor, isCollision } =
            getTokenVisual(token, isSelected, isHovered);

          return (
            <motion.button
              key={idx}
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onMouseEnter={() => onHoverToken(token)}
              onMouseLeave={() => onHoverToken(null)}
              onClick={() => onSelectToken(token, idx)}
              className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer backdrop-blur-md ${containerStyle}`}
              title={`Token #${idx}: "${token.raw}" [${token.start_idx}..${token.end_idx}] — Click to inspect`}
            >
              {isCollision && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b8ff] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00b8ff]" />
                </span>
              )}

              {!isCollision && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}

              <span className="font-bold text-xs tracking-tight text-white font-mono">
                {token.raw}
              </span>

              {isCollision ? (
                <span className="flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.2 rounded bg-[#00b8ff]/20 text-[#00b8ff] border border-[#00b8ff]/40">
                  <Zap className="w-2.5 h-2.5 fill-current text-[#00b8ff]" />
                  <span>HOMOGRAPH</span>
                </span>
              ) : (
                <span
                  className={`text-[8px] font-mono px-1 py-0.2 rounded border uppercase tracking-wider font-semibold ${badgeStyle}`}
                >
                  {badgeLabel}
                </span>
              )}

              {token.is_negation && (
                <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  NEG
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </SpotlightCard>
  );
}
