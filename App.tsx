import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCozyMessage, getQuickActivity, Language } from './services/cozyService';
import { getWeather, searchCity, getReverseGeocoding } from './services/weatherService';
import { getDeviceLocation } from './services/locationService';
import { formatSnapshotAge, loadWeatherSnapshot, saveWeatherSnapshot } from './services/cacheService';
import { WeatherData, GeoLocation } from './types';
import { TempIcon } from './components/WeatherIcon';
import HourlyForecast from './components/HourlyForecast';
import OutfitWidget from './components/OutfitWidget';
import ActivityWidget from './components/ActivityWidget';
import ActivityModal from './components/ActivityModal';
import FavoriteTicket from './components/FavoriteTicket';
import PromoCard from './components/PromoCard';
import WeatherAtmosphere from './components/WeatherAtmosphere';
import { cozyDecorations, cozyWeatherAssets, getCozyMessageAsset, getHomeSceneAsset, getPlanAsset, getWeatherAsset } from './lib/cozyAssets';
import { getPlanBundle, PlanSuggestion } from './services/planService';

type ConditionKey = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'night';
type AppTab = 'home' | 'search' | 'favorites' | 'plans' | 'settings';
type TemperatureUnit = 'c' | 'f';
type WindUnit = 'kmh' | 'mph';

const toDisplayTemperature = (value: number, unit: TemperatureUnit) =>
  unit === 'f' ? Math.round((value * 9) / 5 + 32) : Math.round(value);

const toDisplayWind = (value: number, unit: WindUnit) =>
  unit === 'mph' ? Math.round(value * 6.21371) / 10 : Math.round(value * 10) / 10;

const translations = {
  es: {
    searchPlaceholder: 'Buscar ciudad',
    wind: 'Viento',
    minMax: 'Min/Max',
    feelsLike: 'Sensación térmica',
    nextDays: 'Próximos días',
    hourly: 'Por horas',
    loading: 'Consultando a las nubes...',
    error: 'No pudimos obtener el clima. Intenta de nuevo.',
    retry: 'Intentar de nuevo',
    footer: 'Weather data by Open-Meteo',
    defaultLocation: 'Tu ubicación',
    outfitTitle: 'Qué ponerte',
    favPrompt: '¿Qué nombre le ponemos a este lugar? (ej. Casa, Trabajo)',
    shareBtn: 'Compartir',
    loadingPlan: 'Preparando plan...',
    manualHint: 'Busca una ciudad para empezar, o permite la ubicación cuando quieras.',
    cachedWeather: 'Mostrando último clima guardado',
    about: 'Privacidad',
    aboutTitle: 'Privacidad y datos',
    aboutBody: [
      'Cozy Weather usa Open-Meteo para obtener datos del clima.',
      'Tus favoritos y búsquedas recientes se guardan localmente en este dispositivo.',
      'Si usas tu ubicación actual, el navegador o el sistema puede pedirte permiso.',
      'La ubicación solo se usa si tú la autorizas.'
    ],
    close: 'Cerrar',
    today: 'Hoy',
    plan: 'Plan cozy',
    save: 'Guardar lugar',
    saved: 'Lugar guardado',
    useCurrentLocation: 'Usar mi ubicación actual',
    useCurrentLocationHint: 'Detecta tu ciudad y actualiza la Home.',
    currentCity: 'Ciudad actual',
    clearRecentSearches: 'Borrar búsquedas recientes',
    clearFavorites: 'Borrar favoritos',
    clearRecentSearchesHint: 'Quita el historial guardado en este dispositivo.',
    clearFavoritesHint: 'Elimina todas tus ciudades guardadas.',
    confirmClearFavorites: '¿Quieres borrar todos tus favoritos?',
    language: 'Idioma',
    temperature: 'Temperatura',
    units: 'Unidades',
    location: 'Ubicación',
    localData: 'Datos locales',
    credits: 'Créditos',
    version: 'Versión V1',
    recentSearches: 'Búsquedas recientes',
    favoritesEmptyTitle: 'Tus ciudades favoritas',
    favoritesEmptyBody: 'Guarda una ciudad tocando el corazón de la Home.',
    searchResultsTitle: 'Resultados',
    searchingCities: 'Buscando ciudades...',
    noSearchResults: 'No encontramos esa ciudad. Prueba con otro nombre.',
    searchError: 'Algo no ha ido bien buscando la ciudad. Inténtalo de nuevo.',
    locationError: 'No hemos podido acceder a tu ubicación. Puedes buscar una ciudad manualmente.',
    condition: {
      clear: 'Soleado',
      cloudy: 'Nublado',
      rain: 'Lluvia',
      snow: 'Nieve',
      storm: 'Tormenta',
      fog: 'Bruma',
      night: 'Noche tranquila'
    }
  },
  en: {
    searchPlaceholder: 'Search city',
    wind: 'Wind',
    minMax: 'Min/Max',
    feelsLike: 'Feels like',
    nextDays: 'Next days',
    hourly: 'By hour',
    loading: 'Consulting the clouds...',
    error: 'Could not get weather. Try again.',
    retry: 'Try again',
    footer: 'Weather data by Open-Meteo',
    defaultLocation: 'Your location',
    outfitTitle: 'What to wear',
    favPrompt: 'What nickname should we give this place? (e.g. Home, Work)',
    shareBtn: 'Share',
    loadingPlan: 'Preparing plan...',
    manualHint: 'Search for a city to start, or allow location whenever you like.',
    cachedWeather: 'Showing last saved weather',
    about: 'Privacy',
    aboutTitle: 'Privacy and data',
    aboutBody: [
      'Cozy Weather uses Open-Meteo to fetch weather data.',
      'Your favorites and recent searches are stored locally on this device.',
      'If you use your current location, the browser or system may ask for permission.',
      'Location is only used when you allow it.'
    ],
    close: 'Close',
    today: 'Today',
    plan: 'Cozy plan',
    save: 'Save place',
    saved: 'Saved place',
    useCurrentLocation: 'Use my current location',
    useCurrentLocationHint: 'Detect your city and update Home.',
    currentCity: 'Current city',
    clearRecentSearches: 'Clear recent searches',
    clearFavorites: 'Clear favorites',
    clearRecentSearchesHint: 'Remove the saved history on this device.',
    clearFavoritesHint: 'Delete all your saved cities.',
    confirmClearFavorites: 'Do you want to clear all favorites?',
    language: 'Language',
    temperature: 'Temperature',
    units: 'Units',
    location: 'Location',
    localData: 'Local data',
    credits: 'Credits',
    version: 'Version V1',
    recentSearches: 'Recent searches',
    favoritesEmptyTitle: 'Your favorite cities',
    favoritesEmptyBody: 'Save a city by tapping the heart on Home.',
    searchResultsTitle: 'Results',
    searchingCities: 'Searching cities...',
    noSearchResults: 'We could not find that city. Try another name.',
    searchError: 'Something went wrong while searching. Try again.',
    locationError: 'We could not access your location. You can search for a city manually.',
    condition: {
      clear: 'Sunny',
      cloudy: 'Cloudy',
      rain: 'Rain',
      snow: 'Snow',
      storm: 'Storm',
      fog: 'Misty',
      night: 'Quiet night'
    }
  }
};

