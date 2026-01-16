import { useEffect, useState, useCallback } from "react";
import sunVid from "../assets/media/sun.mp4";
import type { WeatherData, ForecastData } from "@/types/weather";
import { 
  fetchWeather, 
  fetchWeatherForecast, 
  getWeatherUsingCoordinates, 
  getWeatherForecastUsingCoordinates 
} from "@/services/weather-api";
import { 
  selectVideoByWeather, 
  showWeatherNotification 
} from "@/lib/weather-utils";
import { SearchPanel } from "@/components/weather/SearchPanel";
import { CurrentWeatherCard } from "@/components/weather/CurrentWeatherCard";
import { WeatherStats } from "@/components/weather/WeatherStats";
import { ForecastPanel } from "@/components/weather/ForecastPanel";
import { LocationRequestDialog } from "@/components/weather/LocationRequestDialog";

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [queries, setQueries] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState(sunVid);
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    try {
      const [data, forecastData] = await Promise.all([
        getWeatherUsingCoordinates(lat, lon),
        getWeatherForecastUsingCoordinates(lat, lon)
      ]);

      setWeather(data);
      setForecast(forecastData);
      setError(null);
      setCurrentVideo(selectVideoByWeather(data));
      showWeatherNotification(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        setShowLocationDialog(false);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setShowLocationDialog(false);
      }
    );
  }, [fetchWeatherByCoords]);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        if (result.state === 'granted') {
          requestLocation();
        } else if (result.state === 'prompt') {
          setShowLocationDialog(true);
        }
      } catch (e) {
        // Fallback for browsers that don't support permissions API for geolocation
        setShowLocationDialog(true);
      }
    };

    checkPermission();

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [requestLocation]);

  const handleSearch = async () => {
    const query = searchValue.trim();
    if (!query) return;

    try {
      setQueries(prev => [...prev, query]);

      const [data, forecastData] = await Promise.all([
        fetchWeather(query),
        fetchWeatherForecast(query)
      ]);

      setWeather(data);
      setForecast(forecastData);
      setError(null);
      setCurrentVideo(selectVideoByWeather(data));
      showWeatherNotification(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Search failed");
      setWeather(null);
      setForecast(null);
    }
  };

  return (
    <div className="relative w-screen min-h-screen overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        key={weather?.weather?.[0]?.main || 'default'}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={currentVideo} type="video/mp4" />
      </video>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-2 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 bg-transparent/50 p-3 sm:p-4 rounded-lg w-full max-w-4xl">
          
          <SearchPanel 
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            handleSearch={handleSearch}
            queries={queries}
          />

          <div className="bg-black/30 p-3 sm:p-4 rounded-lg w-full sm:flex-1 h-auto sm:h-[450px] flex flex-col sm:flex-row items-start justify-start shadow-lg shadow-white/10 gap-2 sm:gap-3">
            <div className="flex sm:grid gap-3 text-base">
              <CurrentWeatherCard weather={weather} />
              <WeatherStats weather={weather} />
            </div>

            <ForecastPanel 
              forecast={forecast}
              setSelectedHour={() => {}}
            />
          </div>
        </div>

        <div className="absolute bottom-2 sm:bottom-1 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-1 sm:space-x-2 bg-black/30 px-2 sm:px-4 py-1 sm:py-2 rounded-lg backdrop-blur-sm text-white text-xs sm:text-sm">
            <span>Icons by</span>
            <a 
              href="https://icons8.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-300 transition-colors duration-200"
            >
              icons8.com 
            </a>
          </div>
        </div>
      </div>
      
      <LocationRequestDialog 
        open={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        onAccept={requestLocation}
      />

      {error && (
        <div className="absolute top-4 right-4 bg-red-500/80 text-white px-4 py-2 rounded-md z-50 animate-pulse">
          {error}
        </div>
      )}
    </div>
  );
}

