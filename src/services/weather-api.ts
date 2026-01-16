const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function fetchWeather(name: string) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("No data recorded for city");
        }
        throw new Error(`Weather API error: ${response.status}`);
    }
    return await response.json();
}

export async function fetchWeatherForecast(name: string) {
    // First get coordinates from current weather call (cheap and easy)
    const weather = await fetchWeather(name);
    const { lat, lon } = (weather as any).coord;
    return getWeatherForecastUsingCoordinates(lat, lon);
}

export async function getWeatherUsingCoordinates(lat: number, lon: number) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
        throw new Error("Location not found");
    }
    return response.json();
}

export async function getWeatherForecastUsingCoordinates(lat: number, lon: number) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max&timezone=auto`
    );
    if (!response.ok) {
        throw new Error("Hourly forecast not found");
    }
    const data = await response.json();

    // Normalize Open-Meteo to our existing ForecastData type
    const list = data.hourly.time.map((time: string, i: number) => ({
        dt_txt: time.replace('T', ' '),
        main: {
            temp: data.hourly.temperature_2m[i]
        },
        weather: [{
            main: "Clear", // Default
            description: "Clear sky",
            icon: mapWmoCodeToIcon(data.hourly.weathercode[i])
        }]
    }));

    return { list };
}

function mapWmoCodeToIcon(code: number): string {
    switch (code) {
        case 0:
        case 1:
            return "01d";
        case 2:
            return "02d";
        case 3:
            return "04d";
        case 45:
        case 48:
            return "50d";
        case 51:
        case 53:
        case 55:
        case 80:
        case 81:
        case 82:
            return "09d";
        case 61:
        case 63:
        case 65:
            return "10d";
        case 66:
        case 67:
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            return "13d";
        case 95:
        case 96:
        case 99:
            return "11d";
        default:
            return "01d";
    }
}
