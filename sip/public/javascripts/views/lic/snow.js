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
            label: 'Aplicación',
            name: 'aplicacion',
            editable: false,
            search: true,
            width: 225
        }, {
            label: 'Fabricante',
            name: 'fabricante',
            editable: false,
            search: true,
            width: 225
        }, {
            label: 'Categoria',
            name: 'categoria',
            editable: false,
            search: true,
            width: 225
        }, {
            label: 'Instalaciones',
            name: 'instalaciones',
            editable: false,
            align: 'center',
            width: 225,
            search: false
        }, {
            label: 'Usuarios',
            name: 'usuarios',
            editable: false,
            align: 'center',
            width: 225,
            search: false
        }, {
            label: 'Formulario de Licencia',
            name: 'formulariolicencia',
            editable: false,
            width: 225,
            search: true
        }, {
            label: 'Licencia Requerida',
            name: 'licencia',
            editable: false,
            align: 'center',
            width: 225,
            search: true
        }, {
            label: 'Paquete',
            name: 'paquete',
            editable: false,
            width: 225,
            align: 'center',
            search: true
        }];

        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Snow', 'Editar Traducción', 'Agregar Traducción', '/lic/snow/list', viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.navParameters.edit = false;
        grid.navParameters.add = false;
        grid.navParameters.del = false;
        grid.navParameters.view = false;
        grid.config.sortorder = 'asc';

        grid.build();
    });

})(jQuery, _);