import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Binary, Check, ChevronUp, Copy, Cpu, Crosshair,
  Download, Mail, Orbit, Phone, Radio, Satellite, Search, Shield,
  Signal, Stars, Volume2, VolumeX, Waves, X, Activity, Atom,
} from "lucide-react";
import { captain, certifications, missionLogs, skillModules, stardateLog, tapeItems, type MissionLog } from "../warpData";
import { warp } from "../warpAudio";

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
  return <span className={`caret-w ${className}`}>{text || "\u00a0"}</span>;
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
        className="flex items-center gap-2 font-mono text-[10px] tracking-[0.36em] text-[#4ef0ff]">
        <Satellite size={11} /> {code}
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
        className="f-head mt-3 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.02] text-white">
        {title} <span className="warp-text">{accent}</span>
      </motion.h2>
      {sub && <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-4 max-w-2xl text-base leading-relaxed text-[#6f8aa8] md:text-lg">{sub}</motion.p>}
    </div>
  );
}

export function Tape() {
  const row = [...tapeItems, ...tapeItems];
  return (
    <div className="relative overflow-hidden border-y border-[rgba(78,240,255,0.14)] bg-[#030711b3] py-3 select-none">
      <div className="flex w-max" style={{ animation: "marquee-w 36s linear infinite" }}>
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8 pr-8 font-mono text-[10px] tracking-[0.3em] text-[#6f8aa8]">
            {item}<span className="text-[#4ef0ff]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* Warp core visualization — hero centerpiece */
export function WarpCore() {
  const [charge, setCharge] = useState(0);
  useEffect(() => {
    const onScroll = () => setCharge(Math.min(100, window.scrollY * 0.06));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="relative h-[320px] w-[320px] sm:h-[380px] sm:w-[380px]">
      <div className="absolute inset-[-12%] rounded-full opacity-40" style={{ background: "radial-gradient(circle, rgba(78,240,255,0.2), transparent 62%)" }} />
      <svg viewBox="0 0 380 380" className="h-full w-full">
        {/* Outer hull */}
        <circle cx="190" cy="190" r="186" fill="rgba(5,8,21,0.62)" stroke="rgba(78,240,255,0.4)" strokeWidth="2" />
        <circle cx="190" cy="190" r="170" fill="none" stroke="rgba(183,123,255,0.2)" strokeWidth="1" />
        {/* Orbit rings — rotating */}
        <g style={{ transformOrigin: "190px 190px", animation: "radar-sweep 26s linear infinite" }}>
          <circle cx="190" cy="190" r="150" fill="none" stroke="rgba(78,240,255,0.35)" strokeWidth="1.2" strokeDasharray="4 10" />
          <circle cx="340" cy="190" r="3.5" fill="#4ef0ff" style={{ filter: "drop-shadow(0 0 6px #4ef0ff)" }} />
        </g>
        <g style={{ transformOrigin: "190px 190px", animation: "radar-sweep 18s linear infinite reverse" }}>
          <circle cx="190" cy="190" r="118" fill="none" stroke="rgba(183,123,255,0.35)" strokeWidth="1.2" strokeDasharray="8 6" />
          <circle cx="308" cy="190" r="3" fill="#b77bff" style={{ filter: "drop-shadow(0 0 6px #b77bff)" }} />
        </g>
        <g style={{ transformOrigin: "190px 190px", animation: "radar-sweep 12s linear infinite" }}>
          <circle cx="190" cy="190" r="86" fill="none" stroke="rgba(255,184,74,0.35)" strokeWidth="1.2" strokeDasharray="3 9" />
          <circle cx="276" cy="190" r="2.5" fill="#ffb84a" style={{ filter: "drop-shadow(0 0 5px #ffb84a)" }} />
        </g>
        {/* Warp core — pulsing central plasma */}
        <defs>
          <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#4ef0ff" stopOpacity="0.8" />
            <stop offset="65%" stopColor="#b77bff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx="190" cy="190" r="58" fill="url(#core-grad)">
          <animate attributeName="r" values="56;62;56" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="190" cy="190" r="32" fill="#fff" opacity="0.9">
          <animate attributeName="opacity" values="0.95;0.65;0.95" dur="1.6s" repeatCount="indefinite" />
        </circle>
        {/* Plasma injection lines */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <line key={i}
              x1="190" y1="190"
              x2={190 + Math.cos(a) * 72} y2={190 + Math.sin(a) * 72}
              stroke="#4ef0ff" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="2 4" />
          );
        })}
      </svg>
      {/* Floating readouts */}
      <div className="hud-panel animate-orbit-float absolute -left-3 top-12 rounded-lg px-2.5 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#4ef0ff]">WARP 9.6</div>
      <div className="hud-panel animate-orbit-float absolute -right-5 bottom-20 rounded-lg px-2.5 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#b77bff]" style={{ animationDelay: "1.4s" }}>CORE {Math.round(charge)}%</div>
      <div className="hud-panel animate-orbit-float absolute left-6 -bottom-2 rounded-lg px-2.5 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#5cff9d]" style={{ animationDelay: "2.2s" }}>SHIELDS UP</div>
    </div>
  );
}

/* ============ NAV ============ */
const NAV = [
  { id: "bridge", label: "Bridge" },
  { id: "systems", label: "Systems" },
  { id: "missions", label: "Missions" },
  { id: "stardate", label: "Stardate" },
  { id: "certifications", label: "Academy" },
  { id: "hailing", label: "Hailing" },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(!warp.enabled);

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
          <div className="hud-panel flex items-center justify-between rounded-full py-2 pl-4 pr-2">
            <a href="#hero" className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(78,240,255,0.5)] bg-[#050815]">
                <Orbit size={16} className="text-[#4ef0ff]" style={{ animation: "radar-sweep 6s linear infinite" }} />
              </span>
              <span className="leading-tight">
                <span className="f-head block text-[12px] font-extrabold tracking-[0.14em] text-white">USS <span className="warp-text">KOTLIN</span></span>
                <span className="mt-0.5 block font-mono text-[8px] tracking-[0.28em] text-[#6f8aa8]">{captain.registry}</span>
              </span>
            </a>
            <nav className="hidden items-center gap-6 lg:flex">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => warp.click()}
                  className={`navlink font-mono text-[10px] uppercase tracking-[0.18em] ${active === n.id ? "active text-[#4ef0ff]" : "text-[#6f8aa8] hover:text-white"}`}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={() => { const on = warp.toggle(); setMuted(!on); }} aria-label="Ship audio"
                className={`hud-panel flex h-9 w-9 items-center justify-center rounded-full ${muted ? "text-[#6f8aa8]" : "text-[#4ef0ff]"}`}>
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <span className="hidden items-center gap-2 rounded-full border border-[rgba(92,255,157,0.3)] px-3 py-1.5 font-mono text-[9px] tracking-widest text-[#5cff9d] md:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5cff9d]" /> CHANNELS OPEN
              </span>
              <a href="#hailing" className="hidden rounded-full px-4 py-2 font-mono text-[10px] font-bold tracking-[0.15em] text-[#02030a] sm:inline-flex"
                style={{ background: "linear-gradient(120deg,#4ef0ff,#b77bff)" }}>
                HAIL SHIP
              </a>
              <button onClick={() => setOpen(true)} className="hud-panel flex h-10 w-10 items-center justify-center rounded-full text-[#4ef0ff] lg:hidden" aria-label="Menu">
                <Binary size={17} />
              </button>
            </div>
          </div>
          <motion.div style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg,#4ef0ff,#b77bff,#ff4d6a)" }} className="mt-2 h-[2px] origin-left rounded-full" />
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-[#02030af5] px-6 backdrop-blur-2xl lg:hidden">
            <div className="flex h-20 items-center justify-between border-b border-[rgba(78,240,255,0.14)]">
              <span className="f-head text-lg font-black text-white">USS <span className="warp-text">KOTLIN</span></span>
              <button onClick={() => setOpen(false)} className="hud-panel flex h-10 w-10 items-center justify-center rounded-full text-white" aria-label="Close"><X size={17} /></button>
            </div>
            <nav className="pt-6">
              {NAV.map((n, i) => (
                <motion.a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="f-head flex items-center justify-between border-b border-[rgba(78,240,255,0.12)] py-4 text-xl font-bold text-white">
                  {n.label}<span className="font-mono text-xs text-[#4ef0ff]">SEC-0{i + 1}</span>
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============ HERO / BRIDGE ============ */
export function Bridge() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 700], [0, 80]);
  const yCore = useTransform(scrollY, [0, 700], [0, -90]);
  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pb-16 pt-28">
      <div className="stargrid absolute inset-0 opacity-70" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.06fr_0.94fr]">
        <motion.div style={{ y: yText }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="hud-panel mb-6 inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4">
            <span className="rounded-full px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.18em] text-[#02030a]" style={{ background: "linear-gradient(120deg,#4ef0ff,#b77bff)" }}>⌖ WARP ENGAGED</span>
            <span className="font-mono text-[9px] tracking-[0.22em] text-[#4ef0ff]">FACTOR 9.6</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="mb-3 font-mono text-[10px] tracking-[0.3em] text-[#6f8aa8]">
            STARDATE 78234.5 · SECTOR 7-G
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }}
            className="f-head text-[clamp(2.7rem,7vw,5.4rem)] font-black leading-[0.94] tracking-tight text-white">
            MOE KYAW<br /><span className="warp-text glow-warp">AUNG</span>
            <span className="mt-3 block text-[clamp(1.1rem,2.6vw,1.7rem)] font-medium tracking-normal text-[#6f8aa8]">
              chief engineer of the USS Kotlin.
            </span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-5">
            <Typing phrases={captain.roles} className="font-mono text-sm text-[#b77bff] md:text-lg" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-5 space-y-1 font-mono text-[11px] text-[#6f8aa8]">
            <div className="flex items-center gap-2"><Satellite size={12} className="text-[#ff4d6a]" /> {captain.baseA}</div>
            <div className="flex items-center gap-2"><Satellite size={12} className="text-[#5cff9d]" /> {captain.baseB}</div>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="mt-5 max-w-xl leading-relaxed text-[#6f8aa8]">
            {captain.tagline} Currently commanding <span className="font-medium text-white">{captain.building}</span>.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#missions" onClick={() => warp.warp()}
              className="flex items-center gap-2.5 rounded-full px-7 py-3.5 font-mono text-[11px] font-bold tracking-[0.16em] text-[#02030a] shadow-[0_12px_38px_rgba(78,240,255,0.25)] transition-transform hover:scale-105"
              style={{ background: "linear-gradient(120deg,#4ef0ff,#b77bff)" }}>
              OPEN MISSION LOGS <ArrowRight size={14} />
            </a>
            <a href={captain.github} target="_blank" rel="noopener noreferrer"
              className="hud-panel flex items-center gap-2.5 rounded-full px-6 py-3.5 font-mono text-[11px] tracking-[0.16em] text-white hover:border-[#4ef0ff]">
              <Download size={14} /> SUBSPACE ARCHIVE
            </a>
          </motion.div>
          <div className="mt-10 grid max-w-xl grid-cols-4 gap-3">
            {captain.stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 + i * 0.08 }}
                className="hud-panel rounded-2xl px-2 py-3.5 text-center">
                <div className="f-head warp-text text-xl font-black tabular-nums md:text-2xl"><CountUp to={s.value} suffix={s.suffix} /></div>
                <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white">{s.label}</div>
                <div className="font-mono text-[7px] tracking-[0.12em] text-[#6f8aa8]">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div style={{ y: yCore }} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.9 }}
          className="relative flex justify-center">
          <WarpCore />
        </motion.div>
      </div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center font-mono text-[8px] tracking-[0.4em] text-[#6f8aa8]">
        PROCEED TO BRIDGE
        <div className="mx-auto mt-2 h-9 w-px bg-gradient-to-b from-[#4ef0ff] to-transparent" />
      </motion.div>
    </section>
  );
}

