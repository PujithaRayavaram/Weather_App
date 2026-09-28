from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/weather")
def weather():

    city = request.args.get("city", "").strip()

    if not city:
        return jsonify({
            "error": "Please enter a city name."
        }), 400

    try:

        # ==========================================
        # 1. CITY → LATITUDE / LONGITUDE
        # ==========================================

        geo_params = {
            "name": city,
            "count": 10,
            "language": "en",
            "format": "json",
            "countryCode": "IN"
        }

        geo_response = requests.get(
            GEOCODING_URL,
            params=geo_params,
            timeout=10
        )

        geo_response.raise_for_status()

        geo_data = geo_response.json()

        if not geo_data.get("results"):
            return jsonify({
                "error": f"Could not find '{city}'. Please check the city name."
            }), 404

        results = geo_data["results"]

        # Prefer exact city-name match
        exact_matches = [
            result
            for result in results
            if result.get("name", "").lower() == city.lower()
        ]

        if exact_matches:
            location = exact_matches[0]
        else:
            location = results[0]

        latitude = location["latitude"]
        longitude = location["longitude"]

        city_name = location.get("name", city)
        country = location.get("country", "")
        country_code = location.get("country_code", "")


        # ==========================================
        # 2. WEATHER DATA
        # ==========================================

        weather_params = {

            "latitude": latitude,
            "longitude": longitude,

            # Current weather
            "current": (
                "temperature_2m,"
                "relative_humidity_2m,"
                "apparent_temperature,"
                "precipitation,"
                "weather_code,"
                "wind_speed_10m,"
                "is_day"
            ),

            # Hourly weather
            "hourly": (
                "temperature_2m,"
                "apparent_temperature,"
                "relative_humidity_2m,"
                "precipitation_probability,"
                "precipitation,"
                "weather_code,"
                "wind_speed_10m,"
                "wind_direction_10m"
            ),

            # Daily weather
            "daily": (
                "weather_code,"
                "temperature_2m_max,"
                "temperature_2m_min,"
                "sunrise,"
                "sunset,"
                "precipitation_sum,"
                "precipitation_probability_max,"
                "wind_speed_10m_max"
            ),

            # Automatically use local timezone
            "timezone": "auto",

            # 7-day forecast
            "forecast_days": 7,

            # Current + next 48 hours
            "forecast_hours": 48
        }


        weather_response = requests.get(
            WEATHER_URL,
            params=weather_params,
            timeout=10
        )

        weather_response.raise_for_status()

        weather_data = weather_response.json()


        # ==========================================
        # 2B. AIR QUALITY DATA
        # ==========================================

        air_params = {

            "latitude": latitude,
            "longitude": longitude,

            "current": (
                "us_aqi,"
                "pm2_5,"
                "pm10,"
                "nitrogen_dioxide,"
                "ozone"
            ),

            "hourly": (
                "us_aqi,"
                "pm2_5,"
                "pm10,"
                "nitrogen_dioxide,"
                "ozone"
            ),

            "timezone": "auto",

            "forecast_hours": 48
        }


        air_response = requests.get(
            AIR_QUALITY_URL,
            params=air_params,
            timeout=10
        )

        air_response.raise_for_status()

        air_data = air_response.json()


        # ==========================================
        # 3. SEND DATA TO FRONTEND
        # ==========================================

        response = {

            "location": {

                "city": city_name,
                "country": country,
                "country_code": country_code,

                "latitude": latitude,
                "longitude": longitude
            },


            # --------------------------------------
            # CURRENT WEATHER
            # --------------------------------------

            "current": weather_data.get(
                "current",
                {}
            ),


            # --------------------------------------
            # HOURLY WEATHER
            # --------------------------------------

            "hourly": weather_data.get(
                "hourly",
                {}
            ),


            # --------------------------------------
            # DAILY WEATHER
            # --------------------------------------

            "daily": weather_data.get(
                "daily",
                {}
            ),


            # --------------------------------------
            # AIR QUALITY
            # --------------------------------------

            "air_quality": {

                "current": air_data.get(
                    "current",
                    {}
                ),

                "hourly": air_data.get(
                    "hourly",
                    {}
                ),

                "units": {

                    "current": air_data.get(
                        "current_units",
                        {}
                    ),

                    "hourly": air_data.get(
                        "hourly_units",
                        {}
                    )
                }
            },


            # --------------------------------------
            # WEATHER UNITS
            # --------------------------------------

            "units": {

                "current": weather_data.get(
                    "current_units",
                    {}
                ),

                "hourly": weather_data.get(
                    "hourly_units",
                    {}
                ),

                "daily": weather_data.get(
                    "daily_units",
                    {}
                )
            },


            # --------------------------------------
            # TIMEZONE
            # --------------------------------------

            "timezone": weather_data.get(
                "timezone"
            ),

            "timezone_abbreviation": weather_data.get(
                "timezone_abbreviation"
            )
        }


        return jsonify(response)


    # ==========================================
    # ERROR HANDLING
    # ==========================================

    except requests.exceptions.Timeout:

        return jsonify({
            "error": (
                "Weather service took too long "
                "to respond. Please try again."
            )
        }), 504


    except requests.exceptions.RequestException as e:

        print("REQUEST ERROR:", e)

        return jsonify({
            "error": (
                f"Weather service error: {str(e)}"
            )
        }), 503


    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "error": (
                "Something went wrong while "
                "getting weather data."
            )
        }), 500


if __name__ == "__main__":

    app.run(debug=True)