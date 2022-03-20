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

