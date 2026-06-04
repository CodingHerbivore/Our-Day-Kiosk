export const weatherDisplay = `
  <div class="card text-center">
    <div class="card-body">
      <div>
        <h2 class="card-title">Now</h2>
        <div class="my-3">
          <img class="weather-icon" src="" alt="Weather Condition" style="width: 64px; height: 64px;" />
        </div>
        <h2 class="display-6"><span id="current-temp">{{current_temp}}</span>°F</h2>
      </div>
      <div>
        <ul>
        </ul>
      </div>
      <div id="forecast">
      </div>
      <p class="text-muted small mb-0">Last Updated: <span id="update-time">{{last_updated}}</span></p>
    </div>
  </div>
`;
