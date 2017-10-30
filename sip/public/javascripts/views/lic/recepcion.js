(function ($, _) {
    'use strict';
    var zs = window.zs;
    var grid;

    function showChildGrid(divid, rowid) {
        var url = '/lic/detalleRecepcion/' + rowid;
        var gridID = divid + '_t';
        var pagerID = 'p_' + gridID;
        $('#' + divid).append('<table id=' + gridID + '></table><div id=' + pagerID + ' class=scroll></div>');
        var rowData = grid.getRowData(rowid);
        var detail = detalleRecepcionGrid.renderGrid(url, gridID, rowData.idCompraTramite || 0);
        detail.parentRowData = rowData
    }
    function beforeSubmit(postdata, formid) {
        if (!postdata.sap && !postdata.idCui) {
            return [false, 'Debe ingresar SAP o CUI'];
        }
        if (!postdata.numContrato && !postdata.ordenCompra) {
            return [false, 'Debe ingresar Contrato u O.C.'];
        }
        return [true, '', ''];
    }

    function initGrid(viewModel) {
        grid = new zs.StackGrid('gridMaster', 'pagerMaster', 'Recepción de licencias', 'Editar Recepción', 'Recepcionar Licencias', '/lic/recepcion', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC'], showChildGrid);
        grid.prmAdd.beforeSubmit = beforeSubmit;
        grid.prmEdit.beforeSubmit = beforeSubmit;
        grid.build();
    };

    $(function () {
        var compraData = [];
        var $table = $('#gridMaster');
        var viewModel = [
            {
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false
            }, {
                label: 'Compra en trámite',
                name: 'idCompraTramite',
                hidden: true,
                editable: true,
                edittype: 'select',
                editoptions: {
                    fullRow: true,
                    dataUrl: '/lic/comprasentramite',
                    buildSelect: function (response) {
                        var data = JSON.parse(response).rows;
                        compraData = data;
                        return new zs.SelectTemplate(data, 'Seleccione Compra en trámite', null).template;
                    },
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var rowKey = $table.getGridParam('selrow');
                            var rowData = $table.getRowData(rowKey);
                            var thissid = $(this).val();

                            var fila = _.find(compraData, function (item) {
                                return item.id === parseInt(thissid);
                            });

                            $('input#nombre').val(fila.nombre);
                            var saps = $('input#sap');
                            saps.val(fila.sap);
                            saps.change();
                            var cuis = $('input#idCui');
                            cuis.val(fila.idCui);
                            cuis.change();
                            $('input#numContrato').val(fila.numContrato);
                            $('input#ordenCompra').val(fila.ordenCompra);
                            $('select#idProveedor').val(fila.idProveedor);
                            $('input#comprador').val(fila.comprador);
                            $('textarea#comentario').val(fila.comentario);
                        }
                    }]
                },
                editrules: {
                    required: false
                }
            }, {
                label: 'Descripción',
                name: 'nombre',
                width: 250,
                align: 'center',
                hidden: false,
                editable: true,
                editrules: {
                    required: true
                },
                editoptions: {
                    fullRow: true
                },
                search: true
            }, {
                label: 'SAP',
                name: 'sap',
                width: 80,
                align: 'center',
                sortable: true,
                editable: true,
                editrules: {
                    required: false
                },
                editoptions: {
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var rowKey = $table.getGridParam('selrow');
                            var rowData = $table.getRowData(rowKey);
                            var thissid = $(this).val();
                            $.ajax({
                                type: 'GET',
                                url: '/lic/existeSap/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data && data.error === 0) {
                                        $('input#nombreSap').val(data.nombre);
                                    } else {
                                        alert('No existe ese sap');
                                        $('input#nombreSap').val('');
                                    }
                                }
                            });
                        }
                    }]
                },
                search: true
            }, {
                label: 'Nombre Proyecto',
                name: 'nombreSap',
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
                label: 'CUI',
                name: 'idCui',
                width: 80,
                align: 'center',
                hidden: false,
                editable: true,
                editoptions: {
                    dataEvents: [{
                        type: 'change', fn: function (e) {
                            var rowKey = $table.getGridParam('selrow');
                            var rowData = $table.getRowData(rowKey);
                            var thissid = $(this).val();
                            $.ajax({
                                type: 'GET',
                                url: '/getNombreCui/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data && data.error === 0) {
                                        $('input#nombreCui').val(data.nombre);
                                    } else {
                                        alert('No existe ese CUI');
                                        $('input#nombreCui').val('');
                                    }
                                }
                            });
                        }
                    }],
                },
                search: true
            }, {
                label: 'Unidad CUI',
                name: 'nombreCui',
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
                label: '# Contrato',
                name: 'numContrato',
                width: 80,
                align: 'center',
                hidden: false,
                editable: true,
                editrules: {
                    required: false
                },
                search: true
            }, {
                label: 'O.C.',
                name: 'ordenCompra',
                width: 80,
                align: 'center',
                hidden: false,
                editable: true,
                search: true
            }, {
                label: 'Proveedor',
                name: 'idProveedor',
                jsonmap: 'proveedor.nombre',
                width: 500,
                align: 'center',
                sortable: true,
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
                search: true,
                stype: 'select',
                searchoptions: {
                    dataUrl: '/lic/proveedor',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.fabricante;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            }, {
                label: 'Comprador',
                name: 'comprador',
                width: 150,
                align: 'center',
                hidden: false,
                editable: true,
                editrules: {
                    required: false
                },
                search: true
            }, {
                label: 'Comentario',
                name: 'comentario',
                hidden: true,
                editable: true,
                edittype: 'textarea',
                editrules: {
                    required: false
                },
                editoptions: {
                    fullRow: true,

                },
                search: true
            }
        ];
        initGrid(viewModel);
    });

})(jQuery, _);