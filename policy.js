/**
 * Created by Aman on 3/18/15.
 */


var divblock = function(y) {
    $("#policy-year").val(y+"\'s");

    d3.csv("countriesRandbkp.csv", policyup);



    function policyup(error, data) {

        data.forEach(
            function (d) {

                var policy_string = d.Policy.split("/");

                if (y === d.Year) {
                    $("#policy-section").html("");
                    for (each in policy_string)

                   {
                       $("#policy-section").append("<section>"+ policy_string[each] + "<section><hr/>");

                    };



                }
            }
        )
    }


};