var getTrack = function(tracklist){     //return a string for the tracklist
    var tmp = "";
    for(var i=0; i<tracklist.length;i++){
        tmp += i + ": " + tracklist[i] + " ; ";
    }
    return tmp;
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

var query = findGetParameter("ismn");

var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {    
    if (this.readyState == 4) {
        var data = this.response;

        if(this.status == 200){
            document.getElementById("error").innerText = "";
            document.getElementById("error").style = "display: none";
            //insert basic info
            document.getElementById("artista").innerText = data.owner;
            document.getElementById("dati").innerText = "Titolo: " + data.title + "\nIsmn:" + data.ismn +
                "\nYear: " + data.year + "\nGenre: " + data.genre + "\nCost: " + data.cost + "\nTracklist: " + getTrack(data.tracklist);
        }else{
            document.getElementById("error").innerText = data.error;
            document.getElementById("error").style = "display: block";
        }
    }
}
xhttp.open("get", "/api/v1/albums/" + query, true);
xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
xhttp.send();
