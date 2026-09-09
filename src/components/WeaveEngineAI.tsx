import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Workflow, Sparkles, Activity, CheckCircle2,
  ArrowRight, Layers, Play
} from "lucide-react";
import { loomAudio } from "../fabricAudio";
import { weaverProfile } from "../fabricData";

type PatternAnalysis = {
  id: string;
  category: "MOBILE_TENSILE" | "AI_FILAMENT" | "CLEAN_SCAFFOLD" | "IMMUNE_SECURITY";
  title: string;
  summary: string;
  tensileScore: string;
  threadDensity: string;
  coherenceRating: string;
  color: string;
  warpComponent: string;
  weftComponent: string;
  filamentSpecs: string[];
};

const WEAVE_ANALYSES: PatternAnalysis[] = [
  {
    id: "mobile-tensile",
    category: "MOBILE_TENSILE",
    title: "Android & Compose High-Tensile Weft",
    summary:
      "Moe's primary architectural warp is engineered in Kotlin 2.0 and Jetpack Compose. State management flows through unidirectional MVI patterns, completely isolating presentation from background asynchronous coroutines.",
    tensileScore: "99.4%",
    threadDensity: "1850 TPI",
    coherenceRating: "Sub-16ms Frame Pacing",
    color: "#00f0ff",
    warpComponent: "Kotlin Coroutines & Flow (45%)",
    weftComponent: "Declarative Jetpack Compose (35%)",
    filamentSpecs: [
      "Zero Frame Drops under continuous load",
      "Room DB Single Source of Truth",
      "Dynamic Multi-Module Architecture"
    ]
  },
  {
    id: "ai-filament",
    category: "AI_FILAMENT",
    title: "On-Device Neural Silk (TFLite INT8)",
    summary:
      "Unlike conventional cloud-reliant models, this pattern compresses neural weights into 8-bit integer quantized buffers running directly on local NPU hardware for private, zero-latency machine inference.",
    tensileScore: "98.2%",
    threadDensity: "1620 TPI",
    coherenceRating: "32ms Inference Spikes",
    color: "#b388ff",
    warpComponent: "INT8 Tensor Buffer Array (50%)",
    weftComponent: "Claude API Semantic Parser (30%)",
    filamentSpecs: [
      "100% Private local edge computation",
      "Under 48MB memory footprint",
      "Instant offline language translation"
    ]
  },
  {
    id: "clean-scaffold",
    category: "CLEAN_SCAFFOLD",
    title: "Clean Architecture Domain Framework",
    summary:
      "A 12-module decoupled Gradle architecture where business entities reside in pure, framework-agnostic Kotlin. Facilitates zero-regression testing and multi-device automated CI/CD.",
    tensileScore: "96.8%",
    threadDensity: "1450 TPI",
    coherenceRating: "-62% Build Duration",
    color: "#ffd740",
    warpComponent: "Pure Kotlin Domain UseCases (40%)",
    weftComponent: "Interface Repository Contracts (35%)",
    filamentSpecs: [
      "Strict Gradle API / Implementation fences",
      "100% unit-testable business rules",
      "Instant test execution on local JVM"
    ]
  },
  {
    id: "immune-security",
    category: "IMMUNE_SECURITY",
    title: "Hardened Carbon Security Weave",
    summary:
      "Synthesizes ethical hacking and security methodologies into mobile deployment. Cryptographic keys are anchored directly into Android Hardware Keystore (TEE/SE) enclaves.",
    tensileScore: "99.9%",
    threadDensity: "1920 TPI",
    coherenceRating: "AES-256 Hardware Enclave",
    color: "#00e676",
    warpComponent: "Android Keystore TEE Enclave (45%)",
    weftComponent: "Biometric Crypto Authentication (35%)",
    filamentSpecs: [
      "Root & memory dump exploit mitigation",
      "Zero plain-text secret token leaks",
      "Penetration testing certified"
    ]
  }
];

