$(document).ready(function () {

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Nombre {nombre}</div>";
    tmpl += "</div>";


    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Cuenta {idcuenta}</div>";
    tmpl += "</div>";


    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Criticidad {criticidad}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Tarea {tarea}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>Cuenta {cuentacontable}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelServicio = [
        {   label: 'id', name: 'id', key: true, hidden: true },
        {
            label: 'Nombre', name: 'nombre', width: 600, align: 'left',
            search: true, editable: true, editrules: { required: true }, hidden: false
        },
        {   
            label: 'Cuenta contable', name: 'cuentacontable', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/serviciosext/cuentas',
                buildSelect: function (response) {
                    var grid = $("#table_parametro");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idcuenta;
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
                }
            }
        },
        {
            
            label: 'idcuenta', name: 'idcuenta', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/serviciosext/cuentas',
                buildSelect: function (response) {
                    var grid = $("#table_parametro");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.idcuenta;
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
                    type: 'change', fn: function (e) {
                        $("input#cuentacontable").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Criticidad', name: 'criticidad', width: 200, align: 'left',
            search: true, editable: true, editrules: { required: true }, hidden: false
        },
        {
            label: 'Tarea', name: 'tarea', width: 200, align: 'left',
            search: true, editable: true, editrules: { required: true }, hidden: false
        },
    ];

    $("#table_servicio").jqGrid({
        url: '/serviciosext/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelServicio,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Lista de servicios',
        pager: "#pager_servicio",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/serviciosext/action',
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_servicio").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#table_servicio').jqGrid('navGrid', "#pager_servicio", { edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
        {
            editCaption: "Modifica Servicio",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
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
                sipLibrary.centerDialog($('#table_servicio').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_servicio").attr('id'));
            }
        },
        {
            addCaption: "Agrega Servicio",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.idcuenta == 0) {
                    return [false, "Cuenta: Debe escoger un valor", ""];
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
                    $("#table_servicio").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_servicio').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_servicio").attr('id'));
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

    $("#pager_servicio_left").css("width", "");
});