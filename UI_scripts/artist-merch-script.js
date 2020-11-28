var albums = document.getElementById('albums'); // Get the list where we will place albums

var func = function(types){     //function used to implement a method to add to cart an object ( or modify in case of owner)
    console.log("" + types);
}


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
        console.log(data);

        //insert basic info
        document.getElementById("artista").innerText = query;

        if(this.status == 200){
            document.getElementById("error").innerText = "";
            document.getElementById("error").style = "display: none";
            //insert merch
            populate("merch",data.merch,"/artist-selected-merch?id=","merch");   //carico il merch
        }else{
            document.getElementById("error").innerText = data.error;
            document.getElementById("error").style = "display: block";
        }
    }
}
xhttp.open("get", "/api/v1/artists/" + query + "/merch", true);
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