$(function(){
    $('#modal-example').multiSelect({
        'modalHTML': '<div class="multi-select-modal">'
    });
});
function submitCheckbox(id){
    $('#checkbox-id-input').val(id);
    $('#achievement-update-form').submit();
}
function get_executers(){
    var exec = document.getElementsByClassName("multi-select-button")[0].innerHTML;
    document.getElementById("exec").value = exec;
    return;
}

$(document).ready(function(){
    var perm = document.getElementById("perm").value;

    if (parseInt(perm)){
        document.getElementById("create_mission").style.display = "inline-block";
    }
    $('.message').each(function() {
        var msgUsr = this.children[1].innerHTML;
        this.style.float = change_float(msgUsr);
    });

    var date = new Date();
    var day = ("0" + date.getDate()).slice(-2); var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var today = date.getFullYear()+"-"+(month)+"-"+(day);
    $('#input-today').val(today);
    document.getElementById("input-end").setAttribute("min",today)

    setRightMissionState();
})

function setRightMissionState(){
    var missions = $(".mission");
    for (var i=0; i< missions.length; i++) {
        var state = $(missions[i]).find(".state")
        var mission_id = $(missions[i]).find("#mission_id").val()
        if ($(state).val() == "1") {
            gone = $(missions[i]).find(".gone")
            left = $(missions[i]).find(".left")
            $(gone).width("100%")
            $(left).width("0%")
            $(gone).find(".text").html("Done!")
            $(left).find(".text").html("")
            $(missions[i]).find(".startpoint").toggleClass("green")
            $(gone).toggleClass("green")
        } else {
            if ($(missions[i]).find(".lwidth").val() == '0%') {
                gone = $(missions[i]).find(".gone")
                left = $(missions[i]).find(".left")
                state = $(missions[i]).find(".state")
                $(gone).find(".text").html("Overdue!")
                $(left).find(".text").html("")
                $(missions[i]).find(".startpoint").toggleClass("red")
                $(gone).toggleClass("red")
            }
        }
    }
}

$('a.open-chat').click(function(e)
{
    // Special stuff to do when this link is clicked...
    var mission = this.parentElement.parentElement;
    messageId = mission.id.split("-")[1];
    var chat = $(mission).find(".chat")
    $(chat).show()
    $(chat).height("600px")
    $(mission).find(".open-chat").hide()
    $(mission).find(".close-chat").show()

    window.scroll({
        top:  $(window).scrollTop() + $(mission).offset().top - $(window).scrollTop() - 40,
        left: 0,
        behavior: 'smooth'
    });

    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;

    $(mission).find(".msg-input").focus()
    // Cancel the default <a> action
    e.preventDefault();
    socket.emit('mission_msg_read', {msg_id: messageId})
});

$('a.close-chat').click(function(e)
{
    // Special stuff to do when this link is clicked...
    var mission = this.parentElement.parentElement;
    var chat = $(mission).find(".chat")
    $(chat).height("0px")
    $(mission).find(".open-chat").show()
    $(mission).find(".close-chat").hide()
    // Cancel the default action
    e.preventDefault();
});

function deleteMsg(a){
    var messageId = $(a).siblings('.message-id').val()
    socket.emit('delete_msg', {msg_id: messageId})
    a.parentElement.remove()
}

function fillTimeLine(input){
    var id = input.parentElement.parentElement.querySelectorAll("input")[1].value;
    socket.emit("mission_complete", {mission_id:id});
}

/* Deprecated (?)
$(".timeline").mouseover(function () {
}).mouseout(function () {
});
*/

/* Administrators functions: */
if (userIsAdmin) {
    $(".name").click(function(){
        var $edit = $(this).siblings(".edit-name")
        $edit.val($(this).html())
        $edit.show()
        $(this).hide()
        $edit.get(0).addEventListener("keyup", function(event) {
          // Number 13 is the "Enter" key on the keyboard
          if (event.keyCode === 13) {
              $(this).focusout();
          }
        });
        $edit.focus()
    })
    $(".edit-name").focusout(function(){
        var missionId = $(this).siblings(".mission-id").val()
        var $name = $(this).siblings(".name")
        $name.html($(this).val())
        $name.show()
        $(this).hide()
        socket.emit("edit_mission_name", {mission_id: missionId, name: $name.html()})
    })
    $(".desc").click(function(){
        var $edit = $(this).siblings(".edit-desc")
        $edit.val($(this).html())
        $edit.show()
        $(this).hide()
        $edit.get(0).addEventListener("keyup", function(event) {
          // Number 13 is the "Enter" key on the keyboard
          if (event.keyCode === 13) {
              $(this).focusout();
          }
        });
        $edit.focus()
    })
    $(".edit-desc").focusout(function(){
        var missionId = $(this).siblings(".mission-id").val()
        var $desc = $(this).siblings(".desc")
        $desc.html($(this).val())
        $desc.show()
        $(this).hide()
        socket.emit("edit_mission_desc", {mission_id: missionId, desc: $desc.html()})
    })
    $(".edit-desc").focusout(function(){
        var missionId = $(this).siblings(".mission-id").val()
        var $desc = $(this).siblings(".desc")
        $desc.html($(this).val())
        $desc.show()
        $(this).hide()
        socket.emit("edit_mission_desc", {mission_id: missionId, desc: $desc.html()})
    })
}


