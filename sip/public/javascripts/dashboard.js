$(document).ready(function () {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    var lin = {
        chart: {
            type: 'line',
            renderTo: ''
        },
        title: {
            text: ''
        },
        /*subtitle: {
            text: 'Source: WorldClimate.com'
        },*/
        xAxis: {
            categories: []
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
        series: []
    }

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

    var bar = {
        chart: {
            renderTo: '',
            type: 'column'
        },
        title: {
            text: ''
        },
        /*subtitle: {
            text: 'Source: WorldClimate.com'
        },*/
        xAxis: {
            categories: [],
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
        series: []
    }

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
            bar.xAxis.categories = cat
            bar.series = series
            bar.chart.renderTo = 'zon1'
            bar.title.text = 'Consumo Presupuesto'
            var zon1 = new Highcharts.Chart(bar);
            zon1.setSize(400, 300);
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
            zon2.setSize(400, 300);
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

            dona.series = tutin
            dona.chart.renderTo = 'zon3'
            dona.title.text = 'Gasto TI/Empleados Banco'
            var zon3 = new Highcharts.Chart(dona);

            zon3.setSize(400, 300);

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

            dona.series = tutin
            dona.chart.renderTo = 'zon4'
            dona.title.text = 'Dotación TI/Dotación'
            var zon4 = new Highcharts.Chart(dona);
            zon4.setSize(400, 300);
        }
    })


    $.ajax({
        url: '/dashboard/' + idtype + '/zon5',
        type: 'GET',
        success: function (data) {
            var lin1 = []
            var lin2 = []
            var cat = []
            var resultado = []

            $.each(data.records[0], function (index, element) {
                cat.push(element.valorx)
                lin1.push(element.valory)
            });
            $.each(data.records[1], function (index, element) {
                lin2.push(element.valory)
            });

            $.each(data.series, function (index, element) {
                var datum = {}
                datum["name"] = element.serie
                if (index === 0)
                    datum["data"] = lin1
                else if (index === 1)
                    datum["data"] = lin2

                resultado.push(datum)
            });

            lin.chart.renderTo = 'zon5'
            lin.xAxis.categories = cat
            lin.series = resultado
            lin.title.text = 'Gasto mensual en HHEE'
            var zon5 = new Highcharts.Chart(lin);
            zon5.setSize(400, 300);

        }
    })

    $.ajax({
        url: '/dashboard/' + idtype + '/zon6',
        type: 'GET',
        success: function (data) {
            var cat = []
            var series = []

            $.each(data, function (index, element) {
                var item = {}
                item["name"] = element.valorx
                item["data"] = [element.valory]
                series.push(item)
                cat.push(element.valorx)
            });

            bar.xAxis.categories = cat
            bar.series = series
            bar.chart.renderTo = 'zon6'
            bar.title.text = 'Gastos en licencias'
            var zon6 = new Highcharts.Chart(bar);

            zon6.setSize(400, 300);
        }
    });

});