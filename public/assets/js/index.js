$( document ).ready(function() {
    grabArticles();
  
    function grabArticles(){  
      // Grab the articles as a json
      $.getJSON("/api/articles", function(data) {
        // For each article
  
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          let pubDate = new Date(data[i].pubDate);
  
          $("#allArticlesWrapper").
          append( "<div class='card p-2 m-1 d-flex' data-id='" + data[i]._id + "' style='width: 20rem;'>" + 
                    "<div class='card-header'>" +
                      "<ul class='nav nav-tabs card-header-tabs articleTabs'>" +
                        "<li class='nav-item'>" +
                          "<a data-toggle='tab' class='nav-link nav-item active'  href='#Article-" + data[i]._id + "'>Article</a>" +
                        "</li>" +
                        "<li class='nav-item'>" +
                          "<a data-toggle='tab' class='nav-link nav-item' id='tab-" +  data[i]._id  + "' href='#comment-" + data[i]._id + "'>Comment</a>" +
                        "</li>" +                     
                      "</ul>" +
                      
                    "</div>" +
  
                    "<div class='card-block'>" + 
                          "<div class='tab-content'>" + 
                              "<div class='tab-pane active' id='Article-" + data[i]._id +"'>" + 
                                "<img class='card-img-top ' src='" + data[i].img + "'></img>" + 
                                "<div class='h4 card-title mt-3'>" + data[i].title + "</div>" + 
                                "<div class='card-text'>" + data[i].description + "</div>" + 
                              "</div>" + 
                              "<div class='tab-pane p-3' id='comment-" + data[i]._id + "'>" + 
                                  "<span class='text-center '>" + 
                                    "<h3> No comments yet </p>" +
                                    "<button class='btn btn-warning center-block btnEditComment' " + 
                                    "data-toggle='modal' " + 
                                    "data-id='" + data[i]._id + "' " +
                                    "data-target='#editCommentModal'>Add</button>" +
                                  "</span>" +
                              "</div>" + 
                              
                          "</div>" +
                    "</div>" + 
                    "<div class='card-footer d-flex justify-content-end'>" + 
                    // "<a class='card-link mr-auto moreLink' href='/api/articles/" + data[i]._id + "'> More...</a>" + 
                    "<button type='button' class='btn btn-success mr-auto moreLink' data-toggle='modal' data-target='#articalModal' " +                   
                    "data-id='" + data[i]._id + "'>More</button>" +                  
                    "<p>published: " + pubDate.toDateString() + "</p></div>" +
                  "</div>"
          );
  
          
        }
      });
      $.getJSON("/api/comments", function(data) {
        for (var i = 0; i < data.length; i++) {
          $("#comment-"+data[i].article).html(
            "<label for='commentField'>Comment:</label>" + 
            "<p id='commentField'>" + 
              data[i].comment + 
            "</p><button class='btn btn-outline-warning' type='button'>Edit</button>"
          )
        }
      });
  }
});