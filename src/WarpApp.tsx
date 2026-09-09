import { useState } from "react";
import StarfieldCanvas, { type DriveMode } from "./components/StarfieldCanvas";
import ShipComputer from "./components/ShipComputer";
import {
  BackToTop, Bridge, BridgeProfile, Certifications, Footer, HailingFrequencies,
  Missions, Nav, StardateLog, Systems, Tape,
} from "./components/WarpSections";

export default function WarpApp() {
  const [drive, setDrive] = useState<DriveMode>("impulse");

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#02030a] text-[#e8faff]">
      {/* Starfield + warp + gravity lens */}
      <StarfieldCanvas mode={drive} onModeChange={setDrive} />
      <div className="space-vignette" />
      <div className="space-noise" />

      {/* Ship computer MOTHER-9 */}
      <ShipComputer />

      <Nav />
      <main className="relative z-10">
        <Bridge />
        <Tape />
        <BridgeProfile />
        <Systems />
        <Missions />
        <StardateLog />
        <Certifications />
        <HailingFrequencies />
      </main>
      <div className="relative z-10"><Footer /></div>
      <BackToTop />
    </div>
  );
}
