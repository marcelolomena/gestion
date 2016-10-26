$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var modelcargas = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Archivo', name: 'archivo', width: 50, align: 'left', search: true, editable: false, hidden: false },
        { label: 'Fecha Ultima Carga', name: 'fechaarchivo', width: 50, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, editrules: {required: true},
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'dd-mm-yyyy',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                childGridID[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
        },
        { label: 'Frecuencia', name: 'frecuencia', width: 100, align: 'left', search: true, editable: true },
        { label: 'Tipo de Carga', name: 'tipocarga', width: 100, align: 'left', search: true, editable: true },
    ];
    $("#grid").jqGrid({
        url: '/cargas/list',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelcargas,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Lista de Archivos Disponibles',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "frecuencia": "No hay datos" });
            }
        },
        subGrid: true,
        subGridRowExpanded: showChildGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
    });

    $("#grid").jqGrid('filterToolbar', {  stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: false, add: false, del: false, search: false,
        refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            recreateFilter: true
        }
    );

    $("#grid").jqGrid('navButtonAdd', "#pager", {
        caption: "",
        buttonicon: "glyphicon glyphicon-upload",
        title: "Upload",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/cargas/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});

function showChildGrid(parentRowID, parentRowKey) {

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childIdServicio = 0;

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    var modelDetalle = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idlogcargas', name: 'idlogcargas', hidden: true },
        { label: 'Fecha Ultima Carga', name: 'fechaarchivo', width: 100, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, editrules: {required: true},
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'dd-mm-yyyy',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                childGridID[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
        },
        { label: 'Fecha Proceso Carga', name: 'fechaproceso', width: 100, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true, editrules: {required: true},
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'dd-mm-yyyy',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                childGridID[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
        },        
        { label: 'Usuario', name: 'usuario', search: true,editable: true, width: 100, editrules: { edithidden: false }, hidedlg: false,search: false },
        { label: 'Número Registros', name: 'nroregistros', search: true,editable: true,width: 100, editrules: { edithidden: false }, hidedlg: true,search: false },
        { label: 'Nombre Control 1', name: 'nombre1', editable: true,width: 100, editrules: { edithidden: false }, hidedlg: true,search: false },
        { label: 'Control 1', name: 'control1', editable: true, width: 100,editrules: { edithidden: false }, hidedlg: true ,search: false},
        { label: 'Nombre Control 2', name: 'nombre2', editable: true,width: 100, editrules: { edithidden: false }, hidedlg: true ,search: false},
        { label: 'Control 2', name: 'control2', editable: true, width: 100,editrules: { edithidden: false }, hidedlg: true ,search: false},        
    ];

    $("#" + childGridID).jqGrid({
        url: '/detallecarga/' + parentRowKey,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelDetalle,
        rowNum: 10,
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        shrinkToFit: true,
        width: 1300,
        caption: 'Detalle de Cargas Realizadas',
        styleUI: "Bootstrap",
        subGrid: false,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "usuario": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('filterToolbar', {  stringResult: false, searchOperators: false, searchOnEnter: false, defaultSearch: 'cn' });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
                
        {
            recreateFilter: true
        }
    );
    $("#" + childGridPagerID).css("width", "");

    $(window).bind('resize', function () {
        $("#" + childGridID).setGridWidth($(".gcontainer").width(), true);
        $("#" + childGridPagerID).setGridWidth($(".gcontainer").width(), true);
    });

}