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
                align: 'center',
                width: 100,
                editable: true,
                editoptions: {
                    fullRow: true,
                    readonly: 'readonly'
                },
                editrules: {
                    required: false,
                    edithidden: false
                },
                search: false
            },
            {
                label: 'Número de Licencias',
                name: 'numero',
                align: 'center',
                width: 100,
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
                label: 'SAP',
                name: 'sap',
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
                    required: true
                },
                search: false
            }, {
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
            }, {
                label: 'Comentario de Solicitud',
                name: 'comentario',
                width: 400,
                hidden: false,
                editable: true,
                edittype: 'textarea',
                editoptions: {
                    fullRow: true,
                    readonly: 'readonly'
                },
                editrules: {
                    required: false,
                    edithidden: false
                },
                search: false
            }, {
                label: 'Comentario de Aprobación',
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
            }, {
                label: 'Estado de Autorización',
                name: 'estado',
                width: 90,
                align: 'center',
                editable: true,
                edittype: "custom",
                editoptions: {
                    custom_value: sipLibrary.getRadioElementValue,
                    custom_element: sipLibrary.radioElemReserva,
                    defaultValue: "Aprobar"
                    // fullRow: true
                },
                formatter: function (cellvalue, options, rowObject) {
                    var dato = '';
                    var val = rowObject.estado;
                    if (val == 1) {
                        dato = 'Aprobar';

                    } else if (val == 0) {
                        dato = 'Rechazar';
                    }
                    return dato;
                },
                editrules: {
                    required: true
                },
                search: false
            }
        ];
        var grid = new zs.SimpleGrid('gridMaster', 'pagerMaster', 'Aprobación de Reserva', 'Editar Aprobación', 'Agregar Aprobación', '/lic/reserva', viewModel, 'id', '/lic/getsession', ['Administrador LIC']);
        grid.build();
    });

})(jQuery, _);