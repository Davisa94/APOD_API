// const { resourceLimits } = require("worker_threads");
const mysql2 = require("mysql2");

/********************************************************
 * Given a users email query all ratings by that user.
 * Returns UserEmail, PictureURI, Rating for each record
*********************************************************/
async function queryAllRatingsByEmail(userEmail, connection){
   const queryMe = `SELECT U.user_email, P.picture_URI, R.rating_value \
      FROM rating R \
      LEFT JOIN user U on r.user_id = u.user_id \
      LEFT JOIN picture p on r.picture_id = p.picture_id \
      WHERE user_email like ${mysql2.escape(userEmail)}`
   var response = await connection.promise().query(queryMe);
   return response[0];
}

/********************************************************
 * 
*********************************************************/
async function insertPicture(pictureURI, connection) {
   var response = await connection.promise().query(
      `INSERT INTO picture (picture_URI) VALUES (${mysql2.escape(pictureURI)});`
   );
   return response[0];
}

/********************************************************
 * takes in a date and a connection object
 * TODO: Ensure that the expected date format is specified here. 
 * returns ALL Columns for the Picture table with the matching date
*********************************************************/
async function queryPictureByDate(date, connection){
   var response = await connection.promise().query(
      `SELECT * \
      FROM picture \
      WHERE date_posted = ${mysql2.escape(date)};`
   );
   return response[0];
}

/********************************************************
 * takes in two dates and a connection object
 * TODO: Ensure that the expected date format is specified 
 * here. 
 * Returns ALL Columns for the Picture table with
 * the matching date range
*********************************************************/
async function queryPictureByDateRange(startDate, endDate, connection){
   var response = await connection.promise().query(
      `SELECT * \
      FROM picture \
      WHERE (date_posted BETWEEN ${mysql2.escape(startDate)} AND ${mysql2.escape(endDate)}); `
   );
   return response[0];
}

/********************************************************
 * We assume that email validation has already occured,
 * The database will reject if a duplicate email is given
*********************************************************/
async function insertUser(email, connection){
   var response = await connection.promise().query(
      `INSERT INTO user (user_email) VALUES(${mysql2.escape(email)});`
   );
   return response[0];
}

/********************************************************
 * We assume that email validation has already occured
*********************************************************/
async function updateUser(oldEmail, newEmail, connection){
   var response = await connection.promise().query(
      `UPDATE user \
      SET user_email = ${mysql2.escape(newEmail)} \
      WHERE user_email = ${mysql2.escape(oldEmail)};`
   );
   return response[0];
}

/********************************************************
 * We assume that email validation has already occured
 * email MUST be exactly as it was entered to register a 
 * new user or else it will be rejected.
*********************************************************/
async function deleteUser(email, connection){
   var response = await connection.promise().query(
      `DELETE \
      FROM user \
      WHERE user_email = ${mysql2.escape(email)};`
   );
   return response[0];
}

/********************************************************
 * We assume that validation has already occured,
 * the database will reject invalid ratings 
 * (below 1 or above 5)
*********************************************************/
async function insertRating(rating, pictureDate, email, connection){
   var response = await connection.promise().query(
      `INSERT INTO rating (rating_value, user_id, picture_id) \
      VALUES ( \
      ${rating}, \
      (SELECT user_id \
      FROM user \
      WHERE user_email like ${mysql2.escape(email)}), \
      (SELECT picture_id \
      FROM picture \
      WHERE date_posted = ${mysql2.escape(pictureDate)}));`
   );
   return response[0];
}

/********************************************************
 * We assume that validation has already occured,
 * the database will reject invalid ratings 
 * (below 1 or above 5)
*********************************************************/
async function updateRating(rating, pictureDate, email, connection){
   var response = await connection.promise().query(
      `UPDATE rating \
      SET rating_value = ${mysql2.escape(rating)} \
      WHERE ( picture_id=( \
      SELECT picture_id \
      FROM picture \
      WHERE date_posted = ${mysql2.escape(pictureDate)}) \
      AND \
      user_id = ( \
      SELECT user_id \
      FROM user \
      WHERE user_email like ${mysql2.escape(email)}));`
   );
   return response[0];
}


// Exports
module.exports.getRatingsByEmail = queryAllRatingsByEmail;
module.exports.getPictureByDate = queryPictureByDate;
module.exports.getPictureByDateRange = queryPictureByDateRange;
module.exports.setUser = insertUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.setPicture = insertPicture;
module.exports.setRating = insertRating;
module.exports.updateRating = updateRating;