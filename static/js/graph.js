var viz;

$(document).ready(function() {
    draw();
});


$(".submit-graph").click(function() {
    queryValue = document.getElementById("query").value;
    if (queryValue == "") {
        draw()
    } else {
        draw(query = queryValue)
    }

})

$(".stabilize-graph").click(function() {
    viz.stabilize();
})


$(".modern-input").each(function() {
    this.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            queryValue = document.getElementById("query").value;
            if (queryValue == "") {
                draw()
            } else {
                draw(query = queryValue)
            }
        }
    })
})

$(".table").find("td:nth-child(2)").click(function() {
    queryValue = $(this).text();
    if (queryValue.includes("{}")) {

        value = prompt("Value:");
        queryValue = queryValue.replace("{}", value)
        draw(query = queryValue);

    } else {
        draw(query = queryValue);
    }
});

function draw(query = "MATCH relations=()-->() RETURN relations") {
    var config = {
        container_id: "RedeyeGraph",
        server_url: "bolt://localhost:7687",
        server_user: "neo4j",
        server_password: "redeye",
        labels: {
            "users": {
                caption: "username",
                "font": {
                    "size": 24,
                    "color": "black"
                },
                "image": 'static\\pics\\graph\\user.png'
            },
            "servers": {
                caption: "ip",
                "font": {
                    "size": 24,
                    "color": "black"
                },
                "image": 'static\\pics\\graph\\server.png'
            },
        },
        relationships: {
            "userTo": {
                caption: false,
                tickness: "weight",
            },
            [NeoVis.NEOVIS_DEFAULT_CONFIG]: {
                "thickness": "defaultThicknessProperty",
                "caption": "defaultCaption"
            }
        },
        initial_cypher: "MATCH (n)-[r:INTERACTS]->(m) RETURN n,r,m",

        initial_cypher: query,
        arrows: true,
        hierarchical_layout: true,
        hierarchical_sort_method: "directed"
    };

    viz = new NeoVis.default(config);
    viz.render();
}