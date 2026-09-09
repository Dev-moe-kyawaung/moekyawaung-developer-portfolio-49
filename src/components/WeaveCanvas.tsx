import { useEffect, useRef, useState, useCallback } from "react";
import { loomAudio } from "../fabricAudio";
import { SlidersHorizontal, Eye, EyeOff, Layers, Grid, Sparkles, Activity } from "lucide-react";

export type WeavePattern = "plain" | "twill" | "jacquard" | "satin";

export const WEAVE_PATTERNS: Record<
  WeavePattern,
  {
    name: string;
    description: string;
    warpColor: string;
    weftColor: string;
    density: number;
    tension: number;
  }
> = {
  plain: {
    name: "Plain Loom Weave",
    description: "Orthogonal 1-over-1 digital cross-stitch",
    warpColor: "#00f0ff",
    weftColor: "#b388ff",
    density: 28,
    tension: 0.85,
  },
  twill: {
    name: "Twill Diagonal Mesh",
    description: "Diagonal ribbed filament structure",
    warpColor: "#b388ff",
    weftColor: "#ffd740",
    density: 32,
    tension: 0.92,
  },
  jacquard: {
    name: "Jacquard Neural Matrix",
    description: "Complex morphing architectural tapestry",
    warpColor: "#00f0ff",
    weftColor: "#00e676",
    density: 36,
    tension: 0.95,
  },
  satin: {
    name: "Optic Silk Satin",
    description: "Floating continuous warp filaments",
    warpColor: "#ffd740",
    weftColor: "#ff4081",
    density: 24,
    tension: 0.78,
  },
};

