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

    var tabGrid = new zs.SimpleGrid('gridMaster', 'pagerMaster' , 'Compras', 'Editar Compra', 'Agregar compra', '/lic/planilla' , viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
    tabGrid.build();
});


})(jQuery, _);