/* ============ BRIDGE (ABOUT) ============ */
export function BridgeProfile() {
  const log = [
    "$ scan --officer mka",
    `designation → ${captain.callsign} · ${captain.designation}`,
    "vessel      → USS Kotlin · NCC-2026-A",
    "primary     → kotlin · compose · mvvm · clean arch",
    "subspace    → firebase · retrofit · rest · python",
    "sensors     → tflite int8 · claude api · ethical hacking",
    `directive   → "${captain.directive}"`,
  ];
  return (
    <section id="bridge" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHead code="DECK 01 · THE BRIDGE" title="Chief engineer" accent="on the bridge"
          sub="From Tachileik Base to Bangkok Station — engineering warp-capable systems at the edge of known space." />
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7 }}
            className="hud-panel hud-brackets relative min-h-[440px] overflow-hidden rounded-3xl">
            <span className="hb" />
            <div className="scan-band" />
            <img src={captain.portrait} alt={captain.name} className="absolute inset-0 h-full w-full object-cover object-top opacity-70" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02030a] via-[#02030a88] to-transparent" />
            {/* Officer tag */}
            <div className="hud-panel absolute right-5 top-5 rotate-2 rounded px-3 py-1.5 font-mono text-[9px] tracking-[0.22em] text-[#4ef0ff]">
              ⌖ CHIEF ENGINEER · VERIFIED
            </div>
            <div className="relative flex min-h-[440px] flex-col justify-end p-7">
              <div className="font-mono text-[9px] tracking-[0.3em] text-[#4ef0ff]">OFFICER · {captain.callsign}</div>
              <h3 className="f-head mt-2 text-2xl font-extrabold leading-tight text-white md:text-3xl">
                <span className="text-[#4ef0ff]">{captain.name}</span> · {captain.designation}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#b9c9e0]">
                {captain.tagline}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Burmese 🇲🇲", "English 🌐", "Kotlin ☕"].map((l) => (
                  <span key={l} className="hud-panel rounded-full px-3 py-1.5 font-mono text-[9px] tracking-widest text-[#4ef0ff]">◆ {l}</span>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-3xl border border-[rgba(78,240,255,0.2)] bg-[#050815e8]">
            <div className="flex items-center gap-2 border-b border-[rgba(78,240,255,0.14)] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff4d6a]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffb84a]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#5cff9d]/80" />
              <span className="ml-2 font-mono text-[9px] tracking-widest text-[#6f8aa8]">mother9@uss-kotlin:~$</span>
            </div>
            <div className="lcars-bar" />
            <div className="space-y-1 p-6 font-mono text-[12px] leading-7">
              {log.map((line, i) => (
                <motion.div key={line} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className={i === 0 || i === log.length - 1 ? "text-[#4ef0ff]" : "text-[#6f8aa8]"}>{line}</motion.div>
              ))}
              <span className="caret-w" />
            </div>
            <div className="grid grid-cols-3 gap-2 px-6 pb-6">
              {[["MODULES", "12"], ["INFERENCE", "32ms"], ["CRASH-FREE", "99.98%"]].map(([k, v]) => (
                <div key={k} className="hud-panel rounded-2xl p-3 text-center">
                  <div className="f-head text-sm font-bold text-white">{v}</div>
                  <div className="mt-1 font-mono text-[7px] tracking-[0.16em] text-[#6f8aa8]">{k}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-[rgba(78,240,255,0.14)] p-5">
              <div className="mb-2 font-mono text-[8px] tracking-[0.28em] text-[#6f8aa8]">CURRENT SECTOR</div>
              <div className="flex items-center gap-3">
                <Satellite size={16} className="text-[#5cff9d] animate-blink-w" />
                <div className="flex-1 font-mono text-[11px] text-[#e8faff]">{captain.location}</div>
                <Signal size={14} className="animate-blink-w text-[#4ef0ff]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============ SHIP SYSTEMS (SKILLS) ============ */
export function Systems() {
  const icons = [Cpu, Atom, Waves, Radio, Shield, Binary];
  return (
    <section id="systems" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHead code="DECK 02 · SHIP SYSTEMS" title="Six primary" accent="systems online"
          sub="Every module of the USS Kotlin running at peak efficiency." />
        <div className="grid gap-4 md:grid-cols-2">
          {skillModules.map((s, i) => {
            const Icon = icons[i] || Cpu;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.08 }}
                onMouseEnter={() => warp.click()}
                className="hud-panel group relative overflow-hidden rounded-2xl p-5 transition-colors hover:border-[rgba(78,240,255,0.4)]">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-15 blur-3xl transition-opacity group-hover:opacity-35" style={{ background: s.color }} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-[0.24em]" style={{ color: s.color }}>{s.id} · {s.note}</span>
                    <span className="f-head text-xl font-black tabular-nums" style={{ color: s.color }}>{s.pct}%</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ color: s.color, background: `${s.color}18`, border: `1px solid ${s.color}44` }}>
                      <Icon size={18} />
                    </span>
                    <h4 className="f-head text-lg font-bold text-white">{s.name}</h4>
                  </div>
                  <p className="mt-1.5 mb-3 font-mono text-[9px] tracking-wide text-[#6f8aa8]">{s.spec}</p>
                  <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.pct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }}
                      className="relative h-full rounded-full"
                      style={{ background: `linear-gradient(90deg,${s.color}55,${s.color})`, boxShadow: `0 0 12px ${s.color}` }}>
                      <span className="absolute -top-0.5 right-0 h-3 w-3 rounded-full bg-white shadow" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ MISSION LOGS (PROJECTS) ============ */
export function Missions() {
  const [sel, setSel] = useState<MissionLog | null>(null);
  return (
    <section id="missions" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead code="DECK 03 · MISSION LOGS" title="Eight logged" accent="missions"
          sub="Each mission is a stamped log entry — stardate, classification, orbital path, crew manifest and status. Open any log for the full report." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {missionLogs.map((m, i) => (
            <motion.button key={m.id}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}
              onMouseEnter={() => warp.click()}
              onClick={() => { warp.warp(); setSel(m); }}
              className="mission-card hud-panel hud-brackets rounded-2xl p-5 text-left">
              <span className="hb" />
              <div className="scan-band opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center justify-between border-b border-[rgba(78,240,255,0.12)] pb-3 font-mono text-[8px] tracking-[0.18em]">
                <span style={{ color: m.color }}>⌖ {m.logId}</span>
                <span className="rounded px-1.5 py-0.5 font-bold" style={{ color: m.color, background: `${m.color}18` }}>{m.classification}</span>
              </div>
              {m.img ? (
                <div className="relative my-3 h-24 overflow-hidden rounded-xl border border-white/5">
                  <img src={m.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02030add] to-transparent" />
                  <i className={`${m.icon} absolute right-2.5 top-2.5 text-lg`} style={{ color: m.color, textShadow: `0 0 12px ${m.color}` }} />
                </div>
              ) : (
                <div className="my-3 flex h-24 items-center justify-center rounded-xl border border-white/5" style={{ background: `radial-gradient(circle,${m.color}20,transparent 70%)` }}>
                  <i className={`${m.icon} text-3xl`} style={{ color: m.color, textShadow: `0 0 16px ${m.color}` }} />
                </div>
              )}
              <h3 className="f-head text-[14px] font-bold text-white">{m.title}</h3>
              <div className="mt-1 font-mono text-[8px] tracking-[0.14em] text-[#6f8aa8]">
                <span style={{ color: m.color }}>{m.sector}</span> · SD {m.stardate}
              </div>
              <p className="mt-2 line-clamp-2 min-h-[34px] text-[11.5px] leading-relaxed text-[#6f8aa8]">{m.brief}</p>
              {/* Orbital path */}
              <div className="mt-3 border-t border-[rgba(78,240,255,0.12)] pt-3">
                <div className="mb-2 flex items-center gap-1 font-mono text-[7px] tracking-[0.2em] text-[#6f8aa8]">
                  <Orbit size={8} style={{ color: m.color }} /> ORBITAL PATH
                </div>
                <div className="flex items-center gap-1 overflow-hidden">
                  {m.orbitalPath.slice(0, 3).map((step, idx) => (
                    <div key={step} className="flex items-center gap-1">
                      <span className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-1 font-mono text-[7.5px] text-white">
                        {step}
                      </span>
                      {idx < 2 && idx < m.orbitalPath.length - 1 && <ArrowRight size={8} className="shrink-0 text-[#4ef0ff]" />}
                    </div>
                  ))}
                  {m.orbitalPath.length > 3 && <span className="font-mono text-[7.5px] text-[#6f8aa8]">+{m.orbitalPath.length - 3}</span>}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[rgba(78,240,255,0.12)] pt-3 font-mono text-[8px] text-[#6f8aa8]">
                <span className="flex items-center gap-1"><Stars size={9} /> {m.year}</span>
                <span className="flex items-center gap-1 font-bold text-[#4ef0ff]">OPEN LOG <ArrowUpRight size={10} /></span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Full mission report modal */}
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#02030ae0] p-4 backdrop-blur-xl" onClick={() => setSel(null)}>
            <motion.div initial={{ scale: 0.92, y: 24, filter: "blur(10px)" }} animate={{ scale: 1, y: 0, filter: "blur(0)" }} exit={{ scale: 0.94, y: 14 }}
              transition={{ type: "spring", stiffness: 230, damping: 24 }}
              onClick={(ev) => ev.stopPropagation()}
              className="hud-deep hud-brackets relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl hide-scroll"
              style={{ boxShadow: `0 0 80px ${sel.color}28` }}>
              <span className="hb" />
              <div className="scan-band" />
              <div className="lcars-bar" />
              <div className="flex items-center justify-between border-b border-[rgba(78,240,255,0.2)] px-6 py-4"
                style={{ background: `linear-gradient(90deg,${sel.color}1e,transparent)` }}>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ color: sel.color, background: `${sel.color}18`, border: `1px solid ${sel.color}44` }}>
                    <i className={`${sel.icon} text-lg`} />
                  </span>
                  <div>
                    <div className="font-mono text-[8px] tracking-[0.26em] text-[#6f8aa8]">{sel.logId} · {sel.classification} · SD {sel.stardate}</div>
                    <h3 className="f-head text-xl font-extrabold text-white">{sel.title}</h3>
                  </div>
                </div>
                <button onClick={() => { warp.click(); setSel(null); }} className="hud-panel flex h-9 w-9 items-center justify-center rounded-full text-[#6f8aa8] hover:text-white" aria-label="Close">
                  <X size={15} />
                </button>
              </div>
              <div className="space-y-5 p-6">
                <div className="hud-panel inline-block rounded px-3 py-1.5 font-mono text-[9px] tracking-[0.2em]" style={{ color: sel.color }}>
                  STATUS: {sel.status}
                </div>
                <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] text-[#6f8aa8]">
                  <span className="flex items-center gap-1.5"><Satellite size={11} style={{ color: sel.color }} /> {sel.sector}</span>
                  <span className="flex items-center gap-1.5"><Crosshair size={11} style={{ color: sel.color }} /> YEAR {sel.year}</span>
                </div>
                <p className="text-sm leading-relaxed text-[#b9c9e0]">{sel.brief}</p>
                {/* Orbital path full */}
                <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
                  <div className="mb-3 flex items-center gap-2 font-mono text-[9px] tracking-[0.24em]" style={{ color: sel.color }}>
                    <Orbit size={12} /> ORBITAL PATH
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {sel.orbitalPath.map((step, idx) => (
                      <div key={step} className="flex items-center gap-2">
                        <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-mono text-[10px] text-white">
                          <span className="mr-1 font-bold" style={{ color: sel.color }}>{idx + 1}</span>{step}
                        </span>
                        {idx < sel.orbitalPath.length - 1 && <ArrowRight size={11} className="shrink-0 text-[#4ef0ff]" />}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {sel.metrics.map((mm) => (
                    <div key={mm.label} className="hud-panel rounded-2xl p-3.5 text-center">
                      <div className="f-head text-base font-black" style={{ color: sel.color }}>{mm.value}</div>
                      <div className="mt-1 font-mono text-[7px] tracking-[0.16em] text-[#6f8aa8]">{mm.label}</div>
                    </div>
                  ))}
                </div>
                {/* Crew manifest */}
                <div>
                  <div className="mb-2 flex items-center gap-2 font-mono text-[9px] tracking-[0.24em] text-[#6f8aa8]">
                    <Activity size={11} /> CREW MANIFEST
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sel.crew.map((c) => (
                      <span key={c} className="rounded-lg border px-2.5 py-1.5 font-mono text-[10px]" style={{ color: sel.color, borderColor: `${sel.color}44`, background: `${sel.color}0d` }}>{c}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 border-t border-[rgba(78,240,255,0.16)] pt-5">
                  <a href={sel.href} target="_blank" rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 font-mono text-[10px] font-bold tracking-[0.16em] text-[#02030a]"
                    style={{ background: `linear-gradient(120deg,${sel.color},#b77bff)` }}>
                    ⌖ ACCESS MISSION DATA
                  </a>
                  <a href={captain.github} target="_blank" rel="noopener noreferrer" className="hud-panel flex items-center gap-2 rounded-full px-5 py-3 font-mono text-[10px] tracking-[0.16em] text-white">
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

/* ============ STARDATE LOG (TIMELINE) ============ */
export function StardateLog() {
  return (
    <section id="stardate" className="relative py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionHead code="DECK 04 · STARDATE LOG" title="Four stardates" accent="on record"
          sub="The captain's log — from commissioning to deep-space mission." />
        <div className="relative">
          {/* Orbital path line */}
          <svg className="absolute left-5 top-2 bottom-2 w-px overflow-visible md:left-1/2" aria-hidden>
            <line x1="0" y1="0" x2="0" y2="100%" stroke="#4ef0ff" strokeWidth="2" strokeOpacity="0.4" className="orbit-dash" />
          </svg>
          {stardateLog.map((wp, i) => {
            const left = i % 2 === 0;
            return (
              <div key={wp.yr} className="relative mb-8 pl-14 md:mb-0 md:grid md:grid-cols-2 md:gap-x-16 md:py-6 md:pl-0">
                <span className="absolute left-5 top-6 flex h-5 w-5 -translate-x-1/2 items-center justify-center md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                  <span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${wp.color}`, background: "#02030a", boxShadow: `0 0 16px ${wp.color}` }} />
                  <Satellite size={10} style={{ color: wp.color, zIndex: 1 }} />
                </span>
                <div className={left ? "md:col-start-1 md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}>
                  <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="hud-panel inline-block w-full rounded-2xl p-5 text-left">
                    <div className={`mb-2 flex items-center gap-3 ${left ? "md:flex-row-reverse" : ""}`}>
                      <span className="f-head text-xl font-black text-white">{wp.yr}</span>
                      <span className="rounded-full border px-2.5 py-0.5 font-mono text-[8px] tracking-[0.2em]" style={{ color: wp.color, borderColor: `${wp.color}44`, background: `${wp.color}12` }}>{wp.phase}</span>
                    </div>
                    <h4 className="f-head text-[14px] font-bold text-white">{wp.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-[#6f8aa8]">{wp.desc}</p>
                    <div className="mt-2 font-mono text-[8px] tracking-[0.18em]" style={{ color: wp.color }}>{wp.sd} · {wp.coords}</div>
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

/* ============ CERTIFICATIONS ============ */
export function Certifications() {
  const [q, setQ] = useState("");
  const shown = certifications.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <section id="certifications" className="relative py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionHead code="DECK 05 · STARFLEET ACADEMY" title="82+ academy" accent="certifications"
          sub="Nine specialized modules mastered — Starfleet Academy endorsed." />
        <div className="relative mb-8 max-w-md">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6f8aa8]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Scan academy records…"
            className="hud-panel w-full rounded-full py-3 pl-11 pr-4 font-mono text-xs text-white outline-none placeholder:text-[#6f8aa8]" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {shown.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              onMouseEnter={() => warp.click()}
              className="hud-panel rounded-2xl p-4 text-center transition-colors hover:border-[rgba(78,240,255,0.4)]">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${c.color}1c`, color: c.color }}>
                <i className={`${c.icon} text-base`} />
              </div>
              <div className="f-head text-2xl font-black" style={{ color: c.color }}>{c.count}</div>
              <div className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-[#6f8aa8]">{c.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ HAILING FREQUENCIES (CONTACT) ============ */
export function HailingFrequencies() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(captain.email); } catch { /* unavailable */ }
    setCopied(true);
    warp.hail();
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section id="hailing" className="relative py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionHead code="DECK 06 · HAILING FREQUENCIES" title="Open a" accent="hailing frequency"
          sub="Channels open for Senior Android & edge-AI missions. All hails answered within one standard orbit." />
        <div className="hud-deep hud-brackets relative overflow-hidden rounded-[2.5rem] p-7 md:p-10">
          <span className="hb" />
          <div className="scan-band" />
          <div className="lcars-bar" />
          <div className="relative grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="f-head text-2xl font-extrabold leading-tight text-white md:text-3xl">
                Transmit on <span className="warp-text">subspace.</span>
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#6f8aa8]">
                Whether a fleet action or a single-ship mission, the chief engineer answers personally.
              </p>
              <div className="mt-6 space-y-3">
                <a href={`mailto:${captain.email}`} className="hud-panel flex items-center gap-3.5 rounded-2xl p-4 hover:border-[rgba(78,240,255,0.4)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(78,240,255,0.14)] text-[#4ef0ff]"><Mail size={16} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[8px] tracking-[0.22em] text-[#6f8aa8]">SUBSPACE CHANNEL</span>
                    <span className="block truncate font-mono text-xs text-white">{captain.email}</span>
                  </span>
                  <button onClick={(ev) => { ev.preventDefault(); copy(); }} className="hud-panel flex h-8 w-8 items-center justify-center rounded-lg text-[#6f8aa8] hover:text-white" aria-label="Copy">
                    {copied ? <Check size={14} className="text-[#5cff9d]" /> : <Copy size={14} />}
                  </button>
                </a>
                <a href={`tel:${captain.phone.replace(/\s/g, "")}`} className="hud-panel flex items-center gap-3.5 rounded-2xl p-4 hover:border-[rgba(183,123,255,0.4)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(183,123,255,0.14)] text-[#b77bff]"><Phone size={16} /></span>
                  <span>
                    <span className="block font-mono text-[8px] tracking-[0.22em] text-[#6f8aa8]">AUDIO CHANNEL</span>
                    <span className="block font-mono text-xs text-white">{captain.phone}</span>
                  </span>
                </a>
                <div className="hud-panel flex items-center gap-3.5 rounded-2xl p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(92,255,157,0.12)] text-[#5cff9d]"><Satellite size={16} /></span>
                  <span className="text-sm text-white">{captain.location}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-4 text-center font-mono text-[9px] tracking-[0.28em] text-[#6f8aa8]">— RELAY STATIONS —</div>
              <div className="grid grid-cols-2 gap-2.5">
                {captain.socials.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="hud-panel flex items-center gap-3 rounded-2xl p-3.5 transition-all hover:-translate-y-0.5 hover:border-[rgba(78,240,255,0.4)]">
                    <i className={`${s.icon} text-[#4ef0ff]`} />
                    <span className="font-mono text-[10px] text-white">{s.name}</span>
                  </a>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-[rgba(78,240,255,0.16)] bg-black/25 p-5 text-center">
                <Orbit size={18} className="mx-auto mb-2 text-[#4ef0ff]/70" style={{ animation: "radar-sweep 6s linear infinite" }} />
                <p className="text-lg italic text-white">"{captain.philosophy}"</p>
                <div className="mt-2 font-mono text-[8px] tracking-[0.28em] text-[#6f8aa8]">LOGGED ABOARD USS KOTLIN</div>
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
    <footer className="relative border-t border-[rgba(78,240,255,0.12)] bg-[#02030af2]">
      <div className="lcars-bar" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 pb-6 pt-12 md:flex-row md:px-8">
        <span className="f-head font-black tracking-[0.18em] text-white">USS <span className="warp-text">KOTLIN</span></span>
        <div className="flex flex-wrap justify-center gap-5">
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`} className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6f8aa8] hover:text-[#4ef0ff]">{n.label}</a>)}
        </div>
      </div>
      <div className="pointer-events-none select-none overflow-hidden py-4 text-center leading-none">
        <span className="f-head text-[clamp(3rem,15vw,11rem)] font-black text-transparent" style={{ WebkitTextStroke: "1px rgba(78,240,255,0.12)" }}>ENGAGE</span>
      </div>
      <div className="pb-8 text-center font-mono text-[9px] tracking-[0.2em] text-[#6f8aa8]">
        © STARDATE 78234.5 · CHIEF ENGINEER {captain.name.toUpperCase()} · {captain.ship} · {captain.registry}
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
    <motion.button aria-label="Return to bridge"
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14, pointerEvents: show ? "auto" : "none" }}
      onClick={() => { warp.hail(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      className="hud-panel fixed bottom-6 left-6 z-[70] flex h-11 w-11 items-center justify-center rounded-full text-[#4ef0ff]">
      <ChevronUp size={18} />
    </motion.button>
  );
}
