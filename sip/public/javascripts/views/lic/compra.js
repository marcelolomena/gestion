var compraGrid = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'compra';
        var tableName = tabName + '_t_' + parentRowKey;
        var table = targ + '_t_' + parentRowKey;
        var $table = $(table);

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
                width: 80,
                align: 'center',
                sortable:false,
                editable: true,
                search: false
            }, {
                label: 'O.C.',
                name: 'ordenCompra',
                width: 80,
                align: 'center',
                sortable:false,
                editable: true,
                search: false
            }, {
                label: 'CUI',
                name: 'idCui',
                width: 80,
                align: 'center',
                sortable:false,
                editable: true,
                jsonmap: 'estructuracuibch.cui',
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
                sortable:false,
                editable: true,
                search: false
            }, {
                label: 'Proveedor',
                name: 'idProveedor',
                jsonmap: 'proveedor.nombre',
                width: 200,
                align: 'center',
                sortable:false,
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
                label: 'Año-Mes de Compra',
                name: 'fechaCompra',
                width: 200,
                align: 'center',
                sortable:false,
                editable: true,
                search:false
            }, {
                label: 'Año-Mes de Expiración',
                name: 'fechaExpiracion',
                width: 200,
                align: 'center',
                sortable:false,
                editable: true,
                search: false
            }, {
                label: 'N° Lic. Compradas',
                name: 'licCompradas',
                width: 125,
                align: 'center',
                sortable:false,
                editable: true,
                search: false
            }, {
                label: 'Moneda',
                name: 'idMoneda',
                jsonmap: 'moneda.moneda',
                width: 70,
                align: 'center',
                sortable:false,
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
                label: 'Valor Licencias',
                name: 'valorLicencias',
                width: 110,
                align: 'center',
                sortable:false,
                editable: true,
                search: false
            }, {
                label: 'Valor Soportes',
                name: 'valorSoporte',
                width: 110,
                align: 'center',
                sortable:false,
                editable: true,
                search: false,
            }, {
                label: 'Fecha Renovación Soporte',
                name: 'fechaRenovacionSoporte',
                width: 125,
                align: 'center',
                sortable:false,
                editable: true,
                edittype: 'date',
                search: false
            }, {
                label: 'Factura',
                name: 'factura',
                width: 80,
                align: 'center',
                sortable:false,
                editable: true,
                search: false
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