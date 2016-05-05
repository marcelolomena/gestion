$(document).ready(function () {

    var modelIniciativa = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Art', name: 'codigoart', width: 90, align: 'center', search: true, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'Proyecto', name: 'nombreproyecto', width: 500, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'División', name: 'divisionsponsor', width: 245, align: 'left', search: true, editable: true, formoptions: { rowpos: 2, colpos: 1 } },
        { label: 'Sponsor', name: 'sponsor1', width: 200, align: 'left', search: true, editable: true, formoptions: { rowpos: 2, colpos: 2 } },
        { label: 'Gerente', name: 'gerenteresponsable', width: 200, align: 'left', search: true, editable: true, formoptions: { rowpos: 3, colpos: 1 } },
        { label: 'PMO', name: 'pmoresponsable', width: 200, align: 'left', search: true, editable: true, formoptions: { rowpos: 3, colpos: 2 } },
        { label: 'Categoria', name: 'categoria', width: 180, align: 'left', search: true, editable: true, formoptions: { rowpos: 4, colpos: 1 } },
        { label: 'Año', name: 'ano', width: 50, align: 'left', search: false, editable: true, formoptions: { rowpos: 4, colpos: 2 } },
        { label: 'Q1', name: 'q1', width: 25, align: 'left', search: false, editable: true, formoptions: { rowpos: 5, colpos: 1 } },
        { label: 'Q2', name: 'q2', width: 25, align: 'left', search: false, editable: true, formoptions: { rowpos: 5, colpos: 2 } },
        { label: 'Q3', name: 'q3', width: 25, align: 'left', search: false, editable: true, formoptions: { rowpos: 6, colpos: 1 } },
        { label: 'Q4', name: 'q4', width: 25, align: 'left', search: false, editable: true, formoptions: { rowpos: 6, colpos: 2 } },
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

    $('#table_iniciativa').jqGrid('navGrid', "#pager_iniciativa", { add: true, edit: true, del: true, refresh: true, search: false },
        {
            recreateForm: true,
            closeAfterEdit: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.reateJSON,
            editCaption: "Modifica Iniciativa",
            //template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            editCaption: "Agrega Iniciativa",
            //template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            recreateFilter: true
        }
    );

    $("#pager_iniciativa_left").css("width", "");
});