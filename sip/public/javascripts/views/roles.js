$(document).ready(function () {

    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Tipo {idtipo}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Nombre {nombre}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Valor {valor}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>tipo {tipo}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelParametro = [
        { label: 'id', name: 'id', key: true, hidden: true },

        {
            label: 'Nombre', name: 'first_name', width: 300, align: 'left',
            search: true, editable: true, hidden: false,
            jsonmap: 'first_name'
        },

        {
            label: 'Apellido', name: 'last_name', width: 300, align: 'left',
            search: true, editable: true, hidden: false,
            jsonmap: 'last_name'
        },

        {
            label: 'Nombre de usuario', name: 'uname', width: 300, align: 'left',
            search: true, editable: true, hidden: false
        },

        {
            label: 'Rol', name: 'rol', width: 300, align: 'left',
            search: true, editable: false, hidden: false, jsonmap:'nombrerol'
        },

        {  
            label: 'Rol', name: 'idrol', search: false, editable: true, hidden: true, jsonmap:'rol.rid' ,
            edittype: "select",
            editoptions: {
                dataUrl: '/getroles',
                buildSelect: function (response) {
                    var grid = $("#table_roles");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.tipo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Rol--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].tipo == thissid) {
                            s += '<option value="' + data[i].tipo + '" selected>' + data[i].tipo + '</option>';
                        } else {
                            s += '<option value="' + data[i].tipo + '">' + data[i].tipo + '</option>';
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

    $("#table_roles").jqGrid({
        url: '/roles/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelParametro,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Lista de Usuarios',
        pager: "#pager_roles",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/parametros/action',
        styleUI: "Bootstrap",
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }
    });
    $("#table_roles").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $('#table_roles').jqGrid('navGrid', "#pager_roles", { edit: false, add: false, del: false, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
        {
            editCaption: "Modifica Parametro",
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
                sipLibrary.centerDialog($('#table_roles').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_roles").attr('id'));
            }
        },
        {
            addCaption: "Agrega Parametro",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.idtipo == 0) {
                    return [false, "Tipo: Debe escoger un valor", ""];
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
                    $("#table_roles").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#table_roles').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#table_roles").attr('id'));
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

    $("#pager_roles_left").css("width", "");
});