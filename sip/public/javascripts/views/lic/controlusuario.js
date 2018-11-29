$(document).ready(function () {
    var tmpl = "<div id='responsive-form' class='clearfix'>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full' style='display: none;'>Producto {idproducto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-half'>Software<span style='color:red'>*</span>{nombreProd}</div>";
    tmpl += "<div class='column-half'>Contacto<span style='color:red'>*</span>{contacto}</div>";
    tmpl += "</div>";

    tmpl += "<div class='form-row'>";
    tmpl += "<div class='column-full'>Observaciones{observaciones}</div>";
    tmpl += "<div class='column-half'>Cantidad<span style='color:red'>*</span>{cantidad}</div>";
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
            label: 'Código Interno',
            name: 'codigointerno',
            align: 'center',
            width: 100,
            editable: true,
            search: false
        }, {
            label: 'Software',
            name: 'idproducto',
            width: 150,
            align: 'center',
            sortable: false,
            editable: true,
            hidden: true
        },
        {
            label: 'Software',
            name: 'nombreProd',
            jsonmap: 'producto.nombre',
            width: 150,
            align: 'left',
            sortable: false,
            editable: true,
            edittype: "text",
            search: false,
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
            label: 'Contacto',
            name: 'contacto',
            align: 'left',
            width: 180,
            editable: true,
            search: false
        },
        {
            label: 'Fecha Actualización',
            name: 'fechaactualizacion',
            width: 135,
            align: 'center',
            search: false,
            editable: false,
            hidden: false,
            formatter: 'date',
            formatoptions: {
                srcformat: 'ISO8601Long',
                newformat: 'd-m-Y'
            }
        },
        {
            label: 'Observaciones',
            name: 'observaciones',
            align: 'left',
            width: 700,
            editable: true,
            edittype: 'textarea',
            search: false
        },
        {
            label: 'Cantidad',
            name: 'cantidad',
            align: 'center',
            width: 100,
            editable: true,
            search: false,
            editrules: {
                integer: true
            }
        },
    ];

    $("#grid").jqGrid({
        url: '/lic/controlusuario',
        mtype: "GET",
        datatype: "json",
        page: 1,
        colModel: viewModel,
        rowNum: 10,
        regional: 'es',
        height: 'auto',
        sortable: "true",
        // width: '''',
        shrinkToFit: false,
        caption: 'Control de Usuario',
        pager: "#pager",
        viewrecords: true,
        rowList: [10, 20, 30, 40, 50],
        styleUI: "Bootstrap",
        editurl: '/lic/controlusuario'
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
            editCaption: "Modificar Control de Usuario",
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
                if ((!postdata.nombreProd)) {
                    return [false, 'Debe ingresar un Producto', ''];
                } else if (!(postdata.contacto)) {
                    return [false, 'Debe seleccionar a un Usuario', ''];
                } else if (postdata.cantidad.trim().length == 0) {
                    return [false, 'Debe ingresar la cantidad', ''];
                } else {
                    return [true, ', '];
                }
            }
        }, {
            addCaption: "Agrega Control de Usuario",
            closeAfterAdd: true,
            recreateForm: true,
            mtype: 'POST',
            ajaxEditOptions: sipLibrary.jsonOptions,
            serializeEditData: sipLibrary.createJSON,
            template: tmpl,
            errorTextFormat: function (data) {
                return [true, 'Error: ' + data.responseText, ""];
            },
            beforeSubmit: function (postdata, formid) {
                if ((!postdata.nombreProd)) {
                    return [false, 'Debe ingresar un Producto', ''];
                } else if (!(postdata.contacto)) {
                    return [false, 'Debe seleccionar a un Usuario', ''];
                } else if (postdata.cantidad.trim().length == 0) {
                    return [false, 'Debe ingresar la cantidad', ''];
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
            var url = '/lic/controlexcel';
            $('#grid').jqGrid('excelExport', {
                "url": url
            });
        }
    });
    $("#pager_left").css("width", "");
});