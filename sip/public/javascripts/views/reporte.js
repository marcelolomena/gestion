$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var modelGerencias = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Gerencia', name: 'nombre', width: 250, align: 'left', search: false, editable: false },
        { label: 'Presupuesto', name: 'ejerciciouno', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Presupuesto', name: 'ejerciciodos', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Difencia', name: 'diferencia', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
        { label: 'Porcentaje', name: 'porcentaje', width: 100, align: 'right', search: false, editable: false }
    ], $grid = $("#grid");

    $grid.jqGrid({
        datatype: 'local',
        page: 1,
        colModel: modelGerencias,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        caption: 'Gerencias',
        viewrecords: true,
        footerrow: true,
        userDataOnFooter: true,
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        loadError: sipLibrary.jqGrid_loadErrorHandler
    });

    var graphArrayData = [];
    var categorias = [];
    var serie1 = {};
    var serie2 = {};

    fetchGridData();

    function fetchGridData() {
        var gridArrayData = [];
        var serie1ArrayData = [];
        var serie2ArrayData = [];

        $grid[0].grid.beginReq();
        $.ajax({
            url: "/reporte/lstGerencias",
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

                serie1 = { name: '2016', data: serie1ArrayData };
                serie2 = { name: '2017', data: serie2ArrayData };

                graphArrayData.push(serie1)
                graphArrayData.push(serie2)

                $grid.jqGrid('setGridParam', { data: gridArrayData });
                $grid.jqGrid('footerData', 'set', result.userdata);
                $grid[0].grid.endReq();
                $grid.trigger('reloadGrid');


                $('#grafico').highcharts({
                    chart: {
                        type: 'bar'
                    },
                    title: {
                        text: 'Presupuesto'
                    },
                    subtitle: {
                        text: 'Fuente: Sistema de Información Presupuestario'
                    },
                    xAxis: {
                        categories: categorias,
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Monto (MM)',
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
                    series: graphArrayData
                });
            }
        });
    }

    function showSubGrids(parentRowID, parentRowKey) {
        var childGridID = parentRowID + "_table";
        var childGridPagerID = parentRowID + "_pager";
        var childGridURL = "/reporte/lstDepartamentos/" + parentRowKey;
        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "GET",
            datatype: "json",
            page: 1,
            colModel: [
                { label: 'id', name: 'id', key: true, hidden: true },
                { label: 'Departamento', name: 'nombre', width: 100 },
                { label: 'Presupuesto', name: 'ejerciciouno', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
                { label: 'Presupuesto', name: 'ejerciciodos', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
                { label: 'Difencia', name: 'diferencia', width: 100, align: 'right', search: false, editable: false, sorttype: 'number', formatter: 'number' },
                { label: 'Porcentaje', name: 'porcentaje', width: 100, align: 'right', search: false, editable: false }
            ],
            //loadonce: true,
            autowidth: true,
            height: '100%',
            styleUI: "Bootstrap",
            footerrow: true,
            userDataOnFooter: true
        });

    }


});