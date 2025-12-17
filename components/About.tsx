import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SOFTWARE_STACK, SKILL_CATEGORIES, ABOUT_TEXT } from '../constants';
import { Language, SkillData } from '../types';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Monitor, Activity, Layers, Cpu } from 'lucide-react';

interface AboutProps {
  lang: Language;
}

// -----------------------------------------------------------------------------
// Helper Components
// -----------------------------------------------------------------------------

const Counter = ({ from, to, play }: { from: number; to: number; play: boolean }) => {
  const [count, setCount] = useState(from);
  
  useEffect(() => {
    if (!play) return;
    let startTime: number;
    const duration = 2000;
    const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(from + (to - from) * ease));
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    requestAnimationFrame(animate);
  }, [from, to, play]);
  
  return <span>{count}</span>;
};

// Tilt Card: "Push" Physics - Clean Outline Version
const TiltCard = ({ 
    children, 
    className, 
    force = 5 
}: { 
    children: React.ReactNode; 
    className?: string;
    force?: number;
}) => {
    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    // Physics: 
    // Mouse Top (0) -> Push Top Back (RotateX > 0)
    // Mouse Bottom (1) -> Push Bottom Back (RotateX < 0)
    const rotateX = useSpring(useTransform(y, [0, 1], [force, -force]), { stiffness: 400, damping: 30 });

    // Mouse Left (0) -> Push Left Back -> Negative RotateY (Left away, Right near)
    // Mouse Right (1) -> Push Right Back -> Positive RotateY (Right away, Left near)
    const rotateY = useSpring(useTransform(x, [0, 1], [-force, force]), { stiffness: 400, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const xPct = mouseX / width;
        const yPct = mouseY / height;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0.5);
        y.set(0.5);
    };

    return (
        <motion.div
            style={{ 
                rotateX, 
                rotateY,
                transformStyle: "preserve-3d",
                transformPerspective: 1000 // Critical for self-rotation 3D effect
            }}
            whileHover={{ y: -5 }} // "Float" effect on hover
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative transition-all duration-300 ease-out hover:border-[#8A2BE2] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${className}`}
        >
            <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
                {children}
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

const About: React.FC<AboutProps> = ({ lang }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const barAnims = useMemo(() => {
    return SOFTWARE_STACK.map(() => ({
        duration: 1.5 + Math.random() * 2,
        delay: Math.random() * 2
    }));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Radar Chart Animation
  const [chartData, setChartData] = useState<SkillData[]>(SKILL_CATEGORIES);
  const [isHoveringChart, setIsHoveringChart] = useState(false);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (!isHoveringChart) {
        setChartData(SKILL_CATEGORIES);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        return;
    }

    const animate = () => {
        timeRef.current += 0.03; 
        setChartData(prevData => prevData.map((item, i) => {
            const original = SKILL_CATEGORIES[i].level;
            const offset = Math.sin(timeRef.current + i * 1.5) * 3; 
            return {
                ...item,
                level: Math.max(0, Math.min(100, original + offset))
            };
        }));
        animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHoveringChart]);

  return (
    <section id="about" ref={containerRef} className="w-full py-24 px-6 relative bg-[#050505] overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
            
            {/* 1. Identity & Bio */}
            <motion.div variants={itemVariants} className="lg:col-span-7 h-full">
                <TiltCard className="h-full bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/5 rounded-2xl p-8 flex flex-col justify-between group">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-[#8A2BE2] font-mono text-xs tracking-widest flex items-center gap-2 border border-[#8A2BE2]/30 px-2 py-1 rounded-full bg-[#8A2BE2]/5 shadow-[0_0_10px_rgba(138,43,226,0.1)]">
                                <div className="w-1.5 h-1.5 bg-[#8A2BE2] rounded-full animate-pulse"></div>
                                PROFILE_DATA
                            </h3>
                            <div className="text-[10px] font-mono text-gray-500">ID: RAF_2024</div>
                        </div>
                        
                        <div className="relative inline-block mb-3">
                            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter relative z-20">
                                {ABOUT_TEXT[lang].name}
                            </h2>
                            <span className="absolute left-0 -bottom-1 h-1.5 bg-[#bf7eff] w-0 group-hover:w-full transition-all duration-500 ease-out z-10 mix-blend-screen shadow-[0_0_10px_#8A2BE2]"></span>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-6 relative z-20">
                            <span className="bg-[#8A2BE2] text-black px-3 py-1 font-bold text-xs font-mono rounded-sm shadow-[0_0_15px_rgba(138,43,226,0.4)]">{ABOUT_TEXT[lang].role}</span>
                            <span className="border border-white/20 text-gray-300 px-3 py-1 text-xs font-mono rounded-sm bg-black/30">{ABOUT_TEXT[lang].stats.pcd}</span>
                        </div>
                        
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light pl-4 border-l-2 border-[#8A2BE2] bg-gradient-to-r from-[#8A2BE2]/5 to-transparent py-2 pr-2 rounded-r-lg relative z-20">
                            {ABOUT_TEXT[lang].bio}
                        </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4 text-xs font-mono text-gray-400 relative z-20">
                        <Monitor size={16} className="text-[#8A2BE2]" />
                        <span>SETUP: {ABOUT_TEXT[lang].stats.setup}</span>
                    </div>
                </TiltCard>
            </motion.div>

            {/* 2. Radar Chart - Hollow Purple Effect */}
            <motion.div variants={itemVariants} className="lg:col-span-5 h-[350px] lg:h-auto">
                <div 
                    className="h-full"
                    onMouseEnter={() => setIsHoveringChart(true)}
                    onMouseLeave={() => setIsHoveringChart(false)}
                >
                    <TiltCard className="h-full bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/5 rounded-2xl relative flex items-center justify-center overflow-hidden group">
                        
                        {/* Hollow Purple Orb */}
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8A2BE2] opacity-10 blur-[80px] rounded-full pointer-events-none z-0 mix-blend-screen"
                        />

                        <div className="absolute top-4 left-4 z-10">
                            <h3 className="text-[#8A2BE2] font-mono text-xs tracking-widest flex items-center gap-2">
                                <Activity size={14} /> // CORE_COMPETENCIES
                            </h3>
                        </div>
                        
                        {/* Floating Container for Chart */}
                        <motion.div 
                            animate={{ y: [-5, 5, -5] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-full p-4 pointer-events-none relative z-10"
                        >
                            {isInView && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="54%" outerRadius="70%" data={chartData}>
                                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                        <PolarAngleAxis 
                                            dataKey="name" 
                                            tick={{ fill: '#888', fontSize: 10, fontFamily: 'Space Mono' }} 
                                        />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Skills"
                                            dataKey="level"
                                            stroke="#8A2BE2"
                                            strokeWidth={2}
                                            fill="#8A2BE2"
                                            fillOpacity={0.2}
                                            isAnimationActive={false}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            )}
                        </motion.div>
                    </TiltCard>
                </div>
            </motion.div>

            {/* 3. Software Matrix - Reduced Size & Force */}
            <motion.div variants={itemVariants} className="lg:col-span-12">
                <TiltCard force={2} className="bg-[#0A0A0A]/60 backdrop-blur-2xl border border-white/5 rounded-2xl p-6 group/card">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[#8A2BE2] font-mono text-xs tracking-widest flex items-center gap-2">
                            <Layers size={14} /> // SOFTWARE_STACK
                        </h3>
                        <Cpu size={14} className="text-gray-600" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-6">
                        {SOFTWARE_STACK.map((skill, index) => (
                            <div key={index} className="group relative">
                                <div className="flex justify-between text-xs mb-2 text-gray-400 font-mono">
                                    <span className="text-white group-hover:text-[#8A2BE2] transition-colors">{skill.name}</span>
                                    <span className="text-[#8A2BE2]">
                                        <Counter from={0} to={skill.level} play={isInView} />%
                                    </span>
                                </div>
                                
                                <div className="w-full bg-black/80 h-2 rounded-full overflow-hidden border border-white/5 relative">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                                        transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                                        className="bg-gradient-to-r from-[#8A2BE2] to-[#4B0082] h-full shadow-[0_0_10px_rgba(138,43,226,0.5)] rounded-full relative overflow-hidden"
                                    >
                                        <div 
                                            className="absolute top-0 bottom-0 w-16 bg-white/70 blur-md transform -skew-x-12 -translate-x-full group-hover/card:animate-[shimmer_2s_infinite] shadow-[0_0_20px_white]"
                                            style={{
                                                animationDuration: `${barAnims[index].duration}s`,
                                                animationDelay: `${barAnims[index].delay}s`
                                            }}
                                        ></div>
                                    </motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <style>{`
                        @keyframes shimmer {
                            0% { transform: translateX(-150%) skewX(-12deg); }
                            100% { transform: translateX(500%) skewX(-12deg); }
                        }
                    `}</style>
                </TiltCard>
            </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;