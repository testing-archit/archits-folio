"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User } from "lucide-react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Archit's AI assistant. Ask me anything about his projects, skills, or achievements." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: input }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[100] p-4 rounded-full bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.5)] text-white hover:bg-pink-600 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.5, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.5 }}
            className="fixed bottom-24 right-8 z-[100] w-[350px] md:w-[400px] h-[500px] rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-6 bg-white/[0.03] border-b border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <Bot className="w-5 h-5 text-pink-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white leading-none mb-1">Archit AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest leading-none">Online & Intelligent</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`p-2 rounded-xl h-fit ${msg.role === "user" ? "bg-pink-500" : "bg-white/5 border border-white/10"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-pink-500" />}
                    </div>
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.role === "user" ? "bg-white/5 text-white/90 rounded-tr-none" : "bg-white/[0.02] border border-white/5 text-white/70 rounded-tl-none shadow-sm"}`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%] animate-pulse">
                    <div className="p-2 rounded-xl h-fit bg-white/5 border border-white/10">
                      <Bot className="w-4 h-4 text-pink-500" />
                    </div>
                    <div className="p-4 rounded-3xl text-sm bg-white/5 text-white/30 rounded-tl-none">
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white/[0.03] border-t border-white/5 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/50 transition-colors"
                autoFocus
              />
              <button 
                type="submit" 
                className="p-3 rounded-2xl bg-pink-500 text-white hover:bg-pink-600 transition-colors shadow-[0_0_20px_rgba(236,72,153,0.3)]"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
