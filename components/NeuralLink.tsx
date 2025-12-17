import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Send, Cpu } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const NeuralLink: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'NEURAL LINK ESTABLISHED. AWAITING QUERY...', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct history including the new message
      // Note: 'messages' here is the state before the update above, so we append userMsg manually for the API call
      const history = [...messages, userMsg].map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: history,
        config: {
          systemInstruction: "You are a helpful AI assistant for a portfolio website. Your name is 'Neural Link'. Keep responses concise, technical, and fitting the cyberpunk theme.",
        }
      });

      const responseText = response.text || "NO DATA RECEIVED";
      
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Neural Link Error:", error);
      const errorMsg: ChatMessage = { role: 'model', text: "CONNECTION INTERRUPTED. RETRY.", timestamp: Date.now() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 p-4 bg-black border border-[#8A2BE2] rounded-full text-[#8A2BE2] hover:bg-[#8A2BE2] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(138,43,226,0.5)] ${isOpen ? 'hidden' : 'block'}`}
      >
        <Terminal size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-8 right-8 z-50 w-[90vw] md:w-[400px] h-[500px] bg-black/90 backdrop-blur-xl border border-[#8A2BE2]/50 shadow-[0_0_40px_rgba(138,43,226,0.2)] flex flex-col font-mono text-sm rounded-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#8A2BE2]/10 p-3 flex justify-between items-center border-b border-[#8A2BE2]/30">
              <div className="flex items-center gap-2 text-[#8A2BE2]">
                <Cpu size={16} className="animate-pulse"/>
                <span className="font-bold tracking-widest text-xs">NEURAL_LINK_V.1.0</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                <X size={16} />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#8A2BE2]/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] p-3 rounded-sm border ${
                      msg.role === 'user' 
                        ? 'border-gray-700 bg-gray-900 text-gray-300' 
                        : 'border-[#8A2BE2]/30 bg-[#8A2BE2]/5 text-[#8A2BE2]'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[9px] opacity-50 mt-2 block">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                    <div className="text-[#8A2BE2] text-xs animate-pulse">PROCESSING DATA...</div>
                 </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-[#8A2BE2]/30 bg-black flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ENTER COMMAND..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 font-mono"
                autoFocus
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="text-[#8A2BE2] hover:text-white disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NeuralLink;