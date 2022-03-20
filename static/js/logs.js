$(document).ready(function() {
        console.log(parse_logs());
        var items = parse_logs();
        $('#timeline-container-force-position').timelineMe({
            items
        });
    $('#timeline-collapse-button').on('click', function() {
    $('#timeline-container-force-position').timelineMe('collapse', 'toggle');
    });
});

function parse_logs(){
    var lst_items = []
    var objects = document.getElementById("objects");
    var log = document.getElementById("logs");
    var len_logs = document.getElementById("len_logs");
    var day = document.getElementById("day");
    var years = document.getElementById("years");
    var lst_logs = logs.value.split("(");
    var lst_objs = objects.value.split("[").slice(1);
    for (var i = 1; i <= len_logs.value; i++){
        details_log = lst_logs[i].split(",");
        details_obj = lst_objs[i].split(",");
        console.log("current log" + details_log);
        console.log("current obj" + details_obj);
        var log_name = details_log[7].slice(2,-1);
        var date = details_log[8].slice(2,-1);
        var time = details_log[9].slice(2,-1);
        var exec = details_log[11].slice(2,-2);
        if (details_log[7].includes("User")){
            var user_name = details_obj[3].slice(2,-1);
            var password = details_obj[4].slice(2,-1);
            var type = get_user_type(details_obj[2])
            var content = "UserName: " + user_name + "</br>Password: " + password + "</br>Type: " + type;
            item = build_item(content,log_name,time,exec,date,i);
            lst_items.push(item);
        }
        if (details_log[7].includes("Task")){
            var taskname = details_obj[2].slice(2,-1);
            var data = details_obj[5].slice(2,-1);
            var exec = details_obj[4].slice(2,-1);
            var content = "Taskname: " + taskname + "</br>Data: " + data + "</br>Exec: " + exec;
            item = build_item(content,log_name,time,exec,date,i);
            lst_items.push(item);
        }
        if (details_log[7].includes("Server")){
            var server_ip = details_obj[2].slice(2,-1);
            var name = details_obj[3].slice(2,-1);
            var vendor = details_obj[4].slice(2,-1);
            var content = "Server ip: " + server_ip + "</br>Name: " + name + "</br>Vendor: " + vendor;
            item = build_item(content,log_name,time,exec,date,i);
            lst_items.push(item);
        }
        if (details_log[7].includes("Netdevice")){
            var device_ip = details_obj[2].slice(2,-1);
            var type = details_obj[3].slice(2,-1);
            var description = details_obj[4].slice(2,-1);
            var content = "Device ip: " + device_ip + "</br>Type: " + type + "</br>Description: " + description;
            item = build_item(content,log_name,time,exec,date,i);
            lst_items.push(item);
        }
        if (details_log[7].includes("Vulln")){
            var name = details_obj[2].slice(2,-1);
            var data = details_obj[3].slice(2,-1);
            var fix = details_obj[4].slice(2,-1);
            var content = "Vulnerability name: " + device_ip + "</br>Data: " + data + "</br>Fix: " + fix;
            item = build_item(content,log_name,time,exec,date,i);
            lst_items.push(item);
        }
        if (details_log[7].includes("File")){
            var name = details_obj[2].slice(2,-1);
            var path = details_obj[3].slice(2,-1);
            var description = details_obj[4].slice(2,-1);
            var content = "File Name: " + name + "</br>Path: " + path + "</br>Description: " + description;
            item = build_item(content,log_name,time,exec,date,i);
            lst_items.push(item);
        }
    }
    return(lst_items);
}

function build_item(content,title,time,exec,date,i) {
    item = { type: 'smallItem', label: date , shortContent: content, title: title, time:time, exec:exec, forcePosition: position(i) };
    return(item);
}

function position(i){
    if (i%2 == 0){
        return("right");
    }
    else{
        return("left");
    }
}

function get_user_type(type) {
    if (type == 1){
        return("Domain");
    }
    else if(type == 2){
        return("Localhost");
    }
    else if(type == 3){
        return("Application");
    }
    else if(type == 4){
        return("NetDevice");
    }
    else if(type == 5){
        return("Other");
    }
    else{
        return("Unknown");
    }
}