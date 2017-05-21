// server.js
const express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var Pusher = require('pusher');
const app = express();

const GAMECODES_COLLECTION = "gameCodes";
const USERS_COLLECTION = "users";
const CHANNELS_COLLECTION = "channels";
const GAMES_COLLECTION = "games";
const NUM_OF_PLAYERS = 2;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/dist'));
app.use(function (req, res, next) {
	res.set({
		'Access-Control-Allow-Origin' : '*',
		'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
		'Access-Control-Allow-Headers' : 'Content-Type'
	});
	next();
});

process.env.MONGODB_URI	= "mongodb://heroku_6hwpbxh2:raq47plkhelaj01geo1i9cfo29@ds131109.mlab.com:31109/heroku_6hwpbxh2";

var pusher = new Pusher({
  appId: '328228',
  key: '8ec8f5164e15f7cbc5a0',
  secret: 'b89adf8f37a75b4d0c3e',
  cluster: 'eu',
  encrypted: false
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
		var hostname = server.address().address;
		console.log("App now running on address:port", port);
	});
});

// GAME API BELOW

// Generic error handler used by all endpoints
function handleError(res, reason, message, code) {
	console.log("ERROR: " + reason);
	res.status(code || 500).json({"error" : message});
};

/* "/api/game-codes/vaidate"
 * 	POST: validates game code
 */
app.post("/api/game-codes/validate", function(req, res) {
	// console.log("game code validation request");
	if (!req.body.gamecode) {
		handleError(res, "Invalid game code", "Must provide a game code", 400);
	}

	db.collection(GAMECODES_COLLECTION).findOneAndUpdate(
		{ game_code: req.body.gamecode },
		{ $inc: {activated_count: 1} },
		{ returnOriginal: false },
		function(err, result){
			if (err) {
				handleError(res, err.message,  err.message, 500);
			}
			else {
				var response = {isFalse : 1};
				// If game code exists
				if (result.value && result.value.activated_count > NUM_OF_PLAYERS) {
					res.status(201).json(response);
				}
				else if (result.value) {
					// Creater user-channel association (PK)
					db.collection(USERS_COLLECTION).insertOne({
						username : req.body.username,
						channel_id : result.value.channel_id
					}, function (err, r) {
						response = {
							user_id: r.ops[0]._id,
							channel_id: result.value.channel_id,
							activated_count: result.value.activated_count,
							username: r.ops[0].username
						};
						res.status(201).json(response).send();
					});
				}
				else {
					res.status(201).json(response).send();
				}		
			}
		});
});

/* "/api/pusher/auth"
 * 	POST: auth endpoint for pusher authentication 
 */

app.post("/api/pusher/auth", function(req, res) {
	var socketId = req.body.socket_id;
	var channel = req.body.channel_name;
	var channel_id = req.body.channel_id;
	var username = req.body.username;
	var user_id = req.body.user_id
	// TODO: Should check username and channel_name are associated

	var presenceData = {
		user_info: {
			username: username,
			ready: false
		},
		user_id: user_id
	};
	var auth = pusher.authenticate(socketId, channel, presenceData);
	// console.log("Pusher authentication");
	res.status(200).send(auth);
});
/* "/api/ready"
 * 	POST: ready up on ready page
 */
app.post("/api/ready", function(req, res) {
	var userid = req.body.user_id;
	var channel_id = req.body.channel_id
	db.collection(CHANNELS_COLLECTION).findOneAndUpdate(
		{ channel_id: channel_id},
		{ $push: {users: userid}},
		{ returnOriginal: false},
		function(err, r) {
			if (err) {
				handleError(res, err.message,  err.message, 500);
			}
			else {
				pusher.trigger('presence-' + channel_id, 'all-ready', {
					user_id: userid
				});
				res.status(200).send();
			}
		});
});

/* "/api/ready"
 *	GET: get all users who have readied up
 */

app.get("/api/ready/:channel_id", function(req, res) {
	var channel_id = req.params.channel_id;
	db.collection(CHANNELS_COLLECTION).findOne(
		{channel_id: channel_id},
		{fields: {users: 1}},
		function(err, doc) {
			if (err) {
				handleError(res, err.message,  err.message, 500);
			}
			else {
				var response = {
					users: doc.users
				}
				// console.log(doc.users);
				res.json(response);
			}
		});
});

/* "/api/game/:channel_id/:round"
 * 	POST: save game data for 1 round
 */

