$("#colorButtons").text("Testing!");

var colorList = ["Purple", "Green", "Rainbow", "Orange"];

// Function for displaying movie data
	function renderButtons() {

		// Delete the content inside the movies-view div prior to adding new movies
		// (this is necessary otherwise you will have repeat buttons)
		$("#colorButtons").empty();

		// Loop through the array of movies, then generate buttons for each movie in the array
		for (i = 0; i < colorList.length; i++) { 
			var a = $("<button>");
				a.addClass("colorB");
				a.attr("data-name", colorList[i]);
				a.text(colorList[i]);
				$("#colorButtons").append(a);
			}

    };

    window.onload = renderButtons;

    // This function handles events where one button is clicked
    $("#colorAdd").on("click", function(event) {
        // event.preventDefault() prevents the form from trying to submit itself.
        // We're using a form so that the user can hit enter instead of clicking the button if they want
        event.preventDefault();
        // This line will grab the text from the input box
        var color = $("#colorInput").val().trim();
        // The movie from the textbox is then added to our array
        colorList.push(color);
        // calling renderButtons which handles the processing of our movie array
        renderButtons();
      });

    // Event listener for all button elements
    $("#colorButtons").on("click", ".colorB", function() {
        // In this case, the "this" keyword refers to the button that was clicked
        var name = $(this).attr("data-name");
        console.log(this)
        // Constructing a URL to search Giphy for the name of the person who said the quote
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
          name + "&api_key=0GWXTZt4Yo0IWxy02HD3Tspqy9Mzg3UK";
        // Performing our AJAX GET request
        $.ajax({
            url: queryURL,
            method: "GET"
          })
          // After the data comes back from the API
          .then(function(response) {
            // Storing an array of results in the results variable
            var results = response.data;
            // Looping over every result item
            for (var i = 0; i < results.length; i++) {
              // Only taking action if the photo has an appropriate rating
              if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
                // Creating a div with the class "item"
                var gifDiv = $("<div class='item'>");
                // Storing the result item's rating
                var rating = results[i].rating;
                // Creating a paragraph tag with the result item's rating
                var p = $("<p>").text("Rating: " + rating);
                // Creating an image tag
                var colorImage = $("<img>");
                // Giving the image tag an src attribute of a proprty pulled off the
                // result item
                colorImage.attr("data-still", results[i].images.fixed_height_still.url);
                colorImage.attr("data-animate", results[i].images.fixed_height.url);
                colorImage.attr("src", results[i].images.fixed_height_still.url);
                colorImage.attr("data-state", "still");
                colorImage.attr("class", "img");
                // Appending the paragraph and personImage we created to the "gifDiv" div we created
                gifDiv.append(p);
                gifDiv.append(colorImage);
                // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
                $("#colors").prepend(gifDiv);
              }
            }
          });
      });

      $("#colors").on("click", ".img", function() {
        // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
        var state = $(this).attr("data-state");
        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value
        if (state === "still") {
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-state", "animate");
        } else {
          $(this).attr("src", $(this).attr("data-still"));
          $(this).attr("data-state", "still");
        }
      });