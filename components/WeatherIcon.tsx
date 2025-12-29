import React, { useState, useCallback } from 'react';
import { StickerPath, StickerLine, StickerCircle, shadowFilter } from './StitchedUtils';

// --- New Exported Decorator Icons ---

export const WindIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`w-16 h-16 ${className} relative flex items-center justify-center select-none`}>
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
      <g filter="url(#dropShadow)">
        {/* Wind Streamers */}
        <g className="animate-[pulse_3s_ease-in-out_infinite]">
            <StickerPath d="M 15,35 Q 40,15 65,35 T 95,35" fillClass="fill-none" strokeClass="stroke-pink-400" />
        </g>
        <g className="animate-[pulse_3s_ease-in-out_infinite] delay-150">
            <StickerPath d="M 5,55 Q 35,35 60,55" fillClass="fill-none" strokeClass="stroke-pink-300" />
        </g>
        <g className="animate-[pulse_3s_ease-in-out_infinite] delay-300">
             <StickerPath d="M 20,75 Q 50,60 80,75" fillClass="fill-none" strokeClass="stroke-pink-400" />
        </g>
      </g>
    </svg>
  </div>
);

export const TempIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`w-16 h-16 ${className} relative flex items-center justify-center select-none`}>
     <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
      <g filter="url(#dropShadow)">
         {/* Thermometer Bulb & Stem */}
         <StickerPath 
            d="M 35,25 A 15,15 0 0 1 65,25 L 65,60 A 20,20 0 1 1 35,60 Z" 
            fillClass="fill-blue-100" 
            strokeClass="stroke-blue-400" 
         />
         {/* Liquid Level */}
         <StickerCircle cx="50" cy="70" r="10" fillClass="fill-blue-400" strokeClass="stroke-blue-500" />
         <StickerLine x1="50" y1="70" x2="50" y2="35" strokeClass="stroke-blue-400" />
      </g>
    </svg>
  </div>
);


// --- Main Weather Icon Component ---

