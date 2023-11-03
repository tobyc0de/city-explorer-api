// import express from our node_modules
const express = require("express");

// import cors from our node_modules - CORS is middleware between client and server
const cors = require("cors");

// run the config method of our dotenv module so we can have access to our environment variables
require("dotenv").config();

const axios = require("axios");

// tell the server which port to run on. We can set this in our .env but we dont have to
const PORT = 10000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const LOCATION_API_KEY = process.env.LOCATION_API_KEY;

// instantiating our instance of express - we are calling it app (app is now a giant object with all the HTTP methods)
const app = express();

// ACTIVATE CORS - dont forget the brackets
app.use(cors());

async function findLocation(cityname) {
  const locationAPI = `https://eu1.locationiq.com/v1/search?q=${cityname}&key=${LOCATION_API_KEY}&format=json`;
  const locationData = await axios.get(locationAPI);
  return locationData;
}

async function findMovies(cityname) {
  const moviesAPI = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${cityname}`;
  const movieData = await axios.get(moviesAPI);
  return movieData;
}

async function findWeather(lat, lon) {
  const API = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
  const weatherData = await axios.get(API);
  return weatherData;
}

app.get("/", (request, response) => {
  response.json("whoop whoop");
});

app.get("/request", async (request, response) => {
  try {
    const locationRes = await findLocation(request.query.q);
    const movieRes = await findMovies(request.query.q);
    const weatherRes = await findWeather(
      locationRes.data[0].lat,
      locationRes.data[0].lon
    );

    // wrangle the data so that it has three objects: location, movie, weather
    const wrangledData = {
      lon: locationRes.data[0].lon,
      lat: locationRes.data[0].lat,
      location: locationRes.data[0].display_name,
      mapImgUrl: `https://maps.locationiq.com/v3/staticmap?key=${LOCATION_API_KEY}&center=${locationRes.data[0].lat},${locationRes.data[0].lon}&markers=icon:large-blue-cutout|${locationRes.data[0].lat},${locationRes.data[0].lon}`,
      movie: movieRes.data.results[0].original_title,
      movieImg: movieRes.data.results[0].poster_path,
      weather: weatherRes.data,
    };

    response.json(wrangledData);
  } catch (error) {
    console.error("Error in /request: ", error);
    response.status(500).json({ error: "An error occurred", error });
  }
});

app.listen(PORT, () => console.log(`App is running PORT ${PORT}`));
