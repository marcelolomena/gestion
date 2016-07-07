function gridPresupuestoIniciativa(parentRowID, parentRowKey, suffix) {
    var subgrid_id = parentRowID;
    var row_id = parentRowKey;
    var subgrid_table_id, pager_id, toppager_id;
    subgrid_table_id = subgrid_id + '_t';
    pager_id = 'p_' + subgrid_table_id;
    toppager_id = subgrid_table_id + '_toppager';
    if (suffix) {
        subgrid_table_id += suffix;
        pager_id += suffix;
    }

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Glosa{glosa}</div>";
    template += "<div class='column-half'>N° SAP{sap}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>CUI 1{cuifinanciamiento1}</div>";
    template += "<div class='column-half'>% financiamiento{porcentaje1}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>CUI 2{cuifinanciamiento2}</div>";
    template += "<div class='column-half'>% financiamiento{porcentaje2}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Beneficios Cuantitativos{beneficioscuantitativos}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Beneficios Cualitativos{beneficioscualitativos}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Lider{uidlider}</div>";
    template += "<div class='column-half'>Jefe de Proyecto{uidjefeproyecto}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-three'>Dolar{dolar}</div>";
    template += "<div class='column-three'>UF{uf}</div>";
    template += "<div class='column-three'>Fecha Conversión{fechaconversion}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>idiniciativapadre{nombreiniciativapadre}</div>";
    template += "<div class='column-half'>idiniciativaprograma{nombreiniciativa}</div>";
    template += "<div class='column-half'>idmoneda{glosamoneda}</div>";
    template += "<div class='column-half'>lider{lider}</div>";
    template += "<div class='column-half'>jefeproyecto{jefeproyecto}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/presupuestoiniciativa/" + parentRowKey;

    var modelPresupuestoIniciativa = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Glosa', name: 'glosa', width: 100, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: {required: true},
        },
        {
            label: 'SAP', name: 'sap', width: 80, align: 'left',
            search: true, editable: true, hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });
                }
            },
        },
        {
            label: 'Cui 1', name: 'cuifinanciamiento1', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });
                }
            },
            editrules: { edithidden: false, required: true, number: true },
            hidedlg: true
        },
        {
            label: '% Cui 1', name: 'porcentaje1', width: 50, align: 'left',
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('0,00', { reverse: true, placeholder: "_,__"  });
                }
            },
            search: true, editable: true, hidden: false,
            editrules: { edithidden: false, required: true },
            hidedlg: true
        },
        {
            label: 'Cui 2', name: 'cuifinanciamiento2', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
            editoptions: {
                dataInit: function (element) {
                    $(element).mask("0000", { placeholder: "____" });

                }
            },
            editrules: { edithidden: false, required: true, number: true },
            hidedlg: true
        },
        {
            label: '% Cui 2', name: 'porcentaje2', width: 50, align: 'left',
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('0,00', { reverse: true, placeholder: "_,__" });
                }
            },
            search: true, editable: true, hidden: false,
            editrules: { edithidden: false, required: true },
            hidedlg: true
        },
        {
            label: 'Beneficios Cuantitativos', name: 'beneficioscuantitativos', width: 200,
            align: 'left', edittype: "textarea",
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Beneficios Cualitativos', name: 'beneficioscualitativos', width: 200,
            align: 'left', edittype: "textarea",
            search: true, editable: true, hidden: false,
        },
        {
            label: 'uidlider', name: 'uidlider', 
            search: false, editable: true, hidden: true,
            editrules: {required: true},
            edittype: "select",
            editoptions: {
                dataUrl: '/usuariosprograma/' + parentRowKey,
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidlider;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Lider--</option>';
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
                        $("input#lider").val($('option:selected', this).val());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Lider', name: 'lider', width: 150, align: 'left',
            search: true, editable: true, hidden: false, jsonmap: "nombrelider"
        },
        {
            label: 'uidjefeproyecto', name: 'uidjefeproyecto', 
            search: false, editable: true, hidden: true,
            editrules: {required: true},
            edittype: "select",
            editoptions: {
                dataUrl: '/usuariosprograma/' + parentRowKey,
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidjefeproyecto;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Jefe de Proyecto--</option>';
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
                        $("input#jefeproyecto").val($('option:selected', this).val());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Jefe de Proyecto', name: 'jefeproyecto', width: 150, align: 'left',
            search: true, editable: true, hidden: false, jsonmap: "nombrejefe",
        },
        {
            label: 'Fecha Conversión', name: 'fechaconversion', width: 150, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' },
            editable: true,
            editrules: {required: true},
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                childGridID[0].triggerToolbar();
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
            label: 'Dolar', name: 'dolar', width: 80, align: 'right',
            search: false, editable: true, hidden: false,
            editrules: {required: true},
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000,00', { reverse: true });
                }
            }
        },

        {
            label: 'UF', name: 'uf', width: 80, align: 'right',
            search: false, editable: true, hidden: false,
            editrules: {required: true},
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('00.000,00', { reverse: true });
                }
            }
        }

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "GET",
        datatype: "json",
        caption: 'Presupuesto',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        rowNum: 10,
        rowList: [5, 10, 20, 50],
        sortable: "true",
        colModel: modelPresupuestoIniciativa,
        viewrecords: true,
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: showSubGrids2,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/presupuestoiniciativa/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {
                $("#" + childGridID).addRowData("blankRow", { "id": 0, "beneficioscuantitativos": "No hay datos", "porcentaje1": " ", "porcentaje2": " ", "dolar": " ", "uf": " " });
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
            editCaption: "Modificar Presupuesto Iniciativa",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.uidlider == 0) {
                    return [false, "Lider: Campo obligatorio", ""];
                } if (postdata.uidjefeproyecto == 0) {
                    return [false, "Jefe de Proyecto: Campo obligatorio", ""];
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
                var grid = $("#" + childGridID);
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var thissid = rowData.id;
                if (thissid == 0) {
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
            addCaption: "Agregar Presupuesto Iniciativa",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.uidlider == 0) {
                    return [false, "Lider: Campo obligatorio", ""];
                } if (postdata.uidjefeproyecto == 0) {
                    return [false, "Jefe de Proyecto: Campo obligatorio", ""];
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
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Eliminar Presupuesto Iniciativa",
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
function showSubGrids2(subgrid_id, row_id) {
    gridTareasNuevosProyectos(subgrid_id, row_id, 'tareas');
}