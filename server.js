var bodyParer = require ("body-parser")
var mongoose = require ("mongoose");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");
var express = require("express");
// var hmtlRouter = require ('.controllers/html-routes.js');
// var articleRouter = require('.controllers/article-routes.js ')
var port = process.env.PORT || 3000;
var app = express();


app.use(bodyParer.urlencoded({
    extended:false
}));

//Initialize handlebars 
app.engine("handlebars",exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// app.use('/', hmtlRouter);
// app.use('/', articleRouter);

app.use(express.static("public"));
// Check on MONGODB
var URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/WebScraper';


// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/WebScraper';

var theport = process.env.PORT || 3000;

mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

