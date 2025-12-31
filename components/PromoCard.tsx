import React, { useState } from 'react';
import CatAvatar from './CatAvatar';
import WeatherIcon from './WeatherIcon';
import { ScarfIcon, UmbrellaIcon, SunglassesIcon, TShirtIcon } from './OutfitIcons';

interface PromoCardProps {
  onClose: () => void;
  weatherCode: number;
  temperature: number;
  isDay: boolean;
  locationName: string;
  language: 'es' | 'en';
}

const translations = {
  es: {
    appTitle: "Cozy Weather",
    subtitle: "El tiempo ahora en",
    footer: "Disponible en web y móvil",
    capture: "✨ Haz una captura para compartir la imagen ✨",
    shareLink: "Compartir Enlace",
    close: "Cerrar",
    copied: "¡Enlace copiado!",
    shareText: "¡El clima está adorable! 🌸☁️ ¡Entra en Cozy Weather y comparte tu día! 👇"
  },
  en: {
    appTitle: "Cozy Weather",
    subtitle: "Current weather in",
    footer: "Available on web & mobile",
    capture: "✨ Take a screenshot to share the image ✨",
    shareLink: "Share Link",
    close: "Close",
    copied: "Link copied!",
    shareText: "The weather is lovely! 🌸☁️ Come into Cozy Weather and share your day! 👇"
  }
};

