function renderGrid(loadurl, tableId) {
    var $table = $('#' + tableId);

    var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: true
        },
        {
            label: 'Producto',
            name: 'idProducto',
            jsonmap: 'nombre',
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
        }

    ];
    var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle Recepcionado', 'Editar Recepcionado', 'Agregar Recepcionado', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
    grid.navParameters.add = false;
    grid.navParameters.edit = false;
    grid.navParameters.del = false;
    grid.build();
}

var recepcionadoGrid = {
    renderGrid: renderGrid
};