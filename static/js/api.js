
function createNewToken() {
    $(".create-token-box").css("display", "inline-block");
    $("#token-name-input").focus();
    this.addEventListener("keyup", function(event) {
        if (event.keyCode === 27) {
            $(".create-token-box").css("display", "none");
        }
    })
}