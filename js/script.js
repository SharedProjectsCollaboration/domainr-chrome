var previous_search


$(document).ready( function() {

  var createChromeTab = function(url) {
    return chrome.tabs.create({
      url: url
    })
  }

  var API_URL = "http://domai.nr/api/json/search?client_id=chrome_extension&q="
    , selected_domain

  $("#results-list").hover(function() {
    $(".selected").removeClass("selected")
  });

  $("#search-form").submit( function(ev) {
    ev.preventDefault()

    $("#loader").css('visibility', 'visible');
    var query       = $("#query").val()
    previous_search = query
    $.getJSON(API_URL + query, null, function(response) {

      $("#results-list").empty()
      // if ($("#search-query").length) {
        // $("#search-query").text(query)
      // } else {
        // $("<p id='search-query'>" + query + "</p>").insertBefore("#results")
      //}
      $.each(response.results,function(i, result){
        $("#results-list").append("<li class='" + result.availability + "'><a href='http://domai.nr/" + query + "'><span class='bg'></span><span class='domain'>" + result.domain + "</span></a></li>")
      })

      $("#loader").css('visibility', 'hidden');     // hide the spinny thingy.


    })

  })

  function moveSelectionUp() {
    if ( $(".selected").length ) {
      if ( $(".selected").prev().length ) {
        $("#results-list li.selected").removeClass('selected')
                                      .prev()
                                      .addClass('selected')
      } else {
        $("#results-list li.selected").removeClass('selected')
        $("#results-list li").last().addClass('selected')
      }
    } else {
      $("#results-list li").last().addClass('selected')
    }
  }

  function moveSelectionDown() {
    if ( $(".selected").length ) {
      if ( $(".selected").next().length ) {
        $("#results-list li.selected").removeClass('selected')
                                      .next()
                                      .addClass('selected')
      } else {
        $("#results-list li.selected").removeClass('selected')
        $("#results-list li").first().addClass('selected')
      }
    } else {
      $("#results-list li").first().addClass('selected')
    }
  }

  $("#query").keydown( function(ev) {
    if (ev.keyCode === 38 || ev.keyCode === 40) {
      ev.preventDefault()
      if (ev.keyCode === 38) {
        moveSelectionUp();
      } else {
        moveSelectionDown();
      }
    }
  })

  $("#query").keyup( function(ev) {
    window.clearTimeout(t)

    if (ev.keyCode === 38 || ev.keyCode === 40) {
      ev.preventDefault();
      return true;
    }

    if (ev.keyCode === 13) {
      if ($(this).val() === previous_search) {
        var url;
        if ($(".selected a").length > 0) {
          url = $(".selected a").attr('href') + "/with/" + $(".selected a").text()
        }
        else {
          url = "http://domai.nr/" + $("#query").val()
        }
        createChromeTab(url)

      }
    }

    else if ( $(this).val().length > 0 ) {
      var t = window.setTimeout( function() {
        $("#search-form").submit()
      }, 200)
    }

    else {
      $("#results-list").empty()
    }

  })

  $("#results-list li a").live('click', function(ev) {
    var url = $(this).attr('href') + "/with/" + $(this).text()
    createChromeTab(url)
  })

})
