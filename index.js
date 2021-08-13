// declare variables
var searchHistory = [];
var weatherApiKey = "e88a36121844f522ddc72a5fb79188e2";

var searchForm = document.querySelector("#searchForm");
var searchInput = document.querySelector("#searchInput");
var todayContainer = document.querySelector("#today");
var forecastContainer = document.querySelector("#forecast");

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function handleFormSubmit(e) {
  e.preventDefault();
  var search = searchInput.value.trim();

  fetchCityCoords(search);
  searchInput.value = "";
}

function fetchCityCoords(search) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${weatherApiKey}`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data) {
        alert("city not found");
      } else {
        addCityToHistory(search);
        fetchWeatherData(data);
        // console.log(data)
      }
    });
}

function addCityToHistory(search) {
  searchHistory.push(search);
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
}

function fetchWeatherData(data) {
  var { lat } = data.coord;
  var { lon } = data.coord;
  var cityName = data.name;

  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`).then(function (res){
    return res.json()
  }).then(function(data){
      console.log(data)
    renderItems(cityName, data)
  }).catch(function(err){
      console.log(err)
  })
}

function renderItems(city, data){
    renderCurrentWeather(city, data.current,data.timezone)
    renderForecast(data.daily, data.timezone)
}

function renderCurrentWeather(a, b, c){
    var date = dayjs().tz(c).format('M/D/YYYY');

    // create variables for the data response
    var temp= b.temp;
    var wind = b.wind_speed;
    var humidity= b.humidity;
    var uvi = b.uvi;
    
    // create the elements that need to be added to the container
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uviEl = document.createElement('p');
    // var card = document.createElement('div');

    // set new element attributes
    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody)

    heading.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    heading.textContent = `${a} ${date}`
    tempEl.textContent = `Temp: ${temp}F`
    windEl.textcontent = `Wind: ${wind} MPH`
    humidityEl.textContent = `Humidity: ${humidity}%`
    cardBody.append(heading, tempEl, windEl, humidityEl);

    todayContainer.innerHTML = '';
    todayContainer.append(card);

}

searchForm.addEventListener("submit", handleFormSubmit);
