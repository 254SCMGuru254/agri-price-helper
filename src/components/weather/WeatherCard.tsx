
import { Card } from "@/components/ui/card";
import { WeatherIcon } from "./WeatherIcon";
import type { WeatherData } from "./types";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  // Get day names for the forecast
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

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

      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-3">7-Day Forecast</h4>
        <Carousel className="w-full">
          <CarouselContent>
            {weather.daily.time.map((date, index) => (
              <CarouselItem key={date} className="md:basis-1/4 lg:basis-1/7">
                <div className="p-2">
                  <div className="rounded-md border p-3 h-full flex flex-col items-center justify-center text-center">
                    <p className="font-medium">{getDayName(date)}</p>
                    <WeatherIcon code={weather.current.weather_code} />
                    <div className="flex justify-between w-full mt-2">
                      <p className="text-sm font-medium">{weather.daily.temperature_2m_min[index]}°</p>
                      <p className="text-sm font-medium">{weather.daily.temperature_2m_max[index]}°</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {weather.daily.precipitation_sum[index]}mm
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </Card>
  );
};
