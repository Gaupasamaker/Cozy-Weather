import React from 'react';
import { StickerPath, StickerLine, StickerCircle, shadowFilter } from './StitchedUtils';

interface IconProps {
  className?: string;
}

export const ScarfIcon: React.FC<IconProps> = ({ className = "" }) => (
  <div className={`w-16 h-16 ${className} relative flex items-center justify-center select-none`}>
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
      <g filter="url(#dropShadow)">
        <StickerPath 
            d="M 25,35 Q 50,45 75,35 Q 85,35 85,50 Q 85,65 70,60 L 30,60 Q 15,65 15,50 Q 15,35 25,35 Z M 70,60 L 75,80 M 30,60 L 25,80" 
            fillClass="fill-rose-300" 
            strokeClass="stroke-rose-400" 
        />
         {/* Fringes */}
        <StickerLine x1="72" y1="80" x2="72" y2="90" strokeClass="stroke-rose-400" />
        <StickerLine x1="76" y1="80" x2="78" y2="90" strokeClass="stroke-rose-400" />
        <StickerLine x1="28" y1="80" x2="28" y2="90" strokeClass="stroke-rose-400" />
        <StickerLine x1="24" y1="80" x2="22" y2="90" strokeClass="stroke-rose-400" />
      </g>
    </svg>
  </div>
);

export const JacketIcon: React.FC<IconProps> = ({ className = "" }) => (
  <div className={`w-16 h-16 ${className} relative flex items-center justify-center select-none`}>
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
      <g filter="url(#dropShadow)">
        <StickerPath 
            d="M 25,30 L 20,50 L 30,55 L 35,45 L 35,80 L 65,80 L 65,45 L 70,55 L 80,50 L 75,30 Q 50,20 25,30" 
            fillClass="fill-indigo-300" 
            strokeClass="stroke-indigo-500" 
        />
        {/* Zipper */}
        <StickerLine x1="50" y1="30" x2="50" y2="80" strokeClass="stroke-indigo-100" />
      </g>
    </svg>
  </div>
);

export const TShirtIcon: React.FC<IconProps> = ({ className = "" }) => (
  <div className={`w-16 h-16 ${className} relative flex items-center justify-center select-none`}>
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
      <g filter="url(#dropShadow)">
        <StickerPath 
            d="M 30,30 L 20,40 L 25,45 L 32,40 L 32,75 L 68,75 L 68,40 L 75,45 L 80,40 L 70,30 Q 50,40 30,30" 
            fillClass="fill-yellow-200" 
            strokeClass="stroke-yellow-400" 
        />
      </g>
    </svg>
  </div>
);

export const SunglassesIcon: React.FC<IconProps> = ({ className = "" }) => (
  <div className={`w-16 h-16 ${className} relative flex items-center justify-center select-none`}>
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
      <g filter="url(#dropShadow)">
        <g transform="translate(0, 15)">
            <StickerCircle cx="35" cy="40" r="14" fillClass="fill-slate-700" strokeClass="stroke-slate-900" />
            <StickerCircle cx="65" cy="40" r="14" fillClass="fill-slate-700" strokeClass="stroke-slate-900" />
            <StickerLine x1="49" y1="40" x2="51" y2="40" strokeClass="stroke-slate-900" />
            <StickerLine x1="21" y1="40" x2="10" y2="35" strokeClass="stroke-slate-900" />
            <StickerLine x1="79" y1="40" x2="90" y2="35" strokeClass="stroke-slate-900" />
        </g>
      </g>
    </svg>
  </div>
);

export const UmbrellaIcon: React.FC<IconProps> = ({ className = "" }) => (
  <div className={`w-16 h-16 ${className} relative flex items-center justify-center select-none`}>
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs dangerouslySetInnerHTML={{__html: shadowFilter}} />
      <g filter="url(#dropShadow)">
         <g transform="rotate(-15 50 50)">
            <StickerPath 
                d="M 15,45 Q 50,10 85,45 Z" 
                fillClass="fill-sky-300" 
                strokeClass="stroke-sky-500" 
            />
            <StickerLine x1="50" y1="45" x2="50" y2="85" strokeClass="stroke-gray-400" />
            <path d="M 50,85 Q 50,92 58,90" className="stroke-gray-400 fill-none" strokeWidth="3" strokeLinecap="round" />
         </g>
      </g>
    </svg>
  </div>
);