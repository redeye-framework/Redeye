function editName(curr) {
    var $input = $(curr).siblings(".input-name")
    var userId = $(curr).siblings(".user-id").val()
    $input.val($(curr).html())
    $(curr).hide();
    $input.show();

    $input.focus();
    $input.focusout(function() {
        var name = $input.val()
        $(curr).html(name)
        $input.hide()
        $(curr).show()

        socket.emit("update_user_name", { user_id: userId, username: name })
    })
}


function editPassword(curr) {
    var $input = $(curr).siblings(".input-password")
    var userId = $(curr).siblings(".user-id").val()
    if (!confirm('This will Permanently delete the password. Do you wish to continue?')) {
        return
    } else {
        $input.focus();
    }
    $(curr).siblings("br").show()
    $input.val("")
    $(curr).hide();
    $input.show();

    $input.focusout(function() {
        var password = $input.val()
        $(curr).html(name)
        $input.hide()
        $(curr).show()
        $(curr).siblings("br").hide()
        socket.emit("update_password", { user_id: userId, password: password })
        $(curr).html("*********************")
        alert("Password was changed.")
    });
}

// TODO: Add socket.on for password changed (to change the value of the password to the updated hash).
socket.on('update_password', function(details) {
    // details["user_id"]
});