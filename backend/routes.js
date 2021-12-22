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

   // check if we have a date or not
   if (pictureDate.toString() == "Invalid Date") {
      // No Date or invalid Date, we assume they want today's picture
      console.warn("Invalid or missing Date; serving todays picture");
      pictureDate = MySQLfyDate()
   }
   queryResponse = await DBinteractor.getPictureByDate(pictureDate, DBconnection);
   // its not in the database, lets add it and return that data.
   if (queryResponse.length < 1) {
      console.warn(`no results found, fetching picture for date ${pictureDate}`);
      pictureDate = MySQLfyDate(pictureDate)
      var fetched = await wrapper.getPictureByDate(pictureDate, API_key);
      queryResponse = await DBinteractor.setPicture(fetched.hdurl, pictureDate, DBconnection);
      // return the query and that we inserted into the database.
      responseJSON = Object.assign({ "inserted": true }, queryResponse[0]);

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
 * NEEDS in query parameters
 * email ~ email of rater
 * rateDate ~ date of the picture that was rated
 *********************************************/
async function deleteUserRating(req, res){
   // get the email of the rating we want to delete
   var jsonResponse = "";
   var email = req.query.email;
   // get the date of the rating to be deleted
   var pictureDate = new Date(req.query.pictureDate);
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

export { getPicture, deleteUserRating, deleteUser, postUser };