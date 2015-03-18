/**
 * Created by Aman on 3/17/15.
 */
function line() {

    var chart = c3.generate({
        bindto: '#line',
        data: {
            url: 'collage.csv',
            x: 'Year',

            axes: {
                gdp: 'y2',
                population: 'y1',

                types: {
                    gdp: 'bar'
                }


            }
        },
        axis: {
            y: {
                show: true // ADD
            },
            x: {show: true}

        }
    });

    chart.show(['India', 'Africa']);


}