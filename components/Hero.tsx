import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { HERO_TEXT } from '../constants';
import { Language } from '../types';
import { ArrowDown, Scissors, PenTool, Grip } from 'lucide-react';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Normalized 0-1 for canvas, -0.5 to 0.5 for parallax
    mouseX.set(clientX / innerWidth);
    mouseY.set(clientY / innerHeight);
  };

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] perspective-[1000px] px-6"
    >
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-10"></div>
      
      {/* 2b. Grid Wave (Full Screen) */}
      <div className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none">
         <GridWaveCanvas mouseX={springX} mouseY={springY} />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-4">
        
        {/* Typography (Center-Left) */}
        <motion.div 
            style={{ x: useTransform(springX, [0, 1], [-10, 10]) }}
            className="text-center md:text-left relative"
        >
             {/* Top Label */}
            <div className="mb-2 flex items-center justify-center md:justify-start gap-4 ml-1">
                <div className="h-[1px] w-8 bg-[#8A2BE2]"></div>
                <span className="text-[#8A2BE2] font-mono tracking-[0.5em] text-[10px] uppercase glow-text">
                    {HERO_TEXT[lang].role}
                </span>
            </div>

            <h1 className="text-[14vw] md:text-[10vw] leading-[0.85] font-bold tracking-tighter font-oswald text-white uppercase mix-blend-screen">
                {HERO_TEXT[lang].title}
                <br />
                <span className="relative inline-block">
                    {HERO_TEXT[lang].subtitle}
                </span>
            </h1>
        </motion.div>

        {/* Floating Timeline (Moved closer towards left/center) */}
        <motion.div 
            style={{ 
                x: useTransform(springX, [0, 1], [15, -15]),
                y: useTransform(springY, [0, 1], [15, -15])
            }}
            className="relative z-30 hidden md:block mt-24 md:mt-0 md:-ml-12"
        >
            <EditorTimeline />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity, y: y1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer group"
        onClick={scrollToAbout}
      >
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.3em] group-hover:text-[#8A2BE2] transition-colors">{HERO_TEXT[lang].cta}</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#8A2BE2] to-transparent animate-pulse"></div>
      </motion.div>
    </section>
  );
};

// --- SUBCOMPONENTS ---

const EditorTimeline = () => {
    return (
        <div className="relative group">
            {/* Darker Glass Container - No Outer Glow */}
            <div className="w-[300px] bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-lg p-3 transform rotate-[-3deg] group-hover:rotate-0 transition-all duration-500">
                {/* Header */}
                <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                    </div>
                    <div className="text-[8px] font-mono text-gray-500 flex items-center gap-1">
                        <Grip size={8} /> MASTER_SEQ_01
                    </div>
                </div>

                {/* Tracks */}
                <div className="space-y-1.5 relative overflow-hidden h-[90px]">
                    {/* Playhead - Subtle */}
                    <motion.div 
                        className="absolute top-0 bottom-0 w-[1px] bg-[#8A2BE2] z-10 opacity-70"
                        animate={{ left: ['10%', '90%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute top-0 -translate-x-1/2 -mt-1 w-1.5 h-1.5 bg-[#8A2BE2] transform rotate-45"></div>
                    </motion.div>

                    {/* Track 1 - Purple Only */}
                    <div className="h-6 bg-white/5 rounded-sm w-full flex items-center relative overflow-hidden border border-white/5">
                        <div className="absolute left-[10%] w-[30%] h-full bg-[#8A2BE2]/20 border-l border-r border-[#8A2BE2]/30"></div>
                        <div className="absolute left-[45%] w-[40%] h-full bg-[#8A2BE2]/10 border-l border-r border-[#8A2BE2]/20"></div>
                    </div>
                    
                    {/* Track 2 - Grey/Dark Purple (No Blue) */}
                    <div className="h-6 bg-white/5 rounded-sm w-full flex items-center relative overflow-hidden border border-white/5">
                        <div className="absolute left-[20%] w-[50%] h-full bg-white/10 border-l border-r border-white/20"></div>
                    </div>

                    {/* Track 3 (Audio) - Green turned to Purple/Grey */}
                    <div className="h-5 bg-white/5 rounded-sm w-full flex items-end px-0.5 pb-0.5 relative gap-[1px]">
                         {[...Array(35)].map((_, i) => (
                            <motion.div 
                                key={i}
                                className="w-full bg-[#8A2BE2]/30 rounded-[1px]"
                                style={{ height: `${Math.random() * 80 + 10}%` }}
                                animate={{ height: [`${Math.random() * 80 + 10}%`, `${Math.random() * 80 + 10}%`] }}
                                transition={{ duration: 0.2, repeat: Infinity, repeatType: 'mirror' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-black/80 backdrop-blur border border-[#8A2BE2]/30 p-2 rounded-lg text-[#8A2BE2]"
            >
                <Scissors size={14} />
            </motion.div>
        </div>
    );
};

const GridWaveCanvas: React.FC<{ mouseX: any, mouseY: any }> = ({ mouseX, mouseY }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        // Grid Settings
        const cols = 40; // More cols for full screen
        const rows = 30; // More rows for full screen
        const size = 50; 
        
        const render = () => {
            time += 0.015;
            canvas.width = window.innerWidth; // Full width
            canvas.height = window.innerHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Mouse is normalized 0-1 relative to screen
            const mx = mouseX.get() * window.innerWidth;
            const my = mouseY.get() * window.innerHeight;

            const points: {x: number, y: number, highlight: number}[][] = [];

            // Calculate Grid Points
            for (let r = 0; r < rows; r++) {
                points[r] = [];
                for (let c = 0; c < cols; c++) {
                    // Base position
                    // Tilt the grid slightly
                    let x = c * size + (canvas.width / 2 - (cols * size) / 2) - (r * 5); // reduced tilt
                    let y = r * size + (canvas.height / 2 - (rows * size) / 2);

                    // Wave calculation
                    const wave = Math.sin((c + r) * 0.2 + time) * 10;
                    
                    // Interaction
                    const dx = x - mx; 
                    const dy = y - my;
                    const distToMouse = Math.sqrt(dx*dx + dy*dy);
                    
                    // Highlight factor (0 to 1)
                    let highlight = Math.max(0, 1 - distToMouse / 400);

                    // Deform based on mouse
                    const interaction = Math.max(0, (250 - distToMouse)) * 0.15;

                    points[r][c] = { x: x + interaction, y: y + wave, highlight };
                }
            }

            // Draw Lines
            ctx.lineWidth = 1;

            const drawLine = (p1: any, p2: any) => {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                
                // Color Logic
                const avgHighlight = (p1.highlight + p2.highlight) / 2;
                
                if (avgHighlight > 0.1) {
                    ctx.strokeStyle = `rgba(138, 43, 226, ${0.1 + avgHighlight * 0.9})`;
                    ctx.shadowBlur = avgHighlight * 15;
                    ctx.shadowColor = '#8A2BE2';
                } else {
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; // Very faint white/grey
                    ctx.shadowBlur = 0;
                }
                
                ctx.stroke();
            };

            // Horizontal lines
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols - 1; c++) {
                    drawLine(points[r][c], points[r][c+1]);
                }
            }

            // Vertical lines
            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows - 1; r++) {
                    drawLine(points[r][c], points[r+1][c]);
                }
            }

            animationFrameId = window.requestAnimationFrame(render);
        };

        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [mouseX, mouseY]);

    return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Hero;