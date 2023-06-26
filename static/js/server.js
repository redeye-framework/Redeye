
function editServerSubmit(section) {
    $('#name-form').submit()
        // TODO: elat_pt
        // add { url_for('change_server') }} to create new server of defined section to default name with "-" as ip.
        //$.post(Flask.url_for('change_server', { section: section }));

}

function sort_ports() {
    var state = document.getElementById('state').value;
    var table = document.getElementById('ports_table');

    for (var i = 1; i <= table.rows.length - 1; ++i) {
        table.rows[i].style.display = "";
        var port_state = $(table.rows[i].cells[2]).find(".editable").html();
        if (!port_state) {
            continue;
        }
        if (state != "All" && state.toLowerCase() != port_state.toLowerCase()) {
            table.rows[i].style.display = 'none';
        }
    }
}

function submitUsersForm() {
    $('#user-form').submit();
}

$("table").mouseover(function() {
    $(this).find(".item-add").show()
        //$(this).find(".item-add").animate({padding: '0px'}, {duration: 200});
        //$(this).find(".item-add").find('td')
        //.wrapInner('<div style="display: block;" />')
        //.parent()
        //.find('td > div')
        //.slideUp(700, function(){
        //    $(this).parent().parent().remove();
        //});
}).mouseleave(function() {
    if (!$(this).find(':focus').length > 0) {
        $(this).find(".item-add").hide()
    } else {
        $(this).focusout(function() {
            if (!$(this).is(':hover')) {
                $(this).find(".item-add").hide()
            }
        })
    }
    //$(this).find(".item-add").find('td')
    //.wrapInner('<div style="display: none;" />')
    //.parent()
    //.find('td > div')
    //.slideDown(700, function(){
    //    var $set = $(this);
    //    $set.replaceWith($set.contents());
    //});
})

$(".editable").click(function() {
    var inp = $(this).parent().find(".editable-inp");
    $(this).hide();
    $(inp).show();
    $(inp).focus();
    $(inp).focusout(function() {
        var spa = $(this).parent().find(".editable");
        var type = $(this).parent().find(".editable-type").val();
        var obj = $(this).parent().find(".editable-obj").val();
        var id = $(this).parent().find(".editable-id").val();
        var val = $(inp).val();

        if (val == "") {
            val = "-"
        }

        $(inp).hide();
        $(spa).show();
        $(spa).text(val);

        $.post(Flask.url_for('change_server', {
            id: id,
            type: type,
            obj: obj,
            value: val
        }));
    })
});

$(".editable").closest("td").click(function() {
    var edi = $(this).find(".editable")
    var inp = $(edi).parent().find(".editable-inp");
    $(edi).hide();
    $(inp).show();
    $(inp).focus();
    $(inp).focusout(function() {
        var spa = $(this).parent().find(".editable");
        var type = $(this).parent().find(".editable-type").val();
        var obj = $(this).parent().find(".editable-obj").val();
        var id = $(this).parent().find(".editable-id").val();
        var val = $(inp).val();

        if (val == "") {
            val = "-"
        }

        $(inp).hide();
        $(spa).show();
        $(spa).text(val);

        $.post(Flask.url_for('change_server', {
            id: id,
            type: type,
            obj: obj,
            value: val
        }));
    })
});

$("p.editable").click(function() {
    var inp = $(this).parent().find(".editable-inp");
    $(this).hide();
    $(inp).show();
    $(inp).focus();
    $(inp).focusout(function() {
        var spa = $(this).parent().find(".editable");
        var type = $(this).parent().find(".editable-type").val();
        var obj = $(this).parent().find(".editable-obj").val();
        var id = $(this).parent().find(".editable-id").val();
        var val = $(inp).val();

        if (val == "") {
            val = "-"
        }

        $(inp).hide();
        $(spa).show();
        $(spa).text(val);

        $.post(Flask.url_for('change_server', {
            id: id,
            type: type,
            obj: obj,
            value: val
        }));
    })
});

