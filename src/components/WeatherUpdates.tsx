
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { WeatherCard } from "./weather/WeatherCard";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Location, WeatherData } from "./weather/types";

const fetchWeatherData = async (location: Location): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto`,
      { 
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Weather API fetch error:", error);
    throw error;
  }
};

export const WeatherUpdates = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  // Default location for Nairobi, Kenya
  const defaultLocation: Location = {
    lat: -1.286389,
    lon: 36.817223
  };

  useEffect(() => {
    const setDefaultLocation = () => {
      console.log("Using default location (Nairobi, Kenya)");
      setLocation(defaultLocation);
      setLocationError("Using default location (Nairobi, Kenya) for weather data");
    };

    if ("geolocation" in navigator) {
      // Set a timeout in case geolocation takes too long
      const timeoutId = setTimeout(() => {
        if (!location) {
          setDefaultLocation();
        }
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.log("Geolocation error:", error.message);
          setDefaultLocation();
        },
        { 
          enableHighAccuracy: false, 
          timeout: 5000,
          maximumAge: 60000
        }
      );
    } else {
      setDefaultLocation();
    }

    return () => {}; // Cleanup function
  }, []);

  const { data: weather, isLoading, error } = useQuery({
    queryKey: ["weather", location?.lat, location?.lon],
    queryFn: () => {
      if (!location) return Promise.reject("Location not available");
      return fetchWeatherData(location);
    },
    enabled: !!location,
    retry: 2,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false
  });

  if (!location) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Weather Updates</h2>
        <Card className="p-6">
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle size={18} />
            <p>Loading location data...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Weather Updates</h2>
        <Card className="p-6">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle size={18} />
            <p>Weather service temporarily unavailable. Please try again later.</p>
          </div>
          {locationError && (
            <p className="text-sm text-muted-foreground mt-2">{locationError}</p>
          )}
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
      <h2 className="text-2xl font-bold mb-4">Weather Forecast</h2>
      <WeatherCard weather={weather} />
      {locationError && (
        <p className="text-xs text-muted-foreground">{locationError}</p>
      )}
    </div>
  );
};
