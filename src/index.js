// src/index.js
const cron = require('node-cron');
const { getWeatherData } = require('./weatherService');
const { insertSummary } = require('./database');
const { sendAlert } = require('./alertService');
const config = require('./config');

let temperatureRecords = {};

const processWeatherData = (data) => {
    const date = new Date(data.dt * 1000).toISOString().split('T')[0];
    const temperature = data.main.temp;
    const condition = data.weather[0].main;

    // Initialize daily record
    if (!temperatureRecords[date]) {
        temperatureRecords[date] = {
            temps: [],
            maxTemp: -Infinity,
            minTemp: Infinity,
            dominantCondition: {}
        };
    }

    temperatureRecords[date].temps.push(temperature);
    temperatureRecords[date].maxTemp = Math.max(temperatureRecords[date].maxTemp, temperature);
    temperatureRecords[date].minTemp = Math.min(temperatureRecords[date].minTemp, temperature);

    // Count condition occurrences
    temperatureRecords[date].dominantCondition[condition] = (temperatureRecords[date].dominantCondition[condition] || 0) + 1;

    // Check alert
    if (temperature > config.alertThreshold) {
        sendAlert(condition, temperature);
    }
};

// Schedule data retrieval
cron.schedule(config.checkInterval, async () => {
    for (const city of config.cities) {
        const weatherData = await getWeatherData(city);
        if (weatherData) {
            processWeatherData(weatherData);
        }
    }

    // Generate daily summary
    for (const date in temperatureRecords) {
        const { temps, maxTemp, minTemp, dominantCondition } = temperatureRecords[date];
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

        const dominantWeatherCondition = Object.keys(dominantCondition).reduce((a, b) => 
            dominantCondition[a] > dominantCondition[b] ? a : b
        );

        insertSummary(date, avgTemp, maxTemp, minTemp, dominantWeatherCondition);
        console.log(`Weather summary for ${date}: Avg Temp: ${avgTemp}, Max Temp: ${maxTemp}, Min Temp: ${minTemp}, Dominant Condition: ${dominantWeatherCondition}`);
    }
});
