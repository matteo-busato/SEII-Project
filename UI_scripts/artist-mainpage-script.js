var albums = document.getElementById('albums'); // Get the list where we will place albums
var merch = document.getElementById('merch'); // Get the list where we will place merch
var events = document.getElementById('events'); // Get the list where we will place getEvents

var username = window.sessionStorage.getItem("username");
var userType = window.sessionStorage.getItem("userType");

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

var query = findGetParameter("username");

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
        if (owner) {
            button.onclick = function () {    //modify element button
                if (classname == "albums")
                    window.location.assign("/changeAlbumData?username=" + username + "&ismn=" + what[i].ismn);
                else if (classname == "events")
                    window.location.assign("/changeEventData?username=" + username + "&id=" + what[i].id);
                else {
                    window.location.assign("/changeProductData?username=" + username + "&id=" + what[i].id);
                }
            }
            button.innerText = "modify";
            var button2 = document.createElement("button");
            button2.className = "btn btn-primary ml-auto w-35";
            button2.onclick = function () {    //delete element button
                if (classname == "albums")
                    window.location.assign("/deleteAlbum?username=" + username + "&ismn=" + what[i].ismn);
                else if (classname == "events")
                    window.location.assign("/deleteEvent?username=" + username + "&id=" + what[i].id);
                else {
                    window.location.assign("/deleteProduct?username=" + username + "&id=" + what[i].id);
                }
            }
            button2.innerText = "delete";
            div.appendChild(button2);

        } else {
            button.onclick = function () {
                func(onclick);
            }
            button.innerText = "add to cart";
        }

        div.appendChild(button);
        document.getElementById(classname).appendChild(div);
    }
}

var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
        var data = this.response;
        if (this.status == 200) {
            document.getElementById("error").innerText = "";
            document.getElementById("error").style = "display: none";

            //insert basic info
            document.getElementById("artista").innerText = data.artist.username;
            document.getElementById("bio").innerText = data.artist.bio;
            if (userType == "artist" && data.artist.username == username) { //proprietario pagina
                //insert albums,merch,events
                populate("albums", data.albums, "/artist-selected-album?ismn=", true);   //carico gli albums
                document.getElementById("moreAlbums").href = "/artist-albums?username=" + data.artist.username;
                populate("events", data.events, "/artist-selected-event?id=", true);   //carico gli eventi
                document.getElementById("moreEvents").href = "/artist-events?username=" + data.artist.username;
                populate("merch", data.merch, "/artist-selected-merch?id=", true);   //carico il merch
                document.getElementById("moreMerch").href = "/artist-merch?username=" + data.artist.username;

                document.getElementById("addAlbum").href = "/addNewAlbum?username=" + data.artist.username;
                document.getElementById("addProduct").href = "/addNewProduct?username=" + data.artist.username;
                document.getElementById("addEvent").href = "/addNewEvent?username=" + data.artist.username;

                $('#addAlbum').show();
                $('#addProduct').show();
                $('#addEvent').show();

            } else { //utente semplice
                //insert albums,merch,events
                populate("albums", data.albums, "/artist-selected-album?ismn=", false);   //carico gli albums
                document.getElementById("moreAlbums").href = "/artist-albums?username=" + data.artist.username;
                populate("events", data.events, "/artist-selected-event?id=", false);   //carico gli eventi
                document.getElementById("moreEvents").href = "/artist-events?username=" + data.artist.username;
                populate("merch", data.merch, "/artist-selected-merch?id=", false);   //carico il merch
                document.getElementById("moreMerch").href = "/artist-merch?username=" + data.artist.username;
            }
        } else {
            document.getElementById("error").innerText = data.error;
            document.getElementById("error").style = "display: block";
        }


    }
}
xhttp.open("get", "/api/v1/artists/" + query, true);
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

var follow = function () {
    var url = '/api/v1/artists/' + query + '/follow'
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username })
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