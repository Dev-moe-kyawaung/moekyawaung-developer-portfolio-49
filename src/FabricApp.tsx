import { useState } from "react";
import WeaveCanvas, { type WeavePattern } from "./components/WeaveCanvas";
import WeaveEngineAI from "./components/WeaveEngineAI";
import WovenNodeGrid from "./components/WovenNodeGrid";
import {
  Nav,
  Hero,
  TapeMarquee,
  SomaCodex,
  SkillLoom,
  TapestryTimeline,
  SpoolVault,
  SignalLoom,
  Footer,
  BackToTop,
} from "./components/FabricSections";

export default function FabricApp() {
  const [currentPattern, setCurrentPattern] = useState<WeavePattern>("plain");

  return (
    <div
      className="min-h-screen relative overflow-x-clip transition-colors duration-700"
      style={{ background: "#060812", color: "#f0f4ff" }}
    >
      {/* 
        Interactive Digital Loom Canvas:
        - Elastic Warp & Weft Thread Grid Physics
        - Moiré Wave Interference
        - Filament Cross-Knot Sparks
        - Dynamic Pattern Switcher (Plain, Twill, Jacquard, Satin)
      */}
      <WeaveCanvas
        pattern={currentPattern}
        onPatternChange={setCurrentPattern}
      />

      {/* Loom Ambient Sheen Overlays */}
      <div className="fabric-vignette" />
      <div className="fabric-grain" />

      {/* Navigation Bar */}
      <Nav />

      {/* Main Fabric Flow */}
      <main className="relative z-10">
        {/* 1. Hero: Digital Tapestry Inception */}
        <Hero />

        {/* 2. Warp Thread Tape Marquee */}
        <TapeMarquee />

        {/* 3. Soma Codex: Philosophy & Biography */}
        <SomaCodex />

        {/* 4. Skill Loom: Gauges & Yarn Spools */}
        <SkillLoom />

        {/* 5. Weave-Engine AI: Interactive Pattern Analyzer */}
        <section id="weave-engine" className="relative py-16 md:py-24 max-w-7xl mx-auto px-5 md:px-8">
          <WeaveEngineAI />
        </section>

        {/* 6. Woven Nodes (Projects) with Expandable Case Studies */}
        <WovenNodeGrid />

        {/* 7. Tapestry Timeline: Continuous 2023-2026 Warp */}
        <TapestryTimeline />

        {/* 8. Spool Vault: 82+ Verified Credentials */}
        <SpoolVault />

        {/* 9. Signal Loom: Contact Channels */}
        <SignalLoom />
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Rewind Shuttle Button */}
      <BackToTop />
    </div>
  );
}
