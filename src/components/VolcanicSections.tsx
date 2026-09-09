import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useInView, useTransform } from "framer-motion";
import {
  Menu, X, ArrowRight, Mail, Phone, MapPin, Copy, Check,
  Download, Volume2, VolumeX, ChevronUp, Flame,
  Activity, Search, Star, ArrowUpRight, Thermometer
} from "lucide-react";
import { volcano } from "../volcanicAudio";
import {
  profile, volcanicCores, heatZones, eruptions, certWings,
  tapeItems, type VolcanicCore
} from "../volcanicData";

/* ========== PRIMITIVES ========== */

export function TypingMagma({ phrases, className = "" }: { phrases: string[]; className?: string }) {
  const [txt, setTxt] = useState("");
  const [pi, setPi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const full = phrases[pi % phrases.length];
    let d = del ? 26 : 62;
    if (!del && txt === full) d = 1700;
    if (del && txt === "") d = 240;
    const id = setTimeout(() => {
      if (!del && txt === full) { setDel(true); return; }
      if (del && txt === "") { setDel(false); setPi((p) => (p + 1) % phrases.length); return; }
      setTxt(full.slice(0, txt.length + (del ? -1 : 1)));
    }, d);
    return () => clearTimeout(id);
  }, [txt, del, pi, phrases]);
  return <span className={`caret-v ${className}`}>{txt || " "}</span>;
}

