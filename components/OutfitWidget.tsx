import React, { useState } from 'react';
import { getOutfitRecommendation } from '../lib/cozyAssets';

interface OutfitWidgetProps {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  apparentTemperature?: number;
  windspeed?: number;
  lang: 'es' | 'en';
  label: string;
}

const OutfitWidget: React.FC<OutfitWidgetProps> = ({ temperature, weatherCode, isDay, apparentTemperature, windspeed = 0, lang, label }) => {
  const [isBouncing, setIsBouncing] = useState(false);

  const triggerBounce = () => {
    if (isBouncing) return;
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
  };

  const outfit = getOutfitRecommendation(temperature, weatherCode, isDay, apparentTemperature ?? temperature, windspeed);

  const boingStyle = `
    @keyframes boing-widget {
      0% { transform: scale(1) rotate(-6deg); }
      30% { transform: scale(1.25, 0.75) rotate(-6deg); }
      40% { transform: scale(0.75, 1.25) rotate(-6deg); }
      50% { transform: scale(1.15, 0.85) rotate(-6deg); }
      65% { transform: scale(0.95, 1.05) rotate(-6deg); }
      75% { transform: scale(1.05, 0.95) rotate(-6deg); }
      100% { transform: scale(1) rotate(-6deg); }
    }
  `;

  return (
    <div
      className="home-v3-editorial-card home-v3-editorial-card--outfit storybook-panel flex cursor-pointer select-none items-center gap-2.5 rounded-[1.65rem] p-3.5 touch-manipulation"
      onClick={triggerBounce}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <style>{boingStyle}</style>
      <div
        className={`home-v3-card-orb shrink-0 transform origin-center transition-transform duration-300 ${isBouncing ? '' : 'hover:scale-110 active:scale-95'}`}
        style={isBouncing ? { animation: 'boing-widget 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' } : { transform: 'rotate(-6deg)' }}
      >
        <img
          src={outfit.src}
          alt={outfit.alt[lang]}
          className="cozy-card-asset h-14 w-14"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="min-w-0">
        <span className="mb-1 block whitespace-nowrap text-[10px] font-black uppercase tracking-[0.08em] text-[#d98c84]">{label}</span>
        <span className="block text-[0.95rem] font-black leading-snug text-[#4d382f]">{outfit.text[lang]}</span>
      </div>
    </div>
  );
};

export default OutfitWidget;
