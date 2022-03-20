"use strict";

var rotateRight = 1;
var new_msgs = [];
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var settings = urlParams.get('settings');
var current_tab = "";
var group;
group = urlParams.get('group');
$(".settings-btn").click(function () {
  $(this).toggleClass("rotateRight");
  $(this).toggleClass("rotateLeft");
  $(".chats-box").toggle();
  $(".settings-box").toggle();
});
$(".chats-box").ready(function () {
  var height = $(window).height();
  $(".chats-box").height(height * 0.87);
  $(".chats-box").css("display", "flex");
  $(".chat-icon")[0].click();

  if (settings == 1) {
    $(".settings-box").show();
    $(".chats-box").hide();

    if (group) {
      $(".icon-name-group")[Number(group)].click();
    }
  }
});
$("#chat-icon-new").click(function (e) {
  $(".chats-users").show();
  $(".chats-users").css({
    top: e.pageY,
    left: e.pageX
  });
}).mouseout(function () {
  $(".chats-users").hide();
});
$(".chats-users").mouseover(function () {
  $(".chats-users").show();
}).mouseout(function () {
  $(".chats-users").hide();
});
$(".icon-name").mouseover(function () {
  $(this).find(".image>i").show();
}).mouseout(function () {
  if (!$(this).hasClass("icon-name-hidden")) {
    $(this).find(".image>i").hide();
  }
});
$(".icon-name").click(function () {
  var icon = $(this).find("i");

  if (!$(this).hasClass("icon-name-group")) {
    icon.toggleClass("fa-eye");
    icon.toggleClass("fa-eye-slash");
    $(this).toggleClass("icon-name-hidden");
  }
});

function openChat(this_obj) {
  console.log("in open chat"); // If clicked on new icon.

  if (this_obj.id == "chat-icon-new") {
    return;
  } // Rest messages


  document.getElementById("messages").innerHTML = "";
  $(".current").find("span").text($(".current").find("span").text()[0]);
  $(".current").toggleClass("current");
  $(this_obj).toggleClass("current");
  var groupName = this_obj.title;
  $(this_obj).find("span").text(groupName);

  if (groupName.length > 8) {
    $($(this_obj).find("span")).css("font-size", "12px");
  }

  var to = this_obj.querySelectorAll("input");
  var to_type = to[0].value;
  var to_id = to[1].value; // init the current personal

  document.getElementById("to").value = to_type;
  document.getElementById("to-user-id").value = to_id; // load relevent messages related to that person

  if (to_type == "All") {
    var chat_type = "all-chats";
  } else if (to_type == "group") {
    var chat_type = "group-chats";
  } else {
    var chat_type = "private-chats";
  }

  var chats = document.getElementById(chat_type).value.split("(");
  var messages = [];

  for (var i = 1; i < chats.length; i++) {
    chat = chats[i].split(",");
    sender_type = chat[1].slice(2, -1);
    sender_id = $.trim(chat[2]);
    sender_user_name = chat[3].slice(2, -1);
    date = chat[9].slice(2, -1);
    recive_type = chat[4].slice(2, -1);
    recive_id = $.trim(chat[5]);
    content = chat[7].slice(2, -1);
    group_id = chat[11].replace(/\D/g, ''); // string non numeric chars

    file_path = chat[12].slice(2, -2).replace("'", "");

    if (to_type == "All") {
      if (file_path) {
        msg = build_obj_with_file(sender_type + "\\" + sender_user_name, date, content, file_path);
      } else {
        msg = build_obj(sender_type + "\\" + sender_user_name, date, content);
      }

      messages.push(msg);
    } else if (to_type == "group") {
      if (group_id == to_id) {
        if (file_path) {
          msg = build_obj_with_file(sender_type + "\\" + sender_user_name, date, content, file_path);
        } else {
          msg = build_obj(sender_type + "\\" + sender_user_name, date, content);
        }

        messages.push(msg);
      }
    } else {
      if (recive_type == to_type && recive_id == to_id || sender_type == to_type && sender_id == to_id) {
        if (file_path) {
          msg = build_obj_with_file(sender_type + "\\" + sender_user_name, date, content, file_path);
        } else {
          msg = build_obj(sender_type + "\\" + sender_user_name, date, content);
        }

        messages.push(msg);
      }
    }
  }

  build_msg(messages);
  var element = document.getElementById("messages");
  element.scrollTop = element.scrollHeight;
}

