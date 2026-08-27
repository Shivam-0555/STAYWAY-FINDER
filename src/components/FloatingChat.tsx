"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Hi! How can I help you find your stay today?", sender: "ai" }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    const newMsg = { id: Date.now(), text: userMessage, sender: "user" };
    setChatHistory(prev => [...prev, newMsg]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      
      setChatHistory(prev => [
        ...prev,
        { id: Date.now(), text: data.reply, sender: "ai" }
      ]);

      if (data.places && data.places.length > 0) {
        const placesText = data.places.map((p: any) => `- ${p.name} in ${p.city} (${p.category})`).join("\n");
        setChatHistory(prev => [
          ...prev,
          { id: Date.now() + 1, text: `Here are some options:\n${placesText}`, sender: "ai" }
        ]);
      }
    } catch (error) {
      setChatHistory(prev => [
        ...prev,
        { id: Date.now(), text: "Sorry, I encountered an error connecting to the server.", sender: "ai" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 mb-4 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[400px]"
          >
            {/* Header */}
            <div className="bg-slate-800/50 p-4 flex justify-between items-center border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-200">StayWay Assistant</h3>
                  <p className="text-xs text-slate-400">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {chatHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
                      msg.sender === "user" 
                        ? "bg-purple-600 text-white rounded-tr-sm" 
                        : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-slate-800 text-slate-400 rounded-tl-sm border border-slate-700">
                    Typing...
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-800/30 border-t border-slate-700/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center hover:shadow-purple-500/50 transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
