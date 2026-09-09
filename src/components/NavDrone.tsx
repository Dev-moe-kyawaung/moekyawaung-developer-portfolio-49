import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Navigation, X } from "lucide-react";
import { nomad, waypoints } from "../nomadData";
import { scout } from "../nomadAudio";

type Msg = {
  id: string;
  from: "explorer" | "drone";
  text: string;
  waypoint?: string;
  action?: { label: string; target: string };
};

const ROUTES = [
  { label: "⌖ 2023 trailhead", q: "what happened in 2023" },
  { label: "⌖ 2024 cache", q: "what happened in 2024" },
  { label: "⌖ 2025 high camp", q: "what happened in 2025" },
  { label: "⌖ 2026 frontier", q: "what happened in 2026" },
  { label: "Expeditions", q: "show me the expeditions" },
  { label: "Hire the nomad", q: "how do I hire Moe" },
];

function navigate(q: string): { text: string; waypoint?: string; action?: Msg["action"] } {
  const s = q.toLowerCase();
  const yr = s.match(/20(2[3-6])/)?.[0];
  if (yr) {
    const wp = waypoints.find((w) => w.yr === yr);
    if (wp) {
      return {
        text: `▸ FLYING TO ${wp.wp} · ${wp.yr} [${wp.phase}]\nCOORDS ${wp.coords}\n\n${wp.title.toUpperCase()}\n${wp.desc}`,
        waypoint: wp.wp,
        action: { label: `⌖ LAND AT ${wp.yr}`, target: "#journey" },
      };
    }
  }
  if (/(exped|project|log|app|pulse|pos|translator)/.test(s)) {
    return {
      text: "▸ AERIAL SURVEY COMPLETE.\n\nEight expedition logs charted below — each stamped with coordinates, terrain class and field metrics. Flagship climbs: PulseSync (SUMMIT, 60fps at altitude), MoekyawTranslator (RIDGE, 32ms off-grid inference), POS Pro Max (BASECAMP, 100K+ invoices).",
      action: { label: "⌖ FLY TO EXPEDITION LOGS", target: "#expeditions" },
    };
  }
  if (/(skill|gear|stack|tech|kotlin)/.test(s)) {
    return {
      text: "▸ GEAR MANIFEST SCANNED.\n\nPrimary machete: Kotlin/Android 98%. Structural rigging: Clean Architecture 95%. Off-grid intelligence: TFLite INT8 88%. Supply lines: Firebase 90%. Perimeter defense: Security/CI 91%. River crossing: React/TS 84%.",
      action: { label: "⌖ INSPECT GEAR RACK", target: "#gear" },
    };
  }
  if (/(cert|82|waypoint|credential|territor)/.test(s)) {
    return {
      text: "▸ TERRITORY MAP UNFOLDED.\n\n82+ certified waypoints across nine territories — languages, web, mobile, data, AI, security, blockchain, systems, business. First cache logged Jul 4, 2024. Google Developers Launchpad resupply confirmed.",
      action: { label: "⌖ OPEN TERRITORY MAP", target: "#territories" },
    };
  }
  if (/(hire|contact|email|signal|job|reach)/.test(s)) {
    return {
      text: `▸ EXTRACTION CHANNEL OPEN.\n\n${nomad.email}\n${nomad.phone}\n\nThe nomad accepts Senior Android & edge-AI expeditions worldwide. Response time: before next sunrise.`,
      action: { label: "⌖ OPEN SIGNAL FIRE", target: "#signal" },
    };
  }
  if (/(who|you|drone|scout|about|moe)/.test(s)) {
    return {
      text: "▸ IDENT: SCOUT-7, reconnaissance drone assigned to Moe Kyaw Aung's expedition. I've mapped his full trek — from 2023 trailhead to the 2026 AI frontier. Name a year, ask for expeditions, gear, territories, or the signal fire.",
    };
  }
  return {
    text: "▸ SIGNAL SCATTERED BY CANOPY. I can fly to: YEARS (2023–2026), EXPEDITIONS, GEAR, TERRITORIES, or the SIGNAL FIRE. Pick a route below and I'll chart the course.",
  };
}

