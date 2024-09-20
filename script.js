document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('location-form');
    const locationInput = document.getElementById('location-input');
    const weatherInfo = document.getElementById('weather-info');
    const locationName = document.getElementById('location-name');
    const temperature = document.getElementById('temperature');
    const weatherConditions = document.getElementById('weather-conditions');

    const API_KEY = '422d9ec3516a8d7ed2a2444801c09c0a'; // Replace with your OpenWeatherMap API key

    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([51.505, -0.09]).addTo(map);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const location = locationInput.value.trim();
        if (location) {
            fetchWeather(location);
        }
    });

    const fetchWeather = async (location) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`);
            if (!response.ok) {
                throw new Error('Location not found');
            }
            const data = await response.json();
            displayWeather(data);
            updateMap(data.coord.lat, data.coord.lon);
        } catch (error) {
            alert(error.message);
        }
    };

    const displayWeather = (data) => {
        weatherInfo.style.display = 'block';
        locationName.textContent = `${data.name}, ${data.sys.country}`;
        temperature.textContent = `Temperature: ${data.main.temp}°C`;
        weatherConditions.textContent = `Conditions: ${data.weather[0].description}`;
    };

    const updateMap = (lat, lon) => {
        map.setView([lat, lon], 13);
        marker.setLatLng([lat, lon]);
    };

    // Optional: Fetch weather based on user's geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        });
    }

    const fetchWeatherByCoords = async (lat, lon) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            if (!response.ok) {
                throw new Error('Location not found');
            }
            const data = await response.json();
            displayWeather(data);
            updateMap(lat, lon);
        } catch (error) {
            alert(error.message);
        }
    };
});
