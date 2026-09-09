import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { omni } from "../omnisphereAudio";
import { profile } from "../omnisphereData";

type Msg = { id: string; from: "user" | "entity"; text: string; action?: { label: string; target: string } };

const PRESETS = [
  { label: "PulseSync architecture", q: "Explain PulseSync architecture in 3D layers" },
  { label: "Edge AI core", q: "How does MoekyawTranslator run on-device?" },
  { label: "Clean Architecture", q: "Explain the multi-module Clean Architecture layers" },
  { label: "Security lattice", q: "How is mobile security handled?" },
  { label: "82+ nodes", q: "Tell me about the 82 certifications" },
  { label: "Hire", q: "How do I contact Moe?" },
];

function answer(q: string): { text: string; action?: { label: string; target: string } } {
  const s = q.toLowerCase();
  if (/(pulse|sync|realtime|real-time)/.test(s)) {
    return {
      text: "◈ RENDERING PULSESYNC IN 3D SPACE…\n\nLAYER 01 — PRESENTATION\nJetpack Compose emits sealed MVI intents; the UI only observes immutable ViewState.\n\nLAYER 02 — DOMAIN\nPure-Kotlin UseCases hold business rules. Zero Android imports → 100% JVM-testable.\n\nLAYER 03 — DATA\nRepository contracts sit behind interfaces; Room DB StateFlow is the single source of truth.\n\nLAYER 04 — CIRCULATION\nWorkManager applies Firebase delta streams in the background, never blocking the 60fps render thread.\n\nResult: <280ms cold start, 99.98% crash-free, -62% build time.",
      action: { label: "◉ FOCUS PULSESYNC NODE", target: "#nodes" },
    };
  }
  if (/(translat|tflite|ai|edge|ml|on-device|model)/.test(s)) {
    return {
      text: "◈ PROJECTING EDGE-AI CORE…\n\nMoekyawTranslator executes entirely on the device's NPU:\n\n• Neural weights are post-training quantized to INT8, shrinking 75% down to 18MB\n• Camera/audio streams enter native tensor buffers via the NDK\n• The TFLite interpreter fires inference in ~32ms\n• A confidence gate routes ambiguous cases to Claude API\n\nZero data leaves the device when confidence is high — privacy by architectural default.",
      action: { label: "◉ INSPECT TRANSLATOR NODE", target: "#nodes" },
    };
  }
  if (/(clean|module|mvvm|mvi|domain|layer)/.test(s)) {
    return {
      text: "◈ ASSEMBLING ARCHITECTURE LATTICE…\n\nTwelve Gradle feature modules are fenced with strict API/Implementation boundaries:\n\napp → feature modules → domain (pure Kotlin) → data contracts → Room/Firebase implementations.\n\nDependency arrows only point inward. This guarantees:\n• Compile-time isolation\n• Instant JVM unit tests\n• Dynamic feature delivery\n• -62% incremental build time",
      action: { label: "◉ VIEW SKILL ORBS", target: "#skills" },
    };
  }
  if (/(secur|hack|encrypt|keystore|privacy|aes)/.test(s)) {
    return {
      text: "◈ RAISING SECURITY LATTICE…\n\n• Cryptographic keys are generated inside the Android Keystore TEE/SE and never leave silicon\n• AES-256-GCM wraps all local secrets\n• BiometricPrompt unlocks a CryptoObject bound to the keystore key\n• Tokens are wiped from memory immediately after use\n• CI runs an automated penetration matrix every build",
      action: { label: "◉ REVIEW HEAT ORBS", target: "#skills" },
    };
  }
  if (/(cert|82|credential|hub|wing|learn)/.test(s)) {
    return {
      text: "◈ MAPPING CERTIFICATION CONSTELLATION…\n\n82+ verified nodes across 9 orbital rings:\nProgramming (13) · Web (13) · Mobile (7) · Data (6) · AI (11) · Security (10) · Blockchain (4) · Systems (7) · Business (11).\n\nGoogle Developers Launchpad endorsed. First node logged Jul 4, 2024.",
      action: { label: "◉ OPEN CONSTELLATION", target: "#constellation" },
    };
  }
  if (/(hire|contact|email|reach|signal|job)/.test(s)) {
    return {
      text: `◈ OPENING TRANSMISSION CHANNEL…\n\n${profile.email}\n${profile.phone}\nGitHub: ${profile.github}\n\nTypical response latency: under one rotation of Earth. Available worldwide for Senior Android & edge-AI roles.`,
      action: { label: "◉ TRANSMIT", target: "#contact" },
    };
  }
  if (/(who|moe|about|you|entity)/.test(s)) {
    return {
      text: "◈ IDENTIFICATION:\n\nI am AURA-9, a holographic projection of Moe Kyaw Aung's engineering lattice — Senior Android Developer & on-device AI engineer operating between Myanmar and Thailand. Ask me to render any project in 3D layers, explain the architecture, or open a transmission channel.",
    };
  }
  return {
    text: "◈ SIGNAL TOO DIFFRACTED. I can project: PulseSync layers, edge-AI core, Clean Architecture lattice, security lattice, the 82-node certification constellation, or open a transmission channel. Select a coordinate below.",
  };
}

