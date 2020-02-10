const d3 = require('d3');
let CIRCLE_NUM = 100;
drawNewData("dec-2014");
drawNewData("may-2015");
drawNewData("apr-2016");

function drawNewData(date) {
    d3.json(`https://raw.githubusercontent.com/UW-CSE442-WI20/A3-the-ebola-epidemic/master/data/${date}.json`).then((data) => {
        // sum of total males and females confirmed and probable cases (cumulative)
        // note: remove whitespace for large numbers (eg. 10 502)
        males = (data.fact[15].Value).replace(/\s+/g, '');
        females = (data.fact[16].Value).replace(/\s+/g, '');
        agegrp014 = (data.fact[17].Value).replace(/\s+/g, '');
        agegrp1544 = (data.fact[18].Value).replace(/\s+/g, '');
        agegrp45 = (data.fact[19].Value).replace(/\s+/g, '');
        var totalPeople = parseInt(males) + parseInt(females);
        var parsedData = [totalPeople, parseInt(males), parseInt(females), parseInt(agegrp014), parseInt(agegrp1544), parseInt(agegrp45)];
        drawCircles(parsedData, date);
    });
}

// Filters by gender for the given classname (based on outbreak year)
function filterGender(classname, males, females) {
    var circles = d3.selectAll("."+classname);
    circles.each(function(d,i){
        if (i < males / 100) {
            d3.select(this).style("fill", "blue");
        } else {
            d3.select(this).style("fill", "pink");
        }
    });
}

function filterAgeGroup(classname, agegrp014, agegrp1544, agegrp45) {
    var circles = d3.selectAll("."+classname);
    circles.each(function(d,i){
        if (i < agegrp014 / 100) {
            d3.select(this).style("fill", "#9e6ebd");
        } else if (i < agegrp1544 / 100) {
            d3.select(this).style("fill", "#7aa457");
        } else {
            d3.select(this).style("fill", "#cb6751");
        }
    });
}

function clearFilters() {
    d3.selectAll("circle").style("fill", "gray");
}

function drawCircles(parsedData, classname) {
    // height of container based on people per row and height of dot
    var svgContainer = d3.select(".visual")
        .append("svg")
        .attr("width", 700)
        .attr("height", parsedData[0] / 2300 * 36);

    var xCoord = 30;
    var yCoord = 30;
    for (var i = 0; i < parsedData[0]; i += CIRCLE_NUM) {
        var circle = svgContainer.append("circle")
            .attr("cx", xCoord)
            .attr("cy", yCoord)
            .attr("r", 8)
            .attr("class", classname)
            .style("fill", "gray");
        xCoord += 30;
        if (xCoord > 700) {
            yCoord += 30;
            xCoord = 30;
        }
    }

    d3.select("#gender").on("click", function() {
        filterGender("dec-2014", parsedData[1], parsedData[2]);
        filterGender("may-2015", parsedData[1], parsedData[2]);
        filterGender("apr-2016", parsedData[1], parsedData[2]);
    });
    d3.select("#age-group").on("click", function() {
        filterAgeGroup("dec-2014", parsedData[3], parsedData[4], parsedData[5]);
        filterAgeGroup("may-2015", parsedData[3], parsedData[4], parsedData[5]);
        filterAgeGroup("apr-2016", parsedData[3], parsedData[4], parsedData[5]);
    });
    d3.selectAll("button").on("click", function() {
        clearFilters();
    });
}
