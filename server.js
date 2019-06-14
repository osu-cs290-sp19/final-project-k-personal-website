var fs = require('fs');
var path = require('path');
var express = require('express');
var hbs = require('express-handlebars');
var db = require('./dbcon.js'); // MariaDB connection

var app = express();
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.engine('handlebars', hbs({
	defaultLayout: 'skeleton',
	partialsDir: [
		'views/partials'
	]
}));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// use specified port or 3000 by default
var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
	res.status(200);
	res.render("home");
});

app.get('/biography', function(req, res) {
	res.status(200);
	res.render("biography");
});

app.get('/cv', function(req, res) {
	res.status(200);
	res.render("cv");
});

app.get('/contact', function(req, res){
	res.status(200);
	res.render("contact");
});

app.get('/inbox', function(req, res){
	// retrieve all information in messages table
	db.pool.query("SELECT * FROM messages;", [], function (error, results, fields) {
		if (error || !results) {
			console.error("!! Something is wrong with the database.");
			console.log("== Exiting");
			process.exit(0);
		}
		res.status(200);
		res.render("inbox", {comments: results}); // use results from database in JS/Handlebars field "comments"
	});
})

app.get('*', function (req, res) {
  res.status(404);
  res.render("404");
});

app.post('/handler', function (req, res) {
	console.log(req.body);

	// next line is vulnerable to SQL injection
	// text between `` is sent directly to MariaDB, except ${} uses variables from this JS file
	db.pool.query(`INSERT messages (author, text) VALUES ('${req.body.author}', '${req.body.text}');`,
	 [], 
	 function (error, results, fields) {
		if (error || !results) {
			console.error("!! Something is wrong with the database.");
			console.log("== Exiting");
			process.exit(0);
		}
		// status code 301; redirect to home page
		res.redirect(301, '/');
	});
});

app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
