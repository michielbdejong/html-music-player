$(document).ready(function () {

    // rootUri, this should be available through fragment or using WebFinger
    var rootUri = apiEndpoint + "/admin/";

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

    function renderFolderList(dirName) {
        var accessToken = jso_getToken("html-music-player", apiScope);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", rootUri + "music" + dirName, true);
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        xhr.onload = function(e) {
            $("#folderListTable").html($("#folderListTemplate").render({dirName: dirName, entry: JSON.parse(xhr.responseText)}));
        }
        xhr.send();
    }

    $(document).on('click', '#folderListTable a.file', function() {
        var accessToken = jso_getToken("html-music-player", apiScope);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", rootUri + "music" + $(this).data("fileName"), true);
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        xhr.responseType = "arraybuffer";
        xhr.onload = function(e) {
            var blob = new Blob([xhr.response]);
            document.getElementById("player").src = window.URL.createObjectURL(blob);
            document.getElementById("player").play();
        }
        xhr.send();
    });

    $(document).on('click', '#folderListTable a.dir', function() {
        renderFolderList($(this).data('currentDir') + $(this).data('dirName'));
    });

    renderFolderList("/");
});
