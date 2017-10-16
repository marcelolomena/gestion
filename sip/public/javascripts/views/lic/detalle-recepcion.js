var detalleRecepcionGrid = {
    renderGrid: function (loadurl, tableId) {
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
                label: 'Nombre',
                name: 'nombre',
                width: 250,
                align: 'center',
                hidden: false,
                editable: true,
                editrules: {
                    required: true,
                    custom: true,
                    custom_func: function (value, colname) {
                        if (value.length > 250) {
                            return [false, colname + ' no debe tener mas de 250 caracteres'];
                        }
                        return [true, ''];
                    }
                },
                search: false
            }, {
                label: 'Proveedor',
                name: 'idProveedor',
                jsonmap: 'proveedor.nombre',
                width: 500,
                align: 'center',
                hidden: false,
                sortable: false,
                editable: true,
                editoptions: {
                    readonly: 'readonly'
                },
                editrules: {
                    required: true
                },
                search: false
            }, {
                label: 'SAP',
                name: 'sap',
                width: 80,
                align: 'center',
                sortable: false,
                editable: false,
                editrules: {
                    required: false
                },
                search: false
            }, {
                label: 'CUI',
                name: 'cui',
                width: 80,
                align: 'center',
                hidden: false,
                editable: false,
                editoptions: {
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var rowKey = $table.getGridParam("selrow");
                            var rowData = $table.getRowData(rowKey);
                            var thissid = $(this).val();
                            $.ajax({
                                type: "GET",
                                url: '/getNombreCui/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data) {
                                        $("input#unidadcui").val(data.nombre);
                                    } else {
                                        alert("No existe ese CUI");
                                        $("input#unidadcui").val("0");
                                    }
                                }
                            });
                        }
                    }],
                },
                search: false
            }, {
                label: 'Unidad CUI',
                name: 'unidadcui',
                width: 80,
                align: 'center',
                hidden: true,
                editable: false,
                editoptions: {
                    readonly: 'readonly'
                },
                editrules: {
                    required: false,
                    edithidden: false
                },
                search: false
            }, {
                label: 'Número Contrato',
                name: 'numContrato',
                width: 80,
                align: 'center',
                hidden: false,
                editable: false,
                editrules: {
                    required: false
                },
                search: false
            }, {
                label: 'O.C.',
                name: 'ordenCompra',
                width: 80,
                align: 'center',
                hidden: false,
                editable: false,
                search: false
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
                name: 'otro',
                width: 250,
                hidden: true,
                editable: true,
                search: false
            }, {
                label: 'Fecha Inicio',
                name: 'fechaInicio',
                width: 100,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
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
            },
            {
                label: 'Fecha Término',
                name: 'fechaTermino',
                width: 110,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
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
            },
            {
                label: 'Fecha Control',
                name: 'fechaControl',
                width: 100,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
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
            },
            {
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
            },
            {
                label: 'Monto',
                name: 'monto',
                width: 80,
                align: 'center',
                hidden: false,
                editable: true,
                search: false
            }, {
                label: 'Cantidad',
                name: 'cantidad',
                hidden: false,
                editable: true
            }, {
                label: 'Comentario',
                name: 'comentario',
                hidden: true,
                editable: true,
                edittype: 'textarea'
            },
            {
                label: 'N° Solicitud',
                name: 'numSolicitud',
                hidden: true,
                editable: true
            }
        ];
        var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle de Recepción', 'Editar Detalle', 'Agregar Detalle', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.prmAdd.beforeShowForm = function (formid) {
            var pp = formid[0];
            var $pp = $(pp);

        };
        grid.build();
        return grid;
    }
};