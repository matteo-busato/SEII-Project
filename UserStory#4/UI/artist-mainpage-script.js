var albums = document.getElementById('albums'); // Get the list where we will place albums
var merch = document.getElementById('merch'); // Get the list where we will place merch
var events = document.getElementById('events'); // Get the list where we will place getEvents

var func = function(types){
    console.log("" + types);
}

var populate = function(classname,what,aHref,onclick){
    for(let i=0;i<what.length;i++){
        var div = document.createElement("div");
        div.className="d-flex list-group-item  align-items-center";
        var a = document.createElement("a");
        a.className ="list-group-item-action";
        a.href=aHref;        
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
    if (this.readyState == 4 && this.status == 200) {
        var data = this.response;
        console.log(data);
        //insert basic info
        document.getElementById("artista").innerText = data[0].name;
        document.getElementById("bio").innerText = data[0].bio;

        //insert albums,merch,events
        populate("albums",data[1].albums,"/artist-selected-album","album");   //carico gli albums
        document.getElementById("moreAlbums").href = "/artist-albums?name=" + data[0].name;
        populate("events",data[3].events,"/artist-selected-event","event");   //carico gli eventi
        document.getElementById("moreEvents").href = "/artist-events?name=" + data[0].name;
        populate("merch",data[2].merch,"/artist-selected-merch","merch");   //carico il merch
        document.getElementById("moreMerch").href = "/artist-merch?name=" + data[0].name;

    }
}
xhttp.open("get", "/api/v1/artists/autechre", true);
xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
xhttp.send();
