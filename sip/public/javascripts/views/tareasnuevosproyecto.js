function showSubGrids(subgrid_id, row_id) {
    var rowData = $("#grid").getRowData(row_id);
    showSubGrid_JQGrid2(subgrid_id, row_id, "JQGrid2");
}

function showSubGrid_JQGrid2(subgrid_id, row_id, message, suffix) {
    var subgrid_table_id, pager_id, toppager_id;
    subgrid_table_id = subgrid_id + '_t';
    pager_id = 'p_' + subgrid_table_id;
    toppager_id = subgrid_table_id + '_toppager';
    if (suffix) {
        subgrid_table_id += suffix;
        pager_id += suffix;
    }

    var templateServicio = "<div id='responsive-form' class='clearfix'>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Servicio{idservicio}</div>";
    templateServicio += "<div class='column-half'>Cui{idcui}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Fecha Inicio{fechainicio}</div>";
    templateServicio += "<div class='column-half'>Fecha Término{fechatermino}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Fecha Control{fechacontrol}</div>";
    templateServicio += "<div class='column-half'>Valor Cuota{valorcuota}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Estado{idestadocto}</div>";
    templateServicio += "<div class='column-half'>Frecuencia{idfrecuencia}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Plazo{idplazocontrato}</div>";
    templateServicio += "<div class='column-half'>Condición{idcondicion}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Contacto{idcontactoproveedor}</div>";
    templateServicio += "<div class='column-half'>Moneda{idmoneda}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Anexo{anexo}</div>";
    templateServicio += "<div class='column-half'>Impuesto{impuesto}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-half'>Factor{factorimpuesto}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row'>";
    templateServicio += "<div class='column-full'>Descripción{glosaservicio}</div>";
    templateServicio += "</div>";

    templateServicio += "<div class='form-row' style='display: none;'>";
    templateServicio += "<div class='column-half'>servicio{servicio}</div>";
    templateServicio += "<div class='column-half'>frecuenciafacturacion {frecuenciafacturacion}</div>";
    templateServicio += "<div class='column-half'>plazocontrato {plazocontrato}</div>";
    templateServicio += "<div class='column-half'>condicionnegociacion {condicionnegociacion}</div>";
    templateServicio += "<div class='column-half'>estadocontrato {estadocontrato}</div>";
    templateServicio += "</div>";

    templateServicio += "<hr style='width:100%;'/>";
    templateServicio += "<div> {sData} {cData}  </div>";
    templateServicio += "</div>";

    $('#' + subgrid_id).append('<table id=' + subgrid_table_id + ' class=scroll></table><div id=' + pager_id + ' class=scroll></div>');

    $('#' + subgrid_table_id).jqGrid({
        mtype: "POST",
        url: '/tareasnuevosproyectos/' + row_id,
        editurl: '/tareasnuevosproyectos/action/' + row_id,
        datatype: 'json',
        page: 1,
        colModel: [
            { label: 'id', name: 'id', key: true, hidden: true },
            {
                label: 'idnuevosproyectos', name: 'idnuevosproyectos', 
                search: false, editable: false, hidden: true,
            },
            {
                label: 'idservicio', name: 'idservicio', search: false, 
                editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/servicios',
                    buildSelect: function (response) {
                        var grid = $('#' + subgrid_table_id);
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.servicio;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Servicio--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].nombre == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].tarea + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].tarea + '</option>';
                            }
                        });
                        return s + "</select>";
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var thistid = $(this).val();
                            $("input#servicio").val($('option:selected', this).text());
                        }
                    }],
                }, dataInit: function (elem) { $(elem).width(200); }
            },
            {
            label: 'Tarea', name: 'tarea', width: 300, align: 'left', search: true,
            editable: true, jsonmap: "servicio.tarea",
            stype: 'select',
            searchoptions: {
                dataUrl: '/servicios',
                buildSelect: function (response) {
                    var data = JSON.parse(response);
                    var s = "<select>";
                     s += '<option value="0">--Escoger Servicio--</option>';
                    $.each(data, function (i, item) {
                        s += '<option value="' + data[i].id + '">' + data[i].tarea + '</option>';
                    });
                    return s + "</select>";
                }
            },
        },
            {
            label: 'Proveedor', name: 'idproveedor', search: false, editable: true, 
            hidden: true, jsonmap: "proveedor.id",
            edittype: "select",
            editoptions: {
                dataUrl: '/proveedores/combobox',
                buildSelect: function (response) {
                    var grid = $("#grid");
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
                        $("input#razonsocial").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Proveedor', name: 'razonsocial', width: 300, align: 'left', search: true,
            editable: true, jsonmap: "proveedor.razonsocial",
            stype: 'select',
            searchoptions: {
                dataUrl: '/proveedores/combobox',
                buildSelect: function (response) {
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Proveedor--</option>';
                    $.each(data, function (i, item) {
                        s += '<option value="' + data[i].id + '">' + data[i].razonsocial + '</option>';
                    });
                    return s + "</select>";
                }
            },
        },

        ],
        shrinkToFit: true,
        autowidth: true,
        caption: 'Tareas',
        viewrecords: true,
        rowNum: 10,
        rowList: [10, 20, 30],
        regional: 'es',
        height: 'auto',
        //height: '100%',
        //width: null,
        pager: $('#' + pager_id),
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $('#' + subgrid_table_id).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {
                $('#' + subgrid_table_id).addRowData("blankRow", { "tarea": "No hay datos" });
            }
        },
        //subGrid: true,
        //subGridRowExpanded: gridDetail,
        //subGridOptions: {
        //    plusicon: "glyphicon-hand-right",
        //    minusicon: "glyphicon-hand-down",
        //    "reloadOnExpand": true,
        //    "selectOnExpand": true
        //}
    });

    $('#' + subgrid_table_id).jqGrid('navGrid', '#' + pager_id, {
        edit: true, add: true,
        del: true, search: false, refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            editCaption: "Modifica Servicio",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: templateServicio,
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
                needDisable = true;
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }
        },
        {
            addCaption: "Agrega Servicio",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: templateServicio,
            onclickSubmit: function (rowid) {
                return { parent_id: row_id };
            },
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.idcui == 0) {
                    return [false, "CUI: Debe escoger un valor", ""];
                } if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe escoger un valor", ""];
                } if (postdata.idfrecuencia == 0) {
                    return [false, "Frecuencia: Debe escoger un valor", ""];
                } if (postdata.idplazocontrato == 0) {
                    return [false, "Plazo: Debe escoger un valor", ""];
                } if (postdata.idcondicion == 0) {
                    return [false, "Condición: Debe escoger un valor", ""];
                } if (postdata.idestadocto == 0) {
                    return [false, "Estado: Debe escoger un valor", ""];
                } if (postdata.idcontactoproveedor == 0) {
                    return [false, "Contacto: Debe escoger un valor", ""];
                } if (postdata.idmoneda == 0) {
                    return [false, "Moneda: Debe escoger un valor", ""];
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"idservicio\",\"op\":\"cn\",\"data\":\"" + postdata.idservicio + "\"}]}";
                    $('#' + subgrid_table_id).jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                needDisable = false;
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($('#' + subgrid_table_id).attr('id'));
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

    $('#' + subgrid_table_id).closest("div.ui-jqgrid-view").children("div.ui-jqgrid-titlebar").css("background-color", "#08298A");

    $("#" + pager_id + "_left").css("width", "");

}

