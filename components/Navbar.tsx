"use client";

import React from "react";
import { Sparkles, Terminal, ShieldCheck, Cpu } from "lucide-react";

export function Navbar() {
  return (
    <header className="w-full border-b border-white/10 bg-[#0b0e17]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-[#0d111d] rounded-[11px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-lg text-white font-mono">
                VERNAC<span className="text-blue-400">TRIAGE</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                MVP Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans hidden sm:block">
              Decode the way people actually communicate.
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/5 text-xs text-zinc-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-zinc-400">Engine:</span>
            <span className="font-mono text-zinc-200">Gemini 2.5 Flash</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium hidden sm:inline">Verification Layer:</span>
            <span className="font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 inline" /> Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
