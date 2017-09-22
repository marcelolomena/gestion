var compraGrid = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'compra';
        var tableName = tabName + '_t_' + parentRowKey;
        var table = targ + '_t_' + parentRowKey;
        var $grid = $(table);

        var viewModel = [
            {
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false
            }, {
                label: 'Id Producto',
                name: 'idProducto',
                hidden: true,
                editable: false
            }, {
                label: 'Contrato',
                name: 'contrato',
                editable: true
            }, {
                label: 'O.C.',
                name: 'ordenCompra',
                editable: true
            }, {
                label: 'CUI',
                name: 'idCui',
                editable: true,
                jsonmap: 'estructuracui.cui',
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/cui',
                    buildSelect: function (response) {
                        var rowData = $grid.getRowData($grid.getGridParam('selrow'));
                        var thissid = rowData.idcui;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione CUI', thissid).template;
                    }
                }
            }, {
                label: 'SAP',
                name: 'sap',
                editable: true
            }, {
                label: 'Proveedor',
                name: 'idProveedor',
                editable: true,
                jsonmap: 'proveedor.razonsocial',
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/proveedor',
                    buildSelect: function (response) {
                        var rowData = $grid.getRowData($grid.getGridParam('selrow'));
                        var thissid = rowData.proveedor;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Proveedor', thissid).template;
                    }
                }
            }, {
                label: 'Mes/Año Compra',
                name: 'fechaCompra',
                editable: true
            }, {
                label: 'Mes/Año Expriación',
                name: 'fechaExpiracion',
                editable: true
            }, {
                label: 'Cantidad Lic. Compradas',
                name: 'licCompradas',
                editable: true
            }, {
                label: 'Moneda',
                name: 'idMoneda',
                editable: true,
                jsonmap: 'moneda.moneda',
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/moneda',
                    buildSelect: function (response) {
                        var rowData = $grid.getRowData($grid.getGridParam('selrow'));
                        var thissid = rowData.moneda;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Moneda', thissid).template;
                    }
                }
            }, {
                label: 'Valor Licencias',
                name: 'valorLicencias',
                editable: true
            }, {
                label: 'Valor Soporte',
                name: 'valorSoporte',
                editable: true
            }, {
                label: 'Fecha Renovación Soporte',
                name: 'fechaRenovacionSoporte',
                editable: true,
                edittype: 'date'
            }, {
                label: 'Factura',
                name: 'factura',
                editable: true
            }
        ];

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Compras', 'Editar Compra', 'Agregar compra', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        tabGrid.navParameters.edit = false;
        tabGrid.navParameters.add = false;
        tabGrid.navParameters.del = false;
        tabGrid.navParameters.view = true;

        tabGrid.build();
    }
};