$(".chat-icon").click(function () {
  // If clicked on new icon.
  if (this.id == "chat-icon-new") {
    return;
  }

  if (current_tab && current_tab == this.id) {
    console.log("in the same tab", this, current_tab);
    return;
  } // update current tab


  current_tab = this.id; // Rest messages

  document.getElementById("messages").innerHTML = "";
  $(".current").find("span").text($(".current").find("span").text()[0]);
  $(".current").find("span").css("font-size", "34px");
  $(".current").toggleClass("current");
  $(this).toggleClass("current");
  var groupName = this.title;
  $(this).find("span").text(groupName);

  if (groupName.length > 8) {
    $($(this).find("span")).css("font-size", "10px");
  } else {
    $($(this).find("span")).css("font-size", "18px");
  }

  ;
  var to = this.querySelectorAll("input");
  var to_type = to[0].value;
  var to_id = to[1].value; // init the current personal

  document.getElementById("to").value = to_type;
  document.getElementById("to-user-id").value = to_id; // load relevent messages related to that person

  if (to_type == "All") {
    var chat_type = "all-chats";
  } else if (to_type == "group") {
    var chat_type = "group-chats";
  } else {
    var chat_type = "private-chats";
  }

  var chats = document.getElementById(chat_type).value.split("(");
  var messages = [];

  for (var i = 1; i < chats.length; i++) {
    chat = chats[i].split(",");
    sender_type = chat[1].slice(2, -1);
    sender_id = $.trim(chat[2]);
    sender_user_name = chat[3].slice(2, -1);
    date = chat[9].slice(2, -1);
    recive_type = chat[4].slice(2, -1);
    recive_id = $.trim(chat[5]);
    content = chat[7].slice(2, -1);
    group_id = chat[11].replace(/\D/g, ''); // string non numeric chars

    file_path = chat[12].slice(2, -2).replace("'", "");

    if (to_type == "All") {
      if (file_path && file_path.includes("/")) {
        msg = build_obj_with_file(sender_type + "\\" + sender_user_name, date, content, file_path);
      } else {
        msg = build_obj(sender_type + "\\" + sender_user_name, date, content);
      }

      console.log("in all");
      console.log(msg);
      messages.push(msg);
    } else if (to_type == "group") {
      if (group_id == to_id) {
        if (file_path && file_path.includes("/")) {
          msg = build_obj_with_file(sender_type + "\\" + sender_user_name, date, content, file_path);
        } else if (content == "UserLeftGroup") {
          msg = {
            "leave_group": '<div class="message user-left" style=float:left><span class="username">' + sender_user_name + '</span> has left the group</div><br>'
          };
        } else {
          msg = build_obj(sender_type + "\\" + sender_user_name, date, content);
        }

        console.log("in group");
        console.log(msg);
        messages.push(msg);
      }
    } else {
      if (recive_type == to_type && recive_id == to_id || sender_type == to_type && sender_id == to_id) {
        console.log(sender_type, to_type, sender_id, to_id);

        if (file_path) {
          msg = build_obj_with_file(sender_type + "\\" + sender_user_name, date, content, file_path);
        } else {
          msg = build_obj(sender_type + "\\" + sender_user_name, date, content);
        }

        console.log("in private");
        console.log(msg);
        messages.push(msg);
      }
    }
  }

  for (i = 0; i < new_msgs.length; i++) {
    if (new_msgs[i]["type"] == "All" && to_type == "All") {
      console.log("chat-icon loading msg to all ==> ");
      console.log(new_msgs[i]["msg"]);
      messages.push(new_msgs[i]["msg"]);
      console.log(new_msgs);
    } else if (new_msgs[i]["type"] == "Group" && new_msgs[i]["id"] == group_id && to_type == "group" || new_msgs[i]["leave_group"] && this.id.includes("group")) {
      console.log(new_msgs[i]["type"] == "Group" && new_msgs[i]["id"] == group_id && to_type == "group");
      console.log("in group add", new_msgs[i]);

      if (new_msgs[i]["leave_group"]) {
        messages.push(new_msgs[i]);
      } else {
        messages.push(new_msgs[i]["msg"]);
      }

      console.log(new_msgs);
    } else if (new_msgs[i]["type"] == "Private" && new_msgs[i]["id"] == sender_id) {
      if (recive_type == to_type && recive_id == to_id || sender_type == to_type && sender_id == to_id) {
        console.log("chat-icon loading msg to all ==> ");
        console.log(new_msgs[i]["msg"]);
        messages.push(new_msgs[i]["msg"]);
        console.log(new_msgs);
      }
    }
  }

  console.log(" this is messages in chat-icon");
  console.log(messages);
  build_msg(messages);
  var element = document.getElementById("messages");
  element.scrollTop = element.scrollHeight;
});

