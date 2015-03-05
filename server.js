var Express = require('express');
var Mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var session = require('express-session');
var app = Express();
var appName = '';

var expressPort = process.env.EXPRESS_PORT || 9001;
var mongoURI = process.env.MONGO_URI || 'http://localhost:27017/' + appName;

passport.serializeUser(function(obj, done){
  done(null, obj);
});

passport.deserializeUser(function(obj, done){
  done(null, obj);
})

app.use(Express.static(__dirname + '/public'))


app.use(session({secret: 'PUT_SECRET_HERE'}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CB || 'http://localhost:' + expressPort + '/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: 'openid profile email https://www.googleapis.com/auth/plus.login' }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  	function(req, res) {
    	// Successful authentication, redirect home.
    	res.send(req.user);
  });

Mongoose.connect(mongoURI, function(){
	console.log('Connected to mongo at: ' + mongoURI);
	app.listen(expressPort, function(){
		console.log('Now listening on port: ' + expressPort);
	});
});