(function ($, _) {
    'use strict';
    var zs = window.zs;
    var grid;

    function showChildGrid(divid, rowid) {
        var url = '/lic/detalleRecepcion/' + rowid;
        var gridID = divid + '_t';
        var pagerID = 'p_' + gridID;
        $('#' + divid).append('<table id=' + gridID + '></table><div id=' + pagerID + ' class=scroll></div>');
        var detail = detalleRecepcionGrid.renderGrid(url, gridID);
        detail.parentRowData = grid.getRowData(rowid);
    }

    var initGrid = function (viewModel) {
        grid = new zs.StackGrid('gridMaster', 'pagerMaster', 'Recepción de licencias', 'Editar Recepción', 'Recepcionar Licencias', '/lic/recepcion', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC'], showChildGrid);
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
            },{
                label: 'Compra en trámite',
                name: 'idCompraTramite',
                hidden: true,
                editable: true,
                edittype: 'select',
                editoptions: {
                    fullRow:true,
                    dataUrl: '/lic/proveedor',
                    buildSelect: function (response) {
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Compra en trámite', null).template;
                    }
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
                    fullRow:true
                },
                search: true
            } ,{
                label: 'SAP',
                name: 'sap',
                width: 80,
                align: 'center',
                sortable: true,
                editable: true,
                editrules: {
                    required: false
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
            } ,{
                label: 'CUI',
                name: 'idCui',
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
                                        $("input#nombreCui").val(data.nombre);
                                    } else {
                                        alert("No existe ese CUI");
                                        $("input#nombreCui").val("0");
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
            },{
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
                edittype:'textarea',
                editrules: {
                    required: false
                },
                editoptions: {
                    fullRow:true,

                },
                search: true
            } 
        ];
        initGrid(viewModel);
    });

})(jQuery, _);