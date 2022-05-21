$(".section-name").click(function() {
    var val = $(this).text()
    var inp = $(this).parent().find("input")
    $(inp).val(val)
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
    $(".edit-server-status-box").css("display", "inline-block");
    $(".sections").css("filter", "brightness(40%)");
    $(".sections").click(function() {
        $(".edit-server-status-box").css("display", "none");
        $(".sections").css("filter", "brightness(100%)");
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