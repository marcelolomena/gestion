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
            width: 300
        }, {
            label: 'Fabricante',
            name: 'fabricante',
            editable: false,
            search: true,
            width: 300
        }, {
            label: 'Categoria',
            name: 'categoria',
            editable: false,
            search: true,
            width: 100
        }, {
            label: 'Instalaciones',
            name: 'instalaciones',
            editable: false,
            align: 'center',
            width: 95,
            search: false
        }, {
            label: 'Usuarios',
            name: 'usuarios',
            editable: false,
            align: 'center',
            width: 70,
            search: false
        }, {
            label: 'Formulario de Licencia',
            name: 'formulariolicencia',
            editable: false,
            search: true
        }, {
            label: 'Licencia Requerida',
            name: 'licencia',
            editable: false,
            align: 'center',
            width: 70,
            search: true
        }, {
            label: 'Paquete',
            name: 'paquete',
            editable: false,
            width: 70,
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