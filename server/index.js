var express = require('express');
var db = require('./db.js');
var cors = require('cors');
var bodyParser = require('body-parser');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

var firebaseTokenGenerator = require('firebase-token-generator');

var tokenGenerator = new firebaseTokenGenerator("yxjLqiN5zDX3L0OjncQs88LLuTRP5DkVPCM0wj68");


var app = express();
app.use(cors());

//checks username and password
router.post('/homepage', function(request, response){
  var username = request.body.username;
  var password = request.body.password;
  var hash = bcrypt.hashSync(password);


  db.query('SELECT * FROM Users WHERE `username` = ?;', [username], function(err, rows) {

    console.log("This is our password in our db", rows[0].password)

    console.log("This is the bcrypt pass true/false",bcrypt.compareSync( password ,rows[0].password ))

    if (err) {
      throw err;
    } else {
      if(!bcrypt.compareSync( password ,rows[0].password )){
        console.log("Incorrect password");
      }else{
        console.log("passes first query");
        db.query('SELECT id FROM Users WHERE `username` =?;', [username], function(err, rows) {
        if (err){
          console.log("error in query");
        } else {
          var stringUID = rows[0].id.toString();
        // console.log("this is the token", token);
        var token = tokenGenerator.createToken({ uid: stringUID, some: "arbitrary", data: "here" });
        console.log("SUPER SUCCESS", token);
        response.send({token: token});
        }

        })

      
      }
    }
  })

});

module.exports = router;
