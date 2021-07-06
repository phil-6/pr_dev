/**
 * Get data from dashboard-data.json, perform some processing and build charts
 * Also include Dark-Mode function
 */

/*
Global Variables
 */
var data_location = 'data/dashboard-data.json';
var json_data;
var days_in_month = 30;
// Data for Key Info cards
var key_change_callsThisMonth ;
var key_change_collectionsBooked ;

// Data for extra info cards
var extra_matchedCalls ;
var extra_notMatchedCalls ;
var extra_bookings ;
var extra_notBooked ;
var extra_dropped ;

/*
Colors
*/
var chartColors = {
    dark_orange: '#f69259e6',
    light_orange: '#ffdb6fe6',
    purple: '#8176b5e6',
    purple_blue: '#76c4e2e6',
    green: '#92fe9de6',
    blue: '#00c9ffe6',
    blue_solid: '#00c9ff',
    red: '#fc6076e6',
    red_orange: '#ff9a44e6',
    red_orange_solid: '#ff9a44',
    light : {
        text : '#DCDCDC',
        gridlines : '#808080',
        pie_borders: '#424242'
    },
    dark : {
        text_black : '#1b2126',
        text : '#626567',
        gridlines : '#E5E7E9',
        pie_borders: '#fff'
    }
};
var contrastColor;


/*
Dark Mode Toggle
 */
function toggleDarkMode () {
    if ((document.getElementsByTagName("BODY")[0].className) === 'light-mode') {
        document.getElementsByTagName("BODY")[0].classList.add('dark-mode');
        document.getElementsByTagName("BODY")[0].classList.remove('light-mode');
    } else if ((document.getElementsByTagName("BODY")[0].className) === 'dark-mode') {
        document.getElementsByTagName("BODY")[0].classList.add('light-mode');
        document.getElementsByTagName("BODY")[0].classList.remove('dark-mode');
    } else {
        alert("Somethings gone wrong with the theme, Sorry!")
    }
    buildCharts();
}

/*
Reload Data
*/

function reloadData (){
    getData();
    processData();
    buildKeyInfoCards();
    buildExtraInfoCards();
    buildCharts();
}

/*
Get Data from json
*/
function getData () {
    json_data = (function () {
        json_data = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': data_location,
            'dataType': "json",
            'success': function (data) {
                json_data = data;
            }
        });
        return json_data;
    })();
}

/*
Perform some data processing and create new variables
*/

function processData () {
    getData();
// Data for Key Info cards
    key_change_callsThisMonth = Math.round(json_data.global_calls.monthly_calls_current - ((json_data.global_calls.monthly_calls_last / days_in_month) * (json_data.last_update_date.substring(0, 2))));
    key_change_collectionsBooked = Math.round(json_data.calls_by_type.total_this_month.call_collection_booked - ((json_data.calls_by_type.total_last_month.call_collection_booked / days_in_month) * (json_data.last_update_date.substring(0, 2))));
    key_change_droppedCalls = Math.round(json_data.calls_by_type.total_this_month.call_failure - ((json_data.calls_by_type.total_last_month.call_failure / days_in_month) * (json_data.last_update_date.substring(0, 2))));

// Data for extra info cards
    extra_matchedCalls = (json_data.calls_by_type.total_to_date.call_match_home + json_data.calls_by_type.total_to_date.call_match_mob + json_data.calls_by_type.total_to_date.call_match_alt);
    extra_notMatchedCalls = (json_data.calls_by_type.total_to_date.call_no_match);
    extra_bookings = (json_data.calls_by_type.total_to_date.call_collection_booked);
    extra_notBooked = (json_data.calls_by_type.total_to_date.call_collection_not_booked);
    extra_dropped = (json_data.calls_by_type.total_to_date.call_failure);
}


