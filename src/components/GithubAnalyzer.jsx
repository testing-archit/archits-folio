"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, CheckCircle2, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function GithubAnalyzer() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!username.trim() || loading) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ username }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      setData(result.data);
    } catch (err) {
      setError(err.message || "Failed to analyze profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = data?.skill_breakdown ? Object.entries(data.skill_breakdown).map(([key, value]) => ({
    subject: key,
    A: parseInt(value),
    fullMark: 100,
  })) : [];

  return (
    <section className="w-full max-w-6xl mt-32 px-6">
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6">
          <Zap className="w-3 h-3" />
          Interactive Developer Tool
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">GitHub <span className="text-blue-400 italic font-serif underline decoration-blue-500/30 underline-offset-8">Intelligence</span> Analyzer</h2>
        <p className="text-white/40 text-sm max-w-md font-light leading-relaxed">
          Input any GitHub username to generate a real-time technical profile, skill evolution pathway, and AI-driven growth metrics.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-20 p-[1px] rounded-3xl bg-gradient-to-br from-blue-500/20 via-white/5 to-pink-500/20 relative shadow-2xl">
        <div className="bg-[#0b0b0b] rounded-[23px] p-8 backdrop-blur-3xl overflow-hidden relative">
          <form onSubmit={handleAnalyze} className="relative z-10 flex gap-3">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username (e.g. Octocat)"
                disabled={loading}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-mono placeholder:text-white/20"
              />
              <div className="absolute inset-0 rounded-2xl bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 rounded-2xl bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_-10px_rgba(255,255,255,0.5)] flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center gap-3 text-red-100/60 text-sm"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              {error}
            </motion.div>
          )}

          <AnimatePresence>
            {data && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-12 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Developer Persona</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">{data.developer_persona}</h3>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                       <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Technical Insights</div>
                       <p className="text-sm text-white/50 leading-relaxed font-light">{data.activity_insights}</p>
                    </div>

                    <div className="space-y-3">
                       <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Improvement Pathway</div>
                       {data.improvement_suggestions.map((suggestion, i) => (
                         <div key={i} className="flex gap-3 text-sm text-white/60 items-start">
                           <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                           {suggestion}
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-8 self-start">Skill Breakdown Map</div>
                    <div className="w-full h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                          <PolarGrid stroke="rgba(255,255,255,0.05)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name={data.developer_persona}
                            dataKey="A"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-8 flex items-end gap-2">
                      <span className="text-5xl font-black text-white">{data.estimated_score}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Total Score</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
