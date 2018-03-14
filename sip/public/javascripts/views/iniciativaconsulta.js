$(document).ready(function () {

    var modelIniciativa = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Iniciativa', name: 'Iniciativa', width: 400, align: 'left',
            search: true, editable: true, hidden: false
        },
        {
            label: 'Programa', name: 'nombre',
            search: true, editable: true, hidden: false
        },
        {
            label: 'Estado', name: 'estado', width: 200, align: 'left',
            search: true
        },
        {
            label: 'Proyecto', name: 'glosa', width: 150, align: 'left',
            search: true, editable: true, hidden: false
        },
        {
            label: 'Inscrita', name: 'Inscrita',
            search: false, editable: true, hidden: true
        },
        {
            label: 'Fecha Entrega', name: 'FechaEntrega', width: 150, align: 'left',
            search: false, editable: false, hidedlg: true,formatter: 'date', 
            formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' }
        },
        {
            label: 'PMO', name: 'pmoresponsable',
            search: true, editable: true
        }
    ];
    $("#table_iniciativa").jqGrid({
        url: '/iniciativasconsultalist',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelIniciativa,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        caption: 'Consulta de Iniciativas',
        autowidth: false,  // set 'true' here
        shrinkToFit: false, // well, it's 'true' by default
        pager: "#pager_iniciativa",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/iniciativas/action',
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_iniciativa").jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $('#table_iniciativa').jqGrid('navGrid', "#pager_iniciativa", {
        edit: false, add: false, del: false, search: false, refresh: true,
        cloneToTop: false
    }, 
    {},

        {
            recreateFilter: true
        }
    );

    $('#table_iniciativa').jqGrid('navButtonAdd', '#pager_iniciativa', {
        caption: "Excel",
        buttonicon: "silk-icon-page-excel",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#table_iniciativa');
            var rowKey = grid.getGridParam("selrow");
            var url = '/iniciativasconsultaexcel';
            $('#table_iniciativa').jqGrid('excelExport', { "url": url });
        }
    });
    $("#pager_iniciativa_left").css("width", "");
});