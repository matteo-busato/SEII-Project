window.onload = function(){

    var xhttp = new XMLHttpRequest();
    xhttp.responseType = "json";

    xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
        var res = this.response;
        console.log(res);
        if(res.status == 200){  //login successfully
            document.getElementById("artisti").innerText = res;
        }else if(res.status == 404){    //wrong email
            document.getElementById("artisti").innerText = "database error!";
        }else if(res.status == 401){    //wrong password
            document.getElementById("artisti").innerText = "authentication error!";
        }
    }
}

    xhttp.open("get", "/api/v1/users", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    xhttp.send();

}