function DroneBody({ busy }: { busy: boolean }) {
  return (
    <div className="animate-drone relative h-[68px] w-[76px]">
      <svg viewBox="0 0 76 68" className="h-full w-full">
        {/* rotor arms */}
        <line x1="18" y1="18" x2="32" y2="30" stroke="#97a087" strokeWidth="2" />
        <line x1="58" y1="18" x2="44" y2="30" stroke="#97a087" strokeWidth="2" />
        {/* rotors */}
        <g style={{ transformOrigin: "18px 16px", animation: `rotor-spin ${busy ? 0.15 : 0.4}s linear infinite` }}>
          <ellipse cx="18" cy="16" rx="14" ry="2.6" fill="rgba(143,212,96,0.45)" />
        </g>
        <g style={{ transformOrigin: "58px 16px", animation: `rotor-spin ${busy ? 0.15 : 0.4}s linear infinite`, animationDelay: "0.08s" }}>
          <ellipse cx="58" cy="16" rx="14" ry="2.6" fill="rgba(143,212,96,0.45)" />
        </g>
        <circle cx="18" cy="16" r="2.5" fill="#ffb347" />
        <circle cx="58" cy="16" r="2.5" fill="#ffb347" />
        {/* body */}
        <rect x="26" y="28" width="24" height="16" rx="5" fill="#131a10" stroke="#ffb347" strokeWidth="1.6" />
        {/* camera eye */}
        <circle cx="38" cy="36" r="5.5" fill="#070a06" stroke="#8fd460" strokeWidth="1.4" />
        <circle cx="38" cy="36" r="2.4" fill={busy ? "#ffb347" : "#8fd460"}>
          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
        {/* landing legs */}
        <line x1="30" y1="44" x2="26" y2="52" stroke="#97a087" strokeWidth="1.6" />
        <line x1="46" y1="44" x2="50" y2="52" stroke="#97a087" strokeWidth="1.6" />
        {/* scan beam */}
        {busy && (
          <path d="M32 44 L28 62 L48 62 L44 44 Z" fill="rgba(255,179,71,0.1)" />
        )}
        {/* nav lights */}
        <circle cx="27.5" cy="31" r="1.3" fill="#ff6b4a" className="animate-blink-n" />
        <circle cx="48.5" cy="31" r="1.3" fill="#8fd460" className="animate-blink-n" style={{ animationDelay: "0.7s" }} />
      </svg>
    </div>
  );
}

