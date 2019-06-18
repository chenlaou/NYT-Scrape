$(document).ready(function() {
	


	$.getJSON("/articles", function(data) {
	  for (var i = 0; i < data.length; i++) {
	  	if (data[i].saved === true) {
	   		$("#saved-results").append("<div class='saved-div'><p class='saved-text'>" + data[i].title + "<br>" + data[i].description +
  										"</p><a class='unsave-button button is-danger is-medium' data-id='" +
										data[i]._id + "'>Remove</a><a class='comments-button button is-info is-medium' data-id='" + data[i]._id +
										"'><span class='icon'><i class='fa fa-comments'></i></span>Comments</a></div>");
	  	}
	  }
	});






	$(document).on("click", ".delete", function() {
		$(".modal").toggleClass("is-active");
		$("#comments-list").html("<p>Write the first comment for this article.</p>");
	});


	$(document).on("click", "#save-comment", function() {
	  var articleID = $(this).attr("data-id");


	  $.ajax({
	    method: "POST",
	    url: "/comment/" + articleID,
	    data: {
	      // Value taken from body input
	      body: $("#new-comment-field").val()
	    }
	  }).done(function(data) {
   
      console.log("data: ", data);
		});


	  $("#new-comment-field").val("");
	  $(".modal").toggleClass("is-active");
	});


	$(document).on("click", ".delete-comment", function() {
		// delete comment
	});

	
	$(document).on("click", ".unsave-button", function() {
		var articleID = $(this).attr("data-id");
		console.log(articleID);
	  $.ajax({
	    method: "POST",
	    url: "/unsave/" + articleID,
	    data: {
	      saved: false
	    }
	  });
	});

});
