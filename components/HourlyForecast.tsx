import React, { useEffect, useRef, useState } from 'react';
import { getWeatherAsset } from '../lib/cozyAssets';
import { WeatherData } from '../types';

interface HourlyForecastProps {
  data: WeatherData['hourly'];
  label: string;
  lang: 'es' | 'en';
  temperatureUnit: 'c' | 'f';
  formatTemperature: (value: number) => number;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, label, lang, temperatureUnit, formatTemperature }) => {
  const now = new Date();
  const startIndex = data.time.findIndex(t => new Date(t) >= now);
  const safeStartIndex = startIndex === -1 ? 0 : startIndex;
  const next24Hours = data.time.slice(safeStartIndex, safeStartIndex + 12);
  const nowLabel = lang === 'es' ? 'Ahora' : 'Now';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ left: 0, width: 100, visible: false });

  const updateScrollState = () => {
    const node = scrollRef.current;
    if (!node) return;

    const { clientWidth, scrollWidth, scrollLeft } = node;
    const visible = scrollWidth > clientWidth + 1;
    const width = visible ? Math.max((clientWidth / scrollWidth) * 100, 18) : 100;
    const maxScrollLeft = Math.max(scrollWidth - clientWidth, 1);
    const maxTravel = Math.max(100 - width, 0);
    const left = visible ? (scrollLeft / maxScrollLeft) * maxTravel : 0;

    setScrollState({ left, width, visible });
  };

  useEffect(() => {
    updateScrollState();

    const node = scrollRef.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(node);

    return () => resizeObserver.disconnect();
  }, [next24Hours.length]);

  return (
    <div className="home-v3-hourly">
      <div className="home-v3-section-heading">
        <h3>{label}</h3>
        <span>{nowLabel}</span>
      </div>
      <div
        ref={scrollRef}
        className="home-v3-hourly-scroll overflow-x-auto"
        onScroll={updateScrollState}
      >
        <div className="home-v3-hourly-track">
          {next24Hours.map((timeStr, i) => {
            const actualIndex = safeStartIndex + i;
            const temp = data.temperature_2m[actualIndex];
            const code = data.weathercode[actualIndex];
            const isDay = data.is_day[actualIndex] === 1;
            const weatherAsset = getWeatherAsset(code, temp, 0, isDay);
            const dateObj = new Date(timeStr);
            const hours = dateObj.getHours().toString().padStart(2, '0');
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');

            return (
              <div key={timeStr} className={`home-v3-hour-cell ${i === 0 ? 'is-current' : ''}`}>
                <span>{i === 0 ? nowLabel : `${hours}:${minutes}`}</span>
                <img
                  src={weatherAsset.src}
                  alt={weatherAsset.alt[lang]}
                  className="cozy-forecast-asset h-11 w-11"
                  loading="lazy"
                  decoding="async"
                />
                <strong>
                  {formatTemperature(temp)}&deg;{temperatureUnit === 'f' ? 'F' : ''}
                </strong>
              </div>
            );
          })}
        </div>
      </div>
      {scrollState.visible && (
        <div className="home-v3-hourly-indicator" aria-hidden="true">
          <span style={{ left: `${scrollState.left}%`, width: `${scrollState.width}%` }}></span>
        </div>
      )}
    </div>
  );
};

export default HourlyForecast;
