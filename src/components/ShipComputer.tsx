import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Binary, Satellite, X } from "lucide-react";
import { captain, missionLogs } from "../warpData";
import { warp } from "../warpAudio";

type Msg = {
  id: string;
  from: "captain" | "computer";
  text: string;
  priority?: "NORMAL" | "PRIORITY" | "CRITICAL";
  action?: { label: string; target: string };
};

const COMMANDS = [
  { label: "Mission PulseSync", q: "Status of PulseSync mission" },
  { label: "Mission Translator", q: "Status of MoekyawTranslator" },
  { label: "All missions", q: "List all missions" },
  { label: "Skill modules", q: "Show skill modules" },
  { label: "Stardate log", q: "Show stardate log" },
  { label: "Open hailing", q: "Open hailing frequencies" },
];

function respond(q: string): { text: string; priority?: Msg["priority"]; action?: Msg["action"] } {
  const s = q.toLowerCase();
  if (/(pulse|sync|real.?time)/.test(s)) {
    return {
      text: "MISSION PULSESYNC — CLASSIFICATION OMEGA\n\nVESSEL STATUS: Multi-module Android flagship.\nWARP-CORE: Kotlin + Compose + Room + Firebase.\nREADINGS: <280ms cold boot · 60 FPS · -62% build time · 99.98% crash-free.\n\nMISSION STATUS: Accomplished. All crew accounted for.",
      priority: "PRIORITY",
      action: { label: "⌖ Navigate to mission", target: "#missions" },
    };
  }
  if (/(translat|tflite|edge.?ai|moekyaw)/.test(s)) {
    return {
      text: "MISSION MOEKYAWTRANSLATOR — CLASSIFICATION ALPHA\n\nVESSEL TYPE: Edge-AI translation vessel.\nPROPULSION: INT8 TFLite neurons on ship NPU.\nREADINGS: 32ms inference · 48 MB memory · 100% offline · zero data leakage.\n\nMISSION STATUS: In orbit. Awaiting captain's orders.",
      priority: "PRIORITY",
      action: { label: "⌖ Navigate to mission", target: "#missions" },
    };
  }
  if (/(mission|log|expedition|project|app)/.test(s)) {
    return {
      text: `STARFLEET MISSION LOG — 8 RECORDED OPERATIONS\n\nCLASS OMEGA: PulseSync Platform\nCLASS ALPHA: MoekyawTranslator\nCLASS BETA: POS Ultimate Pro Max\nCLASS GAMMA: Social Dashboard, Job Portal\nCLASS DELTA: Arcade Colony, PWA Mycelium, Reelplay\n\nTotal crew engagements: ${missionLogs.length}. Recommend proceeding to mission board.`,
      action: { label: "⌖ Open mission board", target: "#missions" },
    };
  }
  if (/(skill|module|system|gear|stack|tech)/.test(s)) {
    return {
      text: "SHIP SYSTEMS DIAGNOSTIC\n\nPRIMARY WEAPONS ······ Kotlin/Android 98%\nSTRUCTURAL INTEGRITY ·· Clean Architecture 95%\nSENSOR ARRAY ··········· On-Device AI 88%\nSUBSPACE LINKS ········· Backend/Firebase 90%\nDEFLECTOR SHIELDS ······ Security/DevOps 91%\nAUXILIARY SYSTEMS ······ Web/TypeScript 84%\n\nAll systems nominal. Ready to engage warp.",
      action: { label: "⌖ View ship systems", target: "#systems" },
    };
  }
  if (/(stardate|timeline|career|journey|history)/.test(s)) {
    return {
      text: "STARDATE LOG\n\nSD-01 · 2023 · COMMISSIONING · USS Kotlin launched\nSD-02 · 2024 · STARFLEET ACADEMY · 82+ certifications\nSD-03 · 2025 · WARP-DRIVE INSTALLED · Senior altitude\nSD-04 · 2026 · DEEP SPACE MISSION · Edge-AI frontier\n\nVessel currently operating in Sector 7-G.",
      action: { label: "⌖ View stardate log", target: "#stardate" },
    };
  }
  if (/(hail|contact|email|signal|hire|open)/.test(s)) {
    return {
      text: `HAILING FREQUENCIES OPEN\n\nSUBSPACE CHANNEL: ${captain.email}\nAUDIO CHANNEL: ${captain.phone}\n\nIncoming transmission expected within one standard orbit. All frequencies standing by.`,
      priority: "PRIORITY",
      action: { label: "⌖ Open hailing frequencies", target: "#hailing" },
    };
  }
  if (/(who|you|computer|mother|mka|moe|captain)/.test(s)) {
    return {
      text: `I am MOTHER-9, the ship's main computer aboard USS ${captain.ship}, registry ${captain.registry}. Chief Engineer ${captain.name} is currently commanding deep-space operations between Tachileik Base and Bangkok Station. Standing by for further commands.`,
    };
  }
  if (/(cert|academy|82|credential)/.test(s)) {
    return {
      text: "STARFLEET ACADEMY RECORD\n\n82+ certifications earned across nine specialized modules:\nLanguages · Web · Mobile · Databases · AI & Data · Security · Blockchain · Systems · Business.\n\nAcademy endorsement: Google Developers Launchpad. First certification logged stardate 76412.8.",
      action: { label: "⌖ View certifications", target: "#certifications" },
    };
  }
  return {
    text: "COMMAND NOT RECOGNIZED. Available commands: missions, skill modules, stardate log, certifications, hailing frequencies. Please re-state your query.",
  };
}

