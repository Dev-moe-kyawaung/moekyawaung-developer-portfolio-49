import { useEffect, useRef, useState, useCallback } from "react";
import { omni } from "../omnisphereAudio";
import { Eye, EyeOff, Globe, Sparkles, Sun, Layers3, Orbit } from "lucide-react";

export type SphereMode = "atlas" | "wire" | "orbital" | "nebula";
const MODES: Record<SphereMode, { name: string; c1: string; c2: string; speed: number }> = {
  atlas: { name: "Data Atlas", c1: "#00e5ff", c2: "#7c4dff", speed: 1 },
  wire: { name: "Wire Core", c1: "#18ffff", c2: "#00e5ff", speed: 1.6 },
  orbital: { name: "Orbital Ring", c1: "#7c4dff", c2: "#ff4081", speed: 0.7 },
  nebula: { name: "Nebula Drift", c1: "#ffd740", c2: "#00e5ff", speed: 1.2 },
};

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export default function OmniSphereCanvas({
  mode, onModeChange,
}: {
  mode: SphereMode;
  onModeChange: (m: SphereMode) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showSphere, setShowSphere] = useState(true);
  const [showRings, setShowRings] = useState(true);
  const [showBeams, setShowBeams] = useState(true);
  const [showStars, setShowStars] = useState(true);
  const [hud, setHud] = useState(false);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const cfg = MODES[mode];

  const toggleHud = useCallback(() => { omni.click(); setHud((v) => !v); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rgb1 = hexToRgb(cfg.c1);
    const rgb2 = hexToRgb(cfg.c2);

    type P3 = { x: number; y: number; z: number; special?: boolean };
    const N = 220;
    const pts: P3[] = [];
    for (let i = 0; i < N; i++) {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;
      pts.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
        special: i % 23 === 0,
      });
    }

    const latLines = [-60, -30, 0, 30, 60].map((latDeg) => {
      const lat = (latDeg * Math.PI) / 180;
      const arr: P3[] = [];
      for (let a = 0; a <= 360; a += 6) {
        const th = (a * Math.PI) / 180;
        arr.push({ x: Math.cos(lat) * Math.cos(th), y: Math.sin(lat), z: Math.cos(lat) * Math.sin(th) });
      }
      return arr;
    });
    const lonLines = [0, 30, 60, 90, 120, 150].map((lonDeg) => {
      const lon = (lonDeg * Math.PI) / 180;
      const arr: P3[] = [];
      for (let a = -90; a <= 90; a += 6) {
        const la = (a * Math.PI) / 180;
        arr.push({ x: Math.cos(la) * Math.cos(lon), y: Math.sin(la), z: Math.cos(la) * Math.sin(lon) });
      }
      return arr;
    });

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + 0.2, tw: Math.random() * Math.PI * 2,
    }));

    let rotY = 0;
    const baseTilt = -0.35;
    let tiltX = baseTilt, tiltY = 0;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX; mouse.current.y = e.clientY; mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    const project = (x: number, y: number, z: number, R: number, cx: number, cy: number) => {
      const persp = 600 / (600 + z * R);
      return { sx: cx + x * R * persp, sy: cy + y * R * persp, depth: z, scale: persp };
    };

    const rotate = (p: P3, ax: number, ay: number): P3 => {
      const x1 = p.x * Math.cos(ay) - p.z * Math.sin(ay);
      const z1 = p.x * Math.sin(ay) + p.z * Math.cos(ay);
      const y2 = p.y * Math.cos(ax) - z1 * Math.sin(ax);
      const z2 = p.y * Math.sin(ax) + z1 * Math.cos(ax);
      return { x: x1, y: y2, z: z2, special: p.special };
    };

    const step = () => {
      t += 0.016 * cfg.speed;
      ctx.fillStyle = "rgba(2,5,13,0.32)";
      ctx.fillRect(0, 0, w, h);

      rotY += 0.0022 * cfg.speed;
      const targetX = mouse.current.active ? (mouse.current.y / h - 0.5) * 0.7 : baseTilt;
      const targetY = mouse.current.active ? (mouse.current.x / w - 0.5) * 0.5 : 0;
      tiltX += (targetX - tiltX) * 0.04;
      tiltY += (targetY - tiltY) * 0.04;
      const ax = tiltX;
      const ay = rotY + tiltY;

      if (showStars) {
        for (const s of stars) {
          const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.5 + s.tw));
          ctx.beginPath();
          ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,240,255,${(tw * 0.7).toFixed(3)})`;
          ctx.fill();
        }
      }

      if (showBeams) {
        for (let b = 0; b < 4; b++) {
          const phase = (t * 0.08 + b / 4) % 1.4 - 0.4;
          const bx = phase * w;
          const grad = ctx.createLinearGradient(bx - 60, 0, bx + 60, h);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.5, `rgba(${rgb1.r},${rgb1.g},${rgb1.b},0.05)`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(bx - 40, 0); ctx.lineTo(bx + 40, 0);
          ctx.lineTo(bx + 120, h); ctx.lineTo(bx - 120, h);
          ctx.closePath(); ctx.fill();
        }
      }

      const cx = w > 900 ? w * 0.72 : w / 2;
      const cy = h * 0.46;
      const R = Math.min(w, h) * (w > 900 ? 0.26 : 0.3);

      const glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.9);
      glow.addColorStop(0, `rgba(${rgb2.r},${rgb2.g},${rgb2.b},0.16)`);
      glow.addColorStop(0.6, `rgba(${rgb1.r},${rgb1.g},${rgb1.b},0.05)`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);

      if (showSphere) {
        const drawLine = (line: P3[], rr: number, gg: number, bb: number, baseAlpha: number) => {
          ctx.beginPath();
          for (let i = 0; i < line.length; i++) {
            const r = rotate(line[i], ax, ay);
            const p = project(r.x, r.y, r.z, R, cx, cy);
            if (i === 0) ctx.moveTo(p.sx, p.sy);
            else ctx.lineTo(p.sx, p.sy);
            const a = baseAlpha * (0.25 + ((p.depth + 1) / 2) * 0.75);
            ctx.strokeStyle = `rgba(${rr},${gg},${bb},${a.toFixed(3)})`;
          }
          ctx.lineWidth = 0.8;
          ctx.stroke();
        };
        if (showRings) {
          for (const l of latLines) drawLine(l, rgb1.r, rgb1.g, rgb1.b, 0.5);
          for (const l of lonLines) drawLine(l, rgb2.r, rgb2.g, rgb2.b, 0.4);
        }

        const projected = pts.map((p) => {
          const r = rotate(p, ax, ay);
          const pr = project(r.x, r.y, r.z, R, cx, cy);
          return { ...pr, special: p.special };
        }).sort((a, b) => a.depth - b.depth);

        for (const p of projected) {
          const lit = 0.3 + ((p.depth + 1) / 2) * 0.7;
          const size = (p.special ? 2.4 : 1.3) * (0.7 + p.scale * 0.6);
          const mix = (p.depth + 1) / 2;
          const r = Math.round(rgb1.r * (1 - mix) + rgb2.r * mix);
          const g = Math.round(rgb1.g * (1 - mix) + rgb2.g * mix);
          const b = Math.round(rgb1.b * (1 - mix) + rgb2.b * mix);
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${lit.toFixed(3)})`;
          if (p.special) { ctx.shadowColor = `rgb(${r},${g},${b})`; ctx.shadowBlur = 10; }
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        for (let i = 0; i < 3; i++) {
          const oa = t * (0.5 + i * 0.25) + (i * Math.PI * 2) / 3;
          const ox = Math.cos(oa) * (R * 1.55);
          const oz = Math.sin(oa) * (R * 1.55);
          const oy = Math.sin(oa * 1.7 + i) * R * 0.28;
          const pr = project(ox / R, oy / R, oz / R, R, cx, cy);
          ctx.beginPath();
          ctx.arc(pr.sx, pr.sy, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = i === 1 ? `rgba(${rgb2.r},${rgb2.g},${rgb2.b},0.95)` : "rgba(255,255,255,0.9)";
          ctx.shadowColor = `rgba(${rgb1.r},${rgb1.g},${rgb1.b},1)`;
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        if (showRings) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(0.35 + tiltX * 0.3);
          ctx.strokeStyle = `rgba(${rgb1.r},${rgb1.g},${rgb1.b},0.35)`;
          ctx.lineWidth = 1;
          ctx.setLineDash([6, 8]);
          ctx.beginPath();
          ctx.ellipse(0, 0, R * 1.32, R * 0.42, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.35);
        core.addColorStop(0, "rgba(255,255,255,0.5)");
        core.addColorStop(0.4, `rgba(${rgb1.r},${rgb1.g},${rgb1.b},0.2)`);
        core.addColorStop(1, "transparent");
        ctx.fillStyle = core;
        ctx.beginPath(); ctx.arc(cx, cy, R * 0.35, 0, Math.PI * 2); ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };
    step();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [mode, cfg, showSphere, showRings, showBeams, showStars]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />
      <div className="fixed bottom-6 left-6 z-[75]">
        <button onClick={toggleHud}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full holo-panel text-xs font-mono text-[#e0f7ff] border border-[rgba(0,229,255,0.35)] hover:border-[#00e5ff] transition-colors">
          <Orbit size={13} className="text-[#00e5ff] animate-spin3d" />
          <span className="tracking-widest hidden sm:inline">OMNI_HUD</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#69f0ae] animate-pulse" />
        </button>
        {hud && (
          <div className="absolute bottom-12 left-0 w-80 holo-panel holo-brackets rounded-3xl border border-[rgba(0,229,255,0.4)] p-5 shadow-2xl">
            <span className="b-bracket" />
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(0,229,255,0.18)] mb-3">
              <span className="font-mono text-[10px] tracking-[0.25em] text-[#00e5ff] flex items-center gap-1.5"><Globe size={13} /> SPHERE CONTROLS</span>
              <span className="font-mono text-[9px] text-[#7c4dff]">v6.0 OMNI</span>
            </div>
            <div className="space-y-2 mb-4">
              {[
                { label: "3D Sphere Mesh", on: showSphere, set: setShowSphere, Icon: Globe },
                { label: "Orbital Rings", on: showRings, set: setShowRings, Icon: Orbit },
                { label: "Volumetric Beams", on: showBeams, set: setShowBeams, Icon: Sun },
                { label: "Starfield Dust", on: showStars, set: setShowStars, Icon: Sparkles },
              ].map(({ label, on, set, Icon }) => (
                <button key={label} onClick={() => { omni.click(); set(!on); }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-mono text-[11px] border transition-all ${
                    on ? "bg-[rgba(0,229,255,0.12)] border-[rgba(0,229,255,0.45)] text-[#18ffff]" : "bg-white/[0.02] border-white/5 text-[#7fa8c9] hover:text-white"}`}>
                  <span className="flex items-center gap-2"><Icon size={12} />{label}</span>
                  {on ? <Eye size={12} className="text-[#69f0ae]" /> : <EyeOff size={12} />}
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-[rgba(0,229,255,0.18)]">
              <div className="font-mono text-[9px] tracking-widest text-[#7fa8c9] mb-2 uppercase flex items-center gap-1"><Layers3 size={11} /> SPHERE MODE</div>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(MODES) as SphereMode[]).map((m) => (
                  <button key={m} onClick={() => { omni.sweep(); onModeChange(m); }}
                    className={`px-2.5 py-2 rounded-xl font-mono text-[10px] border text-left transition-all ${
                      mode === m ? "border-[#00e5ff] bg-[rgba(0,229,255,0.18)] text-white" : "border-white/5 bg-white/[0.02] text-[#7fa8c9] hover:text-white"}`}>
                    <span className="flex items-center gap-1.5 font-bold" style={{ color: MODES[m].c1 }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: MODES[m].c1 }} />
                      {MODES[m].name.split(" ")[0]}
                    </span>
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
