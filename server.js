// server.js
const express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var Pusher = require('pusher');
const app = express();

const GAMECODES_COLLECTION = "gameCodes";

app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));

var pusher = new Pusher({
  appId: '328228',
  key: '8ec8f5164e15f7cbc5a0',
  secret: 'b89adf8f37a75b4d0c3e',
  cluster: 'eu',
  encrypted: true
});


mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database){
	if (err) {
		console.log(err);
		process.exit(1);
	}

	// Save database object from callback for reuse
	db = database;

	// Initialize app
	var server = app.listen(process.env.PORT || 8080, function (){
		var port = server.address().port;
		console.log("App now running on port ", port);
	});
});

// GAME API BELOW

// Generix error handler used by all endpoints
function handleError(res, reason, message, code) {
	console.log("ERROR: " + reason);
	res.status(code || 500).json({"error" : message});
};

/* "/api/game-codes/vaidate"
 * 	POST: validates game code
 */

app.post("/api/game-codes/validate", function(req, res) {
	var gamecode = req.body;

	if (!req.body.gamecode) {
		handleError(res, "Invalid game code", "Must provide a game code", 400);
	}

	db.collection(GAMECODES_COLLECTION).find({"game_code" : req.body.gamecode}).toArray(function(err,docs){
		if (err) {
			handleError(res, err.message, "Failed to retrieve game code");
		}
		else {
			res.status(201).json(doc.ops[0]);
		}
	})
});

/* "/api/pusher/auth"
 * 	POST: auth endpoint for pusher authentication 
 */

app.post("/api/pusher/auth", function(req, res) {
	//
});

/* "/api/rounds"
 * 	POST: save game data for 1 round
 */

app.post("/api/rounds", function(req, res) {
	//
});

/* "/api/rounds/channel/:channel_id"
 * 	GET: find game data for all rounds, for all users by channel
 */

app.get("/api/rounds/channel/channel_id", function(req, res){
	res.status(200).json({hello: "it works!"});
});