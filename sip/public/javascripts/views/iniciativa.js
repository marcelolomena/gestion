$(document).ready(function () {

    var modelIniciativa = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Art', name: 'codigoart', width: 90, align: 'center', search: false },
        { label: 'Proyecto', name: 'nombreproyecto', width: 500, align: 'left', search: true },
        { label: 'División', name: 'divisionsponsor', width: 245, align: 'left', search: true },
        { label: 'Sponsor', name: 'sponsor1', width: 200, align: 'left', search: true },
        { label: 'Gerente', name: 'gerenteresponsable', width: 200, align: 'left', search: true },
        { label: 'PMO', name: 'pmoresponsable', width: 200, align: 'left', search: true },
        { label: 'Categoria', name: 'categoria', width: 180, align: 'left', search: true },
        { label: 'Año', name: 'ano', width: 50, align: 'left', search: false },
        { label: 'Q1', name: 'q1', width: 25, align: 'left', search: false },
        { label: 'Q2', name: 'q2', width: 25, align: 'left', search: false },
        { label: 'Q3', name: 'q3', width: 25, align: 'left', search: false },
        { label: 'Q4', name: 'q4', width: 25, align: 'left', search: false },
        {
            label: 'Presupuesto Estimado', name: 'pptoestimadousd', width: 150, align: 'right', search: true,
            formatter: 'number', formatoptions: { decimalPlaces: 2 }
        },
    ];
    $("#table_iniciativa").jqGrid({
        url: '/iniciativaslist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelIniciativa,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Lista de iniciativas',
        pager: "#pager_iniciativa",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap"
    });
    $("#table_iniciativa").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

});