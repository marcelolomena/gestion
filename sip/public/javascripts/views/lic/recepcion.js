(function ($, _) {
    'use strict';
    var zs = window.zs;

    function showChildGrid(divid, rowid) {
        var url = '/lic/detalleRecepcion/' + rowid;
        var gridID = divid + '_t';
        var pagerID = 'p_' + gridID;
        $('#' + divid).append('<table id=' + gridID + '></table><div id=' + pagerID + ' class=scroll></div>');
        detalleRecepcionGrid.renderGrid(url, gridID);
    }

    var initGrid = function (viewModel) {
        var grid = new zs.StackGrid('gridMaster', 'pagerMaster', 'Recepción de licencias', 'Editar Recepción', 'Recepcionar Licencias', '/lic/recepcion', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC'], showChildGrid);
        grid.build();
    };

    $(function () {
        var $table = $('#gridMaster');
        var viewModel = [
            {
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false
            }, {
                label: 'Nombre',
                name: 'nombre',
                width: 250,
                align: 'center',
                hidden: false,
                editable: true,
                editrules: {
                    required: false
                },
                search: false
            }, {
                label: 'Proveedor',
                name: 'idProveedor',
                jsonmap: 'proveedor.nombre',
                width: 500,
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
            }, {
                label: 'SAP',
                name: 'sap',
                width: 80,
                align: 'center',
                sortable: false,
                editable: true,
                editrules: {
                    required: false
                },
                search: false
            }, {
                label: 'CUI',
                name: 'cui',
                width: 80,
                align: 'center',
                hidden: false,
                editable: true,
                editoptions: {
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var rowKey = $table.getGridParam("selrow");
                            var rowData = $table.getRowData(rowKey);
                            var thissid = $(this).val();
                            $.ajax({
                                type: "GET",
                                url: '/getNombreCui/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data) {
                                        $("input#unidadcui").val(data.nombre);
                                    } else {
                                        alert("No existe ese CUI");
                                        $("input#unidadcui").val("0");
                                    }
                                }
                            });
                        }
                    }],
                },
                search: false
            }, {
                label: 'Unidad CUI',
                name: 'unidadcui',
                width: 80,
                align: 'center',
                hidden: true,
                editable: true,
                editoptions: {
                    readonly: 'readonly'
                },
                editrules: {
                    required: false,
                    edithidden: false
                },
                search: false
            }, {
                label: 'Número Contrato',
                name: 'numContrato',
                width: 80,
                align: 'center',
                hidden: false,
                editable: true,
                editrules: {
                    required: false
                },
                search: false
            }, {
                label: 'O.C.',
                name: 'ordenCompra',
                width: 80,
                align: 'center',
                hidden: false,
                editable: true,
                search: false
            }
        ];
        initGrid(viewModel);
    });

})(jQuery, _);