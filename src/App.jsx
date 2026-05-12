import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaWind,
  FaTint,
  FaTemperatureHigh,
  FaCloud,
} from "react-icons/fa";

function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = "d73f72b45ffd81505eb2b6c50244ca1e";

  const getWeather = async (cityName) => {

    if (!cityName) return;

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );

      const weatherData = await response.json();

      if (weatherData.cod != 200) {
        setError("City not found");
        setWeather(null);
        setLoading(false);
        return;
      }

      setWeather(weatherData);
      setLoading(false);

    } catch (err) {

      setError("Couldn't fetch weather");
      setLoading(false);

    }

  };

  // Current Location Weather
  const getCurrentLocationWeather = () => {

    navigator.geolocation.getCurrentPosition(async (position) => {

      try {

        setLoading(true);
        setError("");

        const { latitude, longitude } = position.coords;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        const weatherData = await response.json();

        if (weatherData.cod == 200) {
          setWeather(weatherData);
        }

        setLoading(false);

      } catch (err) {

        setError("Location access failed");
        setLoading(false);

      }

    });

  };

  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  return (

    <div className="h-screen bg-black flex items-center justify-center relative overflow-hidden px-4">

      {/* Background Glow */}
      <div className="absolute inset-0">

        <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-cyan-500 opacity-20 blur-[100px] rounded-full"></div>

        <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-purple-500 opacity-20 blur-[100px] rounded-full"></div>

      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 text-white shadow-2xl"
      >

        {/* App Name */}
        <h1 className="text-3xl font-bold text-center mb-6">
          SkyCast
        </h1>

        {/* Search */}
        <div className="flex gap-2 mb-5">

          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather(city)}
            className="flex-1 bg-[#1f1f22] px-5 py-3 rounded-2xl outline-none text-white placeholder:text-gray-400"
          />

          <button
            onClick={() => getWeather(city)}
            className="bg-cyan-400 hover:bg-cyan-300 transition w-14 rounded-2xl flex items-center justify-center text-black text-lg"
          >
            <FaSearch />
          </button>

        </div>

        {/* Current Location Button */}
        <button
          onClick={getCurrentLocationWeather}
          className="w-full bg-white/10 hover:bg-white/20 transition py-3 rounded-2xl mb-5 text-sm"
        >
          📍 Use Current Location
        </button>

        {/* Loading */}
        {loading && (

          <div className="text-center py-6">

            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-3 text-gray-300">
              Fetching weather...
            </p>

          </div>

        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-400 mb-4">
            {error}
          </p>
        )}

        {/* Weather UI */}
        {weather && weather.main && !loading && (

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >

            {/* City */}
            <div className="text-center">

              <h2 className="text-3xl font-semibold">
                {weather.name}
              </h2>

              <p className="text-gray-300 capitalize mt-1">
                {weather.weather[0].description}
              </p>

            </div>

            {/* Weather Icon */}
            <motion.img
              animate={{ y: [0, -5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
              }}
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt="weather icon"
              className="w-24 mx-auto"
            />

            {/* Temperature */}
            <h1 className="text-center text-6xl font-bold mb-5">
              {Math.round(weather.main.temp)}°
            </h1>

            {/* Weather Stats */}
            <div className="grid grid-cols-2 gap-3">

              <div className="bg-[#1f1f22] p-4 rounded-2xl text-center">

                <FaTint className="mx-auto text-cyan-300 text-lg mb-2" />

                <p className="text-gray-400 text-sm">
                  Humidity
                </p>

                <h3 className="text-2xl font-bold">
                  {weather.main.humidity}%
                </h3>

              </div>

              <div className="bg-[#1f1f22] p-4 rounded-2xl text-center">

                <FaWind className="mx-auto text-cyan-300 text-lg mb-2" />

                <p className="text-gray-400 text-sm">
                  Wind
                </p>

                <h3 className="text-2xl font-bold">
                  {weather.wind.speed} km/h
                </h3>

              </div>

              <div className="bg-[#1f1f22] p-4 rounded-2xl text-center">

                <FaTemperatureHigh className="mx-auto text-cyan-300 text-lg mb-2" />

                <p className="text-gray-400 text-sm">
                  Feels Like
                </p>

                <h3 className="text-2xl font-bold">
                  {Math.round(weather.main.feels_like)}°
                </h3>

              </div>

              <div className="bg-[#1f1f22] p-4 rounded-2xl text-center">

                <FaCloud className="mx-auto text-cyan-300 text-lg mb-2" />

                <p className="text-gray-400 text-sm">
                  Clouds
                </p>

                <h3 className="text-2xl font-bold">
                  {weather.clouds.all}%
                </h3>

              </div>

            </div>

          </motion.div>

        )}

      </motion.div>

    </div>

  );

}

export default App;

