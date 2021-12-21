const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();
const mysql = require("mysql2");
const host = "localhost";
const port = 7878;
const secrets = require("./secrets.js");
const DBhost = secrets.DBhost;
const DBuser = secrets.DBuser;
const DBpassword = secrets.DBpassword;
const DBschema = secrets.DBschema;
const app = express();
var DBinteractor = require("./db-manager.js");

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

// await console.log(test.test("Melons@melonmail.com",DBconnection));
function defaultGet(req, res)
{
   console.log(`Welcome to the NASA APOD Review system use /instructions to learn more.`);
}
// setup body-parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
// use router
router.get('/userRatings', async (req, res) => {
   const queryResponse = await DBinteractor.getRatingsByEmail(req.query.email, DBconnection);
   console.log(req.query);
   res.json(queryResponse);
});

// app.get('/', defaultGet)
// app.get('/userRatings', async (req, res) => {
//    const queryResponse = await DBinteractor.getRatingsByEmail(req.query.email, DBconnection);
//    console.log(req.query);
//    res.json(queryResponse);
// });
// app.post('/userRating', async (req, res) => {
//    var rating = req.body;
//    console.log(req.body);
//    // const queryResponse = await DBinteractor.setRating()
// })

app.use('/', router);

app.listen(port, () =>{
   console.log(`server is running @ http://${host}:${port}`);
});