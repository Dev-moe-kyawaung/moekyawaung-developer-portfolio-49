import { useEffect, useRef, useState, useCallback } from "react";
import { volcano } from "../volcanicAudio";
import { Eye, EyeOff, Flame, Mountain, Sparkles, Thermometer, Gauge, Layers } from "lucide-react";

export type EruptionMode = "active" | "dormant" | "supervolcano" | "geyser";

export const ERUPTION_MODES: Record<EruptionMode, {
  name: string;
  desc: string;
  primary: string;
  secondary: string;
  intensity: number;
}> = {
  active: { name: "Active Stratovolcano", desc: "Steady magma flow + ember shower", primary: "#ff6b1a", secondary: "#ffd166", intensity: 1.0 },
  dormant: { name: "Dormant Obsidian Shield", desc: "Slow thermal glow + deep tremors", primary: "#ef4444", secondary: "#ff6b1a", intensity: 0.5 },
  supervolcano: { name: "Supervolcano Caldera", desc: "Full magma chamber + pyroclastic burst", primary: "#ffd166", secondary: "#ff6b1a", intensity: 1.8 },
  geyser: { name: "Geothermal Geyser Field", desc: "Periodic steam eruptions + fumaroles", primary: "#38bdf8", secondary: "#ffd166", intensity: 0.7 },
};

