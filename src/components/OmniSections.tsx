import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useInView, useTransform } from "framer-motion";
import {
  Menu, X, ArrowRight, Mail, Phone, MapPin, Copy, Check,
  Download, Volume2, VolumeX, ChevronUp, Search, Star,
  ArrowUpRight, Layers, GitBranch, Gauge, Cpu, ShieldCheck,
  Database, Boxes, Code2, X as CloseIcon
} from "lucide-react";
import { omni } from "../omnisphereAudio";
import {
  profile, holoNodes, skillRings, orbitTimeline, certOrbits, tape,
  type HoloNode,
} from "../omnisphereData";

/* ============ PRIMITIVES ============ */

export function Typing({ phrases, className = "" }: { phrases: string[]; className?: string }) {
  const [txt, setTxt] = useState("");
  const [pi, setPi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const full = phrases[pi % phrases.length];
    let d = del ? 24 : 58;
    if (!del && txt === full) d = 1700;
    if (del && txt === "") d = 240;
    const id = setTimeout(() => {
      if (!del && txt === full) { setDel(true); return; }
      if (del && txt === "") { setDel(false); setPi((p) => (p + 1) % phrases.length); return; }
      setTxt(full.slice(0, txt.length + (del ? -1 : 1)));
    }, d);
    return () => clearTimeout(id);
  }, [txt, del, pi, phrases]);
  return <span className={`caret-h ${className}`}>{txt || " "}</span>;
}

export function CountUp({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0; const t0 = performance.now();
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

export function Tape() {
  const row = [...tape, ...tape];
  return (
    <div className="relative overflow-hidden border-y border-[rgba(0,229,255,0.18)] bg-[rgba(5,10,26,0.7)] py-3 select-none">
      <style>{`@keyframes omni-marquee{to{transform:translateX(-50%)}}`}</style>
      <div className="flex w-max" style={{ animation: "omni-marquee 34s linear infinite" }}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 font-mono text-[11px] tracking-[0.3em] text-[#7fa8c9] whitespace-nowrap">
            {t}<span className="text-[#00e5ff]">◇</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* Mini rotating wire sphere (SVG, no canvas) */
export function MiniSphere({ size = 340, color = "#00e5ff", color2 = "#7c4dff" }: { size?: number; color?: string; color2?: string }) {
  return (
    <div className="relative" style={{ width: size, height: size, perspective: 900 }}>
      <div className="absolute inset-0 rounded-full animate-spin3d" style={{ transformStyle: "preserve-3d" }}>
        <svg viewBox="0 0 340 340" width={size} height={size}>
          <defs>
            <radialGradient id="miniCore" cx="42%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="45%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color2} stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <circle cx="170" cy="170" r="166" fill="rgba(4,10,24,0.55)" stroke={color} strokeOpacity="0.35" strokeWidth="1.4" />
          {/* latitudes */}
          {[0.3, 0.55, 0.78, 1, 0.78, 0.55, 0.3].map((rx, i) => (
            <ellipse key={i} cx="170" cy="170" rx={150 * rx} ry={150} fill="none" stroke={i % 2 ? color2 : color} strokeOpacity="0.18" strokeWidth="0.7" />
          ))}
          {/* longitudes */}
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <ellipse key={deg} cx="170" cy="170" rx="150" ry={150 * Math.abs(Math.cos((deg * Math.PI) / 180)) || 4} fill="none" stroke={color} strokeOpacity="0.14" strokeWidth="0.7" />
          ))}
          <circle cx="170" cy="170" r="90" fill="url(#miniCore)" />
          {/* nodes */}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const r = 120 + (i % 3) * 16;
            return <circle key={i} cx={170 + Math.cos(a) * r} cy={170 + Math.sin(a) * r * 0.8} r={i % 4 === 0 ? 3 : 1.6} fill={i % 3 === 0 ? color2 : color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />;
          })}
        </svg>
      </div>
      {/* counter ring */}
      <div className="absolute inset-[-14px] rounded-full border border-dashed border-[rgba(0,229,255,0.3)] animate-spin3d-rev" style={{ transform: "rotateX(70deg)" }} />
      <div className="absolute inset-[-34px] rounded-full border border-[rgba(124,77,255,0.22)]" style={{ transform: "rotateX(74deg)" }} />
      {/* orbiting satellites */}
      <div className="absolute inset-0 animate-spin3d" style={{ animationDuration: "12s" }}>
        <span className="absolute w-3 h-3 rounded-full bg-white" style={{ top: "50%", left: "100%", transform: "translate(-50%,-50%)", boxShadow: `0 0 14px ${color}` }} />
      </div>
      <div className="absolute inset-0 animate-spin3d-rev" style={{ animationDuration: "16s" }}>
        <span className="absolute w-2.5 h-2.5 rounded-full" style={{ background: color2, top: 0, left: "50%", transform: "translate(-50%,-50%)", boxShadow: `0 0 12px ${color2}` }} />
      </div>
    </div>
  );
}

