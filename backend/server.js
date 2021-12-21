const express = require('express');
const mysql = require("mysql2");
const host = "localhost";
const port = 7878;
const secrets = require("./secrets.js");
const DBhost = secrets.DBhost;
const DBuser = secrets.DBuser;
const DBpassword = secrets.DBpassword;
const DBschema = secrets.DBschema;
const app = express();
var test = require("./db-manager.js");

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
async function testAsync(userEmail, connection)
{
   return await console.log(test.test("Melons@melonmail.com", DBconnection));
}
// await console.log(test.test("Melons@melonmail.com",DBconnection));
function defaultGet(req, res)
{
   console.log(`Welcome to the NASA APOD Review system use /instructions to learn more.`);
}

app.get('/', defaultGet)
app.get('/test', async (req, res) => {
   const queryResponse = await test.test("Melons@melonmail.com", DBconnection);
   res.json(queryResponse);
});

app.listen(port, () =>{
   console.log(`server is running @ http://${host}:${port}`);
});