function ComputerCore({ busy }: { busy: boolean }) {
  return (
    <div className="relative h-[72px] w-[72px]">
      {/* Outer rotating ring */}
      <div className="absolute inset-0 rounded-full border-2 border-[#4ef0ff]/40 animate-orbit-float">
        <div className="absolute inset-0 rounded-full" style={{ animation: "radar-sweep 4s linear infinite" }}>
          <div className="absolute left-1/2 top-0 h-1/2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#4ef0ff] to-transparent" />
        </div>
      </div>
      {/* Inner core */}
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,#4ef0ff_18%,#b77bff_52%,transparent_78%)]" />
      {/* LCARS bars */}
      <div className="absolute inset-x-[18%] top-[22%] flex gap-0.5">
        <div className="h-1.5 w-3 rounded-sm bg-[#ff4d6a]" />
        <div className="h-1.5 w-2 rounded-sm bg-[#ffb84a]" />
        <div className="h-1.5 flex-1 rounded-sm bg-[#4ef0ff]" />
      </div>
      <div className="absolute inset-x-[22%] bottom-[22%] flex gap-0.5">
        <div className="h-1.5 flex-1 rounded-sm bg-[#b77bff]" />
        <div className="h-1.5 w-2 rounded-sm bg-[#5cff9d]" />
        <div className="h-1.5 w-3 rounded-sm bg-[#4ef0ff]" />
      </div>
      {/* Center eye */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`h-3 w-3 rounded-full bg-white ${busy ? "scale-150" : ""}`} style={{ boxShadow: "0 0 16px #fff, 0 0 30px #4ef0ff" }}>
          <span className="block h-full w-full animate-pulse rounded-full" style={{ background: busy ? "#ff4d6a" : "#4ef0ff" }} />
        </span>
      </div>
      {/* Orbiting data nodes */}
      <div className="absolute inset-[-6px]" style={{ animation: "radar-sweep 8s linear infinite" }}>
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#b77bff]" style={{ boxShadow: "0 0 8px #b77bff" }} />
      </div>
      <div className="absolute inset-[-6px]" style={{ animation: "radar-sweep 12s linear infinite reverse" }}>
        <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#ffb84a]" style={{ boxShadow: "0 0 8px #ffb84a" }} />
      </div>
    </div>
  );
}

