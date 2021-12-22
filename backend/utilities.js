
/**************************************************
 * Utility function, given a JS date object convert to a mysql
 * friendly date string
 * @param Date date
 *************************************************/
function MySQLfyDate(date = new Date()) {
   return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export { MySQLfyDate };