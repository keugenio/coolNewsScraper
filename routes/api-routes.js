// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

    
    // Route for getting all Articles from the db
    app.get("/api/articles", function(req, res) {
        // Grab every document in the CoolNewsFeed collection
        db.CoolNewsFeed
        .find({})
        .sort({'pubDate':-1})
        .then(function(dbCoolNewsFeed) {
            res.json(dbCoolNewsFeed);
            })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });

    });
    
    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/api/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.CoolNewsFeed
            .findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("comment")
            .then(function(dbCoolNewsFeed) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbCoolNewsFeed);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
    });

    // Route for getting all Comments from the db
    app.get("/api/comments", function(req, res) {
        // Grab every document in the Comment collection
        db.Comment
            .find({})
            .then(function(dbComment) {
            // If we were able to successfully find Comments, send them back to the client
            res.json(dbComment);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
        });    
};