"use client";

import React, { useState } from "react";
import { EngineProvider } from "@/context/EngineContext";
import { StickyNavbar } from "@/components/StickyNavbar";
import { HeroSection } from "@/components/HeroSection";
import { InteractiveCompiler } from "@/components/InteractiveCompiler";
import { BreakingPointSection } from "@/components/BreakingPointSection";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { VerificationSection } from "@/components/VerificationSection";
import { BenchmarkSection } from "@/components/BenchmarkSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { CollisionModal } from "@/components/CollisionModal";
import { DocsModal } from "@/components/DocsModal";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { ToastContainer } from "@/components/ToastContainer";
import { AnalyzedToken } from "@/lib/types";
import { scrollToCompiler } from "@/lib/utils";

function MainContent() {
  const [modalToken, setModalToken] = useState<AnalyzedToken | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [externalLoad, setExternalLoad] = useState<{ text: string; ts: number } | undefined>(undefined);

  const handleLoadBenchmarkCase = (text: string) => {
    setExternalLoad({ text, ts: Date.now() });
    scrollToCompiler();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-[#10b981]/25 selection:text-white font-sans antialiased">
      {/* 1. Sticky Navigation with BYOK Engine & Key Controls */}
      <StickyNavbar onOpenDocs={() => setIsDocsOpen(true)} />

      <main>
        {/* 2. Hero Section */}
        <HeroSection onOpenDocs={() => setIsDocsOpen(true)} />

        {/* 3. Interactive Compiler (#compiler) */}
        <InteractiveCompiler
          onSelectTokenForModal={(token) => setModalToken(token)}
          externalLoadText={externalLoad?.text}
          externalLoadTimestamp={externalLoad?.ts}
        />

        {/* 4. The Breaking Point / Problem (#problem) */}
        <BreakingPointSection />

        {/* 5. Compiler Architecture (#architecture) */}
        <ArchitectureSection />

        {/* 6. Deterministic Verification (#verification) */}
        <VerificationSection />

        {/* 7. Empirical Benchmarks (#benchmarks) */}
        <BenchmarkSection onLoadCase={handleLoadBenchmarkCase} />

        {/* 8. Final Call to Action */}
        <FinalCTA />
      </main>

      {/* 9. Minimalist Enterprise Footer */}
      <Footer />

      {/* Slide-over / Modal Token Inspector & Collision Ledger */}
      <CollisionModal
        token={modalToken}
        onClose={() => setModalToken(null)}
      />

      {/* Technical Architecture & Specs Modal */}
      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Bring-Your-Own-Key (BYOK) Modal */}
      <ApiKeyModal />

      {/* Global Enterprise Toast System */}
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <EngineProvider>
      <MainContent />
    </EngineProvider>
  );
}
