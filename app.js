var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');
var server =  app.listen(3000);
var social = require('./libs/passport.js')(app, passport);
var socket = require('./libs/socket.js')(app, server);
var http = require('http');

// cors mddleware for client reqeuest
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// requiring mongoose objectId
var ObjectId = require('mongodb').ObjectId; 
var dbpath = 'mongodb://localhost/quizApp';

db = mongoose.connect(dbpath);
// database connection
mongoose.connection.once('open', function(){
	console.log('database connection opened');
});

// adding models file

var fs = require('fs');
fs.readdirSync('./app/models').forEach(function(file){
	if (file.indexOf('.js')) {
		require('./app/models/'+file);
	}
});

// adding controllers file

fs.readdirSync('./app/controllers').forEach(function(file){
	if (file.indexOf('.js')) {
		var route = require('./app/controllers/'+file);
		route.controller(app);
	}
});

server.listen(process.env.PORT || 3000, function(){
	console.log('Quiz app listening on port 3000!')
});