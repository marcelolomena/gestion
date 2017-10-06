(function ($, _) {
    'use strict';
    function renderGrid(loadurl, tableId) {
        var $table = $('#' + tableId);
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
                label: 'CUI',
                name: 'cui',
                hidden: false,
                editable: false
            },
            {
                label: 'SAP',
                name: 'sap',
                hidden: false,
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
            }
        ];
        var grid = new zs.SimpleGrid(tableId, 'p_' + tableId, 'Detalle de Recepción', 'Editar Detalle', 'Agregar Detalle', loadurl, viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    }

    var detalleCompraTramiteGrid = {
        renderGrid: renderGrid
    };
    return detalleCompraTramiteGrid;
})(jQuery, _);