'use client';
import React from "react"
import {useEffect, useState} from "react";
import bgImg from "../assets/media/bg.png"; //background image
import Input from "../components/ui/input"; //custom input component
import Button from "../components/ui/button"; //custom button component
import humidGif from "../assets/media/icons8-temperature-1--unscreen.gif";
import windGif from "../assets/media/icons8-wind-turbine-unscreen.gif";
import { Spinner, type SpinnerProps } from '@/components/ui/shadcn-io/spinner';
import sunVid from "../assets/media/sun.mp4" //sun vid
import rainVid from "../assets/media/rain.mp4" // rain vis
import snowVid from "../assets/media/snow.mp4" // snow vid
import cloudsVid from "../assets/media/clouds.mp4" // clouds vid
import stormVid from "../assets/media/storm.mp4" // storm vid



export default function Weather() {
  const apiKey = "2a06182ec57b0915b19dc29187556666"; //my openWeather API key

  //state variables
  const [loading, setLoading] = useState(false); //to show when page is loading
  const [weather, setWeather] = useState(null); //stores current weather data
  const [forecast, setForecast] = useState(null) //stores forecast data
  const [error, setError] = useState(null); //if any errors occur
  const [city, setCity] = useState(""); //store city name typed by user
  const [searchValue, setSearchValue]=useState(" "); //store the search input value
  const [history,setHistory]= useState(""); //track last searched value
  const [queries,setQueries] =useState([]); //store multiple previous searches
  const [currentVideo, setCurrentVideo] = useState(sunVid); //current background video

  // Debug function to log current state
  useEffect(() => {
    console.log("Current weather state:", weather);
    console.log("Current forecast state:", forecast);
    console.log("Current error state:", error);
    console.log("Current video state:", currentVideo);
  }, [weather, forecast, error, currentVideo]);

  // -------- Video selection based on weather --------
  function selectVideoByWeather(weatherData) {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      console.log("No weather data, using default video");
      return sunVid; // Default fallback
    }

    const mainWeather = weatherData.weather[0].main.toLowerCase();
    const description = weatherData.weather[0].description.toLowerCase();
    
    console.log("Weather main:", mainWeather, "Description:", description);

    // different backgrounds
    if (mainWeather.includes('clear') || mainWeather.includes('sun') || description.includes('clear') || description.includes('sun')) {
      console.log("Selected sun video");
      return sunVid;
    } else if (mainWeather.includes('rain') || mainWeather.includes('drizzle') || description.includes('rain') || description.includes('drizzle')) {
      console.log("Selected rain video");
      return rainVid;
    } else if (mainWeather.includes('snow') || description.includes('snow')) {
      console.log("Selected snow video");
      return snowVid;
    } else if (mainWeather.includes('thunderstorm') || description.includes('storm') || description.includes('thunder')) {
      console.log("Selected storm video");
      return stormVid;
    } else if (mainWeather.includes('cloud') || mainWeather.includes('overcast') || description.includes('cloud') || description.includes('overcast')) {
      console.log("Selected clouds video");
      return cloudsVid;
    } else {
      console.log("Using default sun video for:", mainWeather);
      return sunVid; // Default fallback
    }
  }

  // -------- Fetch by city name --------
  async function fetchWeather(name) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`; //link where i get my weather data
    console.log("Fetching weather for:", name, "URL:", apiUrl); //debug API call
    const response = await fetch(apiUrl);// fetching my weather data and storing it inside a variable called response

    if (!response.ok) { //if response is not ok (grabbed nothing)
      console.error("Weather API error:", response.status, response.statusText); //debug API errors
      if (response.status === 404) { //if response returns nothing/ isnt found
        throw new Error("No data for recorded for city")}; // throw an error: No data for recorded for city
      
    }
    const data = await response.json(); //if data was fetched successfully, return it (converted to json format)
    console.log("Weather API response:", data); //debug API response
    return data;
  }
  //in the above fetchWeather function, i am gettin weather information based on the city name



  async function fetchWeatherForecast(name) {  //fetching the weather forecast
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${apiKey}&units=metric`; //link where i get my forecast data
    console.log("Fetching forecast for:", name, "URL:", apiUrl); //debug API call
    const response = await fetch(apiUrl);// fetching my weather data and storing it inside a variable called response

    if (!response.ok) { //if response is not ok (grabbed nothing)
      console.error("Forecast API error:", response.status, response.statusText); //debug API errors
      if (response.status === 404)  //if response returns nothing/ isnt found
        throw new Error("Forecast not recorded for city"); // throw an error: No data for recorded for city

    }
    const data = await response.json(); //if data was fetched successfully, return it (converted to json format)
    console.log("Forecast API response:", data); //debug API response
    return data;
  }
  //in the above fetchWeatherForecast function, i am gettin forecast information based on the city name



  // -------- Fetch by coordinates --------
  async function getWeatherUsingCoordinates(lat, lon) { //fetching the weather using coordinates
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      if (response.status === 404)
         throw new Error("Location not found"); //error if location is invalid
    }
    return response.json(); //return weather data in json
  }


  async function getWeatherForecastUsingCoordinates(lat, lon) { //fetch forecast using coordinates
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      if (response.status === 404) throw new Error("Forecast not found"); //forecast not found error
      throw new Error(`HTTP error ${response.status}`); //general error
    }
    return response.json(); //return forecast json
  }

  // -------- notification(need to personilise) --------
  function notification(data) {
    if (!("Notification" in window)) return; //if browser doesnt support notification exit
    if (Notification.permission === "granted") { //if permission is granted show notification
      new Notification(`Weather in ${data.name}`, {
        body: `${data.weather[0].description}, ${data.main.temp}°C`, //description + temp
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`, //use weather icon
      });
    }
  }

  function cacheData(key, data) {
    // Save JSON data into localStorage under given key
    try {
      localStorage.setItem(key, JSON.stringify(data)); //stringify data to save
    } catch (err) {
      console.error("Failed to cache data", err); //error if fails
    }
  }

  function loadData(key) {
    // Load JSON data from localStorage by key
    try {
      const cached = localStorage.getItem(key); //get data by key
      return cached ? JSON.parse(cached) : null; // return parsed object or null
    } catch (err) {
      console.error("Failed to load cached data", err); //log error if fails
      return null;
    }
  }

  // -------- Auto detect my location --------
  useEffect(() => {
    if (!navigator.geolocation) return; //if browser doesnt support geolocation stop
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoading(true); //show loading
          const data = await getWeatherUsingCoordinates(
            position.coords.latitude,
            position.coords.longitude
          ); //get weather using coords
          const forecastData = await getWeatherForecastUsingCoordinates(
            position.coords.latitude,
            position.coords.longitude
          ); //get forecast using coords

          setWeather(data); //set state with weather
          setForecast(forecastData) //set forecast
          setError(null); //clear error
          const selectedVideo = selectVideoByWeather(data);
          console.log("Setting video to:", selectedVideo);
          setCurrentVideo(selectedVideo); //update background video
          notification(data); //show notification
          console.log(data); //log data
          
        } catch (err) {
          setError(err.message); //show error
        } finally {
          setLoading(false); //stop loading
        }
      },
      (err) => {
        console.warn("Geolocation error:", err); //warn if geo fails
      }
    );
    // ask permission for notifications
    if (Notification.permission === "default") {
      Notification.requestPermission(); //ask user to allow notifications
    }
  }, []);

  // -------- Searching --------
  const handleSearch = async () => {
    if (!searchValue.trim()) return; //if input empty do nothing
    try {
      setLoading(true); //show loading
      setHistory(searchValue); //save search value in history
      queries.push(history) //push into queries array
      if(queries.length>0){ //if queries not empty log them
        console.log(queries);
      }

      const data = await fetchWeather(searchValue.trim()); //fetch current weather
      const forecastData = await fetchWeatherForecast(searchValue.trim()); //fetch forecast

      console.log("Weather data:", data); //debug weather data view data to see descriptions to use on bgVideo
      console.log("Forecast data:", forecastData); //debug forecast data

      setWeather(data); //set weather state
      setForecast(forecastData) //set forecast state
      setError(null); //clear error
      const selectedVideo = selectVideoByWeather(data);
      console.log("Setting video to:", selectedVideo);
      setCurrentVideo(selectedVideo); //update background video
      notification(data); //send notification
    } catch (err) {
      console.error("Search error:", err); //debug search errors
      setError(err.message); //show error
      setWeather(null); //clear weather
      setForecast(null) //clear forecast
    } finally {
      setLoading(false); //stop loading
    }
  };

  const dayForecast =()=>{ //function for daily forecast
    if(!forecast) return []; //if no forecast return empty array
    const dayData = forecast.list.filter((item)=>
    item.dt_txt.includes("12:00:00")); //only select midday records
    return dayData.slice(0,4); //return first 4 days
  }


  return (
    <div className="relative w-screen min-h-screen overflow-hidden bg-black">
    {/* Background video */}
    <video
      autoPlay
      loop
      muted
      playsInline
      key={weather?.weather?.[0]?.main || 'default'} // force reload when condition changes
      className="absolute inset-0 w-full h-full object-cover z-0"
    >
      <source src={currentVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    {/* Content overlay */}
    <div className="relative z-10 flex items-center justify-center min-h-screen p-2 sm:p-4">
        {/* Main container */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 bg-transparent/50 p-3 sm:p-4 rounded-lg w-full max-w-4xl">
          {/* Search div */}
          <div className="bg-black/30 p-3 sm:p-4 rounded-lg w-full sm:w-80 h-auto sm:h-53 shadow-lg shadow-white/10 mt-4 sm:mt-20">
              
              <div className="flex gap-1 mb-2">
                <Input 
                type="text" //input type text
                placeholder="Enter city name" //placeholder
                value={searchValue} //bind state
                onChange={(e) =>setSearchValue(e.target.value)} //update on typing
                className="flex-1 sm:w-30 shadow-lg bg-black/20 text-white font-medium text-sm sm:text-base"/>
                <Button 
                onClick={handleSearch} //when clicked call handleSearch
                className="bg-black/20 text-sm sm:text-base px-3 sm:px-4">search</Button>
              </div>
              <h3 className="text-center text-white font-medium mt-2 text-xs sm:text-sm">Previous Searches</h3>
              <hr className="border-white/20"></hr>
              <ul className="text-center text-white font-medium mt-2 sm:mt-3 mb-2 space-y-1">
              {queries.slice(-3).map((q, i) => ( //loop through last 3 queries on mobile
                <li key={i} onClick={handleSearch} className="text-xs sm:text-sm cursor-pointer hover:text-blue-300">
                  {q} {/* show query text */}
                </li>
              ))}
            </ul>
          </div>
  
          {/* Inside container */}
          <div className="bg-black/30 p-3 sm:p-4 rounded-lg w-full sm:flex-1 h-auto sm:h-[450px] flex flex-col sm:flex-row items-start justify-start shadow-lg shadow-white/10 gap-2 sm:gap-3">
            {/* Left inner div */}
            <div className="flex sm:grid gap-3 text-base">
            <div className="bg-white/30 p-3 sm:p-4 rounded-lg w-full sm:w-48 h-32 sm:h-43 shadow-lg shadow-black/30">
            {weather ? ( //if weather data available show it
                <div className="flex flex-col items-center sm:w-30">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} //weather icon
                    alt={weather.weather[0].description}
                    className="w-12 h-12 sm:w-20 sm:h-20 mb-1 sm:mb-2"
                  />
                  <h1 className="font-medium text-center text-xs sm:text-base text-white font-serif">{weather.name}</h1> {/* city name */}
                  <h1 className="font-bold text-center text-white text-sm sm:text-xl">{Math.floor(weather.main.temp)}°C/{Math.floor(weather.main.temp*(9/5)+32)}°F</h1> {/* temp in celsius and fahrenheit */}
                </div>
            ):(
              <p className="items-center mt-4 sm:mt-10"><Spinner variant="infinite" className="text-black" size={32} sm:size={64}/></p> //if taking too long show loading(need animation)
            )}
            </div>
            <div className="sm:flex bg-white/30 p-1 sm:p-4 rounded-lg w-full sm:w-48 h-40 sm:h-58 shadow-lg shadow-black/30 mt-1 sm:mt-1">
            {weather && (
                  <div className="text-white text-xs sm:text-sm items-center justify-center ml-1 sm:ml-2 w-45">
                    <h2 className="sm:text-center text-center font-medium text-sm sm:text-lg">Humidity: {weather.main.humidity}%</h2> {/*humidity*/}
                    <img className="h-10 w-10 sm:h-13 sm:w-13 ml-2 sm:m-2 mb-2 sm:mb-3 ml-8 sm:ml-12" src={humidGif} alt="humidity"/>
                    <hr className="border-white/20"></hr>
                    <h2 className="text-center font-medium text-sm sm:text-lg mt-1 sm:mt-2">Wind: {weather.wind.speed} m/s</h2> {/*wind speed*/}
                    <img className="h-8 w-8 sm:h-13 sm:w-13 m-1 sm:m-2 mb-2 sm:mb-3 ml-8 sm:ml-12" src={windGif} alt="wind"/>
                  </div>
                )}

            </div>
            </div>
            
  
            {/* Right inner divs container */}
            <div className="flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Top right div */}
              
              <div className="bg-white/40 rounded-lg w-full sm:w-122 h-24 sm:h-30 shadow-lg shadow-black/30">
                  <iframe
                    className="w-full h-full p-2 sm:p-5 bg-white/100 rounded-lg "
                    src="https://open.spotify.com/embed/track/156LzfvMNKuXuiot4uzhGD?utm_source=generator" //a drake song nyana!!
                    //frameBorder="0" // --this one says deprecated, i dont know whatit means but it doesnt work so i commented it out
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
              </div>

              {/* Hour divs container */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {forecast
                  ? forecast.list.slice(0, 4).map((hour, index) => ( //first 4 forecast entries
                      <div
                        key={index}
                        className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-24 sm:h-32 shadow-lg shadow-black/30 flex flex-col items-center justify-center"
                      >
                        <p className="text-xs sm:text-md text-white font-bold">
                          {new Date(hour.dt_txt).getHours()}:02 {/*one past 😂*/}
                        </p>
                        <img
                          src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                          alt="hourly icon"
                          className="w-8 h-8 sm:w-13 sm:h-13"
                        />
                        <p className="text-xs sm:text-md text-white font-bold">{Math.round(hour.main.temp)}°C</p> {/*hourly temp*/}
                      </div>
                    ))
                  : ( //placeholder if no forecast
                    <>
                    <div className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-24 sm:h-32 shadow-lg shadow-black/30 flex items-center justify-center">
                      <Spinner variant="infinite" className="text-black" size={32}/>
                    </div>
                    <div className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-24 sm:h-32 shadow-lg shadow-black/30 flex items-center justify-center">
                      <Spinner variant="infinite" className="text-black" size={32}/>
                    </div>
                    <div className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-24 sm:h-32 shadow-lg shadow-black/30 flex items-center justify-center">
                      <Spinner variant="infinite" className="text-black" size={32}/>
                    </div>
                    <div className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-24 sm:h-32 shadow-lg shadow-black/30 flex items-center justify-center">
                      <Spinner variant="infinite" className="text-black" size={32}/>
                    </div>
                    </>
                    )}
              </div>
  
              {/* Day divs container */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                
              {dayForecast().length > 0 
                  ? dayForecast().map((day, index) => ( //map through daily forecast
                      <div key={index} className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-28 sm:h-34 shadow-lg shadow-black/30 mt-2 sm:mt-3 flex flex-col items-center justify-center">
                        <p className="text-sm sm:text-lg font-bold text-white">
                          {new Date(day.dt_txt).toLocaleDateString('en', { weekday: 'short' })} {/*day name*/}
                        </p>
                        <img
                          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                          alt="daily icon"
                          className="w-10 h-10 sm:w-15 sm:h-15"
                        />
                        <p className="text-white text-sm sm:text-lg font-bold">{Math.round(day.main.temp)}°C</p> {/*daily temp*/}
                      </div>
                    ))
                  : ( //placeholder if no forecast
                    <>
                    <div className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-28 sm:h-34 shadow-lg shadow-black/30 flex items-center justify-center">
                      <Spinner variant="infinite" className="text-black" size={32}/>
                    </div>
                    <div className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-28 sm:h-34 shadow-lg shadow-black/30 flex items-center justify-center">
                      <Spinner variant="infinite" className="text-black" size={32}/>
                    </div>
                    <div className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-28 sm:h-34 shadow-lg shadow-black/30 flex items-center justify-center">
                      <Spinner variant="infinite" className="text-black" size={32}/>
                    </div>
                    <div className="bg-white/40 p-2 sm:p-4 rounded-lg w-full sm:w-28 h-28 sm:h-34 shadow-lg shadow-black/30 flex items-center justify-center">
                      <Spinner variant="infinite" className="text-black" size={32}/>
                    </div>
                    </>
                    )}

              </div>
            </div>
          </div>
        </div>

        {/* Icons8 attribution at bottom center */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-1 sm:space-x-2 bg-black/30 px-2 sm:px-4 py-1 sm:py-2 rounded-lg backdrop-blur-sm">
            <span className="text-white text-xs sm:text-sm">Icons by</span>
            <a 
              href="https://icons8.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300 transition-colors duration-200 text-xs sm:text-sm"
            >
              icons8.com 
            </a>
          </div>
        </div>
    </div>
    </div>
  );  
}