export default function WeaveCanvas({
  pattern = "plain",
  onPatternChange,
}: {
  pattern?: WeavePattern;
  onPatternChange?: (p: WeavePattern) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Layer switches
  const [showWarp, setShowWarp] = useState(true);
  const [showWeft, setShowWeft] = useState(true);
  const [showSparks, setShowSparks] = useState(true);
  const [showMoiré, setShowMoiré] = useState(true);
  const [hudOpen, setHudOpen] = useState(false);

  const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 });
  const patternConfig = WEAVE_PATTERNS[pattern];

  const toggleHud = useCallback(() => {
    loomAudio.loomClick();
    setHudOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = ctx;

    let w = 0, h = 0, raf = 0, time = 0;

    // Physical Warp and Weft Thread Simulation points
    type ThreadKnot = {
      baseX: number;
      baseY: number;
      currX: number;
      currY: number;
      vx: number;
      vy: number;
      sparkEnergy: number;
    };

    let knots: ThreadKnot[][] = [];
    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

    const initLoomGrid = () => {
      const step = patternConfig.density;
      const cols = Math.ceil(w / step) + 2;
      const rows = Math.ceil(h / step) + 2;

      knots = [];
      for (let c = 0; c < cols; c++) {
        knots[c] = [];
        for (let r = 0; r < rows; r++) {
          knots[c][r] = {
            baseX: c * step,
            baseY: r * step,
            currX: c * step,
            currY: r * step,
            vx: 0,
            vy: 0,
            sparkEnergy: 0,
          };
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      initLoomGrid();
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseRef.current.x;
      const dy = e.clientY - mouseRef.current.y;
      mouseRef.current.speed = Math.sqrt(dx * dx + dy * dy);
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (mouseRef.current.speed > 8) {
        loomAudio.pluckThread(480 + (e.clientX / (w || 1)) * 320);
      }
    };

    const onLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      mouseRef.current.speed = 0;
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    // ========================================================
    // RENDER LOOP
    // ========================================================
    const render = () => {
      time += 0.016;
      g.fillStyle = "rgba(6, 8, 18, 0.28)";
      g.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mSpeed = mouseRef.current.speed;

      // 1. UPDATE ELASTIC WEFT/WARP THREAD KNOTS
      const cols = knots.length;
      const rows = knots[0]?.length || 0;
      const tension = patternConfig.tension;
      const damping = 0.88;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const k = knots[c][r];

          // Mouse elastic pluck interaction
          const dx = mx - k.currX;
          const dy = my - k.currY;
          const distSq = dx * dx + dy * dy;
          const pullDist = 130;

          if (distSq < pullDist * pullDist && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (pullDist - dist) / pullDist;
            const pushX = (dx / dist) * force * Math.min(22, mSpeed * 0.6);
            const pushY = (dy / dist) * force * Math.min(22, mSpeed * 0.6);

            k.vx += pushX;
            k.vy += pushY;
            k.sparkEnergy = Math.min(1, k.sparkEnergy + 0.35);

            // Spawn filament sparks on heavy interaction
            if (showSparks && Math.random() < 0.08) {
              particles.push({
                x: k.currX,
                y: k.currY,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                life: 1,
                color: Math.random() > 0.5 ? patternConfig.warpColor : patternConfig.weftColor,
              });
            }
          }

          // Hooke's Law Spring Force back to baseX / baseY
          const springX = (k.baseX - k.currX) * (1 - tension * 0.85);
          const springY = (k.baseY - k.currY) * (1 - tension * 0.85);

          k.vx = (k.vx + springX) * damping;
          k.vy = (k.vy + springY) * damping;

          k.currX += k.vx;
          k.currY += k.vy;
          k.sparkEnergy *= 0.94;
        }
      }

      // 2. SHIFTING MORPHING MOIRÉ MESH INTERFERENCE
      if (showMoiré) {
        g.save();
        const moireStep = 80;
        const moireCols = Math.ceil(w / moireStep);
        const moireRows = Math.ceil(h / moireStep);

        g.strokeStyle = "rgba(179, 136, 255, 0.035)";
        g.lineWidth = 1;

        for (let mc = 0; mc < moireCols; mc++) {
          for (let mr = 0; mr < moireRows; mr++) {
            const cx = mc * moireStep;
            const cy = mr * moireStep;
            const wave = Math.sin(mc * 0.2 + time) * Math.cos(mr * 0.2 + time * 0.8);
            const radius = 25 + wave * 16;

            g.beginPath();
            g.arc(cx, cy, radius, 0, Math.PI * 2);
            g.stroke();
          }
        }
        g.restore();
      }

      // 3. DRAW WARP THREADS (Vertical strands)
      if (showWarp) {
        g.save();
        for (let c = 0; c < cols; c += (pattern === "plain" ? 1 : 2)) {
          g.beginPath();
          for (let r = 0; r < rows; r++) {
            const k = knots[c][r];
            if (r === 0) g.moveTo(k.currX, k.currY);
            else g.lineTo(k.currX, k.currY);
          }

          const isOver = c % 2 === 0;
          const alpha = isOver ? 0.25 : 0.12;
          g.strokeStyle = `${patternConfig.warpColor}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
          g.lineWidth = isOver ? 1.4 : 0.8;
          g.stroke();
        }
        g.restore();
      }

      // 4. DRAW WEFT THREADS (Horizontal interlacing strands)
      if (showWeft) {
        g.save();
        for (let r = 0; r < rows; r += (pattern === "satin" ? 2 : 1)) {
          g.beginPath();
          for (let c = 0; c < cols; c++) {
            const k = knots[c][r];
            if (c === 0) g.moveTo(k.currX, k.currY);
            else g.lineTo(k.currX, k.currY);
          }

          const isOver = r % 2 === 1;
          const alpha = isOver ? 0.28 : 0.14;
          g.strokeStyle = `${patternConfig.weftColor}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
          g.lineWidth = isOver ? 1.4 : 0.9;
          g.stroke();
        }
        g.restore();
      }

      // 5. DRAW CROSS-STITCH KNOTS & FILAMENT PARTICLES
      g.save();
      for (let c = 0; c < cols; c += 2) {
        for (let r = 0; r < rows; r += 2) {
          const k = knots[c][r];
          if (k.sparkEnergy > 0.1) {
            g.beginPath();
            g.arc(k.currX, k.currY, 2 + k.sparkEnergy * 3.5, 0, Math.PI * 2);
            g.fillStyle = "#ffffff";
            g.shadowColor = patternConfig.warpColor;
            g.shadowBlur = 10;
            g.fill();
            g.shadowBlur = 0;
          }
        }
      }

      // Draw Sparks
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= 0.025;

        if (pt.life <= 0) {
          particles.splice(p, 1);
          continue;
        }

        g.beginPath();
        g.arc(pt.x, pt.y, pt.life * 2.2, 0, Math.PI * 2);
        g.fillStyle = pt.color;
        g.globalAlpha = pt.life;
        g.shadowColor = pt.color;
        g.shadowBlur = 8;
        g.fill();
        g.shadowBlur = 0;
        g.globalAlpha = 1;
      }
      g.restore();

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [pattern, patternConfig, showWarp, showWeft, showSparks, showMoiré]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden
      />

      {/* Floating Loom & Weave Pattern HUD (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-[75]">
        <button
          onClick={toggleHud}
          aria-label="Toggle Loom Fabric HUD"
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full fabric-panel border border-[rgba(179,136,255,0.35)] text-xs font-mono text-[#f0f4ff] hover:border-[#00f0ff] shadow-lg hover:shadow-[0_0_25px_rgba(0,240,255,0.25)] transition-all duration-300"
        >
          <SlidersHorizontal size={13} className="text-[#00f0ff] animate-spin-slow group-hover:rotate-180 transition-transform" />
          <span className="tracking-widest hidden sm:inline">LOOM_MATRIX</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
        </button>

        {hudOpen && (
          <div className="absolute bottom-12 left-0 w-80 fabric-panel rounded-3xl border border-[rgba(0,240,255,0.35)] p-5 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(179,136,255,0.18)] mb-3">
              <span className="font-mono text-[10px] tracking-[0.25em] text-[#00f0ff] flex items-center gap-1.5">
                <Grid size={13} /> DIGITAL LOOM CONTROLS
              </span>
              <span className="font-mono text-[9px] text-[#b388ff]">v4.2 SHED</span>
            </div>

            {/* Layer Toggles */}
            <div className="space-y-2 mb-4">
              {[
                { label: "Warp Threads (Vertical)", active: showWarp, set: setShowWarp, icon: Layers },
                { label: "Weft Threads (Horizontal)", active: showWeft, set: setShowWeft, icon: Grid },
                { label: "Cross-Knot Filament Sparks", active: showSparks, set: setShowSparks, icon: Sparkles },
                { label: "Moiré Wave Interference", active: showMoiré, set: setShowMoiré, icon: Activity },
              ].map(({ label, active, set, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => {
                    loomAudio.loomClick();
                    set(!active);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-mono text-[11px] transition-all border ${
                    active
                      ? "bg-[rgba(0,240,255,0.12)] border-[rgba(0,240,255,0.4)] text-[#00f0ff]"
                      : "bg-white/[0.02] border-white/5 text-[var(--fabric-muted)] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={12} className={active ? "text-[#00f0ff]" : "text-gray-500"} />
                    {label}
                  </span>
                  {active ? <Eye size={12} className="text-[#00e676]" /> : <EyeOff size={12} />}
                </button>
              ))}
            </div>

            {/* Fabric Weave Patterns */}
            <div className="pt-2 border-t border-[rgba(179,136,255,0.18)]">
              <div className="font-mono text-[9px] tracking-widest text-[#8c9bbd] mb-2 uppercase flex items-center justify-between">
                <span>WEAVE PATTERN SELECTOR</span>
                <span className="text-[#ffd740]">4 MODES</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(WEAVE_PATTERNS) as WeavePattern[]).map((key) => {
                  const pat = WEAVE_PATTERNS[key];
                  const isCurrent = pattern === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        loomAudio.shuttlePass();
                        onPatternChange?.(key);
                      }}
                      className={`flex flex-col items-start px-2.5 py-2 rounded-xl font-mono text-[10px] border transition-all text-left ${
                        isCurrent
                          ? "border-[#00f0ff] bg-[rgba(0,240,255,0.18)] text-white shadow-md shadow-cyan-500/20"
                          : "border-white/5 bg-white/[0.02] text-[#8c9bbd] hover:text-white hover:border-white/20"
                      }`}
                    >
                      <span className="font-bold flex items-center gap-1.5" style={{ color: pat.warpColor }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pat.warpColor }} />
                        {pat.name.split(" ")[0]}
                      </span>
                      <span className="text-[8px] opacity-70 mt-0.5 truncate w-full">{pat.description}</span>
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
