function gridDesglose(parentRowID, parentRowKey) {
    var tmplP = "<div id='responsive-form' class='clearfix'>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Cui{idcui}</div>";
    tmplP += "<div class='column-half'>Cuenta Contable{idcuentacontable}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row'>";
    tmplP += "<div class='column-half'>Porcentaje{porcentaje}</div>";
    tmplP += "<div class='column-half'>Monto{monto}</div>";
    tmplP += "</div>";

    tmplP += "<div class='form-row' style='display: none;'>";
    tmplP += "<div class='column-half'>idsolicitud {idsolicitud}</div>";
    //tmplP += "<div class='column-half'>idcuentacontable {idcuentacontable}</div>";
    tmplP += "</div>";

    tmplP += "<hr style='width:100%;'/>";
    tmplP += "<div> {sData} {cData}  </div>";
    tmplP += "</div>";

    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";
    var childGridURL = "/desgloseporsolicitud/" + parentRowKey;

    var modelDesglose = [
        { label: 'id', name: 'id', key: true, hidden: true },  
        { label: 'Cui',
            name: 'cui',
            width: 100,
            align: 'left',
            search: false,
            editable: true,
            editoptions: { size: 10, readonly: 'readonly'}                       
        },
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
                    var s = "<select>";
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
                dataEvents: [{
                    
                }],
            }
        },         
        { label: 'Cuenta Contable',
            name: 'cuentacontable',  
            search: false,
            align: 'left',                 
            width: 100,
            editable: true,
            editoptions: { size: 10, readonly: 'readonly'}                                    
        },  
         {
            label: 'Cuenta Contable', name: 'idcuentacontable', search: false, editable: true,editrules: { required: true },
            hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/serviciosext/cuentas',
                buildSelect: function (response) {
                    var grid = $('#' + childGridID);
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idcuentacontable;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Cuenta--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].id == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].cuentacontable + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].cuentacontable + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        { label: 'Nombre Cuenta',
            name: 'nombrecuenta',
            width: 100,
            search: false,
            align: 'left',
            editable: true,
            
        },
        { label: 'Porcentaje',
            name: 'porcentaje',
            width: 200,
            search: false,
            align: 'left',
            editable: true,
            formatter: 'number', formatoptions: { decimalPlaces: 2 }
        },
        { label: 'Monto',
            name: 'monto',
            hidden: true,
            width: 200,
            search: false,
            align: 'left',
            editable: true,
            editoptions: { readonly: 'readonly' },
            formatter: 'number', formatoptions: { decimalPlaces: 0 }
        },
    ];

    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');


    $("#" + childGridID).jqGrid({
        url: childGridURL,
        mtype: "POST",
        datatype: "json",
        page: 1,
        caption: 'Items',
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default
        colModel: modelDesglose,
        viewrecords: true,
        styleUI: "Bootstrap",
        regional: 'es',
        height: 'auto',
        pager: "#" + childGridPagerID,
        editurl: '/desglosecontable/action',
        gridComplete: function () {
            var recs = $("#" + childGridID).getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#" + childGridID).addRowData("blankRow", { "cui": "", "cuentacontable": "No hay datos" });
            }
        }
    });

    $("#" + childGridID).jqGrid('filterToolbar', {
        stringResult: true, searchOperators: true,
        searchOnEnter: false, defaultSearch: 'cn'
    });

    $("#" + childGridID).jqGrid('navGrid', "#" + childGridPagerID, {
        edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false
    },
        {
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            editCaption: "Modificar Desglose Contable",
            template: tmplP,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];

                return [true, "", ""]
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
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
            addCaption: "Agregar Desglose Contable",
            template: tmplP,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            onclickSubmit: function (rowid) {
                return { parent_id: parentRowKey };
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                return [true, "", ""]
            },
            beforeShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            },
            afterShowForm: function (form) {
                sipLibrary.centerDialog($("#" + childGridID).attr('id'));
            }
        },
        {
            closeAfterDelete: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            addCaption: "Elimina Iniciativa",
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
