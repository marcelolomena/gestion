
function renderGrid(loadurl, tableId) {
    var $table = $('#' +tableId);

    var viewModel = [
        {
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'idCompraTramite',
            name: 'idcompratramite',
            hidden: true,
            editable: false
        },
        {
            label: 'Fecha Inicio',
            name: 'fechaInicio',
            hidden: true,
            hidden: false,
            editable: false
        },
        {
            label: 'Fecha Término',
            name: 'fechaTermino',
            hidden: true,
            hidden: false,
            editable: false
        },
        {
            label: 'Fecha Control',
            name: 'fechaControl',
            hidden: true,
            hidden: false,
            editable: false
        },
        {
            label: 'Monto',
            name: 'monto',
            hidden: true,
            hidden: false,
            editable: false
        },
        {
            label: 'Moneda',
            name: 'idMoneda',
            hidden: true,
            hidden: false,
            editable: false
        },
        {
            label: 'Comentario',
            name: 'comentario',
            hidden: true,
            hidden: false,
            editable: false
        },
        {
            label: 'Nombre',
            name: 'nombre',
            hidden: true,
            hidden: false,
            editable: false
        },
        {
            label: 'Número',
            name: 'numero',
            hidden: true,
            hidden: false,
            editable: false
        }
    ];
    var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle de Compra en Trámite', 'Editar Detalle', 'Agregar Detalle', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
    grid.build();
}

var detalleCompraTramiteGrid = {
    renderGrid: renderGrid
};




