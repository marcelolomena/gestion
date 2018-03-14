(function ($, _) {
    'use strict';
    var zs = window.zs;
    $(function(){
        var $table = $('#gridMaster');
        var viewModel = [{
            label: 'ID',
            name: 'id',
            key: true,
            hidden: true,
            editable: false
        }, {
            label: 'Nombre',
            name: 'nombre',
            width: 200,
            align: 'center',
            editable: true,
            editrules: {
                required: true
            },
            search: true
        }];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Fabricantes', 'Editar Fabricante', 'Agregar Fabricante', '/lic/fabricante', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);
        grid.config.rowNum = 20;
        grid.config.sortorder= 'asc';
        grid.build();
    });

})(jQuery, _);