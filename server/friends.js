var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('./db.js');
var cors = require('cors');

var app = express();
app.use(cors());


router.get('/', function(request, response){
  db.query('SELECT username FROM Users', function(err, results){
    if(err){
      throw err;
    }else{
      console.log("friends list from db", results);
      response.send(results);
    }
  })
})

router.post('/add', function(request, response){
	var user1 = request.body.username1;
	var user2 = request.body.username2;
	console.log("RECEIVING /friends/add POST REQUEST", user1, user2);
	db.query('SELECT id FROM Users WHERE `username` = ? OR `username` = ?;', [user1, user2], function(err, results){
		if(err){
			throw err;

		} else {
			console.log(results);
			if (results.length > 0 ) {
			console.log("adding a friend", results[0].id, results[1].id);
			var makeFriend = {
				user_id1: results[0].id,
				user_id2: results[1].id,
				status: 0
			};
			db.query('INSERT INTO Friends SET ?', makeFriend, function(err, resultss){
				if (err){
					throw err;
				} else {
					console.log("Results upon successful insertion:", resultss);
					response.send("Omg the insert works");
				}
			})

		} else {
		response.send("second query does not work");
			}
		}
	})
})
module.exports = router;