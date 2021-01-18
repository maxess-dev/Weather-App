// Import IMG => Parcel
import clouds from '../assets/svg/cloud-solid.svg';
import rain from '../assets/svg/cloud-rain-solid.svg';
import sun from '../assets/svg/sun.svg'
import snow from '../assets/svg/snow.svg';
//import loader from '../assets/svg/loader.svg';
import cityJSON from '../city.json'

// Init card
const changeCity = document.getElementById("changeCity");
let card = document.getElementById("card");
let dateToday = document.getElementById("date");
const city = document.getElementById("city");
const weatherImg = document.getElementById("weatherImg");
let weatherDescription = document.getElementById("weatherDescription");
const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feels-like");
const temperature = document.getElementById("temperature");

// Init searchbar
const inputCity = document.getElementById("inputCity");
const submit = document.getElementById("submit");

// Init autocompletion
const autoCompletion = document.getElementById("autocompletion");
let span = null;

// Add multiple classes for a DOM element
function addClasses(el, classId){
  classId.forEach(IdClass => {
    el.classList.add(IdClass);
  });
}

// Get Weather Enter key
inputCity.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    fetchAPI();
  }
});

// Get Weather Click
submit.addEventListener("click",() => {
  fetchAPI();
});

// Fetch OpenWeather API
function fetchAPI(){
  let usrCity = inputCity.value;
  if(usrCity.length > 0){
    card.classList.remove("hidden");
    inputCity.classList.add("hidden");
    weatherImg.classList.remove("turn");
    weatherImg.classList.remove("scale");
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${usrCity}&units=metric&lang=fr&appid=52dc2b2a514c330d2e42c188b8dda94a`)
    .then(function(response) {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        } response.json().then(function(data) {
            city.textContent = data.name;
            weatherDescription.textContent = data.weather[0].description.slice(0,1).toUpperCase() + data.weather[0].description.slice(1);
            windSpeed.textContent = data.wind.speed + " m/s";
            humidity.textContent = data.main.humidity + " %";
            feelsLike.textContent = data.main.feels_like + "°";
            temperature.textContent = Math.floor(data.main.temp) + "°";
            if(data.weather[0].main === "Clouds"){
              weatherImg.classList.add("scale");
              weatherImg.src = clouds;
            } else if(data.weather[0].main == "Sun"){
              weatherImg.classList.add("turn");
              weatherImg.src = sun;
            } else if(data.weather[0].main == "Clear"){
              weatherImg.classList.add("turn");
              weatherImg.src = sun;
            } else if(data.weather[0].main == "Rain"){
              weatherImg.classList.add("scale");
              weatherImg.src = rain;
            } else if(data.weather[0].main == "Snow"){
              weatherImg.classList.add("turn");
              weatherImg.src = snow;
            } else if(data.weather[0].main == "Drizzle"){
              weatherImg.classList.add("turn");
              weatherImg.src = clouds;
            } 
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
  };
}

// Start Clock
setInterval(getHouMinSec,1000);
function getHouMinSec(){
  let date = new Date();
  let hour = date.getHours().toString();
  let min = date.getMinutes().toString();
  if(min < 10 && hour < 10){ 
    min = "0"+min;
    hour = "0"+hour;
  } else if(min < 10){
    min = "0"+min;
  } else if(hour < 10){
    hour = "0"+hour;
  }
  dateToday.textContent = hour + ":" + min;
};

// Change the city when click => card
changeCity.addEventListener("click",function(){
  card.classList.add("hidden");
  inputCity.classList.remove("hidden");
});

// Check if a span is in the DOM
function checkSPAN(parent){
  if(parent.children.length > 0){
    return true;
  } else {
    return false;
  }
}

// Remove span in the DOM
function removeSPAN(parent){
  for (let i = 0; i < parent.children.length; i++) {
    parent.removeChild(parent.children[i]);
  }
}

// Autocomplete ON
inputCity.addEventListener("keyup", function(event){
  autoCompletion.classList.remove("hidden");
  const inputRealTime = event.target.value;
  const regex = new RegExp(`^${inputRealTime}`,"i");
  while(checkSPAN(autoCompletion)){ // Delete old spans
    removeSPAN(autoCompletion);
  }
  if(inputRealTime.length >= 3){
    cityJSON.forEach(el => {
      if(regex.test(el.city)){
        span = document.createElement("span");
        addClasses(span,["block","bg-gray-300","px-6","py-2","w-full","mt-2","opaAnim","rounded-sm","cursor-pointer"]);
        span.textContent = el.city;
        autoCompletion.appendChild(span);
        span.addEventListener("click",(e) => {
          inputCity.value = e.target.textContent;
          autoCompletion.classList.add("hidden");
        });
      }
    })
  }
}) 