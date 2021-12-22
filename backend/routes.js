import * as wrapper from "./API-wrapper.js";
import * as DBinteractor from "./db-manager.js";
import * as utility from "./utilities.js";
import * as secrets from "./secrets.js";
const DBhost = secrets.DBhost;
const DBuser = secrets.DBuser;
const DBpassword = secrets.DBpassword;
const DBschema = secrets.DBschema;
const API_key = secrets.API_key;
import mysql from 'mysql2';


const DBconnection = mysql.createConnection({

   host: DBhost,
   user: DBuser,
   password: DBpassword,
   database: DBschema
});

// test DB connection
DBconnection.connect(function (err) {
   if (err) throw err;
   console.log("Succesfully connected to the database");
})

/********************************************
 * GET a picture from APOD or the DB if it is
 * there already
 * OPTIONAL in query parameters:
 * pictureDate ~ provide a date here if you
 * want to view a picture from a date that is
 * not today and the database will try to get
 * it if it the app has stored it.
 ********************************************/
async function getPicture(req, res) {
   /****************************************
       * first we query the database to see if the 
       * provided date or current date if none was
       * provided exist in the database if not we 
       * fetch the image, save it locally, then 
       * insert its URI Along with the current date
       * into the database
       ****************************************/
   var queryResponse;
   var responseJSON;
   var pictureDate = new Date(req.query.pictureDate);
   var today = new Date();

   // check if we have a date or not
   if (pictureDate.toString() == "Invalid Date") {
      // No Date or invalid Date, we assume they want today's picture
      console.warn("Invalid or missing Date; serving todays picture");
      pictureDate = utility.MySQLfyDate(today)
   }
   queryResponse = await DBinteractor.getPictureByDate(pictureDate, DBconnection);
   // its not in the database, lets add it and return that data.
   if (queryResponse.length < 1) {
      console.warn(`no results found, fetching picture for date ${pictureDate}`);
      try{
         pictureDate = utility.MySQLfyDate(pictureDate)
      }
      catch (e){
         console.warn("Date already in the proper format");
      }
      var fetched = await wrapper.getPictureByDate(pictureDate, API_key);
      queryResponse = await DBinteractor.setPicture(fetched.hdurl, pictureDate, DBconnection);
      if (queryResponse["error"].toString().includes("APOD API Error")) {
         responseJSON = Object.assign({ "inserted": false }, queryResponse);
      }
      else{
         // return the query and that we inserted into the database.
         responseJSON = Object.assign({ "inserted": true }, queryResponse);
      }

   }
   else {
      // return that we got the picture from the databse plus the info
      responseJSON = Object.assign({ "inserted": false }, queryResponse[0]);
   }
   res.json(responseJSON);
}

/********************************************
 * DELETE a user in the database 
 * NEEDS in the body:
 * email ~ The email of the user to be 
 *         deleted.
 ********************************************/
async function deleteUser(req, res){
   var jsonResponse = "";
   var queryResponse;
   var email = req.body["email"];
   // verify that we got an email to use:
   if (!email) {
      jsonResponse = { 'error': 'invalid or missing email', 'info': 'Please enter a valid email and try again' }
   }
   else {
      // attempt to delete user by email
      console.log(`Trying to delete user with email ${email}`);
      queryResponse = await DBinteractor.deleteUser(email, DBconnection);
      if (queryResponse["affectedRows"] < 1) {
         jsonResponse = { "deleted": false, "email": `${email}` };
      }
      else {
         jsonResponse = { "deleted": true, "email": `${email}` };
      }
      // if not then lets try to add it
   }
   res.json(jsonResponse);
}

/********************************************
 * POST a new user into the database 
 * NEEDS in the body:
 * newEmail ~ the email of the new user
 *    if we also are given an oldEmail
 *    then it is used as the new email for
 *    the user with oldEmail.
 * oldEmail ~ (optional) Only needed if we 
 *    are going to update an existing user
 *    it is the old email for the user.
 ********************************************/
