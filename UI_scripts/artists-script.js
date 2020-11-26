
var func = function(types){     //function used to implement a method to add to cart an object ( or modify in case of owner)
    console.log("" + types);
}

var populate = function(classname,what,aHref,onclick){
    for(let i=0;i<what.length;i++){
        var div = document.createElement("div");
        div.className="d-flex list-group-item  align-items-center";
        var a = document.createElement("a");
        a.className ="list-group-item-action";
        a.href=aHref + what[i];
        a.innerText = what[i];
        div.appendChild(a);
        document.getElementById( classname ).appendChild(div);
    }
}

var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 ) {
        var data = this.response;

        if(this.status == 200){
            document.getElementById("error").innerText = "";
            document.getElementById("error").style = "display: none";
            //insert albums
            populate("artists",data,"/artist-mainpage?username=","album");   //carico gli albums
        }else{
            document.getElementById("error").innerText = data.error;
            document.getElementById("error").style = "display: block";            
        }
    }
}
xhttp.open("get", "/api/v1/artists", true);
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

    }else if(type == 2){    //searching for album

    }else if(type == 3){    //searching for song

    }else{      //searching for genre

    }
}