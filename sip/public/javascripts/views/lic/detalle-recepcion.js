'use strict';


var detalleRecepcionGrid = {
    renderGrid: function (loadurl, tableId, idCompraTramite) {

        var $table = $('#' + tableId);
        var compraData = [],
            fabricanteData = [],
            productoData = [],
            idproduc = 0
        var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'idRecepcion',
            name: 'idrecepcion',
            hidden: true,
            editable: false
        }, {
            label: 'idCompraTramite',
            name: 'idCompraTramite',
            hidden: true,
            editable: false
        }, {
            label: 'Detalle de Compra en trámite',
            name: 'numsolicitud',
            hidden: true,
            editable: true,
            edittype: 'select',
            editoptions: {
                fullRow: true,
                dataUrl: '/lic/detallecomprasentramite/' + idCompraTramite,
                buildSelect: function (response) {
                    compraData = JSON.parse(response).rows;
                    return new zs.SelectTemplate(compraData, 'Seleccione detalle Compra en trámite', null).template;
                },
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        var thissid = parseInt($(this).val());
                        var fila = _.find(compraData, function (item) {
                            return item.id === thissid;
                        });
                        if (fila) {
                            $('select#idFabricante').val(fila.idFabricante);
                            $('select#idProducto').val(fila.idProducto);
                            $('select#idClasificacion').val(fila.idClasificacion);
                            $('select#idTipoInstalacion').val(fila.idTipoInstalacion);
                            $('select#idTipoLicenciamiento').val(fila.idTipoLicenciamiento);
                            $('input#fechaInicio').val(fila.fechaInicio);
                            $('input#fechaControl').val(fila.fechaControl);
                            $('input#fechaTermino').val(fila.fechaTermino);
                            $('input#cantidad').val(fila.cantidad);
                            $('select#idMoneda').val(fila.idMoneda);
                            $('input#monto').val(fila.monto);
                            $('textarea#comentario').val(fila.comentario);
                            $('select#idCompra').val(fila.idCompra);
                            idproduc = fila.idProducto;
                        }
                        $('select#idRenovado').attr('disabled', false);
                        $.ajax({
                            type: "GET",
                            url: '/lic/prodRenovar/' + fila.idProducto,
                            async: false,
                            success: function (j) {
                                $('select#idRenovado').empty();
                                $('#idRenovado').append('<option value="0"> - Seleccione - </option>');
                                $.each(j, function (i, item) {

                                    $('#idRenovado').append('<option value="' + item.id + '">'+ 'Contrato: ' + item.contrato + ' - OrdenCompra: '+ item.ordenCompra + ' - FechaCompra: '+ item.fechaCompra + ' - Factura: '+ item.factura +'</option>');
                                });
                            },
                            error: function (e) {
                            }
                        });
                    }
                }]
            },
            editrules: {
                required: false
            }
        }, {
            label: 'Fabricante',
            name: 'idFabricante',
            jsonmap: 'fabricante.nombre',
            width: 180,
            align: 'center',
            sortable: true,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/fabricantes',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.idFabricante;
                    fabricanteData = JSON.parse(response);
                    return new zs.SelectTemplate(fabricanteData, 'Seleccione Fabricante', thissid).template;
                },
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        var thissid = parseInt($(this).val() || 0);
                        var ofa = $('input#otroFabricante');
                        var opr = $('input#otroProducto');
                        var prods = $('select#idProducto');
                        if (thissid) {
                            var porFacilitador = _.filter(productoData, function (item) {
                                return item.pId === thissid;
                            });
                            ofa.val('');
                            ofa.attr('readonly', 'readonly');
                            prods.html(new zs.SelectTemplate(porFacilitador, 'Seleccione producto', null).template);
                            opr.removeAttr('readonly');
                        } else {
                            prods.html(new zs.SelectTemplate(productoData, 'Seleccione producto', null).template);
                            ofa.removeAttr('readonly');
                            opr.removeAttr('readonly');
                        }
                    }
                }]
            },
            editrules: {
                required: false
            },
            search: false,
            stype: 'select',
            searchoptions: {
                dataUrl: '/lic/fabricantes',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.idFabricante;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                }
            }
        }, {
            label: 'Otro Fabricante',
            name: 'otroFabricante',
            width: 250,
            hidden: true,
            editable: true,
            search: false,
            editoptions: {
                fullRow: false
            }
        }, {
            label: 'Producto',
            name: 'idProducto',
            jsonmap: 'producto.nombre',
            width: 250,
            align: 'center',
            sortable: true,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/producto',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.nombre;
                    productoData = JSON.parse(response);
                    return new zs.SelectTemplate(productoData, 'Seleccione el Producto', thissid).template;
                },
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        var thissid = parseInt($(this).val() || 0);

                        var opr = $('input#otroProducto');
                        var ofa = $('input#otroFabricante');
                        var idC = $('select#idClasificacion');
                        var inst = $('select#idTipoInstalacion');
                        var li = $('select#idTipoLicenciamiento');
                        if (thissid) {
                            opr.val('');
                            opr.attr('readonly', 'readonly');
                            ofa.val('');
                            ofa.attr('readonly', 'readonly');
                            var fila = _.find(productoData, function (item) {
                                return item.id === thissid;
                            });
                            $('select#idFabricante').val(fila.pId);
                            idC.val(fila.idClasificacion);
                            if (fila.idClasificacion) {
                                idC.attr('readonly', 'readonly');
                            } else {
                                idC.removeAttr('readonly');
                            }
                            inst.val(fila.idTipoInstalacion);
                            if (fila.idTipoInstalacion) {
                                inst.attr('readonly', 'readonly');
                            } else {
                                inst.removeAttr('readonly');
                            }
                            li.val(fila.idTipoLicenciamiento);
                            if (fila.idTipoLicenciamiento) {
                                li.attr('readonly', 'readonly');
                            } else {
                                li.removeAttr('readonly')
                            }
                        } else {
                            opr.removeAttr('readonly');
                            idC.removeAttr('readonly');
                            inst.removeAttr('readonly');
                            li.removeAttr('readonly');
                        }
                    }
                }]
            },
            editrules: {
                required: false
            },
            search: false
        }, {
            label: 'Otro Producto',
            name: 'otroProducto',
            width: 250,
            hidden: true,
            editable: true,
            search: false,
            editoptions: {
                fullRow: false
            }
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
            label: 'Clasificación',
            name: 'idClasificacion',
            jsonmap: 'clasificacion.nombre',
            width: 150,
            align: 'center',
            sortable: false,
            editable: true,
            hidden: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/clasificaciones',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.clasificacion;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione Clasificación', thissid).template;
                }
            },
            search: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/lic/clasificaciones',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.clasificacion;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                }
            }
        }, {
            label: 'Tipo de Licenciamiento',
            name: 'idTipoLicenciamiento',
            jsonmap: 'tipoLicenciamiento.nombre',
            width: 170,
            align: 'center',
            sortable: false,
            editable: true,
            hidden: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/tiposLicenciamiento',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.tipoLicenciamiento;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione Tipo de Licencia', thissid).template;
                }
            },
            search: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/lic/tiposLicenciamiento',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.tipoLicenciamiento;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                }
            }
        }, {
            label: 'Fecha Inicio',
            name: 'fechaInicio',
            width: 100,
            align: 'center',
            sortable: true,
            editable: true,
            editoptions: {
                'data-provide': 'datepicker',
                size: 10,
                maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask('00-00-0000', {
                        placeholder: 'DD-MM-YYYY'
                    });
                }
            },
            editrules: {
                required: true
            },
            search: false
        }, {
            label: 'Fecha Término',
            name: 'fechaTermino',
            width: 110,
            align: 'center',
            sortable: true,
            editable: true,
            editoptions: {
                'data-provide': 'datepicker',
                size: 10,
                maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask('00-00-0000', {
                        placeholder: 'DD-MM-YYYY'
                    });
                }
            },
            editrules: {
                required: true
            },
            search: false
        }, {
            label: 'Fecha Control',
            name: 'fechaControl',
            width: 100,
            align: 'center',
            sortable: true,
            editable: true,
            editoptions: {
                'data-provide': 'datepicker',
                size: 10,
                maxlengh: 10,
                dataInit: function (element) {
                    $(element).mask('00-00-0000', {
                        placeholder: 'DD-MM-YYYY'
                    });
                }
            },
            editrules: {
                required: true
            },
            search: false
        }, {
            label: 'Cantidad',
            name: 'cantidad',
            hidden: false,
            editable: true,
            align: 'center',
            editoptions: {
                defaultValue: '0'
            },
            editrules: {
                integer: true,
                required: true
            },
        }, {
            label: 'Ilimitado',
            name: 'ilimitado',
            hidden: true,
            editable: true,
            edittype: 'checkbox',
            editoptions: {
                fullRow: true,
                value: 'true:false',
                defaultValue: false,
                dataEvents: [{
                    type: 'change',
                    fn: function (e) {
                        var cant = $('input#cantidad');
                        if (this.checked) {
                            cant.val(0);
                            cant.attr('readonly', 'readonly');
                        } else {
                            cant.val('');
                            cant.removeAttr('readonly');
                        }
                    }
                }]
            },
            editrules: {
                required: false
            }
        }, {
            label: 'Moneda',
            name: 'idMoneda',
            jsonmap: 'moneda.nombre',
            width: 100,
            align: 'center',
            sortable: true,
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/moneda',
                fullRow: false,
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.moneda;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione Moneda', thissid).template;
                }
            },
            editrules: {
                required: true
            },
            search: false
        }, {
            label: 'Valor Total Compra',
            name: 'monto',
            width: 150,
            align: 'center',
            sortable: true,
            hidden: false,
            editable: true,
            editoptions: {
                defaultValue: '0'
            },
            editrules: {
                number: true
            },
            search: false
        }, {
            label: 'Valor Licencia Anual Neto',
            name: 'valorAnualNeto',
            width: 180,
            align: 'center',
            sortable: true,
            hidden: false,
            editable: true,
            editoptions: {
                defaultValue: '0'
            },
            editrules: {
                number: true
            },
            search: false
        }, {
            label: 'Valor Soporte Anual Neto',
            name: 'montoSoporte',
            width: 180,
            align: 'center',
            sortable: true,
            hidden: false,
            editable: true,
            editoptions: {
                defaultValue: '0'
            },
            editrules: {
                number: true
            },
            search: false
        }, {
            label: 'N° Factura',
            name: 'factura',
            align: 'center',
            hidden: false,
            editable: true
        }, {
            label: 'Responsable Negociador',
            name: 'comprador',
            width: 170,
            hidden: false,
            align: 'center',
            editable: true
        }, {
            label: 'Correo Proveedor',
            name: 'mailComprador',
            hidden: false,
            width: 200,
            align: 'center',
            editable: true,
            editoptions: {
                fullRow: false
            }
        }, {
            label: 'Comentario',
            name: 'comentario',
            hidden: true,
            editable: true,
            edittype: 'textarea',
            editoptions: {
                fullRow: true
            }
        },
        {
            label: 'idCompra',
            name: 'idCompra',
            hidden: true,
            editable: false
        },
        // {
        //     label: '¿Que producto renueva?',
        //     name: 'idCompra',
        //     hidden: true,
        //     editable: true,
        //     edittype: 'select'
        // }
        //     ,
        {
            label: '¿Qué producto renueva?',
            name: 'idRenovado',
            jsonmap: 'compra.idRenovado',
            width: 170,
            align: 'center',
            sortable: false,
            editable: true,
            hidden: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/prodRenovar/' + idproduc,
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.idRenovado;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplateIdCompra(data, 'Seleccione', thissid).template;

                },
                fullRow: true
            },
            search: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/lic/prodRenovar/' + idproduc,
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.idRenovado;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplateIdCompra(data, 'Seleccione', thissid).template;
                }
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
                enctype: "multipart/form-data",
                fullRow: true
            },
            search: false
        },
        {
            label: 'Ficha Técnica',
            name: 'fichaTecnica',
            index: 'fichaTecnica',
            // id: 'elarchivo',
            hidden: false,
            width: 100,
            align: 'center',
            editable: true,
            editoptions: {
                custom_element: labelEditFunc,
                custom_value: getLabelValue
            },
            formatter: function (cellvalue, options, rowObject) {
                return returnDocLinkDoc(cellvalue, options, rowObject);
            },
            unformat: function (cellvalue, options, rowObject) {
                return returnDocLinkDoc2(cellvalue, options, rowObject);
            }
        }
        ];
        var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle de Recepción', 'Editar Detalle', 'Agregar Detalle', loadurl, viewModel, 'cantidad', '/lic/getsession', ['Administrador LIC']);

        function beforeShowFormAdd(form) {
            $("#d_fichaTecnica").empty().html('');
        }

        function beforeShowFormEdit(form) {
            var rowData = $table.getRowData($table.getGridParam('selrow'));
            var thissid = rowData.fichaTecnica;
            if (thissid != "") {
                var lol = jQuery(thissid).attr('href');
                var numero = jQuery(thissid).attr('href').split("/", 4).join("/").length;
                $('#d_fichaTecnica').html("<div class='column-full'>Archivo Actual: " + thissid + "</div>");
                $('input#fichaTecnica', form).attr('readonly', 'readonly');
            } else {
                $('#d_fichaTecnica').html("<div class='column-full'>Archivo Actual: </div>");
                $('input#fichaTecnica', form).attr('readonly', 'readonly');
            }
        }





        function beforeSubmit(postdata, formid) {
            if (!(postdata.idFabricante || postdata.otroFabricante)) {
                return [false, 'Debe seleccionar Fabricante o ingresar Otro Fabricante', ''];
            }
            if (!(postdata.idProducto || postdata.otroProducto)) {
                return [false, 'Debe seleccionar Producto o ingresar Otro Producto', ''];
            }
            //if (postdata.otroProducto) {
            if (!postdata.idClasificacion) {
                return [false, 'Debe seleccionar Clasificación'];
            }
            if (!postdata.idTipoInstalacion) {
                return [false, 'Debe seleccionar ¿Donde está instalada?'];
            }
            if (!postdata.idTipoLicenciamiento) {
                return [false, 'Debe seleccionar Tipo de Licenciamiento'];
            }
            // }
            var f1 = postdata.fechaInicio;
            var f2 = postdata.fechaTermino;
            var f3 = postdata.fechaControl;
            var f1compare = f1.substr(6) + f1.substr(3, 2) + f1.substr(0, 2);
            var f2compare = f2.substr(6) + f2.substr(3, 2) + f2.substr(0, 2);
            var f3compare = f3.substr(6) + f3.substr(3, 2) + f3.substr(0, 2);
            if (f1compare > f2compare) {
                return [false, 'La fecha de Termino debe ser mayor a la fecha de Inicio'];
            } else if (f2compare < f3compare) {
                return [false, 'La fecha de Control debe ser menor a la fecha de Termino']
            } else if (f3compare < f1compare) {
                return [false, 'La fecha de Control debe ser mayor a la fecha de Inicio']
            }

            postdata.nombre = grid.parentRowData.nombre;
            postdata.idCui = grid.parentRowData.idCui;
            postdata.sap = grid.parentRowData.sap;
            postdata.numContrato = grid.parentRowData.numContrato;
            postdata.ordenCompra = grid.parentRowData.ordenCompra;
            postdata.idProveedor = grid.parentRowData.idProveedor;

            return [true, '', ''];
        }
        grid.prmAdd.beforeSubmit = beforeSubmit;
        grid.prmEdit.beforeSubmit = beforeSubmit;
        grid.prmAdd.afterSubmit = UploadDoc;
        grid.prmEdit.afterSubmit = UploadDoc;

        grid.prmAdd.beforeShowForm = beforeShowFormAdd;
        grid.prmEdit.beforeShowForm = beforeShowFormEdit;

        grid.prmEdit.onInitializeForm = function (formid, action) {
            if (action === 'edit') {
                setTimeout(function () {
                    $('select#idFabricante').attr('readonly', 'readonly');
                    $('input#otroFabricante').attr('readonly', 'readonly');
                    $('select#idProducto').attr('readonly', 'readonly');
                    $('input#otroProducto').attr('readonly', 'readonly');
                    $('select#idClasificacion').attr('readonly', 'readonly');
                    $('select#idTipoInstalacion').attr('readonly', 'readonly');
                    $('select#idTipoLicenciamiento').attr('readonly', 'readonly');
                    $('select#idRenovado').attr('readonly', 'readonly');
                }, 500);
            }
        };
        grid.prmAdd.onInitializeForm = function (formid, action) {
            if (action === 'add') {
                setTimeout(function () {
                    // $('select#idRenovado').attr('readonly', 'readonly');
                    $('select#idRenovado').attr('disabled', true);
                }, 900);
            }
        }
        grid.build();
        return grid;

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

        function UploadDoc(response, postdata) {
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
                    url: '/lic/fichatecnica/upload',
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
                                $table.trigger('reloadGrid');
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

        function returnDocLinkDoc(cellValue, options, rowdata) {
            if (rowdata.fichaTecnica != "") {
                return "<a href='/docs/lic/fichas/" + rowdata.fichaTecnica + "' >" + rowdata.fichaTecnica + "</a>";
            } else {
                return "";
            }

        }

        function returnDocLinkDoc2(cellValue, options, rowdata) {
            if (rowdata.fichaTecnica != "") {
                return rowdata.fichaTecnica;
            } else {
                return "";
            }

        }
    }
};