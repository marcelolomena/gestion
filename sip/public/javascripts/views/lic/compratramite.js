(function ($, _) {
    'use strict';
    var zs = window.zs;

    function showChildGrid(divid, rowid) {
        var url = '/lic/detallecompratramite/' + rowid;
        var gridID = divid + '_t';
        var pagerID = 'p_' + gridID;
        $('#' + divid).append('<table id=' + gridID + '></table><div id=' + pagerID + ' class=scroll></div>');
        detalleCompraTramiteGrid.renderGrid(url, gridID);
    }

    var initGrid = function (viewModel) {
        var grid = new zs.StackGrid('gridMaster', 'pagerMaster', 'Compra en Trámite', 'Editar Trámite', 'Agregar Trámite', '/lic/compratramite', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC'], showChildGrid);
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
            },
            {
                label: 'Nombre',
                name: 'nombre',
                hidden: false,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'CUI',
                name: 'cui',
                hidden: false,
                hidden: false,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'SAP',
                name: 'sap',
                hidden: true,
                hidden: false,
                editable: true,
                search: false
            },
            {
                label: 'Número Contrato',
                name: 'numContrato',
                hidden: false,
                editable: true,
                search: false
            },
            {
                label: 'O.C.',
                name: 'ordenCompra',
                hidden: false,
                editable: true,
                search: false
            },
            {
                label: 'Comprador',
                name: 'comprador',
                hidden: true,
                hidden: false,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'Proveedor',
                name: 'idProveedor',
                jsonmap: 'proveedor.nombre',
                width: 300,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/proveedor',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.proveedor;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Proveedor', thissid).template;
                    }
                },
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'Origen',
                name: 'origen',
                hidden: true,
                hidden: false,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            }
        ];
        initGrid(viewModel);
    });

})(jQuery, _);