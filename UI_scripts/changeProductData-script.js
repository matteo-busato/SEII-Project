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
getProductData(artist, id);

function getProductData(artist, id) {
    url = "/api/v1/artists/" + artist + "/merch/" + id;
    fetch(url)
        .then(response => response.json())
        .then(function (product) {
            $("#oldTitle").val(product.title);
            $("#oldDescription").val(product.description);
            $("#oldQty").val(product.qty);
            $("#oldCost").val(product.cost);
        });
}

function sendChange() {
    var product = {
        token: window.sessionStorage.getItem('token'),
        title: $("#newTitle").val(),
        description: $("#newDescription").val(),
        qty: $("#newQty").val(),
        cost: $("#newCost").val()
    };
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(function (response) {
            if (response.message) {
                alert(response.message);
                window.location.replace("http://" + window.location.host +  "/changeProductData?username=" + artist + "&id=" + id);
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