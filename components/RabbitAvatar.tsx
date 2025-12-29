import React, { useState, useEffect } from 'react';
import { StickerPath, StickerCircle, shadowFilter } from './StitchedUtils';

interface RabbitAvatarProps {
  weatherCode: number;
  temperature: number;
  isDay: boolean;
  className?: string;
}

type IdleAction = 'none' | 'wave' | 'hop' | 'wiggle';

const RabbitAvatar: React.FC<RabbitAvatarProps> = ({ weatherCode, temperature, isDay, className = "" }) => {
  const [idleAction, setIdleAction] = useState<IdleAction>('none');

  // Random Idle Animations Setup
  useEffect(() => {
    const triggerRandomAction = () => {
      const actions: IdleAction[] = ['wave', 'hop', 'wiggle', 'none', 'none']; // weighted to 'none' slightly
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      if (randomAction !== 'none') {
        setIdleAction(randomAction);
        // Reset after animation duration
        setTimeout(() => setIdleAction('none'), 2000);
      }
    };

    // Random interval between 6s and 12s
    const intervalTime = Math.floor(Math.random() * 6000) + 6000;
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

  // Base Animation Logic based on weather
  let baseAnimation = "animate-breathe"; // Default
  if (isSleeping) baseAnimation = "animate-float";
  else if (isThunder || isFreezing) baseAnimation = "animate-shiver-fast";
  else if (isCold) baseAnimation = "animate-shiver";
  else if (isHot) baseAnimation = "animate-pant";

  // Override base animation if hopping (priority action)
  if (idleAction === 'hop') baseAnimation = "animate-hop";

  // Palette - Creamy White Rabbit
  const bodyFill = "fill-[#fff5ee]"; // Seashell / Cream
  const bodyStroke = "stroke-[#eecfa1]"; // Soft Gold/Tan for outline
  const earInner = "fill-[#ffccd5]"; // Pastel Pink
  
  // CSS Styles for Animations
  const styles = `
    @keyframes blink {
      0%, 96%, 100% { transform: scaleY(1); }
      98% { transform: scaleY(0.1); }
    }
    @keyframes twitch-left {
      0%, 100% { transform: rotate(-5deg); }
      50% { transform: rotate(-12deg); }
    }
    @keyframes twitch-right {
      0%, 100% { transform: rotate(10deg); }
      50% { transform: rotate(18deg); }
    }
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
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
    @keyframes wave {
      0%, 100% { transform: translateY(0); }
      20% { transform: translateY(-10px) rotate(-10deg); }
      40% { transform: translateY(-10px) rotate(10deg); }
      60% { transform: translateY(-10px) rotate(-10deg); }
      80% { transform: translateY(-10px) rotate(10deg); }
    }
    @keyframes hop {
      0%, 100% { transform: translateY(0) scale(1); }
      30% { transform: translateY(5px) scale(1.05, 0.9); } /* Anticipation squish */
      50% { transform: translateY(-15px) scale(0.9, 1.1); } /* Jump */
      70% { transform: translateY(0) scale(1.05, 0.95); } /* Landing squish */
    }
    @keyframes nose-wiggle {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(1px) translateY(-1px); }
      50% { transform: translateX(-1px) translateY(-1px); }
      75% { transform: translateX(1px) translateY(-1px); }
    }

    /* Animation Classes */
    .animate-blink { animation: blink 4s infinite; transform-origin: center; transform-box: fill-box; }
    .animate-twitch-l { animation: twitch-left 5s infinite ease-in-out; transform-origin: 40px 40px; }
    .animate-twitch-r { animation: twitch-right 4.2s infinite ease-in-out; transform-origin: 60px 40px; }
    .animate-breathe { animation: breathe 3s infinite ease-in-out; transform-origin: bottom center; }
    .animate-pant { animation: pant 1.5s infinite ease-in-out; transform-origin: bottom center; }
    .animate-shiver { animation: shiver 0.3s infinite linear; }
    .animate-shiver-fast { animation: shiver-fast 0.15s infinite linear; }
    .animate-float { animation: float 4s infinite ease-in-out; }
    .animate-snore { animation: snore 3s infinite ease-out; }
    
    /* Random Actions */
    .animate-wave { animation: wave 1.5s ease-in-out; transform-origin: 40px 75px; }
    .animate-hop { animation: hop 0.8s ease-in-out; transform-origin: bottom center; }
    .animate-wiggle { animation: nose-wiggle 0.5s ease-in-out infinite; }
  `;

  const renderEars = () => (
    <g>
        {/* Left Ear */}
        <g className={!isSleeping ? "animate-twitch-l" : ""} style={{ transformOrigin: '40px 40px' }} transform="rotate(-5 40 40)">
            <StickerPath 
                d="M 32,45 Q 25,10 40,8 Q 52,10 48,45" 
                fillClass={bodyFill}
                strokeClass={bodyStroke}
            />
            <path d="M 36,38 Q 32,20 40,15 Q 46,20 44,38" className={earInner} opacity="0.6" />
        </g>

        {/* Right Ear */}
        <g className={!isSleeping ? "animate-twitch-r" : ""} style={{ transformOrigin: '60px 40px' }} transform={isThunder ? "rotate(5 60 40)" : "rotate(10 60 40)"}>
            <StickerPath 
                d="M 52,45 Q 48,10 60,8 Q 75,10 68,45" 
                fillClass={bodyFill}
                strokeClass={bodyStroke}
            />
            <path d="M 56,38 Q 54,20 60,15 Q 68,20 64,38" className={earInner} opacity="0.6" />
        </g>
    </g>
  );

  const renderBody = () => (
    <StickerPath 
      d="M 35,85 Q 25,95 40,95 L 60,95 Q 75,95 65,85 Q 80,75 70,60 L 30,60 Q 20,75 35,85" 
      fillClass={bodyFill}
      strokeClass={bodyStroke}
    />
  );

  const renderPaws = () => (
    <g>
        {/* Left Paw - The Waving One */}
        <g className={idleAction === 'wave' ? 'animate-wave' : ''}>
            <StickerCircle cx="40" cy="75" r="5" fillClass={bodyFill} strokeClass={bodyStroke} />
        </g>
        
        {/* Right Paw */}
        <StickerCircle cx="60" cy="75" r="5" fillClass={bodyFill} strokeClass={bodyStroke} />
    </g>
  );

  const renderHead = () => (
      <StickerCircle cx="50" cy="55" r="24" fillClass={bodyFill} strokeClass={bodyStroke} />
  );

  const renderFace = () => (
      <g>
          {/* Cheeks */}
          <circle cx="35" cy="60" r="4" className="fill-pink-300 opacity-50 blur-[1px]" />
          <circle cx="65" cy="60" r="4" className="fill-pink-300 opacity-50 blur-[1px]" />

          {/* Eyes & Mouth Logic */}
          {isSleeping ? (
              // Sleeping
              <g>
                  <path d="M 38,55 Q 42,57 46,55" className="stroke-[#8d6e63] fill-none" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 54,55 Q 58,57 62,55" className="stroke-[#8d6e63] fill-none" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Zzz bubble animated */}
                  <g className="animate-snore origin-bottom-left" transform="translate(70, 40)">
                      <text x="0" y="0" className="fill-blue-400 font-bold text-sm">Zzz</text>
                  </g>
                  <g className="animate-snore origin-bottom-left" style={{ animationDelay: '1.5s' }} transform="translate(80, 30)">
                      <text x="0" y="0" className="fill-blue-400 font-bold text-xs">z</text>
                  </g>
              </g>
          ) : isThunder ? (
              // Scared >_<
              <g className="animate-shiver-fast">
                   <path d="M 38,52 L 44,56 M 38,56 L 44,52" className="stroke-[#8d6e63]" strokeWidth="2" strokeLinecap="round" />
                   <path d="M 56,52 L 62,56 M 56,56 L 62,52" className="stroke-[#8d6e63]" strokeWidth="2" strokeLinecap="round" />
                   <circle cx="50" cy="62" r="2" className="fill-pink-400" /> {/* O mouth */}
                   <path d="M 45,65 Q 50,70 55,65" className="stroke-blue-300 fill-none" strokeWidth="1.5" /> {/* Tear */}
              </g>
          ) : isClear && isDay && isHot ? (
              // Sunglasses
              <g>
                  <g className="animate-blink">
                    <path d="M 34,52 Q 34,60 42,60 Q 50,60 50,52 Z" className="fill-slate-800" />
                    <path d="M 50,52 Q 50,60 58,60 Q 66,60 66,52 Z" className="fill-slate-800" />
                    <line x1="28" y1="53" x2="34" y2="53" className="stroke-slate-800" strokeWidth="2" />
                    <line x1="66" y1="53" x2="72" y2="53" className="stroke-slate-800" strokeWidth="2" />
                  </g>
                  <path d="M 48,63 Q 50,65 52,63" className="stroke-[#8d6e63] fill-none" strokeWidth="2" strokeLinecap="round" />
                  {/* Sweat drop for heat */}
                  <path d="M 68,48 Q 72,55 68,60 Q 64,55 68,48" className="fill-blue-200 animate-pulse" /> 
              </g>
          ) : (
              // Normal Cute Eyes
              <g>
                  <g className="animate-blink">
                    <circle cx="40" cy="54" r="3.5" className="fill-[#4a4a4a]" />
                    <circle cx="41.5" cy="53" r="1.2" className="fill-white" /> {/* Sparkle */}
                    
                    <circle cx="60" cy="54" r="3.5" className="fill-[#4a4a4a]" />
                    <circle cx="61.5" cy="53" r="1.2" className="fill-white" /> {/* Sparkle */}
                  </g>

                  {/* Tiny Nose & Mouth */}
                  <g className={idleAction === 'wiggle' ? 'animate-wiggle' : ''}>
                      <path d="M 48,61 Q 50,63 52,61" className="stroke-[#8d6e63] fill-none" strokeWidth="2" strokeLinecap="round" />
                  </g>
              </g>
          )}
      </g>
  );

  const renderAccessories = () => (
      <g>
        {/* Scarf (Cozy) - Move with body */}
        {(isCold || isSnow) && (
            <g>
                 <path 
                    d="M 30,72 Q 50,82 70,72" 
                    className="stroke-rose-400 fill-none" strokeWidth="10" strokeLinecap="round" 
                 />
                 <path 
                    d="M 30,72 Q 50,82 70,72" 
                    className="stroke-rose-300 fill-none" strokeWidth="6" strokeLinecap="round" 
                 />
                 {/* Hanging part */}
                 <path d="M 60,75 L 65,90" className="stroke-rose-400" strokeWidth="7" strokeLinecap="round" />
                 <path d="M 60,75 L 65,90" className="stroke-rose-300" strokeWidth="3" strokeLinecap="round" />
            </g>
        )}

        {/* Umbrella (Rain) */}
        {isRain && (
             <g transform="translate(65, 40) rotate(15)">
                 <path d="M 5,0 L 5,50" className="stroke-gray-400" strokeWidth="3" strokeLinecap="round" />
                 <path d="M 5,50 Q 5,55 10,55" className="stroke-gray-400 fill-none" strokeWidth="3" />
                 <path d="M -15,0 Q 5,-15 25,0 Z" className="fill-sky-300 stroke-sky-500" strokeWidth="2" />
             </g>
        )}
      </g>
  );

  return (
    <div className={`w-40 h-40 ${className} relative flex items-center justify-center select-none`}>
       <style>{styles}</style>
       <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-lg">
         <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
         {/* Apply global filter */}
         <g filter="url(#dropShadow)">
            {/* The main animated group */}
            <g className={baseAnimation}>
                {renderEars()}
                {renderBody()}
                {renderPaws()}
                {renderHead()}
                {renderFace()}
                {renderAccessories()}
            </g>
         </g>
       </svg>
    </div>
  );
};

export default RabbitAvatar;