export default function NavDrone() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{
    id: "0", from: "drone",
    text: "▸ SCOUT-7 AIRBORNE. Reconnaissance drone at your service, explorer. I've charted Moe Kyaw Aung's entire trek — 2023 trailhead to the 2026 AI frontier. Name a waypoint and I'll fly you there.",
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

  const fly = (raw: string) => {
    const q = raw.trim();
    if (!q || busy) return;
    scout.click();
    setMsgs((m) => [...m, { id: `${Date.now()}u`, from: "explorer", text: q }]);
    setInput("");
    setBusy(true);
    scout.drone();
    const r = navigate(q);
    window.setTimeout(() => {
      let i = 0;
      const timer = window.setInterval(() => {
        i += 3;
        setStream(r.text.slice(0, i));
        if (i >= r.text.length) {
          window.clearInterval(timer);
          setStream("");
          setMsgs((m) => [...m, { id: `${Date.now()}d`, from: "drone", text: r.text, waypoint: r.waypoint, action: r.action }]);
          setBusy(false);
          scout.waypoint();
        }
      }, 17);
    }, 420);
  };

  const go = (target: string) => {
    scout.sonar();
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-center gap-1">
        <AnimatePresence>
          {!open && unread && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="field-panel rounded-full px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-[#ffd58a]">
              ⌖ SCOUT-7 CIRCLING…
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => { scout.drone(); setOpen((o) => !o); setUnread(false); greeted.current = true; }}
          aria-label="Navigation drone" className="relative">
          <span className="absolute inset-2 rounded-full border border-[rgba(255,179,71,0.5)]" style={{ animation: "ping-marker 2.6s ease-out infinite" }} />
          <DroneBody busy={busy} />
          {unread && !open && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff6b4a] font-mono text-[10px] font-bold text-white">1</span>}
        </button>
        <span className="font-mono text-[8px] tracking-[0.3em] text-[#97a087]">SCOUT-7</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 250, damping: 24 }}
            className="field-deep survey-ticks fixed bottom-[128px] right-4 z-[100] w-[min(94vw,420px)] overflow-hidden rounded-2xl sm:right-6">
            <span className="tick-b" />
            <div className="scan-band" />
            {/* header */}
            <div className="relative flex items-center gap-3 border-b border-[rgba(255,179,71,0.2)] px-4 py-3.5">
              <div className="scale-75 -my-2"><DroneBody busy={busy} /></div>
              <div className="min-w-0 flex-1">
                <div className="f-head flex items-center gap-2 text-[13px] font-bold tracking-wide text-white">
                  SCOUT-7 <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8fd460]" />
                </div>
                <div className="font-mono text-[9px] tracking-[0.2em] text-[#97a087]">
                  {busy ? "FLYING ROUTE · SCANNING…" : "NAV DRONE · HOLDING PATTERN"}
                </div>
              </div>
              <button onClick={() => { scout.click(); setOpen(false); }} className="field-panel flex h-8 w-8 items-center justify-center rounded-full text-[#97a087] hover:text-white" aria-label="Close">
                <X size={14} />
              </button>
            </div>

            {/* log */}
            <div ref={box} className="relative h-[290px] space-y-2.5 overflow-y-auto bg-[#070a0688] px-4 py-3 hide-scroll">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "explorer" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.from === "explorer" ? "rounded-br-md font-medium text-[#070a06]" : "field-panel rounded-bl-md text-[#e8ecd8]"}`}
                    style={m.from === "explorer" ? { background: "linear-gradient(120deg,#ffd58a,#ffb347)" } : {}}>
                    {m.text}
                    {m.waypoint && (
                      <div className="mt-2 border-t border-[rgba(255,179,71,0.2)] pt-2 font-mono text-[9px] tracking-widest text-[#ffb347]">
                        ⌖ WAYPOINT LOCK: {m.waypoint}
                      </div>
                    )}
                    {m.action && (
                      <button onClick={() => go(m.action!.target)}
                        className="mt-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[9px] font-bold text-[#070a06]"
                        style={{ background: "linear-gradient(90deg,#8fd460,#ffb347)" }}>
                        {m.action.label} <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {stream && (
                <div className="flex justify-start">
                  <div className="field-panel max-w-[88%] whitespace-pre-line rounded-2xl rounded-bl-md px-3.5 py-2.5 text-xs leading-relaxed text-[#e8ecd8]">
                    {stream}<span className="caret-n" />
                  </div>
                </div>
              )}
              {busy && !stream && (
                <div className="flex justify-start">
                  <div className="field-panel flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[9px] text-[#8fd460]">
                    <Navigation size={11} className="animate-spin" /> PLOTTING COURSE
                  </div>
                </div>
              )}
            </div>

            {/* route chips */}
            <div className="relative flex flex-wrap gap-1.5 px-4 pb-2 pt-2">
              {ROUTES.map((r) => (
                <button key={r.label} onClick={() => fly(r.q)}
                  className="rounded-lg border border-[rgba(255,179,71,0.25)] px-2.5 py-1.5 font-mono text-[9px] text-[#ffd58a] hover:bg-[rgba(255,179,71,0.1)]">
                  {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); fly(input); }} className="relative flex gap-2 border-t border-[rgba(255,179,71,0.2)] p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Radio a destination to SCOUT-7…"
                className="flex-1 rounded-full border border-[rgba(255,179,71,0.25)] bg-black/30 px-4 py-2.5 text-xs text-white outline-none placeholder:text-[#97a087] focus:border-[#ffb347]" />
              <button type="submit" disabled={busy || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#070a06] disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#ffd58a,#ffb347)" }} aria-label="Send">
                <Navigation size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
