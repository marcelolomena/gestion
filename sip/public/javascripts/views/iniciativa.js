$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color: red'>*</span>Proyecto {nombre}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color: red'>*</span> División {iddivision}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Sponsor {sponsor1}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>PMO {uidpmo}</div>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>Gerente {uidgerente}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>Estado {idestado}</div>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>Categoría {idcategoria}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-four'>Q1 {q1}</div>";
    tmpl += "<div class='column-four'>Q2 {q2}</div>";
    tmpl += "<div class='column-four'>Q3 {q3}</div>";
    tmpl += "<div class='column-four'>Q4 {q4}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Fecha Último Comité {fechacomite}</div>";
    tmpl += "<div class='column-half'><span style='color: red'>*</span>Año {ano}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-three'>Gasto Estimado {pptoestimadogasto}</div>";
    tmpl += "<div class='column-three'>Inversión Estimada {pptoestimadoinversion}</div>";
    tmpl += "<div class='column-three'>Presupuesto Estimado {pptoestimadoprevisto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Importante: Los montos estimados están en Dolares.</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-three'>Gasto Aprobado {pptoaprobadogasto}</div>";
    tmpl += "<div class='column-three'>Inversión Aprobada {pptoaprobadoinversion}</div>";
    tmpl += "<div class='column-three'>PresupuestoAprobado{pptoaprobadoprevisto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Importante: Los montos aprobados están en Pesos.</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Presupuesto Aprobado en Dolares {pptoaprobadodolares}</div>";
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

    var modelIniciativa = [
        { label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Proyecto', name: 'nombre', width: 400, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
            editoptions: {placeholder: "Nombre del proyecto" }
        },
        {
            label: 'División', name: 'iddivision',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/divisiones',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.iddivision;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger División--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].idRRHH == thissid) {
                            s += '<option value="' + data[i].idRRHH + '" selected>' + data[i].division + '</option>';
                        } else {
                            s += '<option value="' + data[i].idRRHH + '">' + data[i].division + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        if ($('option:selected', this).val() != 0) {
                            $("input#divisionsponsor").val($('option:selected', this).text());
                        } else {
                            $("input#divisionsponsor").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'División', name: 'divisionsponsor', width: 200, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true },
            stype: 'select',
            searchoptions: {
                dataUrl: '/divisiones',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.iddivision;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger División--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].idRRHH == thissid) {
                            s += '<option value="' + data[i].idRRHH + '" selected>' + data[i].division + '</option>';
                        } else {
                            s += '<option value="' + data[i].idRRHH + '">' + data[i].division + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            },
        },
        {
            label: 'Sponsor', name: 'sponsor1', width: 150, align: 'left',
            search: true, editable: true, hidden: false,
            editoptions: {placeholder: "Nombre y apellido Sponsor 1" }
        },
        {
            label: 'Gerente', name: 'uidgerente',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Gerente',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidgerente;
                    var data = JSON.parse(response);
                    var s = "<select>";
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
                        if ($('option:selected', this).val() != 0) {
                            $("input#gerenteresponsable").val($('option:selected', this).text());
                        } else {
                            $("input#gerenteresponsable").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Gerente', name: 'gerenteresponsable', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'PMO', name: 'uidpmo',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/PMO',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidpmo;
                    var data = JSON.parse(response);
                    var s = "<select>";
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
                        if ($('option:selected', this).val() != 0) {
                            $("input#pmoresponsable").val($('option:selected', this).text());
                        } else {
                            $("input#pmoresponsable").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'PMO', name: 'pmoresponsable', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'Categoria', name: 'idcategoria',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/parameters/categoria',
                buildSelect: function (response) {
                    var grid = $("#table_iniciativa");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.tipo;
                    var data = JSON.parse(response);
                    var s = "<select>";
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
                        if ($('option:selected', this).val() != 0) {
                            $("input#categoria").val($('option:selected', this).text());
                        } else {
                            $("input#categoria").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Categoria', name: 'categoria', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'Estado', name: 'estado', width: 150, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },
        {
            label: 'Año', name: 'ano', width: 50, align: 'left',
            search: true, editable: true,
            editrules: { required: true },
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });
                }
            },
            searchoptions: {
                sopt: ["ge", "le", "eq"] // ge = greater or equal to, le = less or equal to, eq = equal to
            }
        },
        {
            label: 'Q1', name: 'q1', width: 50, align: 'left',
            search: false, editable: true, hidden: false,
            editoptions: {placeholder: "Q1 o vacío" }
        },
        {
            label: 'Q2', name: 'q2', width: 50, align: 'left',
            search: false, editable: true, hidden: false,
            editoptions: {placeholder: "Q2 o vacío" }
        },
        {
            label: 'Q3', name: 'q3', width: 50, align: 'left',
            search: false, editable: true, hidden: false,
            editoptions: {placeholder: "Q3 o vacío" }
        },
        {
            label: 'Q4', name: 'q4', width: 50, align: 'left',
            search: false, editable: true, hidden: false,
            editoptions: {placeholder: "Q4 o vacío" }
        },
        {
            label: 'Fecha Último Comite', name: 'fechacomite', width: 130, align: 'left',
            search: false, editable: true, formatter: 'date',
            formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
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
        {
            label: 'Gasto Estimado (US$)', name: 'pptoestimadogasto', width: 150, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Inversión Estimada (US$)', name: 'pptoestimadoinversion', width: 150, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Presupuesto Estimado (US$)', name: 'pptoestimadoprevisto', width: 150, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Gasto Aprobado (CLP)', name: 'pptoaprobadogasto', width: 150, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 0 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000', { reverse: true });
                }
            }
        },
        {
            label: 'Inversión Aprobada (CLP)', name: 'pptoaprobadoinversion', width: 150, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 0 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000', { reverse: true });
                }
            }
        },
        {
            label: 'Presupuesto Aprobado (CLP)', name: 'pptoaprobadoprevisto', width: 150, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 0 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000', { reverse: true });
                }
            }
        },
        {
            label: 'Presupuesto Aprobado (US$)', name: 'pptoaprobadodolares', width: 150, align: 'right',
            search: false, editable: true, hidden: false, formatter: 'number',
            formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Estado', name: 'idestado',
            search: false, editable: true, hidden: true,
            edittype: "select",
            editrules: { required: true },
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
                        if ($('option:selected', this).val() != 0) {
                            $("input#estado").val($('option:selected', this).text());
                        } else {
                            $("input#estado").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
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
        caption: 'Lista de iniciativas',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
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
    $("#table_iniciativa").jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $('#table_iniciativa').jqGrid('navGrid', "#pager_iniciativa", {
        edit: true, add: true, del: true, search: false, refresh: true,
        view: false, position: "left", cloneToTop: false
    },
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
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_iniciativa').attr('id'));
                $('input#pptoestimadogasto', form).attr('readonly', 'readonly');
                $('input#pptoestimadoinversion', form).attr('readonly', 'readonly');
                $('input#pptoestimadoprevisto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadogasto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadoinversion', form).attr('readonly', 'readonly');
                $('input#pptoaprobadoprevisto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadodolares', form).attr('readonly', 'readonly');
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
            },
            afterSubmit: function (response, postdata) {
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
                $('input#pptoestimadogasto', form).attr('readonly', 'readonly');
                $('input#pptoestimadoinversion', form).attr('readonly', 'readonly');
                $('input#pptoestimadoprevisto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadogasto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadoinversion', form).attr('readonly', 'readonly');
                $('input#pptoaprobadoprevisto', form).attr('readonly', 'readonly');
                $('input#pptoaprobadodolares', form).attr('readonly', 'readonly');
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
    $("#pager_iniciativa_left").css("width", "");
});