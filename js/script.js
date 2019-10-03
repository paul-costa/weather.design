let weatherData;
let colorSchema;
let weatherDataArray = [];

let weatherDataArrayNew = [];



//Fetch Weather Data through API
window.addEventListener('load', ()=> {
    let long;
    let lat;

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;           
            
            for(let i=0; i<7; i++) {
                fetchData(i);
            }


            function fetchData(daysInFuture) {
                let proxy = `https://cors-anywhere.herokuapp.com/`;

                let apiRequest='';

                if(daysInFuture==0) {
                    apiRequest = `${proxy}https://api.darksky.net/forecast/52c6984aa80b6b1fc50d3dd340934b5b/${lat},${long}?units=auto`;
                }
    
                else {
                    let dateToGet = {
                        year: new Date().getFullYear(),
                        month: new Date().getMonth(),
                        day: new Date().getDate() + daysInFuture
                    };
                
                    dateToGet = (new Date(dateToGet.year, dateToGet.month, dateToGet.day, 0, 0, 0, 0).getTime()/1000);

                    apiRequest = `${proxy}https://api.darksky.net/forecast/52c6984aa80b6b1fc50d3dd340934b5b/${lat},${long},${dateToGet}?units=auto`;
                }

                let weatherDataApiContent = fetch(apiRequest)
                    .then(requestedData => {
                        return requestedData.json();
                    })
                    .then(requestedDataJson => {
                        weatherDataApiContent=requestedDataJson;
                        return weatherDataApiContent;
                    }).then(weatherDataApiContent =>  {
                        if(daysInFuture==0) {
                            weatherData = weatherDataApiContent;
                            buildPage('today');
                        }

                        else {
                            weatherDataArray.push(weatherDataApiContent);
                        }
                    });
            }
        });        
    }

    else {
        alert('Geolocation not enabled')
    }
});


function buildPage(time) {    
    if(time=="today") {    
        switch (weatherData.currently.icon) {
            case 'clear-day', 'clear-night': case 'cloudy': case 'fog': case 'partly-cloudy-day':
            case 'partly-cloudy-night': case 'rain': case 'sleet': case 'snow': case 'wind':
                colorSchema = "_light";
                break;
        
            default:
                colorSchema = "_light";         //_dark disabled for now
                break;
        }
        buildVue(weatherData, colorSchema);
    }
    
    if(time=="forecast") {
        buildForecastVue();
    }
}



