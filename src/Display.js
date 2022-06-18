import { getData } from "./weatherApi.js";

export default class Display {
    
    static async loadPage(city, secondary='') {
        const fullData = await getData(city, secondary);

        this.loadMainInfo(fullData.todayMain);
    }

    static loadMainInfo(data) {
        document.querySelector('#today-img').src = data.icon;
        document.querySelector('#location').textContent = `${data.city}, ${data.country}`;
        document.querySelector('#weather-type').textContent = data.weatherDesc;
        document.querySelector('#curr-date').textContent = data.currDate;
        document.querySelector('#curr-time').textContent = data.currTime;
        document.querySelector('#today-temp').textContent = data.currTemp + '°';
        document.querySelector('#wind-speed').textContent = data.wind + 'km/h';
        document.querySelector('#feels-like').textContent = data.feels_like + '°';
        document.querySelector('#sunrise').textContent = data.sunrise;
        document.querySelector('#sunset').textContent = data.sunset;
    }


}