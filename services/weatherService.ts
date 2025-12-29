import { WeatherData, GeoLocation } from '../types';

const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

export const searchCity = async (query: string, lang: string = 'es'): Promise<GeoLocation[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    // Map 'en'/'es' to Open-Meteo supported languages if needed, but they generally match ISO codes
    const response = await fetch(`${GEO_API_URL}?name=${encodeURIComponent(query)}&count=5&language=${lang}&format=json`);
    const data = await response.json();
    
    if (!data.results) return [];
    
    return data.results.map((item: any) => ({
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      admin1: item.admin1
    }));
  } catch (error) {
    console.error("Error searching city:", error);
    return [];
  }
};

export const getWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current_weather: 'true',
      hourly: 'temperature_2m,weathercode,is_day,apparent_temperature', // Added apparent_temperature
      daily: 'weathercode,temperature_2m_max,temperature_2m_min',
      timezone: 'auto'
    });

    const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);
    const data = await response.json();

    // Logic to find the current apparent temperature
    // The current_weather object gives us the time, we match it with hourly.time
    let currentApparentTemp = data.current_weather.temperature; // Fallback
    
    if (data.hourly && data.hourly.time && data.hourly.apparent_temperature) {
        // Find index of the current hour (Open-Meteo returns ISO strings usually on the hour)
        // We look for the hour closest to current_weather.time
        const curTimeStr = data.current_weather.time;
        const index = data.hourly.time.findIndex((t: string) => t === curTimeStr);
        
        if (index !== -1) {
            currentApparentTemp = data.hourly.apparent_temperature[index];
        } else {
             // Fallback: finding the closest hour manually if exact string match fails
             const now = new Date();
             const closestIndex = data.hourly.time.findIndex((t: string) => new Date(t) > now);
             const safeIndex = closestIndex > 0 ? closestIndex - 1 : 0;
             currentApparentTemp = data.hourly.apparent_temperature[safeIndex];
        }
    }

    // Inject into current_weather for easier access in UI
    data.current_weather.apparent_temperature = currentApparentTemp;

    return data as WeatherData;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

export const getReverseGeocoding = async (lat: number, lon: number, lang: string = 'es'): Promise<string> => {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`);
    const data = await response.json();
    // Prioritize city, then locality, then principal subdivision (region)
    return data.city || data.locality || data.principalSubdivision || (lang === 'es' ? "Tu Ubicación" : "Your Location");
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return lang === 'es' ? "Tu Ubicación" : "Your Location";
  }
};