function build_obj(sender, date, content) {
  return {
    'sender': sender,
    'date': date,
    'content': content
  };
}

function build_obj_with_file(sender, date, content, file_path) {
  return {
    'sender': sender,
    'date': date,
    'content': content,
    'file_path': file_path
  };
}

function download_file(path) {
  $.post(Flask.url_for('download_chat_file', {
    file_name: path
  }));
}

function change_float(user) {
  var my_username = document.getElementById("current-user").value;

  if (my_username == user) {
    return "right";
  }

  return "left";
} // Get the input field


var input = document.getElementById("msg-input"); // Execute a function when the user releases a key on the keyboard

input.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    //event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("msg-send-btn").click();
  }
});

function new_chat(user, link) {
  recive_user = user.split(",");
  recive_user_id = recive_user[0].replace(/\D/g, ''); //split non numeric

  recive_user_name = recive_user[1].slice(2, -1);
  profile_pic = recive_user[2].slice(2, -1);
  type = recive_user[3].slice(2, -2);
  socket.emit("new_msg", {
    msg: "",
    type: type,
    userid: recive_user_id
  }); // Send empty message.
  // Add icon and chat.

  var new_chat_icon = "<div class='chat-icon' title='" + recive_user_name + "' onclick='openChat(this)' style='background-image: url(/static/pics/profiles/" + profile_pic + ");'> \
                         <span>" + recive_user_name[0] + "</span> \
                            <input type='hidden' value='" + type + "' name='type'> \
                            <input type='hidden' value='" + recive_user_id + "' name='user_id'> \
                         </div>";
  new_chat_icon = $.parseHTML(new_chat_icon);
  var add_chat = $("#chat-icon-new");
  $(new_chat_icon).insertBefore(add_chat);
  $(".chats-users").hide();
  $(link.parentElement).hide();
  $(new_chat_icon).click();
}

$("#msg-send-btn").click(function new_msg() {
  var msg = $("#msg-input").val();
  var file = document.getElementById("add-attachment").files[0];

  if (!msg) {
    return;
  }

  var type = $("#to").val();
  var userid = $("#to-user-id").val();

  if (!file) {
    socket.emit("new_msg", {
      msg: msg,
      type: type,
      userid: userid
    });
  } else {
    socket.emit("new_msg", {
      msg: msg,
      type: type,
      userid: userid,
      filename: file.name,
      file: file
    });
  }

  document.getElementById("add-attachment").value = "";
  document.getElementById("msg-input").value = "";
  $(".chat-file").hide();
});

function build_msg(messages) {
  console.log("in build msg");

  for (i = 0; i < messages.length; i++) {
    if (messages[i]["content"]) {
      if ("file_path" in messages[i]) {
        msg = '<div class="message" style=float:' + change_float(messages[i]["sender"]) + '><div id="sender" class="sender">' + messages[i]["sender"] + '</div><div id="date" class="date">' + messages[i]["date"] + '</div><div id="content" class="content">' + messages[i]["content"] + '<form action="/download_chat_file" id="download-file-form-' + messages[i]["file_path"] + '" method="GET"><input type="hidden" name="file_name" value="' + messages[i]["file_path"] + '"><a href="#" onclick="javascript:document.getElementById(' + "'download-file-form-" + messages[i]["file_path"] + "'" + ').submit()" class="file-attach"><i class="fa fa-download"></i><span class="filename">' + messages[i]["file_path"].split("/").pop() + '</span></a></form></div></div><br>';
      } else {
        msg = '<div class="message" style=float:' + change_float(messages[i]["sender"]) + '><div id="sender" class="sender">' + messages[i]["sender"] + '</div><div id="date" class="date">' + messages[i]["date"] + '</div><div id="content" class="content">' + messages[i]["content"] + '</div></div><br>';
      }

      document.getElementById("messages").innerHTML += msg;
    } else if (messages[i]["leave_group"]) {
      document.getElementById("messages").innerHTML += messages[i]["leave_group"];
    }
  }
}

