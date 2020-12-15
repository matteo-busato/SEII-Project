var artistName;
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
        
artistName = findGetParameter("username");
       
// redirecting to change info page button
function sendChange(){
    window.location.assign("/changeInfo?username=" + artistName);
}

// redirecting to delete info page button
function sendDelete(){
    window.location.assign("/deleteInfo?username=" + artistName);
}

function sendNewInfo() {
    url = "/api/v1/artists/" + artistName;
    var artist = {
        token: window.sessionStorage.getItem('token'),
        name: '',
        password: '',
        bio: $("#bio").val(),
        email: ''
    };
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artist)
    })
    .then(response => response.json())
    .then(function (response) {
        if (response.message) {
            alert(response.message);
        } else {
            alert(response.error);
        }
    });
}

var trova = function(){ //function for the searchbar, used to recall APIs to search artists / albums / products and events
    var type = $('#searchType').val();
    var type = $('#searchType').val();
    var query = $('#query').val();
    console.log(type);
    console.log(query);
    if(type == 1){  //searching for artist
        window.location.assign("/artist-mainpage?username="+ query);
    }else if(type == 2){    //searching for album
        window.location.assign("/artist-selected-album?ismn="+ query);
    }else if(type == 3){    //searching for product
        window.location.assign("/artist-selected-merch?id="+ query);
    }else{      //searching for event
        window.location.assign("/artist-selected-event?id="+ query);
    }
}