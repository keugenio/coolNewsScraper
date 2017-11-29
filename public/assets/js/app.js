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

        // If there's a comment in the article
        // if (data.comment) {
        //   // Place the title of the comment in the title input
        //   $("#titleinput").val(data.comment.title);
        //   // Place the body of the comment in the body textarea
        //   $("#bodyinput").val(data.comment.body);
        // }
      });
  });

  // when any Edit Comment button is clicked, update the modal form with Article's ID
  $(document).on("click", ".btnEditComment", function() {
    $("#editCommentModalTitle").html("Comment for Article: " + $(this).attr("data-id"));
    $("#commentForm").attr("action", "/add/comment/"+ $(this).attr("data-id"));
    $("#editCommentBody").val("");
  });

   // When you click the saveComment button
  $(document).on("click", "#saveComment", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the comment, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/api/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from comment textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the comments section
        $("#comments").empty();
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
        alert("#card-body-" + thisId);
        $("#card-body-" + thisId).remove();
      }else
        alert("didn't remove");          
    });
  });

