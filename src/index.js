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

        guinea = parseInt((data.fact[0].Value).replace(/\s+/g, '')) + parseInt((data.fact[1].Value).replace(/\s+/g, ''));
        liberua = parseInt((data.fact[5].Value).replace(/\s+/g, '')) + parseInt((data.fact[6].Value).replace(/\s+/g, ''));
        sierraLeone = parseInt((data.fact[10].Value).replace(/\s+/g, '')) + parseInt((data.fact[11].Value).replace(/\s+/g, ''));

        var totalPeople = parseInt(males) + parseInt(females);
        var parsedData = [totalPeople, parseInt(males), parseInt(females), parseInt(agegrp014), parseInt(agegrp1544), parseInt(agegrp45), guinea, liberua, sierraLeone];
        drawCircles(parsedData, date);
    });
}

// Filters by gender for the given classname (based on outbreak year)
function filterGender(classname, males, females) {
    var circles = d3.selectAll("."+classname);
    circles.each(function(d,i){
        if (i < males / CIRCLE_NUM) {
            d3.select(this).style("fill", "blue");
        } else if (i >= (males / CIRCLE_NUM) && i < ((males + females) / CIRCLE_NUM)) {
            d3.select(this).style("fill", "pink");
        }
    });
}

function colorLegend(filterType) {
    var svgContainer = d3.select("#colors").append("svg")
    var legendLabels;
    var circleColors;
    if (filterType == "gender" ) {
        legendLabels = ["Male", "Label"];
        circleColors = ["blue", "pink"];
        svgContainer.attr("width", 100).attr("height", 80);
    } else if (filterType == "agegrp" ) {
        legendLabels = ["Age Group 0-14", "Age Group 14-55", "Age Group 45+"];
        circleColors = ["#9e6ebd", "#7aa457", "#cb6751"];
        svgContainer.attr("width", 175).attr("height", 100);
    } else { // countries
        legendLabels = ["Guinea", "Liberua", "Sierra Leone"];
        circleColors = ["red", "blue", "green"];
        svgContainer.attr("width", 130).attr("height", 100);
    }

    var xCoord = 20;
    var yCoord = 30;

    for (var i = 0; i < legendLabels.length; i++) {
        var circle = svgContainer.append("circle")
        .attr("cx", xCoord)
        .attr("cy", yCoord)
        .attr("r", 8)
        .style("fill", circleColors[i]);

        var label = svgContainer.append("text")
            .text(legendLabels[i])
            .attr("x", xCoord + 15)
            .attr("y", yCoord + 5)
            .style("font-family", "Lato")
        
        yCoord += 30;
    }
}


function filterAgeGroup(classname, agegrp014, agegrp1544, agegrp45) {
    var circles = d3.selectAll("."+classname);
    circles.each(function(d,i){
        if (i < agegrp014 / CIRCLE_NUM) {
            d3.select(this).style("fill", "#9e6ebd");
        } else if (i >= (agegrp014/ CIRCLE_NUM) && i < ((agegrp014 + agegrp1544) / CIRCLE_NUM)) {
            d3.select(this).style("fill", "#7aa457");
        } else if (i >= ((agegrp014 + agegrp1544)/ CIRCLE_NUM) && i < ((agegrp1544 + agegrp014 + agegrp45) / CIRCLE_NUM)) {
            d3.select(this).style("fill", "#cb6751");
        }
    });
}

function filterCountries(classname, guinea, liberua, sierraLeone) {
    var circles = d3.selectAll("."+classname);
    circles.each(function(d,i){
        if (i < guinea / CIRCLE_NUM) {
            d3.select(this).style("fill", "red");
        } else if (i >= (guinea / CIRCLE_NUM) && i < ((liberua + guinea) / CIRCLE_NUM)) {
            d3.select(this).style("fill", "blue");
        } else if (i >= ((liberua + guinea) / CIRCLE_NUM) && i < ((liberua + guinea + sierraLeone) / CIRCLE_NUM)) {
            d3.select(this).style("fill", "green");
        }
    });
}

function clearFiltersAndColorLegend() {
    d3.selectAll("circle").style("fill", "gray");
    d3.select("#colors").html("");
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

    // console.log("males : " + parsedData[1]);
    // console.log("females : " + parsedData[2]);
    // console.log("total sex ct : " + ( parsedData[1] + parsedData[2]));

    

    // console.log("agegrp015 : " + parsedData[3]);
    // console.log("agegrp1544 : " + parsedData[4]);
    // console.log("agegrp45 : " + parsedData[5]);
    // console.log("total age ct: " + (parsedData[3] + parsedData[4] + parsedData[5]));


    // console.log("guinea : " + parsedData[6]);
    // console.log("liberua : " + parsedData[7]);
    // console.log("sierraLeone : " + parsedData[8]);
    // console.log("total countries ct : " + (parsedData[6] + parsedData[7] + parsedData[8]));



    d3.select("#gender").on("click", function() {
        clearFiltersAndColorLegend();
        filterGender("dec-2014", parsedData[1], parsedData[2]);
        filterGender("may-2015", parsedData[1], parsedData[2]);
        filterGender("apr-2016", parsedData[1], parsedData[2]);
        colorLegend("gender");
        
    });
    d3.select("#age-group").on("click", function() {
        clearFiltersAndColorLegend();
        filterAgeGroup("dec-2014", parsedData[3], parsedData[4], parsedData[5]);
        filterAgeGroup("may-2015", parsedData[3], parsedData[4], parsedData[5]);
        filterAgeGroup("apr-2016", parsedData[3], parsedData[4], parsedData[5]);
        colorLegend("agegrp");
    });
    d3.select("#countries").on("click", function() {
        clearFiltersAndColorLegend();
        filterCountries("dec-2014", parsedData[6], parsedData[7], parsedData[8]);
        filterCountries("may-2015", parsedData[6], parsedData[7], parsedData[8]);
        filterCountries("apr-2016", parsedData[6], parsedData[7], parsedData[8]);
        colorLegend("countries");
    });
    d3.selectAll("button").on("click", function() {
        clearFiltersAndColorLegend();
        d3.select("#gender").property('checked', false);
        d3.select("#age-group").property('checked', false);
        d3.select("#countries").property('checked', false);
    });
}

