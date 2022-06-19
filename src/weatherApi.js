const apiKey = '558e6998c7d958821a0225b854f5e43b';

function convertDate(date, timezone) {
    return new Date(date + (timezone + 14400) * 1000);
}

function formatTime(time) {
    return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
}

async function getCityCoordinates(city, stateOrCountry = '') {
    try {
        const request = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${stateOrCountry}&limit=1&appid=${apiKey}`);
        const info = await request.json();
        const [longitude, latitude, name] = [info[0].lon, info[0].lat, info[0].name];

        return { longitude, latitude, name };
    } catch (error) {
        return null;
    }
}

async function getTodayData(longitude, latitude) {
    const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    const data = await request.json();

    return data;
}

async function getForecastData(longitude, latitude) {
    const request = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=&appid=${apiKey}`);
    const data = await request.json();

    return data;
}

function filterTodayData(data, cityName) {
    const date = convertDate(new Date().getTime(), data.timezone);
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return {
        city: cityName,
        country: regionNames.of(data.sys.country),
        weatherDesc: data.weather[0].description,
        currDate: date.toDateString(),
        currTime: formatTime(date),
        currTemp: (data.main.temp - 273.15).toFixed(1),
        wind: (data.wind.speed * 3.6).toFixed(1),
        feels_like: (data.main.feels_like - 273.15).toFixed(1),
        sunrise: formatTime(convertDate(data.sys.sunrise * 1000, data.timezone)),
        sunset: formatTime(convertDate(data.sys.sunset * 1000, data.timezone)),
        icon: `./imgs/weather-icons/${data.weather[0].icon}.svg`,
    };
}

function filterHourlyData(data) {
    const hourlyData = data.hourly.slice(0, 25);
    const hourlyEntries = [];
    hourlyData.forEach((hourData) => {
        hourlyEntries.push(
            {
                time: convertDate(hourData.dt * 1000, data.timezone_offset).toLocaleTimeString('en-US', { hour: 'numeric' }),
                icon: `./imgs/weather-icons/${hourData.weather[0].icon}.svg`,
                temp: (hourData.temp - 273.15).toFixed(1),
            },
        );
    });
    return hourlyEntries;
}

function filterDailyData(data) {
    const dailyData = data.daily.slice(1);
    const dailyEntries = [];
    dailyData.forEach((day) => {
        dailyEntries.push({
            day: convertDate(day.dt * 1000, data.timezone_offset).toLocaleDateString('en-US', { weekday: 'long' }),
            icon: `./imgs/weather-icons/${day.weather[0].icon}.svg`,
            tempMin: (day.temp.min - 273.15).toFixed(),
            tempMax: (day.temp.max - 273.15).toFixed(),
        });
    });
    return dailyEntries;
}

async function getData(city, stateOrCountry = '') {
    try {
        const coordinates = await getCityCoordinates(city, stateOrCountry);
        const [longitude, latitude] = [coordinates.longitude, coordinates.latitude];
        const cityName = coordinates.name;

        const todayData = await getTodayData(longitude, latitude);
        const forecastData = await getForecastData(longitude, latitude);

        const todayDataFiltered = filterTodayData(todayData, cityName);
        const hourlyDataFiltered = filterHourlyData(forecastData);
        const dailyDataFiltered = filterDailyData(forecastData);

        return {
            todayMain: todayDataFiltered,
            hourlyData: hourlyDataFiltered,
            dailyData: dailyDataFiltered,
        };
    } catch (e) {
        return null;
    }
}

export {
    getData,
};
