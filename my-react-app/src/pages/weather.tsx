'use client';
import React from "react"
import {useEffect, useState} from "react";
import bgImg from "../assets/bg.png"; //background image
import Input from "../components/ui/input"; //custom input component
import Button from "../components/ui/button"; //custom button component
import humid from "../assets/humidity.png"; //humidity icon
import wind from "../assets/wind-energy.png" //wind icon
import { Spinner, type SpinnerProps } from '@/components/ui/shadcn-io/spinner';


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

  // -------- Fetch by city name --------
  async function fetchWeather(name) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`; //link where i get my weather data
    const response = await fetch(apiUrl);// fetching my weather data and storing it inside a variable called response

    if (!response.ok) { //if response is not ok (grabbed nothing)
      if (response.status === 404) { //if response returns nothing/ isnt found
        throw new Error("No data for recorded for city")}; // throw an error: No data for recorded for city
      
    }
    return response.json(); //if data was fetched successfully, return it (converted to json format)
  }
  //in the above fetchWeather function, i am gettin weather information based on the city name



  async function fetchWeatherForecast(name) {  //fetching the weather forecast
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${apiKey}&units=metric`; //link where i get my forecast data
    const response = await fetch(apiUrl);// fetching my weather data and storing it inside a variable called response

    if (!response.ok) { //if response is not ok (grabbed nothing)
      if (response.status === 404)  //if response returns nothing/ isnt found
        throw new Error("Forecast not recorded for city"); // throw an error: No data for recorded for city

    }
    return response.json(); //if data was fetched successfully, return it (converted to json format)
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

      setWeather(data); //set weather state
      setForecast(forecastData) //set forecast state
      setError(null); //clear error
      notification(data); //send notification
    } catch (err) {
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
    <div
      className="w-screen min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImg})` }} //set background
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Main container */}
        <div className="flex flex-col sm:flex-row gap-4 bg-transparent/50 p-4 rounded-lg w-full max-w-4xl">
          {/* Search div */}
          <div className="bg-black/30 p-4 rounded-lg w-full sm:w-80 h-40 sm:h-53 shadow-lg shadow-white/10 mt-20 sm:mt-30">
              
              <div className="flex gap-1">
                <Input 
                type="text" //input type text
                placeholder="Enter city name" //placeholder
                value={searchValue} //bind state
                onChange={(e) =>setSearchValue(e.target.value)} //update on typing
                className="sm:w-30 shadow-lg bg-black/20 text-white font-medium"/>
                <Button 
                onClick={handleSearch} //when clicked call handleSearch
                className="bg-black/20">search</Button>
              </div>
              <h3 className="text-center text-white font-medium mt-2">Previous Searches</h3>
              <hr></hr>
              <ul className="text-center text-white font-medium mt-3 mb-2 space-y-1">
              {queries.slice(-4).map((q, i) => ( //loop through last 4 queries
                <li key={i} onClick={handleSearch} className="text-sm">
                  {q} {/* show query text */}
                </li>
              ))}
            </ul>
          </div>
  
          {/* Inside container */}
          <div className="bg-black/30 p-4 rounded-lg w-full sm:flex-1 h-auto sm:h-[450px] flex flex-col sm:flex-row items-start justify-start shadow-lg shadow-white/10 gap-3">
            {/* Left inner div */}
            <div className="grid">
            <div className="bg-white/30 p-4 rounded-lg w-full sm:w-48 h-40 sm:h-43 shadow-lg shadow-black/30">
            {weather ? ( //if weather data available show it
                <div className="flex flex-col items-center">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} //weather icon
                    alt={weather.weather[0].description}
                    className="w-20 h-20 mb-2"
                  />
                  <h1 className="font-medium text-center text-base text-white font-serif">{weather.name}</h1> {/* city name */}
                  <h1 className="font-bold text-center text-white text-xl ">{Math.floor(weather.main.temp)}°C/{Math.floor(weather.main.temp*(9/5)+32)}°F</h1> {/* temp in celsius and fahrenheit */}
                </div>
            ):(
              <p className="items-center sm:mt-10 sm:ml-10"><Spinner variant="infinite" className="text-black" size={64}/></p> //if taking too long show loading(need animation)
            )}
            </div>
            <div className="bg-white/40 p-4 rounded-lg w-full sm:w-48 h-40 sm:h-59 shadow-lg shadow-black/30 mt-3">
            {weather && (
                  <div className="text-white text-sm items-center justify-center ml-2">
                    <h2 className="text-center font-medium text-lg">Humidity: {weather.main.humidity}%</h2> {/*humidity*/}
                    <img className="h-13 m-2 mb-3 ml-12" src={humid} alt="humidity"/>
                    <hr></hr>
                    <h2 className="text-center font-medium text-lg mt-2">Wind: {weather.wind.speed} m/s</h2> {/*wind speed*/}
                    <img className="h-13 m-2 mb-3 ml-12" src={wind} alt="humidity"/>
                  </div>
                )}

            </div>
            </div>
            
  
            {/* Right inner divs container */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              {/* Top right div */}
              
              <div className="bg-white/40 rounded-lg w-full sm:w-122 h-20 sm:h-30 shadow-lg shadow-black/30">
                  <iframe
                    className="w-full h-full p-5 bg-white/100 rounded-lg "
                    src="https://open.spotify.com/embed/track/156LzfvMNKuXuiot4uzhGD?utm_source=generator" //a drake song nyana!!
                    //frameBorder="0" // --this one says deprecated, i dont know whatit means but it doesnt work so i commented it out
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
              </div>

              {/* Hour divs container */}
              <div className="flex flex-wrap gap-3">
                {forecast
                  ? forecast.list.slice(0, 4).map((hour, index) => ( //first 4 forecast entries
                      <div
                        key={index}
                        className="bg-white/40 p-4 rounded-lg w-full sm:w-28 h-32 shadow-lg shadow-black/30 flex flex-col items-center justify-center"
                      >
                        <p className="text-md text-white font-bold">
                          {new Date(hour.dt_txt).getHours()}:02 {/*one past 😂*/}
                        </p>
                        <img
                          src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                          alt="hourly icon"
                          className="w-13 h-13"
                        />
                        <p className="text-md text-white font-bold">{Math.round(hour.main.temp)}°C</p> {/*hourly temp*/}
                      </div>
                    ))
                  : ( //placeholder if no forecast
                    <>
                    <p className="items-center sm:mt-10 sm:ml-10"><Spinner variant="infinite" className="text-black" size={64}/></p> {/*if taking too long show loading(need animation)*/}
                    <p className="items-center sm:mt-10 sm:ml-10"><Spinner variant="infinite" className="text-black" size={64}/></p> {/*if taking too long show loading(need animation)*/}
                    <p className="items-center sm:mt-10 sm:ml-10"><Spinner variant="infinite" className="text-black" size={64}/></p> {/*if taking too long show loading(need animation)*/}
                    <p className="items-center sm:mt-10 sm:ml-10"><Spinner variant="infinite" className="text-black" size={64}/></p> {/*if taking too long show loading(need animation)*/}

                    </>
                    )}
              </div>
  
              {/* Day divs container */}
              <div className="flex flex-wrap gap-3">
                
              {dayForecast().length > 0 
                  ? dayForecast().map((day, index) => ( //map through daily forecast
                      <div key={index} className="bg-white/40 p-4 rounded-lg w-full sm:w-28 h-36 sm:h-34 shadow-lg shadow-black/30 mt-3 flex flex-col items-center justify-center">
                        <p className="text-lg font-bold text-white">
                          {new Date(day.dt_txt).toLocaleDateString('en', { weekday: 'short' })} {/*day name*/}
                        </p>
                        <img
                          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                          alt="daily icon"
                          className="w-15 h-15"
                        />
                        <p className="text-white text-lg font-bold">{Math.round(day.main.temp)}°C</p> {/*daily temp*/}
                      </div>
                    ))
                  : ( //placeholder if no forecast
                    <>
                    <p className="items-center sm:mt-10 sm:ml-10"><Spinner variant="infinite" className="text-black" size={64}/></p> {/*if taking too long show loading(need animation)*/}
                    <p className="items-center sm:mt-10 sm:ml-10"><Spinner variant="infinite" className="text-black" size={64}/></p> {/*if taking too long show loading(need animation)*/}
                    <p className="items-center sm:mt-10 sm:ml-10"><Spinner variant="infinite" className="text-black" size={64}/></p> {/*if taking too long show loading(need animation)*/}
                    <p className="items-center sm:mt-10 sm:ml-10"><Spinner variant="infinite" className="text-black" size={64}/></p> {/*if taking too long show loading(need animation)*/}

                    </>
                    )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );  
}
