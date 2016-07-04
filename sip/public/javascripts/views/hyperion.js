$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    var currentYear = (new Date).getFullYear();
    $.ajax(
        {
            type: "GET",
            url: "/hyperion/list/" + currentYear,
            dataType: "json",
            success: function (JSONdata) {
                var listOfColumnModels = [];
                var listOfColumnNames = [];
                var data = JSONdata[0].detallepres[0].detalleplans;
                listOfColumnNames.push('Cuenta');
                listOfColumnNames.push('CUI Sección');
                listOfColumnNames.push('CUI Depto');
                listOfColumnNames.push('Periodo');

                listOfColumnModels.push({
                    name: 'cuentacontable',
                    width: 100,
                    sortable: true,
                    hidden: false,
                    search: true,
                    searchoptions: { sopt: ["eq", "le", "ge"] }
                });

                listOfColumnModels.push({
                    name: 'cui',
                    width: 100,
                    sortable: true,
                    hidden: false,
                    search: true,
                    stype: 'select',
                    searchoptions: {
                        sopt: ["eq"],
                        dataUrl: '/hyperion/listcui',
                        buildSelect: function (response) {
                            var data = JSON.parse(response);
                            var s = "<select>";
                            s += '<option value="0">--Escoger Cui--</option>';
                            $.each(data, function (i, item) {
                                s += '<option value="' + data[i].idcui + '">' + data[i].estructuracui.cui + '</option>';
                            });
                            return s + "</select>";
                        }
                    },

                });

                listOfColumnModels.push({
                    name: 'cuipadre',
                    width: 100,
                    sortable: true,
                    hidden: false,
                    search: false,
                    searchoptions: { sopt: ["eq", "le", "ge"] }
                });

                listOfColumnModels.push({
                    name: 'ano',
                    width: 100,
                    sortable: true,
                    hidden: true,
                    searchoptions: { searchhidden: true, sopt: ["eq", "le", "ge"] }
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
                        summaryType: 'sum',
                        formatter: sipLibrary.currencyFormatter
                    });
                });

                CreateJQGrid(currentYear, listOfColumnModels, listOfColumnNames);
            }
        });

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        //$("#grid").jqGrid("setGridWidth",$("#gcontainer").width() );
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});

function CreateJQGrid(currentYear, listOfColumnModels, listOfColumnNames) {
    $("#grid").jqGrid({
        url: '/hyperion/list/' + currentYear,
        mtype: "POST",
        datatype: "json",
        page: 1,
        colNames: listOfColumnNames,
        colModel: listOfColumnModels,
        rowNum: 50,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: "Hyperion",
        pager: "#pager",
        viewrecords: true,
        rowList: [50, 100, 1000],
        styleUI: "Bootstrap",
        //editurl: '/contratos/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {
                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
            /*
                        var cm = $("#grid").jqGrid("getGridParam", "colModel");
                        for (var i = 0; i < cm.length; i++) {
                            //console.log(cm[i].name)
                            $("#grid").jqGrid("setLabel", cm[i].name, "", { "text-align": "right" });
                        }
            */
        },
        //subGrid: true,
        //subGridRowExpanded: showSubGrids,
        //subGridOptions: {
        //    plusicon: "glyphicon-hand-right",
        //    minusicon: "glyphicon-hand-down"
        //},
        grouping: true,
        groupingView: {
            groupField: ["cuentacontable"],
            groupColumnShow: [true],
            groupText: ["<b>{0}</b>"],
            groupOrder: ["asc"],
            groupSummary: [true],
            groupCollapse: false
        }
    });

    $('#grid').jqGrid('navGrid', '#pager', {
        edit: false,
        add: false,
        del: false
    },
        {},
        {},
        {},
        { closeAfterSearch: true });

    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/hyperion/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

}