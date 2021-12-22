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
import * as routes from "./routes.js";


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
router.post('/userRating',routes.userRating);


/********************************************
 * DELETE a users rating
 * NEEDS in query parameters
 * email ~ email of rater
 * rateDate ~ date of the picture that was rated
 *********************************************/
router.delete('/userRating', routes.deleteUserRating);

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
router.post('/user',routes.postUser);

/********************************************
 * DELETE a user in the database 
 * NEEDS in the body:
 * email ~ The email of the user to be 
 *         deleted.
 ********************************************/
router.delete('/user', routes.deleteUser);

/********************************************
 * GET a picture from APOD or the DB if it is
 * there already
 * OPTIONAL in query parameters:
 * pictureDate ~ provide a date here if you
 * want to view a picture from a date that is
 * not today and the database will try to get
 * it if it the app has stored it.
 ********************************************/
router.get('/picture', routes.getPicture);


// use router
app.use('/', router);

app.listen(port, () =>{
   console.log(`server is running @ http://${host}:${port}`);
});