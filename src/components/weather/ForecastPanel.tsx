import React from "react";
import type { ForecastData } from "@/types/weather";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useUnit } from "@/context/UnitContext";

interface ForecastPanelProps {
  forecast: ForecastData | null;
  setSelectedHour: (index: number) => void;
}

export const ForecastPanel: React.FC<ForecastPanelProps> = ({
  forecast,
  setSelectedHour,
}) => {
  const { formatTemp } = useUnit();
  const hourlyForecast = () => {
    if (!forecast) return [];
    const now = new Date();
    return forecast.list
      .filter((item) => new Date(item.dt_txt) >= now)
      .slice(0, 4);
  };

  const dayForecast = () => {
    if (!forecast) return [];
    return forecast.list
      .filter((item) => item.dt_txt.includes("12:00"))
      .slice(0, 4);
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
      <div className="bg-white/40 rounded-lg w-full sm:w-122 h-24 sm:h-30 shadow-lg shadow-black/30">
        <iframe
          className="w-full h-full p-2 sm:p-5 bg-white/100 rounded-lg"
          src="https://open.spotify.com/embed/track/4xRxYWgAtL6pzRz94GlZlA?utm_source=generator"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {hourlyForecast().length > 0 ? (
          hourlyForecast().map((hour, index) => (
            <div
              onClick={() => setSelectedHour(index)}
              key={index}
              className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-24 sm:h-32 shadow-lg shadow-black/30 flex flex-col items-center justify-center cursor-pointer hover:bg-white/50 transition-colors"
            >
              <p className="text-xs sm:text-md text-white font-bold">
                {new Date(hour.dt_txt).getHours()}:00
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt="hourly icon"
                className="w-8 h-8 sm:w-13 sm:h-13"
              />
              <p className="text-xs sm:text-md text-white font-bold">
                {formatTemp(hour.main.temp)}
              </p>
            </div>
          ))
        ) : (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-24 sm:h-32 shadow-lg shadow-black/30 flex items-center justify-center"
            >
              <Spinner variant="infinite" className="text-black" size={32} />
            </div>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {dayForecast().length > 0 ? (
          dayForecast().map((day, index) => (
            <div
              key={index}
              className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-28 sm:h-34 shadow-lg shadow-black/30 mt-2 sm:mt-3 flex flex-col items-center justify-center"
            >
              <p className="text-sm sm:text-lg font-bold text-white">
                {new Date(day.dt_txt).toLocaleDateString("en", {
                  weekday: "short",
                })}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt="daily icon"
                className="w-10 h-10 sm:w-15 sm:h-15"
              />
              <p className="text-white text-sm sm:text-lg font-bold">
                {formatTemp(day.main.temp)}
              </p>
            </div>
          ))
        ) : (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-28 sm:h-34 shadow-lg shadow-black/30 flex items-center justify-center"
            >
              <Spinner variant="infinite" className="text-black" size={32} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
