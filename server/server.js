 var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db.js');
var cors = require('cors');
var twilio = require('twilio')('AC40691c0816f7dd360b043b23331f4f43','89f0d01b69bb6bcc473724b5b232b6f4');

var app = express();

app.use(cors());

//routes
var index = require('./index');
var signup = require('./signup');
var dashboard = require('./dashboard');
var friends = require('./friends.js');

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client'));

app.use('/index', index);
app.use('/signup', signup);
app.use('/dashboard', dashboard);
app.use('/friends', friends);

var host = process.env.PORT || 8080;

app.listen(host, console.log("Host is working", host));
