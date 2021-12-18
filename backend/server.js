const http = require("http");
const host = "localhost";
const port = 7878;


// create the base server

var server = http.createServer((req, res) => {
   // basic response
   res.writeHead(200, {'content-type': 'text/html'});
   res.end("Success");
});


server.listen(port, host, () =>{
   console.log(`server is running @ http://${host}:${port}`);
});