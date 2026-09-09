import { useEffect, useRef, useState, useCallback } from "react";
import { scout } from "../nomadAudio";
import { Eye, EyeOff, Map, Mountain, Satellite, Radar, Compass, Layers } from "lucide-react";

export type TerrainMode = "night" | "thermal" | "satellite" | "recon";
export const TERRAIN_MODES: Record<TerrainMode, { name: string; desc: string; grid: string; contour: string; sweep: string }> = {
  night: { name: "Night Ops", desc: "Low-light trail grid", grid: "#8fd460", contour: "#8fd460", sweep: "#ffb347" },
  thermal: { name: "Thermal Scan", desc: "Heat signature terrain", grid: "#ff6b4a", contour: "#ffb347", sweep: "#ffd58a" },
  satellite: { name: "Satellite Feed", desc: "Orbital overlay imaging", grid: "#5fd4d0", contour: "#5fd4d0", sweep: "#8fd460" },
  recon: { name: "Recon Sweep", desc: "Full spectrum survey", grid: "#ffd58a", contour: "#8fd460", sweep: "#5fd4d0" },
};

function rgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function NomadCanvas({ mode, onModeChange }: {
  mode: TerrainMode;
  onModeChange: (m: TerrainMode) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showContours, setShowContours] = useState(true);
  const [showSatellite, setShowSatellite] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [hud, setHud] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const cfg = TERRAIN_MODES[mode];

  const toggleHud = useCallback(() => { scout.click(); setHud((v) => !v); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    let w = 0, h = 0, raf = 0, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const gridC = rgb(cfg.grid);
    const contC = rgb(cfg.contour);
    const swpC = rgb(cfg.sweep);

    // terrain contour blobs (parallax layers)
    type Blob = { cx: number; cy: number; layers: number; base: number; wobble: number; depth: number };
    let blobs: Blob[] = [];
    // waypoint markers on the map
    let markers: { x: number; y: number; ph: number }[] = [];
    // satellite pass
    let satT = -0.2;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      blobs = Array.from({ length: 6 }, (_, i) => ({
        cx: Math.random() * w, cy: Math.random() * h,
        layers: 3 + Math.floor(Math.random() * 3),
        base: 60 + Math.random() * 130,
        wobble: 0.5 + Math.random() * 1.4,
        depth: 0.25 + (i / 6) * 0.75,
      }));
      markers = Array.from({ length: 7 }, () => ({
        x: Math.random() * w, y: Math.random() * h, ph: Math.random() * Math.PI * 2,
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
      ctx.fillStyle = "rgba(7,10,6,0.3)";
      ctx.fillRect(0, 0, w, h);

      const scroll = window.scrollY;
      const mx = mouse.current.x, my = mouse.current.y;

      // 1. ANIMATED MAP GRID (drifting survey grid)
      if (showGrid) {
        const step = 46;
        const offX = ((t * 6 + mx * 18) % step);
        const offY = ((scroll * 0.12 + my * 14) % step);
        ctx.strokeStyle = `rgba(${gridC.r},${gridC.g},${gridC.b},0.07)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = -step + offX; x <= w + step; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = -step + offY; y <= h + step; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
        // major gridlines
        ctx.strokeStyle = `rgba(${gridC.r},${gridC.g},${gridC.b},0.14)`;
        ctx.beginPath();
        for (let x = -step * 4 + offX * 1; x <= w + step * 4; x += step * 4) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = -step * 4 + offY; y <= h + step * 4; y += step * 4) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
        // crosshair ticks at major intersections
        ctx.fillStyle = `rgba(${gridC.r},${gridC.g},${gridC.b},0.22)`;
        for (let x = -step * 4 + offX; x <= w + step * 4; x += step * 4) {
          for (let y = -step * 4 + offY; y <= h + step * 4; y += step * 4) {
            ctx.fillRect(x - 3, y - 0.5, 6, 1);
            ctx.fillRect(x - 0.5, y - 3, 1, 6);
          }
        }
      }

      // 2. TERRAIN CONTOUR PARALLAX LAYERS
      if (showContours) {
        for (const b of blobs) {
          const px = b.cx - mx * 30 * b.depth;
          const py = b.cy - my * 22 * b.depth - scroll * 0.05 * b.depth;
          for (let l = 0; l < b.layers; l++) {
            const r = b.base * (1 - l * 0.22);
            ctx.beginPath();
            for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.16) {
              const wob = Math.sin(a * 3 + t * b.wobble + l) * (r * 0.12) + Math.cos(a * 5 - t * 0.6) * (r * 0.06);
              const x = px + Math.cos(a) * (r + wob);
              const y = py + Math.sin(a) * (r + wob) * 0.72;
              if (a === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(${contC.r},${contC.g},${contC.b},${0.05 + b.depth * 0.06})`;
            ctx.lineWidth = l === 0 ? 1.3 : 0.8;
            ctx.stroke();
          }
          // elevation label
          ctx.fillStyle = `rgba(${contC.r},${contC.g},${contC.b},${0.14 + b.depth * 0.1})`;
          ctx.font = "9px 'IBM Plex Mono', monospace";
          ctx.fillText(`${Math.round(b.base * 8)}m`, px + b.base * 0.6, py - b.base * 0.4);
        }
      }

      // 3. WAYPOINT MARKERS with ping
      for (const m of markers) {
        const pulse = (t * 0.6 + m.ph) % 2;
        const px = m.x - mx * 12;
        const py = m.y - my * 9;
        if (pulse < 1.4) {
          ctx.beginPath();
          ctx.arc(px, py, 4 + pulse * 16, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${swpC.r},${swpC.g},${swpC.b},${Math.max(0, 0.35 - pulse * 0.25)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${swpC.r},${swpC.g},${swpC.b},0.8)`;
        ctx.fill();
      }

      // 4. SATELLITE OVERLAY — orbital pass with footprint
      if (showSatellite) {
        satT += 0.0011;
        if (satT > 1.2) satT = -0.2;
        const sx = satT * w;
        const sy = h * 0.82 - satT * h * 0.65;
        // orbit trace
        ctx.beginPath();
        ctx.moveTo(-40, h * 0.82 + 40 * 0.65);
        ctx.lineTo(w + 40, h * 0.82 - (1.05 + 0.2) * h * 0.65);
        ctx.strokeStyle = `rgba(${swpC.r},${swpC.g},${swpC.b},0.1)`;
        ctx.setLineDash([4, 10]);
        ctx.lineDashOffset = -t * 22;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        // satellite body
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(-0.55);
        ctx.fillStyle = `rgba(${swpC.r},${swpC.g},${swpC.b},0.9)`;
        ctx.fillRect(-4, -2, 8, 4);
        ctx.fillRect(-13, -1.4, 7, 2.8);
        ctx.fillRect(6, -1.4, 7, 2.8);
        ctx.restore();
        // scan footprint
        const fp = ctx.createRadialGradient(sx, sy + 60, 4, sx, sy + 60, 90);
        fp.addColorStop(0, `rgba(${swpC.r},${swpC.g},${swpC.b},0.09)`);
        fp.addColorStop(1, "transparent");
        ctx.fillStyle = fp;
        ctx.beginPath();
        ctx.ellipse(sx, sy + 60, 90, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        // downlink beam
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - 55, sy + 78);
        ctx.lineTo(sx + 55, sy + 78);
        ctx.closePath();
        ctx.fillStyle = `rgba(${swpC.r},${swpC.g},${swpC.b},0.045)`;
        ctx.fill();
      }

      // 5. RADAR SWEEP (corner instrument)
      if (showRadar && w > 760) {
        const rx = w - 110, ry = h - 110, rr = 72;
        ctx.save();
        ctx.beginPath();
        ctx.arc(rx, ry, rr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(7,10,6,0.55)";
        ctx.fill();
        ctx.strokeStyle = `rgba(${gridC.r},${gridC.g},${gridC.b},0.35)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(rx, ry, (rr / 3) * i, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${gridC.r},${gridC.g},${gridC.b},0.14)`;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(rx - rr, ry); ctx.lineTo(rx + rr, ry);
        ctx.moveTo(rx, ry - rr); ctx.lineTo(rx, ry + rr);
        ctx.stroke();
        // sweep
        const ang = t * 1.4;
        const grad = ctx.createConicGradient ? ctx.createConicGradient(ang, rx, ry) : null;
        if (grad) {
          grad.addColorStop(0, `rgba(${gridC.r},${gridC.g},${gridC.b},0.4)`);
          grad.addColorStop(0.12, "transparent");
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.arc(rx, ry, rr, ang, ang + 0.9);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx + Math.cos(ang) * rr, ry + Math.sin(ang) * rr);
        ctx.strokeStyle = `rgba(${gridC.r},${gridC.g},${gridC.b},0.7)`;
        ctx.stroke();
        // blips
        for (let i = 0; i < 3; i++) {
          const ba = (i * 2.1 + 0.8);
          const bd = rr * (0.3 + (i * 0.22));
          const bx = rx + Math.cos(ba) * bd;
          const by = ry + Math.sin(ba) * bd;
          const vis = Math.max(0, Math.cos(ang - ba));
          ctx.beginPath();
          ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${swpC.r},${swpC.g},${swpC.b},${vis})`;
          ctx.fill();
        }
        ctx.font = "8px 'IBM Plex Mono', monospace";
        ctx.fillStyle = `rgba(${gridC.r},${gridC.g},${gridC.b},0.5)`;
        ctx.fillText("RECON SWEEP", rx - 28, ry + rr + 14);
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
  }, [mode, cfg, showGrid, showContours, showSatellite, showRadar]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />
      {/* Terrain HUD */}
      <div className="fixed bottom-6 left-6 z-[75]">
        <button onClick={toggleHud}
          className="field-panel flex items-center gap-2.5 rounded-full border border-[rgba(255,179,71,0.35)] px-3.5 py-2 font-mono text-xs text-[#f2f0e4] transition-colors hover:border-[#ffb347]">
          <Compass size={13} className="animate-compass text-[#ffb347]" />
          <span className="hidden tracking-widest sm:inline">TERRAIN_HUD</span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8fd460]" />
        </button>
        {hud && (
          <div className="field-deep survey-ticks absolute bottom-12 left-0 w-80 rounded-2xl p-5 shadow-2xl">
            <span className="tick-b" />
            <div className="mb-3 flex items-center justify-between border-b border-[rgba(143,212,96,0.18)] pb-3">
              <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] text-[#ffb347]"><Map size={13} /> SURVEY CONTROLS</span>
              <span className="font-mono text-[9px] text-[#8fd460]">v2.6 FIELD</span>
            </div>
            <div className="mb-4 space-y-2">
              {[
                { label: "Survey Map Grid", on: showGrid, set: setShowGrid, Icon: Map },
                { label: "Terrain Contours", on: showContours, set: setShowContours, Icon: Mountain },
                { label: "Satellite Overlay", on: showSatellite, set: setShowSatellite, Icon: Satellite },
                { label: "Radar Instrument", on: showRadar, set: setShowRadar, Icon: Radar },
              ].map(({ label, on, set, Icon }) => (
                <button key={label} onClick={() => { scout.click(); set(!on); }}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-1.5 font-mono text-[11px] transition-all ${on ? "border-[rgba(255,179,71,0.45)] bg-[rgba(255,179,71,0.12)] text-[#ffd58a]" : "border-white/5 bg-white/[0.02] text-[#97a087] hover:text-white"}`}>
                  <span className="flex items-center gap-2"><Icon size={12} />{label}</span>
                  {on ? <Eye size={12} className="text-[#8fd460]" /> : <EyeOff size={12} />}
                </button>
              ))}
            </div>
            <div className="border-t border-[rgba(143,212,96,0.18)] pt-2">
              <div className="mb-2 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-[#97a087]"><Layers size={11} /> IMAGING MODE</div>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(TERRAIN_MODES) as TerrainMode[]).map((m) => (
                  <button key={m} onClick={() => { scout.radio(); onModeChange(m); }}
                    className={`rounded-xl border px-2.5 py-2 text-left font-mono text-[10px] transition-all ${mode === m ? "border-[#ffb347] bg-[rgba(255,179,71,0.18)] text-white" : "border-white/5 bg-white/[0.02] text-[#97a087] hover:text-white"}`}>
                    <span className="flex items-center gap-1.5 font-bold" style={{ color: TERRAIN_MODES[m].grid }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: TERRAIN_MODES[m].grid }} />
                      {TERRAIN_MODES[m].name.split(" ")[0]}
                    </span>
                    <span className="mt-0.5 block text-[8px] opacity-70">{TERRAIN_MODES[m].desc}</span>
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
