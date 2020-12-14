var artist;
var id;
var url;

var token = window.sessionStorage.getItem('token'); //get the token from sessionStorage

function findGetParameter(parameterName) {  //return the query parameterName
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

getProductData(artist,id);

function getProductData(artist, id) {
    url = "/api/v1/artists/" + artist + "/merch/" + id;
    fetch(url)
        .then(response => response.json())
        .then(function (product) {
            $("#title").val(product.title);
            $("#description").val(product.description);
            $("#qty").val(product.qty);
            $("#cost").val(product.cost);
        });
}

function sendDelete() {
    if ($("#imSure").prop("checked") != false) {
        fetch(url, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token:  token })
        })
            .then(response => response.json())
            .then(function (response) {
                if (response.message) {
                    alert(response.message);
                } else {
                    alert(response.error);
                }
            });
    } else {
        $("#imSureLabel").addClass('text-danger');
    }
}

var trova = function () {       //function for the searchbar, used to recall APIs to search artists / albums / products and events
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