var artistName;
        var url;

        function getURLparams() {
            var path = window.location.pathname.split("/");
            artistName = path[3];
            var element = document.getElementById("artist");
            element.innerHTML =  "Artist info for " + artistName;
        }

        function sendNewInfo() {
            url = "/api/v1/artists/" + artistName;
            var artist = {
                name: '',
                password: '',
                bio: $("#bio").val(),
                email: ''
            };
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(artist)
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