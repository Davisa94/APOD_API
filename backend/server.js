import express from 'express';
import bodyParser from 'body-parser';
const router = express.Router();
import mysql from 'mysql2';
const host = "localhost";
const port = 7878;
import * as secrets from "./secrets.js";
const DBhost = secrets.DBhost;
const DBuser = secrets.DBuser;
const DBpassword = secrets.DBpassword;
const DBschema = secrets.DBschema;
const API_key = secrets.API_key;
const app = express();
import * as wrapper from "./API-wrapper.js";
import * as DBinteractor from "./db-manager.js";


console.log(DBuser);
const DBconnection = mysql.createConnection({
   
   host: DBhost,
   user: DBuser,
   password: DBpassword,
   database: DBschema
});

// test DB connection
DBconnection.connect(function(err){
   if(err) throw err;
   console.log("Succesfully connected to the database");
})

/**************************************************
 * Utility function, given a JS date object convert to a mysql
 * friendly date string
 * @param Date date
 *************************************************/
function MySQLfyDate(date = new Date()){
   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}


// setup body-parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

/********************************************
 * GET all of a users ratings
 * NEEDS:
 * parameter for email
 * i.e /userRatings?email="email"
 ********************************************/
router.get('/userRatings', async (req, res) => {
   const queryResponse = await DBinteractor.getRatingsByEmail(req.query.email, DBconnection);
   console.log(req.query);
   res.json(queryResponse);
});


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
router.post('/userRating', async (req, res) => {
   var rating = req.body["rating"];
   var email = req.body["email"];
   var pictureDate = new Date(req.body["pictureDate"]);
   // verify if the rating already exists
   // convert date to SQL format YYYY-MM-DD
   pictureDate = MySQLfyDate(pictureDate);
   var queryResponse = await DBinteractor.setRating(rating, pictureDate, email, DBconnection);
   // check if we inserted the record, if not we need to update it
   if (queryResponse.toString().includes("Duplicate entry"))
   {
      console.log(queryResponse + "this is it");
      queryResponse = await DBinteractor.updateRating(rating, pictureDate, email, DBconnection);
      if (queryResponse["affectedRows"] == 1)
      {
         console.log("Rating updated!");
         var responseJSON = Object.assign({"success" : true}, req.body);
         console.log(responseJSON);
         queryResponse = responseJSON;

      }
   }
   res.json(queryResponse);
});


/********************************************
 * DELETE a users rating
 * NEEDS in query parameters
 * email ~ email of rater
 * rateDate ~ date of the picture that was rated
 *********************************************/
router.delete('/userRating', async (req, res) =>{
   // get the email of the rating we want to delete
   var responseJSON = "";
   var email = req.query.email;
   // get the date of the rating to be deleted
   var pictureDate = new Date(req.query.pictureDate);
   console.log(pictureDate.toString());
   // if we are not provided with a date to delete on return an error
   if (pictureDate.toString() == "Invalid Date")
   {
      console.warn("Invalid or missing Date");
      responseJSON = "Invalid or missing date; Did you add the 'pictureDate' query parameter?";
   }
   else if(!email){
      // #TODO: add email validation here
      console.warn("Invalid or missing Email");
      responseJSON = "Invalid or missing email; Did you add the 'email' query parameter?";
   }
   else {
      const queryResponse = DBinteractor.deleteUser
   }
   res.json();

});

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
router.post('/user', async (req, res) => {
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
      queryResponse = await DBinteractor.setUser(email, DBconnection);
   }
   

   
   jsonResponse = queryResponse;
   res.json(jsonResponse);
});

/********************************************
 * GET a picture from APOD or the DB if it is
 * there already
 * OPTIONAL in query parameters:
 * pictureDate ~ provide a date here if you
 * want to view a picture from a date that is
 * not today and the database will try to get
 * it if it the app has stored it.
 ********************************************/
router.get('/picture', async (req, res) => {
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
   
   // check if we have a date or not
   if (pictureDate.toString() == "Invalid Date") {
      // No Date or invalid Date, we assume they want today's picture
      console.warn("Invalid or missing Date; serving todays picture");
      pictureDate = MySQLfyDate()
   }
   queryResponse = await DBinteractor.getPictureByDate(pictureDate, DBconnection);
   // its not in the database, lets add it and return that data.
   if (queryResponse.length < 1)
   {
      console.warn(`no results found, fetching picture for date ${pictureDate}`);
      pictureDate = MySQLfyDate(pictureDate)
      var fetched = await wrapper.getPictureByDate(pictureDate, API_key);
      queryResponse = await DBinteractor.setPicture(fetched.hdurl, pictureDate, DBconnection);
      // return the query and that we inserted into the database.
      responseJSON = Object.assign({ "inserted": true }, queryResponse[0]);

   }
   else{
      // return that we got the picture from the databse plus the info
      responseJSON = Object.assign({ "inserted": false }, queryResponse[0]);
   }
   res.json(responseJSON);
});


// use router
app.use('/', router);

app.listen(port, () =>{
   console.log(`server is running @ http://${host}:${port}`);
});