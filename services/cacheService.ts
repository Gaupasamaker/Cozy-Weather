import { GeoLocation, WeatherData } from '../types';

const LAST_SNAPSHOT_KEY = 'cozyWeatherLastSnapshot';

export interface WeatherSnapshot {
  location: GeoLocation;
  weather: WeatherData;
  language: 'es' | 'en';
  savedAt: string;
}

export const saveWeatherSnapshot = (snapshot: Omit<WeatherSnapshot, 'savedAt'>) => {
  try {
    localStorage.setItem(LAST_SNAPSHOT_KEY, JSON.stringify({
      ...snapshot,
      savedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.warn('Could not save weather snapshot', error);
  }
};

export const loadWeatherSnapshot = (): WeatherSnapshot | null => {
  try {
    const raw = localStorage.getItem(LAST_SNAPSHOT_KEY);
    return raw ? JSON.parse(raw) as WeatherSnapshot : null;
  } catch (error) {
    console.warn('Could not load weather snapshot', error);
    return null;
  }
};

export const formatSnapshotAge = (savedAt: string, lang: 'es' | 'en') => {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(savedAt).getTime()) / 60000));
  if (minutes < 60) {
    return lang === 'es' ? `Hace ${minutes} min` : `${minutes} min ago`;
  }

  const hours = Math.round(minutes / 60);
  return lang === 'es' ? `Hace ${hours} h` : `${hours} h ago`;
};