export function CountUpMagma({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
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
  return <span ref={ref} className={className}>{v}{suffix}</span>;
}

export function TapeMarquee() {
  const row = [...tapeItems, ...tapeItems];
  return (
    <div className="relative overflow-hidden border-y border-[rgba(255,107,26,0.18)] bg-[rgba(10,10,8,0.7)] py-3 select-none">
      <style>{`@keyframes magma-marquee{to{transform:translateX(-50%)}}`}</style>
      <div className="flex w-max" style={{ animation: "magma-marquee 36s linear infinite" }}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 f-mono text-[11px] tracking-[0.3em] text-[#a89b8c] whitespace-nowrap">
            <span>{t}</span><span className="text-[#ff6b1a]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SeismicBar() {
  return (
    <div className="overflow-hidden py-2 bg-[rgba(255,107,26,0.06)]">
      <div className="flex items-center gap-3 px-6 max-w-7xl mx-auto">
        <Activity size={14} className="text-[#ff6b1a] animate-pulse shrink-0" />
        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full w-full animate-lava-flow rounded-full" style={{ background: "linear-gradient(90deg,#ff6b1a,#ffd166,#ef4444,#ff6b1a)" }} />
        </div>
        <span className="f-mono text-[9px] tracking-widest text-[#a89b8c] shrink-0">SEISMIC ACTIVE</span>
      </div>
    </div>
  );
}

/* ========== NAVIGATION ========== */
const NAV = [
  { id: "caldera", label: "Caldera" },
  { id: "heat-zones", label: "Heat Zones" },
  { id: "volcanic-cores", label: "Volcanic Cores" },
  { id: "eruption-timeline", label: "Timeline" },
  { id: "thermal-vault", label: "Thermal Vault" },
  { id: "signal-vent", label: "Signal" },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(!volcano.enabled);

  useEffect(() => {
    const fn = () => {
      let cur = "hero";
      for (const n of NAV) {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top <= 200) cur = n.id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}
        className="fixed top-0 inset-x-0 z-[70]">
        <div className="mx-auto mt-3 max-w-6xl px-3">
          <div className="volc-glass rounded-full pl-5 pr-2 py-2 flex items-center justify-between border border-[rgba(255,107,26,0.3)] shadow-2xl">
            <a href="#hero" className="flex items-center gap-3">
              <span className="relative w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ff6b1a] to-[#ef4444] shadow-lg animate-vent-glow">
                <Flame size={16} className="text-white" />
              </span>
              <span className="leading-tight">
                <span className="block f-display font-bold text-[13px] tracking-wider text-[#fef3e2]">MKA<span className="magma-text">·VOLCANIC</span></span>
                <span className="block f-mono text-[9px] tracking-[0.3em] text-[#a89b8c]">SENIOR ANDROID</span>
              </span>
            </a>
            <nav className="hidden lg:flex items-center gap-6">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => volcano.crackle()}
                  className={`navlink f-mono text-[11px] tracking-[0.18em] uppercase transition-colors ${active === n.id ? "text-[#ff6b1a] active font-bold" : "text-[#a89b8c] hover:text-white"}`}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={() => { const on = volcano.toggle(); setMuted(!on); }}
                aria-label="Toggle volcanic audio"
                className={`w-9 h-9 rounded-full volc-glass flex items-center justify-center transition-colors ${muted ? "text-[#a89b8c]" : "text-[#ff6b1a] border-[#ff6b1a]/50"}`}>
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
              </button>
              <span className="hidden md:flex items-center gap-2 f-mono text-[10px] tracking-widest text-[#ffd166] border border-[rgba(255,209,102,0.3)] rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd166] animate-blink-soft" /> TECTONIC LOCK
              </span>
              <a href="#signal-vent" className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 f-mono text-[11px] tracking-[0.15em] font-bold text-[#050504] shadow-lg hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(120deg,#ffd166,#ff6b1a)" }}>
                SIGNAL <ArrowRight size={13} />
              </a>
              <button onClick={() => setOpen(true)} className="lg:hidden w-10 h-10 rounded-full volc-glass flex items-center justify-center text-[#ff6b1a]" aria-label="Menu"><Menu size={17} /></button>
            </div>
          </div>
          <motion.div style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg,#ef4444,#ff6b1a,#ffd166)" }} className="h-[2px] mt-2 rounded-full origin-left" />
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] lg:hidden bg-[rgba(5,5,4,0.96)] backdrop-blur-2xl">
            <div className="flex items-center justify-between px-6 h-20">
              <span className="f-display font-bold tracking-widest text-xl magma-text">MKA·VOLCANIC</span>
              <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full volc-glass flex items-center justify-center text-white" aria-label="Close"><X size={17} /></button>
            </div>
            <nav className="px-8 flex flex-col gap-1">
              {NAV.map((n, i) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}
                  className="py-4 border-b border-[rgba(255,107,26,0.12)] f-display text-xl flex justify-between items-center text-[#fef3e2]">
                  {n.label}<span className="f-mono text-xs text-[#ff6b1a]">0{i + 1}</span>
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ========== HERO ========== */
export function Hero() {
  const { scrollY } = useScroll();
  const yTxt = useTransform(scrollY, [0, 700], [0, 80]);
  const yCore = useTransform(scrollY, [0, 700], [0, -100]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Caldera decorative rings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full border border-[rgba(255,107,26,0.12)] animate-caldera-spin" />
        <div className="absolute top-[6%] left-[16%] w-[30vw] h-[30vw] rounded-full border border-dashed border-[rgba(255,209,102,0.1)] animate-caldera-rev" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        <motion.div style={{ y: yTxt }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 volc-glass rounded-full pl-3 pr-4 py-1.5 mb-6 border border-[rgba(255,107,26,0.35)]">
            <span className="f-mono text-[10px] tracking-[0.2em] px-2.5 py-1 rounded-full text-[#050504] font-bold" style={{ background: "linear-gradient(120deg,#ffd166,#ff6b1a)" }}>🔥 VOLCANIC CORE</span>
            <span className="f-mono text-[10px] tracking-[0.2em] text-[#ff9a44]">SENIOR ANDROID · ON-DEVICE AI</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="f-display font-bold leading-[0.94] tracking-tight text-[clamp(2.8rem,7vw,5.4rem)]">
            Moe Kyaw<br /><span className="magma-text glow-magma">Aung</span>
            <span className="f-serif italic font-normal text-[clamp(1.3rem,3vw,2rem)] text-[#a89b8c] block mt-3">
              forging code at volcanic pressure.
            </span>
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5">
            <TypingMagma phrases={profile.roles} className="f-mono text-base md:text-lg text-[#ffd166]" />
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-5 max-w-xl text-[#a89b8c] leading-relaxed">
            {profile.tagline} Currently forging <span className="text-white font-medium">{profile.building}</span>. {profile.location}.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#volcanic-cores" onClick={() => volcano.erupt()} className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 f-mono text-xs tracking-wider font-bold text-[#050504] shadow-xl hover:scale-105 active:scale-95 transition-transform" style={{ background: "linear-gradient(120deg,#ffd166,#ff6b1a)", boxShadow: "0 10px 35px rgba(255,107,26,0.35)" }}>
              EXPLORE VOLCANIC CORES <Flame size={15} />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 volc-glass f-mono text-xs tracking-wider text-[#fef3e2] hover:border-[#ff6b1a] transition-colors">
              <Download size={15} /> GITHUB ARCHIVE
            </a>
          </motion.div>

          <div className="grid grid-cols-4 gap-3 mt-10 max-w-xl">
            {profile.stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 + i * 0.08 }}
                className="volc-glass rounded-2xl px-2 py-3.5 text-center border border-[rgba(255,107,26,0.2)] animate-vent-glow">
                <div className="f-display font-bold text-xl md:text-2xl magma-text tabular-nums"><CountUpMagma to={s.value} suffix={s.suffix} /></div>
                <div className="f-mono text-[9px] tracking-[0.16em] text-[#fef3e2] mt-1 uppercase">{s.label}</div>
                <div className="f-mono text-[8px] text-[#a89b8c]">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Caldera Orb */}
        <motion.div style={{ y: yCore }} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.9 }} className="relative flex justify-center">
          <div className="relative">
            <CalderaOrb />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 volc-deep rounded-2xl px-5 py-3 flex items-center gap-3 whitespace-nowrap">
              <Thermometer size={16} className="text-[#ff6b1a] animate-magma-pulse" />
              <span className="f-mono text-[11px] tracking-[0.2em] text-[#fef3e2]">ERUPTION PHASE: <span className="text-[#ffd166] font-bold">2026 · ACTIVE</span></span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* Caldera Orb — SVG animated concentric magma rings */
function CalderaOrb() {
  const [sec, setSec] = useState(new Date().getSeconds());
  useEffect(() => { const id = setInterval(() => setSec(new Date().getSeconds()), 1000); return () => clearInterval(id); }, []);
  const ticks = Array.from({ length: 60 });
  return (
    <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px]">
      <div className="absolute inset-[-15%] rounded-full opacity-40" style={{ background: "radial-gradient(circle,rgba(255,107,26,0.2),transparent 60%)" }} />
      <svg viewBox="0 0 360 360" className="w-full h-full">
        <circle cx="180" cy="180" r="176" fill="rgba(10,10,8,0.6)" stroke="rgba(255,107,26,0.4)" strokeWidth="2" />
        <circle cx="180" cy="180" r="160" fill="none" stroke="rgba(255,107,26,0.15)" strokeWidth="1" />
        {ticks.map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const big = i % 5 === 0;
          return <line key={i} x1={180 + Math.cos(a) * (big ? 138 : 150)} y1={180 + Math.sin(a) * (big ? 138 : 150)} x2={180 + Math.cos(a) * 158} y2={180 + Math.sin(a) * 158} stroke={big ? "rgba(255,154,68,0.8)" : "rgba(255,107,26,0.3)"} strokeWidth={big ? 2.2 : 1} strokeLinecap="round" />;
        })}
        {[12, 3, 6, 9].map((n, i) => {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
          return <text key={n} x={180 + Math.cos(a) * 120} y={180 + Math.sin(a) * 120 + 5} textAnchor="middle" fontSize="14" fill="rgba(255,154,68,0.85)" style={{ fontFamily: "Space Grotesk,sans-serif" }}>{n}</text>;
        })}
        <g style={{ transformOrigin: "180px 180px", animation: "caldera-spin 28s linear infinite" }}>
          <circle cx="180" cy="180" r="102" fill="none" stroke="rgba(255,107,26,0.35)" strokeWidth="1.4" strokeDasharray="3 8" />
          <circle cx="282" cy="180" r="3.5" fill="#ff6b1a" style={{ filter: "drop-shadow(0 0 6px #ff6b1a)" }} />
        </g>
        <g style={{ transformOrigin: "180px 180px", animation: "caldera-rev 12s linear infinite" }}>
          <circle cx="180" cy="180" r="78" fill="none" stroke="rgba(255,209,102,0.4)" strokeWidth="1.2" strokeDasharray="10 6" />
          <circle cx="180" cy="102" r="3" fill="#ffd166" style={{ filter: "drop-shadow(0 0 6px #ffd166)" }} />
        </g>
        <g style={{ transformOrigin: "180px 180px", transform: `rotate(${sec * 6}deg)`, transition: "transform 0.9s cubic-bezier(0.2,0.7,0.3,1)" }}>
          <line x1="180" y1="200" x2="180" y2="68" stroke="rgba(255,154,68,0.9)" strokeWidth="2" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #ff9a44)" }} />
        </g>
        <circle cx="180" cy="180" r="15" fill="#050504" stroke="rgba(255,107,26,0.6)" strokeWidth="1.6" />
        <circle cx="180" cy="180" r="5" fill="#ff6b1a" />
      </svg>
      <div className="absolute -left-2 top-10 volc-glass rounded-lg px-2.5 py-1.5 f-mono text-[9px] tracking-widest text-[#ffd166] animate-floaty">MAGMA LOCK</div>
      <div className="absolute -right-4 bottom-16 volc-glass rounded-lg px-2.5 py-1.5 f-mono text-[9px] tracking-widest text-[#ff6b1a] animate-floaty" style={{ animationDelay: "1.4s" }}>ERR ±0.00s</div>
    </div>
  );
}

/* ========== ABOUT / CALDERA ========== */
export function Caldera() {
  const code = [
    { p: "$ thermal-scan --caldera mka", c: "text-[#ff6b1a]" },
    { p: "core: senior android developer · volcanic systems architect", c: "text-[#fef3e2]" },
    { p: "mantle → kotlin 2.0 · compose · mvvm · clean arch", c: "text-[#a89b8c]" },
    { p: "magma → firebase · rest apis · python", c: "text-[#a89b8c]" },
    { p: "eruption → ethical hacking · on-device ml · tflite int8", c: "text-[#a89b8c]" },
    { p: "$ cat caldera.philosophy", c: "text-[#ff6b1a]" },
    { p: `"${profile.philosophy}"`, c: "text-[#ffd166]" },
  ];
  return (
    <section id="caldera" className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="mb-14 max-w-3xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#ff6b1a] uppercase mb-3 flex items-center gap-2"><span className="w-8 h-px bg-gradient-to-r from-[#ff6b1a] to-transparent" />01 · CALDERA</div>
          <h2 className="f-display font-bold text-3xl md:text-5xl leading-tight text-[#fef3e2]">The <span className="magma-text f-cinzel">eruption</span> source</h2>
          <p className="mt-4 text-[#a89b8c] text-base md:text-lg">{profile.philosophy} — {profile.tagline}</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="volc-glass rounded-3xl overflow-hidden relative min-h-[420px] border border-[rgba(255,107,26,0.25)]">
            <img src={profile.portrait2} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" loading="lazy" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 15%,rgba(5,5,4,0.95))" }} />
            <div className="relative p-7 md:p-9 flex flex-col justify-end min-h-[420px]">
              <div className="flex items-center gap-2 f-mono text-[10px] tracking-[0.3em] text-[#ff6b1a] mb-3"><Flame size={13} /> VOLCANIC SPECIMEN · MKA-2026</div>
              <h3 className="f-display text-2xl md:text-3xl leading-tight text-[#fef3e2]">Full-spectrum engineer — from <span className="text-[#ff6b1a]">frame-pacing</span> to <span className="text-[#ffd166]">pipelines</span> to <span className="text-[#ef4444]">privacy</span>.</h3>
              <p className="mt-4 text-[#a89b8c] leading-relaxed">82+ verified credentials across 9 geothermal wings, but the definitive metric: high-availability mobile platforms that hold under enterprise load.</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {["Burmese 🇲🇲", "English 🌐", "Kotlin ☕"].map((l) => <span key={l} className="f-mono text-[10px] px-3 py-1.5 rounded-full volc-glass text-[#ff9a44] border border-[rgba(255,107,26,0.25)]">🔥 {l}</span>)}
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="rounded-3xl overflow-hidden border border-[rgba(255,107,26,0.2)] h-full bg-[rgba(8,8,6,0.9)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,107,26,0.14)] bg-white/[0.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" /><span className="w-2.5 h-2.5 rounded-full bg-[#ffd166]/80" /><span className="w-2.5 h-2.5 rounded-full bg-[#ff6b1a]/80" />
              <span className="ml-2 f-mono text-[10px] text-[#a89b8c] tracking-widest">mka@volcanic ~/caldera-scan</span>
            </div>
            <div className="p-6 f-mono text-[12.5px] leading-8">
              {code.map((l, i) => <div key={i} className={l.c}>{l.p}</div>)}
              <span className="text-[#ff6b1a] animate-blink-soft">▍</span>
            </div>
            <div className="px-6 pb-6 grid grid-cols-3 gap-2">
              {[{ k: "STRATA", v: "Clean Arch" }, { k: "MAGMA.AI", v: "TFLite 32ms" }, { k: "TAPS", v: "82+" }].map((f) => (
                <div key={f.k} className="rounded-2xl volc-glass p-3 text-center border border-white/5">
                  <div className="f-mono text-[9px] tracking-[0.2em] text-[#a89b8c]">{f.k}</div>
                  <div className="text-[12px] font-medium mt-1 text-[#fef3e2]">{f.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ========== HEAT ZONES (SKILLS) ========== */
export function HeatZones() {
  return (
    <section id="heat-zones" className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="mb-14 max-w-3xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#ff6b1a] uppercase mb-3 flex items-center gap-2"><span className="w-8 h-px bg-gradient-to-r from-[#ff6b1a] to-transparent" />02 · HEAT ZONES</div>
          <h2 className="f-display font-bold text-3xl md:text-5xl leading-tight text-[#fef3e2]">Geothermal <span className="magma-text f-cinzel">mantle</span></h2>
          <p className="mt-4 text-[#a89b8c] text-base md:text-lg">Six tectonic plates maintaining the structural integrity of production systems.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {heatZones.map((z, i) => (
            <motion.div key={z.name} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.08 }}
              onMouseEnter={() => volcano.ventHiss()}
              className="volc-glass rounded-2xl p-5 relative overflow-hidden group hover:border-[#ff6b1a]/50 transition-all">
              <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-15 blur-3xl group-hover:opacity-35 transition-opacity" style={{ background: z.color }} />
              <div className="flex items-center justify-between mb-2">
                <span className="f-mono text-[9px] tracking-[0.25em]" style={{ color: z.color }}>{z.zoneId} · {z.mantleDepth}</span>
                <span className="f-display text-xl tabular-nums" style={{ color: z.color }}>{z.coreTemp}°C</span>
              </div>
              <h4 className="f-display font-bold text-[15px] text-[#fef3e2]">{z.name}</h4>
              <p className="f-mono text-[10px] text-[#a89b8c] mt-0.5 mb-3">{z.magmaComposition}</p>
              <div className="h-2 rounded-full bg-white/5 relative overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${(z.coreTemp / 5000) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.3, delay: 0.2 }}
                  className="h-full rounded-full relative" style={{ background: `linear-gradient(90deg,${z.color}55,${z.color})`, boxShadow: `0 0 12px ${z.color}` }}>
                  <span className="absolute right-0 -top-1 w-3 h-3 rounded-full bg-white" style={{ boxShadow: `0 0 12px ${z.color}` }} />
                </motion.div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {z.skills.map((s) => <span key={s} className="f-mono text-[9px] px-2 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[#a89b8c]">{s}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== VOLCANIC CORES (PROJECTS) ========== */
export function VolcanicCores() {
  const [sel, setSel] = useState<VolcanicCore | null>(null);
  return (
    <section id="volcanic-cores" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-14 max-w-3xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#ff6b1a] uppercase mb-3 flex items-center gap-2"><span className="w-8 h-px bg-gradient-to-r from-[#ff6b1a] to-transparent" />03 · VOLCANIC CORES</div>
          <h2 className="f-display font-bold text-3xl md:text-5xl leading-tight text-[#fef3e2]">Eruptive <span className="magma-text f-cinzel">cores</span></h2>
          <p className="mt-4 text-[#a89b8c] text-base md:text-lg">Every project is a sealed volcanic core. Breaking the seal triggers an eruptive reveal with magma shockwaves.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {volcanicCores.map((vc, i) => (
            <motion.button key={vc.id} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.06 }}
              onClick={() => { volcano.erupt(); setSel(vc); }}
              className="volc-card volc-glass rounded-3xl overflow-hidden text-left cursor-pointer group">
              <span className="eruption-burst" />
              {vc.img && (
                <div className="relative h-28 overflow-hidden">
                  <img src={vc.img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--obs)] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 f-mono text-[9px] tracking-[0.2em] px-2.5 py-1 rounded-full volc-glass border border-white/10" style={{ color: vc.glowColor }}>{vc.category}</span>
                  {vc.flagship && <span className="absolute top-3 right-3 f-mono text-[9px] px-2 py-0.5 rounded-full text-[#050504] font-bold flex items-center gap-1" style={{ background: "linear-gradient(90deg,#ffd166,#ff6b1a)" }}><Star size={9} /> FLAGSHIP</span>}
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-1 f-mono text-[9px] tracking-widest text-[#a89b8c]">
                  <span>{vc.coreId}</span><span style={{ color: vc.glowColor }}>{vc.tempC}°C</span>
                </div>
                <h3 className="f-display font-bold text-[15px] text-[#fef3e2] group-hover:text-[#ff9a44] transition-colors mb-2">{vc.name}</h3>
                <p className="text-[12.5px] text-[#a89b8c] line-clamp-2 min-h-[38px]">{vc.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">{vc.tags.slice(0, 3).map((t) => <span key={t} className="f-mono text-[9px] px-2 py-1 rounded-md border border-white/10 text-[#ff9a44]">{t}</span>)}</div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(255,107,26,0.14)]">
                  <span className="f-mono text-[9px] text-[#a89b8c]">{vc.year} · {vc.ejectionType}</span>
                  <span className="f-mono text-[10px] text-[#ff9a44] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">ERUPT <ArrowUpRight size={11} /></span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      {/* Modal with eruptive reveal */}
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center p-4" style={{ background: "rgba(5,5,4,0.88)", backdropFilter: "blur(14px)" }} onClick={() => setSel(null)}>
            <div className="absolute w-[420px] h-[420px] pointer-events-none">
              {[0, 0.35, 0.7].map((d, i) => (
                <span key={i} className="absolute inset-0 rounded-full border-2 pointer-events-none" style={{ borderColor: i === 2 ? "rgba(77,227,255,0.5)" : "rgba(255,107,26,0.6)", animation: "eruption-burst 1.4s ease-out infinite", animationDelay: `${d}s` }} />
              ))}
            </div>
            <motion.div initial={{ scale: 1.08, opacity: 0, filter: "brightness(2) blur(16px)" }} animate={{ scale: 1, opacity: 1, filter: "brightness(1) blur(0px)" }} exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg volc-deep rounded-[2rem] overflow-hidden max-h-[88vh] overflow-y-auto hide-scroll border border-[rgba(255,107,26,0.4)] shadow-2xl">
              {sel.img && <div className="relative h-40"><img src={sel.img} alt="" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent,rgba(5,5,4,0.9))" }} /></div>}
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: `${sel.glowColor}20`, color: sel.glowColor, boxShadow: `0 0 28px ${sel.glowColor}33` }}>
                    <Flame size={26} />
                  </span>
                  <button onClick={() => { volcano.crackle(); setSel(null); }} className="w-9 h-9 rounded-full volc-glass flex items-center justify-center text-[#a89b8c] hover:text-white" aria-label="Close"><X size={15} /></button>
                </div>
                <div className="f-mono text-[9px] tracking-[0.3em] text-[#a89b8c] mb-1">{sel.coreId} · {sel.year} · {sel.ejectionType}</div>
                <h3 className="f-display text-2xl md:text-3xl text-[#fef3e2]">{sel.name}</h3>
                <p className="text-[14px] text-[#a89b8c] leading-relaxed mt-3">{sel.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-4">{sel.tags.map((t) => <span key={t} className="f-mono text-[10px] px-2.5 py-1 rounded-lg" style={{ border: `1px solid ${sel.glowColor}44`, color: sel.glowColor, background: `${sel.glowColor}0d` }}>{t}</span>)}</div>
                <div className="grid grid-cols-3 gap-2 mt-5 f-mono text-center text-[10px]">
                  {[["TEMPERATURE", `${sel.tempC}°C`], ["PRESSURE", `${sel.pressurePsi} PSI`], ["STATE", "ERUPTABLE"]].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-black/30 border border-white/10 py-2.5">
                      <div className="text-[#fef3e2] text-sm font-bold">{v}</div>
                      <div className="text-[#a89b8c] tracking-[0.2em] text-[9px]">{k}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2.5 mt-6">
                  <a href={sel.href} target="_blank" rel="noopener noreferrer" className="flex-1 text-center rounded-full py-3 f-mono text-[11px] tracking-[0.2em] font-bold text-[#050504] hover:scale-[1.02] transition-transform" style={{ background: `linear-gradient(120deg,${sel.glowColor},#ffd166)` }}>🔥 RETRIEVE SOURCE</a>
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full volc-glass f-mono text-[11px] tracking-[0.2em] text-[#fef3e2] hover:border-[#ff6b1a]">PROFILE</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ========== ERUPTION TIMELINE ========== */
export function EruptionTimeline() {
  return (
    <section id="eruption-timeline" className="relative py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="mb-14 max-w-2xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#ff6b1a] uppercase mb-3 flex items-center gap-2"><span className="w-8 h-px bg-gradient-to-r from-[#ff6b1a] to-transparent" />04 · ERUPTION TIMELINE</div>
          <h2 className="f-display font-bold text-3xl md:text-5xl leading-tight text-[#fef3e2]">Geological <span className="magma-text f-cinzel">strata</span></h2>
        </div>
        <div className="relative">
          <div className="absolute left-5 md:left-1/2 top-4 bottom-4 w-px md:-translate-x-1/2" style={{ background: "linear-gradient(180deg,#ef4444,#ff6b1a,#ffd166,#38bdf8)" }} />
          {eruptions.map((e, i) => {
            const left = i % 2 === 0;
            return (
              <div key={e.yr} className="relative md:grid md:grid-cols-2 md:gap-x-16 md:py-6 pl-14 md:pl-0 mb-8 md:mb-0">
                <span className="absolute top-6 md:top-1/2 md:-translate-y-1/2 left-5 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full border-2" style={{ background: "#050504", borderColor: e.color, boxShadow: `0 0 16px ${e.color}` }} />
                <div className={left ? "md:col-start-1 md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}>
                  <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="volc-glass rounded-2xl p-5 inline-block w-full text-left hover:border-[#ff6b1a]/40 transition-colors">
                    <div className={`flex items-center gap-3 mb-2 ${left ? "md:flex-row-reverse" : ""}`}>
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${e.color}1a`, color: e.color }}><i className={`${e.icon} text-sm`} /></span>
                      <div><div className="f-display font-bold text-xl text-[#fef3e2]">{e.yr}</div><div className="f-mono text-[9px] tracking-[0.3em]" style={{ color: e.color }}>{e.phase}</div></div>
                    </div>
                    <h4 className="f-display font-bold text-[#fef3e2]">{e.title}</h4>
                    <p className="text-xs text-[#a89b8c] mt-1">{e.desc}</p>
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

/* ========== THERMAL VAULT ========== */
export function ThermalVault() {
  const [q, setQ] = useState("");
  const shown = certWings.filter((w) => w.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <section id="thermal-vault" className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="mb-12 max-w-3xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#ff6b1a] uppercase mb-3 flex items-center gap-2"><span className="w-8 h-px bg-gradient-to-r from-[#ff6b1a] to-transparent" />05 · THERMAL VAULT</div>
          <h2 className="f-display font-bold text-3xl md:text-5xl leading-tight text-[#fef3e2]">82+ verified <span className="magma-text f-cinzel">taps</span></h2>
          <p className="mt-4 text-[#a89b8c]">Structured credentials across 9 geothermal wings.</p>
        </div>
        <div className="max-w-md mb-8 relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89b8c]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter wings…" className="w-full volc-glass rounded-full pl-11 pr-4 py-3 f-mono text-xs text-white placeholder:text-[#a89b8c]/60 focus:outline-none focus:border-[#ff6b1a]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {shown.map((w, i) => (
            <motion.div key={w.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              onMouseEnter={() => volcano.ventHiss()}
              className="volc-glass rounded-2xl p-4 text-center hover:border-[#ff6b1a]/40 transition-all group">
              <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2 shadow-lg" style={{ background: `${w.color}20`, color: w.color }}><i className={`${w.icon} text-base`} /></div>
              <div className="f-display font-bold text-2xl text-[#fef3e2]">{w.count}</div>
              <div className="f-mono text-[9px] tracking-wider text-[#a89b8c] uppercase mt-0.5">{w.name}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center f-mono text-[11px] text-[#a89b8c]">PROGRAMMING HUB · GOOGLE DEVELOPERS LAUNCHPAD · 82+ VERIFIED TECHNICAL CERTIFICATIONS</div>
      </div>
    </section>
  );
}

/* ========== SIGNAL VENT (CONTACT) ========== */
export function SignalVent() {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(profile.email); } catch {} setCopied(true); volcano.thermalPulse(); setTimeout(() => setCopied(false), 1500); };
  return (
    <section id="signal-vent" className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#ff6b1a] uppercase mb-3 flex items-center gap-2"><span className="w-8 h-px bg-gradient-to-r from-[#ff6b1a] to-transparent" />06 · SIGNAL VENT</div>
          <h2 className="f-display font-bold text-3xl md:text-5xl leading-tight text-[#fef3e2]">Open a <span className="magma-text f-cinzel">thermal vent</span></h2>
          <p className="mt-4 text-[#a89b8c]">Available for Senior Android Engineering and on-device AI roles worldwide.</p>
        </div>
        <div className="volc-deep rounded-[2.5rem] p-7 md:p-10 relative overflow-hidden border border-[rgba(255,107,26,0.4)] shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="f-serif italic text-3xl md:text-[2.6rem] leading-[1.1] text-[#fef3e2]">Let's forge <span className="magma-text not-italic f-display">something hot.</span></p>
              <p className="text-[#a89b8c] mt-4 max-w-sm">Every transmission reaches me within one eruption cycle.</p>
              <div className="mt-6 space-y-3">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-3.5 p-4 rounded-2xl volc-glass hover:border-[#ff6b1a] transition-colors group">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(255,107,26,0.14)] text-[#ff6b1a]"><Mail size={16} /></span>
                  <span className="min-w-0 flex-1"><span className="block f-mono text-[9px] tracking-[0.25em] text-[#a89b8c]">THERMAL CHANNEL</span><span className="block text-sm truncate text-[#fef3e2] font-mono">{profile.email}</span></span>
                  <button onClick={(e) => { e.preventDefault(); copy(); }} className="w-8 h-8 rounded-lg volc-glass flex items-center justify-center text-[#a89b8c] hover:text-white">{copied ? <Check size={14} className="text-[#00e676]" /> : <Copy size={14} />}</button>
                </a>
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="flex items-center gap-3.5 p-4 rounded-2xl volc-glass hover:border-[#ffd166] transition-colors">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(255,209,102,0.14)] text-[#ffd166]"><Phone size={16} /></span>
                  <span><span className="block f-mono text-[9px] tracking-[0.25em] text-[#a89b8c]">VOICE CHANNEL</span><span className="block text-sm text-[#fef3e2] font-mono">{profile.phone}</span></span>
                </a>
                <div className="flex items-center gap-3.5 p-4 rounded-2xl volc-glass">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(56,189,248,0.14)] text-[#38bdf8]"><MapPin size={16} /></span>
                  <span className="text-sm text-[#fef3e2]">{profile.location}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="f-mono text-[10px] tracking-[0.3em] text-[#a89b8c] mb-4 text-center">— TECTONIC CHANNELS —</div>
              <div className="grid grid-cols-2 gap-2.5">
                {profile.socials.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="volc-glass rounded-2xl p-3.5 flex items-center gap-3 hover:border-[#ff6b1a] hover:-translate-y-0.5 transition-all group">
                    <i className={`${s.icon} text-[#ff6b1a] group-hover:scale-110 transition-transform`} />
                    <span className="f-mono text-xs text-[#fef3e2]">{s.name}</span>
                  </a>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-[rgba(255,107,26,0.2)] bg-black/30 p-5 text-center">
                <Flame size={18} className="mx-auto text-[#ff6b1a]/70 mb-2 animate-magma-pulse" />
                <p className="f-serif italic text-lg text-[#fef3e2]">"{profile.philosophy}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== FOOTER ========== */
export function Footer() {
  return (
    <footer className="relative border-t border-[rgba(255,107,26,0.16)] bg-[rgba(5,5,4,0.95)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 pb-6 flex flex-col md:flex-row items-center justify-between gap-5">
        <span className="f-display font-bold tracking-[0.25em] text-[#fef3e2]">MKA<span className="magma-text">·VOLCANIC</span></span>
        <div className="flex flex-wrap justify-center gap-5">
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`} className="f-mono text-[10px] tracking-[0.2em] text-[#a89b8c] hover:text-[#ff6b1a] uppercase transition-colors">{n.label}</a>)}
        </div>
      </div>
      <div className="text-center select-none pointer-events-none leading-none overflow-hidden py-4">
        <span className="f-display font-black text-[clamp(3rem,14vw,11rem)] text-transparent" style={{ WebkitTextStroke: "1px rgba(255,107,26,0.14)" }}>ERUPTED</span>
      </div>
      <div className="text-center pb-8 f-mono text-[10px] tracking-[0.2em] text-[#a89b8c]">© 2026 {profile.name} · SENIOR ANDROID & AI ARCHITECT · ALL CORES SECURED</div>
    </footer>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const fn = () => setShow(window.scrollY > 700); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <motion.button aria-label="Back to top" animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14, pointerEvents: show ? "auto" : "none" }}
      onClick={() => { volcano.thermalPulse(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      className="fixed bottom-6 left-6 z-[70] w-11 h-11 rounded-full volc-glass flex items-center justify-center text-[#ff6b1a] shadow-xl border border-[#ff6b1a]/40 animate-vent-glow">
      <ChevronUp size={18} />
    </motion.button>
  );
}