const PromoCard: React.FC<PromoCardProps> = ({ 
  onClose, 
  weatherCode, 
  temperature, 
  isDay, 
  locationName, 
  language 
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  // Determine which decorative icon to show based on weather
  const isRain = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isSnow = (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);
  const isClear = weatherCode === 0 || weatherCode === 1;

  const handleShare = async () => {
    const url = window.location.href;
    const text = t.shareText;
    const fullShareText = `${text} ${url}`;

    // 1. Try Native Share (Mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cozy Weather',
          text: text,
          url: url
        });
        return; 
      } catch (err) {
        // User cancelled or failed, proceed to clipboard
        console.log("Native share skipped", err);
      }
    } 
    
    // 2. Robust Clipboard Logic
    let success = false;
    
    // Try Modern Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(fullShareText);
        success = true;
      } catch (err) {
        console.warn("Clipboard API failed", err);
      }
    }

    // Try Legacy execCommand (Fallback) if API failed
    if (!success) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = fullShareText;
        
        // Make it technically visible but off-screen to satisfy browser security requirements
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.warn("execCommand failed", err);
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      // 3. Ultimate Fallback: Manual Copy
      prompt(language === 'es' ? "Copia este enlace:" : "Copy this link:", url);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md h-[100dvh] w-full overflow-hidden">
      
      {/* 
          CLOSE BUTTON 
          Absolute Top Right
      */}
      <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-[130] flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-5 py-3 rounded-full backdrop-blur-md transition-all border border-white/30 shadow-lg active:scale-95 cursor-pointer"
      >
          <span className="text-xl leading-none">✕</span> 
          <span className="text-sm uppercase tracking-wider hidden sm:inline">{t.close}</span>
      </button>

      {/* 
          CENTER: THE CARD
          Absolute centering ensures it's always in the middle.
          Changed from -translate-y-[55%] to -translate-y-[62%] to move card UP and clear space for bottom text.
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[62%] flex items-center justify-center z-10 w-full pointer-events-none">
          
          <div className="transform origin-center transition-transform duration-300 pointer-events-auto
                          scale-[0.24]      
                          min-[375px]:scale-[0.28] 
                          min-[425px]:scale-[0.32]
                          sm:scale-[0.45]
                          md:scale-[0.6]
                          lg:scale-[0.75]
                          xl:scale-[0.85]
                          shadow-2xl rounded-[3rem] select-none"
          >
            {/* THE CARD - Fixed 1200x630 Layout */}
            <div 
                id="social-card"
                className="w-[1200px] h-[630px] bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 relative overflow-hidden flex items-center justify-between px-24 py-12 rounded-[3rem] border-[12px] border-white box-border"
            >
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
                     <div className="absolute top-10 right-20 w-80 h-80 bg-yellow-200 rounded-full blur-[120px]"></div>
                     <div className="absolute bottom-10 left-20 w-96 h-96 bg-pink-300 rounded-full blur-[120px]"></div>
                </div>

                {/* Left Side: Info */}
                <div className="flex flex-col items-start space-y-6 z-10 max-w-xl">
                    <div className="bg-white/60 backdrop-blur-md px-8 py-3 rounded-full border border-white/50 inline-block transform -rotate-2 shadow-sm">
                        <span className="text-pink-500 font-bold tracking-widest uppercase text-xl">Web App & PWA</span>
                    </div>
                    
                    <div>
                        <h2 className="text-4xl text-slate-500 font-medium mb-2">{t.subtitle}</h2>
                        <h1 className="text-8xl font-black text-slate-800 tracking-tight leading-none drop-shadow-sm line-clamp-2">
                            {locationName}
                        </h1>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            {Math.round(temperature)}°
                        </span>
                        <div className="bg-white/50 px-6 py-2 rounded-2xl backdrop-blur-sm">
                            <span className="text-3xl text-slate-600 font-bold">
                                {isDay ? (language === 'es' ? 'Día' : 'Day') : (language === 'es' ? 'Noche' : 'Night')}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t-4 border-white/50 w-full">
                        <p className="text-3xl font-bold text-slate-700">
                            {t.appTitle} <span className="text-pink-400">.app</span>
                        </p>
                        <p className="text-xl text-slate-500 font-medium mt-1">{t.footer}</p>
                    </div>
                </div>

                {/* Right Side: Visuals */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="absolute -top-32 -right-32 animate-[pulse_6s_ease-in-out_infinite]">
                        <WeatherIcon code={weatherCode} isDay={isDay ? 1 : 0} size="xl" className="opacity-30 scale-[2]" />
                    </div>
                    
                    <div className="relative bg-white/40 backdrop-blur-xl border-[6px] border-white/60 p-16 rounded-[4rem] shadow-xl transform rotate-3 transition-transform hover:rotate-0 hover:scale-105 duration-500">
                        <CatAvatar 
                            weatherCode={weatherCode} 
                            temperature={temperature} 
                            isDay={isDay} 
                            className="w-96 h-96 drop-shadow-2xl"
                        />
                        <div className="absolute -top-12 -left-12 transform -rotate-12 bg-white/90 p-5 rounded-3xl shadow-lg border-2 border-white">
                             {isRain ? <UmbrellaIcon className="w-24 h-24" /> : 
                              isSnow || temperature < 10 ? <ScarfIcon className="w-24 h-24" /> :
                              isClear && isDay ? <SunglassesIcon className="w-24 h-24" /> :
                              <TShirtIcon className="w-24 h-24" />}
                        </div>
                    </div>
                </div>
            </div>
          </div>
      </div>

      {/* 
          BOTTOM ACTIONS CONTAINER - ABSOLUTE POSITIONED
          Pinned to bottom: 0. 
          High Z-Index (120) to ensure it sits ON TOP of the card if they overlap.
      */}
      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end pb-8 pt-20 px-4 z-[120] bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pointer-events-none">
        
        {/* Wrapper div to capture pointer events for buttons/text */}
        <div className="flex flex-col items-center gap-6 pointer-events-auto">
            <p className="text-pink-200/90 font-bold uppercase tracking-widest text-xs sm:text-sm animate-pulse text-center drop-shadow-md mb-1">
                {t.capture}
            </p>
            
            <button 
                onClick={handleShare}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 border border-white/10 ${
                    copied 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-pink-500 text-white hover:bg-pink-600 hover:shadow-pink-500/30'
                }`}
            >
                {copied ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {t.copied}
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>
                        {t.shareLink}
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;