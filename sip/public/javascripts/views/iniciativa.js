$(document).ready(function () {

    var modelIniciativa = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Proyecto', name: 'nombre', width: 500, align: 'left', search: true, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        {
            label: 'División', name: 'divisionsponsor', width: 245, align: 'left', search: true, editable: true, 
        },
        {
            label: 'División', name: 'iddivision', editable: true,
            hidden: true,
            editrules: { edithidden: true },
            edittype: "select",
            formoptions: { rowpos: 1, colpos: 2 },
            editoptions: {
                dataUrl: '/divisiones',
                buildSelect: function (response) {
                    var grid = $("#jqGridIncident");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.program_name;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger División--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].program_name == thissid) {
                            s += '<option value="' + data[i].codDivision + '" selected>' + data[i].glosaDivision + '</option>';
                        } else {
                            s += '<option value="' + data[i].codDivision + '">' + data[i].glosaDivision + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            },
        },
        { label: 'Sponsor', name: 'sponsor1', width: 200, align: 'left', search: true, editable: true, formoptions: { rowpos: 2, colpos: 1 } },
        {
            label: 'Gerente', name: 'gerenteresponsable', width: 200, align: 'left', search: true, editable: true, formoptions: { rowpos: 2, colpos: 2 },
            editrules: { edithidden: true },
            edittype: "text",
            editoptions: {
                dataInit: function (element) {
                    window.setTimeout(function () {
                        $(element).width(200);
                        $(element).attr("autocomplete", "off").typeahead({
                            appendTo: "body",
                            source: function (request, response) {
                                $.ajax({
                                    url: '/gerentes',
                                    dataType: "json",
                                    data: { term: request },
                                    error: function (res, status) {
                                        alert(res.status + " : " + res.statusText + ". Status: " + status);
                                    },
                                    success: function (data) {
                                        response(data);
                                    }
                                });
                            }, displayText: function (item) {
                                return item.label;
                            }
                        });
                    }, 100);
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

    var modelIniciativaPrograma = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Art', name: 'codigoart', width: 100, align: 'center', search: false, editable: true, formoptions: { rowpos: 1, colpos: 1 } },
        { label: 'Nombre', name: 'nombre', width: 300, align: 'center', search: false, editable: true, formoptions: { rowpos: 1, colpos: 2 } },
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
        subGrid: true,
        subGridRowExpanded: gridIniciativaPrograma,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
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

    function gridIniciativaPrograma(parentRowID, parentRowKey) {
        var childGridID = parentRowID + "_table";
        var childGridPagerID = parentRowID + "_pager";
        var childGridURL = "/programa/" + parentRowKey;

        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "GET",
            datatype: "json",
            page: 1,
            colModel: modelIniciativaPrograma,
            viewrecords: true,
            styleUI: "Bootstrap",
            regional: 'es',
            height: 'auto',
            pager: "#" + childGridPagerID,
            gridComplete: function () {
                var recs = $("#" + childGridID).getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {

                    $("#" + childGridID).addRowData("blankRow", { "codigoart": "", "nombre": "No hay datos" });
                }
            }
        });

        $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, { add: true, edit: true, del: true, search: false, refresh: true });
    }

    $("#pager_iniciativa_left").css("width", "");
});