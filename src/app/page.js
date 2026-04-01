"use client";

import { useState, useEffect } from "react";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Brain, Laptop, Terminal, ChevronRight, Wand2, Loader2, Sparkles } from "lucide-react";
import LiveActivity from "@/components/LiveActivity";
import ProjectGrid from "@/components/ProjectGrid";
import ResumeTimeline from "@/components/ResumeTimeline";
import AIChatbot from "@/components/AIChatbot";
import GithubAnalyzer from "@/components/GithubAnalyzer";
import NowSection from "@/components/NowSection";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [stylizedPortrait, setStylizedPortrait] = useState(null);
  const [isStylizing, setIsStylizing] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchProfile() {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROFILE);
        if (response.documents.length > 0) {
          setProfile(response.documents[0]);
        }
      } catch (err) {
        console.error("Hero profile fetch failed:", err);
      }
    }
    fetchProfile();
  }, []);

  const handleStylize = async () => {
    setIsStylizing(true);
    try {
      const res = await fetch("/api/visuals", {
        method: "POST",
        body: JSON.stringify({ type: "hero_portrait" }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result.success) {
        setStylizedPortrait(`data:image/png;base64,${result.base64}`);
      }
    } catch (err) {
      console.error("Stylization failed:", err);
    } finally {
      setIsStylizing(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-pink-500/30 overflow-x-hidden relative checker-background-dark">
      {/* Absolute Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-pink-600/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 backdrop-blur-md border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg">
              A
            </div>
            <span className="font-bold tracking-tight text-white/90 uppercase tracking-widest">{profile ? profile.name.split(' ')[0] + '.INTEL' : 'ARCHIT.INTEL'}</span>
          </div>
          <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
            <a href="#activity" className="hover:text-pink-500 transition-colors">Pulse</a>
            <a href="#analyzer" className="hover:text-pink-500 transition-colors">Analyze</a>
            <a href="#projects" className="hover:text-pink-500 transition-colors">Forge</a>
            <a href="#journey" className="hover:text-pink-500 transition-colors">Journey</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-20 px-8 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="absolute top-44 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-pink-500/5 blur-[120px] -z-10 animate-pulse"></div>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-pink-400 mb-10 shadow-2xl backdrop-blur-md"
        >
          <Shield className="w-3 h-3" />
          Autonomous Portfolio OS v2.0
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-12 mb-16 text-left">
           <div className="relative group">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] bg-gradient-to-br from-pink-500/20 to-violet-600/20 border border-white/10 overflow-hidden relative shadow-2xl">
                 <AnimatePresence mode="wait">
                   {stylizedPortrait ? (
                     <motion.img 
                        key="portrait"
                        src={stylizedPortrait} 
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full object-cover" 
                     />
                   ) : (
                     <motion.div 
                        key="placeholder"
                        className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[3rem]"
                     >
                        <Brain className="w-12 h-12 text-white/10" />
                        <span className="text-[10px] font-mono text-white/20 mt-4">AI Identity Offline</span>
                     </motion.div>
                   )}
                 </AnimatePresence>
                 {isStylizing && (
                   <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Applying Neural Style...</span>
                   </div>
                 )}
              </div>
              <button 
                onClick={handleStylize}
                disabled={isStylizing}
                className="absolute -bottom-4 -right-4 p-4 rounded-[1.5rem] bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-2xl group flex items-center gap-2"
              >
                <Wand2 className="w-5 h-5" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-xs font-bold whitespace-nowrap">Stylize Identity</span>
              </button>
           </div>

           <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-6xl md:text-[7rem] font-black tracking-tighter mb-6 leading-none bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
              >
                {profile ? profile.name.split(' ')[0] : 'ARCHIT'} <br /> {profile ? profile.name.split(' ')[1] : 'GUPTA'}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-xs font-medium text-white/60">
                   <Sparkles className="w-3 h-3 text-pink-400" />
                   {profile ? profile.role.split('+')[0] : 'AI Architect'}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-xs font-medium text-white/60 text-glow">
                   <Terminal className="w-3 h-3 text-emerald-400" />
                   {profile ? profile.role.split('+')[1] || 'Specialist' : 'Blockchain Specialist'}
                </div>
              </motion.div>
           </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-white/40 max-w-2xl font-light leading-relaxed mb-12 text-left"
        >
          {profile ? profile.tagline : 'Engineering high-performance decentralized systems and intelligence-driven platforms.'}
        </motion.p>
      </section>

      {/* Dashboard Section */}
      <section id="activity" className="relative flex flex-col items-center">
        <LiveActivity />
      </section>

      {/* Now Section */}
      <section className="relative flex flex-col items-center">
        <NowSection />
      </section>

      {/* Analyzer Section */}
      <section id="analyzer" className="relative flex flex-col items-center">
        <GithubAnalyzer />
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative flex flex-col items-center">
        <ProjectGrid />
      </section>

      {/* Timeline Section */}
      <section id="journey" className="relative flex flex-col items-center">
        <ResumeTimeline />
      </section>

      {/* Chatbot */}
      <AIChatbot />

      <footer className="py-20 text-center border-t border-white/[0.03] bg-gradient-to-b from-transparent to-pink-500/5">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[10px]">A</div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 text-glow">Archit Gupta Portfolio Engine</span>
          </div>
          <p className="text-[10px] uppercase font-mono tracking-widest text-white/10">
            Automated by Appwrite &bull; Powered by Gemini 1.5 Pro & Imagen 3 &bull; 2026 Edition
          </p>
        </div>
      </footer>
    </main>
  );
}
