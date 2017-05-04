$(document).ready(function () {

    Highcharts.theme = {
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
            '#FF9655', '#FFF263', '#6AF9C4'],
        chart: {
            backgroundColor: {
                linearGradient: [0, 0, 500, 500],
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(240, 240, 255)']
                ]
            },
        },
        title: {
            style: {
                color: '#000',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        subtitle: {
            style: {
                color: '#666666',
                font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
            }
        },

        legend: {
            itemStyle: {
                font: '9pt Trebuchet MS, Verdana, sans-serif',
                color: 'black'
            },
            itemHoverStyle: {
                color: 'gray'
            }
        }
    };

    Highcharts.setOptions(Highcharts.theme, {
        lang: {
            loading: 'Cargando...',
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            weekdays: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'],
            shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            exportButtonTitle: "Exportar",
            printButtonTitle: "Importar",
            rangeSelectorFrom: "De",
            rangeSelectorTo: "A",
            rangeSelectorZoom: "Periodo",
            downloadPNG: 'Descargar gráfica PNG',
            downloadJPEG: 'Descargar gráfica JPEG',
            downloadPDF: 'Descargar gráfica PDF',
            downloadSVG: 'Descargar gráfica SVG',
            printChart: 'Imprimir Gráfica',
            thousandsSep: ",",
            decimalPoint: '.'
        }
    });

    pageSize = 1;
    pagesCount = $(".graficos").length;
    var currentPage = 1;

    /////////// PREPARE NAV ///////////////
    var nav = '';
    var totalPages = Math.ceil(pagesCount / pageSize);
    for (var s = 0; s < totalPages; s++) {
        nav += '<li class="numeros"><a href="#">' + (s + 1) + '</a></li>';
    }
    $(".pag_prev").after(nav);
    $(".numeros").first().addClass("active");
    //////////////////////////////////////

    showPage = function () {
        $(".graficos").hide().each(function (n) {
            if (n >= pageSize * (currentPage - 1) && n < pageSize * currentPage)
                $(this).show();
        });
    }
    showPage();

    $(".pagination li.numeros").click(function () {
        $(".pagination li").removeClass("active");
        $(this).addClass("active");
        currentPage = parseInt($(this).text());
        showPage();
    });

    $(".pagination li.pag_prev").click(function () {
        if ($(this).next().is('.active')) return;
        $('.numeros.active').removeClass('active').prev().addClass('active');
        currentPage = currentPage > 1 ? (currentPage - 1) : 1;
        showPage();
    });

    $(".pagination li.pag_next").click(function () {
        if ($(this).prev().is('.active')) return;
        $('.numeros.active').removeClass('active').next().addClass('active');
        currentPage = currentPage < totalPages ? (currentPage + 1) : totalPages;
        showPage();
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
                text: 'MM'
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
        series: [],
        exporting: {
            enabled: true
        }
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
            type: ''
        },
        title: {
            text: ''
        },
        /*subtitle: {
            text: 'Source: WorldClimate.com'
        },*/
        xAxis: {
            //categories: [],
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
                borderWidth: 0,
            }, series: {
                colorByPoint: true
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
            console.log(cat)

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
            //console.dir(series)
            bar.xAxis.categories = cat
            bar.series = series
            bar.chart.type = 'column'
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
            var b = []
            var item = {}

            $.each(data, function (index, element) {
                b.push([element.valorx, element.valory])
            });

            item["name"] = "Valores"
            item["data"] = b
            series.push(item)

            //console.dir(series)

            bar.xAxis.type = 'category'
            //bar.xAxis.labels.rotation = -45
            //bar.xAxis.labels.style.fontSize = '13px'
            //bar.xAxis.labels.style.fontFamily = 'Verdana, sans-serif'
            bar.series = series
            bar.chart.renderTo = 'zon6'
            bar.chart.type = 'column'
            bar.title.text = 'Gastos en licencias'
            var zon6 = new Highcharts.Chart(bar);

            zon6.setSize(400, 300);
        }
    });


    $.ajax({
        url: '/dashboard/' + idtype + '/zon7',
        type: 'GET',
        success: function (data) {
            var cat = []
            var series = []
            var b = []
            var item = {}

            $.each(data, function (index, element) {
                cat.push(element.valorx)
                b.push(element.valory)
            });

            item["name"] = ''
            item["data"] = b
            series.push(item)

            bar.xAxis.categories = cat
            bar.series = series
            bar.chart.type = 'bar'
            bar.chart.renderTo = 'zon7'
            bar.title.text = 'Comparación del presupuesto aprobado'
            var zon7 = new Highcharts.Chart(bar);
            zon7.setSize(400, 300);
        }
    });

    $.ajax({
        url: '/dashboard/' + idtype + '/zon8',
        type: 'GET',
        success: function (data) {
            var cat = []
            var series = []
            $.each(data[0].data, function (index, element) {
                cat.push(element.valorx)
            });
            console.log(cat)
            //console.dir(data)

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

            //console.dir(series)
            bar.xAxis.categories = cat
            bar.series = series
            bar.chart.type = 'column'
            bar.chart.renderTo = 'zon8'
            bar.title.text = 'Comparativo del gasto'
            var zon8 = new Highcharts.Chart(bar);
            zon8.setSize(400, 300);
        }
    });

    $.ajax({
        url: '/dashboard/' + idtype + '/zon9',
        type: 'GET',
        success: function (data) {
            var cat = []
            var series = []
            var b = []
            var item = {}

            $.each(data, function (index, element) {
                cat.push(element.valorx)
                b.push(element.valory)
            });

            item["name"] = ''
            item["data"] = b
            series.push(item)

            bar.xAxis.categories = cat
            bar.series = series
            bar.chart.type = 'bar'
            bar.chart.renderTo = 'zon9'
            bar.title.text = 'Comparativo del gasto en HHEE'
            var zon9 = new Highcharts.Chart(bar);
            zon9.setSize(400, 300);
        }
    });

    $.ajax({
        url: '/dashboard/' + idtype + '/zon10',
        type: 'GET',
        success: function (data) {
            var cat = []
            var series = []
            var b = []
            var item = {}

            $.each(data, function (index, element) {
                cat.push(element.valorx)
                b.push(element.valory)
            });

            item["name"] = ''
            item["data"] = b
            series.push(item)

            bar.xAxis.categories = cat
            bar.series = series
            bar.chart.type = 'bar'
            bar.chart.renderTo = 'zon10'
            bar.title.text = 'Saldo en SAP vigentes'
            var zon10 = new Highcharts.Chart(bar);
            zon10.setSize(400, 300);
        }
    });

    $.ajax({
        url: '/dashboard/' + idtype + '/zon11',
        type: 'GET',
        success: function (data) {
            var cat = []
            var series = []
            var b = []
            var item = {}

            $.each(data, function (index, element) {
                cat.push(element.valorx)
                b.push(element.valory)
            });

            item["name"] = ''
            item["data"] = b
            series.push(item)

            bar.xAxis.categories = cat
            bar.series = series
            bar.chart.type = 'bar'
            bar.chart.renderTo = 'zon11'
            bar.title.text = 'Tiempo promedio de inscripción de cada SAP'
            var zon11 = new Highcharts.Chart(bar);
            zon11.setSize(400, 300);
        }
    });

    //$("#zon12").load("static/tbl.html");
    $("#zon12").width(400).height(300);

});