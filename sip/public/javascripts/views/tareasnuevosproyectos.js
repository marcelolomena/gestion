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
    template += "<div class='column-half'><span style='color: red'>*</span>Servicio{idservicio}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>Tarea{tarea}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>CUI{idcui}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>Proveedor{idproveedor}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Tipo Pago{idtipopago}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>Moneda{idmoneda}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Fecha de Inicio{fechainicio}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>Fecha de Fin{fechafin}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Contrato{reqcontrato}</div>";
    template += "<div class='column-half'>Con IVA{coniva}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'><span style='color: red'>*</span>Cantidad{cantidad}</div>";
    template += "<div class='column-half'><span style='color: red'>*</span>Costo Unitario{costounitario}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Glosa Factura (Max 140){glosa}</div>";
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
            label: 'CUI', name: 'idcui', search: false, editable: true, hidden: true,
            jsonmap: 'estructuracui.id',
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                value: "0:--Escoger CUI--",
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#cui").val($('option:selected', this).val());
                        $("input#inputcui").val($('option:selected', this).val());
                        var idCUI = $('option:selected', this).val();
                        var idServicio = $('#idservicio').val();
                        //console.log('idServicio: ' + idServicio);
                        if (idCUI != "0") {
                            $.ajax({
                                type: "GET",
                                url: '/proveedorporcui/' + idCUI + '/' + idServicio,
                                async: false,
                                success: function (data) {
                                    var grid = $("#" + childGridID);
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.idproveedor;
                                    var s = "<select>";//el default
                                    s += '<option value="0">--Escoger Proveedor--</option>';
                                    $.each(data, function (i, item) {
                                        if (data[i].idproveedor == thissid) {
                                            s += '<option value="' + data[i].idproveedor + '" selected>' + data[i].razonsocial + '</option>';
                                        } else {
                                            s += '<option value="' + data[i].idproveedor + '">' + data[i].razonsocial + '</option>';
                                        }
                                    });
                                    s += "</select>";
                                    //lahora = new Date();
                                    //console.log('Termina el for a las ' + lahora.getHours() + ":" + lahora.getMinutes() + ":" + lahora.getSeconds());
                                    $("select#idproveedor").empty().html(s);
                                    //lahora = new Date();
                                    //console.log('Seteo el html a las ' + lahora.getHours() + ":" + lahora.getMinutes() + ":" + lahora.getSeconds());
                                }
                            });
                        }

                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }

        },

        {
            label: 'Cui', name: 'cui', width: 50, align: 'left',
            search: true, editable: true, hidden: false, jsonmap: "estructuracui.cui",
            editrules: { required: true },
        },

        {
            label: 'Servicio', name: 'idservicio', search: false, width: 300,
            jsonmap: 'servicio.id',
            editable: true, hidden: true,
            edittype: "select",
            editrules: { required: true },
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
                            //childIdServicio = data[i].id;
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },

                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#servicio").val($('option:selected', this).val());
                        var idServicio = $('option:selected', this).val()
                        if (idServicio != "0") {
                            $.ajax({
                                type: "GET",
                                url: '/cuiporservicio/' + idServicio,
                                async: false,
                                success: function (data) {
                                    var grid = $("#" + childGridID);
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.idcui;
                                    var s = "<select>";
                                    s += '<option value="0">--Escoger CUI--</option>';
                                    $.each(data, function (i, item) {
                                        if (data[i].idcui == thissid) {
                                            s += '<option value="' + data[i].idcui + '" selected>' + data[i].cui + ' - '+data[i].nombreresponsable+'</option>';
                                        } else {
                                            s += '<option value="' + data[i].idcui + '">' + data[i].cui + ' - '+data[i].nombreresponsable+'</option>';
                                        }
                                    });
                                    s += "</select>";
                                    $("select#idcui").html(s);
                                }
                            });
                        }

                    }
                }],
            }, dataInit: function (elem) { $(elem).width(100); }

        },
        {
            label: 'Servicio', name: 'servicio.nombre', width: 200, align: 'left',
            search: true, editable: false, hidden: false,
            editrules: { required: true },
        },
        {
            label: 'Proveedor', name: 'idproveedor', search: false, width: 300,
            editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                value: "0:--Escoger Proveedor--",
            },
            dataInit: function (elem) { $(elem).width(100); }

        },
        {
            label: 'Proveedor', name: 'proveedor.razonsocial', width: 150, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Tarea', name: 'tarea', width: 150, align: 'left',
            search: true, editable: true, hidden: false,
            editrules: { required: true },
            editoptions: {placeholder: "X.X.X de acuerdo a formato de tarea" }
        },
        {
            label: 'Glosa Factura', name: 'glosa', width: 150, align: 'left',
            search: true, editable: true, hidden: false,
            edittype: "textarea", editrules: { required: false },
            editoptions: {maxlength:"140"},
        },
        {
            label: 'Tipo Pago', name: 'parametro.nombre', width: 80, align: 'left',
            search: true, editable: false, hidden: false,
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
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true,
            editrules: { required: true },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'dd-mm-yyyy',
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
                    $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                    $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                }
            },
        },
        {
            label: 'Fecha Fin', name: 'fechafin', width: 100, align: 'left', search: false,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'd-m-Y' },
            editable: true,
            editrules: { required: true },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'dd-mm-yyyy',
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
                    $(element).mask("00-00-0000", { placeholder: "__-__-____" });
                    $(element).datepicker({ language: 'es', format: 'dd-mm-yyyy', autoclose: true })
                }
            },
        },
        {
            label: 'Contrato', name: 'reqcontrato',
            search: false, editable: true, hidden: false,
            //editrules: { required: true },
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemReqcontrato
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.reqcontrato;
                if (val == 1) {
                    dato = 'Sí';

                } else if (val == 0) {
                    dato = 'No';
                }
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
            editrules: { required: true },
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
            label: 'Cantidad', name: 'cantidad', width: 50, align: 'left',
            formatter: 'number', formatoptions: { decimalPlaces: 0 },
            editrules: { required: true },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000', { reverse: true });
                }
            },
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Costo Unitario', name: 'costounitario', width: 100, align: 'right',
            search: false, editable: true, hidden: false,
            editrules: {required: true},
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Con IVA', name: 'coniva', search: false, editable: true, hidden: false,
            edittype: "custom",
            //editrules: { required: true },
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemConIva
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.coniva;
                if (val == 1) {
                    dato = 'Sí';

                } else if (val == 0) {
                    dato = 'No';
                }
                return dato;
            }
        },
        {
            label: 'Gasto/Inversión', name: 'gastoinversion', width: 50, align: 'left',
            search: true, editable: false, hidden: false, jsonmap: "servicio.cuentascontable.invgasto",
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.gastoinversion;
                if (val == 1) {
                    dato = 'Gasto';

                } else if (val == 2) {
                    dato = 'Inversión';
                }
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
                const regex = /^\d{1}.\d{1,2}.\d{1}$|^\d{1}.\d{1,2}$/gm;
                if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe seleccionar un valor", ""];
                } if (!regex.test(postdata.tarea)) {
                    return [false, "Tarea: Ingrese valor (X.XX.X)", ""];  
                } if (postdata.idcui == 0) {
                    return [false, "CUI: Debe seleccionar un valor", ""];
                } if (postdata.idproveedor == 0) {
                    return [false, "Proveedor: Debe seleccionar un valor", ""];
                } if (postdata.idtipopago == 0) {
                    return [false, "Tipo Pago: Debe seleccionar un valor", ""];
                } if (postdata.idmoneda == 0) {
                    return [false, "Moneda: Debe seleccionar un valor", ""];
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
                setTimeout(function () {
                    var grid = $("#" + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.id;
                    if (thissid == 0) {
                        alert("Debe seleccionar una fila");
                        return [false, result.error_text, ""];
                    }
                    var thisidservicio = rowData.idservicio;
                    var thisidcui = rowData.idcui;
                    var thisidproveedor = rowData.idproveedor;

                    $.ajax({
                        type: "GET",
                        url: '/cuiporservicio/' + thisidservicio,
                        success: function (data) {
                            var s = "<select>";
                            s += '<option value="0">--Escoger CUI--</option>';
                            $.each(data, function (i, item) {
                                if (data[i].idcui == thisidcui) {
                                    s += '<option value="' + data[i].idcui + '" selected>' + data[i].cui + ' - '+data[i].nombreresponsable+'</option>';
                                } else {
                                    s += '<option value="' + data[i].idcui + '">' + data[i].cui + ' - '+data[i].nombreresponsable+'</option>';
                                }
                            });
                            s += "</select>";
                            $("select#idcui").html(s);
                        }
                    });
                    //setTimeout(function () {
                    //var thisidcui = $('#idcui :selected').val();

                    $.ajax({
                        type: "GET",
                        url: '/proveedorporcui/' + thisidcui + '/' + thisidservicio,
                        success: function (data) {
                            var s = "<select>";
                            s += '<option value="0">--Escoger CUI--</option>';
                            $.each(data, function (i, item) {
                                if (data[i].idproveedor == thisidproveedor) {
                                    s += '<option value="' + data[i].idproveedor + '" selected>' + data[i].razonsocial + '</option>';
                                } else {
                                    s += '<option value="' + data[i].idproveedor + '">' + data[i].razonsocial + '</option>';
                                }
                            });
                            s += "</select>";
                            $("select#idproveedor").html(s);
                        }
                    });
                    //}, 1000);
                    sipLibrary.centerDialog($("#" + childGridID).attr('id'));
                    //$('input#codigoart', form).attr('readonly', 'readonly');
                }, 1000);
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
            addCaption: "Agregar Tarea",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            beforeSubmit: function (postdata, formid) {
                const regex = /^\d{1}.\d{1,2}.\d{1}$|^\d{1}.\d{1,2}$/gm;                
                if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe seleccionar un valor", ""];
                } if (!regex.test(postdata.tarea)) {
                    return [false, "Tarea: Ingrese valor (X.XX.X)", ""];                      
                } if (postdata.idcui == 0) {
                    return [false, "CUI: Debe seleccionar un valor", ""];
                } if (postdata.idproveedor == 0) {
                    return [false, "Proveedor: Debe seleccionar un valor", ""];
                } if (postdata.idtipopago == 0) {
                    return [false, "Tipo Pago: Debe seleccionar un valor", ""];
                } if (postdata.idmoneda == 0) {
                    return [false, "Moneda: Debe seleccionar un valor", ""];
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
                //document.getElementsByName("reqcontrato").checked = true; 
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }, afterShowForm: function (form) {
                //$('select#idcui').attr("disabled", true); 
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