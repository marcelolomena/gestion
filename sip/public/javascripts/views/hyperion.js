$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    $.ajax(
        {
            type: "GET",
            url: "/hyperion/colnames/" + 2015,
            dataType: "json",
            success: function (JSONdata) {
                var listOfColumnModels = [];
                var listOfColumnNames = [];
                var data = JSONdata[0].detallepres[0].detalleplans;
                listOfColumnNames.push('CUI');
                listOfColumnNames.push('Periodo');

                listOfColumnModels.push({
                    name: 'cui',
                    width: 100,
                    sortable: true,
                    hidden: false
                });
                
                listOfColumnModels.push({
                    name: 'ano',
                    width: 100,
                    sortable: true,
                    hidden: false
                });     
                $.each(data, function (i, item) {
                    listOfColumnNames.push(data[i].periodo);
                    listOfColumnModels.push({
                        name: data[i].periodo,
                        width: 100,
                        sortable: true,
                        hidden: false,
                        align: 'right',
                        formatter:sipLibrary.currencyFormatter
                     });
                });

                CreateJQGrid(listOfColumnModels, listOfColumnNames);
            }
        });

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        //$("#grid").jqGrid("setGridWidth",$("#gcontainer").width() );
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});

function CreateJQGrid(listOfColumnModels, listOfColumnNames) {
    var modelContrato = [
        { label: 'cui', name: 'cui', key: true, hidden: false },
        { label: 'periodo', name: 'ano', hidden: false },
    ];
    $("#grid").jqGrid({
        url: '/hyperion/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colNames: listOfColumnNames,
        colModel: listOfColumnModels,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,  
        shrinkToFit: true,    
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
}