var username = window.sessionStorage.getItem("username");
var userType = window.sessionStorage.getItem("userType");

$(document).ready( function(){
    if(username && userType){
        $("#authButton").on('click', function (){
                window.sessionStorage.clear();
                window.location.assign('/mainpage');
        });
        $("#authButton").text("Logout");
    } else {
        $("#authButton").text("Login");
        $("#authButton").attr("href", "/login");
    }
});