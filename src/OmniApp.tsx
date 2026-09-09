import { useState } from "react";
import OmniSphereCanvas, { type SphereMode } from "./components/OmniSphereCanvas";
import HoloEntity from "./components/HoloEntity";
import {
  Nav, Hero, Tape, About, Skills, HoloNodes, Timeline, Constellation, Contact, Footer, BackToTop,
} from "./components/OmniSections";

export default function OmniApp() {
  const [mode, setMode] = useState<SphereMode>("atlas");

  return (
    <div className="min-h-screen relative overflow-x-clip" style={{ background: "#02050d", color: "#e0f7ff" }}>
      {/* Rotating 3D sphere + volumetric light + starfield */}
      <OmniSphereCanvas mode={mode} onModeChange={setMode} />

      {/* Volumetric light beams (extra DOM layer for richer god-rays) */}
      <div className="vol-beams z-0">
        <span className="vol-beam" style={{ animationDelay: "1.5s" }} />
        <span className="vol-beam" style={{ animationDelay: "4.5s" }} />
      </div>

      <div className="omni-vignette" />
      <div className="omni-grain" />

      {/* Hologram entity AI */}
      <HoloEntity />

      <Nav />
      <main className="relative z-10">
        <Hero />
        <Tape />
        <About />
        <Skills />
        <HoloNodes />
        <Timeline />
        <Constellation />
        <Contact />
      </main>
      <div className="relative z-10"><Footer /></div>
      <BackToTop />
    </div>
  );
}
