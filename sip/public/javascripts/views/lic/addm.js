(function ($, _) {
    'use strict';
    var zs = window.zs;
    $(function () {
        var $table = $('#gridMaster');
        var viewModel = [{
                label: 'id',
                name: 'ID',
                key: true,
                hidden: true,
                editable: false,
            },
            {
                label: 'Traducción',
                name: 'Type',
                editable: false,
                search: true,
                width: 300
            }, {
                label: 'Aplicación',
                name: 'aplicacion',
                editable: false,
                search: false,
                width: 300
            }, {
                label: 'Host',
                name: 'hostname',
                editable: false,
                search: true,
                width: 300
            }, {
                label: 'SO',
                name: 'hostOS',
                editable: false,
                search: true,
                width: 300
            }, {
                label: 'Fabricante',
                name: 'publishers',
                editable: false,
                search: true,
                width: 300
            }, {
                label: 'Vendedor',
                name: 'vendor',
                editable: false,
                search: true,
                width: 300
            }
        ];

        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'ADDM', 'Editar Traducción', 'Agregar Traducción', '/lic/addm/list', viewModel, 'publishers', '/lic/getsession', ['Administrador LIC']);
        grid.navParameters.edit = false;
        grid.navParameters.add = false;
        grid.navParameters.del = false;
        grid.navParameters.view = false;
        grid.config.sortorder = 'asc';

        grid.build();
    });

})(jQuery, _);