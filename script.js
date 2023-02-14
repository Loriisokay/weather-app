
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like')
let city = document.getElementById('city');
const time = document.getElementById('time');
const date = document.getElementById('date');
const conditions = document.getElementById('conditions');
const conditionIcon = document.getElementById('condition-icon');
const wind = document.getElementById('wind');
const humidit = document.getElementById('humidity');
const uvLevel = document.getElementById('uv');
const weatherAPIdomain = 'api.weatherapi.com';
const submit = document.querySelector('#submit-location');
const APIkey = '87bc90756d4c427eb5f93920231202';
const dataFromAPI = {};
let loc = "Almaty";


function getCityFromInput() { // get API data for input cities
    submit.addEventListener('click', function () {
        let cityFromInput = document.getElementById('city-input');
        const data = document.querySelector('#city-input').value.trim().toLowerCase();
        const cityInput = data.charAt(0).toUpperCase() + data.slice(1);
        cityFromInput.value = '';
        loc = cityInput;
        getWeatherData(weatherAPIdomain, APIkey, loc);
    })
};


function getPinnedCity() { //get API data for pinned cities
    const pinnedCitites = document.querySelectorAll('li');
    pinnedCitites.forEach(function (pinnedCitites) {
        pinnedCitites.addEventListener('click', function () {
            loc = pinnedCitites.dataset.city;
            getWeatherData(getWeatherData(weatherAPIdomain, APIkey, loc));
        })
    })
}


async function getWeatherData(domain, key, place) { // get API data
    try {
        const response = await fetch(`http://${domain}/v1/current.json?key=${key}&q=${place}&aqi=yes`, {
            method: 'GET',
            headers: {
                'accept': 'application/dns-json'
            }
        })
        const respObj = await response.json();
        changeData(respObj);

    } catch (error) {
        console.log(error);
    }
}

function dayNight(int) {
    let dayAndNight = 'day';
    if (int > 7 && int < 19) {
        dayAndNight = 'day';
    } else {
        dayAndNight = 'night';
    }
    return dayAndNight;
}


function changeData(obj) {
    //get variables from API response object
    const { condition,  feelslike_c, humidity, temp_c, uv, wind_kph } = obj.current;
    const localtime = obj.location.localtime;

    //set city
    city.innerText = loc;

    //set temperature
    temperature.innerText = Math.round(temp_c) + '°';
    feelsLike.innerText = 'feels like ' + Math.round(feelslike_c) + '°';

    //set date&time
    dateAndTime = localtime.split(' ');
    time.innerText = dateAndTime[1];
    const currentDate = new Date(dateAndTime);
    const weekDayOptions = { weekday : 'long' };
    const monthOptions = { month : 'short' }
    const weekDay = new Intl.DateTimeFormat("en-US", weekDayOptions).format(currentDate); 
    const day = currentDate.getDate();
    const month = new Intl.DateTimeFormat("en-US", monthOptions).format(currentDate);
    const year = currentDate.getFullYear();
    date.innerText = "- " + weekDay + ", " + day + " " + month + " " + year;

    //set conditions
    conditions.innerText = condition.text;
    const hour = parseInt(dateAndTime[1].split(':'));
    
    
    //set icons and background 

    const conditionsList = parsed;
    conditionsList.forEach((code) => {
        console.log(code.day);
    })


    //set wind, uv and humidity
    wind.innerText = Math.round(wind_kph) + ' kph';
    uvLevel.innerText = uv;
    humidit.innerText = humidity + '%';
}


getWeatherData(weatherAPIdomain, APIkey, loc);
getCityFromInput();
getPinnedCity();


