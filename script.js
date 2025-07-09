const API_KEY = "ecfd37a8264acb9a97ff6090c8c6ccce"; // Replace this with your OpenWeatherMap API key
const form = document.getElementById('destination-form');
const wishlistContainer = document.getElementById('wishlist-container');
const alertArea = document.getElementById('alert-area');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const city = document.getElementById('city-input').value.trim();
  const country = document.getElementById('country-input').value.trim();
  const note = document.getElementById('note-input').value.trim();

  if (!city) return alert("Please enter a city.");

  const weather = await fetchWeather(city);
  if (!weather) return;

  addCardToUI({ city, country, note, weather });

  form.reset();
});

async function fetchWeather(city) {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    const temp = data.main.temp;
    const condition = data.weather[0].description;

    // Optional callback alert
    if (temp < 10) showColdAlert(city, temp);

    return { temp, condition };

  } catch (err) {
    alert("Error fetching weather data.");
    return null;
  }
}

function addCardToUI({ city, country, note, weather }) {
  const card = document.createElement('div');
  card.className = 'destination-card';
  card.innerHTML = `
    <h3 class= "destination-name">${city}${country ? `, ${country}` : ''}</h3>
    <p class= "destination-note">${note}</p>
    <p class = "destination-weather">🌡️ ${weather.temp}°C</p>
    <p class= "weather-condition">🌤️ ${weather.condition}</p>
    <button class="remove-btn">Remove</button>
  `;

  card.querySelector('.remove-btn').addEventListener('click', () => {
    card.remove();
  });

  wishlistContainer.appendChild(card);
}

function showColdAlert(city, temp) {
  alertArea.textContent = `⚠️ ${city} is quite cold right now (${temp}°C). Pack warm!`;
  setTimeout(() => alertArea.textContent = '', 5000);
}