app.post("/api/game/:channel_id/:round", function(req, res) {
	var channel_id = req.params.channel_id;
	var reqRound = req.params.round;
	var round = "round_" + req.params.round;
	var user_id = req.body.user_id;
	var ind_invstmnt = req.body.ind;
	var grp_invstmnt = req.body.grp;
	var total_grp_investment = 0;
	var submitted_count = round + ".submitted_count";
	var players = round + ".players";
	var submitted_count_update = {};
	var players_update = {};
	submitted_count_update[submitted_count] = 1;
	players_update[players] = {
		user_id : user_id,
		ind_invstmnt : ind_invstmnt,
		grp_invstmnt : grp_invstmnt,
		ind_payoff : ind_invstmnt * 2,
		grp_payoff : 0
	};
	db.collection(GAMES_COLLECTION).findOneAndUpdate(
	{channel_id: channel_id },
	{ $inc : submitted_count_update, $push: players_update },
	{ returnOriginal : false },
	function(err, r) {
		if (err) {
			handleError(res, err.message,  err.message, 500);
		}
		else {
			pusher.trigger('presence-' + channel_id, 'player-updated', {
				user_id : user_id,
				ind: ind_invstmnt,
				grp: grp_invstmnt
			});
			// console.log('player saved!');
			// Change back to 4
			if (r.value[round].submitted_count == NUM_OF_PLAYERS) {
				// compute group payoff
				for(var i = 0; i < r.value[round].players.length; i++) {
					total_grp_investment += Number(r.value[round].players[i].grp_invstmnt);
				}
				setTimeout(function() {
					pusher.trigger('presence-' + channel_id, 'round-completed', {
						total_grp_investment : total_grp_investment
					});
					// console.log("Round-completed triggered");
				}, 250);
			}
			res.status(200).send();
			// Change back to 4
			if (r.value[round].submitted_count == NUM_OF_PLAYERS) {
				for(var i = 0; i < r.value[round].players.length; i++) {
					r.value[round].players[i].grp_payoff = total_grp_investment - Number(r.value[round].players[i].grp_invstmnt);
				}
				players_update[players] = r.value[round].players;
				db.collection(GAMES_COLLECTION).findOneAndUpdate(
					{channel_id: channel_id },
					{  $set : players_update },
					{ returnOriginal : false },
					function(err, r) {
						if (err) {
							handleError(res, err.message,  err.message, 500);
						}
						else {
							// console.log(r.value.round_1);
						}
					});
				if (reqRound == 5) {pusher.trigger('presence-' + channel_id, 'game-over', {});}
			}
		}
	});
});

/**
 * "/api/admin/reset"
 * GET: reset test game data
 */
app.get("/api/admin/reset", function(req, res) {
	var games_body = {
		"round_1": {
		     "submitted_count": 0,
		     "players": []
		 },
		 "round_2": {
		     "submitted_count": 0,
		     "players": []
		 },
		 "round_3": {
		     "submitted_count": 0,
		     "players": []
		 },
		 "round_4": {
		     "submitted_count": 0,
		     "players": []
		 },
		 "round_5": {
		     "submitted_count": 0,
		     "players": []
		 }
	}
	var bumblebee_icecream_a55hv = Object.assign({channel_id: 'bumblebee-icecream-a55hv'}, games_body);
	var fighter_pomade_htg52 = Object.assign({channel_id : 'fighter-pomade-htg52'}, games_body); 

	db.collection(CHANNELS_COLLECTION).findOneAndUpdate(
		{ channel_id: 'bumblebee-icecream-a55hv' },
		{ $set : {users: []} }
	);
	db.collection(GAMECODES_COLLECTION).findOneAndUpdate(
		{ channel_id: 'bumblebee-icecream-a55hv' },
		{ $set : {activated_count:0} }
	);

	db.collection(GAMES_COLLECTION).findOneAndReplace(
		{channel_id: 'bumblebee-icecream-a55hv'},
		{bumblebee_icecream_a55hv}
	);

	db.collection(CHANNELS_COLLECTION).findOneAndUpdate(
		{ channel_id: 'fighter-pomade-htg52' },
		{ $set : {users: []} }
	);
	db.collection(GAMECODES_COLLECTION).findOneAndUpdate(
		{ channel_id: 'fighter-pomade-htg52' },
		{ $set : {activated_count:0} }
	);

	db.collection(GAMES_COLLECTION).findOneAndReplace(
		{channel_id: 'fighter-pomade-htg52'},
		{fighter_pomade_htg52}
	);

	res.send('all ok!');
});

/* "/api/rounds/channel/:channel_id"
 * 	GET: find game data for all rounds, for all users by channel
 */

app.get("/api/rounds/channel/channel_id", function(req, res){
	res.status(200).json({hello: "it works!"});
});