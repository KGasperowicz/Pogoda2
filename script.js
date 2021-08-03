const input = document.querySelector('input');
const btn = document.querySelector('button');

const cityName = document.querySelector('.city-name');
const warning = document.querySelector('.warning');
const icon = document.querySelector('.icon');
const background = document.querySelector('body');
const weather = document.querySelector('.weather');
const currentDate = document.querySelector('.date');

const temperature = document.querySelector('.temperature');
const pressure = document.querySelector('.pressure');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');

const sunrisetext = document.querySelector('.sunrise');
const sunsettext = document.querySelector('.sunset');

const weekDays = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
const shortWeekDays = ['nd.', 'pon.', 'wt.', 'śr.', 'cz.', 'pt.', 'so.'];


const apiLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
const apiKey = '&appid=733677895883c5f7f9896605f6b66748';
const units = '&units=metric';
const lang = '&lang=pl';

const forecastApiLink = 'https://api.openweathermap.org/data/2.5/onecall?';

const addzero = (x) => {
    if (x < 10) {
        return '0' + x;
    } 
    return x;
};



  

const getForecast = (coords, sunriseDate, sunsetDate) => {
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid={API key}

    let url = forecastApiLink + `lat=${coords.lat}&lon=${coords.lon}` + apiKey + units;

    let hourly = document.querySelector('.hourly');
    let daily = document.querySelector('.daily');

    hourly.scroll({top: 0, left:0, behavior: "smooth"});
    daily.scroll({top: 0, left:0, behavior: "smooth"});

    axios.get(url)
        .then(res => {
            console.log('one call', res);


            for(let i=1; i<41; i++) {

                let forecast = res.data.hourly[i];
                let date = new Date((forecast.dt + res.data.timezone_offset - 2 * 3600) * 1000);
                let hour = document.getElementById(`hour${i}`);
                hour.firstElementChild.textContent = `${addzero(date.getHours())}:${addzero(date.getMinutes())}`;
                let temp = hour.querySelector('.temperature-2');
                temp.textContent = Math.round(forecast.temp) + '°C';

                let day = hour.querySelector(`.hour-weekday`);
                day.textContent = shortWeekDays[date.getDay()];

                let status = forecast.weather[0]
                let icon = hour.querySelector('.hour-icon');

               
                let currentHour = date.getHours();
                let sunsetHour = sunsetDate.getHours();
                let sunriseHour = sunriseDate.getHours();

    
                const night = currentHour < sunriseHour || currentHour > sunsetHour ? 'n' : '';

                console.log(currentHour, sunsetHour, sunriseHour, night, currentHour < sunriseHour, currentHour > sunsetHour);

                if (status.id >= 200 && status.id < 300) {
                    icon.setAttribute('src', 'icons/stormb.png') //burza
                } else if (status.id >= 300 && status.id < 400) {
                    icon.setAttribute('src', 'icons/rainb.png') //deszcz
                } else if (status.id >= 500 && status.id < 600) {
                    icon.setAttribute('src', 'icons/rainb.png') // deszcz
                } else if (status.id >= 600 && status.id < 700) {
                    icon.setAttribute('src', 'icons/snowb.png') // snieg
                } else if (status.id >= 700 && status.id < 800) {
                    icon.setAttribute('src', 'icons/fogb.png') // mgła
                } else if (status.id === 800) {
                    icon.setAttribute('src', `icons/sunb${night}.png`) // czyste niebo
                } else if (status.id === 801) {
                    icon.setAttribute('src', `icons/suncloudb2${night}.png` ) // male zachmurzenie
                } else if (status.id === 802) {
                    icon.setAttribute('src', `icons/suncloudb${night}.png`) // zachmurzenie
                } else if (status.id === 803 || status.id === 804) {
                    icon.setAttribute('src', 'icons/cloudb.png') // pełne zachmurzenie
                } else {
                    icon.setAttribute('src', 'icons/suncloudb2.png')
                }
                
            }

            for (let i=1; i<8; i++) {
                let forecast = res.data.daily[i];
                const date = new Date((forecast.dt) * 1000);
                let day = document.getElementById(`day${i}`);
                day.firstElementChild.textContent = weekDays[date.getDay()];

                let mintemp = day.querySelector('.temp-min');
                mintemp.textContent = Math.round(forecast.temp.min) + '°C';

                let maxtemp = day.querySelector('.temp-max');
                maxtemp.textContent = Math.round(forecast.temp.max) + '°C';

                let status = forecast.weather[0];
                let icon = day.querySelector('.daily-icon');

                if (status.id >= 200 && status.id < 300) {
                    icon.setAttribute('src', 'icons/stormb.png') //burza
                } else if (status.id >= 300 && status.id < 400) {
                    icon.setAttribute('src', 'icons/rainb.png') //deszcz
                } else if (status.id >= 500 && status.id < 600) {
                    icon.setAttribute('src', 'icons/rainb.png') // deszcz
                } else if (status.id >= 600 && status.id < 700) {
                    icon.setAttribute('src', 'icons/snowb.png') // snieg
                } else if (status.id >= 700 && status.id < 800) {
                    icon.setAttribute('src', 'icons/fogb.png') // mgła
                } else if (status.id === 800) {
                    icon.setAttribute('src', 'icons/sunb.png') // czyste niebo
                } else if (status.id === 801) {
                    icon.setAttribute('src', 'icons/suncloudb2.png') // male zachmurzenie
                } else if (status.id === 802) {
                    icon.setAttribute('src', 'icons/suncloudb.png') // zachmurzenie
                } else if (status.id === 803 || status.id === 804) {
                    icon.setAttribute('src', 'icons/cloudb.png') // pełne zachmurzenie
                } else {
                    icon.setAttribute('src', 'icons/suncloudb2.png')
                }

            }

        })
}

