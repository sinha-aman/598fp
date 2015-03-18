function map() {

    $(document).ready(function () {

        $("#slider").slider({
            value: 1820,
            min: 1820,
            max: 2000,
            step: 10,
            slide: function (event, ui) {
                var year = $("#year").val(ui.value);
                divblock(year[0].value);
                redraw(ui.value.toString());
            }
        });

        $("#year").val($("#slider").slider("value"));
        //$("#policy-year").val($("#slider").slider("value"));
        divblock('1820');


        var w = 1200;
        var h = 400;
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                console.log($("#year")[0].value);
                var q = $("#year")[0].value;
                return "<strong>Naturalized:</strong> <span style='color:white'>" + d[q] + "</span> <br> <br>Category: " + d["country"];

            })


        var xy = d3.geo.equirectangular()
            .scale(140)
            .rotate([-10,0]);


        var path = d3.geo.path()
            .projection(xy);

        var svg = d3.select("#map").append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("id","bubble-svg");

        svg.call(tip);

        var states = svg.append("svg:g")
            .attr("id", "states");

        var circles = svg.append("svg:g")
            .attr("id", "circles");

        var labels = svg.append("svg:g")
            .attr("id", "labels");

        d3.json("world-countries.json", function (collection) {
            states.selectAll("path")
                .data(collection.features)
                .enter().append("svg:path")
                .attr("d", path)
                /*.on("mouseover", function (d) {
                    d3.select(this).style("fill", "#6C0")
                        .append("svg:title")
                        .text(d.properties.name);
                })
                .on("mouseout", function (d) {
                    d3.select(this).style("fill", "#ccc");
                })*/
        });

        var scaleFactor = 1/20000;
        var alpha = 1; //Weight Factor
        var beta = 1000000; //Data will be brought near this value (Approximately the mid of the data range)

        d3.csv("countriesBubble.csv", function (csv) {

            circles.selectAll("circle")
                .data(csv)
                .enter()
                .append("svg:circle")
                .attr("cx", function (d, i) {
                    return xy([+d["longitude"], +d["latitude"]])[0];
                })
                .attr("cy", function (d, i) {
                    return xy([+d["longitude"], +d["latitude"]])[1];
                })
                .attr("r", function (d) {
                        //console.log(( 1-alpha )*( +d["1820"] ) + ( alpha * beta ) * scaleFactor);
                        //return ( ( 1-alpha )*( +d["1820"] ) + ( alpha * beta ) * scaleFactor );
                        return +d["1820"] * scaleFactor;

                })
                .attr("id", function (d) {
                    return d["country"];
                })

                .on("mouseover", function (d) {

                    d3.select(this).style("fill", "#FC0")
                    tip.show(d);

                })

                .on("mouseout", function (d) {
                    d3.select(this).style("fill", "steelblue");
                    tip.hide(d);
                })


            labels.selectAll("labels")
                .data(csv)
                .enter()
                .append("svg:text")
                .attr("x", function (d, i) {
                    return xy([+d["longitude"], +d["latitude"]])[0];
                })
                .attr("y", function (d, i) {
                    return xy([+d["longitude"], +d["latitude"]])[1];
                })
                .attr("dy", "0.3em")

        });

        function redraw(year) {
            circles.selectAll("circle")
                .transition()
                .duration(1000).ease("linear")
                .attr("r", function (d) {
                     return +d[year] * scaleFactor;
                })
                .attr("title", function (d) {
                    return d["country"] + ": " + d[year];
                });

        }

    });
}