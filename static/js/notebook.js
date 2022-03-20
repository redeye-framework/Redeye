socket.on('updateNoteName', function(details) {
    console.log(details);
});


$(".notebooks .name").keypress(function(e) {
    newChar = String.fromCharCode(e.which);
    currentChar = $(this).find("input").val();
    newName = currentChar.concat(newChar);
    socket.emit("updateNoteName", {
        noteId: 1,
        data: newName
    });
    console.log("After emit")
})