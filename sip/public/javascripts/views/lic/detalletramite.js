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
            label: 'Id Tramite',
            name: 'idTramite',
            hidden: true,
            editable: true,
            zsHidden: true
        }, ];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Compras', 'Editar Compra', 'Agregar compra', '/lic/planilla', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    });

})(jQuery, _);