/*
Add data to Key Info Cards
*/
function buildKeyInfoCards () {
    getData();
    processData();
    /*
    Set Last Updated Date and Time
    */
    document.getElementById('last_updated').innerHTML = json_data.last_update_date + " at " + json_data.last_update_time;

    document.getElementById('key_totalCalls').innerHTML = json_data.global_calls.total_calls;
    document.getElementById('key_callsThisMonth').innerHTML = json_data.global_calls.monthly_calls_current;
    document.getElementById('key_collectionsBooked').innerHTML = json_data.calls_by_type.total_this_month.call_collection_booked;
    document.getElementById('key_droppedCalls').innerHTML = json_data.calls_by_type.total_this_month.call_failure;

    document.getElementById('key_change_callsThisMonth').innerHTML = key_change_callsThisMonth;
    document.getElementById('key_change_collectionsBooked').innerHTML = key_change_collectionsBooked;
    document.getElementById('key_change_droppedCalls').innerHTML = key_change_droppedCalls;

    // Add change symbols to Key Info Cards
    if (key_change_callsThisMonth > 0) {
        document.getElementById('key_symbol_callsThisMonth').innerHTML = '<i class="fas fa-2x fa-sort-up"></i>';
    } else if (key_change_callsThisMonth < 0) {
        document.getElementById('key_symbol_callsThisMonth').innerHTML = '<i class="fas fa-2x fa-sort-down"></i>';
    } else {
        document.getElementById('key_symbol_callsThisMonth').innerHTML = '<i class="fas fa-1x fa-equals"></i>';
    }
    if (key_change_collectionsBooked > 0) {
        document.getElementById('key_symbol_collectionsBooked').innerHTML = '<i class="fas fa-2x fa-sort-up"></i>';
    } else if (key_change_collectionsBooked < 0) {
        document.getElementById('key_symbol_collectionsBooked').innerHTML = '<i class="fas fa-2x fa-sort-down"></i>';
    } else {
        document.getElementById('key_symbol_collectionsBooked').innerHTML = '<i class="fas fa-1x fa-equals"></i>';
    }
    if (key_change_droppedCalls > 0) {
        document.getElementById('key_symbol_droppedCalls').innerHTML = '<i class="fas fa-2x fa-sort-up"></i>';
    } else if (key_change_droppedCalls < 0) {
        document.getElementById('key_symbol_droppedCalls').innerHTML = '<i class="fas fa-2x fa-sort-down"></i>';
    } else {
        document.getElementById('key_symbol_droppedCalls').innerHTML = '<i class="fas fa-1x fa-equals"></i>';
    }
}

/*
Add data to Extra Info Cards
*/
function buildExtraInfoCards () {
    getData();
    processData();
    document.getElementById('extra_matchedCalls').innerHTML = extra_matchedCalls;
    document.getElementById('extra_notMatchedCalls').innerHTML = extra_notMatchedCalls;
    document.getElementById('extra_bookings').innerHTML = extra_bookings;
    document.getElementById('extra_notBooked').innerHTML = extra_notBooked;
    document.getElementById('extra_dropped').innerHTML = extra_dropped;
}

/*
Build All Charts
 */

