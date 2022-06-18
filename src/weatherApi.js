const apiKey = '558e6998c7d958821a0225b854f5e43b';

function convertDate(date, timezone) {
    return new Date(date + (timezone + 14400) * 1000);
}

function formatTime(time) {
    return time.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric'});
}

async function getCityCoordinates(city, stateOrCountry='') {
    try {
        const request = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateOrCountry}&limit=1&appid=${apiKey}`);
        const info = await request.json();

        const longitude = info[0].lon;
        const latitude = info[0].lat;
        const name = info[0].name;
        
        return { longitude, latitude, name }
    }
    catch (error) {
        return;
    }
}

async function getTodayData(longitude, latitude) {
    const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    const data = await request.json();

    return data;
}

async function get5DayData(longitude, latitude) {
    const request = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`, { mode: 'cors' });
    const data = await request.json();

    return data;
}

async function filterTodayData(data, cityName) {
    const date = convertDate(new Date().getTime(), data.timezone);
    const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
    return {
        city: cityName,
        country: regionNames.of(data.sys.country),
        weatherDesc: data.weather[0].description,
        currDate: date.toDateString(),
        currTime: formatTime(date),
        currTemp: (data.main.temp - 273.15).toFixed(1),
        wind: (data.wind.speed * 3.6).toFixed(1),
        feels_like: (data.main.feels_like - 273.15).toFixed(1),
        sunrise: formatTime(convertDate(data.sys.sunrise*1000, data.timezone)),
        sunset: formatTime(convertDate(data.sys.sunset*1000, data.timezone)),
        icon: `./imgs/weather-icons/${data.weather[0].icon}.svg`,
    };
}

async function filter5DayData(data) {
    const dayOne = data.slice(0, 8);
    const dayTwo = data.slice(8, 16);
    const dayThree = data.slice(16, 24);
    const dayFour = data.slice(24, 32);
    const dayFive = data.slice(32, 40);

    return { dayOne, dayTwo, dayThree, dayFour, dayFive};
}

async function getData(city, stateOrCountry='') {
    try {
        const coordinates = await getCityCoordinates(city, stateOrCountry='');
        const longitude = coordinates.longitude;
        const latitude = coordinates.latitude;
        const cityName = coordinates.name;


        const todayData = await getTodayData(longitude, latitude);
        const fiveDayData = await get5DayData(longitude, latitude)
        console.log(todayData);


        const todayDataFiltered = await filterTodayData(todayData, cityName);
        const fiveDayFiltered = await filter5DayData(fiveDayData.list);
        console.log(todayDataFiltered);
        console.log(fiveDayFiltered);

        return {
            todayMain: todayDataFiltered,
            fiveDay: fiveDayFiltered,
        }
    }
    catch (e) {
        console.log('Location not found.\n\Search must be in the form: "City", "City, State", or "City, Country"');
    }

}


export {
    getData
}