export default function VolcanicCanvas({
  mode = "active",
  onModeChange,
}: {
  mode?: EruptionMode;
  onModeChange?: (m: EruptionMode) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showLava, setShowLava] = useState(true);
  const [showEmbers, setShowEmbers] = useState(true);
  const [showCaldera, setShowCaldera] = useState(true);
  const [showHeatLines, setShowHeatLines] = useState(true);
  const [hudOpen, setHudOpen] = useState(false);

  const mouseRef = useRef({ x: -9999, y: -9999 });
  const cfg = ERUPTION_MODES[mode];

  const toggleHud = useCallback(() => {
    volcano.crackle();
    setHudOpen((v) => !v);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Ember particles
    type Ember = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; color: string; heat: number };
    let embers: Ember[] = [];
    const spawnEmber = (count: number) => {
      for (let i = 0; i < count; i++) {
        embers.push({
          x: w * 0.3 + Math.random() * w * 0.4,
          y: h + Math.random() * 30,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(1.5 + Math.random() * 2.5) * cfg.intensity,
          life: 0,
          maxLife: 80 + Math.random() * 60,
          size: 1 + Math.random() * 3,
          color: Math.random() > 0.4 ? cfg.primary : cfg.secondary,
          heat: 0.7 + Math.random() * 0.3,
        });
      }
    };

    // Lava rivers (horizontal sine-wave lanes)
    type LavaLane = { y: number; speed: number; amplitude: number; width: number; phase: number };
    let lanes: LavaLane[] = [];

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      embers = [];
      lanes = Array.from({ length: 4 }, (_, i) => ({
        y: h * (0.7 + i * 0.08),
        speed: 0.3 + Math.random() * 0.4,
        amplitude: 8 + Math.random() * 12,
        width: 3 + Math.random() * 4,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const onMove = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
    const onLeave = () => { mouseRef.current.x = -9999; mouseRef.current.y = -9999; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    // Spawn embers periodically
    const spawnInterval = setInterval(() => {
      if (showEmbers) spawnEmber(Math.ceil(3 * cfg.intensity));
    }, 180);

    const step = () => {
      t += 0.016;
      // Dark persistence trail
      ctx.fillStyle = "rgba(5, 5, 4, 0.24)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2 + (mouseRef.current.x > 0 ? (mouseRef.current.x - w / 2) * 0.02 : 0);
      const cy = h * 0.85;

      // 1. CALDERA GLOW (geothermal heat from below)
      if (showCaldera) {
        const calderaR = Math.max(w, h) * 0.6;
        const pulse = 1 + Math.sin(t * 1.5) * 0.08;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, calderaR * pulse);
        grad.addColorStop(0, cfg.primary + "35");
        grad.addColorStop(0.3, cfg.primary + "18");
        grad.addColorStop(0.6, cfg.secondary + "0a");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // 2. LAVA FLOW RIVERS
      if (showLava) {
        for (const lane of lanes) {
          ctx.beginPath();
          ctx.moveTo(0, lane.y);
          for (let x = 0; x <= w; x += 6) {
            const wave = Math.sin(x * 0.015 + t * lane.speed + lane.phase) * lane.amplitude;
            ctx.lineTo(x, lane.y + wave);
          }
          const glow = ctx.createLinearGradient(0, lane.y - 20, 0, lane.y + 20);
          glow.addColorStop(0, "transparent");
          glow.addColorStop(0.5, cfg.primary + "30");
          glow.addColorStop(1, "transparent");
          ctx.strokeStyle = cfg.primary + "55";
          ctx.lineWidth = lane.width;
          ctx.shadowColor = cfg.primary;
          ctx.shadowBlur = 12;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // 3. HEAT DISTORTION LINES (tectonic stress fractures)
      if (showHeatLines) {
        ctx.save();
        for (let i = 0; i < 8; i++) {
          const y = h * (0.55 + i * 0.06);
          const amplitude = 4 + Math.sin(t + i) * 3;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 8) {
            const yy = y + Math.sin(x * 0.008 + t * 2 + i * 1.5) * amplitude;
            if (x === 0) ctx.moveTo(x, yy);
            else ctx.lineTo(x, yy);
          }
          ctx.strokeStyle = `rgba(255,107,26,${0.04 + Math.sin(t + i * 0.5) * 0.02})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 4. EMBER PARTICLES
      if (showEmbers) {
        for (let i = embers.length - 1; i >= 0; i--) {
          const e = embers[i];
          e.x += e.vx + Math.sin(t * 2 + e.life * 0.1) * 0.3;
          e.y += e.vy;
          e.vy *= 0.995;
          e.life++;

          const lifeRatio = 1 - e.life / e.maxLife;
          if (lifeRatio <= 0) { embers.splice(i, 1); continue; }

          const alpha = lifeRatio * e.heat;
          const size = e.size * lifeRatio;

          ctx.beginPath();
          ctx.arc(e.x, e.y, size, 0, Math.PI * 2);
          ctx.fillStyle = e.color;
          ctx.globalAlpha = alpha;
          ctx.shadowColor = e.color;
          ctx.shadowBlur = size * 3;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      }

      // 5. Magma core singularity
      if (showCaldera) {
        const coreR = 18 + Math.sin(t * 2.5) * 6;
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.3, cfg.primary);
        coreGrad.addColorStop(0.7, cfg.secondary + "88");
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.shadowColor = cfg.primary;
        ctx.shadowBlur = 28;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(step);
    };

    step();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(spawnInterval);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [mode, cfg, showLava, showEmbers, showCaldera, showHeatLines]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />

      {/* Eruption HUD Controller (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-[75]">
        <button onClick={toggleHud} aria-label="Toggle Volcanic HUD"
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full volc-glass border border-[rgba(255,107,26,0.35)] text-xs font-mono text-[#fef3e2] hover:border-[#ff6b1a] shadow-lg hover:shadow-[0_0_25px_rgba(255,107,26,0.25)] transition-all duration-300">
          <Flame size={13} className="text-[#ff6b1a] animate-magma-pulse group-hover:scale-110 transition-transform" />
          <span className="tracking-widest hidden sm:inline">VOLCANIC_HUD</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffd166] animate-blink-soft" />
        </button>

        {hudOpen && (
          <div className="absolute bottom-12 left-0 w-80 volc-deep rounded-3xl border border-[rgba(255,107,26,0.4)] p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,107,26,0.2)] mb-3">
              <span className="f-mono text-[10px] tracking-[0.25em] text-[#ff6b1a] flex items-center gap-1.5">
                <Thermometer size={13} /> ERUPTION CONTROLS
              </span>
              <span className="f-mono text-[9px] text-[#ffd166]">v3.0 CALDERA</span>
            </div>

            {/* Layer Toggles */}
            <div className="space-y-2 mb-4">
              {[
                { label: "Lava Flow Rivers", active: showLava, set: setShowLava, Icon: Layers },
                { label: "Ember Particle Storm", active: showEmbers, set: setShowEmbers, Icon: Sparkles },
                { label: "Caldera Core Glow", active: showCaldera, set: setShowCaldera, Icon: Flame },
                { label: "Heat Distortion Lines", active: showHeatLines, set: setShowHeatLines, Icon: Mountain },
              ].map(({ label, active, set, Icon }) => (
                <button key={label}
                  onClick={() => { volcano.crackle(); set(!active); }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl f-mono text-[11px] transition-all border ${
                    active ? "bg-[rgba(255,107,26,0.15)] border-[rgba(255,107,26,0.45)] text-[#ff9a44]" : "bg-white/[0.02] border-white/5 text-[#a89b8c] hover:text-white"
                  }`}>
                  <span className="flex items-center gap-2"><Icon size={12} />{label}</span>
                  {active ? <Eye size={12} className="text-[#ffd166]" /> : <EyeOff size={12} />}
                </button>
              ))}
            </div>

            {/* Eruption Mode Selector */}
            <div className="pt-2 border-t border-[rgba(255,107,26,0.2)]">
              <div className="f-mono text-[9px] tracking-widest text-[#a89b8c] mb-2 uppercase flex items-center justify-between">
                <span>VOLCANIC ERUPTION TYPE</span>
                <Gauge size={11} className="text-[#ff6b1a]" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(ERUPTION_MODES) as EruptionMode[]).map((key) => {
                  const m = ERUPTION_MODES[key];
                  const isCurrent = mode === key;
                  return (
                    <button key={key}
                      onClick={() => { volcano.erupt(); onModeChange?.(key); }}
                      className={`flex flex-col items-start px-2.5 py-2 rounded-xl f-mono text-[10px] border transition-all text-left ${
                        isCurrent ? "border-[#ff6b1a] bg-[rgba(255,107,26,0.2)] text-white shadow-md shadow-orange-500/20" : "border-white/5 bg-white/[0.02] text-[#a89b8d] hover:text-white"
                      }`}>
                      <span className="font-bold flex items-center gap-1.5" style={{ color: m.primary }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.primary }} />
                        {m.name.split(" ")[0]}
                      </span>
                      <span className="text-[8px] opacity-70 mt-0.5">{m.desc.split("·")[0].trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
