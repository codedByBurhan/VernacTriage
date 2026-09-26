"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useEngine } from "@/context/EngineContext";
import {
  Menu,
  X,
  ArrowRight,
  FileCode,
  Key,
  Edit2,
  Sparkles,
  Zap,
} from "lucide-react";

interface StickyNavbarProps {
  onOpenDocs: () => void;
}

export function StickyNavbar({ onOpenDocs }: StickyNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    engineMode,
    setEngineMode,
    hasKey,
    maskedKey,
    openKeyModal,
  } = useEngine();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Live Compiler", href: "#compiler" },
    { label: "The Problem", href: "#problem" },
    { label: "Architecture", href: "#architecture" },
    { label: "Verification", href: "#verification" },
    { label: "Benchmarks", href: "#benchmarks" },
  ];

  const isLive = mounted ? engineMode === "live" : false;
  const isKeyActive = mounted ? hasKey : false;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? "bg-[#09090b]/92 backdrop-blur-md border-b border-[#27272a] shadow-sm"
          : "bg-[#09090b]/60 backdrop-blur-sm border-b border-[#27272a]/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Visual Logo & Bold Text */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="relative h-8 sm:h-9 w-auto aspect-[345/246] flex items-center justify-center shrink-0">
              <Image
                src="/assets/vernactriage-visual-logo.png"
                alt="VernacTriage Visual Mark"
                width={48}
                height={34}
                className="h-full w-auto object-contain filter drop-shadow-[0_0_12px_rgba(34,211,238,0.25)] transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-[#fafafa] group-hover:text-white transition-colors">
                VernacTriage
              </span>
              <span className="hidden xl:inline-block font-mono text-[10px] text-[#71717a] px-1.5 py-0.5 rounded border border-[#27272a] bg-[#121215]">
                v1.4 Enterprise
              </span>
            </div>
          </a>
        </div>

        {/* Center: Desktop Navigation Anchor Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono text-[#a1a1aa]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-[#fafafa] relative py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Engine Mode Toggle & API Key Status */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs font-mono">
          {/* Mode Toggle Pill */}
          <div className="flex items-center p-0.5 rounded-lg border border-[#27272a] bg-[#0f0f12]">
            <button
              type="button"
              onClick={() => setEngineMode("demo")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                !isLive
                  ? "bg-[#18181b] text-[#fafafa] font-semibold shadow-xs"
                  : "text-[#71717a] hover:text-[#a1a1aa]"
              }`}
              title="Instant precomputed responses with zero API token consumption"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${!isLive ? "bg-[#10b981]" : "bg-[#71717a]"}`} />
              <span>Demo</span>
            </button>

            <button
              type="button"
              onClick={() => setEngineMode("live")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                isLive
                  ? "bg-[#18181b] text-[#fafafa] font-semibold shadow-xs"
                  : "text-[#71717a] hover:text-[#a1a1aa]"
              }`}
              title="Real-time execution via Gemini Flash"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-[#22d3ee] animate-pulse" : "bg-[#71717a]"}`} />
              <span>Live Engine</span>
            </button>
          </div>

          {/* API Key Status Button */}
          {isKeyActive ? (
            <button
              type="button"
              onClick={openKeyModal}
              className="px-2.5 py-1.5 rounded-lg border border-[#10b981]/40 bg-[#10b981]/10 text-[#fafafa] hover:border-[#10b981] transition-all cursor-pointer flex items-center gap-1.5 text-[11px]"
              title="Click to edit or clear your personal Gemini API key"
            >
              <Key className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-[#10b981] font-semibold">Key Active</span>
              <span className="text-[#a1a1aa] font-mono">({maskedKey})</span>
              <Edit2 className="w-3 h-3 text-[#71717a] ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={openKeyModal}
              className={`relative px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 text-[11px] ${
                isLive
                  ? "border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b] ring-2 ring-[#f59e0b]/40 animate-pulse"
                  : "border-[#27272a] hover:border-[#3f3f46] bg-[#0f0f12] text-[#a1a1aa] hover:text-[#fafafa]"
              }`}
              title="Add personal Google AI Studio API key"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Add Gemini Key</span>
            </button>
          )}

          {/* Launch Compiler Shortcut */}
          <a
            href="#compiler"
            className="px-3 py-1.5 rounded-lg bg-[#fafafa] hover:bg-white text-[#09090b] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs text-xs"
          >
            <span>Compiler</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Quick Engine Indicator on Mobile */}
          <button
            type="button"
            onClick={openKeyModal}
            className={`p-1.5 rounded-lg border text-xs font-mono flex items-center gap-1 ${
              isKeyActive
                ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]"
                : isLive
                ? "border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b]"
                : "border-[#27272a] bg-[#0f0f12] text-[#a1a1aa]"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-[#27272a] bg-[#0f0f12] text-[#a1a1aa]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#27272a] bg-[#0f0f12] px-4 py-3 space-y-3 text-xs font-mono">
          {/* Mode Switch on Mobile */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#09090b] border border-[#27272a]">
            <span className="text-[#71717a]">Engine Mode:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setEngineMode("demo")}
                className={`px-2 py-1 rounded text-[11px] ${
                  !isLive
                    ? "bg-[#18181b] text-[#10b981] font-semibold border border-[#27272a]"
                    : "text-[#71717a]"
                }`}
              >
                ● Demo
              </button>
              <button
                type="button"
                onClick={() => setEngineMode("live")}
                className={`px-2 py-1 rounded text-[11px] ${
                  isLive
                    ? "bg-[#18181b] text-[#22d3ee] font-semibold border border-[#27272a]"
                    : "text-[#71717a]"
                }`}
              >
                ● Live
              </button>
            </div>
          </div>

          {/* Key Button on Mobile */}
          <button
            type="button"
            onClick={() => {
              openKeyModal();
              setMobileMenuOpen(false);
            }}
            className={`w-full py-2 px-3 rounded-lg border flex items-center justify-between ${
              hasKey
                ? "border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]"
                : "border-[#27272a] bg-[#09090b] text-[#a1a1aa]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Key className="w-3.5 h-3.5" />
              <span>{hasKey ? `Key Active (${maskedKey})` : "Configure Gemini API Key"}</span>
            </div>
            <Edit2 className="w-3 h-3 text-[#71717a]" />
          </button>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-[#a1a1aa] hover:text-[#fafafa]"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-2 border-t border-[#27272a] flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenDocs();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg border border-[#27272a] text-[#a1a1aa] text-center"
            >
              Architecture Specs
            </button>
            <a
              href="#compiler"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 rounded-lg bg-[#fafafa] text-[#09090b] font-semibold text-center"
            >
              Launch Compiler
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
