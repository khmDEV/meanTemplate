// modules =================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


// config files ============================================

// configuration ===========================================

// Mongo conection =========================================
 var db = require('./config/db');
 mongoose.connect(db.url, { useNewUrlParser: true });

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({
  extended: true
})); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));


 // Session ==================================================
var sessions = require('express-session');
app.use(sessions({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: "lol",//require('crypto').randomBytes(64).toString('hex'), // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  proxy: true,
  resave: true,
  saveUninitialized: true,
  activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));

// routes ==================================================
app.use('/',require('./app/routes/mainRoutes'));
app.use('/API/user/',require('./app/routes/user/APIUserLogin'));
app.use('/API/user/',require('./app/routes/user/APIUserRegister'));

// start app ===============================================
var port = process.env.PORT || 8080; // set our port
app.listen(port);
console.log('Magic happens on port ' + port); // shoutout to the user
exports = module.exports = app; // expose app
