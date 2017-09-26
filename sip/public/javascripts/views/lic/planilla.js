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
                editable: true,
                width: 80, 
                align: 'center'
            }, {
                label: 'O.C.',
                name: 'ordenCompra',
                editable: true,
                width: 80, 
                align: 'center'
            }, {
                label: 'CUI',
                name: 'idCui',
                editable: true,
                width: 80, 
                align: 'center',
                jsonmap: 'estructuracui.cui',
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/cui',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.idcui;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione CUI', thissid).template;
                    }
                }
            }, {
                label: 'SAP',
                name: 'sap',
                editable: true,
                width: 80, 
                align: 'center'
            }, {
                label: 'Fabricante',
                name: 'idFabricante',
                editable: true,
                width: 180, 
                align: 'center',
                jsonmap: 'fabricante.nombre',
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/fabricante',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.fabricante;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Fabricante', thissid).template;
                    }
                }
            }, {
                label: 'Proveedor',
                name: 'idProveedor',
                editable: true,
                width: 300, 
                align: 'center',
                jsonmap: 'proveedor.nombre',
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/proveedor',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.proveedor;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Proveedor', thissid).template;
                    }
                }
            }, {
                label: 'Software',
                name: 'nombre',
                editable: true,
                width: 200, 
                align: 'center'
            }, {
                label: '¿Donde está instalada?',
                name: 'idTipoInstalacion',
                editable: true,
                width: 160, 
                align: 'center',
                jsonmap: 'tipoInstalacion.nombre',
                edittype: 'select',
                editoptions: {
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
                editable: true,
                width: 150, 
                align: 'center',
                jsonmap: 'clasificacion.nombre',
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/clasificacion',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.clasificacion;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Clasificación', thissid).template;
                    }
                }
            }, {
                label: 'Tipo de Licenciamiento',
                name: 'idTipoLicenciamiento',
                editable: true,
                width: 170, 
                align: 'center',
                jsonmap: 'tipoLicenciamiento.nombre',
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/tipoLicenciamiento',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.tipoLicenciamiento;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Tipo de Licencia', thissid).template;
                    }
                }
            }, {
                label: 'Mes/Año Compra',
                name: 'fechaCompra',
                editable: true,
                width: 200, 
                align: 'center'
            }, {
                label: 'Mes/Año Expiración',
                name: 'fechaExpiracion',
                editable: true
            }, {
                label: 'N° Lic Compradas',
                name: 'licCompradas',
                editable: true,
                width: 125, 
                align: 'center'
            }, {
                label: 'Moneda',
                name: 'idMoneda',
                editable: true,
                width: 70, 
                align: 'center',
                jsonmap: 'moneda.nombre',
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/moneda',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.moneda;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione Moneda', thissid).template;
                    }
                }
            }, {
                label: 'Valor Licencias',
                name: 'valorLicencias',
                editable: true,
                width: 110, 
                align: 'center'
            }, {
                label: 'Valor Soportes',
                name: 'valorSoporte',
                editable: true,
                width: 110, 
                align: 'center'
            }, {
                label: 'Fecha Renovación Soporte',
                name: 'fechaRenovacionSoporte',
                editable: true,
                edittype: 'date',
                width: 125, 
                align: 'center'
            }, {
                label: 'Factura',
                name: 'factura',
                editable: true,
                width: 80, 
                align: 'center'
            }, {
                label: 'N° Lic. Compradas',
                name: 'licStock',
                search: false,
                formatter: 'integer',
                editable: false,
                width: 125, 
                align: 'center'
            }, {
                label: 'N° Lic. Instaladas',
                name: 'licOcupadas',
                search: false,
                formatter: 'integer',
                editable: false,
                width: 125, 
                align: 'center'
            }, {
                label: 'Alerta de Renovación',
                name: 'alertaRenovacion',
                editable: false,
                width: 140, 
                align: 'center'
            }, {
                label: 'Utilidad',
                name: 'utilidad',
                hidden: true,
                editable: true,
                edittype: 'textarea'
            }, {
                label: 'Comentaios',
                name: 'comentarios',
                hidden: true,
                editable: true,
                edittype: 'textarea'
            },
        ];

        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Compras', 'Editar Compra', 'Agregar compra', '/lic/planilla', viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.build();
        grid.addExportButton('Excel','glyphicon glyphicon-download-alt','/lic/exportplanilla' );
        
    });


})(jQuery, _);