export default function ShipComputer() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{
    id: "0", from: "computer", priority: "NORMAL",
    text: "MOTHER-9 ONLINE. Ship's computer at your service, captain. All systems nominal. State your command or select a pre-programmed directive.",
  }]);
  const [input, setInput] = useState("");
  const [stream, setStream] = useState("");
  const [busy, setBusy] = useState(false);
  const [unread, setUnread] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);
  const greeted = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => { if (!greeted.current && !open) setUnread(true); }, 6500);
    return () => window.clearTimeout(id);
  }, [open]);
  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [msgs, stream, open]);

  const command = (raw: string) => {
    const q = raw.trim();
    if (!q || busy) return;
    warp.click();
    setMsgs((m) => [...m, { id: `${Date.now()}c`, from: "captain", text: q }]);
    setInput("");
    setBusy(true);
    warp.tractor();
    const r = respond(q);
    window.setTimeout(() => {
      let i = 0;
      const timer = window.setInterval(() => {
        i += 3;
        setStream(r.text.slice(0, i));
        if (i >= r.text.length) {
          window.clearInterval(timer);
          setStream("");
          setMsgs((m) => [...m, {
            id: `${Date.now()}m`, from: "computer", priority: r.priority, text: r.text, action: r.action,
          }]);
          setBusy(false);
          warp.chime();
        }
      }, 17);
    }, 380);
  };

  const go = (target: string) => {
    warp.warp();
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const priorityColor = (p?: Msg["priority"]) => {
    if (p === "CRITICAL") return "#ff4d6a";
    if (p === "PRIORITY") return "#ffb84a";
    return "#4ef0ff";
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-center gap-1">
        <AnimatePresence>
          {!open && unread && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="hud-panel rounded-full px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#4ef0ff]">
              ⌖ INCOMING HAIL
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => { warp.hail(); setOpen((o) => !o); setUnread(false); greeted.current = true; }}
          aria-label="Ship computer" className="relative">
          <span className="absolute inset-0 rounded-full border border-[#4ef0ff]/60" style={{ animation: "glow-pulse 3s ease-in-out infinite" }} />
          <ComputerCore busy={busy} />
          {unread && !open && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4d6a] font-mono text-[10px] font-bold text-white">!</span>}
        </button>
        <span className="font-mono text-[8px] tracking-[0.3em] text-[#6f8aa8]">MOTHER-9</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 250, damping: 24 }}
            className="hud-deep hud-brackets fixed bottom-[128px] right-4 z-[100] w-[min(94vw,430px)] overflow-hidden rounded-2xl sm:right-6">
            <span className="hb" />
            <div className="scan-band" />
            {/* LCARS header bar */}
            <div className="lcars-bar" />
            <div className="relative flex items-center gap-3 border-b border-[rgba(78,240,255,0.2)] px-4 py-3.5">
              <ComputerCore busy={busy} />
              <div className="min-w-0 flex-1">
                <div className="f-head flex items-center gap-2 text-[13px] font-bold tracking-wide text-white">
                  MOTHER-9 <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5cff9d]" />
                </div>
                <div className="font-mono text-[9px] tracking-[0.2em] text-[#6f8aa8]">
                  {busy ? "PROCESSING COMMAND…" : "SHIP COMPUTER · ALL SYSTEMS NOMINAL"}
                </div>
              </div>
              <button onClick={() => { warp.click(); setOpen(false); }} className="hud-panel flex h-8 w-8 items-center justify-center rounded-full text-[#6f8aa8] hover:text-white" aria-label="Close">
                <X size={14} />
              </button>
            </div>

            {/* message log */}
            <div ref={box} className="relative h-[290px] space-y-2.5 overflow-y-auto bg-[#02030a88] px-4 py-3 hide-scroll">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "captain" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.from === "captain" ? "rounded-br-md font-medium text-[#02030a]" : "hud-panel rounded-bl-md text-[#dff8ff]"}`}
                    style={m.from === "captain" ? { background: "linear-gradient(120deg,#4ef0ff,#b77bff)" } : { borderLeft: `2px solid ${priorityColor(m.priority)}` }}>
                    {m.from === "computer" && m.priority && (
                      <div className="mb-1 font-mono text-[8px] tracking-[0.25em]" style={{ color: priorityColor(m.priority) }}>
                        ⌖ {m.priority} TRANSMISSION
                      </div>
                    )}
                    {m.text}
                    {m.action && (
                      <button onClick={() => go(m.action!.target)}
                        className="mt-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[9px] font-bold text-[#02030a]"
                        style={{ background: "linear-gradient(90deg,#4ef0ff,#b77bff)" }}>
                        {m.action.label} <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {stream && (
                <div className="flex justify-start">
                  <div className="hud-panel max-w-[90%] whitespace-pre-line rounded-2xl rounded-bl-md px-3.5 py-2.5 text-xs leading-relaxed text-[#dff8ff]">
                    {stream}<span className="caret-w" />
                  </div>
                </div>
              )}
              {busy && !stream && (
                <div className="flex justify-start">
                  <div className="hud-panel flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[9px] text-[#4ef0ff]">
                    <Binary size={11} className="animate-spin" /> COMPUTING
                  </div>
                </div>
              )}
            </div>

            {/* command palette */}
            <div className="relative flex flex-wrap gap-1.5 px-4 pb-2 pt-2">
              {COMMANDS.map((c) => (
                <button key={c.label} onClick={() => command(c.q)}
                  className="rounded-lg border border-[rgba(78,240,255,0.25)] px-2.5 py-1.5 font-mono text-[9px] text-[#4ef0ff] hover:bg-[rgba(78,240,255,0.1)]">
                  {c.label}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); command(input); }} className="relative flex gap-2 border-t border-[rgba(78,240,255,0.2)] p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="State your command, captain…"
                className="flex-1 rounded-full border border-[rgba(78,240,255,0.25)] bg-black/30 px-4 py-2.5 text-xs text-white outline-none placeholder:text-[#6f8aa8] focus:border-[#4ef0ff]" />
              <button type="submit" disabled={busy || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#02030a] disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#4ef0ff,#b77bff)" }} aria-label="Execute">
                <Satellite size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
