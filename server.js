// server.js
const express = require('express');
const app = express();
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
	res.send(req.params);
});
app.post("/post/:name", function (request, response){
	res.send(req.params);
});
