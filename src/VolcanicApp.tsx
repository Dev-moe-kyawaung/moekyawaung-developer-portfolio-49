import { useState } from "react";
import VolcanicCanvas, { type EruptionMode } from "./components/VolcanicCanvas";
import GeothermalAI from "./components/GeothermalAI";
import {
  Nav, Hero, TapeMarquee, SeismicBar, Caldera, HeatZones,
  VolcanicCores, EruptionTimeline, ThermalVault, SignalVent,
  Footer, BackToTop
} from "./components/VolcanicSections";

export default function VolcanicApp() {
  const [mode, setMode] = useState<EruptionMode>("active");

  return (
    <div className="min-h-screen relative overflow-x-clip transition-colors duration-700" style={{ background: "#050504", color: "#fef3e2" }}>
      {/* Volcanic Eruption Engine: lava flows, ember particles, heat distortion, caldera glow */}
      <VolcanicCanvas mode={mode} onModeChange={setMode} />
      <div className="volc-vignette" />
      <div className="volc-grain" />

      {/* Geothermal AI Analyzer */}
      <GeothermalAI />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <TapeMarquee />
        <SeismicBar />
        <Caldera />
        <HeatZones />
        <VolcanicCores />
        <EruptionTimeline />
        <ThermalVault />
        <SignalVent />
      </main>

      <div className="relative z-10"><Footer /></div>
      <BackToTop />
    </div>
  );
}
