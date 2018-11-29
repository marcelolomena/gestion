var tabtraduccionGrid = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'traduccion';
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
            label: 'Id Producto',
            name: 'idProducto',
            hidden: true,
            editable: false
        }, {
            label: 'Nombre',
            name: 'nombre',
            width: 1758,
            editable: true
        }
        ];
        
        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Traducciones', 'Editar Traducción', 'Agregar Traducción', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        tabGrid.navParameters.edit = false;
        tabGrid.navParameters.add = false;
        tabGrid.navParameters.del = false;
        tabGrid.navParameters.view = false;
        
        tabGrid.build();
    }
};