async function postUser(req, res){
   var jsonResponse = "";
   var queryResponse;
   var newEmail = req.body["newEmail"];
   var oldEmail = req.body["oldEmail"];
   // if we are given two emails, lets update it:
   if (Object.keys(req.body).length > 1) {
      queryResponse = await DBinteractor.updateUser(oldEmail, newEmail, DBconnection);
   }
   // if not then lets try to add it
   else {
      console.log(newEmail);
      if (!newEmail) {
         // #TODO: add email validation here
         console.warn("Invalid or missing Email");
         jsonResponse = "Invalid or missing email; Did you add the 'email' body parameter?";
      }
      // Try to add user
      queryResponse = await DBinteractor.setUser(newEmail, DBconnection);
   }
   jsonResponse = queryResponse;
   res.json(jsonResponse);
}

/********************************************
 * DELETE a users rating
 * NEEDS in body
 * email ~ email of rater
 * pictureDate ~ date of the picture that was rated
 *********************************************/
async function deleteUserRating(req, res){
   // get the email of the rating we want to delete
   var jsonResponse = "";
   var email = req.body["email"];
   // get the date of the rating to be deleted
   var pictureDate = new Date(req.body["pictureDate"]);
   console.log(pictureDate.toString());
   // if we are not provided with a date to delete on return an error
   if (pictureDate.toString() == "Invalid Date") {
      console.warn("Invalid or missing Date");
      jsonResponse = "Invalid or missing date; Did you add the 'pictureDate' query parameter?";
   }
   else if (!email) {
      // #TODO: add email validation here
      console.warn("Invalid or missing Email");
      jsonResponse = "Invalid or missing email; Did you add the 'email' query parameter?";
   }
   else {
      const queryResponse = await DBinteractor.deleteRating(pictureDate, email, DBconnection);
      if (queryResponse["affectedRows"] < 1) {
         jsonResponse = { "deleted": false, "email": `${email}` };
      }
      else {
         jsonResponse = { "deleted": true, "email": `${email}` };
      }
   }
   res.json(jsonResponse);

}

/********************************************
 * Helper function that handles a lot of the
 * logic for the postUserRating Function
 * attempts to actually insert or update
 * the rating, whichever is appropriate
 ********************************************/
async function userRatingHandler(req){
   var rating = req.body["rating"];
   var email = req.body["email"];
   var pictureDate = new Date(req.body["pictureDate"]);
   var jsonResponse;
   // verify if the rating already exists
   // convert date to SQL format YYYY-MM-DD
   pictureDate = utility.MySQLfyDate(pictureDate);
   var queryResponse = await DBinteractor.setRating(rating, pictureDate, email, DBconnection);
   // check if we inserted the record, if not we need to update it
   if (queryResponse.toString().includes("Duplicate entry")) {
      queryResponse = await DBinteractor.updateRating(rating, pictureDate, email, DBconnection);
      if (queryResponse["affectedRows"] == 1) {
         console.log("Rating updated!");
         jsonResponse = Object.assign({ "success": true, "updated": true }, req.body);
         console.log(jsonResponse);

      }
      else {
         console.log("Rating added!");
         jsonResponse = Object.assign({ "success": true, "updated": false }, req.body);
         console.log(jsonResponse);
      }
   }
   else if (queryResponse.toString().includes("Picture from the date")) {
      // fetch the picture with the date
      // await getPicture(req, res);
      // attempt to rate the picture again
      var fetched = await wrapper.getPictureByDate(pictureDate, API_key);
      queryResponse = await DBinteractor.setPicture(fetched.hdurl, pictureDate, DBconnection);
      jsonResponse = Object.assign({ "success" : true, "updated" : false }, req.body);
   }
   return await jsonResponse;
}

/********************************************
 * POST a rating given the date the picture
 * was posted using APOD
 * NEEDS in the body:
 * rating (1-5)
 * email
 * pictureDate ~ the date the picture was
 *    first posted on APOD
 *    WILL update a rating if it already exists
 *    IF it is updated it will return the request
 *    as well as a success tag with true
 ********************************************/
async function postUserRating(req, res){
   // var jsonResponse;
   // jsonResponse = await userRatingHandler(req);
   // await res.json(jsonResponse);

   var result = await userRatingHandler(req);
   res.json(result);
   // return jsonResponse;
}

/********************************************
 * GET all of a users ratings
 * NEEDS:
 * parameter for email
 * i.e /userRatings?email="email"
 ********************************************/
async function getUsersRatings(req, res){
   const queryResponse = await DBinteractor.getRatingsByEmail(req.query.email, DBconnection);
   console.log(req.query);
   res.json(queryResponse);
}

export { getPicture, deleteUserRating, deleteUser, postUser, postUserRating, getUsersRatings};