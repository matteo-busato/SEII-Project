
var getTrack = function(tracklist){
    var tmp = "";
    for(var i=0; i<tracklist.length;i++){
        tmp += i + ": " + tracklist[i] + " ; ";
    }
    return tmp;
}

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
xhttp.open("get", "/api/v1/albums/435490", true);
xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
xhttp.send();
