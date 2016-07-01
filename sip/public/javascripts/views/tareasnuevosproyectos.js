function gridTareasNuevosProyectos(parentRowID, parentRowKey, suffix) {
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
    template += "<div class='column-half'>CUI{cui}</div>";
    template += "<div class='column-half'>Tarea{tarea}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Servicio{idservicio}</div>";
    template += "<div class='column-half'>Proveedor{idproveedor}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Tipo Pago{idtipopago}</div>";
    template += "<div class='column-half'>Moneda{idmoneda}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Fecha de Inicio{fechainicio}</div>";
    template += "<div class='column-half'>Fecha de Fin{fechafin}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Requiere Contrato{reqcontrato}</div>";
    template += "<div class='column-half'>Con IVA{coniva}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Cantidad{cantidad}</div>";
    template += "<div class='column-half'>Costo Unitario{costounitario}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>idiniciativapadre{nombreiniciativapadre}</div>";
    template += "<div class='column-half'>idiniciativaprograma{nombreiniciativa}</div>";
    template += "<div class='column-half'>idmoneda{glosamoneda}</div>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/tareasnuevosproyectos/" + parentRowKey;

    var modelTareasNuevosProyectos = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Cui', name: 'cui', width: 50, align: 'left',
            search: true, editable: true, hidden: false, jsonmap: "estructuracui.cui",
        },
        
        {
            label: 'Servicio', name: 'idservicio', search: false, width: 300,
            editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/serviciosdesarrollo',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);;
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idservicio;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Servicio--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                            childIdServicio = data[i].id;
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(100); }

        },
        {
            label: 'Servicio', name: 'servicio.nombre', width: 200, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Proveedor', name: 'idproveedor', search: false, width: 300,
            editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/proveedordesarrollo',
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
                            childIdServicio = data[i].id;
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].razonsocial + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) { $(elem).width(100); }

        },
        {
            label: 'Proveedor', name: 'proveedor.razonsocial', width: 150, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Tarea', name: 'tarea', width: 150, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Tipo Pago', name: 'parametro.nombre', width: 80, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Tipo Pago', name: 'idtipopago', search: false, width: 300,
            editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/tipopago',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idtipopago;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
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

        },
        {
            label: 'Fecha Inicio', name: 'fechainicio', width: 100, align: 'left', search: false,
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
            label: 'Fecha Fin', name: 'fechafin', width: 100, align: 'left', search: false,
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
            label: 'Requiere Contrato', name: 'reqcontrato', search: false, editable: true, hidden: false,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemConIva
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.reqcontrato;
                console.log('val: ' + val);
                if (val == 1) {
                    dato = 'Sí';

                } else if (val == 0) {
                    dato = 'No';
                }
                console.log('dato: ' + dato)
                return dato;
            }
        },
        /*
        {
            label: 'Requiere Contrato', name: 'reqcontrato', width: 50, align: 'left',
            search: true, editable: false, hidden: false,
        },*/
        {
            label: 'Moneda',
            name: 'idmoneda',
            hidden: true,
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/monedas',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idmoneda;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Moneda--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].moneda + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].moneda + '</option>';
                        }
                    });
                    return s + "</select>";
                }
            }, dataInit: function (elem) {/* $(elem).width(200);*/ },
            dataEvents: [{
                type: 'change', fn: function (e) {
                    $("input#idmoneda").val($('option:selected', this).val());
                }
            }],
        },

        {
            label: 'Moneda', name: 'moneda.moneda', width: 50, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Costo Unitario', name: 'costounitario', width: 100, align: 'right',
            search: false, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000000000000000.00', { reverse: true });
                }
            }
        },
        {
            label: 'Cantidad', name: 'cantidad', width: 50, align: 'left',
            formatter: 'number', formatoptions: { decimalPlaces: 0 },
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Con IVA', name: 'coniva', search: false, editable: true, hidden: false,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemReqcontrato
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.reqcontrato;
                console.log('val: ' + val);
                if (val == 1) {
                    dato = 'Sí';

                } else if (val == 0) {
                    dato = 'No';
                }
                console.log('dato: ' + dato)
                return dato;
            }
        },
        {
            label: 'Gasto/Inversión', name: 'gastoinversion', width: 50, align: 'left',
            search: true, editable: false, hidden: false, jsonmap: "servicio.cuentascontable.invgasto",
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.gastoinversion;
                console.log('val: ' + val);
                if (val == 1) {
                    dato = 'Gasto';

                } else if (val == 2) {
                    dato = 'Inversión';
                }
                console.log('dato: ' + dato)
                return dato;
            }
        }

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        caption: 'Tareas',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelTareasNuevosProyectos,
        viewrecords: true,
        styleUI: "Bootstrap",
        subGrid: true,
        subGridRowExpanded: showSubGrids3,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/tareasnuevosproyectos/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "idcui": "No hay datos", "idservicio": "" });
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
            editCaption: "Modificar Tarea",
            template: template,
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
            addCaption: "Agregar Tarea",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            beforeSubmit: function (postdata, formid) {

                return [true, "", ""]

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
function showSubGrids3(subgrid_id, row_id) {
    gridFlujoNuevaTarea(subgrid_id, row_id, 'flujo');
}