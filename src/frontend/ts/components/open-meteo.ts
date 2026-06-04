export async function showWeather(): Promise<void> {
  const weatherElement = document.getElementById("ourWeather");

  if (!weatherElement) return;

  try {
    // 1. Fetch from YOUR Fastify backend, not the external API
    const response = await fetch("/api/weather");

    // Handle the case where the server just started and cache is empty
    if (!response.ok) {
      weatherElement.textContent = "Loading weather...";
      return;
    }

    // 2. Parse the JSON data
    const data = await response.json();

    // 3. Extract the current data (Open-Meteo puts this in 'current')
    const currentTemp = data.current.temperature_2m;
    let lastTime = data.current.time;
    lastTime = lastTime.substring(lastTime.length - 5);

    // 4. Update the DOM
    // Note: You'll eventually want to use innerHTML here to inject Bootstrap cards/grids
    let weatherCard = document.createElement("div");
    weatherCard.classList.add("card");

    var str = JSON.stringify(data, null, 2); // spacing level = 2
    // Source - https://stackoverflow.com/a/7220510
    // Posted by user123444555621, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-06-03, License - CC BY-SA 3.0

    let temperature = document.createElement("p");
    temperature.classList.add("text-center", "display-5");
    //temperature.textContent = str;
    temperature.textContent = lastTime;
    //temperature.textContent = `${currentTemp}°F`;

    weatherCard.appendChild(temperature);
    weatherElement.appendChild(weatherCard);
    // -- FUTURE LOGIC GOES HERE --
    // Extract the 5-day forecast from data.daily
    // Extract the 6-hour forecast from data.hourly
  } catch (error) {
    console.error("Failed to load weather widget:", error);
    weatherElement.textContent = "Weather unavailable";
  }
}
