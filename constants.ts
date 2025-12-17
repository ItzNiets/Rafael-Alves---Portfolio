import { Project, SkillData } from './types';

export const HERO_TEXT = {
  EN: {
    title: "VISUAL",
    subtitle: "ALCHEMIST",
    role: "VFX // EDITING // 3D",
    cta: "ENTER THE VOID"
  },
  PT: {
    title: "ALQUIMIA",
    subtitle: "VISUAL",
    role: "VFX // EDIÇÃO // 3D",
    cta: "ENTRAR NO VAZIO"
  }
};

export const CONTACT_INFO = {
  email: "rafinha.alvescosta@gmail.com",
  phone: "+55 (41) 99527-3616",
  location: "Curitiba, PR, Brazil"
};

export const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'CHROMA VELOCITY',
    category: 'Video Editing',
    year: '2024',
    type: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?q=80&w=2664&auto=format&fit=crop',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4', // Placeholder
    description: {
      EN: "High-octane music video editing with complex transitions.",
      PT: "Edição de videoclipe de alta energia com transições complexas."
    },
    details: {
        EN: "Edited in DaVinci Resolve using advanced color grading techniques to match the cyberpunk aesthetic. Synchronized cutting to beat stems.",
        PT: "Editado no DaVinci Resolve usando técnicas avançadas de color grading para combinar com a estética cyberpunk. Cortes sincronizados com as stems da batida."
    }
  },
  {
    id: '02',
    title: 'NEON RECONSTRUCTION',
    category: 'Photo Manipulation',
    year: '2023',
    type: 'comparison',
    beforeImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop', // Raw cityscape
    afterImage: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2670&auto=format&fit=crop', // Cyberpunk city
    description: {
      EN: "Transformation of urban photography into digital dystopia.",
      PT: "Transformação de fotografia urbana em distopia digital."
    },
    details: {
        EN: "A complex matte painting and composition work in Photoshop. Added neon signage, atmospheric fog, and futuristic architectural elements.",
        PT: "Um trabalho complexo de matte painting e composição no Photoshop. Adição de letreiros neon, neblina atmosférica e elementos arquitetônicos futuristas."
    }
  },
  {
    id: '03',
    title: 'PROJECT TITAN',
    category: '3D Modeling',
    year: '2024',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?q=80&w=2574&auto=format&fit=crop', // Robot/3D
    description: {
      EN: "Hard surface modeling character design for game assets.",
      PT: "Modelagem hard surface de personagem para assets de jogos."
    },
    details: {
        EN: "Modeled and rendered in Blender. Optimized topology for game engines. Texturing done procedurally.",
        PT: "Modelado e renderizado no Blender. Topologia otimizada para game engines. Texturização feita proceduralmente."
    }
  },
  {
    id: '04',
    title: 'AURA SYNC',
    category: 'Motion Graphics',
    year: '2023',
    type: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop',
    videoUrl: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_5MB.mp4',
    description: {
      EN: "Abstract data visualization loops for stage backgrounds.",
      PT: "Loops abstratos de visualização de dados para fundos de palco."
    },
    details: {
        EN: "Created in After Effects using particle systems and expression controls. Designed for massive LED walls.",
        PT: "Criado no After Effects usando sistemas de partículas e controles de expressão. Projetado para paredes de LED massivas."
    }
  }
];

// Radar Chart Data (Conceptual Skills)
export const SKILL_CATEGORIES: SkillData[] = [
  { name: 'Color Grading', level: 95, category: 'Visual' },
  { name: 'Compositing', level: 90, category: 'Visual' },
  { name: '3D Logic', level: 75, category: '3D' },
  { name: 'Sound Design', level: 70, category: 'Audio' },
  { name: 'Motion', level: 85, category: 'Animation' },
  { name: 'Storytelling', level: 80, category: 'Creative' },
];

// Bar Chart Data (Software Proficiency)
export const SOFTWARE_STACK: SkillData[] = [
  { name: 'DaVinci Resolve', level: 98, category: 'Software' },
  { name: 'Adobe After Effects', level: 90, category: 'Software' },
  { name: 'Photoshop', level: 95, category: 'Software' },
  { name: 'Premiere Pro', level: 85, category: 'Software' },
  { name: 'Blender', level: 75, category: 'Software' },
  { name: 'Unreal Engine', level: 60, category: 'Software' },
];

export const ABOUT_TEXT = {
  EN: {
    heading: "THE OPERATOR",
    name: "RAFAEL ALVES DA COSTA",
    role: "DIGITAL GAMES STUDENT // VFX ARTIST",
    bio: "I am a 19-year-old digital artisan based in Curitiba. My focus is on the convergence of raw footage and synthetic reality. I specialize in post-production, visual design, and 3D integration.",
    stats: {
        pcd: "PCD (Partial Hearing / Hearing Aid User)",
        setup: "High-Performance Render Station"
    }
  },
  PT: {
    heading: "O OPERADOR",
    name: "RAFAEL ALVES DA COSTA",
    role: "ESTUDANTE DE JOGOS DIGITAIS // ARTISTA VFX",
    bio: "Tenho 19 anos, sou um artesão digital baseado em Curitiba. Meu foco é na convergência entre filmagem bruta e realidade sintética. Especialista em pós-produção, design visual e integração 3D.",
    stats: {
        pcd: "PCD (Audição Parcial / Usuário de Aparelho)",
        setup: "Estação de Render de Alta Performance"
    }
  }
};