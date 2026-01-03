import React, { useEffect, useState } from 'react';
import { getLocalRecommendations } from '../services/geminiService';

interface ActivityModalProps {
  onClose: () => void;
  lat: number;
  lon: number;
  weatherCode: number;
  temp: number;
  activityContext: string;
  lang: 'es' | 'en';
}

// Extracted and explicitly typed as React.FC to support 'key' prop in usage
const LinkCard: React.FC<{ chunk: any, idx: number }> = ({ chunk, idx }) => {
    const mapData = chunk.maps;
    const webData = chunk.web;
    const uri = mapData?.uri || webData?.uri;
    const title = mapData?.title || webData?.title || `Lugar ${idx + 1}`;
    
    if (!uri) return null;

    return (
        <a 
            href={uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-pink-100 shadow-sm hover:shadow-md hover:border-pink-300 transition-all group active:scale-[0.98] w-full"
        >
            <div className="w-9 h-9 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 group-hover:bg-pink-100 transition-colors shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm group-hover:text-pink-600 transition-colors truncate">{title}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Google Maps</p>
            </div>
            <div className="text-gray-300 group-hover:text-pink-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </a>
    );
};

const ActivityModal: React.FC<ActivityModalProps> = ({ onClose, lat, lon, weatherCode, temp, activityContext, lang }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string>('');
  const [activityChunks, setActivityChunks] = useState<any[]>([]);
  const [foodChunks, setFoodChunks] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPlans = async () => {
      // Pass the activityContext (e.g., "Go for a walk") to the service
      const result = await getLocalRecommendations(lat, lon, weatherCode, temp, activityContext, lang);
      if (isMounted) {
        if (result && result.text) {
          setContent(result.text);
          
          const allChunks = result.groundingMetadata?.groundingChunks || [];
          
          // Filter out chunks that don't have a valid URI
          const validChunks = allChunks.filter((c: any) => c.maps?.uri || c.web?.uri);

          // Deduplicate based on URI
          const uniqueChunks = validChunks.filter((chunk: any, index: number, self: any[]) => 
              index === self.findIndex((t) => (
                  (t.maps?.uri === chunk.maps?.uri) || (t.web?.uri === chunk.web?.uri && chunk.web?.uri)
              ))
          );
          
          // Split EXACTLY in half.
          // The prompt asks for equal numbers (3 Activity + 3 Food). 
          const splitIndex = Math.ceil(uniqueChunks.length / 2);

          // Enforce max 3 per category UI side as well to be safe
          setActivityChunks(uniqueChunks.slice(0, splitIndex).slice(0, 3));
          setFoodChunks(uniqueChunks.slice(splitIndex).slice(0, 3));

        } else {
          setContent(lang === 'es' 
            ? "Lo siento, no pude conectar con las nubes para buscar lugares. 🌧️" 
            : "Sorry, I couldn't connect to the clouds to find places. 🌧️");
        }
        setLoading(false);
      }
    };

    fetchPlans();

    return () => { isMounted = false; };
  }, [lat, lon, weatherCode, temp, activityContext, lang]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

        {/* Modal Card - WIDER (max-w-lg) and cleaner layout */}
        <div className="bg-[#fdf2f8] w-full sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-[2rem] shadow-2xl relative flex flex-col border-[6px] border-white">
            
            {/* Header */}
            <div className="p-6 pb-4 flex justify-between items-start sticky top-0 bg-[#fdf2f8] z-10 shadow-sm border-b border-pink-50">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                        {lang === 'es' ? "Planes Cercanos" : "Nearby Plans"}
                    </h2>
                    <p className="text-pink-500 font-medium text-sm mt-1">
                        {activityContext}
                    </p>
                </div>
                <button 
                    onClick={onClose}
                    className="bg-white p-2 rounded-full hover:bg-gray-100 transition shadow-sm border border-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="p-6 pt-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-medium animate-pulse">
                            {lang === 'es' ? "Buscando sitios kawaii..." : "Looking for cute places..."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* AI Text Intro */}
                        <div className="prose prose-pink text-gray-700 leading-relaxed whitespace-pre-wrap font-medium text-sm">
                            {content}
                        </div>

                        {/* SECTION 1: ACTIVITY */}
                        {activityChunks.length > 0 && (
                            <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 w-full">
                                <h4 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span>📍</span> {lang === 'es' ? "Plan Principal" : "Main Activity"}
                                </h4>
                                <div className="grid gap-2 w-full">
                                    {activityChunks.map((chunk, idx) => (
                                        <LinkCard key={`act-${idx}`} chunk={chunk} idx={idx} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SECTION 2: FOOD */}
                        {foodChunks.length > 0 && (
                            <div className="bg-yellow-50/50 p-4 rounded-2xl border border-yellow-100 w-full">
                                <h4 className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <span>☕</span> {lang === 'es' ? "Gastronomía" : "Gastronomy"}
                                </h4>
                                <div className="grid gap-2 w-full">
                                    {foodChunks.map((chunk, idx) => (
                                        <LinkCard key={`food-${idx}`} chunk={chunk} idx={idx} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className="p-4 bg-white/50 text-center text-xs text-gray-400">
                Powered by Google Gemini & Maps
            </div>
        </div>
    </div>
  );
};

export default ActivityModal;