function buildVue(weatherData, colorSchema) {
    asyncBuildFunction();
    
    async function asyncBuildFunction() {
        let promise = new Promise((resolve, reject) => {
            timestamp = 0;
            $('#insertedForecastVue').remove();
            
            let weatherVue = new Vue({
                el: '#weatherVue',
    
                data: {
                    timestampValue: 1,
                    humidityIcon : "background-image: url(./css/icons/humidity.svg)",
    
                    windspeedIcon: "background-image: url(./css/icons/windspeed.svg)",
    
                    summaryIconHourly   : "background-image: url(./css/icons/summary/"+weatherData.hourly.icon+".svg)",
                    summaryHourly       : weatherData.hourly.summary,
                    
                    colorSchema: colorSchema,
    
                },
    
                computed: {   
                    currentDate: function() {
                        let currentUnixTime = new Date(weatherData.hourly.data[this.timestampValue].time*1000);
    
    
                        let currentDate = {
                            time: currentUnixTime.getHours(),
                            day: currentUnixTime.getDate(),
                            month: currentUnixTime.getMonth(),
                        }
    
                        let months = ['Jan','Feb','Mar','Apr','Mai','Jun','Jul','Aug','Sep','Oct','Nov','Dez'];
                        
                        return (currentDate.time + ':00 | ' + currentDate.day + '. ' + months[currentDate.month]);
                    },
    
                    
                    backgroundImage: function() { 
                        return "background-image: url(./css/pics/"+weatherData.currently.icon+"/"+Math.floor(Math.random()*5)+".jpg)"; 
                    },
    
                    temperatureText: function() {
                        return (Math.round(weatherData.hourly.data[this.timestampValue].temperature) + "°C"); 
                    },

                    locationText: function() { 
                        return (weatherData.timezone.split("/").reverse().join(", ")); 
                    },
    
                    summaryIcon: function() { 
                        return ("background-image: url(./css/icons/summary/"+weatherData.hourly.data[this.timestampValue].icon+".svg)"); 
                    },

                    summaryText: function() { 
                        return (weatherData.hourly.data[this.timestampValue].summary); 
                    },
    
                    humidityText: function() { 
                        return (Math.round(weatherData.hourly.data[this.timestampValue].humidity*100)); 
                    },
    
                    windspeedText: function() { 
                        return (weatherData.hourly.data[this.timestampValue].windSpeed); 
                    },
    
                },
    
                template:
                `<div>
    
                <div class="backgroundImage" v-bind:style="backgroundImage"></div>
                
                <div id="insertedWeatherVue">
                    <div class="rightButton invertElement" id="rightButton" onclick="buildPage('forecast');"></div>
                    
                    <div class="container" id="maincontainer">
                        <div class="row">
                            <div class="col-12 text-center invertElement" id="temperatureText">{{ temperatureText }} </div>
                            <div class="col-12 text-center invertElement" id="currentDate">{{ currentDate }}</div>
                            <div class="col-12 text-center mb-lg-5 mb-md-3 mb-3 invertElement" id="locationText">{{ locationText }}</div>
    
                            <div class="offset-lg-0 col-lg-5 offset-md-3 col-md-6 col-sm-12 mt-lg-5 mt-md-3 mt-1 text-right">
                                <div class="row" id="summaryText">
                                    <div class="col-8 invertElement">{{ summaryText }}</div>
                                    <div class="col-4 textIcon invertElement" v-bind:style="summaryIcon"></div>
                                </div>
                            </div>
    
    
                            <div class="col-lg-2 col-md-6 col-sm-12 mt-lg-5 mt-md-3 mt-1 text-right">
                                <div class="row" id="humidityText">
                                    <div class="col-8 invertElement">{{ humidityText }}%</div>
                                    <div class="col-4 textIcon invertElement" v-bind:style="humidityIcon"></div>
                                </div>
                            </div>
    
                            <div class="col-lg-5 col-md-6 col-sm-12 mt-lg-5 mt-md-3 mt-1 text-right">
                                <div class="row" id="windspeedText">
                                    <div class="col-8 invertElement">{{ windspeedText }} kph</div>
                                    <div class="col-4 textIcon invertElement" v-bind:style="windspeedIcon"></div>
                                </div>
                            </div>
                        </div>
    
                        <div class="row mt-lg-5 mt-md-4 mt-3">
                            <div class="col-12 text-center invertElement" id="summaryHourly">{{ summaryHourly }}</div>   
                            <div class="col-12 text-center invertElement" id="summaryiconHourly"><div class="col-12 iconHourly textIcon" v-bind:style="summaryIconHourly"></div></div>
                        </div>
    
                    </div>
    
                    <footer class="footer">
                        <div class="container text-center">
                            <input v-model="timestampValue" type="range" min="1" max="24" value="1" class="slider invertElement">
                            <div class="sliderArrowContainer invertElement text-left">
                                <img src="./css/icons/arrow.svg" id="sliderArrowImg">
                            </div>
                        </div>
                    </footer>
                </div>
                
                <div id="forecastVue"></div>
                </div>`,
            });
    
            resolve();
        });

        await promise;
        
        if(colorSchema=="_light") {
            $('.invertElement').css('filter', 'invert(100%)');
        }

            
        illuminateButton('right');
        slideArrow();
    }
    
    

}

