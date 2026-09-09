import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, ChevronUp, Copy, Crosshair, Download,
  Flag, Footprints, Mail, Map, MapPin, Menu, Mountain, Phone, Search,
  Signal, Volume2, VolumeX, X, Compass as CompassIcon,
} from "lucide-react";
import { certTerritories, expeditions, gearSkills, nomad, tapeItems, waypoints, type Expedition } from "../nomadData";
import { scout } from "../nomadAudio";

/* ============ PRIMITIVES ============ */

export function Typing({ phrases, className = "" }: { phrases: string[]; className?: string }) {
  const [text, setText] = useState("");
  const [pi, setPi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const full = phrases[pi % phrases.length];
    let d = del ? 26 : 62;
    if (!del && text === full) d = 1700;
    if (del && text === "") d = 240;
    const id = window.setTimeout(() => {
      if (!del && text === full) return setDel(true);
      if (del && text === "") { setDel(false); setPi((p) => (p + 1) % phrases.length); return; }
      setText(full.slice(0, text.length + (del ? -1 : 1)));
    }, d);
    return () => window.clearTimeout(id);
  }, [text, del, pi, phrases]);
  return <span className={`caret-n ${className}`}>{text || "\u00a0"}</span>;
}

export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1400);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function SectionHead({ code, title, accent, sub }: { code: string; title: string; accent: string; sub?: string }) {
  return (
    <div className="mb-14 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="flex items-center gap-2 font-mono text-[10px] tracking-[0.36em] text-[#ffb347]">
        <Crosshair size={11} /> {code}
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
        className="f-head mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.02] text-white">
        {title} <span className="survey-text">{accent}</span>
      </motion.h2>
      {sub && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-4 max-w-2xl text-base leading-relaxed text-[#97a087] md:text-lg">{sub}</motion.p>}
    </div>
  );
}

export function Tape() {
  const row = [...tapeItems, ...tapeItems];
  return (
    <div className="relative overflow-hidden border-y border-[rgba(143,212,96,0.14)] bg-[#0a0d08b3] py-3 select-none">
      <div className="flex w-max" style={{ animation: "marquee-n 36s linear infinite" }}>
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8 pr-8 font-mono text-[10px] tracking-[0.3em] text-[#97a087]">
            {item}<span className="text-[#ffb347]">⌖</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* Compass instrument — hero centerpiece */
export function CompassRose() {
  const [heading, setHeading] = useState(0);
  useEffect(() => {
    const onScroll = () => setHeading(window.scrollY * 0.12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="relative h-[320px] w-[320px] sm:h-[380px] sm:w-[380px]">
      <div className="absolute inset-[-12%] rounded-full opacity-40" style={{ background: "radial-gradient(circle, rgba(255,179,71,0.15), transparent 62%)" }} />
      <svg viewBox="0 0 380 380" className="h-full w-full">
        {/* outer bezel */}
        <circle cx="190" cy="190" r="186" fill="rgba(12,17,10,0.62)" stroke="rgba(255,179,71,0.4)" strokeWidth="2" />
        <circle cx="190" cy="190" r="170" fill="none" stroke="rgba(143,212,96,0.16)" strokeWidth="1" />
        {/* degree ticks — rotate with scroll */}
        <g style={{ transformOrigin: "190px 190px", transform: `rotate(${-heading}deg)`, transition: "transform 0.3s ease-out" }}>
          {Array.from({ length: 72 }).map((_, i) => {
            const a = (i / 72) * Math.PI * 2;
            const big = i % 6 === 0;
            return <line key={i}
              x1={190 + Math.cos(a) * (big ? 148 : 156)} y1={190 + Math.sin(a) * (big ? 148 : 156)}
              x2={190 + Math.cos(a) * 164} y2={190 + Math.sin(a) * 164}
              stroke={big ? "rgba(255,213,138,0.8)" : "rgba(143,212,96,0.3)"} strokeWidth={big ? 2 : 1} strokeLinecap="round" />;
          })}
          {["N", "E", "S", "W"].map((d, i) => {
            const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
            return <text key={d} x={190 + Math.cos(a) * 128} y={190 + Math.sin(a) * 128 + 6}
              textAnchor="middle" fontSize="17" fontWeight="800" fill={d === "N" ? "#ff6b4a" : "rgba(242,240,228,0.85)"}
              style={{ fontFamily: "Archivo, sans-serif" }}>{d}</text>;
          })}
        </g>
        {/* rotating survey ring */}
        <g className="animate-compass" style={{ transformOrigin: "190px 190px" }}>
          <circle cx="190" cy="190" r="106" fill="none" stroke="rgba(95,212,208,0.35)" strokeWidth="1.2" strokeDasharray="3 9" />
          <circle cx="296" cy="190" r="3.4" fill="#5fd4d0" style={{ filter: "drop-shadow(0 0 6px #5fd4d0)" }} />
        </g>
        <g className="animate-compass-rev" style={{ transformOrigin: "190px 190px" }}>
          <circle cx="190" cy="190" r="82" fill="none" stroke="rgba(255,179,71,0.4)" strokeWidth="1.2" strokeDasharray="10 7" />
          <circle cx="190" cy="108" r="3" fill="#ffb347" style={{ filter: "drop-shadow(0 0 6px #ffb347)" }} />
        </g>
        {/* needle */}
        <g className="animate-needle" style={{ transformOrigin: "190px 190px" }}>
          <polygon points="190,74 199,190 190,204 181,190" fill="#ff6b4a" style={{ filter: "drop-shadow(0 0 8px rgba(255,107,74,0.7))" }} />
          <polygon points="190,306 199,190 190,176 181,190" fill="rgba(242,240,228,0.75)" />
        </g>
        <circle cx="190" cy="190" r="14" fill="#0c110a" stroke="rgba(255,179,71,0.6)" strokeWidth="1.8" />
        <circle cx="190" cy="190" r="4.5" fill="#ffb347" />
      </svg>
      {/* floating instrument readouts */}
      <div className="field-panel animate-drone absolute -left-3 top-12 rounded-lg px-2.5 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#5fd4d0]">GPS LOCK · 8 SAT</div>
      <div className="field-panel animate-drone absolute -right-5 bottom-20 rounded-lg px-2.5 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#ffb347]" style={{ animationDelay: "1.4s" }}>ALT 1,280m</div>
      <div className="field-panel animate-drone absolute left-6 -bottom-2 rounded-lg px-2.5 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#8fd460]" style={{ animationDelay: "2.2s" }}>BEARING {Math.round(((heading % 360) + 360) % 360)}°</div>
    </div>
  );
}

/* ============ NAV ============ */
const NAV = [
  { id: "basecamp", label: "Basecamp" },
  { id: "gear", label: "Gear" },
  { id: "expeditions", label: "Expeditions" },
  { id: "journey", label: "Journey" },
  { id: "territories", label: "Territories" },
  { id: "signal", label: "Signal" },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(!scout.enabled);

  useEffect(() => {
    const onScroll = () => {
      let cur = "hero";
      for (const n of NAV) {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top <= 200) cur = n.id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="fixed inset-x-0 top-0 z-[80]">
        <div className="mx-auto mt-3 max-w-7xl px-3">
          <div className="field-panel flex items-center justify-between rounded-full py-2 pl-4 pr-2">
            <a href="#hero" className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,179,71,0.5)] bg-[#131a10]">
                <CompassIcon size={16} className="animate-compass text-[#ffb347]" />
              </span>
              <span className="leading-tight">
                <span className="f-head block text-[12px] font-extrabold tracking-[0.14em] text-white">CYBER<span className="survey-text">·NOMAD</span></span>
                <span className="mt-0.5 block font-mono text-[8px] tracking-[0.28em] text-[#97a087]">{nomad.callsign}</span>
              </span>
            </a>
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => scout.click()}
                  className={`navlink font-mono text-[10px] uppercase tracking-[0.18em] ${active === n.id ? "active text-[#ffd58a]" : "text-[#97a087] hover:text-white"}`}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={() => { const on = scout.toggle(); setMuted(!on); }} aria-label="Field audio"
                className={`field-panel flex h-9 w-9 items-center justify-center rounded-full ${muted ? "text-[#97a087]" : "text-[#ffb347]"}`}>
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <span className="hidden items-center gap-2 rounded-full border border-[rgba(143,212,96,0.3)] px-3 py-1.5 font-mono text-[9px] tracking-widest text-[#8fd460] md:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8fd460]" /> FOR HIRE
              </span>
              <a href="#signal" className="hidden rounded-full px-4 py-2 font-mono text-[10px] font-bold tracking-[0.15em] text-[#070a06] sm:inline-flex"
                style={{ background: "linear-gradient(120deg,#ffd58a,#ffb347)" }}>
                RADIO IN
              </a>
              <button onClick={() => setOpen(true)} className="field-panel flex h-10 w-10 items-center justify-center rounded-full text-[#ffb347] lg:hidden" aria-label="Menu">
                <Menu size={17} />
              </button>
            </div>
          </div>
          <motion.div style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg,#ff6b4a,#ffb347,#8fd460)" }} className="mt-2 h-[2px] origin-left rounded-full" />
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-[#070a06f5] px-6 backdrop-blur-2xl lg:hidden">
            <div className="flex h-20 items-center justify-between border-b border-[rgba(143,212,96,0.14)]">
              <span className="f-head text-lg font-black text-white">CYBER<span className="survey-text">·NOMAD</span></span>
              <button onClick={() => setOpen(false)} className="field-panel flex h-10 w-10 items-center justify-center rounded-full text-white" aria-label="Close"><X size={17} /></button>
            </div>
            <nav className="pt-6">
              {NAV.map((n, i) => (
                <motion.a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="f-head flex items-center justify-between border-b border-[rgba(143,212,96,0.12)] py-4 text-xl font-bold text-white">
                  {n.label}<span className="font-mono text-xs text-[#ffb347]">WP-0{i + 1}</span>
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============ HERO ============ */
export function Hero() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 700], [0, 80]);
  const yCompass = useTransform(scrollY, [0, 700], [0, -90]);
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-28">
      <div className="topo-lines absolute inset-0 opacity-70" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.06fr_0.94fr]">
        <motion.div style={{ y: yText }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="field-panel mb-6 inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4">
            <span className="rounded-full px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.18em] text-[#070a06]" style={{ background: "linear-gradient(120deg,#ffd58a,#ffb347)" }}>⌖ EXPEDITION ACTIVE</span>
            <span className="font-mono text-[9px] tracking-[0.22em] text-[#ffd58a]">SENIOR ANDROID · EDGE AI</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="f-head text-[clamp(2.7rem,7vw,5.4rem)] font-black leading-[0.94] tracking-tight text-white">
            Moe Kyaw<br /><span className="survey-text glow-amber">Aung</span>
            <span className="mt-3 block text-[clamp(1.1rem,2.6vw,1.7rem)] font-medium tracking-normal text-[#97a087]">
              charting code beyond the mapped grid.
            </span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5">
            <Typing phrases={nomad.roles} className="font-mono text-sm text-[#8fd460] md:text-lg" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-5 space-y-1 font-mono text-[11px] text-[#97a087]">
            <div className="flex items-center gap-2"><MapPin size={12} className="text-[#ff6b4a]" /> BASE A · {nomad.baseA}</div>
            <div className="flex items-center gap-2"><MapPin size={12} className="text-[#5fd4d0]" /> BASE B · {nomad.baseB}</div>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-5 max-w-xl leading-relaxed text-[#97a087]">
            {nomad.tagline} Currently trekking <span className="font-medium text-white">{nomad.building}</span>.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#expeditions" onClick={() => scout.discover()}
              className="flex items-center gap-2.5 rounded-full px-7 py-3.5 font-mono text-[11px] font-bold tracking-[0.16em] text-[#070a06] shadow-[0_12px_38px_rgba(255,179,71,0.25)] transition-transform hover:scale-105"
              style={{ background: "linear-gradient(120deg,#ffd58a,#ffb347)" }}>
              OPEN EXPEDITION LOGS <ArrowRight size={14} />
            </a>
            <a href={nomad.github} target="_blank" rel="noopener noreferrer"
              className="field-panel flex items-center gap-2.5 rounded-full px-6 py-3.5 font-mono text-[11px] tracking-[0.16em] text-white hover:border-[#ffb347]">
              <Download size={14} /> GITHUB CACHE
            </a>
          </motion.div>
          <div className="mt-10 grid max-w-xl grid-cols-4 gap-3">
            {nomad.stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.08 }}
                className="field-panel rounded-2xl px-2 py-3.5 text-center">
                <div className="f-head survey-text text-xl font-black tabular-nums md:text-2xl"><CountUp to={s.value} suffix={s.suffix} /></div>
                <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white">{s.label}</div>
                <div className="font-mono text-[7px] tracking-[0.12em] text-[#97a087]">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div style={{ y: yCompass }} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.9 }}
          className="relative flex justify-center">
          <CompassRose />
        </motion.div>
      </div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center font-mono text-[8px] tracking-[0.4em] text-[#97a087]">
        FOLLOW THE TRAIL
        <div className="mx-auto mt-2 h-9 w-px bg-gradient-to-b from-[#ffb347] to-transparent" />
      </motion.div>
    </section>
  );
}

/* ============ BASECAMP (ABOUT) ============ */
export function Basecamp() {
  const log = [
    "$ field-log --explorer mka",
    "callsign  → NOMAD-MKA · senior android developer",
    "machete   → kotlin · compose · mvvm · clean arch",
    "supplies  → firebase · room · rest · python",
    "off-grid  → tflite int8 · claude api · ethical hacking",
    `creed     → "${nomad.philosophy}"`,
  ];
  return (
    <section id="basecamp" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHead code="LOG 01 · BASECAMP" title="The explorer" accent="behind the compass"
          sub="From Tachileik's hills to Bangkok's grid — engineering systems built to survive off-grid conditions." />
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7 }}
            className="field-panel survey-ticks relative min-h-[440px] overflow-hidden rounded-3xl">
            <span className="tick-b" />
            <div className="scan-band" />
            <img src={nomad.portrait} alt={nomad.name} className="absolute inset-0 h-full w-full object-cover object-top opacity-70" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070a06] via-[#070a0688] to-transparent" />
            {/* stamped tag */}
            <div className="stamp absolute right-5 top-5 rounded px-3 py-1.5 font-mono text-[9px] tracking-[0.22em] text-[#ffb347]">
              FIELD VERIFIED · 2026
            </div>
            <div className="relative flex min-h-[440px] flex-col justify-end p-7">
              <div className="font-mono text-[9px] tracking-[0.3em] text-[#ffb347]">SPECIMEN · {nomad.callsign}</div>
              <h3 className="f-head mt-2 text-2xl font-extrabold leading-tight text-white md:text-3xl">
                From <span className="text-[#ffb347]">frame pacing</span> to <span className="text-[#8fd460]">pipelines</span> to <span className="text-[#5fd4d0]">private AI</span>.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#b9bfa9]">
                82+ certified waypoints across nine territories — but the real measure is production systems that hold their bearing under storm conditions.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Burmese 🇲🇲", "English 🌐", "Kotlin ☕"].map((l) => (
                  <span key={l} className="field-panel rounded-full px-3 py-1.5 font-mono text-[9px] tracking-widest text-[#ffd58a]">⌖ {l}</span>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-3xl border border-[rgba(143,212,96,0.2)] bg-[#0a0e08e8]">
            <div className="flex items-center gap-2 border-b border-[rgba(143,212,96,0.14)] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b4a]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffb347]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#8fd460]/80" />
              <span className="ml-2 font-mono text-[9px] tracking-widest text-[#97a087]">scout@field ~/log</span>
            </div>
            <div className="space-y-1 p-6 font-mono text-[12px] leading-7">
              {log.map((line, i) => (
                <motion.div key={line} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className={i === 0 || i === log.length - 1 ? "text-[#ffb347]" : "text-[#97a087]"}>{line}</motion.div>
              ))}
              <span className="caret-n" />
            </div>
            <div className="grid grid-cols-3 gap-2 px-6 pb-6">
              {[["MODULES", "12"], ["INFERENCE", "32ms"], ["CRASH-FREE", "99.98%"]].map(([k, v]) => (
                <div key={k} className="field-panel rounded-2xl p-3 text-center">
                  <div className="f-head text-sm font-bold text-white">{v}</div>
                  <div className="mt-1 font-mono text-[7px] tracking-[0.16em] text-[#97a087]">{k}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-[rgba(143,212,96,0.14)] p-5">
              <div className="mb-2 font-mono text-[8px] tracking-[0.28em] text-[#97a087]">CURRENT POSITION</div>
              <div className="flex items-center gap-3">
                <Footprints size={16} className="text-[#8fd460]" />
                <div className="flex-1 font-mono text-[11px] text-[#e8ecd8]">{nomad.location}</div>
                <Signal size={14} className="animate-blink-n text-[#5fd4d0]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============ GEAR (SKILLS) ============ */
export function Gear() {
  return (
    <section id="gear" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHead code="LOG 02 · GEAR RACK" title="Six pieces of" accent="essential kit"
          sub="Every expedition survives on its gear. This kit is field-tested at production altitude." />
        <div className="grid gap-4 md:grid-cols-2">
          {gearSkills.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.08 }}
              onMouseEnter={() => scout.sonar()}
              className="field-panel group relative overflow-hidden rounded-2xl p-5 transition-colors hover:border-[rgba(255,179,71,0.4)]">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-15 blur-3xl transition-opacity group-hover:opacity-35" style={{ background: g.color }} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.24em]" style={{ color: g.color }}>{g.id} · {g.note.toUpperCase()}</span>
                  <span className="f-head text-xl font-black tabular-nums" style={{ color: g.color }}>{g.pct}%</span>
                </div>
                <h4 className="f-head mt-1 text-lg font-bold text-white">{g.name}</h4>
                <p className="mb-3 mt-0.5 font-mono text-[9px] tracking-wide text-[#97a087]">{g.spec}</p>
                {/* elevation-profile bar */}
                <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${g.pct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }}
                    className="relative h-full rounded-full"
                    style={{ background: `linear-gradient(90deg,${g.color}55,${g.color})`, boxShadow: `0 0 12px ${g.color}` }}>
                    <span className="absolute -top-0.5 right-0 h-3 w-3 rounded-full bg-white shadow" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ EXPEDITION LOGS (PROJECTS) ============ */
export function Expeditions() {
  const [sel, setSel] = useState<Expedition | null>(null);
  return (
    <section id="expeditions" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead code="LOG 03 · EXPEDITION ARCHIVE" title="Eight logged" accent="expeditions"
          sub="Every project is a stamped expedition log — coordinates, terrain class, field metrics and the route walked. Open a log to read the full report." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {expeditions.map((e, i) => (
            <motion.button key={e.id}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
              onMouseEnter={() => scout.click()}
              onClick={() => { scout.discover(); setSel(e); }}
              className="exped-card field-panel survey-ticks rounded-2xl p-5 text-left">
              <span className="tick-b" />
              <span className="exped-ping" />
              <div className="flex items-center justify-between border-b border-[rgba(143,212,96,0.12)] pb-3 font-mono text-[8px] tracking-[0.18em]">
                <span style={{ color: e.color }}>⌖ {e.logId}</span>
                {e.flagship && <span className="rounded-full px-2 py-0.5 font-bold text-[#070a06]" style={{ background: `linear-gradient(90deg,${e.color},#fff)` }}><Flag size={8} className="mr-0.5 inline" />PRIME</span>}
              </div>
              {e.img ? (
                <div className="relative my-3 h-24 overflow-hidden rounded-xl border border-white/5">
                  <img src={e.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a06dd] to-transparent" />
                  <i className={`${e.icon} absolute right-2.5 top-2.5 text-lg`} style={{ color: e.color, textShadow: `0 0 12px ${e.color}` }} />
                </div>
              ) : (
                <div className="my-3 flex h-24 items-center justify-center rounded-xl border border-white/5" style={{ background: `radial-gradient(circle,${e.color}20,transparent 70%)` }}>
                  <i className={`${e.icon} text-3xl`} style={{ color: e.color, textShadow: `0 0 16px ${e.color}` }} />
                </div>
              )}
              <h3 className="f-head text-[14px] font-bold text-white">{e.name}</h3>
              <div className="mt-1 font-mono text-[8px] tracking-[0.14em] text-[#97a087]">
                <span style={{ color: e.color }}>{e.terrain}</span> · {e.coords}
              </div>
              <p className="mt-2 line-clamp-2 min-h-[34px] text-[11.5px] leading-relaxed text-[#97a087]">{e.brief}</p>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {e.metrics.slice(0, 2).map((m) => (
                  <div key={m.label} className="rounded-lg bg-black/25 px-2 py-1.5 text-center">
                    <div className="font-mono text-[10px] font-bold" style={{ color: e.color }}>{m.value}</div>
                    <div className="font-mono text-[6.5px] tracking-[0.14em] text-[#97a087]">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[rgba(143,212,96,0.12)] pt-3 font-mono text-[8px] text-[#97a087]">
                <span className="flex items-center gap-1"><Mountain size={9} /> {e.year}</span>
                <span className="flex items-center gap-1 font-bold text-[#ffd58a]">OPEN LOG <ArrowUpRight size={10} /></span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* full expedition report modal */}
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#070a06e0] p-4 backdrop-blur-xl" onClick={() => setSel(null)}>
            <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 14 }}
              transition={{ type: "spring", stiffness: 230, damping: 24 }}
              onClick={(ev) => ev.stopPropagation()}
              className="field-deep survey-ticks relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl hide-scroll"
              style={{ boxShadow: `0 0 80px ${sel.color}28` }}>
              <span className="tick-b" />
              <div className="scan-band" />
              <div className="flex items-center justify-between border-b border-[rgba(255,179,71,0.2)] px-6 py-4"
                style={{ background: `linear-gradient(90deg,${sel.color}1e,transparent)` }}>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ color: sel.color, background: `${sel.color}18`, border: `1px solid ${sel.color}44` }}>
                    <i className={`${sel.icon} text-lg`} />
                  </span>
                  <div>
                    <div className="font-mono text-[8px] tracking-[0.26em] text-[#97a087]">{sel.logId} · {sel.terrain} · {sel.year}</div>
                    <h3 className="f-head text-xl font-extrabold text-white">{sel.name}</h3>
                  </div>
                </div>
                <button onClick={() => { scout.click(); setSel(null); }} className="field-panel flex h-9 w-9 items-center justify-center rounded-full text-[#97a087] hover:text-white" aria-label="Close">
                  <X size={15} />
                </button>
              </div>
              <div className="space-y-5 p-6">
                <div className="stamp inline-block rounded px-3 py-1.5 font-mono text-[9px] tracking-[0.2em]" style={{ color: sel.color }}>
                  STATUS: {sel.status}
                </div>
                <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] text-[#97a087]">
                  <span className="flex items-center gap-1.5"><Crosshair size={11} style={{ color: sel.color }} /> {sel.coords}</span>
                  <span className="flex items-center gap-1.5"><Map size={11} style={{ color: sel.color }} /> TERRAIN: {sel.terrain}</span>
                </div>
                <p className="text-sm leading-relaxed text-[#c4c9b4]">{sel.brief}</p>
                {/* route walked */}
                <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
                  <div className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.24em]" style={{ color: sel.color }}>
                    <Footprints size={12} /> ROUTE WALKED
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {sel.route.map((step, idx) => (
                      <div key={step} className="flex items-center gap-2">
                        <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-mono text-[10px] text-white">
                          <span className="mr-1 font-bold" style={{ color: sel.color }}>{idx + 1}</span>{step}
                        </span>
                        {idx < sel.route.length - 1 && <ArrowRight size={11} className="shrink-0 text-[#8fd460]" />}
                      </div>
                    ))}
                  </div>
                </div>
                {/* field metrics */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {sel.metrics.map((m) => (
                    <div key={m.label} className="field-panel rounded-2xl p-3.5 text-center">
                      <div className="f-head text-base font-black" style={{ color: sel.color }}>{m.value}</div>
                      <div className="mt-1 font-mono text-[7px] tracking-[0.16em] text-[#97a087]">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sel.gear.map((g) => (
                    <span key={g} className="rounded-lg border px-2.5 py-1.5 font-mono text-[10px]" style={{ color: sel.color, borderColor: `${sel.color}44`, background: `${sel.color}0d` }}>{g}</span>
                  ))}
                </div>
                <div className="flex gap-3 border-t border-[rgba(255,179,71,0.16)] pt-5">
                  <a href={sel.href} target="_blank" rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 font-mono text-[10px] font-bold tracking-[0.16em] text-[#070a06]"
                    style={{ background: `linear-gradient(120deg,${sel.color},#ffd58a)` }}>
                    ⌖ RETRIEVE FIELD NOTES
                  </a>
                  <a href={nomad.github} target="_blank" rel="noopener noreferrer" className="field-panel flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[10px] tracking-[0.16em] text-white">
                    ARCHIVE <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============ JOURNEY WAYPOINTS ============ */
export function Journey() {
  return (
    <section id="journey" className="relative py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionHead code="LOG 04 · TREK RECORD" title="Four waypoints" accent="on the map"
          sub="The full trek — from 2023 trailhead to unmapped 2026 territory." />
        <div className="relative">
          {/* dashed trail */}
          <svg className="absolute left-5 top-2 bottom-2 w-px overflow-visible md:left-1/2" aria-hidden>
            <line x1="0" y1="0" x2="0" y2="100%" stroke="#ffb347" strokeWidth="2" strokeOpacity="0.4" className="trail-dash" />
          </svg>
          {waypoints.map((wp, i) => {
            const left = i % 2 === 0;
            return (
              <div key={wp.yr} className="relative mb-8 pl-14 md:mb-0 md:grid md:grid-cols-2 md:gap-x-16 md:py-6 md:pl-0">
                <span className="absolute left-5 top-6 flex h-5 w-5 -translate-x-1/2 items-center justify-center md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                  <span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${wp.color}`, background: "#070a06", boxShadow: `0 0 16px ${wp.color}` }} />
                  <MapPin size={10} style={{ color: wp.color, zIndex: 1 }} />
                </span>
                <div className={left ? "md:col-start-1 md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}>
                  <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="field-panel inline-block w-full rounded-2xl p-5 text-left">
                    <div className={`mb-2 flex items-center gap-3 ${left ? "md:flex-row-reverse" : ""}`}>
                      <span className="f-head text-xl font-black text-white">{wp.yr}</span>
                      <span className="rounded-full border px-2.5 py-0.5 font-mono text-[8px] tracking-[0.2em]" style={{ color: wp.color, borderColor: `${wp.color}44`, background: `${wp.color}12` }}>{wp.phase}</span>
                    </div>
                    <h4 className="f-head text-[14px] font-bold text-white">{wp.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#97a087]">{wp.desc}</p>
                    <div className="mt-2 font-mono text-[8px] tracking-[0.18em]" style={{ color: wp.color }}>{wp.wp} · {wp.coords}</div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ TERRITORIES (CERTS) ============ */
export function Territories() {
  const [q, setQ] = useState("");
  const shown = certTerritories.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <section id="territories" className="relative py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionHead code="LOG 05 · TERRITORY MAP" title="82+ certified" accent="waypoints"
          sub="Nine territories fully surveyed — Programming Hub charted, Google Developers Launchpad resupplied." />
        <div className="relative mb-8 max-w-md">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#97a087]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Survey the territories…"
            className="field-panel w-full rounded-full py-3 pl-11 pr-4 font-mono text-xs text-white outline-none placeholder:text-[#97a087]" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {shown.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              onMouseEnter={() => scout.click()}
              className="field-panel rounded-2xl p-4 text-center transition-colors hover:border-[rgba(255,179,71,0.4)]">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${c.color}1c`, color: c.color }}>
                <i className={`${c.icon} text-base`} />
              </div>
              <div className="f-head text-2xl font-black" style={{ color: c.color }}>{c.count}</div>
              <div className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-[#97a087]">{c.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SIGNAL FIRE (CONTACT) ============ */
export function SignalFire() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(nomad.email); } catch { /* unavailable */ }
    setCopied(true);
    scout.waypoint();
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section id="signal" className="relative py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionHead code="LOG 06 · SIGNAL FIRE" title="Light the" accent="signal fire"
          sub="Open to Senior Android & edge-AI expeditions worldwide. Every flare gets a response before sunrise." />
        <div className="field-deep survey-ticks relative overflow-hidden rounded-[2.5rem] p-7 md:p-10">
          <span className="tick-b" />
          <div className="scan-band" />
          <div className="relative grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="f-head text-2xl font-extrabold leading-tight text-white md:text-3xl">
                Join the next <span className="survey-text">expedition.</span>
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#97a087]">
                Whether it's a summit push or a long traverse — the nomad answers every radio call personally.
              </p>
              <div className="mt-6 space-y-3">
                <a href={`mailto:${nomad.email}`} className="field-panel flex items-center gap-3.5 rounded-2xl p-4 hover:border-[rgba(255,179,71,0.4)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(255,179,71,0.14)] text-[#ffb347]"><Mail size={16} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[8px] tracking-[0.22em] text-[#97a087]">RADIO FREQUENCY</span>
                    <span className="block truncate font-mono text-xs text-white">{nomad.email}</span>
                  </span>
                  <button onClick={(ev) => { ev.preventDefault(); copy(); }} className="field-panel flex h-8 w-8 items-center justify-center rounded-lg text-[#97a087] hover:text-white" aria-label="Copy email">
                    {copied ? <Check size={14} className="text-[#8fd460]" /> : <Copy size={14} />}
                  </button>
                </a>
                <a href={`tel:${nomad.phone.replace(/\s/g, "")}`} className="field-panel flex items-center gap-3.5 rounded-2xl p-4 hover:border-[rgba(143,212,96,0.4)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(143,212,96,0.14)] text-[#8fd460]"><Phone size={16} /></span>
                  <span>
                    <span className="block font-mono text-[8px] tracking-[0.22em] text-[#97a087]">VOICE CHANNEL</span>
                    <span className="block font-mono text-xs text-white">{nomad.phone}</span>
                  </span>
                </a>
                <div className="field-panel flex items-center gap-3.5 rounded-2xl p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(95,212,208,0.12)] text-[#5fd4d0]"><MapPin size={16} /></span>
                  <span className="text-sm text-white">{nomad.location}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-4 text-center font-mono text-[9px] tracking-[0.28em] text-[#97a087]">— RELAY STATIONS —</div>
              <div className="grid grid-cols-2 gap-2.5">
                {nomad.socials.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="field-panel flex items-center gap-3 rounded-2xl p-3.5 transition-all hover:-translate-y-0.5 hover:border-[rgba(255,179,71,0.4)]">
                    <i className={`${s.icon} text-[#ffb347]`} />
                    <span className="font-mono text-[10px] text-white">{s.name}</span>
                  </a>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-[rgba(255,179,71,0.16)] bg-black/25 p-5 text-center">
                <CompassIcon size={18} className="animate-compass mx-auto mb-2 text-[#ffb347]/70" />
                <p className="text-lg italic text-white">"{nomad.philosophy}"</p>
                <div className="mt-2 font-mono text-[8px] tracking-[0.28em] text-[#97a087]">LOGGED FROM THE FIELD</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
export function Footer() {
  return (
    <footer className="relative border-t border-[rgba(143,212,96,0.12)] bg-[#060905f2]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 pb-6 pt-12 md:flex-row md:px-8">
        <span className="f-head font-black tracking-[0.18em] text-white">CYBER<span className="survey-text">·NOMAD</span></span>
        <div className="flex flex-wrap justify-center gap-5">
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`} className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#97a087] hover:text-[#ffb347]">{n.label}</a>)}
        </div>
      </div>
      <div className="pointer-events-none select-none overflow-hidden py-4 text-center leading-none">
        <span className="f-head text-[clamp(3rem,15vw,11rem)] font-black text-transparent" style={{ WebkitTextStroke: "1px rgba(255,179,71,0.12)" }}>UNCHARTED</span>
      </div>
      <div className="pb-8 text-center font-mono text-[9px] tracking-[0.2em] text-[#97a087]">
        © 2026 {nomad.name} · SENIOR ANDROID & EDGE-AI EXPLORER · TRAIL NEVER ENDS
      </div>
    </footer>
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
    <motion.button aria-label="Return to basecamp"
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14, pointerEvents: show ? "auto" : "none" }}
      onClick={() => { scout.sonar(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      className="field-panel fixed bottom-6 left-6 z-[70] flex h-11 w-11 items-center justify-center rounded-full text-[#ffb347]">
      <ChevronUp size={18} />
    </motion.button>
  );
}