export default function HoloEntity() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "0", from: "entity", text: "◈ AURA-9 ONLINE.\nI am the holographic entity of this omni-sphere. I can render Moe's architecture in multi-layer 3D space. Name a system — PulseSync, the edge-AI translator, Clean Architecture — or select a coordinate." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [stream, setStream] = useState("");
  const [unread, setUnread] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);
  const greeted = useRef(false);

  useEffect(() => {
    const id = setTimeout(() => { if (!greeted.current && !open) setUnread(true); }, 7000);
    return () => clearTimeout(id);
  }, [open]);
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [msgs, stream, open]);

  const streamOut = (full: string, action?: Msg["action"]) => {
    setBusy(true); omni.sweep();
    let i = 0; setStream("");
    const id = setInterval(() => {
      i += 3; setStream(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id); setStream("");
        setMsgs((m) => [...m, { id: Date.now().toString(), from: "entity", text: full, action }]);
        setBusy(false); omni.holoChime();
      }
    }, 16);
  };

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q || busy) return;
    omni.glint();
    setMsgs((m) => [...m, { id: Date.now().toString(), from: "user", text: q }]);
    setInput("");
    const r = answer(q);
    setTimeout(() => streamOut(r.text, r.action), 380);
  };

  const go = (target: string) => { omni.pulse(); document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return (
    <>
      {/* Floating hologram entity */}
      <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-center gap-2">
        <AnimatePresence>
          {!open && unread && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="holo-panel rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-widest text-[#e0f7ff] border border-[rgba(0,229,255,0.4)] whitespace-nowrap">
              <span className="text-[#00e5ff]">◈</span> AURA-9 PROJECTING…
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => { omni.pulse(); setOpen((o) => !o); setUnread(false); greeted.current = true; }}
          aria-label="Hologram entity" className="relative group" style={{ perspective: 600 }}>
          {/* pulsing rings */}
          <span className="absolute inset-0 rounded-full border border-[rgba(0,229,255,0.6)]" style={{ animation: "pulse-core 2.6s ease-out infinite" }} />
          <span className="absolute inset-0 rounded-full border border-[rgba(124,77,255,0.5)]" style={{ animation: "pulse-core 2.6s ease-out infinite", animationDelay: "1.3s" }} />

          {/* 3D rotating holo head/core */}
          <div className="relative w-[70px] h-[70px] animate-flicker"
            style={{
              transformStyle: "preserve-3d",
              animation: busy ? "spin3d 3s linear infinite, holo-flicker 5s linear infinite" : "spin3d 9s linear infinite, holo-flicker 7s linear infinite",
            }}>
            {/* wire icosahedron-ish head: SVG front face */}
            <svg viewBox="0 0 70 70" className="w-full h-full">
              <defs>
                <radialGradient id="holocore" cx="50%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="45%" stopColor="#18ffff" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#7c4dff" stopOpacity="0.25" />
                </radialGradient>
              </defs>
              <circle cx="35" cy="35" r="31" fill="rgba(4,10,24,0.85)" stroke="#00e5ff" strokeWidth="1.4" />
              <circle cx="35" cy="35" r="23" fill="url(#holocore)" stroke="#18ffff" strokeWidth="0.8" strokeOpacity="0.7" />
              {/* longitude lines */}
              {[0, 30, 60, 90, 120, 150].map((deg) => (
                <ellipse key={deg} cx="35" cy="35" rx={23 * Math.abs(Math.cos((deg * Math.PI) / 180)) + 4} ry="23"
                  fill="none" stroke="#00e5ff" strokeWidth="0.6" strokeOpacity="0.5" />
              ))}
              {/* face/eyes hint */}
              <circle cx="28" cy="33" r="2.2" fill="#ffffff" />
              <circle cx="42" cy="33" r="2.2" fill="#ffffff" />
              <path d="M27 42 Q35 46 43 42" fill="none" stroke="#e0f7ff" strokeWidth="1.1" strokeLinecap="round" />
              {/* orbiting node */}
              <circle cx="35" cy="4" r="2.4" fill="#ffd740" style={{ filter: "drop-shadow(0 0 5px #ffd740)" }} />
            </svg>
            {/* rotating horizontal ring */}
            <div className="absolute inset-[-6px] rounded-full border border-dashed border-[rgba(0,229,255,0.5)]" style={{ transform: "rotateX(72deg)", animation: "spin3d-rev 6s linear infinite" }} />
          </div>

          {/* base projection lines */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-0.5 bg-[#00e5ff]" style={{ height: 4 + i * 2, opacity: 0.7 - i * 0.2, boxShadow: "0 0 6px #00e5ff" }} />
            ))}
          </div>
          {unread && !open && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff4081] text-white text-[10px] font-bold flex items-center justify-center" style={{ boxShadow: "0 0 12px #ff4081" }}>1</span>}
        </button>
        <span className="font-mono text-[9px] tracking-[0.3em] text-[#7fa8c9]">AURA-9</span>
      </div>

      {/* Hologram console */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.96, rotateX: -8 }}
            transition={{ type: "spring", damping: 24, stiffness: 240 }}
            className="fixed z-[85] right-4 sm:right-6 bottom-[118px] w-[min(94vw,420px)] holo-panel holo-brackets rounded-3xl overflow-hidden border border-[rgba(0,229,255,0.45)] shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="b-bracket" />
            <div className="holo-scan" />
            {/* Header */}
            <div className="relative px-5 py-4 border-b border-[rgba(0,229,255,0.2)] flex items-center gap-3">
              <div className="relative w-10 h-10" style={{ animation: "spin3d 7s linear infinite" }}>
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <circle cx="20" cy="20" r="17" fill="rgba(4,10,24,0.85)" stroke="#00e5ff" strokeWidth="1.2" />
                  <circle cx="20" cy="20" r="11" fill="rgba(24,255,255,0.25)" stroke="#18ffff" strokeWidth="0.7" />
                  <circle cx="16" cy="19" r="1.4" fill="#fff" />
                  <circle cx="24" cy="19" r="1.4" fill="#fff" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-orbitron text-sm tracking-wide text-[#e0f7ff] flex items-center gap-2">
                  AURA-9 <span className="w-1.5 h-1.5 rounded-full bg-[#69f0ae] animate-pulse" />
                </div>
                <div className="font-mono text-[10px] tracking-widest text-[#7fa8c9]">
                  {busy ? "RENDERING 3D LAYERS…" : "HOLOGRAPHIC ARCHITECT ENTITY"}
                </div>
              </div>
              <button onClick={() => { omni.glint(); setOpen(false); }} className="w-8 h-8 rounded-full holo-panel text-[#7fa8c9] hover:text-white text-sm" aria-label="Close">✕</button>
            </div>

            {/* Messages */}
            <div ref={box} className="relative h-[300px] overflow-y-auto px-4 py-3 space-y-2.5 hide-scroll bg-[rgba(2,5,13,0.55)]">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.from === "user"
                      ? "rounded-br-md text-[#02121a] font-medium"
                      : "rounded-bl-md text-[#d9f6ff] holo-panel"
                  }`}
                    style={m.from === "user" ? { background: "linear-gradient(120deg,#18ffff,#00e5ff)" } : { border: "1px solid rgba(0,229,255,0.25)" }}>
                    {m.text}
                    {m.action && (
                      <button onClick={() => go(m.action!.target)}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold text-[#02121a] hover:scale-105 transition-transform"
                        style={{ background: "linear-gradient(90deg,#18ffff,#7c4dff)", color: "#fff" }}>
                        {m.action.label}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {stream && (
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md px-3.5 py-2.5 text-xs text-[#d9f6ff] leading-relaxed whitespace-pre-line holo-panel" style={{ border: "1px solid rgba(0,229,255,0.3)" }}>
                    {stream}<span className="caret-h" />
                  </div>
                </div>
              )}
              {busy && !stream && (
                <div className="flex justify-start">
                  <div className="rounded-full px-4 py-2 flex gap-1.5 holo-panel">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" style={{ animation: "blink-h 0.9s ease-in-out infinite", animationDelay: `${d * 0.18}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="relative px-4 pb-2 flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button key={p.label} onClick={() => send(p.q)}
                  className="font-mono text-[10px] tracking-wide px-2.5 py-1.5 rounded-lg border border-[rgba(0,229,255,0.25)] text-[#9fe9ff] hover:bg-[rgba(0,229,255,0.12)] transition-colors">
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="relative p-3 border-t border-[rgba(0,229,255,0.2)] flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Project an architecture query…"
                className="flex-1 bg-black/30 border border-[rgba(0,229,255,0.25)] rounded-full px-4 py-2.5 text-xs text-[#e0f7ff] placeholder:text-[#7fa8c9]/60 focus:outline-none focus:border-[#00e5ff]" />
              <button type="submit" disabled={busy || !input.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#02121a] disabled:opacity-40 hover:scale-105 active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg,#18ffff,#7c4dff)", boxShadow: "0 0 18px rgba(0,229,255,0.4)" }} aria-label="Send">
                <i className="fa-solid fa-paper-plane text-sm" style={{ color: "#fff" }} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
