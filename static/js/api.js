
function createNewToken() {
    $(".create-token-box").css("display", "inline-block");
    $("#token-name-input").focus();
    $(".container-api").css("filter", "brightness(40%)");
    this.addEventListener("keyup", function(event) {
        if (event.keyCode === 27) {
            $(".create-token-box").css("display", "none");
            $(".container-api").css("filter", "brightness(100%)");
        }
    })
}

function addWeek() {
    datetime = $("#datetime").val();
    var datetimeParts = datetime.split(" "); // split the datetime string into date and time parts
    var dateParts = datetimeParts[0].split("/"); // split the date part into day, month, and year
    var timeParts = datetimeParts[1].split(":"); // split the time part into hours, minutes, and seconds

    var datetime = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]); // create a new Date object using the parts

    var newDatetime = new Date(datetime);
    newDatetime.setDate(newDatetime.getDate() + 7);

    $("#datetime").val(formatDateTime(newDatetime));
}

// Add a specified number of minutes to the datetime displayed in the "#datetime" element
function addMinutes(minutesToAdd) {
    datetime = $("#datetime").val();
    var datetimeParts = datetime.split(" "); // split the datetime string into date and time parts
    var dateParts = datetimeParts[0].split("/"); // split the date part into day, month, and year
    var timeParts = datetimeParts[1].split(":"); // split the time part into hours, minutes, and seconds

    var datetime = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]); // create a new Date object using the parts

    var newDatetime = new Date(datetime);
    newDatetime.setMinutes(newDatetime.getMinutes() + minutesToAdd);

    $("#datetime").val(formatDateTime(newDatetime));
}


// Add a specified number of days to the datetime displayed in the "#datetime" element
function addDays(daysToAdd) {
    datetime = $("#datetime").val();
    var datetimeParts = datetime.split(" "); // split the datetime string into date and time parts
    var dateParts = datetimeParts[0].split("/"); // split the date part into day, month, and year
    var timeParts = datetimeParts[1].split(":"); // split the time part into hours, minutes, and seconds

    var datetime = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]); // create a new Date object using the parts

    var newDatetime = new Date(datetime);
    newDatetime.setDate(newDatetime.getDate() + daysToAdd);

    $("#datetime").val(formatDateTime(newDatetime));
}

function addHours(hoursToAdd) {
    datetime = $("#datetime").val();
    var datetimeParts = datetime.split(" "); // split the datetime string into date and time parts
    var dateParts = datetimeParts[0].split("/"); // split the date part into day, month, and year
    var timeParts = datetimeParts[1].split(":"); // split the time part into hours, minutes, and seconds

    var datetime = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1], timeParts[2]); // create a new Date object using the parts

    var newDatetime = new Date(datetime);
    newDatetime.setHours(newDatetime.getHours() + hoursToAdd);

    $("#datetime").val(formatDateTime(newDatetime));
}

// Set the datetime of the "#datetime" element to the current datetime
function setCurrentDatetime() {
    var currentDatetime = new Date();
    $("#datetime").val(formatDateTime(currentDatetime));
}

function formatDateTime(datetime) {
    var day = datetime.getDate();
    var month = datetime.getMonth() + 1;
    var year = datetime.getFullYear();
    var hours = datetime.getHours();
    var minutes = datetime.getMinutes();
    var seconds = datetime.getSeconds();
  
    // add leading zeroes if necessary
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
  
    return day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
}
