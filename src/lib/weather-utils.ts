import type { WeatherData } from "../types/weather";
import sunVid from "../assets/media/sun.mp4";
import rainVid from "../assets/media/rain.mp4";
import snowVid from "../assets/media/snow.mp4";
import cloudsVid from "../assets/media/clouds.mp4";
import stormVid from "../assets/media/storm.mp4";

export function selectVideoByWeather(weatherData: WeatherData) {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
        return sunVid;
    }

    const mainWeather = weatherData.weather[0].main.toLowerCase();
    const description = weatherData.weather[0].description.toLowerCase();

    console.log(mainWeather, description);

    if (
        mainWeather.includes("clear") ||
        mainWeather.includes("sun") ||
        description.includes("clear") ||
        description.includes("sun")
    ) {
        return sunVid;
    } else if (
        mainWeather.includes("rain") ||
        mainWeather.includes("drizzle") ||
        description.includes("rain") ||
        description.includes("drizzle")
    ) {
        return rainVid;
    } else if (mainWeather.includes("snow") || description.includes("snow")) {
        return snowVid;
    } else if (
        mainWeather.includes("thunderstorm") ||
        description.includes("storm") ||
        description.includes("thunder")
    ) {
        return stormVid;
    } else if (
        mainWeather.includes("cloud") ||
        mainWeather.includes("clouds") ||
        mainWeather.includes("overcast") ||
        description.includes("cloud") ||
        description.includes("overcast") ||
        description.includes("clouds")
    ) {
        return cloudsVid;
    } else {
        return sunVid;
    }
}

export function showWeatherNotification(data: WeatherData) {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
        new Notification(`Weather in ${data.name}`, {
            body: `${data.weather[0].description}, ${data.main.temp}°C`,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        });
    }
}

export function cacheData(key: string, data: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
        console.error("Failed to cache data", err);
    }
}

export function loadData(key: string) {
    try {
        const cached = localStorage.getItem(key);
        return cached ? JSON.parse(cached) : null;
    } catch (err) {
        console.error("Failed to load cached data", err);
        return null;
    }
}
