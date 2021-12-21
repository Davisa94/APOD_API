///////////////////////////////////////
// A module for wrapping the NASA APOD
// API and providing a consistent set
// of standards and Quality of life 
// improvements.
//////////////////////////////////////
const fetcher = require("node-fetch");
const APOD_API_URL = "https://api.nasa.gov/planetary/apod?api_key=";


/*************************************
 * GET the latest picture and return it.
 *************************************/
function getLatestPicture(){
   const url = `${APOD_API_URL}${key}`;
   const options = {
      "method": "GET",
   };
   const reply = await fetcher(url, options);
   console.debug(reply);
   return reply;
}


/*************************************
 * @param Date date
 ************************************/
function getPictureByDate(date, key){
   const url = `${APOD_API_URL}${key}`;
   const options = {
      "method": "GET",
   };
   const reply = await fetcher(url, options);
   console.debug(reply);
   return reply;
}