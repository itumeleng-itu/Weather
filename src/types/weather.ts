export interface WeatherData {
    name: string;
    main: {
        temp: number;
        humidity: number;
    };
    wind: {
        speed: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
}

export interface ForecastData {
    list: Array<{
        dt_txt: string;
        main: {
            temp: number;
        };
        weather: Array<{
            main: string;
            description: string;
            icon: string;
        }>;
    }>;
}
