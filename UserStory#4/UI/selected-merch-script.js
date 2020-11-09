
var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var data = this.response;
        console.log(data);
        //insert basic info
        document.getElementById("artista").innerText = data.owner;
        document.getElementById("dati").innerText = "Titolo: " + data.title + "\nId:" + data.id +
            "\nDescription: " + data.description + "\nCost: " + data.cost ;

    }
}
xhttp.open("get", "/api/v1/merch/1234", true);
xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
xhttp.send();
