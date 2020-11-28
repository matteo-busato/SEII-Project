var artist;
var id;
var url;

function findGetParameter(parameterName) {  //return the query
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

artist = findGetParameter("username");
id = findGetParameter("id");
getEventData(artist, id);

function getEventData(artist, ismn) {
    var event;
    url = "/api/v1/artists/" + artist + "/events/" + id;
    fetch(url)
        .then(response => response.json())
        .then(function (event) {
            $("#oldTitle").val(event.title);
            $("#oldDate").val(event.date);
            $("#oldPlace").val(event.place);
            $("#oldDescription").val(event.description);
            $("#oldCost").val(event.cost);
        });
}

function sendChange() {
    var event = {
        token: window.sessionStorage.getItem('token')
    };
    if ($("#newTitle").val()) {
        event.title = $("#newTitle").val();
    }
    if ($("#newDate").val()) {
        event.date = $("#newDate").val();
    }
    if ($("#newPlace").val()) {
        event.place = $("#newPlace").val();
    }
    if ($("#newDescription").val()) {
        event.description = $("#newDescription").val();
    }
    if ($("#newCost").val()) {
        event.cost = $("#newCost").val();
    }
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    })
        .then(response => response.json())
        .then(function (response) {
            if (response.message) {
                alert(response.message);
                getEventData(artist, id);
            } else {
                alert(response.error);
            }

        });
}


var trova = function () {
    var type = $('#searchType').val();
    var query = $('#query').val();
    console.log(type);
    console.log(query);

    if (type == 1) {  //searching for artist
        window.location.assign("/artist-mainpage?username=" + query);
    } else if (type == 2) {    //searching for album
        window.location.assign("/artist-selected-album?ismn=" + query);
    } else if (type == 3) {    //searching for product
        window.location.assign("/artist-selected-merch?id=" + query);
    } else {      //searching for event
        window.location.assign("/artist-selected-event?id=" + query);
    }
}