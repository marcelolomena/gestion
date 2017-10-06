(function ($, _) {
    'use strict';
    var zs = window.zs;

    function showChildGrid(divid, rowid) {

    }

    var initGrid = function (viewModel) {
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Compra en Trámite', 'Editar Trámite', 'Agregar Trámite', '/lic/compratramite', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);


        grid.config.subGrid = true;
        grid.config.subGridRowExpanded = function (divid, rowid) {
            showChildGrid(divid, rowid);
        };
        grid.config.subGridBeforeExpand = function (divid, rowid) {
            var expanded = $('td.sgexpanded', tableId)[0];
            if (expanded) {
                setTimeout(function () {
                    $(expanded).trigger('click');
                }, 100);
            }
        };
        grid.build();
    };


    $(function () {
        var $table = $('#gridMaster');
        var viewModel = [{
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false
            }, {
                label: 'Contrato',
                name: 'nombre',
                hidden: false,
                editable: false
            },
            {
                label: 'Proveedor',
                name: 'idProveedor',
                hidden: false,
                editable: false
            },
            {
                label: 'Número',
                name: 'numContrato',
                hidden: false,
                editable: false
            },
            {
                label: 'Comprador',
                name: 'comprador',
                hidden: true,
                hidden: false,
                editable: false
            },
            {
                label: 'Origen',
                name: 'origen',
                hidden: true,
                hidden: false,
                editable: false
            },
        ];
        initGrid(viewModel);
    });

})(jQuery, _);