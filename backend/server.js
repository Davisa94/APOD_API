import express from 'express';
import bodyParser from 'body-parser';
const router = express.Router();
const host = "localhost";
const port = 7878;
const app = express();
import * as routes from "./routes.js";

// setup body-parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

/********************************************
 * GET all of a users ratings
 * NEEDS:
 * parameter for email
 * i.e /userRatings?email="email"
 ********************************************/
router.get('/userRatings', routes.getUsersRatings);


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
router.post('/userRating',routes.postUserRating);

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