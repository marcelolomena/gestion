$(document).ready(function () {

    $.jgrid.styleUI.Bootstrap.base.rowTable = "table table-bordered table-striped";

    idproveedor = 0;

    var template = "<div id='responsive-form' class='clearfix'>";

    template += "<div class='form-row'>";
    template += "<div class='column-full'>Contrato<span style='color:red'>*</span>{nombre}</div>";
    template += "<div class='column-full'>Proveedor<span style='color:red'>*</span>{idproveedor}</div>";
    template += "<div class='column-full'>Contacto Facturación<span style='color:red'>*</span>{idcontactofacturacion}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Tipo Solicitud<span style='color:red'>*</span>{idtiposolicitud}</div>";
    template += "<div class='column-half'>Estado Solicitud<span style='color:red'>*</span>{idestadosol}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Solicitud{solicitudcontrato}</div>";
    template += "<div class='column-half'>Número{numero}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Documento<span style='color:red'>*</span>{idtipodocumento}</div>";
    template += "<div class='column-half'>Negociador<span style='color:red'>*</span>{uidpmo}</div>";
    template += "</div>";

    template += "<div class='form-row'>";
    template += "<div class='column-half'>Tipo<span style='color:red'>*</span>{tipocontrato}</div>";
    template += "</div>";

    template += "<div class='form-row' style='display: none;'>";
    template += "<div class='column-half'>razonsocial{razonsocial}</div>";
    template += "<div class='column-half'>pmoresponsable{pmoresponsable}</div>";
    template += "<div class='column-half'>tiposolicitud{tiposolicitud}</div>";
    template += "<div class='column-half'>estadosolicitud{estadosolicitud}</div>";
    template += "</div>";
    
    template += "<div class='form-row'>";
    template += "<div class='column-half'>Codigo Art<span style='color:red'>*</span>{codigoart}</div>";
    template += "<div class='column-full'>Nombre Art{nombreart}</div>";
    template += "</div>";    

    template += "<hr style='width:100%;'/>";
    template += "<div> {sData} {cData}  </div>";
    template += "</div>";

    var modelContrato = [
        { label: 'id', name: 'id', key: true, hidden: true },
        { label: 'Contrato', name: 'nombre', width: 250, align: 'left', search: true, editable: true },
        {
            label: 'Proveedor', name: 'idproveedor', search: false, editable: true, hidden: true, jsonmap: "proveedor.id",
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
                        if (isNaN(thissid)) {
                           idproveedor = 0;
                        }  
                        else                      
                        {
                           idproveedor = thissid;
                        };

                        if (idproveedor != "0") {
                            $.ajax({
                                type: "GET",
                                url: '/contactos/' + idproveedor,
                                async: false,
                                success: function (data) {
                                    var grid = $("#grid");
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.idcontactofacturacion;
                                    var s = "<select>";//el default
                                    s += '<option value="0">--Escoger Contacto Facturación--</option>';
                                     $.each(data, function (i, item) {
                                    if (data[i].id == thissid) {
                                      s += '<option value="' + data[i].id + '" selected>' + data[i].contacto + '</option>';
                                  } else {
                                      s += '<option value="' + data[i].id + '">' + data[i].contacto + '</option>';
                                     }
                                    });
                                    s += "</select>";
                                    $("select#idcontactofacturacion").html(s);
                                }
                            });
                        } 
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        
                        if ($('option:selected', this).val() != 0) {
                            $("input#razonsocial").val($('option:selected', this).text());
                        } else {
                            $("input#razonsocial").val("");
                        }
                        var idproveedor = $('option:selected', this).val()
                        if (idproveedor != "0") {
                            $.ajax({
                                type: "GET",
                                url: '/contactos/' + idproveedor,
                                async: false,
                                success: function (data) {
                                    var grid = $("#grid");
                                    var rowKey = grid.getGridParam("selrow");
                                    var rowData = grid.getRowData(rowKey);
                                    var thissid = rowData.idcontactofacturacion;
                                    var s = "<select>";//el default
                                    s += '<option value="0">--Escoger Contacto Facturación--</option>';
                                     $.each(data, function (i, item) {
                                    if (data[i].id == thissid) {
                                      s += '<option value="' + data[i].id + '" selected>' + data[i].contacto + '</option>';
                                  } else {
                                      s += '<option value="' + data[i].id + '">' + data[i].contacto + '</option>';
                                     }
                                    });
                                    s += "</select>";
                                    $("select#idcontactofacturacion").html(s);
                                }
                            });
                        } 
                    }
                }],
            }
        },
        {
            label: 'TipoContrato', name: 'tipocontrato', search: false, editable: true, hidden: false,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemContrato, 
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var actual = $("input#codigoart").attr("readonly"); 
                        if (actual == 'readonly') {               
                            $("input#codigoart").attr("readonly", false);
                        } else {
                            $("input#codigoart").attr("readonly", true);
                        } 
                    }
                }],                
            }
        },        
        { label: 'Solicitud', name: 'solicitudcontrato', width: 150, align: 'left', search: true, editable: true, hidden:true },
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
        {
                label: 'idcontactofacturacion', name: 'idcontactofacturacion', search: false, editable: true, hidden: true,
                edittype: "select",
                editoptions: {
                    dataUrl: '/contactos/' + idproveedor,
                    buildSelect: function (response) {
                        var grid = $("#grid");
                        var rowKey = grid.getGridParam("selrow");
                        var rowData = grid.getRowData(rowKey);
                        var thissid = rowData.idcontactofacturacion;
                        var data = JSON.parse(response);
                        var s = "<select>";//el default
                        s += '<option value="0">--Escoger Contacto Facturación--</option>';
                        $.each(data, function (i, item) {
                            if (data[i].id == thissid) {
                                s += '<option value="' + data[i].id + '" selected>' + data[i].contacto + '</option>';
                            } else {
                                s += '<option value="' + data[i].id + '">' + data[i].contacto + '</option>';
                            }
                        });
                        return s + "</select>";
                    }
                }
            },
        {
            label: 'Estado Solicitud', name: 'idestadosol', hidden: true, search: true, editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/parameters/estadosolicitud',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.solicitudcontratoes;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Estado Solicitud--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var thistid = $(this).val();
                        $("input#estadosolicitud").val($('option:selected', this).text());
                    }
                }],
            }, dataInit: function (elem) { $(elem).width(200); }
        },
        {
            label: 'Estado Solicitud', name: 'estadosolicitud', width: 150, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Número', name: 'numero', width: 150, align: 'left', search: true, editable: true,
            searchoptions: {
                sopt: ["ge", "le", "eq"] // ge = greater or equal to, le = less or equal to, eq = equal to
            }
        },

        /*{
            label: 'TipoDocumento', name: 'tipodocumento', search: false, editable: true, hidden: true,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemDocumento
            }
        },*/
        {
            label: 'Tipo Documento', name: 'tipodocumento', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/contrato/tipodocumento',
                buildSelect: function (response) {
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Tipo Documento--</option>';
                    $.each(data, function (i, item) {
                        s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                    });
                    return s + "</select>";
                }
            },
        },
        {
            label: 'Tipo Documento', name: 'idtipodocumento', editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/contrato/tipodocumento',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.plazocontrato;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Tipo Documento--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var thistid = $(this).val();
                        $("input#tipodocumento").val($('option:selected', this).text());
                    }
                }],
            }
        },        
        {
            label: 'Tipo Solicitud', name: 'tiposolicitud', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/parameters/tiposolicitud',
                buildSelect: function (response) {
                    var data = JSON.parse(response);
                    var s = "<select>";
                    s += '<option value="0">--Escoger Tipo Solicitud--</option>';
                    $.each(data, function (i, item) {
                        s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                    });
                    return s + "</select>";
                }
            },
        },
        {
            label: 'Tipo Solicitud', name: 'idtiposolicitud', editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/parameters/tiposolicitud',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.plazocontrato;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Tipo Solicitud--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].nombre == thissid) {
                            s += '<option value="' + data[i].id + '" selected>' + data[i].nombre + '</option>';
                        } else {
                            s += '<option value="' + data[i].id + '">' + data[i].nombre + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        var thistid = $(this).val();
                        $("input#tiposolicitud").val($('option:selected', this).text());
                    }
                }],
            }
        },
        {
            label: 'Negociador', name: 'uidpmo', search: false, editable: true, hidden: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/usuarios_por_rol/Negociador',
                buildSelect: function (response) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    var thissid = rowData.uidpmo;
                    var data = JSON.parse(response);
                    var s = "<select>";//el default
                    s += '<option value="0">--Escoger Negociador--</option>';
                    $.each(data, function (i, item) {
                        if (data[i].uid == thissid) {
                            s += '<option value="' + data[i].uid + '" selected>' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        } else {
                            s += '<option value="' + data[i].uid + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                        }
                    });
                    return s + "</select>";
                },
                dataEvents: [{
                    type: 'change', fn: function (e) {
                        $("input#pmoresponsable").val($('option:selected', this).text());
                    }
                }],
            }
        },
        {
            label: 'PMO', name: 'pmoresponsable', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true
        },
        {
            label: 'Codigo ART', name: 'codigoart', width: 200, align: 'left', search: true, editable: true,hidden:true,
            editrules: { edithidden: false }, hidedlg: true, editoptions: { size: 10, readonly: 'readonly',
        
            dataEvents: [{
                type: 'change', fn: function (e) {
                    var grid = $("#grid");
                    var rowKey = grid.getGridParam("selrow");
                    var rowData = grid.getRowData(rowKey);
                    console.log("rowData:" + rowData);
                    var thissid = $(this).val();
                    $.ajax({
                        type: "GET",
                        url: '/getcodigoart/' + thissid,
                        async: false,
                        success: function (data) {
                            if (data.length > 0) {
                                console.log("glosa:" + data[0].nombreart);
                                $("input#nombreart").val(data[0].nombreart);
                                $("input#program_id").val(data[0].program_id);
                            } else {
                                alert("No existe el codigo art ingresado");
                                $("input#nombreart").val("");
                                $("input#program_id").val("0");                                
                            }
                        }
                    });
                    }
            }],

        } 
        },
        {
            label: 'Nombre', name: 'nombreart', width: 200, align: 'left', search: true, editable: true,
            editrules: { edithidden: false }, hidedlg: true, editoptions: { size: 10, readonly: 'readonly'} 
        },   
        {
            label: 'ID Art', name: 'program_id', width: 200, align: 'left', search: false, editable: false,
            hidden: true, editoptions: {defaultValue: "0"}
        }                     
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
        //width: null,
        //shrinkToFit: false,
        autowidth: true,  // set 'true' here
        shrinkToFit: true, // well, it's 'true' by default        
        caption: 'Lista de contratos',
        pager: "#pager",
        viewrecords: true,
        rowList: [5, 10, 20, 50],
        styleUI: "Bootstrap",
        editurl: '/contratos/action',
        loadError: sipLibrary.jqGrid_loadErrorHandler,
        gridComplete: function () {
            var recs = $("#grid").getGridParam("reccount");
            if (isNaN(recs) || recs == 0) {

                $("#grid").addRowData("blankRow", { "nombre": "No hay datos" });
            }
        },
        subGrid: true,
        subGridRowExpanded: showSubGrids,
        subGridOptions: {
            plusicon: "glyphicon-hand-right",
            minusicon: "glyphicon-hand-down"
        },
    }).jqGrid('filterToolbar', {
        stringResult: true,
        searchOnEnter: true,
        defaultSearch: "cn",
        searchOperators: true,
        beforeSearch: function () {
            var postData = $("#grid").jqGrid('getGridParam', 'postData');
            var searchData = jQuery.parseJSON(postData.filters);
            for (var iRule = 0; iRule < searchData.rules.length; iRule++) {
                if (searchData.rules[iRule].field === "razonsocial") {
                    var valueToSearch = searchData.rules[iRule].data;
                    searchData.rules[iRule].field = 'idproveedor'
                }
            }
            //return false;
            postData.filters = JSON.stringify(searchData);
        },
        afterSearch: function () {

        }
    });

    $("#grid").jqGrid('navGrid', "#pager", {
        edit: true, add: true, del: true, search: false,
        refresh: true, view: true, position: "left", cloneToTop: false
    },
        {
            editCaption: "Modifica Contrato",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {
                if (parseInt(postdata.idproveedor) == 0) {
                    return [false, "Proveedor: Debe escoger un valor", ""];
                } if (parseInt(postdata.idtiposolicitud) == 0) {
                    return [false, "Tipo Solicitud: Debe escoger un valor", ""];
                } if (parseInt(postdata.idestadosol) == 0) {
                    return [false, "Estado Solicitud: Debe escoger un valor", ""];
                } if (postdata.nombre.trim().length == 0) {
                    return [false, "Nombre: Debe ingresar un texto", ""];
                } if (parseInt(postdata.uidpmo) == 0) {
                    return [false, "PMO: Debe escoger un valor", ""];
                } if (parseInt(postdata.nombreart) == "") {
                    return [false, "Codigo ART: Se requiere un codigo existente", ""];                    
                } else {
                    return [true, "", ""]
                }
            }, afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error_code != 0)
                    return [false, result.error_text, ""];
                else
                    return [true, "", ""]
            }, beforeShowForm: function (form) {
                var grid = $("#grid");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                var tipoContrato = rowData.tipoContrato
                if (tipoContrato == 0) {
                    //$("input#codigoart").attr("readonly", false);
                    $('#codigoart', form).attr("readonly", false);
                }
                idproveedor = rowData.idproveedor;
                sipLibrary.centerDialog($('#grid').attr('id'));
            }
        },
        {
            addCaption: "Agrega Contrato",
            closeAfterAdd: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: template,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            }, beforeSubmit: function (postdata, formid) {

                if (parseInt(postdata.idproveedor) == 0) {
                    return [false, "Proveedor: Debe escoger un valor", ""];
                } if (parseInt(postdata.idtiposolicitud) == 0) {
                    return [false, "Tipo Solicitud: Debe escoger un valor", ""];
                } if (parseInt(postdata.idestadosol) == 0) {
                    return [false, "Estado Solicitud: Debe escoger un valor", ""];
                } if (postdata.nombre.trim().length == 0) {
                    return [false, "Nombre: Debe ingresar un texto", ""];
                } if (parseInt(postdata.uidpmo) == 0) {
                    return [false, "PMO: Debe escoger un valor", ""];
                } if (parseInt(postdata.nombreart) == "") {
                    return [false, "Codigo ART: Se requiere un codigo existente", ""];                    
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
                var grid = $("#grid");
                var rowKey = grid.getGridParam("selrow");
                var rowData = grid.getRowData(rowKey);
                idproveedor = rowData.idproveedor;
                $(form).find("input:radio[value='1']").attr('checked', true);
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
            var url = '/contratos/excel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });

    $("#pager_left").css("width", "");

    $(window).bind('resize', function () {
        $("#grid").setGridWidth($(".gcontainer").width(), true);
        //$("#grid").jqGrid("setGridWidth",$("#gcontainer").width() );
        $("#pager").setGridWidth($(".gcontainer").width(), true);
    });
});