function buildForecastVue() {
    //sort array by correct day before building vue
    weatherDataArray = weatherDataArray.sort((a,b) => (a.currently.time>b.currently.time) ? 1 : ((b.currently.time > a.currently.time) ? -1 : 0));
    
    asyncBuildFunctionForecast();
    
    async function asyncBuildFunctionForecast() {
        let promise = new Promise((resolve, reject) => {
            $('#insertedWeatherVue').remove();

            let forecastVue = new Vue({
                el: '#forecastVue',

                data: {

                },

                computed: {
                    getDates: function() {
                        let dateArray = [];

                        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; 
                        const months = ['Jan','Feb','Mar','Apr','Mai','Jun','Jul','Aug','Sep','Oct','Nov','Dez'];
                        
                        weatherDataArray.forEach(function(element) {
                            const day = new Date(element.currently.time*1000).getDay();
                            const date = new Date(element.currently.time*1000).getDate();
                            
                            let dateDecl = '';

                            switch (date) {
                                case 1: case 21: case 31:
                                    dateDecl='st';
                                    break;

                                case 2: case 22:
                                    dateDecl='nd';
                                    break;

                                case 3: case 23:
                                    dateDecl='rd';
                                    break;
                            
                                default:
                                    dateDecl='th';
                                    break;
                            }
                            //let month = new Date(element.currently.time*1000).getMonth();
        
                            dateArray.push(days[day-1] + ' - ' + date + dateDecl);
                        });
                        return dateArray;
                    },
                    
                    fillArray: function() {
                        let forecastArray = []
                        
                        weatherDataArray.forEach(function(element) {
                            let forecastTempObj = {
                                tempMaxDaily: Math.round(element.daily.data[0].temperatureMax) + "°C",
                                iconDaily: generateIcon(element.daily.data[0].icon),
                                tempMinDaily: Math.round(element.daily.data[0].temperatureMin) + "°C",
                            };

                            forecastArray.push(forecastTempObj);
                        });
                        
                        return forecastArray;

                        function generateIcon(iconName) {
                            return `background-image: url(./css/icons/summary/${iconName}.svg)`;
                        }
                    }
                },

                template:
                `<div>
                
                <div id="insertedForecastVue">
                    <div class="leftButton invertElement" id="leftButton" onclick="buildPage('today');"></div>
                    <div class="container" id="maincontainer">
                        <div class="row pt-5 mx-1">
                            
                            <div class="col-xl-2 col-lg-4 col-6 mb-lg-5 mb-md-3 mb-3 text-center forecastDay invertElement" v-for="(dates,index) in getDates"
                                >{{dates}}<div class="forecastDataContainer">
                                    <div class="col-12 forecastTemp text-center">{{ fillArray[index].tempMaxDaily }}</div>
                                    <div class="col-12 forecastIcon text-center" v-bind:style="fillArray[index].iconDaily"></div>
                                    <div class="col-12 forecastTemp text-center">{{ fillArray[index].tempMinDaily }}</div>
                                </div>
                            </div>

                        </div> 
                    </div>
                </div>
                
                <div id="weatherVue"></div>
                
                </div>`
            });

            resolve();
        });
        await promise;

        if(colorSchema=="_light") {
            $('.invertElement').css('filter', 'invert(100%)');
        }

        illuminateButton('left');
    }
}


//Slide Arrow Indicator accross footer to indicate weather movement possibility
function slideArrow() {
    slideSlider();  
    
    function slideSlider() {
        $('.sliderArrowContainer').fadeIn(1000);
        $('#sliderArrowImg').css('margin-left', '100%');
        
        $('.sliderArrowContainer').fadeOut(1000, () => { 
            $('#sliderArrowImg').css('margin-left', '0%');
        });
    }
}



// Let the button illuminate two times
function illuminateButton(buttonSide) {
    switch (buttonSide) {
        case 'right':
            setTimeout(() => {$('#rightButton').addClass('illuminateRight');}, 1000);
            setTimeout(() => {$('#rightButton').removeClass('illuminateRight'); return true;}, 1750);
            break;

        case 'left':
            setTimeout(() => {$('#leftButton').addClass('illuminateLeft');}, 1000);
            setTimeout(() => {$('#leftButton').removeClass('illuminateLeft'); return true;}, 1750);
            break;
    
        default:
            return true;
            break;
    }
}