$(document).ready(function () {

    var modelProyecto = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Sap', name: 'sap', width: 50, align: 'left', search: true },
        { label: 'Proyecto', name: 'nombreproyecto', width: 200, align: 'left', search: true },
        { label: 'PMO', name: 'pmo', width: 150, align: 'left', search: true },
        {
            label: 'Fecha Creacion', name: 'fechacreacion', width: 110, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }, editable: true,
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd' })
                }
            }
        },
        { label: 'Estado', name: 'estado', width: 100, align: 'left', search: true },
        {
            label: 'Fecha Vigencia', name: 'fechavigencia', width: 110, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }, editable: true,
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd' })
                }
            }
        },
        { label: 'Avance', name: 'avance', width: 100, align: 'left', search: true },
        {
            label: 'Fecha Ultimo Pago', name: 'fechaultpago', width: 110, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }, editable: true,
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd' })
                }
            }
        },
        {
            label: 'Fecha Pap', name: 'fechapap', width: 100, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }, editable: true,
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd' })
                }
            }
        },
        {
            label: 'Pre Gasto', name: 'pregasto', width: 150, align: 'right', search: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Pre Inversion', name: 'preinversion', width: 150, align: 'right', search: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Real Gasto', name: 'realgasto', width: 150, align: 'right', search: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
        {
            label: 'Real Inversion', name: 'realinversion', width: 150, align: 'right', search: true,
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
    ];
    $("#grid").jqGrid({
        url: '/proyectoslist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelProyecto,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Lista de proyectos',
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