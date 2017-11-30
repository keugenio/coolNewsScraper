  // Whenever someone clicks a more link, show the contents on the content modal
  $(document).on("click", ".moreLink", function() {
    // Empty the comments from the comment section
    $("#comments").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/api/articles/" + thisId
    })
      // With that done, add the comment information to the page
      .done(function(data) {
        console.log(data);
        // The title of the article
        $("#articleTitle").html("<b>" + data.title);        
        $("#articalContent").html(data.content);

      });
  });

  // when any Edit Comment button is clicked, update the modal form with Article's ID
  $(document).on("click", ".btnEditComment", function() {
    $("#editCommentModalTitle").html("Comment for Article: " + $(this).attr("data-id"));
    $("#saveComment").attr("data-id", $(this).attr("data-id"));
    $("#editCommentBody").val("");
  });

   // When you click the saveComment button
  $(document).on("click", "#saveComment", function() {
    // Grab the id associated with the article from the submit button
    let articleID = $(this).attr("data-id");

    // Run a POST request to change the comment, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/add/comment_to/" + articleID,
      data: {
        // comment taken from the form's textarea
        comment: $("#editCommentBody").val()
      }
    })
      // With that done
      .done(function(data) {
        // if success update the corresponding Article comment tab with new comment

    // copy the tab's html and prepend with new comment
          $("#card-" + articleID).append("" +
            "<div class='card' id='card-comment-" + data.Article.comment + "'>" + 
              "<div class='card-body>'" +               
                "<div class='card-text'>" +  $("#editCommentBody").val() +"</div>" +
                "<button class='btn btn-secondary card-link btnDelComment' data-id='" + data.Article.comment +"'>Del</button>" +
              "</div>" + 
            "</div>"
          );

      });

    // Also, remove the values entered in the input and textarea for comment entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click", ".btnDelComment", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // Run a DELET request to delete the comment then delete the local card
    $.ajax({
        method: "DELETE",
        url: "/delete/comment" ,
        data: {
          _id:thisId
        }
    })
    .done(function(data) {
      if (data.returnMessage == "success"){
        $("#card-comment-" + thisId).remove();
      }else
        alert("didn't remove");          
    });
  });

