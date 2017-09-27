(function ($, _) {
    'use strict';
    var zs = window.zs;

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
                label: 'Id Producto',
                name: 'idProducto',
                hidden: true,
                editable: false
            }, {
                label: 'Contrato',
                name: 'contrato',
                width: 80,
                align: 'center',
                editable: true,
                search: false
            }, {
                label: 'O.C.',
                name: 'ordenCompra',
                width: 80,
                align: 'center',
                editable: true,
                search: false
            }, {
                label: 'CUI',
                name: 'idCui',
                width: 80,
                align: 'center',
                jsonmap: 'estructuracui.nombre',
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/cui',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.idCui;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione CUI', thissid).template;
                    }
                },
                search: false
            }, {
                label: 'SAP',
                name: 'sap',
                width: 80,
                align: 'center',
                editable: true,
                search: false
            }, {
                label: 'Fabricante',
                name: 'idFabricante',
                jsonmap: 'fabricante.nombre',
                width: 180,
                align: 'center',
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/fabricante',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.fabricante;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Fabricante', thissid).template;
                    }
                },
                search:true,
                stype: 'select',
                searchoptions: {
                    dataUrl: '/lic/fabricante',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.fabricante;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            }, {
                label: 'Proveedor',
                name: 'idProveedor',
                jsonmap: 'proveedor.nombre',
                width: 300,
                align: 'center',
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
                search:false
            }, {
                label: 'Software',
                name: 'nombre',
                width: 200,
                align: 'center',
                editable: true,
                search:true
            }, {
                label: '¿Donde está instalada?',
                name: 'idTipoInstalacion',
                jsonmap: 'tipoInstalacion.nombre',
                width: 160,
                align: 'center',
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/tipoInstalacion',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoInstalacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                },
                search:true,
                stype: 'select',
                searchoptions: {
                    dataUrl: '/lic/tipoInstalacion',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoInstalacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            }, {
                label: 'Clasificación',
                name: 'idClasificacion',
                jsonmap: 'clasificacion.nombre',
                width: 150,
                align: 'center',
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/clasificacion',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.clasificacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Clasificación', thissid).template;
                    }
                },
                search:true,
                stype: 'select',
                searchoptions: {
                    dataUrl: '/lic/clasificacion',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.clasificacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            }, {
                label: 'Tipo de Licenciamiento',
                name: 'idTipoLicenciamiento',
                jsonmap: 'tipoLicenciamiento.nombre',
                width: 170,
                align: 'center',
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/tipoLicenciamiento',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoLicenciamiento;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Tipo de Licencia', thissid).template;
                    }
                },
                search:true,
                stype: 'select',
                searchoptions: {
                    dataUrl: '/lic/tipoLicenciamiento',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoLicenciamiento;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione', thissid).template;
                    }
                }
            }, {
                label: 'Mes/Año Compra',
                name: 'fechaCompra',
                width: 200,
                align: 'center',
                editable: true,
                search:false
            }, {
                label: 'Mes/Año Expiración',
                name: 'fechaExpiracion',
                editable: true,
                search:false
            }, {
                label: 'N° Lic Compradas',
                name: 'licCompradas',
                width: 125,
                align: 'center',
                editable: true,
                search: false
            }, {
                label: 'Moneda',
                name: 'idMoneda',
                jsonmap: 'moneda.nombre',
                width: 70,
                align: 'center',
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/moneda',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.moneda;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Moneda', thissid).template;
                    }
                },
                search:false
            }, {
                label: 'Valor Licencias',
                name: 'valorLicencias',
                width: 110,
                align: 'center',
                editable: true,
                search: false
            }, {
                label: 'Valor Soportes',
                name: 'valorSoporte',
                width: 110,
                align: 'center',
                editable: true,
                search: false,
            }, {
                label: 'Fecha Renovación Soporte',
                name: 'fechaRenovacionSoporte',
                width: 125,
                align: 'center',
                editable: true,
                edittype: 'date',
                search: false
            }, {
                label: 'Factura',
                name: 'factura',
                width: 80,
                align: 'center',
                editable: true,
                search: false
            }, {
                label: 'N° Lic. Compradas',
                name: 'licStock',
                formatter: 'integer',
                width: 125,
                align: 'center',
                editable: true,
                search: false
            }, {
                label: 'N° Lic. Instaladas',
                name: 'licOcupadas',
                formatter: 'integer',
                width: 125,
                align: 'center',
                editable: true,
                search: false
            },
            {
                label: 'Alerta de Renovación',
                name: 'alertaRenovacion',
                width: 140,
                align: 'center',
                editable: false,
                search: false
            },
            {
                label: 'Comprador',
                name: 'comprador',
                align: 'left',
                editable: true,
                search: false
            }, {
                label: 'Correo Comprador',
                name: 'correoComprador',
                align: 'left',
                editable: true,
                search: false
            }, {
                label: 'Utilidad',
                name: 'utilidad',
                hidden: true,
                editable: true,
                edittype: 'textarea',
                search: false
            }, {
                label: 'Comentaios',
                name: 'comentarios',
                hidden: true,
                editable: true,
                edittype: 'textarea',
                search: false
            },
        ];

        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Compras', 'Editar Compra', 'Agregar compra', '/lic/planilla', viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.build();
        grid.addExportButton('Excel', 'glyphicon glyphicon-download-alt', '/lic/exportplanilla');

    });


})(jQuery, _);