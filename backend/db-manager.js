const { resourceLimits } = require("worker_threads");

/* Given a users email query all ratings by that user.
   Returns UserEmail, PictureURI, Rating for each record
*/
async function queryAllRatingsByEmail(userEmail, connection){
   var response = await connection.promise().query(
      `SELECT U.user_email, P.picture_URI, R.rating_value \
      FROM rating R \
      LEFT JOIN user U on r.user_id = u.user_id \
      LEFT JOIN picture p on r.picture_id = p.picture_id \
      WHERE user_email like "${userEmail}"`);
   console.log(response[0]);
   return response[0];
}

// takes in a date and a connection object
// TODO: Ensure that the expected date format is specified here. 
// returns ALL Columns for the Picture table with the matching date
async function queryPictureByDate(date, connection){
   var response = await connection.promise().query(
      `SELECT * \
      FROM picture \
      WHERE date_posted = "${date}";`
   );
}

/********************************************************
   takes in two dates and a connection object
   TODO: Ensure that the expected date format is specified 
   here. 
   Returns ALL Columns for the Picture table with
   the matching date range
*********************************************************/
async function queryPictureByDateRange(startDate, endDate, connection){
   var response = await connection.promise().query(
      `SELECT * \
      FROM picture \
      WHERE (date_posted BETWEEN "${startDate}" AND "${endDate}"); `
   );
}

/********************************************************
   We assume that email validation has already occured
*********************************************************/
async function addUser(email, connection){
   var response = await connection.promise().query(
      ``
   );
}

/********************************************************
   We assume that email validation has already occured
*********************************************************/
async function updateUser(oldEmail, newEmail, connection){
   var response = await connection.promise().query(
      ``
   );
}

/********************************************************
   We assume that email validation has already occured
*********************************************************/
async function deleteUser(email, connection){
   var response = await connection.promise().query(
      ``
   );
}

/********************************************************
   We assume that validation has already occured,
   the database will reject invalid ratings 
   (below 1 or above 5)
*********************************************************/
async function addRating(pictureId, email, connection){
   var response = await connection.promise().query(
      ``
   );
}

/********************************************************
   We assume that validation has already occured,
   the database will reject invalid ratings 
   (below 1 or above 5)
*********************************************************/
async function updateRating(pictureId, email, connection){
   var response = await connection.promise().query(
      ``
   );
}
// Exports
module.exports.getRatingsByEmail = queryAllRatingsByEmail;
module.exports.getPictureByDate = queryPictureByDate;
module.exports.getPictureByDateRange = queryPictureByDateRange;