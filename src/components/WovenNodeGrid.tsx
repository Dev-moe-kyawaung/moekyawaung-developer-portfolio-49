import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, X, Code2, Layers, CheckCircle2,
  Sparkles, Star, ChevronRight, Activity, ArrowUpRight
} from "lucide-react";
import { loomAudio } from "../fabricAudio";
import { WOVEN_NODES, type WovenNode } from "../fabricData";

const CATEGORIES = ["ALL", "MOBILE", "AI_EDGE", "FULLSTACK", "INTERACTIVE"] as const;

export default function WovenNodeGrid() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedNode, setSelectedNode] = useState<WovenNode | null>(null);

  const filteredNodes =
    activeCategory === "ALL"
      ? WOVEN_NODES
      : WOVEN_NODES.filter((node) => node.category === activeCategory);

  const openCaseStudy = (node: WovenNode) => {
    loomAudio.tensionChime();
    setSelectedNode(node);
  };

  return (
    <section id="woven-nodes" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <div className="f-mono text-[11px] tracking-[0.35em] text-[#00f0ff] uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-gradient-to-r from-[#00f0ff] to-transparent" />
            03 · WOVEN NODES & REPOSITORIES
          </div>
          <h2 className="f-syne font-bold text-3xl md:text-5xl leading-tight text-[#f0f4ff]">
            Architectural <span className="fabric-text-glow f-serif italic">tapestries</span>
          </h2>
          <p className="mt-4 text-[#8c9bbd] text-base md:text-lg leading-relaxed">
            Every project is cast as a woven node with verified warp and weft tension. Select any node to expand into an in-depth architectural case study.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  loomAudio.loomClick();
                  setActiveCategory(cat);
                }}
                className={`px-4 py-2 rounded-full f-mono text-xs tracking-wider transition-all border ${
                  isSelected
                    ? "border-[#00f0ff] bg-[rgba(0,240,255,0.18)] text-[#00f0ff] shadow-lg shadow-cyan-500/20 font-bold"
                    : "border-white/10 fabric-panel text-[#8c9bbd] hover:text-white hover:border-white/30"
                }`}
              >
                {cat.replace("_", " ")}{" "}
                <span className="text-[10px] opacity-60">
                  [{cat === "ALL" ? WOVEN_NODES.length : WOVEN_NODES.filter((n) => n.category === cat).length}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid of Woven Nodes */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNodes.map((node, i) => (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
                onMouseEnter={() => loomAudio.pluckThread(540 + i * 40)}
                onClick={() => openCaseStudy(node)}
                className="woven-node fabric-panel rounded-3xl p-5 border border-white/10 cursor-pointer group flex flex-col justify-between"
                style={{
                  boxShadow: `0 12px 35px rgba(0, 0, 0, 0.4)`
                }}
              >
                {/* Grommet tension corners */}
                <span className="grommet tl" />
                <span className="grommet tr" />
                <span className="grommet bl" />
                <span className="grommet br" />

                <div>
                  {/* Top Knot Spec */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3 text-[10px] f-mono">
                    <span className="text-[#00f0ff] flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                      {node.knotId}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded font-bold"
                      style={{ backgroundColor: `${node.glowColor}20`, color: node.glowColor }}
                    >
                      {node.tensileRating}
                    </span>
                  </div>

                  {/* Node Visual Banner if Image exists */}
                  {node.image && (
                    <div className="relative h-28 rounded-2xl overflow-hidden mb-3 border border-white/10">
                      <img
                        src={node.image}
                        alt={node.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--loom-deep)] via-transparent to-transparent" />
                      {node.flagship && (
                        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] f-mono font-bold bg-[#ffd740]/20 text-[#ffd740] border border-[#ffd740]/30 shadow-md">
                          <Star size={9} /> FLAGSHIP
                        </span>
                      )}
                    </div>
                  )}

                  {/* Header Title & Weave Pattern */}
                  <h3 className="f-syne font-bold text-base text-[#f0f4ff] group-hover:text-[#00f0ff] transition-colors leading-snug mb-1">
                    {node.title}
                  </h3>
                  <div className="f-mono text-[10px] text-[#8c9bbd] mb-3">
                    {node.weavePattern}
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-[#8c9bbd] line-clamp-3 leading-relaxed mb-4">
                    {node.summary}
                  </p>
                </div>

                <div>
                  {/* Thread Composition Bar */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 mb-3 space-y-1.5 f-mono text-[10px]">
                    <div className="flex justify-between text-[#8c9bbd]">
                      <span>WARP:</span>
                      <span className="text-[#f0f4ff] truncate max-w-[140px]">{node.warpThread}</span>
                    </div>
                    <div className="flex justify-between text-[#8c9bbd]">
                      <span>WEFT:</span>
                      <span className="text-[#f0f4ff] truncate max-w-[140px]">{node.weftThread}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] f-mono text-[#8c9bbd]">
                    <span>{node.threadCount}</span>
                    <span className="text-[#00f0ff] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      EXPAND <ArrowUpRight size={11} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Expanded Detailed Case Study Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[rgba(6,8,18,0.85)] backdrop-blur-2xl"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl fabric-panel rounded-[2rem] overflow-hidden max-h-[90vh] overflow-y-auto hide-scroll border border-[rgba(0,240,255,0.4)] shadow-2xl"
              style={{
                boxShadow: `0 0 60px ${selectedNode.glowColor}25`
              }}
            >
              {/* Top Banner */}
              <div
                className="relative px-6 py-4 flex items-center justify-between border-b border-white/10"
                style={{ background: `linear-gradient(90deg, ${selectedNode.glowColor}25, transparent)` }}
              >
                <div className="flex items-center gap-2 f-mono text-xs font-bold" style={{ color: selectedNode.glowColor }}>
                  <Sparkles size={14} />
                  <span>CASE STUDY ARCHITECTURE · {selectedNode.knotId}</span>
                </div>
                <button
                  onClick={() => {
                    loomAudio.loomClick();
                    setSelectedNode(null);
                  }}
                  className="w-9 h-9 rounded-full fabric-panel flex items-center justify-center text-[#8c9bbd] hover:text-white transition-colors"
                  aria-label="Close Case Study"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {/* Title & Metadata */}
                <div>
                  <div className="f-mono text-xs text-[#8c9bbd] mb-1">
                    YEAR: {selectedNode.year} · PATTERN: {selectedNode.weavePattern}
                  </div>
                  <h2 className="f-syne font-bold text-2xl md:text-3xl text-[#f0f4ff]">
                    {selectedNode.title}
                  </h2>
                  <p className="mt-3 text-sm md:text-base text-[#8c9bbd] leading-relaxed">
                    {selectedNode.summary}
                  </p>
                </div>

                {/* Challenge & Solution Architecture Tapestry */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="f-mono text-xs text-[#ff4081] font-bold flex items-center gap-1.5">
                      <Activity size={13} /> ARCHITECTURAL CHALLENGE
                    </div>
                    <p className="text-xs text-[#f0f4ff]/85 leading-relaxed">
                      {selectedNode.caseStudy.architecturalChallenge}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="f-mono text-xs text-[#00e676] font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={13} /> DIGITAL LOOM SOLUTION
                    </div>
                    <p className="text-xs text-[#f0f4ff]/85 leading-relaxed">
                      {selectedNode.caseStudy.weaveSolution}
                    </p>
                  </div>
                </div>

                {/* Thread Data Flow Step Ladder */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div className="f-mono text-xs text-[#00f0ff] font-bold mb-3 flex items-center gap-1.5">
                    <Layers size={13} /> THREAD DATA FLOW (TAPESTRY ORDER)
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedNode.caseStudy.threadDataFlow.map((step, sIdx) => (
                      <div key={step} className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-lg f-mono text-[11px] bg-white/[0.04] border border-white/10 text-white">
                          <span className="text-[#00f0ff] font-bold mr-1.5">#{sIdx + 1}</span>
                          {step}
                        </span>
                        {sIdx < selectedNode.caseStudy.threadDataFlow.length - 1 && (
                          <ChevronRight size={13} className="text-[#b388ff]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Production Benchmarks & Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedNode.caseStudy.metrics.map((m) => (
                    <div key={m.label} className="p-3.5 rounded-2xl fabric-panel text-center">
                      <div className="f-mono text-xl font-bold" style={{ color: selectedNode.glowColor }}>
                        {m.value}
                      </div>
                      <div className="f-mono text-[9px] text-[#8c9bbd] tracking-widest mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interlaced Technologies Badges */}
                <div>
                  <div className="f-mono text-xs text-[#8c9bbd] mb-2">INTERLACED TECHNOLOGIES</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.caseStudy.interlacedTech.map((tech) => (
                      <span
                        key={tech}
                        className="f-mono text-xs px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-[#f0f4ff]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                  <a
                    href={selectedNode.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full f-mono text-xs font-bold text-[#060812] shadow-lg transition-transform hover:scale-105 active:scale-95"
                    style={{ background: `linear-gradient(120deg, ${selectedNode.glowColor}, #ffffff)` }}
                  >
                    <Code2 size={15} /> VIEW SOURCE REPOSITORY
                  </a>
                  <a
                    href={selectedNode.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-full fabric-panel border border-white/15 f-mono text-xs text-white hover:border-[#00f0ff] transition-all"
                  >
                    INSPECT COMMITS <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
