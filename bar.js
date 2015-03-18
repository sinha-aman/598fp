/**
 * Created by Aman on 2/9/15.
 */
function bar () {

    var margin = {top: 75, right: 100, bottom: 30, left: 60},
        width = 900 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var generate = 0;
    var dataset = null;

    // Create Tool Tip for Bar chart
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>Naturalized:</strong> <span style='color:white'>" + d.value + "</span> <br> <br>Category: " + d.name;
        })
// Define Scales

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var	x = d3.scale.linear().range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var y1 = d3.scale.linear()
        .range([height, 0]);

    //Define Colors
    var color = d3.scale.ordinal()
        .range(["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"]
    );


    // Define X Axis

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

// Define Y axis left

    var yAxisLeft = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(""));

// Define Y axis right
    var	yAxisRight = d3.svg.axis()
        .scale(y1)
        .orient("right")
        .tickFormat(d3.format(""));

// Define 'div' for tooltips
    var div = d3.select("body")
        .append("div")  // declare the tooltip div
        .attr("class", "tooltip")              // apply the 'tooltip' class
        .style("opacity", 0);

    // Define svg

    var svg = d3.select("#bar").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id","bar-svg")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   svg.call(tip);

    d3.csv("countriesRand.csv", update);


    function update(error, data) {

        var countryNames = d3.keys(data[0]).filter(function (key) {
            return key !== "Year" && key!=="Population" && key!="gdp" && key!="Label";
        });

        var filterData = function(inputData,countryName) {
            return inputData.map(function (d) {
                if (d.hasOwnProperty(countryName)) {
                    var obj = {};
                    obj[countryName] = d[countryName];
                    obj['Year'] = d.Year;
                    obj['gdp'] = d.gdp;
                    return obj;
                }
            });
        };

        // Define the GDP line
        var	valueLine = d3.svg.line()
            .x(function(d) { return x0(d.Year)+17 })
            .y(function(d) { return y1(d.gdp) });

        data.forEach(function (d) {
            d.country = countryNames.map(function (name) {
                return {name: name, value: +d[name]};

            });
            d.gdp = +d.gdp;
        });

        if (generate === 0) {
            d3.select('#div1')
                .attr("background-color","black")
                .attr("font-color","white")
                .append("select")
                .selectAll("option")
                .data(countryNames)
                .enter()
                .append("option")
                .attr("value", function (d) {
                    return d;
                })
                .text(function (d) {
                    return d;
                });
            dataset = data;
            generate = 1;


            update(error, filterData(data,'Total'));

        }

        x0.domain(data.map(function (d) {
            return d.Year;
        }));

        x1.domain(countryNames).rangeRoundBands([0, x0.rangeBand()]);

        x.domain(d3.extent(data, function(d) { return d.Year; }));

        y.domain([0, d3.max(data, function (d) {
            return d3.max(d.country, function (d) {
                return d.value;
            });
        })]);

        y1.domain([0, d3.max(data, function (d) { return d.gdp; }) ]);




        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //resetting the y axis
        svg.select(".y.axis.left").remove();
        svg.append("g")
            .attr("class", "y axis left")
            .call(yAxisLeft)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Count");

        //resetting the y axis
        //svg.select(".y.axis.right").remove();
        svg.append("g")
            .attr("class", "y axis right")
            .attr("transform", "translate(" + width + " ,0)")
            .style("fill", color)
            .call(yAxisRight)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 56)

            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("GDP Per Capita");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", function() {
                return "rotate(0)"
            })
            .attr("margin-top","30");


        var Year = svg.selectAll(".Year")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + x0(d.Year) + ",0)";
            });

        var chartData = Year.selectAll("rect")
            .data(function (d) {
                return d.country;
            })
            ;
        chartData
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("class", "chartData")
            .attr("id", "chartData")
            .attr("y", height )
            .attr("height", 0)

        chartData.transition()
            .delay(function (d,i){return i*10;})
            .duration(1500)
            .attr("y",function (d) {
                return y(d.value);
            })
            .attr("height",function (d) {
                return height - y(d.value);
            })
            .style("fill", function (d) {
                return color(d.name);
            })

        chartData.on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        svg.append("path")
            .attr("class", "line")
            .attr("d", valueLine(dataset))


//
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 5)
            .attr("cx", function(d) { return x0(d.Year)+17; })
            .attr("cy", function(d) { return y1(d.gdp); })

            .on("mouseover", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div	.html(
                    '<a href= "http://google.com">' + // The first <a> tag
                    d.gdp +
                    "</a>" +                          // closing </a> tag
                    "<br/>"  + d.Year)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            });

//


        d3.select('select')
            .on("change", function () {
                var countryName = this.options[this.selectedIndex].__data__;
                var filtered = filterData(dataset, countryName);
                console.log(countryName);
                if (countryName !== "Total"){
                    $("circle").css("opacity","0");
                    $("#"+countryName).css("opacity","1");
                    $("#"+countryName).css("fill","red");
                    $("#"+countryName).css("stroke","red");


                }
                else{
                    $("circle").css("opacity","0.7");
                    $("circle").css("color","steelblue");
                    $("circle").css("stroke","white");
                 }

                d3.selectAll(".chartData").remove();
                update(error, filtered);

            });
    }


}