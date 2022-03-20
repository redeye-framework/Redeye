socket.on('mission_msg_added', function(details) {
    mission_id = details["mission_id"];
    document.getElementById(mission_id).childNodes[1].getElementsByTagName("a")[0].innerHTML = details["new_msg"][mission_id]
});

socket.on('change_status', function(details) {
    mission_id = details["mission_id"];
    if (details["status"]){
        document.getElementById(mission_id).childNodes[1].getElementsByTagName("div")[0].className = "done done"
    }
    else{
        document.getElementById(mission_id).childNodes[1].getElementsByTagName("div")[0].className = "done not-done"
    }
});

$(".open-desc").click(function (){
    $more = $(this).parent().parent().siblings(".more")
    $more.css("width", "400px")
    $more.css("padding", "10px 15px")

    $main = $(this).parent().parent()
    $main.css("border-radius", "10px 0 0 10px")

    $(this).hide()
    $(this).siblings(".close-desc").show()
})

$(".close-desc").click(function (){
    $more = $(this).parent().parent().siblings(".more")
    $more.css("width", "0px")
    $more.css("padding", "0px")

    $main = $(this).parent().parent()
    $main.css("border-radius", "10px")

    $(this).hide()
    $(this).siblings(".open-desc").show()
})


