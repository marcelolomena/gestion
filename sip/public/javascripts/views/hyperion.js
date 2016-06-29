$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";


    var modelContrato = [
        { label: 'cui', name: 'cui', key: true, hidden: false },
    ];
    $("#grid").jqGrid({
        url: '/hyperion/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelContrato,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default        
        caption: 'Lista de contratos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/contratos/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        },
        //subGrid: true,
        //subGridRowExpanded: showSubGrids,
        //subGridOptions: {
        //    plusicon: "glyphicon-hand-right",
        //    minusicon: "glyphicon-hand-down"
        //},
    });
  

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        //$("#grid").jqGrid("setGridWidth",$("#gcontainer").width() );
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});