$(document).ready(function () {
    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    Highcharts.setOptions({
        lang: {
            numericSymbols: ['M']
        }
    });

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
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true
                    }
                }
            },
            bar: {
                pointPadding: 0.1,
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    crop: false,
                    overflow: 'none',
                    formatter: function () {
                        if (this.y != 0) {
                            return Highcharts.numberFormat(this.y, 2);
                        } else {
                            return null;
                        }
                    },
                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif'
                    }
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
        { label: 'Gerencia', name: 'nombre', width: 100, align: 'left', search: false, editable: false },
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
        width: null,
        shrinkToFit: false,
        caption: 'Gerencias',
        viewrecords: false,
        footerrow: true,
        userDataOnFooter: true,
        styleUI: "Bootstrap",
        pager: "#pager",
        pgbuttons: false,
        pgtext: "",
        pginput: false,
        subGrid: true,
        subGridRowExpanded: departamentTroyaSubGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
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
                options.xAxis.labels = {
                    style: {
                        color: '#0B2161',
                        font: '14px Helvetica',
                        fontWeight: 'bold'
                    },
                    formatter: function () {
                        return this.value;
                    }
                };

                options.xAxis.categories = categorias;
                options.chart.renderTo = 'grafico_1';
                options.title.text = 'Real Estimado v/s Plan';
                var chart = new Highcharts.Chart(options);
                if (chart.series[0].data.length > 0) {
                    var baseHeight = 150;
                    var extraHeightPerThing = 50;
                    chart.setSize(null, baseHeight + chart.series[0].data.length * extraHeightPerThing);
                }
            }
        });
        $("table.ui-jqgrid-htable").css('width','100%');      
        $("table.ui-jqgrid-btable").css('width','100%');
        $("table.ui-jqgrid-ftable").css('width','100%');

    }
    


});


function departamentTroyaSubGrid(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/reporte/lstDepartamentostroya/" + parentRowKey;
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: [
            { label: 'id', name: 'id', key: true, hidden: true },
            { label: 'Departamento', name: 'nombre', width: 100 },
            { label: 'Real 2016', name: 'ejerciciouno', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
            { label: 'Plan 2017', name: 'ejerciciodos', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
            { label: 'Diferencia', name: 'diferencia', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
            { label: 'Porcentaje', name: 'porcentaje', width: 100, align: 'right', search: false, editable: false }
        ],
        autowidth: true,
        height: '100%',
        styleUI: "Bootstrap",
        footerrow: true,
        userDataOnFooter: true,
        //subGrid: true,
        //subGridRowExpanded: serviceSubGrid,
        //subGridOptions: {
        //    plusicon: "glyphicon-hand-right",
        //    minusicon: "glyphicon-hand-down"
        //},
    });


}