import React from 'react';
import { StickerPath, StickerCircle, shadowFilter } from './StitchedUtils';

interface ActivityWidgetProps {
  activity: string;
  onClick: () => void;
  lang: 'es' | 'en';
}

const StarIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div className={`w-12 h-12 ${className} relative flex items-center justify-center select-none`}>
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
        <g filter="url(#dropShadow)">
           <StickerPath 
              d="M 50,15 L 60,40 L 85,40 L 65,60 L 75,85 L 50,70 L 25,85 L 35,60 L 15,40 L 40,40 Z"
              fillClass="fill-yellow-200"
              strokeClass="stroke-yellow-400"
           />
           {/* Cute face on star */}
           <circle cx="42" cy="55" r="2" className="fill-yellow-600" />
           <circle cx="58" cy="55" r="2" className="fill-yellow-600" />
           <path d="M 47,62 Q 50,64 53,62" className="stroke-yellow-600 fill-none" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
);

const ActivityWidget: React.FC<ActivityWidgetProps> = ({ activity, onClick, lang }) => {
  const title = lang === 'es' ? "Plan sugerido" : "Suggested Plan";

  return (
    <div 
        onClick={onClick}
        className="col-span-2 relative overflow-hidden group cursor-pointer"
    >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm transition-all duration-300 group-hover:bg-white/60 group-hover:scale-[1.02] group-active:scale-95"></div>
        
        <div className="relative p-3 flex items-center gap-4">
            <div className="shrink-0 animate-[pulse_3s_infinite]">
                <StarIcon />
            </div>
            
            <div className="flex flex-col items-start min-w-0">
                 <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest leading-tight mb-0.5">
                    {title}
                 </span>
                 <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-bold text-sm sm:text-base truncate leading-tight capitalize">
                        {activity}
                    </span>
                    <span className="bg-yellow-100 text-yellow-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-yellow-200 whitespace-nowrap">
                        + Info
                    </span>
                 </div>
            </div>
            
            {/* Arrow icon */}
            <div className="ml-auto text-gray-400 group-hover:translate-x-1 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </div>
    </div>
  );
};

export default ActivityWidget;