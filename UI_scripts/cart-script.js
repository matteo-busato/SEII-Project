//get username / userType and token from the sessionStorage
var username = window.sessionStorage.getItem("username");
var userType = window.sessionStorage.getItem("userType");
var token = window.sessionStorage.getItem("token");
var total = 0;

var getCartList = function () {     //calls to the API that permits to remove an element from the cart list
    var url = '/api/v1/cart';
    fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                   'x-access-token' : token }        
    })
        .then(response => response.json())
        .then(function (response) {
            if (response.message) {
                document.getElementById("error").innerText = "";
                document.getElementById("error").style = "display: none";
                //insert cartlist to html page
                populate(response.message);
            } else if (response.error) {
                document.getElementById("error").innerText = response.error;
                document.getElementById("error").style = "display: block";
            }
        });
}

//calls to the server to retrieves data from the database
getCartList();

//populate the html page with data coming from the database
var populate = function (what) {
    for (let i = 0; i < what.length; i++) {
        var div = document.createElement("div");
        div.className = "d-flex list-group-item  align-items-center";
        var a = document.createElement("a");
        a.className = "list-group-item-action";

        if (what[i].type == "album")
            a.href = "/artist-selected-album?ismn=" + what[i].id;
        else if (what[i].type == "event")
            a.href = "/artist-selected-event?id=" + what[i].id;
        else
            a.href = "/artist-selected-merch?id=" + what[i].id;

        a.innerText = what[i].title + "                 " + what[i].cost;
        total += what[i].cost;
        div.appendChild(a);


        var button = document.createElement("button");
        button.className = "btn btn-primary ml-auto w-35";
        button.onclick = function () {
            removeFromCart(what[i].type, what[i].id);
        }
        button.innerText = "remove";
        div.appendChild(button);

        document.getElementById("cartList").appendChild(div);
    }
}

var trova = function () {   //function for the searchbar, used to recall APIs to search artists / albums / products and events
    var type = $('#searchType').val();
    var query = $('#query').val();
    console.log(type);
    console.log(query);

    if (type == 1) {  //searching for artist
        window.location.assign("/artist-mainpage?username=" + query);
    } else if (type == 2) {    //searching for album
        window.location.assign("/artist-selected-album?ismn=" + query);
    } else if (type == 3) {    //searching for product
        window.location.assign("/artist-selected-merch?id=" + query);
    } else {      //searching for event
        window.location.assign("/artist-selected-event?id=" + query);
    }
}

var removeFromCart = function (type, id) {     //calls to the API that permits to remove an element from the cart list
    var url = '/api/v1/cart/type/' + type + '/id/' + id;
    fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
    })
        .then(response => response.json())
        .then(function (response) {
            if (response.message) {
                document.getElementById("cartList").innerHTML = "";
                getCartList();
                alert(response.message);
            } else if (response.error) {
                alert(response.error);
            }
        });
}
