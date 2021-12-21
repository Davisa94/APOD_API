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
   )
}

// takes in two dates and a connection object
// TODO: Ensure that the expected date format is specified here. 
// returns ALL Columns for the Picture table with the matching date
// range
async function queryPictureByDateRange(startDate, endDate, connection){
   var response = await connection.promise().query(
      `SELECT * \
      FROM picture \
      WHERE (date_posted BETWEEN "${startDate}" AND "${endDate}"); `
   )
}


// Exports
module.exports.getRatingsByEmail = queryAllRatingsByEmail;
module.exports.getPictureByDate = queryPictureByDate;
module.exports.getPictureByDateRange = queryPictureByDateRange;