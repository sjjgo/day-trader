// server.js
const express = require('express');
var bodyParser = require("body-parser");
const app = express();
// for parsing application json
app.use(bodyParser.json());
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port
var server = app.listen(process.env.PORT || 8080, function (){
	var port = server.address().port;
	console.log("App now running on port ", port);
});

app.get("/contacts/:name", function (request, response){
	response.send(request.params);
});
app.post("/post/:name", function (request, response){
	response.status(200).json(request.body);
});
