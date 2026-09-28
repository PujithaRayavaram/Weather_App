// ============================================================
// WEATHERWAVE - COMPLETE FRONTEND JAVASCRIPT
// ============================================================


// ============================================================
// DOM ELEMENTS
// ============================================================

const cityInput =
    document.getElementById("cityInput");

const searchButton =
    document.getElementById("searchButton");

const loading =
    document.getElementById("loading");

const errorBox =
    document.getElementById("errorBox");

const errorMessage =
    document.getElementById("errorMessage");

const weatherDashboard =
    document.getElementById("weatherDashboard");


// ============================================================
// WEATHER CODE → ICON + DESCRIPTION
// ============================================================

function getWeatherInfo(code) {

    const weatherMap = {

        0: {
            icon: "☀️",
            description: "Clear Sky"
        },

        1: {
            icon: "🌤️",
            description: "Mainly Clear"
        },

        2: {
            icon: "⛅",
            description: "Partly Cloudy"
        },

        3: {
            icon: "☁️",
            description: "Overcast"
        },

        45: {
            icon: "🌫️",
            description: "Fog"
        },

        48: {
            icon: "🌫️",
            description: "Rime Fog"
        },

        51: {
            icon: "🌦️",
            description: "Light Drizzle"
        },

        53: {
            icon: "🌦️",
            description: "Drizzle"
        },

        55: {
            icon: "🌧️",
            description: "Heavy Drizzle"
        },

        56: {
            icon: "🌧️",
            description: "Freezing Drizzle"
        },

        57: {
            icon: "🌧️",
            description: "Heavy Freezing Drizzle"
        },

        61: {
            icon: "🌧️",
            description: "Light Rain"
        },

        63: {
            icon: "🌧️",
            description: "Moderate Rain"
        },

        65: {
            icon: "🌧️",
            description: "Heavy Rain"
        },

        66: {
            icon: "🌧️",
            description: "Freezing Rain"
        },

        67: {
            icon: "🌧️",
            description: "Heavy Freezing Rain"
        },

        71: {
            icon: "🌨️",
            description: "Light Snow"
        },

        73: {
            icon: "❄️",
            description: "Snow"
        },

        75: {
            icon: "❄️",
            description: "Heavy Snow"
        },

        77: {
            icon: "🌨️",
            description: "Snow Grains"
        },

        80: {
            icon: "🌦️",
            description: "Light Rain Showers"
        },

        81: {
            icon: "🌧️",
            description: "Rain Showers"
        },

        82: {
            icon: "⛈️",
            description: "Heavy Rain Showers"
        },

        85: {
            icon: "🌨️",
            description: "Snow Showers"
        },

        86: {
            icon: "❄️",
            description: "Heavy Snow Showers"
        },

        95: {
            icon: "⛈️",
            description: "Thunderstorm"
        },

        96: {
            icon: "⛈️",
            description: "Thunderstorm + Hail"
        },

        99: {
            icon: "⛈️",
            description: "Heavy Thunderstorm + Hail"
        }

    };

    return weatherMap[code] || {

        icon: "🌤️",

        description: "Unknown Weather"

    };
}


// ============================================================
// TIME HELPERS
// ============================================================

// Open-Meteo returns the requested city's local time.
// We format the timestamp directly instead of letting the
// browser convert it to the user's own timezone.

function formatTime(dateTime) {

    if (!dateTime) {
        return "--";
    }

    const parts =
        String(dateTime).split("T");

    if (parts.length < 2) {
        return String(dateTime);
    }

    const time =
        parts[1].substring(0, 5);

    const [hourString, minute] =
        time.split(":");

    let hour =
        parseInt(hourString, 10);

    const suffix =
        hour >= 12 ? "PM" : "AM";

    hour =
        hour % 12 || 12;

    return `${hour}:${minute} ${suffix}`;
}


function formatHour(dateTime, isNow = false) {

    if (isNow) {
        return "Now";
    }

    return formatTime(dateTime);
}


function formatDay(dateString, index) {

    if (index === 0) {
        return "Today";
    }

    if (!dateString) {
        return "--";
    }

    const date =
        new Date(`${dateString}T12:00:00`);

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short"
        }
    );
}


// ============================================================
// NUMBER HELPER
// ============================================================

function safeNumber(value, fallback = 0) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


