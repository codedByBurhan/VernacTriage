"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, ArrowRight, FileCode } from "lucide-react";

interface StickyNavbarProps {
  onOpenDocs: () => void;
}

export function StickyNavbar({ onOpenDocs }: StickyNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-250 ${
        isScrolled
          ? "bg-[#09090b]/90 backdrop-blur-md border-b border-[#27272a] shadow-sm"
          : "bg-[#09090b]/50 backdrop-blur-sm border-b border-[#27272a]/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <Image
              src="/assets/vernactriage-logo.png"
              alt="VernacTriage"
              width={140}
              height={32}
              className="h-7 w-auto object-contain transition-opacity group-hover:opacity-90"
              priority
            />
            <span className="hidden sm:inline-block font-mono text-[10px] text-[#71717a] px-1.5 py-0.5 rounded border border-[#27272a] bg-[#121215]">
              v1.4 Enterprise
            </span>
          </a>
        </div>

        {/* Center: Desktop Navigation Anchor Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-[#a1a1aa]">
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

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
          <button
            type="button"
            onClick={onOpenDocs}
            className="px-3 py-1.5 rounded-lg border border-[#27272a] hover:border-[#3f3f46] bg-[#0f0f12] text-[#a1a1aa] hover:text-[#fafafa] transition-colors cursor-pointer flex items-center gap-1.5"
            title="System Specifications"
          >
            <FileCode className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Architecture Specs</span>
          </button>

          <a
            href="#compiler"
            className="px-3.5 py-1.5 rounded-lg bg-[#fafafa] hover:bg-white text-[#09090b] font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>Launch Compiler</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
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
        <div className="sm:hidden border-b border-[#27272a] bg-[#0f0f12] px-4 py-3 space-y-2 text-xs font-mono">
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
