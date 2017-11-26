var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3001;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/coolNewsFeeds", {
  useMongoClient: true
});

// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  // let url = "http://www.echojs.com/";
  let url = "https://www.boredpanda.com/rss";
  axios.get(url).then(function(response) {
    // console.log(response.data);
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data, {
      ignoreWhitespace: true,
      xmlMode: true
      });
    let countOfNewArticles = 0;

    // Now, we grab every h2 within an article tag, and do the following:
    $("item").each(function(i, element) {

      // Save an empty result object
      var result = {};

      //Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("title").text();

      result.link = $(this).children("guid").text();

      result.img = $(this).children("media\\:thumbnail").attr("url");
      result.description = $(this).children("description").text();
      result.content = $(this).children("content\\:encoded").text(); // the entire feed

      // Create a new Article using the `result` object built from scraping
      db.CoolNewsFeed
        .create(result)
        .then(function(dbCoolNewsFeed) {
          // If we were able to successfully scrape and save a Cool News Feed from Bored Panda, send a message to the client
          console.log("article inserted");
          countOfNewArticles++;
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          // res.json(err);
          console.log(err);
        });

    });

  });
  res.send("Scrape of Bored Panda Completed", {countOfNewArticles:countOfNewArticles});
  // url = "https://itotd.com/blog/"; // more stories for later
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.CoolNewsFeed
    .find({})
    .then(function(dbCoolNewsFeed) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbCoolNewsFeed);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.CoolNewsFeed
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbCoolNewsFeed) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbCoolNewsFeed);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
