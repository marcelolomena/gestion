function showChildGrid(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    var modelDetalleProyectosEnVuelo = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idproyectoenvuelo', name: 'idproyectoenvuelo', hidden: true },
        { label: 'Tarea', name: 'tarea', width: 50, align: 'left', search: true, editable: true },
        { label: 'Nombre', name: 'nombre', width: 150, align: 'left', search: true, editable: true },
        { label: 'idproveedor', name: 'idproveedor', search: false, hidden: true, editable: true },
        { label: 'Proveedor', name: 'nombreproveedor', width: 100, align: 'left', search: true, editable: true },
        { label: 'idcuenta', name: 'idcuenta', search: false, hidden: true, editable: true },
        { label: 'Cuenta', name: 'cuentacontable', width: 50, align: 'left', search: true, editable: true },
        { label: 'Presupuesto', name: 'presupuesto', width: 50, align: 'left', search: true, editable: true },
        { label: 'presupuestopesos', name: 'presupuestopesos', hidden: true, search: false, editable: true },
        { label: 'Compromiso', name: 'compromiso', width: 100, align: 'left', search: true, editable: true },
        { label: 'compromisopesos', name: 'compromisopesos', hidden: true, search: false, editable: true },
        { label: 'Real Ajustado', name: 'realajustado', width: 50, align: 'left', search: true, editable: true },
        { label: 'realajustadopesos', name: 'realajustadopesos', hidden: true, search: false, editable: true },
        { label: 'Saldo', name: 'saldotarea', width: 50, align: 'left', search: true, editable: true },
        { label: 'saldotareapesos', name: 'saldotareapesos', search: false, hidden: true, editable: true },
        { label: 'idcontrato', name: 'idcontrato', hidden: true, editable: true },
        { label: 'Contrato', name: 'numerocontrato', width: 100, align: 'left', search: true, editable: true },
        { label: 'Solicitud', name: 'solicitudcontrato', width: 100, align: 'left', search: true, editable: true },
    ];

    $("#" + childGridID).jqGrid({
        url: '/detalleenvuelo/' + parentRowKey,
        editurl: '/detalleenvuelo/action/' + parentRowKey,
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelDetalleProyectosEnVuelo,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Detalle de proyectos en vuelo',
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: showThirdLevelChildGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        pager: "#" + childGridPagerID
    });

}