const getConditionKey = (weatherCode: number, isDay: boolean): ConditionKey => {
  if (!isDay) return 'night';
  if (weatherCode >= 95) return 'storm';
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) return 'snow';
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) return 'rain';
  if (weatherCode === 45 || weatherCode === 48) return 'fog';
  if (weatherCode === 0 || weatherCode === 1) return 'clear';
  return 'cloudy';
};

const getForecastConditionLabel = (weatherCode: number, lang: Language) => {
  if (weatherCode >= 95) return lang === 'es' ? 'Tormenta' : 'Storm';
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
    return lang === 'es' ? 'Nieve' : 'Snow';
  }
  if ((weatherCode >= 61 && weatherCode <= 67) || weatherCode >= 80) {
    return lang === 'es' ? 'Lluvia ligera' : 'Light rain';
  }
  if (weatherCode >= 51 && weatherCode <= 57) {
    return lang === 'es' ? 'Llovizna' : 'Drizzle';
  }
  if (weatherCode === 45 || weatherCode === 48) {
    return lang === 'es' ? 'Bruma' : 'Misty';
  }
  if (weatherCode === 0) {
    return lang === 'es' ? 'Soleado' : 'Sunny';
  }
  if (weatherCode === 1 || weatherCode === 2) {
    return lang === 'es' ? 'Parcialmente nublado' : 'Partly cloudy';
  }
  return lang === 'es' ? 'Nublado' : 'Cloudy';
};

const tabLabels: Record<Language, Record<AppTab, string>> = {
  es: {
    home: 'Inicio',
    search: 'Buscar',
    favorites: 'Favoritos',
    plans: 'Planes',
    settings: 'Ajustes'
  },
  en: {
    home: 'Home',
    search: 'Search',
    favorites: 'Favorites',
    plans: 'Plans',
    settings: 'Settings'
  }
};

const placeholderCopy: Record<Language, Record<Exclude<AppTab, 'home'>, { title: string; body: string }>> = {
  es: {
    search: { title: 'Buscar ciudad', body: 'Encuentra una ciudad para ver su clima cozy.' },
    favorites: { title: 'Favoritos', body: 'Tus ciudades guardadas aparecerán aquí.' },
    plans: { title: 'Planes', body: 'Ideas sencillas según el clima.' },
    settings: { title: 'Ajustes', body: 'Idioma, privacidad, unidades y preferencias.' }
  },
  en: {
    search: { title: 'Search city', body: 'Find a city to see its cozy weather.' },
    favorites: { title: 'Favorites', body: 'Your saved cities will appear here.' },
    plans: { title: 'Plans', body: 'Simple ideas based on the weather.' },
    settings: { title: 'Settings', body: 'Language, privacy, units, and preferences.' }
  }
};

const TabIcon = ({ tab, active }: { tab: AppTab; active: boolean }) => {
  const cls = `h-6 w-6 ${active ? 'text-[#d98c84]' : 'text-[#6f574b]'}`;
  if (tab === 'home') {
    return <path className={cls} fill="currentColor" d="M4 10.6 12 4l8 6.6v8.1c0 .8-.6 1.3-1.4 1.3h-4.1v-5.5h-5V20H5.4c-.8 0-1.4-.5-1.4-1.3v-8.1Z" />;
  }
  if (tab === 'search') {
    return <path className={cls} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="m20 20-4.5-4.5m1.5-5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z" />;
  }
  if (tab === 'favorites') {
    return <path className={cls} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" d="M20.5 8.7c0 5.8-8.5 10.5-8.5 10.5S3.5 14.5 3.5 8.7A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8.5 2.1Z" />;
  }
  if (tab === 'plans') {
    return <path className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 5.5 10 4l4 1.5 5-1.5v14.5L14 20l-4-1.5L5 20V5.5Zm5-1.5v14.5m4-13v14.5" />;
  }
  return <path className={cls} fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" d="M12 8.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Zm0-4.2v2m0 12v2m8-8h-2M6 12H4m13.7-5.7-1.4 1.4M7.7 16.3l-1.4 1.4m0-11.4 1.4 1.4m8.6 8.6 1.4 1.4" />;
};

const cityKey = (city: GeoLocation) => `${city.name}-${city.admin1 || ''}-${city.country || ''}`.toLowerCase();
const geoKey = (city: GeoLocation) => `${city.latitude.toFixed(3)},${city.longitude.toFixed(3)}`;

const CityCard = ({
  city,
  onSelect,
  compact = false
}: {
  city: GeoLocation;
  onSelect: (city: GeoLocation) => void;
  compact?: boolean;
}) => (
  <button
    type="button"
    onClick={() => onSelect(city)}
    className={`city-card storybook-panel flex w-full items-center gap-3 rounded-[1.4rem] text-left transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] ${compact ? 'p-3' : 'p-4'}`}
  >
    <span className="city-card__icon flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7d6cc] text-[#d98c84]">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s6-5.1 6-11a6 6 0 0 0-12 0c0 5.9 6 11 6 11Z" />
        <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
      </svg>
    </span>
    <span className="min-w-0">
      <span className="block truncate text-base font-black text-[#4d382f]">{city.name}</span>
      <span className="block truncate text-sm font-bold text-[#7c6a62]">
        {[city.admin1, city.country].filter(Boolean).join(', ') || city.country || ''}
      </span>
    </span>
  </button>
);

