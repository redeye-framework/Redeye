
$(document).ready(function () {
    if (attacks_len) {
        $(".tablinks")[0].click();
    }
});

function changeCurrentTab(tab) {
    console.log($(tab).attr("id"));
    tablinks = $(".tablinks")
    for (var i = 0; i < tablinks.length; i++) {
        $(tablinks[i]).removeClass("current");
    }
    $(tab).addClass("current");
    $("#attack-current-name").val(tab.innerHTML);
    $("#attack-name-input").val(tab.innerHTML);
    $("#last-attack-name-input").val(tab.innerHTML);
    $("#tab-input").val($(tab).attr("id"));
    $("#flowchartworkspace").click();
}

function deleteAttack() {
    var attackName = $("#attack-current-name").val()
    if (confirm('This will Permanently delete the attack vector "' + attackName + '". Do you wish to continue?')) {
        $("#name-delete-attack").val($("#attack-current-name").val());
        $("#delete-attack-form").submit();
    }
}

function addHexValue(c1, c2) {
    var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
    return hexStr;
}

function decHexValue(c1, c2) {
    var hexStr = (parseInt(c1, 16) - parseInt(c2, 16)).toString(16);
    return hexStr;
}

var clicked = 0;
$(".dot").click(function (){
    checked = this;
    counter = 0;
    check = true;
    r = 48;
    g = 192;
    b = 0;
    $(this).parent().children(".dot").each(function(){
        if (check) {
            this.style.backgroundColor = "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + ", 1)";
            if(r < 180) {
                r += 40;
            } else {
                g -= 20;
            }
            counter += 1;
        } else {
            this.style.backgroundColor = "rgba(110, 110, 110, 1)";
        }
        if(checked.id == this.id){
            check = false;
        }
    });
    $(this).parent().children("input").val(counter);
    clicked = 1;
});

var prevColor = [];
$(".dot").mouseover(function (){
    checked = this;
    counter = 0;
    check = true;
    r = 48;
    g = 192;
    b = 0;
    clicked = 0;
    prevColor = [];
    $(this).parent().children(".dot").each(function(){
        prevColor.push(this.style.backgroundColor)
        if (check) {
            console.log(this.style.backgroundColor)
            if (this.style.backgroundColor == "rgb(110, 110, 110)"){
                this.style.backgroundColor = "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + ", 0.5)";
            } 
            counter += 1;
        } else {
            if (this.style.backgroundColor != "rgb(110, 110, 110)"){
                this.style.backgroundColor = "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + ", 0.5)";
            } else {
                this.style.backgroundColor = "rgba(110, 110, 110, 1)";
            }
        }
        if(checked.id == this.id){
            check = false;
        }
        if(r < 180) {
            r += 40;
        } else {
            g -= 20;
        }
    });
}).mouseout(function (){
    if (clicked == 0){
        $(this).parent().children(".dot").each(function(){
            this.style.backgroundColor = prevColor.shift();
        });
    }
    clicked = 0;
})

$(".tablinks").click(function(){
    val = JSON.parse(this.value);
    $(".severity .dot").toArray()[val["severity"] - 1].click()
    $(".plausibility .dot").toArray()[val["plausibility"] - 1].click()
    $(".risk .dot").toArray()[val["risk"] - 1].click()
});

/*
$(window).bind('beforeunload', function(){
    return 'Are you sure you want to leave?';
  });
*/