import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const SYSTEM_INSTRUCTION = `
You are the "Neural Link" interface for Rafael Alves da Costa's portfolio.
Your persona is a high-tech, creative AI assistant.
Key Data points about Rafael:
- 19 Years old, based in Curitiba, PR.
- Student of Digital Games at PUCPR (2025-2028).
- Specialist in Video Editing (DaVinci Resolve, Premiere), Photoshop, and After Effects.
- Does NOT do web development. He is a Visual/Digital Artist.
- Has partial hearing loss (PCD), which heightens his visual acuity and focus.
- Owns a high-performance setup for rendering.

Tone: Professional, Creative, Cyberpunk, Helpful.
If asked about contact: "rafinha.alvescosta@gmail.com".

Maintain the "Dark Void" atmosphere.
`;

let aiClient: GoogleGenAI | null = null;

export const initializeGemini = () => {
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

export const sendMessageToGemini = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  if (!aiClient) initializeGemini();
  if (!aiClient) return "ERROR: API_KEY_MISSING. SYSTEM OFFLINE.";

  try {
    const model = 'gemini-2.5-flash';
    const chat = aiClient.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "NO DATA RECEIVED.";
  } catch (error) {
    console.error("Neural Link Error:", error);
    return "CONNECTION INTERRUPTED. RETRYING PROTOCOL...";
  }
};
