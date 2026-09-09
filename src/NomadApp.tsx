import { useState } from "react";
import NomadCanvas, { type TerrainMode } from "./components/NomadCanvas";
import NavDrone from "./components/NavDrone";
import {
  BackToTop, Basecamp, Expeditions, Footer, Gear, Hero, Journey, Nav,
  SignalFire, Tape, Territories,
} from "./components/NomadSections";

export default function NomadApp() {
  const [terrain, setTerrain] = useState<TerrainMode>("night");

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#070a06] text-[#f2f0e4]">
      {/* map grid + terrain contours + satellite pass + radar sweep */}
      <NomadCanvas mode={terrain} onModeChange={setTerrain} />
      <div className="nomad-vignette" />
      <div className="nomad-grain" />

      {/* SCOUT-7 navigation drone */}
      <NavDrone />

      <Nav />
      <main className="relative z-10">
        <Hero />
        <Tape />
        <Basecamp />
        <Gear />
        <Expeditions />
        <Journey />
        <Territories />
        <SignalFire />
      </main>
      <div className="relative z-10"><Footer /></div>
      <BackToTop />
    </div>
  );
}
