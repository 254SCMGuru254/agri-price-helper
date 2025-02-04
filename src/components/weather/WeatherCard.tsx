import { Card } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";
import type { WeatherData } from "./types";

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <WeatherIcon code={weather.current.weather_code} />
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
  );
};