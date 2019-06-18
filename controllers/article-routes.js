var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");
var router = express.Router();

router.get("/scrape", function(req,res){
	request("https://www.nytimes.com/", function(error,response, html){
		var $ = cheerio.load(html);
		$("article").each(function(i,element){
			var result = {};
			result.title = $(this).children("h2").text();
			result.summary = $(this).children("p").text();
			result.link = $(this).children("h2").children("a").attr("href");


      var entry = new Article(result);
    
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });
    res.redirect("/");
  });  
});



router.get("/articles", function(req, res) {
  Article.find({})
  .exec(function(err, doc) {
    if (err) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


router.post("/save/:id", function(req, res) {
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("doc: ", doc);
    }
  });
});


// Routes for saved articles

router.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("comments")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// Create a comment
router.post("/comment/:id", function(req, res) {
  var newComment = new Comment(req.body);
  newComment.save(function(error, newComment) {
    if (error) {
      console.log(error);
    }
    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("doc: ", doc);
          res.send(doc);
        }
      });
    }
  });
});


router.post("/unsave/:id", function(req, res) {
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Article Removed");
    }
  });
  res.redirect("/saved");
});


module.exports = router;
