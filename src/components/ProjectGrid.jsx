"use client";

import { useEffect, useState } from "react";
import { databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Code2, BookOpen, ChevronRight } from "lucide-react";
import CaseStudyModal from "./CaseStudyModal";

export default function ProjectGrid() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROJECTS);
        // Map case study data if available or use defaults
        const projectsWithStudies = await Promise.all(response.documents.map(async (p) => {
          try {
             const studies = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CASE_STUDIES, [
               // Quick filter query simulation
             ]);
             const study = studies.documents.find(s => s.project_id === p.$id);
             return { ...p, ...study };
          } catch {
             return p;
          }
        }));
        setProjects(projectsWithStudies);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    }
    fetchProjects();
  }, []);

  return (
    <>
      <section id="projects" className="w-full max-w-6xl mt-24 px-6 overflow-hidden">
        <div className="flex items-center justify-between mb-12">
          <div className="flex flex-col">
            <h2 className="text-4xl font-black tracking-tight text-white/90">Curated <span className="text-pink-500 font-serif italic text-glow">Intelligence</span></h2>
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Engineering Deep-Dives</span>
          </div>
          <div className="text-xs font-mono text-white/30 uppercase tracking-widest hidden md:block">Auto-Synced Forge</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <motion.div
                key={project.$id}
                layoutId={`card-${project.$id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className="group relative flex flex-col p-[1px] rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/5 overflow-hidden transition-all hover:shadow-[0_0_80px_-20px_rgba(236,72,153,0.3)] shadow-[0_0_20px_rgba(0,0,0,0.1)] cursor-pointer"
              >
                <div className="flex-1 bg-[#0a0a0a] rounded-[2.4rem] p-10 backdrop-blur-3xl flex flex-col relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="p-4 rounded-[1.5rem] bg-white/5 border border-white/5 group-hover:bg-pink-500 transition-colors duration-500 shadow-inner">
                      <Code2 className="w-6 h-6 text-white group-hover:text-black transition-colors duration-500" />
                    </div>
                    <div className="flex gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noopener" 
                        onClick={(e) => e.stopPropagation()} 
                        className="p-2 rounded-full hover:bg-white/5 transition-colors"
                      >
                        <Github className="w-5 h-5 text-white" />
                      </a>
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-pink-500 transition-colors tracking-tighter leading-none">{project.name}</h3>
                  
                  <p className="text-white/40 text-sm leading-relaxed mb-10 font-light line-clamp-3">
                    {project.ai_summary || project.description}
                  </p>

                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                    <button className="text-[10px] uppercase font-bold tracking-widest text-pink-500 flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                      View Case Study
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="flex -space-x-2">
                       {project.tech_stack?.split(',').slice(0, 3).map((tech, i) => (
                         <div key={i} className="w-8 h-8 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-[8px] font-mono text-white/40 uppercase">
                            {tech.trim().charAt(0)}
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 py-32 text-center text-white/10 italic text-xl border-2 border-dashed border-white/5 rounded-[2.5rem]">
              <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center animate-pulse">
                    <BookOpen className="w-6 h-6" />
                 </div>
                 Initializing project intelligence engine...
              </div>
            </div>
          )}
        </div>
      </section>

      <CaseStudyModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </>
  );
}
