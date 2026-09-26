"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";
import { BorderBeam } from "@/components/BorderBeam";

interface FloatingPresetDockProps {
  selectedPresetId: string | null;
  onSelectPreset: (presetId: string) => void;
}

export function FloatingPresetDock({
  selectedPresetId,
  onSelectPreset,
}: FloatingPresetDockProps) {
  const presets = [
    {
      id: "financial_dispute",
      label: "#1 Hinglish Dispute",
      tag: "Numeric + Negation",
      accent: "#00e5a0",
    },
    {
      id: "homograph_collision",
      label: '#2 Homograph Trap: "me"',
      tag: "Collision Ledger",
      accent: "#f59e0b",
    },
    {
      id: "arabizi_escalation",
      label: "#3 Arabizi Alphanumeric",
      tag: "3rb Numerals",
      accent: "#00b8ff",
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0c0c0f]/90 border border-[#1f1f23] backdrop-blur-md shadow-sm shrink-0">
      <div className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-[#71717a] hidden sm:flex items-center gap-1">
        <Sparkles className="w-2.5 h-2.5 text-[#00e5a0]" />
        Presets:
      </div>

      <div className="flex items-center gap-1.5 flex-1 overflow-x-auto">
        {presets.map((preset) => {
          const isSelected = selectedPresetId === preset.id;

          return (
            <motion.button
              key={preset.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPreset(preset.id)}
              className={`relative flex-1 min-w-[130px] px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center justify-between gap-1.5 border overflow-hidden ${
                isSelected
                  ? "bg-[#16161b] border-[#00e5a0]/50 text-[#fafafa] shadow-xs"
                  : "bg-[#070709] border-[#1f1f23] text-[#a1a1aa] hover:text-[#fafafa] hover:border-[#27272a]"
              }`}
            >
              {isSelected && (
                <BorderBeam
                  size={140}
                  duration={8}
                  borderWidth={1}
                  colorFrom="#00e5a0"
                  colorTo="#00b8ff"
                />
              )}

              <div className="flex items-center gap-1.5 min-w-0">
                <Zap
                  className={`w-3 h-3 shrink-0 ${
                    isSelected ? "text-[#00e5a0] fill-current" : "text-[#71717a]"
                  }`}
                />
                <span className="font-semibold text-[11px] truncate tracking-tight">
                  {preset.label}
                </span>
              </div>

              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#0c0c0f] border border-[#1f1f23] text-[#71717a] hidden md:inline shrink-0">
                {preset.tag}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
