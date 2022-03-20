

socket.on('project_created', function(details) {
    alert("Project: " + details["mission_id"] + " Created.");
    //document.reload();
});