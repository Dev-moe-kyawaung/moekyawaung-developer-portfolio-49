import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ChevronUp, Search } from "lucide-react";

export function ApertureLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1900);
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.08, filter: "blur(18px)" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      className="fixed inset-0 z-[130] flex items-center justify-center bg-[#01030a]"
    >
      <div className="relative h-[min(74vw,420px)] w-[min(74vw,420px)]">
        <div className="aperture-blades absolute inset-0 rounded-full animate-spin-slow opacity-70" />
        <div className="absolute inset-[11%] rounded-full border border-cyan-300/30 animate-spin-reverse" />
        <div className="absolute inset-[22%] rounded-full border border-dashed border-violet-400/40 animate-spin-slow" />
        <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,#dffeff_0%,#68f7ff_12%,#2760bb44_42%,transparent_70%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="font-orbit text-3xl font-black tracking-[0.2em] text-white">
            OMNI<span className="spectral-text">·X</span>
          </div>
          <div className="mt-3 font-data text-[10px] tracking-[0.32em] text-cyan-200/70">
            OPENING SPATIAL APERTURE
          </div>
          <div className="mt-4 font-data text-4xl tabular-nums text-cyan-200">{progress}%</div>
          <div className="mt-3 h-px w-28 overflow-hidden bg-white/10">
            <div className="h-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function SpatialCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 300, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("spatial-cursor");
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      const target = event.target as HTMLElement | null;
      setActive(Boolean(target?.closest("a,button,input,textarea,[data-spatial]")));
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      document.body.classList.remove("spatial-cursor");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-[150] h-1.5 w-1.5 rounded-full bg-cyan-200 pointer-events-none"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: active ? 0.65 : 1 }}
      />
      <motion.div
        className="fixed left-0 top-0 z-[149] rounded-full border pointer-events-none"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: active ? 54 : 34,
          height: active ? 54 : 34,
          opacity: visible ? 1 : 0,
          borderColor: active ? "rgba(141,107,255,.9)" : "rgba(104,247,255,.65)",
          backgroundColor: active ? "rgba(141,107,255,.08)" : "rgba(104,247,255,0)",
        }}
      />
    </>
  );
}

type Point3 = { x: number; y: number; z: number; bright: boolean };

