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
                editable: true
            }, {
                label: 'O.C.',
                name: 'ordenCompra',
                editable: true
            }, {
                label: 'CUI',
                name: 'idCui',
                editable: true,
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
                editable: true
            }, {
                label: 'Fabricante',
                name: 'idFabricante',
                editable: true,
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
                editable: true
            }, {
                label: '¿Donde está instalada?',
                name: 'idTipoInstalacion',
                editable: true,
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
                label: 'Clasificacion',
                name: 'idClasificacion',
                editable: true,
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
                editable: true
            }, {
                label: 'Mes/Año Expriación',
                name: 'fechaExpiracion',
                editable: true
            }, {
                label: 'Cantidad Lic. Compradas',
                name: 'licCompradas',
                editable: true
            }, {
                label: 'Moneda',
                name: 'idMoneda',
                editable: true,
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
                editable: true
            }, {
                label: 'Valor Soporte',
                name: 'valorSoporte',
                editable: true
            }, {
                label: 'Fecha Renovación Soporte',
                name: 'fechaRenovacionSoporte',
                editable: true,
                edittype: 'date'
            }, {
                label: 'Factura',
                name: 'factura',
                editable: true
            }, {
                label: 'Cantidad Lic. Compradas',
                name: 'licStock',
                search: false,
                formatter: 'integer',
                editable: false
            }, {
                label: 'Licencias Instaladas',
                name: 'licOcupadas',
                search: false,
                formatter: 'integer',
                editable: false
            }, {
                label: 'Alerta de Renovación',
                name: 'alertaRenovacion',
                editable: false
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
            }
        ];

        var tabGrid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Compras', 'Editar Compra', 'Agregar compra', '/lic/planilla', viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        tabGrid.build();
    });


})(jQuery, _);