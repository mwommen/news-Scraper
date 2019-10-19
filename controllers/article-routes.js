var express = require('express');
var axios = require('axios');
var cheerio = require('cheerio');
var Comment = require('../models/Comment.js');
var db = require('../models');
var router = express.Router();


router.get('/scrape', function(req,res){
  console.log('hi')
  axios.get("https://www.espnfrontrow.com/category/news/breaking-news/").then( function(response) {
    var $ = cheerio.load(response.data);
    const results = [];
    $("#masonry-grid").children().each(function(i,element){
      console.log(element)
        const result = {};
        result.title = $(element).find('.entry-title > a').attr('title');
        result.description = $(element).find('.entry-content > p').text()
    results.push(result)

// entry.save(function(err, doc) {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       console.log(doc);
//     }
//   });

});
console.log(results)
//Reloading the page 
//Remove invalid articles
const filteredArticles = results.filter(article => article.title && article.description);
db.Article.insertMany(filteredArticles)
.then(() => {
  res.redirect("/");
})
.catch(err => {
  console.log(err);
  res.json({err});
})
});  
});




//Set up articles to be scraped from MongoDB
router.get('/articles', function(req, res) {
    db.Article.find({})
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
        db.Article.findAndUpdate({ "_id": req.params.id }, {"saved": true})
        .exec(function(err,doc) {
            if(err)
            console.log(err) 
            else {
            console.log("doc: ", doc);
            }
        });
    });

    //Build routes for saved articles 
router.get('articles/:id', function(req,res) {
    db.Article.findOne({"_id":req.params.id})
    .populate(
        ('comments')
    .then(function(err,doc) {
        if (error) {
            console.log(error);
          }
          // Otherwise, send the doc to the browser as a json object
          else {
            res.json(doc);
          }
        }));
      
        
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
    })
 });


//Removing saved articles 
router.post('/unsave/:id', function(req,res) {
    db.Article.findAndUpdate({" _id": req.params.id}, {'saved': false})
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