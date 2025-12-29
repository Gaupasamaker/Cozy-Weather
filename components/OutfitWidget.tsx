import React, { useState } from 'react';
import { ScarfIcon, JacketIcon, TShirtIcon, SunglassesIcon, UmbrellaIcon } from './OutfitIcons';

interface OutfitWidgetProps {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  lang: 'es' | 'en';
  label: string;
}

const OutfitWidget: React.FC<OutfitWidgetProps> = ({ temperature, weatherCode, isDay, lang, label }) => {
  const [isBouncing, setIsBouncing] = useState(false);

  const triggerBounce = () => {
    if (isBouncing) return;
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
  };
  
  const isRain = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isSnow = (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);
  const isClear = weatherCode === 0 || weatherCode === 1;

  // Determine outfit
  let IconComponent = TShirtIcon;
  let text = lang === 'es' ? "Ropa ligera" : "Light clothes";

  if (isRain) {
      IconComponent = UmbrellaIcon;
      text = lang === 'es' ? "Lleva paraguas" : "Take umbrella";
  } else if (isSnow) {
      IconComponent = ScarfIcon;
      text = lang === 'es' ? "¡Abrígate mucho!" : "Bundle up!";
  } else if (temperature < 10) {
      IconComponent = ScarfIcon;
      text = lang === 'es' ? "Bufanda necesaria" : "Scarf needed";
  } else if (temperature < 18) {
      IconComponent = JacketIcon;
      text = lang === 'es' ? "Chaqueta ligera" : "Light jacket";
  } else if (isClear && temperature > 22 && isDay) {
      IconComponent = SunglassesIcon;
      text = lang === 'es' ? "Gafas de sol" : "Sunglasses";
  }

  // Animation style
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
        className="flex flex-col items-center justify-center p-3 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm shadow-sm cursor-pointer touch-manipulation select-none"
        onClick={triggerBounce}
        style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <style>{boingStyle}</style>
      <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-1 text-center leading-tight">{label}</span>
      <div 
        className={`mb-1 transform transition-transform duration-300 origin-center ${isBouncing ? '' : 'hover:scale-110 active:scale-95'}`}
        style={isBouncing ? { animation: 'boing-widget 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' } : { transform: 'rotate(-6deg)' }}
      >
        <IconComponent className="w-20 h-20" />
      </div>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">{text}</span>
    </div>
  );
};

export default OutfitWidget;