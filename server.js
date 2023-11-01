// import express from our node_modules
const express = require("express");

// import cors from our node_modules - CORS is middleware between client and server
const cors = require("cors");

// run the config method of our dotenv module so we can have access to our environment variables
require("dotenv").config();

// tell the server which port to run on. We can set this in our .env but we dont have to
const PORT = process.env.PORT || 8080;

// instantiating our instance of express - we are calling it app (app is now a giant object with all the HTTP methods)
const app = express();

// ACTIVATE CORS - dont forget the brackets
app.use(cors());

// import our json data
const data = require("./data/weather.json");

// Use the .find() method to discover which city the `lat`, `lon` and `searchQuery` information belong to. If the user did not search for one of the three cities that we have information about (Seattle, Paris, or Amman), return an error.
function findCity(lat, lon) {
  // const city = data.find((cityData) => cityData.lat === lat && cityData.lon === lon);
  // if (city) {
  //   return city;
  // } else {
  //   return { error: "City not found" };
  // }
  const foundCity = data.find(
    (cityData) => cityData.lat == lat && cityData.lon == lon
  );
  return foundCity;
}

// Create an API endpoint of `/weather` that processes a `GET` request that contains `lat`, `lon` and `searchQuery` information.
app.get("/", (request, response) => {
  response.json("whoop whoop");
});

app.get("/weather", (request, response) => {
  console.log("hello");
  const weatherRes = findCity(request.query.lat, request.query.lon);
  console.log(weatherRes);
  response.json(weatherRes);
});

// start the server on our PORT, and give it a console.log to see it is working
app.listen(PORT, () => console.log(`App is running PORT ${PORT}`));
