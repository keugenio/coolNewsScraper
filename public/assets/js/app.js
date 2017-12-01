$(document).ready(function() {
  if ($(".card-article").length>sessionStorage.currentArticleCount){
    alert($(".card-article").length-sessionStorage.currentArticleCount + " New Articles for you to read!");
  }

    sessionStorage.currentArticleCount = $(".card-article").length;
  

  // handle bars loads each description as text and not html. this work around just takes the text of
  // each title and description element and  
  // reloads it as html for each article.
  $(".descriptionElement").each(function(){
    $(this).html($(this).text());
  });
  $(".card-title").each(function(){
    $(this).html($(this).text());
  });

  $(document).on("click", "#getMoreNews", function() {
      $.ajax({
        method: "GET",
        url: "/scrape/"
      })
      .done(function(data) {
        alert(data.message);
        location.reload();
      });
  });
  $(document).on("click", "#purgeOldNews", function() {
    $.ajax({
      method: "GET",
      url: "/purge/"
    })
    .done(function(data) {
      alert(data.message);
      location.reload();
    });
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
            "<div class='card' id='card-comment-" + data.coolNews.comment + "'>" + 
              "<div class='card-body'>" +               
                "<div class='card-text' ><p>" +  $("#editCommentBody").val() +"</p></div>" +
                "<button class='btn btn-secondary card-link btnDelComment w-25' data-id='" + data.coolNews.comment +"'>Del</button>" +
              "</div>" + 
            "</div>"
          );

      });
  });

  $(document).on("click", ".btnDelComment", function() {
    // Grab the id associated with the article from the submit button
    let thisId = $(this).attr("data-id");
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
  function articleCount(currentArticleCount){
    $.ajax({
      method: "GET",
      url: "/count/"
    })
    .done(function(dbCount){
      currentArticleCount = parseInt(dbCount.count);
    });
  }

});
