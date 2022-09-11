
// Get the input field
$(document).ready(function() {
    $("#user-edit-form").find("input").each(function() {
        this.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                $("#user-edit-form").submit();
            }
        })
    })
});

// Get the input field
$(document).ready(function() {
    $("#user-form").parent().find("td").each(function() {
        $(this).find("input").each(function() {
            this.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    $("#user-form").closest("form").submit();
                }
            })
        })
    })
});

$(".hover-user-details").mouseover(function() {
    userDetails = {};
    $(this).parent().parent().find('td').each(function(index) {
        userDetails[index] = $(this).text()
    })

    showUser(userDetails[0], userDetails[1], userDetails[4], userDetails[2], userDetails[5],$(this).attr('id').split('-')[1],userDetails[3]);
});

function sortUsers() {
    var type = document.getElementById('type').value;
    var table = document.getElementById('users-table');

    for (var i = 1; i <= table.rows.length - 1; ++i) {
        // Show All  
        if (table.rows[i].style.display == "none") {
            table.rows[i].style.display = "";
        }

        // Hide none relevant
        var user_type = table.rows[i].cells[4].innerHTML;
        if (type.toLowerCase() != user_type.toLowerCase() && type != "All") {
            table.rows[i].style.display = 'none';
        } else if (type == "All") {
            for (var i = 1; i <= table.rows.length; ++i) {
                table.rows[i].style.display = "";
            }
        }
    }
}

function addNewUserType(obj) {
    if (obj.value == "Other") {
        $("#userType").show()
        obj.remove();
    }
}
function submitUserForm() {
    $('#user-form').submit(); 
}