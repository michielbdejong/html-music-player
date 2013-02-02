remoteStorage.onWidget('ready', function () {

    var playingFileIndex;
    var playingDirectoryName;
    // the files in the directory from which the current song is being played
    var playingDirectoryEntries;

    var currentDirectoryName;
    var currentDirectoryEntries;

    function renderFolderList(dirName) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", rootUri + "public/music" + dirName, true);
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        remoteStorage.music.getListing(dirName).then(function(listing) {
            var response = JSON.parse(xhr.responseText);

            currentDirectoryEntries = new Array();
            // convert the map to an array
            for (var i=0; i<listing.length i++) {
                if (listing[i].lastIndexOf("/") === listing[i].length - 1) {
                    // directory
                    currentDirectoryEntries.push({fileName: listing[i].substring(0,listing[i].length-1), isDirectory: true});
                } else {
                    // file
                    currentDirectoryEntries.push({fileName: listing[i], isDirectory: false});
                }
            }
            currentDirectoryEntries.sort(sortDirectory);

            if (dirName !== "/") {
                currentDirectoryEntries.unshift({fileName: "(UP)", isDirectory: true});
            }

            currentDirectoryName = dirName;
            $("#folderListTable").html($("#folderListTemplate").render({dirName: dirName, entry: currentDirectoryEntries}));
            if (currentDirectoryName === playingDirectoryName) {
                // if we watch the directory again we are playing 
                // from we mark the file playing
                $("tr#entry_" + playingFileIndex).addClass("success");
            }
        });
    }

    function playSong() {
        document.getElementById("player").src = remoteStorage.getSongURL(playingDirectoryName + playingDirectoryEntries[playingFileIndex]['fileName']);
        document.getElementById("player").play();
        if (currentDirectoryName === playingDirectoryName) {
            // if we still watch the same directory as where we play 
            // from we mark the file playing
            $("tr#entry_" + playingFileIndex).addClass("success");
        }
    }

    $(document).on('click', '#folderListTable a.file', function() {
        playingDirectoryEntries = currentDirectoryEntries;
        playingFileIndex = $(this).data("fileIndex");
        playingDirectoryName = currentDirectoryName;
        playSong();
    });

    $(document).on('click', '#folderListTable a.dir', function() {
        var dirName = currentDirectoryEntries[$(this).data('fileIndex')]['fileName'];
        var filePath;
        if (dirName === "..") {
            secondToLastSlash = currentDirectoryName.lastIndexOf("/", currentDirectoryName.length - 2);
            filePath = currentDirectoryName.substring(0, secondToLastSlash + 1);
        } else {
            filePath = currentDirectoryName + currentDirectoryEntries[$(this).data('fileIndex')]['fileName'] + "/";
        }
        renderFolderList(filePath);
    });

    document.getElementById("player").addEventListener('ended', playNextSong);

    document.getElementById("prev").addEventListener('click', function(e) {
        if (currentDirectoryName === playingDirectoryName) {
            // if we still watch the same directory as where we play 
            // from we mark the file as not playing anymore
                $("tr#entry_" + playingFileIndex).removeClass("success");
        }
        playingFileIndex--;
        // as long as we find directories we move on...
        while (playingFileIndex > 0 && playingDirectoryEntries[playingFileIndex]['isDirectory']) {
            playingFileIndex--;
        }
        if (!playingDirectoryEntries[playingFileIndex]['isDirectory']) {
            playSong();
        }
    });

    document.getElementById("prev").addEventListener('click', playPrevSong);
    document.getElementById("next").addEventListener('click', playNextSong);

    function playPrevSong() {
        if (currentDirectoryName === playingDirectoryName) {
            // if we still watch the same directory as where we play 
            // from we mark the file as not playing anymore
                $("tr#entry_" + playingFileIndex).removeClass("success");
        }
        playingFileIndex--;
        // as long as we find directories we move on...
        while (playingFileIndex >= 0 && playingDirectoryEntries[playingFileIndex]['isDirectory']) {
            playingFileIndex--;
        }
        if (playingFileIndex > 0) {
            playSong();
        }
    }

    function playNextSong() {
        if (currentDirectoryName === playingDirectoryName) {
            // if we still watch the same directory as where we play 
            // from we mark the file as not playing anymore
                $("tr#entry_" + playingFileIndex).removeClass("success");
        }
        playingFileIndex++;
        // as long as we find directories we move on...
        while (playingFileIndex < playingDirectoryEntries.length && playingDirectoryEntries[playingFileIndex]['isDirectory']) {
            playingFileIndex++;
        }
        if (playingFileIndex !== playingDirectoryEntries.length) {
            playSong();
        }
    }

    function sortDirectory(a, b) {
        if (a.isDirectory && b.isDirectory) {
            return (a.fileName === b.fileName) ? 0 : (a.fileName < b.fileName) ? -1 : 1;
        }
        if (a.isDirectory && !b.isDirectory) {
            return -1;
        }
        if (!a.isDirectory && b.isDirectory) {
            return 1;
        }
        return (a.fileName === b.fileName) ? 0 : (a.fileName < b.fileName) ? -1 : 1;
    }

    renderFolderList("/");
});
