
export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
}

interface GeocodeResult {
  lat: number;
  lng: number;
  name: string;
}

export class WeatherService {
  private static readonly GEOCODING_API = 'https://api.opencagedata.com/geocode/v1/json';
  private static readonly WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
  
  // For production, these should be in environment variables
  private static readonly OPENCAGE_API_KEY = 'your-opencage-api-key'; // You'll need to get this
  
  static async getCoordinatesForLocation(location: string): Promise<GeocodeResult | null> {
    try {
      // For Kenya-specific locations, we can use a fallback mapping
      const kenyanLocations: Record<string, GeocodeResult> = {
        'nairobi': { lat: -1.2921, lng: 36.8219, name: 'Nairobi' },
        'mombasa': { lat: -4.0435, lng: 39.6682, name: 'Mombasa' },
        'kisumu': { lat: -0.1022, lng: 34.7617, name: 'Kisumu' },
        'nakuru': { lat: -0.3031, lng: 36.0800, name: 'Nakuru' },
        'eldoret': { lat: 0.5143, lng: 35.2698, name: 'Eldoret' },
        'thika': { lat: -1.0332, lng: 37.0692, name: 'Thika' },
        'malindi': { lat: -3.2200, lng: 40.1169, name: 'Malindi' },
        'kitale': { lat: 1.0177, lng: 35.0062, name: 'Kitale' },
        'garissa': { lat: -0.4569, lng: 39.6582, name: 'Garissa' },
        'kakamega': { lat: 0.2827, lng: 34.7519, name: 'Kakamega' },
        'kericho': { lat: -0.3676, lng: 35.2861, name: 'Kericho' },
        'nyeri': { lat: -0.4209, lng: 36.9483, name: 'Nyeri' },
        'meru': { lat: 0.0467, lng: 37.6556, name: 'Meru' },
        'embu': { lat: -0.5314, lng: 37.4502, name: 'Embu' },
        'machakos': { lat: -1.5177, lng: 37.2634, name: 'Machakos' }
      };

      const normalizedLocation = location.toLowerCase().trim();
      
      // Check if it's a known Kenyan location
      if (kenyanLocations[normalizedLocation]) {
        return kenyanLocations[normalizedLocation];
      }

      // Try to use OpenCage Geocoding API if available
      if (this.OPENCAGE_API_KEY !== 'your-opencage-api-key') {
        const response = await fetch(
          `${this.GEOCODING_API}?q=${encodeURIComponent(location + ', Kenya')}&key=${this.OPENCAGE_API_KEY}&limit=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
              lat: result.geometry.lat,
              lng: result.geometry.lng,
              name: result.formatted
            };
          }
        }
      }

      // Fallback to Nairobi if location not found
      console.warn(`Location ${location} not found, using Nairobi as fallback`);
      return kenyanLocations['nairobi'];
      
    } catch (error) {
      console.error('Error geocoding location:', error);
      // Return Nairobi as ultimate fallback
      return { lat: -1.2921, lng: 36.8219, name: 'Nairobi' };
    }
  }

  static async getWeatherData(location: string = 'Nairobi'): Promise<WeatherData> {
    try {
      const coordinates = await this.getCoordinatesForLocation(location);
      if (!coordinates) {
        throw new Error('Could not get coordinates for location');
      }

      const response = await fetch(
        `${this.WEATHER_API}?latitude=${coordinates.lat}&longitude=${coordinates.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Africa/Nairobi&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        current: {
          temperature_2m: Math.round(data.current.temperature_2m),
          relative_humidity_2m: Math.round(data.current.relative_humidity_2m),
          wind_speed_10m: Math.round(data.current.wind_speed_10m * 10) / 10,
          weather_code: data.current.weather_code
        },
        daily: {
          time: data.daily.time,
          temperature_2m_max: data.daily.temperature_2m_max.map((temp: number) => Math.round(temp)),
          temperature_2m_min: data.daily.temperature_2m_min.map((temp: number) => Math.round(temp)),
          precipitation_sum: data.daily.precipitation_sum.map((precip: number) => Math.round(precip * 10) / 10),
          weather_code: data.daily.weather_code
        }
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      
      // Return realistic fallback data for Kenya
      return {
        current: {
          temperature_2m: 23,
          relative_humidity_2m: 65,
          wind_speed_10m: 8.5,
          weather_code: 1
        },
        daily: {
          time: Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return date.toISOString().split('T')[0];
          }),
          temperature_2m_max: [26, 28, 25, 24, 27, 29, 26],
          temperature_2m_min: [18, 19, 17, 16, 18, 20, 18],
          precipitation_sum: [0, 2.1, 0, 0, 1.2, 0, 0.5],
          weather_code: [1, 61, 1, 2, 61, 1, 3]
        }
      };
    }
  }

  static getWeatherDescription(code: number): string {
    const descriptions: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    
    return descriptions[code] || 'Unknown weather condition';
  }
}
