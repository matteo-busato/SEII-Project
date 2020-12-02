var username = window.sessionStorage.getItem("username");
var userType = window.sessionStorage.getItem("userType");


var populate = function (classname, what, aHref, owner) {
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
        var button = document.createElement("button");
        button.className = "btn btn-primary ml-2 w-35";

        button.onclick = function () {
            func(onclick);
        }
        button.innerText = "add to cart";
        div.appendChild(button);
        document.getElementById(classname).appendChild(div);
    }
}

var populateArtist = function (artists) {
    for (let i = 0; i < artists.length; i++) {
        var div = document.createElement("div");
        div.className = "d-flex list-group-item  align-items-center";
        var a = document.createElement("a");
        a.className = "list-group-item-action";
        a.href = "/artist-mainpage?username=" + artists[i];
        a.innerText = artists[i];
        div.appendChild(a);
        document.getElementById("followArtists").appendChild(div);
    }
}

var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
        var data = this.response;
        if (this.status == 200) {
            console.log(data);
            document.getElementById("error").innerText = "";
            document.getElementById("error").style = "display: none";
            
            //insert albums,merch,events
            populate("albums", data.albums, "/artist-selected-album?ismn=", false);   //carico gli albums
            document.getElementById("moreAlbums").href = "/albums?";
            populate("events", data.events, "/artist-selected-event?id=", false);   //carico gli eventi
            document.getElementById("moreEvents").href = "/events";
            populate("merch", data.merch, "/artist-selected-merch?id=", false);   //carico il merch
            document.getElementById("moreMerch").href = "/merch";

            if (username != undefined) {    //utente loggato
                document.getElementById("artista").innerText = "ciao " + username + ", questi sono gli artisti che segui:";
                populateArtist(data.artists);
            }

        } else {
            document.getElementById("error").innerText = data.error;
            document.getElementById("error").style = "display: block";
        }
    }
}
if(!username){
    xhttp.open("get", "/api/v1/overview", true);
}else{
    xhttp.open("get", "/api/v1/overview/" + username, true);
}

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