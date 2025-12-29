import React from 'react';

interface AtmosphericBackgroundProps {
  weatherCode: number;
  isDay: boolean;
}

const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ weatherCode, isDay }) => {
  // Weather Logic
  const isRain = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isSnow = (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);
  const isThunder = weatherCode >= 95;
  
  // Broader logic for clouds: 1 (Mainly clear), 2 (Partly cloudy), 3 (Overcast), 45/48 (Fog)
  const isCloudy = weatherCode === 1 || weatherCode === 2 || weatherCode === 3 || weatherCode === 45 || weatherCode === 48;
  
  // Strictly Clear (0) gets Sun Rays only
  const isClear = weatherCode === 0;

  const css = `
    .atmos-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
      z-index: 0; /* Behind content */
    }

    /* Rain Animation */
    .rain-drop {
      position: absolute;
      background: rgba(255, 255, 255, 0.6);
      width: 2px;
      height: 15px;
      border-radius: 2px;
      animation: fall linear infinite;
    }

    /* Snow Animation */
    .snowflake {
      position: absolute;
      background: white;
      border-radius: 50%;
      opacity: 0.9;
      box-shadow: 0 0 3px rgba(255,255,255,0.8);
      animation: fall-sway linear infinite;
    }

    /* Cloud Animation */
    .bg-cloud {
      position: absolute;
      color: rgba(255, 255, 255, 0.7); /* White with slight transparency */
      animation: drift linear infinite;
      will-change: transform;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05)); /* Subtle shadow to pop against light bg */
    }

    /* Sun Ray Animation */
    .sun-ray-container {
      position: absolute;
      top: -20%;
      right: -20%;
      width: 1000px;
      height: 1000px;
      animation: spin-slow 80s linear infinite;
      opacity: 0.5; /* More visible rays */
      pointer-events: none;
    }
    .sun-ray {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 80px; 
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
      transform-origin: center;
    }

    @keyframes fall {
      to { transform: translateY(110vh); }
    }

    @keyframes fall-sway {
      0% { transform: translateY(-10vh) translateX(0px); }
      50% { transform: translateY(50vh) translateX(20px); }
      100% { transform: translateY(110vh) translateX(-10px); }
    }

    @keyframes drift {
      from { transform: translateX(-150px); }
      to { transform: translateX(120vw); }
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes flash {
        0%, 95% { opacity: 0; }
        96% { opacity: 0.4; }
        100% { opacity: 0; }
    }
    
    .thunder-flash {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background-color: white;
        animation: flash 5s infinite;
    }
  `;

  // Kawaii Cloud SVG Component
  const CloudSVG: React.FC<{ style: React.CSSProperties, className?: string }> = ({ style, className }) => (
    <div className={`bg-cloud ${className}`} style={style}>
        <svg viewBox="0 0 100 60" width="100%" height="100%" fill="currentColor">
            <path d="M 15,45 Q 15,30 30,30 Q 35,10 55,15 Q 65,5 80,15 Q 95,15 90,35 Q 95,50 80,55 L 25,55 Q 5,55 15,45 Z" />
        </svg>
    </div>
  );

  const renderRain = () => (
    <>
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            animationDuration: `${0.5 + Math.random() * 0.4}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </>
  );

  const renderSnow = () => (
    <>
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            width: `${5 + Math.random() * 8}px`,
            height: `${5 + Math.random() * 8}px`,
            animationDuration: `${4 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </>
  );

  const renderClouds = () => (
    <>
      {[...Array(6)].map((_, i) => {
        const size = 150 + Math.random() * 200;
        return (
            <CloudSVG
                key={i}
                style={{
                    top: `${5 + Math.random() * 60}%`,
                    width: `${size}px`,
                    height: `${size * 0.6}px`, // Keep aspect ratio roughly
                    animationDuration: `${40 + Math.random() * 40}s`, // Slow drift
                    animationDelay: `-${Math.random() * 80}s`, // Start scattered
                    opacity: 0.4 + Math.random() * 0.4 // Varying opacity but generally visible
                }}
            />
        );
      })}
    </>
  );

  const renderSunRays = () => (
    <div className="sun-ray-container">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <div 
            key={deg} 
            className="sun-ray" 
            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }} 
        />
      ))}
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="atmos-container">
        {isThunder && <div className="thunder-flash" />}
        {(isRain || isThunder) && renderRain()}
        {isSnow && renderSnow()}
        {(isCloudy || isRain || isSnow) && renderClouds()} {/* Clouds often accompany rain/snow */}
        {(isClear && isDay) && renderSunRays()}
      </div>
    </>
  );
};

export default AtmosphericBackground;