import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Code2,
  Copy,
  Cpu,
  Download,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Phone,
  Radio,
  Search,
  ShieldCheck,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { certOrbits, orbitTimeline, profile, skillRings } from "../omnisphereData";
import { omni } from "../omnisphereAudio";
import OrbitConstellation from "./OrbitConstellation";
import { CountUp, DepthLayer, SectionHead, Typing } from "./OmniUltraFX";

const NAV = [
  { id: "identity", label: "Identity" },
  { id: "capabilities", label: "Capabilities" },
  { id: "projects", label: "Constellation" },
  { id: "evolution", label: "Evolution" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Transmit" },
];

export function Navigation() {
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(!omni.enabled);

  useEffect(() => {
    const onScroll = () => {
      let current = "hero";
      for (const item of NAV) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= 190) current = item.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 1.7 }} className="fixed inset-x-0 top-0 z-[80]">
        <div className="mx-auto mt-3 max-w-7xl px-3">
          <div className="spatial-glass flex items-center justify-between rounded-full py-2 pl-4 pr-2">
            <a href="#hero" className="flex items-center gap-3">
              <span className="relative h-9 w-9">
                <span className="absolute inset-0 rounded-full border border-cyan-300/60 animate-spin-slow" />
                <span className="absolute inset-[5px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#68f7ff_32%,#8d6bff_72%)]" />
              </span>
              <span className="leading-none">
                <span className="block font-orbit text-[12px] font-bold tracking-[0.17em] text-white">OMNI<span className="spectral-text">·SPHERE X</span></span>
                <span className="mt-1 block font-data text-[8px] tracking-[0.28em] text-[#7891ad]">SPATIAL OS · MKA</span>
              </span>
            </a>

            <nav className="hidden items-center gap-6 lg:flex">
              {NAV.map((item) => (
                <a key={item.id} href={`#${item.id}`} className={`navlink font-data text-[10px] uppercase tracking-[0.18em] ${active === item.id ? "active text-cyan-200" : "text-[#7891ad] hover:text-white"}`}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const enabled = omni.toggle();
                  setMuted(!enabled);
                }}
                aria-label="Toggle spatial audio"
                className={`spatial-glass-soft flex h-9 w-9 items-center justify-center rounded-full ${muted ? "text-[#7891ad]" : "text-cyan-200"}`}
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <span className="hidden items-center gap-2 rounded-full border border-emerald-300/20 px-3 py-1.5 font-data text-[9px] tracking-[0.14em] text-emerald-200 md:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> OPEN TO WORK
              </span>
              <a href="#contact" className="hidden rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-2 font-data text-[10px] font-bold tracking-[0.15em] text-[#01030a] sm:inline-flex">
                CONNECT
              </a>
              <button onClick={() => setOpen(true)} className="spatial-glass-soft flex h-10 w-10 items-center justify-center rounded-full text-cyan-200 lg:hidden" aria-label="Menu">
                <Menu size={17} />
              </button>
            </div>
          </div>
          <motion.div style={{ scaleX: scrollYProgress }} className="mt-2 h-[2px] origin-left rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-pink-400" />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-[#01030af2] px-6 backdrop-blur-2xl lg:hidden">
            <div className="flex h-20 items-center justify-between border-b border-cyan-300/10">
              <span className="font-orbit text-lg font-bold text-white">OMNI<span className="spectral-text">·X</span></span>
              <button onClick={() => setOpen(false)} className="spatial-glass-soft flex h-10 w-10 items-center justify-center rounded-full text-white"><X size={17} /></button>
            </div>
            <nav className="pt-6">
              {NAV.map((item, index) => (
                <motion.a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center justify-between border-b border-cyan-300/10 py-4 font-orbit text-xl text-white">
                  {item.label}<span className="font-data text-xs text-cyan-300">0{index + 1}</span>
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 700], [0, 90]);
  const opacity = useTransform(scrollY, [0, 650], [1, 0.2]);

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden pt-28 depth-stage">
      <div className="vol-beams">
        <span className="vol-beam left-[8%]" />
        <span className="vol-beam left-[55%] [animation-delay:3s]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <motion.div style={{ y: textY, opacity }} className="max-w-[680px] preserve-3d">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-7 font-data text-[10px] tracking-[0.38em] text-cyan-200/80">
            OMNI-SPHERE SPATIAL OPERATING SYSTEM · vX.0
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30, rotateX: 10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="font-orbit text-[clamp(3rem,8vw,7rem)] font-black leading-[0.86] tracking-[-0.06em] text-white">
            OMNI<br /><span className="spectral-text cyan-glow">SPHERE</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-7 max-w-xl text-lg leading-relaxed text-[#9ab4cf] md:text-xl">
            Moe Kyaw Aung renders senior Android architecture and private edge AI as navigable three-dimensional space.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-5">
            <Typing phrases={profile.roles} className="font-data text-sm text-cyan-200 md:text-base" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" onClick={() => omni.expand()} className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 px-7 py-3.5 font-data text-[11px] font-bold tracking-[0.16em] text-[#01030a] shadow-[0_12px_40px_rgba(104,247,255,.24)]">
              ENTER CONSTELLATION <ArrowRight size={14} />
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="spatial-glass flex items-center gap-2.5 rounded-full px-6 py-3.5 font-data text-[11px] tracking-[0.16em] text-white">
              <Download size={14} /> VIEW GITHUB
            </a>
          </motion.div>
        </motion.div>
      </div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center font-data text-[8px] tracking-[0.4em] text-[#7891ad]">
        DESCEND INTO DEPTH
        <div className="mx-auto mt-2 h-9 w-px bg-gradient-to-b from-cyan-300 to-transparent" />
      </motion.div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section className="relative z-10 border-y border-cyan-300/10 bg-[#020610b3] py-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-5 px-5 sm:grid-cols-4">
        {profile.stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-orbit text-3xl font-bold spectral-text"><CountUp to={stat.value} suffix={stat.suffix} /></div>
            <div className="mt-1 font-data text-[9px] tracking-[0.22em] text-white">{stat.label}</div>
            <div className="font-data text-[8px] tracking-[0.15em] text-[#7891ad]">{stat.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Identity() {
  const code = [
    "$ project --identity mka",
    "core       → senior android · edge-ai architect",
    "shell      → kotlin · compose · mvvm · clean",
    "circulate  → firebase · room · rest · python",
    "intellect  → tflite int8 · claude api",
    `directive  → "${profile.philosophy}"`,
  ];
  return (
    <section id="identity" className="relative py-28 depth-stage">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHead code="01 · IDENTITY VOLUME" title="The architect" accent="behind the projection" />
        <div className="grid gap-8 lg:grid-cols-2 preserve-3d">
          <DepthLayer>
            <div className="spatial-glass hud-corners relative min-h-[430px] overflow-hidden rounded-3xl">
              <span className="hud-bottom" />
              <div className="scan-beam" />
              <img src={profile.portrait2} alt={profile.name} className="absolute inset-0 h-full w-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#01030a] via-[#01030a99] to-transparent" />
              <div className="relative flex min-h-[430px] flex-col justify-end p-8">
                <div className="font-data text-[9px] tracking-[0.3em] text-cyan-300">PROJECTION · MKA-2026</div>
                <h3 className="mt-3 font-orbit text-2xl font-bold leading-tight text-white md:text-3xl">
                  From <span className="text-cyan-300">frame pacing</span> to <span className="text-violet-300">pipelines</span> to <span className="text-emerald-300">private AI</span>.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#9ab4cf]">82+ verified credentials across nine domains, but the real metric is production systems that stay stable under load.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["Burmese", "English", "Kotlin"].map((item) => <span key={item} className="spatial-glass-soft rounded-full px-3 py-1.5 font-data text-[9px] tracking-widest text-cyan-100">◇ {item}</span>)}
                </div>
              </div>
            </div>
          </DepthLayer>
          <DepthLayer amount={60}>
            <div className="spatial-glass h-full overflow-hidden rounded-3xl border-cyan-300/20 bg-[#030817e8]">
              <div className="flex items-center gap-2 border-b border-cyan-300/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
                <span className="ml-2 font-data text-[9px] tracking-widest text-[#7891ad]">aura@mka ~/identity</span>
              </div>
              <div className="space-y-1 p-6 font-data text-[12px] leading-7">
                {code.map((line, index) => <motion.div key={line} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className={index === 0 || index === code.length - 1 ? "text-cyan-300" : "text-[#7891ad]"}>{line}</motion.div>)}
                <span className="caret-spatial" />
              </div>
              <div className="grid grid-cols-3 gap-2 px-6 pb-6">
                {[["MODULES", "12"], ["EDGE AI", "32ms"], ["CRASH-FREE", "99.98%"]].map(([key, value]) => (
                  <div key={key} className="spatial-glass-soft rounded-2xl p-3 text-center">
                    <div className="font-orbit text-sm font-bold text-white">{value}</div>
                    <div className="mt-1 font-data text-[8px] tracking-[0.16em] text-[#7891ad]">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </DepthLayer>
        </div>
      </div>
    </section>
  );
}

export function Capabilities() {
  const icons = [Cpu, Layers3, BrainCircuit, Radio, ShieldCheck, Code2];
  return (
    <section id="capabilities" className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHead code="02 · CAPABILITY ATLAS" title="Six concentric" accent="capability rings" sub="The core capabilities that hold the spatial system coherent." />
        <div className="grid gap-4 md:grid-cols-2">
          {skillRings.map((skill, index) => {
            const Icon = icons[index] || Cpu;
            const circumference = Math.PI * 2 * 26;
            return (
              <motion.div key={skill.id} initial={{ opacity: 0, y: 22, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: (index % 2) * 0.08 }} className="spatial-glass flex items-center gap-4 rounded-2xl p-5 hover:border-cyan-300/35">
                <div className="relative h-[76px] w-[76px] shrink-0">
                  <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="rgba(4,10,24,.7)" stroke="rgba(255,255,255,.07)" strokeWidth="4" />
                    <motion.circle cx="32" cy="32" r="26" fill="none" stroke={skill.color} strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} whileInView={{ strokeDashoffset: circumference * (1 - skill.pct / 100) }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.2 }} style={{ filter: `drop-shadow(0 0 6px ${skill.color})` }} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center"><Icon size={18} style={{ color: skill.color }} /></span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-data text-[9px] tracking-[0.22em]" style={{ color: skill.color }}>{skill.id}</span>
                    <span className="font-orbit text-lg font-bold" style={{ color: skill.color }}>{skill.pct}%</span>
                  </div>
                  <h4 className="font-orbit text-[14px] font-semibold text-white">{skill.name}</h4>
                  <p className="mt-1 font-data text-[9px] tracking-wide text-[#7891ad]">{skill.spec} · {skill.note}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative py-28 depth-stage">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead code="03 · ORBIT CONSTELLATION" title="Floating" accent="project nodes" sub="Nodes connect through live photon routes. Hover to excite a path; click to open its four-layer case study." />
        <OrbitConstellation />
      </div>
    </section>
  );
}

export function Evolution() {
  return (
    <section id="evolution" className="relative py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionHead code="04 · ORBITAL EVOLUTION" title="Four" accent="growth orbits" />
        <div className="relative">
          <div className="absolute bottom-4 left-5 top-4 w-px bg-gradient-to-b from-pink-400 via-violet-400 via-cyan-300 to-amber-300 md:left-1/2 md:-translate-x-1/2" />
          {orbitTimeline.map((era, index) => {
            const left = index % 2 === 0;
            return (
              <div key={era.yr} className="relative mb-8 pl-14 md:mb-0 md:grid md:grid-cols-2 md:gap-x-16 md:py-6 md:pl-0">
                <span className="absolute left-5 top-6 h-4 w-4 -translate-x-1/2 rounded-full border-2 bg-[#01030a] md:left-1/2 md:top-1/2 md:-translate-y-1/2" style={{ borderColor: era.color, boxShadow: `0 0 16px ${era.color}` }} />
                <div className={left ? "md:col-start-1 md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}>
                  <DepthLayer amount={24}>
                    <div className="spatial-glass inline-block w-full rounded-2xl p-5 text-left">
                      <div className={`mb-2 flex items-center gap-3 ${left ? "md:flex-row-reverse" : ""}`}>
                        <span className="font-orbit text-xl font-bold text-white">{era.yr}</span>
                        <span className="rounded-full border px-2.5 py-0.5 font-data text-[8px] tracking-[0.24em]" style={{ color: era.color, borderColor: `${era.color}44`, background: `${era.color}12` }}>{era.phase}</span>
                      </div>
                      <h4 className="font-orbit text-[14px] font-semibold text-white">{era.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-[#7891ad]">{era.desc}</p>
                    </div>
                  </DepthLayer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Credentials() {
  const [query, setQuery] = useState("");
  const shown = certOrbits.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <section id="credentials" className="relative py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionHead code="05 · CREDENTIAL CONSTELLATION" title="82+ verified" accent="orbital nodes" sub="A self-directed technical curriculum across nine rings." />
        <div className="relative mb-8 max-w-md">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7891ad]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter credential orbits…" className="spatial-glass w-full rounded-full py-3 pl-11 pr-4 font-data text-xs text-white outline-none placeholder:text-[#7891ad]" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {shown.map((item, index) => (
            <motion.div key={item.name} initial={{ opacity: 0, scale: 0.86, rotateY: 18 }} whileInView={{ opacity: 1, scale: 1, rotateY: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="spatial-glass rounded-2xl p-4 text-center hover:border-cyan-300/35">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${item.color}1e`, color: item.color, boxShadow: `0 0 15px ${item.color}25` }}>
                <i className={`${item.icon} text-base`} />
              </div>
              <div className="font-orbit text-2xl font-bold" style={{ color: item.color }}>{item.count}</div>
              <div className="mt-1 font-data text-[8px] uppercase tracking-wider text-[#7891ad]">{item.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); } catch { /* unavailable */ }
    setCopied(true);
    omni.pulse();
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section id="contact" className="relative py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionHead code="06 · TRANSMISSION RELAY" title="Open a" accent="spatial channel" />
        <div className="spatial-glass hud-corners relative overflow-hidden rounded-[2.5rem] p-7 md:p-10">
          <span className="hud-bottom" /><div className="scan-beam" />
          <div className="relative grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-orbit text-2xl font-bold leading-tight text-white md:text-3xl">Let’s render <span className="spectral-text">something real.</span></h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#7891ad]">Open to Senior Android and edge-AI roles worldwide. Every transmission gets a direct human response.</p>
              <div className="mt-6 space-y-3">
                <a href={`mailto:${profile.email}`} className="spatial-glass-soft flex items-center gap-3.5 rounded-2xl p-4 hover:border-cyan-300/40">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300"><Mail size={16} /></span>
                  <span className="min-w-0 flex-1"><span className="block font-data text-[8px] tracking-[0.22em] text-[#7891ad]">EMAIL RELAY</span><span className="block truncate font-data text-xs text-white">{profile.email}</span></span>
                  <button onClick={(event) => { event.preventDefault(); copy(); }} className="spatial-glass-soft flex h-8 w-8 items-center justify-center rounded-lg text-[#7891ad] hover:text-white" aria-label="Copy email">
                    {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                  </button>
                </a>
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="spatial-glass-soft flex items-center gap-3.5 rounded-2xl p-4 hover:border-violet-300/40">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300"><Phone size={16} /></span>
                  <span><span className="block font-data text-[8px] tracking-[0.22em] text-[#7891ad]">VOICE RELAY</span><span className="block font-data text-xs text-white">{profile.phone}</span></span>
                </a>
                <div className="spatial-glass-soft flex items-center gap-3.5 rounded-2xl p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300"><MapPin size={16} /></span>
                  <span className="text-sm text-white">{profile.location}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-4 text-center font-data text-[9px] tracking-[0.28em] text-[#7891ad]">NETWORK RELAYS</div>
              <div className="grid grid-cols-2 gap-2.5">
                {profile.socials.map((social) => (
                  <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="spatial-glass-soft flex items-center gap-3 rounded-2xl p-3.5 hover:-translate-y-0.5 hover:border-cyan-300/40">
                    <i className={`${social.icon} text-cyan-300`} />
                    <span className="font-data text-[10px] text-white">{social.name}</span>
                  </a>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-black/25 p-5 text-center">
                <p className="text-lg italic text-white">“{profile.philosophy}”</p>
                <div className="mt-2 font-data text-[8px] tracking-[0.28em] text-[#7891ad]">PROJECTED FROM THE OMNI-SPHERE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-cyan-300/10 bg-[#01030af2]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 pb-6 pt-12 md:flex-row md:px-8">
        <span className="font-orbit font-bold tracking-[0.2em] text-white">OMNI<span className="spectral-text">·SPHERE X</span></span>
        <div className="flex flex-wrap justify-center gap-5">
          {NAV.map((item) => <a key={item.id} href={`#${item.id}`} className="font-data text-[9px] uppercase tracking-[0.2em] text-[#7891ad] hover:text-cyan-300">{item.label}</a>)}
        </div>
      </div>
      <div className="overflow-hidden py-4 text-center leading-none pointer-events-none select-none">
        <span className="font-orbit text-[clamp(3rem,15vw,11rem)] font-black text-transparent" style={{ WebkitTextStroke: "1px rgba(104,247,255,.12)" }}>BEYOND DEPTH</span>
      </div>
      <div className="pb-8 text-center font-data text-[9px] tracking-[0.2em] text-[#7891ad]">© 2026 {profile.name} · SENIOR ANDROID & EDGE-AI ARCHITECT · ALL VOLUMES STABLE</div>
    </footer>
  );
}
