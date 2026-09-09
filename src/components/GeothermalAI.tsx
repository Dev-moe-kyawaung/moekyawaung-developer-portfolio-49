import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import { volcano } from "../volcanicAudio";
import { profile } from "../volcanicData";

type Msg = {
  id: string;
  from: "operator" | "geothermal";
  text: string;
  heatZone?: string;
  action?: { label: string; target: string };
};

const HOT_QUERIES = [
  { label: "🔥 Android Core", q: "Explain the Kotlin Android magma" },
  { label: "🧠 AI Magma", q: "How does on-device AI work" },
  { label: "🏗️ Architecture", q: "What is Clean Architecture strata" },
  { label: "🔐 Security", q: "Explain the obsidian security shield" },
  { label: "📜 82+ Certs", q: "Tell me about the 82+ thermal taps" },
  { label: "📡 Contact Moe", q: "How do I hire Moe" },
];

function generateAnswer(query: string): { text: string; heatZone?: string; action?: { label: string; target: string } } {
  const q = query.toLowerCase();

  if (/(kotlin|android|compose|mvvm|mobile)/.test(q)) {
    return {
      text: "🔥 HEAT ZONE: ANDROID MAGMA CORE (4820°C)\n\nMoe's primary geological substrate is Kotlin 2.0 + Jetpack Compose on Android. Unidirectional MVI data flows through sealed interface ViewStates, with Room DB as the Single Source of Truth. Background Coroutines handle network delta-streams while the UI thread stays sub-16ms per frame. PulseSync is the flagship eruption of this pattern.",
      heatZone: "MANTLE.01",
      action: { label: "INSPECT PULSESYNC CORE", target: "#volcanic-cores" },
    };
  }

  if (/(ai|tflite|ml|claude|translator)/.test(q)) {
    return {
      text: "🧠 HEAT ZONE: ON-DEVICE AI MAGMA (3860°C)\n\nRather than cloud roundtrips, Moe quantizes neural weights into INT8 TFLite buffers running on device NPU silicon. MoekyawTranslator achieves 32ms inference in 48MB of RAM — 100% private, zero data leakage. Claude API provides semantic fallback for ambiguous translations.",
      heatZone: "MANTLE.03",
      action: { label: "VIEW TRANSLATOR CORE", target: "#volcanic-cores" },
    };
  }

  if (/(clean|arch|module|domain|layer|mvvm|mvi)/.test(q)) {
    return {
      text: "🏗️ HEAT ZONE: ARCHITECTURE STRATA (4560°C)\n\n12 Gradle modules with strict API/Implementation boundaries. Domain entities live in pure Kotlin — no framework dependencies. UseCases receive sealed intents from ViewModels. This guarantees 100% unit-testable business logic and -62% incremental build duration.",
      heatZone: "MANTLE.02",
      action: { label: "EXPLORE HEAT ZONES", target: "#heat-zones" },
    };
  }

  if (/(secur|hack|keystore|encrypt|aes|shield)/.test(q)) {
    return {
      text: "🔐 HEAT ZONE: OBSIDIAN SECURITY SHIELD (3240°C)\n\nAndroid Hardware Keystore (TEE/SE) anchors cryptographic keys in tamper-resistant silicon. In-memory tokens are wiped immediately after use. AES-256-GCM encryption with biometric CryptoObject authentication. CI/CD pipelines include automated penetration testing matrices.",
      heatZone: "MANTLE.05",
      action: { label: "VIEW SECURITY ZONE", target: "#heat-zones" },
    };
  }

  if (/(cert|82|credential|hub|domain|wing)/.test(q)) {
    return {
      text: "📜 GEOTHERMAL AUDIT: 82+ VERIFIED THERMAL TAPS\n\nStructured certifications across 9 geothermal wings:\n• Programming Languages (13)\n• Web & Full-Stack (13)\n• Mobile & Android (7)\n• Databases (6)\n• AI & Data Science (11)\n• Security & DevOps (10)\n• Blockchain (4)\n• Systems (7)\n• Business (11)\n\nFirst milestone logged July 4, 2024. Google Developers Launchpad endorsed.",
      action: { label: "VISIT THERMAL VAULT", target: "#thermal-vault" },
    };
  }

  if (/(hire|contact|email|signal|job|reach)/.test(q)) {
    return {
      text: "📡 SEISMIC TRANSMISSION AVAILABLE\n\nMoe is actively open for Senior Android Developer and On-Device AI Engineering positions worldwide.\n\nEmail: " + profile.email + "\nPhone: " + profile.phone + "\nGitHub: " + profile.github + "\n\nTypical response time: < 24 hours. Always with tea.",
      action: { label: "OPEN SIGNAL CHANNEL", target: "#signal-vent" },
    };
  }

  if (/(who|about|moe|developer|engineer)/.test(q)) {
    return {
      text: "🌋 VOLCANIC PROFILE ANALYSIS\n\nMoe Kyaw Aung — Senior Android Developer operating between Tachileik, Myanmar and Bangkok, Thailand. 3+ years of eruption cycles. 82+ verified credentials. Currently forging MoekyawTranslator (on-device AI translation) and PulseSync (multi-module realtime platform). Philosophy: Code with culture. Build with purpose.",
      action: { label: "EXPLORE ALL CORES", target: "#volcanic-cores" },
    };
  }

  return {
    text: "🌡️ GEOTHERMAL QUERY AMBIGUITY\n\nUnrecognized seismic frequency. I can analyze:\n• ANDROID/KOTLIN magma core\n• ON-DEVICE AI eruption\n• CLEAN ARCHITECTURE strata\n• SECURITY obsidian shield\n• 82+ CERTIFICATIONS vault\n• CONTACT channels\n\nSelect a heat query below or name your geological interest.",
    action: { label: "VIEW ALL HEAT ZONES", target: "#heat-zones" },
  };
}

