

var submit = function(){
    var email = document.getElementById("email").innerText;
    var password = document.getElementById("password").innerText;

    console.log(email);
    console.log(password);

    var xhttp = new XMLHttpRequest();
    xhttp.responseType = "json";

    xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var res = this.response;
        console.log(res);


    }
}

    xhttp.open("post", "/api/v1/insert", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    xhttp.send("email=" + email + "&password=" + password );

}
