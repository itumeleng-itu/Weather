import React from "react";
import type { WeatherData } from "@/types/weather";
import humidGif from "@/assets/media/icons8-temperature-1--unscreen.gif";
import windGif from "@/assets/media/icons8-wind-turbine-unscreen.gif";

interface WeatherStatsProps {
  weather: WeatherData | null;
}

export const WeatherStats: React.FC<WeatherStatsProps> = ({ weather }) => {
  if (!weather) return (
    <div className="sm:flex bg-white/30 p-1 sm:p-4 rounded-lg w-full sm:w-48 h-40 sm:h-58 shadow-lg shadow-black/30 mt-1 flex items-center justify-center">
       <span className="text-white/50 text-xs">Loading stats...</span>
    </div>
  );

  return (
    <div className="sm:flex bg-white/30 p-1 sm:p-4 rounded-lg w-full sm:w-48 h-40 sm:h-58 shadow-lg shadow-black/30 mt-1">
      <div className="text-white text-xs sm:text-sm items-center justify-center ml-1 sm:ml-2 w-45">
        <h2 className="text-center font-medium text-sm sm:text-lg">
          Humidity: {weather.main.humidity}%
        </h2>
        <img
          className="h-10 w-10 sm:h-13 sm:w-13 mx-auto mb-2"
          src={humidGif}
          alt="humidity"
        />
        <hr className="border-white/20" />
        <h2 className="text-center font-medium text-sm sm:text-lg mt-1 sm:mt-2">
          Wind: {weather.wind.speed} m/s
        </h2>
        <img
          className="h-8 w-8 sm:h-13 sm:w-13 mx-auto mb-2"
          src={windGif}
          alt="wind"
        />
      </div>
    </div>
  );
};
