import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useInView } from "framer-motion";
import {
  Menu, X, ArrowRight, Mail, Phone, MapPin, Copy, Check,
  Download, Volume2, VolumeX, ChevronUp, Sparkles, Search
} from "lucide-react";
import { loomAudio } from "../fabricAudio";
import {
  weaverProfile, SKILL_STRANDS, TAPESTRY_TIMELINE,
  CERTIFICATE_WINGS, TAPE_MARQUEE
} from "../fabricData";
import { useRef } from "react";

/* ================= PRIMITIVE HELPERS ================= */

export function TypingThread({ phrases, className = "" }: { phrases: string[]; className?: string }) {
  const [txt, setTxt] = useState("");
  const [pi, setPi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const full = phrases[pi % phrases.length];
    let d = del ? 26 : 64;
    if (!del && txt === full) d = 1800;
    if (del && txt === "") d = 260;

    const id = setTimeout(() => {
      if (!del && txt === full) { setDel(true); return; }
      if (del && txt === "") { setDel(false); setPi((p) => (p + 1) % phrases.length); return; }
      setTxt(full.slice(0, txt.length + (del ? -1 : 1)));
    }, d);
    return () => clearTimeout(id);
  }, [txt, del, pi, phrases]);

  return <span className={`caret-loom ${className}`}>{txt || " "}</span>;
}

