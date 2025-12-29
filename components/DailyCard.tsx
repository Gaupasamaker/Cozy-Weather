import React from 'react';
import WeatherIcon from './WeatherIcon';

interface DailyCardProps {
  date: string;
  maxTemp: number;
  minTemp: number;
  code: number;
  locale: string;
}

const DailyCard: React.FC<DailyCardProps> = ({ date, maxTemp, minTemp, code, locale }) => {
  const dayName = new Date(date).toLocaleDateString(locale, { weekday: 'short' });

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white/40 rounded-2xl shadow-sm min-w-[80px] backdrop-blur-sm border border-white/50">
      <span className="text-gray-500 text-sm font-medium capitalize mb-1">{dayName}</span>
      <WeatherIcon code={code} isDay={1} size="sm" className="mb-2" />
      <div className="text-gray-700 font-bold text-sm">{Math.round(maxTemp)}°</div>
      <div className="text-gray-400 text-xs">{Math.round(minTemp)}°</div>
    </div>
  );
};

export default DailyCard;