var username = window.sessionStorage.getItem("username");
var userType = window.sessionStorage.getItem("userType");
var token = window.sessionStorage.getItem("token");

function findGetParameter(parameterName) { //return the query
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

var query = findGetParameter("id");

var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
        var data = this.response;

        if (this.status == 200) {
            document.getElementById("error").innerText = "";
            document.getElementById("error").style = "display: none";
            //insert basic info
            document.getElementById("artista").innerText = data.owner;
            document.getElementById("dati").innerText = "Titolo: " + data.title + "\nId: " + data.id +
                "\nDate: " + data.data + "\nDescription: " + data.description + "\nCost: " + data.cost;

            var buttons = document.getElementById("buttons");

            if (userType == "artist" && data.owner == username) { //proprietario pagina
                var button = document.createElement("button");
                button.className = "btn btn-primary ml-2 w-35";
                button.onclick = function () {    //modify element button
                    window.location.assign("/changeEventData?username=" + username + "&id=" + query);
                }
                button.innerText = "modify";
                buttons.appendChild(button);

                var button1 = document.createElement("button");
                button1.className = "btn btn-primary ml-2 w-35";
                button1.onclick = function () {    //modify element button
                    window.location.assign("/deleteEvent?username=" + username + "&id=" + query);
                }
                button1.innerText = "delete";
                buttons.appendChild(button1);
            } else if(username){
                var button = document.createElement("button");
                button.className = "btn btn-primary ml-2 w-35";
                button.onclick = function () {    //modify element button
                    addToCart("event",data.id);
                }
                button.innerText = "add to cart";
                buttons.appendChild(button);
            }

        } else {
            document.getElementById("error").innerText = data.error;
            document.getElementById("error").style = "display: block";
        }
    }
}
xhttp.open("get", "/api/v1/events/" + query, true);
xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
xhttp.send();


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

var addToCart = function(type,ismn){
    var url = '/api/v1/cart/type/' + type + '/id/' + ismn;    
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
    })
        .then(response => response.json())
        .then(function (response) {
            if (response.message) {
                alert(response.message);                
            } else if (response.error) {
                alert(response.error);
            }
        });
}