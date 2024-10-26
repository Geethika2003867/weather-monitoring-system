// src/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./weather.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS weather_summary (date TEXT, avg_temp REAL, max_temp REAL, min_temp REAL, dominant_condition TEXT)");
});

function insertSummary(date, avgTemp, maxTemp, minTemp, condition) {
    db.run("INSERT INTO weather_summary VALUES (?, ?, ?, ?, ?)", [date, avgTemp, maxTemp, minTemp, condition]);
}

module.exports = { insertSummary };
