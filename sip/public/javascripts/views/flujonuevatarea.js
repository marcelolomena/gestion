function gridFlujoNuevaTarea(parentRowID, parentRowKey, suffix) {
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
    template += "<div class='column-half'>Periodo{periodo}</div>";
    template += "<div class='column-half'>Porcentaje{porcentaje}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Glosa Item{glosaitem}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Fecha Inicio{fechainicio}</div>";
    template += "<div class='column-half'>Fecha Fin{fechafin}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Monto{montoorigen}</div>";
    template += "<div class='column-half'>Costo{costoorigen}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Tipo Pago{idtipopago}</div>";
    template += "<div class='column-half'>Proyecto{idproyecto}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Tarea{idtarea}</div>";
    template += "<div class='column-half'>Subtarea{idsubtarea}</div>";
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
    var childGridURL = "/flujonuevatarea/" + parentRowKey;

    var modelFlujoNuevaTarea = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Periodo', name: 'periodo', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Glosa Item', name: 'glosaitem', width: 200, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Porcentaje', name: 'porcentaje', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
        },
        {
            label: 'Tipo Pago', name: 'parametro.nombre', width: 50, align: 'left',
            search: true, editable: true, hidden: false,
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
            label: 'Monto', name: 'montoorigen', width: 80, align: 'right',
            search: false, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'Costo', name: 'costoorigen', width: 80, align: 'right',
            search: false, editable: true, hidden: false,
            formatter: 'number', formatoptions: { decimalPlaces: 2 },
            editoptions: {
                dataInit: function (el) {
                    $(el).mask('000.000.000.000.000,00', { reverse: true });
                }
            }
        },
        {
            label: 'proyecto', name: 'idproyecto', search: false, editable: true, hidden: true,
            jsonmap: 'art_subtask.art_task.art_projectmaster.pId',
            edittype: "select",
            editoptions: {
                dataUrl: '/proyectosporprograma/' + parentRowKey,
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idproyecto;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Proyecto--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].pId == thissid) {
                            s += '<option value="' + data[i].pId + '" selected>' + data[i].project_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].pId + '">' + data[i].project_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#proyecto").val($('option:selected', this).val());
                        var idProyecto = $('option:selected', this).val()
                        if (idProyecto != "0") {
                            $.ajax({
                                type: "GET",
                                url: '/tareasporproyecto/' + idProyecto,
                                async: false,
                                success: function (data) {
                                    var grid = $("#" + childGridID);
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.idtarea;
                                    var s = "<select>";//el default
                                    s += '<option value="0">--Escoger Tarea--</option>';
                                    $.each(data, function (i, item) {
                                        if (data[i].tId == thissid) {
                                            s += '<option value="' + data[i].tId + '" selected>' + data[i].task_title + '</option>';
                                        } else {
                                            s += '<option value="' + data[i].tId + '">' + data[i].task_title + '</option>';
                                        }
                                    });
                                    s += "</select>";
                                    $("select#tarea").html(s);
                                }
                            });
                        }

                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'tarea', name: 'idtarea', search: false, editable: true, hidden: true,
            jsonmap: 'art_subtask.art_task.tId',
            edittype: "select",
            editoptions: {
                dataUrl: '/tareasporprograma/' + parentRowKey,
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idtarea;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Tarea--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].tId == thissid) {
                            s += '<option value="' + data[i].tId + '" selected>' + data[i].task_title + '</option>';
                        } else {
                            s += '<option value="' + data[i].tId + '">' + data[i].task_title + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#tarea").val($('option:selected', this).val());
                        var idTarea = $('option:selected', this).val()
                        if (idTarea != "0") {
                            $.ajax({
                                type: "GET",
                                url: '/subtareasporproyecto/' + idTarea,
                                async: false,
                                success: function (data) {
                                    var grid = $("#" + childGridID);
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.idsubtarea;
                                    var s = "<select>";//el default
                                    s += '<option value="0">--Escoger Subtarea--</option>';
                                    $.each(data, function (i, item) {
                                        if (data[i].sub_task_id == thissid) {
                                            s += '<option value="' + data[i].sub_task_id + '" selected>' + data[i].title + '</option>';
                                        } else {
                                            s += '<option value="' + data[i].sub_task_id + '">' + data[i].title + '</option>';
                                        }
                                    });
                                    s += "</select>";
                                    $("select#subtarea").html(s);
                                }
                            });
                        }

                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }

        },
        {
            label: 'Subtarea', name: 'subtarea', width: 200, align: 'left', 
            jsonmap: 'art_sub_task.title',
            search: true, editable: false, hidden: false,
        },
         {
            label: 'subtarea', name: 'idsubtarea', search: false, editable: true, hidden: true,
            jsonmap: 'art_subtask.sub_task_id',
            edittype: "select",
            editoptions: {
                dataUrl: '/subtareasporprograma/' + parentRowKey,
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idsubtarea;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Subtarea--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].sub_task_id == thissid) {
                            s += '<option value="' + data[i].sub_task_id + '" selected>' + data[i].title + '</option>';
                        } else {
                            s += '<option value="' + data[i].sub_task_id + '">' + data[i].title + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#subtarea").val($('option:selected', this).val());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }

        },


    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        caption: 'Flujo',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelFlujoNuevaTarea,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/flujonuevatarea/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "id": 0, "porcentaje1": "No hay datos", "cuifinanciamiento2": "" });
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
            addCaption: "Agregar Presupuesto Iniciativa",
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
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
                        url: '/actualizaduracion/' + parentRowKey,
                        async: false,
                        success: function (data) {
                            return [true, "", ""]
                        }
                    });
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