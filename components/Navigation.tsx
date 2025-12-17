import React, { useState } from 'react';
import { Language } from '../types';
import { Menu, Globe, X, ArrowRight, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

const Navigation: React.FC<NavigationProps> = ({ lang, setLang }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'HOME', id: 'root', sub: 'SYSTEM_ROOT' },
    { label: 'ABOUT', id: 'about', sub: 'PROFILE_DATA' },
    { label: 'WORK', id: 'showcase', sub: 'ARCHIVES' },
    { label: 'CONTACT', id: 'footer', sub: 'LINK_ESTABLISHED' }
  ];

  const handleScrollTo = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'root') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 w-full px-6 py-6 flex justify-between items-start z-50 pointer-events-none">
        
        {/* Logo Area */}
        <div className="pointer-events-auto cursor-pointer group" onClick={() => handleScrollTo('root')}>
          <div className="flex flex-col">
              <span className="font-bold tracking-tighter text-2xl font-oswald text-white mix-blend-difference group-hover:text-[#8A2BE2] transition-colors">
                  RAFAEL ALVES
              </span>
              <div className="flex items-center gap-2">
                  <span className="h-[1px] w-4 bg-[#8A2BE2]"></span>
                  <span className="text-[10px] font-mono text-gray-400">DIGITAL ARCHITECT</span>
              </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-end gap-4 pointer-events-auto">
            {/* Menu Button - Animates from short dots to long lines */}
            <button 
                onClick={() => setIsMenuOpen(true)}
                className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 p-4 rounded-full text-white hover:bg-[#8A2BE2] hover:text-black hover:border-[#8A2BE2] transition-all duration-300 group shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
                <div className="flex flex-col gap-1 items-end w-6 justify-center h-4">
                    {/* Top Line */}
                    <span className="h-[2px] bg-current transition-all duration-300 w-2 group-hover:w-full"></span>
                    {/* Middle Line */}
                    <span className="h-[2px] bg-current transition-all duration-300 w-1 group-hover:w-full"></span>
                    {/* Bottom Line */}
                    <span className="h-[2px] bg-current transition-all duration-300 w-3 group-hover:w-full"></span>
                </div>
            </button>
            
            {/* Lang Toggle - Larger and easier to click */}
            <button 
                onClick={() => setLang(lang === 'EN' ? 'PT' : 'EN')}
                className="bg-[#0A0A0A]/50 backdrop-blur-md border border-white/5 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold font-mono text-gray-300 hover:text-white hover:border-[#8A2BE2] hover:bg-[#8A2BE2]/10 transition-all duration-300"
            >
                <Globe size={16} />
                <span>{lang}</span>
            </button>
        </div>
      </nav>

      {/* Glass Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] flex flex-col justify-center items-center backdrop-blur-2xl bg-black/90"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            
            {/* Close Button */}
            <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-8 right-8 text-white hover:text-[#8A2BE2] transition-colors bg-white/5 p-4 rounded-full border border-white/10"
            >
                <X size={28} />
            </button>

            {/* Menu Items */}
            <div className="relative z-10 flex flex-col gap-2 w-full max-w-2xl px-6">
                {menuItems.map((item, index) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                        className="group relative cursor-pointer border-b border-white/10 py-6 flex items-center justify-between"
                        onClick={() => handleScrollTo(item.id)}
                    >
                        {/* Hover Background */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 -z-10"></div>
                        
                        <div className="flex flex-col">
                             <span className="text-[10px] font-mono text-[#8A2BE2] opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                 // {item.sub}
                             </span>
                             <h2 className="text-5xl md:text-7xl font-bold text-gray-500 group-hover:text-white transition-colors duration-300 font-oswald uppercase tracking-tight">
                                {item.label}
                            </h2>
                        </div>

                        <div className="text-[#8A2BE2] opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 transition-all duration-300">
                             <ArrowRight size={40} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-10 left-0 w-full text-center"
            >
                <p className="text-gray-600 font-mono text-xs tracking-widest">NAVIGATION_SYSTEM // ONLINE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;