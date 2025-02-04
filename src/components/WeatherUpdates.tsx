import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Wind, Thermometer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

const getWeatherIcon = (code: number) => {
  if (code >= 95) return <CloudRain className="w-8 h-8 text-blue-500" />;
  if (code >= 80) return <Cloud className="w-8 h-8 text-gray-500" />;
  if (code >= 61) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (code >= 51) return <Cloud className="w-8 h-8 text-gray-400" />;
  return <Sun className="w-8 h-8 text-yellow-500" />;
};

export const WeatherUpdates = () => {
  const [location, setLocation] = useState({ lat: -1.2921, lon: 36.8219 }); // Default to Nairobi

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Keep default location when there's an error
        }
      );
    }
  }, []);

  const fetchWeatherData = async ({ queryKey }: { queryKey: [string, { lat: number; lon: number }] }): Promise<WeatherData> => {
    const [_, locationData] = queryKey;
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${locationData.lat}&longitude=${locationData.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  };

  const { data: weather, isLoading, error } = useQuery({
    queryKey: ["weather", location],
    queryFn: fetchWeatherData,
    retry: 2,
    staleTime: 300000, // 5 minutes
  });

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Weather Updates</h2>
        <Card className="p-6">
          <p className="text-red-500">Failed to load weather data. Please try again later.</p>
        </Card>
      </div>
    );
  }

  if (isLoading || !weather) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Weather Updates</h2>
        <Card className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Weather Updates</h2>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.current.weather_code)}
            <div>
              <h3 className="text-xl font-semibold">Current Weather</h3>
              <p className="text-gray-500">Local conditions</p>
            </div>
          </div>
          <div className="text-3xl font-bold">
            {Math.round(weather.current.temperature_2m)}°C
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-gray-500" />
            <span>{weather.current.wind_speed_10m} km/h</span>
          </div>
          <div className="flex items-center space-x-2">
            <CloudRain className="w-5 h-5 text-blue-500" />
            <span>{weather.current.precipitation} mm</span>
          </div>
          <div className="flex items-center space-x-2">
            <Thermometer className="w-5 h-5 text-red-500" />
            <span>{weather.current.relative_humidity_2m}%</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">3-Day Forecast</h3>
        <div className="grid grid-cols-3 gap-4">
          {weather.daily.time.slice(0, 3).map((date, index) => (
            <div key={date} className="text-center">
              <p className="font-medium">
                {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <div className="my-2">
                <p className="text-sm">
                  {Math.round(weather.daily.temperature_2m_max[index])}°C ↑
                </p>
                <p className="text-sm text-gray-500">
                  {Math.round(weather.daily.temperature_2m_min[index])}°C ↓
                </p>
              </div>
              <p className="text-sm">
                {weather.daily.precipitation_sum[index]} mm
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};