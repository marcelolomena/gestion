var compraGrid = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'compra';
        var tableName = tabName + '_t_' + parentRowKey;
        var table = targ + '_t_' + parentRowKey;
        var $table = $(table);

        var viewModel = [{
            label: 'Id Producto',
            name: 'idProducto',
            hidden: true,
            editable: false
        }, {
            label: 'Alerta',
            name: 'alertarenovacion',
            width: 50,
            hidden: false,
            search: false,
            editable: true,
            align: 'right',
            align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                rojo = '<span><img src="../../../../images/redcircle.png" width="19px"/></span>';
                verde = '<span><img src="../../../../images/greencircle.png" width="19px"/></span>';
                amarillo = '<span><img src="../../../../images/yellowcircle.png" width="19px"/></span>';
                gris = '<span><img src="../../../../images/greycircle.png" width="19px"/></span>';
                if (rowObject.alertaRenovacion === 'aGris') {
                    return gris
                } else {
                    if (rowObject.alertaRenovacion === 'Vencida') {
                        return rojo
                    } else {
                        if (rowObject.alertaRenovacion === 'Renovar') {
                            return amarillo
                        } else {
                            if (rowObject.alertaRenovacion === 'bAl Dia') {
                                return verde
                            }

                        }
                    }
                }
            }
        }, {
            label: 'ID',
            name: 'id',
            width: 60,
            align: 'center',
            key: true,
            hidden: false,
            sortable: false,
            editable: false,
            search: false
        }, {
            label: 'Tipo',
            width: 100,
            name: 'perpetua',
            align: 'center',
            hidden: false,
            search: false
        }, {
            label: 'Contrato',
            name: 'contrato',
            width: 80,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'O.C.',
            name: 'ordenCompra',
            width: 80,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'CUI',
            name: 'idCui',
            width: 80,
            align: 'center',
            sortable: false,
            editable: true,
            // jsonmap: 'estructuracuibch.cui',
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/cui',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.idcui;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione CUI', thissid).template;
                }
            },
            search: false
        }, {
            label: 'SAP',
            name: 'sap',
            width: 80,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'Proveedor',
            name: 'idProveedor',
            jsonmap: 'proveedor.nombre',
            width: 400,
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
            search: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/lic/proveedor',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.proveedor;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione Proveedor', thissid).template;
                }
            }
        }, {
            label: 'Fecha de Compra',
            name: 'fechaCompra',
            width: 120,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'Fecha de Término',
            name: 'fechaExpiracion',
            width: 120,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'Fecha de Control',
            name: 'fechaRenovaSoporte',
            width: 120,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'N° Lic. Compradas',
            name: 'licCompradas',
            width: 125,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'Moneda',
            name: 'idMoneda',
            jsonmap: 'moneda.nombre',
            width: 70,
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
            search: false
        }, {
            label: 'Valor Compra',
            name: 'valorLicencia',
            width: 110,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'Valor Mensual Neto',
            name: 'valorAnualNeto',
            width: 135,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'Valor Soporte',
            name: 'valorSoporte',
            width: 110,
            align: 'center',
            sortable: false,
            editable: true,
            search: false,
        }, {
            label: 'Fecha Renovación Soporte',
            name: 'fechaRenovacionSoporte',
            width: 125,
            align: 'center',
            sortable: false,
            editable: true,
            edittype: 'date',
            search: false
        }, {
            label: 'Factura',
            name: 'factura',
            width: 80,
            align: 'center',
            sortable: false,
            editable: true,
            search: false
        }, {
            label: 'ID Renovado',
            name: 'idRenovado',
            width: 90,
            align: 'center',
            sortable: false,
            editable: false,
            search: false,
            formatter: function (rowObject) {
                if (rowObject == '0'|| rowObject == undefined) {
                    return idRenovado = 'NO RENOVADO';
                } else {
                    return idRenovado = rowObject;
                }
            }
        }
        ];

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Compras', 'Editar Compra', 'Agregar compra', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        tabGrid.navParameters.edit = false;
        tabGrid.navParameters.add = false;
        tabGrid.navParameters.del = false;
        tabGrid.navParameters.view = false;

        tabGrid.build();
    }
};

var recepcionGrid = {
    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'recepcion';
        var tableName = tabName + '_t_' + parentRowKey;
        var table = targ + '_t_' + parentRowKey;
        var $table = $(table);

        var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'SAP',
            name: 'sap',
            width: 80,
            align: 'center',
            sortable: true,
            editable: false
        }, {
            label: 'CUI',
            name: 'idCui',
            width: 80,
            align: 'center',
            hidden: false,
            editable: false
        }, {
            label: '# Contrato',
            name: 'numContrato',
            width: 80,
            align: 'center',
            hidden: false,
            editable: false
        }, {
            label: 'O.C.',
            name: 'ordenCompra',
            width: 80,
            align: 'center',
            hidden: false,
            editable: false
        }, {
            label: 'Proveedor',
            name: 'idProveedor',
            jsonmap: 'proveedor.nombre',
            width: 500,
            align: 'center',
            sortable: true,
            editable: false,
            search: true,
            stype: 'select',
            searchoptions: {
                dataUrl: '/lic/proveedor',
                buildSelect: function (response) {
                    var rowData = $table.getRowData($table.getGridParam('selrow'));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                }
            }
        }, {
            label: 'Comprador',
            name: 'comprador',
            width: 150,
            align: 'center',
            hidden: false,
            editable: false,
            search: true
        }, {
            label: 'Fecha Inicio',
            name: 'fechaInicio',
            width: 100,
            align: 'center',
            sortable: true,
            editable: false,
            search: false
        }, {
            label: 'Fecha Término',
            name: 'fechaTermino',
            width: 110,
            align: 'center',
            sortable: true,
            editable: false,
            search: false
        }, {
            label: 'Fecha Control',
            name: 'fechaControl',
            width: 100,
            align: 'center',
            sortable: true,
            editable: false,
            search: false
        }, {
            label: 'Cantidad',
            name: 'cantidad',
            hidden: false,
            editable: false,
            formatter: function (cellvalue, options, rowObject) {
                return rowObject.ilimitado ? 'Ilimitado' : cellvalue;
            }
        }, {
            label: 'Ilimitado',
            name: 'ilimitado',
            hidden: true,
        }, {
            label: 'Moneda',
            name: 'idMoneda',
            jsonmap: 'moneda.nombre',
            width: 100,
            align: 'center',
            sortable: true,
            editable: false,
            search: false
        }, {
            label: 'Valor Licencia',
            name: 'monto',
            width: 80,
            align: 'center',
            sortable: true,
            hidden: false,
            editable: false,
            search: false
        },
        {
            label: 'Valor Anual Neto',
            name: 'valorAnualNeto',
            width: 80,
            align: 'center',
            sortable: true,
            hidden: false,
            editable: false,
            search: false
        }, {
            label: 'N° Factura',
            name: 'factura',
            hidden: false,
            editable: false
        }
        ];

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Recepciones', 'Editar Recepción', 'Agregar Recepción', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        tabGrid.navParameters.edit = false;
        tabGrid.navParameters.add = false;
        tabGrid.navParameters.del = false;
        tabGrid.navParameters.view = false;

        tabGrid.build();
    }
};