// ============================================================
// SEARCH WEATHER
// ============================================================

async function searchWeather() {

    const city =
        cityInput
            ? cityInput.value.trim()
            : "";

    if (!city) {

        showError(
            "Please enter a city name."
        );

        return;
    }


    // Hide previous error

    if (errorBox) {
        errorBox.classList.add("hidden");
    }


    // Hide previous dashboard

    if (weatherDashboard) {
        weatherDashboard.classList.add("hidden");
    }


    // Show loading

    if (loading) {
        loading.classList.remove("hidden");
    }


    try {

        const response =
            await fetch(
                `/weather?city=${encodeURIComponent(city)}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to fetch weather data."
            );

        }


        console.log(
            "Weather API response:",
            data
        );


        displayWeather(data);


    }

    catch (error) {

        console.error(
            "Weather error:",
            error
        );

        showError(
            error.message ||
            "Unable to get weather information."
        );

    }

    finally {

        if (loading) {
            loading.classList.add("hidden");
        }

    }
}


// ============================================================
// DISPLAY WEATHER
// ============================================================

function displayWeather(data) {

    const location =
        data.location || {};

    const current =
        data.current || {};

    const hourly =
        data.hourly || {};

    const daily =
        data.daily || {};

    const airQuality =
        data.air_quality || {};


    displayAirQuality(data.air_quality);


    // ========================================================
    // LOCATION
    // ========================================================

    setText(
        "cityName",
        location.city || "--"
    );

    setText(
        "countryName",
        location.country || ""
    );


    // ========================================================
    // CURRENT WEATHER
    // ========================================================

    const weatherInfo =
        getWeatherInfo(
            current.weather_code
        );


    setText(
        "weatherIcon",
        weatherInfo.icon
    );


    setText(
        "weatherDescription",
        weatherInfo.description
    );


    setText(
        "temperature",
        Math.round(
            safeNumber(
                current.temperature_2m
            )
        )
    );


    setText(
        "feelsLike",
        `${Math.round(
            safeNumber(
                current.apparent_temperature
            )
        )}°C`
    );


    setText(
        "humiditySummary",
        `· ${Math.round(
            safeNumber(
                current.relative_humidity_2m
            )
        )}%`
    );


    setText(
        "windSummary",
        `· ${Math.round(
            safeNumber(
                current.wind_speed_10m
            )
        )} km/h`
    );


    setText(
        "precipSummary",
        `· ${safeNumber(
            current.precipitation
        ).toFixed(1)} mm`
    );


    // ========================================================
    // COORDINATES
    // ========================================================

    setText(
        "coordinates",
        `${safeNumber(
            location.latitude
        ).toFixed(2)}, ${safeNumber(
            location.longitude
        ).toFixed(2)}`
    );


    // ========================================================
    // LOCAL TIME
    // ========================================================

    setText(
        "localTime",
        formatTime(
            current.time
        )
    );


    // ========================================================
    // SUNRISE / SUNSET
    // ========================================================

    setText(
        "sunrise",
        formatTime(
            daily.sunrise
                ? daily.sunrise[0]
                : null
        )
    );


    setText(
        "sunset",
        formatTime(
            daily.sunset
                ? daily.sunset[0]
                : null
        )
    );


    // ========================================================
    // HOURLY FORECAST
    // ========================================================

    displayHourly(hourly);


    // ========================================================
    // DETAIL PANELS
    // ========================================================

    displayPrecipitationDetails(
        hourly
    );


    displayWindDetails(
        hourly
    );


    displayHumidityDetails(
        hourly
    );


    displayAirQuality(
        airQuality
    );


    // ========================================================
    // 7-DAY FORECAST
    // ========================================================

    displayForecast(
        daily
    );


    // ========================================================
    // SHOW DASHBOARD
    // ========================================================

    if (weatherDashboard) {

        weatherDashboard.classList.remove(
            "hidden"
        );

    }
}


// ============================================================
// SAFE TEXT UPDATE
// ============================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }
}


// ============================================================
// HOURLY FORECAST
// ============================================================

function displayHourly(hourly) {

    const container =
        document.getElementById(
            "hourlyContainer"
        );


    if (!container) {

        console.error(
            "hourlyContainer not found!"
        );

        return;
    }


    container.innerHTML = "";


    if (
        !hourly ||
        !hourly.time ||
        !hourly.time.length
    ) {

        container.innerHTML = `
            <p style="
                color:#a7afbf;
                padding:20px;
            ">
                Hourly forecast unavailable.
            </p>
        `;

        return;
    }


    // --------------------------------------------------------
    // Open-Meteo forecast_hours starts from current hour.
    // Therefore index 0 is our "Now".
    // --------------------------------------------------------

    let startIndex = 0;


    // Safety fallback:
    // If API happens to return older timestamps,
    // find the closest hour.

    const firstTime =
        new Date(hourly.time[0]);


    const now =
        new Date();


    if (
        firstTime.getTime() >
        now.getTime() + 2 * 60 * 60 * 1000
    ) {

        let smallestDifference =
            Infinity;


        hourly.time.forEach(
            (time, index) => {

                const difference =
                    Math.abs(
                        new Date(time).getTime() -
                        now.getTime()
                    );


                if (
                    difference <
                    smallestDifference
                ) {

                    smallestDifference =
                        difference;

                    startIndex =
                        index;

                }

            }
        );

    }


    // --------------------------------------------------------
    // Show next 12 hours
    // --------------------------------------------------------

    const endIndex =
        Math.min(
            startIndex + 12,
            hourly.time.length
        );


    for (
        let i = startIndex;
        i < endIndex;
        i++
    ) {

        const time =
            hourly.time[i];


        const temperature =
            safeNumber(
                hourly.temperature_2m
                    ? hourly.temperature_2m[i]
                    : 0
            );


        const weatherCode =
            hourly.weather_code
                ? hourly.weather_code[i]
                : 0;


        const rainProbability =
            hourly.precipitation_probability
                ? safeNumber(
                    hourly
                        .precipitation_probability[i]
                )
                : 0;


        const info =
            getWeatherInfo(
                weatherCode
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "hour-card";


        if (i === startIndex) {

            card.classList.add(
                "active"
            );

        }


        card.innerHTML = `

            <div class="hour-time">
                ${formatHour(
                    time,
                    i === startIndex
                )}
            </div>

            <div class="hour-icon">
                ${info.icon}
            </div>

            <div class="hour-temp">
                ${Math.round(
                    temperature
                )}°C
            </div>

            <div class="rain-prob">
                💧 ${Math.round(
                    rainProbability
                )}%
            </div>

        `;


        container.appendChild(
            card
        );

    }
}


// ============================================================
// 7-DAY FORECAST
// ============================================================

function displayForecast(daily) {

    const container =
        document.getElementById(
            "forecastContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !daily ||
        !daily.time ||
        !daily.time.length
    ) {

        return;
    }


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const info =
            getWeatherInfo(
                daily.weather_code
                    ? daily.weather_code[i]
                    : 0
            );


        const maxTemp =
            Math.round(
                safeNumber(
                    daily.temperature_2m_max
                        ? daily.temperature_2m_max[i]
                        : 0
                )
            );


        const minTemp =
            Math.round(
                safeNumber(
                    daily.temperature_2m_min
                        ? daily.temperature_2m_min[i]
                        : 0
                )
            );


        const rainProbability =
            daily.precipitation_probability_max
                ? Math.round(
                    safeNumber(
                        daily
                            .precipitation_probability_max[i]
                    )
                )
                : null;


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "day-card";


        if (i === 0) {

            card.classList.add(
                "active"
            );

        }


        card.innerHTML = `

            <div class="day-name">
                ${formatDay(
                    daily.time[i],
                    i
                )}
            </div>

            <div class="day-icon">
                ${info.icon}
            </div>

            <div class="day-temp">
                ${maxTemp}°
            </div>

            <div class="day-low">
                ${minTemp}°
            </div>

            ${
                rainProbability !== null
                ?
                `
                <div class="rain-prob">
                    💧 ${rainProbability}%
                </div>
                `
                :
                ""
            }

        `;


        container.appendChild(
            card
        );

    }
}


// ============================================================
// PRECIPITATION DETAILS
// ============================================================

function displayPrecipitationDetails(hourly) {

    const container =
        document.getElementById(
            "precipHourly"
        );


    const totalElement =
        document.getElementById(
            "precipTotal"
        );


    const summaryElement =
        document.getElementById(
            "precipSummary"
        );


    if (!hourly || !hourly.time) {
        return;
    }


    const values =
        hourly.precipitation || [];


    const probabilities =
        hourly.precipitation_probability || [];


    const times =
        hourly.time || [];


    if (summaryElement) {

        summaryElement.textContent =
            `· ${Math.round(
                safeNumber(
                    probabilities[0]
                )
            )}%`;

    }


    // --------------------------------------------------------
    // Next 24-hour total
    // --------------------------------------------------------

    const total =
        values
            .slice(0, 24)
            .reduce(
                (sum, value) =>
                    sum +
                    safeNumber(value),
                0
            );


    if (totalElement) {

        totalElement.textContent =
            `${total.toFixed(1)} mm`;

    }


    if (!container) {
        return;
    }


    container.innerHTML = "";


    // --------------------------------------------------------
    // Next 8 hours
    // --------------------------------------------------------

    const count =
        Math.min(
            8,
            times.length
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const amount =
            safeNumber(
                values[i]
            );


        const probability =
            Math.round(
                safeNumber(
                    probabilities[i]
                )
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "mini-weather-item";


        card.innerHTML = `

            <span>
                ${formatHour(
                    times[i],
                    i === 0
                )}
            </span>

            <strong>
                ${probability}%
            </strong>

            <small>
                ${
                    amount < 0.25
                    ? "<0.25"
                    : amount.toFixed(1)
                } mm
            </small>

        `;


        container.appendChild(
            card
        );

    }
}


// ============================================================
// WIND DETAILS
// ============================================================

function getWindDirection(degrees) {

    const directions = [

        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW"

    ];


    const value =
        safeNumber(
            degrees
        );


    const index =
        Math.round(
            value / 45
        ) % 8;


    return directions[index];
}


function displayWindDetails(hourly) {

    const summaryElement =
        document.getElementById(
            "windSummary"
        );


    const maximumElement =
        document.getElementById(
            "windMaximum"
        );


    const container =
        document.getElementById(
            "windHourly"
        );


    if (!hourly || !hourly.time) {
        return;
    }


    const speeds =
        hourly.wind_speed_10m || [];


    const directions =
        hourly.wind_direction_10m || [];


    const times =
        hourly.time || [];


    // --------------------------------------------------------
    // Current wind
    // --------------------------------------------------------

    if (summaryElement) {

        const speed =
            Math.round(
                safeNumber(
                    speeds[0]
                )
            );


        const direction =
            getWindDirection(
                directions[0]
            );


        summaryElement.textContent =
            `· ${speed} km/h ${direction}`;

    }


    // --------------------------------------------------------
    // Maximum next 24 hours
    // --------------------------------------------------------

    const next24 =
        speeds
            .slice(0, 24)
            .map(
                value =>
                    safeNumber(value)
            );


    const maximum =
        next24.length
            ? Math.max(...next24)
            : 0;


    if (maximumElement) {

        maximumElement.textContent =
            `${Math.round(
                maximum
            )} km/h`;

    }


    if (!container) {
        return;
    }


    container.innerHTML = "";


    // --------------------------------------------------------
    // Next 8 hours
    // --------------------------------------------------------

    const count =
        Math.min(
            8,
            times.length
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const speed =
            Math.round(
                safeNumber(
                    speeds[i]
                )
            );


        const direction =
            getWindDirection(
                directions[i]
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "mini-weather-item";


        card.innerHTML = `

            <span>
                ${formatHour(
                    times[i],
                    i === 0
                )}
            </span>

            <strong>
                ${speed} km/h
            </strong>

            <small>
                ${direction}
            </small>

        `;


        container.appendChild(
            card
        );

    }
}


// ============================================================
// HUMIDITY DETAILS
// ============================================================

function displayHumidityDetails(hourly) {

    const summaryElement =
        document.getElementById(
            "humiditySummary"
        );


    const averageElement =
        document.getElementById(
            "humidityAverage"
        );


    const container =
        document.getElementById(
            "humidityHourly"
        );


    if (!hourly || !hourly.time) {
        return;
    }


    const humidity =
        hourly.relative_humidity_2m || [];


    const times =
        hourly.time || [];


    // --------------------------------------------------------
    // Current humidity
    // --------------------------------------------------------

    if (summaryElement) {

        summaryElement.textContent =
            `· ${Math.round(
                safeNumber(
                    humidity[0]
                )
            )}%`;

    }


    // --------------------------------------------------------
    // Next 24-hour average
    // --------------------------------------------------------

    const values =
        humidity
            .slice(0, 24)
            .map(
                value =>
                    safeNumber(value)
            );


    const average =
        values.length
            ? values.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / values.length
            : 0;


    if (averageElement) {

        averageElement.textContent =
            `${Math.round(
                average
            )}%`;

    }


    if (!container) {
        return;
    }


    container.innerHTML = "";


    // --------------------------------------------------------
    // Next 8 hours
    // --------------------------------------------------------

    const count =
        Math.min(
            8,
            times.length
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const value =
            Math.round(
                safeNumber(
                    humidity[i]
                )
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "mini-weather-item";


        card.innerHTML = `

            <span>
                ${formatHour(
                    times[i],
                    i === 0
                )}
            </span>

            <strong>
                ${value}%
            </strong>

        `;


        container.appendChild(
            card
        );

    }
}


// ============================================================
// AIR QUALITY
// ============================================================

function getAQIStatus(aqi) {

    const value =
        safeNumber(
            aqi,
            -1
        );


    if (value < 0) {
        return "Unavailable";
    }


    // European AQI bands from Open-Meteo

    if (value <= 20) {
        return "Good";
    }


    if (value <= 40) {
        return "Fair";
    }


    if (value <= 60) {
        return "Moderate";
    }


    if (value <= 80) {
        return "Poor";
    }


    if (value <= 100) {
        return "Very Poor";
    }


    return "Extremely Poor";
}


function displayAirQuality(airQuality) {

    console.log("AIR QUALITY DATA:", airQuality);

    if (!airQuality) {
        console.log("No air quality data available");
        return;
    }

    const aqi = airQuality.us_aqi;

    const pm25 = airQuality.pm2_5;
    const pm10 = airQuality.pm10;
    const no2 = airQuality.nitrogen_dioxide;
    const o3 = airQuality.ozone;


    // ==========================================
    // AQI STATUS
    // ==========================================

    let status = "";

    if (aqi <= 50) {
        status = "Good";
    }
    else if (aqi <= 100) {
        status = "Moderate";
    }
    else if (aqi <= 150) {
        status = "Unhealthy for sensitive groups";
    }
    else if (aqi <= 200) {
        status = "Unhealthy";
    }
    else if (aqi <= 300) {
        status = "Very Unhealthy";
    }
    else {
        status = "Hazardous";
    }


    // ==========================================
    // UPDATE AQI NUMBER
    // ==========================================

    const aqiNumber =
        document.getElementById("aqiNumber");

    if (aqiNumber) {

        aqiNumber.textContent =
            Math.round(aqi);

    }


    // ==========================================
    // UPDATE AQI STATUS
    // ==========================================

    const aqiStatus =
        document.getElementById("aqiStatus");

    if (aqiStatus) {

        aqiStatus.textContent =
            status;

    }


    // ==========================================
    // UPDATE AIR SUMMARY
    // ==========================================

    const airSummary =
        document.getElementById("airSummary");

    if (airSummary) {

        airSummary.textContent =
            `· ${Math.round(aqi)} · ${status}`;

    }


    // ==========================================
    // PM2.5
    // ==========================================

    const pm25Element =
        document.getElementById("pm25");

    if (pm25Element) {

        pm25Element.textContent =
            `${Number(pm25).toFixed(1)} μg/m³`;

    }


    // ==========================================
    // PM10
    // ==========================================

    const pm10Element =
        document.getElementById("pm10");

    if (pm10Element) {

        pm10Element.textContent =
            `${Number(pm10).toFixed(1)} μg/m³`;

    }


    // ==========================================
    // NO2
    // ==========================================

    const no2Element =
        document.getElementById("no2");

    if (no2Element) {

        no2Element.textContent =
            `${Number(no2).toFixed(1)} μg/m³`;

    }


    // ==========================================
    // O3
    // ==========================================

    const o3Element =
        document.getElementById("o3");

    if (o3Element) {

        o3Element.textContent =
            `${Number(o3).toFixed(1)} μg/m³`;

    }


    console.log("AQI UI UPDATED:", {
        aqi,
        status,
        pm25,
        pm10,
        no2,
        o3
    });
}
function formatPollutant(value) {

    if (
        value === undefined ||
        value === null ||
        !Number.isFinite(
            Number(value)
        )
    ) {

        return "--";
    }


    return `${Number(value).toFixed(1)} μg/m³`;
}


// ============================================================
// EXPAND / COLLAPSE DETAILS
// ============================================================

function togglePanel(panelId) {

    const panel =
        document.getElementById(
            panelId
        );


    if (!panel) {
        return;
    }


    const parent =
        panel.closest(
            ".detail-panel"
        );


    if (!parent) {
        return;
    }


    parent.classList.toggle(
        "open"
    );
}


// ============================================================
// ERROR
// ============================================================

function showError(message) {

    if (errorMessage) {

        errorMessage.textContent =
            message;

    }


    if (errorBox) {

        errorBox.classList.remove(
            "hidden"
        );

    }


    if (weatherDashboard) {

        weatherDashboard.classList.add(
            "hidden"
        );

    }
}


// ============================================================
// SEARCH BUTTON
// ============================================================

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchWeather
    );

}


// ============================================================
// ENTER KEY
// ============================================================

if (cityInput) {

    cityInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                searchWeather();

            }

        }
    );

}


// ============================================================
// THEME BUTTON
// ============================================================

const themeButton =
    document.getElementById(
        "themeButton"
    );


if (themeButton) {

    themeButton.addEventListener(
        "click",
        function() {

            document.body.classList.toggle(
                "light-mode"
            );


            if (
                document.body.classList.contains(
                    "light-mode"
                )
            ) {

                themeButton.textContent =
                    "☀️";

            }

            else {

                themeButton.textContent =
                    "🌙";

            }

        }
    );

}

function displayAirQuality(airQuality) {

    if (!airQuality || !airQuality.current) {
        console.log("No air quality data received");
        return;
    }

    const current = airQuality.current;

    console.log("AIR QUALITY DATA:", current);


    // ==============================
    // AQI
    // ==============================

    const aqiElement = document.getElementById("aqiNumber");

    if (aqiElement) {
        const aqi = current.us_aqi;

        aqiElement.textContent =
            aqi !== undefined && aqi !== null
                ? Math.round(aqi)
                : "--";
    }


    // ==============================
    // AQI STATUS
    // ==============================

    const statusElement =
        document.getElementById("aqiStatus");

    const summaryElement =
        document.getElementById("airSummary");


    if (
        statusElement &&
        current.us_aqi !== undefined &&
        current.us_aqi !== null
    ) {

        const aqi = current.us_aqi;

        let status = "";

        if (aqi <= 50) {
            status = "Good";
        }
        else if (aqi <= 100) {
            status = "Moderate";
        }
        else if (aqi <= 150) {
            status = "Unhealthy for sensitive groups";
        }
        else if (aqi <= 200) {
            status = "Unhealthy";
        }
        else if (aqi <= 300) {
            status = "Very Unhealthy";
        }
        else {
            status = "Hazardous";
        }

        statusElement.textContent =
            status;


        if (summaryElement) {
            summaryElement.textContent =
                `· ${Math.round(aqi)} · ${status}`;
        }
    }


    // ==============================
    // PM2.5
    // ==============================

    const pm25Element =
        document.getElementById("pm25");

    if (pm25Element) {

        const value = current.pm2_5;

        pm25Element.textContent =
            value !== undefined && value !== null
                ? `${Number(value).toFixed(1)} μg/m³`
                : "--";
    }


    // ==============================
    // PM10
    // ==============================

    const pm10Element =
        document.getElementById("pm10");

    if (pm10Element) {

        const value = current.pm10;

        pm10Element.textContent =
            value !== undefined && value !== null
                ? `${Number(value).toFixed(1)} μg/m³`
                : "--";
    }


    // ==============================
    // NO2
    // ==============================

    const no2Element =
        document.getElementById("no2");

    if (no2Element) {

        const value =
            current.nitrogen_dioxide;

        no2Element.textContent =
            value !== undefined && value !== null
                ? `${Number(value).toFixed(1)} μg/m³`
                : "--";
    }


    // ==============================
    // OZONE
    // ==============================

    const o3Element =
        document.getElementById("o3");

    if (o3Element) {

        const value =
            current.ozone;

        o3Element.textContent =
            value !== undefined && value !== null
                ? `${Number(value).toFixed(1)} μg/m³`
                : "--";
    }

}