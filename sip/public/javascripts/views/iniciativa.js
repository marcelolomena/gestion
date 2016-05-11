$(document).ready(function () {

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Proyecto {nombre}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>División {divisionsponsor}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Sponsor 1 {sponsor1}</div>";
    tmpl += "<div class='column-half'>Sponsor 2 {sponsor2}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>PMO {pmoresponsable}</div>";
    tmpl += "<div class='column-half'>Gerente {gerenteresponsable}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Tipo {tipo}</div>";
    tmpl += "<div class='column-half'>Categoría {categoria}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Q1 {q1}</div>";
    tmpl += "<div class='column-half'>Q2 {q2}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Q3 {q3}</div>";
    tmpl += "<div class='column-half'>Q4 {q4}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Fecha Comite {fechacomite}</div>";
    tmpl += "<div class='column-half'>Año {ano}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Presupuesto Gasto {pptoestimadogasto}</div>";
    tmpl += "<div class='column-half'>Presupuesto Inversión {pptoestimadoinversion}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";


    var tmplP = "<div id='responsive-form' class='clearfix'>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Proyecto {nombre}</div>";
    tmplP += "<div class='column-half'>Art {codigoart}</div>";
    tmplP += "</div>";
    /*
        tmplP += "<div class='form-row'>";
        tmplP += "<div class='column-full'>División {divisionsponsor}</div>";
        tmplP += "</div>";
    
        tmplP += "<div class='form-row'>";
        tmplP += "<div class='column-half'>Sponsor 1 {sponsor1}</div>";
        tmplP += "<div class='column-half'>Sponsor 2 {sponsor2}</div>";
        tmplP += "</div>";
    
        tmplP += "<div class='form-row'>";
        tmplP += "<div class='column-half'>PMO {pmoresponsable}</div>";
        tmplP += "<div class='column-half'>Gerente {gerenteresponsable}</div>";
        tmpl += "</div>";
    
        tmplP += "<div class='form-row'>";
        tmplP += "<div class='column-half'>Tipo {tipo}</div>";
        tmplP += "<div class='column-half'>Categoría {categoria}</div>";
        tmplP += "</div>";
    
        tmplP += "<div class='form-row'>";
        tmplP += "<div class='column-half'>Q1 {q1}</div>";
        tmplP += "<div class='column-half'>Q2 {q2}</div>";
        tmplP += "</div>";
    
        tmplP += "<div class='form-row'>";
        tmplP += "<div class='column-half'>Q3 {q3}</div>";
        tmplP += "<div class='column-half'>Q4 {q4}</div>";
        tmplP += "</div>";
    
        tmplP += "<div class='form-row'>";
        tmplP += "<div class='column-half'>Fecha Comite {fechacomite}</div>";
        tmplP += "<div class='column-half'>Año {ano}</div>";
        tmplP += "</div>";
    
        tmplP += "<div class='form-row'>";
        tmplP += "<div class='column-half'>Presupuesto Gasto {pptoestimadogasto}</div>";
        tmplP += "<div class='column-half'>Presupuesto Inversión {pptoestimadoinversion}</div>";
        tmplP += "</div>";
    */
    tmplP += "<hr style='width:100%;'/>";
    tmplP += "<div> {sData} {cData}  </div>";
    tmplP += "</div>";

    var modelIniciativa = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Proyecto', name: 'nombre', width: 500, align: 'left',
            search: true, editable: true, editrules: { required: true }, hidden: false
        },
        {
            label: 'División', name: 'iddivision', search: false, editable: false, hidden: true
        },
        {
            label: 'División', name: 'divisionsponsor', editable: true,
            width: 200, align: 'left', hidden: false,
            //editrules: { edithidden: true },
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
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Sponsor', name: 'uidsponsor1', search: false, editable: false, hidden: true
        },
        {
            label: 'Sponsor 1', name: 'sponsor1', width: 200, align: 'left', search: true,
            editable: true, hidden: false,
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
                            }, items: 100
                            , minLength: 2
                        });
                    }, 100);
                }
            }
        },
        {
            label: 'Sponsor 2', name: 'uidsponsor2', search: false, editable: false, hidden: true
        },
        {
            label: 'Sponsor 2', name: 'sponsor2', width: 200, align: 'left', search: true,
            editable: true, hidden: false,
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
        {
            label: 'Gerente', name: 'uidgerente', search: false, editable: false, hidden: true
        },
        {
            label: 'Gerente', name: 'gerenteresponsable', width: 200, align: 'left',
            search: true, editable: true, hidden: false,
            //editrules: { edithidden: true },
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
        { label: 'PMO', name: 'uidpmo', search: false, editable: false, hidden: true },
        {
            label: 'PMO', name: 'pmoresponsable', width: 200, align: 'left',
            search: true, editable: true, hidden: false,
            //editrules: { edithidden: true },
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
        { label: 'Tipo', name: 'idtipo', search: false, editable: false, hidden: true },
        { label: 'Tipo', name: 'tipo', width: 200, align: 'left', search: true, editable: true, hidden: false },
        { label: 'Categoria', name: 'idcategoria', search: false, editable: false, hidden: true },
        { label: 'Categoria', name: 'categoria', width: 100, align: 'left', search: true, editable: true, hidden: false },
        { label: 'Año', name: 'ano', width: 50, align: 'left', search: true, editable: true },
        { label: 'Año', name: 'anoq', search: false, editable: false, hidden: true },
        { label: 'Q1', name: 'q1', width: 50, align: 'left', search: true, editable: true, hidden: false },
        { label: 'Q2', name: 'q2', width: 50, align: 'left', search: true, editable: true, hidden: false },
        { label: 'Q3', name: 'q3', width: 50, align: 'left', search: true, editable: true, hidden: false },
        { label: 'Q4', name: 'q4', width: 50, align: 'left', search: true, editable: true, hidden: false },
        {
            label: 'Fecha Comite', name: 'fechacomite', width: 150, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            editable: true,
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $('#table_iniciativa')[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                }
            }
        },
        { label: 'Moneda', name: 'idmoneda', search: false, editable: false, hidden: true },
        {
            label: 'Presupuesto Gasto', name: 'pptoestimadogasto', width: 150, align: 'right',
            search: true, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 2 }
        },
        {
            label: 'Presupuesto Inversión', name: 'pptoestimadoinversion', width: 150, align: 'right',
            search: true, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 2 }
        },
        { label: 'Estado', name: 'idestado', search: false, editable: false, hidden: true },
    ];

    var modelIniciativaPrograma = [
        { label: 'id', name: 'id', key: true, hidden: true },
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
            //height: 'auto',
            //width: 620,
            closeAfterEdit: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/iniciativas/update',
            modal: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modifica Iniciativa",
            template: tmpl,
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
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/iniciativas/add',
            modal: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Agrega Iniciativa",
            template: tmpl,
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
            mtype: 'POST',
            url: '/iniciativas/del',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Iniciativa",
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


        $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, { edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
            {
                closeAfterEdit: true,
                recreateForm: true,
                mtype: 'POST',
                url: '/iniciativas/update',
                modal: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                editCaption: "Modifica Iniciativa Programa",
                template: tmplP,
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
                closeAfterAdd: true,
                recreateForm: true,
                mtype: 'POST',
                url: '/iniciativas/add',
                modal: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Agrega Iniciativa Programa",
                template: tmplP,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }, afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (result.error_code != 0)
                        return [false, result.error_text, ""];
                    else
                        return [true, "", ""]
                }, beforeShowForm: function (form) {
                    console.log("conchatumadere " + parentRowID);
                    $.ajax({
                        type: "GET",
                        url: '/iniciativas/' + parentRowID,
                        async: false,
                        success: function (data) {
                            $("#codigoart", form).val('201603');
                        }
                    });


                }
            },
            {
                mtype: 'POST',
                url: '/iniciativas/del',
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Elimina Iniciativa",
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
                recreateFilter: true
            }
        );

    }

    $("#pager_iniciativa_left").css("width", "");
});