import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Code2,
  Gauge,
  Gamepad2,
  GitBranch,
  Globe2,
  Layers3,
  Radio,
  Star,
  X,
} from "lucide-react";
import { holoNodes, profile, type HoloNode } from "../omnisphereData";
import { omni } from "../omnisphereAudio";

const FILTERS = ["ALL", "MOBILE", "AI", "WEB", "MEDIA"] as const;

function filterNode(node: HoloNode, filter: string) {
  if (filter === "ALL") return true;
  const text = `${node.sector} ${node.layers.stack.join(" ")}`.toUpperCase();
  if (filter === "MOBILE") return /ANDROID|MOBILE|KOTLIN|COMPOSE|POS/.test(text);
  if (filter === "AI") return /AI|TFLITE|CLAUDE|NDK/.test(text);
  if (filter === "WEB") return /REACT|PWA|WEB|NODE|POSTGRES/.test(text);
  return /MEDIA|GAME|CANVAS|EXOPLAYER|WEBGL/.test(text);
}

function NodeIcon({ node }: { node: HoloNode }) {
  const text = `${node.sector} ${node.layers.stack.join(" ")}`.toUpperCase();
  if (/AI|TFLITE/.test(text)) return <BrainCircuit size={18} />;
  if (/MEDIA|EXOPLAYER/.test(text)) return <Radio size={18} />;
  if (/GAME|CANVAS/.test(text)) return <Gamepad2 size={18} />;
  if (/WEB|REACT|PWA/.test(text)) return <Globe2 size={18} />;
  return <Code2 size={18} />;
}

