function map() {

    $(document).ready(function () {

        $("#slider").slider({
            value: 1820,
            min: 1820,
            max: 2000,
            step: 10,
            slide: function (event, ui) {
                $("#year").val(ui.value);
                redraw(ui.value.toString());
            }
        });

        $("#year").val($("#slider").slider("value"));

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
            .scale(150);

        var path = d3.geo.path()
            .projection(xy);

        var svg1 = d3.select("#map").append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("id","bubble-svg");

        svg1.call(tip);

        var states = svg1.append("svg:g")
            .attr("id", "states");

        var circles = svg1.append("svg:g")
            .attr("id", "circles");

        var labels = svg1.append("svg:g")
            .attr("id", "labels");

        d3.json("world-countries.json", function (collection) {
            states.selectAll("path")
                .data(collection.features)
                .enter().append("svg:path")
                .attr("d", path)
                .on("mouseover", function (d) {
                    d3.select(this).style("fill", "#6C0")
                        .append("svg:title")
                        .text(d.properties.name);
                })
                .on("mouseout", function (d) {
                    d3.select(this).style("fill", "#ccc");
                })
        });

        var scaleFactor = 1. / 15000.;

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
                    return (+d["1950"]) * scaleFactor;
                })
                .attr("title", function (d) {
                    return d["country"] + ": " + d["1820"];
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
                    return (+d[year]) * scaleFactor;
                })
                .attr("title", function (d) {
                    return d["country"] + ": " + d[year];
                });

        }

    });
}