function user_left_group(msg, group_id) {
  var sector_id = document.getElementsByClassName("current")[0].querySelectorAll("input")[1].value; // sender userid

  if (group_id == sector_id) {
    document.getElementById("messages").innerHTML += msg;
  }

  new_msgs.push({
    "leave_group": msg
  });
}

function add_new_msg(msg, type, recive_username, sender_username, recive_id, sender_id) {
  if (msg["content"] == "") {
    return;
  }

  if (msg["file_path"]) {
    new_msg = '<div class="message" style=float:' + change_float(msg["sender"]) + '><div id="sender" class="sender">' + msg["sender"] + '</div><div id="date" class="date">' + msg["date"] + '</div><div id="content" class="content">' + msg["content"] + '<form action="/download_chat_file" id="download-file-form-' + msg["file_path"] + '" method="GET"><input type="hidden" name="file_name" value="' + msg["file_path"] + '"><a href="#" onclick="javascript:document.getElementById(' + "'download-file-form-" + msg["file_path"] + "'" + ').submit()" class="file-attach"><i class="fa fa-download"></i><span class="filename">' + msg["file_path"].split("/").pop() + '</span></a></form></div></div><br>';
  } else {
    new_msg = '<div class="message" style=float:' + change_float(msg["sender"]) + '><div id="sender" class="sender">' + msg["sender"] + '</div><div id="date" class="date">' + msg["date"] + '</div><div id="content" class="content">' + msg["content"] + '</div></div><br>';
  }

  var sector = document.getElementsByClassName("current")[0].title; //this is sender username

  var sector_id = document.getElementsByClassName("current")[0].querySelectorAll("input")[1].value; // sender userid

  if (type == "All") {
    // all msg
    if (sector == "All") {
      // if current tab of user is All ==> add msg
      document.getElementById("messages").innerHTML += new_msg;
    } //else{ // else push it to array


    new_msgs.push({
      "msg": msg,
      type: "All"
    }); //}
  } else if (type == "groups") {
    // group msg
    if (recive_id == sector_id) {
      // if the group_id of msg == id of current tab ==> add msg
      document.getElementById("messages").innerHTML += new_msg;
    } //else{  // else push it to array


    new_msgs.push({
      "msg": msg,
      type: "Group",
      id: recive_id
    }); // [msg, "group", group_id]
    //}
  } else {
    // private msg
    var current_id = document.getElementById("current_user_id").value;

    if (sender_id == current_id) {
      // if im the sender
      console.log("in first if");
      document.getElementById("messages").innerHTML += new_msg;
    } else if (sector == sender_username && sector_id == sender_id) {
      console.log("in sec if");
      document.getElementById("messages").innerHTML += new_msg;
    } //else{ // else push it to array


    console.log("in else");
    new_msgs.push({
      "msg": msg,
      type: "Private",
      id: sender_id
    }); // [msg,"private",sender_id]
    //}
  }
}

socket.on('message', function (msg) {
  var type_sender = msg[0][1];
  var sender_name = msg[0][3];
  to_type = msg[0][4]; //document.getElementById("to").value;

  var msg_type = msg[0][4];
  var date = msg[0][9];
  var content = msg[0][7];
  var recive_username = msg[0][6];
  var recive_id = msg[0][5];
  var sender_id = msg[0][2];
  var file_path = msg[0][12];
  console.log("socket on " + msg);

  if (file_path) {
    add_msg = build_obj_with_file(type_sender + "\\" + sender_name, date, content, file_path);
  } else {
    add_msg = build_obj(type_sender + "\\" + sender_name, date, content);
  }

  add_new_msg(add_msg, msg_type, recive_username, sender_name, recive_id, sender_id);
  var element = document.getElementById("messages");
  element.scrollTop = element.scrollHeight;

  if (to_type == "All") {
    var chat_type = "all-chats";
  } else if (to_type == "group") {
    var chat_type = "group-chats";
  } else {
    var chat_type = "private-chats";
  }

  console.log("in socet on");
  console.log(add_msg);
  console.log(chat_type);
  parse_chat(chat_type, msg);
});

function parse_chat(chat_type, msg) {
  console.log("parse ", msg);
  chat_msg = ", (";

  for (var i = 0; i < msg[0].length; i++) {
    if (typeof msg[0][i] == "string") {
      chat_msg += "'" + String(msg[0][i]) + "'";
    } else if (typeof msg[0][i] == "number") {
      chat_msg += String(msg[0][i]);
    } else {
      chat_msg += "None";
    }

    if (i < msg[0].length - 1) {
      chat_msg += ", ";
    }
  }

  console.log("this is chat msg", chat_msg);
  var chats = document.getElementById(chat_type).value;
  chats = chats.split(")");
  chats.splice(chats.length - 1, 0, chat_msg);
  chats = chats.join(")");
  console.log(chats);
  document.getElementById(chat_type).value = chats;
}

