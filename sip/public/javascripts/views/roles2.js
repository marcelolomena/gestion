function gridRoles2(parentRowID, parentRowKey, suffix) {
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
    template += "<div class='column-half'><span style='color: red'>*</span>Rol{rid}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "</div>";

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";
    var childGridID = subgrid_table_id;
    var childGridPagerID = pager_id;
    var childGridURL = "/roles/list2/" + parentRowKey;

    var modelRoles2 = [
        {
            label: 'id',
            name: 'id',
            key: true,
            hidden: true
        },
        {
            label: 'Rol', name: 'rol', width: 300, align: 'left',
            search: true, editable: false, hidden: false, jsonmap:'glosarol'
        },

        {  
            label: 'Rol', name: 'rid', search: false, editable: true, hidden: true, jsonmap:'rol.rid' ,
            edittype: "select",
            editoptions: {
                dataUrl: '/getroles',
                buildSelect: function (response) {
                    var grid = childGridID;
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.tipo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Rol--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].tipo == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].glosarol + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].glosarol + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#rol").val($('option:selected', this).text());
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
        caption: 'Detalle Tarea/Servicio',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        page: 1,
        colModel: modelRoles2,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        //editurl: '/tareaenvuelo/action',
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
            url: '/tareaenvuelo/action',
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            beforeSubmit: function (postdata, formid) {
                if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe seleccionar un valor", ""];
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
                                    s += '<option value="' + data[i].idcui + '" selected>' + data[i].cui + ' - '+data[i].nombre+'</option>';
                                } else {
                                    s += '<option value="' + data[i].idcui + '">' + data[i].cui + ' - '+data[i].nombre+'</option>';
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
                            s += '<option value="0">--Escoger Proveedor--</option>';
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
                    //$('input#codigoart', form).attr('readonly', 'readonly');
                }, 1000);
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterAdd: true,
            recreateForm: true,
            mtype: "POST",
            url: '/tareaenvuelo/action',
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
                if (postdata.idservicio == 0) {
                    return [false, "Servicio: Debe seleccionar un valor", ""];
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
            url: '/tareaenvuelo/action',
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