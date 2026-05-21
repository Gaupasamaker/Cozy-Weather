import React from 'react';
import { CozyAsset, cozyWeatherAssets } from '../lib/cozyAssets';
import { Language } from '../services/cozyService';
import { GeoLocation } from '../types';

interface FavoriteTicketProps {
  city: GeoLocation;
  meta: string;
  weather?: {
    temperature: number;
    condition: string;
    asset: CozyAsset;
  };
  lang: Language;
  isCurrent: boolean;
  temperatureUnit: 'c' | 'f';
  formatTemperature: (value: number) => number;
  label?: string;
  featured?: boolean;
  onClick: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

const FavoriteTicket: React.FC<FavoriteTicketProps> = ({
  city,
  meta,
  weather,
  lang,
  isCurrent,
  temperatureUnit,
  formatTemperature,
  label,
  featured = false,
  onClick,
  onRemove
}) => {
  const displayName = city.customName || city.name;
  const weatherText = weather
    ? `${formatTemperature(weather.temperature)}°${temperatureUnit === 'f' ? 'F' : ''} · ${weather.condition}`
    : (lang === 'es' ? 'Tocar para ver clima' : 'Tap to view weather');

  return (
    <div className="favorite-card favorite-ticket group relative box-border w-full max-w-full overflow-hidden rounded-[1.7rem]">
      <button
        type="button"
        onClick={onClick}
        className="storybook-panel group flex w-full items-center gap-4 rounded-[1.7rem] p-3 pr-14 text-left transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
        aria-label={lang === 'es' ? `Ver clima de ${displayName}` : `View weather for ${displayName}`}
      >
        <span className="favorite-ticket__media flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/55">
          {weather ? (
            <img
              src={weather.asset.src}
              alt={weather.asset.alt[lang]}
              className="cozy-card-asset h-10 w-10"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <img
              src={cozyWeatherAssets.cloudy.src}
              alt={lang === 'es' ? 'Cargando clima' : 'Loading weather'}
              className="cozy-card-asset h-9 w-9 opacity-70"
              loading="eager"
              decoding="async"
            />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-black text-[#4d382f]">{displayName}</span>
          {(label || isCurrent) && (
            <span className="mt-1 flex min-w-0 flex-wrap gap-1.5">
            {label && (
              <span className="shrink-0 rounded-full bg-[#fff2cf] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#b5792c]">
                {label}
              </span>
            )}
            {isCurrent && (
              <span className="shrink-0 rounded-full bg-[#f7d6cc] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#b86f68]">
                {lang === 'es' ? 'Actual' : 'Now'}
              </span>
            )}
          </span>
          )}
          <span className="mt-1 block truncate text-sm font-bold leading-snug text-[#7c6a62]">{meta || (lang === 'es' ? 'Ciudad guardada' : 'Saved city')}</span>
          <span className="mt-1 block truncate text-sm font-black text-[#5f4b42]">{weatherText}</span>
        </span>
      </button>

      <span className="pointer-events-none absolute right-4 top-1/2 mt-4 -translate-y-1/2 text-2xl text-[#b5792c] transition-transform group-hover:translate-x-1">›</span>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onRemove(event);
        }}
        className="absolute right-3 top-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f3d4ca] bg-[#fff2ef]/95 text-[#b65555] shadow-sm transition hover:bg-[#f7d6cc] active:bg-[#f7d6cc]"
        aria-label={lang === 'es' ? `Eliminar ${displayName}` : `Remove ${displayName}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  );
};

export default FavoriteTicket;
