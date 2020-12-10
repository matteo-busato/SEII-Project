var artistName;
        var url;

        function getURLparams() {
            var path = window.location.pathname.split("/");
            artistName= path[3];
        }

        function sendDelete() {
            getURLparams();
            url = "/api/v1/artists/" + artistName;
            if ($("#imSure").prop("checked") != false) {
                fetch(url, {
                    method: "DELETE",
                })
                    .then(response => response.json())
                    .then(function (response) {
                        if (response.message) {
                            alert(response.message);
                        } else {
                            alert(response.error);
                        }
                    });
            } else {
                $("#imSureLabel").addClass('text-danger');
            }
        }