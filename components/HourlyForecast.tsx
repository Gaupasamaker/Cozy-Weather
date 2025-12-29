import React from 'react';
import WeatherIcon from './WeatherIcon';
import { WeatherData } from '../types';

interface HourlyForecastProps {
  data: WeatherData['hourly'];
  label: string;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, label }) => {
  
  // Find index where time string starts with current date/hour prefix, or just find nearest
  const now = new Date();
  const startIndex = data.time.findIndex(t => {
      const tDate = new Date(t);
      return tDate >= now;
  });
  
  // If not found (e.g. late night), default to 0, otherwise use start index. 
  // Take next 24 hours (or less if end of data)
  const safeStartIndex = startIndex === -1 ? 0 : startIndex;
  const next24Hours = data.time.slice(safeStartIndex, safeStartIndex + 24);

  return (
    <div className="w-full mb-6">
      <h3 className="text-gray-600 font-bold ml-4 mb-3">{label}</h3>
      <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl p-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 min-w-min">
          {next24Hours.map((timeStr, i) => {
            const actualIndex = safeStartIndex + i;
            const temp = data.temperature_2m[actualIndex];
            const code = data.weathercode[actualIndex];
            const isDay = data.is_day[actualIndex];
            
            const dateObj = new Date(timeStr);
            const hours = dateObj.getHours().toString().padStart(2, '0');
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');

            return (
              <div key={timeStr} className="flex flex-col items-center gap-2 min-w-[3.5rem]">
                <span className="text-xs text-gray-500 font-semibold">{hours}:{minutes}</span>
                <div className="scale-75 origin-center transform transition-transform hover:scale-90">
                    <WeatherIcon code={code} isDay={isDay} size="sm" />
                </div>
                <span className="text-sm text-gray-700 font-bold">{Math.round(temp)}°</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;