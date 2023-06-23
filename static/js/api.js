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

$(document).ready(function() {
    // Add a click event listener to the head-checkbox element
    $('.perm-head input[type="checkbox"]').on('click', function() {
      // Find the perm-box element containing the clicked head-checkbox
      var permBox = $(this).closest('.perm-box');
  
      // Find the sub-checkboxes within the same perm-box and check/uncheck them accordingly
      permBox.find('.perm-sub input[type="checkbox"]').prop('checked', $(this).is(':checked'));
    });
  
    // Add a click event listener to the sub-checkbox elements
    $('.perm-sub input[type="checkbox"]').on('click', function() {
      // Find the perm-box element containing the clicked sub-checkbox
      var permBox = $(this).closest('.perm-box');
  
      // Check if any sub-checkbox is unchecked within the same perm-box
      var isUnchecked = permBox.find('.perm-sub input[type="checkbox"]').not(':checked').length > 0;
  
      // Update the head-checkbox based on the sub-checkbox state
      permBox.find('.perm-head input[type="checkbox"]').prop('checked', !isUnchecked);
    });

});


function addAccessToken() {
    var form = $('#create_token_form')
    var actionUrl = 'add_token';
    var body = form.serializeArray();
    var permissions = filterAccessToken(body)
    console.log(body)
    j_permissions = {
        'token-name': body[0].value,
        'permissions': JSON.stringify(permissions),
        'valid_by': body[body.length - 1].value
    }

    $.ajax({
        type: "POST",
        url: actionUrl,
        data: j_permissions,
        success: function(data) {
            alert(data['token'])
        }
    });
}

function filterAccessToken(accessTokensList) {
    var permissions = [];
    for (let i = 0; i < accessTokensList.length; i++) {
        console.log(accessTokensList[i])
        const obj = accessTokensList[i];
        const name = obj.name;
    
        if (name.endsWith("-rw")) {
            const baseName = name.slice(0, -3); // Remove the last 3 characters (-rw)

            const rIndex = accessTokensList.findIndex(item => item.name === `${baseName}-r`);
            if (rIndex !== -1) {
                accessTokensList.splice(rIndex, 1); // Remove the "-r" entry
            }

            const wIndex = accessTokensList.findIndex(item => item.name === `${baseName}-w`);
            if (wIndex !== -1) {
                accessTokensList.splice(wIndex, 1); // Remove the "-w" entry
            }

            permissions.push(JSON.stringify({
                [baseName]: {
                    'read': true,
                    'write': true
                }
            }))
        }

        else if (name.endsWith("-r")) {
            const baseName = name.slice(0, -2); // Remove the last 3 characters (-rw)
            permissions.push(JSON.stringify({
                [baseName]: {
                    'read': true,
                    'write': false
                }
            }))
        }

        else if (name.endsWith("-w")) {
            const baseName = name.slice(0, -2); // Remove the last 3 characters (-rw)
            permissions.push(JSON.stringify({
                [baseName]: {
                    'read': false,
                    'write': true
                }
            }))
        }
    }

    return permissions
}