import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { WeatherCard } from "./weather/WeatherCard";
import type { Location, WeatherData } from "./weather/types";

const fetchWeatherData = async (location: Location): Promise<WeatherData> => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  
  return response.json();
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
    queryFn: () => {
      if (!location) throw new Error("Location not available");
      return fetchWeatherData(location);
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
      <WeatherCard weather={weather} />
    </div>
  );
};