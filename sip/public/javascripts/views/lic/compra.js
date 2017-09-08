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
            label: 'Fabricante',
            name: 'fabricante',
            editable: true,
            edittype: "select",
            editoptions: {
                dataUrl: '/lic/fabricante',
                buildSelect: function (response) {
                    var rowData = $grid.getRowData($grid.getGridParam("selrow"));
                    var thissid = rowData.fabricante;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione Fabricante', thissid).template;
                }
            }
        }];

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Compras', 'Editar Compra', 'Agregar compra', 'lic/' + tabName, viewModel, 'fabricante', '/lic/getsession', ['Administrador LIC']);
        tabGrid.build();
    }
};