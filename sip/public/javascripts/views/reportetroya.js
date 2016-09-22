$(document).ready(function () {
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var options = {
        chart: {
            renderTo: '',
            type: 'bar'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: 'Fuente: Sistema de Información Presupuestario'
        },
        xAxis: {
            categories: [],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Monto (Millones)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' millones'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: []
    };

    var modelGerencias = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Gerencia', name: 'nombre', width: 250, align: 'left', search: false, editable: false },
        { label: 'Real 2016', name: 'ejerciciouno', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Plan 2017', name: 'ejerciciodos', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Diferencia', name: 'diferencia', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Porcentaje', name: 'porcentaje', width: 100, align: 'right', search: false, editable: false }
    ], $grid = $("#grid");

    $grid.jqGrid({
        datatype: 'local',
        colModel: modelGerencias,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        caption: 'Gerencias',
        viewrecords: false,
        footerrow: true,
        userDataOnFooter: true,
        styleUI: "Bootstrap",
        pager: "#pager",
        pgbuttons: false,
        pgtext: "",
        pginput: false,
        //subGrid: true,
        //subGridRowExpanded: departamentSubGrid,
        //subGridOptions: {
        //    plusicon: "glyphicon-hand-right",
        //    minusicon: "glyphicon-hand-down"
        //},
        loadError: sipLibrary.jqGrid_loadErrorHandler
    });


    fetchGridData();

    function fetchGridData() {
        var categorias = [];
        var serie1 = {};
        var serie2 = {};
        var gridArrayData = [];
        var serie1ArrayData = [];
        var serie2ArrayData = [];

        $grid[0].grid.beginReq();
        $.ajax({
            url: "/reporte/lstGerenciasTroya",
            success: function (result) {

                for (var i = 0; i < result.rows.length; i++) {
                    var item = result.rows[i];
                    gridArrayData.push({
                        id: item.id,
                        nombre: item.nombre,
                        ejerciciouno: item.ejerciciouno,
                        ejerciciodos: item.ejerciciodos,
                        diferencia: item.diferencia,
                        porcentaje: item.porcentaje
                    });
                    serie1ArrayData.push(item.ejerciciouno);
                    serie2ArrayData.push(item.ejerciciodos);
                    categorias.push(item.nombre)
                }

                serie1 = { name: 'Real 2016', data: serie1ArrayData };
                serie2 = { name: 'Plan 2017', data: serie2ArrayData };

                $grid.jqGrid('setGridParam', { data: gridArrayData });
                $grid.jqGrid('footerData', 'set', result.userdata);
                $grid[0].grid.endReq();
                $grid.trigger('reloadGrid');

                options.series[0] = serie1;
                options.series[1] = serie2;
                options.xAxis.categories = categorias;
                options.chart.renderTo = 'grafico_1';
                options.title.text = 'Plan v/s Real';
                var chart = new Highcharts.Chart(options);
            }
        });

    }    

});