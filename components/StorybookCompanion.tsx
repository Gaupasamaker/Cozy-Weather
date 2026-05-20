import React from 'react';
import { CompanionFamily, CozyAsset, getCompanionAsset, getWeatherMood } from '../lib/cozyAssets';

export type CompanionId =
  | 'sunny-bear'
  | 'rainy-bear'
  | 'cloudy-bear'
  | 'windy-bear'
  | 'stormy-bear'
  | 'sleepy-bear'
  | 'snowy-bear'
  | 'misty-bear'
  | 'summer-bear'
  | 'cozy-bear';

export interface CompanionState {
  id: CompanionId;
  family: CompanionFamily;
  name: {
    es: string;
    en: string;
  };
  asset: CozyAsset;
}

interface StorybookCompanionProps {
  weatherCode: number;
  temperature: number;
  windspeed: number;
  isDay: boolean;
  lang: 'es' | 'en';
  family?: CompanionFamily;
}

const getCompanionCopy = (id: CompanionId): CompanionState['name'] => {
  const names: Record<CompanionId, CompanionState['name']> = {
    'sunny-bear': { es: 'Oso soleado', en: 'Sunny Bear' },
    'rainy-bear': { es: 'Oso de lluvia', en: 'Rainy Bear' },
    'cloudy-bear': { es: 'Oso de nubes', en: 'Cloudy Bear' },
    'windy-bear': { es: 'Oso de viento', en: 'Windy Bear' },
    'stormy-bear': { es: 'Oso de tormenta', en: 'Stormy Bear' },
    'sleepy-bear': { es: 'Oso dormilon', en: 'Sleepy Bear' },
    'snowy-bear': { es: 'Oso de nieve', en: 'Snowy Bear' },
    'misty-bear': { es: 'Oso de bruma', en: 'Misty Bear' },
    'summer-bear': { es: 'Oso de verano', en: 'Summer Bear' },
    'cozy-bear': { es: 'Oso cozy', en: 'Cozy Bear' }
  };

  return names[id];
};

export const getCompanionState = (
  weatherCode: number,
  temperature: number,
  windspeed: number,
  isDay: boolean,
  family: CompanionFamily = 'bear'
): CompanionState => {
  const mood = getWeatherMood(weatherCode, temperature, windspeed, isDay);
  const idByMood: Record<string, CompanionId> = {
    clear: 'sunny-bear',
    cloudy: 'cloudy-bear',
    rain: 'rainy-bear',
    snow: 'snowy-bear',
    storm: 'stormy-bear',
    fog: 'misty-bear',
    wind: 'windy-bear',
    night: 'sleepy-bear',
    hot: 'summer-bear',
    cold: 'cozy-bear'
  };
  const id = idByMood[mood] ?? 'cloudy-bear';

  return {
    id,
    family,
    name: getCompanionCopy(id),
    asset: getCompanionAsset(weatherCode, temperature, windspeed, isDay, family)
  };
};

const StorybookCompanion: React.FC<StorybookCompanionProps> = ({
  weatherCode,
  temperature,
  windspeed,
  isDay,
  lang,
  family = 'bear'
}) => {
  const companion = getCompanionState(weatherCode, temperature, windspeed, isDay, family);

  return (
    <figure className="storybook-companion" aria-label={companion.name[lang]}>
      <img
        src={companion.asset.src}
        alt={companion.name[lang]}
        className="storybook-companion__art"
        loading="eager"
        decoding="async"
      />
    </figure>
  );
};

export default StorybookCompanion;
