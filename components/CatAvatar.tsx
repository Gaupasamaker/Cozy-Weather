import React, { useState, useEffect } from 'react';
import { StickerPath, StickerCircle, StickerLine, shadowFilter } from './StitchedUtils';

interface CatAvatarProps {
  weatherCode: number;
  temperature: number;
  isDay: boolean;
  className?: string;
}

type IdleAction = 'none' | 'ear-l' | 'ear-r' | 'wiggle' | 'look';

const CatAvatar: React.FC<CatAvatarProps> = ({ weatherCode, temperature, isDay, className = "" }) => {
  const [idleAction, setIdleAction] = useState<IdleAction>('none');

  // Random Idle Animations Setup
  useEffect(() => {
    const triggerRandomAction = () => {
      // More frequent actions to make it feel alive
      const actions: IdleAction[] = ['ear-l', 'ear-r', 'wiggle', 'look', 'none', 'none']; 
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      if (randomAction !== 'none') {
        setIdleAction(randomAction);
        // Reset after animation duration (approx 1s-2s)
        setTimeout(() => setIdleAction('none'), 2000);
      }
    };

    // Random interval between 3s and 7s (faster than before)
    const intervalTime = Math.floor(Math.random() * 4000) + 3000;
    const interval = setInterval(triggerRandomAction, intervalTime);
    return () => clearInterval(interval);
  }, []);

  // Logic Conditions
  const isRain = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isSnow = (weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86);
  const isThunder = weatherCode >= 95;
  const isClear = weatherCode === 0 || weatherCode === 1;
  
  const isCold = temperature < 12; 
  const isFreezing = temperature < 0;
  const isHot = temperature > 25;
  const isSleeping = !isDay && !isThunder;

  // Animation Logic
  let bodyAnimation = "animate-breathe";
  if (isSleeping) bodyAnimation = "animate-float";
  else if (isThunder || isFreezing) bodyAnimation = "animate-shiver-fast";
  else if (isCold) bodyAnimation = "animate-shiver";
  else if (isHot) bodyAnimation = "animate-pant";
  
  // Apply random happy wiggle to body if active
  if (idleAction === 'wiggle' && !isSleeping) {
      bodyAnimation = "animate-happy-wiggle";
  }

  // Palette - Calico / White Cat
  const bodyFill = "fill-[#fffcf5]"; // Soft Cream
  const bodyStroke = "stroke-[#e2d5c5]"; // Latte outline
  const earInner = "fill-[#ffccd5]"; 
  const patchColor = "fill-[#e6ccb2]"; // Light brown patch

  // CSS Styles
  const styles = `
    @keyframes tail-sway {
      0% { transform: rotate(0deg); }
      50% { transform: rotate(12deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes ear-twitch {
        0% { transform: rotate(0deg); }
        30% { transform: rotate(20deg); }
        60% { transform: rotate(-5deg); }
        100% { transform: rotate(0deg); }
    }
    @keyframes blink {
      0%, 96%, 100% { transform: scaleY(1); }
      98% { transform: scaleY(0.1); }
    }
    @keyframes look-around {
      0%, 100% { transform: translate(0, 0); }
      20% { transform: translate(-2px, 0); }
      80% { transform: translate(-2px, 0); }
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.015); }
    }
    @keyframes happy-wiggle {
      0%, 100% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(-3deg) scale(1.02); }
      75% { transform: rotate(3deg) scale(1.02); }
    }
    @keyframes pant {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(1px) scale(1.01, 0.99); }
    }
    @keyframes shiver {
      0% { transform: translateX(0); }
      25% { transform: translateX(1px); }
      50% { transform: translateX(-1px); }
      75% { transform: translateX(1px); }
      100% { transform: translateX(0); }
    }
    @keyframes shiver-fast {
      0% { transform: translate(0, 0); }
      25% { transform: translate(1.5px, 1.5px); }
      50% { transform: translate(-1.5px, -0.5px); }
      75% { transform: translate(0.5px, 1.5px); }
      100% { transform: translate(0, 0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
    }
    @keyframes snore {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.5) translateY(-10px); opacity: 0; }
    }

    .animate-tail { animation: tail-sway 4s ease-in-out infinite; transform-origin: 75px 85px; }
    
    /* Random actions */
    .animate-ear-twist { animation: ear-twitch 0.4s ease-in-out; }
    .animate-look { animation: look-around 2s ease-in-out; }
    .animate-happy-wiggle { animation: happy-wiggle 0.6s ease-in-out; transform-origin: bottom center; }

    /* Constant life */
    .animate-blink { animation: blink 5s infinite; transform-origin: center; transform-box: fill-box; }
    .animate-breathe { animation: breathe 3s infinite ease-in-out; transform-origin: bottom center; }
    
    .animate-pant { animation: pant 1.5s infinite ease-in-out; transform-origin: bottom center; }
    .animate-shiver { animation: shiver 0.3s infinite linear; }
    .animate-shiver-fast { animation: shiver-fast 0.15s infinite linear; }
    .animate-float { animation: float 4s infinite ease-in-out; }
    .animate-snore { animation: snore 3s infinite ease-out; }
  `;

  const renderTail = () => (
    <g className={!isSleeping ? "animate-tail" : ""} style={{ transformOrigin: '75px 85px' }}>
         <StickerPath 
            d="M 75,85 Q 95,85 95,65 Q 95,50 85,55 Q 80,60 85,75" 
            fillClass={patchColor} 
            strokeClass={bodyStroke} 
         />
    </g>
  );

  const renderEars = () => (
    <g>
        {/* Left Ear */}
        {/* Static rotation -15, Pivot approx 35,40 */}
        <g transform="rotate(-15 35 40)">
             <g 
                className={idleAction === 'ear-l' ? "animate-ear-twist" : ""}
                style={{ transformOrigin: '35px 40px' }}
             >
                <StickerPath d="M 35,45 L 25,20 L 50,35 Z" fillClass={patchColor} strokeClass={bodyStroke} />
                <path d="M 35,40 L 30,28 L 42,35 Z" className={earInner} opacity="0.6" />
             </g>
        </g>
        
        {/* Right Ear */}
        {/* Static rotation 15, Pivot approx 65,40 */}
        <g transform="rotate(15 65 40)">
            <g 
                className={idleAction === 'ear-r' ? "animate-ear-twist" : ""} 
                style={{ transformOrigin: '65px 40px' }}
            >
                <StickerPath d="M 65,45 L 75,20 L 50,35 Z" fillClass={bodyFill} strokeClass={bodyStroke} />
                <path d="M 65,40 L 70,28 L 58,35 Z" className={earInner} opacity="0.6" />
            </g>
        </g>
    </g>
  );

  const renderBodyAndPaws = () => (
      <g>
          {/* Main Body */}
          <StickerPath 
            d="M 30,90 Q 20,95 40,95 L 60,95 Q 80,95 70,90 Q 85,80 75,60 L 25,60 Q 15,80 30,90" 
            fillClass={bodyFill}
            strokeClass={bodyStroke}
          />
          {/* Paws */}
          <StickerCircle cx="40" cy="90" r="6" fillClass="fill-white" strokeClass={bodyStroke} />
          <StickerCircle cx="60" cy="90" r="6" fillClass="fill-white" strokeClass={bodyStroke} />
      </g>
  );

  const renderHead = () => (
      <StickerCircle cx="50" cy="55" r="23" fillClass={bodyFill} strokeClass={bodyStroke} />
  );

  const renderFace = () => (
      <g>
          {/* Cheeks */}
          <circle cx="35" cy="62" r="4" className="fill-pink-200 opacity-60 blur-[1px]" />
          <circle cx="65" cy="62" r="4" className="fill-pink-200 opacity-60 blur-[1px]" />

          {/* Whiskers - Clean lines */}
          <g opacity="0.5">
             <StickerLine x1="32" y1="62" x2="18" y2="59" strokeClass="stroke-gray-400" />
             <StickerLine x1="32" y1="66" x2="20" y2="70" strokeClass="stroke-gray-400" />
             
             <StickerLine x1="68" y1="62" x2="82" y2="59" strokeClass="stroke-gray-400" />
             <StickerLine x1="68" y1="66" x2="80" y2="70" strokeClass="stroke-gray-400" />
          </g>

          {/* Eyes & Mouth Logic */}
          {isSleeping ? (
              // Sleeping
              <g>
                   <path d="M 38,55 Q 43,58 48,55" className="stroke-[#8d6e63] fill-none" strokeWidth="2" strokeLinecap="round" />
                   <path d="M 52,55 Q 57,58 62,55" className="stroke-[#8d6e63] fill-none" strokeWidth="2" strokeLinecap="round" />
                   <g className="animate-snore origin-bottom-left" transform="translate(70, 40)">
                      <text x="0" y="0" className="fill-blue-400 font-bold text-sm">Zzz</text>
                  </g>
              </g>
          ) : isThunder ? (
              // Scared >_<
              <g className="animate-shiver-fast">
                   <path d="M 35,52 L 42,57 M 35,57 L 42,52" className="stroke-[#8d6e63]" strokeWidth="2" strokeLinecap="round" />
                   <path d="M 58,52 L 65,57 M 58,57 L 65,52" className="stroke-[#8d6e63]" strokeWidth="2" strokeLinecap="round" />
                   <path d="M 48,63 Q 50,60 52,63" className="stroke-[#8d6e63] fill-none" strokeWidth="2" strokeLinecap="round" />
                   <path d="M 45,65 Q 50,70 55,65" className="stroke-blue-300 fill-none" strokeWidth="1.5" /> 
              </g>
          ) : isClear && isDay && isHot ? (
              // Sunglasses
              <g>
                  <g className="animate-blink">
                    <path d="M 32,50 Q 32,58 42,58 Q 50,58 50,50 Z" className="fill-slate-800" />
                    <path d="M 50,50 Q 50,58 58,58 Q 66,58 66,50 Z" className="fill-slate-800" />
                    <line x1="25" y1="51" x2="32" y2="51" className="stroke-slate-800" strokeWidth="2" />
                    <line x1="66" y1="51" x2="75" y2="51" className="stroke-slate-800" strokeWidth="2" />
                  </g>
                  <path d="M 45,63 Q 50,66 55,63" className="stroke-[#8d6e63] fill-none" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 68,45 Q 72,50 68,55" className="fill-blue-200 animate-pulse" /> 
              </g>
          ) : (
              // Normal Cute Eyes
              <g>
                  {/* Blinking Container */}
                  <g className="animate-blink">
                    {/* Looking around container */}
                    <g className={idleAction === 'look' ? "animate-look" : ""}>
                        <circle cx="40" cy="55" r="4" className="fill-[#4a4a4a]" />
                        <circle cx="42" cy="53" r="1.5" className="fill-white" /> 
                        
                        <circle cx="60" cy="55" r="4" className="fill-[#4a4a4a]" />
                        <circle cx="62" cy="53" r="1.5" className="fill-white" /> 
                    </g>
                  </g>

                  {/* Tiny Nose & Mouth */}
                  <circle cx="50" cy="61" r="2" className="fill-pink-300" />
                  <path d="M 46,65 Q 50,68 54,65" className="stroke-[#8d6e63] fill-none" strokeWidth="2" strokeLinecap="round" />
              </g>
          )}
      </g>
  );

  const renderAccessories = () => (
      <g>
        {/* Scarf (Cozy) */}
        {(isCold || isSnow) && (
            <g>
                 <path d="M 30,75 Q 50,85 70,75" className="stroke-indigo-400 fill-none" strokeWidth="10" strokeLinecap="round" />
                 <path d="M 30,75 Q 50,85 70,75" className="stroke-indigo-300 fill-none" strokeWidth="6" strokeLinecap="round" />
                 <path d="M 65,75 L 70,90" className="stroke-indigo-400" strokeWidth="7" strokeLinecap="round" />
            </g>
        )}
        {/* Umbrella (Rain) */}
        {isRain && (
             <g transform="translate(68, 45) rotate(20)">
                 <path d="M 5,0 L 5,50" className="stroke-gray-400" strokeWidth="3" strokeLinecap="round" />
                 <path d="M 5,50 Q 5,55 10,55" className="stroke-gray-400 fill-none" strokeWidth="3" />
                 <path d="M -15,0 Q 5,-15 25,0 Z" className="fill-blue-300 stroke-blue-500" strokeWidth="2" />
             </g>
        )}
      </g>
  );

  return (
    <div className={`w-40 h-40 ${className} relative flex items-center justify-center select-none`}>
       <style>{styles}</style>
       <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-lg">
         <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
         <g filter="url(#dropShadow)">
            <g className={bodyAnimation}>
                {renderTail()}
                {renderEars()}
                {renderBodyAndPaws()}
                {renderHead()}
                {renderFace()}
                {renderAccessories()}
            </g>
         </g>
       </svg>
    </div>
  );
};

export default CatAvatar;