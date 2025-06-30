
import { Weather, WeatherCondition } from '../types';

// WMO Weather interpretation codes mapping to our game's enum
// Reference: https://open-meteo.com/en/docs
const wmoCodeMapping: { [key: number]: WeatherCondition } = {
  0: WeatherCondition.Sunny,
  1: WeatherCondition.Cloudy,
  2: WeatherCondition.Cloudy,
  3: WeatherCondition.Cloudy,
  45: WeatherCondition.Foggy,
  48: WeatherCondition.Foggy,
  51: WeatherCondition.Rainy,
  53: WeatherCondition.Rainy,
  55: WeatherCondition.Rainy,
  56: WeatherCondition.Rainy, // Freezing Drizzle
  57: WeatherCondition.Rainy, // Freezing Drizzle
  61: WeatherCondition.Rainy,
  63: WeatherCondition.Rainy,
  65: WeatherCondition.Rainy,
  66: WeatherCondition.Rainy, // Freezing Rain
  67: WeatherCondition.Rainy, // Freezing Rain
  71: WeatherCondition.Snowy,
  73: WeatherCondition.Snowy,
  75: WeatherCondition.Snowy,
  77: WeatherCondition.Snowy,
  80: WeatherCondition.Rainy,
  81: WeatherCondition.Rainy,
  82: WeatherCondition.Rainy,
  85: WeatherCondition.Snowy,
  86: WeatherCondition.Snowy,
  95: WeatherCondition.Stormy,
  96: WeatherCondition.Stormy,
  99: WeatherCondition.Stormy,
};


const weatherData: Record<WeatherCondition, { delayChance: number; icon: string }> = {
  [WeatherCondition.Sunny]: { delayChance: 0.05, icon: '☀️' },
  [WeatherCondition.Cloudy]: { delayChance: 0.1, icon: '☁️' },
  [WeatherCondition.Rainy]: { delayChance: 0.3, icon: '🌧️' },
  [WeatherCondition.Stormy]: { delayChance: 0.8, icon: '⛈️' },
  [WeatherCondition.Foggy]: { delayChance: 0.6, icon: '🌫️' },
  [WeatherCondition.Snowy]: { delayChance: 0.7, icon: '❄️' },
};

export const getWeatherIcon = (condition: WeatherCondition): string => {
    return weatherData[condition]?.icon ?? '❓';
}

const fallbackWeather: Weather = { condition: WeatherCondition.Sunny, temperature: 18, delayChance: 0.05 };

export const fetchAndParseWeather = async (icao: string): Promise<Weather> => {
    // ICAO code is no longer used, but kept for function signature compatibility.
    // We will use hardcoded coordinates for Krakow, Poland (EPKK).
    const latitude = 50.08;
    const longitude = 19.80;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather API request failed with status ${response.status}`);
        }
        const data = await response.json();

        const temperature = Math.round(data.current.temperature_2m);
        const weatherCode = data.current.weather_code;
        const condition = wmoCodeMapping[weatherCode] ?? WeatherCondition.Cloudy; // Fallback to cloudy if code is unknown

        if (typeof temperature !== 'number') {
             console.error("Invalid temperature data from weather API:", data);
             return fallbackWeather;
        }

        return {
            condition,
            temperature,
            delayChance: weatherData[condition].delayChance,
        };
    } catch (error) {
        console.error("Error fetching or parsing weather from Open-Meteo:", error);
        return fallbackWeather;
    }
};