const PlanCard = ({
  plan,
  lang,
  label,
  featured = false,
  onSelect
}: {
  plan: PlanSuggestion;
  lang: Language;
  label?: string;
  featured?: boolean;
  onSelect: (plan: PlanSuggestion) => void;
}) => (
  <button
    type="button"
    onClick={() => onSelect(plan)}
    className={`plan-card storybook-panel group flex w-full items-center gap-4 rounded-[1.7rem] text-left transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] ${featured ? 'p-4' : 'p-3'}`}
  >
    <span className={`plan-card__media ${featured ? 'h-16 w-16' : 'h-12 w-12'} flex shrink-0 items-center justify-center rounded-2xl bg-white/55`}>
      <img
        src={plan.asset.src}
        alt={plan.asset.alt[lang]}
        className={`${featured ? 'h-14 w-14' : 'h-10 w-10'} cozy-card-asset`}
        loading={featured ? 'eager' : 'lazy'}
        decoding="async"
      />
    </span>
    <span className="min-w-0 flex-1">
      {label && <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#d49a3a]">{label}</span>}
      <span className={`${featured ? 'text-lg' : 'text-base'} block truncate font-black text-[#4d382f]`}>{plan.title}</span>
      <span className="mt-1 block text-sm font-bold leading-snug text-[#7c6a62]">{plan.description}</span>
    </span>
    <span className="shrink-0 text-2xl text-[#b5792c] transition-transform group-hover:translate-x-1">›</span>
  </button>
);

const SettingsRow = ({
  title,
  description,
  value,
  onClick,
  tone = 'default'
}: {
  title: string;
  description?: string;
  value?: string;
  onClick?: () => void;
  tone?: 'default' | 'danger';
}) => {
  const content = (
    <>
      <span className="min-w-0">
        <span className={`block font-black ${tone === 'danger' ? 'text-[#b65555]' : 'text-[#4d382f]'}`}>{title}</span>
        {description && <span className="mt-1 block text-sm font-bold leading-snug text-[#7c6a62]">{description}</span>}
      </span>
      <span className={`shrink-0 text-sm font-black ${tone === 'danger' ? 'text-[#b65555]' : 'text-[#b5792c]'}`}>{value}</span>
    </>
  );

  if (!onClick) {
    return <div className="settings-row storybook-panel flex items-center justify-between gap-4 rounded-2xl p-4">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="settings-row storybook-panel flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
    >
      {content}
    </button>
  );
};

const SegmentedControl = <T extends string>({
  value,
  options,
  onChange
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) => (
  <div className="segmented-control grid grid-cols-2 gap-1 rounded-2xl bg-white/55 p-1">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={`rounded-[1.1rem] px-3 py-2 text-sm font-black transition ${
          value === option.value
            ? 'bg-[#f7d6cc] text-[#b86f68] shadow-sm'
            : 'text-[#7c6a62] hover:bg-white/70'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'es';
    return localStorage.getItem('cozyWeatherLanguage') === 'en' ? 'en' : 'es';
  });
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(() => {
    if (typeof window === 'undefined') return 'c';
    return localStorage.getItem('cozyWeatherTemperatureUnit') === 'f' ? 'f' : 'c';
  });
  const [windUnit, setWindUnit] = useState<WindUnit>(() => {
    if (typeof window === 'undefined') return 'kmh';
    return localStorage.getItem('cozyWeatherWindUnit') === 'mph' ? 'mph' : 'kmh';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [recentSearches, setRecentSearches] = useState<GeoLocation[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('cozyWeatherRecentCities');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error parsing recent searches', error);
      return [];
    }
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchErrorMessage, setSearchErrorMessage] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState<string | null>(null);
  const [cozyMessage, setCozyMessage] = useState('');
  const [activitySuggestion, setActivitySuggestion] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanSuggestion | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showClearFavoritesConfirm, setShowClearFavoritesConfirm] = useState(false);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const searchRequestId = useRef(0);
  const fetchingFavoriteWeather = useRef(new Set<string>());
  const scrollRegionRef = useRef<HTMLElement | null>(null);
  const [favoriteWeather, setFavoriteWeather] = useState<Record<string, WeatherData>>({});
  const [favorites, setFavorites] = useState<GeoLocation[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('cozyWeatherFavs');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error parsing favorites', error);
      return [];
    }
  });

  const t = translations[language];
  const condition = weather ? getConditionKey(weather.current_weather.weathercode, weather.current_weather.is_day === 1) : 'cloudy';
  const sceneKey = weather && location
    ? `${location.latitude.toFixed(2)}-${location.longitude.toFixed(2)}-${weather.current_weather.weathercode}-${weather.current_weather.is_day}`
    : 'initial-scene';
  const conditionLabel = t.condition[condition];
  const currentWeatherAsset = weather
    ? getWeatherAsset(
        weather.current_weather.weathercode,
        weather.current_weather.temperature,
        weather.current_weather.windspeed,
        weather.current_weather.is_day === 1
      )
    : cozyWeatherAssets.cloudy;
  const currentHomeScene = weather
    ? getHomeSceneAsset(
        weather.current_weather.weathercode,
        weather.current_weather.temperature,
        weather.current_weather.windspeed,
        weather.current_weather.is_day === 1
      )
    : null;
  const isNightHome = weather?.current_weather.is_day === 0;
  const homeSceneTone = condition === 'night'
    ? 'night'
    : (condition === 'rain' || condition === 'storm')
      ? 'rain'
      : condition === 'clear'
        ? 'sunny'
        : 'cloudy';
  const cozyMessageAsset = weather
    ? getCozyMessageAsset(
        weather.current_weather.weathercode,
        weather.current_weather.temperature,
        weather.current_weather.is_day === 1,
        weather.current_weather.apparent_temperature ?? weather.current_weather.temperature,
        weather.current_weather.windspeed
      )
    : cozyDecorations.hearts;
  const dateLabel = useMemo(() => {
    return new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }, [language]);
  const planBundle = useMemo(() => getPlanBundle({
    weatherCode: weather?.current_weather.weathercode,
    temperature: weather?.current_weather.temperature,
    apparentTemperature: weather?.current_weather.apparent_temperature,
    windspeed: weather?.current_weather.windspeed,
    isDay: weather ? weather.current_weather.is_day === 1 : true,
    lang: language
  }), [weather, language]);
  const currentPlanAsset = weather
    ? getPlanAsset(
        activitySuggestion || planBundle.primary.title,
        weather.current_weather.weathercode,
        weather.current_weather.temperature,
        weather.current_weather.is_day === 1
      )
    : cozyDecorations.picnic;
  const formatTemperature = useCallback((value: number) => toDisplayTemperature(value, temperatureUnit), [temperatureUnit]);
  const formatWind = useCallback((value: number) => toDisplayWind(value, windUnit), [windUnit]);

  useEffect(() => {
    localStorage.setItem('cozyWeatherFavs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRegionRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, [activeTab, sceneKey]);

  useEffect(() => {
    localStorage.setItem('cozyWeatherLanguage', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cozyWeatherTemperatureUnit', temperatureUnit);
  }, [temperatureUnit]);

  useEffect(() => {
    localStorage.setItem('cozyWeatherWindUnit', windUnit);
  }, [windUnit]);

  useEffect(() => {
    if (activeTab !== 'favorites' || favorites.length === 0) return;

    let cancelled = false;
    const missingFavorites = favorites
      .filter(fav => !favoriteWeather[geoKey(fav)] && !fetchingFavoriteWeather.current.has(geoKey(fav)))
      .slice(0, 8);

    if (missingFavorites.length === 0) return;

    missingFavorites.forEach(async (fav) => {
      const key = geoKey(fav);
      fetchingFavoriteWeather.current.add(key);
      const data = await getWeather(fav.latitude, fav.longitude);
      fetchingFavoriteWeather.current.delete(key);
      if (!data || cancelled) return;
      setFavoriteWeather(prev => ({ ...prev, [key]: data }));
    });

    return () => {
      cancelled = true;
    };
  }, [activeTab, favorites, favoriteWeather]);

  useEffect(() => {
    localStorage.setItem('cozyWeatherRecentCities', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const applyWeatherState = useCallback((city: GeoLocation, weatherData: WeatherData, lang: Language, notice: string | null = null) => {
    setLocation(city);
    setWeather(weatherData);
    setCacheNotice(notice);

    getCozyMessage(
      weatherData.current_weather.weathercode,
      weatherData.current_weather.temperature,
      weatherData.current_weather.is_day === 1,
      city.name,
      lang,
      weatherData.current_weather.apparent_temperature ?? weatherData.current_weather.temperature,
      weatherData.current_weather.windspeed
    ).then(setCozyMessage);

    getQuickActivity(
      weatherData.current_weather.weathercode,
      weatherData.current_weather.temperature,
      weatherData.current_weather.is_day === 1,
      lang,
      weatherData.current_weather.apparent_temperature ?? weatherData.current_weather.temperature,
      weatherData.current_weather.windspeed
    ).then(setActivitySuggestion);
  }, []);

  useEffect(() => {
    const hydrateLocalCopy = async () => {
      const cached = loadWeatherSnapshot();
      if (cached?.weather && cached.location) {
        applyWeatherState(
          cached.location,
          cached.weather,
          language,
          `${translations[language].cachedWeather} · ${formatSnapshotAge(cached.savedAt, language)}`
        );
        setLoading(false);
        return;
      }

      const defaultLat = 40.4168;
      const defaultLon = -3.7038;
      const defaultLocation = { name: 'Madrid', latitude: defaultLat, longitude: defaultLon, country: 'España' };
      setLocation(defaultLocation);
      await fetchWeatherData(defaultLat, defaultLon, 'Madrid', language, defaultLocation);
    };

    const loadLocation = async () => {
      try {
        const position = await getDeviceLocation();
        const cityName = await getReverseGeocoding(position.latitude, position.longitude, language);
        const currentLocation = { name: cityName, latitude: position.latitude, longitude: position.longitude };
        setLocation(currentLocation);
        await fetchWeatherData(position.latitude, position.longitude, cityName, language, currentLocation);
      } catch {
        await hydrateLocalCopy();
      }
    };

    loadLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWeatherData = async (
    lat: number,
    lon: number,
    cityName: string,
    lang: Language,
    snapshotLocation?: GeoLocation
  ) => {
    setLoading(true);
    setError(null);
    setCozyMessage('');
    setActivitySuggestion('');

    try {
      const data = await getWeather(lat, lon);

      if (data) {
        const resolvedLocation: GeoLocation = snapshotLocation ?? { name: cityName, latitude: lat, longitude: lon };
        applyWeatherState(resolvedLocation, data, lang);
        saveWeatherSnapshot({
          location: resolvedLocation,
          weather: data,
          language: lang
        });
      } else {
        showCachedOrError(lang);
      }
    } catch (error) {
      showCachedOrError(lang);
    } finally {
      setLoading(false);
    }
  };

  const showCachedOrError = (lang: Language) => {
    const cached = loadWeatherSnapshot();
    if (cached?.weather && cached.location) {
      applyWeatherState(
        cached.location,
        cached.weather,
        lang,
        `${translations[lang].cachedWeather} · ${formatSnapshotAge(cached.savedAt, lang)}`
      );
    } else {
      setError(translations[lang].error);
    }
  };

  const rememberRecentCity = useCallback((city: GeoLocation) => {
    setRecentSearches(prev => {
      const withoutDuplicate = prev.filter(item => cityKey(item) !== cityKey(city));
      return [city, ...withoutDuplicate].slice(0, 5);
    });
  }, []);

  const handleSearch = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const trimmedQuery = query.trim();
    const requestId = searchRequestId.current + 1;
    searchRequestId.current = requestId;

    setSearchQuery(query);
    setShowSearch(true);
    setSearchErrorMessage(null);
    setLocationErrorMessage(null);

    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    try {
      const results = await searchCity(trimmedQuery, language);
      if (searchRequestId.current !== requestId) return;
      setSearchResults(results);
    } catch (error) {
      if (searchRequestId.current !== requestId) return;
      console.error('Search failed', error);
      setSearchResults([]);
      setSearchErrorMessage(t.searchError);
    } finally {
      if (searchRequestId.current === requestId) {
        setSearchLoading(false);
      }
    }
  }, [language, t.searchError]);

  const selectCity = (city: GeoLocation) => {
    rememberRecentCity(city);
    setLocation(city);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
    setSearchErrorMessage(null);
    setLocationErrorMessage(null);
    setActiveTab('home');
    fetchWeatherData(city.latitude, city.longitude, city.name, language, city);
  };

  const useCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationErrorMessage(null);
    setSearchErrorMessage(null);

    try {
      const position = await getDeviceLocation();
      const cityName = await getReverseGeocoding(position.latitude, position.longitude, language);
      const currentCity: GeoLocation = {
        name: cityName,
        latitude: position.latitude,
        longitude: position.longitude
      };
      rememberRecentCity(currentCity);
      setLocation(currentCity);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearch(false);
      setActiveTab('home');
      await fetchWeatherData(position.latitude, position.longitude, cityName, language, currentCity);
    } catch {
      setLocationErrorMessage(t.locationError);
    } finally {
      setLocationLoading(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    setSearchResults([]);
    setSearchQuery('');
    setShowSearch(false);
  };

  const clearFavorites = () => {
    setFavorites([]);
    setFavoriteWeather({});
    setShowClearFavoritesConfirm(false);
  };

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);

    if (location) {
      let newName = location.name;
      if (location.name === translations.es.defaultLocation || location.name === translations.en.defaultLocation) {
        newName = translations[newLang].defaultLocation;
        setLocation({ ...location, name: newName });
      }
      fetchWeatherData(location.latitude, location.longitude, newName, newLang, { ...location, name: newName });
    }
  };

  const isCurrentLocationFavorite = useCallback(() => {
    if (!location) return false;
    return favorites.some(fav =>
      Math.abs(fav.latitude - location.latitude) < 0.005 &&
      Math.abs(fav.longitude - location.longitude) < 0.005
    );
  }, [location, favorites]);

  const isSameLocation = useCallback((city: GeoLocation) => {
    if (!location) return false;
    return Math.abs(city.latitude - location.latitude) < 0.005 &&
      Math.abs(city.longitude - location.longitude) < 0.005;
  }, [location]);

  const toggleFavorite = () => {
    if (!location) return;

    if (isCurrentLocationFavorite()) {
      setFavorites(prev => prev.filter(fav =>
        Math.abs(fav.latitude - location.latitude) >= 0.005 ||
        Math.abs(fav.longitude - location.longitude) >= 0.005
      ));
      return;
    }

    setTimeout(() => {
      const defaultName = location.customName || location.name;
      let customName: string | null = defaultName;
      try {
        customName = window.prompt(t.favPrompt, defaultName);
      } catch {
        customName = defaultName;
      }
      if (customName !== null) {
        setFavorites(prev => [...prev, { ...location, customName: customName.trim() || defaultName }]);
      }
    }, 50);
  };

  const removeFavorite = (event: React.MouseEvent, lat: number, lon: number) => {
    event.stopPropagation();
    setFavorites(prev => prev.filter(fav =>
      Math.abs(fav.latitude - lat) >= 0.005 ||
      Math.abs(fav.longitude - lon) >= 0.005
    ));
  };

  const openPlanModal = (plan: PlanSuggestion) => {
    if (!location) return;
    setSelectedPlan(plan);
    setShowActivityModal(true);
  };

  return (
    <div className={`storybook-shell relative w-full overflow-x-hidden font-sans ${activeTab === 'home' ? 'storybook-shell--home' : ''} ${activeTab === 'home' ? `storybook-shell--home-${homeSceneTone}` : ''} ${activeTab === 'home' && isNightHome ? 'storybook-shell--night-home' : ''}`}>
      {showPromo && weather && location && (
        <PromoCard
          onClose={() => setShowPromo(false)}
          weatherCode={weather.current_weather.weathercode}
          temperature={weather.current_weather.temperature}
          isDay={weather.current_weather.is_day === 1}
          locationName={location.customName || location.name}
          language={language}
        />
      )}

      {showActivityModal && location && (
        <ActivityModal
          onClose={() => {
            setShowActivityModal(false);
            setSelectedPlan(null);
          }}
          lat={location.latitude}
          lon={location.longitude}
          weatherCode={weather?.current_weather.weathercode ?? 2}
          temp={weather?.current_weather.temperature ?? 18}
          lang={language}
          activityContext={selectedPlan?.title ?? activitySuggestion}
          selectedPlan={selectedPlan ?? undefined}
        />
      )}

      {showAbout && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="modal-backdrop-enter absolute inset-0 bg-[#4d382f]/35 backdrop-blur-sm" onClick={() => setShowAbout(false)}></div>
          <div className="cozy-modal-card modal-card-enter storybook-paper relative w-full max-w-sm rounded-[2rem] p-6">
            <h2 className="mb-4 text-2xl font-black text-[#4d382f]">{t.aboutTitle}</h2>
            <div className="space-y-3 text-sm font-semibold leading-relaxed text-[#7c6a62]">
              {t.aboutBody.map((item) => <p key={item}>{item}</p>)}
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="mt-6 w-full rounded-2xl bg-[#d98c84] py-3 font-black text-white shadow-lg shadow-[#d98c84]/20 transition hover:bg-[#c97972]"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {showClearFavoritesConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="modal-backdrop-enter absolute inset-0 bg-[#4d382f]/35 backdrop-blur-sm" onClick={() => setShowClearFavoritesConfirm(false)}></div>
          <div className="cozy-modal-card modal-card-enter storybook-paper relative w-full max-w-sm rounded-[2rem] p-6">
            <h2 className="text-2xl font-black text-[#4d382f]">{t.clearFavorites}</h2>
            <p className="mt-3 text-sm font-bold leading-relaxed text-[#7c6a62]">{t.confirmClearFavorites}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowClearFavoritesConfirm(false)}
                className="rounded-2xl bg-white/75 py-3 font-black text-[#7c6a62] shadow-sm transition hover:bg-white"
              >
                {t.close}
              </button>
              <button
                type="button"
                onClick={clearFavorites}
                className="rounded-2xl bg-[#d98c84] py-3 font-black text-white shadow-lg shadow-[#d98c84]/20 transition hover:bg-[#c97972]"
              >
                {t.clearFavorites}
              </button>
            </div>
          </div>
        </div>
      )}

      <main ref={scrollRegionRef} className={`app-scroll-region relative z-10 mx-auto box-border flex w-full max-w-md flex-col ${activeTab === 'home' ? 'home-scroll-region px-0 pt-0' : 'tab-scroll-region px-4 pt-5'}`}>
        {activeTab !== 'home' && (
        <header className="app-topbar mb-6 grid grid-cols-[3.5rem_1fr_3.5rem] items-center">
          <div aria-hidden="true"></div>
          <div className="relative text-center">
            <p className="home-v3-brand-title">Cozy Weather</p>
            <div className="home-v3-brand-rule"></div>
          </div>
          <div aria-hidden="true"></div>
        </header>
        )}

        {activeTab === 'home' ? (
          <>
        {loading ? (
          <section className="storybook-paper mx-4 mt-5 flex flex-1 flex-col items-center justify-center rounded-[2rem] p-8 text-center">
            <div className="mb-5 h-16 w-16 animate-spin rounded-full border-4 border-[#f3d4ca] border-t-[#d98c84]"></div>
            <p className="font-black text-[#d98c84]">{t.loading}</p>
            <p className="mt-3 max-w-xs text-sm font-semibold text-[#7c6a62]">{t.manualHint}</p>
          </section>
        ) : error ? (
          <section className="storybook-paper mx-4 mt-5 rounded-[2rem] p-8 text-center text-[#b65555]">
            <p className="font-bold">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-5 rounded-2xl bg-[#f3d4ca] px-5 py-3 text-sm font-black text-[#8e5650]">
              {t.retry}
            </button>
          </section>
        ) : weather && location ? (
          <>
            <section key={sceneKey} className={`home-v3-hero-shell home-scene-backdrop--${homeSceneTone} scene-enter`}>
              {currentHomeScene && (
                <div className={`home-scene-backdrop home-scene-backdrop--${homeSceneTone}`} aria-hidden="true">
                  <img src={currentHomeScene.src} alt="" className="home-scene-backdrop__art" />
                  <div className="home-scene-backdrop__fade"></div>
                </div>
              )}

              <WeatherAtmosphere
                key={`${sceneKey}-atmosphere`}
                condition={condition}
                isDay={weather.current_weather.is_day === 1}
                windspeed={weather.current_weather.windspeed}
                weatherCode={weather.current_weather.weathercode}
              />

              <header className="home-v3-header mb-5 grid items-center">
                <div className="relative text-center">
                  <p className="home-v3-brand-title">Cozy Weather</p>
                  <div className="home-v3-brand-rule"></div>
                </div>
              </header>

              {cacheNotice && (
                <div className="home-cache-notice">
                  {cacheNotice}
                </div>
              )}

              <div className="home-v3-hero relative">
              <div className="home-v3-weather-copy relative z-10">
                <div className="home-v3-city-line">
                  <h1>{location.customName || location.name}</h1>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 21s6-5.1 6-11a6 6 0 0 0-12 0c0 5.9 6 11 6 11Z" />
                    <circle cx="12" cy="10" r="2.25" />
                  </svg>
                  <button
                    type="button"
                    onClick={toggleFavorite}
                    className={`home-v3-inline-favorite ${isCurrentLocationFavorite() ? 'is-active' : ''}`}
                    aria-label={isCurrentLocationFavorite() ? (language === 'es' ? 'Quitar de favoritos' : 'Remove from favorites') : t.save}
                    title={isCurrentLocationFavorite() ? (language === 'es' ? 'Quitar de favoritos' : 'Remove from favorites') : t.save}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.5 8.7c0 5.8-8.5 10.5-8.5 10.5S3.5 14.5 3.5 8.7A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8.5 2.1Z" />
                    </svg>
                  </button>
                </div>
                <p className="home-v3-date">{dateLabel}</p>
                <div className="home-v3-reading">
                  <span className="home-v3-temperature">
                    {formatTemperature(weather.current_weather.temperature)}&deg;{temperatureUnit === 'f' ? 'F' : ''}
                  </span>
                  <div className="home-v3-condition-row">
                    <img
                      src={currentWeatherAsset.src}
                      alt={currentWeatherAsset.alt[language]}
                      className="cozy-weather-hero-asset h-11 w-11 shrink-0"
                      loading="eager"
                      decoding="async"
                    />
                    <p>{conditionLabel}</p>
                  </div>
                </div>
                {weather.current_weather.apparent_temperature !== undefined && (
                  <div className="home-v3-feels-meta">
                    <span className="home-v3-feels-icon">
                      <TempIcon className="h-7 w-7 scale-75" />
                    </span>
                    {t.feelsLike} {formatTemperature(weather.current_weather.apparent_temperature)}&deg;{temperatureUnit === 'f' ? 'F' : ''}
                  </div>
                )}
                <div className="home-v3-wind-meta">
                  <img
                    src={cozyWeatherAssets.wind.src}
                    alt=""
                    className="h-7 w-7"
                    aria-hidden="true"
                  />
                  {formatWind(weather.current_weather.windspeed)} {windUnit === 'mph' ? 'mph' : 'km/h'}
                </div>
              </div>

              </div>
            </section>

            <section className="home-v3-content-section">
            {cozyMessage && (
              <section className="home-v3-message-card storybook-paper mb-2.5">
                <div className="home-v3-message-icon">
                  <img src={cozyMessageAsset.src} alt={cozyMessageAsset.alt[language]} className="cozy-card-asset h-12 w-12" loading="lazy" decoding="async" />
                </div>
                <p>{cozyMessage}</p>
                <img
                  src={cozyDecorations.leavesAlt.src}
                  alt=""
                  className="home-v3-message-leaves"
                  aria-hidden="true"
                />
              </section>
            )}

            <section className="home-v3-feature-grid mb-3">
              <OutfitWidget
                temperature={weather.current_weather.temperature}
                apparentTemperature={weather.current_weather.apparent_temperature ?? weather.current_weather.temperature}
                weatherCode={weather.current_weather.weathercode}
                windspeed={weather.current_weather.windspeed}
                isDay={weather.current_weather.is_day === 1}
                lang={language}
                label={t.outfitTitle}
              />
              <ActivityWidget
                activity={activitySuggestion || t.loadingPlan}
                asset={currentPlanAsset}
                weatherCode={weather.current_weather.weathercode}
                temperature={weather.current_weather.temperature}
                isDay={weather.current_weather.is_day === 1}
                onClick={() => {
                  if (activitySuggestion) {
                    setSelectedPlan(null);
                    setShowActivityModal(true);
                  }
                }}
                lang={language}
                isLoading={!activitySuggestion}
              />
            </section>

            <section className="home-v3-forecast-panel storybook-paper mb-3">
              <HourlyForecast
                data={weather.hourly}
                label={t.hourly}
                lang={language}
                temperatureUnit={temperatureUnit}
                formatTemperature={formatTemperature}
              />
            </section>

            <section className="home-v3-forecast-panel storybook-paper mb-3">
              <h2 className="home-v3-section-title">{t.nextDays}</h2>
              <div className="home-v3-daily-list">
                {weather.daily.time.slice(1, 6).map((date, index) => {
                  const max = weather.daily.temperature_2m_max[index + 1];
                  const min = weather.daily.temperature_2m_min[index + 1];
                  const code = weather.daily.weathercode[index + 1];
                  const dayLabel = new Date(date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                    weekday: 'short',
                    day: 'numeric'
                  });
                  const weatherAsset = getWeatherAsset(code, 20, 0, true);

                  return (
                    <div key={date} className="home-v3-daily-row">
                      <span className="home-v3-daily-day">{dayLabel}</span>
                      <span className="home-v3-daily-weather">
                        <img src={weatherAsset.src} alt={weatherAsset.alt[language]} className="cozy-forecast-asset h-9 w-9" loading="lazy" decoding="async" />
                        <span className="home-v3-daily-copy">{getForecastConditionLabel(code, language)}</span>
                      </span>
                      <span className="home-v3-daily-range">
                        {formatTemperature(min)}&deg; / {formatTemperature(max)}&deg;{temperatureUnit === 'f' ? 'F' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <button
              onClick={() => setShowPromo(true)}
              className="home-v3-share mb-3"
            >
              {t.shareBtn}
            </button>
            </section>
          </>
        ) : null}

          </>
        ) : (
          <section className="tab-screen-card storybook-paper mb-5 box-border w-full max-w-full overflow-hidden rounded-[2rem] p-5">
            <div className="tab-screen-heading mb-5 flex items-center gap-3">
              <div className="tab-screen-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7d6cc]">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#b86f68]">
                  <TabIcon tab={activeTab} active />
                </svg>
              </div>
              <div>
                <h1 className="tab-screen-title text-2xl font-black text-[#4d382f]">{placeholderCopy[language][activeTab].title}</h1>
                <p className="tab-screen-subtitle text-sm font-bold text-[#7c6a62]">{placeholderCopy[language][activeTab].body}</p>
              </div>
            </div>

            {activeTab === 'search' && (
              <div className="tab-content-stack space-y-5">
                <div className="search-input-card storybook-panel flex items-center gap-3 rounded-[1.7rem] px-4 py-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5 shrink-0 text-[#7fa8b9]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    className="min-w-0 flex-1 bg-transparent text-lg font-black text-[#4d382f] outline-none placeholder:text-[#9c8c80]"
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => setShowSearch(true)}
                  />
                </div>

                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={locationLoading}
                  className="location-action-card storybook-panel flex w-full items-center gap-4 rounded-[1.7rem] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#dceef4] text-[#5f93a8]">
                    {locationLoading ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#9fc5d2] border-t-[#5f93a8]"></span>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                        <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                      </svg>
                    )}
                  </span>
                  <span>
                    <span className="block text-base font-black text-[#4d382f]">{t.useCurrentLocation}</span>
                    <span className="block text-sm font-bold text-[#7c6a62]">{t.useCurrentLocationHint}</span>
                  </span>
                </button>

                {locationErrorMessage && (
                  <div className="rounded-2xl bg-[#fff2ef] px-4 py-3 text-sm font-bold text-[#b65555]">
                    {locationErrorMessage}
                  </div>
                )}

                {searchLoading && (
                  <div className="soft-status-card storybook-panel rounded-2xl px-4 py-3 text-center text-sm font-black text-[#7fa8b9]">
                    {t.searchingCities}
                  </div>
                )}

                {searchErrorMessage && (
                  <div className="rounded-2xl bg-[#fff2ef] px-4 py-3 text-sm font-bold text-[#b65555]">
                    {searchErrorMessage}
                  </div>
                )}

                {showSearch && searchQuery.trim().length >= 2 && !searchLoading && !searchErrorMessage && searchResults.length === 0 && (
                  <div className="empty-state-card storybook-panel rounded-2xl px-4 py-4 text-sm font-bold text-[#7c6a62]">
                    {t.noSearchResults}
                  </div>
                )}

                {showSearch && searchResults.length > 0 && (
                  <section>
                    <h2 className="section-kicker mb-3 px-1 text-lg font-black text-[#4d382f]">{t.searchResultsTitle}</h2>
                    <div className="space-y-3">
                      {searchResults.map((city) => (
                        <CityCard key={cityKey(city)} city={city} onSelect={selectCity} />
                      ))}
                    </div>
                  </section>
                )}

                {recentSearches.length > 0 && (
                  <section>
                    <h2 className="section-kicker mb-3 px-1 text-lg font-black text-[#4d382f]">{t.recentSearches}</h2>
                    <div className="space-y-2">
                      {recentSearches.map((city) => (
                        <CityCard key={cityKey(city)} city={city} onSelect={selectCity} compact />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="tab-content-stack grid w-full min-w-0 max-w-full gap-5 overflow-hidden">
                {favorites.length > 0 ? (() => {
                  const orderedFavorites = [...favorites].sort((a, b) => Number(isSameLocation(b)) - Number(isSameLocation(a)));
                  const featuredFavorite = orderedFavorites[0];
                  const secondaryFavorites = orderedFavorites.slice(1);

                  const renderFavorite = (fav: GeoLocation, featured = false) => {
                    const favWeather = favoriteWeather[geoKey(fav)];
                    const favCondition = favWeather
                      ? getConditionKey(favWeather.current_weather.weathercode, favWeather.current_weather.is_day === 1)
                      : null;
                    const favAsset = favWeather
                      ? getWeatherAsset(
                          favWeather.current_weather.weathercode,
                          favWeather.current_weather.temperature,
                          favWeather.current_weather.windspeed,
                          favWeather.current_weather.is_day === 1
                        )
                      : undefined;

                    return (
                      <FavoriteTicket
                        key={geoKey(fav)}
                        city={fav}
                        meta={[fav.admin1, fav.country].filter(Boolean).join(', ')}
                        weather={favWeather && favCondition && favAsset ? {
                          temperature: favWeather.current_weather.temperature,
                          condition: t.condition[favCondition],
                          asset: favAsset
                        } : undefined}
                        lang={language}
                        isCurrent={isSameLocation(fav)}
                        temperatureUnit={temperatureUnit}
                        formatTemperature={formatTemperature}
                        label={featured ? (language === 'es' ? 'Principal' : 'Main') : undefined}
                        featured={featured}
                        onClick={() => selectCity(fav)}
                        onRemove={(event) => removeFavorite(event, fav.latitude, fav.longitude)}
                      />
                    );
                  };

                  return (
                    <>
                      {renderFavorite(featuredFavorite, true)}

                      {secondaryFavorites.length > 0 && (
                        <section>
                          <h2 className="section-kicker mb-3 px-1 text-lg font-black text-[#4d382f]">
                            {language === 'es' ? 'También guardadas' : 'Also saved'}
                          </h2>
                          <div className="grid gap-3">
                            {secondaryFavorites.map((fav) => renderFavorite(fav))}
                          </div>
                        </section>
                      )}
                    </>
                  );
                })() : (
                  <div className="empty-state-card storybook-panel flex w-full flex-col items-center rounded-[1.7rem] p-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7d6cc] text-[#d98c84]">
                      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.5 8.7c0 5.8-8.5 10.5-8.5 10.5S3.5 14.5 3.5 8.7A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8.5 2.1Z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-black text-[#4d382f]">{t.favoritesEmptyTitle}</h2>
                    <p className="mt-2 text-sm font-bold leading-relaxed text-[#7c6a62]">
                      {t.favoritesEmptyBody}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'plans' && (
              <div className="tab-content-stack grid gap-5">
                <PlanCard
                  plan={planBundle.primary}
                  lang={language}
                  label={t.plan}
                  featured
                  onSelect={openPlanModal}
                />

                {planBundle.alternatives.length > 0 && (
                  <section>
                    <h2 className="section-kicker mb-3 px-1 text-lg font-black text-[#4d382f]">
                      {language === 'es' ? 'También puede encajar' : 'This could also fit'}
                    </h2>
                    <div className="grid gap-3">
                      {planBundle.alternatives.map((plan) => (
                        <PlanCard
                          key={plan.id}
                          plan={plan}
                          lang={language}
                          onSelect={openPlanModal}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-stack tab-content-stack grid gap-5">
                <section className="settings-section grid gap-3">
                  <h2 className="section-kicker px-1 text-lg font-black text-[#4d382f]">{t.language}</h2>
                  <div className="settings-panel storybook-panel rounded-[1.7rem] p-4">
                    <SegmentedControl
                      value={language}
                      options={[
                        { value: 'es', label: 'Español' },
                        { value: 'en', label: 'English' }
                      ]}
                      onChange={(value) => {
                        if (value !== language) toggleLanguage();
                      }}
                    />
                  </div>
                </section>

                <section className="settings-section grid gap-3">
                  <h2 className="section-kicker px-1 text-lg font-black text-[#4d382f]">{t.units}</h2>
                  <div className="settings-panel storybook-panel grid gap-4 rounded-[1.7rem] p-4">
                    <div className="grid gap-2">
                      <span className="text-sm font-black text-[#4d382f]">{t.temperature}</span>
                      <SegmentedControl
                        value={temperatureUnit}
                        options={[
                          { value: 'c', label: 'Celsius (°C)' },
                          { value: 'f', label: 'Fahrenheit (°F)' }
                        ]}
                        onChange={setTemperatureUnit}
                      />
                    </div>
                    <div className="grid gap-2">
                      <span className="text-sm font-black text-[#4d382f]">{t.wind}</span>
                      <SegmentedControl
                        value={windUnit}
                        options={[
                          { value: 'kmh', label: 'km/h' },
                          { value: 'mph', label: 'mph' }
                        ]}
                        onChange={setWindUnit}
                      />
                    </div>
                  </div>
                </section>

                <section className="settings-section grid gap-3">
                  <h2 className="section-kicker px-1 text-lg font-black text-[#4d382f]">{t.location}</h2>
                  <div className="grid gap-3">
                    <SettingsRow
                      title={t.useCurrentLocation}
                      description={t.useCurrentLocationHint}
                      value={locationLoading ? '...' : undefined}
                      onClick={useCurrentLocation}
                    />
                    {locationErrorMessage && (
                      <div className="rounded-2xl bg-[#fff2ef] px-4 py-3 text-sm font-bold text-[#b65555]">
                        {locationErrorMessage}
                      </div>
                    )}
                    <SettingsRow
                      title={t.currentCity}
                      description={location ? (location.customName || location.name) : t.defaultLocation}
                    />
                  </div>
                </section>

                <section className="settings-section grid gap-3">
                  <h2 className="section-kicker px-1 text-lg font-black text-[#4d382f]">{t.localData}</h2>
                  <div className="grid gap-3">
                    <SettingsRow
                      title={t.clearRecentSearches}
                      description={t.clearRecentSearchesHint}
                      onClick={clearRecentSearches}
                    />
                    <SettingsRow
                      title={t.clearFavorites}
                      description={t.clearFavoritesHint}
                      onClick={() => setShowClearFavoritesConfirm(true)}
                      tone="danger"
                    />
                  </div>
                </section>

                <section className="settings-section grid gap-3">
                  <h2 className="section-kicker px-1 text-lg font-black text-[#4d382f]">{t.about}</h2>
                  <SettingsRow
                    title={t.about}
                    description={language === 'es' ? 'Cómo usa la app tus datos.' : 'How the app uses your data.'}
                    value="›"
                    onClick={() => setShowAbout(true)}
                  />
                </section>

                <section className="settings-section grid gap-3">
                  <h2 className="section-kicker px-1 text-lg font-black text-[#4d382f]">{t.credits}</h2>
                  <div className="settings-panel storybook-panel grid gap-3 rounded-[1.7rem] p-4 text-sm font-bold text-[#7c6a62]">
                    <p>{t.footer}</p>
                    <p>{t.version}</p>
                  </div>
                </section>
              </div>
            )}
          </section>
        )}

        <div
          className={`bottom-nav-spacer ${activeTab === 'home' ? 'bottom-nav-spacer--home' : ''}`}
          aria-hidden="true"
        ></div>
      </main>

      <div className="bottom-nav-zone">
        <nav className="bottom-nav storybook-paper grid w-full max-w-md grid-cols-5 gap-1 rounded-[1.6rem] px-2 py-2">
          {(['home', 'search', 'favorites', 'plans', 'settings'] as AppTab[]).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-black transition ${active ? 'bg-[#f7d6cc]/70 text-[#d98c84]' : 'text-[#6f574b]'}`}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <TabIcon tab={tab} active={active} />
                </svg>
                <span className="truncate">{tabLabels[language][tab]}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default App;
