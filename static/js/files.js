var el = null;

$(document.getElementsByTagName("button")).bind("contextmenu", function (event) {
    el = this;
    event.preventDefault();

    $("#menu-pre-report").hide()
    if($(el).val().endsWith(".png") || $(el).val().endsWith(".jpg") || $(el).val().endsWith(".jpeg"))
    {
        $("#menu-pre-report").show()
    }

    $(".custom-menu").finish().toggle(100).
    css({
        top: event.pageY + "px",
        left: event.pageX - 260 + "px" 
    });
});

$(document).bind("mousedown", function (e) {
    
    if (!$(e.target).parents(".custom-menu").length > 0) {
        $(".custom-menu").hide(100);
    }
});

$(".custom-menu li").click(function(){
    switch($(this).attr("data-action")) {
        case "Rename": replaceChildName(el); break;
        case "Delete": delete_file(el.value);el.remove(); break;
        case "Download": download_file(el.value); break;
        case "pre-report": add_to_pre_report(el.value); break;
    }
    $(".custom-menu").hide(100);
});

function replaceChildName(file){
    var fname = prompt("Enter new name: ")
    $(file).find("span").text(fname)

    // Send new name to server.
    socket.emit("change_file_name", {path: file.value, new_fname: fname})
}

function delete_file(path){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "delete_file_from_dir" + "?" +"path=" + path);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function download_file(path){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "files" + "?" +"file_name=" + path);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function add_to_pre_report(path){
    alert(path + "\n@elad_pt search: add_to_pre_report");
}