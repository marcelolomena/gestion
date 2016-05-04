$(document).ready(function () {

    var modelContrato = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Contrato', name: 'nombrecontrato', width: 500, align: 'left', search: true, editable: true, formoptions: {rowpos:1,colpos:1} },
        {
            label: 'Fecha Inicio', name: 'fechainicontrato', width: 150, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }, editable: true, formoptions: {rowpos:1,colpos:2},
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd' })
                }
            }
        },
        {
            label: 'Fecha Termino', name: 'fechatercontrato', width: 150, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }, editable: true,
            formoptions: {rowpos:2,colpos:1},
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd' })
                }
            }
        },
        { label: 'Solicitud', name: 'solicitudcontrato', width: 100, align: 'left', search: true, editable: true, formoptions: {rowpos:2,colpos:2} },
        { label: 'Estado', name: 'estado', width: 180, align: 'left', search: true, editable: true, formoptions: {rowpos:3,colpos:1} },
        { label: 'Plazo', name: 'plazocontrato', width: 100, align: 'left', search: true, editable: true, formoptions: {rowpos:3,colpos:2} },
    ];
    $("#grid").jqGrid({
        url: '/contratoslist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelContrato,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Lista de contratos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap"
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });
    
    $('#grid').jqGrid('navGrid', "#pager", {
        search: false, // show search button on the toolbar
        add: true,
        edit: true,
        del: true,
        refresh: true
    });    

    $("#pager_left").css("width", "");
});