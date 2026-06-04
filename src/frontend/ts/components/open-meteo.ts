import { weatherDisplay } from "../templates/weatherDisplay.js";

function getWeatherIconName(code: number): string {
  const iconMap: { [key: number]: string } = {
    0: "sunny.svg", // Clear Sky
    1: "mostly_sunny.svg", // Mainly Clear
    2: "partly_cloudy.svg", // Partly Cloudy
    3: "cloudy.svg", // Overcast
    45: "haze_fog_dust_smoke.svg", // Fog
    48: "haze_fog_dust_smoke.svg", // Fog with Rain
    51: "drizzle.svg", // Light Drizzle
    53: "drizzle.svg", // Moderate Drizzle
    55: "drizzle.svg", // Dense Drizzle
    56: "sleet.svg", // Light Freezing Drizzle
    57: "sleet.svg", // Dense Freezing Drizzle
    61: "drizzle.svg", // Slight Rain
    63: "showers_rain.svg", // Moderate Rain
    65: "heavy_rain.svg", // Heavy Rain
    66: "sleet.svg", // Light Freezing Rain
    67: "sleet.svg", // Heavy Freezing Rain
    71: "flurries.svg", // Slight Snow
    73: "showers_snow.svg", // Moderate Snow
    75: "showers_snow.svg", // Heavy Snow
    77: "heavy_snow.svg", // Snow Grains
    80: "drizzle.svg", // Slight Rain
    81: "showers_rain.svg", // Moderate Rain
    82: "heavy_rain.svg", // Heavy Rain
    85: "snow_showers.svg", // Slight Snow Showers
    86: "snow_showers.svg", // Heavy Snow Showers
    95: "isolated_thunderstorms.svg", // Thunderstorms
    96: "strong_thunderstorms.svg", // Thunderstorm with Risk of Hail
    99: "strong_thunderstorms.svg", // Severe Thunderstorm
  };
  return iconMap[code] || "cloudy.png";
}

export async function showWeather(): Promise<void> {
  const weatherElement = document.getElementById("ourWeather");

  if (!weatherElement) return;

  try {
    // 1. Fetch from YOUR Fastify backend, not the external API
    const response = await fetch("/api/weather");

    // Handle the case where the server just started and cache is empty
    if (!response.ok) {
      weatherElement.innerHTML = "<p>Loading weather...</p>";
      return;
    }

    // 2. Parse the JSON data
    const data = await response.json();

    // 3. Extract the current data (Open-Meteo puts this in 'current')
    const currentTemp = data.current.temperature_2m;
    const lastTime = data.current.time.substring(data.current.time.length - 5);
    const currentWeatherCode = data.current.weather_code;

    var str = JSON.stringify(data, null, 2); // spacing level = 2
    // Source - https://stackoverflow.com/a/7220510
    // Posted by user123444555621, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-06-03, License - CC BY-SA 3.0

    weatherElement.innerHTML = weatherDisplay;

    const currentTempDisplay = document.getElementById("current-temp");
    currentTempDisplay.innerText = currentTemp;

    //const lastTimeDisplay = document.getElementById("update-time");
    //lastTimeDisplay.innerText = str;

    function formatWeatherForecast(data: weatherInput): ProcessedWeather[] {
      const { time, weather_code, temperature_2m_max, temperature_2m_min } =
        data.daily;

      return time.map((dateStr, index) => {
        const dateObj = new Date(`${dateStr}T00:00:00`);
        const dayOfWeek = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
        });

        return {
          date: dateStr,
          dayOfWeek: dayOfWeek,
          weatherCode: weather_code[index],
          maxTemp: temperature_2m_max[index],
          minTemp: temperature_2m_min[index],
        };
      });
    }

    // Resolve and display the weather icon
    const weatherIconDisplay = document.getElementById(
      "weather-icon",
    ) as HTMLImageElement | null;
    if (weatherIconDisplay) {
      const iconFile = getWeatherIconName(currentWeatherCode);
      // Maps path relative to your web server distribution build output
      weatherIconDisplay.src = `/images/icons/weather/${iconFile}`;
    }

    const formattedForecast = formatWeatherForecast(data);
    const todayForecast = formattedForecast.shift();
    let weekForecast = document.getElementById("forecast");

    for (const day of formattedForecast) {
      const forecastWeekday = day.dayOfWeek;
      const forecastCode = day.weatherCode;
      const forecastMin = day.minTemp;
      const forecastMax = day.maxTemp;

      const iconFile = getWeatherIconName(forecastCode);

      const forecastDiv = `
        <div>
        <h2 class="card-title">${forecastWeekday}</h2>
        <div class="my-3">
          <img id="weather-icon" src="/images/icons/weather/${iconFile}" alt="Weather Condition" style="width: 32px; height: 32px;" />
        </div>
        <h2 class="display-8">${forecastMin}/${forecastMax}°F</h2>
        </div>`;

      weekForecast.insertAdjacentHTML("beforeend", forecastDiv);
    }
  } catch (error) {
    console.error("Failed to load weather widget:", error);
    weatherElement.textContent = "Weather unavailable";
  }
}
