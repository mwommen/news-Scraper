var bodyParer = require ("body-parser")
var mongoose = require ("mongoose");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");
var express = require("express");
var htmlRouter = require ('./controllers/html-routes');
var articleRouter = require('./controllers/article-routes');
var port = process.env.PORT || 3000;
var app = express();


app.use(bodyParer.urlencoded({
    extended:false
}));

//Initialize handlebars 
app.engine("handlebars",exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

  app.use(htmlRouter);
  app.use(articleRouter);

app.use(express.static("public"));
// Check on MONGODB connection
var URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/WebScraper';

// var uristring =
// process.env.MONGOLAB_URI ||
// process.env.MONGOHQ_URL ||
// 'mongodb://localhost/WebScraper';

var port = process.env.PORT || 3000;

mongoose.connect(URI, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
      app.listen(port, (err) => {
        if(err) throw err;

        console.log ('Succeeded connected to threadId: ' + res.threadId + "\non PORT" + port);
      })
  }
});

