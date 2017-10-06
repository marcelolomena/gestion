(function ($, _) {
    'use strict';
    var zs = window.zs;

    function showChildGrid(divid, rowid) {
        var url = '';  //TODO:Definir URL
        var gridID = divid + '_t';
        var pagerID = 'p_' + gridID;
        $('#' + parentRowID).append('<table id=' + gridID + '></table><div id=' + pagerID + ' class=scroll></div>');
        detalleCompraTramiteGrid.renderGrid(gridID, url);
    }

    var initGrid = function (viewModel) {
        var grid = new zs.StackGrid('gridMaster', 'pagerMaster', 'Compra en Trámite', 'Editar Trámite', 'Agregar Trámite', '/lic/compratramite', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC']);
        grid.config.subGridRowExpanded = function (divid, rowid) {
            showChildGrid(divid, rowid);
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