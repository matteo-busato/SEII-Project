var albums = document.getElementById('albums'); // Get the list where we will place albums
var merch = document.getElementById('merch'); // Get the list where we will place merch
var events = document.getElementById('events'); // Get the list where we will place getEvents

var func = function(types){     //function used to implement a method to add to cart an object ( or modify in case of owner)
    console.log("" + types);
}

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

var populate = function(classname,what,aHref,onclick){
    for(let i=0;i<what.length;i++){
        var div = document.createElement("div");
        div.className="d-flex list-group-item  align-items-center";
        var a = document.createElement("a");
        a.className ="list-group-item-action";
        if(what[i].ismn != undefined)
            a.href=aHref + what[i].ismn;
        else
            a.href=aHref + what[i].id;
        a.innerText = what[i].title;
        div.appendChild(a);
        var button = document.createElement("button");
        button.className="btn btn-primary ml-auto w-35";
        button.onclick = function(){
            func(onclick);
        }
        button.innerText = "add to cart";
        div.appendChild(button);
        document.getElementById( classname ).appendChild(div);
    }
}

var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
        var data = this.response;
        if(this.status == 200){
            document.getElementById("error").innerText = "";
            document.getElementById("error").style = "display: none";

            //insert basic info
            document.getElementById("artista").innerText = data.artist.username;
            document.getElementById("bio").innerText = data.artist.bio;

            //insert albums,merch,events
            populate("albums",data.albums,"/artist-selected-album?ismn=","album");   //carico gli albums
            document.getElementById("moreAlbums").href = "/artist-albums?username=" + data.artist.username;
            populate("events",data.events,"/artist-selected-event?id=","event");   //carico gli eventi
            document.getElementById("moreEvents").href = "/artist-events?username=" + data.artist.username;
            populate("merch",data.merch,"/artist-selected-merch?id=","merch");   //carico il merch
            document.getElementById("moreMerch").href = "/artist-merch?username=" + data.artist.username;
        }else{
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