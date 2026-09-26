"use client";

import React from "react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-[#27272a] bg-[#09090b] text-xs font-mono text-[#71717a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Brand logo & tagline */}
          <div className="space-y-2">
            <Image
              src="/assets/vernactriage-logo.png"
              alt="VernacTriage"
              width={140}
              height={32}
              className="h-7 w-auto object-contain"
            />
            <p className="text-xs text-[#a1a1aa] max-w-sm">
              The Lexical Compiler for the Unwritten Internet.
            </p>
          </div>

          {/* Center / Right: Links */}
          <nav className="flex flex-wrap items-center gap-6 text-xs text-[#a1a1aa]">
            <a href="#compiler" className="hover:text-[#fafafa] transition-colors">
              Compiler
            </a>
            <a href="#problem" className="hover:text-[#fafafa] transition-colors">
              The Problem
            </a>
            <a href="#architecture" className="hover:text-[#fafafa] transition-colors">
              Architecture
            </a>
            <a href="#verification" className="hover:text-[#fafafa] transition-colors">
              Verification Gate
            </a>
            <a href="#benchmarks" className="hover:text-[#fafafa] transition-colors">
              Benchmarks
            </a>
            <a
              href="https://github.com/codedByBurhan/VernacTriage"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#fafafa] transition-colors"
            >
              GitHub ↗
            </a>
          </nav>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-6 border-t border-[#27272a]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
          <div>
            Built with Next.js &amp; Gemini Flash. Deterministic Verification Engine.
          </div>
          <div>
            © {new Date().getFullYear()} VernacTriage. Enterprise Linguistic Intelligence.
          </div>
        </div>
      </div>
    </footer>
  );
}
