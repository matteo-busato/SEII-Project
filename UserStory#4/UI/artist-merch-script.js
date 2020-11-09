var albums = document.getElementById('albums'); // Get the list where we will place albums

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
        document.getElementById("artista").innerText = "beatles";

        //insert albums,merch,events
        populate("merch",data,"/artist-selected-merch","merch");   //carico gli albums

    }
}
xhttp.open("get", "/api/v1/artists/beatles/merch", true);
xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
xhttp.send();
