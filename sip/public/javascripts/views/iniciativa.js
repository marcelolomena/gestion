$(document).ready(function () {

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Proyecto {nombre}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>División {iddivision}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Sponsor 1 {sponsor1}</div>";
    tmpl += "<div class='column-half'>Sponsor 2 {sponsor2}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>PMO {uidpmo}</div>";
    tmpl += "<div class='column-half'>Gerente {uidgerente}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Estado {idestado}</div>";
    tmpl += "<div class='column-half'>Categoría {idcategoria}</div>";
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
    tmpl += "<div class='column-half'>Fecha Último Comité {fechacomite}</div>";
    tmpl += "<div class='column-half'>Año {ano}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Presupuesto Gasto (USD) {pptoestimadogasto}</div>";
    tmpl += "<div class='column-half'>Presupuesto Inversión (USD) {pptoestimadoinversion}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>estado {estado}</div>";
    tmpl += "<div class='column-half'>categoria {categoria}</div>";
    tmpl += "<div class='column-half'>pmoresponsable {pmoresponsable}</div>";
    tmpl += "<div class='column-half'>gerenteresponsable {gerenteresponsable}</div>";
    tmpl += "<div class='column-half'>divisionsponsor {divisionsponsor}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";


    var tmplP = "<div id='responsive-form' class='clearfix'>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Proyecto {nombre}</div>";
    tmplP += "<div class='column-half'>Art {codigoart}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>División {iddivision}</div>";
    tmplP += "<div class='column-half'>Programas {program_id}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Sponsor 1 {sponsor1}</div>";
    tmplP += "<div class='column-half'>Sponsor 2 {sponsor2}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>PMO {uidpmo}</div>";
    tmplP += "<div class='column-half'>Gerente {uidgerente}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Estado {idestado}</div>";
    tmplP += "<div class='column-half'>Categoría {idcategoria}</div>";
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
    tmplP += "<div class='column-half'>Fecha Último Comité {fechacomite}</div>";
    tmplP += "<div class='column-half'>Año {ano}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Presupuesto Gasto {pptoestimadogasto}</div>";
    tmplP += "<div class='column-half'>Presupuesto Inversión {pptoestimadoinversion}</div>";
    tmplP += "</div>";
    
    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Presupuesto Estimado {pptoestimadoprevisto}</div>";
    tmplP += "</div>";
    
    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Subcategoría {subcategoria}</div>";
    tmplP += "<div class='column-half'>Duración Prevista {duracionprevista}</div>";
    tmplP += "</div>";
    
    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Mes inicio Proyectado {mesinicioprevisto}</div>";
    tmplP += "<div class='column-half'>Año inicio Proyectado {anoinicioprevisto}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row' style='display: none;'>";
    tmplP += "<div class='column-half'>estado {estado}</div>";
    tmplP += "<div class='column-half'>categoria {categoria}</div>";
    tmplP += "<div class='column-half'>pmoresponsable {pmoresponsable}</div>";
    tmplP += "<div class='column-half'>gerenteresponsable {gerenteresponsable}</div>";
    tmplP += "<div class='column-half'>divisionsponsor {divisionsponsor}</div>";
    tmplP += "</div>";

    tmplP += "<hr style='width:100%;'/>";
    tmplP += "<div> {sData} {cData}  </div>";
    tmplP += "</div>";

    var tmplPF = "<div id='responsive-form' class='clearfix'>";

    tmplPF += "<div class='form-row'>";
    tmplPF += "<div class='column-half'>Tipo Fecha {idtipofecha}</div>";
    tmplPF += "<div class='column-half'>Fecha {fecha}</div>";
    tmplPF += "</div>";
    
    tmplPF += "<div class='form-row' style='display: none;'>";
    tmplPF += "<div class='column-half'>tipofecha {tipofecha}</div>";
    tmplPF += "</div>";

    tmplPF += "<hr style='width:100%;'/>";
    tmplPF += "<div> {sData} {cData}  </div>";
    tmplPF += "</div>";

    var modelIniciativa = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Proyecto', name: 'nombre', width: 500, align: 'left',
            search: true, editable: true, editrules: { required: true }, hidden: false
        },
        {
            label: 'División', name: 'iddivision', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/divisiones',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.divisionsponsor;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger División--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].division == thissid) {
                            s += '<option value="' + data[i].dId + '" selected>' + data[i].division + '</option>';
                        } else {
                            s += '<option value="' + data[i].dId + '">' + data[i].division + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#divisionsponsor").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'División', name: 'divisionsponsor', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
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
                        $(element).attr("autocomplete", "off").typeahead({
                            appendTo: "body",
                            source: function (request, response) {
                                $.ajax({
                                    url: '/personal',
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
                        //$(element).width(200);
                        $(element).attr("autocomplete", "off").typeahead({
                            appendTo: "body",
                            source: function (request, response) {
                                $.ajax({
                                    url: '/personal',
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
            label: 'Gerente', name: 'uidgerente', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Gerente',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidgerente;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Gerente--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#gerenteresponsable").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Gerente', name: 'gerenteresponsable', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'PMO', name: 'uidpmo', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/PMO',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidpmo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger PMO--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#pmoresponsable").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'PMO', name: 'pmoresponsable', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        { label: 'Tipo', name: 'idtipo', search: false, editable: false, hidden: true },
        { label: 'Tipo', name: 'tipo', width: 200, align: 'left', search: false, editable: false, hidden: true },
        {
            label: 'Categoria', name: 'idcategoria', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/parameters/categoria',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.tipo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Categoría--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#categoria").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Categoria', name: 'categoria', width: 150, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Estado', name: 'estado', width: 150, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Año', name: 'ano', width: 150, align: 'left', search: true, editable: true,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });

                }
            }, searchoptions: {
                // show search options
                sopt: ["ge", "le", "eq"] // ge = greater or equal to, le = less or equal to, eq = equal to
            }
        },
        { label: 'Año', name: 'anoq', search: false, editable: false, hidden: true },
        { label: 'Q1', name: 'q1', width: 100, align: 'left', search: false, editable: true, hidden: false },
        { label: 'Q2', name: 'q2', width: 100, align: 'left', search: false, editable: true, hidden: false },
        { label: 'Q3', name: 'q3', width: 100, align: 'left', search: false, editable: true, hidden: false },
        { label: 'Q4', name: 'q4', width: 100, align: 'left', search: false, editable: true, hidden: false },
        {
            label: 'Fecha Último Comite', name: 'fechacomite', width: 150, align: 'left', search: false,
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
                    $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                    $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                }
            }
        },
        { label: 'Moneda', name: 'idmoneda', search: true, editable: false, hidden: true },
        {
            label: 'Presupuesto Gasto (US$)', name: 'pptoestimadogasto', width: 150, align: 'right',
            search: false, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Presupuesto Inversión (US$)', name: 'pptoestimadoinversion', width: 150, align: 'right',
            search: false, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Estado', name: 'idestado', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/parameters/estadoiniciativa',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.divisionsponsor;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Estado--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#estado").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
    ];

    $("#table_iniciativa").jqGrid({
        url: '/iniciativas/list',
        mtype: "POST",
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
        editurl: '/iniciativas/action',
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
            editCaption: "Modifica Iniciativa",
            closeAfterEdit: true,
            recreateForm: true,
            //mtype: 'POST',
            //url: '/iniciativas/update',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
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
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_iniciativa').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_iniciativa").attr('id'));
            }
        },
        {
            addCaption: "Agrega Iniciativa",
            closeAfterAdd: true,
            recreateForm: true,
            //mtype: 'POST',
            //url: '/iniciativas/add',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.iddivision == 0) {
                    return [false, "División: Debe escoger un valor", ""];
                } if (postdata.uidgerente == 0) {
                    return [false, "Gerente: Debe escoger un valor", ""];
                } if (postdata.uidpmo == 0) {
                    return [false, "PMO: Debe escoger un valor", ""];
                } if (postdata.idestado == 0) {
                    return [false, "Estado: Debe escoger un valor", ""];
                } if (postdata.idcategoria == 0) {
                    return [false, "Categoría: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $("#table_iniciativa").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_iniciativa').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_iniciativa").attr('id'));
            }
        },
        {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
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

    $('#table_iniciativa').jqGrid('navButtonAdd', '#pager_iniciativa', {
        caption: "Excel",
        buttonicon: "silk-icon-page-excel",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#table_iniciativa');
            var rowKey = grid.getGridParam("selrow");
            var url = '/iniciativasexcel';
            $('#table_iniciativa').jqGrid('excelExport', { "url": url });
        }
    });

    function gridIniciativaPrograma(parentRowID, parentRowKey) {
        var childGridID = parentRowID + "_table";
        var childGridPagerID = parentRowID + "_pager";
        var childGridURL = "/iniciativaprograma/" + parentRowKey;

        var modelIniciativaPrograma = [
            { label: 'id', name: 'id', key: true, hidden: true },
            {
                label: 'program_id', name: 'program_id', hidden: true, editable: true,
                width: 200, align: 'left',
                editrules: { edithidden: true },
                edittype: "select",
                editoptions: {
                    dataUrl: '/programas',
                    buildSelect: function (response) {
                        var grid = $("#" + childGridID);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.program_name;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Programa--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].program_name == thissid) {
                                s += '<option value="' + data[i].program_id + '" selected>' + data[i].program_name + '</option>';
                            } else {
                                s += '<option value="' + data[i].program_id + '">' + data[i].program_name + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var thispid = $(this).val();
                            if(thispid!="0"){
                                $.ajax({
                                    type: "GET",
                                    url: '/programa/' + thispid,
                                    async: false,
                                    success: function (data) {
                                        $("input#codigoart").val(data.program_code);
                                    }
                                });
                            }else{
                                $("input#codigoart").val(null);
                            }
                        }
                    }],
                }, dataInit: function (elem) { $(elem).width(200); }
            },
            { label: 'Art', name: 'codigoart', width: 100, align: 'center', search: false, editable: true, editrules: { required: false } },
            {
                label: 'Proyecto', name: 'nombre', width: 500, align: 'left',
                search: true, editable: true, editrules: { required: false }, hidden: false
            },
            {
                label: 'División', name: 'iddivision', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/divisiones',
                    buildSelect: function (response) {
                        var grid = $("#" + childGridID);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.divisionsponsor;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger División--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].division == thissid) {
                                s += '<option value="' + data[i].idRRHH + '" selected>' + data[i].division + '</option>';
                            } else {
                                s += '<option value="' + data[i].idRRHH + '">' + data[i].division + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#divisionsponsor").val($('option:selected', this).text());
                            var idRRHH = $('option:selected', this).val()
                            if(idRRHH!="0"){
                                $.ajax({
                                    type: "GET",
                                    url: '/programas/' + idRRHH,
                                    async: false,
                                    success: function (data) {
                                        var grid = $("#" + childGridID);
                                        var rowKey = grid.getGridParam("selrow");
                                        var rowData = grid.getRowData(rowKey);
                                        var thissid = rowData.program_name;
                                        var s = "<select>";//el default
                                        s += '<option value="0">--Escoger Programa--</option>';
                                         $.each(data, function (i, item) {
                                            if (data[i].program_name == thissid) {
                                                 s += '<option value="' + data[i].program_id + '" selected>' + data[i].program_name + '</option>';
                                            } else {
                                                s += '<option value="' + data[i].program_id + '">' + data[i].program_name + '</option>';
                                             }
                                         });
                                            s +="</select>";
                                            $("select#program_id").html(s);
                                        $("input#codigoart").val(data.program_code);
                                    }
                                });
                            }else{
                                $("input#codigoart").val(null);
                            }
                            
                        }
                    }],
                }, dataInit: function (elem) { $(elem).width(200); }

            },
            {
                label: 'División', name: 'divisionsponsor', width: 200, align: 'left', search: true, editable: true,
                editrules: { edithidden: false }, hidedlg: true
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
                            $(element).attr("autocomplete", "off").typeahead({
                                appendTo: "body",
                                source: function (request, response) {
                                    $.ajax({
                                        url: '/personal',
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
                            $(element).attr("autocomplete", "off").typeahead({
                                appendTo: "body",
                                source: function (request, response) {
                                    $.ajax({
                                        url: '/personal',
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
                label: 'Gerente', name: 'uidgerente', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/usuarios_por_rol/Gerente',
                    buildSelect: function (response) {
                        var grid = $("#" + childGridID);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.uidgerente;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Gerente--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].uid == thissid) {
                                s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                            } else {
                                s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#gerenteresponsable").val($('option:selected', this).text());
                        }
                    }],
                }, dataInit: function (elem) { $(elem).width(200); }
            },
            {
                label: 'Gerente', name: 'gerenteresponsable', width: 200, align: 'left', search: true, editable: true,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'PMO', name: 'uidpmo', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/usuarios_por_rol/PMO',
                    buildSelect: function (response) {
                        var grid = $("#" + childGridID);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.uidpmo;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger PMO--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].uid == thissid) {
                                s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                            } else {
                                s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#pmoresponsable").val($('option:selected', this).text());
                        }
                    }],
                }, dataInit: function (elem) { $(elem).width(200); }
            },
            {
                label: 'PMO', name: 'pmoresponsable', width: 200, align: 'left', search: true, editable: true,
                editrules: { edithidden: false }, hidedlg: true
            },
            { label: 'Tipo', name: 'idtipo', search: false, editable: false, hidden: true },
            { label: 'Tipo', name: 'tipo', width: 200, align: 'left', search: false, editable: false, hidden: true },
            {
                label: 'Categoria', name: 'idcategoria', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/categoria',
                    buildSelect: function (response) {
                        var grid = $("#" + childGridID);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.categoria;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Categoría--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].nombre == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#categoria").val($('option:selected', this).text());
                        }
                    }],
                }, dataInit: function (elem) { $(elem).width(200); }
            },
            {
                label: 'Categoria', name: 'categoria', width: 150, align: 'left', search: true, editable: true,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Estado', name: 'estado', width: 150, align: 'left', search: true, editable: true,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Año', name: 'ano', width: 50, align: 'left', search: false, editable: true,
                editoptions: {
                    dataInit: function (element) {
                        $(element).mask("0000", { placeholder: "____" });

                    }
                }
            },
            { label: 'Año', name: 'anoq', search: false, editable: false, hidden: true },
            { label: 'Q1', name: 'q1', width: 100, align: 'left', search: false, editable: true, hidden: false },
            { label: 'Q2', name: 'q2', width: 100, align: 'left', search: false, editable: true, hidden: false },
            { label: 'Q3', name: 'q3', width: 100, align: 'left', search: false, editable: true, hidden: false },
            { label: 'Q4', name: 'q4', width: 100, align: 'left', search: false, editable: true, hidden: false },
            {
                label: 'Fecha Último Comité', name: 'fechacomite', width: 150, align: 'left', search: false,
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
                                    $("#" + childGridID)[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ["eq", "le", "ge"]
                },
                editoptions: {
                    size: 10, maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                        $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                    }
                }
            },
            { label: 'Moneda', name: 'idmoneda', search: false, editable: false, hidden: true },
            {
                label: 'Presupuesto Gasto (US$)', name: 'pptoestimadogasto', width: 170, align: 'right',
                search: true, editable: true, hidden: false,
                formatter: 'number', formatoptions: { decimalPlaces: 2 },
                editoptions: {
                    dataInit: function (el) {
                        $(el).mask('000.000.000.000.000,00', { reverse: true });
                    }
                }
            },
            {
                label: 'Presupuesto Inversión (US$)', name: 'pptoestimadoinversion', width: 190, align: 'right',
                search: true, editable: true, hidden: false,
                formatter: 'number', formatoptions: { decimalPlaces: 2 },
                editoptions: {
                    dataInit: function (el) {
                        $(el).mask('000.000.000.000.000,00', { reverse: true });
                    }
                }
            },
            {
                label: 'Presupuesto Estimado Total (US$)', name: 'pptoestimadoprevisto', width: 225, align: 'left',
                search: true, editable: true, hidden: false,
                formatter: 'number', formatoptions: { decimalPlaces: 2 },
                editoptions: {
                    dataInit: function (el) {
                        $(el).mask('000.000.000.000.000,00', { reverse: true });
                    }
                }
            },
            {
                label: 'Estado', name: 'idestado', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/estadoiniciativa',
                    buildSelect: function (response) {
                        var grid = $("#" + childGridID);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.estado;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Estado--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].nombre == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#estado").val($('option:selected', this).text());
                        }
                    }],
                }, dataInit: function (elem) { $(elem).width(200); }
            },
            {
                label: 'Duracion', name: 'duracion', width: 78, align: 'left', search: true, editable: false,
                editrules: { edithidden: false }, hidedlg: true
            },
            { label: 'Subcategoría', name: 'subcategoria', width: 200, align: 'left', search: false, editable: true, hidden: false },
            { label: 'Duración Prevista', name: 'duracionprevista', width: 125, align: 'left', search: false, editable: true, hidden: false },
            { label: 'Mes Inicio', name: 'mesinicioprevisto', width: 84, align: 'left', search: false, editable: true, hidden: false },
            { label: 'Año Inicio', name: 'anoinicioprevisto', width: 82, align: 'left', search: false, editable: true, hidden: false }
        ];

        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "POST",
            datatype: "json",
            page: 1,
            colModel: modelIniciativaPrograma,
            viewrecords: true,
            styleUI: "Bootstrap",
            subGrid: true,
            subGridRowExpanded: gridIniciativaFecha,
            subGridOptions: {
                plusicon: "glyphicon-hand-right",
                minusicon: "glyphicon-hand-down"
            },
            regional: 'es',
            height: 'auto',
            pager: "#" + childGridPagerID,
            editurl: '/iniciativaprograma/action',
            gridComplete: function () {
                var recs = $("#" + childGridID).getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {

                    $("#" + childGridID).addRowData("blankRow", { "codigoart": "", "nombre": "No hay datos" });
                }
            }
        });

        $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
            edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
        },
            {
                closeAfterEdit: true,
                recreateForm: true,
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
                }, beforeShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                    $('input#codigoart', form).attr('readonly', 'readonly');
                }, afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                }
            },
            {
                closeAfterAdd: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Agregar Iniciativa Programa",
                template: tmplP,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                },
                onclickSubmit: function (rowid) {
                    return { parent_id: parentRowKey };
                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (result.error_code != 0)
                        return [false, result.error_text, ""];
                    else
                        return [true, "", ""]
                }, beforeShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                    $.ajax({
                        type: "GET",
                        url: '/iniciativas/' + parentRowKey,
                        async: false,
                        recreateForm:true,
                        success: function (data) {
                            $("#nombre", form).val(data.nombre);
                            $("#sponsor1", form).val(data.sponsor1);
                            $("#sponsor2", form).val(data.sponsor2);
                            $("#q1", form).val(data.q1);
                            $("#q2", form).val(data.q2);
                            $("#q3", form).val(data.q3);
                            $("#q4", form).val(data.q4);
                            if(data.fechacomite){
                                var fecha = new Date(data.fechacomite);
                                $("#fechacomite", form).val(fecha.toISOString().substr(0,10));
                            }
                            $("#ano", form).val(data.ano);
                            if(data.pptoestimadogasto){
                                $("#pptoestimadogasto", form).val(data.pptoestimadogasto.toFixed(2).toString().replace(".", ","));
                            }
                            if(data.pptoestimadoinversion){
                                $("#pptoestimadoinversion", form).val(data.pptoestimadoinversion.toFixed(2).toString().replace(".", ","));
                            }
                            setTimeout(function(){$("#iddivision option[value="+data.iddivision+"]", form).attr("selected",true);},2000)
                            setTimeout(function(){$("#uidpmo option[value="+data.uidpmo+"]", form).attr("selected",true);},2000)
                            setTimeout(function(){$("#uidgerente option[value="+data.uidgerente+"]", form).attr("selected",true);},2000)
                            setTimeout(function(){$("#idestado option[value="+data.idestado+"]", form).attr("selected",true);},2000)
                            setTimeout(function(){$("#idcategoria option[value="+data.idcategoria+"]", form).attr("selected",true);},2000)
                            
                            setTimeout(function(){$("#divisionsponsor", form).val(data.divisionsponsor);},2000);
                            setTimeout(function(){$("#pmoresponsable", form).val(data.pmoresponsable);},2000);
                            setTimeout(function(){$("#gerenteresponsable", form).val(data.gerenteresponsable);},2000);
                            setTimeout(function(){$("#estado", form).val(data.estado);},2000);
                            setTimeout(function(){$("#categoria", form).val(data.categoria);},2000);
                        }
                    });
                    $.ajax({
                        type: "GET",
                        url: '/iniciativasprograma/codigoart/' + parentRowKey,
                        async: false,
                        success: function (data) {
                            if (data.error_code == 0)
                                $("#codigoart", form).val(data.codigoart);
                        }
                    });
                    $('input#codigoart', form).attr('readonly', 'readonly');
                }, afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                }
            },
            {
                closeAfterDelete: true,
                recreateForm: true,
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
    function gridIniciativaFecha(parentRowID, parentRowKey) {
        var childGridID = parentRowID + "_table";
        var childGridPagerID = parentRowID + "_pager";
        var childGridURL = "/iniciativafecha/" + parentRowKey;

        var modelIniciativaFecha = [
            { label: 'id', name: 'id', key: true, hidden: true },
         
            {
                label: 'Tipo Fecha', name: 'idtipofecha', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/parameters/tipofecha',
                    buildSelect: function (response) {
                        var grid = $("#" + childGridID);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.tipofecha;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Tipo de Fecha--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].nombre == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            $("input#tipofecha").val($('option:selected', this).text());
                        }
                    }],
                }, dataInit: function (elem) { $(elem).width(200); }
            },
            {
                label: 'Tipo Fecha', name: 'tipofecha', width: 400, align: 'left', search: true, editable: true,
                editrules: { edithidden: false }, hidedlg: true
            },
            {
                label: 'Fecha', name: 'fecha', width: 120, align: 'left', search: false,
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
                                    $("#" + childGridID)[0].triggerToolbar();
                                }, 100);
                            }
                        });
                    },
                    sopt: ["eq", "le", "ge"]
                },
                editoptions: {
                    size: 10, maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask("0000-00-00", { placeholder: "____-__-__" });
                        $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                    }
                }
            },
        ];

        $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


        $("#" + childGridID).jqGrid({
            url: childGridURL,
            mtype: "POST",
            datatype: "json",
            page: 1,
            colModel: modelIniciativaFecha,
            viewrecords: true,
            styleUI: "Bootstrap",
            regional: 'es',
            height: 'auto',
            pager: "#" + childGridPagerID,
            editurl: '/iniciativafecha/action',
            gridComplete: function () {
                var recs = $("#" + childGridID).getGridParam("reccount");
                if (isNaN(recs) || recs == 0) {

                    $("#" + childGridID).addRowData("blankRow", { "id": 0,"tipofecha": "No hay datos", "fecha": "" });
                }
            }
        });

        $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
            edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
        },
            {
                closeAfterEdit: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                editCaption: "Modificar Fecha Crítica",
                template: tmplPF,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                }, 
                beforeSubmit: function (postdata, formid) {
                    if (postdata.tipofecha == "--Escoger Tipo de Fecha--") {
                        return [false, "Tipo Fecha: Debe agregar un tipo de fecha", ""];
                    } if (postdata.fecha == 0) {
                        return [false, "Fecha: Debe agregar una fecha", ""];
                    } else {
                        return [true, "", ""]
                    }                    
                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (result.error_code != 0)
                        return [false, result.error_text, ""];
                    else
                        $.ajax({
                        type: "GET",
                        url: '/actualizaduracion/'+parentRowKey,
                        async: false,
                        success: function (data) {
                             return [true, "", ""]
                        }
                    });
                        return [true, "", ""]
                },
                 beforeShowForm: function (form) {
                        var grid = $("#" + childGridID);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.id;
                    if(thissid==0){
                        alert("Debe seleccionar una fila");
                        return [false, result.error_text, ""];
                    }
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                    //$('input#codigoart', form).attr('readonly', 'readonly');
                }, afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                }
            },
            {
                closeAfterAdd: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Agregar Fecha Crítica",
                template: tmplPF,
                errorTextFormat: function (data) {
                    return 'Error: ' + data.responseText
                },
                onclickSubmit: function (rowid) {
                    return { parent_id: parentRowKey };
                },
                beforeSubmit: function (postdata, formid) {
                    var fechamal = false;
                    var fechamala = "";
                    $.ajax({
                        type: "POST",
                        url: childGridURL,
                        async: false,
                        success: function (data) {
                            $.each(data.rows, function (i, item) {
                                if(data.rows[i].fecha>postdata.fecha){
                                    fechamal=true;
                                    fechamala=data.rows[i].fecha;
                                }
                            });
                        }
                    });
                    if(fechamal){
                        return [false, "Fecha: La fecha debe ser mayor a la última ingresada ("+fechamala.substr(0,10)+")", ""];
                    }
                    
                    if (postdata.tipofecha == "--Escoger Tipo de Fecha--") {
                        return [false, "Tipo Fecha: Debe agregar un tipo de fecha", ""];
                    } if (postdata.fecha == 0) {
                        return [false, "Fecha: Debe agregar una fecha", ""];
                    } else {
                        return [true, "", ""]
                    }                    
                },
                afterSubmit: function (response, postdata) {
                    var json = response.responseText;
                    var result = JSON.parse(json);
                    if (result.error_code != 0)
                        return [false, result.error_text, ""];
                    else
                        $.ajax({
                        type: "GET",
                        url: '/actualizaduracion/'+parentRowKey,
                        async: false,
                        success: function (data) {
                             return [true, "", ""]
                        }
                    });
                        return [true, "", ""]
                }, beforeShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                    //$('input#codigoart', form).attr('readonly', 'readonly');
                }, afterShowForm: function (form) {
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                }
            },
            {
                closeAfterDelete: true,
                recreateForm: true,
                ajaxEditOptions: sipLibrary.jsonOptions,
                serializeEditData: sipLibrary.createJSON,
                addCaption: "Eliminar Fecha Crítica",
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