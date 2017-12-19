(function ($, _) {
    'use strict';
    var zs = window.zs;

    $(function () {
        var dataa = [];
        var $table = $('#gridMaster');
        var viewModel = [{
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false,
                search: false
            }, {
                label: 'Producto',
                name: 'idProducto',
                // jsonmap: 'producto.nombre',
                width: 250,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/misAutorizaciones',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.idProducto;
                        dataa = JSON.parse(response);
                        return new zs.SelectTemplate(dataa, 'Seleccione', thissid).template;
                    },
                },
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'Código de Autorización',
                name: 'codautorizacion',
                align: 'center',
                width: 100,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            }, {
                label: '¿Donde está instalada?',
                name: 'idTipoInstalacion',
                jsonmap: 'tipoInstalacion.nombre',
                width: 160,
                align: 'center',
                sortable: false,
                editable: true,
                hidden: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/tiposInstalacion',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoInstalacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                },
                search: true,
                stype: 'select',
                searchoptions: {
                    dataUrl: '/lic/tiposInstalacion',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoInstalacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            }, {
                name: 'nombrearchivo',
                index: 'nombrearchivo',
                hidden: false,
                width: 100,
                align: "left",
                editable: true,
                editoptions: {
                    custom_element: labelEditFunc,
                    custom_value: getLabelValue
                },
                formatter: function (cellvalue, options, rowObject) {
                    return returnDocLinkDoc(cellvalue, options, rowObject, parentRowKey);
                },
                unformat: function (cellvalue, options, rowObject) {
                    return returnDocLinkDoc2(cellvalue, options, rowObject, parentRowKey);
                }
            },
            {
                name: 'fileToUpload',
                label: 'Subir Archivo',
                hidden: true,
                editable: true,
                edittype: 'file',
                editrules: {
                    edithidden: true,
                    required: true
                },
                editoptions: {
                    enctype: "multipart/form-data"
                },
                search: false
            }
        ];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Solicitud de Instalación', 'Editar Instalación', 'Agregar Instalación', '/lic/instalacionSolicitud', viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    });


    function returnDocLinkDoc(cellValue, options, rowdata, parentRowKey) {
        if (rowdata.nombrearchivo != "") {
            return "<a href='/docs/" + parentRowKey + "/" + rowdata.nombrearchivo + "' >" + rowdata.nombrearchivo + "</a>";
        } else {
            return "";
        }

    }

    function returnDocLinkDoc2(cellValue, options, rowdata, parentRowKey) {
        if (rowdata.nombrearchivo != "") {
            return rowdata.nombrearchivo;
            //return "<a href='/docs/" + parentRowKey + "/" + rowdata.nombrearchivo + "' >"+rowdata.nombrearchivo+"</a>";
        } else {
            return "";
        }

    }

    function UploadDoc(response, postdata) {
        //console.log(postdata)
        var data = $.parseJSON(response.responseText);
        if (data.success) {
            if ($("#fileToUpload").val() != "") {
                ajaxDocUpload(data.id, data.parent);
            }
        }

        return [data.success, data.message, data.id];
    }

    function ajaxDocUpload(id, parent) {
        var dialog = bootbox.dialog({
            title: 'Se inicia la transferencia',
            message: '<p><i class="fa fa-spin fa-spinner"></i> Esto puede durar varios minutos...</p>'
        });
        dialog.init(function () {
            $.ajaxFileUpload({
                url: '/lic/imagenEquipo/upload',
                secureuri: false,
                fileElementId: 'fileToUpload',
                dataType: 'json',
                data: {
                    id: id,
                    parent: parent
                },
                success: function (data, status) {
                    if (typeof (data.success) != 'undefined') {
                        if (data.success == true) {
                            dialog.find('.bootbox-body').html(data.message);
                            $("#documentos_t_" + parent).trigger('reloadGrid');
                        } else {
                            dialog.find('.bootbox-body').html(data.message);
                        }
                    } else {
                        dialog.find('.bootbox-body').html(data.message);
                    }
                },
                error: function (data, status, e) {
                    dialog.find('.bootbox-body').html(e);
                }
            })
        });
    }

    function labelEditFunc(value, opt) {
        return "<span>" + value + "</span";
    }

    function getLabelValue(e, action, textvalue) {
        if (action == 'get') {
            console.log("esto es?")
            return e.innerHTML;
        } else {
            if (action == 'set') {
                $(e).html(textvalue);
                console.log("o no??")
            }
            console.log("o nada??")
        }
    }

})(jQuery, _);