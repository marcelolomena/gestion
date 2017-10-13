var detalleRecepcionGrid = {
    renderGrid :function (loadurl, tableId) {
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
                    required: false
                },
                search: false
            }, {
                label: 'Proveedor',
                name: 'idProveedor',
                jsonmap: 'proveedor.nombre',
                width: 500,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/proveedor',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.proveedor;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Proveedor', thissid).template;
                    }
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
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
                editable: true,
                search: false
            }, {
                label: 'Fabricante',
                name: 'idFabricante',
                jsonmap:'fabricante.nombre',
                hidden: false,
                editable: false
            }, {
                label: 'Producto',
                name: 'idProducto',
                jsonmap:'producto.nombre',
                hidden: false,
                editable: false
            },  {
                label: 'Fecha Inicio',
                name: 'fechaInicio',
                hidden: false,
                editable: false
            }, {
                label: 'Fecha Término',
                name: 'fechaTermino',
                hidden: false,
                editable: false
            }, {
                label: 'Fecha Control',
                name: 'fechaControl',
                hidden: false,
                editable: false
            },{
                label: 'Moneda',
                name: 'idMoneda',
                jsonmap:'moneda.nombre',
                hidden: false,
                editable: false
            },  {
                label: 'Monto',
                name: 'monto',
                hidden: false,
                editable: false
            },{
                label: 'Cantidad',
                name: 'cantidad',
                hidden: false,
                editable: false
            }, {
                label: 'Comentario',
                name: 'comentario',
                hidden: true,
                editable: false
            },
            {
                label: 'N° Solicitud',
                name: 'numsolicitud',
                hidden: true,
                editable: false
            }
        ];
        var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle de Recepción', 'Editar Detalle', 'Agregar Detalle', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    }
  };