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
    scrape(url);
    url = "https://mashable.com/culture/rss/";
    scrape(url);

    res.redirect("/");
    // url = "https://itotd.com/blog/"; // more stories for later
    });

function scrape(url){
    let count = 0;

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
            let aDescription = $(this).children("description").text();
            aDescription = aDescription.replace(/<p\b[^>]*>SEE(.*?)<\/p>/gi, ""); // remove SEE MORE links
            aDescription = aDescription.replace(/<img(.*?)\/>/g, ""); // remove any images in description <p>[\s]*</p>
            aDescription = aDescription.replace(/Read more.*/g, ""); // remove social links
            aDescription = aDescription.replace(/<a (.*?)>/g,"");
            aDescription = aDescription.replace(/<\/a>/g,"");
            aDescription = aDescription.replace(/<iframe (.*?)<\/iframe>/g,"");
            aDescription = aDescription.replace(/http(.?)[^<]*/g,"");
            aDescription = aDescription.replace(/ <div(.*?)<\/div>/g,"");
            aDescription = aDescription.replace(/h2/g,"p");
            aDescription = aDescription.replace(/<div(.*?)>/g,"");
            aDescription = aDescription.replace(/<\/div/g,"");

            let aContent = $(this).children("content\\:encoded").text();
            aContent = aContent.replace(/<a(.*?)<\/div>/g, ""); // remove social links
            aContent = aContent.replace(/ <div(.*?)<\/div>/g,"");
            aContent = aContent.replace(/ <\/div>/g,"");
            aContent = aContent.replace(/<div(.*?)>/g,"");
            aContent = aContent.replace(/<\/div/g,"");            
            //Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children("title").text();
    
            result.link = $(this).children("guid").text();
    
            result.img = $(this).children("media\\:thumbnail").attr("url");
            result.description = aDescription;
            result.content = aContent; // the entire feed
            result.pubDate = new Date($(this).children("pubDate").text());
            // Create a new Article using the `result` object built from scraping
            db.CoolNewsFeed
            .create(result)
            .then(function(dbCoolNewsFeed) {
                // If we were able to successfully scrape and save a Cool News Feed from Bored Panda, send a message to the client
                console.log("***count:" + this.count());
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                // res.json(err);
                console.log(err);
            });
    
        });
    });

}

};

