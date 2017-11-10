(function ($, _) {
    'use strict';
    var zs = window.zs;
    $(function () {
        var $table = $('#gridMaster');
        var viewModel = [{
                label: 'ID',
                name: 'id',
                key: true,
                hidden: true,
                editable: false
            },
            {
                label: 'Producto',
                name: 'idProducto',
                jsonmap: 'producto.nombre',
                width: 250,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/producto',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.nombre;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione el Producto', thissid).template;
                    },
                },
                editrules: {
                    required: false
                },
                search: false
            },
            {
                label: 'Número',
                name: 'numero',
                align: 'center',
                width: 100,
                editable: true,
                search: false
            },
            {
                label: 'Unidad CUI',
                name: 'idCui',
                jsonmap: 'cui.unidad',
                width: 200,
                align: 'center',
                sortable: false,
                editable: true,
                edittype: 'select',
                editoptions: {
                    dataUrl: '/lic/cuibchres',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.id;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione el CUI', thissid).template;
                    },
                },
                editrules: {
                    required: false
                },
                search: false
            },
            {
                label: 'Fecha Estimada',
                name: 'fechaEstimada',
                width: 110,
                align: 'center',
                sortable: false,
                editable: true,
                editoptions: {
                    'data-provide': 'datepicker',
                    dataInit: function (element) {
                        $(element).mask("00-00-0000", {
                            placeholder: "DD-MM-AAAA"
                        });
                        $(element).datepicker({
                            language: 'es',
                            weekStart: 1,
                            format: 'dd-mm-yyyy',
                            autoclose: true
                        })
                    },
                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {

                        }
                    }],
                },
                editrules: {
                    required: true
                },
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
            },
            {
                label: 'Estado',
                name: 'estado',
                align: 'center',
                width: 100,
                editable: false,
                search: false
            }
        ];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Aprobación Reserva', 'Editar Aprobación', 'Agregar Aprobación', '/lic/reservaJ', viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    });

})(jQuery, _);