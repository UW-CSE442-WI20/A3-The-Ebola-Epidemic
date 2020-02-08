const d3 = require('d3');
let filters2014 = drawNewData("dec-2014");
drawNewData("may-2015");
drawNewData("apr-2016");
// Add gender text
d3.select(".selectors")
    .append("text")
    .text("gender");

function drawNewData(date) {
    d3.json(`https://raw.githubusercontent.com/UW-CSE442-WI20/A3-the-ebola-epidemic/master/data/${date}.json`).then((data) => {
        // sum of total males and females confirmed and probable cases (cumulative)
        // note: remove whitespace for large numbers (eg. 10 502)
        males = (data.fact[15].Value).replace(/\s+/g, '');
        females = (data.fact[16].Value).replace(/\s+/g, '');
        var totalPeople = parseInt(males) + parseInt(females);
        drawCircles(totalPeople);
        console.log("Hi" + parseInt(males));
        return [parseInt(males), parseInt(females)];
    });
}

function filterGender() {
    d3.selectAll("circle").on('click', function () {
        d3.select(this).style("fill", "red");
    });

    console.log("Filters 2014" + filters2014);
}

function drawCircles(totalPeople) {
    // height of container based on people per row and height of dot
    var svgContainer = d3.select(".visual")
        .append("svg")
        .attr("width", 700)
        .attr("height", totalPeople / 2300 * 36);

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

    filterGender();
}
