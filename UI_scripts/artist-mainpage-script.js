var albums = document.getElementById('albums'); // Get the list where we will place albums
var merch = document.getElementById('merch'); // Get the list where we will place merch
var events = document.getElementById('events'); // Get the list where we will place getEvents

//get username / userType and token from the sessionStorage
var username = window.sessionStorage.getItem("username");
var userType = window.sessionStorage.getItem("userType");
var token = window.sessionStorage.getItem("token");

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

var query = findGetParameter("username");

//populate the html page with data coming from the database
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
        if (owner) {    //if I'm the owner of the page
            var button = document.createElement("button");
            button.className = "btn btn-primary ml-2 w-35";
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
            div.appendChild(button);
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

        } else if (username) {   //if I'm a logged user, implement the addToCart button
            var button = document.createElement("button");
            button.className = "btn btn-primary ml-2 w-35";
            button.onclick = function () {
                if (classname == "albums")
                    addToCart("album", what[i].ismn);
                else if (classname == "events")
                    addToCart("event", what[i].id);
                else
                    addToCart("merch", what[i].id);
            }
            button.innerText = "add to cart";
            div.appendChild(button);
        }


        document.getElementById(classname).appendChild(div);
    }
}

//calls to the server to retrieves data from the database
var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
        var data = this.response;
        if (this.status == 200) {   //The API calls returns OK state
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
        } else {        //displays the errors on the html page
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

var checkfollow = function () {
    if (token) {
        var url = '/api/v1/artists/' + query + '/follow'
        var myHeaders = new Headers();
        myHeaders.append('x-access-token', token);
        fetch(url, {
            method: 'GET',
            headers: myHeaders
        })
            .then(response => response.json())
            .then(function (response) {
                if (response.message) {
                    if (response.message == 'follow') {
                        var btn = document.getElementById('btnFollow');
                        btn.textContent = 'Unfollow';
                        btn.onclick = unfollow;
                    } else if (response.message == 'not follow') {
                        var btn = document.getElementById('btnFollow');
                        btn.textContent = 'Follow';
                        btn.onclick = follow;
                    }
                } else if (response.error) {
                    alert('there was an error, follow functionality is not available at the moment');
                    var btn = document.getElementById('btnFollow');
                    btn.textContent = 'Follow';
                    btn.onclick = checkfollow;
                }
            });
    } else {
        var btn = document.getElementById('btnFollow');
        btn.textContent = 'Follow';
        btn.onclick = follow;
    }
}

var follow = function () {
    var url = '/api/v1/artists/' + query + '/follow'
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
    })
        .then(response => response.json())
        .then(function (response) {
            if (response.message) {
                alert(response.message);
                var btn = document.getElementById('btnFollow');
                btn.textContent = 'Unfollow';
                btn.onclick = unfollow;
            } else if (response.error) {
                alert(response.error);
            }
        });
}

var unfollow = function () {
    var url = '/api/v1/artists/' + query + '/follow'
    fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
    })
        .then(response => response.json())
        .then(function (response) {
            if (response.message) {
                alert(response.message);
                var btn = document.getElementById('btnFollow');
                btn.textContent = 'Follow';
                btn.onclick = follow;
            } else if (response.error) {
                alert(response.error);
            }
        });
}

var addToCart = function (type, ismn) { //calls to the API that permits to include an element to the cart list
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