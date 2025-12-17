export type Language = 'EN' | 'PT';

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  type: 'video' | 'comparison' | 'image';
  mediaUrl?: string; // For main image or video thumbnail
  videoUrl?: string; // For video projects
  beforeImage?: string; // For comparison
  afterImage?: string; // For comparison
  description: Record<Language, string>;
  details: Record<Language, string>; // Extended details for the modal
}

export interface SkillData {
  name: string;
  level: number; // 0-100
  category: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}