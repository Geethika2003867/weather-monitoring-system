// src/weatherService.js
const axios = require('axios');
const config = require('./config');

async function getWeatherData(city) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.API_KEY}&units=metric`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for ${city}:`, error);
        return null;
    }
}

module.exports = { getWeatherData };