function buildCharts() {
    getData();
    processData();
    /* Change colors depending on whether or not dark-mode is on */

    if ((document.getElementsByTagName("BODY")[0].className) === 'dark-mode') {
        contrastColor = chartColors.light;
    } else {
        contrastColor = chartColors.dark;
    }

    /*
    Create Bar Chart - Call Matches
    */
    var ctx_bc0 = document.getElementById('barChartCallMatches').getContext('2d');
    var lastMonthGradient_bc0 = ctx_bc0.createLinearGradient(150.000, 0.000, 150.000, 300.000);
    lastMonthGradient_bc0.addColorStop(0.000, chartColors.light_orange);
    lastMonthGradient_bc0.addColorStop(1.000, chartColors.dark_orange);
    var thisMonthGradient_bc0 = ctx_bc0.createLinearGradient(150.000, 0.000, 150.000, 300.000);
    thisMonthGradient_bc0.addColorStop(0.000, chartColors.purple);
    thisMonthGradient_bc0.addColorStop(1.000, chartColors.purple_blue);
    var barChartCallMatches = new Chart(ctx_bc0, {
        type: 'bar',
        data: {
            labels: [
                'No Match',
                'Match Home',
                'Match Mob',
                'Match Alt'
            ],
            datasets: [
                {
                    label: 'Last Month',
                    borderWidth: 1,
                    backgroundColor: lastMonthGradient_bc0,
                    borderColor: lastMonthGradient_bc0,
                    data: [
                        json_data.calls_by_type.total_last_month.call_no_match,
                        json_data.calls_by_type.total_last_month.call_match_home,
                        json_data.calls_by_type.total_last_month.call_match_mob,
                        json_data.calls_by_type.total_last_month.call_match_alt
                    ]
                },
                {
                    label: 'This Month',
                    borderWidth: 1,
                    backgroundColor: thisMonthGradient_bc0,
                    borderColor: thisMonthGradient_bc0,
                    data: [
                        json_data.calls_by_type.total_this_month.call_no_match,
                        json_data.calls_by_type.total_this_month.call_match_home,
                        json_data.calls_by_type.total_this_month.call_match_mob,
                        json_data.calls_by_type.total_this_month.call_match_alt
                    ]
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: contrastColor.text
                    },
                    gridLines: {
                        color: contrastColor.gridlines,
                        zeroLineColor: contrastColor.gridlines
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: contrastColor.text
                    },
                    gridLines: {
                        color: contrastColor.gridlines,
                        axisColor: contrastColor.gridlines,
                        zeroLineColor: contrastColor.gridlines
                    }
                }]
            },
            legend: {
                position: 'top',
                labels: {
                    fontColor: contrastColor.text
                }
            },
            title: {
                display: true,
                text: 'Call Matches',
                fontColor: contrastColor.text
            }
        }
    });


    /*
    Create Bar Chart - Call Outcomes
    */
    var ctx_bc1 = document.getElementById('barChartCallOutcomes').getContext('2d');
    var lastMonthGradient_bc1 = ctx_bc1.createLinearGradient(150.000, 0.000, 150.000, 300.000);
    lastMonthGradient_bc1.addColorStop(0.000, chartColors.light_orange);
    lastMonthGradient_bc1.addColorStop(1.000, chartColors.dark_orange);
    var thisMonthGradient_bc1 = ctx_bc1.createLinearGradient(150.000, 0.000, 150.000, 300.000);
    thisMonthGradient_bc1.addColorStop(0.000, chartColors.purple);
    thisMonthGradient_bc1.addColorStop(1.000, chartColors.purple_blue);
    var barChartCallOutcomes = new Chart(ctx_bc1, {
        type: 'bar',
        data: {
            labels: [
                'Collection Booked',
                'Collection Not Booked',
                'Dropped Calls'
            ],
            datasets: [
                {
                    label: 'Last Month',
                    borderWidth: 1,
                    backgroundColor: lastMonthGradient_bc1,
                    borderColor: lastMonthGradient_bc1,
                    data: [
                        json_data.calls_by_type.total_last_month.call_collection_booked,
                        json_data.calls_by_type.total_last_month.call_collection_not_booked,
                        json_data.calls_by_type.total_last_month.call_failure
                    ]
                },
                {
                    label: 'This Month',
                    borderWidth: 1,
                    backgroundColor: thisMonthGradient_bc1,
                    borderColor: thisMonthGradient_bc1,
                    data: [
                        json_data.calls_by_type.total_this_month.call_collection_booked,
                        json_data.calls_by_type.total_this_month.call_collection_not_booked,
                        json_data.calls_by_type.total_this_month.call_failure
                    ]
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: contrastColor.text
                    },
                    gridLines: {
                        color: contrastColor.gridlines,
                        zeroLineColor: contrastColor.gridlines
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: contrastColor.text
                    },
                    gridLines: {
                        color: contrastColor.gridlines
                    }
                }]
            },
            legend: {
                position: 'top',
                labels: {
                    fontColor: contrastColor.text
                }
            },
            title: {
                display: true,
                text: 'Call Outcomes',
                fontColor: contrastColor.text
            }
        }
    });


    /*
    Create Line Chart showing annual calls
    */
    var month = [];
    month[0] = "jan";
    month[1] = "feb";
    month[2] = "mar";
    month[3] = "apr";
    month[4] = "may";
    month[5] = "jun";
    month[6] = "jul";
    month[7] = "aug";
    month[8] = "sep";
    month[9] = "oct";
    month[10] = "nov";
    month[11] = "dec";
    month[12] = "jan";
    month[13] = "feb";
    month[14] = "mar";
    month[15] = "apr";
    month[16] = "may";
    month[17] = "jun";
    month[18] = "jul";
    month[19] = "aug";
    month[20] = "sep";
    month[21] = "oct";
    month[22] = "nov";
    month[23] = "dec";
    var date = new Date();
    var currentMonthDigit = date.getMonth();
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    var ctx_lc0 = document.getElementById('lineChartAnnualCalls').getContext('2d');
    var matchedCallsGradient_lc0 = ctx_lc0.createLinearGradient(50.000, 300.000, 100.000, 50.000);
    matchedCallsGradient_lc0.addColorStop(0.000, chartColors.purple_blue);
    matchedCallsGradient_lc0.addColorStop(1.000, chartColors.purple_blue);
    var notMatchedGradient_lc0 = ctx_lc0.createLinearGradient(150.000, 0.000, 150.000, 300.000);
    notMatchedGradient_lc0.addColorStop(0.000, chartColors.red);
    notMatchedGradient_lc0.addColorStop(1.000, chartColors.red_orange);
    var bookedGradient_lc0 = ctx_lc0.createLinearGradient(100.000, 100.000, 0.000, 0.000);
    bookedGradient_lc0.addColorStop(0.000, chartColors.green);
    bookedGradient_lc0.addColorStop(1.000, chartColors.blue);
    var lineChartAnnualCalls = new Chart(ctx_lc0, {
        type: 'line',
        data: {
            labels: [
                capitalizeFirstLetter(month[currentMonthDigit + 1]),
                capitalizeFirstLetter(month[currentMonthDigit + 2]),
                capitalizeFirstLetter(month[currentMonthDigit + 3]),
                capitalizeFirstLetter(month[currentMonthDigit + 4]),
                capitalizeFirstLetter(month[currentMonthDigit + 5]),
                capitalizeFirstLetter(month[currentMonthDigit + 6]),
                capitalizeFirstLetter(month[currentMonthDigit + 7]),
                capitalizeFirstLetter(month[currentMonthDigit + 8]),
                capitalizeFirstLetter(month[currentMonthDigit + 9]),
                capitalizeFirstLetter(month[currentMonthDigit + 10]),
                capitalizeFirstLetter(month[currentMonthDigit + 11]),
                capitalizeFirstLetter(month[currentMonthDigit + 0])
            ],
            datasets: [ {
                label: 'Bookings',
                fill: 'none',
                backgroundColor: bookedGradient_lc0,
                borderColor: chartColors.green,
                data: [
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 1]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 2]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 3]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 4]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 5]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 6]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 7]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 8]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 9]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 10]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 11]),
                    eval("json_data.global_calls.calls_by_month.booked_calls."+month[currentMonthDigit + 0])
                ]
            },{
                label: 'Matched Calls',
                fill: 'none',
                backgroundColor: matchedCallsGradient_lc0,
                borderColor: chartColors.blue_solid,
                data: [
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 1]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 2]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 3]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 4]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 5]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 6]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 7]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 8]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 9]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 10]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 11]),
                    eval("json_data.global_calls.calls_by_month.call_match."+month[currentMonthDigit + 0])
                ]
            }, {
                label: 'Not Matched Calls',
                fill: 'none',
                backgroundColor: notMatchedGradient_lc0,
                borderColor: chartColors.red_orange_solid,
                data: [
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 1]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 2]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 3]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 4]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 5]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 6]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 7]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 8]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 9]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 10]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 11]),
                    eval("json_data.global_calls.calls_by_month.call_no_match."+month[currentMonthDigit + 0])
                ]
            }, {
                label: 'Total Calls',
                fill: 'none',
                backgroundColor: chartColors.purple,
                borderColor: chartColors.purple,
                data: [
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 1]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 2]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 3]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 4]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 5]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 6]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 7]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 8]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 9]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 10]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 11]),
                    eval("json_data.global_calls.calls_by_month.total_calls."+month[currentMonthDigit + 0])
                ]
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Calls Per Month',
                fontColor: contrastColor.text
            },
            legend: {
                position: 'top',
                labels: {
                    fontColor: contrastColor.text
                }
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month',
                        fontColor: contrastColor.text
                    },
                    ticks: {
                        fontColor: contrastColor.text
                    },
                    gridLines: {
                        color: contrastColor.gridlines
                    }
                }],
                yAxes: [{
                    display: true,
                    stacked: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value',
                        fontColor: contrastColor.text
                    },
                    ticks: {
                        fontColor: contrastColor.text
                    },
                    gridLines: {
                        color: contrastColor.gridlines,
                        zeroLineColor: contrastColor.gridlines
                    }
                }]
            },
            aspectRatio: 3
        }
    });


    /*
    Create Doughnut Chart split of call matches
    */
    var ctx_dc0 = document.getElementById('callMatches_Doughnut').getContext('2d');
    var callMatchesGradient_dc0 = ctx_dc0.createLinearGradient(0.000, 50.000, 300.000, 250.000);
    callMatchesGradient_dc0.addColorStop(0.000, chartColors.green);
    callMatchesGradient_dc0.addColorStop(1.000, chartColors.blue);
    var notMatchedGradient_dc0 = ctx_dc0.createLinearGradient(150.000, 0.000, 150.000, 300.000);
    notMatchedGradient_dc0.addColorStop(0.000, chartColors.red);
    notMatchedGradient_dc0.addColorStop(1.000, chartColors.red_orange);
    var callMatches_Doughnut = new Chart(ctx_dc0, {
        type: 'doughnut',
        data: {

            datasets: [{
                data: [
                    extra_matchedCalls,
                    extra_notMatchedCalls
                ],
                backgroundColor: [
                    callMatchesGradient_dc0,
                    notMatchedGradient_dc0
                ]
            }
            ],
            labels: [
                'Match',
                'No Match'
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: contrastColor.text
                }
            },
            title: {
                display: true,
                text: 'Call Matches',
                fontColor: contrastColor.text
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },
            aspectRatio: 1,
            elements: {
                arc: {
                    borderColor: contrastColor.pie_borders
                }
            }
        }
    });


    /*
    Create Doughnut Chart split of bookings
    */
    var ctx_dc1 = document.getElementById('callBookings_Doughnut').getContext('2d');
    var bookingsGradient_dc1 = ctx_dc1.createLinearGradient(0.000, 50.000, 300.000, 250.000);
    bookingsGradient_dc1.addColorStop(0.000, chartColors.green);
    bookingsGradient_dc1.addColorStop(1.000, chartColors.blue);
    var notBookedGradient_dc1 = ctx_dc1.createLinearGradient(150.000, 0.000, 150.000, 300.000);
    notBookedGradient_dc1.addColorStop(0.000, chartColors.purple_blue);
    notBookedGradient_dc1.addColorStop(1.000, chartColors.purple);
    var droppedGradient_dc1 = ctx_dc1.createLinearGradient(150.000, 0.000, 150.000, 300.000);
    droppedGradient_dc1.addColorStop(0.000, chartColors.red_orange);
    droppedGradient_dc1.addColorStop(1.000, chartColors.red);
    var callBookings_Doughnut = new Chart(ctx_dc1, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [
                    extra_bookings,
                    extra_notBooked,
                    extra_dropped
                ],
                backgroundColor: [
                    bookingsGradient_dc1,
                    notBookedGradient_dc1,
                    droppedGradient_dc1
                ]
            }
            ],
            labels: [
                'Coll Booked',
                'Coll Not Booked',
                'Dropped Calls'
            ]
        },
        options: {
            responsive: true,
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: contrastColor.text
                }
            },
            title: {
                display: true,
                text: 'Bookings',
                fontColor: contrastColor.text
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },
            aspectRatio: 1,
            elements: {
                arc: {
                    borderColor: contrastColor.pie_borders
                }
            }
        }
    });
}


getData();
processData();
buildKeyInfoCards();
buildExtraInfoCards();
buildCharts();

