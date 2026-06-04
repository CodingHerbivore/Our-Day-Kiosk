import { type FastifyInstance } from "fastify";

// The Open-Meteo URL (pre-configured for your coordinates and requirements)
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=43.1789&longitude=-88.1173&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FChicago";

export default async function weatherRoutes(fastify: FastifyInstance) {
  // 1. The Local Cache
  // This variable lives in your server's RAM.
  let weatherCache: any = null;

  // 2. The Fetch Logic
  // This reaches out to Open-Meteo and updates our cache.
  const updateWeatherCache = async () => {
    try {
      const response = await fetch(WEATHER_URL);
      if (response.ok) {
        weatherCache = await response.json();
        console.log(
          `[Weather Route] Cache updated at ${new Date().toLocaleTimeString()}`,
        );
      } else {
        console.error(
          "[Weather Route] Open-Meteo returned an error:",
          response.status,
        );
      }
    } catch (error) {
      console.error("[Weather Route] Failed to reach Open-Meteo:", error);
    }
  };

  // 3. The Timer
  // Fetch immediately when the server starts up...
  updateWeatherCache();
  // ...and then fetch again every 2 hours (2 hrs * 60 mins * 60 secs * 1000 ms)
  setInterval(updateWeatherCache, 900000);

  // 4. The API Endpoint
  // This is what your frontend fetch() calls: http://localhost/api/weather
  fastify.get("/api/weather", async (request, reply) => {
    // If the cache is empty (e.g., server just started and is still fetching)
    if (!weatherCache) {
      return reply
        .status(503)
        .send({ error: "Weather data is currently loading" });
    }

    // Instantly return the cached JSON to the
    return weatherCache;
  });
}
