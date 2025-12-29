import React, { useState, useEffect, useCallback } from 'react';
import { getCozyMessage } from './services/geminiService';
import { getWeather, searchCity, getReverseGeocoding } from './services/weatherService';
import { WeatherData, GeoLocation } from './types';
import WeatherIcon, { WindIcon, TempIcon } from './components/WeatherIcon';
import CatAvatar from './components/CatAvatar'; // Importing the Cat mascot
import DailyCard from './components/DailyCard';
import HourlyForecast from './components/HourlyForecast';
import AtmosphericBackground from './components/AtmosphericBackground';
import OutfitWidget from './components/OutfitWidget';
import FavoriteTicket from './components/FavoriteTicket';

type Language = 'es' | 'en';

const translations = {
  es: {
    searchPlaceholder: "Buscar ciudad",
    wind: "Viento",
    minMax: "Min/Max",
    feelsLike: "Sensación Térmica",
    nextDays: "Próximos días",
    hourly: "Pronóstico por horas",
    loading: "Consultando a las nubes...",
    error: "No pudimos obtener el clima. Intenta de nuevo.",
    retry: "Intentar de nuevo",
    footer: "Hecho con 💖 y Gemini",
    defaultLocation: "Tu Ubicación",
    outfitTitle: "Outfit Recomendado",
    favPrompt: "¿Qué nombre le ponemos a este lugar? (ej. Casa, Trabajo)",
    mascotMode: "Modo Mascota"
  },
  en: {
    searchPlaceholder: "Search city",
    wind: "Wind",
    minMax: "Min/Max",
    feelsLike: "Feels Like",
    nextDays: "Next days",
    hourly: "Hourly forecast",
    loading: "Consulting the clouds...",
    error: "Could not get weather. Try again.",
    retry: "Try again",
    footer: "Made with 💖 and Gemini",
    defaultLocation: "Your Location",
    outfitTitle: "Recommended Outfit",
    favPrompt: "What nickname should we give this place? (e.g. Home, Work)",
    mascotMode: "Mascot Mode"
  }
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('es');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMascot, setShowMascot] = useState(false); // State for the Mascot toggle
  
  // Lazy initialization to prevent overwriting localStorage on mount
  const [favorites, setFavorites] = useState<GeoLocation[]>(() => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem('cozyWeatherFavs');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Error parsing favorites", e);
            return [];
        }
    }
    return [];
  });

  const t = translations[language];

  // Save favorites whenever they change
  useEffect(() => {
    localStorage.setItem('cozyWeatherFavs', JSON.stringify(favorites));
  }, [favorites]);

  // Initial Load - Get Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Get actual city name via reverse geocoding
          const cityName = await getReverseGeocoding(lat, lon, language);

          setLocation({
            name: cityName,
            latitude: lat,
            longitude: lon
          });
          await fetchWeatherData(lat, lon, cityName, language);
        },
        async (err) => {
          console.log("Geolocation denied or error, default to Madrid", err);
          const defaultLat = 40.4168;
          const defaultLon = -3.7038;
          setLocation({ name: "Madrid", latitude: defaultLat, longitude: defaultLon, country: "España" });
          await fetchWeatherData(defaultLat, defaultLon, "Madrid", language);
        }
      );
    } else {
       // Fallback
       const defaultLat = 40.4168;
       const defaultLon = -3.7038;
       fetchWeatherData(defaultLat, defaultLon, "Madrid", language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeatherData = async (lat: number, lon: number, cityName: string, lang: Language) => {
    setLoading(true);
    setError(null);
    setAiMessage(''); // Reset message while loading
    try {
      const data = await getWeather(lat, lon);
      if (data) {
        setWeather(data);
        
        // Generate AI Message
        const msg = await getCozyMessage(
            data.current_weather.weathercode,
            data.current_weather.temperature,
            data.current_weather.is_day === 1,
            cityName,
            lang
        );
        setAiMessage(msg);
      } else {
        setError(translations[lang].error);
      }
    } catch (e) {
      setError(translations[lang].error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      const results = await searchCity(query, language);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [language]);

  const selectCity = (city: GeoLocation) => {
    setLocation(city);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
    fetchWeatherData(city.latitude, city.longitude, city.name, language);
  };

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    
    // If we have a location, refresh the data to get the new AI message and potential generic location name update
    if (location) {
        let newName = location.name;
        // If the location name was the generic one, translate it
        if (location.name === translations['es'].defaultLocation || location.name === translations['en'].defaultLocation) {
             newName = translations[newLang].defaultLocation;
             setLocation({ ...location, name: newName });
        }
        fetchWeatherData(location.latitude, location.longitude, newName, newLang);
    }
  };

  // Favorites Logic
  const isCurrentLocationFavorite = useCallback(() => {
    if (!location) return false;
    // Increased tolerance to 0.005 (approx 500m) to account for GPS drift or slight API differences
    return favorites.some(fav => 
      Math.abs(fav.latitude - location.latitude) < 0.005 && 
      Math.abs(fav.longitude - location.longitude) < 0.005
    );
  }, [location, favorites]);

  const toggleFavorite = () => {
    if (!location) return;

    if (isCurrentLocationFavorite()) {
      // Remove
      setFavorites(prev => prev.filter(fav => 
        Math.abs(fav.latitude - location.latitude) >= 0.005 || 
        Math.abs(fav.longitude - location.longitude) >= 0.005
      ));
    } else {
      // Add
      // Use setTimeout to ensure UI is ready and unblocked before prompt
      setTimeout(() => {
        const defaultName = location.customName || location.name;
        const customName = window.prompt(t.favPrompt, defaultName);
        if (customName !== null) { // If not cancelled
            const finalName = customName.trim() || defaultName;
            const newFav = { ...location, customName: finalName };
            setFavorites(prev => [...prev, newFav]);
        }
      }, 50);
    }
  };

  const removeFavorite = (e: React.MouseEvent, lat: number, lon: number) => {
    e.stopPropagation();
    setFavorites(prev => prev.filter(fav => 
        Math.abs(fav.latitude - lat) >= 0.005 || 
        Math.abs(fav.longitude - lon) >= 0.005
    ));
  };


  // Background gradient based on time of day (mock logic since we have is_day)
  const getBackgroundClass = () => {
    if (!weather) return 'bg-gradient-to-br from-pink-100 to-purple-200';
    return weather.current_weather.is_day 
      ? 'bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100' // Day: soft blue/pink
      : 'bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200'; // Night: slightly darker pastel
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center py-8 px-4 transition-colors duration-1000 relative overflow-hidden ${getBackgroundClass()}`}>
      
      {/* Full Screen Atmospheric Background */}
      {weather && (
        <AtmosphericBackground 
            weatherCode={weather.current_weather.weathercode}
            isDay={weather.current_weather.is_day === 1}
        />
      )}

      {/* Language Toggle */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-4 right-4 z-50 bg-white/60 hover:bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-500 border border-white transition-all shadow-sm"
      >
        {language === 'es' ? 'ES' : 'EN'}
      </button>

      {/* Search Header - Reduced mb from 6 to 2 */}
      <div className="w-full max-w-md relative z-50 mb-2 mt-6 flex flex-col items-center">
        <div className="w-full flex items-center bg-white/70 backdrop-blur-md rounded-full shadow-lg p-2 border border-white transition-all focus-within:ring-2 focus-within:ring-pink-200">
            <div className="pl-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>
            <input 
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent border-none outline-none px-3 py-2 text-gray-700 placeholder-gray-400 font-medium"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setShowSearch(true)}
            />
        </div>

        {/* Favorites List "Tickets" */}
        {favorites.length > 0 && !showSearch && (
            <div className="w-full mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
                {favorites.map((fav, idx) => (
                    <FavoriteTicket 
                        key={`${fav.latitude}-${fav.longitude}`}
                        name={fav.customName || fav.name}
                        onClick={() => selectCity(fav)}
                        onRemove={(e) => removeFavorite(e, fav.latitude, fav.longitude)}
                        colorIndex={idx}
                    />
                ))}
            </div>
        )}

        {/* Search Results Dropdown */}
        {showSearch && searchResults.length > 0 && (
            <div className="absolute top-14 left-0 w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/50 max-h-60 overflow-y-auto z-50">
                {searchResults.map((city, idx) => (
                    <button 
                        key={`${city.latitude}-${idx}`}
                        className="w-full text-left px-5 py-3 hover:bg-pink-50 transition-colors text-gray-700 font-medium border-b border-gray-100 last:border-0"
                        onClick={() => selectCity(city)}
                    >
                        {city.name} {city.admin1 ? `, ${city.admin1}` : ''} <span className="text-gray-400 text-sm ml-1">{city.country}</span>
                    </button>
                ))}
            </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-400 rounded-full animate-spin mb-4"></div>
                <p className="text-pink-400 font-medium animate-pulse">{t.loading}</p>
            </div>
        ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-400">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-100 rounded-full text-sm font-bold hover:bg-red-200 transition">{t.retry}</button>
            </div>
        ) : weather && location ? (
            <>
                {/* Main Weather Card */}
                <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-white relative overflow-hidden text-center mb-6 mt-2 group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300"></div>
                    
                    {/* Header with Favorite Toggle AND Mascot Toggle */}
                    <div className="relative flex justify-center items-center mb-1">
                        {/* Mascot Toggle Button (Top Left) */}
                        <button
                            onClick={() => setShowMascot(!showMascot)}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all border-2 ${showMascot ? 'bg-pink-100 border-pink-300' : 'bg-transparent border-transparent hover:bg-white/50'}`}
                            title={t.mascotMode}
                        >
                            <span className="text-xl filter drop-shadow-sm">{showMascot ? '🐱' : '☁️'}</span>
                        </button>

                        <h2 className="text-3xl font-bold text-gray-700 mx-10 leading-tight">{location.customName || location.name}</h2>
                        
                        {/* Heart Button (Top Right) */}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite();
                            }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-pink-400 hover:text-pink-500 hover:scale-110 transition-all active:scale-95 cursor-pointer z-20"
                            title={isCurrentLocationFavorite() ? "Eliminar de favoritos" : "Guardar en favoritos"}
                        >
                            {isCurrentLocationFavorite() ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 drop-shadow-sm">
                                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 opacity-50 hover:opacity-100">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">
                      {new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long'})}
                    </p>
                    
                    {/* Visual Centerpiece: Weather Icon OR Cat Avatar */}
                    {/* Compact layout: Reduced top margin (mt-0). Conditional bottom margin: mb-4 for Cat, -mb-10 for Icon to tighten gap */}
                    <div className={`flex justify-center mt-0 cursor-pointer transition-all duration-300 ${showMascot ? 'mb-4' : '-mb-10'}`} onClick={() => setShowMascot(!showMascot)}>
                        {showMascot ? (
                            <div className="transform transition-all duration-500 hover:scale-105">
                                <CatAvatar 
                                    weatherCode={weather.current_weather.weathercode}
                                    temperature={weather.current_weather.temperature}
                                    isDay={weather.current_weather.is_day === 1}
                                    className="w-60 h-60"
                                />
                            </div>
                        ) : (
                            <WeatherIcon 
                                code={weather.current_weather.weathercode} 
                                isDay={weather.current_weather.is_day} 
                                size="xl" 
                                className="w-60 h-60"
                            />
                        )}
                    </div>
                    
                    <div className="flex flex-col items-center mb-4 pt-0">
                        <div className="text-7xl font-bold text-gray-800 tracking-tighter relative z-20 leading-none">
                            {Math.round(weather.current_weather.temperature)}°
                        </div>
                        {weather.current_weather.apparent_temperature !== undefined && (
                            <span className="text-gray-500 font-medium mt-1">
                                {t.feelsLike} <span className="text-gray-700">{Math.round(weather.current_weather.apparent_temperature)}°</span>
                            </span>
                        )}
                    </div>

                    {/* AI Message Bubble */}
                    {aiMessage && (
                        <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-pink-100 mb-6 inline-block transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                            <p className="text-gray-600 italic text-lg leading-relaxed">
                                "{aiMessage}"
                            </p>
                        </div>
                    )}
                    
                    {/* Grid of Widgets */}
                    <div className="grid grid-cols-2 gap-3 mt-2 text-gray-500">
                        {/* Wind Section */}
                        <div className="flex flex-col items-center justify-center p-3 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm">
                            <WindIcon className="scale-75 mb-1" />
                            <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-1">{t.wind}</span>
                            <span className="text-lg font-semibold text-gray-600">
                                {weather.current_weather.windspeed} <span className="text-xs">km/h</span>
                            </span>
                        </div>

                        {/* Outfit Recommendation Widget */}
                        <OutfitWidget 
                            temperature={weather.current_weather.apparent_temperature || weather.current_weather.temperature}
                            weatherCode={weather.current_weather.weathercode}
                            isDay={weather.current_weather.is_day === 1}
                            lang={language}
                            label={t.outfitTitle}
                        />

                        {/* Temp Min/Max Section */}
                        <div className="col-span-2 flex items-center justify-between px-6 py-3 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <TempIcon className="scale-75" />
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">{t.minMax}</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-600">
                                {Math.round(weather.daily.temperature_2m_min[0])}° / {Math.round(weather.daily.temperature_2m_max[0])}°
                            </span>
                        </div>
                    </div>
                </div>

                {/* Hourly Forecast */}
                <HourlyForecast data={weather.hourly} label={t.hourly} />

                {/* Daily Forecast Scroll */}
                <div className="mb-8">
                    <h3 className="text-gray-600 font-bold ml-4 mb-3">{t.nextDays}</h3>
                    <div className="flex gap-3 overflow-x-auto pb-4 px-2 scrollbar-hide">
                        {weather.daily.time.slice(1, 7).map((date, index) => (
                            <DailyCard 
                                key={date}
                                date={date}
                                locale={language === 'es' ? 'es-ES' : 'en-US'}
                                maxTemp={weather.daily.temperature_2m_max[index + 1]}
                                minTemp={weather.daily.temperature_2m_min[index + 1]}
                                code={weather.daily.weathercode[index + 1]}
                            />
                        ))}
                    </div>
                </div>
            </>
        ) : null}
      </div>

      <footer className="mt-auto py-4 text-center text-gray-400 text-sm relative z-10">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
};

export default App;