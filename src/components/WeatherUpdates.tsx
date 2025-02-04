import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  CloudLightning,
  CloudFog,
} from "lucide-react";

interface Location {
  lat: number;
  lon: number;
}

interface WeatherData {
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
  };
}

const getWeatherIcon = (code: number) => {
  if (code >= 0 && code <= 3) return <Sun className="h-8 w-8 text-yellow-500" />;
  if (code >= 51 && code <= 67)
    return <CloudRain className="h-8 w-8 text-blue-500" />;
  if (code >= 71 && code <= 77)
    return <CloudSnow className="h-8 w-8 text-blue-300" />;
  if (code >= 80 && code <= 82)
    return <CloudRain className="h-8 w-8 text-blue-600" />;
  if (code >= 95 && code <= 99)
    return <CloudLightning className="h-8 w-8 text-yellow-600" />;
  return <Cloud className="h-8 w-8 text-gray-500" />;
};

export const WeatherUpdates = () => {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const { data: weather, isLoading, error } = useQuery({
    queryKey: ["weather", location],
    queryFn: async ({ queryKey }) => {
      const [_, locationData] = queryKey;
      if (!locationData) throw new Error("Location not available");
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${locationData.lat}&longitude=${locationData.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      return response.json() as Promise<WeatherData>;
    },
    enabled: !!location,
    retry: 2,
    staleTime: 300000, // 5 minutes
  });

  if (!location) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Weather Updates</h2>
        <Card className="p-6">
          <p className="text-muted-foreground">
            Please enable location services to see weather updates.
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Weather Updates</h2>
        <Card className="p-6">
          <p className="text-red-500">
            Failed to load weather data. Please try again later.
          </p>
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.current.weather_code)}
            <div>
              <h3 className="text-2xl font-bold">
                {weather.current.temperature_2m}°C
              </h3>
              <p className="text-muted-foreground">Current Temperature</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Humidity: {weather.current.relative_humidity_2m}%
            </p>
            <p className="text-sm text-muted-foreground">
              Wind: {weather.current.wind_speed_10m} km/h
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Today's High</p>
            <p className="text-2xl font-bold">{weather.daily.temperature_2m_max[0]}°C</p>
          </div>
          <div>
            <p className="text-sm font-medium">Today's Low</p>
            <p className="text-2xl font-bold">{weather.daily.temperature_2m_min[0]}°C</p>
          </div>
        </div>
      </Card>
    </div>
  );
};