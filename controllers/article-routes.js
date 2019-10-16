var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var Comment = require('../models/Comment.js');
var Article = require('../models/Article.js');
var router = express.Router();


router.get('/scrape', function(req,res){
request("https://www.espnfrontrow.com/category/news/breaking-news/", function(error, response, html) {
    var $ = cheerio.load(html);
    $("div.newsList > article").each(function(i,element){
        let result = {};

        result.title = $(element).children('div.item-info').children('h2.title').html();
        result.description = $(element).children('div.item-info').children('p-teaser').children('a').text()

let entry = new Article(result);

entry.save(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(doc);
    }
  });

});
//Reloading the page 
res.redirect("/");
});  
});




//Set up articles to be scraped from MongoDB
router.get('/articles', function(req, res) {
    Article.find({})
    .exec(function(err,doc) {
        if (err) {
            console.log(err);
          }
          else {
              res.json(doc);
          }
        });
    });

    //Save articles 
    router.post('save/:id', function(req,res) {
        Article.findAndUpdate({ "_id": req.params.id }, {"saved": true})
        .exec(function(err,doc) {
            if(err)
            console.log(err) 
            else {
            console.log("doc: ", doc);
            }
        });
    });

    //Build routes for saved articles 
router.get('articles/:id', (function(req,res) {
    Article.findOne({"_id":req.params.id})
    .populate(
        ('comments')
    .exec(function(err,doc) {
        if (error) {
            console.log(error);
          }
          // Otherwise, send the doc to the browser as a json object
          else {
            res.json(doc);
          }
        
    });

router.post ('/comment/:id', function(req,res) {
 var newComment = new Comment(req.body);
 newComment.save(function(error, newComment) {
    if (error) {
    console.log(error);
    }
    else {
        Article.findAndUpdate({ "_id": req.params.id}, {$push: {"comments": newComment._id}}, {new:true})
        .exec(function(err,doc) {
            if (err) {
                console.log(err);
            } else {
                console.log('doc',doc)
                res.send(doc);
            }
        })}; 
    }
 })
})

//Removing saved articles 
router.post('/unsave/:id', function(req,res) {
    Article.findAndUpdate({" _id": req.params.id}, {'saved': false})
    .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Log result
        else {
          console.log("Article Removed");
        }
      });
      res.redirect("/saved");
    });
    
module.exports = router;