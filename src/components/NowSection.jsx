"use client";

import { useEffect, useState } from "react";
import { client, databases, DATABASE_ID, COLLECTIONS } from "@/lib/appwrite";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Rocket, BookOpen, Map, Clock } from "lucide-react";

export default function NowSection() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    async function fetchInitialFeed() {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.NOW_FEED);
        setFeed(response.documents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (err) {
        console.error("Failed to fetch NOW feed:", err);
      }
    }
    fetchInitialFeed();

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.NOW_FEED}.documents`,
      (response) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          setFeed((prev) => [response.payload, ...prev].slice(0, 4));
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'learning': return <BookOpen className="w-4 h-4 text-pink-500" />;
      case 'building': return <Rocket className="w-4 h-4 text-blue-500" />;
      case 'exploring': return <Map className="w-4 h-4 text-emerald-500" />;
      default: return <Coffee className="w-4 h-4 text-white/50" />;
    }
  };

  return (
    <section className="w-full max-w-4xl mt-32 px-6">
      <div className="flex items-center justify-between mb-12">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-white tracking-tighter uppercase italic">Live <span className="text-pink-500">NOW</span></h2>
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Real-time Developer Pulse</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
           <Clock className="w-3 h-3" />
           Last Updated: Just Now
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {feed.length > 0 ? (
            feed.map((item, index) => (
              <motion.div
                key={item.$id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors shadow-inner">
                    {getIcon(item.type)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                    Currently {item.type}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed font-light mb-4">
                  {item.content}
                </p>
                <div className="text-[10px] text-white/20 font-mono italic">
                  {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 py-16 text-center text-white/10 italic text-sm border-2 border-dashed border-white/5 rounded-3xl">
              Initializing live feed channel...
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