function ConnectionField({ rootRef, hotRef }: {
  rootRef: React.RefObject<HTMLDivElement | null>;
  hotRef: React.MutableRefObject<string | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;
    let raf = 0;
    let time = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const packets: { a: number; b: number; p: number; speed: number; color: string }[] = [];

    const resize = () => {
      canvas.width = root.clientWidth * dpr;
      canvas.height = root.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);

    const draw = () => {
      time += 0.016;
      ctx.clearRect(0, 0, root.clientWidth, root.clientHeight);
      const bounds = root.getBoundingClientRect();
      const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-orbit-node]")).map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          id: element.dataset.orbitNode || "",
          color: element.dataset.color || "#68f7ff",
          x: rect.left - bounds.left + rect.width / 2,
          y: rect.top - bounds.top + rect.height / 2,
        };
      });
      const edges: [number, number][] = [];
      const threshold = Math.max(270, Math.min(root.clientWidth, 520));

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (distance < threshold) edges.push([i, j]);
        }
      }

      for (const [a, b] of edges) {
        const start = nodes[a];
        const end = nodes[b];
        const hot = hotRef.current && (start.id === hotRef.current || end.id === hotRef.current);
        const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        gradient.addColorStop(0, `${start.color}${hot ? "99" : "28"}`);
        gradient.addColorStop(1, `${end.color}${hot ? "99" : "28"}`);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        const midX = (start.x + end.x) / 2;
        const lift = Math.min(36, Math.abs(end.x - start.x) * 0.08);
        ctx.quadraticCurveTo(midX, (start.y + end.y) / 2 - lift, end.x, end.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = hot ? 1.7 : 0.8;
        ctx.stroke();
      }

      if (edges.length && Math.random() < 0.06 && packets.length < 18) {
        const [a, b] = edges[Math.floor(Math.random() * edges.length)];
        packets.push({ a, b, p: 0, speed: 0.012 + Math.random() * 0.012, color: nodes[a].color });
      }
      for (let index = packets.length - 1; index >= 0; index -= 1) {
        const packet = packets[index];
        const start = nodes[packet.a];
        const end = nodes[packet.b];
        if (!start || !end) {
          packets.splice(index, 1);
          continue;
        }
        packet.p += packet.speed;
        if (packet.p >= 1) {
          packets.splice(index, 1);
          continue;
        }
        const x = start.x + (end.x - start.x) * packet.p;
        const y = start.y + (end.y - start.y) * packet.p - Math.sin(packet.p * Math.PI) * 20;
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.shadowColor = packet.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const node of nodes) {
        const hot = hotRef.current === node.id;
        ctx.beginPath();
        ctx.arc(node.x, node.y, (hot ? 6 : 3) + Math.sin(time * 3 + node.x) * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = hot ? 18 : 9;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [rootRef, hotRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden />;
}

function CaseStudy({ node, onClose }: { node: HoloNode; onClose: () => void }) {
  const [layer, setLayer] = useState(0);
  const tabs = ["Architecture", "Data Flow", "Metrics", "Stack"];

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#01030adc] p-4 backdrop-blur-xl depth-stage"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, rotateY: 24, translateZ: -180, scale: 0.92 }}
        animate={{ opacity: 1, rotateY: 0, translateZ: 0, scale: 1 }}
        exit={{ opacity: 0, rotateY: -18, translateZ: -130, scale: 0.94 }}
        transition={{ type: "spring", stiffness: 210, damping: 25 }}
        onClick={(event) => event.stopPropagation()}
        className="spatial-glass hud-corners relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] hide-scroll"
        style={{ boxShadow: `0 0 90px ${node.color}2f`, transformStyle: "preserve-3d" }}
      >
        <span className="hud-bottom" />
        <div className="scan-beam" />
        <div className="flex items-center justify-between border-b border-cyan-300/10 px-6 py-4" style={{ background: `linear-gradient(90deg,${node.color}22,transparent)` }}>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ color: node.color, background: `${node.color}18`, border: `1px solid ${node.color}44` }}>
              <NodeIcon node={node} />
            </span>
            <div>
              <div className="font-data text-[9px] tracking-[0.28em] text-[#7891ad]">{node.code} · {node.sector} · {node.year}</div>
              <h3 className="font-orbit text-xl font-bold text-white">{node.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="spatial-glass-soft flex h-9 w-9 items-center justify-center rounded-full text-[#7891ad] hover:text-white" aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 px-6 pt-5">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => { omni.glint(); setLayer(index); }}
              className="rounded-full border px-4 py-2 font-data text-[10px] tracking-[0.17em] transition-all"
              style={layer === index
                ? { color: "#01030a", background: `linear-gradient(120deg,${node.color},#68f7ff)`, borderColor: node.color }
                : { color: "#7891ad", borderColor: "rgba(104,247,255,.14)" }}
            >
              0{index + 1} · {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative min-h-[250px] p-6 preserve-3d">
          <AnimatePresence mode="wait">
            <motion.div
              key={layer}
              initial={{ opacity: 0, x: -22, rotateY: -18, translateZ: -80, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, rotateY: 0, translateZ: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 22, rotateY: 18, translateZ: -80, filter: "blur(8px)" }}
              transition={{ duration: 0.38 }}
            >
              {layer === 0 && (
                <div>
                  <div className="mb-3 flex items-center gap-2 font-data text-[10px] tracking-[0.25em]" style={{ color: node.color }}>
                    <GitBranch size={13} /> SPATIAL ARCHITECTURE LAYER
                  </div>
                  <p className="text-sm leading-relaxed text-[#c9dfec]">{node.layers.architecture}</p>
                  <p className="mt-5 border-l-2 pl-4 text-sm leading-relaxed text-[#7891ad]" style={{ borderColor: node.color }}>{node.summary}</p>
                </div>
              )}
              {layer === 1 && (
                <div>
                  <div className="mb-4 flex items-center gap-2 font-data text-[10px] tracking-[0.25em]" style={{ color: node.color }}>
                    <Radio size={13} /> DATA FLOW VECTOR
                  </div>
                  <div className="space-y-2">
                    {node.layers.dataFlow.map((step, index) => (
                      <div key={step} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-data text-[10px]" style={{ color: node.color, borderColor: `${node.color}44`, background: `${node.color}10` }}>{index + 1}</span>
                        <span className="text-sm text-[#edfaff]">{step}</span>
                        {index < node.layers.dataFlow.length - 1 && <ArrowRight size={13} className="ml-auto shrink-0 text-cyan-300" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {layer === 2 && (
                <div>
                  <div className="mb-4 flex items-center gap-2 font-data text-[10px] tracking-[0.25em]" style={{ color: node.color }}>
                    <Gauge size={13} /> PRODUCTION TELEMETRY
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {node.layers.metrics.map((metric) => (
                      <div key={metric.label} className="spatial-glass-soft rounded-2xl p-4 text-center">
                        <div className="font-orbit text-lg font-bold" style={{ color: node.color }}>{metric.value}</div>
                        <div className="mt-1 font-data text-[8px] tracking-[0.15em] text-[#7891ad]">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {layer === 3 && (
                <div>
                  <div className="mb-4 flex items-center gap-2 font-data text-[10px] tracking-[0.25em]" style={{ color: node.color }}>
                    <Code2 size={13} /> TECHNOLOGY VOLUME
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {node.layers.stack.map((tech) => (
                      <span key={tech} className="rounded-xl border px-3 py-2 font-data text-[11px]" style={{ color: node.color, borderColor: `${node.color}44`, background: `${node.color}0d` }}>{tech}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-3 border-t border-cyan-300/10 px-6 py-5">
          <a href={node.href} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 font-data text-[11px] font-bold text-[#01030a]" style={{ background: `linear-gradient(120deg,${node.color},#68f7ff)` }}>
            <Code2 size={14} /> ACCESS SOURCE
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="spatial-glass-soft flex items-center gap-2 rounded-full px-5 py-3 font-data text-[11px] text-white">
            PROFILE <ArrowUpRight size={12} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function OrbitConstellation() {
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<HoloNode | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hotRef = useRef<string | null>(null);
  const visible = holoNodes.filter((node) => filterNode(node, filter));

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => { omni.glint(); setFilter(item); }}
            className="rounded-full border px-4 py-2 font-data text-[10px] tracking-[0.18em] transition-all"
            style={filter === item
              ? { color: "#01030a", background: "linear-gradient(120deg,#68f7ff,#8d6bff)", borderColor: "#68f7ff" }
              : { color: "#7891ad", borderColor: "rgba(104,247,255,.14)" }}
          >
            {item} · {holoNodes.filter((node) => filterNode(node, item)).length}
          </button>
        ))}
      </div>
      <p className="mb-9 font-data text-[9px] tracking-[0.24em] text-[#7891ad]">HOVER TO EXCITE · CLICK TO EXPAND · PHOTONS ARE LIVE</p>

      <div ref={rootRef} className="relative">
        <ConnectionField rootRef={rootRef} hotRef={hotRef} />
        <motion.div layout className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 preserve-3d">
          <AnimatePresence mode="popLayout">
            {visible.map((node, index) => (
              <motion.button
                key={node.id}
                layout
                data-orbit-node={node.id}
                data-color={node.color}
                initial={{ opacity: 0, y: 30, scale: 0.93, rotateY: 8 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.86 }}
                transition={{ delay: (index % 4) * 0.06, duration: 0.5 }}
                onMouseEnter={() => { hotRef.current = node.id; omni.glint(); }}
                onMouseLeave={() => { hotRef.current = null; }}
                onClick={() => { omni.expand(); setSelected(node); }}
                className="spatial-node spatial-glass hud-corners rounded-3xl p-5 text-left"
              >
                <span className="hud-bottom" />
                <div className="scan-beam opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-cyan-300/10 pb-3">
                    <span className="font-data text-[9px] tracking-[0.2em]" style={{ color: node.color }}>◈ {node.code}</span>
                    {node.flagship && <span className="flex items-center gap-1 rounded-full px-2 py-0.5 font-data text-[8px] font-bold text-[#01030a]" style={{ background: `linear-gradient(120deg,${node.color},#fff)` }}><Star size={8} /> CORE</span>}
                  </div>
                  <div className="my-4 flex h-20 items-center justify-center rounded-2xl border border-white/5" style={{ background: `radial-gradient(circle,${node.color}22,transparent 70%)` }}>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border" style={{ color: node.color, borderColor: `${node.color}55`, background: `${node.color}12`, boxShadow: `0 0 28px ${node.color}33` }}>
                      <NodeIcon node={node} />
                    </span>
                  </div>
                  <h3 className="font-orbit text-[14px] font-bold text-white">{node.name}</h3>
                  <div className="mt-1 font-data text-[9px] tracking-[0.18em]" style={{ color: node.color }}>{node.sector} · {node.year}</div>
                  <p className="mt-2 line-clamp-2 min-h-[36px] text-[12px] leading-relaxed text-[#7891ad]">{node.summary}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-cyan-300/10 pt-3 font-data text-[9px] text-[#7891ad]">
                    <span className="flex items-center gap-1"><Layers3 size={10} /> 4 DEPTH LAYERS</span>
                    <span className="flex items-center gap-1 font-bold text-cyan-300">EXPAND <ArrowUpRight size={10} /></span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <CaseStudy node={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}