const apiKey = process.env.API_KEY;

async function getCityCoordinates(city, stateOrCountry='') {
    try {
        const request = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateOrCountry}&limit=1&appid=${apiKey}`);
        const info = await request.json();

        const longitude = info[0].lon;
        const latitude = info[0].lat;
        
        return { longitude, latitude }
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
    const request = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`, {mode: 'cors'});
    const data = await request.json();

    return data;
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


        const todayData = await getTodayData(longitude, latitude);
        const fiveDayData = await get5DayData(longitude, latitude)

        console.log(todayData.weather);
        console.log(fiveDayData);

        const fiveDayFiltered = await filter5DayData(fiveDayData.list);
        console.log(fiveDayFiltered);
    }
    catch (e) {
        console.log('Location not found.\n\Search must be in the form: "City", "City, State", or "City, Country"');
    }

}


export {
    getData
}