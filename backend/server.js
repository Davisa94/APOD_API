const express = require('express');
const mysql = require("mysql2");
const host = "localhost";
const port = 7878;
const secrets = require("./secrets.js");
// import { DBhost } from "./secrets.js";
// import { DBuser } from "./secrets.js";
// import { DBpassword } from "./secrets.js";
// import { DBschema } from "./secrets.js";
const DBhost = secrets.DBhost;
const DBuser = secrets.DBuser;
const DBpassword = secrets.DBpassword;
const DBschema = secrets.DBschema;
const app = express();
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

function defaultGet(req, res)
{
   console.log(`Welcome to the NASA APOD Review system use /instructions to learn more.`);
}

app.get('/', defaultGet)

app.listen(port, () =>{
   console.log(`server is running @ http://${host}:${port}`);
});