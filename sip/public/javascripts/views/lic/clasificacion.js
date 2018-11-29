(function ($, _) {
    'use strict';
    var zs = window.zs;
    $(function () {
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
            width: 1803,
            align: 'center',
            editable: true,
            sortable: false,
            editrules: {
                required: true
            },
            search: false
        }];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Clasificación', 'Editar Clasificación', 'Agregar Clasificación', '/lic/clasificacion', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);
        grid.config.rowNum = 20;
        grid.config.sortorder = 'asc';
        grid.build();
    });

})(jQuery, _);