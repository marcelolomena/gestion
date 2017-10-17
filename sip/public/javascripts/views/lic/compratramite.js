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

    function beforeSubmit(postdata, formid) {
        if (!postdata.sap) {
            if (!postdata.idCui) {
                return [false, "Ingresar al menos un CUI ó SAP", ""];
            }
        } else if (!postdata.numContrato) {
            if (!postdata.ordenCompra) {
                return [false, "Ingresar al menos un Número de Contrato ó Orden de Compra", ""];
            }
        } else {
            return [true, "", ""];
        }
    };

    var initGrid = function (viewModel) {
        var grid = new zs.StackGrid('gridMaster', 'pagerMaster', 'Compra en Trámite', 'Editar Trámite', 'Agregar Trámite', '/lic/compratramite', viewModel, 'nombre', '/lic/getsession', ['Administrador LIC'], showChildGrid);
        grid.prmAdd.beforeSubmit = beforeSubmit;


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
                search: false
            },
            {
                label: 'SAP',
                name: 'sap',
                width: 80,
                align: 'center',
                sortable: false,
                editable: true,
                editrules: {
                    required: false
                },
                editoptions: {
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            var rowKey = $table.getGridParam("selrow");
                            var rowData = $table.getRowData(rowKey);
                            var thissid = $(this).val();
                            $.ajax({
                                type: "GET",
                                url: '/lic/existeSap/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data && data.error === 0) {
                                        $("input#nombreSap").val(data.nombre);
                                    } else {
                                        alert("No existe ese SAP");
                                        $("input#nombreSap").val("");
                                    }
                                }
                            });
                        }
                    }],
                    dataInit: function (element) {
                        $(element).mask("00000", {
                            placeholder: "00000"
                        });
                    }
                },
                search: false
            },
            {
                label: 'Nombre SAP',
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
            },
            {
                label: 'CUI',
                name: 'idCui',
                width: 80,
                align: 'center',
                hidden: false,
                editable: true,
                editoptions: {
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            var rowKey = $table.getGridParam("selrow");
                            var rowData = $table.getRowData(rowKey);
                            var thissid = $(this).val();
                            $.ajax({
                                type: "GET",
                                url: '/getNombreCui/' + thissid,
                                async: false,
                                success: function (data) {
                                    if (data && data.error === 0) {
                                        $("input#nombreCui").val(data.nombre);
                                    } else {
                                        alert("No existe ese CUI");
                                        $("input#nombreCui").val("");
                                    }
                                }
                            });
                        }
                    }],
                    dataInit: function (element) {
                        $(element).mask("00000", {
                            placeholder: "00000"
                        });
                    }
                },
                search: false
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
            },
            {
                label: 'Número Contrato',
                name: 'numContrato',
                width: 120,
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
            },
            {
                label: 'Comprador',
                name: 'comprador',
                width: 150,
                align: 'center',
                hidden: true,
                hidden: false,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'Estado',
                name: 'estado',
                width: 90,
                align: 'center',
                sortable: false,
                editable: false,
                search: false
            },
            {
                label: 'Fecha Recepcion',
                name: 'fechaRecepcion',
                width: 140,
                hidden: true,
                align: 'center',
                sortable: false,
                editable: false,
                search: false
            },
            {
                label: 'Comentario',
                name: 'comentario',
                width: 400,
                hidden: false,
                editable: true,
                edittype: 'textarea',
                editoptions: {
                    fullRow: true
                },
                search: false
            }
        ];
        initGrid(viewModel);
    });

})(jQuery, _);