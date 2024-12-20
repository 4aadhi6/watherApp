import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const divstyle = {
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100%",
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=3df6767b8eb4d3efc840514967f01f67`
            );
            setWeatherData(response.data);
            setLoading(false);
          } catch (err) {
            setError("Failed to fetch weather data");
            setLoading(false);
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setError("Please enable location services to get weather data.");
            setLoading(false);
          } else {
            setError("Failed to retrieve location.");
            setLoading(false);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      setError("Geolocation is not available in your browser.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <>
      <div style={divstyle} className="container">
        <div className="home-container">
          <div className="main-container">
            <div className="card">
              <h1>{weatherData.name}</h1>
              <h2>{weatherData.weather[0].main}</h2>
              <p>{weatherData.weather[0].description}</p>
              <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
