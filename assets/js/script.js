const API_KEY = "7473c45295a66629558438909f74761b";

var searchHistory;

// gets current weather
function getWeather(city) {
  var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=imperial";

  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    if (data.cod !== '404') { // runs search if query was a valid city
      $( '#search-text' ).removeClass('is-invalid');
      displayCurrent(data);
      storeHistory(data.name);
      displayHistory(searchHistory);
    } else {
      $( '#search-text' ).addClass('is-invalid'); // makes searchbar border red for invalid city searches
    }
  })
}

// gets forecast for today
function getForecast(city) {
  var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + API_KEY + "&units=imperial";

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    // 5 day forecast
    .then(function(data) {
      if (data.cod !== '404') {
        displayForecast(data.list[8], 0); // next day
        displayForecast(data.list[16], 1); // day after
        displayForecast(data.list[24], 2); //etc
        displayForecast(data.list[32], 3);
        displayForecast(data.list[39], 4);
      }
    })
};

function displayCurrent(data) {

  // Todays Search data and associated cards
  $( '.displayCity' ).text(data.name);
  $( '.displayDate' ).text(dayjs.unix(data.dt).format("MM/DD/YY"));
  var src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
  $( '.displayWthIcon' ).attr('src', src);
  $( '.displayWthText' ).text(data.weather[0].main);

  $( '#currentTemp > .cardTitle' ).text("temp");
  $( '#currentTemp > .cardContent' ).text(Math.floor(data.main.temp));
  $( '#currentTemp > .cardSmallText' ).text("F");

  $( '#currentWind > .cardTitle' ).text("wind");
  $( '#currentWind > .cardContent' ).text(data.wind.speed);
  $( '#currentWind > .cardSmallText' ).text("mph");

  $( '#currentHumidity > .cardTitle' ).text("humidity");
  $( '#currentHumidity > .cardContent' ).text(data.main.humidity);
  $( '#currentHumidity > .cardSmallText' ).text("%");
}

// for displaying content in specific forecast cards based on the day from 5 day forecast
function displayForecast(data, i) {
  $( '.forecastDayTitle' ).eq(i).text(dayjs.unix(data.dt).format("MM/DD/YY"));
  var src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
  $( '.forecastDayIcon' ).eq(i).attr('src', src);
  $( '.forecastDayTemp' ).eq(i).text("temp: " + Math.floor(data.main.temp) + "F");
  $( '.forecastDayWind' ).eq(i).text("wind: " + Math.floor(data.wind.speed) + " MPH");
  $( '.forecastDayHmd' ).eq(i).text("humidity: " + Math.floor(data.main.humidity) + "%");
}

function storeHistory(city) {
  if (searchHistory.includes(city)) { // if user searches the same city twice, it only leaves 1 instance in search history
    return;
  }
  // makes array that holds last 15 searched cities and when a new one is searched it gets ride og the oldest one
  if (searchHistory.length === 15) { 
    searchHistory.shift(); 
    searchHistory.push(city); 
  } else {
    searchHistory.push(city);
  }
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// loops through searchHistory array and displays them in the History dropdown menu
function displayHistory(searchHistory) {
  $( '.dropdown-menu' ).html(''); // clear dropdown each time
  for (let i = 0; i < searchHistory.length; i++) {
    var city = $('<li><a class="dropdown-item historyItem" href="#">' + searchHistory[i].toLowerCase() + '</a></li>');
    city.on('click', function() { 
      getWeather(searchHistory[i]); 
      getForecast(searchHistory[i]);
    })
    $( '.dropdown-menu' ).append(city);
  }
}

// initialize, San Diego being the default
function init() {
  getWeather("San Diego");
  getForecast("San Diego");
  var search = localStorage.getItem("searchHistory");
  if (search === null) { // adds default to search history if no cities have been searched
    searchHistory = [];
  } else {
    searchHistory = JSON.parse(search);
  }
}

// runs both getWeather and Forecast on click of the search button
$( '#search-btn' ).on('click', function() {
  var city = $( '#search-text' ).val();
  getWeather(city);
  getForecast(city);
});

init();