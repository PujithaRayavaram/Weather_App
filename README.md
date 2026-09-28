# 🌦️ WeatherWave — Weather & Air Quality Dashboard

WeatherWave is a Flask-based weather dashboard that provides current weather conditions, hourly forecasts, 7-day forecasts, precipitation information, wind details, humidity information, and air-quality data for searched locations.

The application uses public weather and air-quality APIs and presents the information through a clean, interactive web interface.

## ✨ Features

* 🌡️ Current temperature
* 🌤️ Weather condition
* 🤗 Feels-like temperature
* 💧 Current humidity
* 💨 Current wind speed
* 🌧️ Precipitation information
* 🕐 Hourly weather forecast
* 📅 7-day weather forecast
* 🌅 Sunrise and sunset information
* 💨 Wind speed and direction
* 🌫️ Air Quality Index (AQI)
* 🫁 PM2.5 information
* 🌫️ PM10 information
* 🧪 NO₂ information
* 🟢 O₃ information
* 📍 Location coordinates
* 🌎 Automatic local timezone handling
* 📱 Responsive and interactive UI
* 🔍 City-based weather search

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Python
* Flask
* Requests

### APIs

* Open-Meteo Geocoding API
* Open-Meteo Weather Forecast API
* Open-Meteo Air Quality API

## 📂 Project Structure

```text
WeatherWave/
│
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

## ⚙️ How It Works

1. The user enters a city name.
2. WeatherWave sends the city name to the geocoding API.
3. The location's latitude and longitude are obtained.
4. These coordinates are sent to the weather API.
5. WeatherWave retrieves current, hourly, and daily forecast information.
6. The same coordinates are used to retrieve air-quality information.
7. JavaScript processes the API response.
8. The information is displayed dynamically on the dashboard.

## 🚀 Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project

```bash
cd WeatherWave
```

### 3. Create a virtual environment

Windows:

```bash
python -m venv venv
```

### 4. Activate the virtual environment

PowerShell:

```powershell
venv\Scripts\Activate.ps1
```

### 5. Install dependencies

```bash
pip install -r requirements.txt
```

### 6. Run the application

```bash
python app.py
```

### 7. Open the application

Open your browser and visit:

```text
http://127.0.0.1:5000
```

## 📊 Weather Data

WeatherWave retrieves:

* Temperature
* Apparent temperature
* Relative humidity
* Precipitation
* Weather condition
* Wind speed
* Wind direction
* Sunrise
* Sunset
* Daily minimum temperature
* Daily maximum temperature
* Precipitation probability

## 🌫️ Air Quality Data

WeatherWave displays:

* AQI
* PM2.5
* PM10
* Nitrogen Dioxide (NO₂)
* Ozone (O₃)

The current implementation uses the `us_aqi` value provided by the Open-Meteo Air Quality API.

## 🔌 API Sources

### Open-Meteo

WeatherWave uses Open-Meteo for:

* Geocoding
* Weather forecasts
* Air-quality information

No API key is required for the current implementation.

## ⚠️ Data Accuracy

Weather values can differ from other weather services such as Google Weather because different services may use different weather models, data sources, update times, and processing methods.

Therefore, WeatherWave should be considered an API-based weather dashboard rather than a replica of another weather provider.

## 🎯 Learning Objectives

This project was developed to practice:

* Flask web development
* REST API integration
* HTTP requests
* JSON data processing
* Frontend-backend communication
* JavaScript DOM manipulation
* Responsive UI development
* Error handling
* Working with external APIs
* Handling location and timezone data

## 🔮 Future Improvements

Possible future enhancements include:

* 🌍 Interactive map integration
* 📍 Current-location weather
* 🌙 Dark/light theme
* 🔔 Weather alerts
* 📈 Weather charts
* 🌧️ More detailed precipitation visualization
* 🌬️ More detailed air-quality visualization
* 📱 Progressive Web App support
* ☁️ Cloud deployment

## 👩‍💻 Author

**Pujitha Rayavaram**

Computer Science Engineering Student

## 📜 License

This project is created for educational and portfolio purposes.
