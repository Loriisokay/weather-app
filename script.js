
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
        let cityInput = "Almaty";
        cityInput = data.charAt(0).toUpperCase() + data.slice(1);
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
            getWeatherData(weatherAPIdomain, APIkey, loc);
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


function getDayNight(int) {
    let dayAndNight = 'day';
    if (int > 7 && int < 19) {
        dayAndNight = 'day';
    } else {
        dayAndNight = 'night';
    }
    return dayAndNight;
}


function changeData(object) {
    //get variables from API response object
    const { condition, feelslike_c, humidity, temp_c, uv, wind_kph } = object.current;
    const localtime = object.location.localtime;

    //set city
    city.innerText = object.location.name;

    //set temperature
    temperature.innerText = Math.round(temp_c) + '°';
    feelsLike.innerText = 'feels like ' + Math.round(feelslike_c) + '°';

    //set date&time
    dateAndTime = localtime.split(' ');
    time.innerText = dateAndTime[1];
    const currentDate = new Date(dateAndTime);
    const weekDayOptions = { weekday: 'long' };
    const monthOptions = { month: 'short' }
    const weekDay = new Intl.DateTimeFormat("en-US", weekDayOptions).format(currentDate);
    const day = currentDate.getDate();
    const month = new Intl.DateTimeFormat("en-US", monthOptions).format(currentDate);
    const year = currentDate.getFullYear();
    date.innerText = "- " + weekDay + ", " + day + " " + month + " " + year;
    const hour = parseInt(dateAndTime[1].split(":"));

    //set conditions
    conditions.innerText = condition.text;

    //set wind, uv and humidity
    wind.innerText = Math.round(wind_kph) + ' kph';
    uvLevel.innerText = uv;
    humidit.innerText = humidity + '%';

    //set background & icons
    let background = 'clear';
    const dayTime = getDayNight(hour);
    const conditionCode = object.current.condition.code;
    let icon = 113;

    if (dayTime == 'night') {
        submit.style.backgroundColor = '#219ebc';
    } else {
        submit.style.backgroundColor = '#fb8500';
    }

    //set icon
    parsed.forEach((element) => {
        if (element.code == conditionCode) {
            icon = element.icon;
            conditionIcon.src = `/img/icons/${dayTime}/${icon}.png`;
        }
    })

    //set background 
    switch (conditionCode) {
        case 1000:
            background = 'clear';
            break;
        case 1006:
        case 1009:
            background = 'cloudy';
            break;
        case 1003:
            background = 'partly_cloudy';
            break;
        case 1030:
        case 1135:
        case 1147:
            background = 'mist';
            break;
        case 1063:
        case 1087:
        case 1180:
        case 1186:
        case 1192:
        case 1243:
        case 1246:
        case 1240:
        case 1273:
            background = 'sun_with_rain';
            break;
        case 1066:
        case 1069:
        case 1210:
        case 1216:
        case 1222:
        case 1249:
        case 1265:
        case 1255:
        case 1258:
        case 1261:
        case 1264:
        case 1279:
            background = 'sun_with_snow';
            break;
        case 1072:
        case 1150:
        case 1153:
        case 1168:
        case 1171:
        case 1183:
        case 1189:
        case 1195:
        case 1198:
        case 1201:
        case 1276:
            background = 'raining';
            break;
        case 1114:
        case 1117:
        case 1204:
        case 1207:
        case 1213:
        case 1219:
        case 1225:
        case 1237:
        case 1252:
        case 1282:
            background = 'snowing';
    }

    document.body.style.backgroundImage = `url(/img/backgrounds/${dayTime}/${background}.jpg)`
}


getWeatherData(weatherAPIdomain, APIkey, loc);
getCityFromInput();
getPinnedCity();
