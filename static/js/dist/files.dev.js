"use strict";

// Trigger action when the contexmenu is about to be shown
var el = null;
$(document.getElementsByTagName("button")).bind("contextmenu", function (event) {
  el = this; // Avoid the real one

  event.preventDefault(); // Show contextmenu

  $(".custom-menu").finish().toggle(100). // In the right position (the mouse)
  css({
    top: event.pageY + "px",
    left: event.pageX + "px"
  });
}); // If the document is clicked somewhere

$(document).bind("mousedown", function (e) {
  // If the clicked element is not the menu
  if (!$(e.target).parents(".custom-menu").length > 0) {
    // Hide it
    $(".custom-menu").hide(100);
  }
}); // If the menu element is clicked

$(".custom-menu li").click(function () {
  // This is the triggered action name
  switch ($(this).attr("data-action")) {
    // A case for each action. Your actions here
    case "Rename":
      this.replaceChild(in1, child);
      break;

    case "Delete":
      delete_file(el.value);
      el.remove();
      break;

    case "Download":
      download_file(el.value);
      break;
  } // Hide it AFTER the action was triggered


  $(".custom-menu").hide(100);
});

function delete_file(path) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "delete_file_from_dir" + "?" + "path=" + path);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function download_file(path) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "files" + "?" + "file_name=" + path);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}