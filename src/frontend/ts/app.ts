import { updateClock } from "./components/clock.js";
import { showWeather } from "./components/open-meteo.js";

document.addEventListener("DOMContentLoaded", () => {
  updateClock();
  setInterval(updateClock, 10000);

  showWeather();
  setInterval(showWeather, 3600000);
});
