import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

    return response.text || (isEs ? "¡Que tengas un día adorable! ✨" : "Have a lovely day! ✨");
  } catch (error) {
    console.error("Error getting cozy message:", error);
    return isEs ? "¡Disfruta de este momento mágico! ✨🌸" : "Enjoy this magical moment! ✨🌸";
  }
};