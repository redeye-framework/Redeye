// Get the input field
document.getElementById("input_port1").addEventListener("keyup", function(event) {
if (event.keyCode === 13) {
    $('#port-form').submit();
}
});
document.getElementById("input_port2").addEventListener("keyup", function(event) {
if (event.keyCode === 13) {
    $('#port-form').submit();
}
});
document.getElementById("input_port3").addEventListener("keyup", function(event) {
if (event.keyCode === 13) {
    $('#port-form').submit();
}
});
document.getElementById("input_port4").addEventListener("keyup", function(event) {
if (event.keyCode === 13) {
    $('#port-form').submit();
}
});

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
        $.post(Flask.url_for('change_section_name', { id: sectionId, newName: new_name }));
    })
})

$("table").mouseover(function() {
    $(this).find(".tr-add").show()
    //$(this).find(".tr-add").animate({padding: '0px'}, {duration: 200});
    //$(this).find(".tr-add").find('td')
    //.wrapInner('<div style="display: block;" />')
    //.parent()
    //.find('td > div')
    //.slideUp(700, function(){
    //    $(this).parent().parent().remove();
    //});
}).mouseleave(function() {
    if (!$(this).find(':focus').length > 0){
        $(this).find(".tr-add").hide()
    }
    else {
        $(this).focusout(function() {
            if (!$(this).is(':hover')) {
                $(this).find(".tr-add").hide()
            }
        })
    }
    //$(this).find(".tr-add").find('td')
    //.wrapInner('<div style="display: none;" />')
    //.parent()
    //.find('td > div')
    //.slideDown(700, function(){
    //    var $set = $(this);
    //    $set.replaceWith($set.contents());
    //});
})

