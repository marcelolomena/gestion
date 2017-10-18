var detalleRecepcionGrid = {
    renderGrid: function (loadurl, tableId, idCompraTramite) {
        var $table = $('#' + tableId);
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
                    dataUrl: '/lic/detallecomprasentramite/'+ idCompraTramite,
                    buildSelect: function (response) {
                        var data = JSON.parse(response).rows;
                        compraData = data;
                        return new zs.SelectTemplate(data, 'Seleccione detalle Compra en trámite', null).template;
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var rowKey = $table.getGridParam('selrow');
                            var rowData = $table.getRowData(rowKey);
                            var thissid = $(this).val();

                            var fila = _.find(compraData, function (item) {
                                return item.id === parseInt(thissid);
                            });

                            // $('input#nombre').val(fila.nombre);
                            // var saps = $('input#sap');
                            // saps.val(fila.sap);
                            // saps.change();
                            // var cuis = $('input#idCui');
                            // cuis.val(fila.idCui);
                            // cuis.change();
                            // $('input#numContrato').val(fila.numContrato);
                            // $('select#ordenCompra').val(fila.ordenCompra);
                            // var $idProveedor = $('select#idProveedor');
                            // $('input#idProveedor').val(fila.idProveedor);
                            // $('input#comprador').val(fila.comprador);
                            // $('textarea#comentario').val(fila.comentario);
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
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/fabricantes',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.fabricante;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Fabricante', thissid).template;
                    }
                },
                editrules: {
                    required: true
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
                    fullRow: true
                }
            }, {
                label: 'Producto',
                name: 'idProducto',
                jsonmap: 'producto.nombre',
                width: 250,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/producto',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.nombre;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione el Producto', thissid).template;
                    }
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
                    fullRow: true
                }
            }, {
                label: 'Fecha Inicio',
                name: 'fechaInicio',
                width: 100,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
                    'data-provide':'datepicker',
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
                sortable: false,
                editable: true,
                editoptions: {
                    'data-provide':'datepicker',
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
                sortable: false,
                editable: true,
                editoptions: {
                    'data-provide':'datepicker',
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
                sortable: false,
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