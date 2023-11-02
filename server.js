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

// instantiating our instance of express - we are calling it app (app is now a giant object with all the HTTP methods)
const app = express();

// ACTIVATE CORS - dont forget the brackets
app.use(cors());

// import our json data
// const data = require("./data/weather.json");

// Use the .find() method to discover which city the `lat`, `lon` and `searchQuery` information belong to. If the user did not search for one of the three cities that we have information about (Seattle, Paris, or Amman), return an error.
// async function findCity(lat, lon) {
//   const API = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
//   const data = await axios.get(API);
//   const foundCity = data.find(
//     (cityData) => cityData.lat == lat && cityData.lon == lon
//   );
//   return foundCity;
// }

async function findCity(lat, lon) {
  const API = `http://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}&lat=${lat}&lon=${lon}`;
  const weatherData = await axios.get(API);
  return weatherData.data;
}

async function findMovies(cityname) {
  const moviesAPI = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${cityname}`;
  const movieData = await axios.get(moviesAPI);

  return movieData;
}

// Create an API endpoint of `/weather` that processes a `GET` request that contains `lat`, `lon` and `searchQuery` information.
app.get("/", (request, response) => {
  response.json("whoop whoop");
});
//UNCOMMENT THIS TO SHOW WEATHER AGAIN!
// app.get("/weather", async (request, response) => {
//   const weatherRes = await findCity(request.query.lat, request.query.lon);
//   response.json(weatherRes);
// });

app.get("/movies", async (request, response) => {
  const movieRes = await findMovies(request.query.city);

  const movieDataWrangled = movieRes.data.results.map((result) => {
    return {
      id: result.title + "_" + result.release_date,
      title: result.title,
      overview: result.overview,
      image_url: `https://image.tmdb.org/t/p/w500/${result.poster_path}`,
      release_date: result.release_date,
    };
  });

  response.json(movieDataWrangled[0]);
});

// start the server on our PORT, and give it a console.log to see it is working
app.listen(PORT, () => console.log(`App is running PORT ${PORT}`));
