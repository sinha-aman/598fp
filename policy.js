/**
 * Created by Aman on 3/18/15.
 */


var divblock = function(y) {
    $("#policy-year").val(y+"\'s");
    d3.csv("countriesRandbkp.csv", policyup);
    function policyup(error, data) {
        data.forEach(function (d) {
                var policy_string = d.Policy.split("/");
                if (y === d.Year) {
                    $("#gdp-year").val("GDP : "+ d.gdp);
                    $("#pop-year").val("US Population : "+ d.Population);
                    $("#tot-year").val("Immigrants : "+ d.Total);
                    $("#policy-section").html("");
                    for (each in policy_string) {
                       $("#policy-section").append("<section>"+ policy_string[each] + "<section><hr/>");
                    };
                }
            })
    }


};