const getWeather = () => {
    let city;
    let url;
    document.activeElement.blur();
    city = (!input.value) ? 'Poznań' : input.value;
  
    url = apiLink + city + lang + apiKey + units ;
   

    axios.get(url)
        .then(res => {
            const temp = res.data.main.temp;
            const hum = res.data.main.humidity;
            const status = Object.assign({}, ...res.data.weather)
            // nie ma obiektu w obiekcie tylko jest jeden obiekt
            const pres = res.data.main.pressure;
            const windspeed = res.data.wind.speed;
            const date = new Date((res.data.dt + res.data.timezone - 2*3600) * 1000);

            const sunriseDate = new Date((res.data.sys.sunrise + res.data.timezone - 2*3600) * 1000);
            const sunsetDate = new Date((res.data.sys.sunset+ res.data.timezone - 2*3600) * 1000);

            const coords = res.data.coord;
            getForecast(coords, sunriseDate, sunsetDate);
            console.log(date);

            const isNight = () => {
                let currentHour = date.getHours();
                let sunsetHour = sunsetDate.getHours();
                let sunriseHour = sunriseDate.getHours();

                return currentHour < sunriseHour || currentHour > sunsetHour
               
            }
            const night = isNight() ? 'n' : '';
            
          

            cityName.textContent = res.data.name;
            currentDate.textContent = `${addzero(date.getDate())}.${addzero(date.getMonth()+1)}.${date.getFullYear()}`;
            weather.textContent = status.description;
            temperature.textContent = Math.round(temp) + '°C';
            pressure.textContent = pres + ' hPa';
            humidity.textContent = 'wilgotność: ' + hum + '%';
            wind.textContent = 'wiatr: ' + windspeed + 'm/s';
            sunrisetext.textContent = 'wschód: ' + addzero(sunriseDate.getHours()) + ':' + addzero(sunriseDate.getMinutes());
            sunsettext.textContent = 'zachód: ' + addzero(sunsetDate.getHours()) + ':' + addzero(sunsetDate.getMinutes());
            

            warning.textContent = '';
            input.value = '';

            console.log(res.data);

            if (status.id >= 200 && status.id < 300) {
                icon.setAttribute('src', 'icons/stormb.png') //burza
            } else if (status.id >= 300 && status.id < 400) {
                icon.setAttribute('src', 'icons/rainb.png') //deszcz słonce za chmurką
            } else if (status.id >= 500 && status.id < 600) {
                icon.setAttribute('src', 'icons/rainb.png') // deszcz
                background.style.backgroundImage = 'url(backgrounds/rain.jpg)'
            } else if (status.id >= 600 && status.id < 700) {
                icon.setAttribute('src', 'icons/snowb.png') // snieg
            } else if (status.id >= 700 && status.id < 800) {
                icon.setAttribute('src', 'icons/fogb.png') // mgła
            } else if (status.id === 800) {
                icon.setAttribute('src', `icons/sunb${night}.png`) // czyste niebo
                background.style.backgroundImage = 'url(backgrounds/sunny.jpg)'
            } else if (status.id === 801) {
                icon.setAttribute('src', `icons/suncloudb2${night}.png`) // male zachmurzenie
                background.style.backgroundImage = 'url(backgrounds/clouds1.jpg)'
            } else if (status.id === 802) {
                icon.setAttribute('src', `icons/suncloudb${night}.png`) // zachmurzenie
                background.style.backgroundImage = 'url(backgrounds/clouds2.jpg)'
            } else if (status.id === 803 || status.id === 804) {
                icon.setAttribute('src', 'icons/cloudb.png') // pełne zachmurzenie
                background.style.backgroundImage = 'url(backgrounds/clouds3.jpg)'
            } else {
                icon.setAttribute('src', 'icons/suncloudb2.png')
            }


            
        })
        .catch(() => warning.textContent='wpisz poprawną nazwę miasta')
};

const enterCheck = (event) => {
    if(event.keyCode === 13) {
        getWeather();
    }
};

getWeather();
btn.addEventListener('click', getWeather)
window.scrollTo(0, 0);
input.addEventListener('keyup', enterCheck)

