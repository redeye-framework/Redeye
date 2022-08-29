$(".section-name").click(function() {
    var val = $(this).text()
    var inp = $(this).parent().find("input")
    $(inp).val($.trim(val))
    $(this).hide()
    $(inp).show()
    $(inp).focus()

    var sec = $(this)
    $(inp).focusout(function() {
        var new_name = $(this).val()
        var sectionId = $(this).prop("defaultValue");
        $(sec).text(new_name)
        $(this).hide()
        $(sec).show()
        $.post(Flask.url_for('change_section_name', {
            id: sectionId,
            newName: new_name
        }));
    })
})

$(".new-section").click(function() {
    $("#add_section_form").submit()
    //var sections = $(".section-name")
    //$(sections[sections.length - 1]).click()
});

$(".section-hide-btn").click(function() {
    var i = $(this).find("i")
    if (i.hasClass("fa-angle-down")) {
        i.removeClass("fa-angle-down")
        i.addClass("fa-angle-up")
        $(this).parent().find(".row").hide()
        $(this).parent().find("br").hide()
    } else {
        i.removeClass("fa-angle-up")
        i.addClass("fa-angle-down")
        $(this).parent().find(".row").show()
        $(this).parent().find("br").show()
    }
})

$(".section-hide-all-btn").click(function() {
    var i = $(this).find("i")
    if (i.hasClass("fa-angle-down")) {
        i.removeClass("fa-angle-down")
        i.addClass("fa-angle-up")

        $(".sections").find(".fa-angle-down").each(function() {
            $(this).click()
        })
    } else {
        i.removeClass("fa-angle-up")
        i.addClass("fa-angle-down")

        $(".sections").find(".fa-angle-up").each(function() {
            $(this).click()
        })
    }
})

function editServerStatus() {
    $(".create-server-box").css("display", "none");
    $(".edit-server-status-box").css("display", "inline-block");
    $("#newStatusColor").focus()
    $(".sections").css("filter", "brightness(40%)");
    $(".sections").click(function() {
        $(".edit-server-status-box").css("display", "none");
        $(".sections").css("filter", "brightness(100%)");
    })
    this.addEventListener("keyup", function(event) {
        if (event.keyCode === 27) {
            $(".edit-server-status-box").css("display", "none");
            $(".sections").css("filter", "brightness(100%)");
        }
    })
}

function createNewServer(section) {
    $(".create-server-box").css("display", "inline-block");
    $("#newServerName").focus()
    if (section != "") {
        $("#newServerSection").val(section);
    }
    $("#newServerLabel").val(1);
    $(".sections").css("filter", "brightness(40%)");
    $(".sections").click(function() {
        $(".create-server-box").css("display", "none");
        $(".sections").css("filter", "brightness(100%)");
    })
    this.addEventListener("keyup", function(event) {
        if (event.keyCode === 27) {
            $(".create-server-box").css("display", "none");
            $(".sections").css("filter", "brightness(100%)");
        }
    })
}

$(".status-color").change(function() {
    colorId = this.childNodes[1].id;
    hexColor = this.childNodes[1].value;
    $.post(Flask.url_for('change_color', {
        obj: 'hexColor',
        id: colorId,
        value: hexColor.substring(1)
    }));
    location.reload();
})


$(".editable-inp").change(function() {
    var colorName = $(this).val()
    var colorId = $(this).attr('id')
    $.post(Flask.url_for('change_color_name', {
        obj: 'name',
        id: colorId,
        value: colorName
    }));
})

function is_section_empty(section) { 
    if ($(section).parent().parent().find(".server").length > 0) {
        return false;
    }
    return true;
}

$(".section-delete-btn").click(function() {
    var sectionId = $(this).attr("id");
    if (is_section_empty(this) || confirm("Are you sure you want to delete this section? This will delete all servers in section.")) {
        $.post(Flask.url_for('delete_section', {
            id: sectionId
        }));
        $(this).parent().parent().remove();
    }
})