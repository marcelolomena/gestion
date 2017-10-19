'use strict';
var detalleRecepcionGrid = {
    renderGrid: function (loadurl, tableId, idCompraTramite) {

        var $table = $('#' + tableId);
        var compraData = [], fabricanteData = [], productoData = [];
        var viewModel = [
            {
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
                        type: 'change', fn: function (e) {
                            var thissid = parseInt($(this).val());
                            var fila = _.find(compraData, function (item) {
                                return item.id === thissid;
                            });
                            $('select#idFabricante').val(fila.idFabricante);
                            $('select#idProducto').val(fila.idProducto);
                            $('input#fechaInicio').val(fila.fechaInicio);
                            $('input#fechaControl').val(fila.fechaControl);
                            $('input#fechaTermino').val(fila.fechaTermino);
                            $('input#cantidad').val(fila.cantidad);
                            $('select#idMoneda').val(fila.idMoneda);
                            $('input#monto').val(fila.monto);
                            $('textarea#comentario').val(fila.comentario);
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
                    }, dataEvents: [{
                        type: 'change', fn: function (e) {
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
                        type: 'change', fn: function (e) {
                            var thissid = parseInt($(this).val() || 0);
                            var opr = $('input#otroProducto');
                            var ofa = $('input#otroFabricante');
                            var fabs = $('select#idFabricante');
                            if (thissid) {
                                var fila = _.find(productoData, function (item) {
                                    return item.id === thissid;
                                });
                                opr.val('');
                                opr.attr('readonly', 'readonly');
                                ofa.val('');
                                ofa.attr('readonly', 'readonly');
                                fabs.val(fila.pId);
                            } else {
                                opr.removeAttr('readonly');
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
                editoptions: { defaultValue: '0' },
                editrules: { integer: true, required: true },
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
                label: 'Monto',
                name: 'monto',
                width: 80,
                align: 'center',
                sortable: true,
                hidden: false,
                editable: true,
                editoptions: { defaultValue: '0' },
                editrules: { number: true },
                search: false
            }, {
                label: 'Comentario',
                name: 'comentario',
                hidden: true,
                editable: true,
                edittype: 'textarea',
                editoptions: {
                    fullRow: true
                }
            }
        ];
        var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle de Recepción', 'Editar Detalle', 'Agregar Detalle', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        function beforeSubmit(postdata, formid) {
            if (!(postdata.idFabricante || postdata.otroFabricante)) {
                return [false, 'Debe seleccionar Fabricante o ingresar Otro Fabricante', ''];
            }
            if (!(postdata.idProducto || postdata.otroProducto)) {
                return [false, 'Debe seleccionar Producto o ingresar Otro Producto', ''];
            }
            if (moment(postdata.fechaInicio).isSameOrAfter(moment(postdata.fechaControl))) {
                return[false,'Fecha de Control debe ser mayor que Fecha de Inicio']
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
        grid.build();
        return grid;
    }
};