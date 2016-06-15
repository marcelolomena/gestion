function showChildGrid(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Nombre{nombre}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Tarea{tarea}</div>";
    template += "<div class='column-half'>CUI{idcui}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Proveedor{idproveedor}</div>";
    template += "<div class='column-half'>Cuenta{cuentacontable}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Contrato{idcontrato}</div>";
    template += "<div class='column-half'>Presupuesto{presupuesto}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Compromiso{compromiso}</div>";
    template += "<div class='column-half'>Real{realajustado}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Saldo{saldotarea}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>nombreproveedor{nombreproveedor}</div>";
    template += "<div class='column-half'>idcuenta{idcuenta}</div>";
    template += "<div class='column-half'>numerocontrato{numerocontrato}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    var modelDetalleProyectosEnVuelo = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'idproyectoenvuelo', name: 'idproyectoenvuelo', hidden: true },
        {
            label: 'Tarea', name: 'tarea', width: 50, align: 'left', search: true, editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/tareasap/' + $('#grid').getRowData(parentRowKey).sap,
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.tarea;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Tarea--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].tarea == thissid) {
                            s += '<option value="' + data[i].tarea + '" selected>' + data[i].tarea + '</option>';
                        } else {
                            s += '<option value="' + data[i].tarea + '">' + data[i].tarea + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var thispid = $(this).val();
                        $.ajax({
                            type: "GET",
                            url: '/tareaservicio/' + thispid,
                            async: false,
                            success: function (data) {
                                $("input#idcuenta").val(data[0].cuentascontable.id);
                                $("input#cuentacontable").val(data[0].cuentascontable.cuentacontable);
                            }
                        });
                    }
                }]
            }
        },
        { label: 'Nombre', name: 'nombre', width: 150, align: 'left', search: true, editable: true },
        {
            label: 'idcui', name: 'idcui', search: false, hidden: true, editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/CUIs',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idcui;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger CUI--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
            }
        },
        { label: 'uid', name: 'uid', search: false, hidden: true, editable: true },
        {
            label: 'idproveedor', name: 'idproveedor', search: false, hidden: true, editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/proveedores/combobox',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idproveedor;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Proveedor--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].razonsocial + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].razonsocial + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#nombreproveedor").val($('option:selected', this).text());
                    }
                }],
            }
        },
        { label: 'Proveedor', name: 'nombreproveedor', width: 100, align: 'left', search: true, editable: true },
        { label: 'idcuenta', name: 'idcuenta', search: false, hidden: true, editable: true },
        { label: 'Cuenta', name: 'cuentacontable', width: 50, align: 'left', search: true, editable: true },
        {
            label: 'Presupuesto', name: 'presupuesto', width: 100, align: 'right', search: true, editable: true,
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        { label: 'presupuestopesos', name: 'presupuestopesos', hidden: true, search: false, editable: true },
        {
            label: 'Compromiso', name: 'compromiso', width: 100, align: 'right', search: true, editable: true,
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        { label: 'compromisopesos', name: 'compromisopesos', hidden: true, search: false, editable: true },
        {
            label: 'Real', name: 'realajustado', width: 50, align: 'right', search: true, editable: true,
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        { label: 'realajustadopesos', name: 'realajustadopesos', hidden: true, search: false, editable: true },
        {
            label: 'Saldo', name: 'saldotarea', width: 50, align: 'right', search: true, editable: true,
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        { label: 'saldotareapesos', name: 'saldotareapesos', search: false, hidden: true, editable: true },
        {
            label: 'idcontrato', name: 'idcontrato', hidden: true, editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/contratos/list',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idcui;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Contrato--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        //$("input#idcontrato").val($('option:selected', this).text());
                    }
                }],
            }
        },
        {
            label: 'Contrato', name: 'numerocontrato', width: 100, align: 'center', search: true, editable: true
        },
        { label: 'Solicitud', name: 'solicitudcontrato', width: 100, align: 'left', search: true, editable: true },
    ];

    $("#" + childGridID).jqGrid({
        url: '/detalleenvuelo/' + parentRowKey,
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: modelDetalleProyectosEnVuelo,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        autowidth: true,
        shrinkToFit: true,
        caption: 'Detalle de proyectos en vuelo',
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: showThirdLevelChildGrid,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        pager: "#" + childGridPagerID
    });

    $("#" + childGridID).jqGrid("setLabel", "presupuesto", "", { "text-align": "right" });
    $("#" + childGridID).jqGrid("setLabel", "compromiso", "", { "text-align": "right" });
    $("#" + childGridID).jqGrid("setLabel", "realajustado", "", { "text-align": "right" });
    $("#" + childGridID).jqGrid("setLabel", "saldotarea", "", { "text-align": "right" });
    $("#" + childGridID).jqGrid("setLabel", "numerocontrato", "", { "text-align": "center" });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: true, del: true, search: false,
        refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            editCaption: "Modifica Detalle Proyecto",
            closeAfterEdit: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/detalleenvuelo/action',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
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
            addCaption: "Agrega Detalle Proyecto",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            url: '/detalleenvuelo/action',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            onclickSubmit: function (rowid) {
                return { idproyectoenvuelo: parentRowKey };
            },
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                postdata.presupuesto = postdata.presupuesto.split(".").join("").replace(",", ".");
                postdata.compromiso = postdata.compromiso.split(".").join("").replace(",", ".");
                postdata.realajustado = postdata.realajustado.split(".").join("").replace(",", ".");
                postdata.saldotarea = postdata.saldotarea.split(".").join("").replace(",", ".");
                if (postdata.idcui == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } else if (postdata.idproveedor == 0) {
                    return [false, "Proveedor: Debe escoger un valor", ""];
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
                    $("#" + childGridID).jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                $('input#cuentacontable', form).attr('readonly', 'readonly');
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            mtype: 'POST',
            url: '/detalleenvuelo/action',
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