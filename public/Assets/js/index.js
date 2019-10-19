$(document).ready(function() {
    //Responsive hamburger menu 
    $(".navbar-burger").on('click', function(){
        $('.navbar-burger').toggleClass('is-active');
        $('.dropdown').toggle();
        $('.dropdown').toggleClass('is-open');

    });


// get articles as JSON objects when page loads

$.getJSON('/articles', function(data) {
    for (var i = 0; i < data.length; i++) {
        $('#scrape-results').prepend("<div class = 'result-div'><p class = 'result-text'>" + data[i].title + "<br>" + data[i].description +
        "</p><button class ='save-article button is-info is-medium' data-id='" + data[i]._id + "'><span class='icon'><i class='fa fa-boomark'><span> Save Article</button></div>")
    }
});

$(document).on("click" ,".save-article", function(){
    $(this).children('span.icon').children('i. fa-boomark').removeClass('fa-boomark').addClass('fa-check-circle');
    var articleID = $(this).attr('data-id');
    console.log(articleID);
//Run ajax request to update saved articles 
    $.ajax ({
        method: "POST",
        url: "/save/" + articleID,
        data: {
            saved: true
        }
    }).done(function(data){
        console.log("data: ", data);
    })
})

});