export default function WeaveEngineAI() {
  const [activeAnalysisIdx, setActiveAnalysisIdx] = useState(0);
  const [isSimulating, setIsSimulating] = useState(true);
  const [openConsole, setOpenConsole] = useState(false);
  const [queryInput, setQueryInput] = useState("");
  const [streamingResponse, setStreamingResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatLog, setChatLog] = useState<{ id: string; from: "user" | "engine"; text: string; action?: { label: string; target: string } }[]>([
    {
      id: "init",
      from: "engine",
      text: "WEAVE-ENGINE v4.2 ONLINE. I analyze Moe Kyaw Aung's skill patterns across 82+ verified certificates, multi-module Android tapestries, and on-device AI filaments. Select an analysis preset or query the weave."
    }
  ]);

  const activeAnalysis = WEAVE_ANALYSES[activeAnalysisIdx];
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Auto rotate analysis if simulating
  useEffect(() => {
    if (!isSimulating) return;
    const id = setInterval(() => {
      setActiveAnalysisIdx((prev) => (prev + 1) % WEAVE_ANALYSES.length);
      loomAudio.pluckThread(600);
    }, 5500);
    return () => clearInterval(id);
  }, [isSimulating]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatLog, streamingResponse, openConsole]);

  const selectAnalysis = (idx: number) => {
    loomAudio.loomClick();
    setActiveAnalysisIdx(idx);
    setIsSimulating(false);
  };

  const handleQuery = (rawQuery: string) => {
    const q = rawQuery.trim().toLowerCase();
    if (!q || isStreaming) return;

    loomAudio.pluckThread(520);
    setChatLog((prev) => [...prev, { id: Date.now().toString(), from: "user", text: rawQuery }]);
    setQueryInput("");
    setIsStreaming(true);

    let answer = "";
    let action: { label: string; target: string } | undefined;

    if (q.includes("offline") || q.includes("pulsesync") || q.includes("sync")) {
      answer = "PATTERN DISCOVERY: In PulseSync, Moe interlaces Room DB StateFlows with background Firebase sync. The UI never touches direct network requests, guaranteeing sub-16ms frame pacing.";
      action = { label: "DISSECT PULSESYNC NODE", target: "#woven-nodes" };
    } else if (q.includes("ai") || q.includes("translator") || q.includes("tflite") || q.includes("claude")) {
      answer = "PATTERN DISCOVERY: MoekyawTranslator combines 8-bit INT8 quantized TFLite inference (sub-35ms) on-device with Claude API semantic fallback for private, zero-latency multilingual translation.";
      action = { label: "INSPECT TRANSLATOR NODE", target: "#woven-nodes" };
    } else if (q.includes("cert") || q.includes("82") || q.includes("credentials")) {
      answer = "THREAD ANALYSIS: 82+ verified credentials spanning 9 wings (Programming, Web, Mobile, Databases, AI, Security, Blockchain, Systems, Marketing). First certified milestone logged on July 4, 2024.";
      action = { label: "VIEW CERTIFICATE SPOOLS", target: "#spool-vault" };
    } else if (q.includes("hire") || q.includes("contact") || q.includes("email")) {
      answer = `TRANSMISSION SYNAPSE: Moe is actively available for Senior Android Developer & AI Engineer opportunities worldwide. Email: ${weaverProfile.email} · Phone: ${weaverProfile.phone}`;
      action = { label: "TRANSMIT DIRECT SIGNAL", target: "#signal-loom" };
    } else {
      answer = `PATTERN AUDIT: Moe's engineering lattice combines 4 core strands: 1) Kotlin/Compose Mobile, 2) Clean Architecture 12-Module Systems, 3) On-Device INT8 AI, and 4) Automated CI/CD. Fabric coherence rated at 99.4%.`;
      action = { label: "EXPLORE ALL WOVEN NODES", target: "#woven-nodes" };
    }

    // Typewriter streaming
    let i = 0;
    setStreamingResponse("");
    const interval = setInterval(() => {
      i += 3;
      setStreamingResponse(answer.slice(0, i));

      if (i >= answer.length) {
        clearInterval(interval);
        setStreamingResponse("");
        setChatLog((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            from: "engine",
            text: answer,
            action
          }
        ]);
        setIsStreaming(false);
        loomAudio.tensionChime();
      }
    }, 20);
  };

  return (
    <div className="relative fabric-panel rounded-3xl p-6 md:p-8 border border-[rgba(0,240,255,0.3)] shadow-2xl overflow-hidden weave-grid-pat">
      {/* Shuttle Beam Scan Effect */}
      <div className="shuttle-beam" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[rgba(179,136,255,0.2)] mb-8">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center bg-[rgba(0,240,255,0.12)] border border-[rgba(0,240,255,0.4)] shadow-lg">
            <Workflow size={20} className="text-[#00f0ff] animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00e676] animate-pulse" />
          </div>
          <div>
            <div className="f-mono text-[10px] tracking-[0.25em] text-[#00f0ff] uppercase flex items-center gap-2">
              WEAVE-ENGINE AI <span className="px-2 py-0.5 rounded text-[8px] bg-white/10 text-[#ffd740]">AUDIT MODE</span>
            </div>
            <h3 className="f-syne font-bold text-lg md:text-xl text-[#f0f4ff]">
              Skill Pattern Analysis
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              loomAudio.loomClick();
              setIsSimulating((prev) => !prev);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full f-mono text-[10px] border transition-all ${
              isSimulating
                ? "bg-[rgba(0,230,118,0.15)] border-[rgba(0,230,118,0.4)] text-[#00e676]"
                : "bg-white/5 border-white/10 text-[var(--fabric-muted)] hover:text-white"
            }`}
          >
            {isSimulating ? <Activity size={12} className="animate-spin-slow" /> : <Play size={12} />}
            {isSimulating ? "AUTO-WEAVING" : "PAUSED"}
          </button>

          <button
            onClick={() => {
              loomAudio.shuttlePass();
              setOpenConsole((prev) => !prev);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full f-mono text-[10px] tracking-wider text-[#060812] font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(120deg, #b388ff, #00f0ff)" }}
          >
            <Sparkles size={12} /> {openConsole ? "HIDE CONSOLE" : "QUERY LOOM"}
          </button>
        </div>
      </div>

      {/* Main Grid: Spindle Core & Analysis Display */}
      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left: Morphing Spindle / Bobbin Geometric Visualization (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center">
            {/* Concentric Rotating Yarn Spool Rings */}
            <div
              className="absolute inset-0 rounded-full border border-dashed animate-spool opacity-40 pointer-events-none"
              style={{ borderColor: activeAnalysis.color }}
            />
            <div
              className="absolute inset-[24px] rounded-full border animate-spool-rev opacity-50 pointer-events-none"
              style={{ borderColor: "rgba(179, 136, 255, 0.4)", borderStyle: "dotted" }}
            />
            <div
              className="absolute inset-[50px] rounded-full border border-dashed animate-spool-fast opacity-30 pointer-events-none"
              style={{ borderColor: "rgba(0, 240, 255, 0.5)" }}
            />

            {/* Central Morphing Thread Membrane */}
            <div
              className="relative w-[170px] h-[170px] rounded-full animate-mesh-morph flex items-center justify-center shadow-2xl transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${activeAnalysis.color} 40%, #0b0f1d 85%)`,
                boxShadow: `0 0 50px ${activeAnalysis.color}55, inset 0 0 30px rgba(255,255,255,0.4)`
              }}
            >
              <div className="text-center p-4">
                <div className="f-mono text-2xl font-bold text-[#060812] tabular-nums">
                  {activeAnalysis.tensileScore}
                </div>
                <div className="f-mono text-[9px] tracking-widest text-[#060812] uppercase font-bold mt-0.5">
                  TENSILE SCORE
                </div>
              </div>
            </div>

            {/* Orbiting Yarn Spools */}
            {[0, 90, 180, 270].map((deg, idx) => (
              <span
                key={deg}
                className="absolute w-3 h-3 rounded-full shadow-lg"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${deg}deg) translateX(140px) translateY(-50%)`,
                  backgroundColor: idx % 2 === 0 ? activeAnalysis.color : "#ffffff",
                  boxShadow: `0 0 12px ${activeAnalysis.color}`
                }}
              />
            ))}
          </div>

          <div className="f-mono text-[10px] tracking-[0.25em] text-[#8c9bbd] text-center mt-3">
            LOOM RESOLUTION: <span className="text-[#00f0ff]">{activeAnalysis.threadDensity}</span>
          </div>
        </div>

        {/* Right: Architectural Pattern Blueprint Readout (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAnalysis.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="fabric-panel rounded-2xl p-6 border border-[rgba(179,136,255,0.25)] relative"
              style={{ boxShadow: `0 0 35px ${activeAnalysis.color}15` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <span
                    className="f-mono text-[10px] tracking-[0.25em] font-bold uppercase"
                    style={{ color: activeAnalysis.color }}
                  >
                    {activeAnalysis.category}
                  </span>
                  <h4 className="f-syne font-bold text-xl text-[#f0f4ff] mt-0.5">
                    {activeAnalysis.title}
                  </h4>
                </div>

                <div className="text-right">
                  <div className="f-mono text-xl font-bold" style={{ color: activeAnalysis.color }}>
                    {activeAnalysis.coherenceRating}
                  </div>
                  <div className="f-mono text-[9px] text-[#8c9bbd] tracking-widest">
                    BENCHMARK RATING
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#f0f4ff]/85 leading-relaxed mb-5">
                {activeAnalysis.summary}
              </p>

              {/* Thread Interlacing Structure */}
              <div className="grid sm:grid-cols-2 gap-3 mb-5 p-3.5 rounded-xl bg-black/40 border border-white/5 f-mono text-xs">
                <div>
                  <div className="text-[10px] tracking-wider text-[#00f0ff] mb-1 flex items-center gap-1.5">
                    <Layers size={11} /> WARP (BACKBONE):
                  </div>
                  <div className="text-[#f0f4ff]">{activeAnalysis.warpComponent}</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-wider text-[#b388ff] mb-1 flex items-center gap-1.5">
                    <Workflow size={11} /> WEFT (SURFACE):
                  </div>
                  <div className="text-[#f0f4ff]">{activeAnalysis.weftComponent}</div>
                </div>
              </div>

              {/* Verified Filament Specifications */}
              <div className="space-y-1.5 pt-3 border-t border-white/10">
                <div className="f-mono text-[10px] tracking-widest text-[#8c9bbd] uppercase mb-2">
                  VERIFIED LOOM SPECIFICATIONS
                </div>
                {activeAnalysis.filamentSpecs.map((spec) => (
                  <div key={spec} className="flex items-center gap-2 text-xs text-[#00e676]">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quick Preset Selector Buttons */}
          <div className="mt-5">
            <div className="f-mono text-[10px] tracking-widest text-[#8c9bbd] mb-2 uppercase">
              SELECT PATTERN TO AUDIT:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WEAVE_ANALYSES.map((item, idx) => {
                const isSelected = idx === activeAnalysisIdx;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectAnalysis(idx)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl f-mono text-[10.5px] border text-left transition-all ${
                      isSelected
                        ? "border-[#00f0ff] bg-[rgba(0,240,255,0.18)] text-white shadow-lg"
                        : "border-white/5 bg-white/[0.02] text-[#8c9bbd] hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.category.split("_")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Conversational Weave Console */}
      <AnimatePresence>
        {openConsole && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 pt-6 border-t border-[rgba(179,136,255,0.2)] overflow-hidden"
          >
            <div className="f-mono text-xs text-[#00f0ff] tracking-widest mb-3 flex items-center justify-between">
              <span>LOOM QUERY CONSOLE</span>
              <span className="text-[10px] text-[#8c9bbd]">INTERACTIVE NLP ENGINE</span>
            </div>

            {/* Chat History Box */}
            <div
              ref={chatScrollRef}
              className="h-[220px] overflow-y-auto p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 hide-scroll f-mono text-xs"
            >
              {chatLog.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.from === "user"
                        ? "bg-[rgba(0,240,255,0.2)] border border-[rgba(0,240,255,0.4)] text-white"
                        : "bg-[rgba(179,136,255,0.15)] border border-[rgba(179,136,255,0.3)] text-[#f0f4ff]"
                    }`}
                  >
                    <div>{msg.text}</div>
                    {msg.action && (
                      <a
                        href={msg.action.target}
                        onClick={() => loomAudio.tensionChime()}
                        className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-[10px] font-bold text-[#060812]"
                        style={{ background: "linear-gradient(90deg, #00f0ff, #b388ff)" }}
                      >
                        {msg.action.label} <ArrowRight size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {isStreaming && streamingResponse && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-[rgba(179,136,255,0.15)] border border-[rgba(179,136,255,0.4)] text-[#f0f4ff]">
                    {streamingResponse}
                    <span className="caret-loom" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Spore Queries */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[
                "How does PulseSync offline sync work?",
                "Analyze MoekyawTranslator AI weave",
                "Explain the 82+ verified credentials",
                "How can I hire Moe?"
              ].map((queryText) => (
                <button
                  key={queryText}
                  onClick={() => handleQuery(queryText)}
                  className="f-mono text-[10px] px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.02] text-[#8c9bbd] hover:text-[#00f0ff] hover:border-[#00f0ff] transition-all"
                >
                  {queryText}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuery(queryInput);
              }}
              className="mt-3 flex gap-2"
            >
              <input
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Query the weave engine (e.g. offline-first, TFLite AI, credentials)..."
                className="flex-1 bg-black/40 border border-[rgba(0,240,255,0.25)] rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-[#8c9bbd]/60 focus:outline-none focus:border-[#00f0ff]"
              />
              <button
                type="submit"
                disabled={isStreaming || !queryInput.trim()}
                className="px-5 py-2.5 rounded-2xl f-mono text-xs font-bold text-[#060812] transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
                style={{ background: "linear-gradient(120deg, #00f0ff, #b388ff)" }}
              >
                DISPATCH
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
