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
module.exports.test = queryAllRatingsByEmail;