export function CountUpLoom({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
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
  const row = [...TAPE_MARQUEE, ...TAPE_MARQUEE];
  return (
    <div className="relative overflow-hidden border-y border-[rgba(179,136,255,0.18)] bg-[rgba(6,8,18,0.7)] py-3 select-none">
      <div className="flex w-max" style={{ animation: "shuttle-travel 32s linear infinite" }}>
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 f-mono text-[11px] tracking-[0.3em] text-[#8c9bbd] whitespace-nowrap">
            <span>{item}</span>
            <span className="text-[#00f0ff]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================= NAVIGATION ================= */
const NAV_ITEMS = [
  { id: "codex", label: "Codex" },
  { id: "skill-loom", label: "Skill Loom" },
  { id: "woven-nodes", label: "Woven Nodes" },
  { id: "tapestry", label: "Tapestry" },
  { id: "spool-vault", label: "Spool Vault" },
  { id: "signal-loom", label: "Signal" },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(!loomAudio.enabled);

  useEffect(() => {
    const fn = () => {
      let cur = "hero";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 200) cur = item.id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 inset-x-0 z-[70]"
      >
        <div className="mx-auto mt-3 max-w-6xl px-3">
          <div className="fabric-panel rounded-full pl-5 pr-2 py-2 flex items-center justify-between border border-[rgba(179,136,255,0.3)] shadow-2xl">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3">
              <span className="relative w-9 h-9 rounded-full flex items-center justify-center bg-[rgba(0,240,255,0.12)] border border-[rgba(0,240,255,0.4)] shadow-md">
                <span className="f-syne font-black text-xs text-[#00f0ff]">M</span>
                <span className="absolute inset-0 rounded-full border border-[rgba(179,136,255,0.5)] animate-ping" />
              </span>
              <span className="leading-tight">
                <span className="block f-syne font-bold text-[13px] tracking-wider text-[#f0f4ff]">
                  MKA<span className="fabric-text-glow font-serif">·LOOM</span>
                </span>
                <span className="block f-mono text-[9px] tracking-[0.25em] text-[#8c9bbd]">
                  DIGITAL FABRIC
                </span>
              </span>
            </a>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => loomAudio.pluckThread(580)}
                  className={`navlink f-mono text-[11px] tracking-[0.18em] uppercase transition-colors ${
                    active === item.id ? "text-[#00f0ff] active font-bold" : "text-[#8c9bbd] hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Loom Audio Toggle */}
              <button
                onClick={() => {
                  const on = loomAudio.toggle();
                  setMuted(!on);
                }}
                aria-label="Toggle Loom Synthesizer Audio"
                title={muted ? "Enable Synthesized Loom Sound" : "Mute Loom Audio"}
                className={`w-9 h-9 rounded-full fabric-panel flex items-center justify-center transition-colors ${
                  muted ? "text-[#8c9bbd]" : "text-[#00f0ff] border-[#00f0ff]/50 shadow-md shadow-cyan-500/20"
                }`}
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
              </button>

              <span className="hidden md:flex items-center gap-2 f-mono text-[10px] tracking-widest text-[#00e676] border border-[rgba(0,230,118,0.3)] rounded-full px-3 py-1.5 bg-[rgba(0,230,118,0.06)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" /> 1600 TPI COHESION
              </span>

              <a
                href="#signal-loom"
                className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 f-mono text-[11px] tracking-[0.15em] font-bold text-[#060812] shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: "linear-gradient(120deg, #00f0ff, #b388ff)" }}
              >
                TRANSMIT <ArrowRight size={13} />
              </a>

              <button
                onClick={() => setOpen(true)}
                className="lg:hidden w-10 h-10 rounded-full fabric-panel flex items-center justify-center text-[#00f0ff]"
                aria-label="Menu"
              >
                <Menu size={17} />
              </button>
            </div>
          </div>

          {/* Running Warp Progress Strand */}
          <motion.div
            style={{
              scaleX: scrollYProgress,
              background: "linear-gradient(90deg, #00f0ff, #b388ff, #ffd740)"
            }}
            className="h-[2px] mt-2 rounded-full origin-left"
          />
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] lg:hidden bg-[rgba(6,8,18,0.96)] backdrop-blur-2xl flex flex-col justify-between p-6"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <span className="f-syne font-bold tracking-widest text-xl text-white">MKA·LOOM</span>
                <button
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-full fabric-panel flex items-center justify-center text-white"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="mt-8 space-y-3">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="py-3 px-4 rounded-2xl border border-white/5 f-syne text-lg flex justify-between items-center text-[#f0f4ff]"
                  >
                    <span>{item.label}</span>
                    <span className="f-mono text-xs text-[#00f0ff]">0{i + 1}</span>
                  </motion.a>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 text-center f-mono text-xs text-[#8c9bbd]">
              INTERLACED BY MOE KYAW AUNG
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= HERO SECTION ================= */
export function Hero() {
  const rolesList = [
    "Senior Android Developer",
    "Digital Loom Architect",
    "On-Device AI Engineer",
    "Clean Architecture Master",
    "Kotlin & Compose Chronomancer"
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
        {/* Left Column: Headline & Weft Introduction */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 fabric-panel rounded-full pl-3 pr-4 py-1.5 mb-6 border border-[rgba(0,240,255,0.3)] shadow-lg"
          >
            <span
              className="f-mono text-[10px] tracking-[0.2em] px-2.5 py-1 rounded-full text-[#060812] font-bold"
              style={{ background: "linear-gradient(120deg, #00f0ff, #b388ff)" }}
            >
              ✦ HYPER-FABRIC WEAVE
            </span>
            <span className="f-mono text-[10px] tracking-[0.2em] text-[#00f0ff]">
              SENIOR ANDROID · ON-DEVICE AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="f-syne font-extrabold leading-[0.94] tracking-tight text-[clamp(2.8rem,7.5vw,5.6rem)]"
          >
            Moe Kyaw<br />
            <span className="fabric-text-glow glow-orchid">Aung</span>
            <span className="f-serif italic font-normal text-[clamp(1.3rem,3.2vw,2.2rem)] text-[#8c9bbd] block mt-3">
              interlacing code, architecture & culture.
            </span>
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5">
            <TypingThread phrases={rolesList} className="f-mono text-base md:text-xl text-[#00f0ff]" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-5 max-w-xl text-[#8c9bbd] leading-relaxed text-sm md:text-base"
          >
            {weaverProfile.tagline} Crafting high-availability mobile platforms with sub-16ms frame pacing, isolated 12-module clean boundaries, and on-device machine intelligence. Currently weaving{" "}
            <span className="text-white font-medium">{weaverProfile.building}</span>. {weaverProfile.location}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="#woven-nodes"
              onClick={() => loomAudio.shuttlePass()}
              className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 f-mono text-xs tracking-wider font-bold text-[#060812] shadow-xl hover:scale-105 active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(120deg, #00f0ff, #b388ff)",
                boxShadow: "0 10px 35px rgba(0, 240, 255, 0.3)"
              }}
            >
              EXPLORE WOVEN NODES <ArrowRight size={15} />
            </a>
            <a
              href={weaverProfile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 fabric-panel f-mono text-xs tracking-wider text-white hover:border-[#00f0ff] transition-colors"
            >
              <Download size={15} /> GITHUB TAPESTRY
            </a>
          </motion.div>

          {/* Tensile Stats Bar */}
          <div className="grid grid-cols-4 gap-3 mt-10 max-w-xl">
            {[
              { label: "SPOOLS", value: 82, suffix: "+", sub: "Certificates" },
              { label: "NODES", value: 16, suffix: "", sub: "App Tapestries" },
              { label: "WORLDS", value: 40, suffix: "+", sub: "GitHub Sites" },
              { label: "CYCLES", value: 3, suffix: "+", sub: "Senior Years" }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.08 }}
                className="fabric-panel rounded-2xl px-2 py-3.5 text-center border border-[rgba(179,136,255,0.2)]"
              >
                <div className="f-syne font-bold text-xl md:text-2xl fabric-text-glow tabular-nums">
                  <CountUpLoom to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="f-mono text-[9px] tracking-[0.16em] text-[#f0f4ff] mt-1 uppercase font-bold">
                  {stat.label}
                </div>
                <div className="f-mono text-[8px] text-[#8c9bbd]">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Holographic Jacquard Weave Portrait Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.9 }}
          className="relative flex justify-center"
        >
          <div className="relative p-6 fabric-panel-cyan rounded-[2.5rem] overflow-hidden weave-grid-pat shadow-2xl">
            {/* Corner Tension Pins */}
            <span className="grommet tl" />
            <span className="grommet tr" />
            <span className="grommet bl" />
            <span className="grommet br" />

            {/* Shuttle beam scan */}
            <div className="shuttle-beam" />

            {/* Portrait inside Stitched Ring */}
            <div className="relative w-[280px] sm:w-[320px] aspect-[4/5] rounded-3xl overflow-hidden border border-[rgba(0,240,255,0.4)] shadow-2xl">
              <img
                src={weaverProfile.portraitPrimary}
                alt={weaverProfile.name}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--loom-void)] via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl fabric-panel border border-white/10">
                <div className="f-syne font-bold text-base text-white">{weaverProfile.name}</div>
                <div className="f-mono text-[10px] text-[#00f0ff]">{weaverProfile.title}</div>
                <div className="f-mono text-[9px] text-[#8c9bbd] mt-0.5">{weaverProfile.location}</div>
              </div>
            </div>

            {/* Orbiting Jacquard Loom Specs */}
            <div className="mt-4 flex items-center justify-between f-mono text-[10px] text-[#8c9bbd]">
              <span className="flex items-center gap-1.5 text-[#00e676]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" /> WEFT: ACTIVE
              </span>
              <span>1850 TPI DENSITY</span>
              <span className="text-[#ffd740]">JACQUARD v4.2</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= SOMA CODEX SECTION ================= */
export function SomaCodex() {
  const codexLines = [
    { cmd: "$ loom --stain-specimen mka", c: "text-[#00f0ff]" },
    { cmd: "nucleus: senior android developer · time & fabric architect", c: "text-white/90" },
    { cmd: "warp structural → kotlin 2.0 · compose · clean architecture", c: "text-[#8c9bbd]" },
    { cmd: "weft reactive → firebase delta streams · rest apis · python", c: "text-[#8c9bbd]" },
    { cmd: "filaments → on-device ml (tflite int8) · ethical hacking", c: "text-[#8c9bbd]" },
    { cmd: "$ cat codex.philosophy", c: "text-[#00f0ff]" },
    { cmd: `"${weaverProfile.philosophy}" — "${weaverProfile.philosophyNative}"`, c: "text-[#00e676]" },
  ];

  return (
    <section id="codex" className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="mb-14 max-w-3xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#00f0ff] uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-gradient-to-r from-[#00f0ff] to-transparent" />
            01 · SOMA CODEX
          </div>
          <h2 className="f-syne font-bold text-3xl md:text-5xl leading-tight text-[#f0f4ff]">
            The weaver's <span className="fabric-text-glow f-serif italic">philosophy</span>
          </h2>
          <p className="mt-4 text-[#8c9bbd] text-base md:text-lg leading-relaxed">
            From Tachileik to Bangkok — software built with the structural resilience of woven carbon and the cultural intentionality of hand-loomed silk.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Biography Card with Visual Sheen */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="fabric-panel rounded-3xl p-7 md:p-9 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 f-mono text-[10px] tracking-[0.25em] text-[#00f0ff] mb-3">
                <Sparkles size={13} /> DIGITAL LOOM MANIFESTO
              </div>
              <h3 className="f-syne font-bold text-2xl md:text-3xl leading-snug text-[#f0f4ff]">
                Engineering high-tensile code with <span className="text-[#00f0ff]">purpose</span>,{" "}
                <span className="text-[#b388ff]">culture</span>, and <span className="text-[#ffd740]">precision</span>.
              </h3>
              <p className="mt-4 text-[#8c9bbd] text-sm md:text-base leading-relaxed">
                I approach software architecture as an intricate digital tapestry. Every usecase, repository contract, and UI state represents an interlaced thread. If a single strand frays under high concurrent stress, the entire fabric must hold through decoupling and offline resilience.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="f-mono text-[10px] tracking-widest text-[#8c9bbd] uppercase mb-3">
                FLUENT THREADS (LANGUAGES)
              </div>
              <div className="flex flex-wrap gap-2">
                {["Burmese 🇲🇲", "English 🌐", "Kotlin ☕", "Python 🐍", "TypeScript 🔷"].map((lang) => (
                  <span
                    key={lang}
                    className="f-mono text-xs px-3 py-1.5 rounded-full fabric-panel border border-[rgba(179,136,255,0.3)] text-[#f0f4ff]"
                  >
                    ✦ {lang}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Interactive Terminal Codex */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden border border-[rgba(0,240,255,0.25)] bg-[rgba(6,8,18,0.92)] shadow-2xl flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(0,240,255,0.15)] bg-white/[0.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff4081]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffd740]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e676]/80" />
              <span className="ml-3 f-mono text-[10px] text-[#8c9bbd] tracking-widest">
                mka@hyper-loom ~/soma-codex
              </span>
            </div>

            <div className="p-6 f-mono text-[12px] leading-8 space-y-1">
              {codexLines.map((line, idx) => (
                <div key={idx} className={line.c}>
                  {line.cmd}
                </div>
              ))}
              <span className="text-[#00f0ff] animate-pulse">▍</span>
            </div>

            {/* Bottom Pillars */}
            <div className="p-5 border-t border-white/10 grid grid-cols-3 gap-2 f-mono text-center text-xs">
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[#00f0ff] font-bold">12 LOBES</div>
                <div className="text-[9px] text-[#8c9bbd] tracking-widest">CLEAN ARCH</div>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[#b388ff] font-bold">32ms TICK</div>
                <div className="text-[9px] text-[#8c9bbd] tracking-widest">ON-DEVICE AI</div>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[#00e676] font-bold">82+ SPOOLS</div>
                <div className="text-[9px] text-[#8c9bbd] tracking-widest">CREDENTIALS</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================= SKILL LOOM SECTION ================= */
export function SkillLoom() {
  return (
    <section id="skill-loom" className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="mb-14 max-w-3xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#00f0ff] uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-gradient-to-r from-[#00f0ff] to-transparent" />
            02 · SKILL LOOM
          </div>
          <h2 className="f-syne font-bold text-3xl md:text-5xl leading-tight text-[#f0f4ff]">
            Strand tension &amp; <span className="fabric-text-glow f-serif italic">gauges</span>
          </h2>
          <p className="mt-4 text-[#8c9bbd] text-base md:text-lg leading-relaxed">
            Six structural weft strands maintaining the architectural integrity of production systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {SKILL_STRANDS.map((strand, i) => (
            <motion.div
              key={strand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 2) * 0.08 }}
              onMouseEnter={() => loomAudio.pluckThread(640 + i * 50)}
              className="fabric-panel rounded-2xl p-5 relative overflow-hidden group hover:border-[#00f0ff]/50 transition-all"
            >
              {/* Luminous Glow Blob */}
              <div
                className="absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity"
                style={{ background: strand.filamentColor }}
              />

              <div className="flex items-center justify-between mb-2">
                <span className="f-mono text-[10px] tracking-[0.25em]" style={{ color: strand.filamentColor }}>
                  {strand.tag} · {strand.strandType}
                </span>
                <span className="f-syne font-bold text-xl tabular-nums" style={{ color: strand.filamentColor }}>
                  {strand.gaugePercentage}%
                </span>
              </div>

              <h4 className="f-syne font-bold text-lg text-[#f0f4ff] mb-1">{strand.name}</h4>
              <p className="f-mono text-[10px] text-[#8c9bbd] mb-3">{strand.threadSpec}</p>

              {/* Thread Meter */}
              <div className="h-2 rounded-full bg-white/5 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${strand.gaugePercentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.15 }}
                  className="h-full rounded-full relative"
                  style={{
                    background: `linear-gradient(90deg, ${strand.filamentColor}55, ${strand.filamentColor})`,
                    boxShadow: `0 0 12px ${strand.filamentColor}`
                  }}
                >
                  <span className="absolute right-0 -top-0.5 w-3 h-3 rounded-full bg-white shadow-md" />
                </motion.div>
              </div>

              <div className="mt-3 flex items-center justify-between f-mono text-[9.5px] text-[#8c9bbd]">
                <span>{strand.description}</span>
                <span className="font-bold text-white shrink-0 ml-2">{strand.spoolCapacity}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TAPESTRY TIMELINE SECTION ================= */
export function TapestryTimeline() {
  return (
    <section id="tapestry" className="relative py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <div className="mb-14 max-w-2xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#00f0ff] uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-gradient-to-r from-[#00f0ff] to-transparent" />
            04 · TAPESTRY TIMELINE
          </div>
          <h2 className="f-syne font-bold text-3xl md:text-5xl leading-tight text-[#f0f4ff]">
            Continuous <span className="fabric-text-glow f-serif italic">warp strand</span>
          </h2>
          <p className="mt-4 text-[#8c9bbd] text-base md:text-lg leading-relaxed">
            The ongoing trajectory of Moe's engineering evolution from the initial 2023 thread to the 2026 on-device AI frontier.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Continuous Thread */}
          <div
            className="absolute left-5 md:left-1/2 top-4 bottom-4 w-px md:-translate-x-1/2"
            style={{ background: "linear-gradient(180deg, #ff4081, #00f0ff, #00e676, #ffd740)" }}
          />

          {TAPESTRY_TIMELINE.map((knot, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={knot.year}
                className="relative md:grid md:grid-cols-2 md:gap-x-16 md:py-6 pl-14 md:pl-0 mb-8 md:mb-0"
              >
                {/* Knot Pin on Strand */}
                <span
                  className="absolute top-6 md:top-1/2 md:-translate-y-1/2 left-5 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full border-2 bg-[var(--loom-void)]"
                  style={{
                    borderColor: knot.color,
                    boxShadow: `0 0 16px ${knot.color}`
                  }}
                />

                <div className={isLeft ? "md:col-start-1 md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}>
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="fabric-panel rounded-2xl p-5 inline-block w-full text-left group hover:border-[#00f0ff]/40 transition-colors"
                  >
                    <div className={`flex items-center gap-3 mb-2 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                      <div className="f-syne font-bold text-2xl text-white">{knot.year}</div>
                      <span
                        className="f-mono text-[9px] tracking-widest px-2.5 py-0.5 rounded-full border"
                        style={{ color: knot.color, borderColor: `${knot.color}44`, background: `${knot.color}15` }}
                      >
                        {knot.eraTag}
                      </span>
                    </div>

                    <h4 className="f-syne font-bold text-base text-[#f0f4ff] mb-1.5">{knot.title}</h4>
                    <p className="text-xs text-[#8c9bbd] leading-relaxed">{knot.knotDetails}</p>
                    <div className="mt-3 f-mono text-[9px] text-[#ffd740]">
                      FILAMENT: {knot.filamentType}
                    </div>
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

/* ================= SPOOL VAULT (82+ CERTS) ================= */
export function SpoolVault() {
  const [search, setSearch] = useState("");

  const matchingWings = CERTIFICATE_WINGS.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="spool-vault" className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="mb-12 max-w-3xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#00f0ff] uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-gradient-to-r from-[#00f0ff] to-transparent" />
            05 · SPOOL VAULT
          </div>
          <h2 className="f-syne font-bold text-3xl md:text-5xl leading-tight text-[#f0f4ff]">
            82+ verified <span className="fabric-text-glow f-serif italic">credentials</span>
          </h2>
          <p className="mt-4 text-[#8c9bbd] text-base md:text-lg leading-relaxed">
            A comprehensive, verified learning archive spanning 9 technical wings — from programming languages to machine learning, blockchain, and cybersecurity.
          </p>
        </div>

        {/* Live Filter Input */}
        <div className="max-w-md mb-8 relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c9bbd]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter spool wings (e.g. Android, AI, Security)..."
            className="w-full fabric-panel rounded-full pl-11 pr-4 py-3 f-mono text-xs text-white placeholder:text-[#8c9bbd]/60 focus:outline-none focus:border-[#00f0ff]"
          />
        </div>

        {/* Wings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {matchingWings.map((wing, i) => (
            <motion.div
              key={wing.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onMouseEnter={() => loomAudio.pluckThread(600 + i * 30)}
              className="fabric-panel rounded-2xl p-4 text-center hover:border-[#00f0ff]/50 transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2 shadow-lg"
                style={{ background: `${wing.color}20`, color: wing.color }}
              >
                <i className={`${wing.icon} text-base`} />
              </div>
              <div className="f-syne font-bold text-2xl text-white">{wing.count}</div>
              <div className="f-mono text-[9px] tracking-wider text-[#8c9bbd] uppercase mt-0.5">
                {wing.name}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center f-mono text-[11px] text-[#8c9bbd]">
          PROGRAMMING HUB · GOOGLE DEVELOPERS LAUNCHPAD · 82+ VERIFIED TECHNICAL CERTIFICATIONS
        </div>
      </div>
    </section>
  );
}

/* ================= SIGNAL LOOM (CONTACT) ================= */
export function SignalLoom() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(weaverProfile.email);
    } catch {}
    setCopied(true);
    loomAudio.tensionChime();
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="signal-loom" className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#00f0ff] uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-gradient-to-r from-[#00f0ff] to-transparent" />
            06 · SIGNAL LOOM
          </div>
          <h2 className="f-syne font-bold text-3xl md:text-5xl leading-tight text-[#f0f4ff]">
            Transmit a <span className="fabric-text-glow f-serif italic">signal</span>
          </h2>
          <p className="mt-4 text-[#8c9bbd] text-base md:text-lg leading-relaxed">
            Open for Senior Android Engineering and on-device AI roles worldwide. Every message connects directly to Moe's communication terminal.
          </p>
        </div>

        <div className="fabric-panel rounded-[2.5rem] p-7 md:p-10 relative overflow-hidden border border-[rgba(0,240,255,0.35)] shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Direct Channels */}
            <div>
              <h3 className="f-syne font-bold text-2xl md:text-3xl text-white">
                Let's interlace <span className="fabric-text-glow">our work.</span>
              </h3>
              <p className="text-[#8c9bbd] mt-3 text-sm leading-relaxed">
                Available for enterprise mobile development, architectural consultations, and machine learning deployments.
              </p>

              <div className="mt-6 space-y-3">
                {/* Email */}
                <a
                  href={`mailto:${weaverProfile.email}`}
                  className="flex items-center gap-3.5 p-4 rounded-2xl fabric-panel hover:border-[#00f0ff] transition-all group"
                >
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(0,240,255,0.15)] text-[#00f0ff]">
                    <Mail size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block f-mono text-[9px] tracking-[0.2em] text-[#8c9bbd]">DIRECT EMAIL</span>
                    <span className="block text-sm text-[#f0f4ff] font-mono truncate">{weaverProfile.email}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      copyEmail();
                    }}
                    aria-label="Copy Email"
                    className="w-8 h-8 rounded-lg fabric-panel flex items-center justify-center text-[#8c9bbd] hover:text-white"
                  >
                    {copied ? <Check size={14} className="text-[#00e676]" /> : <Copy size={14} />}
                  </button>
                </a>

                {/* Telephone */}
                <a
                  href={`tel:${weaverProfile.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3.5 p-4 rounded-2xl fabric-panel hover:border-[#b388ff] transition-all"
                >
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(179,136,255,0.15)] text-[#b388ff]">
                    <Phone size={16} />
                  </span>
                  <span>
                    <span className="block f-mono text-[9px] tracking-[0.2em] text-[#8c9bbd]">TELEPHONE</span>
                    <span className="block text-sm text-[#f0f4ff] font-mono">{weaverProfile.phone}</span>
                  </span>
                </a>

                {/* Location */}
                <div className="flex items-center gap-3.5 p-4 rounded-2xl fabric-panel">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(255,215,64,0.15)] text-[#ffd740]">
                    <MapPin size={16} />
                  </span>
                  <span className="text-sm text-[#f0f4ff]">{weaverProfile.location}</span>
                </div>
              </div>
            </div>

            {/* Social Constellation */}
            <div>
              <div className="f-mono text-[10px] tracking-[0.3em] text-[#8c9bbd] mb-4 text-center">
                — DIGITAL TAPESTRY CHANNELS —
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {weaverProfile.socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fabric-panel rounded-2xl p-3.5 flex items-center gap-3 hover:border-[#00f0ff] hover:-translate-y-0.5 transition-all group"
                  >
                    <i className={`${s.icon} text-[#00f0ff] group-hover:scale-110 transition-transform`} />
                    <span className="f-mono text-xs text-[#f0f4ff]">{s.name}</span>
                  </a>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-[rgba(0,240,255,0.2)] bg-black/40 p-5 text-center">
                <p className="f-serif italic text-lg text-[#f0f4ff]">“{weaverProfile.philosophy}”</p>
                <div className="f-mono text-xs text-[#ffd740] mt-1">{weaverProfile.philosophyNative}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= FOOTER ================= */
export function Footer() {
  return (
    <footer className="relative border-t border-[rgba(179,136,255,0.16)] bg-[rgba(6,8,18,0.95)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 pb-6 flex flex-col md:flex-row items-center justify-between gap-5">
        <span className="f-syne font-bold tracking-[0.25em] text-white">
          MKA<span className="fabric-text-glow font-serif">·HYPER-FABRIC</span>
        </span>
        <div className="flex flex-wrap justify-center gap-5">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="f-mono text-[10px] tracking-[0.2em] text-[#8c9bbd] hover:text-[#00f0ff] uppercase transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="text-center select-none pointer-events-none leading-none overflow-hidden py-4">
        <span
          className="f-syne font-black text-[clamp(3.4rem,15vw,12rem)] text-transparent"
          style={{ WebkitTextStroke: "1px rgba(0,240,255,0.12)" }}
        >
          INTERLACED
        </span>
      </div>

      <div className="text-center pb-8 f-mono text-[10px] tracking-[0.2em] text-[#8c9bbd]">
        © 2026 {weaverProfile.name} · SENIOR ANDROID &amp; AI ARCHITECT · ALL THREADS SECURED
      </div>
    </footer>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fn = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.button
      aria-label="Rewind to Top of Loom"
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14, pointerEvents: show ? "auto" : "none" }}
      onClick={() => {
        loomAudio.shuttlePass();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="fixed bottom-6 left-6 z-[70] w-11 h-11 rounded-full fabric-panel flex items-center justify-center text-[#00f0ff] shadow-xl border border-[#00f0ff]/40"
    >
      <ChevronUp size={18} />
    </motion.button>
  );
}
