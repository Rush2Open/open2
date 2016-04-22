var express = require('express');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var cors = require('cors');
var bodyParser = require('body-parser');



var router = express.Router();

var app = express();
app.use(cors());

//adds a new user to database
router.post('/newuser', function(request, response){

  var username = request.body.username;
  var password = request.body.password;
  var picture = request.body.pic;
  console.log('picture: ',picture);
  var hashedPass = bcrypt.hashSync(password, 10);

  var user = {username: username, password: hashedPass, picture: picture};

  db.query('INSERT INTO Users SET ?', user, function(err, results){
    if(err){
      response.sendStatus(500);
    }else{
      response.send('/login');
    }
  })
});

module.exports = router;
