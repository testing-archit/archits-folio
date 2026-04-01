"use client";

import { useEffect, useState } from "react";
import { client, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, GitCommit, Zap } from "lucide-react";

export default function LiveActivity() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("Idle");

  // Subscribe to real-time activity_logs
  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.ACTIVITY_LOGS}.documents`,
      (response) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          setLogs((prev) => [response.payload, ...prev].slice(0, 5));
          setStatus("Active Commit Detected");
          setTimeout(() => setStatus("Monitoring Activity"), 5000);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full max-w-4xl mt-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">System Pulse</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-white/90">{status}</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs text-white/30 font-mono uppercase">Appwrite Realtime Localized</span>
            </div>
          </div>
        </motion.div>

        {/* Live Logs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2 p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Recent Activity Logs</span>
            </div>
            <span className="text-[10px] text-white/20 font-mono uppercase">Live Feed</span>
          </div>

          <div className="space-y-3 min-h-[120px]">
            <AnimatePresence mode="popLayout">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <motion.div 
                    key={log.$id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-colors"
                  >
                    <GitCommit className="w-4 h-4 text-pink-500 opacity-50 transition-opacity group-hover:opacity-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-white/80 truncate">
                        <span className="text-pink-500">{log.repo_name.split('/')[1] || log.repo_name}</span>: {log.commit_message}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-white/20 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="h-28 flex items-center justify-center text-white/10 italic text-sm border-2 border-dashed border-white/5 rounded-2xl">
                  Waiting for GitHub events...
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
