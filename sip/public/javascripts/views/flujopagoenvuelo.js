function gridFlujoPagoEnVuelo(parentRowID, parentRowKey, suffix) {
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
    template += "<div class='column-half'><span style='color: red'>*</span>Periodo{periodo}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>Porcentaje{porcentaje}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'><span style='color: red'>*</span>Glosa Item{glosaitem}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Fecha Inicio{fechainicio}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>Fecha Fin{fechafin}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Cantidad{cantidad}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>Costo{costoorigen}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Tipo Pago{idtipopago}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/flujopagoenvuelo/list/" + parentRowKey;

    var modelFlujoPagoEnVuelo = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Periodo', name: 'periodo', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000000', { placeholder: "______" });
                }
            }
        },
        {
            label: 'Porcentaje', name: 'porcentaje', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('0,00', { reverse: true, placeholder: "_,__" });
                }
            },
        },
        {
            label: 'Glosa Item', name: 'glosaitem', width: 200, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
        },
        {
            label: 'Fecha Inicio', name: 'fechainicio', width: 150, align: 'left', search: false,
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
            label: 'Fecha Fin', name: 'fechafin', width: 150, align: 'left', search: false,
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
            label: 'Cantidad', name: 'cantidad', width: 50, align: 'right',
            search: false, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 0 },
            editrules: { required: true },
        },
        {
            label: 'Costo', name: 'costoorigen', width: 80, align: 'right',
            search: false, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editrules: { required: true },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Tipo Pago', name: 'parametro.nombre', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
        },
        {
            label: 'Tipo Pago', name: 'idtipopago', search: false, width: 300,
            editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/tipopago',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idtipopago;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Tipo de Pago--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(100); }

        }

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        caption: 'Flujo de pagos',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelFlujoPagoEnVuelo,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/flujopagoenvuelo/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "glosaitem": "No hay datos" });
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
            editCaption: "Modificar Flujo de pagos",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.idtipopago == 0) {
                    return [false, "Tipo Pago: Campo obligatorio", ""];
                } if (postdata.fechainicio == 0) {
                    return [false, "Fecha Inicio: Campo obligatorio", ""];
                } if (postdata.fechafin == 0) {
                    return [false, "Fecha Fin: Campo obligatorio", ""];
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
                        url: '/actualizaduracion/' + parentRowKey,
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
            addCaption: "Agregar Flujo de Pagos",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.idtipopago == 0) {
                    return [false, "Tipo Pago: Campo obligatorio", ""];
                } if (postdata.fechainicio == 0) {
                    return [false, "Fecha Inicio: Campo obligatorio", ""];
                } if (postdata.fechafin == 0) {
                    return [false, "Fecha Fin: Campo obligatorio", ""];
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
            addCaption: "Eliminar Flujo de Pagos",
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