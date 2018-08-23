$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full' style='display: none;'>Producto {idproducto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'><span style='color:red'>*</span>Producto {nombreProd}</div>";
    tmpl += "<div class='column-half'>Usuario<span style='color:red'>*</span>{usuario}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Ubicación <span style='color:red'>*</span>{ubicacion}</div>";
    tmpl += "<div class='column-half'>Código Interno {codigoInterno}</div>";
    tmpl += "</div>";

    tmpl += "<hr style='width:100%;'/>";
    tmpl += "<div> {sData} {cData}  </div>";
    tmpl += "</div>";

    var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'Nombre Producto',
            name: 'idproducto',
            width: 250,
            align: 'center',
            sortable: false,
            editable: true,
            hidden: true,
        },
        {
            label: 'Producto',
            name: 'nombreProd',
            jsonmap: 'producto.nombre',
            width: 250,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: "text",
            search: true,
            editrules: {
                required: true
            },
            editoptions: {
                dataInit: function (element) {
                    $(element).width(170);
                    $(element).addClass("nombreProd");
                    window.setTimeout(function () {
                        $(element).autocomplete({
                            id: 'AutoComplete',
                            appendTo: "body",
                            disabled: false,
                            delay: 500,
                            minLength: 3,
                            source: function (request, response) {
                                this.xhr = $.ajax({
                                    type: "GET",
                                    url: '/lic/buscaprod/' + request.term,
                                    data: request,
                                    dataType: "json",
                                    success: function (data) {
                                        console.log("data:" + JSON.stringify(data))
                                        response(data);
                                    },
                                    error: function (model, response, options) {
                                        response([]);
                                    }
                                });
                                $(element).autocomplete('widget').css('font-size', '11px');
                                $(element).autocomplete('widget').css('z-index', '1000');

                            },
                            autoFocus: true,
                            select: function (event, ui) {
                                $("input#nombreProd").val(ui.item.label);
                                $("input#idproducto").val(ui.item.value);
                                return false;
                            },
                        });
                    }, 100);
                }
            }
        },
        {
            label: 'Usuario',
            name: 'usuario',
            align: 'center',
            width: 200,
            editable: true,
            search: true
        },
        {
            label: 'Ubicación',
            name: 'ubicacion',
            align: 'center',
            width: 200,
            editable: true,
            search: false
        },
        {
            label: 'Código Interno',
            name: 'codigoInterno',
            align: 'center',
            width: 100,
            editable: true,
            search: false
        }
    ];

    $("#grid").jqGrid({
        url: '/lic/ubicacioninstalacion',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: viewModel,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        width: null,
        shrinkToFit: false,
        caption: 'Ubicación',
        pager: "#pager",
        viewrecords: true,
        rowList: [10, 20, 30, 40, 50],
        styleUI: "Bootstrap",
        editurl: '/lic/ubicacioninstalacion'
        // ,
        // subGrid: true,
        // subGridRowExpanded: showChildGrid
    });

    $("#grid").jqGrid('filterToolbar', {
        stringResult: true,
        searchOperators: true,
        searchOnEnter: false,
        defaultSearch: 'cn'
    });

    $('#grid').jqGrid('navGrid', "#pager", {
            edit: true,
            add: true,
            del: true,
            refresh: true,
            search: false, // show search button on the toolbar        
            cloneToTop: false
        },

        {
            editCaption: "Modifica Ubicación",
            closeAfterEdit: true,
            recreateForm: true,
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return [true, 'Error: ' + data.responseText, ""];
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $("#grid").jqGrid('setGridParam', {
                        search: true,
                        postData: {
                            filters
                        }
                    }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }
            // ,
            // beforeShowForm: function (form) {
            //     // var grid = $("#grid");
            //     // var rowKey = grid.getGridParam("selrow");
            //     // var rowData = grid.getRowData(rowKey);
            //     // var estad = rowData.estado;
            //     // if (estad != 'A la Espera') {
            //     //     setTimeout(function () {
            //     //         $("#idProducto").attr('disabled', true);
            //     //         $("#numlicencia").attr('disabled', true);
            //     //         $("#fechaUso").attr('disabled', true);
            //     //         $("#cui").attr('disabled', true);
            //     //         $("#sap").attr('disabled', true);
            //     //         $("#comentarioSolicitud").attr('disabled', true);
            //     //     }, 500);

            //     // } else {
            //     //     $("#cui").attr('disabled', true);
            //     // }
            // },
            // beforeSubmit: function (postdata, formid) {
            //     // console.log("beforeSubmit");
            //     // var grid = $('#grid');
            //     // var rowKey = grid.getGridParam("selrow");
            //     // var rowData = grid.getRowData(rowKey);
            //     // if (rowData.estado != 'A la Espera') {
            //     //     return [false, "No puede editar asignación debe estar en estado A la Espera", ""];
            //     // } else if (!(postdata.numlicencia > 0)) {
            //     //     return [false, "Cantidad debe ser mayor que cero", ""];
            //     // } else if (!(postdata.cui > 0) || postdata.cui.length > 4) {
            //     //     return [false, "CUI debe ser numérico y máximo 4 caracteres", ""];
            //     // } else if (!(postdata.sap >= 0) || postdata.sap.length > 5) {
            //     //     return [false, "SAP debe ser numérico y máximo 5 caracteres", ""];
            //     // } else {
            //     //     return [true, "", ""]
            //     // }
            // }

        }, {
            addCaption: "Agrega Ubicación",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return 'Error: ' + data.responseText
            },
            afterSubmit: function (response, postdata) {
                var json = response.responseText;
                var result = JSON.parse(json);
                if (result.error != 0) {
                    return [false, result.glosa, ""];
                } else {
                    var filters = "{\"groupOp\":\"AND\",\"rules\":[{\"field\":\"nombre\",\"op\":\"cn\",\"data\":\"" + postdata.nombre + "\"}]}";
                    $("#grid").jqGrid('setGridParam', {
                        search: true,
                        postData: {
                            filters
                        }
                    }).trigger("reloadGrid");
                    return [true, "", ""];
                }
            }
            // ,

            // beforeShowForm: function (form) {
            //     // $.ajax({
            //     //     type: "GET",
            //     //     url: '/lic/usuariocui',
            //     //     async: false,
            //     //     success: function (data) {
            //     //         if (data.length > 0) {
            //     //             $("input#cui").val(data[0].cui);
            //     //             $("#cui").attr('disabled', true);
            //     //         } else {
            //     //             alert("No existe CUI asociado al Usuario");

            //     //         }
            //     //     }
            //     // });
            // },
            // beforeSubmit: function (postdata, formid) {
            //     // if (!(postdata.numlicencia > 0)) {
            //     //     return [false, "Cantidad debe ser mayor que cero", ""];
            //     // } else if (!(postdata.cui > 0) || postdata.cui.length > 4) {
            //     //     return [false, "CUI debe ser numérico y máximo 4 caracteres", ""];
            //     // } else if (!(postdata.sap >= 0) || postdata.sap.length > 5) {
            //     //     return [false, "SAP debe ser numérico y máximo 5 caracteres", ""];
            //     // } else {
            //     //     return [true, "", ""]
            //     // }
            // },
        }, {

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
            var url = '/lic/ubicacionexcel';
            $('#grid').jqGrid('excelExport', { "url": url });
        }
    });
    $("#pager_left").css("width", "");
});