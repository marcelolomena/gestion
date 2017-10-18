function renderGrid(loadurl, tableId) {
    var $table = $('#' + tableId);

    var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'idDetalleCompraTramite',
            name: 'idDetalleCompraTramite',
            hidden: true,
            editable: false,
            search: false
        }
    ];
    var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle Recepcionado', 'Editar Recepcionado', 'Agregar Recepcionado', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
    grid.build();
}

var recepcionadoGrid = {
    renderGrid: renderGrid
};