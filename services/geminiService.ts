
import { GoogleGenAI } from "@google/genai";

// --- CONFIGURACIÓN DE SEGURIDAD ---
// En desarrollo local, puedes usar VITE_API_KEY en tu archivo .env
// En producción, esta variable no debe existir, forzando el uso del backend.
const localApiKey = process.env.API_KEY;

// --- UTILITY: Backend Proxy Caller ---
// This acts as a bridge. If we have a local key (Dev), we use it directly.
// If we don't (Prod), we ask our secure backend endpoint.
const generateContentSecurely = async (
  model: string,
  contents: any,
  config: any = {}
): Promise<{ text: string | undefined, groundingMetadata?: any }> => {
  
  // 1. DEV MODE: Use Local Key if available (Direct SDK call)
  // This is only for local debugging with a .env file containing API_KEY
  if (localApiKey && typeof localApiKey === "string" && localApiKey.startsWith("AIza")) {
    try {
      const ai = new GoogleGenAI({ apiKey: localApiKey });
      const response = await ai.models.generateContent({
        model,
        contents,
        config
      });
      return {
        text: response.text,
        groundingMetadata: response.candidates?.[0]?.groundingMetadata
      };
    } catch (error) {
      console.error(`[Local Gemini Error] Model: ${model}`, error);
      throw error;
    }
  }

  // 2. PROD MODE: Call our own Serverless Backend (Proxy)
  // This keeps the key hidden on the server.
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        contents,
        config
      }),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server Error: ${response.status}`);
    }

    const data = await response.json();
    return data; // Expected { text: string, groundingMetadata: ... }

  } catch (error) {
    console.error(`[Secure Backend Error] Model: ${model}`, error);
    // Return graceful fallback structure to prevent app crash
    return { text: undefined }; 
  }
};


// --- PUBLIC METHODS ---

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
  
  const defaultMsg = isEs ? "¡Que tengas un día adorable! ✨" : "Have a lovely day! ✨";
  const errorMsg = isEs ? "¡Disfruta de este momento mágico! ✨🌸" : "Enjoy this magical moment! ✨🌸";

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
  `;

  try {
    const result = await generateContentSecurely(
      'gemini-3-flash-preview',
      prompt,
      { thinkingConfig: { thinkingBudget: 0 } }
    );
    return result.text || defaultMsg;
  } catch (error) {
    return errorMsg;
  }
};

export const getQuickActivity = async (
  weatherCode: number,
  temp: number,
  isDay: boolean,
  lang: 'es' | 'en' = 'es'
): Promise<string> => {
  const langName = lang === 'es' ? "Spanish" : "English";
  const defaultActivity = lang === 'es' ? "Relax en casa" : "Relax at home";

  const isRain = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isSnow = (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);
  const isThunder = weatherCode >= 95;
  const isBadWeather = isRain || isSnow || isThunder || temp < 5;

  const prompt = `
    Based on the weather (Temp: ${temp}°C, Code: ${weatherCode}, Day: ${isDay}), 
    suggest ONE very short activity (max 4 words) in ${langName}.
    
    CRITICAL WEATHER LOGIC:
    - If Raining, Snowing, or Thunderstorming (${isBadWeather}): You MUST suggest an INDOOR activity.
    - If Clear/Good weather: You can suggest outdoor activities.
    
    No emojis in the text, just the activity name.
  `;

  try {
    const result = await generateContentSecurely(
      'gemini-3-flash-preview',
      prompt,
      { thinkingConfig: { thinkingBudget: 0 } }
    );
    return result.text?.trim() || defaultActivity;
  } catch (e) {
    return defaultActivity;
  }
};

export const getLocalRecommendations = async (
  lat: number,
  lon: number,
  weatherCode: number,
  temp: number,
  activityContext: string,
  lang: 'es' | 'en' = 'es'
) => {
  const langName = lang === 'es' ? "Spanish" : "English";

  const prompt = `
    Current Location: Latitude ${lat}, Longitude ${lon}.
    Weather: ${temp}°C, Code ${weatherCode}.
    Desired Activity: "${activityContext}".
    
    Task:
    1. Search via Google Maps for EXACTLY 3 places for the Desired Activity.
    2. Search via Google Maps for EXACTLY 3 places for food/drink nearby.
    3. Write a brief, single-paragraph introduction (max 50 words) in ${langName} recommending these plans.
    
    Rules:
    - Language: Strictly ${langName}.
    - Do NOT output the same response multiple times.
    
    Requirement: You MUST use Google Maps to find these real places and provide their links.
  `;

  try {
    // Note: We use gemini-2.5-flash for Maps grounding
    const result = await generateContentSecurely(
      "gemini-2.5-flash",
      prompt,
      {
        tools: [{ googleMaps: {} }],
        toolConfig: {
            retrievalConfig: {
                latLng: {
                    latitude: lat,
                    longitude: lon
                }
            }
        }
      }
    );

    return {
        text: result.text,
        groundingMetadata: result.groundingMetadata
    };
  } catch (error) {
    console.error("Error getting local recs:", error);
    return null;
  }
};