interface WeatherIconProps {
  code: number;
  isDay: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay, size = 'md', className = '' }) => {
  const [isBouncing, setIsBouncing] = useState(false);

  const triggerBounce = useCallback(() => {
    if (isBouncing) return;
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600); // Duration matches animation
  }, [isBouncing]);

  // Size mapping
  const sizeClasses = {
    sm: 'w-16 h-16', 
    md: 'w-32 h-32', 
    lg: 'w-48 h-48',
    xl: 'w-72 h-72', 
  };

  const containerSize = sizeClasses[size] || sizeClasses.md;

  // Weather Condition Logic
  const isClear = code === 0;
  const isPartlyCloudy = code === 1 || code === 2;
  const isOvercast = code === 3;
  const isFog = code === 45 || code === 48;
  const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isSnow = (code >= 71 && code <= 77) || (code >= 85 && code <= 86);
  const isThunder = code >= 95;

  // --- Renderers ---

  const renderSun = () => (
    <g className="origin-center animate-[spin_20s_linear_infinite]">
      {/* Rays */}
      <g>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 50 50)`}>
             <StickerLine x1="50" y1="20" x2="50" y2="10" strokeClass="stroke-amber-400" />
          </g>
        ))}
      </g>
      {/* Core */}
      <StickerCircle cx="50" cy="50" r="18" fillClass="fill-amber-200" strokeClass="stroke-amber-500" />
    </g>
  );

  const renderMoon = () => (
    <g>
      {/* Round Full Moon - White */}
      <StickerCircle 
        cx="50" cy="50" r="28" 
        fillClass="fill-white" 
        strokeClass="stroke-slate-300" 
      />
      
      {/* Craters - to make it look like a moon and not just a ball */}
      <g opacity="0.4">
          <circle cx="35" cy="40" r="5" className="fill-slate-300" />
          <circle cx="65" cy="55" r="7" className="fill-slate-300" />
          <circle cx="50" cy="70" r="3" className="fill-slate-300" />
      </g>

      {/* Stars - repositioned for the round shape */}
      <g className="animate-pulse">
         <StickerCircle cx="15" cy="20" r="3" fillClass="fill-yellow-200" strokeClass="stroke-yellow-400" />
      </g>
       <g className="animate-pulse delay-700">
         <StickerCircle cx="85" cy="30" r="2" fillClass="fill-yellow-200" strokeClass="stroke-yellow-400" />
      </g>
    </g>
  );

  const cloudPath = "M 20,60 Q 20,45 32,42 Q 38,28 55,30 Q 68,22 78,35 Q 90,35 90,52 Q 90,65 72,65 L 28,65 Q 20,65 20,60 Z";

  const renderCloud = (fillClass = "fill-slate-50", strokeClass = "stroke-slate-300") => (
    // Applied style directly for the specific animation name defined in css string below
    <g style={{ animation: 'cloud-drift 8s ease-in-out infinite' }}>
        <StickerPath d={cloudPath} fillClass={fillClass} strokeClass={strokeClass} />
    </g>
  );

  const renderRain = () => (
    <g>
      <g className="rain-group">
        <StickerLine x1="35" y1="70" x2="32" y2="80" strokeClass="stroke-blue-400" className="drop-1" />
        <StickerLine x1="55" y1="70" x2="52" y2="80" strokeClass="stroke-blue-400" className="drop-2" />
        <StickerLine x1="75" y1="70" x2="72" y2="80" strokeClass="stroke-blue-400" className="drop-3" />
      </g>
      {renderCloud("fill-blue-50", "stroke-blue-300")}
    </g>
  );
  
  const renderSnow = () => (
    <g>
       <g>
        <g className="flake-1"><StickerPath d="M 30,75 L 30,85 M 25,80 L 35,80" fillClass="fill-transparent" strokeClass="stroke-sky-300" /></g>
        <g className="flake-2"><StickerPath d="M 50,75 L 50,85 M 45,80 L 55,80" fillClass="fill-transparent" strokeClass="stroke-sky-300" /></g>
        <g className="flake-3"><StickerPath d="M 70,75 L 70,85 M 65,80 L 75,80" fillClass="fill-transparent" strokeClass="stroke-sky-300" /></g>
      </g>
      {renderCloud("fill-white", "stroke-slate-200")}
    </g>
  );

  const renderThunder = () => (
    <g>
      <g className="animate-[pulse_1s_ease-in-out_infinite]">
        <StickerPath 
            d="M 55,60 L 45,75 L 55,75 L 45,90 L 65,70 L 55,70 Z"
            fillClass="fill-yellow-200"
            strokeClass="stroke-yellow-500"
        />
      </g>
      {renderCloud("fill-slate-200", "stroke-slate-400")}
    </g>
  );
  
  const renderFog = () => (
     <g className="animate-[float_8s_ease-in-out_infinite]">
         <StickerLine x1="20" y1="35" x2="80" y2="35" strokeClass="stroke-gray-300" />
         <StickerLine x1="15" y1="50" x2="85" y2="50" strokeClass="stroke-gray-300" />
         <StickerLine x1="25" y1="65" x2="75" y2="65" strokeClass="stroke-gray-300" />
     </g>
  );
  
  const renderPartlyCloudy = () => (
      <g>
          {/* Shifted the background element (Sun/Moon) so it peeks out more clearly.
              We scale the moon down slightly and move it to the top-right so it peeks over the cloud.
          */}
          <g transform="translate(15, -15) scale(0.75)">
              {isDay ? renderSun() : renderMoon()}
          </g>
          {renderCloud()}
      </g>
  );

  const renderContent = () => {
      if (isThunder) return renderThunder();
      if (isSnow) return renderSnow();
      if (isRain) return renderRain();
      if (isFog) return renderFog();
      if (isOvercast) return renderCloud("fill-gray-100", "stroke-gray-400");
      if (isPartlyCloudy) return renderPartlyCloudy();
      if (isClear) return isDay ? renderSun() : renderMoon();
      return renderSun();
  };

  const css = `
    /* Irregular drifting cloud animation */
    @keyframes cloud-drift {
      0% { transform: translate(0px, 0px); opacity: 1; }
      20% { transform: translate(2px, -2px); opacity: 0.95; }
      45% { transform: translate(-1px, -6px); opacity: 1; }
      75% { transform: translate(-3px, -3px); opacity: 0.95; }
      100% { transform: translate(0px, 0px); opacity: 1; }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    
    .drop-1 { animation: rain 1.2s linear infinite; }
    .drop-2 { animation: rain 1.2s linear infinite 0.4s; }
    .drop-3 { animation: rain 1.2s linear infinite 0.8s; }
    
    @keyframes rain {
      0% { transform: translateY(0); opacity: 0; }
      20% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(20px); opacity: 0; }
    }

    .flake-1 { animation: snow 4s linear infinite; transform-box: fill-box; transform-origin: center; }
    .flake-2 { animation: snow 4s linear infinite 1.5s; transform-box: fill-box; transform-origin: center; }
    .flake-3 { animation: snow 4s linear infinite 2.5s; transform-box: fill-box; transform-origin: center; }

    @keyframes snow {
      0% { transform: translateY(-5px) rotate(0deg); opacity: 0; }
      20% { opacity: 1; }
      100% { transform: translateY(25px) rotate(180deg); opacity: 0; }
    }

    /* Boing Interaction Animation */
    .animate-boing {
      animation: boing 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes boing {
      0% { transform: scale(1); }
      30% { transform: scale(1.25, 0.75); }
      40% { transform: scale(0.75, 1.25); }
      50% { transform: scale(1.15, 0.85); }
      65% { transform: scale(0.95, 1.05); }
      75% { transform: scale(1.05, 0.95); }
      100% { transform: scale(1); }
    }
  `;

  return (
    <div 
      className={`${containerSize} ${className} relative flex items-center justify-center select-none cursor-pointer touch-manipulation`}
      onClick={triggerBounce}
      style={{ WebkitTapHighlightColor: 'transparent' }} // Removes blue tap highlight on mobile
    >
      <style>{css}</style>
      <svg 
        viewBox="0 0 100 100" 
        className={`w-full h-full overflow-visible transition-transform duration-300 ${isBouncing ? 'animate-boing' : 'hover:scale-110 active:scale-95'}`}
      >
        <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
        <g filter="url(#dropShadow)">
          {renderContent()}
        </g>
      </svg>
    </div>
  );
};

export default WeatherIcon;