export default function GeothermalAI() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{
    id: "init", from: "geothermal",
    text: "GEOTHERMAL ANALYZER v3.0 ONLINE. I map Moe Kyaw Aung's engineering heat zones — from surface-level UI to deep magma-architecture. Name a thermal query or select a heat probe below.",
  }]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const greeted = useRef(false);

  // Seismic activity needle animation
  const [needleAngle, setNeedleAngle] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setNeedleAngle(busy ? (Math.random() - 0.5) * 60 : Math.sin(Date.now() * 0.001) * 15);
    }, 150);
    return () => clearInterval(id);
  }, [busy]);

  // Proactive nudge
  useEffect(() => {
    const id = setTimeout(() => {
      if (!greeted.current && !open) setUnread(true);
    }, 6000);
    return () => clearTimeout(id);
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [msgs, streaming, open]);

  const streamAnswer = (full: string, heatZone?: string, action?: Msg["action"]) => {
    setBusy(true);
    volcano.rumble();
    let i = 0;
    setStreaming("");
    const interval = setInterval(() => {
      i += 3;
      setStreaming(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(interval);
        setStreaming("");
        setMsgs((prev) => [...prev, { id: Date.now().toString(), from: "geothermal", text: full, heatZone, action }]);
        setBusy(false);
        volcano.erupt();
      }
    }, 18);
  };

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q || busy) return;
    volcano.crackle();
    setMsgs((prev) => [...prev, { id: Date.now().toString(), from: "operator", text: q }]);
    setInput("");
    const result = generateAnswer(q);
    setTimeout(() => streamAnswer(result.text, result.heatZone, result.action), 380);
  };

  const seismicFill = busy ? 80 : 20 + Math.abs(Math.sin(Date.now() * 0.001)) * 30;

  return (
    <>
      {/* Floating Geothermal Sensor Device */}
      <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-center gap-2">
        <AnimatePresence>
          {!open && unread && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="volc-glass rounded-full px-3.5 py-1.5 f-mono text-[10px] tracking-widest text-[#fef3e2] border border-[rgba(255,107,26,0.4)]">
              <span className="text-[#ff6b1a]">🔥</span> GEOTHERMAL STIRS…
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => { volcano.thermalPulse(); setOpen((o) => !o); setUnread(false); greeted.current = true; }}
          aria-label="Geothermal AI" className="relative group">
          {/* Lava rings */}
          <span className="absolute inset-0 rounded-full border border-[rgba(255,107,26,0.6)]" style={{ animation: "eruption-burst 2.4s ease-out infinite" }} />
          <span className="absolute inset-0 rounded-full border border-[rgba(255,209,102,0.4)]" style={{ animation: "eruption-burst 2.4s ease-out infinite", animationDelay: "1.2s" }} />

          {/* Sensor casing */}
          <div className="relative w-16 h-16 rounded-full volc-deep flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform" style={{ animation: busy ? "vent-glow 0.8s ease-in-out infinite" : "vent-glow 3s ease-in-out infinite" }}>
            {/* Seismic needle */}
            <svg viewBox="0 0 64 64" className="w-14 h-14">
              <circle cx="32" cy="32" r="28" fill="rgba(10,10,8,0.95)" stroke="#ff6b1a" strokeWidth="1.4" />
              {/* Heat zone marks */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
                const a = (i / 12) * Math.PI * 2;
                return <line key={i} x1={32 + Math.cos(a) * 22} y1={32 + Math.sin(a) * 22} x2={32 + Math.cos(a) * 26} y2={32 + Math.sin(a) * 26} stroke="#ff9a44" strokeWidth={i % 3 === 0 ? "1.6" : "0.8"} strokeLinecap="round" />;
              })}
              {/* Seismic needle */}
              <g style={{ transformOrigin: "32px 32px", transform: `rotate(${needleAngle}deg)`, transition: "transform 0.15s ease" }}>
                <line x1="32" y1="32" x2="32" y2="10" stroke="#ffd166" strokeWidth="2" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px #ffd166)" }} />
              </g>
              <circle cx="32" cy="32" r="3" fill="#ff6b1a" />
              {/* Seismic activity fill ring */}
              <circle cx="32" cy="32" r="28" fill="none" stroke="#ff6b1a" strokeWidth="2" strokeDasharray={`${seismicFill} ${200 - seismicFill}`} strokeDashoffset="50" opacity="0.5" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#ffd166] animate-ping" />
            </div>
          </div>
          <span className="f-mono text-[9px] tracking-[0.25em] text-[#a89b8c] mt-1 block text-center">GEOTHERMAL-AI</span>
        </button>
      </div>

      {/* Main Geothermal Analyzer Console */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed z-[85] right-4 sm:right-6 bottom-[118px] w-[min(94vw,420px)] volc-deep rounded-3xl overflow-hidden border border-[rgba(255,107,26,0.4)] shadow-2xl"
          >
            {/* Seismic Header */}
            <div className="px-5 py-4 border-b border-[rgba(255,107,26,0.2)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl volc-glass flex items-center justify-center text-[#ff6b1a] border border-[rgba(255,107,26,0.3)]">
                  <Flame size={17} className={busy ? "animate-spin" : "animate-magma-pulse"} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="f-display text-sm tracking-wide text-[#fef3e2] flex items-center gap-2">
                    GEOTHERMAL ANALYZER
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffd166] animate-blink-soft" />
                  </div>
                  <div className="f-mono text-[10px] text-[#a89b8c] tracking-widest">
                    {busy ? "SEISMIC ANALYSIS IN PROGRESS…" : "GEOTHERMAL LINK STABLE"}
                  </div>
                </div>
                <button onClick={() => { volcano.crackle(); setOpen(false); }} className="w-8 h-8 rounded-full volc-glass flex items-center justify-center text-[#a89b8c] hover:text-white" aria-label="Close">✕</button>
              </div>

              {/* Seismic Activity Bar */}
              <div className="mt-3">
                <div className="flex justify-between f-mono text-[9px] tracking-widest text-[#a89b8c] mb-1">
                  <span>SEISMIC ACTIVITY</span>
                  <span style={{ color: busy ? "#ef4444" : "#ff6b1a" }}>{busy ? "TREMOR" : "DORMANT"}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{
                    width: `${seismicFill}%`,
                    background: busy ? "linear-gradient(90deg,#ef4444,#ff6b1a,#ffd166)" : "linear-gradient(90deg,#ff6b1a,#ffd166)",
                    boxShadow: `0 0 12px ${busy ? "#ef4444" : "#ff6b1a"}`,
                  }} />
                </div>
              </div>
            </div>

            {/* Message Log */}
            <div ref={boxRef} className="h-[300px] overflow-y-auto px-4 py-3 space-y-2.5 hide-scroll bg-[rgba(5,5,4,0.5)]">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "operator" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.from === "operator"
                      ? "rounded-br-md text-[#050504] font-medium"
                      : "rounded-bl-md text-[#fef3e2]"
                  }`}
                    style={m.from === "operator"
                      ? { background: "linear-gradient(120deg,#ff9a44,#ff6b1a)" }
                      : { background: "rgba(255,107,26,0.08)", border: "1px solid rgba(255,107,26,0.2)" }
                    }
                  >
                    <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>
                    {m.heatZone && (
                      <div className="mt-2 pt-2 border-t border-[rgba(255,107,26,0.2)] f-mono text-[10px] tracking-widest text-[#ff6b1a]">
                        ● HEAT ZONE: {m.heatZone}
                      </div>
                    )}
                    {m.action && (
                      <a href={m.action.target}
                        onClick={() => volcano.thermalPulse()}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full f-mono text-[10px] font-bold text-[#050504] hover:scale-105 active:scale-95 transition-transform"
                        style={{ background: "linear-gradient(90deg,#ffd166,#ff6b1a)" }}>
                        {m.action.label} <ArrowRight size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {streaming && (
                <div className="flex justify-start">
                  <div className="max-w-[88%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-xs text-[#fef3e2]"
                    style={{ background: "rgba(255,107,26,0.08)", border: "1px solid rgba(255,107,26,0.3)", whiteSpace: "pre-line" }}>
                    {streaming}<span className="caret-v" />
                  </div>
                </div>
              )}
              {busy && !streaming && (
                <div className="flex justify-start">
                  <div className="rounded-full px-4 py-2 flex gap-1.5 volc-glass">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#ff6b1a]" style={{ animation: "blink-soft 0.9s ease-in-out infinite", animationDelay: `${d * 0.18}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Heat Probe Chips */}
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {HOT_QUERIES.map((hq) => (
                <button key={hq.label} onClick={() => send(hq.q)}
                  className="f-mono text-[10px] tracking-wider px-2.5 py-1.5 rounded-lg border border-[rgba(255,107,26,0.25)] text-[#ff9a44] hover:bg-[rgba(255,107,26,0.12)] transition-colors">
                  {hq.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t border-[rgba(255,107,26,0.2)] flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Query heat zones (Kotlin, AI, certs, security)…"
                className="flex-1 bg-black/30 border border-[rgba(255,107,26,0.25)] rounded-full px-4 py-2.5 text-xs text-[#fef3e2] placeholder:text-[#a89b8c]/60 focus:outline-none focus:border-[#ff6b1a]" />
              <button type="submit" disabled={busy || !input.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#050504] font-bold shrink-0 disabled:opacity-40 hover:scale-105 active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg,#ffd166,#ff6b1a)", boxShadow: "0 0 18px rgba(255,107,26,0.4)" }}>
                <ArrowRight size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
