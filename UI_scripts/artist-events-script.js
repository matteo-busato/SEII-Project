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

var query = findGetParameter("username");

var populate = function(classname,what,aHref,owner){
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
        button.className="btn btn-primary ml-2 w-35";
        if(owner){
            button.onclick = function(){    //modify element button
                if(classname == "albums")
                    window.location.assign("/changeAlbumData?username="+ username + "&ismn=" + what[i].ismn);
                else if(classname == "events")
                    window.location.assign("/changeEventData?username="+ username + "&id=" + what[i].id);
                else{
                    window.location.assign("/changeProductData?username="+ username + "&id=" + what[i].id);
                }
            }
            button.innerText = "modify";
            var button2 = document.createElement("button");
            button2.className="btn btn-primary ml-auto w-35";
            button2.onclick = function(){    //delete element button
                if(classname == "albums")
                    window.location.assign("/deleteAlbum?username="+ username + "&ismn=" + what[i].ismn);
                else if(classname == "events")
                    window.location.assign("/deleteEvent?username="+ username + "&id=" + what[i].id);
                else{
                    window.location.assign("/deleteProduct?username="+ username + "&id=" + what[i].id);
                }
            }
            button2.innerText = "delete";
            div.appendChild(button2);

        }else if(username){
            button.onclick = function(){
                addToCart("event",what[i].id);
            }
            button.innerText = "add to cart";
        }        
        
        div.appendChild(button);
        document.getElementById( classname ).appendChild(div);
    }
}

var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
        var data = this.response;
        console.log(data);

        //insert basic info
        document.getElementById("artista").innerText = query;

        if(this.status == 200){
            document.getElementById("error").innerText = "";
            document.getElementById("error").style = "display: none";
            //insert events
            if(userType == "artist" && data.artist.username == username){ //proprietario pagina
                populate("events",data.events,"/artist-selected-event?id=",true);   //carico gli eventi
                document.getElementById("addEvent").href = "/addNewEvent?username=" + data.artist.username;
                $('#addEvent').show();
            } else {
                populate("events",data.events,"/artist-selected-event?id=",false);   //carico gli eventi
            }
        }else{
            document.getElementById("error").innerText = data.error;
            document.getElementById("error").style = "display: block";
        }
    }
}
xhttp.open("get", "/api/v1/artists/" + query + "/events", true);
xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
xhttp.send();


var trova = function(){
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