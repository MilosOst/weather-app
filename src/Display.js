import { getData } from "./weatherApi.js";

export default class Display {
    
    static async loadPage(city, secondary='') {
        try {
            const fullData = await getData(city, secondary);

            this.clearInputs();
            this.loadMainInfo(fullData.todayMain);
            this.loadHourlyForecast(fullData.hourlyData);
            this.loadDailyForecast(fullData.dailyData);
            this.initButtons();
        }
        catch (e) {
            Display.showError();
        }

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

    static loadHourlyForecast(data) {
        const forecastSection = document.querySelector('.forecast-hourly');
        forecastSection.textContent = '';

        data.forEach(entry => {
            forecastSection.appendChild(this.createHourlyForecastEntry(entry));
        });
    }

    static loadDailyForecast(data) {
        const forecastSection = document.querySelector('.forecast-daily');
        forecastSection.textContent = '';

        data.forEach(entry => {
            forecastSection.appendChild(this.createDailyForecastEntry(entry));
        });
    }

    static initButtons() {
        const forecastHourly = document.querySelector('.forecast-hourly');
        const forecastDaily = document.querySelector('.forecast-daily');

        // Allow for horizontal scrolling with mouse wheel
        forecastHourly.addEventListener('wheel', e => {
            e.preventDefault();
            forecastHourly.scrollLeft += e.deltaY;
        });

        forecastDaily.addEventListener('wheel', e => {
            e.preventDefault();
            forecastDaily.scrollLeft += e.deltaY;
        });


        const toggleModeBtns = document.querySelectorAll('.option-select');
        toggleModeBtns.forEach(btn => {
            btn.addEventListener('click', this.switchForecastMode);
        });

        const searchBar = document.querySelector('.search-box');
        searchBar.onsubmit = this.validateSearch;
    }

    static createHourlyForecastEntry(entry) {
        const forecastEntry = document.createElement('div');
        forecastEntry.classList.add('forecast-entry');
        forecastEntry.innerHTML = `
        <p class='time'>${entry.time}</p>
        <img src='${entry.icon}' class='forecast-img'>
        <p class='forecast-temp'>${entry.temp}°</p>
        `;

        return forecastEntry;
    }

    static createDailyForecastEntry(entry) {
        const forecastEntry = document.createElement('div');
        forecastEntry.classList.add('forecast-entry');
        forecastEntry.innerHTML = `
        <p class='time'>${entry.day}</p>
        <img src='${entry.icon}' class='forecast-img'>
        <p class='forecast-temp'>${entry.tempMax}°</p>
        <p class='forecast-low'>${entry.tempMin}°</p>
        `;

        return forecastEntry;
    }

    static switchForecastMode(e) {
        if (e.target.classList.contains('selected')) return;

        document.querySelector('.forecast-daily').classList.toggle('active');
        document.querySelector('.forecast-hourly').classList.toggle('active');
        document.querySelector('#hour-select').classList.toggle('selected');
        document.querySelector('#daily-select').classList.toggle('selected');
    }

    static async validateSearch(e) {
        e.preventDefault();
        const searchInput = document.querySelector('#location-search').value;
        let city = searchInput;
        let secondary;
        
        // Check if State/Country provided
        if (searchInput.includes(',')) {
            city = searchInput.split(',')[0];
            secondary = searchInput.split(',')[1];
        }
        else {
            secondary = '';
        }

        // Try and find data with provided information
        Display.loadPage(city, secondary);
    }

    static clearInputs() {
        document.querySelector('.error').textContent = '';
        document.querySelector('.search-box').reset();
    }

    static showError() {
        const error = document.querySelector('.error');
        error.innerHTML = 'Location not found.<br>Search must be in the form: "City", "City, State", or "City, Country"';
    }


}