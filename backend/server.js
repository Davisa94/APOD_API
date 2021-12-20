const http = require("http");
const mysql = require("mysql");
const host = "localhost";
const port = 7878;
const secrets = require("secrets.js");
const DBhost = secrets.DBhost;
const DBuser = secrets.DBuser;
const DBpassword = secrets.DBpassword;

const DBconnection = mysql.createConnection({
   host: dbHost,
   user: DBuser,
   password: DBpassword
});

// test DB connection
DBconnection.connect(function(err){
   if(err) throw err;
   console.log("Succesfully connected to the database");
})



// create the base server

var server = http.createServer((req, res) => {
   // basic response
   res.writeHead(200, {'content-type': 'text/html'});
   res.end("Success");
});


server.listen(port, host, () =>{
   console.log(`server is running @ http://${host}:${port}`);
});