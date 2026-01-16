import React from "react";
import type { WeatherData } from "@/types/weather";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface CurrentWeatherCardProps {
  weather: WeatherData | null;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather }) => {
  return (
    <div className="bg-white/30 p-2 sm:p-6 sm:pl-8 rounded-lg w-full sm:w-48 h-32 sm:h-43 shadow-lg shadow-black/30">
      {weather ? (
        <div className="flex flex-col items-center sm:w-30">
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="w-12 h-12 sm:w-20 sm:h-20 mb-1 sm:mb-2"
          />
          <h1 className="font-medium text-center text-xs sm:text-base text-white font-serif">
            {weather.name}
          </h1>
          <h1 className="font-bold text-center text-white text-sm sm:text-xl">
            {Math.floor(weather.main.temp)}°C/
            {Math.floor(weather.main.temp * (9 / 5) + 32)}F
          </h1>
        </div>
      ) : (
        <p className="flex items-center justify-center h-full">
          <Spinner variant="infinite" className="text-black w-8 h-8 sm:w-16 sm:h-16" />
        </p>
      )}
    </div>
  );
};
