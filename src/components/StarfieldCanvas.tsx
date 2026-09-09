import { useEffect, useRef, useState } from "react";
import { warp } from "../warpAudio";
import { Gauge, Orbit, Radar, Stars, Waves, Zap } from "lucide-react";

export type DriveMode = "impulse" | "warp" | "nebula" | "red-alert";
const DRIVE_MODES: Record<DriveMode, { name: string; desc: string; star: string; warp: string; lens: string }> = {
  impulse: { name: "Impulse Drive", desc: "Standard starfield", star: "#ffffff", warp: "#4ef0ff", lens: "#b77bff" },
  warp: { name: "Warp Factor 9", desc: "Light speed streaks", star: "#4ef0ff", warp: "#4ef0ff", lens: "#b77bff" },
  nebula: { name: "Nebula Passage", desc: "Violet clouds", star: "#b77bff", warp: "#b77bff", lens: "#ff4d6a" },
  "red-alert": { name: "Red Alert", desc: "Combat systems", star: "#ff4d6a", warp: "#ff4d6a", lens: "#ffb84a" },
};

function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function StarfieldCanvas({ mode, onModeChange }: {
  mode: DriveMode;
  onModeChange: (m: DriveMode) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showStars, setShowStars] = useState(true);
  const [showWarp, setShowWarp] = useState(true);
  const [showLens, setShowLens] = useState(true);
  const [showNebula, setShowNebula] = useState(true);
  const [hud, setHud] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const cfg = DRIVE_MODES[mode];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    let w = 0, h = 0, raf = 0, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const starC = rgb(cfg.star);
    const warpC = rgb(cfg.warp);
    const lensC = rgb(cfg.lens);

    type Star = { x: number; y: number; z: number; pz: number; r: number };
    let stars: Star[] = [];
    type Streak = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; len: number };
    let streaks: Streak[] = [];

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: 220 }, () => ({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * 1200,
        pz: 0,
        r: 0.5 + Math.random() * 1.5,
      }));
    };
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);

    const draw = () => {
      t += 0.016;
      // Dark space fade
      ctx.fillStyle = "rgba(2,3,10,0.28)";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2 + mouse.current.x * 40;
      const cy = h / 2 + mouse.current.y * 30;
      const warpActive = mode === "warp";

      // 1. NEBULA CLOUDS
      if (showNebula) {
        const clouds = [
          { x: w * 0.2, y: h * 0.3, r: 240, color: lensC },
          { x: w * 0.8, y: h * 0.7, r: 300, color: warpC },
          { x: w * 0.5, y: h * 0.15, r: 200, color: starC },
        ];
        for (const c of clouds) {
          const px = c.x + Math.sin(t * 0.3 + c.x * 0.001) * 20;
          const py = c.y + Math.cos(t * 0.2 + c.y * 0.001) * 15;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, c.r);
          grad.addColorStop(0, `rgba(${c.color.r},${c.color.g},${c.color.b},0.08)`);
          grad.addColorStop(0.5, `rgba(${c.color.r},${c.color.g},${c.color.b},0.03)`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, c.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. STARFIELD (3D tunnel with warp acceleration)
      if (showStars) {
        const speed = warpActive ? 14 : 2;
        for (const s of stars) {
          s.pz = s.z;
          s.z -= speed;
          if (s.z <= 0) {
            s.x = (Math.random() - 0.5) * w * 2;
            s.y = (Math.random() - 0.5) * h * 2;
            s.z = 1200;
            s.pz = 1200;
          }
          const sx = (s.x / s.z) * 600 + cx;
          const sy = (s.y / s.z) * 600 + cy;
          const psx = (s.x / s.pz) * 600 + cx;
          const psy = (s.y / s.pz) * 600 + cy;
          const size = (1 - s.z / 1200) * s.r;

          if (warpActive) {
            // Draw streaks in warp mode
            ctx.beginPath();
            ctx.moveTo(psx, psy);
            ctx.lineTo(sx, sy);
            ctx.strokeStyle = `rgba(${starC.r},${starC.g},${starC.b},${(1 - s.z / 1200) * 0.9})`;
            ctx.lineWidth = size * 1.5;
            ctx.stroke();
          } else {
            // Normal stars
            const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + s.z * 0.01));
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${starC.r},${starC.g},${starC.b},${twinkle})`;
            ctx.fill();
          }
        }
      }

      // 3. WARP STREAKS (extra light-speed lines)
      if (showWarp && warpActive) {
        if (streaks.length < 8 && Math.random() < 0.15) {
          const angle = Math.random() * Math.PI * 2;
          const sx = cx + Math.cos(angle) * 50;
          const sy = cy + Math.sin(angle) * 50;
          streaks.push({
            x: sx, y: sy,
            vx: Math.cos(angle) * 24,
            vy: Math.sin(angle) * 24,
            life: 0, maxLife: 40, len: 40 + Math.random() * 40,
          });
        }
        for (let i = streaks.length - 1; i >= 0; i--) {
          const st = streaks[i];
          st.x += st.vx; st.y += st.vy;
          st.life++;
          if (st.life >= st.maxLife) { streaks.splice(i, 1); continue; }
          const alpha = 1 - st.life / st.maxLife;
          ctx.beginPath();
          ctx.moveTo(st.x, st.y);
          ctx.lineTo(st.x - st.vx * 0.8, st.y - st.vy * 0.8);
          ctx.strokeStyle = `rgba(${warpC.r},${warpC.g},${warpC.b},${alpha})`;
          ctx.lineWidth = 2;
          ctx.shadowColor = `rgb(${warpC.r},${warpC.g},${warpC.b})`;
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // 4. GRAVITY LENS — pulsing ring distortion around cursor
      if (showLens) {
        const pulse = 1 + Math.sin(t * 1.5) * 0.15;
        const lx = mouse.current.x * w * 0.3 + cx;
        const ly = mouse.current.y * h * 0.3 + cy;
        const lr = 120 * pulse;
        // Outer ring
        ctx.beginPath();
        ctx.arc(lx, ly, lr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${lensC.r},${lensC.g},${lensC.b},0.35)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        // Inner ring
        ctx.beginPath();
        ctx.arc(lx, ly, lr * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${lensC.r},${lensC.g},${lensC.b},0.25)`;
        ctx.stroke();
        // Radial glow
        const lgrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
        lgrad.addColorStop(0, `rgba(${lensC.r},${lensC.g},${lensC.b},0.25)`);
        lgrad.addColorStop(1, "transparent");
        ctx.fillStyle = lgrad;
        ctx.beginPath();
        ctx.arc(lx, ly, lr, 0, Math.PI * 2);
        ctx.fill();
        // Lens "distortion" — draw faint warped grid lines through lens
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(t * 0.2);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * lr, Math.sin(a) * lr);
          ctx.strokeStyle = `rgba(${lensC.r},${lensC.g},${lensC.b},0.22)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [mode, cfg, showStars, showWarp, showLens, showNebula]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />
      {/* Drive HUD */}
      <div className="fixed bottom-6 left-6 z-[75]">
        <button onClick={() => { warp.click(); setHud((v) => !v); }}
          className="hud-panel flex items-center gap-2.5 rounded-full border border-[rgba(78,240,255,0.35)] px-3.5 py-2 font-mono text-xs text-[#e8faff] transition-colors hover:border-[#4ef0ff]">
          <Zap size={13} className="text-[#4ef0ff] animate-blink-w" />
          <span className="hidden tracking-widest sm:inline">DRIVE_HUD</span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5cff9d]" />
        </button>
        {hud && (
          <div className="hud-deep hud-brackets absolute bottom-12 left-0 w-80 rounded-2xl p-5 shadow-2xl">
            <span className="hb" />
            <div className="mb-3 flex items-center justify-between border-b border-[rgba(78,240,255,0.2)] pb-3">
              <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] text-[#4ef0ff]"><Waves size={13} /> DRIVE CONTROLS</span>
              <span className="font-mono text-[9px] text-[#b77bff]">LCARS v9.6</span>
            </div>
            <div className="mb-4 space-y-2">
              {[
                { label: "Starfield", on: showStars, set: setShowStars, Icon: Stars },
                { label: "Warp Streaks", on: showWarp, set: setShowWarp, Icon: Zap },
                { label: "Gravity Lens", on: showLens, set: setShowLens, Icon: Orbit },
                { label: "Nebula Clouds", on: showNebula, set: setShowNebula, Icon: Radar },
              ].map(({ label, on, set, Icon }) => (
                <button key={label} onClick={() => { warp.click(); set(!on); }}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-1.5 font-mono text-[11px] transition-all ${on ? "border-[rgba(78,240,255,0.45)] bg-[rgba(78,240,255,0.12)] text-[#4ef0ff]" : "border-white/5 bg-white/[0.02] text-[#6f8aa8] hover:text-white"}`}>
                  <span className="flex items-center gap-2"><Icon size={12} />{label}</span>
                  <span className={`h-2 w-2 rounded-full ${on ? "bg-[#5cff9d]" : "bg-[#6f8aa8]"}`} />
                </button>
              ))}
            </div>
            <div className="border-t border-[rgba(78,240,255,0.2)] pt-2">
              <div className="mb-2 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-[#6f8aa8]"><Gauge size={11} /> DRIVE MODE</div>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(DRIVE_MODES) as DriveMode[]).map((m) => (
                  <button key={m} onClick={() => { warp.warp(); onModeChange(m); }}
                    className={`rounded-xl border px-2.5 py-2 text-left font-mono text-[10px] transition-all ${mode === m ? "border-[#4ef0ff] bg-[rgba(78,240,255,0.18)] text-white" : "border-white/5 bg-white/[0.02] text-[#6f8aa8] hover:text-white"}`}>
                    <span className="flex items-center gap-1.5 font-bold" style={{ color: DRIVE_MODES[m].warp }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: DRIVE_MODES[m].warp }} />
                      {DRIVE_MODES[m].name.split(" ")[0]}
                    </span>
                    <span className="mt-0.5 block text-[8px] opacity-70">{DRIVE_MODES[m].desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
