import { GoogleGenAI } from "@google/genai";

// @ts-ignore - process is injected by vite define plugin during build
const apiKey = process.env.API_KEY;

// Helper to safely get AI instance or null
const getAiClient = () => {
  // Check for undefined, null, OR empty string (which is our fallback in vite.config)
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
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

// New function for the small widget (Quick generic suggestion)
export const getQuickActivity = async (
  weatherCode: number,
  temp: number,
  isDay: boolean,
  lang: 'es' | 'en' = 'es'
): Promise<string> => {
  const ai = getAiClient();
  const langName = lang === 'es' ? "Spanish" : "English";
  
  // Static fallback
  if (!ai) return lang === 'es' ? "Leer un libro" : "Read a book";

  // Weather Logic helpers
  const isRain = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isSnow = (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);
  const isThunder = weatherCode >= 95;
  const isBadWeather = isRain || isSnow || isThunder || temp < 5;

  const prompt = `
    Based on the weather (Temp: ${temp}°C, Code: ${weatherCode}, Day: ${isDay}), 
    suggest ONE very short activity (max 4 words) in ${langName}.
    
    CRITICAL WEATHER LOGIC:
    - If Raining, Snowing, or Thunderstorming (${isBadWeather}): You MUST suggest an INDOOR activity (e.g., "Watch a movie", "Read a book", "Visit a museum", "Coffee time"). DO NOT suggest walking or parks.
    - If Clear/Good weather: You can suggest outdoor activities (e.g. "Go for a walk", "Go to the park").
    
    No emojis in the text, just the activity name.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text?.trim() || (lang === 'es' ? "Relax en casa" : "Relax at home");
  } catch (e) {
    return lang === 'es' ? "Relax en casa" : "Relax at home";
  }
};

// New function for the Modal (Specific local recommendations with Maps Grounding)
export const getLocalRecommendations = async (
  lat: number,
  lon: number,
  weatherCode: number,
  temp: number,
  activityContext: string,
  lang: 'es' | 'en' = 'es'
) => {
  const ai = getAiClient();
  if (!ai) return null;

  const langName = lang === 'es' ? "Spanish" : "English";
  
  // Headers defined in code to prevent AI from messing up languages or repeating them
  const headerActivity = lang === 'es' ? "📍 Para tu plan:" : "📍 For your plan:";
  const headerFood = lang === 'es' ? "☕ Para comer/beber:" : "☕ To eat/drink:";

  const prompt = `
    I am at latitude ${lat}, longitude ${lon}.
    The weather is code ${weatherCode} and ${temp}°C.
    
    My goal is to do this activity: "${activityContext}".
    
    CRITICAL INSTRUCTIONS:
    1.  **Output Language:** STRICTLY ${langName}. Do not include any other language.
    2.  **No Repetition:** Write the response exactly ONCE.
    3.  **Google Maps:** You MUST use the Google Maps tool to find exactly **6 distinct places**.
        -   **First 3 places:** Must be strictly for the main activity ("${activityContext}").
        -   **Next 3 places:** Must be for a GASTRONOMIC STOP nearby (Coffee, Snack, Lunch, or Dinner).
    
    Structure your response EXACTLY like this:
    [Short cute intro sentence about weather and plan]
    
    ${headerActivity}
    [List the first 3 places for activity here]
    
    ${headerFood}
    [List the next 3 places for food here]
  `;

  try {
    // Must use Gemini 2.5 series for Google Maps grounding
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
            retrievalConfig: {
                latLng: {
                    latitude: lat,
                    longitude: lon
                }
            }
        }
      },
    });

    return {
        text: response.text,
        groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Error getting local recs:", error);
    return null;
  }
};