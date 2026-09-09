import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { holoNodes, profile } from "../omnisphereData";
import { omni } from "../omnisphereAudio";

type Message = {
  id: string;
  from: "user" | "aura";
  text: string;
  action?: { label: string; target: string };
};

const prompts = [
  "Render PulseSync",
  "Explain edge AI",
  "Show architecture",
  "Map skills",
  "Open contact",
];

function replyFor(query: string): { text: string; action?: Message["action"] } {
  const text = query.toLowerCase();
  if (/pulse|sync|real.?time/.test(text)) {
    const node = holoNodes[0];
    return {
      text: `PROJECTING ${node.name.toUpperCase()} IN 3D…\n\n01 PRESENTATION\nCompose emits sealed MVI intents into immutable ViewState.\n\n02 DOMAIN\nPure Kotlin UseCases hold business rules without framework coupling.\n\n03 DATA\nRoom StateFlow is the single source of truth.\n\n04 CIRCULATION\nWorkManager applies Firebase delta streams off the render thread.\n\nTelemetry: <280ms cold start · 60 FPS · 99.98% crash-free.`,
      action: { label: "Focus project constellation", target: "#projects" },
    };
  }
  if (/ai|tflite|edge|translator|model/.test(text)) {
    return {
      text: "EDGE-AI VOLUME RESOLVED.\n\nMoekyawTranslator compresses neural weights to an 18MB INT8 tensor. Camera and audio streams enter native buffers, the TFLite interpreter fires in ~32ms on the device NPU, and only low-confidence results route to Claude API. Privacy is the default spatial boundary: zero bytes leave the device during local inference.",
      action: { label: "Inspect edge-AI node", target: "#projects" },
    };
  }
  if (/architect|clean|module|mvvm|mvi|layer/.test(text)) {
    return {
      text: "ARCHITECTURE LATTICE ASSEMBLED.\n\nTwelve Gradle modules form four concentric shells: UI → Presentation → Domain → Data. Dependency vectors point inward. Strict API/Implementation fences protect each feature volume, enabling instant JVM unit tests, dynamic delivery, and a 62% reduction in incremental build time.",
      action: { label: "View capability rings", target: "#capabilities" },
    };
  }
  if (/skill|stack|map|capabil/.test(text)) {
    return {
      text: "CAPABILITY ATLAS: Kotlin/Android 98 · Clean Architecture 95 · Firebase/REST 90 · Security/CI 91 · On-device AI 88 · React/TypeScript 84. The strongest intersection is senior Android architecture with private edge intelligence.",
      action: { label: "Open capability atlas", target: "#capabilities" },
    };
  }
  if (/cert|82|credential|learn/.test(text)) {
    return {
      text: "CERTIFICATION CONSTELLATION MAPPED: 82+ verified nodes across nine orbital rings — languages, web, mobile, data, AI, security, blockchain, systems, and business. First node logged July 4, 2024. Google Developers Launchpad endorsed.",
      action: { label: "Open credentials", target: "#credentials" },
    };
  }
  if (/hire|contact|email|signal|open/.test(text)) {
    return {
      text: `TRANSMISSION RELAY READY.\n\n${profile.email}\n${profile.phone}\n\nMoe is open to Senior Android and edge-AI roles worldwide. Typical response latency: under one Earth rotation.`,
      action: { label: "Open transmission relay", target: "#contact" },
    };
  }
  if (/who|you|aura|moe|about/.test(text)) {
    return {
      text: "I am AURA-X, the spatial architecture entity of Moe Kyaw Aung’s omni-sphere. I translate systems into layered 3D models: project constellations, data-flow vectors, production telemetry, and technology volumes. Ask me to render any architecture.",
    };
  }
  return {
    text: "SIGNAL DIFFRACTION DETECTED. I can render PulseSync, edge AI, Clean Architecture, capability rings, the 82-node credential constellation, or the contact relay. Select a coordinate below.",
  };
}

function EntityCore({ busy }: { busy: boolean }) {
  return (
    <div className="relative h-[72px] w-[72px] preserve-3d">
      <span className="absolute inset-0 rounded-full border border-cyan-300/60" style={{ animation: "pulse-orbit 2.5s ease-out infinite" }} />
      <span className="absolute inset-0 rounded-full border border-violet-400/55" style={{ animation: "pulse-orbit 2.5s ease-out infinite", animationDelay: "1.25s" }} />
      <div className="absolute inset-[5px] rounded-full border border-cyan-300/45 bg-[#071629cc] animate-spin-slow">
        <div className="absolute inset-[12px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,#68f7ff_24%,#8d6bff_52%,transparent_78%)]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full bg-[#01030a] ${busy ? "scale-y-50" : ""}`} />
        <span className={`h-1.5 w-1.5 rounded-full bg-[#01030a] ${busy ? "scale-y-50" : ""}`} />
      </div>
      <span className="absolute inset-[-5px] rounded-full border border-dashed border-cyan-300/25 animate-spin-reverse" />
    </div>
  );
}

