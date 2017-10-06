(function ($, _) {
    'use strict';
    var zs = window.zs;

    function showChildGrid(divid, rowid) {
        var url = 'lic/detalleRecepcion'; 
        var gridID = divid + '_t';
        var pagerID = 'p_' + gridID;
        $('#' + divid).append('<table id=' + gridID + '></table><div id=' + pagerID + ' class=scroll></div>');
        detalleRecepcioneGrid.renderGrid(url,gridID );
    }

    var initGrid = function (viewModel) {
        var grid = new zs.StackGrid('gridMaster', 'pagerMaster', 'Recepción de licencias', 'Editar Recepción', 'Recepcionar Licencias', '/lic/recepcion', viewModel, 'id', '/lic/getsession', ['Administrador LIC'], showChildGrid);
        grid.build();
    };

    $(function () {
        var viewModel = [
            {
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false
            },{
                label: 'Título',
                name: 'titulo',
                width: 80,
                align: 'center',
                sortable: false,
                editable: true,
                search: false
            },{
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
            },{
                label: 'Contrato',
                name: 'contrato',
                width: 80,
                align: 'center',
                sortable: false,
                editable: true,
                search: false
            }, {
                label: 'O.C.',
                name: 'ordenCompra',
                width: 80,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
                    dataInit: function (element) {
                        $(element).mask("00000", {
                            placeholder: "00000"
                        });
                    }
                },
                search: false
            }, {
                label: 'CUI',
                name: 'cui',
                width: 80,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
                    dataInit: function (element) {
                        $(element).mask("00000", {
                            placeholder: "00000"
                        });
                    }
                },
                search: false
            }, {
                label: 'SAP',
                name: 'sap',
                width: 80,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
                    dataInit: function (element) {
                        $(element).mask("00000", {
                            placeholder: "00000"
                        });
                    }
                },
                search: false
            },{
                label: 'Fecha Inicio',
                name: 'fechaInicio',
                width: 200,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
                    size: 10,
                    maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask('00-00-0000', {
                            placeholder: 'DD-MM-YYYY'
                        });
                    }
                },
                editrules: {
                    required: true
                },
                search: false
            }, {
                label: 'Fecha Término',
                name: 'fechaTermino',
                align: 'center',
                width: 200,
                sortable: false,
                editable: true,
                editoptions: {
                    size: 10,
                    maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask('00-00-0000', {
                            placeholder: 'DD-MM-AAAA'
                        });
                    }
                },
                search: false
            },{
                label: 'Fecha Control',
                name: 'fechaControl',
                align: 'center',
                width: 200,
                sortable: false,
                editable: true,
                editoptions: {
                    size: 10,
                    maxlengh: 10,
                    dataInit: function (element) {
                        $(element).mask('00-00-0000', {
                            placeholder: 'DD-MM-AAAA'
                        });
                    }
                },
                search: false
            }
        ];
        initGrid(viewModel);
    });

})(jQuery, _);