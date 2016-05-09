$(document).ready(function () {

    var modelErogaciones = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'SAP', name: 'sap', width: 90, align: 'center', search: false },
        { label: 'Proveedor', name: 'razonsocial', width: 500, align: 'left', search: true },
        { label: 'Factura', name: 'factura', width: 245, align: 'left', search: true },
        { label: 'Fecha Factura', name: 'fechafactura', width: 200, align: 'left', search: true },
        { label: 'Fecha Contabilizacion', name: 'fechacontabilizacion', width: 200, align: 'left', search: true },
        { label: 'Cuenta Contable', name: 'cuentacontable', width: 200, align: 'left', search: true },
        { label: 'Codigo Tarea', name: 'codigotarea', width: 180, align: 'left', search: true },
        { label: 'Moneda', name: 'moneda', width: 50, align: 'left', search: true },
        { label: 'Monto Periodo', name: 'montoperiodo', width: 25, align: 'left', search: false },
        { label: 'Monto Pesos', name: 'montopesos', width: 25, align: 'left', search: false },
        {
            label: 'Erogaciones del Proyecto', name: 'erogaciones', width: 150, align: 'right', search: true,
            formatter: 'number', formatoptions: { decimalPlaces: 2 }
        },
    ];
    $("#table_erogaciones").jqGrid({
        url: '/erogacioneslist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelErogaciones,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Lista de Erogaciones',
        pager: "#pager_erogaciones",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap"
    });
    $("#table_erogaciones").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

});