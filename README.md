# Weather App

A modern, responsive weather application with dynamic background videos that change based on current weather conditions. Built with React and TypeScript, featuring a beautiful glassmorphism UI design.

## Features

- **Dynamic Background Videos**: Background changes based on weather conditions (sunny, rainy, snowy, cloudy, stormy)
- **Current Weather**: Real-time temperature, humidity, wind speed, and weather conditions
- **5-Day Forecast**: Hourly and daily weather predictions
- **Location Services**: Auto-detect user location with geolocation
- **Search History**: Track and revisit previous searches
- **Responsive Design**: Optimized for mobile and desktop with Tailwind CSS
- **Glassmorphism UI**: Modern translucent card design with backdrop blur effects
- **Spotify Integration**: Background music player
- **Notifications**: Browser notifications for weather updates

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **OpenWeatherMap API** for weather data
- **Icons8** for animated weather icons
- **Shadcn/ui** components

## Getting Started

### Prerequisites

- Node.js (v16 or newer recommended)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/itumeleng-itu/Weather.git
   cd Weather/my-react-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Key:**
   - Register for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
   - The API key is already configured in the code
   - For production, move the API key to environment variables

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Visit [http://localhost:5173](http://localhost:5173) in your browser (Vite default port)

## Usage

- **Search**: Enter a city name in the search bar to get current weather and 5-day forecast
- **Auto-location**: Allow location access for automatic weather detection
- **Background**: Watch the background video change based on weather conditions
- **Music**: Enjoy background music with the integrated Spotify player
- **History**: Click on previous searches to quickly revisit locations

## Project Structure

```
my-react-app/
├── src/
│   ├── components/
│   │   └── ui/           # Shadcn/ui components
│   ├── pages/
│   │   └── weather.tsx   # Main weather component
│   ├── assets/
│   │   ├── media/        # Weather videos and icons
│   │   └── inspo/        # Design inspiration images
│   ├── lib/
│   │   └── utils.ts      # Utility functions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
└── package.json
```

## Features in Detail

### Dynamic Background Videos
- **Sunny/Clear**: Bright sun video
- **Rainy**: Rainy weather video  
- **Snowy**: Snow falling video
- **Cloudy**: Overcast clouds video
- **Stormy**: Thunderstorm video

### Responsive Design
- **Mobile**: Stacked card layout with compact spacing
- **Desktop**: Side-by-side layout with larger cards
- **Tablet**: Adaptive layout that scales between mobile and desktop

### Weather Data
- Current temperature in Celsius and Fahrenheit
- Weather conditions with animated icons
- Humidity and wind speed with visual indicators
- 5-day forecast with hourly predictions
- Real-time weather updates

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for suggestions, bug fixes, or enhancements.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Icons8](https://icons8.com/) for animated weather icons
- [Shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

---
**Created by [itumeleng-itu](https://github.com/itumeleng-itu)**
