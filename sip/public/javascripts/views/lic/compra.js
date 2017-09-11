var compraGrid = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'compra';
        var tableName = tabName + '_t_' + parentRowKey;
        var table = targ + '_t_' + parentRowKey;
        var $grid = $(table);

        var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'Contrato',
            name: 'contrato',
            editable: true
        }, {
            label: 'O.C.',
            name: 'OrdenCompra',
            editable: true
        }, {
            label: 'CUI',
            name: 'cui',
            editable: true
        }, {
            label: 'SAP',
            name: 'sap',
            editable: true
        }, {
            label: 'Proveedor',
            name: 'proveedor',
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/proveedor',
                buildSelect: function (response) {
                    var rowData = $grid.getRowData($grid.getGridParam('selrow'));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione Proveedor', thissid).template;
                }
            }
        }, {
            label: 'Area',
            name: 'area',
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/lic/area',
                buildSelect: function (response) {
                    var rowData = $grid.getRowData($grid.getGridParam('selrow'));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione Área', thissid).template;
                }
            }
        }, {
            label: 'Año Compra',
            name: 'anoCompra',
            editable: true
        }, {
            label: 'Año Expriación',
            name: 'anoExpiracion',
            editable: true
        }, {
            label: 'Cantidad Lic. Compradas',
            name: 'licenciasCompradas',
            editable: true
        }, {
            label: 'Moneda',
            name: 'moneda',
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/lic/moneda',
                buildSelect: function (response) {
                    var rowData = $grid.getRowData($grid.getGridParam('selrow'));
                    var thissid = rowData.fabricante;
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
        }];

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Compras', 'Editar Compra', 'Agregar compra', 'lic/' + tabName, viewModel, 'fabricante', '/lic/getsession', ['Administrador LIC']);
        tabGrid.build();
    }
};