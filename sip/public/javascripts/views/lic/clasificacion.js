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
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Clasificación', 'Editar Clasificación', 'Agregar Clasificación', '/lic/clasificacion', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    });

})(jQuery, _);