import mysql2 from "mysql2";

/********************************************************
 * Given a users email query all ratings by that user.
 * Returns UserEmail, PictureURI, Rating for each record
 * @param String userEmail
 * @param mysql2.createConnection()
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
 * Given the picture URI and a date insert 
 * the record into the database
*********************************************************/
async function insertPicture(pictureURI, date, connection) {
   var response = await connection.promise().query(
      `INSERT INTO picture (picture_URI, date_posted) VALUES (${mysql2.escape(pictureURI)},${mysql2.escape(date)});`
   );
   return response[0];
}

/********************************************************
 * Given the picture URI insert it for today
*********************************************************/
async function insertTodaysPicture(pictureURI, connection) {
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
   try {
      var response = await connection.promise().query(
         `SELECT * \
      FROM picture \
      WHERE date_posted = ${mysql2.escape(date)};`
      );
      return response[0];
   }
   catch (e) {
      console.error(e.message.toString());
      if (e.message.toString().includes("DATE value")) {
         var message = '[[' +
            '{"error": "Incorrect date format",' +
            '"info": "The value entered for the date:' + date + 
            'is not a valid date, We expect the date to be input ' +
            'using the mm/dd/yyyy format, please reformat the date and try again" }]]';
         var messageObj = JSON.parse(message);
         return messageObj;
      }
   }
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
   console.log(email);
   try{
      var response = await connection.promise().query(
         `INSERT INTO user (user_email) VALUES(${mysql2.escape(email)});`
      );
      return response[0];
   }
   catch (e) {
      var message = "";
      // check if the DB complains about entering the user
      if (e.message.toString().includes("Column 'user_email' cannot be null")) {
         message = ` User with the email ${email} is invalid/missing; Try again!`
      }
      else if (e.message.toString().includes("Duplicate entry")){
         message = ` User with the email ${email} already exists in database.`
      }
      else {
         message += `{error: "Invalid user table request + ${e.message}"}`;
         console.error("error inserting user: " + e);
      }
      console.error(e.message);
      return message;
   }

}

/********************************************************
 * We assume that email validation has already occured
*********************************************************/
async function updateUser(oldEmail, newEmail, connection){
   try {
      var response = await connection.promise().query(
         `UPDATE user \
         SET user_email = ${mysql2.escape(newEmail)} \
         WHERE user_email = ${mysql2.escape(oldEmail)};`
      );
      return response[0];
   }
    catch (e) {
      var message = "";
      // check if the DB complains about entering the user
      if (e.message.toString().includes("Column 'user_email' cannot be null")) {
         message = ` User with the email ${email} is invalid/missing; Try again!`
      }
      else if (e.message.toString().includes("Duplicate entry")) {
         message = ` User with the email ${email} already exists in database.`
      }
      else {
         message += `{error: "Invalid user table request + ${e.message}"}`;
         console.error("error inserting user: " + e);
      }
      console.error(e.message);
      return message;
   }
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
   try{
      var response = await connection.promise().query(
         `INSERT INTO rating (rating_value, user_id, picture_id) \
         VALUES ( \
         ${mysql2.escape(rating)}, \
         (SELECT user_id \
         FROM user \
         WHERE user_email like ${mysql2.escape(email)}), \
         (SELECT picture_id \
         FROM picture \
         WHERE date_posted = ${mysql2.escape(pictureDate)}));`
      );
      return response[0];
   }
   catch(e){
      var message = "";
      // check if the DB complains about entering the picture
      if (e.message.toString().includes("Column 'picture_id' cannot be null")){
         message = ` Picture from the date ${pictureDate} not found in database Try again!`
      }
      else if (e.message.toString().includes("Column 'user_id' cannot be null")){
         message = ` User with the email ${email} not found in database Try again!`
      }
      else{
         message += `{error: "Invalid rating request + ${e.message}"}`;
         console.error("error inserting rating: " + e);
      }
      console.error(message);
      return message;
   }
}
/********************************************************
 * Deletes the rating with the given date,email combo
*********************************************************/
async function deleteRating(pictureDate, email, connection){
   try{
      var response = await connection.promise().query(
         `DELETE /
         FROM rating /
         WHERE user_id = ( /
         SELECT user_id /
         FROM user /
         WHERE user_email LIKE ${mysql2.escape(email)} /
         ) AND picture_id = ( /
         SELECT picture_id /
         FROM picture /
         WHERE date_posted = ${mysql2.escape(pictureDate)} /
         );`
      );
      return response[0];
   }
   catch(e){
      var message = "";
      // check if the DB complains about entering the picture
      if (e.message.toString().includes("Column 'picture_id' cannot be null")){
         message = ` Picture from the date ${pictureDate} not found in database Try again!`
      }
      else if (e.message.toString().includes("Column 'user_id' cannot be null")){
         message = ` User with the email ${email} not found in database Try again!`
      }
      else{
         message += `{error: "Invalid rating request + ${e.message}"}`;
         console.error("error inserting rating: " + e);
      }
      console.error(message);
      return message;
   }
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
export { queryAllRatingsByEmail as getRatingsByEmail };
export { queryPictureByDate as getPictureByDate };
export { insertRating as setRating };
export { queryPictureByDateRange as getPictureByDateRange };
export { insertUser as setUser };
export { insertTodaysPicture as setTodaysPicture };
export { insertPicture as setPicture };
export { updateUser, deleteUser, updateRating };