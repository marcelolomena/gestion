$(document).ready(function () {

   $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";
   
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>* </span>Nombre {nombre}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>* </span>Cuenta {idcuenta}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Tarea {tarea}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Agrupacion SAP {agrupacionsap}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Secuencia SAP {secuenciasap}</div>";
    tmpl += "</div>";    

    tmpl += "<div class='form-row' style='display: none;'>";
    tmpl += "<div class='column-half'>cuentacontable {cuentacontable}</div>";
    tmpl += "<div class='column-half'>Criticidad {criticidad}</div>";
    tmpl += "</div>";
    
    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>* </span>Tipo Servicio {tiposervicio}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var modelServicio = [
        {   label: 'id', name: 'id', key: true, hidden: true },
        {   label: 'idcuenta', name: 'idcuenta', hidden: true },
        {
            label: 'Nombre', name: 'nombre', width: 500, align: 'left',
            search: true, editable: true, editrules: { required: true }, hidden: false
        },
        {
            label: 'Cuenta Contable', name: 'idcuenta', search: false, editable: true,editrules: { required: true },
            hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/serviciosext/cuentas',
                buildSelect: function (response) {
                    var grid = $("#grid");
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
            label: 'Cuenta Contable', name: 'cuentacontable', width: 200, align: 'left', search: true,
            editable: true, jsonmap: "cuentascontable.cuentacontable",
            stype: 'select',
            searchoptions: {
                dataUrl: '/serviciosext/cuentas',
                buildSelect: function (response) {
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Cuenta--</option>';
                    $.each(data, function (i, item) {
                        s += '<option value="' + data[i].id + '">' + data[i].cuentacontable + '</option>';
                    });
                    return s + "</select>";
                }
            },
        },
        {
            label: 'NombreCuenta', name: 'nombrecuenta', width: 500, align: 'left',
            search: false, editable: true,jsonmap: "cuentascontable.nombrecuenta", editrules: { required: false }, hidden: false
        },
        {
            label: 'Tarea', name: 'tarea', width: 150, align: 'left',
            search: true, editable: true, editrules: { required: false }, hidden: false
        },
        {
            label: 'Agrupacion SAP', name: 'agrupacionsap', width: 300, align: 'left',
            search: true, editable: true, editrules: { required: false }, hidden: false
        },
        {
            label: 'Secuencia SAP', name: 'secuenciasap', width: 200, align: 'left',
            search: true, editable: true, editoptions: {
                dataInit: function (element) {
                    $(element).mask("000000", { placeholder: "_________" });

                },editrules: { required: false }, hidden: false
             },
        },
                {
            label: 'Tipo Servicio', name: 'tiposervicio',
            search: false, editable: true, hidden: true,
            editrules: { required: true },
            edittype: "select",
            editoptions: {
                dataUrl: '/parameters/tiposervicio',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.tipo;
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Tipo Servicio--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].nombre + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].nombre + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        if ($('option:selected', this).val() != 0) {
                            $("input#tiposervicio").val('option:selected', this).text();
                        } else {
                            $("input#tiposervicio").val("");
                        }
                    }
                }],
            },
            dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Tipo Servicio', name: 'tiposervicio', width: 250, align: 'left',
            search: true, editable: true, hidedlg: true,
            editrules: { edithidden: false, required: true }
        },          
    ];

    $("#grid").jqGrid({
        url: '/serviciosext/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelServicio,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: 1600,
        autowidth: true,
        shrinkToFit: true,
        caption: 'Lista de servicios',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        editurl: '/serviciosext/action',
        styleUI: "Bootstrap",
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        }
    }).jqGrid('filterToolbar', { 
         stringResult: true, 
         searchOnEnter: false,
         defaultSearch: 'cn',         
         searchOperators: true, 
         beforeSearch: function () {
            var postData = $("#grid").jqGrid('getGridParam', 'postData');
            var searchData = jQuery.parseJSON(postData.filters);
            for (var iRule = 0; iRule < searchData.rules.length; iRule++) {
                if (searchData.rules[iRule].field === "cuentacontable") {
                    var valueToSearch = searchData.rules[iRule].data;
                    searchData.rules[iRule].field = 'idcuenta'
                }
            }
            //return false;
            postData.filters = JSON.stringify(searchData);
        },
            afterSearch: function () {

        } });

    $('#grid').jqGrid('navGrid', "#pager",
     { edit: true, add: true, del: true, search: false, refresh: true, view: true, position: "left", cloneToTop: false },           
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
                sipLibrary.centerDialog($('#grid').attr('id'));
            }, afterShowForm: function (form) {
                sipLibrary.centerDialog($("#grid").attr('id'));
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
                    if (postdata.tiposervicio == "0") {
                        return [false, "Tipo Servicio: Debe escoger un valor", ""]; 
                    } else {
                        return [true, "", ""]
                    }
                },
               afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0) {
                    return [false, result.error_text, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $("#grid").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                    
                sipLibrary.centerDialog($('#grid').attr('id'));
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

    $('#grid').jqGrid('navButtonAdd', '#pager', {
        caption: "",
        buttonicon: "glyphicon glyphicon-download-alt",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/serviciosext/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });
    
    $("#pager_left").css("width", "");
});