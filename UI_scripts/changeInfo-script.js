var artistName;
        var url;
        function getURLparams() {
            var path = window.location.pathname.split("/");
            artistName = path[3];
        }

        function sendChange() {
            getURLparams();
            url = "/api/v1/artists/" + artistName;
            var newArtist = {
                newName: $("#newName").val(),
                newPassword: $("#newPwd").val(),
                newBio: $("#newBio").val(),
                newEmail: $("#newEmail").val()
            }
            fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newArtist)
            })
                .then(response => response.json())
                .then(function (response) {
                    if (response.message) {
                        alert(response.message);
                    } else {
                        alert(response.error);
                    }
                });
        }