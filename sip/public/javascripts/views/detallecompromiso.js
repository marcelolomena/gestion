function gridDetail(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "child3.json";
    
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        colModel: [
            { label: 'id', name: 'id', key: true, hidden: true },
            { label: 'Período', name: 'periodo', width: 100 },
            { label: 'Monto', name: 'montopesos', width: 100 }
        ],
        pager: "#" + childGridPagerID,
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/contratos/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "periodo": "No hay datos" });
            }
        }
    });
    
    $('#' + childGridID).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").children("span.ui-jqgrid-title").css("background-color", "Gold");

    $("#" + childGridPagerID + "_left").css("width", "");    
}