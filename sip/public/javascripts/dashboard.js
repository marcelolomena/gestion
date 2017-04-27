$(document).ready(function () {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    var dona = {
        chart: {
            renderTo: '',
            type: 'pie'
        },
        title: {
            text: '',
            x: -20
        },
        plotOptions: {
            pie: {
                innerSize: '50%'
            }
        },
        series: [],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    },
                    yAxis: {
                        labels: {
                            align: 'left',
                            x: 0,
                            y: -5
                        },
                        title: {
                            text: null
                        }
                    },
                    subtitle: {
                        text: null
                    },
                    credits: {
                        enabled: false
                    }
                }
            }]
        }
    };

    $.ajax({
        url: '/dashboard/' + idtype + '/zon1',
        type: 'GET',
        success: function (data) {
            var cat = []
            var series = []
            $.each(data[0].data, function (index, element) {
                cat.push(element.valorx)
            });

            $.each(data, function (index, element) {
                var item = {}
                var b = []

                $.each(element.data, function (i, elem) {
                    b.push(elem.valory)
                });

                item["name"] = element.name
                item["data"] = b

                series.push(item)
            });

            var zon1 = Highcharts.chart('zon1', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Consumo Presupuesto'
                },
                /*subtitle: {
                    text: 'Source: WorldClimate.com'
                },*/
                xAxis: {
                    categories: cat,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '(MM)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: series
            });

            //zon1.setSize(400, 300);
        }
    });

    $.ajax({
        url: '/dashboard/' + idtype + '/zon2',
        type: 'GET',
        success: function (data) {
            var series = []
            var tuto = []
            var datos = {}

            $.each(data, function (index, element) {
                series.push([element.valorx, element.valory])
            });

            datos["data"] = series
            tuto.push(datos)

            dona.series = tuto
            dona.chart.renderTo = 'zon2'
            dona.title.text = 'Gasto TI/Ingresos Operacionales'
            var zon2 = new Highcharts.Chart(dona);
            //zon2.setSize(400, 300);

        }
    })

    $.ajax({
        url: '/dashboard/' + idtype + '/zon3',
        type: 'GET',
        success: function (data) {
            var series = []
            var tutin = []
            var datos = {}

            $.each(data, function (index, element) {
                series.push([element.valorx, element.valory])
            });

            datos["data"] = series
            tutin.push(datos)
            //console.log(tutin)

            dona.series = tutin
            dona.chart.renderTo = 'zon3'
            dona.title.text = 'Gasto TI/Empleados Banco'
            var zon3 = new Highcharts.Chart(dona);

            //zon3.setSize(400, 300);

        }
    })

    $.ajax({
        url: '/dashboard/' + idtype + '/zon4',
        type: 'GET',
        success: function (data) {
            var series = []
            var tutin = []
            var datos = {}

            $.each(data, function (index, element) {
                series.push([element.valorx, element.valory])
            });

            datos["data"] = series
            tutin.push(datos)
            //console.log(tutin)

            dona.series = tutin
            dona.chart.renderTo = 'zon4'
            dona.title.text = 'Dotación TI/Dotación'
            var zon3 = new Highcharts.Chart(dona);

            //zon3.setSize(400, 300);

        }
    })

    var raya = Highcharts.chart('zon5', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Monthly Average Temperature'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    }
    );
    /*
        var lipo = Highcharts.chart('zon6', {
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {
    
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = Math.random();
                            series.addPoint([x, y], true, true);
                        }, 1000);
                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
    
                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                }())
            }]
    
        }
        );
        lipo.setSize(400, 300);
    */
    //torta.setSize(400, 300);
    //raya.setSize(400, 300);


});