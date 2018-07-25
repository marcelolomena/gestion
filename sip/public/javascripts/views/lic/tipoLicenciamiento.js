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
            width: 400,
            align: 'center',
            editable: true,
            sortable: false,
            editrules: {
                required: true
            },
            search: false
        }];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Tipo de Licenciamiento', 'Editar Tipo de Licenciamiento', 'Agregar Tipo de Licenciamiento', '/lic/tipoLicenciamiento', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);
        grid.config.rowNum = 20;
        grid.config.sortorder = 'asc';
        grid.build();
    });

})(jQuery, _);