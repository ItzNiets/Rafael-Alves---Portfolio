import React, { useState, useRef } from 'react';
import { PROJECTS } from '../constants';
import { Language, Project } from '../types';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Play, X, SlidersHorizontal, Maximize2 } from 'lucide-react';

interface ShowcaseProps {
  lang: Language;
}

const Showcase: React.FC<ShowcaseProps> = ({ lang }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="showcase" className="min-h-screen w-full py-24 px-4 bg-[#050505] relative border-t border-[#8A2BE2]/10">
       {/* Section Header */}
       <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 px-4">
            <div>
                <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-2">WORKS</h2>
                <p className="font-mono text-[#8A2BE2] text-sm">// SELECTED_FILES_FROM_ARCHIVE</p>
            </div>
            <div className="text-right hidden md:block">
                <p className="text-gray-500 font-mono text-xs">SCROLL TO EXPLORE</p>
                <p className="text-gray-500 font-mono text-xs">CLICK FOR DETAILS</p>
            </div>
       </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-32 px-4 pb-24">
        {PROJECTS.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            lang={lang} 
            onOpen={() => setSelectedProject(project)} 
          />
        ))}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            lang={lang} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// --- Sub Components ---

const ProjectCard: React.FC<{ project: Project, index: number, lang: Language, onOpen: () => void }> = ({ project, index, lang, onOpen }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Grow when in center (0.5), normal at edges (0 or 1)
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

    return (
        <motion.div 
            ref={ref}
            style={{ scale, opacity }}
            className="group relative"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Visual Area */}
                <div className="lg:col-span-8 relative aspect-video bg-[#111] overflow-hidden border border-[#333] group-hover:border-[#8A2BE2] transition-colors duration-500 cursor-pointer shadow-lg" onClick={onOpen}>
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                         <span className="bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 font-mono border border-white/20 uppercase">
                             {project.type}
                         </span>
                    </div>

                    {/* Content Logic based on type */}
                    {project.type === 'comparison' && project.beforeImage && project.afterImage ? (
                        <CompareSlider before={project.beforeImage} after={project.afterImage} />
                    ) : project.type === 'video' && project.videoUrl ? (
                        <VideoPreview media={project.mediaUrl} video={project.videoUrl} />
                    ) : (
                        <img src={project.mediaUrl} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <div className="bg-[#8A2BE2] text-black p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            <Maximize2 size={24} />
                        </div>
                    </div>
                </div>

                {/* Info Area */}
                <div className="lg:col-span-4 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-[#8A2BE2] font-mono text-xl">0{index + 1}</span>
                        <div className="h-[1px] flex-1 bg-[#333] group-hover:bg-[#8A2BE2] transition-colors"></div>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-[#8A2BE2] transition-colors cursor-pointer" onClick={onOpen}>{project.title}</h3>
                    <p className="text-gray-400 mb-6 font-light">{project.description[lang]}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                        <span className="text-xs border border-gray-800 px-2 py-1 text-gray-500 font-mono">{project.category}</span>
                        <span className="text-xs border border-gray-800 px-2 py-1 text-gray-500 font-mono">{project.year}</span>
                    </div>
                    <button onClick={onOpen} className="self-start flex items-center gap-2 text-sm font-bold tracking-widest hover:text-[#8A2BE2] transition-colors">
                        VIEW_CASE <ArrowUpRight size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const CompareSlider: React.FC<{ before: string, after: string }> = ({ before, after }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        setSliderPos((x / rect.width) * 100);
    };

    return (
        <div className="relative w-full h-full cursor-col-resize select-none" onMouseMove={handleMouseMove} ref={containerRef}>
            <div className="absolute inset-0 w-full h-full">
                <img src={after} alt="After" className="w-full h-full object-cover" />
            </div>
            <div 
                className="absolute inset-0 w-full h-full overflow-hidden border-r border-[#8A2BE2]"
                style={{ width: `${sliderPos}%` }}
            >
                <img src={before} alt="Before" className="w-full h-full object-cover object-left" />
            </div>
            
            {/* Handle */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-[#8A2BE2] z-10 flex items-center justify-center shadow-[0_0_15px_#8A2BE2]"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="bg-[#8A2BE2] p-1 rounded-full">
                    <SlidersHorizontal size={12} className="text-black" />
                </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-black/70 px-2 py-1 text-[10px] font-mono pointer-events-none">RAW</div>
            <div className="absolute bottom-4 right-4 bg-black/70 px-2 py-1 text-[10px] font-mono pointer-events-none">PROCESSED</div>
        </div>
    );
}

const VideoPreview: React.FC<{ media?: string, video: string }> = ({ media, video }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div 
            className="relative w-full h-full"
            onMouseEnter={() => { videoRef.current?.play(); setIsPlaying(true); }}
            onMouseLeave={() => { videoRef.current?.pause(); setIsPlaying(false); }}
        >
            <img src={media} alt="Thumbnail" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
            <video 
                ref={videoRef}
                src={video} 
                className="w-full h-full object-cover" 
                muted 
                loop 
                playsInline
            />
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Play className="text-white opacity-50 w-12 h-12" />
                </div>
            )}
        </div>
    );
}

const ProjectModal: React.FC<{ project: Project, lang: Language, onClose: () => void }> = ({ project, lang, onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                onClick={onClose}
            />
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-6xl max-h-[90vh] bg-[#050505] border border-[#333] overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(138,43,226,0.1)]"
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-20 text-white hover:text-[#8A2BE2] bg-black/50 p-2 rounded-full">
                    <X size={24} />
                </button>

                {/* Main Media Area */}
                <div className="w-full md:w-2/3 bg-black flex items-center justify-center overflow-y-auto">
                    {project.type === 'video' ? (
                        <video src={project.videoUrl} controls autoPlay className="w-full max-h-full object-contain" />
                    ) : project.type === 'comparison' ? (
                        <div className="w-full h-[50vh] md:h-full relative">
                             <CompareSlider before={project.beforeImage!} after={project.afterImage!} />
                        </div>
                    ) : (
                        <img src={project.mediaUrl} alt={project.title} className="w-full max-h-full object-contain" />
                    )}
                </div>

                {/* Details Sidebar */}
                <div className="w-full md:w-1/3 p-8 md:p-12 overflow-y-auto border-l border-[#333] bg-[#0A0A0A]">
                    <div className="mb-8">
                        <span className="text-[#8A2BE2] font-mono text-xs border border-[#8A2BE2] px-2 py-1">{project.category}</span>
                        <h2 className="text-4xl font-bold text-white mt-4 mb-2">{project.title}</h2>
                        <span className="font-mono text-gray-500">{project.year}</span>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-mono text-xs text-gray-500 mb-2">// OVERVIEW</h4>
                            <p className="text-gray-300 font-light">{project.description[lang]}</p>
                        </div>
                        
                        <div>
                            <h4 className="font-mono text-xs text-gray-500 mb-2">// TECHNICAL_DETAILS</h4>
                            <p className="text-gray-300 font-light">{project.details[lang]}</p>
                        </div>
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-[#222] font-mono text-xs text-gray-600">
                        <p>FILE_ID: {project.id}_XYZ_00{project.id}</p>
                        <p>STATUS: ARCHIVED</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Showcase;