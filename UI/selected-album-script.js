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
    if (this.readyState == 4 && this.status == 200) {
        var data = this.response;
        console.log(data);
        //insert basic info
        document.getElementById("artista").innerText = data.owner;
        document.getElementById("dati").innerText = "Titolo: " + data.title + "\nIsmn:" + data.ismn +
            "\nYear: " + data.year + "\nGente: " + data.genre + "\nCost: " + data.cost + "\nTracklist: " + getTrack(data.tracklist);

    }
}
xhttp.open("get", "/api/v1/albums/" + query, true);
xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
xhttp.send();
