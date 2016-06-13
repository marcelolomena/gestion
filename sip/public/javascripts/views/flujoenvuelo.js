function showThirdLevelChildGrid(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    var modelFlujoEnVuelo = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'iddetalleenvuelo', name: 'iddetalleenvuelo', hidden: true },
        { label: 'Periodo', name: 'periodo', width: 50, align: 'left', search: true, editable: true },
        { label: 'idmoneda', name: 'idmoneda', search: false, hidden: true, editable: true },
        { label: 'Presupuesto', name: 'presupuestoorigen', width: 150, align: 'left', search: true, editable: true },
        { label: 'presupuestopesos', name: 'presupuestopesos', search: false, hidden: true, editable: true },

    ];

    $("#" + childGridID).jqGrid({
        url: '/flujoenvuelo/' + parentRowKey,
        editurl: '/flujoenvuelo/action/' + parentRowKey,
        mtype: "POST",
        datatype: "json",
        colModel: modelFlujoEnVuelo,
        page: 1,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Flujo de proyectos en vuelo',
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        pager: "#" + childGridPagerID,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },

    });

}
