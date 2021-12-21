const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();
const mysql = require("mysql2");
const host = "localhost";
const port = 7878;
const secrets = require("./secrets.js");
const DBhost = secrets.DBhost;
const DBuser = secrets.DBuser;
const DBpassword = secrets.DBpassword;
const DBschema = secrets.DBschema;
const app = express();
var DBinteractor = require("./db-manager.js");

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

// await console.log(test.test("Melons@melonmail.com",DBconnection));
function defaultGet(req, res)
{
   console.log(`Welcome to the NASA APOD Review system use /instructions to learn more.`);
}
// setup body-parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

/*****************************************
 * GET all of a users ratings
 * NEEDS:
 * parameter for email
 * i.e /userRatings?email="email"
 *****************************************/
router.get('/userRatings', async (req, res) => {
   const queryResponse = await DBinteractor.getRatingsByEmail(req.query.email, DBconnection);
   console.log(req.query);
   res.json(queryResponse);
});


/*****************************************
 * POST a rating given the date the picture
 * was posted using APOD
 * NEEDS in the body:
 * rating (1-5)
 * email
 * pictureDate ~ the date the picture was
 * first posted on APOD
 * WILL update a rating if it already exists
 *****************************************/
router.post('/userRating', async (req, res) => {
   var rating = req.body["rating"];
   var email = req.body["email"];
   var pictureDate = new Date(req.body["pictureDate"]);
   // verify if the rating already exists
   // convert date to SQL format YYYY-MM-DD
   pictureDate = `${pictureDate.getFullYear()}-${pictureDate.getMonth() + 1}-${pictureDate.getDate()}`;
   const queryResponse = await DBinteractor.setRating(rating, pictureDate, email, DBconnection);
   res.json(queryResponse);
});


/*****************************************
 * DELETE a users rating
 * NEEDS in query parameters
 * email (email of rater)
 * rateDate (date of the picture that was rated)
 *****************************************/
router.delete('/userRating', async (req, res) =>{
   // get the email of the rating we want to delete
   var email = req.query.email;
   // get the date of the rating to be deleted
   var pictureDate = new Date(req.query.pictureDate);
   console.log(pictureDate.toString());
   // if we are not provided with a date to delete on return an error
   if (pictureDate.toString() == "Invalid Date")
   {
      console.warn("Invalid or missing Date");
      res.json("Invalid or missing date; Did you add the 'pictureDate' query parameter?");
   }
   else if(!email){
      // #TODO: add email validation here
      console.warn("Invalid or missing Email");
      res.json("Invalid or missing email; Did you add the 'email' query parameter?");
   }

});

/*****************************************
 * POST a new user into the database 
 * NEEDS in the body:
 * email ~ the email of the new user
 *****************************************/
router.post('/newUser', async (req, res) => {
   var jsonResponse = ""
   var email = req.body["email"];
   console.log(email);
   if (!email) {
      // #TODO: add email validation here
      console.warn("Invalid or missing Email");
      jsonResponse = "Invalid or missing email; Did you add the 'email' body parameter?";
   }
   const queryResponse = await DBinteractor.setUser(email, DBconnection);
   jsonResponse = queryResponse;
   res.json(jsonResponse);
});



// use router
app.use('/', router);

app.listen(port, () =>{
   console.log(`server is running @ http://${host}:${port}`);
});