var ajusteGrid = {

    renderGrid: function (loadurl, parentRowKey, targ) {
        var tabName = 'ajuste';
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
            label: 'Fecha',
            name: 'fecha',
            editable: true,
            edittype: 'date'
        }, {
            label: 'Usuario',
            name: 'usuario',
            editable: true
        }, {
            label: 'Cantidad',
            name: 'cantidad',
            editable: true
        }, {
            label: 'Observación',
            name: 'observacion',
            editable: true,
            edittype: 'textarea'
        }
        ];

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Ajustes', 'Editar Ajuste', 'Agregar Ajuste', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        tabGrid.build();
    }
};