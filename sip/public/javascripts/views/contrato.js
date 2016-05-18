$(document).ready(function () {
    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Contrato {nombre}</div>";
    template += "<div class='column-full'>Proveedor {idproveedor}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Fecha Inicio {fechainicontrato}</div>";
    template += "<div class='column-half'>Fecha Término {fechatercontrato}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Solicitud {solicitudcontrato}</div>";
    template += "<div class='column-half'>Estado Solicitud {solicitudcontratoes}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Plazo {plazocontrato}</div>";
    template += "<div class='column-half'>Estado {estado}</div>";    
    template += "</div>";
    
    template += "<div class='form-row'>";
    template += "<div class='column-half'>Frecuencia {frecuenciafacturacion}</div>";
    template += "<div class='column-half'>Número {numero}</div>";    
    template += "</div>";    

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";


    var modelContrato = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Contrato', name: 'nombre', width: 300, align: 'left', search: true, editable: true },
        {
            label: 'Proveedor', name: 'idproveedor', search: false, editable: true, hidden: true, jsonmap: "Proveedor.id",
            edittype: "select",
            editoptions: {
                dataUrl: '/proveedores/list',
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
                        $("input#Proveedor.razonsocial").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        { label: 'Proveedor', name: 'razonsocial', width: 300, align: 'left', search: true, editable: false, jsonmap: "Proveedor.razonsocial" },
        {
            label: 'Fecha Inicio', name: 'fechainicontrato', width: 100, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }, editable: true,
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $('#grid')[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                }
            }
        },
        {
            label: 'Fecha Término', name: 'fechatercontrato', width: 150, align: 'left', search: true,
            formatter: 'date', formatoptions: { srcformat: 'ISO8601Long', newformat: 'Y-m-d' }, editable: true,
            formoptions: { rowpos: 2, colpos: 2 },
            searchoptions: {
                dataInit: function (el) {
                    $(el).datepicker({
                        language: 'es',
                        format: 'yyyy-mm-dd',
                        autoclose: true,
                        onSelect: function (dateText, inst) {
                            setTimeout(function () {
                                $('#grid')[0].triggerToolbar();
                            }, 100);
                        }
                    });
                },
                sopt: ["eq", "le", "ge"]
            },
            editoptions: {
                size: 10, maxlengh: 10,
                dataInit: function (element) {
                    $(element).datepicker({ language: 'es', format: 'yyyy-mm-dd', autoclose: true })
                }
            }
        },
        { label: 'Estado Solicitud', name: 'solicitudcontratoes', width: 150, align: 'left', search: true, editable: true },        
        { label: 'Solicitud', name: 'solicitudcontrato', width: 150, align: 'left', search: true, editable: true },
        { label: 'Estado', name: 'estado', width: 200, align: 'left', search: true, editable: true },
        { label: 'Plazo', name: 'plazocontrato', width: 150, align: 'left', search: true, editable: true },
        { label: 'Frecuencia', name: 'frecuenciafacturacion', width: 100, align: 'left', search: true, editable: true },        
        { label: 'Número', name: 'numero', width: 100, align: 'left', search: true, editable: true },
    ];
    $("#grid").jqGrid({
        url: '/contratos/list',
        mtype: "POST",
        datatype: "json",
        page: 1,
        colModel: modelContrato,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        width: null,
        shrinkToFit: false,
        caption: 'Lista de contratos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl:'/contratos/action',
        loadError: function (jqXHR, textStatus, errorThrown) {
            alert('HTTP status code: ' + jqXHR.status + '\n' +
                'textStatus: ' + textStatus + '\n' +
                'errorThrown: ' + errorThrown);
        }, gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        }
    });

    $("#grid").jqGrid('filterToolbar', { stringResult: true, searchOperators: true, searchOnEnter: false, defaultSearch: 'cn' });

    $("#grid").jqGrid('navGrid', "#pager", { edit: true, add: true, del: true, search: false, refresh: true, view: false, position: "left", cloneToTop: false },
        {
            editCaption: "Modifica Contrato",            
            closeAfterEdit: true,
            recreateForm: true,
            //url: '/contratos/update',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
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
            }
        },
        {
            addCaption: "Agrega Contrato",
            closeAfterAdd: true,
            recreateForm: true,
            //url: '/contratos/new',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (postdata.pid == 0) {
                    return [false, "Proveedor: Debe escoger un valor", ""];
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
                    $("#grid").jqGrid('setGridParam', { search: true, postData: { filters } }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }, beforeShowForm: function (form) {
                sipLibrary.centerDialog($('#grid').attr('id'));
            }
        },
        {
            //mtype: 'POST',
            //url: '/contratos/del',
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
        caption: "Excel",
        buttonicon: "silk-icon-page-excel",
        title: "Excel",
        position: "last",
        onClickButton: function () {
            var grid = $('#grid');
            var rowKey = grid.getGridParam("selrow");
            var url = '/contratos/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");
});