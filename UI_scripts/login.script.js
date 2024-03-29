//API's calls to submit a login
var submit = function () {
    var email = $("#email").val();
    var password = $("#password").val();

    var xhttp = new XMLHttpRequest();
    xhttp.responseType = "json";

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            var res = this.response;

            if (res.status == 201) {  //login successfully
                //setting data to the sessionStorage
                if (res.token) {
                    window.sessionStorage.setItem('token', res.token);
                }
                if (res.userType) {
                    window.sessionStorage.setItem('userType', res.userType);
                }
                if (res.username) {
                    window.sessionStorage.setItem('username', res.username);
                }
                window.location.assign("/mainpage");    //relocate to the mainpage

            } else if (res.status == 404) {    //wrong email
                document.getElementById("emailErrorMessage").innerText = "wrong email";
                document.getElementById("emailError").style = "display: block";
            } else if (res.status == 401) {    //wrong password
                document.getElementById("passwordErrorMessage").innerText = "wrong password";
                document.getElementById("passwordError").style = "display: block";
            } else if (res.status == 500) {    //checking password error
                document.getElementById("passwordErrorMessage").innerText = "something goes wrong, please retry.";
                console.log("error: " + res.error);
                document.getElementById("passwordError").style = "display: block";
            }
        }
    }
    xhttp.open("post", "/api/v1/users/auth", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    xhttp.send("email=" + email + "&password=" + password);

}

var closeEmailError = function () { //hide the div for the email errors
    document.getElementById("emailError").style = "display: none";
    $('#email').val('');
    $('#password').val('');
}

var closePasswordError = function () {  //hide the div for the password errors
    document.getElementById("passwordError").style = "display: none";
    $('#password').val('');
}
