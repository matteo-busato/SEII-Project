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

var query = findGetParameter("id");

var xhttp = new XMLHttpRequest();
xhttp.responseType = "json";

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var data = this.response;
        console.log(data);
        //insert basic info
        document.getElementById("artista").innerText = data.owner;
        document.getElementById("dati").innerText = "Titolo: " + data.title + "\nId:" + data.id +
            "\nDate: " + data.data + "\nDescription: " + data.description + "\nCost: " + data.cost ;

    }
}
xhttp.open("get", "/api/v1/events/" + query, true);
xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
xhttp.send();
