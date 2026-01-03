
import { GoogleGenAI } from "@google/genai";

// Acceso directo a la variable inyectada por Vite
const API_KEY = process.env.API_KEY;

// Instancia perezosa para no fallar al inicio si no hay key
const getAIClient = () => {
  if (!API_KEY || API_KEY.length < 5) return null;
  return new GoogleGenAI({ apiKey: API_KEY });
};

// Helper para timeout (evita que se quede pensando eternamente)
const withTimeout = <T>(promise: Promise<T>, ms: number, fallbackValue: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), ms))
  ]);
};

// --- MÉTODOS PÚBLICOS ---

export const getCozyMessage = async (
  weatherCode: number,
  temp: number,
  isDay: boolean,
  city: string,
  lang: 'es' | 'en' = 'es'
): Promise<string> => {
  const isEs = lang === 'es';
  const defaultMsg = isEs ? "¡Que tengas un día adorable! ✨" : "Have a lovely day! ✨";

  // 1. Si no hay API KEY, devolvemos default instantáneamente
  const ai = getAIClient();
  if (!ai) return defaultMsg;

  const timeOfDay = isDay ? (isEs ? "día" : "day") : (isEs ? "noche" : "night");
  const langName = isEs ? "Español" : "English";

  const prompt = `
    Act like a "Kawaii" and "Cozy" weather assistant.
    Context: City: ${city}, Temp: ${temp}°C, WeatherCode: ${weatherCode}, Time: ${timeOfDay}.
    Task: Write a VERY SHORT phrase (max 20 words) in ${langName}. Sweet, comforting, cute emojis.
  `;

  try {
    // Timeout de 6 segundos para mensajes (un poco más holgado)
    return await withTimeout(
      (async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text || defaultMsg;
      })(),
      6000,
      defaultMsg
    );
  } catch (error) {
    console.warn("Gemini API Error (Message):", error);
    return defaultMsg;
  }
};

export const getQuickActivity = async (
  weatherCode: number,
  temp: number,
  isDay: boolean,
  lang: 'es' | 'en' = 'es'
): Promise<string> => {
  const defaultActivity = lang === 'es' ? "Relax en casa" : "Relax at home";
  
  // 1. Si no hay API KEY, fallback inmediato
  const ai = getAIClient();
  if (!ai) return defaultActivity;

  const langName = lang === 'es' ? "Spanish" : "English";
  const isBadWeather = (weatherCode >= 51) || (temp < 5); // Simplificado para robustez

  const prompt = `
    Based on weather (Temp: ${temp}°C, Code: ${weatherCode}), suggest ONE very short activity (max 4 words) in ${langName}.
    Condition: ${isBadWeather ? "Indoors" : "Outdoors if sunny"}. No emojis.
  `;

  try {
    return await withTimeout(
      (async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text?.trim() || defaultActivity;
      })(),
      6000,
      defaultActivity
    );
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
  // Fallback structure - CORREGIDO: groundingMetadata usa undefined, no null
  const fallbackResponse = {
      text: lang === 'es' 
          ? "No pude conectar con las nubes, pero explora tu zona con cariño. 🌸" 
          : "Couldn't connect to the clouds, but explore your area with love. 🌸",
      groundingMetadata: undefined
  };

  const ai = getAIClient();
  if (!ai) return fallbackResponse;

  const langName = lang === 'es' ? "Spanish" : "English";

  // MEJORA: Instrucción explícita para inferir categorías de búsqueda.
  // Ayuda cuando la actividad es abstracta (ej: "Leer un libro" -> buscar "Bibliotecas")
  const prompt = `
    Location: ${lat}, ${lon}. Weather: ${temp}°C. Activity: "${activityContext}".
    Task:
    1. Interpret the "Activity" and find 3 SPECIFIC real places suitable for it via Google Maps near this location (e.g. if activity is "Read a book", search for "Libraries" or "Quiet Cafes").
    2. Find 3 SPECIFIC real places for food/drink via Google Maps near this location.
    3. Write a short intro (max 50 words) in ${langName}.
  `;

  try {
    // AUMENTADO: Timeout de 25 segundos para mayor seguridad en conexiones internacionales
    return await withTimeout(
        (async () => {
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    tools: [{ googleMaps: {} }],
                    toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lon } } }
                }
            });
            return {
                text: result.text,
                groundingMetadata: result.candidates?.[0]?.groundingMetadata
            };
        })(),
        25000, 
        fallbackResponse
    );
  } catch (error) {
    console.error("Gemini API Error (Maps):", error);
    return fallbackResponse;
  }
};
