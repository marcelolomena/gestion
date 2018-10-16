$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full' style='display: none;'>Producto {idproducto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Nombre<span style='color:red'>*</span>{nombre}</div>";
    
    tmpl += "<div class='column-half'>Ubicación <span style='color:red'>*</span>{ubicacion}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Código Interno<span style='color:red'>*</span>{codigoInterno}</div>";
    tmpl += "<div class='column-half'>CUI <span style='color:red'>*</span>{cui}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Observación {observacion}</div>";
    tmpl += "<div class='column-half'>Usuario<span style='color:red'>*</span>{usuario}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'><span style='color:red'>*</span>Producto {nombreProd}</div>";
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
                required: false
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
            label: 'Nombre',
            name: 'nombre',
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
        },
        {
            label: 'CUI',
            name: 'cui',
            align: 'center',
            width: 100,
            editable: true,
            search: false,
            editrules: {
                integer: true
            },
            editoptions: {
                dataInit: function (element) {
                    $(element).mask('0000');
                }
            }
        },
        {
            label: 'Observación',
            name: 'observacion',
            align: 'center',
            width: 300,
            editable: true,
            edittype: 'textarea',
            search: false
        },
        {
            label: 'Usuario',
            name: 'usuario',
            width: 200,
            editable: true,
            search: true
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
            search: false,
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
            },
            beforeSubmit: function (postdata, formid) {
                if (!(postdata.nombre)) {
                    return [false, 'Debe seleccionar a un Nombre', ''];
                } else if (!(postdata.ubicacion)) {
                    return [false, 'Debe ingresar la Ubicación', ''];
                } else if ((!postdata.codigoInterno)) {
                    return [false, 'Debe ingresar su código interno', ''];
                } else if (postdata.cui.trim().length == 0) {
                    return [false, 'Debe ingresar un CUI', ''];
                } else if (!(postdata.usuario)) {
                    return [false, 'Debe seleccionar a un Usuario', ''];
                } else if ((!postdata.nombreProd)) {
                    return [false, 'Debe ingresar un Producto', ''];
                } else {
                    return [true, ', '];
                }
            }
        }, {
            addCaption: "Agrega Ubicación",
            closeAfterAdd: false,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return [true, 'Error: ' + data.responseText, ""];
            },
            beforeSubmit: function (postdata, formid) {
                if (!(postdata.nombre)) {
                    return [false, 'Debe agregar a un Nombre', ''];
                } else if (!(postdata.ubicacion)) {
                    return [false, 'Debe ingresar la Ubicación', ''];
                } else if ((!postdata.codigoInterno)) {
                    return [false, 'Debe ingresar su código interno', ''];
                } else if (postdata.cui.trim().length == 0) {
                    return [false, 'Debe ingresar un CUI', ''];
                } else if (!(postdata.usuario)) {
                    return [false, 'Debe agregar a un Usuario', ''];
                } else if ((!postdata.nombreProd)) {
                    return [false, 'Debe ingresar un Producto', ''];
                } else {
                    return [true, ', '];
                }
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
                    $('input#nombreProd').val('');
                    $("input#nombreProd").val($('option:input', this).text());
                    return [false, 'Agregue otro producto o simplemente cierre la ventana.', ""];
                }
            }
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
            $('#grid').jqGrid('excelExport', {
                "url": url
            });
        }
    });
    $("#pager_left").css("width", "");
});