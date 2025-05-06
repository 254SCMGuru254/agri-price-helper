
export interface Location {
  lat: number;
  lon: number;
}

export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code?: number[]; // Added weather code for daily forecast
    time: string[]; // Added time array to access dates
  };
}