socket.on('change_status', function(details) {
    var timeline = document.getElementById("timeline-" + details["mission_id"]);
    gone = $(timeline).find(".gone")
    left = $(timeline).find(".left")
    state = $(timeline).find(".state")

    if (details["status"] == "1"){
        state.val("1");
        $(gone).width("100%")
        $(left).width("0%")
        $(gone).find(".text").html("Done!")
        $(left).find(".text").html("")
        $(timeline).find(".startpoint").toggleClass("green")
        $(gone).toggleClass("green")
        if ($(gone).hasClass("red")) {
            $(timeline).find(".startpoint").toggleClass("red")
            $(gone).toggleClass("red")
        }
    } else {
        state.val("0");
        $(gone).width($(timeline).find(".gwidth").val())
        $(left).width($(timeline).find(".lwidth").val())
        
        // If mission overdue
        if ($(timeline).find(".lwidth").val() == '0%') {
            $(gone).find(".text").html("Overdue!")
            $(left).find(".text").html("")
            $(timeline).find(".startpoint").toggleClass("red")
            $(gone).toggleClass("red")
            if ($(gone).hasClass("green")) {
                $(timeline).find(".startpoint").toggleClass("green")
                $(gone).toggleClass("green")
            }
        } else {
            $(gone).find(".text").html($(timeline).find(".gtext").val())
            $(left).find(".text").html($(timeline).find(".ltext").val())
            $(timeline).find(".startpoint").toggleClass("green")
            $(gone).toggleClass("green")
        }
    }
    console.log("status changed")
});

//socket.emit("data":data, "mission_id":id)
socket.on('add_new_msg', function(details) {
    if (details["file"][0]){
        new_msg = '<div class="message" style="float:' + change_float(details["sender_name"]) +';"> \
        <input class="message-id" type="hidden" value="' + details["msg_id"] + '"> \
        <div id="sender" class="sender">' + details["sender_name"] +'</div> \
        <div id="date" class="date">' + details["date"] + '</div> \
        <div id="content" class="content">' + details["data"] + ' \
        <form action="/download_chat_file" id="download-file-form-' + details["file"][0][2] + '"method="GET"> \
        <input type="hidden" name="file_name" value="' + details["file"][0][2] +'"><a href="#" onclick="javascript:document.getElementById('+ "'download-file-form-" + details["file"][0][2] + "'" +').submit()" \
        class="file-attach"><i class="fa fa-download"></i><span class="filename">' + details["file"][0][1] + '</span></a></form></div>'
    }
    else{
        new_msg = "<div class='message' style='float:" + change_float(details["sender_name"]) +";'> \
        <div id='sender' class='sender'>" + details["sender_name"] +"</div> \
        <div id='date' class='date'>" + details["date"] + "</div> \
        <div id='content' class='content'>" + details["data"] + "</div> \
        <input class='message-id' type='hidden' value='" + details["msg_id"] + "'>";
    }

    if(details["sender_name"] == username){
        new_msg += "<a onclick='deleteMsg(this)' class='hide-message'><i class='fa fa-trash'></i></a>"
    }
    new_msg += "</div>"
    document.getElementById("mission-"+details["mission_id"]).children[2].children[1].innerHTML += new_msg;
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
});

//socket.emit(mission_id:id)
socket.on('delete_mission', function(details) {
    document.getElementById("mission-"+details["mission_id"]).remove()
});

//socket.emit("mission_id":id,"mission_name":mission_name,"mission_data":mission_data)
// "start_time":mission_start_time,"end_time":mission_end_time)
socket.on('edit_mission', function(details) {
    console.log("mission edited", details)
    // Edit mission details by manager
    // {"mission_id":mission_id, "mission_name":mission_name,
    // {"mission_data":mission_data,"start_time":mission_start_time,
    // {"end_time":mission_end_time}

});

socket.on('delete_msg', function(details) {
    // Delete mission
    // details["msg_id"] ==> delete_element
});

socket.on('urgent_changed', function(details) {
    $("#flag-" + missionId).toggleClass("urgent")
});

$(".send-btn").click(function(){
    //var file = document.getElementById("add-attachment").files[0]
    var file = $(this.parentElement).find(".attachment-input")[0].files[0]
    var msg = $(this).siblings(".msg-input")
    var content = msg.val()
    msg.val("")
    if (content == ""){
        return
    }
    var mission_id = $(this).siblings(".mission-id").val();
    if (!file){
        socket.emit("add_new_msg", {data:content, mission_id:mission_id});
    }
    else{
        socket.emit("add_new_msg", {data:content, mission_id:mission_id, file_name:file.name ,file: file});
    }
    $(this.parentElement).find(".attachment-input").val("")
    $(this.parentElement).find(".chat-file").hide()
});

function deleteMission(curr){
    var missionId = $(curr).siblings(".mission-id").val();
    socket.emit("delete_mission", {mission_id:missionId});
}


$(".msg-input").focus(function(){
    // Execute a function when the user releases a key on the keyboard
    this.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        $(this).siblings(".send-btn").click();
      }
    });
})


function add_files(obj){
    var files = obj.files;
    var parent = obj.parentElement.parentElement;
    for(i=0 ; i < files.length; ++i){
        var new_file = "<label for='files' class='new-file'>\
                    <input type='file' id='files' class='new-file' name='attachments'> \
                    <i class='fa fa-times remove-file' onclick='removeFile(this)'></i> \
                    " + files[i]["name"] + " \
                    </label>"
        parent.innerHTML += new_file
    }
    document.getElementById("files").files = files;
}

$(".attachment-input").change(function(){
    $(this.parentElement.parentElement).find(".chat-file-name").text($(this).val())
    $(this.parentElement.parentElement).find(".chat-file").show()
})

function removeFile(curr){
    curr.parentElement.remove();
}

function toggleMissionUrgent(missionId) {
    $("#flag-" + missionId).toggleClass("urgent")
    socket.emit('toggle_mission_urgent', {mission_id: missionId})
}