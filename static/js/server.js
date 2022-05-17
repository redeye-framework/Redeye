/*$(document).ready(function () {
    var dict = {};
    var elms = document.querySelectorAll('[id*="files"]');
    console.log(elms);
    for (var i = 0; i < elms.length; i++) {
        var el = elms[i];
        dict[el.innerHTML] = el.href;
        el.addEventListener('contextmenu', openContextMenu, false);

    }

    const menu = new ContextMenu({
        'theme': 'default',
        'items': [{
                'icon': 'file',
                'name': 'View File',
                action: () => window.location = dict["1.txt"]
            },
            //$(document.querySelectorAll('[id*="files"]'))
            {
                'icon': 'download',
                'name': 'Download File',
                action: () => download(el.href, el.name)
            },
        ]
    });

    function openContextMenu(evt) {
        evt.preventDefault();
        const time = menu.isOpen() ? 100 : 0;

        menu.hide();
        setTimeout(() => {
            menu.show(evt.pageX, evt.pageY)
        }, time);
        document.addEventListener('click', hideContextMenu, false);
    }

    function hideContextMenu(evt) {
        menu.hide();
        document.removeEventListener('click', hideContextMenu);
    }

    function start_context() {
        console.log("here")
        var el = window.event.srcElement;
        location.href = el.href;

    }
    //$(document.querySelectorAll('[id*="files"]')).click(start_context);
    //$(document.querySelectorAll('[id*="files"]')).click(start_context);



    function download(url, filename) {
        fetch(url).then(function (t) {
            return t.blob().then((b) => {
                var a = document.createElement("a");
                a.href = URL.createObjectURL(b);
                a.setAttribute("download", filename);
                a.click();
            });
        });
    }
});*/

function sort_ports() {
    var state = document.getElementById('state').value;
    var table = document.getElementById('ports_table');

    for (var i = 1; i <= table.rows.length; ++i) {
        if (table.rows[i].style.display == "none") {
            table.rows[i].style.display = "";

        }
        var port_state = table.rows[i].cells[2].innerHTML;
        if (state.toLowerCase() != port_state.toLowerCase() && state != "All") {
            table.rows[i].style.display = 'none';
        } else if (state == "All") {
            for (var i = 1; i <= table.rows.length; ++i) {
                table.rows[i].style.display = "";
            }
        }
    }
}

function submitUsersForm() {
    document.getElementById("type").value = document.getElementById("UserTypeForm").value;
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
    console.log(inp)
    $(this).hide();
    $(inp).show();
    $(inp).focus();
    $(inp).focusout(function(){
        var spa = $(this).parent().find(".editable");
        var type = $(this).parent().find(".editable-type");
        var id = $(this).parent().find(".editable-id");
        var val = $(inp).val();
        $(inp).hide();
        $(spa).show();
        $(spa).text(val);
        //TODO: pt put here socket io - use id, type and val.
    })
});

$(".editable-2").click(function() {
    var inp = $(this).parent().find(".editable-inp-2");
    console.log(inp)
    $(this).hide();
    $(inp).show();
    $(inp).focus();
    $(inp).focusout(function(){
        var spa = $(this).parent().find(".editable-2");
        var type = $(this).parent().find(".editable-type-2");
        var id = $(this).parent().find(".editable-id-2");
        var val = $(inp).val();
        $(inp).hide();
        $(spa).show();
        $(spa).text(val);
        //TODO: pt put here socket io - use id, type and val.
    })
});

// Get the input field
$(document).ready(function() {
    $(".item-add").each(function(){
        $(this).find("input").each(function(){
            this.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    this.closest("form").submit();
                }
            })
        })
    })
});