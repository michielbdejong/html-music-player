$(document).ready(function () {

    var apiScope = ["music:r"];

    jso_configure({
        "html-music-player": {
            client_id: apiClientId,
            authorization: authorizeEndpoint
        }
    });
    jso_ensureTokens({
        "html-music-player": apiScope
    });

    function renderFolderList() {
        var url = apiEndpoint + "/admin/music/";
        var accessToken = jso_getToken("html-music-player", apiScope);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        xhr.onload = function(e) {
            $("#folderListTable").html($("#folderListTemplate").render({entry: JSON.parse(xhr.responseText)}));
        }
        xhr.send();
    }

    $(document).on('click', '#folderListTable a', function() {
        var url = apiEndpoint + "/admin/music/" + $(this).data("fileName");
        var accessToken = jso_getToken("html-music-player", apiScope);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        xhr.responseType = "arraybuffer";
        xhr.onload = function(e) {
            var blob = new Blob([xhr.response]);
            document.getElementById("player").src = window.URL.createObjectURL(blob);
            document.getElementById("player").play();
        }
        xhr.send();
    });

    renderFolderList();
});