export function SpatialField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;
    const mouse = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let raf = 0;
    let time = 0;
    let dpr = 1;

    const points: Point3[] = Array.from({ length: 260 }, (_, index) => {
      const k = index + 0.5;
      const phi = Math.acos(1 - (2 * k) / 260);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;
      return {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
        bright: index % 29 === 0,
      };
    });
    const stars = Array.from({ length: 170 }, () => ({
      x: Math.random(), y: Math.random(), r: 0.25 + Math.random() * 1.4, p: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMouse = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const rotate = (point: Point3, ax: number, ay: number) => {
      const x1 = point.x * Math.cos(ay) - point.z * Math.sin(ay);
      const z1 = point.x * Math.sin(ay) + point.z * Math.cos(ay);
      const y1 = point.y * Math.cos(ax) - z1 * Math.sin(ax);
      const z2 = point.y * Math.sin(ax) + z1 * Math.cos(ax);
      return { x: x1, y: y1, z: z2, bright: point.bright };
    };

    const draw = () => {
      time += 0.008;
      ctx.fillStyle = "rgba(1,3,10,.25)";
      ctx.fillRect(0, 0, width, height);

      for (const star of stars) {
        const alpha = 0.2 + 0.65 * Math.abs(Math.sin(time * 2 + star.p));
        ctx.beginPath();
        ctx.arc(star.x * width - mouse.x * star.r * 9, star.y * height - mouse.y * star.r * 7, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190,239,255,${alpha})`;
        ctx.fill();
      }

      const scroll = window.scrollY;
      const heroMix = Math.max(0, 1 - scroll / Math.max(700, height));
      const cx = width > 950 ? width * 0.72 : width * 0.5;
      const cy = height * (0.47 - Math.min(scroll, 800) / 13000);
      const radius = Math.min(width, height) * (width > 950 ? 0.28 : 0.32);
      const ax = -0.28 + mouse.y * 0.18;
      const ay = time * 0.8 + mouse.x * 0.24;

      const halo = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius * 1.9);
      halo.addColorStop(0, `rgba(104,247,255,${0.13 + heroMix * 0.07})`);
      halo.addColorStop(0.45, "rgba(141,107,255,.06)");
      halo.addColorStop(1, "transparent");
      ctx.fillStyle = halo;
      ctx.fillRect(cx - radius * 2, cy - radius * 2, radius * 4, radius * 4);

      const projected = points.map((point) => {
        const p = rotate(point, ax, ay);
        const perspective = 660 / (660 + p.z * radius);
        return {
          x: cx + p.x * radius * perspective,
          y: cy + p.y * radius * perspective,
          z: p.z,
          bright: p.bright,
          perspective,
        };
      }).sort((a, b) => a.z - b.z);

      for (let i = 0; i < projected.length; i += 1) {
        const p = projected[i];
        const alpha = 0.18 + ((p.z + 1) / 2) * 0.82;
        const size = (p.bright ? 2.8 : 1.35) * p.perspective;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? `rgba(141,107,255,${alpha})` : `rgba(104,247,255,${alpha})`;
        if (p.bright) {
          ctx.shadowColor = "#68f7ff";
          ctx.shadowBlur = 14;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(0.35 + mouse.y * 0.1);
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * (1.15 + i * 0.16), radius * (0.34 + i * 0.04), 0, 0, Math.PI * 2);
        ctx.strokeStyle = i === 1 ? "rgba(141,107,255,.25)" : "rgba(104,247,255,.24)";
        ctx.lineWidth = 1;
        ctx.setLineDash([6 + i * 2, 9]);
        ctx.lineDashOffset = -time * (20 + i * 8);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      for (let index = 0; index < 4; index += 1) {
        const angle = time * (0.75 + index * 0.1) + (index / 4) * Math.PI * 2;
        const orbitR = radius * (1.2 + (index % 2) * 0.2);
        const x = cx + Math.cos(angle) * orbitR;
        const y = cy + Math.sin(angle) * orbitR * 0.37;
        ctx.beginPath();
        ctx.arc(x, y, index === 0 ? 3.8 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = index % 2 ? "#8d6bff" : "#fff";
        ctx.shadowColor = index % 2 ? "#8d6bff" : "#68f7ff";
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />;
}

export function Typing({ phrases, className = "" }: { phrases: string[]; className?: string }) {
  const [text, setText] = useState("");
  const [phrase, setPhrase] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = phrases[phrase % phrases.length];
    let delay = deleting ? 28 : 66;
    if (!deleting && text === full) delay = 1700;
    if (deleting && text === "") delay = 260;
    const id = window.setTimeout(() => {
      if (!deleting && text === full) return setDeleting(true);
      if (deleting && text === "") {
        setDeleting(false);
        setPhrase((value) => (value + 1) % phrases.length);
        return;
      }
      setText(full.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => window.clearTimeout(id);
  }, [text, deleting, phrase, phrases]);
  return <span className={`caret-spatial ${className}`}>{text || "\u00a0"}</span>;
}

export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{value}{suffix}</span>;
}

export function SectionHead({ code, title, accent, sub }: { code: string; title: string; accent: string; sub?: string }) {
  return (
    <div className="mb-14 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-data text-[10px] tracking-[0.38em] text-cyan-300/80"
      >
        {code}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.65 }}
        className="mt-3 font-orbit text-[clamp(2rem,5vw,3.6rem)] font-bold leading-[1.04] text-white"
      >
        {title} <span className="spectral-text">{accent}</span>
      </motion.h2>
      {sub && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-4 max-w-2xl text-base leading-relaxed text-[#7891ad] md:text-lg">{sub}</motion.p>}
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-cyan-300/10 bg-[#020610aa] py-3.5">
      <div className="flex w-max" style={{ animation: "marquee-spatial 36s linear infinite" }}>
        {row.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8 pr-8 font-data text-[10px] tracking-[0.3em] text-[#7891ad]">
            {item}<span className="text-cyan-300">◇</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function CommandPalette({ entries }: { entries: { id: string; label: string; hint: string }[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const shown = entries.filter((entry) => `${entry.label} ${entry.hint}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[140] flex items-start justify-center bg-[#01030acc] px-4 pt-[12vh] backdrop-blur-xl" onClick={() => setOpen(false)}>
          <motion.div initial={{ y: 18, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 10, scale: 0.98 }} className="spatial-glass hud-corners w-full max-w-xl overflow-hidden rounded-2xl" onClick={(event) => event.stopPropagation()}>
            <span className="hud-bottom" />
            <div className="flex items-center gap-3 border-b border-cyan-300/10 px-4 py-3">
              <Search size={16} className="text-cyan-300" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Navigate the spatial OS…" className="flex-1 bg-transparent font-data text-sm text-white outline-none placeholder:text-[#7891ad]" />
              <kbd className="rounded border border-white/10 px-2 py-1 font-data text-[9px] text-[#7891ad]">ESC</kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {shown.map((entry) => (
                <a key={entry.id} href={`#${entry.id}`} onClick={() => setOpen(false)} className="flex items-center justify-between px-4 py-2.5 hover:bg-cyan-300/5">
                  <span className="text-sm text-[#edfaff]">{entry.label}</span>
                  <span className="font-data text-[10px] text-[#7891ad]">{entry.hint}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.button
      aria-label="Back to top"
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14, pointerEvents: show ? "auto" : "none" }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="spatial-glass fixed bottom-6 left-6 z-[70] flex h-11 w-11 items-center justify-center rounded-full text-cyan-200"
    >
      <ChevronUp size={18} />
    </motion.button>
  );
}

export function DepthLayer({ children, amount = 40, className = "" }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: amount, scale: 0.95, filter: "blur(10px)" }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}