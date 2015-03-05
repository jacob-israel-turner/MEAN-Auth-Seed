var Express = require('express');
var Mongoose = require('mongoose');
var App = Express();
var appName = '';

var expressPort = process.env.EXPRESS_PORT || 9001;
var mongoURI = process.env.MONGO_URI || 'http://localhost:27017/' + appName;

App.use(Express.static(__dirname + '/public'))

Mongoose.connect(mongoURI, function(){
	console.log('Connected to mongo at: ' + mongoURI);
	App.listen(expressPort, function(){
		console.log('Now listening on port: ' + expressPort);
	});
});