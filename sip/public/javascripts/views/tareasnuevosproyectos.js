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
    template += "<div class='column-full'>Iniciativa{idiniciativapadre}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Iniciativa Programa{idiniciativaprograma}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Moneda{idmoneda}</div>";
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
    var childGridURL = "/presupuestoiniciativa/" + parentRowKey;

    var modelTareasNuevosProyectos = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Cui', name: 'idcui', width: 50, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Servicio', name: 'idservicio', width: 50, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Proveedor', name: 'idproveedor', width: 50, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Tarea', name: 'tarea', width: 50, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Tipo Pago', name: 'idtipopago', width: 200, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Fecha Inicio', name: 'fechainicio', width: 200, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Fecha Fin', name: 'fechafin', width: 200, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Requiere Contrato', name: 'reqcontrato', width: 100, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Moneda', name: 'idmoneda', width: 80, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Costo Unitario', name: 'costounitario', width: 80, align: 'left',
            search: true, editable: false, hidden: false,
        },
        {
            label: 'Cantidad', name: 'cantidad', width: 80, align: 'left',
            search: true, editable: false, hidden: false,
        },
         {
            label: 'Con IVA', name: 'coniva', width: 80, align: 'left',
            search: true, editable: false, hidden: false,
        }

    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        caption: 'Tareas',
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
        editurl: '/presupuestoiniciativa/action',
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
function showSubGrids3(subgrid_id, row_id) {
    gridFlujoNuevaTarea(subgrid_id, row_id,'flujo');
}