/* ============ NAV ============ */
const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "nodes", label: "Nodes" },
  { id: "orbit", label: "Timeline" },
  { id: "constellation", label: "Certs" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(!omni.enabled);
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
      <motion.header initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="fixed top-0 inset-x-0 z-[70]">
        <div className="mx-auto mt-3 max-w-6xl px-3">
          <div className="holo-panel rounded-full pl-5 pr-2 py-2 flex items-center justify-between border border-[rgba(0,229,255,0.3)]">
            <a href="#hero" className="flex items-center gap-2.5">
              <span className="relative w-9 h-9 block">
                <span className="absolute inset-0 rounded-full border border-[#00e5ff]/60 animate-spin3d" />
                <span className="absolute inset-1.5 rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #fff, #00e5ff 55%, #7c4dff)" }} />
              </span>
              <span className="leading-tight">
                <span className="block font-orbitron text-[13px] font-bold tracking-wider">MKA<span className="holo-text">·OMNI</span></span>
                <span className="block font-mono text-[9px] tracking-[0.3em] text-[#7fa8c9]">HOLOGRAPHIC</span>
              </span>
            </a>
            <nav className="hidden lg:flex items-center gap-6">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => omni.glint()}
                  className={`navlink font-mono text-[11px] tracking-[0.18em] uppercase transition-colors ${active === n.id ? "text-[#00e5ff] active" : "text-[#7fa8c9] hover:text-white"}`}>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={() => { const on = omni.toggle(); setMuted(!on); }} aria-label="Audio"
                className={`w-9 h-9 rounded-full holo-panel flex items-center justify-center transition-colors ${muted ? "text-[#7fa8c9]" : "text-[#00e5ff]"}`}>
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
              </button>
              <a href="#contact" className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.15em] font-bold text-[#02121a] shadow-lg hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(120deg,#18ffff,#00e5ff)" }}>
                CONNECT <ArrowRight size={13} />
              </a>
              <button onClick={() => setOpen(true)} className="lg:hidden w-10 h-10 rounded-full holo-panel flex items-center justify-center text-[#00e5ff]" aria-label="Menu"><Menu size={17} /></button>
            </div>
          </div>
          <motion.div style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg,#00e5ff,#7c4dff,#ff4081)" }} className="h-[2px] mt-2 rounded-full origin-left" />
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] lg:hidden bg-[rgba(2,5,13,0.96)] backdrop-blur-2xl">
            <div className="flex items-center justify-between px-6 h-20">
              <span className="font-orbitron tracking-widest text-xl holo-text">OMNI-SPHERE</span>
              <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full holo-panel flex items-center justify-center text-white" aria-label="Close"><X size={17} /></button>
            </div>
            <nav className="px-8 flex flex-col gap-1">
              {NAV.map((n, i) => (
                <motion.a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="py-4 border-b border-[rgba(0,229,255,0.12)] font-orbitron text-xl flex justify-between items-center text-[#e0f7ff]">
                  {n.label}<span className="font-mono text-xs text-[#00e5ff]">0{i + 1}</span>
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
  const yTxt = useTransform(scrollY, [0, 700], [0, 70]);
  const ySphere = useTransform(scrollY, [0, 700], [0, -90]);
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden depth-stage">
      <div className="vol-beams">
        <span className="vol-beam" style={{ animationDelay: "0s" }} />
        <span className="vol-beam" style={{ animationDelay: "3s" }} />
        <span className="vol-beam" style={{ animationDelay: "6s" }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <motion.div style={{ y: yTxt, transformStyle: "preserve-3d" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 holo-panel holo-brackets rounded-full pl-3 pr-4 py-1.5 mb-6 border border-[rgba(0,229,255,0.35)]">
            <span className="b-bracket" />
            <span className="font-mono text-[10px] tracking-[0.2em] px-2.5 py-1 rounded-full text-[#02121a] font-bold" style={{ background: "linear-gradient(120deg,#18ffff,#00e5ff)" }}>◈ OMNI-SPHERE</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#9fe9ff]">SENIOR ANDROID · EDGE AI</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24, translateZ: -80 }} animate={{ opacity: 1, y: 0, translateZ: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
            className="font-orbitron font-black leading-[0.95] tracking-tight text-[clamp(2.6rem,7vw,5.2rem)]">
            Moe Kyaw<br /><span className="holo-text glow-holo animate-flicker">Aung</span>
            <span className="font-serif italic font-normal text-[clamp(1.2rem,2.8vw,1.9rem)] text-[#7fa8c9] block mt-3" style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.02em" }}>
              architecture rendered in 3D light.
            </span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5">
            <Typing phrases={profile.roles} className="font-mono text-base md:text-lg text-[#00e5ff]" />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-5 max-w-xl text-[#9ab4cf] leading-relaxed">
            {profile.tagline} Currently projecting <span className="text-white font-medium">{profile.building}</span>. {profile.location}.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#nodes" onClick={() => omni.expand()} className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-mono text-xs tracking-wider font-bold text-[#02121a] shadow-xl hover:scale-105 active:scale-95 transition-transform"
              style={{ background: "linear-gradient(120deg,#18ffff,#00e5ff)", boxShadow: "0 10px 35px rgba(0,229,255,0.35)" }}>
              ENTER THE SPHERE <ArrowRight size={15} />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 holo-panel font-mono text-xs tracking-wider text-[#e0f7ff] hover:border-[#00e5ff] transition-colors">
              <Download size={15} /> GITHUB
            </a>
          </motion.div>
          <div className="grid grid-cols-4 gap-3 mt-10 max-w-xl">
            {profile.stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 14, translateZ: -40 }} animate={{ opacity: 1, y: 0, translateZ: 0 }} transition={{ delay: 0.65 + i * 0.08 }}
                className="holo-panel rounded-2xl px-2 py-3.5 text-center border border-[rgba(0,229,255,0.2)]">
                <div className="font-orbitron font-bold text-xl md:text-2xl holo-text tabular-nums"><CountUp to={s.value} suffix={s.suffix} /></div>
                <div className="font-mono text-[9px] tracking-[0.16em] text-[#e0f7ff] mt-1">{s.label}</div>
                <div className="font-mono text-[8px] text-[#7fa8c9]">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div style={{ y: ySphere, transformStyle: "preserve-3d" }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.9 }} className="relative flex justify-center">
          <div className="animate-float-node">
            <MiniSphere />
          </div>
        </motion.div>
      </div>
      {/* scroll cue */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.4em] text-[#7fa8c9]">
        DESCEND
        <div className="mx-auto mt-2 w-px h-8 bg-gradient-to-b from-[#00e5ff] to-transparent" />
      </motion.div>
    </section>
  );
}

/* ============ ABOUT ============ */
export function About() {
  const code = [
    { p: "$ omni-project --identity mka", c: "text-[#00e5ff]" },
    { p: "core: senior android · edge-ai systems architect", c: "text-[#e0f7ff]" },
    { p: "lattice → kotlin · compose · mvvm · clean arch", c: "text-[#7fa8c9]" },
    { p: "plasma  → firebase · rest · python", c: "text-[#7fa8c9]" },
    { p: "neural  → tflite int8 · claude api · ethical hacking", c: "text-[#7fa8c9]" },
    { p: "$ echo $directive", c: "text-[#00e5ff]" },
    { p: `"${profile.philosophy}"`, c: "text-[#69f0ae]" },
  ];
  return (
    <section id="about" className="relative py-24 md:py-32 depth-stage">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <Head eyebrow="01 · IDENTITY MATRIX" title="The architect" accent="behind the light" />
        <div className="grid lg:grid-cols-2 gap-8 items-stretch" style={{ transformStyle: "preserve-3d" }}>
          <motion.div initial={{ opacity: 0, rotateY: -14, x: -30 }} whileInView={{ opacity: 1, rotateY: 0, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="holo-panel holo-brackets rounded-3xl overflow-hidden relative min-h-[420px] border border-[rgba(0,229,255,0.28)]">
            <span className="b-bracket" />
            <div className="holo-scan" />
            <img src={profile.portrait2} alt="" className="absolute inset-0 w-full h-full object-cover opacity-55" loading="lazy" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 12%, rgba(2,5,13,0.94))" }} />
            <div className="relative p-7 md:p-9 flex flex-col justify-end min-h-[420px]">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-[#00e5ff] mb-3"><Boxes size={13} /> PROJECTION · MKA-2026</div>
              <h3 className="font-orbitron text-2xl md:text-3xl leading-tight text-[#e0f7ff]">
                From <span className="text-[#00e5ff]">frame-pacing</span> to <span className="text-[#7c4dff]">pipelines</span> to <span className="text-[#69f0ae]">private AI</span>.
              </h3>
              <p className="mt-4 text-[#9ab4cf] leading-relaxed">82+ verified credentials across 9 domains — but the real metric is production systems that hold under load, with the hologram entity AURA-9 ready to render any layer on demand.</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {["Burmese 🇲🇲", "English 🌐", "Kotlin ☕"].map((l) => (
                  <span key={l} className="font-mono text-[10px] px-3 py-1.5 rounded-full holo-panel text-[#9fe9ff] border border-[rgba(0,229,255,0.25)]">◈ {l}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, rotateY: 14, x: 30 }} whileInView={{ opacity: 1, rotateY: 0, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden border border-[rgba(0,229,255,0.25)] bg-[rgba(4,10,24,0.9)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(0,229,255,0.14)] bg-white/[0.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff4081]/80" /><span className="w-2.5 h-2.5 rounded-full bg-[#ffd740]/80" /><span className="w-2.5 h-2.5 rounded-full bg-[#69f0ae]/80" />
              <span className="ml-2 font-mono text-[10px] text-[#7fa8c9] tracking-widest">mka@omni ~/identity</span>
            </div>
            <div className="p-6 font-mono text-[12.5px] leading-8">
              {code.map((l, i) => <div key={i} className={l.c}>{l.p}</div>)}
              <span className="text-[#00e5ff] animate-blink-soft">▍</span>
            </div>
            <div className="px-6 pb-6 grid grid-cols-3 gap-2">
              {[{ k: "MODULES", v: "12" }, { k: "EDGE AI", v: "32ms" }, { k: "NODES", v: "82+" }].map((f) => (
                <div key={f.k} className="rounded-2xl holo-panel p-3 text-center border border-white/5">
                  <div className="font-mono text-[9px] tracking-[0.2em] text-[#7fa8c9]">{f.k}</div>
                  <div className="text-sm font-semibold mt-1 text-[#e0f7ff]">{f.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Head({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  return (
    <div className="mb-12 md:mb-16 max-w-3xl">
      <div className="font-mono text-[11px] tracking-[0.35em] text-[#00e5ff] uppercase mb-3 flex items-center gap-2">
        <span className="w-8 h-px bg-gradient-to-r from-[#00e5ff] to-transparent" />{eyebrow}
      </div>
      <h2 className="font-orbitron font-bold text-3xl md:text-5xl leading-tight text-[#e0f7ff]">
        {title} <span className="holo-text" style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontStyle: "italic" }}>{accent}</span>
      </h2>
    </div>
  );
}

/* ============ SKILLS ============ */
export function Skills() {
  const icons = [Cpu, Layers, Brain2Icon, Database, ShieldCheck, Code2];
  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <Head eyebrow="02 · CAPABILITY ORBS" title="Layered" accent="capability rings" />
        <div className="grid md:grid-cols-2 gap-4">
          {skillRings.map((s, i) => {
            const Icon = icons[i] ?? Cpu;
            const C = 2 * Math.PI * 26;
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 22, translateZ: -60 }} whileInView={{ opacity: 1, y: 0, translateZ: 0 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.08 }}
                onMouseEnter={() => omni.glint()}
                className="holo-panel rounded-2xl p-5 flex items-center gap-4 group hover:border-[#00e5ff]/50 transition-all">
                <div className="relative w-[72px] h-[72px] shrink-0">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="rgba(4,10,24,0.7)" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                    <motion.circle cx="32" cy="32" r="26" fill="none" stroke={s.color} strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={C}
                      initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * (1 - s.pct / 100) }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.2 }}
                      style={{ filter: `drop-shadow(0 0 6px ${s.color})` }} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center"><Icon size={18} style={{ color: s.color }} /></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono text-[9px] tracking-[0.25em]" style={{ color: s.color }}>{s.id}</span>
                    <span className="font-orbitron text-lg tabular-nums" style={{ color: s.color }}>{s.pct}%</span>
                  </div>
                  <h4 className="font-orbitron text-[14px] font-semibold text-[#e0f7ff]">{s.name}</h4>
                  <p className="font-mono text-[10px] text-[#7fa8c9] mt-0.5">{s.spec} · {s.note}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function Brain2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    </svg>
  );
}

/* ============ HOLOGRAPHIC NODES (PROJECTS) ============ */
export function HoloNodes() {
  const [sel, setSel] = useState<HoloNode | null>(null);
  const [layer, setLayer] = useState(0);
  const openNode = (n: HoloNode) => { omni.expand(); setSel(n); setLayer(0); };

  return (
    <section id="nodes" className="relative py-24 md:py-32 depth-stage">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Head eyebrow="03 · FLOATING HOLOGRAPHIC NODES" title="Project" accent="constellation" />
        <p className="-mt-8 mb-10 text-[#9ab4cf] max-w-2xl">Each node hovers in volumetric light. Select one to expand its multi-layer case study — architecture, data flow, and production metrics rendered in depth.</p>
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ transformStyle: "preserve-3d" }}>
          {holoNodes.map((n, i) => (
            <motion.button key={n.id} layout
              initial={{ opacity: 0, y: 40, translateZ: -100, rotateY: 8 }} whileInView={{ opacity: 1, y: 0, translateZ: 0, rotateY: 0 }} viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.07, duration: 0.6 }}
              onClick={() => openNode(n)}
              className="holo-node holo-panel holo-brackets rounded-3xl p-5 text-left border border-white/10 cursor-pointer group animate-float-node"
              style={{ animationDelay: `${i * 0.6}s` }}>
              <span className="b-bracket" />
              <span className="node-scan" />
              <div className="flex items-center justify-between mb-3 font-mono text-[9px] tracking-widest text-[#7fa8c9]">
                <span style={{ color: n.color }}>◈ {n.code}</span>
                {n.flagship && <span className="px-2 py-0.5 rounded-full text-[#02121a] font-bold flex items-center gap-1" style={{ background: `linear-gradient(90deg, ${n.color}, #fff)` }}><Star size={8} /> CORE</span>}
              </div>
              {n.img ? (
                <div className="relative h-24 rounded-xl overflow-hidden mb-3 border border-white/10">
                  <img src={n.img} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(2,5,13,0.9))" }} />
                  <i className={`${n.icon} absolute top-2.5 right-2.5 text-lg`} style={{ color: n.color, textShadow: `0 0 12px ${n.color}` }} />
                </div>
              ) : (
                <div className="h-24 rounded-xl mb-3 flex items-center justify-center border border-white/10" style={{ background: `radial-gradient(circle at 50% 60%, ${n.color}22, transparent 70%)` }}>
                  <i className={`${n.icon} text-3xl`} style={{ color: n.color, textShadow: `0 0 18px ${n.color}` }} />
                </div>
              )}
              <h3 className="font-orbitron text-[15px] font-bold text-[#e0f7ff] group-hover:text-[#00e5ff] transition-colors">{n.name}</h3>
              <div className="font-mono text-[9px] tracking-[0.2em] mt-0.5" style={{ color: n.color }}>{n.sector} · {n.year}</div>
              <p className="text-[12px] text-[#9ab4cf] mt-2 line-clamp-2">{n.summary}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 font-mono text-[10px] text-[#7fa8c9]">
                <span className="flex items-center gap-1"><Layers size={10} /> {n.layers.stack.length} LAYERS</span>
                <span className="text-[#00e5ff] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">EXPAND <ArrowUpRight size={11} /></span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* MULTI-LAYER CASE STUDY MODAL */}
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[95] flex items-center justify-center p-4" style={{ background: "rgba(2,5,13,0.85)", backdropFilter: "blur(16px)", perspective: 1600 }} onClick={() => setSel(null)}>
            <motion.div
              initial={{ opacity: 0, rotateY: 24, translateZ: -160, scale: 0.92 }}
              animate={{ opacity: 1, rotateY: 0, translateZ: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -16, translateZ: -120, scale: 0.94 }}
              transition={{ type: "spring", damping: 26, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl holo-panel holo-brackets rounded-[2rem] overflow-hidden max-h-[90vh] overflow-y-auto hide-scroll border border-[rgba(0,229,255,0.5)] shadow-2xl"
              style={{ transformStyle: "preserve-3d", boxShadow: `0 0 70px ${sel.color}30` }}>
              <span className="b-bracket" />
              <div className="holo-scan" />
              {/* Header */}
              <div className="relative px-6 py-4 flex items-center justify-between border-b border-[rgba(0,229,255,0.2)]" style={{ background: `linear-gradient(90deg, ${sel.color}22, transparent)` }}>
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${sel.color}1a`, color: sel.color, boxShadow: `0 0 22px ${sel.color}40`, border: `1px solid ${sel.color}55` }}>
                    <i className={`${sel.icon} text-lg`} />
                  </span>
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.3em] text-[#7fa8c9]">{sel.code} · {sel.sector} · {sel.year}</div>
                    <h3 className="font-orbitron text-xl font-bold text-[#e0f7ff]">{sel.name}</h3>
                  </div>
                </div>
                <button onClick={() => { omni.glint(); setSel(null); }} className="w-9 h-9 rounded-full holo-panel flex items-center justify-center text-[#7fa8c9] hover:text-white" aria-label="Close"><CloseIcon size={15} /></button>
              </div>

              {/* Layer tabs */}
              <div className="px-6 pt-4 flex gap-2 flex-wrap">
                {["Architecture", "Data Flow", "Metrics", "Stack"].map((l, i) => (
                  <button key={l} onClick={() => { omni.glint(); setLayer(i); }}
                    className={`px-4 py-2 rounded-full font-mono text-[10px] tracking-[0.2em] border transition-all ${layer === i ? "text-[#02121a] font-bold" : "holo-panel text-[#7fa8c9] hover:text-white"}`}
                    style={layer === i ? { background: `linear-gradient(120deg, ${sel.color}, #18ffff)`, borderColor: sel.color } : {}}>
                    0{i + 1} · {l.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Layer content with depth transitions */}
              <div className="p-6 relative" style={{ perspective: 1000 }}>
                <AnimatePresence mode="wait">
                  <motion.div key={layer}
                    initial={{ opacity: 0, rotateY: -28, translateZ: -80, filter: "blur(6px)" }}
                    animate={{ opacity: 1, rotateY: 0, translateZ: 0, filter: "blur(0)" }}
                    exit={{ opacity: 0, rotateY: 28, translateZ: -80, filter: "blur(6px)" }}
                    transition={{ duration: 0.35 }}>
                    {layer === 0 && (
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] mb-3" style={{ color: sel.color }}><GitBranch size={12} /> LAYER 01 · ARCHITECTURE</div>
                        <p className="text-sm text-[#c4dcee] leading-relaxed">{sel.layers.architecture}</p>
                        <p className="text-[12px] text-[#7fa8c9] mt-4 leading-relaxed border-l-2 pl-4" style={{ borderColor: sel.color }}>{sel.summary}</p>
                      </div>
                    )}
                    {layer === 1 && (
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] mb-4" style={{ color: sel.color }}><Gauge size={12} /> LAYER 02 · DATA FLOW</div>
                        <div className="space-y-2">
                          {sel.layers.dataFlow.map((step, i) => (
                            <div key={step} className="flex items-center gap-3">
                              <span className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold" style={{ background: `${sel.color}1e`, color: sel.color, border: `1px solid ${sel.color}44` }}>{i + 1}</span>
                              <span className="text-sm text-[#dceeff]">{step}</span>
                              {i < sel.layers.dataFlow.length - 1 && <ArrowRight size={13} className="text-[#00e5ff] ml-auto shrink-0" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {layer === 2 && (
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] mb-4" style={{ color: sel.color }}><Gauge size={12} /> LAYER 03 · PRODUCTION METRICS</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {sel.layers.metrics.map((m) => (
                            <div key={m.label} className="rounded-xl holo-panel p-3.5 text-center border border-white/10">
                              <div className="font-orbitron text-base font-bold tabular-nums" style={{ color: sel.color }}>{m.value}</div>
                              <div className="font-mono text-[8px] tracking-[0.15em] text-[#7fa8c9] mt-1">{m.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {layer === 3 && (
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] mb-4" style={{ color: sel.color }}><Code2 size={12} /> LAYER 04 · TECHNOLOGY STACK</div>
                        <div className="flex flex-wrap gap-2">
                          {sel.layers.stack.map((t) => (
                            <span key={t} className="font-mono text-[11px] px-3 py-1.5 rounded-lg" style={{ border: `1px solid ${sel.color}44`, color: sel.color, background: `${sel.color}0d` }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="px-6 pb-6 flex gap-2.5">
                <a href={sel.href} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center rounded-full py-3 font-mono text-[11px] tracking-[0.2em] font-bold text-[#02121a] hover:scale-[1.02] transition-transform"
                  style={{ background: `linear-gradient(120deg, ${sel.color}, #18ffff)` }}>
                  ◉ ACCESS SOURCE
                </a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full holo-panel font-mono text-[11px] tracking-[0.2em] text-[#e0f7ff] hover:border-[#00e5ff]">PROFILE</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============ TIMELINE ============ */
export function Timeline() {
  return (
    <section id="orbit" className="relative py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <Head eyebrow="04 · ORBITAL TIMELINE" title="Four" accent="orbits of growth" />
        <div className="relative">
          <div className="absolute left-5 md:left-1/2 top-4 bottom-4 w-px md:-translate-x-1/2" style={{ background: "linear-gradient(180deg,#ff4081,#7c4dff,#00e5ff,#ffd740)" }} />
          {orbitTimeline.map((o, i) => {
            const left = i % 2 === 0;
            return (
              <div key={o.yr} className="relative md:grid md:grid-cols-2 md:gap-x-16 md:py-6 pl-14 md:pl-0 mb-8 md:mb-0">
                <span className="absolute top-6 md:top-1/2 md:-translate-y-1/2 left-5 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full border-2" style={{ background: "#02050d", borderColor: o.color, boxShadow: `0 0 16px ${o.color}` }} />
                <div className={left ? "md:col-start-1 md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}>
                  <motion.div initial={{ opacity: 0, y: 18, translateZ: -50 }} whileInView={{ opacity: 1, y: 0, translateZ: 0 }} viewport={{ once: true }}
                    className="holo-panel rounded-2xl p-5 inline-block w-full text-left hover:border-[#00e5ff]/40 transition-colors">
                    <div className={`flex items-center gap-3 mb-2 ${left ? "md:flex-row-reverse" : ""}`}>
                      <span className="font-orbitron font-bold text-xl text-[#e0f7ff]">{o.yr}</span>
                      <span className="font-mono text-[9px] tracking-[0.3em] px-2.5 py-0.5 rounded-full border" style={{ color: o.color, borderColor: `${o.color}55`, background: `${o.color}12` }}>{o.phase}</span>
                    </div>
                    <h4 className="font-orbitron font-semibold text-[#e0f7ff]">{o.title}</h4>
                    <p className="text-xs text-[#9ab4cf] mt-1">{o.desc}</p>
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

/* ============ CERT CONSTELLATION ============ */
export function Constellation() {
  const [q, setQ] = useState("");
  const shown = certOrbits.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <section id="constellation" className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <Head eyebrow="05 · CERTIFICATION CONSTELLATION" title="82+" accent="verified nodes" />
        <p className="-mt-8 mb-8 text-[#9ab4cf]">Nine orbital rings of verified technical credentials, Programming Hub & Google Developers Launchpad endorsed.</p>
        <div className="max-w-md mb-8 relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7fa8c9]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter orbits…"
            className="w-full holo-panel rounded-full pl-11 pr-4 py-3 font-mono text-xs text-white placeholder:text-[#7fa8c9]/60 focus:outline-none focus:border-[#00e5ff]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {shown.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, scale: 0.85, rotateY: 20 }} whileInView={{ opacity: 1, scale: 1, rotateY: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              onMouseEnter={() => omni.glint()}
              className="holo-panel rounded-2xl p-4 text-center hover:border-[#00e5ff]/40 transition-all group cursor-default">
              <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2" style={{ background: `${c.color}1e`, color: c.color, boxShadow: `0 0 14px ${c.color}30` }}>
                <i className={`${c.icon} text-base`} />
              </div>
              <div className="font-orbitron font-bold text-2xl" style={{ color: c.color }}>{c.count}</div>
              <div className="font-mono text-[9px] tracking-wider text-[#7fa8c9] uppercase mt-0.5">{c.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ CONTACT ============ */
export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(profile.email); } catch {} setCopied(true); omni.pulse(); setTimeout(() => setCopied(false), 1500); };
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <Head eyebrow="06 · TRANSMISSION CHANNEL" title="Open a" accent="hologram channel" />
        <div className="holo-panel holo-brackets rounded-[2.5rem] p-7 md:p-10 relative overflow-hidden border border-[rgba(0,229,255,0.4)] shadow-2xl">
          <span className="b-bracket" />
          <div className="holo-scan" />
          <div className="grid md:grid-cols-2 gap-8 relative">
            <div>
              <h3 className="font-orbitron font-bold text-2xl md:text-3xl leading-tight text-[#e0f7ff]">Let's render <span className="holo-text">something real.</span></h3>
              <p className="text-[#9ab4cf] mt-4 max-w-sm">Open for Senior Android and edge-AI roles worldwide. Every transmission gets a direct, human reply.</p>
              <div className="mt-6 space-y-3">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-3.5 p-4 rounded-2xl holo-panel hover:border-[#00e5ff] transition-colors">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(0,229,255,0.14)] text-[#00e5ff]"><Mail size={16} /></span>
                  <span className="min-w-0 flex-1"><span className="block font-mono text-[9px] tracking-[0.25em] text-[#7fa8c9]">EMAIL CHANNEL</span><span className="block text-sm truncate text-[#e0f7ff] font-mono">{profile.email}</span></span>
                  <button onClick={(e) => { e.preventDefault(); copy(); }} className="w-8 h-8 rounded-lg holo-panel flex items-center justify-center text-[#7fa8c9] hover:text-white">{copied ? <Check size={14} className="text-[#69f0ae]" /> : <Copy size={14} />}</button>
                </a>
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="flex items-center gap-3.5 p-4 rounded-2xl holo-panel hover:border-[#7c4dff] transition-colors">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(124,77,255,0.14)] text-[#7c4dff]"><Phone size={16} /></span>
                  <span><span className="block font-mono text-[9px] tracking-[0.25em] text-[#7fa8c9]">VOICE CHANNEL</span><span className="block text-sm text-[#e0f7ff] font-mono">{profile.phone}</span></span>
                </a>
                <div className="flex items-center gap-3.5 p-4 rounded-2xl holo-panel">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(105,240,174,0.12)] text-[#69f0ae]"><MapPin size={16} /></span>
                  <span className="text-sm text-[#e0f7ff]">{profile.location}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] text-[#7fa8c9] mb-4 text-center">— NETWORK RELAYS —</div>
              <div className="grid grid-cols-2 gap-2.5">
                {profile.socials.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="holo-panel rounded-2xl p-3.5 flex items-center gap-3 hover:border-[#00e5ff] hover:-translate-y-0.5 transition-all group">
                    <i className={`${s.icon} text-[#00e5ff] group-hover:scale-110 transition-transform`} />
                    <span className="font-mono text-[11px] text-[#e0f7ff]">{s.name}</span>
                  </a>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-[rgba(0,229,255,0.2)] bg-black/30 p-5 text-center">
                <p className="italic text-lg text-[#e0f7ff]" style={{ fontFamily: "Rajdhani, sans-serif" }}>“{profile.philosophy}”</p>
                <div className="font-mono text-[9px] tracking-[0.3em] text-[#7fa8c9] mt-2">PROJECTED FROM THE OMNI-SPHERE</div>
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
    <footer className="relative border-t border-[rgba(0,229,255,0.16)] bg-[rgba(2,5,13,0.95)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 pb-6 flex flex-col md:flex-row items-center justify-between gap-5">
        <span className="font-orbitron font-bold tracking-[0.25em] text-[#e0f7ff]">MKA<span className="holo-text">·OMNI</span></span>
        <div className="flex flex-wrap justify-center gap-5">
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`} className="font-mono text-[10px] tracking-[0.2em] text-[#7fa8c9] hover:text-[#00e5ff] uppercase transition-colors">{n.label}</a>)}
        </div>
      </div>
      <div className="text-center select-none pointer-events-none leading-none overflow-hidden py-4">
        <span className="font-orbitron font-black text-[clamp(3rem,15vw,11rem)] text-transparent" style={{ WebkitTextStroke: "1px rgba(0,229,255,0.14)" }}>OMNI-SPHERE</span>
      </div>
      <div className="text-center pb-8 font-mono text-[10px] tracking-[0.2em] text-[#7fa8c9]">© 2026 {profile.name} · SENIOR ANDROID & EDGE-AI ARCHITECT · ALL PROJECTIONS STABLE</div>
    </footer>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const fn = () => setShow(window.scrollY > 700); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <motion.button aria-label="Back to top" animate={{ opacity: show ? 1 : 0, y: show ? 0 : 14, pointerEvents: show ? "auto" : "none" }}
      onClick={() => { omni.pulse(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      className="fixed bottom-6 left-6 z-[70] w-11 h-11 rounded-full holo-panel flex items-center justify-center text-[#00e5ff] border border-[#00e5ff]/40">
      <ChevronUp size={18} />
    </motion.button>
  );
}
