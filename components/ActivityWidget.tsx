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

      <div className="relative flex h-full flex-col justify-center gap-2 p-3 pr-6">
        <span className="home-v3-card-kicker text-[#d49a3a]">
          {title}
        </span>

        <div className="flex w-full min-w-0 items-center gap-2">
          <div className={`home-v3-card-orb shrink-0 ${isLoading ? 'animate-bounce' : ''}`}>
            <img
              src={planAsset.src}
              alt={planAsset.alt[lang]}
              className="cozy-card-asset h-12 w-12"
              loading="lazy"
              decoding="async"
            />
          </div>

          {isLoading ? (
            <span className="min-w-0 flex-1 text-sm font-black leading-tight text-[#9c8c80] animate-pulse">
              {activity}
            </span>
          ) : (
            <span className="home-v3-plan-title line-clamp-2 min-w-0 flex-1 text-[0.98rem] font-black leading-snug capitalize text-[#4d382f]">
              {activity}
            </span>
          )}
        </div>

        {!isLoading && (
          <div className="absolute right-2.5 text-[#b5792c] transition-transform group-hover:translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-[1.125rem] w-[1.125rem]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityWidget;
