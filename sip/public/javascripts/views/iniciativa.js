$(document).ready(function () {

    var modelIniciativa = [
        { label: 'id', name: 'id', key: true, hidden: true },
        //{ label: 'Art', name: 'codigoart', width: 90, align: 'center', search: true, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'Proyecto', name: 'nombre', width: 500, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'División', name: 'divisionsponsor', width: 245, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
        { label: 'Sponsor', name: 'sponsor1', width: 200, align: 'left', search: true, editable: true, formoptions: { rowpos: 2, colpos: 1 } },
        {
            label: 'Gerente', name: 'gerenteresponsable', width: 200, align: 'left', search: true, editable: true, formoptions: { rowpos: 2, colpos: 2 },
            editrules: { edithidden: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/gerentes',
                buildSelect: function (response) {
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Gerente--</option>';
                    $.each(data, function (i, item) {
                        s += '<option value="' + data[i].uid + '">' + data[i].first_name + " " + data[i].last_name + '</option>';
                    });
                    return s + "</select>";
                }
            }
        },
        { label: 'PMO', name: 'pmoresponsable', width: 200, align: 'left', search: true, editable: true, formoptions: { rowpos: 3, colpos: 1 } },
        { label: 'Categoria', name: 'categoria', width: 180, align: 'left', search: true, editable: true, formoptions: { rowpos: 3, colpos: 2 } },
        { label: 'Año', name: 'ano', width: 50, align: 'left', search: false, editable: true, formoptions: { rowpos: 4, colpos: 1 } },
        { label: 'Q1', name: 'q1', width: 50, align: 'left', search: false, editable: true, formoptions: { rowpos: 4, colpos: 2 } },
        { label: 'Q2', name: 'q2', width: 50, align: 'left', search: false, editable: true, formoptions: { rowpos: 5, colpos: 1 } },
        { label: 'Q3', name: 'q3', width: 50, align: 'left', search: false, editable: true, formoptions: { rowpos: 5, colpos: 2 } },
        { label: 'Q4', name: 'q4', width: 50, align: 'left', search: false, editable: true, formoptions: { rowpos: 6, colpos: 1 } },
        {
            label: 'Presupuesto Estimado', name: 'pptoestimadousd', width: 150, align: 'right', search: true,
            formatter: 'number', formatoptions: { decimalPlaces: 2 }
        },
    ];
    $("#table_iniciativa").jqGrid({
        url: '/iniciativas/list',
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
        editurl: '/iniciativas/new',
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_iniciativa").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#table_iniciativa').jqGrid('navGrid', "#pager_iniciativa", { edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
        {
            height: 'auto',
            //width: 620,
            editCaption: "Modifica Iniciativa",
            recreateForm: true,
            closeAfterEdit: true,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }
        },
        {
            height: 'auto',
            //width: 620,
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/iniciativas/new',
            modal: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agrega Iniciativa",
            //template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
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