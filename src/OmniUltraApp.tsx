import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { tape } from "./omnisphereData";
import AuraX from "./components/AuraX";
import {
  ApertureLoader,
  BackToTop,
  CommandPalette,
  Marquee,
  SpatialCursor,
  SpatialField,
} from "./components/OmniUltraFX";
import {
  Capabilities,
  Contact,
  Credentials,
  Evolution,
  Footer,
  Hero,
  Identity,
  Navigation,
  Projects,
  StatsBand,
} from "./components/OmniUltraSections";

const entries = [
  { id: "hero", label: "Omni-Sphere", hint: "home / spatial core" },
  { id: "identity", label: "Identity Volume", hint: "about Moe" },
  { id: "capabilities", label: "Capability Atlas", hint: "skills / stack" },
  { id: "projects", label: "Orbit Constellation", hint: "projects / case studies" },
  { id: "evolution", label: "Orbital Evolution", hint: "2023–2026" },
  { id: "credentials", label: "Credential Constellation", hint: "82+ certificates" },
  { id: "contact", label: "Transmission Relay", hint: "contact / hire" },
];

export default function OmniUltraApp() {
  const [booted, setBooted] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#01030a] text-[#edfaff]">
      <SpatialField />
      <div className="spatial-vignette" />
      <div className="spatial-noise" />
      <SpatialCursor />
      <AuraX />
      <CommandPalette entries={entries} />

      <AnimatePresence>
        {!booted && <ApertureLoader onDone={() => setBooted(true)} />}
      </AnimatePresence>

      <Navigation />
      <main className="relative z-10">
        <Hero />
        <StatsBand />
        <Marquee items={tape} />
        <Identity />
        <Capabilities />
        <Projects />
        <Evolution />
        <Credentials />
        <Contact />
      </main>
      <div className="relative z-10"><Footer /></div>
      <BackToTop />
    </div>
  );
}