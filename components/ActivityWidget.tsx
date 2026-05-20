import React from 'react';
import { CozyAsset, getPlanAsset } from '../lib/cozyAssets';

interface ActivityWidgetProps {
  activity: string;
  onClick: () => void;
  lang: 'es' | 'en';
  weatherCode: number;
  temperature: number;
  isDay: boolean;
  isLoading?: boolean;
  asset?: CozyAsset;
}

const ActivityWidget: React.FC<ActivityWidgetProps> = ({
  activity,
  onClick,
  lang,
  weatherCode,
  temperature,
  isDay,
  isLoading = false,
  asset
}) => {
  const title = lang === 'es' ? 'Plan cozy' : 'Cozy plan';
  const planAsset = asset ?? getPlanAsset(activity, weatherCode, temperature, isDay);

  return (
    <div
      onClick={onClick}
      className={`home-v3-editorial-card home-v3-editorial-card--plan relative overflow-hidden group transition-all duration-300 ${isLoading ? 'opacity-80 cursor-wait' : 'cursor-pointer hover:-translate-y-0.5'}`}
    >
      <div className="storybook-panel absolute inset-0 rounded-[1.65rem] transition-all duration-300 group-hover:bg-[#fffaf0]"></div>

      <div className="relative flex h-full items-center gap-2.5 p-3.5 pr-7">
        <div className={`home-v3-card-orb shrink-0 ${isLoading ? 'animate-bounce' : ''}`}>
          <img
            src={planAsset.src}
            alt={planAsset.alt[lang]}
            className="cozy-card-asset h-14 w-14"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#d49a3a]">
            {title}
          </span>
          <div className="flex w-full items-center gap-2">
            {isLoading ? (
              <span className="text-sm font-black leading-tight text-[#9c8c80] animate-pulse">
                {activity}
              </span>
            ) : (
              <>
                <span className="line-clamp-2 text-[0.95rem] font-black leading-snug capitalize text-[#4d382f]">
                  {activity}
                </span>
              </>
            )}
          </div>
        </div>

        {!isLoading && (
          <div className="absolute right-3 text-[#b5792c] transition-transform group-hover:translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityWidget;
