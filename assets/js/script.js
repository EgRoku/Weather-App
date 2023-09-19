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
    if (data.cod !== '404') { // runs this code if city was valid
      $( '#search-text' ).removeClass('is-invalid');
      displayCurrent(data);
      storeHistory(data.name);
      displayHistory(searchHistory);
    } else {
      $( '#search-text' ).addClass('is-invalid'); // makes searchbar red for invalid searches
    }
  })
}

// gets forecast
function getForecast(city) {
  var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=fcd695651489692dd902cf171673c895&units=imperial";

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.cod !== '404') {
        displayForecast(data.list[8], 0); // 24 hrs from 'now'
        displayForecast(data.list[16], 1); // and so on
        displayForecast(data.list[24], 2);
        displayForecast(data.list[32], 3);
        displayForecast(data.list[39], 4);
      }
    })
};

function displayCurrent(data) {

  // MAIN DISPLAY - CITY/DATE/ICON //
  $( '.displayCity' ).text(data.name);
  $( '.displayDate' ).text(dayjs.unix(data.dt).format("MMMM DD, YYYY"));
  var src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
  $( '.displayWthIcon' ).attr('src', src);
  $( '.displayWthText' ).text(data.weather[0].main);

  // MAIN DISPLAY - CARDS // 
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

// for displaying content in specific forecast cards (i = index)
function displayForecast(data, i) {
  $( '.forecastDayTitle' ).eq(i).text(dayjs.unix(data.dt).format("MM/DD/YY"));
  var src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
  $( '.forecastDayIcon' ).eq(i).attr('src', src);
  $( '.forecastDayTemp' ).eq(i).text("temp: " + Math.floor(data.main.temp) + "F");
  $( '.forecastDayWind' ).eq(i).text("wind: " + Math.floor(data.wind.speed) + " MPH");
  $( '.forecastDayHmd' ).eq(i).text("humidity: " + Math.floor(data.main.humidity) + "%");
}

function storeHistory(city) {
  if (searchHistory.includes(city)) { // account for duplicate searches
    return;
  }
  if (searchHistory.length === 10) { // max history length of 10
    searchHistory.shift(); // removes oldest search item (first item)
    searchHistory.push(city); // adds recent search to end of array
  } else {
    searchHistory.push(city);
  }
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// loops through array of searchHistory and displays them in dropdown menu
function displayHistory(searchHistory) {
  $( '.dropdown-menu' ).html(''); // clear dropdown each time
  for (let i = 0; i < searchHistory.length; i++) {
    var city = $('<li><a class="dropdown-item historyItem" href="#">' + searchHistory[i].toLowerCase() + '</a></li>');
    city.on('click', function() { // add event listener to item just added
      getWeather(searchHistory[i]); // on click we run getWeather and getForecast for specific city
      getForecast(searchHistory[i]);
    })
    $( '.dropdown-menu' ).append(city);
  }
}

// initialize, start with san diego as placeholder
function init() {
  getWeather("San Diego");
  getForecast("San Diego");
  var search = localStorage.getItem("searchHistory");
  if (search === null) { // accounts for if local storage is empty
    searchHistory = [];
  } else {
    searchHistory = JSON.parse(search);
  }
}

// upon clicking search button we run getWeather and getForecast for whatever we searched
$( '#search-btn' ).on('click', function() {
  var city = $( '#search-text' ).val();
  getWeather(city);
  getForecast(city);
});

init();


// var key = '7473c45295a66629558438909f74761b';
// var city = "San Diego"

// // Grabs the current time and date
// var date = moment().format('dddd, MMMM Do YYYY');
// var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')

// var cityHist = [];
// // Saves the value of the last search and save it to an array for storage
// $('.search').on("click", function (event) {
// 	event.preventDefault();
// 	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
// 	if (city === "") {
// 		return;
// 	};
// 	cityHist.push(city);

// 	localStorage.setItem('city', JSON.stringify(cityHist));
// 	fiveForecastEl.empty();
// 	getHistory();
// 	getWeatherToday();
// });

// // Creates buttons based on previous searches 
// var contHistEl = $('.cityHist');
// function getHistory() {
// 	contHistEl.empty();

// 	for (let i = 0; i < cityHist.length; i++) {

// 		var rowEl = $('<row>');
// 		var btnEl = $('<button>').text(`${cityHist[i]}`)

// 		rowEl.addClass('row histBtnRow');
// 		btnEl.addClass('btn btn-outline-secondary histBtn');
// 		btnEl.attr('type', 'button');

// 		contHistEl.prepend(rowEl);
// 		rowEl.append(btnEl);
// 	} if (!city) {
// 		return;
// 	}
// 	// Allows the search history buttons to start a search
// 	$('.histBtn').on("click", function (event) {
// 		event.preventDefault();
// 		city = $(this).text();
// 		fiveForecastEl.empty();
// 		getWeatherToday();
// 	});
// };

// // Grabs the main 'Today' card body.
// var cardTodayBody = $('.cardBodyToday')
// // Applies the weather data to the today card and then launches the five day forecast
// function getWeatherToday() {
// 	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

// 	$(cardTodayBody).empty();

// 	$.ajax({
// 		url: getUrlCurrent,
// 		method: 'GET',
// 	}).then(function (response) {
// 		$('.cardTodayCityName').text(response.name);
// 		$('.cardTodayDate').text(date);
// 		// Icons
// 		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
// 		// Temperature
// 		var temp = $('<p>').text(`Temperature: ${response.main.temp} °F`);
// 		cardTodayBody.append(temp);
// 		// Feels Like
// 		var feelsLike = $('<p>').text(`Feels Like: ${response.main.feels_like} °F`);
// 		cardTodayBody.append(feelsLike);
// 		// Humidity
// 		var humidity = $('<p>').text(`Humidity: ${response.main.humidity} %`);
// 		cardTodayBody.append(humidity);
// 		// Wind Speed
// 		var windSpeed = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
// 		cardTodayBody.append(windSpeed);
// 		// Sets the lat and long based on the searched city
// 		var cityLon = response.coord.lon;
// 		// console.log(cityLon);
// 		var cityLat = response.coord.lat;
// 		// console.log(cityLat);

// 		var getUrlUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;
// 		// Gets UV index from api and applies a color code
// 		$.ajax({
// 			url: getUrlUvi,
// 			method: 'GET',
// 		}).then(function (response) {
// 			var pElUvi = $('<p>').text(`UV Index: `);
// 			var uviSpan = $('<span>').text(response.current.uvi);
// 			var uvi = response.current.uvi;
// 			pElUvi.append(uviSpan);
// 			cardTodayBody.append(pElUvi);
// 			// sets the UV index to match an exposure chart severity based on color 
// 			if (uvi >= 0 && uvi <= 2) {
// 				uviSpan.attr('class', 'green');
// 			} else if (uvi > 2 && uvi <= 5) {
// 				uviSpan.attr("class", "yellow")
// 			} else if (uvi > 5 && uvi <= 7) {
// 				uviSpan.attr("class", "orange")
// 			} else if (uvi > 7 && uvi <= 10) {
// 				uviSpan.attr("class", "red")
// 			} else {
// 				uviSpan.attr("class", "purple")
// 			}
// 		});
// 	});
// 	getFiveDayForecast();
// };

// var fiveForecastEl = $('.fiveForecast');

// // gets the weather for the next 5 days and injects cards onto the page
// function getFiveDayForecast() {
// 	var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

// 	$.ajax({
// 		url: getUrlFiveDay,
// 		method: 'GET',
// 	}).then(function (response) {
// 		var fiveDayArray = response.list;
// 		var myWeather = [];
// 		// Made a object that would allow for easier data read
// 		$.each(fiveDayArray, function (index, value) {
// 			testObj = {
// 				date: value.dt_txt.split(' ')[0],
// 				time: value.dt_txt.split(' ')[1],
// 				temp: value.main.temp,
// 				feels_like: value.main.feels_like,
// 				icon: value.weather[0].icon,
// 				humidity: value.main.humidity
// 			}

// 			if (value.dt_txt.split(' ')[1] === "12:00:00") {
// 				myWeather.push(testObj);
// 			}
// 		})
// 		// Injects cards to the screen 
// 		for (let i = 0; i < myWeather.length; i++) {

// 			var weatherCard = $('<div>');
// 			weatherCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
// 			weatherCard.attr('style', 'max-width: 200px;');
// 			fiveForecastEl.append(weatherCard);

// 			var weatherHeader = $('<div>');
// 			weatherHeader.attr('class', 'card-header')
// 			var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
// 			weatherHeader.text(m);
// 			weatherCard.append(weatherHeader)

// 			var weatherBody = $('<div>');
// 			weatherBody.attr('class', 'card-body');
// 			weatherCard.append(weatherBody);

// 			var weatherIcon = $('<img>');
// 			weatherIcon.attr('class', 'icons');
// 			weatherIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
// 			weatherIcon.append(weatherIcon);

// 			// Temp
// 			var temp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
// 			weatherBody.append(temp);
// 			// Feels Like
// 			var feelsLike = $('<p>').text(`Feels Like: ${myWeather[i].feels_like} °F`);
// 			weatherBody.append(feelsLike);
// 			// Humidity
// 			var humidity = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
// 			weatherBody.append(humidity);
// 		}
// 	});
// };

// // Allows the example data to load San Diego Weather
// function initLoad() {

// 	var cityHistStore = JSON.parse(localStorage.getItem('city'));

// 	if (cityHistStore !== null) {
// 		cityHist = cityHistStore
// 	}
// 	getHistory();
// 	getWeatherToday();
// };

// initLoad();