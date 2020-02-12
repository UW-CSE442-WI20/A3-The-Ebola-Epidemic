const d3 = require('d3');
const dec2014Data = require('../data/dec-2014.json');
const may2015Data = require('../data/may-2015.json');
const apr2016Data = require('../data/apr-2016.json');
const genderColors = ["#4682b4", "#db7093"];
const ageColors = ["#9e6ebd", "#7aa457", "#cb6751"];
const countryColors = ["#ffa600", "#bc5090", "#374c80"];

let CIRCLE_NUM = 100;

let parsedData2014 = drawNewData(dec2014Data, "dec-2014");
let parsedData2015 = drawNewData(may2015Data, "may-2015");
let parsedData2016 = drawNewData(apr2016Data, "apr-2016");
listeners();

function drawNewData(data, date) {
    // sum of total males and females confirmed and probable cases (cumulative)
    // note: remove whitespace for large numbers (eg. 10 502)
    males = (data.fact[15].Value).replace(/\s+/g, '');
    females = (data.fact[16].Value).replace(/\s+/g, '');
    agegrp014 = (data.fact[17].Value).replace(/\s+/g, '');
    agegrp1544 = (data.fact[18].Value).replace(/\s+/g, '');
    agegrp45 = (data.fact[19].Value).replace(/\s+/g, '');

    guinea = parseInt((data.fact[0].Value).replace(/\s+/g, '')) + parseInt((data.fact[1].Value).replace(/\s+/g, ''));
    liberia = parseInt((data.fact[5].Value).replace(/\s+/g, '')) + parseInt((data.fact[6].Value).replace(/\s+/g, ''));
    sierraLeone = parseInt((data.fact[10].Value).replace(/\s+/g, '')) + parseInt((data.fact[11].Value).replace(/\s+/g, ''));

    var totalPeople = parseInt(males) + parseInt(females);
    var parsedData = [totalPeople, parseInt(males), parseInt(females), parseInt(agegrp014), parseInt(agegrp1544), parseInt(agegrp45), guinea, liberia, sierraLeone];
    drawCircles(totalPeople, date);
    return parsedData;
}

function drawCircles(totalPeople, classname) {
    // height of container based on people per row and height of dot
    var date = d3.select(".visual")
        .append("div")
        .text(classname.toUpperCase().replace('-', ' '))
        .attr("class", "date")
    var svgContainer = d3.select(".visual")
        .append("svg")
        .attr("width", 700)
        .attr("height", totalPeople / 2300 * 36);

    var xCoord = 20;
    var yCoord = 20;
    totalPeople /= CIRCLE_NUM;
    for (var i = 0; i < totalPeople; i++) {
        var circle = svgContainer.append("circle")
            .attr("cx", xCoord)
            .attr("cy", yCoord)
            .attr("r", 8)
            .attr("class", classname)
            .style("fill", "gray");
        xCoord += 30;
        if (xCoord > 700) {
            yCoord += 30;
            xCoord = 20;
        }
    }
}

// Filters by gender for the given classname (based on outbreak year)
function filterGender(classname, males, females) {
    var circles = d3.selectAll("."+classname);
    circles.each(function(d,i){
        if (i < males / CIRCLE_NUM) {
            d3.select(this).classed("male", true);
        } else if (i >= (males / CIRCLE_NUM) && i < ((males + females) / CIRCLE_NUM)) {
            d3.select(this).classed("female", true);
        }
    });
    d3.selectAll('.male').transition().duration(700).style("fill", genderColors[0]);
    d3.selectAll('.female').transition().duration(700).style("fill", genderColors[1]);
}

function filterAgeGroup(classname, agegrp014, agegrp1544, agegrp45) {
    var circles = d3.selectAll("."+classname);
    circles.each(function(d,i){
        if (i < agegrp014 / CIRCLE_NUM) {
            d3.select(this).classed("age0-14", true);
        } else if (i >= (agegrp014/ CIRCLE_NUM) && i < ((agegrp014 + agegrp1544) / CIRCLE_NUM)) {
            d3.select(this).classed("age15-44", true);
        } else if (i >= ((agegrp014 + agegrp1544) / CIRCLE_NUM) && i < ((agegrp1544 + agegrp014 + agegrp45) / CIRCLE_NUM)) {
            d3.select(this).classed("age44-and-up", true);
        } else {
            d3.select(this).classed("other", true);
        }
    });
    d3.selectAll('.age0-14').transition().duration(700).style("fill", ageColors[0]);
    d3.selectAll('.age15-44').transition().duration(700).style("fill", ageColors[1]);
    d3.selectAll('.age44-and-up').transition().duration(700).style("fill", ageColors[2]);
    d3.selectAll('.other').transition().duration(700).style("fill", "gray");
}

