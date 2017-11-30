var path = require('path');
var db = require("../models");


module.exports = function(app) {

    app.delete("/delete/comment", function(req, res) {
        db.Comment
        .remove(req.body)
        .then(function(dbCoolNewsFeed) {
            res.send({returnMessage:"success",successMessage:"your comment was deleted"});
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            // res.json(err);
            console.log(err);
        });
    });

    // Route for saving/updating an Article's associated Comment
    app.post("/add/comment_to/:articleID", function(req, res) {
        // Create a new note and pass the req.body to the entry

        db.Comment    
        .create({comment:req.body.comment})
        .then(function(dbComment) { 
            // If a Note was created successfully, find one CoolNewsFeed with an `_id` equal to `req.params.id`.  
            // Update the CoolNewsFeed to be associated with the new Comment 
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query 
            return db.CoolNewsFeed.findOneAndUpdate({ _id: req.params.articleID }, { comment: dbComment._id }, {new: true}); 
        }) 
        .then(function(dbCoolNewsFeed) { 
                res.send({Article:dbCoolNewsFeed}); 
        });                 

    });

};
