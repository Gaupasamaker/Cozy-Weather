export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  customName?: string; // Added for favorites (e.g., "Home", "Work")
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
  time: string;
  apparent_temperature?: number;
}

export interface DailyForecast {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface WeatherData {
  current_weather: CurrentWeather;
  daily: DailyForecast;
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
    is_day: number[];
    apparent_temperature: number[];
  };
}