function change_profile_pic() {
  var profile_pic = document.getElementById("upload-file-pic").files[0];
  var ext = profile_pic.name.split(".").pop();
  socket.emit("update_profile_pic", {
    profile_pic: profile_pic,
    ext: ext
  });
  location.href = '/chats?settings=1';
}

function hide_chats(user, type, obj) {
  user_info = user.split(",");
  var recive_user_id = user_info[0].slice(1);
  action = obj.querySelectorAll("i")[0].className;

  if (action == "fa fa-eye") {
    action = 0;
    $chatIcon = $(".user-chat-" + type + "-" + recive_user_id).parent();

    if ($chatIcon.hasClass("current")) {
      $(".all-chat").click();
    }

    $chatIcon.hide();
  } else {
    action = 1;
    $(".user-chat-" + type + "-" + recive_user_id).parent().show();
  }

  socket.emit("change_chat_state", {
    user_id: recive_user_id,
    type: type,
    action: action
  }); // Send empty message.
}

$("#add-attachment").change(function () {
  $(".chat-file-name").html($(this).val());
  $(".chat-file").show();
});

function removeChatFile(curr) {
  $(curr.parentElement.parentElement).find("#add-attachment").val("");
  curr.parentElement.remove();
}

function resetMembers() {
  var reds = $(".members-box").find(".optgroup-1");
  var blues = $(".members-box").find(".optgroup-2");

  for (var i = 0; i < reds.length; i++) {
    if ($(reds[i]).hasClass("selected")) {
      $(reds[i]).find("a").click();
    }
  }

  for (var i = 0; i < blues.length; i++) {
    if ($(blues[i]).hasClass("selected")) {
      $(blues[i]).find("a").click();
    }
  }
}

function setMembers() {
  var members = $(".selected-group-members").val();
  members = members.replaceAll('(', '[');
  members = members.replaceAll(')', ']');
  members = members.replaceAll('\'', '"');
  members = JSON.parse(members);
  $(".dropdown-toggle").click();
  resetMembers();
  var reds = $(".members-box").find(".optgroup-1");
  var blues = $(".members-box").find(".optgroup-2");

  for (var i = 0; i < members.length; i++) {
    if (members[i][0] == 'red') {
      $(reds[members[i][1]]).find("a").click();
    } else {
      $(blues[members[i][1]]).find("a").click();
    }
  }
}

$(".icon-name-group").click(function () {
  var imagePath = $(this).find(".image").css("background-image");
  $(".icon-group").find(".image").css("background-image", imagePath);
  $(".icon-group").find(".name").text($(this).find(".name").text());
  $(".icon-group").find(".group-id").val($(this).find(".group-id").val());
  $(".icon-group").find(".group-members").val($(this).find(".group-members").val());
  owner_id = $(this).find(".owner-id").val();
  $(".icon-group").find(".owner-id").val(owner_id);
  owner_type = $(this).find(".owner-type").val();
  $(".icon-group").find(".owner-type").val(owner_type);
  $(".update-members").show();
  $(".user-icon").hide();
  $(".icon-group").show();
  $(".group-name-input").hide();
  $(".group-buttons").show();
  $(".save-new-group").hide();
  $(".exit-group").show();

  if (owner_type == "blue" && owner_id == user_id) {
    $(".delete-group").show();
    $(".group-name-edit").click(function () {
      $name = $(this);
      $name.hide();
      $(".group-name-input").val($name.text());
      $(".group-name-input").show();
      $(".group-name-input").focus();
      $(".group-name-input").focusout(function () {
        var group_id = $(".selected-group-id").val();
        var newName = $(".group-name-input").val();
        $name.text(newName);
        $name.show();
        $(this).hide();
        socket.emit("edit_group_name", {
          group_id: group_id,
          new_group_name: newName
        });
      });
    });
  } else {
    $(".delete-group").hide();
    $(".group-name-edit").off("click");
  }

  setMembers();
});
$(".new-icon-name-group").click(function () {
  $(".selected-group-id").val("");
  $(".selected-group-members").val("[]");
  $(".icon-group").find(".image").css("background-image", "none");
  $(".icon-group").find(".image").css("background-color", "rgba(236, 237, 240, 0.05)");
  $(".group-name-input").show();
  $(".group-name-input").val("New Group");
  $(".group-name-input").focus();
  $(".save-new-group").show();
  $(".exit-group").hide();
  $(".delete-group").hide();
  $(".update-members").hide();
  setMembers();
  $($(".members-box").find(".optgroup-2")[user_id]).find("a").click();
});

