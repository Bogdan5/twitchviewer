
$(document).ready(function () {
    var jsonLink = "https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api";
    var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404", "clickerheroesbot"];
    var index = 0;
    var statusOnline = [];//true if online, false if not
    var contentStatus = [];// includes the strings for name and channel name
    var visibility = [];//true if a card is visible, false if not
    var searchResults = [];//based on the current status of search, an array of true or false depending on whether a card should be visible
    var sortResults = [];//same as above, only about sort
    var onlyStreams = false; //these variables are true if the search in performed only on stream strings, names of streamers,
    var onlyNames = false;//or on both
    var allFields = true;
    //this function identifies if a channel is online
    (function () {
        channels.forEach(function (channel) {
            $.getJSON(jsonLink + "/streams/" + channel + "/", function (data) {
                if (data.stream === null) {
                    getChannel(false, channel);
                } else {
                    getChannel(true, channel);
                }
            });

        });
    })();
    //this function retrieves data from each channel
    function getChannel(isOnline, channel) {
        var statusChannel;
        var isOn;
        $.getJSON(jsonLink + "/channels/" + channel + "/", function (data) {
            if (data.status === '404') {
                $("#streams").html("Data not available");
                return;
            } else {
                if (data.name) {
                    appendCard(data.logo, data.name, data.status, data.url, isOnline);
                }
            }
        });
    }
    //this function, based on the data retrieved, creates a card for each channel and appends three 
    //divs, including the logo, name of streamer, and the stream title
    function appendCard(linkImage, nameStreamer, nameStream, linkName, isOnline) {
        if (nameStreamer) {
            var stream = (nameStream) ? nameStream : "No status";
            var color = (isOnline) ? "green" : "red";
            if (isOnline) {
                statusOnline.push(true);
            } else {
                statusOnline.push(false);
            }
            $("#streams").append('<div id="card_' + index + '"></div>');
            $("#card_" + index).append('<div id="first_' + index + '"></div>').append('<div id="second_' + index + '"><a href="' + linkName + '">' + nameStreamer + '</a></div>')
                .append('<div id="third_' + index + '">' + stream + '</div>');
            searchResults.push(true);
            sortResults.push(true);
            if (linkImage) {
                $("#first_" + index).append('<img src="' + linkImage + '">');
            } else {
                $("#first_" + index).append('<img src="http://res.cloudinary.com/dctvlfl7e/image/upload/v1510066431/Twitch_Logo-1_mvvsoj.jpg" width:"50">');
            }
            $("#card_" + index).addClass(color + "Style");
            contentStatus.push(nameStreamer, stream);
            index++;
        }
    }
    //this function makes visible only the online channel cards
    $("#tab-Online").click(function () {
        var len = statusOnline.length;
        for (var i = 0; i < len; i++) {
            if (statusOnline[i]) {
                if (searchResults[i]) {
                    $("#card_" + i).removeClass("invisible");
                } else {
                    $("#card_" + i).addClass("invisible");
                }
                sortResults[i] = true;
            } else {
                $("#card_" + i).addClass("invisible");
                sortResults[i] = false;
            }
        }
        //this toggles the background color of the three search buttons 
        $(this).addClass("buttonOnlinePressed").addClass("otherBorder").removeClass("bottomBorder");
        $("#tab-All").removeClass("buttonAllPressed").addClass("bottomBorder").removeClass("otherBorder");
        $("#tab-Offline").removeClass("buttonOfflinePressed").addClass("bottomBorder").removeClass("otherBorder");
        $("body>div:first-child").removeClass("containerColorAll").addClass("containerColorOnline").removeClass("containerColorOffline");
    });
    //the same as above, for offline cards
    $("#tab-Offline").click(function () {
        var len = statusOnline.length;
        for (var i = 0; i < len; i++) {
            if (!statusOnline[i]) {
                if (searchResults[i]) {
                    $("#card_" + i).removeClass("invisible");
                } else {
                    $("#card_" + i).addClass("invisible");
                }
                sortResults[i] = true;
            } else {
                $("#card_" + i).addClass("invisible");
                sortResults[i] = false;
            }
        }
        $(this).addClass("buttonOfflinePressed").addClass("otherBorder").removeClass("bottomBorder");
        $("#tab-All").removeClass("buttonAllPressed").addClass("bottomBorder").removeClass("otherBorder");
        $("#tab-Online").removeClass("buttonOnlinePressed").addClass("bottomBorder").removeClass("otherBorder");
        $("body>div:first-child").removeClass("containerColorAll").addClass("containerColorOffline").removeClass("containerColorOnline");
    });
    //same as above, for both categories
    $("#tab-All").click(function () {
        var len = statusOnline.length;
        for (var i = 0; i < len; i++) {
            if (searchResults[i]) {
                $("#card_" + i).removeClass("invisible");
            } else {
                $("#card_" + i).addClass("invisible");
            }
            sortResults[i] = true;
        }
        $(this).addClass("buttonAllPressed").addClass("otherBorder").removeClass("bottomBorder");
        $("#tab-Online").removeClass("buttonOnlinePressed").addClass("bottomBorder").removeClass("otherBorder");
        $("#tab-Offline").removeClass("buttonOfflinePressed").addClass("bottomBorder").removeClass("otherBorder");
        $("body>div:first-child").removeClass("containerColorOnline").addClass("containerColorAll").removeClass("containerColorOffline");
    });

    //next functions set the nature of the search: only streams titles, streams names, or both
    $("#onlyStreams").click(function () {
        onlyStreams = true;
        allFields = false;
        onlyNames = false;
        //toggles the three onlines status buttons
        $(this).addClass("buttonPressed").removeClass("buttonSearchColor");
        $("#onlyNames").addClass("buttonSearchColor").removeClass("buttonPressed");
        $("#allFields").addClass("buttonSearchColor").removeClass("buttonPressed");
    });

    $("#onlyNames").click(function () {
        onlyNames = true;
        allFields = false;
        onlyStreams = false;
        $(this).addClass("buttonPressed").removeClass("buttonSearchColor");
        $("#onlyStreams").addClass("buttonSearchColor").removeClass("buttonPressed");
        $("#allFields").addClass("buttonSearchColor").removeClass("buttonPressed");
    });

    $("#allFields").click(function () {
        allFields = true;
        onlyStreams = false;
        onlyNames = false;
        $(this).addClass("buttonPressed").removeClass("buttonSearchColor");
        $("#onlyNames").addClass("buttonSearchColor").removeClass("buttonPressed");
        $("#onlyStreams").addClass("buttonSearchColor").removeClass("buttonPressed");
    });
    //this function searches based on the three above-set variables
    //cards are renedered invisible based on search results
    $("#search").click(function () {
        var formVal = $("#form").val().toLowerCase();
        //var len = searchResults.length;
        //for (var j = 0; j < len; j++) {
        //    searchResults[j] = true;
        //}
        var content1, content2;
        if (formVal) {
            var len = contentStatus.length;
            if (onlyNames) {
                for (var i = 0; i < len; i += 2) {
                    content1 = contentStatus[i].toLowerCase();
                    if (content1.search(formVal) >= 0) {
                        if (sortResults[i/2]) {
                            $("#card_" + (i / 2)).removeClass("invisible");
                        } else {
                            $("#card_" + (i / 2)).addClass("invisible");
                        }
                        searchResults[i / 2] = true;
                    } else {
                        $("#card_" + (i / 2)).addClass("invisible");
                        searchResults[i / 2] = false;
                    }
                }
            } else if (onlyStreams) {
                for (i = 1; i < len; i += 2) {
                    content1 = contentStatus[i].toLowerCase();
                    if (content1.search(formVal) >= 0) {
                        if (sortResults[(i-1)/2]) {
                            $("#card_" + ((i - 1) / 2)).removeClass("invisible");
                        } else {
                            $("#card_" + ((i - 1) / 2)).addClass("invisible");
                        }
                        searchResults[(i - 1) / 2] = true;
                    } else {
                        $("#card_" + ((i - 1) / 2)).addClass("invisible");
                        searchResults[(i - 1) / 2] = false;
                    }
                }
            } else if (allFields) {
                for (i = 0; i < len; i += 2) {
                    content1 = contentStatus[i].toLowerCase();
                    content2=contentStatus[i + 1].toLowerCase();
                    if (content1.search(formVal) >= 0 || content2.search(formVal) >= 0) {
                        if (sortResults[i/2]) {
                            $("#card_" + (i / 2)).removeClass("invisible");
                        } else {
                            $("#card_" + (i / 2)).addClass("invisible");
                        }
                        searchResults[i / 2] = true;
                    } else {
                        $("#card_" + (i / 2)).addClass("invisible");
                        searchResults[i / 2] = false;
                    }
                }
            }
        }
    });
    //resets the search
        $("#clear").click(function () {
            var len = searchResults.length;
            $("#form").val("");
            for (var i = 0; i < len; i++) {
                if (sortResults[i]) {
                    $("#card_" + i).removeClass("invisible");
                }
                searchResults[i] = true;
            }

        });
});
