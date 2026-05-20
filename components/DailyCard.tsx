import React from 'react';
import { getWeatherAsset } from '../lib/cozyAssets';

interface DailyCardProps {
  date: string;
  maxTemp: number;
  minTemp: number;
  code: number;
  locale: string;
  lang: 'es' | 'en';
  temperatureUnit: 'c' | 'f';
  formatTemperature: (value: number) => number;
}

const DailyCard: React.FC<DailyCardProps> = ({ date, maxTemp, minTemp, code, locale, lang, temperatureUnit, formatTemperature }) => {
  const dayName = new Date(date).toLocaleDateString(locale, { weekday: 'short' });
  const weatherAsset = getWeatherAsset(code, maxTemp, 0, true);

  return (
    <div className="flex min-w-[82px] flex-col items-center justify-center rounded-2xl bg-[#fff7e7]/80 p-3 shadow-sm">
      <span className="mb-1 text-sm font-black capitalize text-[#7c6a62]">{dayName}</span>
      <img
        src={weatherAsset.src}
        alt={weatherAsset.alt[lang]}
        className="cozy-forecast-asset mb-2 h-12 w-12"
        loading="lazy"
        decoding="async"
      />
      <div className="text-sm font-black text-[#4d382f]">{formatTemperature(maxTemp)}&deg;{temperatureUnit === 'f' ? 'F' : ''}</div>
      <div className="text-xs font-bold text-[#9c8c80]">{formatTemperature(minTemp)}&deg;{temperatureUnit === 'f' ? 'F' : ''}</div>
    </div>
  );
};

export default DailyCard;
