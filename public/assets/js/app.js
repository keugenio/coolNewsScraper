
$( document ).ready(function() {
  grabArticles();
  // grabNotes();

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
                        "<a data-toggle='tab' class='nav-link nav-item' href='#comment-" + data[i]._id + "'>Comment</a>" +
                      "</li>" +                     
                    "</ul>" +
                    
                  "</div>" +

                  "<div class='card-block h-100 mt-4'>" + 
                        "<div class='tab-content'>" + 
                            "<div class='tab-pane active' id='Article-" + data[i]._id +"'>" + 
                              "<img class='card-img-top ' src='" + data[i].img + "'></img>" + 
                              "<div class='h4 card-title mt-3'>" + data[i].title + "</div>" + 
                              "<div class='card-text'>" + data[i].description + "</div>" + 
                            "</div>" + 
                            "<div class='tab-pane' id='comment-" + data[i]._id + "'>" + 
                                "<span class='text-center'>" + 
                                  "<h3> No comments yet </p>" +
                                  "<button class='btn btn-warning center-block' data-toggle='modal' data-target='editCommentModal'>Add</button>" +
                                "</span>" +
                            "</div>" + 
                            
                        "</div>" +
                  "</div>" + 
                  "<div class='card-footer d-flex justify-content-end'>" + 
                  // "<a class='card-link mr-auto moreLink' href='/api/articles/" + data[i]._id + "'> More...</a>" + 
                  "<button type='button' class='btn btn-success mr-auto moreLink' data-toggle='modal' data-target='#articalModal' " +                   
                  "data-id='" + data[i]._id + "'>More</button>" +                  
                  "<p>published: " + pubDate.toDateString() + "</p></div>" +
                "</div>");
      }
    });
}

  // Whenever someone clicks a p tag
  $(document).on("click", ".moreLink", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/api/articles/" + thisId
    })
      // With that done, add the note information to the page
      .done(function(data) {
        console.log(data);
        // The title of the article
        $("#articleTitle").html("<b>" + data.title);        
        $("#articalContent").html(data.content);

        // // If there's a note in the article
        // if (data.note) {
        //   // Place the title of the note in the title input
        //   $("#titleinput").val(data.note.title);
        //   // Place the body of the note in the body textarea
        //   $("#bodyinput").val(data.note.body);
        // }
      });
  });

  

  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/api/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
});
