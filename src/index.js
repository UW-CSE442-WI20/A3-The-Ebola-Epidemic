const d3 = require('d3');

var svgContainer = d3.select(".visual")
                        .append("svg")
                        .attr("width", 700)
                        .attr("height", 200);
var xCoord = 30;
var yCoord = 30;
for (var i = 0; i < 8000; i += 100) {
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
