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
                    fullRow: true,
                    dataUrl: '/lic/producto',
                    buildSelect: function (response) {
                        var rowData = $table.getRowData($table.getGridParam('selrow'));
                        var thissid = rowData.nombre;
                        var data = JSON.parse(response);
                        return new zs.SelectTemplate(data, 'Seleccione el Producto', thissid).template;
                    },
                },
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'Número de Licencias',
                name: 'numero',
                align: 'center',
                width: 100,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'Fecha de Uso',
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
                label: 'CUI',
                name: 'cui',
                align: 'center',
                width: 100,
                editable: true,
                editrules: {
                    required: true
                },
                search: false
            },
            {
                label: 'SAP',
                name: 'sap',
                align: 'center',
                width: 100,
                editable: true,
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
                editrules: {
                    required: true
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


        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Solicitud de Reserva', 'Editar Solicitud', 'Agregar Solicitud', '/lic/reserva', viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    });

})(jQuery, _);