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
    if (this.readyState == 4 ) {
        var data = this.response;
        console.log(data);

        //insert basic info
        document.getElementById("artista").innerText = query;

        if(this.status == 200){
            document.getElementById("error").innerText = "";
            document.getElementById("error").style = "display: none";
            //insert albums
            populate("albums",data.albums,"/artist-selected-album?ismn=","album");   //carico gli albums
        }else{
            document.getElementById("error").innerText = data.error;
            document.getElementById("error").style = "display: block";
        }
    }
}
xhttp.open("get", "/api/v1/artists/" + query + "/albums", true);
xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
xhttp.send();
