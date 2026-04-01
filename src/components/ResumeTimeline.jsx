"use client";

import { useEffect, useState } from "react";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, Calendar, Loader2 } from "lucide-react";

export default function ResumeTimeline() {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROFILE);
        if (response.documents.length > 0) {
          const profile = response.documents[0];
          const exp = JSON.parse(profile.experience || '[]').map(i => ({ ...i, type: 'experience', icon: <Briefcase className="w-5 h-5 text-blue-400" /> }));
          const edu = JSON.parse(profile.education || '[]').map(i => ({ ...i, type: 'education', icon: <GraduationCap className="w-5 h-5 text-emerald-400" /> }));
          const ach = JSON.parse(profile.achievements || '[]').map(i => ({ ...i, type: 'achievement', icon: <Award className="w-5 h-5 text-amber-400" /> }));
          
          setTimelineData([...exp, ...edu, ...ach]);
        }
      } catch (err) {
        console.error("Failed to fetch profile timeline:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-32 gap-3 text-white/20 font-mono text-xs uppercase tracking-widest">
        <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
        Syncing professional identity...
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl mt-32 px-6 pb-20">
      <div className="flex flex-col items-center mb-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">Strategic <span className="text-pink-500 italic font-serif">Journey</span></h2>
        <p className="text-white/40 text-sm max-w-md font-light leading-relaxed">
          A real-time record of technical leadership, academic excellence, and competitive achievement.
        </p>
      </div>

      <div className="relative border-l border-white/5 ml-4 md:ml-0 md:left-1/2 md:-translate-x-1/2">
        {timelineData.length > 0 ? (
          timelineData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative mb-12 flex items-center w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right md:justify-end ml-12 md:ml-0' : 'md:pl-12 md:left-full md:-translate-x-full md:text-left md:justify-start ml-12 md:ml-0'}`}
            >
              <div className="absolute left-[-49px] md:left-auto md:right-[-10px] md:translate-x-1/2 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-white/10 z-10">
                <div className="absolute inset-1 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.05] transition-all group w-full">
                <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'flex-row'}`}>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-pink-500 transition-colors tracking-tight">{item.title}</h3>
                    <p className="text-xs text-white/30 font-mono uppercase tracking-widest">{item.company}</p>
                  </div>
                </div>
                
                <p className="text-sm text-white/50 leading-relaxed font-light mb-4">
                  {item.details}
                </p>

                <div className={`flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase font-bold ${index % 2 === 0 ? 'md:justify-end' : 'justify-start'}`}>
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-24 text-center text-white/10 italic text-sm border-2 border-dashed border-white/5 rounded-3xl w-full translate-x-[-1px] md:translate-x-0">
             Professional profile is empty. Initialize via Appwrite console.
          </div>
        )}
      </div>
    </section>
  );
}
