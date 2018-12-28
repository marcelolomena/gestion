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
        if (!postdata.sap && !postdata.idCui) {
            return [false, 'Debe ingresar SAP o CUI'];
        }
        if (!postdata.numContrato && !postdata.ordenCompra) {
            return [false, 'Debe ingresar Número de Contrato u Orden de Compra'];
        }
        return [true, '', ''];
    }

    var initGrid = function (viewModel) {
        var grid = new zs.StackGrid('gridMaster', 'pagerMaster', 'Compra en Trámite', 'Editar Trámite', 'Agregar Trámite', '/lic/compratramite', viewModel, 'fechaRecepcion', '/lic/getsession', ['Administrador LIC'], showChildGrid);
        grid.prmAdd.beforeSubmit = beforeSubmit;
        grid.prmEdit.beforeSubmit = beforeSubmit;
        grid.prmAdd.onInitializeForm = function (formid, action) {
            if (action === 'add') {
                setTimeout(function () {
                    $(':radio:not(:checked)').attr("disabled", true);
                }, 500);
            }
        }
		grid.config.width= null;
        grid.config.shrinkToFit= false;
        grid.config.viewrecords= true;
		grid.config.gridComplete= function () {
            $("table.ui-jqgrid-htable").css('width','100%');      
            $("table.ui-jqgrid-btable").css('width','100%');
            $("#pagerMaster_left").css("width", "");
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
            label: 'Estado',
            name: 'estado',
            width: 100,
            align: 'center',
            editable: false,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemCompraTramite,
                defaultValue: "En Trámite",
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.estado;
                if (val == 1) {
                    dato = 'En Trámite';

                } else if (val == 0) {
                    dato = 'Recepcionado';
                }
                return dato;
            },
            search: false
        }, {
            label: 'Fecha de Trámite',
            name: 'fechaRecepcion',
            width: 100,
            align: 'center',
            sortable: false,
            editable: false,
            search: false
        }, {
            label: 'Descripción',
            name: 'nombre',
            width: 100,
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
        }, {
            label: 'SAP',
            name: 'sap',
            width: 100,
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
            },
            search: false
        }, {
            label: 'Nombre SAP',
            name: 'nombreSap',
            width: 100,
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
            width: 100,
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
            },
            search: false
        }, {
            label: 'Unidad CUI',
            name: 'nombreCui',
            width: 100,
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
            width: 100,
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
            width: 100,
            align: 'center',
            hidden: false,
            editable: true,
            search: false
        }, {
            label: 'Proveedor',
            name: 'idProveedor',
            jsonmap: 'proveedor.nombre',
            width: 100,
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
            label: 'Responsable Servicio',
            name: 'comprador',
            width: 100,
            align: 'center',
            hidden: true,
            hidden: false,
            editable: true,
            editrules: {
                required: true
            },
            search: false
        }, {
            label: 'Comentario',
            name: 'comentario',
            width: 100,
            hidden: false,
            editable: true,
            hidden: true,
            edittype: 'textarea',
            editoptions: {
                fullRow: true
            },
            search: false
        }, {
            label: 'Estado',
            name: 'estado',
            width: 100,
            align: 'center',
            editable: true,
            hidden: true,
            edittype: "custom",
            editoptions: {
                custom_value: sipLibrary.getRadioElementValue,
                custom_element: sipLibrary.radioElemCompraTramite,
                defaultValue: "En Trámite",
            },
            formatter: function (cellvalue, options, rowObject) {
                var dato = '';
                var val = rowObject.estado;
                if (val == 1) {
                    dato = 'En Trámite';

                } else if (val == 0) {
                    dato = 'Recepcionado';
                }
                return dato;
            },
            search: false
        }];
        initGrid(viewModel);
    });

})(jQuery, _);