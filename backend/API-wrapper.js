///////////////////////////////////////
// A module for wrapping the NASA APOD
// API and providing a consistent set
// of standards and Quality of life 
// improvements.
//////////////////////////////////////
const fetcher = require("node-fetch");
const APOD_API_URL = "https://api.nasa.gov/planetary/apod";


/*************************************
 * GET the latest picture and return it.
 * @param String key
 *************************************/
function getLatestPicture(key){
   const url = `${APOD_API_URL}?api_key=${key}`;
   const options = {
      "method": "GET",
   };
   const reply = await fetcher(url, options);
   console.debug(reply);
   return reply;
}


/*************************************
 * @param Date date
 * @param String key
 ************************************/
function getPictureByDate(date, key){
   const url = `${APOD_API_URL}?api_key=${key}?date=${date}`;
   const options = {
      "method": "GET",
   };
   const reply = await fetcher(url, options);
   console.debug(reply);
   return reply;
}

module.exports.getLatestPicture = getLatestPicture;
module.exports.getPictureByDate = getPictureByDate;