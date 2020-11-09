function submitForm(){

    var name = $("#name").val();
    var email = $("#email").val();
    var password = $("#password").val();

    if(window.XMLHttpRequest){
        xhttp = new XMLHttpRequest();
    } else if(window.ActiveXObject){
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && (this.status == 201 || this.status == 400 || this.status == 409)){
            var data = this.response;
            var status = JSON.parse(data);

            var text;
            if(status.message){
                text = status.message;
            } else if (status.error){
                text = status.error;
            } else {
                text = "Error please try again";
            }
        
            $("#status").text(text);
            if(status.message){
                $("#status").addClass("text-success");
            } else {
                $("#status").addClass("text-danger");
            }

            $("#status").removeClass("d-none");
        }
    }

    xhttp.open("POST", "/api/v1/users", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("name="+name+"&email="+email+"&password="+password);

    //ERROR -> Page redirect after ajax request

}