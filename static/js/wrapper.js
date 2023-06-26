jQuery(function($) {

    $(".sidebar-dropdown > a").click(function() {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
            .parent()
            .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    $("#close-sidebar").click(function() {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function() {
        $(".page-wrapper").addClass("toggled");
    });
    
});

var dark = 0;

function toggleDark() {
    if (!dark) {
        $(".page-content").css("text-shadow", "1px 1px 1px black");
        $("body").css("background-color", "#1e2229");
        $(".page-content").css("color", "#bbc");
        $(".server-box").css("background-color", "#343a40");
        $(".server-box").css("color", "#bbc");
        dark = 1;
    } else {
        $(".page-content").css("text-shadow", "none");
        $("body").css("background-color", "white");
        $(".page-content").css("color", "#444");
        $(".server-box").css("background-color", "transparent");
        $(".server-box").css("color", "#666");
        dark = 0;
    }

}

function deleteServer() {
    if (confirm('Are you sure you want to delete the server from the database?')) {
        $("#delete-server-form").submit()
    }
}

var useredit = 0;

function showUser(username, password, type, perm, attain, uid, found) {
    $(".user-edit").hide()

    $(".user-info > .id").text(uid);
    $(".user-info > .username").text(username);
    $(".user-info > .password").text(password);
    $(".user-info > p > .type").text(type);
    $(".user-info > p > .perm").text(perm);
    if (found == "None") {
        found = "Server not mentioned";
    }
    $(".user-info > p > .found").text(found);
    $(".user-info > .attain").text(attain);
    $(".user-info").css("display", "inline-block");
    $("#input-id").val(uid);

}

function hideUser() {
    $(".user-details").css("display", "none");
    $(".user-edit").css("display", "none");
    useredit = 0;
}

function editUser() {
    username = $(".user-info > .username").text();
    password = $(".user-info > .password").text();
    type = $(".user-info > p > .type").text();
    perm = $(".user-info > p > .perm").text();
    found = $(".user-info > p > .found").text();
    attain = $(".user-info > .attain").text();

    $("#input-refferer").val(window.location.href)
    $("#input-username").val(username);
    $("#input-password").val(password);
    $("#input-type").val(type);
    $("#input-perm").val(perm);
    $("#input-found").val(found);
    $("#input-attain").val(attain);

    $(".user-edit").show()
    $(".user-info").hide()

    useredit = 1;

}

function removeUser() {
    var uid = $("#input-id").val();
    document.getElementById("user-" + uid).parentElement.parentElement.remove();
    window.location.href = "/delete_user?id=" + uid;
    hideUser();
}


function showNote(tasknmae, data, task_id, attain, exec) {
    $(".taskbox-info > .taskname").text(tasknmae);


    $(".taskbox-info > .data").text(data);
    if (attain == "None") {
        attain = "No notes Yet";
    }
    exec = "@" + exec
    $(".taskbox-info > .attain").text(attain);
    $(".taskbox-info > .exec").text(exec);
    $(".taskbox-info > .id").text(task_id);
    $(".taskbox-info").css("display", "inline-block");
    $("#input-id").val(task_id);
}

function hideNote() {
    $('.taskbox-info').hide();
    $('.taskbox-edit').hide();
}

function editNote() {
    $(".taskbox-info").css("display", "none");
    taskname = $(".taskbox-info > .taskname").text();
    data = $(".taskbox-info > .data").text();
    attain = $(".taskbox-info > .attain").text();
    exec = $(".taskbox-info > .exec").text();
    exec = exec.slice(1, );
    $("#input-taskname").val(taskname);
    $("#input-data").val(data);
    $("#input-attain").val(attain);
    $("#input-exec").val(exec);
    $(".taskbox-edit").css("display", "inline-block");
}

var keyMap = 0;
function toggleKeyMap() {
    $("#keybinding-map").toggle();
    if (!keyMap) {
        keyMap = 1;
        $(".page-content").css("filter", "brightness(40%)");
        this.addEventListener("keyup", function(event) {
            if (event.keyCode === 27) {
                keyMap = 0;
                $("#keybinding-map").hide();
                $(".page-content").css("filter", "brightness(100%)");
            }
        });
    } else {
        keyMap = 0;
        $(".page-content").css("filter", "brightness(100%)");
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    tempAlert(text, 1000);
}

function tempAlert(msg, duration) {
    var el = document.createElement("div");
    el.setAttribute("class", "popup");
    el.innerHTML = "Copied to clipboard: " + msg;
    setTimeout(function() {
        el.setAttribute("style", "opacity: 0;");
    }, duration);
    document.body.appendChild(el);
}

$(".hover-user-details").mouseover(function(e) {
    $(".user-details").show();
    $(".user-details").css({
        top: e.pageY,
        left: e.pageX - 260 // Size of sidebar.
    });
}).mouseout(function() {
    $(".user-details").hide();
});
$(".user-details").mouseover(function(e) {
    $(".user-details").show();
}).mouseout(function() {
    if (useredit == 0) {
        $(".user-details").hide();
    }
});

/*
function key_sc_con(obj, key, obj2) {
    document.addEventListener("keyup", function(event) {
        if (event.key === key && (document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA")) {
            $(obj).focus();
            $(obj).click();
        }
    })
}*/

function key_sc(obj, key) {
    document.addEventListener("keyup", function(event) {
        if (event.key === key && (document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA")) {
            $(obj).focus();
            $(obj).click();
        }
    })
}

function key_sc_func(func, key) {
    document.addEventListener("keyup", function(event) {
        if (event.key === key && (document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA")) {
            func();
        }
    })
}

$("input").focus(function() {
    this.addEventListener("keyup", function(event) {
        if (event.keyCode === 27) {
            $(this).blur();
        }
    })
})

$("textarea").focus(function() {
    this.addEventListener("keyup", function(event) {
        if (event.keyCode === 27) {
            $(this).blur();
        }
    })
})

$(".export").click(function() {
    console.log("export")
})

$(".import").click(function() {})

function showHiddenFloatingBox(box) {
    $(box).show();
    this.addEventListener("keyup", function(event) {
        if (event.keyCode === 27) {
            $(box).blur();
        }
    })
}

function hideHiddenFloatingBox(box) {
    $(box).hide();
}