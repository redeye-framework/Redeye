$(document).ready(function() {
    draw();
});


$(".submit-graph").click(function() {
    queryValue = document.getElementById("query").value;
    draw(query = queryValue)
})


function draw(query = "MATCH (n) RETURN n") {
    var viz;
    var config = {
        container_id: "RedeyeGraph",
        server_url: "bolt://localhost:7687",
        server_user: "neo4j",
        server_password: "redeye",
        labels: {
            "users": {
                caption: "username"
            },
            "servers": {
                caption: "name"
            }
        },

        initial_cypher: query,
        arrows: true,
        hierarchical_layout: true,
        hierarchical_sort_method: "directed"
    };

    viz = new NeoVis.default(config);
    viz.render();
}