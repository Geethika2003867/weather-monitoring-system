// __tests__/weatherService.test.js
const { getWeatherData } = require('../src/weatherService');

test('fetch weather data', async () => {
    const data = await getWeatherData('Delhi');
    expect(data).toHaveProperty('main');
});
