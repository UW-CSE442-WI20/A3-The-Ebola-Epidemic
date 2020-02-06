const d3 = require('d3');

var totalPeople = 0;
d3.json("https://raw.githubusercontent.com/UW-CSE442-WI20/A3-the-ebola-epidemic/master/data/dec-2014.json").then((data) => {
    // sum of total males and females confirmed and probable cases (cumulative)
    totalPeople = parseInt(data.fact[15].Value) + parseInt(data.fact[16].Value);
    console.log(totalPeople);
    drawCircles();
});

function drawCircles() {
    var svgContainer = d3.select(".visual")
                            .append("svg")
                            .attr("width", 700)
                            .attr("height", 200);
    var xCoord = 30;
    var yCoord = 30;
    for (var i = 0; i < totalPeople; i += 100) {
        var circle = svgContainer.append("circle")
                                    .attr("cx", xCoord)
                                    .attr("cy", yCoord)
                                    .attr("r", 8)
                                    .style("fill", "gray");
        xCoord += 30;
        if (xCoord > 700) {
            yCoord += 30;
            xCoord = 30;
        }
    }
}
