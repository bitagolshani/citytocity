/* Bita Golshani */
/* external Javascript file */

/* called upon button click */
function getLatLong() {
    var loc1 = document.getElementById("firstloc").value;
    var loc2 = document.getElementById("secondloc").value;

    /*FIRST CITY lat&lng*/
    //(NOT using mapquest functions, sending manual request)
    var requestURL = 'https://www.mapquestapi.com/geocoding/v1/address?key=ayZvRTHfODxxhoPqR3x6gvcARa2sGd4l&inFormat=kvp&outFormat=json&location=' + loc1 + '&thumbMaps=false';
    var request = new XMLHttpRequest();
    request.open("POST", requestURL);
    request.send();

    var firstLat;
    var firstLong;
    request.onload = function () {   /** ASYNCHRONOUS VS SYNCHRONOUS BEHAVIOR- javascript loads this AFTER "slower" operations are completed **/
        firstLat = request.responseText.indexOf('"lat"') + 6;
        firstLat = request.responseText.substring(firstLat, firstLat + 9);
        firstLong = request.responseText.indexOf('"lng"') + 6; //lastIndexOf gives same result? 
        firstLong = request.responseText.substring(firstLong, firstLong + 9);
        getTimeOne(); //SOLUTION: find timezone only AFTER responseText info is retrieved
    }

    /*SECOND CITY lat&lng*/
    var requestURL2 = 'https://www.mapquestapi.com/geocoding/v1/address?key=ayZvRTHfODxxhoPqR3x6gvcARa2sGd4l&inFormat=kvp&outFormat=json&location=' + loc2 + '&thumbMaps=false';
    var request2 = new XMLHttpRequest();
    request2.open("POST", requestURL2);
    request2.send();

    var secondLat;
    var secondLong;
    request2.onload = function () {
        secondLat = request2.responseText.indexOf('"lat"') + 6;
        secondLat = request2.responseText.substring(secondLat, secondLat + 9);
        secondLong = request2.responseText.indexOf('"lng"') + 6; //lastIndexOf gives same result? 
        secondLong = request2.responseText.substring(secondLong, secondLong + 9);
    }

    /* GETS CURRENT TIME for both cities */
    function getTimeOne() {
        var requestTimeURL = 'https://api.timezonedb.com/v2/get-time-zone?key=36L914FF4JA8&format=json&by=position&lat=' + firstLat + '&lng=' + firstLong;
        var requestTime = new XMLHttpRequest();
        requestTime.open("POST", requestTimeURL);
        requestTime.send();

        requestTime.onload = function () {
            window.currTime = requestTime.responseText.indexOf("formatted") + 23; //hr:min  /* GLOBAL VARIABLE*/ 
            currTime = requestTime.responseText.substring(currTime, currTime + 5);
            getTimeTwo(); /* FIX FOR ISSUE 08/17: getTimeTwo() only starts AFTER getTimeOne() is completed; doesn't start time calculation 
								 without first getting first city's info*/
        }
    }

    function getTimeTwo() {
        var requestTimeURL2 = 'https://api.timezonedb.com/v2/get-time-zone?key=36L914FF4JA8&format=json&by=position&lat=' + secondLat + '&lng=' + secondLong;
        var requestTime2 = new XMLHttpRequest();
        requestTime2.open("POST", requestTimeURL2);
        requestTime2.send();

        requestTime2.onload = function () {
            window.currTime2 = requestTime2.responseText.indexOf("formatted") + 23; //hr:min /* GLOBAL VARIABLE */ 
            window.currTime2 = requestTime2.responseText.substring(currTime2, currTime2 + 5);

            /* DISPLAY TIMES AND RESULTS- sends in current 12hr/24hr selection*/
            printMsg(document.getElementById("timeFormat").value);
        }
    }
}



/* DISPLAY TIMES AND RESULTS */
function printMsg(timeVal) {
    if (typeof currTime !== 'undefined') { //if time designation is changed before time is inputted
        currTimeHour = window.currTime.substring(0, 2);
        currTime2Hour = window.currTime2.substring(0, 2);
        let message;

        if (currTime2Hour < 8 && currTime2Hour >= 0) {
            var tryAgain = 8 - parseInt(currTime2Hour);
            message = "<span style='color:red;'> Now isn't a great time to call. </span> <br> Their current time, *timeHere*, isn't within 08:00 to 24:00. Try again in " + tryAgain + " hours.";
            timeResult(timeVal, currTime2, message, true);
        }
        else if (currTimeHour < 8 && currTimeHour > 0) {
            var tryAgain = 8 - parseInt(currTimeHour);
            message = "<span style='color:red;'> Now isn't a great time to call. </span> <br> Your current time, *timeHere*, isn't within 08:00 to 24:00. Try again in " + tryAgain + " hours.";
            timeResult(timeVal, currTime, message, true);
        }
        else {
            message = "<span style='color:green;'> Now is a good time to call. </span> <br> It's currently *timeHere* in their location.";
            timeResult(timeVal, currTime2, message, false);
        }
    }
}

function timeResult(timeVal, time, message, boundaries) {
    if (timeVal == 1) { //24hr time 
        message = message.replace("*timeHere*", time);
        document.getElementById("results").innerHTML = message;
    }
    else { //12hr time 
        time = time.split(":");
        var end = parseInt(time[0]) >= 12 ? "PM" : "AM";
        time[0] = (parseInt(time[0]) + 11) % 12 + 1; //update hours 
        message = message.replace("*timeHere*", time[0] + ":" + time[1] + " " + end);
        if (boundaries) { message = message.replace("08:00 to 24:00", "8:00 AM to 12:00 AM"); }
        document.getElementById("results").innerHTML = message;
    }
}

//note: "var" keyword is function-scoped, not global; "let" is local 