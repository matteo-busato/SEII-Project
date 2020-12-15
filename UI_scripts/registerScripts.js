function submitForm(){
    // get name email pass
    let data = {
        name: $("#name").val(),
        email: $("#email").val(),
        password: $("#password").val()
    }

    // call register endpoint
    fetch('/api/v1/users', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data)
    })
    .then((resp) => resp.json())
    .then( function(data) {
        console.log(data);
        var text;
        $("#status").removeClass();
        if(data.message){
            text = data.message;
            $("#status").addClass("text-success");
        } else if (data.error){
            text = data.error;
            $("#status").addClass("text-danger");
        } else {
            text = "Error please try again";
            $("#status").addClass("text-danger");
        }
        
        $("#status").text(text);
        $("#status").removeClass("d-none");
    })
    .catch(err => console.log(err));

}