import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Showcase from './components/Showcase';
import Cursor from './components/Cursor';
import { Language } from './types';
import { CONTACT_INFO } from './constants';
import { Clock, MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', { 
            timeZone: 'America/Sao_Paulo',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        setTime(timeString);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#e5e5e5] selection:bg-[#8A2BE2] selection:text-white">
      {/* Global Cursor */}
      <div className="hidden md:block">
        <Cursor />
      </div>

      <Navigation lang={lang} setLang={setLang} />
      
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <Showcase lang={lang} />
      </main>

      {/* Enhanced Footer - Minimalist & Compact */}
      <footer id="footer" className="py-12 border-t border-[#111] bg-[#020202] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
            
            {/* Left: Identification */}
            <div>
                <h2 className="text-xl font-bold text-white tracking-tighter mb-1 font-oswald">RAFAEL ALVES</h2>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                    <div className="w-2 h-2 bg-[#8A2BE2] rounded-full animate-pulse"></div>
                    <span>SYSTEM STATUS: ONLINE</span>
                </div>
            </div>

            {/* Center: Compact Contact Grid */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                <a href={`mailto:${CONTACT_INFO.email}`} className="group flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors">
                    <Mail size={14} className="group-hover:text-[#8A2BE2] transition-colors" />
                    <span>{CONTACT_INFO.email}</span>
                </a>
                <div className="group flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors">
                    <Phone size={14} className="group-hover:text-[#8A2BE2] transition-colors" />
                    <span>{CONTACT_INFO.phone}</span>
                </div>
                <div className="group flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors">
                    <MapPin size={14} className="group-hover:text-[#8A2BE2] transition-colors" />
                    <span>{CONTACT_INFO.location}</span>
                </div>
            </div>

            {/* Right: Time & Credits */}
            <div className="text-right">
                <div className="font-mono text-[#8A2BE2] text-sm font-bold tracking-widest mb-1">
                    {time}
                </div>
                <p className="text-[10px] text-gray-600 font-mono uppercase">
                    © {new Date().getFullYear()} // VISUAL ALCHEMIST
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;