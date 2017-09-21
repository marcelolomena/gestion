var traduccionGrid = {

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
            label: 'Nombre',
            name: 'nombre',
            editable: true
        }, {
            label: 'Tipo',
            name: 'tipo',
            editable: true,
            edittype: 'select',
            editoptions: {
                dataUrl: '/lic/traduccion',
                buildSelect: function (response) {
                    var rowData = $grid.getRowData($grid.getGridParam('selrow'));
                    var thissid = rowData.traduccion;
                    var data = JSON.parse(response);
                    return new zs.SelectTemplate(data, 'Seleccione Tipo', thissid).template;
                }
            }
        }];

        var tabGrid = new zs.SimpleGrid(tableName, 'navGrid' + tabName, 'Traducciones', 'Editar Traducción', 'Agregar Traducción', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        tabGrid.build();
    }
};