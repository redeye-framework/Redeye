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

        $.post(Flask.url_for('update_user_name', { user_id: userId, username: name }));
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
        $.post(Flask.url_for('update_password', { user_id: userId, password: password }));
        $(curr).html("*********************")
        alert("Password was changed.")
    });
}

function deleteUser(parent, curr) {
    var userId = $(curr).siblings(".user-id").val();
    var username = $(curr).siblings(".input-name").val();
    if (!confirm('This will Permanently delete the user. Do you wish to continue?')) {
        return
    }
    $(parent).hide();
    $.post(Flask.url_for('delete_managment_user', { user_id: userId }));
}