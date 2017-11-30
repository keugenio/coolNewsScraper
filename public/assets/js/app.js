$(document).ready(function() {

  $(".card-body").each(function(){

    $(this).html($(this).text());
  });



  // Whenever someone clicks a More Button, show the contents on the Content modal
  $(document).on("click", ".moreLink", function() {
    let articleID = $(this).attr("data-id");
    // Make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/api/articles/" + articleID
    })
      // With that done, add the information to the modal with the title and content of the article
      .done(function(data) {
        $("#articleTitle").html("<b>" + data.title);        
        $("#articalContent").html(data.content);

      });
  });

  // when any Edit Comment button is clicked, update the Comment modal form with Article's ID
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
          $("#card-" + articleID).prepend("" +
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

});