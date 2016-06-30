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
                    hidden: false,
                    searchoptions: { sopt: ["eq", "le", "ge"] }
                });

                listOfColumnModels.push({
                    name: 'ano',
                    width: 100,
                    sortable: true,
                    hidden: false,
                    searchoptions: { sopt: ["eq", "le", "ge"] }
                });
                $.each(data, function (i, item) {
                    //console.log( data[i].periodo.toString().substring(4,6) + '/' + data[i].periodo.toString().substring(0,4) )
                    listOfColumnNames.push(data[i].periodo.toString().substring(4, 6) + '/' + data[i].periodo.toString().substring(0, 4));
                    listOfColumnModels.push({
                        name: data[i].periodo.toString(),
                        //name: data[i].periodo.toString().substring(4, 6) + '/' + data[i].periodo.toString().substring(0, 4),
                        width: 100,
                        sortable: true,
                        hidden: false,
                        align: 'right',
                        search: false,
                        formatter: sipLibrary.currencyFormatter
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
        caption: 'Presupuestos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        //editurl: '/contratos/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }

            var cm = $("#grid").jqGrid("getGridParam", "colModel");
            for (var i = 0; i < cm.length; i++) {
                //console.log(cm[i].name)
                $("#grid").jqGrid("setLabel", cm[i].name, "", { "text-align": "right" });
            }
        },
        //subGrid: true,
        //subGridRowExpanded: showSubGrids,
        //subGridOptions: {
        //    plusicon: "glyphicon-hand-right",
        //    minusicon: "glyphicon-hand-down"
        //},
    });

    $('#grid').navGrid("#pager", {
        search: true, // show search button on the toolbar
        add: false,
        edit: false,
        del: false,
        refresh: true
    });

}