function filterCountries(classname, guinea, liberia, sierraLeone) {
    var circles = d3.selectAll("."+classname);
    circles.each(function(d,i){
        if (i < guinea / CIRCLE_NUM) {
            d3.select(this).classed("guinea", true);
        } else if (i >= (guinea / CIRCLE_NUM) && i < ((liberia + guinea) / CIRCLE_NUM)) {
            d3.select(this).classed("liberia", true);
        } else if (i >= ((liberia + guinea) / CIRCLE_NUM) && i < ((liberia + guinea + sierraLeone) / CIRCLE_NUM)) {
            d3.select(this).classed("sierraLeone", true);
        }
    });
    d3.selectAll('.guinea').transition().duration(700).style("fill", countryColors[0]);
    d3.selectAll('.liberia').transition().duration(700).style("fill", countryColors[1]);
    d3.selectAll('.sierraLeone').transition().duration(700).style("fill", countryColors[2]);
}

function clearFilters() {
    d3.selectAll("circle").style("fill", "gray");
    d3.select("#colors").html("");
    d3.selectAll("input").property("checked", false);
}

function updateAge() {
    var options = [];
    var checked = []
    d3.selectAll(".subfilter-age").each(function(d){
      cb = d3.select(this);
      if(cb.property("checked")){
        options.push(cb.property("id"));
        checked.push(true);
      } else {
        options.push(cb.property("id"));
        checked.push(false);
      }
    });
    subfilter(options, checked, ageColors);
}

function updateGender() {
    var options = [];
    var checked = []
    d3.selectAll(".subfilter-gender").each(function(d){
      cb = d3.select(this);
      if(cb.property("checked")){
        options.push(cb.property("id"));
        checked.push(true);
      } else {
        options.push(cb.property("id"));
        checked.push(false);
      }
    });
    subfilter(options, checked, genderColors);
}

function updateCountry() {
    var options = [];
    var checked = []
    d3.selectAll(".subfilter-country").each(function(d){
      cb = d3.select(this);
      if(cb.property("checked")){
        options.push(cb.property("id"));
        checked.push(true);
      } else {
        options.push(cb.property("id"));
        checked.push(false);
      }
    });
    subfilter(options, checked, countryColors);
}

function subfilter(options, checked, colors) {
    options.forEach(function(d, i) {
        if (checked[i]) {
            d3.selectAll("." + d).style("fill", colors[i]);
        } else {
            d3.selectAll("." + d).style("fill", "gray");
        }
    });
}

function listeners() {
    d3.select("#gender").on("click", function() {
        d3.select("#subfilter-gender").style("visibility", "visible");
        d3.select("#subfilter-age").style("visibility", "hidden");
        d3.select("#subfilter-country").style("visibility", "hidden");
        d3.selectAll("input").each(function(d){
          if(d3.select(this).attr("type") == "checkbox")
            d3.select(this).node().checked = true;
        });
        filterGender("dec-2014", parsedData2014[1], parsedData2014[2]);
        filterGender("may-2015", parsedData2015[1], parsedData2015[2]);
        filterGender("apr-2016", parsedData2016[1], parsedData2016[2]);
    });
    d3.select("#age-group").on("click", function() {
        d3.select("#subfilter-age").style("visibility", "visible");
        d3.select("#subfilter-gender").style("visibility", "hidden");
        d3.select("#subfilter-country").style("visibility", "hidden");
        d3.selectAll("input").each(function(d){
          if(d3.select(this).attr("type") == "checkbox")
            d3.select(this).node().checked = true;
        });
        filterAgeGroup("dec-2014", parsedData2014[3], parsedData2014[4], parsedData2014[5]);
        filterAgeGroup("may-2015", parsedData2015[3], parsedData2015[4], parsedData2015[5]);
        filterAgeGroup("apr-2016", parsedData2016[3], parsedData2016[4], parsedData2016[5]);
    });
    d3.select("#countries").on("click", function() {
        d3.select("#subfilter-country").style("visibility", "visible");
        d3.select("#subfilter-gender").style("visibility", "hidden");
        d3.select("#subfilter-age").style("visibility", "hidden");
        d3.selectAll("input").each(function(d){
          if(d3.select(this).attr("type") == "checkbox")
            d3.select(this).node().checked = true;
        });
        filterCountries("dec-2014", parsedData2014[6], parsedData2014[7], parsedData2014[8]);
        filterCountries("may-2015", parsedData2015[6], parsedData2015[7], parsedData2015[8]);
        filterCountries("apr-2016", parsedData2016[6], parsedData2016[7], parsedData2016[8]);
    });
    d3.selectAll("button").on("click", function() {
        clearFilters();
    });
    d3.selectAll(".subfilter-age").on("change", updateAge);
    d3.selectAll(".subfilter-gender").on("change", updateGender);
    d3.selectAll(".subfilter-country").on("change", updateCountry);
}
