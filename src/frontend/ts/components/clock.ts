export function updateClock(): void {
  const dateElement = document.getElementById("ourDate");
  const timeElement = document.getElementById("ourTime");
  const timeDateString = new Date();

  if (!timeElement || !dateElement) return;

  dateElement.textContent = timeDateString.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  timeElement.textContent = timeDateString.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });
}
