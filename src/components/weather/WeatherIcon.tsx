import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning } from "lucide-react";

interface WeatherIconProps {
  code: number;
}

export const WeatherIcon = ({ code }: WeatherIconProps) => {
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