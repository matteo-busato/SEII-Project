var username = window.sessionStorage.getItem("username");
var userType = window.sessionStorage.getItem("userType");
var token = window.sessionStorage.getItem("token");

var populate = function (classname, what, aHref, onclick) {
    for (let i = 0; i < what.length; i++) {
        var div = document.createElement("div");
        div.className = "d-flex list-group-item  align-items-center";
        var a = document.createElement("a");
        a.className = "list-group-item-action";
        if (what[i].ismn != undefined)
            a.href = aHref + what[i].ismn;
        else
            a.href = aHref + what[i].id;
        a.innerText = what[i].title;
        div.appendChild(a);
        if (username) {
            var button = document.createElement("button");
            button.className = "btn btn-primary ml-auto w-35";
            button.onclick = function () {
                addToCart("event",what[i].id);
            }
            button.innerText = "add to cart";
            div.appendChild(button);
        }
        document.getElementById(classname).appendChild(div);
    }
}

var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
        var data = this.response;
        console.log(data);

        if (this.status == 200) {
            document.getElementById("error").innerText = "";
            document.getElementById("error").style = "display: none";
            //insert albums
            populate("events", data, "/artist-selected-event?id=", "events");   //carico gli albums
        } else {
            document.getElementById("error").innerText = data.error;
            document.getElementById("error").style = "display: block";
        }
    }
}
xhttp.open("get", "/api/v1/events", true);
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

var addToCart = function (type, ismn) {
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