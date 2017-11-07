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
            name: 'traduccion',
            hidden: false,
            editable: false,
            search:true
        }, {
            label: 'Aplicación',
            name: 'aplicacion',
            editable: false,
            search: true,
        },{
            label: 'Fabricante',
            name: 'fabricante',
            editable: false,
            search: true,
        },{
            label: 'Categoria',
            name: 'categoria',
            editable: false,
            search: true
        },{
            label: 'Instalaciones',
            name: 'instalaciones',
            editable: false,
            search: false
        },{
            label: 'Licencia Requerida',
            name: 'licencia',
            editable: false,
            search: false
        },{
            label: 'Paquete',
            name: 'paquete',
            editable: false,
            search: false
        }];

        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Snow', 'Editar Traducción', 'Agregar Traducción', '/lic/snow/list', viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.navParameters.edit = false;
        grid.navParameters.add = false;
        grid.navParameters.del = false;
        grid.navParameters.view = false;
        grid.config.sortorder= 'asc';
        
        grid.build();
    });

})(jQuery, _);