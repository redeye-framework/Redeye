$(".box-part-result").click(function() {
    dataList = $(this).text().split("\n");
    dataList = dataList.map(function(el) {
        return el.trim();
    });
    type = dataList[3];
    if (type.includes("Server")) {
        redirectUrl = $(this).text().split("\n")[4].split(":")[1].replace(/\s/g, '');
        window.location.href = "/server?ip=" + redirectUrl;

    } else if (type.includes("User")) {
        window.location.href = "/all_users";

    } else if (type.includes("Task")) {
        window.location.href = "/tasks";

    } else if (type.includes("Achievement")) {
        window.location.href = "/stats";

    } else if (type.includes("Comment")) {
        window.location.href = "/";

    } else if (type.includes("File")) {
        filePath = $(this).text().split("\n")[7].split("-")[1].replace(/\s/g, '');
        window.location.href = "/files/?file_name=" + filePath;

    } else if (type.includes("Vullnerability")) {
        serverId = $(this).children()[1].getElementsByTagName("span")[0].id;
        window.location.href = "/server?id=" + serverId;

    } else if (type.includes("Report")) {
        window.location.href = "/pre_report";
    }
})