
import { GoogleGenAI } from "@google/genai";

// Esta función se ejecuta en el servidor (Vercel/Netlify/Firebase Functions)
// La API KEY nunca sale de aquí.
export default async function handler(req, res) {
  // Configurar CORS para permitir peticiones desde tu propia web
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Server API Key not configured' });
    }

    const { model, contents, config } = req.body;
    
    if (!model || !contents) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Llamada dinámica al modelo
    // Nota: generateContent soporta tanto texto como configs de tools (Mapas)
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: config
    });

    // Devolvemos la respuesta completa procesada
    // Serializamos la respuesta para enviarla al frontend
    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return res.status(200).json({ 
      text, 
      groundingMetadata 
    });

  } catch (error) {
    console.error("Backend Gemini Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
