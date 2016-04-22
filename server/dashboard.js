var express = require('express');
var db = require('./db.js');
var cors = require('cors');
var bodyParser = require('body-parser');
var twilio = require('twilio')('AC40691c0816f7dd360b043b23331f4f43','89f0d01b69bb6bcc473724b5b232b6f4');
var router = express.Router();

var app = express();
app.use(cors());

router.post('/events', function(request, response) {

  var event = request.body.event;
  var timestamp = request.body.time;
  var username = request.body.username;
  var id = request.body.id;

  var events = {eventname: event, timestamp: timestamp};

  //this will send a text message to the "to" user;
  //get twilio trial account to get a phone number which sends texts from "from"
  twilio.sendMessage({
    to: '+1************',
    from: '+1**********',
    body: 'I am available to ' + event + " at " + timestamp
  });
  db.query('INSERT INTO Events SET ?', events, function(err, results){
    if (err) {
      response.sendStatus(500);
    }else{
      var eventId = results.insertId;

      db.query('SELECT * FROM Events WHERE `id` = ?;', [eventId], function(err, rows){
        if(err){
          throw err;
        }else{

          response.send(rows);
          db.query('SELECT * FROM Users WHERE `username` = ?;', [username], function(err, rows2) {
            if(err){
              throw err;
            }else{
              var userId = rows2[0].id;

              addUserEvents(userId, eventId, true);

            }
          });
        }
      })
    }
  });
})


var addUserEvents = function(creator, eventId, status){
  var userEvents = {user_id: creator, event_id: eventId, created_by: status};

  db.query('INSERT INTO UserEvents SET ?', userEvents, function(err, results){
    if (err) {
      console.log(err);
    }else{
      console.log("Add User Events", results);
    }
  });
}

router.get('/upload', function(request, response){
  db.query('SELECT Users.username, Events.eventname, Events.timestamp, UserEvents.id, UserEvents.created_by FROM Users INNER JOIN UserEvents ON Users.id = UserEvents.user_id INNER JOIN Events ON Events.id = UserEvents.event_id ORDER BY event_id', function(err, rows){
    if(err){
      throw err;
    }else{

      response.send(rows);
    }
  })
})


router.post('/userProfile', function(request, response){
  var uid = request.body.id;
  db.query('SELECT username, picture FROM Users WHERE `id`= ?', [uid], function(err, results){
    if (err){
      throw err
    } else {
      console.log("post request fore userProfile", results)
      response.send(results);
    }
  })

})
router.post('/join', function(request, response){
  var username = request.body.user;
  var id = request.body.eventId;

  db.query('SELECT id FROM Users WHERE `username` = ?;', [username], function(err, rows){
    if(err){
      throw err;
    }else{

      var userId = rows[0].id;

      db.query('SELECT event_id FROM UserEvents WHERE `id` = ?;', [id],function(err, rows){
        if(err){
          throw err;
        }else{

          var eventId = rows[0].event_id;

          db.query('SELECT * FROM UserEvents WHERE `user_id` = ? AND `event_id` = ?;', [userId, eventId], function(err, rows) {
            if(err) {
              throw err;
            } else if (rows.length >= 1){

              response.send(true)
            } else {
              addUserEvents(userId, eventId, false);
            }
          })
        }
      })
    }
  })
})

module.exports = router;
