import { GoogleGenAI } from "@google/genai";

// @ts-ignore - process is injected by vite define plugin during build
const apiKey = process.env.API_KEY;

// Helper to safely get AI instance or null
const getAiClient = () => {
  if (!apiKey || apiKey === "undefined") {
    console.warn("API Key is missing. Using default messages.");
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI", error);
    return null;
  }
};

export const getCozyMessage = async (
  weatherCode: number,
  temp: number,
  isDay: boolean,
  city: string,
  lang: 'es' | 'en' = 'es'
): Promise<string> => {
  const isEs = lang === 'es';
  const timeOfDay = isDay ? (isEs ? "día" : "day") : (isEs ? "noche" : "night");
  const langName = isEs ? "Español" : "English";
  
  // Default fallbacks
  const defaultMsg = isEs ? "¡Que tengas un día adorable! ✨" : "Have a lovely day! ✨";
  const errorMsg = isEs ? "¡Disfruta de este momento mágico! ✨🌸" : "Enjoy this magical moment! ✨🌸";

  const ai = getAiClient();

  if (!ai) {
    return defaultMsg;
  }
  
  const prompt = `
    Act like a "Kawaii" and "Cozy" weather assistant.
    
    Context:
    - City: ${city}
    - Temperature: ${temp}°C
    - WMO Weather Code: ${weatherCode}
    - Time: ${timeOfDay}
    
    Task:
    Write a VERY SHORT phrase (max 20 words) in ${langName}.
    It must be sweet, comforting, and use cute emojis.
    If it's cold, suggest warmth. If it's sunny, suggest enjoying the day.
    
    Example (if Spanish): "¡Brrr! Hace frío ❄️. Perfecto para un chocolate caliente ☕."
    Example (if English): "Brrr! So chilly ❄️. Perfect time for hot cocoa ☕."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response needed
      }
    });

    return response.text || defaultMsg;
  } catch (error) {
    console.error("Error getting cozy message:", error);
    return errorMsg;
  }
};