$("input.editable-inp").each(function() {
    this.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            var spa = $(this).parent().find(".editable");
            var type = $(this).parent().find(".editable-type");
            var obj = $(this).parent().find(".editable-obj").val();
            var id = $(this).parent().find(".editable-id");
            var val = $(this).val();
            $(this).hide();
            $(spa).show();
            $(spa).text(val);

            $.post(Flask.url_for('change_server', {
                id: id,
                type: type,
                obj: obj,
                value: val
            }));
        }
    })
})

$(".editable-2").click(function() {
    var inp = $(this).parent().find(".editable-inp-2");
    $(this).hide();
    $(inp).show();
    $(inp).focus();
    $(inp).focusout(function() {
        var spa = $(this).parent().find(".editable-2");
        var obj = $(this).parent().find(".editable-obj-2").val();
        var type = $(this).parent().find(".editable-type-2").val();
        var id = $(this).parent().find(".editable-id-2").val();
        var val = $(inp).val();
        $(inp).hide();
        $(spa).show();
        $(spa).text(val);

        $.post(Flask.url_for('change_server', {
            id: id,
            type: type,
            obj: obj,
            value: val
        }));
        window.location.href = "server?ip=" + val
    })
});

$(".editable-inp-2").each(function() {
    this.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            var spa = $(this).parent().find(".editable-2");
            var type = $(this).parent().find(".editable-type-2");
            var obj = $(this).parent().find(".editable-obj-2").val();
            var id = $(this).parent().find(".editable-id-2");
            var val = $(this).val();
            $(this).hide();
            $(spa).show();
            $(spa).text(val);

            $.post(Flask.url_for('change_server', {
                id: id,
                type: type,
                obj: obj,
                value: val
            }));
        }
    })
})

function deleteServer(serverId) {
    if (confirm("Press ok to delete server.")) {
        $.post(Flask.url_for('delete_server', { id: serverId }));
        window.location.href = "servers"
    }
}

$('select').on('change', function() {
    $.post(Flask.url_for('change_server_section', {
        sectionId: this.value,
        serverId: this.id
    }));
});

// Get the input field
$(document).ready(function() {
    $(".item-add").each(function() {
        $(this).find("input").each(function() {
            this.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    this.closest("form").submit();
                }
            })
        })
    })
});


$('.color-picker').on('change', function(e) {
    var serverId = this.id;
    var color = this.value;
    var colorId = $(this).children(":selected").attr("id");
    serverIp = $(".head").css("border-bottom-color", color);

    $.post(Flask.url_for('change_server_color', {
        serverId: serverId,
        colorId: colorId
    }));
});

$(".add-tag").on('click', function(e) {
    var serverId = $(".editable-id").val();
    showTagBox("", "grey", serverId, 0);
    /*$.post(Flask.url_for('add_tag', {
        serverId: serverId,
        name: tagName,
        color: tagColor
    }));*/
});

$(".normal-tag").on('click', function(e) {
    var serverId = $(".editable-id").val();
    var tagId = $(this).attr('id');
    var tagName = $(this).text();
    var tagColor = $(this).find('.tag-color').val();
    alert(tagId);
    showTagBox(tagName, tagColor, serverId, tagId);
});

$(".delete-tag").on('click', function(e) {
    var tagId = $(this).parent().find('.tag-id-input').val();
    $.post(Flask.url_for('save_tag', {
        "tagId": tagId,
        "serverId": 0,
        "tagName": "",
        "color": ""
    }));
    hideHiddenFloatingBox("#tag-box");
    location.reload();
});

function showTagBox(name, color, serverId, tagId) {
    showHiddenFloatingBox("#tag-box");
    $(".tag-name-input").val(name);
    $(("#tag-" + color)).click();
    $(".tag-name-input").focus();
    $(".server-id-input").val(serverId);
    $(".tag-id-input").val(tagId);
}

const checkboxes = document.querySelectorAll('input[type="checkbox"][name="color"]');
        
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        checkboxes.forEach(cb => {
            cb.checked = (cb === checkbox);
        });
    });
});