export default function AuraX() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      from: "aura",
      text: "AURA-X ONLINE. I am Moe’s holographic architecture entity. I can project any system as layered 3D space. Choose a coordinate or transmit a query.",
    },
  ]);
  const [input, setInput] = useState("");
  const [stream, setStream] = useState("");
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const greeted = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!greeted.current && !open) setUnread(true);
    }, 6500);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, stream, open]);

  const send = (raw: string) => {
    const query = raw.trim();
    if (!query || busy) return;
    omni.glint();
    setMessages((value) => [...value, { id: `${Date.now()}-u`, from: "user", text: query }]);
    setInput("");
    setBusy(true);
    const response = replyFor(query);
    window.setTimeout(() => {
      let index = 0;
      const timer = window.setInterval(() => {
        index += 3;
        setStream(response.text.slice(0, index));
        if (index >= response.text.length) {
          window.clearInterval(timer);
          setStream("");
          setMessages((value) => [...value, {
            id: `${Date.now()}-a`,
            from: "aura",
            text: response.text,
            action: response.action,
          }]);
          setBusy(false);
          omni.holoChime();
        }
      }, 18);
    }, 360);
  };

  const navigate = (target: string) => {
    omni.sweep();
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-center gap-2">
        <AnimatePresence>
          {!open && unread && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="spatial-glass rounded-full px-3 py-1.5 font-data text-[9px] tracking-[0.2em] text-cyan-100">
              ◈ AURA-X REQUESTS LINK
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => {
            omni.pulse();
            setOpen((value) => !value);
            setUnread(false);
            greeted.current = true;
          }}
          aria-label="Open AURA-X hologram architect"
          data-spatial
        >
          <EntityCore busy={busy} />
        </button>
        <span className="font-data text-[8px] tracking-[0.28em] text-[#7891ad]">AURA-X</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 18, scale: 0.96, rotateX: -8 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="spatial-glass hud-corners fixed bottom-[120px] right-4 z-[100] w-[min(94vw,430px)] overflow-hidden rounded-3xl sm:right-6"
          >
            <span className="hud-bottom" />
            <div className="scan-beam" />
            <div className="relative flex items-center gap-3 border-b border-cyan-300/10 px-4 py-4">
              <EntityCore busy={busy} />
              <div className="min-w-0 flex-1">
                <div className="font-orbit text-[13px] font-bold tracking-wide text-white">AURA-X</div>
                <div className="font-data text-[9px] tracking-[0.2em] text-[#7891ad]">
                  {busy ? "RENDERING DEPTH VOLUME…" : "SPATIAL ARCHITECT ENTITY · LINK STABLE"}
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="spatial-glass-soft flex h-8 w-8 items-center justify-center rounded-full text-[#7891ad] hover:text-white" aria-label="Close">
                <X size={14} />
              </button>
            </div>

            <div ref={scrollRef} className="relative h-[300px] space-y-2.5 overflow-y-auto bg-[#01030a66] px-4 py-3 hide-scroll">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${message.from === "user" ? "rounded-br-md font-medium text-[#01030a]" : "spatial-glass-soft rounded-bl-md text-[#dff8ff]"}`}
                    style={message.from === "user" ? { background: "linear-gradient(120deg,#68f7ff,#8d6bff)" } : {}}>
                    {message.text}
                    {message.action && (
                      <button onClick={() => navigate(message.action!.target)} className="mt-2 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 px-3 py-1.5 font-data text-[9px] font-bold text-[#01030a]">
                        {message.action.label} <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {stream && (
                <div className="flex justify-start">
                  <div className="spatial-glass-soft max-w-[88%] whitespace-pre-line rounded-2xl rounded-bl-md px-3.5 py-2.5 text-xs leading-relaxed text-[#dff8ff]">
                    {stream}<span className="caret-spatial" />
                  </div>
                </div>
              )}
              {busy && !stream && (
                <div className="flex justify-start">
                  <div className="spatial-glass-soft flex gap-1.5 rounded-full px-4 py-2">
                    {[0, 1, 2].map((index) => <span key={index} className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" style={{ animationDelay: `${index * 0.16}s` }} />)}
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex flex-wrap gap-1.5 px-4 pb-2">
              {prompts.map((prompt) => (
                <button key={prompt} onClick={() => send(prompt)} className="rounded-lg border border-cyan-300/20 px-2.5 py-1.5 font-data text-[9px] text-cyan-100/80 hover:bg-cyan-300/10">
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={(event) => { event.preventDefault(); send(input); }} className="relative flex gap-2 border-t border-cyan-300/10 p-3">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Project an architecture query…" className="flex-1 rounded-full border border-cyan-300/20 bg-black/30 px-4 py-2.5 text-xs text-white outline-none placeholder:text-[#7891ad] focus:border-cyan-300/60" />
              <button type="submit" disabled={busy || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-violet-400 text-[#01030a] disabled:opacity-40" aria-label="Send">
                <Sparkles size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}