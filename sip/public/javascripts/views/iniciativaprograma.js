function gridIniciativaPrograma(parentRowID, parentRowKey) {
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
    tmplP += "<div class='column-four'>Q1 {q1}</div>";
    tmplP += "<div class='column-four'>Q2 {q2}</div>";
    tmplP += "<div class='column-four'>Q3 {q3}</div>";
    tmplP += "<div class='column-four'>Q4 {q4}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Subcategoría {idsubcategoria}</div>";
    tmplP += "<div class='column-four'>Año {ano}</div>";
    tmplP += "<div class='column-four'>Duración Prev. {duracionprevista}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-three'>Presupuesto Gasto {pptoestimadogasto}</div>";
    tmplP += "<div class='column-three'>Presupuesto Inversión {pptoestimadoinversion}</div>";
    tmplP += "<div class='column-three'>Presupuesto Estimado {pptoestimadoprevisto}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-three'>Fecha Último Comité {fechacomite}</div>";
    tmplP += "<div class='column-three'>Mes inicio Proyectado {mesinicioprevisto}</div>";
    tmplP += "<div class='column-three'>Año inicio Proyectado {anoinicioprevisto}</div>";
    tmplP += "</div>";


    tmplP += "<div class='form-row' style='display: none;'>";
    tmplP += "<div class='column-half'>estado {estado}</div>";
    tmplP += "<div class='column-half'>categoria {categoria}</div>";
    tmplP += "<div class='column-half'>subcategoria {subcategoria}</div>";
    tmplP += "<div class='column-half'>pmoresponsable {pmoresponsable}</div>";
    tmplP += "<div class='column-half'>gerenteresponsable {gerenteresponsable}</div>";
    tmplP += "<div class='column-half'>divisionsponsor {divisionsponsor}</div>";
    tmplP += "</div>";

    tmplP += "<hr style='width:100%;'/>";
    tmplP += "<div> {sData} {cData}  </div>";
    tmplP += "</div>";
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/iniciativaprograma/" + parentRowKey;

    var modelIniciativaPrograma = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'program_id', name: 'program_id', hidden: true, editable: true,
            width: 150, align: 'left',
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
                        if (thispid != "0") {
                            $.ajax({
                                type: "GET",
                                url: '/programa/' + thispid,
                                async: false,
                                success: function (data) {
                                    $("input#codigoart").val(data.program_code);
                                }
                            });
                        } else {
                            $("input#codigoart").val(null);
                        }
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        { label: 'Art', name: 'codigoart', width: 150, align: 'center', search: false, editable: true, editrules: { required: false } },
        {
            label: 'Proyecto', name: 'nombre', width: 400, align: 'left',
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
                        if (idRRHH != "0") {
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
                                    s += "</select>";
                                    $("select#program_id").html(s);
                                    $("input#codigoart").val(data.program_code);
                                }
                            });
                        } else {
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
            label: 'Sponsor 1', name: 'sponsor1', width: 150, align: 'left', search: true,
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
            label: 'Sponsor 2', name: 'sponsor2', width: 150, align: 'left', search: true,
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
            label: 'Gerente', name: 'gerenteresponsable', width: 150, align: 'left', search: true, editable: true,
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
            label: 'PMO', name: 'pmoresponsable', width: 150, align: 'left', search: true, editable: true,
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
        { label: 'Q1', name: 'q1', width: 50, align: 'left', search: false, editable: true, hidden: false },
        { label: 'Q2', name: 'q2', width: 50, align: 'left', search: false, editable: true, hidden: false },
        { label: 'Q3', name: 'q3', width: 50, align: 'left', search: false, editable: true, hidden: false },
        { label: 'Q4', name: 'q4', width: 50, align: 'left', search: false, editable: true, hidden: false },
        {
            label: 'Fecha Último Comité', name: 'fechacomite', width: 130, align: 'left', search: false,
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

        { label: 'Tipo', name: 'tipo', width: 150, align: 'left', search: false, editable: false, hidden: true },
        {
            label: 'Subcategoría', name: 'idsubcategoria', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/parameters/subcategoria',
                buildSelect: function (response) {
                    var grid = $("#" + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.subcategoria;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Subcategoría--</option>';
                    $.each(data, function (i, item) {
                        var datasub = 'a';
                        var idsub = 'b';
                        if (data[i].nombre != undefined) {
                            datasub = data[i].nombre.trim();
                        }
                        if (thissid != undefined) {
                            idsub = thissid.trim();
                        }
                        if (datasub == idsub) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#subcategoria").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Subcategoria', name: 'subcategoria', width: 150, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
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
        caption: 'Iniciativa / Programa',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        colModel: modelIniciativaPrograma,
        viewrecords: true,
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: showSubGrids,
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
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.fechacomite == "") {
                    return [false, "Fecha Comité: Debe escoger un valor", ""];
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
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                $('input#codigoart', form).attr('readonly', 'readonly');
            },
            afterShowForm: function (form) {
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
                    recreateForm: true,
                    success: function (data) {
                        $("#nombre", form).val(data.nombre);
                        $("#sponsor1", form).val(data.sponsor1);
                        $("#sponsor2", form).val(data.sponsor2);
                        $("#q1", form).val(data.q1);
                        $("#q2", form).val(data.q2);
                        $("#q3", form).val(data.q3);
                        $("#q4", form).val(data.q4);
                        if (data.fechacomite) {
                            var fecha = new Date(data.fechacomite);
                            $("#fechacomite", form).val(fecha.toISOString().substr(0, 10));
                        }
                        $("#ano", form).val(data.ano);
                        if (data.pptoestimadogasto) {
                            $("#pptoestimadogasto", form).val(data.pptoestimadogasto.toFixed(2).toString().replace(".", ","));
                        }
                        if (data.pptoestimadoinversion) {
                            $("#pptoestimadoinversion", form).val(data.pptoestimadoinversion.toFixed(2).toString().replace(".", ","));
                        }
                        setTimeout(function () { $("#iddivision option[value=" + data.iddivision + "]", form).attr("selected", true); }, 500)
                        setTimeout(function () { $("#uidpmo option[value=" + data.uidpmo + "]", form).attr("selected", true); }, 500)
                        setTimeout(function () { $("#uidgerente option[value=" + data.uidgerente + "]", form).attr("selected", true); }, 500)
                        setTimeout(function () { $("#idestado option[value=" + data.idestado + "]", form).attr("selected", true); }, 500)
                        setTimeout(function () { $("#idcategoria option[value=" + data.idcategoria + "]", form).attr("selected", true); }, 500)

                        setTimeout(function () { $("#divisionsponsor", form).val(data.divisionsponsor); }, 500);
                        setTimeout(function () { $("#pmoresponsable", form).val(data.pmoresponsable); }, 500);
                        setTimeout(function () { $("#gerenteresponsable", form).val(data.gerenteresponsable); }, 500);
                        setTimeout(function () { $("#estado", form).val(data.estado); }, 500);
                        setTimeout(function () { $("#categoria", form).val(data.categoria); }, 500);
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
function showSubGrids(subgrid_id, row_id) {
    gridPresupuestoIniciativa(subgrid_id, row_id, 'presupuesto');
    gridIniciativaFecha(subgrid_id, row_id, 'fecha');
}