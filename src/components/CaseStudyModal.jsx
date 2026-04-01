"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Layout, Code, Target, Lightbulb, Image as ImageIcon, ExternalLink } from "lucide-react";

export default function CaseStudyModal({ project, isOpen, onClose }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="relative w-full max-w-5xl h-[85vh] bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row"
          >
            {/* Header / Actions */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/5 border border-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Visuals & Tech */}
            <div className="w-full md:w-[40%] bg-white/[0.02] border-r border-white/5 p-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-12">
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-bold uppercase tracking-widest text-pink-500 mb-6">
                      <ImageIcon className="w-3 h-3" />
                      AI Visual Intelligence
                   </div>
                   <div className="w-full aspect-square rounded-3xl bg-neutral-900 border border-white/5 overflow-hidden shadow-2xl relative group">
                      {project.system_diagram_url ? (
                        <img src={project.system_diagram_url} alt="System Diagram" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 gap-4 grayscale opacity-20 group-hover:opacity-40 transition-opacity">
                          <Layout className="w-12 h-12" />
                          <p className="text-xs font-mono">Generating isometric system blueprint...</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                   </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">The Forge Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.split(',').map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-mono text-white/50 uppercase">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/20">Source Access</h3>
                  <a href={project.github_url} target="_blank" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-xs font-bold text-white/70">Explore Repository</span>
                    <ExternalLink className="w-4 h-4 text-pink-500" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Case Study Narrative */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
              <div className="max-w-xl">
                 <h2 className="text-5xl font-black text-white mb-4 tracking-tighter leading-none">{project.name}</h2>
                 <p className="text-lg text-white/40 mb-16 italic font-light font-serif">A deep dive into the engineering lifecycle.</p>

                 <div className="space-y-16">
                    <section className="space-y-6">
                       <div className="flex items-center gap-3">
                          <Target className="w-5 h-5 text-pink-500" />
                          <h4 className="text-sm font-bold uppercase tracking-widest text-white/80">The Core Problem</h4>
                       </div>
                       <p className="text-lg text-white/60 leading-relaxed font-light">
                          {project.problem || "Automating the synchronization of complex blockchain ledger activities into a decentralized visualization engine."}
                       </p>
                    </section>

                    <section className="space-y-6">
                       <div className="flex items-center gap-3">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                          <h4 className="text-sm font-bold uppercase tracking-widest text-white/80">Strategic Approach</h4>
                       </div>
                       <p className="text-lg text-white/60 leading-relaxed font-light">
                          {project.approach || "Leveraging high-performance Appwrite serverless handlers and real-time document change feeds to minimize latency between transaction confirmation and UI update."}
                       </p>
                    </section>

                    <section className="space-y-6 pb-12">
                       <div className="flex items-center gap-3">
                          <Code className="w-5 h-5 text-blue-500" />
                          <h4 className="text-sm font-bold uppercase tracking-widest text-white/80">Engineering Impact</h4>
                       </div>
                       <p className="text-lg text-white/60 leading-relaxed font-light">
                          {project.impact || "Achieved a 45% reduction in data visualization latency and streamlined the development pipeline for subsequent blockchain-integrated microservices."}
                       </p>
                    </section>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </AnimatePresence>
  );
}
