"use client";

import React, { useState } from "react";
import { ShieldCheck, Menu, X, BookOpen, Layers, BarChart3, Terminal } from "lucide-react";

export type NavTab = "product" | "console" | "evaluation";

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenDocs?: () => void;
}

export function Navbar({ activeTab, onTabChange, onOpenDocs }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full border-b border-[#27272a] bg-[#09090b]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Wordmark & Desktop Navigation */}
        <div className="flex items-center space-x-8">
          <button
            type="button"
            onClick={() => handleNavClick("product")}
            className="flex items-center space-x-2.5 text-left cursor-pointer group"
          >
            <div className="h-7 w-7 rounded-md bg-[#18181b] border border-[#27272a] flex items-center justify-center font-mono font-bold text-xs text-[#6366f1] group-hover:border-[#6366f1]/50 transition-colors">
              VT
            </div>
            <span className="font-bold text-sm tracking-tight text-[#f4f4f5] font-mono">
              VERNACTRIAGE
            </span>
          </button>

          {/* Nav Tabs */}
          <nav className="hidden sm:flex items-center space-x-1 border-l border-[#27272a] pl-6 text-xs">
            <button
              type="button"
              onClick={() => handleNavClick("product")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === "product"
                  ? "bg-[#18181b] text-[#f4f4f5] border border-[#27272a]"
                  : "text-[#a1a1aa] hover:text-[#f4f4f5]"
              }`}
            >
              Product
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("console")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "console"
                  ? "bg-[#18181b] text-[#f4f4f5] border border-[#27272a]"
                  : "text-[#a1a1aa] hover:text-[#f4f4f5]"
              }`}
            >
              <span>Console</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#6366f1]" />
            </button>
            <button
              type="button"
              onClick={() => handleNavClick("evaluation")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "evaluation"
                  ? "bg-[#18181b] text-[#f4f4f5] border border-[#27272a]"
                  : "text-[#a1a1aa] hover:text-[#f4f4f5]"
              }`}
            >
              <span>Evaluation</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#18181b] border border-[#27272a] text-[#71717a]">
                36
              </span>
            </button>
            {onOpenDocs && (
              <button
                type="button"
                onClick={onOpenDocs}
                className="px-3 py-1.5 rounded-md font-medium text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors cursor-pointer"
              >
                Documentation
              </button>
            )}
          </nav>
        </div>

        {/* Right Status Indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#111113] border border-[#27272a] text-xs font-mono text-[#a1a1aa]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <span className="text-[#f4f4f5] font-medium hidden sm:inline">System Operational</span>
            <span className="text-[#71717a] hidden md:inline">• Gemini 2.5 Flash</span>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 rounded-md border border-[#27272a] bg-[#111113] text-[#a1a1aa] hover:text-[#f4f4f5]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#27272a] bg-[#0f0f12] px-4 py-3 space-y-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => handleNavClick("product")}
            className={`w-full text-left px-3 py-2 rounded-md ${
              activeTab === "product"
                ? "bg-[#18181b] text-white"
                : "text-[#a1a1aa] hover:bg-[#18181b]"
            }`}
          >
            Product
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("console")}
            className={`w-full text-left px-3 py-2 rounded-md ${
              activeTab === "console"
                ? "bg-[#18181b] text-white"
                : "text-[#a1a1aa] hover:bg-[#18181b]"
            }`}
          >
            Console (Triage Workspace)
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("evaluation")}
            className={`w-full text-left px-3 py-2 rounded-md ${
              activeTab === "evaluation"
                ? "bg-[#18181b] text-white"
                : "text-[#a1a1aa] hover:bg-[#18181b]"
            }`}
          >
            Evaluation (Benchmark Matrix)
          </button>
          {onOpenDocs && (
            <button
              type="button"
              onClick={() => {
                onOpenDocs();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-[#a1a1aa] hover:bg-[#18181b]"
            >
              Documentation
            </button>
          )}
        </div>
      )}
    </header>
  );
}
