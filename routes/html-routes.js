var path = require('path');
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  // goes to home page when accessing home page of site
  app.get("/", function(req, res) {
    res.render("index");
  });

      // A GET route for scraping the echojs website
      app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with request
        // let url = "http://www.echojs.com/";
        let url = "https://www.boredpanda.com/rss";
        let countOfNewArticles = 0;
    
        countOfNewArticles = scrape(url);

        if (countOfNewArticles>0){
            res.render("index", {successMessage:"Scrape of " + countOfNewArticles + " new articles from Bored Panda."});
        } else {
            res.render("index", {errorMessage:"no new articles from Bored Panda available now."});
        }
        // url = "https://itotd.com/blog/"; // more stories for later


    });

function scrape(url){
    let countOfNewArticles = 0;

    axios.get(url).then(function(response) {
        // console.log(response.data);
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data, {
            ignoreWhitespace: true,
            xmlMode: true
            });

    
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
            result.pubDate = new Date($(this).children("pubDate").text());
            // Create a new Article using the `result` object built from scraping
            db.CoolNewsFeed
            .create(result)
            .then(function(dbCoolNewsFeed) {
                // If we were able to successfully scrape and save a Cool News Feed from Bored Panda, send a message to the client
                countOfNewArticles++;
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                // res.json(err);
                console.log(err);
            });
    
        });
    });

    return countOfNewArticles;

}

};