function backToUser() {
  $(".icon-group").hide();
  $(".group-buttons").hide();
  $(".user-icon").show();
  $(".group-name-input").hide();
  $(".delete-group").hide();
}

function exitGroup() {
  var groupId = $(".selected-group-id").val();
  $("#group-" + groupId).hide();
  $("#group-chat-icon-" + groupId).hide();
  backToUser();
  socket.emit("leave_group", {
    group_id: groupId
  });
}

function saveNewGroup() {
  var group_name = $(".group-name-input").val();
  var users = $(".selectpicker").val();
  console.log("this is users ==> ", users);
  socket.emit("add_group", {
    group_name: group_name,
    users: users
  });
  location.reload();
}

function deleteGroup() {
  var group_id = $(".selected-group-id").val();

  if (!confirm('This will Permanently delete this group. Do you wish to continue?')) {
    return;
  } else {
    socket.emit("delete_group", {
      group_id: group_id
    });
  }
}

function change_group_pic() {
  var id = $(".selected-group-id").val();
  var profile_pic = document.getElementById("upload-group-pic").files[0];
  console.log(profile_pic);
  var ext = profile_pic.name.split(".").pop();

  if (id) {
    socket.emit("update_group_profile_pic", {
      profile_pic: profile_pic,
      ext: ext,
      group_id: id
    });
    location.href = '/chats?settings=1';
  } else {
    alert("Please Change group icon after creating the group.");
  }
}

var members;
$(".members-group").click(function (e) {
  $box = $(".padder");
  $(".padder").show();
  $box.css({
    top: e.pageY,
    left: e.pageX
  });
  members = Array();
  $("#members-select").change(function () {
    members = $(this).val();
  });
});
$(".padder").mouseover(function (e) {
  $(".padder").show();
});
$(".padder").mouseout(function () {
  $(".padder").hide();
});
$(".update-members").click(function () {
  console.log("users updated");
  $(".padder").hide();
  var group_id = $(".selected-group-id").val();
  console.log("groupid: ", group_id);

  if (members.length == 0) {
    return;
  }

  console.log("members: ", members);
  socket.emit("update_group_users", {
    group_id: group_id,
    users: members
  });
});
socket.on('on_leave_group', function (details) {
  //details["group_id"]
  //details["member_type"]
  //details["user_id"]
  //details["username"] // This needs to be username.
  // Left the group.
  new_msg = '<div class="message user-left" style=float:left><span class="username">' + details["username"] + '</span> has left the group</div><br>';
  user_left_group(new_msg, details["group_id"]); // Kicked out of the group.
  //new_msg = '<div class="message user-left" style=float:left><span class="kicker">' + details["kicker"] + '</span> has kicked <span class="username">' + details["username"] + '</span> from the group</div><br>'
});
socket.on('on_add_group', function (details) {
  console.log("Added new group !", details); // Do actions here to add the group in front end ! (in shared groups)
  // details["group_info"]
});
socket.on('on_update_group_users', function (details) {
  console.log("group_updated ! current users ==> ", details); //$(".selected-group-members").val(details["users"])
  // update here the list group of users ==> 
  // still needs refresh to save changes
  // details["group_id"], details["users"]
});
socket.on('on_edit_group_name', function (details) {
  var group_id = details["group_id"];
  var newName = details["new_group_name"]; // Change name on chats settings

  $("#group-" + group_id).find(".name").text(newName); // Change name on group chat

  var groupChat = $("#group-chat-icon-" + group_id)[0];
  groupChat.title = newName;

  if ($(groupChat).hasClass("current")) {
    $(groupChat).find("span").text(newName);
  } else {
    $(groupChat).find("span").text(newName[0]);
  }
});
socket.on('on_group_delete', function (details) {
  backToUser();
  document.getElementById("group-" + details["group_id"]).remove();
  document.getElementById("group-chat-icon-" + details["group_id"]).remove();
});